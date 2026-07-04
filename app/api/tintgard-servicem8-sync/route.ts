import { NextRequest, NextResponse } from "next/server";

/**
 * TintGard GHL ↔ ServiceM8 two-way sync (M4).
 *
 * Runs on a schedule (Vercel Cron) — no dependency on GHL's workflow builder
 * or ServiceM8 webhooks. Both credentials stay server-side.
 *
 *  Direction 1 — GHL "Booked - Job Created" stage → create a ServiceM8 job
 *    (client + job + job-contact), then write the job UUID + status back onto
 *    the GHL contact so it isn't created twice.
 *  Direction 2 — ServiceM8 job status = Completed → move the GHL opportunity
 *    to "Job Completed", set the Job Status field, and tag review-requested.
 *
 * Env: GHL_TINTGARD_TOKEN, SERVICEM8_API_KEY, optional GHL_TINTGARD_LOCATION,
 * optional CRON_SECRET (if set, the caller must send Authorization: Bearer it).
 */

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
export const maxDuration = 60;

const GHL = "https://services.leadconnectorhq.com";
const GHLV = "2021-07-28";
const SM8 = "https://api.servicem8.com/api_1.0";
const LOCATION_ID = process.env.GHL_TINTGARD_LOCATION || "21QeKX429DL5Q6j4yeG6";

const F_JOB_UUID = "4IvPRLJSac0Jh9a9CEwY"; // ServiceM8 Job UUID (TEXT)
const F_JOB_STATUS = "gvvGribngmEYx19Lwwak"; // ServiceM8 Job Status (SINGLE_OPTIONS: Quoted/Scheduled/Completed/Invoiced)
const F_CUSTOMER_TYPE = "VQCB6DLwIirwXFM9EWN9";
const F_SUBURB = "darWwxU0RqYkhZ9TZcOl";

type Service = "Automotive" | "Commercial" | "Residential";

// ServiceM8 category per service (Car Tint for vehicles, Standard otherwise).
const SM8_CATEGORY: Record<Service, string> = {
  Automotive: "bdca1544-abe8-400d-a7b9-2312672aa88b", // Car Tint
  Commercial: "dc1944b9-3f73-41bb-951c-2309f7b0dcfb", // Standard
  Residential: "dc1944b9-3f73-41bb-951c-2309f7b0dcfb", // Standard
};

const PIPELINE_SERVICE: Record<string, Service> = {
  "Automotive Pipeline": "Automotive",
  "Commercial Pipeline": "Commercial",
  "Residential Pipeline": "Residential",
};

function ghlHeaders(token: string) {
  return { Authorization: `Bearer ${token}`, Version: GHLV, "Content-Type": "application/json", Accept: "application/json" };
}
function sm8Headers(key: string) {
  return { "X-Api-Key": key, "Content-Type": "application/json", Accept: "application/json" };
}

async function jsonOrNull(res: Response) {
  return res.json().catch(() => null);
}

// ServiceM8 create → returns the new record uuid from the x-record-uuid header.
async function sm8Create(path: string, key: string, body: unknown): Promise<string | null> {
  for (let attempt = 0; attempt < 2; attempt++) {
    const res = await fetch(`${SM8}/${path}`, { method: "POST", headers: sm8Headers(key), body: JSON.stringify(body) });
    const uuid = res.headers.get("x-record-uuid");
    if (res.ok && uuid) return uuid;
    if (attempt === 0) continue; // ServiceM8 occasionally 400s transiently — retry once
    console.error(`sm8Create ${path} failed:`, res.status, await res.text().catch(() => ""));
  }
  return null;
}

function cfMap(contact: Record<string, unknown>): Record<string, string> {
  const out: Record<string, string> = {};
  const arr = (contact.customFields || contact.customField || []) as { id: string; value?: string }[];
  for (const f of arr) if (f && f.id) out[f.id] = String(f.value ?? "");
  return out;
}

export async function GET(req: NextRequest) {
  const token = process.env.GHL_TINTGARD_TOKEN;
  const key = process.env.SERVICEM8_API_KEY;
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret) {
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${cronSecret}`) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (!token || !key) return NextResponse.json({ configured: false }, { status: 503 });

  const report = { created: [] as string[], completed: [] as string[], errors: [] as string[] };

  try {
    // Pipelines → stage lookup by name (robust to id drift).
    const pRes = await fetch(`${GHL}/opportunities/pipelines?locationId=${LOCATION_ID}`, { headers: ghlHeaders(token) });
    const pData = await jsonOrNull(pRes);
    const pipelines = (pData?.pipelines || []) as { id: string; name: string; stages: { id: string; name: string }[] }[];

    for (const pipe of pipelines) {
      const service = PIPELINE_SERVICE[pipe.name];
      if (!service) continue;
      const booked = pipe.stages.find((s) => /booked/i.test(s.name));
      const completed = pipe.stages.find((s) => /job completed/i.test(s.name));
      if (!booked) continue;

      // Opportunities currently sitting in "Booked - Job Created".
      const oRes = await fetch(
        `${GHL}/opportunities/search?location_id=${LOCATION_ID}&pipeline_id=${pipe.id}&pipeline_stage_id=${booked.id}&limit=100`,
        { headers: ghlHeaders(token) }
      );
      const oData = await jsonOrNull(oRes);
      const opps = (oData?.opportunities || []) as Record<string, unknown>[];

      for (const opp of opps) {
        const oppId = String(opp.id);
        const contactId = String((opp.contactId as string) || (opp.contact as { id?: string })?.id || "");
        if (!contactId) continue;

        const cRes = await fetch(`${GHL}/contacts/${contactId}`, { headers: ghlHeaders(token) });
        const cData = await jsonOrNull(cRes);
        const contact = (cData?.contact || {}) as Record<string, unknown>;
        const cf = cfMap(contact);
        const existingJob = cf[F_JOB_UUID];

        // ---- Direction 1: no ServiceM8 job yet → create one ----
        if (!existingJob) {
          const name = String(contact.contactName || `${contact.firstName || ""} ${contact.lastName || ""}`).trim() || "Website Lead";
          const companyUuid = await sm8Create("company.json", key, { name });
          if (!companyUuid) { report.errors.push(`company create failed for ${contactId}`); continue; }

          const suburb = cf[F_SUBURB] || "";
          const desc = `${service} tint enquiry — ${name}${suburb ? ` (${suburb})` : ""}. Synced from GoHighLevel (opp ${oppId}).`;
          const jobUuid = await sm8Create("job.json", key, {
            company_uuid: companyUuid,
            status: "Work Order",
            category_uuid: SM8_CATEGORY[service],
            job_description: desc,
            job_address: suburb ? `${suburb} QLD` : "",
            geo_country: "Australia",
            source: "GoHighLevel",
          });
          if (!jobUuid) { report.errors.push(`job create failed for ${contactId}`); continue; }

          await sm8Create("jobcontact.json", key, {
            job_uuid: jobUuid,
            first: String(contact.firstName || name),
            last: String(contact.lastName || ""),
            phone: String(contact.phone || ""),
            email: String(contact.email || ""),
            type: "JOB",
          });

          // Write the job uuid + status back onto the GHL contact.
          await fetch(`${GHL}/contacts/${contactId}`, {
            method: "PUT",
            headers: ghlHeaders(token),
            body: JSON.stringify({
              customFields: [
                { id: F_JOB_UUID, value: jobUuid },
                { id: F_JOB_STATUS, value: "Scheduled" },
              ],
            }),
          });
          await fetch(`${GHL}/contacts/${contactId}/tags`, {
            method: "POST",
            headers: ghlHeaders(token),
            body: JSON.stringify({ tags: ["servicem8-synced"] }),
          }).catch(() => {});
          report.created.push(`${service}:${jobUuid}`);
          continue;
        }

        // ---- Direction 2: has a job → if ServiceM8 says Completed, advance GHL ----
        if (existingJob && completed) {
          const jRes = await fetch(`${SM8}/job/${existingJob}.json`, { headers: sm8Headers(key) });
          const job = await jsonOrNull(jRes);
          const jobStatus = String(job?.status || "");
          if (/completed/i.test(jobStatus)) {
            await fetch(`${GHL}/opportunities/${oppId}`, {
              method: "PUT",
              headers: ghlHeaders(token),
              body: JSON.stringify({ pipelineId: pipe.id, pipelineStageId: completed.id }),
            });
            await fetch(`${GHL}/contacts/${contactId}`, {
              method: "PUT",
              headers: ghlHeaders(token),
              body: JSON.stringify({ customFields: [{ id: F_JOB_STATUS, value: "Completed" }] }),
            });
            await fetch(`${GHL}/contacts/${contactId}/tags`, {
              method: "POST",
              headers: ghlHeaders(token),
              body: JSON.stringify({ tags: ["review-requested"] }),
            }).catch(() => {});
            report.completed.push(`${service}:${existingJob}`);
          }
        }
      }
    }

    return NextResponse.json({ success: true, ...report });
  } catch (err) {
    console.error("tintgard-servicem8-sync error:", err);
    return NextResponse.json({ error: "unexpected", detail: String(err), ...report }, { status: 500 });
  }
}

// Skinlux: messages between clients, the team and Jellie.
//  - client messages from the My Skinlux app (text and an optional photo),
//    routed to the therapist who last treated that client
//  - the team board: short notes from HQ or the staff app to everyone
//  - staff documents: qualifications and certificates the team uploads
// Photos and documents are private files; only HQ and the staff app can open them.
import { putFile, readDoc, writeDoc } from "@/lib/skinlux-store";
import { newId } from "@/lib/skinlux-apps";

export type ClientMsg = { id: string; at: number; clinic: string; contactId: string; name: string; phone: string; kind: string; text: string; photo?: string; therapist: string; status: "new" | "done"; doneBy?: string };
export type TeamPost = { id: string; at: number; from: string; clinic: string; text: string };
export type StaffDoc = { id: string; at: number; member: string; title: string; path: string; type: string };

const cut = (v: unknown, n: number) => String(v ?? "").replace(/\s+/g, " ").trim().slice(0, n);

export async function loadClientMsgs(): Promise<ClientMsg[]> {
  const d = await readDoc<{ msgs: ClientMsg[] }>("clientmsgs").catch(() => null);
  return d && Array.isArray(d.msgs) ? d.msgs : [];
}
export async function addClientMsg(m: Omit<ClientMsg, "id" | "at" | "status">): Promise<ClientMsg> {
  const all = await loadClientMsgs();
  const row: ClientMsg = { ...m, id: newId(), at: Date.now(), status: "new" };
  all.unshift(row);
  await writeDoc("clientmsgs", { msgs: all.slice(0, 1500) });
  return row;
}
export async function closeClientMsg(id: string, by: string): Promise<boolean> {
  const all = await loadClientMsgs();
  const m = all.find((x) => x.id === id);
  if (!m) return false;
  m.status = "done";
  m.doneBy = cut(by, 60) || "Team";
  await writeDoc("clientmsgs", { msgs: all });
  return true;
}

export async function loadTeamBoard(): Promise<TeamPost[]> {
  const d = await readDoc<{ posts: TeamPost[] }>("teamboard").catch(() => null);
  return d && Array.isArray(d.posts) ? d.posts : [];
}
export async function addTeamPost(from: string, clinic: string, text: string): Promise<TeamPost | null> {
  const t = String(text || "").trim().slice(0, 1000);
  if (t.length < 2) return null;
  const all = await loadTeamBoard();
  const p: TeamPost = { id: newId(), at: Date.now(), from: cut(from, 60) || "Team", clinic: clinic === "leederville" || clinic === "booragoon" ? clinic : "both", text: t };
  all.unshift(p);
  await writeDoc("teamboard", { posts: all.slice(0, 300) });
  return p;
}

export async function loadStaffDocs(): Promise<StaffDoc[]> {
  const d = await readDoc<{ docs: StaffDoc[] }>("staffdocs").catch(() => null);
  return d && Array.isArray(d.docs) ? d.docs : [];
}

/** A data URL (photo or PDF) to a private file. Returns the path or "" if it isn't allowed. */
export async function saveDataUrl(folder: "clientmsg" | "staffdocs", dataUrl: string, maxBytes: number): Promise<{ path: string; type: string }> {
  const m = /^data:(image\/(?:jpeg|png)|application\/pdf);base64,([A-Za-z0-9+/=]+)$/.exec(String(dataUrl || ""));
  if (!m) return { path: "", type: "" };
  const bytes = Buffer.from(m[2], "base64");
  if (!bytes.length || bytes.length > maxBytes) return { path: "", type: "" };
  const ext = m[1] === "application/pdf" ? "pdf" : m[1] === "image/png" ? "png" : "jpg";
  const path = `${folder}/${newId()}.${ext}`;
  await putFile(path, Uint8Array.from(bytes), m[1]);
  return { path, type: m[1] };
}

export async function addStaffDoc(member: string, title: string, dataUrl: string): Promise<StaffDoc | null> {
  const f = await saveDataUrl("staffdocs", dataUrl, 3_000_000);
  if (!f.path) return null;
  const all = await loadStaffDocs();
  const d: StaffDoc = { id: newId(), at: Date.now(), member: cut(member, 60), title: cut(title, 120) || "Document", path: f.path, type: f.type };
  all.unshift(d);
  await writeDoc("staffdocs", { docs: all.slice(0, 500) });
  return d;
}

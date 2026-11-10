import { NextRequest, NextResponse } from "next/server";
import { readShare, saveSigned, readQuote, saveQuote } from "@/lib/apex-quote-store";

// The page an Apex Gates customer opens from a texted or emailed link: their
// quote or invoice, a box to sign and accept, and the ways to pay. No password;
// the long random link is the key. Everything shown is escaped here.
export const dynamic = "force-dynamic";

const esc = (s: any) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);
const money = (n: number) => (Number(n) || 0).toLocaleString("en-AU", { style: "currency", currency: "AUD", minimumFractionDigits: 2 });
const day = (t: number) => new Date(t).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric", timeZone: "Australia/Perth" });
// drawings come from the quoting tool; anything that could run code is dropped
const safeSvg = (s: any) => (typeof s === "string" && /^<svg[\s\S]*<\/svg>$/.test(s) && !/<script|<foreign|\son[a-z]+\s*=|javascript:|href\s*=/i.test(s) ? s : "");
const safeUrl = (u: any) => (typeof u === "string" && /^https:\/\/[^\s"'<>]+$/.test(u) ? u : "");

function page(token: string, d: any) {
  const quote = d.kind !== "invoice";
  const acc = d.accepted;
  const pay = d.pay || {};
  const due = quote ? d.totals.deposit : d.totals.balance;
  const paypal = safeUrl(pay.paypal) ? `${safeUrl(pay.paypal).replace(/\/$/, "")}/${(Math.round(due * 100) / 100).toFixed(2)}AUD` : "";
  const payBtns = [
    safeUrl(pay.card) && `<a class="pay card" href="${esc(safeUrl(pay.card))}" target="_blank" rel="noopener">Pay by card</a>`,
    paypal && `<a class="pay pp" href="${esc(paypal)}" target="_blank" rel="noopener">Pay with PayPal</a>`,
    safeUrl(pay.later) && `<a class="pay later" href="${esc(safeUrl(pay.later))}" target="_blank" rel="noopener">Pay over time (Afterpay or Zip)</a>`,
  ].filter(Boolean).join("");
  const canPay = (!quote || acc) && due > 0 && (payBtns || pay.how);
  return `<!doctype html><html lang="en-AU"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex, nofollow">
<title>${esc(d.company?.name || "Apex Gates")} ${quote ? "quote" : "invoice"} ${esc(d.no)}</title>
<style>
*{box-sizing:border-box}body{margin:0;background:#f4f1ea;font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:#17171a;font-size:17px;line-height:1.45}
.wrap{max-width:820px;margin:0 auto;padding:20px 16px 60px}
.sheet{background:#fff;border-radius:18px;padding:28px 24px;box-shadow:0 10px 40px -20px rgba(0,0,0,.3)}
.top{display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;border-bottom:4px solid #d61d09;padding-bottom:14px}
.brand{font-weight:900;font-size:28px;letter-spacing:.04em}.brand span{color:#d61d09}.top p{margin:4px 0 0;color:#555;font-size:14px}
.no{text-align:right;font-size:14px;color:#555}.no b{display:block;font-size:20px;color:#17171a}
h2{font-size:19px;margin:26px 0 10px}
.line{display:flex;justify-content:space-between;gap:14px;padding:12px 0;border-bottom:1px solid #eee}.line small{display:block;color:#666;font-size:14px}
.dr svg{width:100%;height:auto;max-height:260px;margin-bottom:6px}
.tot{background:#17171a;color:#fff;border-radius:14px;padding:16px 18px;display:grid;grid-template-columns:1fr auto;gap:6px 16px}.tot .g{font-size:24px;font-weight:800}
ul{margin:0;padding-left:20px}.inex{display:grid;grid-template-columns:1fr 1fr;gap:16px}.terms{color:#666;font-size:13px;margin-top:22px}
.box{background:#fff;border-radius:18px;padding:22px;margin-top:18px;border:3px solid #1d7a43}
.box h3{margin:0 0 6px;font-size:22px}
canvas{width:100%;height:170px;border:2px dashed #bbb;border-radius:12px;touch-action:none;background:#fff;display:block;margin:10px 0}
input{width:100%;font:inherit;font-size:18px;padding:12px;border:2px solid #ccc;border-radius:10px}
button,.pay{display:block;width:100%;text-align:center;font:inherit;font-weight:800;font-size:19px;padding:16px;border:0;border-radius:12px;margin-top:10px;cursor:pointer;text-decoration:none}
.go{background:#1d7a43;color:#fff}.clr{background:#eee;color:#17171a}
.card{background:#17171a;color:#fff}.pp{background:#ffc439;color:#17171a}.later{background:#b2fce4;color:#17171a}
.ok{background:#e5f3ea;color:#1d7a43;border-radius:12px;padding:14px;font-weight:700}
.how{white-space:pre-line;background:#f6f3ec;border-radius:12px;padding:14px;margin-top:10px}
@media(max-width:600px){.inex{grid-template-columns:1fr}.no{text-align:left}}
</style></head><body><div class="wrap">
<div class="sheet">
  <div class="top"><div><div class="brand">APEX<span> GATES</span></div><p>${esc(d.company?.address)} · ${esc(d.company?.phone)} · ${esc(d.company?.email)}${d.company?.abn ? ` · ABN ${esc(d.company.abn)}` : ""}</p></div>
    <div class="no"><b>${quote ? "Quote" : "Tax invoice"} ${esc(d.no)}</b>${day(d.date)}<br>${quote ? `Good until ${day(d.valid)}` : `Please pay by ${day(d.due)}`}</div></div>
  <p>For <b>${esc(d.client?.name || "you")}</b>${d.client?.address ? `, ${esc(d.client.address)}` : ""}</p>
  ${d.note ? `<p style="background:#f6f3ec;border-radius:10px;padding:12px">${esc(d.note)}</p>` : ""}
  <h2>${quote ? "What we will do" : "What we did"}</h2>
  ${(d.lines || []).map((l: any) => `${safeSvg(l.svg) ? `<div class="dr">${safeSvg(l.svg)}</div>` : ""}<div class="line"><div><b>${esc(l.name)}</b><small>${esc(l.desc)}</small></div><b>${money(l.amount)}</b></div>`).join("")}
  <h2>The price</h2>
  <div class="tot">${d.totals.discount ? `<span>Discount</span><b>${esc(d.totals.discount)}% off</b>` : ""}<span>Price before GST</span><b>${money(d.totals.exGst)}</b><span>GST</span><b>${money(d.totals.gst)}</b><span class="g">Total</span><b class="g">${money(d.totals.inc)}</b>
    ${quote && d.totals.deposit ? `<span>Deposit to get started</span><b>${money(d.totals.deposit)}</b>` : ""}${!quote && d.totals.paid ? `<span>Already paid</span><b>${money(-d.totals.paid)}</b><span class="g">To pay</span><b class="g">${money(d.totals.balance)}</b>` : ""}</div>
  ${quote && (d.inc?.length || d.exc?.length) ? `<h2>What is in, and what is not</h2><div class="inex"><ul>${(d.inc || []).map((x: any) => `<li>${esc(x)}</li>`).join("")}</ul><ul style="color:#666">${(d.exc || []).map((x: any) => `<li>Not included: ${esc(x)}</li>`).join("")}</ul></div>` : ""}
  ${d.terms ? `<p class="terms">${esc(d.terms)}</p>` : ""}
</div>
${quote ? (acc ? `<div class="box"><div class="ok">Accepted by ${esc(acc.name)} on ${day(acc.at)}. Thank you, we will be in touch to book it in.</div></div>`
  : `<form class="box" method="POST" id="f"><h3>Happy to go ahead?</h3><p style="margin:0">Sign with your finger in the box, type your name and press Accept.</p>
  <canvas id="c"></canvas><button type="button" class="clr" id="clr">Clear the box</button>
  <p style="margin:14px 0 6px">Your full name</p><input name="name" id="nm" value="${esc(d.client?.name)}" autocomplete="name">
  <input type="hidden" name="sig" id="sig"><button class="go" type="submit">Accept this quote</button></form>`) : ""}
${canPay ? `<div class="box"><h3>Pay ${money(due)}</h3>${payBtns}${pay.how ? `<div class="how">${esc(pay.how)}</div>` : ""}<p style="font-size:14px;color:#666;margin-bottom:0">Please put ${esc(d.no)} as the reference.</p></div>` : ""}
<p style="text-align:center;color:#888;font-size:14px;margin-top:20px">Questions? Call ${esc(d.company?.phone)}</p>
</div>
${quote && !acc ? `<script>
var c=document.getElementById("c"),x=c.getContext("2d"),r=window.devicePixelRatio||1,b=c.getBoundingClientRect(),down=false,ink=false,l;
c.width=b.width*r;c.height=b.height*r;x.scale(r,r);x.lineWidth=3;x.lineCap="round";x.strokeStyle="#111";
function p(e){var q=c.getBoundingClientRect();return[e.clientX-q.left,e.clientY-q.top]}
c.onpointerdown=function(e){down=true;l=p(e);c.setPointerCapture(e.pointerId)};
c.onpointermove=function(e){if(!down)return;var n=p(e);x.beginPath();x.moveTo(l[0],l[1]);x.lineTo(n[0],n[1]);x.stroke();l=n;ink=true};
c.onpointerup=function(){down=false};
document.getElementById("clr").onclick=function(){x.clearRect(0,0,c.width,c.height);ink=false};
document.getElementById("f").onsubmit=function(e){if(!ink||!document.getElementById("nm").value.trim()){e.preventDefault();alert("Please sign in the box and type your name.");return}document.getElementById("sig").value=c.toDataURL("image/png")};
</script>` : ""}
</body></html>`;
}

const html = (body: string, status = 200) => new NextResponse(body, { status, headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store", "x-robots-tag": "noindex" } });
const gone = () => html(`<!doctype html><meta name="viewport" content="width=device-width, initial-scale=1"><body style="font-family:system-ui;padding:40px;text-align:center"><h1>This link has expired</h1><p>Please call Apex Gates for a new one.</p></body>`, 404);

export async function GET(_req: NextRequest, ctx: { params: { token: string } }) {
  const { token } = ctx.params;
  const d = await readShare(token).catch(() => null);
  return d ? html(page(token, d)) : gone();
}

export async function POST(req: NextRequest, ctx: { params: { token: string } }) {
  const { token } = ctx.params;
  const d = await readShare(token).catch(() => null);
  if (!d || d.kind === "invoice") return gone();
  if (!d.accepted) {
    const form = await req.formData();
    const name = String(form.get("name") || "").trim().slice(0, 120);
    const sig = String(form.get("sig") || "");
    if (!name || !/^data:image\/png;base64,[A-Za-z0-9+/=]+$/.test(sig) || sig.length > 400_000) return html(page(token, d), 400);
    d.accepted = { name, sig, at: Date.now() };
    await saveSigned(token, d.accepted);
    // mark the quote as going ahead, so the office and the tablet see it straight away
    const q = await readQuote(d.qid).catch(() => null);
    if (q) { q.status = "won"; q.signature = { img: sig, name, date: d.accepted.at }; q.updated = Date.now(); await saveQuote(q).catch(() => {}); }
  }
  return NextResponse.redirect(new URL(`/clients/apex-gates/q/${token}`, req.url), 303);
}

// Password gate for Revolution HQ, Jim Picot's live CEO dashboard
// (/clients/revolution-materials/ceo). It shows real customer data from
// Revolution Materials' GoHighLevel account, so the page and its data route
// both need the access cookie.
//
// Env (Vercel, Production): RM_HQ_PASSWORD, GHL_RM_TOKEN, GHL_RM_LOCATION.
// Fails closed: with no RM_HQ_PASSWORD set, nobody gets in.
// The cookie holds an HMAC of the password, so changing the password in Vercel
// (and redeploying) signs everyone out.

export const RM_HQ_COOKIE = "rm_hq_access";
export const RM_HQ_HOME = "/clients/revolution-materials/ceo/index.html";

export function isRmHqGated(pathname: string): boolean {
  return pathname.startsWith("/clients/revolution-materials/ceo");
}

export async function rmHqToken(): Promise<string | null> {
  const pw = process.env.RM_HQ_PASSWORD;
  if (!pw) return null;
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(pw),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode("rm-hq-v1"));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function rmHqAuthorised(cookieValue: string | undefined): Promise<boolean> {
  const t = await rmHqToken();
  if (!t || !cookieValue || cookieValue.length !== t.length) return false;
  let diff = 0;
  for (let i = 0; i < t.length; i++) diff |= t.charCodeAt(i) ^ cookieValue.charCodeAt(i);
  return diff === 0;
}

/** Cookie (direct visits) or "Authorization: Bearer <key>" (the dashboard
 *  framed inside revolutionmaterials.com.au/dashboard, where browsers block
 *  third-party cookies; the key lives in the frame's own storage). */
export async function rmHqReqOk(req: { headers: Headers; cookies: { get(name: string): { value: string } | undefined } }): Promise<boolean> {
  if (await rmHqAuthorised(req.cookies.get(RM_HQ_COOKIE)?.value)) return true;
  const m = /^Bearer\s+([a-f0-9]{64})$/i.exec(req.headers.get("authorization") || "");
  return !!m && (await rmHqAuthorised(m[1]));
}

export function rmHqGateHtml(showError: boolean): string {
  const err = showError ? '<p class="err">That password was not right. Please try again.</p>' : "";
  return `<!doctype html><html lang="en-AU"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Revolution HQ</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap">
<style>
  *{box-sizing:border-box}
  body{margin:0;min-height:100vh;display:grid;place-items:center;padding:24px;background:#f4f6f9;font-family:"Inter",system-ui,sans-serif;color:#141a24}
  .card{width:100%;max-width:380px;background:#fff;border:1px solid #e2e7ee;border-radius:16px;padding:30px 26px;box-shadow:0 30px 70px -30px rgba(13,26,48,.25)}
  .mark{width:44px;height:44px;border-radius:11px;background:#003a7c;color:#fff;display:grid;place-items:center;font-weight:800;font-size:16px;margin-bottom:18px}
  h1{font-size:24px;font-weight:800;margin:0 0 6px;letter-spacing:-.02em}
  p.sub{font-size:14px;color:#596474;margin:0 0 22px;line-height:1.5}
  label{display:block;font-size:12.5px;font-weight:600;margin-bottom:6px}
  input{width:100%;font:inherit;font-size:16px;padding:13px 14px;border-radius:10px;border:1.5px solid #e2e7ee;margin-bottom:14px}
  input:focus{outline:none;border-color:#003a7c}
  button{width:100%;font:inherit;font-size:15px;font-weight:700;cursor:pointer;padding:14px;border-radius:10px;border:none;background:#003a7c;color:#fff}
  button:hover{background:#002a5c}
  .err{margin:0 0 14px;font-size:13px;color:#c0392b}
  .foot{margin-top:18px;font-size:11.5px;color:#8a94a3}
</style></head>
<body>
  <div class="card">
    <div class="mark">RM</div>
    <h1>Revolution HQ</h1>
    <p class="sub">Your live dashboard for Revolution Materials, connected to GoHighLevel.</p>
    ${err}
    <form method="POST" action="/api/rm-hq/unlock" id="f">
      <label for="pw">Password</label>
      <input id="pw" name="password" type="password" autocomplete="current-password" autofocus required>
      <button type="submit">Open dashboard</button>
    </form>
    <div class="foot">Stays signed in on this device for 90 days.</div>
  </div>
  <script>
  (function(){
    var K="rmhq-key",HOME="/clients/revolution-materials/ceo/index.html",card=document.querySelector(".card"),f=document.getElementById("f");
    var mem=null;function get(){try{return localStorage.getItem(K)}catch(e){return mem}}function put(v){mem=v;try{v?localStorage.setItem(K,v):localStorage.removeItem(K)}catch(e){}}
    function open(t){return fetch(HOME,{headers:{Authorization:"Bearer "+t},cache:"no-store"}).then(function(r){if(r.status!==200)return false;return r.text().then(function(h){document.open();document.write(h);document.close();return true})}).catch(function(){return false})}
    var t=get();if(t){card.style.visibility="hidden";open(t).then(function(ok){if(!ok){put(null);card.style.visibility=""}})}
    f.addEventListener("submit",function(e){e.preventDefault();var b=f.querySelector("button");b.disabled=true;b.textContent="Opening";
      fetch("/api/rm-hq/unlock",{method:"POST",body:new FormData(f),headers:{Accept:"application/json"},credentials:"include"}).then(function(r){return r.json()}).then(function(d){
        if(d&&d.ok&&d.token){put(d.token);return open(d.token)}return false}).then(function(ok){if(!ok){b.disabled=false;b.textContent="Open dashboard";
        var p=document.querySelector(".err");if(!p){p=document.createElement("p");p.className="err";f.parentNode.insertBefore(p,f)}p.textContent="That password was not right. Please try again."}})
      .catch(function(){b.disabled=false;b.textContent="Open dashboard"})});
  })();
  </script>
</body></html>`;
}

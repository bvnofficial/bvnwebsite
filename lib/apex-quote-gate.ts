// Password gate for Apex Quote, the internal quoting tool for Apex Gates
// technicians (/clients/apex-gates/quote). Prices and margins inside it are
// private to Apex, so every file under the path needs the access cookie.
// Server-side only: these constants are never shipped to the browser.
// Set APEX_QUOTE_PASSWORD in Vercel to change the password without a deploy.

export const APEX_QUOTE_PW = process.env.APEX_QUOTE_PASSWORD || "KestrelSwan836!";
export const APEX_QUOTE_TOKEN = "apq_c7b47ec9059f933fae662163";
export const APEX_QUOTE_COOKIE = "apex_quote_access";
export const APEX_QUOTE_HOME = "/clients/apex-gates/quote/index.html";

export function isApexQuoteGated(pathname: string): boolean {
  return pathname.startsWith("/clients/apex-gates/quote");
}

export function apexQuoteGateHtml(next: string, showError: boolean): string {
  const err = showError
    ? '<p class="err">That password was not right. Please try again.</p>'
    : "";
  return `<!doctype html><html lang="en-AU"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<meta name="theme-color" content="#121214">
<title>Apex Quote</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,800&family=Inter:wght@400;600;700&display=swap">
<style>
  *{box-sizing:border-box}
  body{margin:0;min-height:100vh;display:grid;place-items:center;padding:24px;background:#121214;
    background-image:radial-gradient(900px 420px at 50% -10%,#2a1410,#121214 65%);font-family:"Inter",system-ui,sans-serif;color:#f2f2f2}
  .card{width:100%;max-width:380px;background:#1b1b1e;border:1px solid #34353a;border-radius:16px;padding:30px 26px;box-shadow:0 30px 70px -30px rgba(0,0,0,.8)}
  .mark{width:44px;height:44px;border-radius:11px;background:#d61d09;color:#fff;display:grid;place-items:center;font:800 20px "Archivo",sans-serif;margin-bottom:18px}
  h1{font:800 26px "Archivo",sans-serif;font-stretch:115%;letter-spacing:.04em;margin:0 0 6px}
  p.sub{font-size:14px;color:#a3a3a8;margin:0 0 22px;line-height:1.5}
  label{display:block;font-size:12.5px;color:#c9c9cc;margin-bottom:6px;font-weight:600}
  input{width:100%;font:inherit;font-size:16px;padding:13px 14px;border-radius:10px;border:1px solid #3d3e44;background:#121214;color:#f2f2f2;margin-bottom:14px}
  input:focus{outline:2px solid #d61d09;outline-offset:1px;border-color:#d61d09}
  button{width:100%;font:inherit;font-size:15px;font-weight:700;cursor:pointer;padding:14px;border-radius:10px;border:none;background:#d61d09;color:#fff}
  button:hover{background:#b01606}
  .err{margin:0 0 14px;font-size:13px;color:#ff8a7a}
  .foot{margin-top:18px;font-size:11.5px;color:#6c6d72}
</style></head>
<body>
  <div class="card">
    <div class="mark">A</div>
    <h1>APEX QUOTE</h1>
    <p class="sub">The Apex Gates quoting tool, for the team only.</p>
    ${err}
    <form method="POST" action="/api/apex-quote-unlock">
      <input type="hidden" name="next" value="${next.replace(/"/g, "&quot;")}">
      <label for="pw">Password</label>
      <input id="pw" name="password" type="password" autocomplete="current-password" autofocus required>
      <button type="submit">Open</button>
    </form>
    <div class="foot">Stays signed in on this device for 90 days.</div>
  </div>
</body></html>`;
}

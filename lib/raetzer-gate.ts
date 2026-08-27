// Password gate for the private Raetzer PLLC client preview.
// Covers /clients/raetzer* (hub, website, assessment, dashboard, model), the
// hosted site copy at /raetzer-website*, and the hosted strategy PDFs under
// /raetzer/*. Server-side only — these constants are never shipped to the
// browser (middleware + route handler run on the server).

export const RAETZER_PW = "Raetzer2027Capital";
export const RAETZER_TOKEN = "rzk_7f2a9c4e1b8d6035aa10c3";
export const RAETZER_COOKIE = "raetzer_access";

export function isRaetzerGated(pathname: string): boolean {
  return (
    pathname.startsWith("/clients/raetzer") ||
    pathname.startsWith("/raetzer-website") ||
    pathname.startsWith("/raetzer/")
  );
}

export function raetzerGateHtml(next: string, showError: boolean): string {
  const err = showError
    ? '<p style="margin:0 0 14px;font-size:13px;color:#E0776C">That password was not correct. Please try again.</p>'
    : "";
  return `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Raetzer — Private Preview</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:wght@500;600&family=Manrope:wght@400;500;600;700&display=swap">
<style>
  *{box-sizing:border-box}
  body{margin:0;min-height:100vh;display:grid;place-items:center;padding:24px;
    background:radial-gradient(1000px 500px at 50% -10%,#122142,#0A1020 60%);
    font-family:"Manrope",system-ui,sans-serif;color:#EAF1FC}
  .card{width:100%;max-width:400px;background:linear-gradient(160deg,#121E38,#0E1830);
    border:1px solid #243456;border-radius:16px;padding:30px 26px;
    box-shadow:0 30px 70px -30px rgba(0,0,0,.8);text-align:center}
  .mark{width:44px;height:44px;border-radius:10px;background:#1B2A4A;color:#EDE2CE;
    display:grid;place-items:center;font-family:"Bodoni Moda",serif;font-weight:600;
    font-size:15px;margin:0 auto 18px}
  .eyebrow{font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#C9A15E;font-weight:700}
  h1{font-family:"Bodoni Moda",Georgia,serif;font-weight:600;font-size:24px;margin:10px 0 6px}
  p.sub{font-size:13.5px;color:#A9BADB;margin:0 0 22px;line-height:1.5}
  label{display:block;text-align:left;font-size:12px;color:#A9BADB;margin-bottom:6px;font-weight:600}
  input{width:100%;font:inherit;font-size:16px;padding:12px 14px;border-radius:10px;
    border:1px solid #2E3F63;background:#0C1526;color:#EAF1FC;margin-bottom:14px}
  input:focus{outline:2px solid #C9A15E;outline-offset:1px;border-color:#C9A15E}
  button{width:100%;font:inherit;font-size:15px;font-weight:700;cursor:pointer;
    padding:13px;border-radius:10px;border:none;background:#C9A15E;color:#0A1020}
  button:hover{background:#d8b06a}
  .foot{margin-top:18px;font-size:11px;color:#6A7686}
</style></head>
<body>
  <div class="card">
    <div class="mark">BVN</div>
    <div class="eyebrow">Raetzer PLLC</div>
    <h1>Private Preview</h1>
    <p class="sub">This workspace is confidential and available by password only.</p>
    ${err}
    <form method="POST" action="/api/raetzer-unlock">
      <input type="hidden" name="next" value="${next.replace(/"/g, "&quot;")}">
      <label for="pw">Password</label>
      <input id="pw" name="password" type="password" autocomplete="current-password" autofocus required>
      <button type="submit">Enter</button>
    </form>
    <div class="foot">Built and operated by BVN</div>
  </div>
</body></html>`;
}

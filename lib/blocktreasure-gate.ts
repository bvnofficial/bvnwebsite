// Password gate for the private Block Treasure N.V. client dashboard.
// Covers everything under /clients/blocktreasure (dashboard and hosted PDFs).
// The password and cookie token come from Vercel environment variables
// (BT_DASHBOARD_PASSWORD, BT_DASHBOARD_TOKEN) so no secret lives in the repo.
// If either is missing the gate stays locked for everyone (fails closed).

export const BT_PW = process.env.BT_DASHBOARD_PASSWORD || "";
export const BT_TOKEN = process.env.BT_DASHBOARD_TOKEN || "";
export const BT_COOKIE = "bt_access";

export function hasBlockTreasureAccess(cookie: string | undefined): boolean {
  return Boolean(BT_TOKEN) && cookie === BT_TOKEN;
}

export function isBlockTreasureGated(pathname: string): boolean {
  return pathname.startsWith("/clients/blocktreasure");
}

export function blockTreasureGateHtml(next: string, showError: boolean): string {
  const err = showError
    ? '<p style="margin:0 0 14px;font-size:13px;color:#F07A8A">That password was not correct. Please try again.</p>'
    : "";
  return `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Block Treasure · Client Dashboard</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Sora:wght@600;700&family=Inter:wght@400;500;600;700&display=swap">
<style>
  *{box-sizing:border-box}
  body{margin:0;min-height:100vh;display:grid;place-items:center;padding:24px;
    background:radial-gradient(1000px 500px at 80% -10%,rgba(232,181,74,.14),transparent 60%),#070B14;
    font-family:"Inter",system-ui,sans-serif;color:#EEF2FA}
  .card{width:100%;max-width:400px;background:linear-gradient(170deg,#121C33,#0F1729);
    border:1px solid #1E2A45;border-radius:18px;padding:30px 26px;
    box-shadow:0 30px 70px -30px rgba(0,0,0,.8);text-align:center}
  .mark{width:46px;height:46px;border-radius:12px;background:linear-gradient(135deg,#F6D27E,#C98F22);color:#1A1203;
    display:grid;place-items:center;font-family:"Sora",sans-serif;font-weight:700;font-size:15px;margin:0 auto 18px}
  .eyebrow{font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#E8B54A;font-weight:700}
  h1{font-family:"Sora",sans-serif;font-weight:700;font-size:22px;margin:10px 0 6px}
  p.sub{font-size:13.5px;color:#AEB9D0;margin:0 0 22px;line-height:1.5}
  label{display:block;text-align:left;font-size:12px;color:#AEB9D0;margin-bottom:6px;font-weight:600}
  input{width:100%;font:inherit;font-size:16px;padding:12px 14px;border-radius:10px;
    border:1px solid #26355A;background:#0B1120;color:#EEF2FA;margin-bottom:14px}
  input:focus{outline:2px solid #E8B54A;outline-offset:1px;border-color:#E8B54A}
  button{width:100%;font:inherit;font-size:15px;font-weight:700;cursor:pointer;
    padding:13px;border-radius:10px;border:none;background:linear-gradient(135deg,#F6D27E,#D9A13A);color:#1A1203}
  .foot{margin-top:18px;font-size:11px;color:#6E7B96}
</style></head>
<body>
  <div class="card">
    <div class="mark">BT</div>
    <div class="eyebrow">Block Treasure N.V.</div>
    <h1>Campaign Dashboard</h1>
    <p class="sub">This dashboard is confidential and available by password only.</p>
    ${err}
    <form method="POST" action="/api/blocktreasure-unlock">
      <input type="hidden" name="next" value="${next.replace(/"/g, "&quot;")}">
      <label for="pw">Password</label>
      <input id="pw" name="password" type="password" autocomplete="current-password" autofocus required>
      <button type="submit">Enter</button>
    </form>
    <div class="foot">Managed by BVN</div>
  </div>
</body></html>`;
}

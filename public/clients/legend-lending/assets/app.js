// Shared helpers for the Legend Lending demo apps.
const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));
function toast(t){let e=$("#toast");if(!e){e=document.createElement("div");e.id="toast";e.className="toast";document.body.appendChild(e)}e.textContent=t;e.classList.add("show");clearTimeout(e._t);e._t=setTimeout(()=>e.classList.remove("show"),2400)}
function shell(num,title,intro,fix){
  document.body.insertAdjacentHTML("afterbegin",`<div class="top"><a href="index.html"><img src="assets/lllogo.png" alt="Legend Lending"></a><div class="row"><span class="t">App suite demo</span><a class="back" href="index.html">All apps</a></div></div>
  <div class="hero"><div class="n">${num}</div><h1>${title}</h1><p>${intro}</p>${fix?`<span class="fix">Fixes: ${fix}</span>`:""}</div>`);
  document.body.insertAdjacentHTML("beforeend",`<div class="foot">Demo with sample data. Names, leads and figures are made up. Prepared by Benjamin Vincent Yson for Legend Lending.</div>`);
}
const money=n=>"$"+Math.round(n).toLocaleString("en-AU");

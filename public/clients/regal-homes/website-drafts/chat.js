(function(){
  var s=document.currentScript, C=s.dataset.color||'#2b1f6b', A=s.dataset.accent||'#e3c77d';
  var PHONE='<a href="tel:+18056002711">805-600-2711</a>';
  var R=[
    [/visit|tour|see the home|come by|schedule/i,'We would love to show you around. Call the office at '+PHONE+' to pick a day, or tap Schedule a Visit on this page and we will call you back.'],
    [/price|cost|rate|how much|afford|pay/i,'Every resident\'s care is different, so the office walks each family through costs on a short call. You can reach them at '+PHONE+'.'],
    [/home|location|where|simi|camarillo|orchard|residence|facilit/i,'We have three licensed homes in Ventura County. Regal Care has a spacious interior and a peaceful backyard garden. Regal Residence has bright common areas and a refreshing pool. The Orchard offers elegant luxury with a touch of nature\'s beauty.'],
    [/staff|care|night|24|awake|meal|food|small/i,'Our homes are intentionally small, because fewer residents means more personalized care. We have awake staff 24/7, home-cooked meals, and a focus on dignity and independence.'],
    [/app|login|log in|sign in|portal/i,'Families of our residents can use the Regal app on their phone or log in from any web browser at <a href="https://app.regalcare.org">app.regalcare.org</a> with the email the home has on file.'],
    [/licen/i,'All three homes are licensed by CCLD. Regal Care 565802408, Regal Residence 565850605, The Orchard 565850585.'],
    [/phone|call|email|contact|fax|reach/i,'You can call the office at '+PHONE+' or email <a href="mailto:info@regalcare.org">info@regalcare.org</a>.'],
    [/hi|hello|hey|good (morning|afternoon|evening)/i,'Hello! How can I help you today?']
  ];
  var FALL='Good question. The office can answer that best at '+PHONE+'. Would you like to leave your name and number so they can call you?';
  var chips=['Schedule a visit','Our homes','Pricing','Contact the office'];
  var st=document.createElement('style');
  st.textContent='#rgc-b{position:fixed;right:16px;bottom:84px;z-index:60;width:60px;height:60px;border-radius:50%;border:0;background:'+C+';box-shadow:0 8px 24px rgba(0,0,0,.3);cursor:pointer;display:flex;align-items:center;justify-content:center}#rgc-p{position:fixed;right:16px;bottom:156px;z-index:61;width:360px;max-width:calc(100vw - 32px);height:480px;max-height:calc(100vh - 190px);background:#fff;border-radius:18px;box-shadow:0 18px 50px rgba(0,0,0,.3);display:none;flex-direction:column;overflow:hidden;font:15px/1.5 system-ui,sans-serif;color:#1f1a33}#rgc-p.o{display:flex}#rgc-h{background:'+C+';color:#fff;padding:14px 16px;display:flex;justify-content:space-between;align-items:center}#rgc-h b{font-size:16px}#rgc-h small{display:block;opacity:.8;font-size:12px}#rgc-x{background:none;border:0;color:#fff;font-size:22px;cursor:pointer}#rgc-m{flex:1;overflow:auto;padding:14px;display:flex;flex-direction:column;gap:10px;background:#f6f5fa}.rgc-a,.rgc-u{max-width:85%;padding:10px 13px;border-radius:14px}.rgc-a{background:#fff;align-self:flex-start;border:1px solid #ebe8f3}.rgc-u{background:'+C+';color:#fff;align-self:flex-end}.rgc-a a{color:'+C+';font-weight:600}#rgc-c{display:flex;flex-wrap:wrap;gap:6px;padding:8px 14px 0;background:#f6f5fa}#rgc-c button{border:1px solid '+C+';background:#fff;color:'+C+';border-radius:999px;padding:6px 12px;font:600 13px system-ui,sans-serif;cursor:pointer}#rgc-f{display:flex;gap:8px;padding:12px;border-top:1px solid #ebe8f3}#rgc-i{flex:1;border:1px solid #d9d5e6;border-radius:999px;padding:10px 14px;font:15px system-ui,sans-serif;min-width:0}#rgc-s{border:0;background:'+C+';color:#fff;border-radius:999px;padding:0 16px;font-weight:600;cursor:pointer}';
  document.head.appendChild(st);
  var b=document.createElement('button');b.id='rgc-b';b.setAttribute('aria-label','Chat with us');
  b.innerHTML='<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="'+A+'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.4A8 8 0 1 1 21 12z"/></svg>';
  var p=document.createElement('div');p.id='rgc-p';
  p.innerHTML='<div id="rgc-h"><div><b>Regal Assistant</b><small>Sample chat, replies are examples</small></div><button id="rgc-x" aria-label="Close">&times;</button></div><div id="rgc-m"></div><div id="rgc-c"></div><form id="rgc-f"><input id="rgc-i" placeholder="Type your question" autocomplete="off"><button id="rgc-s">Send</button></form>';
  document.body.appendChild(b);document.body.appendChild(p);
  var m=p.querySelector('#rgc-m'),c=p.querySelector('#rgc-c'),i=p.querySelector('#rgc-i');
  function add(t,u){var d=document.createElement('div');d.className=u?'rgc-u':'rgc-a';if(u)d.textContent=t;else d.innerHTML=t;m.appendChild(d);m.scrollTop=m.scrollHeight}
  function ans(q){add(q,1);c.style.display='none';setTimeout(function(){for(var k=0;k<R.length;k++)if(R[k][0].test(q))return add(R[k][1]);add(FALL)},500)}
  chips.forEach(function(t){var x=document.createElement('button');x.type='button';x.textContent=t;x.onclick=function(){ans(t)};c.appendChild(x)});
  add('Hi, I\'m the Regal assistant. I can help with our homes, visits and how to reach the office. What would you like to know?');
  b.onclick=function(){p.classList.toggle('o');if(p.classList.contains('o'))i.focus()};
  p.querySelector('#rgc-x').onclick=function(){p.classList.remove('o')};
  p.querySelector('#rgc-f').onsubmit=function(e){e.preventDefault();var q=i.value.trim();if(q){i.value='';ans(q)}};
})();

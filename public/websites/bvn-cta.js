(function () {
  var bar = document.createElement('div');
  bar.id = 'bvn-cta-bar';
  bar.style.cssText = [
    'position:fixed', 'bottom:0', 'left:0', 'right:0', 'z-index:99999',
    'background:#0d0f1a', 'color:#fff',
    'padding:0.85rem 1.25rem',
    'display:flex', 'align-items:center', 'justify-content:center',
    'gap:1rem', 'flex-wrap:wrap',
    'border-top:2px solid #ff6b35',
    'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif',
    'font-size:0.875rem', 'line-height:1.4',
    'box-shadow:0 -4px 24px rgba(0,0,0,0.35)'
  ].join(';');

  var msg = document.createElement('span');
  msg.innerHTML = '<strong style="color:#ff6b35">BVN Digital</strong> built this page &mdash; want it live for your business? <span style="color:rgba(255,255,255,0.7)">Free to get started.</span>';

  var btn = document.createElement('a');
  btn.href = 'https://www.bvnofficial.com/get-started';
  btn.target = '_blank';
  btn.rel = 'noopener noreferrer';
  btn.textContent = 'Claim My Website →';
  btn.style.cssText = [
    'background:#ff6b35', 'color:#fff',
    'padding:0.5rem 1.1rem', 'border-radius:6px',
    'text-decoration:none', 'font-weight:700', 'font-size:0.8rem',
    'white-space:nowrap', 'flex-shrink:0',
    'transition:background 0.2s'
  ].join(';');
  btn.addEventListener('mouseenter', function () { btn.style.background = '#e05520'; });
  btn.addEventListener('mouseleave', function () { btn.style.background = '#ff6b35'; });

  var close = document.createElement('button');
  close.textContent = '×';
  close.setAttribute('aria-label', 'Dismiss');
  close.style.cssText = [
    'background:none', 'border:none', 'color:rgba(255,255,255,0.4)',
    'font-size:1.3rem', 'cursor:pointer', 'padding:0 0.2rem',
    'line-height:1', 'flex-shrink:0'
  ].join(';');
  close.addEventListener('click', function () {
    bar.remove();
    document.body.style.paddingBottom = '0';
  });

  bar.appendChild(msg);
  bar.appendChild(btn);
  bar.appendChild(close);
  document.body.appendChild(bar);

  // Push body content up so bar doesn't overlap footer
  setTimeout(function () {
    document.body.style.paddingBottom = bar.offsetHeight + 'px';
  }, 0);
})();

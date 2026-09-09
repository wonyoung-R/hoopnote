// Main landing interactions. No remote requests or form submissions on this page.
(() => {
  const menu = document.getElementById('navLinks');
  const toggle = document.getElementById('hamburger');
  function setMenu(open) {
    menu.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
    if (open) menu.querySelector('a').focus();
  }
  toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setMenu(false);
      toggle.focus();
    }
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('.navbar')) setMenu(false);
  });
  matchMedia('(min-width: 801px)').addEventListener('change', () => setMenu(false));

  // Keep campaign attribution when a visitor follows the guide link.
  try {
    const params = new URLSearchParams(location.search);
    const utm = { s: params.get('utm_source'), m: params.get('utm_medium'), c: params.get('utm_campaign') };
    if (utm.s || utm.m || utm.c) sessionStorage.setItem('hn_utm', JSON.stringify(utm));
  } catch { /* Optional attribution must not block navigation. */ }

  // View the existing assets at their original proportions; dialog provides Escape/focus handling.
  const dialog = document.getElementById('imageDialog');
  const imageHolder = document.getElementById('dialogImage');
  const imageError = document.getElementById('dialogError');
  document.querySelectorAll('.image-open').forEach(button => {
    const source = button.querySelector('img');
    const onError = () => {
      button.closest('figure').querySelector('.image-error').hidden = false;
    };
    source.addEventListener('error', onError);
    if (source.complete && !source.naturalWidth) onError();
    button.addEventListener('click', () => {
      const img = new Image();
      img.alt = source.alt;
      img.addEventListener('error', () => { imageError.hidden = false; });
      imageError.hidden = true;
      imageHolder.replaceChildren(img);
      document.getElementById('imageTitle').textContent = button.dataset.caption;
      img.src = source.currentSrc || source.src;
      dialog.showModal();
      document.body.classList.add('dialog-open');
      imageHolder.scrollTo(0, 0);
    });
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('dialog-open');
    imageHolder.replaceChildren();
  });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });

})();

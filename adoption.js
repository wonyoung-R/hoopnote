// A guide received by email continues to its existing application, without asking for email again.
// The token stays in the fragment on the guide; it is never sent to the static server or third-party links.
(() => {
  const token = new URLSearchParams(location.hash.slice(1)).get('t') || '';
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(token)) {
    document.querySelectorAll('[data-adoption-start]').forEach(link => {
      link.href = '../confirm.html?t=' + encodeURIComponent(token) + '&utm_source=email&utm_medium=adoption_manual&utm_campaign=lead_confirm';
      link.textContent = '도입 시작하기 ↗';
    });
    document.getElementById('nextStepNote').textContent = '연락처를 남기면 세팅 일정을 안내드립니다. 이 단계는 결제가 아닙니다.';
    // An in-page jump must not replace the email token fragment, including on reload.
    document.querySelector('a[href="#steps"]').addEventListener('click', event => {
      event.preventDefault();
      document.getElementById('steps').scrollIntoView();
      const heading = document.getElementById('steps-title');
      heading.setAttribute('tabindex', '-1');
      heading.focus({ preventScroll: true });
    });
  }
  const photo = document.getElementById('parentPhoto');
  const onError = () => { document.getElementById('photoError').hidden = false; };
  photo.addEventListener('error', onError);
  if (photo.complete && !photo.naturalWidth) onError();
})();

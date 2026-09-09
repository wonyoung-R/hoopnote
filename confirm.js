(() => {
  const API = 'https://academy.hoopnote.kr/api/landing/confirm';
  const token = new URLSearchParams(location.search).get('t') || '';
  const validToken = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(token);
  const states = ['stateLoading', 'stateInvalid', 'stateError', 'stateAlready', 'stateDone', 'stateForm'];
  const form = document.getElementById('confirmForm');
  const submit = document.querySelector('.confirm-submit');
  const submitError = document.getElementById('submitError');

  function show(id, focus = false) {
    states.forEach(state => document.getElementById(state).classList.toggle('hidden', state !== id));
    if (focus) document.querySelector('#' + id + ' h1')?.focus();
  }

  function invalid(status) {
    if (status === 410) {
      document.getElementById('invalidMsg').textContent = '링크 유효기간(30일)이 지났습니다. 새 안내 메일을 받아 다시 시작해 주세요.';
    } else if (status === 401 || status === 403) {
      document.getElementById('invalidMsg').textContent = '이 링크로 신청 정보를 확인할 수 없습니다. 안내 메일의 링크를 확인하거나 이메일로 문의해 주세요.';
    }
    show('stateInvalid', true);
  }

  // No automatic POST retry: a timed-out submission may already have been saved.
  // The existing API handles a later manual retry idempotently.
  async function request(options = {}) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000);
    try {
      const response = await fetch(API + (options.method ? '' : '?t=' + encodeURIComponent(token)), {
        ...options, signal: controller.signal, cache: 'no-store', referrerPolicy: 'no-referrer',
      });
      const json = await response.json().catch(() => null);
      return { response, json };
    } finally {
      clearTimeout(timeout);
    }
  }

  let loading = false;
  async function load() {
    if (loading) return;
    loading = true;
    show('stateLoading');
    try {
      const { response, json } = await request();
      if ([400, 401, 403, 404, 410].includes(response.status)) { invalid(response.status); return; }
      if (!response.ok || typeof json?.data?.confirmed !== 'boolean') throw new Error('unavailable');
      const data = json.data;
      if (data.confirmed) { show('stateAlready', true); return; }
      const academyName = typeof data.academyName === 'string' ? data.academyName.trim() : '';
      document.getElementById('academyName').value = academyName;
      document.getElementById('academyField').classList.toggle('hidden', !!academyName);
      document.getElementById('academyName').required = !academyName;
      const academyLine = document.getElementById('academyLine');
      academyLine.textContent = academyName;
      academyLine.classList.toggle('hidden', !academyName);
      show('stateForm');
    } catch {
      show('stateError', true);
    } finally {
      loading = false;
    }
  }

  if (!validToken) { invalid(); return; }
  document.querySelectorAll('[data-adoption-guide]').forEach(link => {
    link.href = 'docs/adoption-manual.html#t=' + encodeURIComponent(token);
  });
  document.getElementById('retryLoad').addEventListener('click', load);

  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (submit.disabled) return;
    submitError.hidden = true;
    const body = {
      t: token,
      name: document.getElementById('contactName').value.trim(),
      phone: document.getElementById('phone').value,
      academyName: document.getElementById('academyName').value.trim(),
      company: document.getElementById('hn_extra').value,
    };
    if (!body.name) {
      document.getElementById('contactName').focus();
      submitError.textContent = '성함을 입력해 주세요.';
      submitError.hidden = false;
      return;
    }
    if (document.getElementById('academyName').required && !body.academyName) {
      document.getElementById('academyName').focus();
      submitError.textContent = '학원명을 입력해 주세요.';
      submitError.hidden = false;
      return;
    }
    const payssam = form.querySelector('input[name="payssam"]:checked');
    if (payssam) body.payssamUser = payssam.value === 'yes';
    const original = submit.textContent;
    submit.disabled = true;
    submit.textContent = '접수 중…';
    form.setAttribute('aria-busy', 'true');
    try {
      const { response, json } = await request({
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
      });
      if (response.status === 200 && json?.data?.ok) {
        show(json.data.already ? 'stateAlready' : 'stateDone', true);
        return;
      }
      if ([401, 403, 404, 410].includes(response.status)) { invalid(response.status); return; }
      const message = json?.error?.message;
      submitError.textContent = typeof message === 'string' ? message : '접수를 확인하지 못했습니다. 입력 내용은 유지되니 잠시 후 다시 눌러주세요.';
      submitError.hidden = false;
      submitError.focus();
    } catch {
      submitError.textContent = '접수 결과를 확인하지 못했습니다. 연결을 확인한 뒤 다시 눌러주세요. 이미 접수됐다면 중복으로 처리하지 않습니다.';
      submitError.hidden = false;
      submitError.focus();
    } finally {
      submit.disabled = false;
      submit.textContent = original;
      form.removeAttribute('aria-busy');
    }
  });
  load();
})();

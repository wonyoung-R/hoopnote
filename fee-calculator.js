// Shared by the landing and adoption guide.
(() => {
  // Same progressive model as academy/src/lib/billing/usage-pricing.ts.
  // 500 students at 990; each subsequent 100-student band drops 50, down to 660.
  function calcAmount(count) {
    if (count <= 500) return Math.max(100000, count * 990);
    let total = 500 * 990;
    let remaining = count - 500;
    for (let step = 1; step <= 6 && remaining > 0; step++) {
      const inBand = Math.min(100, remaining);
      total += inBand * (990 - step * 50);
      remaining -= inBand;
    }
    return total + remaining * 660;
  }
  const input = document.getElementById('fcStudents');
  const out = document.getElementById('fcOut');
  const error = document.getElementById('fcError');
  function renderPrice() {
    const count = input.valueAsNumber;
    const valid = Number.isInteger(count) && count >= 1 && count <= 5000;
    input.setAttribute('aria-invalid', String(!valid));
    error.hidden = valid;
    if (!valid) {
      out.querySelector('.fc-amount').textContent = '—';
      out.querySelector('.fc-basis').textContent = '원생 수를 입력하면 계산됩니다.';
      return;
    }
    const amount = calcAmount(count);
    out.querySelector('.fc-amount').replaceChildren(document.createTextNode(amount.toLocaleString('ko-KR')));
    const unit = document.createElement('span');
    unit.textContent = '원';
    out.querySelector('.fc-amount').append(unit);
    out.querySelector('.fc-basis').textContent = count <= 101
      ? '최소 월 이용료가 적용됩니다.'
      : count > 500
        ? '단계별 할인 적용 · 원생당 평균 ' + Math.round(amount / count).toLocaleString('ko-KR') + '원'
        : count.toLocaleString('ko-KR') + '명 × 990원';
  }
  input.addEventListener('input', renderPrice);
  renderPrice();
})();

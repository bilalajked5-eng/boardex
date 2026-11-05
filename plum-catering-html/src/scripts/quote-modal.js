// Stepped Request-a-Quote modal (3 steps). Honest integration states:
//  - no endpoint configured → "integration pending", nothing sent, no conversion
//  - endpoint configured    → POST JSON; success shown ONLY on {ok:true, reference}
import { openDialog, wireDialog } from './dialog.js';
import { track, trackLead } from './tracking-adapter.js';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^\+?[0-9٠-٩\s().-]{7,20}$/;

export function initQuoteModal(data) {
  const modal = document.getElementById('quote-modal');
  const form = modal?.querySelector('[data-quote-form]');
  if (!modal || !form) return;
  wireDialog(modal);
  const t = data.i18n.quote;
  const status = form.querySelector('#quote-status');
  const submit = form.querySelector('[data-submit]');
  const submitLabel = form.querySelector('[data-submit-label]');
  const attached = form.querySelector('[data-attached]');
  const service = form.elements.service_type;
  const detail = form.elements.service_detail;
  const stepsEl = [...form.querySelectorAll('[data-step]')];
  const stepperBars = [...modal.querySelectorAll('[data-stepper] span')];
  const stepCount = modal.querySelector('[data-step-count]');
  const backBtn = form.querySelector('[data-step-back]');
  const nextBtn = form.querySelector('[data-step-next]');
  const stepNames = JSON.parse(form.dataset.steps || '[]');
  let step = 1;
  const TOTAL = stepsEl.length;

  const showStep = (n) => {
    step = Math.min(Math.max(1, n), TOTAL);
    stepsEl.forEach((f) => { f.hidden = Number(f.dataset.step) !== step; });
    stepperBars.forEach((b, i) => b.classList.toggle('is-on', i < step));
    stepCount.textContent = `${t.stepLabel.replace('{n}', step).replace('{total}', TOTAL)} — ${stepNames[step - 1] || ''}`;
    backBtn.style.visibility = step === 1 ? 'hidden' : 'visible';
    nextBtn.hidden = step === TOTAL;
    submit.hidden = step !== TOTAL;
    const first = stepsEl[step - 1].querySelector('input:not([type=hidden]):not([type=checkbox]), select, textarea');
    first?.focus({ preventScroll: true });
  };

  // Filter the service-detail options to the chosen enquiry category
  const syncDetail = () => {
    const type = service.value;
    let keep = false;
    [...detail.querySelectorAll('option[data-type]')].forEach((o) => { const show = !type || o.dataset.type === type; o.hidden = !show; o.disabled = !show; if (o.selected && show) keep = true; });
    [...detail.querySelectorAll('optgroup')].forEach((g) => { g.hidden = ![...g.querySelectorAll('option')].some((o) => !o.hidden); });
    if (!keep) detail.value = '';
  };
  service.addEventListener('change', syncDetail);

  const setStatus = (kind, nodes) => { status.className = `form-status field--full${kind ? ` form-status--${kind}` : ''}`; status.textContent = ''; if (nodes) { status.append(...nodes); status.focus({ preventScroll: false }); } };
  const para = (text, strong) => { const p = document.createElement('p'); if (strong) { const s = document.createElement('strong'); s.textContent = strong; p.append(s, document.createElement('br')); } p.append(text); return p; };
  const clearErrors = (scope = form) => { scope.querySelectorAll('[aria-invalid]').forEach((el) => el.removeAttribute('aria-invalid')); scope.querySelectorAll('.field__error').forEach((el) => { el.textContent = ''; }); };
  const setError = (input, msg) => { input.setAttribute('aria-invalid', 'true'); const err = form.querySelector(`#${input.id}-error`); if (err) err.textContent = msg; };

  const validateStep = (n) => {
    const scope = stepsEl[n - 1];
    clearErrors(scope);
    const invalid = [];
    const el = form.elements;
    const need = (input, ok, msg) => { if (!ok) { setError(input, msg); invalid.push(input); } };
    if (n === 1) need(el.service_type, !!el.service_type.value, t.errors.required);
    if (n === TOTAL) {
      need(el.name, el.name.value.trim().length >= 2, t.errors.required);
      need(el.email, EMAIL.test(el.email.value.trim()), el.email.value.trim() ? t.errors.email : t.errors.required);
      need(el.phone, PHONE.test(el.phone.value.trim()), el.phone.value.trim() ? t.errors.phone : t.errors.required);
      need(el.privacy_ack, el.privacy_ack.checked, t.errors.privacy);
    }
    if (invalid.length) { setStatus('error', [para(t.errors.summary)]); invalid[0].focus(); }
    return !invalid.length;
  };
  nextBtn.addEventListener('click', () => { if (validateStep(step)) { setStatus('', null); showStep(step + 1); } });
  backBtn.addEventListener('click', () => { setStatus('', null); showStep(step - 1); });

  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-quote-open]');
    if (!trigger) return;
    e.preventDefault();
    clearErrors(); setStatus('', null); form.hidden = false;
    const svc = trigger.dataset.service || '';
    if ([...service.options].some((o) => o.value === svc)) service.value = svc;
    syncDetail();
    const det = trigger.dataset.detail || '';
    if (det && [...detail.options].some((o) => o.value === det && !o.disabled)) detail.value = det;
    const pid = trigger.dataset.productId || '';
    const pname = trigger.dataset.productName || '';
    form.elements.product_id.value = pid;
    form.elements.product_name.value = pname;
    form.elements.product_category.value = trigger.dataset.productCategory || '';
    form.elements.source_path.value = location.pathname;
    if (pid) { attached.hidden = false; attached.querySelector('[data-attached-name]').textContent = `${pname} (${pid})`; if (!form.elements.interest.value) form.elements.interest.value = pname; } else attached.hidden = true;
    showStep(1);
    openDialog(modal, trigger);
    track('quote_open', { service_type: service.value, service_detail: detail.value, product_id: pid });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (form.elements.website.value) return; // honeypot
    if (!validateStep(1)) { showStep(1); return; }
    if (!validateStep(TOTAL)) return;
    if (!data.quoteEndpoint) { setStatus('pending', [para(t.pendingIntegration)]); track('quote_submit_unconnected', { service_type: service.value }); return; }
    const payload = Object.fromEntries([...new FormData(form).entries()].filter(([k]) => k !== 'website'));
    payload.privacy_ack = !!form.elements.privacy_ack.checked;
    payload.marketing_consent = !!form.elements.marketing_consent.checked;
    submit.disabled = true; submit.setAttribute('aria-busy', 'true'); submitLabel.textContent = t.sending;
    const ctrl = new AbortController(); const timer = setTimeout(() => ctrl.abort(), 15000);
    try {
      const res = await fetch(data.quoteEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(payload), credentials: 'same-origin', signal: ctrl.signal });
      let json = null; try { json = await res.json(); } catch { /* non-JSON = failure */ }
      if (res.ok && json?.ok === true && typeof json.reference === 'string' && json.reference) {
        setStatus('success', [para(t.success.replace('{ref}', json.reference), t.successTitle)]);
        trackLead({ reference: json.reference, serviceType: payload.service_type, productId: payload.product_id });
        form.reset(); syncDetail();
      } else {
        setStatus('error', [para(t.errors.server)]);
        if (json?.errors) Object.entries(json.errors).forEach(([name, msg]) => { const i = form.elements[name]; if (i?.id) setError(i, String(msg)); });
      }
    } catch { setStatus('error', [para(t.errors.network)]); }
    finally { clearTimeout(timer); submit.disabled = false; submit.removeAttribute('aria-busy'); submitLabel.textContent = t.submit; }
  });

  syncDetail();
  showStep(1);
}

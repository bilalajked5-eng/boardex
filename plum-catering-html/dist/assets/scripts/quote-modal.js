// Accessible Request-a-Quote modal. Honest integration states:
//  - no endpoint configured  → "integration pending" message, nothing is sent, no conversion
//  - endpoint configured     → POST JSON; success shown ONLY if server returns {ok:true, reference}
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

  const syncConditional = () => {
    form.querySelectorAll('[data-cond]').forEach((f) => {
      const show = f.dataset.cond.split(' ').includes(service.value);
      f.hidden = !show;
      f.querySelectorAll('input,select,textarea').forEach((i) => { i.disabled = !show; });
    });
  };
  service.addEventListener('change', syncConditional);

  const setStatus = (kind, html) => {
    status.className = `form-status field--full${kind ? ` form-status--${kind}` : ''}`;
    status.textContent = '';
    if (html) { status.append(...html); status.focus({ preventScroll: false }); }
  };
  const para = (text, strong) => { const p = document.createElement('p'); if (strong) { const s = document.createElement('strong'); s.textContent = strong; p.append(s, document.createElement('br')); } p.append(text); return p; };

  const clearErrors = () => {
    form.querySelectorAll('[aria-invalid]').forEach((el) => el.removeAttribute('aria-invalid'));
    form.querySelectorAll('.field__error').forEach((el) => { el.textContent = ''; });
  };
  const setError = (input, msg) => {
    input.setAttribute('aria-invalid', 'true');
    const err = form.querySelector(`#${input.id}-error`);
    if (err) err.textContent = msg;
  };

  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-quote-open]');
    if (!trigger) return;
    e.preventDefault();
    clearErrors();
    setStatus('', null);
    form.hidden = false;
    const svc = trigger.dataset.service || '';
    if ([...service.options].some((o) => o.value === svc)) service.value = svc;
    const pid = trigger.dataset.productId || '';
    const pname = trigger.dataset.productName || '';
    form.elements.product_id.value = pid;
    form.elements.product_category.value = trigger.dataset.productCategory || '';
    form.elements.source_path.value = location.pathname;
    if (pid) {
      attached.hidden = false;
      attached.querySelector('[data-attached-name]').textContent = `${pname} (${pid})`;
      form.elements.product_name.value = pname;
    } else {
      attached.hidden = true;
    }
    syncConditional();
    openDialog(modal, trigger);
    track('quote_open', { service_type: service.value, product_id: pid });
  });

  const validate = () => {
    clearErrors();
    const invalid = [];
    const el = form.elements;
    const need = (input, ok, msg) => { if (!ok) { setError(input, msg); invalid.push(input); } };
    need(el.name, el.name.value.trim().length >= 2, t.errors.required);
    need(el.email, EMAIL.test(el.email.value.trim()), el.email.value.trim() ? t.errors.email : t.errors.required);
    need(el.phone, PHONE.test(el.phone.value.trim()), el.phone.value.trim() ? t.errors.phone : t.errors.required);
    need(el.service_type, !!el.service_type.value, t.errors.required);
    need(el.privacy_ack, el.privacy_ack.checked, t.errors.privacy);
    return invalid;
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (form.elements.website.value) return; // honeypot: drop silently, never claim success
    const invalid = validate();
    if (invalid.length) {
      setStatus('error', [para(t.errors.summary)]);
      invalid[0].focus();
      return;
    }
    if (!data.quoteEndpoint) {
      setStatus('pending', [para(t.pendingIntegration)]);
      track('quote_submit_unconnected', { service_type: form.elements.service_type.value });
      return;
    }
    const payload = Object.fromEntries([...new FormData(form).entries()].filter(([k]) => k !== 'website'));
    payload.privacy_ack = !!form.elements.privacy_ack.checked;
    payload.marketing_consent = !!form.elements.marketing_consent.checked;
    submit.disabled = true; submit.setAttribute('aria-busy', 'true'); submitLabel.textContent = t.sending;
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 15000);
    try {
      const res = await fetch(data.quoteEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'same-origin',
        signal: ctrl.signal,
      });
      let json = null;
      try { json = await res.json(); } catch { /* non-JSON = failure */ }
      if (res.ok && json?.ok === true && typeof json.reference === 'string' && json.reference) {
        setStatus('success', [para(t.success.replace('{ref}', json.reference), t.successTitle)]);
        trackLead({ reference: json.reference, serviceType: payload.service_type, productId: payload.product_id });
        form.reset();
        syncConditional();
      } else {
        setStatus('error', [para(t.errors.server)]);
        if (json?.errors) Object.entries(json.errors).forEach(([name, msg]) => { const i = form.elements[name]; if (i?.id) setError(i, String(msg)); });
      }
    } catch {
      setStatus('error', [para(t.errors.network)]);
    } finally {
      clearTimeout(timer);
      submit.disabled = false; submit.removeAttribute('aria-busy'); submitLabel.textContent = t.submit;
    }
  });

  syncConditional();
}

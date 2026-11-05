// Shared accessible dialog helpers built on native <dialog>.showModal():
// inert background, Escape to close, focus containment and focus restoration.
const openers = new WeakMap();

export function openDialog(dialog, opener = document.activeElement) {
  if (!dialog || dialog.open) return;
  openers.set(dialog, opener);
  dialog.showModal();
  document.body.classList.add('is-locked');
  const first = dialog.querySelector('[autofocus], input:not([type=hidden]):not([tabindex="-1"]), select, textarea, button, a[href]');
  first?.focus({ preventScroll: true });
}

export function closeDialog(dialog) {
  if (dialog?.open) dialog.close();
}

export function wireDialog(dialog) {
  if (!dialog || dialog.dataset.wired) return;
  dialog.dataset.wired = '1';
  dialog.addEventListener('close', () => {
    if (!document.querySelector('dialog[open]')) document.body.classList.remove('is-locked');
    const opener = openers.get(dialog);
    if (opener && document.contains(opener)) opener.focus({ preventScroll: true });
  });
  // Click on the backdrop (outside the dialog box) closes it.
  dialog.addEventListener('click', (e) => {
    if (e.target !== dialog) return;
    const r = dialog.getBoundingClientRect();
    const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
    if (!inside || dialog.classList.contains('drawer') || dialog.classList.contains('lightbox')) dialog.close();
  });
  dialog.querySelectorAll('[data-modal-close]').forEach((b) => b.addEventListener('click', () => dialog.close()));
  // Keep Tab focus inside the dialog (belt and braces on top of native inertness).
  dialog.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    const f = [...dialog.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]):not([type=hidden]):not([tabindex="-1"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')].filter((el) => el.offsetParent !== null);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
}

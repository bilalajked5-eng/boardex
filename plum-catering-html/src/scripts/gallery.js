// Gallery filters + keyboard-accessible lightbox. Each image is a native link to
// the full asset, so the gallery still works without JavaScript.
import { openDialog, wireDialog } from './dialog.js';

export function initGallery(data) {
  const lb = document.getElementById('lightbox');
  const galleries = document.querySelectorAll('[data-gallery]');
  if (!galleries.length) return;
  const rtl = document.documentElement.dir === 'rtl';

  galleries.forEach((g) => {
    const bar = g.querySelector('[data-gallery-filters]');
    if (bar) {
      bar.hidden = false;
      const chips = [...bar.querySelectorAll('[data-filter]')];
      chips.forEach((c) => c.addEventListener('click', () => {
        chips.forEach((x) => x.setAttribute('aria-pressed', String(x === c)));
        g.querySelectorAll('.gallery-item').forEach((it) => { it.hidden = c.dataset.filter !== 'all' && it.dataset.category !== c.dataset.filter; });
      }));
    }
  });

  if (!lb) return;
  wireDialog(lb);
  const imgEl = lb.querySelector('[data-lightbox-img]');
  const cap = lb.querySelector('[data-lightbox-caption]');
  let list = [], idx = 0;
  const show = (i) => {
    idx = (i + list.length) % list.length;
    const a = list[idx];
    const thumb = a.querySelector('img');
    imgEl.src = a.getAttribute('href');
    imgEl.alt = thumb?.alt || '';
    if (thumb) { imgEl.width = thumb.width; imgEl.height = thumb.height; }
    cap.textContent = `${a.dataset.caption || ''} — ${idx + 1} ${data.i18n.gallery.of} ${list.length}`;
  };
  document.addEventListener('click', (e) => {
    const a = e.target.closest('[data-lightbox]');
    if (!a) return;
    e.preventDefault();
    const g = a.closest('[data-gallery]');
    list = [...g.querySelectorAll('.gallery-item:not([hidden]) [data-lightbox]')];
    show(list.indexOf(a));
    openDialog(lb, a);
    lb.querySelector('[data-lightbox-close]').focus();
  });
  lb.querySelector('[data-lightbox-close]').addEventListener('click', () => lb.close());
  lb.querySelector('[data-lightbox-prev]').addEventListener('click', () => show(idx - 1));
  lb.querySelector('[data-lightbox-next]').addEventListener('click', () => show(idx + 1));
  lb.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') show(idx + (rtl ? -1 : 1));
    if (e.key === 'ArrowLeft') show(idx + (rtl ? 1 : -1));
  });
}

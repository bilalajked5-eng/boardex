// Header (dropdowns), mobile drawer, reveal animations, FAQ accordion, TOC, hero video.
import { openDialog, wireDialog } from './dialog.js';

const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function initNavigation(data) {
  /* Sticky condensed header + floating actions */
  const header = document.querySelector('[data-header]');
  let ticking = false;
  const onScroll = () => { header?.classList.toggle('is-condensed', window.scrollY > 24); ticking = false; };
  window.addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(onScroll); ticking = true; } }, { passive: true });
  onScroll();

  /* Dropdown navigation (click / keyboard; hover-open on fine pointers) */
  const items = [...document.querySelectorAll('[data-nav-item]')];
  const closeAll = (except) => items.forEach((it) => { if (it === except) return; const b = it.querySelector('[data-nav-toggle]'); const m = it.querySelector('.mega'); b.setAttribute('aria-expanded', 'false'); m.hidden = true; });
  items.forEach((it) => {
    const btn = it.querySelector('[data-nav-toggle]');
    const mega = it.querySelector('.mega');
    let byHover = false;
    const open = (hover = false) => { closeAll(it); btn.setAttribute('aria-expanded', 'true'); mega.hidden = false; byHover = hover; };
    const close = () => { btn.setAttribute('aria-expanded', 'false'); mega.hidden = true; byHover = false; };
    // A click on a hover-opened menu pins it open instead of toggling it closed.
    btn.addEventListener('click', () => { if (mega.hidden) open(false); else if (byHover) byHover = false; else close(); });
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      let t;
      it.addEventListener('mouseenter', () => { clearTimeout(t); if (mega.hidden) open(true); });
      it.addEventListener('mouseleave', () => { t = setTimeout(() => { if (byHover) close(); }, 160); });
    }
    it.addEventListener('keydown', (e) => { if (e.key === 'Escape') { close(); btn.focus(); } });
    it.addEventListener('focusout', (e) => { if (!it.contains(e.relatedTarget)) close(); });
  });
  document.addEventListener('click', (e) => { if (!e.target.closest('[data-nav-item]')) closeAll(); });

  /* Drawer */
  const drawer = document.getElementById('site-drawer');
  const toggle = document.querySelector('[data-drawer-open]');
  if (drawer && toggle) {
    wireDialog(drawer);
    toggle.addEventListener('click', () => { openDialog(drawer, toggle); toggle.setAttribute('aria-expanded', 'true'); });
    drawer.addEventListener('close', () => toggle.setAttribute('aria-expanded', 'false'));
    drawer.querySelector('[data-drawer-close]')?.addEventListener('click', () => drawer.close());
    window.matchMedia('(min-width: 1320px)').addEventListener('change', (e) => { if (e.matches && drawer.open) drawer.close(); });
  }
  document.querySelectorAll('dialog.modal').forEach(wireDialog);

  /* Reveal on scroll */
  const reveals = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || reduceMotion()) reveals.forEach((el) => el.classList.add('is-visible'));
  else {
    const io = new IntersectionObserver((entries) => { entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); } }); }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach((el) => io.observe(el));
    window.addEventListener('beforeprint', () => reveals.forEach((el) => el.classList.add('is-visible')));
  }

  /* FAQ accordion */
  document.querySelectorAll('[data-faq] .faq-q').forEach((btn) => {
    const panel = document.getElementById(btn.getAttribute('aria-controls'));
    if (!panel) return;
    panel.hidden = true;
    btn.addEventListener('click', () => { const open = btn.getAttribute('aria-expanded') === 'true'; btn.setAttribute('aria-expanded', String(!open)); panel.hidden = open; });
  });

  /* TOC active state */
  const links = [...document.querySelectorAll('[data-toc]')];
  if (links.length && 'IntersectionObserver' in window) {
    const map = new Map(links.map((a) => [decodeURIComponent(a.hash.slice(1)), a]));
    const io = new IntersectionObserver((entries) => { entries.forEach((en) => { if (!en.isIntersecting) return; links.forEach((a) => { a.classList.remove('is-active'); a.removeAttribute('aria-current'); }); const a = map.get(en.target.id); if (a) { a.classList.add('is-active'); a.setAttribute('aria-current', 'location'); } }); }, { rootMargin: '-35% 0px -55% 0px' });
    map.forEach((_, id) => { const t = document.getElementById(id); if (t) io.observe(t); });
  }

  /* Hero video */
  const video = document.querySelector('[data-hero-video]');
  const vt = document.querySelector('[data-video-toggle]');
  if (video && vt) {
    const label = vt.querySelector('span');
    const setState = (playing) => { vt.setAttribute('aria-pressed', String(!playing)); label.textContent = playing ? data.i18n.video.pause : data.i18n.video.play; };
    if (!reduceMotion() && !navigator.connection?.saveData) { video.preload = 'auto'; video.play().then(() => setState(true)).catch(() => setState(false)); } else setState(false);
    vt.addEventListener('click', () => { if (video.paused) { video.play(); setState(true); } else { video.pause(); setState(false); } });
  }
}

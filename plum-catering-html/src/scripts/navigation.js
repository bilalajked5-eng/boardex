// Header, mobile drawer, reveal animations, FAQ accordion, jump links, TOC, hero video.
import { openDialog, wireDialog } from './dialog.js';

const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function initNavigation(data) {
  /* Sticky condensed header + mobile contact bar */
  const header = document.querySelector('[data-header]');
  const bar = document.querySelector('[data-mobile-bar]');
  let ticking = false;
  const onScroll = () => {
    const y = window.scrollY;
    header?.classList.toggle('is-condensed', y > 24);
    bar?.classList.toggle('is-visible', y > 420);
    ticking = false;
  };
  window.addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(onScroll); ticking = true; } }, { passive: true });
  onScroll();

  /* Drawer */
  const drawer = document.getElementById('site-drawer');
  const toggle = document.querySelector('[data-drawer-open]');
  if (drawer && toggle) {
    wireDialog(drawer);
    toggle.addEventListener('click', () => { openDialog(drawer, toggle); toggle.setAttribute('aria-expanded', 'true'); });
    drawer.addEventListener('close', () => toggle.setAttribute('aria-expanded', 'false'));
    drawer.querySelector('[data-drawer-close]')?.addEventListener('click', () => drawer.close());
    drawer.querySelectorAll('a[href^="#"]').forEach((a) => a.addEventListener('click', () => drawer.close()));
    window.matchMedia('(min-width: 1320px)').addEventListener('change', (e) => { if (e.matches && drawer.open) drawer.close(); });
  }

  /* Generic dialogs */
  document.querySelectorAll('dialog.modal').forEach(wireDialog);

  /* Reveal on scroll — content is visible without JS; .js class enables the effect */
  const reveals = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || reduceMotion()) {
    reveals.forEach((el) => el.classList.add('is-visible'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach((el) => io.observe(el));
    // Safety net: never leave content hidden (e.g. print, unusual viewports).
    window.addEventListener('beforeprint', () => reveals.forEach((el) => el.classList.add('is-visible')));
  }

  /* FAQ accordion — answers are visible without JS; collapsed once JS is active */
  document.querySelectorAll('[data-faq] .faq-q').forEach((btn) => {
    const panel = document.getElementById(btn.getAttribute('aria-controls'));
    if (!panel) return;
    panel.hidden = true;
    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      panel.hidden = open;
    });
  });

  /* Jump links + TOC active state */
  const activeObserver = (links) => {
    if (!links.length || !('IntersectionObserver' in window)) return;
    const map = new Map(links.map((a) => [decodeURIComponent(a.hash.slice(1)), a]));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        links.forEach((a) => { a.classList.remove('is-active'); a.removeAttribute('aria-current'); });
        const a = map.get(en.target.id);
        if (a) { a.classList.add('is-active'); a.setAttribute('aria-current', 'location'); a.scrollIntoView?.({ block: 'nearest', inline: 'nearest' }); }
      });
    }, { rootMargin: '-35% 0px -55% 0px' });
    map.forEach((_, id) => { const t = document.getElementById(id); if (t) io.observe(t); });
  };
  activeObserver([...document.querySelectorAll('[data-jump]')]);
  activeObserver([...document.querySelectorAll('[data-toc]')]);

  /* Hero background video: muted, paused under reduced motion, user-controllable */
  const video = document.querySelector('[data-hero-video]');
  const vt = document.querySelector('[data-video-toggle]');
  if (video && vt) {
    const label = vt.querySelector('span');
    const setState = (playing) => {
      vt.setAttribute('aria-pressed', String(!playing));
      label.textContent = playing ? data.i18n.video.pause : data.i18n.video.play;
    };
    const saveData = navigator.connection?.saveData;
    if (!reduceMotion() && !saveData) { video.preload = 'auto'; video.play().then(() => setState(true)).catch(() => setState(false)); }
    else setState(false);
    vt.addEventListener('click', () => { if (video.paused) { video.play(); setState(true); } else { video.pause(); setState(false); } });
  }
}

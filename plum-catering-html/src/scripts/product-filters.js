// B2B catalogue search + family filter. All products are server-rendered with
// native links; this only hides/shows cards and is safe to fail.
const normalize = (s) =>
  String(s || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ًͯ-ٰٟـ]/g, '') // Latin accents, Arabic tashkeel & tatweel
    .replace(/[إأآا]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه')
    .trim();

export function initProductFilters(data) {
  const root = document.querySelector('[data-catalogue]');
  const tools = document.querySelector('[data-catalogue-tools]');
  if (!root || !tools) return;
  tools.hidden = false;
  const t = data.i18n.filters;
  const search = tools.querySelector('[data-product-search]');
  const chips = [...tools.querySelectorAll('[data-family-filter]')];
  const statusEl = tools.querySelector('[data-catalogue-status]');
  const noResults = document.querySelector('[data-no-results]');
  const families = [...root.querySelectorAll('[data-family]')].filter((el) => el.matches('section'));
  let family = 'all';
  const fmt = (n) => Number(n).toLocaleString('en-US');

  const apply = () => {
    const q = normalize(search.value);
    let shown = 0;
    families.forEach((sec) => {
      const famOk = family === 'all' || sec.dataset.family === family;
      let vis = 0;
      sec.querySelectorAll('[data-product]').forEach((li) => {
        const ok = famOk && (!q || normalize(li.dataset.name).includes(q));
        li.hidden = !ok;
        if (ok) vis++;
      });
      sec.querySelectorAll('[data-pending-card]').forEach((li) => { li.hidden = !famOk || !!q; if (!li.hidden) vis++; });
      sec.hidden = !famOk || vis === 0;
      shown += [...sec.querySelectorAll('[data-product]')].filter((li) => !li.hidden).length;
    });
    statusEl.textContent = t.results.replace('{n}', fmt(shown));
    noResults.hidden = families.some((s) => !s.hidden);
  };

  let timer;
  search.addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(apply, 120); });
  chips.forEach((c) => c.addEventListener('click', () => {
    family = c.dataset.familyFilter;
    chips.forEach((x) => x.setAttribute('aria-pressed', String(x === c)));
    apply();
  }));
  document.querySelector('[data-clear-filters]')?.addEventListener('click', () => {
    search.value = ''; family = 'all';
    chips.forEach((x) => x.setAttribute('aria-pressed', String(x.dataset.familyFilter === 'all')));
    apply(); search.focus();
  });
  apply();
}

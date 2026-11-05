// B2B quick product finder: all 76 products are server-rendered as links; this
// only filters the list (first 8 shown by default) and is safe to fail.
const normalize = (s) => String(s || '').toLowerCase().normalize('NFKD').replace(/[̀-ًͯ-ٰٟـ]/g, '').replace(/[إأآا]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه').trim();

export function initProductFilters(data) {
  const root = document.querySelector('[data-finder]');
  if (!root) return;
  const t = data.i18n.finder;
  const search = root.querySelector('[data-product-search]');
  const status = root.querySelector('[data-finder-status]');
  const showAll = root.querySelector('[data-finder-all]');
  const items = [...root.querySelectorAll('[data-product]')];
  const total = items.length;
  showAll.hidden = false;
  const apply = () => {
    const q = normalize(search.value);
    let shown = 0;
    items.forEach((li) => { const ok = !q || normalize(li.dataset.name).includes(q); li.hidden = !ok; if (ok) shown++; });
    root.classList.toggle('is-expanded', !!q || root.dataset.all === '1');
    const visible = q || root.dataset.all === '1' ? shown : Math.min(8, shown);
    status.textContent = t.showing.replace('{n}', visible).replace('{total}', total);
    showAll.hidden = !!q || root.dataset.all === '1';
  };
  let timer;
  search.addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(apply, 120); });
  showAll.addEventListener('click', () => { root.dataset.all = '1'; apply(); });
  apply();
}

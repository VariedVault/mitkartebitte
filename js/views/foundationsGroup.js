import { el, backLink } from '../ui/components.js';
import { GROUPS } from './foundationsHome.js';
import { navigate } from '../router.js';

export async function renderFoundationsGroup(container, { group, setBreadcrumb }) {
  const groupDef = GROUPS.find((g) => g.id === group);
  container.innerHTML = '';
  container.appendChild(backLink('Foundations', () => navigate('/foundations')));

  if (!groupDef) {
    setBreadcrumb('Foundations');
    container.appendChild(el('div', { class: 'card' }, `"${group}" isn't a Foundations section.`));
    return;
  }
  setBreadcrumb(`Foundations · ${groupDef.label}`);

  container.appendChild(el('h1', {}, `${groupDef.emoji} ${groupDef.label}`));
  container.appendChild(el('p', { style: 'color:var(--cream-dim)' }, groupDef.blurb));

  const grid = el('div', { style: 'display:grid;grid-template-columns:repeat(auto-fill, minmax(90px, 1fr));gap:10px;margin-top:16px' });
  groupDef.items.forEach((item, index) => {
    const tile = el('button', { class: 'card foundation-tile' }, el('div', { class: 'foundation-tile-label' }, item.character));
    tile.addEventListener('click', () => navigate(`/foundations/${group}/${index}`));
    grid.appendChild(tile);
  });
  container.appendChild(grid);
}

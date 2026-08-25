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

  function buildGrid(entries) {
    const grid = el('div', { style: 'display:grid;grid-template-columns:repeat(auto-fill, minmax(90px, 1fr));gap:10px' });
    for (const { item, index } of entries) {
      const tile = el('button', { class: 'card foundation-tile' }, el('div', { class: 'foundation-tile-label' }, item.character));
      tile.addEventListener('click', () => navigate(`/foundations/${group}/${index}`));
      grid.appendChild(tile);
    }
    return grid;
  }

  const indexed = groupDef.items.map((item, index) => ({ item, index }));

  // subGroups (Numbers, Calendar & Time) render as labeled sub-sections instead of one flat
  // grid - each entry's `type` decides which sub-section it falls into. Tile navigation still
  // uses the GLOBAL index into groupDef.items (not a position within the sub-grid), so
  // foundationsCard.js's Prev/Next keeps working across sub-section boundaries unchanged.
  if (groupDef.subGroups) {
    for (const sub of groupDef.subGroups) {
      const entries = indexed.filter(({ item }) => item.type === sub.type);
      if (entries.length === 0) continue;
      container.appendChild(el('h2', { style: 'margin:20px 0 10px;font-size:14px;letter-spacing:0.04em;text-transform:uppercase;color:var(--cream-dim)' }, sub.label));
      container.appendChild(buildGrid(entries));
    }
  } else {
    container.appendChild(el('div', { style: 'margin-top:16px' }, buildGrid(indexed)));
  }
}

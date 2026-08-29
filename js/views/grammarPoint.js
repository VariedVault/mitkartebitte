import { el, speakerButton, backLink } from '../ui/components.js';
import { pointById, CASE_COLORS, GENDER_COLORS } from '../data/grammarPoints.js';
import { navigate } from '../router.js';

/** Renders one structured paradigm table with optional case/gender color accents. Reuses
 *  the existing .conj-table styling so it looks native; accents are inline so no new CSS. */
function renderTable(table) {
  const wrap = el('div');
  if (table.caption) wrap.appendChild(el('div', { style: 'font-weight:700;color:var(--ink);margin:14px 0 6px;font-size:13.5px' }, table.caption));
  const t = el('table', { class: 'conj-table', style: 'margin:6px 0' });
  const tbody = el('tbody');

  if (table.columns) {
    const headRow = el('tr', { style: 'border-bottom:2px solid var(--cream-line)' });
    table.columns.forEach((col, i) => {
      const accent = table.colAccent && table.colAccent[i] ? GENDER_COLORS[table.colAccent[i]] : null;
      headRow.appendChild(
        el('td', { style: `font-weight:800;color:${accent || 'var(--ink)'};font-size:13px` }, col)
      );
    });
    tbody.appendChild(headRow);
  }

  table.rows.forEach((row, ri) => {
    const tr = el('tr');
    const rowAccent = table.rowAccent && table.rowAccent[ri] ? CASE_COLORS[table.rowAccent[ri]] : null;
    if (row.label != null) {
      tr.appendChild(
        el('td', { style: `font-weight:700;color:${rowAccent || 'var(--ink)'};border-left:${rowAccent ? `4px solid ${rowAccent}` : 'none'};padding-left:${rowAccent ? '10px' : '12px'}` }, row.label)
      );
    }
    row.cells.forEach((cell, ci) => {
      // When a table has both a label column and colAccent, colAccent index 0 aligns to the
      // label column (usually null), so cells map to colAccent[ci + (hasLabel?1:0)].
      const accentIdx = row.label != null ? ci + 1 : ci;
      const accent = table.colAccent && table.colAccent[accentIdx] ? GENDER_COLORS[table.colAccent[accentIdx]] : null;
      tr.appendChild(el('td', { class: 'form-cell', style: accent ? `color:${accent};font-weight:700` : '' }, cell));
    });
    tbody.appendChild(tr);
  });

  t.appendChild(tbody);
  wrap.appendChild(t);
  return wrap;
}

export function renderGrammarPoint(container, { pointId, setBreadcrumb }) {
  const point = pointById(pointId);
  container.innerHTML = '';
  container.appendChild(backLink('A1 Cases & Grammar', () => navigate('/cases/a1')));

  if (!point) {
    setBreadcrumb('Cases & Grammar');
    container.appendChild(el('div', { class: 'card' }, 'That grammar point does not exist.'));
    return;
  }
  setBreadcrumb(`Grammar · ${point.title}`);

  container.appendChild(el('h1', {}, point.title));
  container.appendChild(el('p', { style: 'color:var(--cream-dim)' }, `${point.tier} · reference - nothing here is graded.`));

  const card = el('div', { class: 'card explain' });
  card.appendChild(el('p', { style: 'margin-top:0' }, point.explanation));

  const tables = point.tables || (point.table ? [point.table] : []);
  for (const tbl of tables) card.appendChild(renderTable(tbl));

  if (point.examples && point.examples.length) {
    card.appendChild(el('h3', {}, 'Examples'));
    for (const ex of point.examples) {
      const row = el('div', { class: 'example-line', style: 'flex-direction:column;align-items:flex-start;gap:4px' });
      row.appendChild(
        el('div', { style: 'display:flex;align-items:center;gap:8px;width:100%;justify-content:space-between' }, [
          el('span', { style: 'font-weight:700' }, ex.de),
          speakerButton(ex.de),
        ])
      );
      row.appendChild(el('div', { style: 'color:var(--ink-soft);font-family:var(--font-body);font-size:13px' }, ex.en));
      if (ex.note) row.appendChild(el('div', { style: 'color:var(--ink-soft);font-family:var(--font-body);font-size:12.5px;font-style:italic;margin-top:2px' }, ex.note));
      card.appendChild(row);
    }
  }

  container.appendChild(card);
}

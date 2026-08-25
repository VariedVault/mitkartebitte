import { el, speakerButton, backLink } from '../ui/components.js';
import { GROUPS } from './foundationsHome.js';
import { navigate } from '../router.js';

const TYPE_LABELS = { letter: 'Letter', umlaut: 'Umlaut', digraph: 'Sound combination', special: 'Special rule' };

/** What the "character" speaker button actually says. Letters/umlauts speak cleanly on
 *  their own (a single character reads fine via TTS). The tricky-sound entries' `character`
 *  field is a visual label meant for the card heading ("EI vs IE", "-ER (at the end of a
 *  word)") rather than a pronounceable string, so those speak the example word instead -
 *  the concept itself isn't a single sayable word, but the example demonstrates it. */
function spokenCharacter(item) {
  return item.type === 'letter' || item.type === 'umlaut' ? item.character : item.exampleWord;
}

export async function renderFoundationsCard(container, { group, index, setBreadcrumb }) {
  const groupDef = GROUPS.find((g) => g.id === group);
  const i = Number(index);
  const item = groupDef?.items[i];
  container.innerHTML = '';
  container.appendChild(backLink(groupDef ? groupDef.label : 'Foundations', () => navigate(groupDef ? `/foundations/${group}` : '/foundations')));

  if (!groupDef || !item) {
    setBreadcrumb('Foundations');
    container.appendChild(el('div', { class: 'card' }, 'That Foundations card doesn\'t exist.'));
    return;
  }
  setBreadcrumb(`Foundations · ${groupDef.label} · ${item.character}`);

  const scene = el('div', { class: 'foundation-card-scene' });
  const card = el('div', { class: 'card foundation-card' });
  const scroll = el('div', { class: 'foundation-card-scroll' });

  const headRow = el('div', { style: 'display:flex;align-items:center;justify-content:space-between;gap:10px' });
  headRow.appendChild(
    el('div', { style: 'display:flex;align-items:center;gap:10px' }, [
      el('span', { class: 'foundation-glyph' }, item.character),
      speakerButton(spokenCharacter(item), `Listen: ${spokenCharacter(item)}`),
    ])
  );
  headRow.appendChild(el('span', { class: 'chip', style: 'background:var(--cream-dim);color:var(--ink-soft)' }, TYPE_LABELS[item.type] || item.type));
  scroll.appendChild(headRow);

  scroll.appendChild(el('div', { class: 'rule-box', style: 'margin-top:16px' }, el('p', { style: 'margin:0' }, item.soundDescription)));

  scroll.appendChild(
    el('div', { class: 'example-line', style: 'margin-top:12px' }, [
      el('div', {}, [
        el('span', { style: 'font-weight:700' }, item.exampleWord),
        el('span', { style: 'color:var(--ink-soft);font-family:var(--font-body);font-size:12.5px;margin-left:8px' }, item.exampleWordEnglish),
      ]),
      speakerButton(item.exampleWord),
    ])
  );

  if (item.note) {
    scroll.appendChild(el('p', { style: 'margin-top:12px;color:var(--ink-soft);font-size:13px' }, item.note));
  }

  const items = groupDef.items;
  const nav = el('div', { class: 'toolbar', style: 'justify-content:space-between;margin-top:18px' });
  const prevBtn = el('button', { class: 'btn' }, '← Prev');
  prevBtn.disabled = i === 0;
  prevBtn.addEventListener('click', () => navigate(`/foundations/${group}/${i - 1}`));
  const counter = el('span', { style: 'color:var(--ink-soft);font-size:12.5px;align-self:center' }, `${i + 1} / ${items.length}`);
  const nextBtn = el('button', { class: 'btn' }, 'Next →');
  nextBtn.disabled = i === items.length - 1;
  nextBtn.addEventListener('click', () => navigate(`/foundations/${group}/${i + 1}`));
  nav.appendChild(prevBtn);
  nav.appendChild(counter);
  nav.appendChild(nextBtn);
  scroll.appendChild(nav);

  card.appendChild(scroll);
  scene.appendChild(card);
  container.appendChild(scene);
}

import * as store from '../store.js';
import { el, backLink } from '../ui/components.js';
import { LETTERS, UMLAUTS, TRICKY_SOUNDS, NUMBERS, CALENDAR_TIME } from '../data/foundations.js';
import { navigate } from '../router.js';

// Foundations is reference material, not drilled - no SRS facts, no checkpoint. The only
// per-profile state is a single "studied" boolean (store.setSetting key 'foundationsStudied'),
// tracked exactly like any other setting, not a new storage concept.
//
// subGroups (optional) splits a section's tile grid into labeled sub-sections instead of one
// flat grid - see foundationsGroup.js. Each entry's `type` decides which sub-section it
// falls into; order here is the order they render in.
export const GROUPS = [
  { id: 'letters', label: 'Letters A–Z', emoji: '🔤', items: LETTERS, blurb: 'The alphabet - how each letter is named and what it sounds like in a word.' },
  { id: 'umlauts', label: 'Umlauts & ß', emoji: '✏️', items: UMLAUTS, blurb: 'ä, ö, ü, and ß - sounds English simply doesn\'t have.' },
  { id: 'tricky', label: 'Tricky Sounds', emoji: '👂', items: TRICKY_SOUNDS, blurb: 'The combinations and quirks that trip up beginners - ch, sch, ei vs ie, and more.' },
  {
    id: 'numbers', label: 'Numbers', emoji: '🔢', items: NUMBERS,
    blurb: '0–100 - how to say them, and the backwards-order rule German uses for combining them.',
    subGroups: [
      { label: '0–20', type: 'number-basic' },
      { label: 'Decades (20–100)', type: 'number-decade' },
      { label: 'Combining the pattern', type: 'number-compound' },
    ],
  },
  {
    id: 'calendar', label: 'Calendar & Time', emoji: '📅', items: CALENDAR_TIME,
    blurb: 'Weekdays, months, seasons, and today/tomorrow/yesterday.',
    subGroups: [
      { label: 'Weekdays', type: 'weekday' },
      { label: 'Months', type: 'month' },
      { label: 'Seasons', type: 'season' },
      { label: 'Today, Tomorrow, Yesterday', type: 'time-word' },
    ],
  },
];

function groupCard(profileId, group) {
  const card = el('button', { class: 'card track-card', style: 'text-align:left' });
  card.appendChild(el('div', { class: 'track-card-title' }, [`${group.emoji} ${group.label}`, el('span', { class: 'track-card-tag' }, String(group.items.length))]));
  card.appendChild(el('p', { style: 'color:var(--ink-soft);margin:0' }, group.blurb));
  card.addEventListener('click', () => navigate(`/foundations/${group.id}`));
  return card;
}

export async function renderFoundationsHome(container, { profileId, setBreadcrumb }) {
  setBreadcrumb('Learn · Foundations');
  container.innerHTML = '';
  container.appendChild(backLink('Learn', () => navigate('')));

  container.appendChild(el('h1', {}, '🔤 Foundations'));
  container.appendChild(
    el('p', { style: 'color:var(--cream-dim)' }, 'A from-zero pronunciation primer - the alphabet, umlauts, and the sound rules that trip up beginners. Reference only: read anytime, nothing here is graded or drilled.')
  );

  const studied = !!store.getSettings(profileId).foundationsStudied;
  const studiedCard = el('div', { class: 'card', style: 'display:flex;align-items:center;justify-content:space-between;gap:12px' });
  studiedCard.appendChild(
    el('div', {}, [
      el('p', { style: 'margin:0;font-weight:700;color:var(--ink)' }, studied ? '✓ Marked as studied' : 'Not yet marked as studied'),
      el('p', { style: 'margin:4px 0 0;color:var(--ink-soft);font-size:12.5px' }, 'A personal checkbox only - no score, no quiz, no streak.'),
    ])
  );
  const toggleBtn = el('button', { class: `btn ${studied ? '' : 'btn-primary'}` }, studied ? 'Unmark' : 'Mark as studied');
  toggleBtn.addEventListener('click', () => {
    store.setSetting(profileId, 'foundationsStudied', !studied);
    renderFoundationsHome(container, { profileId, setBreadcrumb });
  });
  studiedCard.appendChild(toggleBtn);
  container.appendChild(studiedCard);

  container.appendChild(el('h2', { style: 'margin:24px 0 12px;font-size:15px;letter-spacing:0.04em;text-transform:uppercase;color:var(--cream-dim)' }, 'Sections'));
  const grid = el('div', { style: 'display:flex;flex-direction:column;gap:12px' });
  for (const group of GROUPS) grid.appendChild(groupCard(profileId, group));
  container.appendChild(grid);
}

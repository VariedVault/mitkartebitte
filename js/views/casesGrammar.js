// Cases & Grammar - a PLACEHOLDER shell only. No real grammar content, no drillable facts,
// no SRS/Practice wiring, no checkpoint logic - just a Learn-screen section plus three stub
// pages listing the planned content for each tier. Deliberately self-contained in this one
// file so wiring it in only needs a one-line import + one appended section on the Learn
// screen and one new /cases/:tier route, changing no existing behavior.

import * as store from '../store.js';
import { el, backLink, tierCard } from '../ui/components.js';
import { navigate } from '../router.js';
import { pointsForTier } from '../data/grammarPoints.js';

export const CASES_TIERS = [
  {
    id: 'a1',
    level: 'A1',
    title: 'Cases & Prepositions',
    blurb: 'Genders, the four cases, and the fixed-case prepositions.',
    planned: [
      'der / die / das — the three genders',
      'The 4 cases: Nominativ, Akkusativ, Dativ, Genitiv',
      'Der-word declension table',
      'Ein-word declension table',
      'Fixed-case prepositions (Akkusativ: für, durch, gegen, ohne, um · Dativ: mit, nach, bei, seit, von, zu, aus)',
    ],
  },
  {
    id: 'a2',
    level: 'A2',
    title: 'Two-way Prepositions & Adjectives',
    blurb: 'Prepositions that switch case, and the first adjective endings.',
    planned: [
      'Wechselpräpositionen (in, an, auf, über, unter, vor, hinter, neben, zwischen)',
      'Wohin (Akkusativ) vs Wo (Dativ)',
      'Adjektivdeklination — introduction (weak declension)',
    ],
  },
  {
    id: 'b1',
    level: 'B1',
    title: 'Declensions & Relative Pronouns',
    blurb: 'Full adjective endings, relative clauses, and Genitiv prepositions.',
    planned: [
      'Adjektivdeklination — full (weak / mixed / strong)',
      'Relativpronomen — relative clauses by case + gender',
      'Genitiv prepositions (trotz, während, wegen)',
    ],
  },
];

/** The Learn-screen "Cases & Grammar" section - compact, colour-coded A1/A2/B1 tiles
 *  matching the Conjugation and Vocabulary tracks (shared tierCard). */
export function casesSection(profileId) {
  const wrap = el('div');
  wrap.appendChild(el('h2', { style: 'margin:16px 0 10px;font-size:15px;letter-spacing:0.04em;text-transform:uppercase;color:var(--cream-dim)' }, 'Cases & Grammar'));
  const grid = el('div', { class: 'level-grid' });
  for (const tier of CASES_TIERS) {
    const T = tier.level; // 'A1' | 'A2' | 'B1'
    const n = pointsForTier(T).length;
    grid.appendChild(tierCard({
      tier: T,
      caption: `${n} point${n === 1 ? '' : 's'}`,
      done: store.isGrammarCheckpointPassed(profileId, T),
      onClick: () => navigate(`/cases/${tier.id}`),
    }));
  }
  wrap.appendChild(grid);
  return wrap;
}

/** Stub page for one tier - renders inside the existing shell (header/footer/nav), showing a
 *  "Coming soon" heading and the static planned-content list. No interactivity of any kind. */
export function renderCasesStub(container, { tier, setBreadcrumb }) {
  const t = CASES_TIERS.find((x) => x.id === tier);
  container.innerHTML = '';
  container.appendChild(backLink('Learn', () => navigate('')));

  if (!t) {
    setBreadcrumb('Cases & Grammar');
    container.appendChild(el('div', { class: 'card' }, 'That page doesn\'t exist yet.'));
    return;
  }
  setBreadcrumb(`Learn · ${t.level} Cases & Grammar`);

  container.appendChild(el('h1', {}, `${t.level} · ${t.title}`));

  const card = el('div', { class: 'card explain' });
  card.appendChild(el('h3', { style: 'margin-top:0' }, 'Coming soon'));
  card.appendChild(el('p', {}, 'Planned content for this tier:'));
  const list = el('ul', { style: 'margin:8px 0 0;padding-left:20px;line-height:1.7;color:var(--ink)' });
  for (const item of t.planned) list.appendChild(el('li', {}, item));
  card.appendChild(list);
  card.appendChild(el('p', { style: 'margin-top:16px;color:var(--ink-soft);font-size:13px' }, 'This section is under construction.'));
  container.appendChild(card);
}

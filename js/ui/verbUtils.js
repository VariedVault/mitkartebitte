// Small shared helpers over the new verbs-a1.js schema - table lookups, fact keys, and
// display labels. There's no drill/quiz engine here (the old fill-in/multiple-choice
// system is gone) - Practice is flashcard-style flip cards, built in views/practice.js.

import { PRONOUNS } from '../data/verbs-a1.js';
import { el, speakerButton } from './components.js';

export const TENSE_LABELS = {
  praesens: 'Präsens',
  imperativ: 'Imperativ',
  perfekt: 'Perfekt',
  praeteritum: 'Präteritum',
  konjunktiv2: 'Konjunktiv II',
  futur1: 'Futur I',
  plusquamperfekt: 'Plusquamperfekt',
  passiv: 'Passiv',
};

const IMPERATIV_FORMS = ['du', 'ihr', 'Sie'];

export function pronounsFor(tense) {
  return tense === 'imperativ' ? IMPERATIV_FORMS : PRONOUNS;
}

export const PRONOUN_LABELS = { ich: 'ich', du: 'du', er: 'er/sie/es', wir: 'wir', ihr: 'ihr', sie: 'sie/Sie' };

export function pronounLabel(tense, pronoun) {
  return tense === 'imperativ' ? pronoun : PRONOUN_LABELS[pronoun];
}

/** One natural pronoun word for TTS - pronounLabel's "er/sie/es"/"sie/Sie" display
 *  form is correct to show (both share the same verb form, worth clarifying visually),
 *  but speech synthesis would otherwise try to read the literal slash character aloud. */
export function spokenPronoun(tense, pronoun) {
  return pronounLabel(tense, pronoun).split('/')[0];
}

/** Direct table lookup - the new schema stores every tense as a plain per-pronoun object
 *  (or null if that tense isn't populated yet for this course phase), so there's nothing
 *  to derive at read time anymore. */
export function getForm(verb, tense, pronoun) {
  return verb.tables[tense]?.[pronoun] ?? null;
}

/** Tenses this verb actually has data for in the current phase. */
export function availableTenses(verb) {
  return Object.keys(verb.tables).filter((t) => verb.tables[t] != null);
}

export function factKeyFor(verb, tense, pronoun) {
  return `${verb.infinitive}|${tense}|${pronoun}`;
}

export function factLabel(verb, tense, pronoun) {
  return `${pronoun ? pronounLabel(tense, pronoun) + ' · ' : ''}${verb.infinitive} (${TENSE_LABELS[tense]})`;
}

/** Every fact key a set of verbs can produce across the given tenses - used for mastery %,
 *  the due-today count, and building the cumulative Practice pool. */
export function factKeysFor(verbs, tenses) {
  const keys = [];
  for (const verb of verbs) {
    for (const tense of tenses) {
      if (verb.tables[tense] == null) continue;
      for (const pronoun of pronounsFor(tense)) {
        if (getForm(verb, tense, pronoun) != null) keys.push(factKeyFor(verb, tense, pronoun));
      }
    }
  }
  return keys;
}

/** Full conjugation table for one verb/tense, pronoun-color-coded - shared by the verb
 *  card page, the grammar reference pages, and Practice's flip-card reveal fallback, so
 *  the visual language (and color-per-pronoun memory aid) stays identical everywhere. */
export function conjugationTable(verb, tense, highlightPronoun) {
  const table = el('table', { class: 'conj-table' });
  const tbody = el('tbody');
  for (const p of pronounsFor(tense)) {
    const form = getForm(verb, tense, p);
    if (form == null) continue;
    tbody.appendChild(
      el('tr', { style: p === highlightPronoun ? 'font-weight:800' : '' }, [
        el('td', { class: `pron-cell pron-${tense === 'imperativ' ? '' : p}`.trim() }, pronounLabel(tense, p)),
        el('td', { class: 'form-cell' }, [form, ' ', speakerButton(form)]),
      ])
    );
  }
  table.appendChild(tbody);
  return table;
}

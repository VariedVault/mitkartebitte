// Small shared helpers over the new verbs-a1.js schema - table lookups, fact keys, and
// display labels. There's no drill/quiz engine here (the old fill-in/multiple-choice
// system is gone) - Practice is flashcard-style flip cards, built in views/practice.js.

import { PRONOUNS } from '../data/verbs-a1.js';

export const TENSE_LABELS = {
  praesens: 'Präsens',
  imperativ: 'Imperativ',
  perfekt: 'Perfekt',
  praeteritum: 'Präteritum',
  konjunktiv2: 'Konjunktiv II',
  futur1: 'Futur I',
  plusquamperfekt: 'Plusquamperfekt',
  passivPraesens: 'Passiv (Präsens)',
  passivPraeteritum: 'Passiv (Präteritum)',
  passivPerfekt: 'Passiv (Perfekt)',
  passivZustand: 'Zustandspassiv',
};

// One consistent color per tense, everywhere a tense appears (verb-card columns, grammar-
// rule tiles) - the same "color as memory aid" idea already used for pronouns. Keyed by
// lesson id, not raw table key - all 4 Passiv slots (passivPraesens/praeteritum/perfekt/
// zustand) share the single "passiv" color, since they're one lesson/one concept.
export const TENSE_COLORS = {
  praesens: '#FF6B6B',
  imperativ: '#FFA94D',
  perfekt: '#4ECDC4',
  praeteritum: '#6C8EFF',
  konjunktiv2: '#C77DFF',
  futur1: '#5FD98A',
  plusquamperfekt: '#FFD166',
  passiv: '#F783AC',
};

/** Accepts either a lesson id ('passiv') or an exact table key ('passivPraesens', ...) -
 *  callers with a raw tables[key] name don't need to know about the lesson-id collapsing. */
export function tenseColorFor(tenseKey) {
  const lessonId = tenseKey.startsWith('passiv') ? 'passiv' : tenseKey;
  return TENSE_COLORS[lessonId] || 'var(--gold)';
}

const IMPERATIV_FORMS = ['du', 'ihr', 'Sie'];

// Canonical display order - later phases append new keys to the end, never reorder, so a
// verb's tense sections always appear in the same learn-progression order. Passiv is 4
// separate flat-table tense slots (Vorgangspassiv in 3 sub-tenses + Zustandspassiv) rather
// than 1 - each is either a plain 6-pronoun table or null (not authored yet, OR verb is
// intransitive and genuinely takes no personal passive - see rules.js's buildPassiv), so
// every existing generic consumer (availableTenses, factKeysFor, the verb-card columns,
// checkpoint/practice pools) needs zero special-casing to support them.
export const TENSE_ORDER = [
  'praesens', 'imperativ', 'perfekt', 'praeteritum',
  'konjunktiv2', 'futur1', 'plusquamperfekt',
  'passivPraesens', 'passivPraeteritum', 'passivPerfekt', 'passivZustand',
];

export function pronounsFor(tense) {
  return tense === 'imperativ' ? IMPERATIV_FORMS : PRONOUNS;
}

/** "sich fühlen" for reflexive verbs, else the bare infinitive - reflexive verbs store
 *  just the bare base infinitive (rule-engine functions operate on that), so "sich " is
 *  prepended only where the infinitive is actually displayed to a learner. */
export function displayInfinitive(verb) {
  return verb.reflexive ? `sich ${verb.infinitive}` : verb.infinitive;
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

/** Tenses this verb actually has data for in the current phase, in canonical order. */
export function availableTenses(verb) {
  return TENSE_ORDER.filter((t) => verb.tables[t] != null);
}

export const LEVEL_ORDER = ['A1', 'A2', 'B1'];

/** Which level each tense is pedagogically introduced at - independent of which verbs
 *  happen to carry DATA for it. The spiral revisit backfills Präteritum onto every A1 verb,
 *  and Konjunktiv II/Futur I/Plusquamperfekt/Passiv onto every A1+A2 verb, so that once a
 *  learner unlocks the later checkpoint those verbs can resurface in the cumulative
 *  Practice pool with their new tense - but that's a Practice-pool concern, not a reason to
 *  SHOW "Konjunktiv II" on a first-time learner's A1 "sein" card. studyTenses() below is
 *  the display-side cap; the underlying data/mastery tracking is intentionally untouched. */
export const TENSE_LEVEL = {
  praesens: 'A1', imperativ: 'A1', perfekt: 'A1',
  praeteritum: 'A2',
  konjunktiv2: 'B1', futur1: 'B1', plusquamperfekt: 'B1',
  passivPraesens: 'B1', passivPraeteritum: 'B1', passivPerfekt: 'B1', passivZustand: 'B1',
};

/** True when `level` is at or beyond `minLevel` in the course progression. */
export function levelAtLeast(level, minLevel) {
  return LEVEL_ORDER.indexOf(level) >= LEVEL_ORDER.indexOf(minLevel);
}

/** availableTenses(), further capped to what's appropriate to DISPLAY given the verb's own
 *  level - an A1 verb only ever shows Präsens/Imperativ/Perfekt on its own card, even
 *  though the data underneath carries every tense for the cumulative Practice pool. Use
 *  this for what a learner reads on a verb's page; keep using availableTenses() for
 *  mastery/fact-key calculations, which should reflect everything actually drilled in
 *  Practice, not just what's shown here. */
export function studyTenses(verb) {
  return availableTenses(verb).filter((t) => levelAtLeast(verb.level, TENSE_LEVEL[t]));
}

export function factKeyFor(verb, tense, pronoun) {
  return `${verb.infinitive}|${tense}|${pronoun}`;
}

export function factLabel(verb, tense, pronoun) {
  return `${pronoun ? pronounLabel(tense, pronoun) + ' · ' : ''}${displayInfinitive(verb)} (${TENSE_LABELS[tense]})`;
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


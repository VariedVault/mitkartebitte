// Generates exercises from verb data. Shared by every module - this is what lets all
// 16 modules ship at uniform quality without 16 bespoke drill implementations.

import { PRONOUNS, PRONOUN_LABELS } from '../data/verbs.js';
import * as C from '../data/conjugate.js';
import { VERBS } from '../data/verbs.js';

export const TENSE_LABELS = {
  praesens: 'Präsens',
  praeteritum: 'Präteritum',
  perfekt: 'Perfekt',
  plusquamperfekt: 'Plusquamperfekt',
  futur1: 'Futur I',
  futur2: 'Futur II',
  konjunktiv2: 'Konjunktiv II',
  konjunktiv2perfekt: 'Konjunktiv II (Perfekt)',
  konjunktiv1: 'Konjunktiv I',
  konjunktiv1perfekt: 'Konjunktiv I (Perfekt)',
  passivVorgang: 'Passiv (Präsens)',
  passivVorgangPraeteritum: 'Passiv (Präteritum)',
  passivZustand: 'Zustandspassiv',
  imperativ: 'Imperativ',
};

const IMPERATIV_FORMS = ['du', 'ihr', 'Sie'];

/** Single dispatcher over the raw tables + conjugate.js derivations. */
export function getForm(verb, tense, pronoun) {
  switch (tense) {
    case 'praesens': return verb.tables.praesens?.[pronoun] ?? null;
    case 'praeteritum': return verb.tables.praeteritum?.[pronoun] ?? null;
    case 'perfekt': return C.getPerfekt(verb, pronoun);
    case 'plusquamperfekt': return C.getPlusquamperfekt(verb, pronoun);
    case 'futur1': return C.getFutur1(verb, pronoun);
    case 'futur2': return C.getFutur2(verb, pronoun);
    case 'konjunktiv2': return C.getKonjunktiv2(verb, pronoun);
    case 'konjunktiv2perfekt': return C.getKonjunktiv2Perfekt(verb, pronoun);
    case 'konjunktiv1': return C.getKonjunktiv1(verb, pronoun);
    case 'konjunktiv1perfekt': return C.getKonjunktiv1Perfekt(verb, pronoun);
    case 'passivVorgang': return C.getPassivVorgang(verb, pronoun);
    case 'passivVorgangPraeteritum': return C.getPassivVorgangPraeteritum(verb, pronoun);
    case 'passivZustand': return C.getPassivZustand(verb, pronoun);
    case 'imperativ': return verb.tables.imperativ ? verb.tables.imperativ[pronoun] : null;
    default: return null;
  }
}

export function pronounsFor(tense) {
  return tense === 'imperativ' ? IMPERATIV_FORMS : PRONOUNS;
}

export function pronounLabel(tense, pronoun) {
  return tense === 'imperativ' ? pronoun : PRONOUN_LABELS[pronoun];
}

/** Short human-readable label for a fact, used in review lists and headers. */
export function factLabel(verb, tense, pronoun) {
  return `${pronoun ? pronounLabel(tense, pronoun) + ' · ' : ''}${verb.infinitive} (${TENSE_LABELS[tense]})`;
}

export function factKeyFor(verb, tense, pronoun) {
  return `${verb.infinitive}|${tense}|${pronoun}`;
}

// ---------------------------------------------------------------- answer checking

function normalize(s) {
  return String(s || '').trim().toLowerCase().replace(/ß/g, 'ss').replace(/\s+/g, ' ');
}
function asciiFallback(s) {
  return s.replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue');
}
export function answersMatch(input, target) {
  if (target == null) return false;
  const ni = normalize(input);
  const nt = normalize(target);
  return ni === nt || asciiFallback(ni) === asciiFallback(nt);
}

// ---------------------------------------------------------------- exercise builders

function randomPick(arr, n, exclude = new Set()) {
  const pool = arr.filter((x) => !exclude.has(x));
  const picked = [];
  const copy = [...pool];
  while (picked.length < n && copy.length) {
    const i = Math.floor(Math.random() * copy.length);
    picked.push(copy.splice(i, 1)[0]);
  }
  return picked;
}

/** { type:'fill', verb, tense, pronoun, answer, factKey } */
export function buildFillBlank(verb, tense, pronoun) {
  const answer = getForm(verb, tense, pronoun);
  if (answer == null) return null;
  return { type: 'fill', verb, tense, pronoun, answer, factKey: factKeyFor(verb, tense, pronoun) };
}

/** { type:'mc', verb, tense, pronoun, answer, choices:[...], factKey } */
export function buildMultipleChoice(verb, tense, pronoun, pool) {
  const answer = getForm(verb, tense, pronoun);
  if (answer == null) return null;
  const candidatePool = (pool && pool.length >= 6 ? pool : VERBS).filter((v) => v.infinitive !== verb.infinitive);
  const seen = new Set([answer]);
  const distractors = [];
  const shuffled = [...candidatePool].sort(() => Math.random() - 0.5);
  for (const other of shuffled) {
    const form = getForm(other, tense, pronoun);
    if (form && !seen.has(form)) {
      seen.add(form);
      distractors.push(form);
    }
    if (distractors.length === 3) break;
  }
  // Pad with other-pronoun forms of the same verb if the pool couldn't fill 3 (tiny pools).
  if (distractors.length < 3) {
    for (const p of pronounsFor(tense)) {
      if (distractors.length === 3) break;
      const form = getForm(verb, tense, p);
      if (form && !seen.has(form)) {
        seen.add(form);
        distractors.push(form);
      }
    }
  }
  const choices = [...distractors, answer].sort(() => Math.random() - 0.5);
  return { type: 'mc', verb, tense, pronoun, answer, choices, factKey: factKeyFor(verb, tense, pronoun) };
}

/** { type:'table', verb, tense, cells:[{pronoun, answer, factKey}] } */
export function buildTableCompletion(verb, tense) {
  const pronouns = pronounsFor(tense);
  const cells = pronouns
    .map((p) => ({ pronoun: p, answer: getForm(verb, tense, p), factKey: factKeyFor(verb, tense, p) }))
    .filter((c) => c.answer != null);
  if (cells.length === 0) return null;
  return { type: 'table', verb, tense, cells };
}

/**
 * Builds one exercise for a fact key using the requested type, choosing pool for MC
 * distractors. Falls back to 'fill' if the requested type can't be built for this fact.
 */
export function buildExerciseForFact(factKey, type, pool) {
  const [infinitive, tense, pronoun] = factKey.split('|');
  const verb = VERBS.find((v) => v.infinitive === infinitive);
  if (!verb) return null;
  if (type === 'mc') return buildMultipleChoice(verb, tense, pronoun, pool) || buildFillBlank(verb, tense, pronoun);
  return buildFillBlank(verb, tense, pronoun);
}

/** All fact keys a module could drill, given its verb pool + tense list. */
export function factKeysForModule(verbPool, tenses) {
  const keys = [];
  for (const verb of verbPool) {
    for (const tense of tenses) {
      for (const pronoun of pronounsFor(tense)) {
        if (getForm(verb, tense, pronoun) != null) keys.push(factKeyFor(verb, tense, pronoun));
      }
    }
  }
  return keys;
}

// Verb-form lookup + fact-key helpers shared across the study pages, the course map, and
// the cumulative Practice tab.

import { PRONOUNS, PRONOUN_LABELS } from '../data/verbs.js';
import * as C from '../data/conjugate.js';

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

/** Short human-readable label for a fact, used in Practice's review lists and headers. */
export function factLabel(verb, tense, pronoun) {
  return `${pronoun ? pronounLabel(tense, pronoun) + ' · ' : ''}${verb.infinitive} (${TENSE_LABELS[tense]})`;
}

export function factKeyFor(verb, tense, pronoun) {
  return `${verb.infinitive}|${tense}|${pronoun}`;
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

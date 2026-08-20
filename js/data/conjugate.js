// Derives compound tenses from the hand-authored primitives in verbs.js.
//
// Why derive instead of hand-author everything: perfekt/plusquamperfekt/futur/passiv are
// pure SENTENCE ASSEMBLY (auxiliary + participle/infinitive in a fixed slot) — that rule
// never changes between weak and strong verbs. The irregularity always lives in the piece
// being assembled (the partizip2, the auxiliary choice), and those come from verbs.js,
// which IS hand-authored and verified. So deriving here never guesses a strong-verb stem —
// it only combines already-verified pieces. Konjunktiv I is genuinely regular for nearly
// every German verb (sein is the sole hand-authored exception), so it's derived too.

import { VERBS, PRONOUNS, REFLEXIVE_PRONOUNS } from './verbs.js';

const byInfinitive = new Map(VERBS.map((v) => [v.infinitive, v]));
const SEIN = byInfinitive.get('sein');
const HABEN = byInfinitive.get('haben');
const WERDEN = byInfinitive.get('werden');

function auxTable(auxiliary, tense) {
  const v = auxiliary === 'sein' ? SEIN : HABEN;
  return v.tables[tense];
}

/**
 * Reflexive verbs are only reflexive-pronoun-free in the single-word tenses (praesens,
 * praeteritum, konjunktiv1, synthetic konjunktiv2) — there the bare verb form is tested
 * as its own atomic fact, with reflexivity communicated by the UI around it. Any
 * MULTI-WORD/compound tense assembled here would be grammatically incomplete without the
 * reflexive pronoun baked in ("hat gefreut" is wrong; "hat sich gefreut" is correct), so
 * every compound-tense getter below inserts it via this helper.
 */
function reflexivePrefix(verb, pronoun) {
  return verb.reflexive ? `${REFLEXIVE_PRONOUNS[pronoun]} ` : '';
}

/** infinitive is stored as "sich freuen" — strip the "sich " when reassembling with a different pronoun. */
function bareInfinitive(verb) {
  return verb.reflexive ? verb.infinitive.replace(/^sich\s+/, '') : verb.infinitive;
}

/** "hat gemacht" / "hat sich gefreut" / "ist gefahren" — perfekt/plusquamperfekt. */
export function getPerfekt(verb, pronoun) {
  const aux = auxTable(verb.auxiliary, 'praesens')[pronoun];
  return `${aux} ${reflexivePrefix(verb, pronoun)}${verb.partizip2}`;
}

export function getPlusquamperfekt(verb, pronoun) {
  const aux = auxTable(verb.auxiliary, 'praeteritum')[pronoun];
  return `${aux} ${reflexivePrefix(verb, pronoun)}${verb.partizip2}`;
}

/** "wird fahren" / "wird sich freuen" — werden (praesens) + bare infinitive. */
export function getFutur1(verb, pronoun) {
  const werde = WERDEN.tables.praesens[pronoun];
  return `${werde} ${reflexivePrefix(verb, pronoun)}${bareInfinitive(verb)}`;
}

/** "wird gefahren sein" — werden (praesens) + partizip2 + aux-infinitive. */
export function getFutur2(verb, pronoun) {
  const werde = WERDEN.tables.praesens[pronoun];
  return `${werde} ${reflexivePrefix(verb, pronoun)}${verb.partizip2} ${verb.auxiliary}`;
}

const KONJ1_ENDINGS = { ich: 'e', du: 'est', er: 'e', wir: 'en', ihr: 'et', sie: 'en' };

/** Konjunktiv I — regular stem+ending rule for every verb except sein. */
export function getKonjunktiv1(verb, pronoun) {
  if (verb.infinitive === 'sein') {
    return { ich: 'sei', du: 'seist', er: 'sei', wir: 'seien', ihr: 'seiet', sie: 'seien' }[pronoun];
  }
  const stem = verb.infinitive.endsWith('en') ? verb.infinitive.slice(0, -2) : verb.infinitive.slice(0, -1);
  return stem + KONJ1_ENDINGS[pronoun];
}

/** Reported-speech Konjunktiv I perfekt: "er habe gemacht" / "sie sei gefahren". */
export function getKonjunktiv1Perfekt(verb, pronoun) {
  const auxVerb = verb.auxiliary === 'sein' ? SEIN : HABEN;
  const auxK1 = getKonjunktiv1(auxVerb, pronoun);
  return `${auxK1} ${reflexivePrefix(verb, pronoun)}${verb.partizip2}`;
}

/**
 * Konjunktiv II. Uses the hand-authored synthetic form when the verb declares one
 * (sein, haben, werden, wissen, the modals, denken, kommen — forms still alive in
 * everyday speech). Every other verb derives the würde + infinitive periphrasis,
 * which is how Konjunktiv II actually works for the vast majority of German verbs.
 */
export function getKonjunktiv2(verb, pronoun) {
  if (verb.konjunktiv2) return verb.konjunktiv2[pronoun];
  const wuerde = WERDEN.konjunktiv2[pronoun];
  return `${wuerde} ${reflexivePrefix(verb, pronoun)}${bareInfinitive(verb)}`;
}

export function getKonjunktiv2Perfekt(verb, pronoun) {
  const auxVerb = verb.auxiliary === 'sein' ? SEIN : HABEN;
  const auxK2 = getKonjunktiv2(auxVerb, pronoun);
  return `${auxK2} ${reflexivePrefix(verb, pronoun)}${verb.partizip2}`;
}

/** Vorgangspassiv (the "process passive", the one usually meant by "Passiv"): werden + partizip2. */
export function getPassivVorgang(verb, pronoun) {
  const werde = WERDEN.tables.praesens[pronoun];
  return `${werde} ${verb.partizip2}`;
}

export function getPassivVorgangPraeteritum(verb, pronoun) {
  const wurde = WERDEN.tables.praeteritum[pronoun];
  return `${wurde} ${verb.partizip2}`;
}

/** Zustandspassiv (the "state passive"): sein + partizip2. */
export function getPassivZustand(verb, pronoun) {
  const ist = SEIN.tables.praesens[pronoun];
  return `${ist} ${verb.partizip2}`;
}

/** Full main-clause imperativ text: prefix (if separable) placed at clause end, reflexive pronoun inserted. */
export function getFullForm(verb, tense, pronoun) {
  let base;
  switch (tense) {
    case 'praesens': base = verb.tables.praesens?.[pronoun]; break;
    case 'praeteritum': base = verb.tables.praeteritum?.[pronoun]; break;
    default: base = verb.tables.praesens?.[pronoun];
  }
  if (base == null) return null;
  return verb.separable ? `${base} ... ${verb.prefix}` : base;
}

export function getVerb(infinitive) {
  return byInfinitive.get(infinitive);
}

export { PRONOUNS };

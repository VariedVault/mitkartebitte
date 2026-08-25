// Pure rules for regular/derivable German verb forms. Every REGULAR form in the verb
// data is generated here, not hand-typed - "correct by construction": there is no class
// of transcription typo possible for a form this file produces. Only genuinely irregular
// stems/endings (stem-changers, strong ablaut, modals, sein/haben/werden, ...) are ever
// hand-authored in the verb data, and scripts/verify.mjs re-derives every verb NOT flagged
// as praesensIrregular and asserts it matches what shipped, so a future hand-edit that
// silently drifts from the rule gets caught, not just a one-time authoring aid.

export const PRONOUNS = ['ich', 'du', 'er', 'wir', 'ihr', 'sie'];

/** Infinitive minus the -en (or -n for the rare -eln/-ern/-eln class) ending. */
export function stemOf(infinitive) {
  if (infinitive.endsWith('eln') || infinitive.endsWith('ern')) return infinitive.slice(0, -1);
  return infinitive.slice(0, -2);
}

/**
 * German inserts a linking -e- before a raw -st/-t ending when the stem ends in a
 * consonant cluster that would otherwise be unpronounceable: stems ending in -d or -t
 * (arbeiten -> du arbeitest), or in -m/-n preceded by another consonant, excluding -l/-r/
 * a vowel before it (öffnen -> du öffnest, regnen -> es regnet; but wohnen, a normal
 * vowel+n stem, does NOT get one - du wohnst).
 */
export function needsLinkingE(stem) {
  if (/[dt]$/.test(stem)) return true;
  if (/[bcfgkpqsvwxz][mn]$/.test(stem)) return true;
  return false;
}

/** True when the stem ends in -s/-ß/-z/-x, where the du-ending contracts onto the
 *  er-ending instead of adding a separate -st (heißen -> du heißt, same as er heißt). */
export function isSStem(stem) {
  return /[sßzx]$/.test(stem);
}

/** True for the -eln/-ern verb class (ärgern, sammeln, wandern, ...) - their stem already
 *  ends in -er/-el, so wir/sie reuse the bare infinitive as-is (wir ärgern) instead of
 *  stem+en (which would wrongly double the syllable into "ärgeren"). */
function isElnErnClass(infinitive) {
  return infinitive.endsWith('eln') || infinitive.endsWith('ern');
}

/** Regular weak-verb Präsens: -e/-st/-t/-en/-t/-en off the bare stem, with the linking-e,
 *  s-stem-contraction, and -eln/-ern sub-rules applied. Only valid for verbs with no
 *  stem-vowel change in Präsens - stem-changing verbs (fahren, geben, ...) must override
 *  du/er. */
export function regularPraesens(infinitive) {
  const stem = stemOf(infinitive);
  const e = needsLinkingE(stem) ? 'e' : '';
  const sStem = isSStem(stem);
  const wirSie = isElnErnClass(infinitive) ? infinitive : `${stem}en`;
  return {
    ich: `${stem}e`,
    du: sStem ? `${stem}${e}t` : `${stem}${e}st`,
    er: `${stem}${e}t`,
    wir: wirSie,
    ihr: `${stem}${e}t`,
    sie: wirSie,
  };
}

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

/**
 * Regular Imperativ from an already-built Präsens table: du drops the -st (keeping the
 * linking -e if the stem needed one, for pronounceability - "Arbeite!" not "Arbeit!" -
 * and always for the -eln/-ern class, where dropping it would leave an ending that reads
 * as a noun/adjective rather than a command - confirmed "ärgere" over bare "ärger" against
 * Wiktionary), ihr reuses the ihr-Präsens form as-is, Sie is the bare infinitive + "Sie".
 */
export function regularImperativ(infinitive, praesensTable) {
  const stem = stemOf(infinitive);
  const e = needsLinkingE(stem) || isElnErnClass(infinitive) ? 'e' : '';
  return {
    du: `${capitalize(stem)}${e}!`,
    ihr: `${capitalize(praesensTable.ihr)}!`,
    Sie: `${capitalize(infinitive)} Sie!`,
  };
}

/** Perfekt table from an auxiliary's own Präsens table + this verb's partizip2 - pure
 *  sentence assembly (auxiliary + participle in a fixed slot), so it's always derived,
 *  never hand-typed, computed once here at data-authoring time instead of per-render.
 *  `reflexive` inserts the reflexive pronoun between auxiliary and participle - "hat sich
 *  gefreut", not "hat gefreut sich" (reflexive pronoun word order differs by tense/clause
 *  position in general, but always sits right after the finite verb piece here). */
export function buildPerfekt(auxiliaryPraesensTable, partizip2, reflexive) {
  const out = {};
  for (const p of PRONOUNS) {
    out[p] = reflexive ? `${auxiliaryPraesensTable[p]} ${REFLEXIVE_PRONOUNS[p]} ${partizip2}` : `${auxiliaryPraesensTable[p]} ${partizip2}`;
  }
  return out;
}

export const REFLEXIVE_PRONOUNS = { ich: 'mich', du: 'dich', er: 'sich', wir: 'uns', ihr: 'euch', sie: 'sich', Sie: 'sich' };

/** Bakes the reflexive pronoun onto every form in an already-built table (Präsens,
 *  Präteritum, or Imperativ shape) - "fühle" -> "fühle mich". Baked in at authoring time
 *  rather than computed per-render, so every view (verb card, Practice reveal, checkpoint)
 *  automatically shows/speaks the complete reflexive phrase with zero special-casing.
 *  Imperativ forms end in "!" - the pronoun goes BEFORE the punctuation ("Fühl dich!"),
 *  not after it ("Fühl! dich"), so that case is detected and handled specially. */
export function applyReflexive(table) {
  const out = {};
  for (const [pronoun, form] of Object.entries(table)) {
    const reflexivePronoun = REFLEXIVE_PRONOUNS[pronoun];
    out[pronoun] = form.endsWith('!') ? `${form.slice(0, -1)} ${reflexivePronoun}!` : `${form} ${reflexivePronoun}`;
  }
  return out;
}

/** ge- + stem + t, the regular weak partizip2 - only valid when there's no vowel/consonant
 *  irregularity (gemacht, gekauft, ...). Separable verbs infix ge- after the prefix. */
export function regularPartizip2(infinitive, prefix) {
  const stem = stemOf(infinitive.replace(prefix ? new RegExp(`^${prefix}`) : '', ''));
  const e = needsLinkingE(stem) ? 'e' : '';
  return prefix ? `${prefix}ge${stem}${e}t` : `ge${stem}${e}t`;
}

/** Regular weak-verb Präteritum: -te/-test/-te/-ten/-tet/-ten off the bare stem, with the
 *  same linking-e sub-rule as Präsens (arbeiten -> arbeitete, not "arbeitte"). Only valid
 *  for verbs with no vowel change - strong/mixed/modal verbs use the two functions below
 *  off a hand-typed irregular stem instead. */
export function regularPraeteritum(infinitive) {
  const stem = stemOf(infinitive);
  const e = needsLinkingE(stem) ? 'e' : '';
  return {
    ich: `${stem}${e}te`,
    du: `${stem}${e}test`,
    er: `${stem}${e}te`,
    wir: `${stem}${e}ten`,
    ihr: `${stem}${e}tet`,
    sie: `${stem}${e}ten`,
  };
}

/**
 * Strong-verb Präteritum from a hand-typed ich/er form (the irregular ablaut stem, e.g.
 * "ging", "fand", "hieß", "war") - ich/er take NO ending (a genuine irregularity: unlike
 * every other German tense, 1st/3rd singular are bare), du/wir/ihr/sie add -st/-en/-t/-en,
 * with the SAME linking-e (fand -> fandest, confirmed against Wiktionary) and s-stem
 * contraction (hieß -> du hießt, not "hießst", also confirmed) sub-rules as regular forms -
 * those two phonological rules aren't specific to weak verbs, they apply wherever a raw
 * -st/-t ending would land on the same trigger consonant cluster, strong stem or not.
 */
export function strongPraeteritumEndings(ichForm) {
  const e = needsLinkingE(ichForm) ? 'e' : '';
  const sStem = isSStem(ichForm);
  return {
    ich: ichForm,
    du: sStem ? `${ichForm}t` : `${ichForm}${e}st`,
    er: ichForm,
    wir: `${ichForm}en`,
    ihr: `${ichForm}${e}t`,
    sie: `${ichForm}en`,
  };
}

/**
 * Mixed-verb/modal Präteritum from a hand-typed COMPLETE ich/er form (the irregular piece
 * is the vowel change itself, already baked in - "kannte", "dachte", "konnte", "hatte",
 * "wurde"). Unlike strong verbs, these already end in the weak -te ending, so du/wir/ihr/
 * sie are plain concatenation (+st/+n/+t/+n) - no linking-e or s-stem logic needed, the
 * hand-typed form already resolved that.
 */
export function weakPraeteritumEndings(ichForm) {
  return {
    ich: ichForm,
    du: `${ichForm}st`,
    er: ichForm,
    wir: `${ichForm}n`,
    ihr: `${ichForm}t`,
    sie: `${ichForm}n`,
  };
}

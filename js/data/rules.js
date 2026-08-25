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

/** True for the -eln verb class (sammeln, entwickeln, ...) specifically - see isEln vs
 *  isErn below for why these need different ich-form/Imperativ handling despite sharing
 *  the "wir/sie reuse the bare infinitive" behavior. */
function isEln(infinitive) {
  return infinitive.endsWith('eln');
}

/** True for the -ern verb class (ärgern, wandern, ...). */
function isErn(infinitive) {
  return infinitive.endsWith('ern');
}

/** True for the -eln/-ern verb class together - their stem already ends in -er/-el, so
 *  wir/sie reuse the bare infinitive as-is (wir ärgern) instead of stem+en (which would
 *  wrongly double the syllable into "ärgeren"). */
function isElnErnClass(infinitive) {
  return isEln(infinitive) || isErn(infinitive);
}

/** -eln verbs contract their own stem's -e- away in the ich-form and du-Imperativ:
 *  "entwickeln" -> "ich entwickle" (NOT "entwickele" - confirmed against Wiktionary,
 *  which lists "entwickele" only as a secondary/less-common variant). -ern verbs do NOT
 *  contract this way: "ärgern" -> "ich ärgere" (not "ärgre") is the standard form, already
 *  verified in an earlier phase. Both classes are string-identical in every OTHER form
 *  (du/er/wir/ihr/sie), so only the ich-shaped forms need this distinction. */
function elnContractedStem(stem) {
  return stem.replace(/el$/, 'l');
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
  const ichStem = isEln(infinitive) ? elnContractedStem(stem) : stem;
  return {
    ich: `${ichStem}e`,
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
 * Wiktionary), with the same -eln stem-contraction as the Präsens ich-form ("Entwickle!",
 * not "Entwickele!"). ihr reuses the ihr-Präsens form as-is, Sie is the bare infinitive +
 * "Sie".
 */
export function regularImperativ(infinitive, praesensTable) {
  const stem = stemOf(infinitive);
  const e = needsLinkingE(stem) || isElnErnClass(infinitive) ? 'e' : '';
  const duStem = isEln(infinitive) ? elnContractedStem(stem) : stem;
  return {
    du: `${capitalize(duStem)}${e}!`,
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

/** Appends a separable verb's prefix to every form in an already-built Imperativ table -
 *  "Mach!" -> "Mach zu!" (found while building B1's vorschlagen: the existing separable A1/
 *  A2 verbs' Imperativ tables were missing their prefix entirely, e.g. aufräumen's du-form
 *  shipped as bare "Räum!" instead of "Räum auf!" - a genuinely incomplete/wrong standalone
 *  command, unlike Präsens where the paired example sentence supplies the missing prefix
 *  as compensating context. Same trailing-"!" handling as applyReflexive - the prefix goes
 *  BEFORE the punctuation. Präteritum/Perfekt/etc. don't need this: those forms end the
 *  clause with the prefix export elsewhere (partizip2 already ge-infixes it) or aren't
 *  quizzed as a bare command the way Imperativ is. */
export function withSeparablePrefix(table, prefix) {
  const out = {};
  for (const [key, form] of Object.entries(table)) {
    out[key] = form.endsWith('!') ? `${form.slice(0, -1)} ${prefix}!` : `${form} ${prefix}`;
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

// ================================================================== B1: the four remaining tenses
// All four are pure sentence-assembly from pieces already sitting in the data (an
// auxiliary's own table, partizip2, the bare infinitive) - "correct by construction" same
// as buildPerfekt, never hand-typed. The one genuine exception is Konjunktiv II's synthetic
// forms for ~15 high-frequency verbs (see SYNTHETIC_KONJUNKTIV2 in verbs-a1.js), which
// cannot be derived from data already in this file and are hand-typed + cross-checked
// against Wiktionary instead.

/** Plusquamperfekt = the auxiliary's own PRÄTERITUM table (not Präsens, unlike Perfekt) +
 *  partizip2 - "ich hatte gemacht", "ich war gegangen". Requires the aux verb's praeteritum
 *  table to already be populated, which it is (sein/haben have carried praeteritum since
 *  the A2 phase's spiral revisit). */
export function buildPlusquamperfekt(auxiliaryPraeteritumTable, partizip2, reflexive) {
  const out = {};
  for (const p of PRONOUNS) {
    out[p] = reflexive ? `${auxiliaryPraeteritumTable[p]} ${REFLEXIVE_PRONOUNS[p]} ${partizip2}` : `${auxiliaryPraeteritumTable[p]} ${partizip2}`;
  }
  return out;
}

/** Futur I = conjugated werden + the BARE infinitive at the end of the clause - true for
 *  every verb type including separable ones (separable verbs do NOT split in Futur I; the
 *  whole infinitive "aufstehen" stays intact, same as after any modal). Reflexive pronoun
 *  goes directly after the conjugated werden. */
export function buildFutur1(werdenPraesensTable, infinitive, reflexive) {
  const out = {};
  for (const p of PRONOUNS) {
    out[p] = reflexive ? `${werdenPraesensTable[p]} ${REFLEXIVE_PRONOUNS[p]} ${infinitive}` : `${werdenPraesensTable[p]} ${infinitive}`;
  }
  return out;
}

/** werden's own Konjunktiv II ("würde") doubles as the auxiliary for every OTHER verb's
 *  periphrastic Konjunktiv II - the modern default construction for the vast majority of
 *  verbs (only ~15 high-frequency verbs keep a normal synthetic form instead, see
 *  SYNTHETIC_KONJUNKTIV2 in verbs-a1.js). Hand-typed once here (not derived - it IS the
 *  irregular base everything else in this section builds from) and cross-checked against
 *  Wiktionary. */
export const WUERDE_KONJUNKTIV2 = { ich: 'würde', du: 'würdest', er: 'würde', wir: 'würden', ihr: 'würdet', sie: 'würden' };

export function buildWuerdeKonjunktiv2(infinitive, reflexive) {
  const out = {};
  for (const p of PRONOUNS) {
    out[p] = reflexive ? `${WUERDE_KONJUNKTIV2[p]} ${REFLEXIVE_PRONOUNS[p]} ${infinitive}` : `${WUERDE_KONJUNKTIV2[p]} ${infinitive}`;
  }
  return out;
}

/**
 * Passiv - four sub-forms, all pure assembly from pieces already in the data:
 *   - passivPraesens:    werden (Präsens) + partizip2           "wird gemacht"
 *   - passivPraeteritum: werden (Präteritum) + partizip2        "wurde gemacht"
 *   - passivPerfekt:     sein (Präsens) + partizip2 + "worden"  "ist gemacht worden"
 *                        (NOT "geworden" - "worden" is the special invariant passive-
 *                        auxiliary participle, a genuine exception worth flagging: this is
 *                        the one case in the whole schema where "werden"'s own participle
 *                        does NOT surface as "geworden".)
 *   - passivZustand:     sein (Präsens) + partizip2             "ist gemacht" (Zustandspassiv,
 *                        the resulting STATE rather than the action - "das Fenster ist
 *                        geöffnet" = it's open now, vs. Vorgangspassiv "wird geöffnet" = it's
 *                        being opened right now)
 * Only verbs that take a direct accusative object can form a genuine personal passive -
 * dative-only verbs (helfen, zuhören, danken, ...) and reflexives cannot ("*mir wird
 * geholfen" retains the dative, it is not "ich werde geholfen"; a reflexive's accusative
 * slot is already the reflexive pronoun itself). `transitive: false` returns all four
 * sub-forms as null instead of a fabricated form - "not applicable", not a data gap.
 */
export function buildPassiv({ werdenPraesens, werdenPraeteritum, seinPraesens, partizip2, transitive }) {
  if (!transitive) {
    return { passivPraesens: null, passivPraeteritum: null, passivPerfekt: null, passivZustand: null };
  }
  const passivPraesens = {};
  const passivPraeteritum = {};
  const passivPerfekt = {};
  const passivZustand = {};
  for (const p of PRONOUNS) {
    passivPraesens[p] = `${werdenPraesens[p]} ${partizip2}`;
    passivPraeteritum[p] = `${werdenPraeteritum[p]} ${partizip2}`;
    passivPerfekt[p] = `${seinPraesens[p]} ${partizip2} worden`;
    passivZustand[p] = `${seinPraesens[p]} ${partizip2}`;
  }
  return { passivPraesens, passivPraeteritum, passivPerfekt, passivZustand };
}

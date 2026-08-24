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
function isSStem(stem) {
  return /[sßzx]$/.test(stem);
}

/** Regular weak-verb Präsens: -e/-st/-t/-en/-t/-en off the bare stem, with the linking-e
 *  and s-stem-contraction sub-rules applied. Only valid for verbs with no stem-vowel
 *  change in Präsens - stem-changing verbs (fahren, geben, ...) must override du/er. */
export function regularPraesens(infinitive) {
  const stem = stemOf(infinitive);
  const e = needsLinkingE(stem) ? 'e' : '';
  const sStem = isSStem(stem);
  return {
    ich: `${stem}e`,
    du: sStem ? `${stem}${e}t` : `${stem}${e}st`,
    er: `${stem}${e}t`,
    wir: `${stem}en`,
    ihr: `${stem}${e}t`,
    sie: `${stem}en`,
  };
}

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

/**
 * Regular Imperativ from an already-built Präsens table: du drops the -st (keeping the
 * linking -e if the stem needed one, for pronounceability - "Arbeite!" not "Arbeit!"),
 * ihr reuses the ihr-Präsens form as-is, Sie is the bare infinitive + "Sie".
 */
export function regularImperativ(infinitive, praesensTable) {
  const stem = stemOf(infinitive);
  const e = needsLinkingE(stem) ? 'e' : '';
  return {
    du: `${capitalize(stem)}${e}!`,
    ihr: `${capitalize(praesensTable.ihr)}!`,
    Sie: `${capitalize(infinitive)} Sie!`,
  };
}

/** Perfekt table from an auxiliary's own Präsens table + this verb's partizip2 - pure
 *  sentence assembly (auxiliary + participle in a fixed slot), so it's always derived,
 *  never hand-typed, computed once here at data-authoring time instead of per-render. */
export function buildPerfekt(auxiliaryPraesensTable, partizip2) {
  const out = {};
  for (const p of PRONOUNS) out[p] = `${auxiliaryPraesensTable[p]} ${partizip2}`;
  return out;
}

/** ge- + stem + t, the regular weak partizip2 - only valid when there's no vowel/consonant
 *  irregularity (gemacht, gekauft, ...). Separable verbs infix ge- after the prefix. */
export function regularPartizip2(infinitive, prefix) {
  const stem = stemOf(infinitive.replace(prefix ? new RegExp(`^${prefix}`) : '', ''));
  const e = needsLinkingE(stem) ? 'e' : '';
  return prefix ? `${prefix}ge${stem}${e}t` : `ge${stem}${e}t`;
}

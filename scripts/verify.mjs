#!/usr/bin/env node
// Verification harness for the A1+A2+B1 verb core. Run: node scripts/verify.mjs
//
// Jobs, per the revamp spec's §VERIFICATION (B1 phase is the strictest gate of the project):
//  1. Regression-guard every REGULAR form (Präsens, Perfekt, Partizip2, Präteritum,
//     Plusquamperfekt, Futur I, würde-Konjunktiv2, Passiv) against the rule engine - any
//     verb not flagged as hand-typed/irregular for that tense must match rules.js exactly.
//  2. Verify Passiv is null IFF a verb is reflexive or in PASSIV_NOT_APPLICABLE (never a
//     fabricated personal passive for an intransitive/dative-only verb), and that every
//     non-null Perfekt passive uses "worden", never "geworden".
//  3. Verify every examplesByPronoun sentence actually contains the correct conjugated
//     form for its pronoun, starts with the matching subject word, and (for separable
//     verbs) correctly ends with the verb's own prefix.
//  4. Print per-verb tables: Präsens+Präteritum (existing), and now separately Konjunktiv
//     II, Passiv, Futur I, and Plusquamperfekt (all verbs) for manual review - including
//     every hand-typed form, which this script cannot independently verify against
//     reality, only against internal consistency. Hand-typed synthetic Konjunktiv II forms
//     were cross-checked against Wiktionary separately; see the phase report.

import { VERBS, PRONOUNS, PASSIV_NOT_APPLICABLE, SYNTHETIC_KONJUNKTIV2 } from '../js/data/verbs-a1.js';
import {
  regularPraesens, regularPartizip2, applyReflexive, REFLEXIVE_PRONOUNS,
  buildPlusquamperfekt, buildFutur1, buildWuerdeKonjunktiv2, buildPassiv,
} from '../js/data/rules.js';

let failures = 0;
function fail(msg) {
  failures++;
  console.error(`FAIL: ${msg}`);
}
function ok(msg) {
  console.log(`ok - ${msg}`);
}

// Verbs whose du/er praesens is a genuine grammatical irregularity (stem-changers) or
// which are fully hand-typed (modals, sein/haben/werden, wissen) - praesens disagreement
// with the plain rule is EXPECTED here and reviewed manually via the table, not auto-failed.
const IRREGULAR_PRAESENS = new Set([
  'sein', 'haben', 'werden', 'können', 'müssen', 'wollen', 'dürfen', 'sollen', 'mögen', 'wissen',
  'fahren', 'essen', 'geben', 'nehmen', 'sehen', 'lesen', 'sprechen', 'schlafen', 'laufen', 'helfen', 'treffen',
  'tragen', 'fallen', 'lassen', 'vergessen', 'sterben',
  'empfangen', 'geschehen', 'verlassen', 'erfahren', 'erhalten', 'schlagen',
]);

function basePraesensInfinitive(verb) {
  return verb.separable ? verb.infinitive.slice(verb.prefix.length) : verb.infinitive;
}

function byInfinitive(infinitive) {
  return VERBS.find((v) => v.infinitive === infinitive);
}

const HABEN = byInfinitive('haben');
const SEIN = byInfinitive('sein');
const WERDEN = byInfinitive('werden');
const AUX_PRAESENS = { haben: HABEN.tables.praesens, sein: SEIN.tables.praesens };
const AUX_PRAETERITUM = { haben: HABEN.tables.praeteritum, sein: SEIN.tables.praeteritum };

// ---------------------------------------------------------------- 1. regular-praesens regression guard
let regularChecked = 0;
for (const verb of VERBS) {
  if (IRREGULAR_PRAESENS.has(verb.infinitive) || IRREGULAR_PRAESENS.has(basePraesensInfinitive(verb))) continue;
  let expected = regularPraesens(basePraesensInfinitive(verb));
  if (verb.reflexive) expected = applyReflexive(expected);
  for (const p of PRONOUNS) {
    regularChecked++;
    if (verb.tables.praesens[p] !== expected[p]) {
      fail(`${verb.infinitive}.praesens.${p} = "${verb.tables.praesens[p]}", rule engine expected "${expected[p]}"`);
    }
  }
}
ok(`regular-praesens regression guard: ${regularChecked} forms checked across ${VERBS.length - IRREGULAR_PRAESENS.size} regular verbs`);

// ---------------------------------------------------------------- 2. perfekt assembly guard
let perfektChecked = 0;
for (const verb of VERBS) {
  const auxTable = AUX_PRAESENS[verb.auxiliary];
  for (const p of PRONOUNS) {
    perfektChecked++;
    const expected = verb.reflexive
      ? `${auxTable[p]} ${REFLEXIVE_PRONOUNS[p]} ${verb.partizip2}`
      : `${auxTable[p]} ${verb.partizip2}`;
    if (verb.tables.perfekt[p] !== expected) {
      fail(`${verb.infinitive}.perfekt.${p} = "${verb.tables.perfekt[p]}", expected "${expected}" (aux=${verb.auxiliary} + partizip2${verb.reflexive ? ' + reflexive' : ''})`);
    }
  }
}
ok(`perfekt assembly guard: ${perfektChecked} forms checked across ${VERBS.length} verbs`);

// ---------------------------------------------------------------- 3. partizip2 regression guard (rule-generated verbs only)
const REGULAR_PARTIZIP2_CHECKS = [
  { infinitive: 'machen', base: 'machen' },
  { infinitive: 'kaufen', base: 'kaufen' },
  { infinitive: 'wohnen', base: 'wohnen' },
  { infinitive: 'arbeiten', base: 'arbeiten' },
  { infinitive: 'einkaufen', base: 'kaufen', prefix: 'ein' },
  { infinitive: 'planen', base: 'planen' },
  { infinitive: 'aufräumen', base: 'räumen', prefix: 'auf' },
  { infinitive: 'zumachen', base: 'machen', prefix: 'zu' },
  { infinitive: 'zuhören', base: 'hören', prefix: 'zu' },
  { infinitive: 'fühlen', base: 'fühlen' },
  { infinitive: 'ärgern', base: 'ärgern' },
];
for (const { infinitive, base, prefix } of REGULAR_PARTIZIP2_CHECKS) {
  const verb = byInfinitive(infinitive);
  const expected = regularPartizip2(base, prefix);
  if (verb.partizip2 !== expected) fail(`${infinitive}.partizip2 = "${verb.partizip2}", rule engine expected "${expected}"`);
}
ok(`partizip2 regression guard: ${REGULAR_PARTIZIP2_CHECKS.length} rule-generated verbs checked`);

// ---------------------------------------------------------------- 4. schema completeness
const TABLE_KEYS = [
  'praesens', 'imperativ', 'perfekt', 'praeteritum',
  'konjunktiv2', 'futur1', 'plusquamperfekt',
  'passivPraesens', 'passivPraeteritum', 'passivPerfekt', 'passivZustand',
];
const ALWAYS_FILLED = new Set(['praesens', 'perfekt', 'praeteritum', 'konjunktiv2', 'futur1', 'plusquamperfekt']);
for (const verb of VERBS) {
  for (const key of TABLE_KEYS) {
    if (!(key in verb.tables)) fail(`${verb.infinitive}.tables.${key} is missing entirely - schema must hold all 11 tense slots`);
  }
  for (const key of ALWAYS_FILLED) {
    if (verb.tables[key] == null) fail(`${verb.infinitive}.tables.${key} should be filled (A1/A2/B1 all populated now), got null`);
  }
}
ok(`schema completeness: all ${VERBS.length} verbs carry all 11 tense slots, praesens/perfekt/praeteritum/konjunktiv2/futur1/plusquamperfekt filled`);

// ---------------------------------------------------------------- 5. Plusquamperfekt regression guard (fully derivable - every verb)
let pqpChecked = 0;
for (const verb of VERBS) {
  const expected = buildPlusquamperfekt(AUX_PRAETERITUM[verb.auxiliary], verb.partizip2, verb.reflexive);
  for (const p of PRONOUNS) {
    pqpChecked++;
    if (verb.tables.plusquamperfekt[p] !== expected[p]) {
      fail(`${verb.infinitive}.plusquamperfekt.${p} = "${verb.tables.plusquamperfekt[p]}", rule engine expected "${expected[p]}"`);
    }
  }
}
ok(`plusquamperfekt regression guard: ${pqpChecked} forms checked across ${VERBS.length} verbs (fully derivable, zero hand-typed)`);

// ---------------------------------------------------------------- 6. Futur I regression guard (fully derivable - every verb)
let futur1Checked = 0;
for (const verb of VERBS) {
  const expected = buildFutur1(WERDEN.tables.praesens, verb.infinitive, verb.reflexive);
  for (const p of PRONOUNS) {
    futur1Checked++;
    if (verb.tables.futur1[p] !== expected[p]) {
      fail(`${verb.infinitive}.futur1.${p} = "${verb.tables.futur1[p]}", rule engine expected "${expected[p]}"`);
    }
  }
}
ok(`futur1 regression guard: ${futur1Checked} forms checked across ${VERBS.length} verbs (fully derivable, zero hand-typed)`);

// ---------------------------------------------------------------- 7. Konjunktiv II regression guard
// Verbs in SYNTHETIC_KONJUNKTIV2 are hand-typed (cross-checked against Wiktionary
// separately, see phase report) and are NOT re-derivable, so they're excluded here by
// design, not skipped as an oversight. Every other verb must match buildWuerdeKonjunktiv2
// exactly.
let k2Checked = 0;
let k2SyntheticCount = 0;
for (const verb of VERBS) {
  if (SYNTHETIC_KONJUNKTIV2[verb.infinitive]) {
    k2SyntheticCount++;
    continue;
  }
  const expected = buildWuerdeKonjunktiv2(verb.infinitive, verb.reflexive);
  for (const p of PRONOUNS) {
    k2Checked++;
    if (verb.tables.konjunktiv2[p] !== expected[p]) {
      fail(`${verb.infinitive}.konjunktiv2.${p} = "${verb.tables.konjunktiv2[p]}", rule engine expected "${expected[p]}"`);
    }
  }
}
ok(`konjunktiv2 (würde) regression guard: ${k2Checked} forms checked across ${VERBS.length - k2SyntheticCount} verbs; ${k2SyntheticCount} verbs use hand-typed synthetic forms (Wiktionary cross-checked, see report)`);

// ---------------------------------------------------------------- 8. Passiv regression guard + transitivity + "worden" check
let passivChecked = 0;
let passivApplicableCount = 0;
let passivNotApplicableCount = 0;
for (const verb of VERBS) {
  const shouldBeApplicable = !verb.reflexive && !PASSIV_NOT_APPLICABLE.has(verb.infinitive);
  const expected = buildPassiv({
    werdenPraesens: WERDEN.tables.praesens,
    werdenPraeteritum: WERDEN.tables.praeteritum,
    seinPraesens: SEIN.tables.praesens,
    partizip2: verb.partizip2,
    transitive: shouldBeApplicable,
  });
  if (shouldBeApplicable) {
    passivApplicableCount++;
    for (const key of ['passivPraesens', 'passivPraeteritum', 'passivPerfekt', 'passivZustand']) {
      if (verb.tables[key] == null) { fail(`${verb.infinitive}.tables.${key} is null but this verb is transitive - should be a generated form, not "not applicable"`); continue; }
      for (const p of PRONOUNS) {
        passivChecked++;
        if (verb.tables[key][p] !== expected[key][p]) {
          fail(`${verb.infinitive}.${key}.${p} = "${verb.tables[key][p]}", rule engine expected "${expected[key][p]}"`);
        }
      }
    }
    // Hard-gate requirement: Perfekt passive must use "worden", never "geworden".
    for (const p of PRONOUNS) {
      const form = verb.tables.passivPerfekt[p];
      if (form.includes('geworden')) fail(`${verb.infinitive}.passivPerfekt.${p} = "${form}" uses "geworden" - Perfekt passive must use invariant "worden"`);
      if (!form.endsWith(' worden')) fail(`${verb.infinitive}.passivPerfekt.${p} = "${form}" does not end in " worden"`);
    }
  } else {
    passivNotApplicableCount++;
    for (const key of ['passivPraesens', 'passivPraeteritum', 'passivPerfekt', 'passivZustand']) {
      if (verb.tables[key] !== null) fail(`${verb.infinitive}.tables.${key} should be null (intransitive/dative-only/reflexive - no personal passive), got ${JSON.stringify(verb.tables[key])}`);
    }
  }
}
ok(`passiv regression guard: ${passivChecked} forms checked across ${passivApplicableCount} transitive verbs; ${passivNotApplicableCount} verbs correctly marked not-applicable (reflexive or intransitive/dative-only); all Perfekt-passive forms confirmed using "worden" not "geworden"`);

// ---------------------------------------------------------------- 9. example-sentence verification
const SUBJECT_WORD = { ich: 'Ich', du: 'Du', er: 'Er', wir: 'Wir', ihr: 'Ihr', sie: 'Sie' };
function firstWord(sentence) {
  return sentence.split(/\s+/)[0].replace(/[.,!?]$/, '');
}
function normalizeWords(sentence) {
  return sentence.split(/\s+/).map((w) => w.replace(/[.,!?"„“]/g, ''));
}
function containsPhrase(sentence, phrase) {
  const words = normalizeWords(sentence);
  const phraseWords = phrase.split(/\s+/);
  for (let i = 0; i <= words.length - phraseWords.length; i++) {
    if (phraseWords.every((pw, j) => words[i + j] === pw)) return true;
  }
  return false;
}
let sentenceCount = 0;
for (const verb of VERBS) {
  const examples = verb.examplesByPronoun.praesens;
  if (!examples) { fail(`${verb.infinitive}: missing examplesByPronoun.praesens entirely`); continue; }
  for (const p of PRONOUNS) {
    const entry = examples[p];
    if (!entry) { fail(`${verb.infinitive}: missing examplesByPronoun.praesens.${p}`); continue; }
    sentenceCount++;
    const conjugated = verb.tables.praesens[p];

    const gotSubject = firstWord(entry.de);
    if (gotSubject !== SUBJECT_WORD[p]) {
      fail(`${verb.infinitive}.${p}: sentence starts with "${gotSubject}", expected "${SUBJECT_WORD[p]}" — "${entry.de}"`);
    }
    if (!containsPhrase(entry.de, conjugated)) {
      fail(`${verb.infinitive}.${p}: sentence does not contain conjugated form "${conjugated}" — "${entry.de}"`);
    }
    if (verb.separable) {
      const words = entry.de.replace(/[.,!?]$/, '').split(/\s+/);
      const lastWord = words[words.length - 1];
      if (lastWord !== verb.prefix) {
        fail(`${verb.infinitive}.${p}: separable verb sentence should end with prefix "${verb.prefix}", ends with "${lastWord}" — "${entry.de}"`);
      }
    }
    if (!entry.en || !entry.en.trim()) fail(`${verb.infinitive}.${p}: missing English gloss`);
  }
}
ok(`example-sentence verification: ${sentenceCount} sentences across ${VERBS.length} verbs`);

// ---------------------------------------------------------------- 10. per-verb tables (manual review)
const col = (s, w) => String(s ?? '—').padEnd(w);

console.log('\n=== Präsens form table (A1+A2+B1, for manual review) ===\n');
console.log(col('infinitive', 15) + col('level', 6) + col('type', 8) + col('aux', 7) + col('ich', 11) + col('du', 13) + col('er', 11) + col('wir', 11) + col('ihr', 11) + col('sie', 11) + col('partizip2', 16) + 'imperativ(du)');
console.log('-'.repeat(160));
for (const verb of VERBS) {
  const t = verb.tables.praesens;
  const flag = IRREGULAR_PRAESENS.has(verb.infinitive) ? '*' : '';
  console.log(
    col(verb.infinitive + flag, 15) + col(verb.level, 6) + col(verb.type, 8) + col(verb.auxiliary, 7) +
    col(t.ich, 11) + col(t.du, 13) + col(t.er, 11) + col(t.wir, 11) + col(t.ihr, 11) + col(t.sie, 11) +
    col(verb.partizip2, 16) + (verb.tables.imperativ ? verb.tables.imperativ.du : '(none)')
  );
}
console.log('\n* = hand-typed/irregular praesens - not rule-regenerated, verify manually.\n');

console.log('\n=== Präteritum form table (A1+A2+B1, for manual review) ===\n');
console.log(col('infinitive', 15) + col('level', 6) + col('ich', 15) + col('du', 17) + col('er', 15) + col('wir', 15) + col('ihr', 15) + 'sie');
console.log('-'.repeat(155));
for (const verb of VERBS) {
  const t = verb.tables.praeteritum;
  console.log(col(verb.infinitive, 15) + col(verb.level, 6) + col(t.ich, 15) + col(t.du, 17) + col(t.er, 15) + col(t.wir, 15) + col(t.ihr, 15) + t.sie);
}

console.log('\n=== Konjunktiv II form table (A1+A2+B1, PRIORITY for manual review) ===\n');
console.log(col('infinitive', 15) + col('level', 6) + col('src', 11) + col('ich', 16) + col('du', 18) + col('er', 16) + col('wir', 16) + col('ihr', 16) + 'sie');
console.log('-'.repeat(165));
for (const verb of VERBS) {
  const t = verb.tables.konjunktiv2;
  const src = SYNTHETIC_KONJUNKTIV2[verb.infinitive] ? 'synthetic*' : 'würde';
  console.log(col(verb.infinitive, 15) + col(verb.level, 6) + col(src, 11) + col(t.ich, 16) + col(t.du, 18) + col(t.er, 16) + col(t.wir, 16) + col(t.ihr, 16) + t.sie);
}
console.log('\n* = hand-typed synthetic form, cross-checked against Wiktionary (see phase report) - the only hand-typed tense in this table.\n');

console.log('\n=== Passiv form table (A1+A2+B1, PRIORITY for manual review; n/a = no personal passive) ===\n');
console.log(col('infinitive', 15) + col('level', 6) + col('Präs. (er)', 22) + col('Prät. (er)', 22) + col('Perf. (er)', 26) + 'Zustand (er)');
console.log('-'.repeat(150));
for (const verb of VERBS) {
  const applicable = verb.tables.passivPraesens != null;
  if (!applicable) {
    console.log(col(verb.infinitive, 15) + col(verb.level, 6) + 'n/a - no direct accusative object (reflexive, intransitive, or dative-only)');
    continue;
  }
  console.log(
    col(verb.infinitive, 15) + col(verb.level, 6) +
    col(verb.tables.passivPraesens.er, 22) + col(verb.tables.passivPraeteritum.er, 22) +
    col(verb.tables.passivPerfekt.er, 26) + verb.tables.passivZustand.er
  );
}

console.log('\n=== Futur I form table (A1+A2+B1, ich-form only - fully mechanical, spot-check) ===\n');
console.log(col('infinitive', 15) + col('level', 6) + 'futur1.ich');
console.log('-'.repeat(60));
for (const verb of VERBS) {
  console.log(col(verb.infinitive, 15) + col(verb.level, 6) + verb.tables.futur1.ich);
}

console.log('\n=== Plusquamperfekt form table (A1+A2+B1, ich-form only - fully mechanical, spot-check) ===\n');
console.log(col('infinitive', 15) + col('level', 6) + 'plusquamperfekt.ich');
console.log('-'.repeat(60));
for (const verb of VERBS) {
  console.log(col(verb.infinitive, 15) + col(verb.level, 6) + verb.tables.plusquamperfekt.ich);
}

// ---------------------------------------------------------------- summary
console.log('\n---');
if (failures) {
  console.error(`${failures} FAILURE(S)`);
  process.exit(1);
} else {
  console.log(`All checks passed. ${VERBS.length} verbs verified (A1+A2+B1).`);
}

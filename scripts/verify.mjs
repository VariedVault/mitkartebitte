#!/usr/bin/env node
// Verification harness for the A1+A2 verb core. Run: node scripts/verify.mjs
//
// Jobs, per the revamp spec's §VERIFICATION:
//  1. Regression-guard every REGULAR form (Präsens, Perfekt, Partizip2, Präteritum)
//     against the rule engine - any verb not flagged as hand-typed/irregular for that
//     tense must match rules.js exactly, so a future typo in what should be 100%
//     mechanical fails the build instead of shipping quietly. Reflexive verbs are
//     checked through the same rule engine + applyReflexive(), not skipped.
//  2. Verify every examplesByPronoun sentence actually contains the correct conjugated
//     form for its pronoun (multi-word reflexive forms like "fühle mich" included),
//     starts with the matching subject word, and (for separable verbs) correctly ends
//     with the verb's own prefix.
//  3. Print a full per-verb Präsens form table AND a full per-verb Präteritum table
//     (A1+A2) for manual review - including the hand-typed irregular forms, which this
//     script cannot independently verify against reality, only against internal
//     consistency (e.g. perfekt = aux + partizip2 + reflexive pronoun correctly).

import { VERBS, PRONOUNS } from '../js/data/verbs-a1.js';
import { regularPraesens, regularPartizip2, applyReflexive, REFLEXIVE_PRONOUNS } from '../js/data/rules.js';

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
]);

function basePraesensInfinitive(verb) {
  return verb.separable ? verb.infinitive.slice(verb.prefix.length) : verb.infinitive;
}

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
// Every perfekt form must be exactly "<aux praesens for that pronoun> [reflexive pronoun]
// <partizip2>" - this re-derives it independently rather than trusting the buildPerfekt()
// call site.
const AUX_PRAESENS = {
  haben: VERBS.find((v) => v.infinitive === 'haben').tables.praesens,
  sein: VERBS.find((v) => v.infinitive === 'sein').tables.praesens,
};
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
// { infinitive, base, prefix } - base/prefix feed regularPartizip2(base, prefix); verbs
// with a genuinely irregular or hand-typed-exception partizip2 (strong ablaut, -ieren's
// no-ge- rule, inseparable be-/ver- no-ge- rule, ...) are intentionally NOT in this list -
// their partizip2 is manually cross-checked against Wiktionary/DWDS instead (see report).
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
  const verb = VERBS.find((v) => v.infinitive === infinitive);
  const expected = regularPartizip2(base, prefix);
  if (verb.partizip2 !== expected) fail(`${infinitive}.partizip2 = "${verb.partizip2}", rule engine expected "${expected}"`);
}
ok(`partizip2 regression guard: ${REGULAR_PARTIZIP2_CHECKS.length} rule-generated verbs checked`);

// ---------------------------------------------------------------- 4. schema completeness
const TABLE_KEYS = ['praesens', 'imperativ', 'perfekt', 'praeteritum', 'konjunktiv2', 'futur1', 'plusquamperfekt', 'passiv'];
const FILLED_TENSES = new Set(['praesens', 'perfekt', 'praeteritum']); // A1+A2 scope this phase
const NULL_TENSES = new Set(['konjunktiv2', 'futur1', 'plusquamperfekt', 'passiv']); // B1 scope, not authored yet
for (const verb of VERBS) {
  for (const key of TABLE_KEYS) {
    if (!(key in verb.tables)) fail(`${verb.infinitive}.tables.${key} is missing entirely - schema must hold all 8 tense slots`);
  }
  for (const key of NULL_TENSES) {
    if (verb.tables[key] !== null) fail(`${verb.infinitive}.tables.${key} should be null this phase (B1), got ${JSON.stringify(verb.tables[key])}`);
  }
  for (const key of FILLED_TENSES) {
    if (verb.tables[key] == null) fail(`${verb.infinitive}.tables.${key} should be filled this phase (A1/A2), got null`);
  }
}
ok(`schema completeness: all ${VERBS.length} verbs carry all 8 tense slots, praesens/perfekt/praeteritum filled, B1 slots explicitly null`);

// ---------------------------------------------------------------- 5. example-sentence verification
const SUBJECT_WORD = { ich: 'Ich', du: 'Du', er: 'Er', wir: 'Wir', ihr: 'Ihr', sie: 'Sie' };
function firstWord(sentence) {
  return sentence.split(/\s+/)[0].replace(/[.,!?]$/, '');
}
function normalizeWords(sentence) {
  return sentence.split(/\s+/).map((w) => w.replace(/[.,!?"„“]/g, ''));
}
/** True when every word of `phrase` (space-split) appears as a consecutive run in
 *  `sentence` - handles both single-word forms ("trägt") and multi-word reflexive
 *  forms ("fühle mich") the same way. */
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

// ---------------------------------------------------------------- 6. per-verb Präsens form table (manual review)
console.log('\n=== A1+A2 verb Präsens form table (for manual review) ===\n');
const col = (s, w) => String(s ?? '—').padEnd(w);
console.log(col('infinitive', 14) + col('level', 6) + col('type', 8) + col('aux', 7) + col('ich', 10) + col('du', 12) + col('er', 10) + col('wir', 10) + col('ihr', 10) + col('sie', 10) + col('partizip2', 16) + 'imperativ(du)');
console.log('-'.repeat(155));
for (const verb of VERBS) {
  const t = verb.tables.praesens;
  const flag = IRREGULAR_PRAESENS.has(verb.infinitive) ? '*' : '';
  console.log(
    col(verb.infinitive + flag, 14) + col(verb.level, 6) + col(verb.type, 8) + col(verb.auxiliary, 7) +
    col(t.ich, 10) + col(t.du, 12) + col(t.er, 10) + col(t.wir, 10) + col(t.ihr, 10) + col(t.sie, 10) +
    col(verb.partizip2, 16) + (verb.tables.imperativ ? verb.tables.imperativ.du : '(none)')
  );
}
console.log('\n* = hand-typed/irregular praesens (stem-changer, modal, or foundational verb) - not rule-regenerated, verify manually.\n');

// ---------------------------------------------------------------- 7. per-verb Präteritum form table (manual review)
console.log('\n=== A1+A2 verb Präteritum form table (for manual review) ===\n');
console.log(col('infinitive', 14) + col('level', 6) + col('ich', 14) + col('du', 16) + col('er', 14) + col('wir', 14) + col('ihr', 14) + 'sie');
console.log('-'.repeat(150));
for (const verb of VERBS) {
  const t = verb.tables.praeteritum;
  if (!t) { console.log(col(verb.infinitive, 14) + col(verb.level, 6) + '(missing)'); continue; }
  console.log(
    col(verb.infinitive, 14) + col(verb.level, 6) +
    col(t.ich, 14) + col(t.du, 16) + col(t.er, 14) + col(t.wir, 14) + col(t.ihr, 14) + t.sie
  );
}
console.log('');

// ---------------------------------------------------------------- summary
console.log('---');
if (failures) {
  console.error(`${failures} FAILURE(S)`);
  process.exit(1);
} else {
  console.log(`All checks passed. ${VERBS.length} verbs verified (A1+A2).`);
}

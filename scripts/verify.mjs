#!/usr/bin/env node
// Verification harness for the A1 verb core. Run: node scripts/verify.mjs
//
// Three jobs, per the revamp spec's §VERIFICATION:
//  1. Regression-guard every REGULAR form against the rule engine - any verb not in
//     IRREGULAR_PRAESENS must match rules.js exactly, so a future typo in what should be
//     100% mechanical fails the build instead of shipping quietly.
//  2. Verify every examplesByPronoun sentence actually contains the correct conjugated
//     form for its pronoun, starts with the matching subject word, and (for separable
//     verbs) correctly ends with the verb's own prefix.
//  3. Print a full per-verb form table for manual review - including the hand-typed
//     irregular forms, which this script cannot independently verify against reality,
//     only against internal consistency (e.g. perfekt = aux + partizip2 correctly).

import { VERBS, PRONOUNS } from '../js/data/verbs-a1.js';
import { regularPraesens, regularPartizip2, stemOf } from '../js/data/rules.js';

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
]);

function basePraesensInfinitive(verb) {
  return verb.separable ? verb.infinitive.slice(verb.prefix.length) : verb.infinitive;
}

// ---------------------------------------------------------------- 1. regular-praesens regression guard
let regularChecked = 0;
for (const verb of VERBS) {
  if (IRREGULAR_PRAESENS.has(verb.infinitive)) continue;
  const expected = regularPraesens(basePraesensInfinitive(verb));
  for (const p of PRONOUNS) {
    regularChecked++;
    if (verb.tables.praesens[p] !== expected[p]) {
      fail(`${verb.infinitive}.praesens.${p} = "${verb.tables.praesens[p]}", rule engine expected "${expected[p]}"`);
    }
  }
}
ok(`regular-praesens regression guard: ${regularChecked} forms checked across ${VERBS.length - IRREGULAR_PRAESENS.size} regular verbs`);

// ---------------------------------------------------------------- 2. perfekt assembly guard
// Every perfekt form must be exactly "<aux praesens for that pronoun> <partizip2>" - this
// re-derives it independently rather than trusting the buildPerfekt() call site.
const AUX_PRAESENS = {
  haben: VERBS.find((v) => v.infinitive === 'haben').tables.praesens,
  sein: VERBS.find((v) => v.infinitive === 'sein').tables.praesens,
};
let perfektChecked = 0;
for (const verb of VERBS) {
  const auxTable = AUX_PRAESENS[verb.auxiliary];
  for (const p of PRONOUNS) {
    perfektChecked++;
    const expected = `${auxTable[p]} ${verb.partizip2}`;
    if (verb.tables.perfekt[p] !== expected) {
      fail(`${verb.infinitive}.perfekt.${p} = "${verb.tables.perfekt[p]}", expected "${expected}" (aux=${verb.auxiliary} + partizip2)`);
    }
  }
}
ok(`perfekt assembly guard: ${perfektChecked} forms checked across ${VERBS.length} verbs`);

// ---------------------------------------------------------------- 3. partizip2 regression guard (weak, non-separable-irregular verbs only)
const REGULAR_PARTIZIP2 = new Set(['machen', 'kaufen', 'wohnen', 'arbeiten']);
for (const verb of VERBS) {
  if (!REGULAR_PARTIZIP2.has(verb.infinitive)) continue;
  const expected = regularPartizip2(verb.infinitive);
  if (verb.partizip2 !== expected) fail(`${verb.infinitive}.partizip2 = "${verb.partizip2}", rule engine expected "${expected}"`);
}
const expectedEinkaufen = regularPartizip2('kaufen', 'ein');
if (VERBS.find((v) => v.infinitive === 'einkaufen').partizip2 !== expectedEinkaufen) {
  fail(`einkaufen.partizip2 does not match rule-generated "${expectedEinkaufen}"`);
}
ok(`partizip2 regression guard: ${REGULAR_PARTIZIP2.size + 1} rule-generated verbs checked`);

// ---------------------------------------------------------------- 4. schema completeness
const TABLE_KEYS = ['praesens', 'imperativ', 'perfekt', 'praeteritum', 'konjunktiv2', 'futur1', 'plusquamperfekt', 'passiv'];
const A1_FILLED = new Set(['praesens', 'perfekt']); // imperativ is null for the 8 no-imperative verbs, checked separately
for (const verb of VERBS) {
  for (const key of TABLE_KEYS) {
    if (!(key in verb.tables)) fail(`${verb.infinitive}.tables.${key} is missing entirely - schema must hold all 8 tense slots`);
  }
  for (const key of ['praeteritum', 'konjunktiv2', 'futur1', 'plusquamperfekt', 'passiv']) {
    if (verb.tables[key] !== null) fail(`${verb.infinitive}.tables.${key} should be null this phase (A2/B1), got ${JSON.stringify(verb.tables[key])}`);
  }
  for (const key of A1_FILLED) {
    if (verb.tables[key] == null) fail(`${verb.infinitive}.tables.${key} should be filled this phase (A1), got null`);
  }
}
ok(`schema completeness: all ${VERBS.length} verbs carry all 8 tense slots, A2/B1 slots explicitly null`);

// ---------------------------------------------------------------- 5. example-sentence verification
const SUBJECT_WORD = { ich: 'Ich', du: 'Du', er: 'Er', wir: 'Wir', ihr: 'Ihr', sie: 'Sie' };
function firstWord(sentence) {
  return sentence.split(/\s+/)[0].replace(/[.,!?]$/, '');
}
function containsWholeWord(sentence, word) {
  const words = sentence.split(/\s+/).map((w) => w.replace(/[.,!?"„“]/g, ''));
  return words.some((w) => w === word);
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
    if (!containsWholeWord(entry.de, conjugated)) {
      fail(`${verb.infinitive}.${p}: sentence does not contain conjugated form "${conjugated}" as a whole word — "${entry.de}"`);
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

// ---------------------------------------------------------------- 6. per-verb form table (manual review)
console.log('\n=== A1 verb form table (for manual review) ===\n');
const col = (s, w) => String(s ?? '—').padEnd(w);
console.log(col('infinitive', 14) + col('type', 10) + col('aux', 7) + col('ich', 10) + col('du', 12) + col('er', 10) + col('wir', 10) + col('ihr', 10) + col('sie', 10) + col('partizip2', 16) + 'imperativ(du)');
console.log('-'.repeat(150));
for (const verb of VERBS) {
  const t = verb.tables.praesens;
  const flag = IRREGULAR_PRAESENS.has(verb.infinitive) ? '*' : '';
  console.log(
    col(verb.infinitive + flag, 14) + col(verb.type, 10) + col(verb.auxiliary, 7) +
    col(t.ich, 10) + col(t.du, 12) + col(t.er, 10) + col(t.wir, 10) + col(t.ihr, 10) + col(t.sie, 10) +
    col(verb.partizip2, 16) + (verb.tables.imperativ ? verb.tables.imperativ.du : '(none)')
  );
}
console.log('\n* = hand-typed/irregular praesens (stem-changer, modal, or foundational verb) - not rule-regenerated, verify manually.\n');

// ---------------------------------------------------------------- summary
console.log('---');
if (failures) {
  console.error(`${failures} FAILURE(S)`);
  process.exit(1);
} else {
  console.log(`All checks passed. ${VERBS.length} A1 verbs verified.`);
}

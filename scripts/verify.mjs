#!/usr/bin/env node
// Regression / verification harness for mit Karte, bitte's grammar data.
// Reused across every content change: conjugation derivation sweeps, per-module
// null-form sweeps, and (below) the praesensExamples sentence-correctness checks.
// Run: node scripts/verify.mjs

import { VERBS, PRONOUNS } from '../js/data/verbs.js';
import { allModules } from '../js/data/modules/index.js';
import { getForm, factKeysForModule } from '../js/ui/drills.js';
import * as C from '../js/data/conjugate.js';

let failures = 0;
function fail(msg) {
  failures++;
  console.error(`FAIL: ${msg}`);
}
function ok(msg) {
  console.log(`ok - ${msg}`);
}

// ---------------------------------------------------------------- 1. conjugate.js regression
// Known-correct forms, spot-checking every derivation path in conjugate.js.
const REGRESSION = [
  ['machen', 'perfekt', 'ich', 'habe gemacht'],
  ['gehen', 'perfekt', 'er', 'ist gegangen'],
  ['machen', 'plusquamperfekt', 'du', 'hattest gemacht'],
  ['gehen', 'plusquamperfekt', 'wir', 'waren gegangen'],
  ['machen', 'futur1', 'ich', 'werde machen'],
  ['machen', 'futur2', 'er', 'wird gemacht haben'],
  ['sein', 'konjunktiv2', 'ich', 'wäre'],
  ['machen', 'konjunktiv2', 'ich', 'würde machen'],
  ['machen', 'konjunktiv2perfekt', 'ich', 'hätte gemacht'],
  ['machen', 'konjunktiv1', 'er', 'mache'],
  ['machen', 'konjunktiv1perfekt', 'er', 'habe gemacht'],
  ['machen', 'passivVorgang', 'er', 'wird gemacht'],
  ['machen', 'passivVorgangPraeteritum', 'er', 'wurde gemacht'],
  ['machen', 'passivZustand', 'er', 'ist gemacht'],
];
for (const [inf, tense, pronoun, expected] of REGRESSION) {
  const verb = VERBS.find((v) => v.infinitive === inf);
  const got = getForm(verb, tense, pronoun);
  if (got !== expected) fail(`conjugate regression: ${inf}|${tense}|${pronoun} = "${got}", expected "${expected}"`);
}
ok(`conjugate.js regression: ${REGRESSION.length} checks`);

// ---------------------------------------------------------------- 2. module fact-key sweep
// Every fact key a module can produce must resolve to a non-null form.
let moduleFacts = 0;
for (const mod of allModules()) {
  const pool = mod.verbPool(VERBS);
  const keys = factKeysForModule(pool, mod.tenses);
  moduleFacts += keys.length;
  for (const key of keys) {
    const [inf, tense, pronoun] = key.split('|');
    const verb = VERBS.find((v) => v.infinitive === inf);
    if (getForm(verb, tense, pronoun) == null) fail(`module ${mod.id}: null form for ${key}`);
  }
}
ok(`module fact-key sweep: ${moduleFacts} facts across ${allModules().length} modules`);

// ---------------------------------------------------------------- 3. praesensExamples sentence verification
// Convention (see js/data/verbs.js): every sentence's first word is the canonical
// subject pronoun (Ich/Du/Er/Wir/Ihr/Sie), and the drilled Präsens form must appear
// in the sentence as a whole word. Separable-verb-prefix words are flagged as a
// heuristic guard against accidentally testing a different verb (e.g. "ausgehen"
// instead of "gehen").
const SUBJECT_WORD = { ich: 'Ich', du: 'Du', er: 'Er', wir: 'Wir', ihr: 'Ihr', sie: 'Sie' };
// Prefixes drawn straight from the tracked separable verbs, e.g. aufstehen -> "auf".
const TRACKED_SEPARABLE_PREFIXES = new Set(
  VERBS.filter((v) => v.separable).map((v) => {
    const m = v.infinitive.match(/^(auf|an|ein|mit|fern|zu|aus|vor|weg|zurück)/);
    return m ? m[1] : null;
  }).filter(Boolean)
);

function firstWord(sentence) {
  return sentence.split(/\s+/)[0].replace(/[.,!?]$/, '');
}
function containsWholeWord(sentence, word) {
  const words = sentence.split(/\s+/).map((w) => w.replace(/[.,!?"„“]/g, ''));
  return words.some((w) => w === word);
}
function endsWithTrackedPrefix(sentence, verbInfinitive) {
  const words = sentence.split(/\s+/).map((w) => w.replace(/[.,!?]$/, ''));
  const last = words[words.length - 1];
  for (const prefix of TRACKED_SEPARABLE_PREFIXES) {
    if (last === prefix && `${prefix}${verbInfinitive}` !== verbInfinitive) return prefix;
  }
  return null;
}

let sentenceCount = 0;
const subsetVerbs = VERBS.filter((v) => v.praesensExamples);
for (const verb of subsetVerbs) {
  for (const pronoun of PRONOUNS) {
    const entry = verb.praesensExamples[pronoun];
    if (!entry) { fail(`${verb.infinitive}: missing praesensExamples.${pronoun}`); continue; }
    sentenceCount++;
    const expectedForm = getForm(verb, 'praesens', pronoun);
    if (expectedForm == null) { fail(`${verb.infinitive}: no praesens form for ${pronoun}`); continue; }

    const gotSubject = firstWord(entry.de);
    if (gotSubject !== SUBJECT_WORD[pronoun]) {
      fail(`${verb.infinitive}.${pronoun}: sentence starts with "${gotSubject}", expected "${SUBJECT_WORD[pronoun]}" — "${entry.de}"`);
    }
    if (!containsWholeWord(entry.de, expectedForm)) {
      fail(`${verb.infinitive}.${pronoun}: sentence does not contain conjugated form "${expectedForm}" — "${entry.de}"`);
    }
    const danglingPrefix = endsWithTrackedPrefix(entry.de, verb.infinitive);
    if (danglingPrefix) {
      fail(`${verb.infinitive}.${pronoun}: sentence ends with "${danglingPrefix}", which looks like a separable-verb prefix collision — "${entry.de}"`);
    }
    if (!entry.en || !entry.en.trim()) {
      fail(`${verb.infinitive}.${pronoun}: missing English gloss`);
    }
  }
}
ok(`praesensExamples verification: ${sentenceCount} sentences across ${subsetVerbs.length} verbs`);

// ---------------------------------------------------------------- summary
console.log('---');
if (failures) {
  console.error(`${failures} FAILURE(S)`);
  process.exit(1);
} else {
  console.log('All checks passed.');
}

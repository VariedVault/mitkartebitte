#!/usr/bin/env node
// Regression / verification harness for mit Karte, bitte's grammar data.
// Reused across every content change: conjugation derivation sweeps, per-module
// null-form sweeps, and (below) the praesensExamples sentence-correctness checks.
// Run: node scripts/verify.mjs

import { VERBS, PRONOUNS } from '../js/data/verbs.js';
import { allModules, unlockedTenses, unlockedVerbRank, isVerbLevelUnlocked } from '../js/data/modules/index.js';
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

// ---------------------------------------------------------------- 4. Practice-deck pool: cumulative, practiced-gated
// Mirrors js/views/practice.js's unlockedFactKeys() exactly (same gating functions from
// modules/index.js, same factKeysForModule builder from drills.js), so a passing check here
// is a real guarantee about what Practice actually draws from - not a parallel reimplementation.
function poolForProgress(progress) {
  const tenses = [...unlockedTenses(progress)];
  const rank = unlockedVerbRank(progress);
  const verbs = VERBS.filter((v) => isVerbLevelUnlocked(v.level, rank));
  return { tenses, rank, verbs, keys: factKeysForModule(verbs, tenses) };
}

function practicedModules(...moduleIds) {
  const progress = {};
  for (const id of moduleIds) progress[id] = { practiced: true };
  return progress;
}

// (a) brand-new/empty profile
const emptyPool = poolForProgress({});
if (emptyPool.keys.length === 0) fail('empty-profile Practice pool is blank - should fall back to module 1');
if (!(emptyPool.tenses.length === 1 && emptyPool.tenses[0] === 'praesens')) {
  fail(`empty-profile pool tenses = [${emptyPool.tenses}], expected fallback ['praesens']`);
}
if (emptyPool.rank !== 1) fail(`empty-profile pool rank = ${emptyPool.rank}, expected 1 (A1 fallback)`);
for (const key of emptyPool.keys) {
  const [inf, tense, pronoun] = key.split('|');
  const verb = VERBS.find((v) => v.infinitive === inf);
  if (getForm(verb, tense, pronoun) == null) fail(`empty-profile pool: null form for drawn card ${key}`);
}
ok(`Practice pool (a) empty profile: ${emptyPool.keys.length} cards, module-1 fallback (praesens/A1), no dead cards`);

// (b) mid-progress: practiced through A1.03 (tier1-01..03) - should NOT yet include tier1-04/05 material
const midPool = poolForProgress(practicedModules('tier1-01-praesens', 'tier1-02-stem-changing', 'tier1-03-sein-haben-werden'));
for (const key of midPool.keys) {
  const [inf, tense, pronoun] = key.split('|');
  const verb = VERBS.find((v) => v.infinitive === inf);
  if (getForm(verb, tense, pronoun) == null) fail(`mid-progress pool: null form for drawn card ${key}`);
}
const emptyKeySet = new Set(emptyPool.keys);
const midKeySet = new Set(midPool.keys);
if (![...emptyKeySet].every((k) => midKeySet.has(k))) {
  fail('mid-progress pool dropped material that was already unlocked - cumulative pool must never shrink');
}
ok(`Practice pool (b) mid-progress (A1.01-A1.03 practiced): ${midPool.keys.length} cards, superset of empty-profile pool`);

// (c) fully-completed: every module practiced
const fullPool = poolForProgress(practicedModules(...allModules().map((m) => m.id)));
if (fullPool.verbs.length !== VERBS.length) {
  fail(`fully-completed pool has ${fullPool.verbs.length} verbs unlocked, expected all ${VERBS.length}`);
}
const allModuleTenses = new Set(allModules().flatMap((m) => m.tenses));
if (fullPool.tenses.length !== allModuleTenses.size) {
  fail(`fully-completed pool tenses = ${fullPool.tenses.length}, expected union of all module tenses = ${allModuleTenses.size}`);
}
for (const key of fullPool.keys) {
  const [inf, tense, pronoun] = key.split('|');
  const verb = VERBS.find((v) => v.infinitive === inf);
  if (getForm(verb, tense, pronoun) == null) fail(`fully-completed pool: null form for drawn card ${key}`);
}
const fullKeySet = new Set(fullPool.keys);
if (![...midKeySet].every((k) => fullKeySet.has(k))) {
  fail('fully-completed pool dropped material from an earlier-unlocked module - cumulative pool must never shrink');
}
ok(`Practice pool (c) fully-completed: ${fullPool.keys.length} cards across all ${VERBS.length} verbs, superset of mid-progress pool`);

// Monotonic-growth spot check: practicing one more module (tier2-06, unlocks A2 + perfekt) must
// strictly grow the pool while every previously-unlocked card is still present - this is the
// "old material keeps appearing" guarantee spaced repetition depends on.
const growthPool = poolForProgress(practicedModules('tier1-01-praesens', 'tier1-02-stem-changing', 'tier1-03-sein-haben-werden', 'tier2-06-perfekt-weak'));
const growthKeySet = new Set(growthPool.keys);
if (growthPool.keys.length <= midPool.keys.length) {
  fail(`practicing an additional module did not grow the pool (${midPool.keys.length} -> ${growthPool.keys.length})`);
}
if (![...midKeySet].every((k) => growthKeySet.has(k))) {
  fail('practicing an additional module dropped previously-unlocked cards instead of adding to them');
}
ok(`Practice pool cumulative growth: +1 module grew pool ${midPool.keys.length} -> ${growthPool.keys.length} cards, no regressions`);

// ---------------------------------------------------------------- summary
console.log('---');
if (failures) {
  console.error(`${failures} FAILURE(S)`);
  process.exit(1);
} else {
  console.log('All checks passed.');
}

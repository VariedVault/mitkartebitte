// The course registry - the plug-in point. A future course (cases, prepositions,
// word order...) is just another array of module descriptors pushed onto COURSES.
//
// Module descriptor shape:
// {
//   id: 'tier1-01-praesens',       // stable id, used in routes + progress/SRS keys
//   tier: 1,                        // 1-4, drives color identity + course-map grouping
//   order: 1,                       // overall 1-16 sequence
//   title: 'Präsens: Regular Verbs',
//   level: 'A1',
//   summary: 'One-line course-map card description.',
//   verbPool: (verbs) => verbs.filter(...),   // subset of VERBS this module drills
//   tenses: ['praesens'],           // tense keys drills.js understands
//   exerciseTypes: ['fill', 'mc'],
//   checkpoint: { count: 8, passThreshold: 0.8 },
//   explanation: {
//     intro: 'string',
//     rules: [{ heading, body }],
//     tableDemo: { verb: 'machen', tense: 'praesens' } | undefined,
//     examples: [{ de, en }],
//   },
// }

import tier1_01 from './tier1-01-praesens.js';
import tier1_02 from './tier1-02-stem-changing.js';
import tier1_03 from './tier1-03-sein-haben-werden.js';
import tier1_04 from './tier1-04-modalverben.js';
import tier1_05 from './tier1-05-imperativ.js';
import tier2_06 from './tier2-06-perfekt-weak.js';
import tier2_07 from './tier2-07-perfekt-strong-sein.js';
import tier2_08 from './tier2-08-praeteritum-weak.js';
import tier2_09 from './tier2-09-praeteritum-strong-modals.js';
import tier3_10 from './tier3-10-separable-prefixes.js';
import tier3_11 from './tier3-11-reflexive.js';
import tier4_12 from './tier4-12-plusquamperfekt.js';
import tier4_13 from './tier4-13-futur.js';
import tier4_14 from './tier4-14-konjunktiv2.js';
import tier4_15 from './tier4-15-konjunktiv1.js';
import tier4_16 from './tier4-16-passiv.js';

export const COURSES = [
  {
    id: 'conjugation',
    title: 'Conjugation',
    modules: [
      tier1_01, tier1_02, tier1_03, tier1_04, tier1_05,
      tier2_06, tier2_07, tier2_08, tier2_09,
      tier3_10, tier3_11,
      tier4_12, tier4_13, tier4_14, tier4_15, tier4_16,
    ],
  },
  // Future courses (cases, prepositions, adjective endings, word order) plug in here
  // as sibling entries - no changes needed anywhere else in the app.
];

export function allModules() {
  return COURSES.flatMap((c) => c.modules).sort((a, b) => a.order - b.order);
}

export function getModule(id) {
  return allModules().find((m) => m.id === id);
}

export function previousModule(mod) {
  return allModules().find((m) => m.order === mod.order - 1) || null;
}

/**
 * Soft lock only - never blocks navigation, just tells the UI whether to show a
 * "usually comes after X" nudge. A module is locked if the immediately-preceding
 * module (by course order) hasn't had its checkpoint passed yet for this profile.
 */
export function isModuleSoftLocked(mod, progress) {
  const prev = previousModule(mod);
  if (!prev) return false;
  return !progress[prev.id]?.checkpointPassed;
}

export function modulesByTier(tier) {
  return allModules().filter((m) => m.tier === tier);
}

// ---------------------------------------------------------------- Practice-deck gating
// Two independent gates, both driven by checkpoint-passed status (not merely visited):
//   - TENSES: union of .tenses from every module whose checkpoint this profile has passed.
//   - VERB LEVEL: a module's checkpoint passing unlocks its whole CEFR level's verbs,
//     cumulatively (passing any B1 module also keeps A1/A2 unlocked).
// Both fall back to module 1's tenses / level so a brand-new profile's Practice deck
// is never empty on day one.

const LEVEL_RANK = { A1: 1, A2: 2, B1: 3 };

/** Set of tense keys unlocked for Practice, given a profile's progress map. */
export function unlockedTenses(progress) {
  const set = new Set();
  for (const mod of allModules()) {
    if (progress[mod.id]?.checkpointPassed) mod.tenses.forEach((t) => set.add(t));
  }
  if (set.size === 0) allModules()[0].tenses.forEach((t) => set.add(t));
  return set;
}

/** Highest CEFR verb-level rank unlocked for Practice (1=A1, 2=A2, 3=B1). */
export function unlockedVerbRank(progress) {
  let rank = 0;
  for (const mod of allModules()) {
    if (progress[mod.id]?.checkpointPassed) rank = Math.max(rank, LEVEL_RANK[mod.level] || 0);
  }
  return rank || LEVEL_RANK[allModules()[0].level];
}

export function isVerbLevelUnlocked(verbLevel, rank) {
  return (LEVEL_RANK[verbLevel] || 1) <= rank;
}

// The cumulative Practice pool - one shared definition so Learn home's due-count/mastery
// return-hook and the Practice tab itself always agree on exactly what's included. Used
// to live only inside practice.js; pulled out once Learn home also needed to reason about
// "what's actually practiceable right now" instead of hardcoding A1.

import * as store from '../store.js';
import { VERBS } from './verbs-a1.js';
import { factKeysFor, TENSE_ORDER } from '../ui/verbUtils.js';

export const LEVELS = ['A1', 'A2', 'B1'];

// A brand-new profile (no checkpoint passed yet, nothing pinned) still gets a non-empty,
// varied deck instead of "nothing to practice" - a small hand-picked spread of common
// verbs, not the whole A1 set (that stays behind the A1 checkpoint, same as every level).
const STARTER_INFINITIVES = ['sein', 'haben', 'machen', 'gehen', 'kommen', 'essen', 'trinken', 'wohnen', 'arbeiten', 'kaufen'];

/** Every level whose checkpoint this profile has passed. */
export function unlockedLevels(profileId) {
  const progress = store.getProgress(profileId);
  return LEVELS.filter((l) => progress.levels[l]?.checkpointPassed);
}

/** Cumulative pool = every verb from a checkpoint-passed level, PLUS anything explicitly
 *  pinned via a verb card's "Add to practice" (regardless of level/checkpoint status) -
 *  falling back to the starter set when neither applies, so Practice is never blank.
 *  Tenses are whatever each verb actually has data for (TENSE_ORDER, filtered per-verb by
 *  factKeysFor) rather than a fixed list, so a newly-populated tense (e.g. Präteritum once
 *  A2 ships) is automatically included with no call-site changes needed. */
export function practicePoolVerbs(profileId) {
  const progress = store.getProgress(profileId);
  const levels = unlockedLevels(profileId);
  const pinnedSet = new Set(progress.pinnedVerbs);

  const unlockedVerbs = levels.length > 0 ? VERBS.filter((v) => levels.includes(v.level)) : VERBS.filter((v) => STARTER_INFINITIVES.includes(v.infinitive));
  const pinnedVerbs = VERBS.filter((v) => pinnedSet.has(v.infinitive));
  return [...new Set([...unlockedVerbs, ...pinnedVerbs])];
}

export function practicePoolKeys(profileId) {
  return factKeysFor(practicePoolVerbs(profileId), TENSE_ORDER);
}

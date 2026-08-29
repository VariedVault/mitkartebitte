// The Grammar Practice pool - the grammar analogue of practicePool.js, over the SEPARATE
// grammar SRS deck. Nothing here reads or writes the verb deck.

import * as store from '../store.js';
import { GRAMMAR_TIERS, drillFactsForTier } from './grammarPoints.js';

// Before any grammar checkpoint is passed, Grammar Practice draws from this starter set (the
// preposition→case facts) so it is never blank - the direct mirror of the verb deck's
// 10-verb starter set. Once the A1 checkpoint is passed, the full A1 deck unlocks.
const STARTER_FACT_IDS = [
  'prep-fuer', 'prep-durch', 'prep-gegen', 'prep-ohne', 'prep-um',
  'prep-mit', 'prep-nach', 'prep-bei', 'prep-seit', 'prep-von', 'prep-zu', 'prep-aus',
];

/** Grammar tiers whose checkpoint this profile has passed. */
export function unlockedGrammarTiers(profileId) {
  return GRAMMAR_TIERS.filter((t) => store.isGrammarCheckpointPassed(profileId, t));
}

/** The facts currently in the Grammar Practice pool - every unlocked tier's facts, or the
 *  starter set when nothing is unlocked yet. */
export function grammarPracticeFacts(profileId) {
  const tiers = unlockedGrammarTiers(profileId);
  if (tiers.length === 0) {
    return drillFactsForTier('A1').filter((f) => STARTER_FACT_IDS.includes(f.id));
  }
  return tiers.flatMap((t) => drillFactsForTier(t));
}

export function grammarPracticeKeys(profileId) {
  return grammarPracticeFacts(profileId).map((f) => f.key);
}

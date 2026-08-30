// The Vocabulary Practice pool - the vocab analogue of practicePool.js / grammarDeck.js,
// over the SEPARATE vocab SRS deck (store's vocab-srs key). Cumulative across unlocked
// tiers; gated by the per-tier vocab checkpoint; never reads the verb or grammar decks.

import * as store from '../store.js';
import { VOCAB_TIERS, drillFactsForTier, wordById, drillFactsForWord } from './vocabulary.js';

// Before any vocab checkpoint is passed, Vocabulary Practice draws from this A1 starter set
// (recognition + gender facts of a dozen very common A1 words) so it is never blank - the
// direct mirror of the verb/grammar starter sets.
const STARTER_WORD_IDS = [
  'v-a1-mann', 'v-a1-frau', 'v-a1-kind', 'v-a1-haus', 'v-a1-brot', 'v-a1-wasser',
  'v-a1-tag', 'v-a1-buch', 'v-a1-auto', 'v-a1-stadt', 'v-a1-hand', 'v-a1-tisch',
];

export function unlockedVocabTiers(profileId) {
  return VOCAB_TIERS.filter((t) => store.isVocabCheckpointPassed(profileId, t));
}

/** Facts in the Vocabulary Practice pool: every unlocked tier's facts (cumulative), or the
 *  A1 starter set when nothing is unlocked yet, PLUS any individually pinned words'
 *  facts - deduped by key. */
export function vocabPracticeFacts(profileId) {
  const tiers = unlockedVocabTiers(profileId);
  const base = tiers.length === 0
    ? STARTER_WORD_IDS.map(wordById).filter(Boolean).flatMap(drillFactsForWord).filter((f) => f.type === 'recognition' || f.type === 'gender')
    : tiers.flatMap((t) => drillFactsForTier(t));
  const pinnedFacts = store.getPinnedVocab(profileId).map(wordById).filter(Boolean).flatMap(drillFactsForWord);
  const seen = new Set();
  const out = [];
  for (const f of [...base, ...pinnedFacts]) {
    if (seen.has(f.key)) continue;
    seen.add(f.key);
    out.push(f);
  }
  return out;
}

export function vocabPracticeKeys(profileId) {
  return vocabPracticeFacts(profileId).map((f) => f.key);
}

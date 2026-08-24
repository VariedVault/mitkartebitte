// Leitner-box spaced repetition. A "fact" is one memorizable unit: a verb in one tense,
// for one pronoun - e.g. "fahren|praesens|du". Wrong answers re-queue; there are no
// lives/penalties, only a box demotion so the fact comes back sooner.

const BOX_INTERVAL_DAYS = [0, 1, 3, 7, 16, 35]; // index = box number (1-5 used; 0 unused)
const MAX_BOX = 5;
const DAY_MS = 24 * 60 * 60 * 1000;

export function factKey(infinitive, tense, pronoun) {
  return `${infinitive}|${tense}|${pronoun}`;
}

export function parseFactKey(key) {
  const [infinitive, tense, pronoun] = key.split('|');
  return { infinitive, tense, pronoun };
}

/** Record an answer for a fact, mutating the deck (caller persists via store.saveSRSDeck). */
export function recordAnswer(deck, key, correct) {
  const now = Date.now();
  const existing = deck.facts[key] || { box: 1, dueAt: now, correctStreak: 0, lastSeen: 0, timesSeen: 0 };
  const box = correct ? Math.min(MAX_BOX, existing.box + 1) : 1;
  deck.facts[key] = {
    box,
    dueAt: now + BOX_INTERVAL_DAYS[box] * DAY_MS,
    correctStreak: correct ? existing.correctStreak + 1 : 0,
    lastSeen: now,
    timesSeen: existing.timesSeen + 1,
  };
  return deck.facts[key];
}

export function isMastered(deck, key) {
  const f = deck.facts[key];
  return !!f && f.box >= MAX_BOX;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Orders verb+tense entries for a session: overdue ones first (most urgent box first),
 * then never-attempted ones, then everything else due later - same three-bucket shape as
 * before, but each bucket is shuffled before its priority sort, so ties (most notably the
 * whole "never-attempted" bucket, which has no inherent order) come out in random order
 * instead of a fixed one. That's what makes repeated practice of the same module cycle
 * through the whole verb pool - every entry gets drawn once before any of them repeat -
 * rather than always drawing the same first few in the same order.
 *
 * `entries` is [{ vt, factKeys }] - one entry per verb+tense, with the underlying
 * per-pronoun fact keys used only to look up due-ness/box in the deck.
 */
export function buildVtQueue(deck, entries) {
  const now = Date.now();
  const scored = entries.map(({ vt, factKeys }) => {
    const facts = factKeys.map((k) => deck.facts[k]).filter(Boolean);
    if (facts.length === 0) return { vt, bucket: 1, priority: 0 }; // never attempted
    const dueFacts = facts.filter((f) => f.dueAt <= now);
    if (dueFacts.length) return { vt, bucket: 0, priority: Math.min(...dueFacts.map((f) => f.box)) };
    return { vt, bucket: 2, priority: Math.min(...facts.map((f) => f.dueAt)) };
  });
  return shuffle(scored)
    .sort((a, b) => a.bucket - b.bucket || a.priority - b.priority)
    .map((s) => s.vt);
}

/** Mastery % for a set of fact keys belonging to one module - used for the progress ring. */
export function masteryForKeys(deck, keys) {
  if (keys.length === 0) return 0;
  const total = keys.reduce((sum, key) => {
    const f = deck.facts[key];
    return sum + (f ? Math.min(f.box, MAX_BOX) : 0);
  }, 0);
  return Math.round((total / (keys.length * MAX_BOX)) * 100);
}

export { MAX_BOX, BOX_INTERVAL_DAYS };

// Leitner-box spaced repetition. A "fact" is one memorizable unit: a verb in one tense,
// for one pronoun — e.g. "fahren|praesens|du". Wrong answers re-queue; there are no
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

/**
 * Builds a session queue from a candidate pool of fact keys: overdue facts first
 * (most urgent box first), then never-seen facts, then everything else, until `count`
 * is reached. This gives real spaced-repetition behavior across sessions while still
 * producing a full session's worth of drills even on a first-ever visit.
 */
export function buildSessionQueue(deck, candidateKeys, count) {
  const now = Date.now();
  const due = [];
  const fresh = [];
  const rest = [];
  for (const key of candidateKeys) {
    const f = deck.facts[key];
    if (!f) fresh.push(key);
    else if (f.dueAt <= now) due.push({ key, box: f.box });
    else rest.push({ key, dueAt: f.dueAt });
  }
  due.sort((a, b) => a.box - b.box);
  rest.sort((a, b) => a.dueAt - b.dueAt);
  const ordered = [...due.map((d) => d.key), ...fresh, ...rest.map((r) => r.key)];
  return ordered.slice(0, count);
}

/** Mastery % for a set of fact keys belonging to one module — used for the progress ring. */
export function masteryForKeys(deck, keys) {
  if (keys.length === 0) return 0;
  const total = keys.reduce((sum, key) => {
    const f = deck.facts[key];
    return sum + (f ? Math.min(f.box, MAX_BOX) : 0);
  }, 0);
  return Math.round((total / (keys.length * MAX_BOX)) * 100);
}

export { MAX_BOX, BOX_INTERVAL_DAYS };

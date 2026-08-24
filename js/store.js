// Local persistence. Namespaced localStorage keys, per spec:
//   mitkartebitte:schemaVersion                   -> global course-structure version (migration gate)
//   mitkartebitte:profiles                        -> index of all profiles
//   mitkartebitte:profile:<id>:progress           -> per-level checkpoint status + pinned verbs
//   mitkartebitte:profile:<id>:srs                -> Leitner deck state (verb|tense|pronoun facts)
//   mitkartebitte:profile:<id>:position            -> resume-where-you-left-off
//   mitkartebitte:profile:<id>:activity            -> heatmap dates (opt-in, off by default)
//   mitkartebitte:profile:<id>:settings            -> per-profile preferences

const NS = 'mitkartebitte';
const PROFILES_KEY = `${NS}:profiles`;
const ACTIVE_KEY = `${NS}:activeProfile`;
const SCHEMA_VERSION_KEY = `${NS}:schemaVersion`;

// Bump whenever the course structure changes shape enough that old progress/srs data
// would be meaningless or crash the new views (e.g. this revamp: 16 modules -> A1 verb
// core + level checkpoints). See migrateIfNeeded() below.
const CURRENT_SCHEMA_VERSION = 2;

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw == null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable - app still works in-memory for this session */
  }
}

function uid() {
  return (crypto.randomUUID ? crypto.randomUUID() : `id-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`);
}

function keyFor(profileId, part) {
  return `${NS}:profile:${profileId}:${part}`;
}

// ---------------------------------------------------------------- migration

/**
 * Runs once at startup, before anything else touches storage. If this is a fresh
 * install (no schemaVersion key at all AND no profiles yet), just stamps the current
 * version - nothing to migrate. If an OLDER version is found (or profiles exist with no
 * version stamped at all, i.e. pre-dates this concept), wipes every profile's
 * course-shaped state (progress/srs/position - NOT name/settings/activity, which stay
 * meaningful across a course restructure) and sets a flag so the UI shows a one-time
 * calm notice instead of just silently resetting. Never throws on a corrupt/unexpected
 * old shape - clearing is the correct response either way, not a crash.
 */
export function migrateIfNeeded() {
  const stored = read(SCHEMA_VERSION_KEY, null);
  const hadProfilesAlready = listProfiles().length > 0;
  if (stored === CURRENT_SCHEMA_VERSION) return false;

  if (hadProfilesAlready) {
    for (const profile of listProfiles()) {
      for (const part of ['progress', 'srs', 'position']) {
        try { localStorage.removeItem(keyFor(profile.id, part)); } catch { /* ignore */ }
      }
      setSetting(profile.id, 'restructureNoticePending', true);
    }
  }
  write(SCHEMA_VERSION_KEY, CURRENT_SCHEMA_VERSION);
  return hadProfilesAlready;
}

// ---------------------------------------------------------------- profiles

export function listProfiles() {
  return read(PROFILES_KEY, []);
}

export function ensureSeedProfiles() {
  let profiles = listProfiles();
  if (profiles.length === 0) {
    profiles = [{ id: uid(), name: 'You', createdAt: Date.now() }];
    write(PROFILES_KEY, profiles);
  }
  return profiles;
}

export function createProfile(name) {
  const profiles = listProfiles();
  const profile = { id: uid(), name: name || 'New learner', createdAt: Date.now() };
  profiles.push(profile);
  write(PROFILES_KEY, profiles);
  return profile;
}

export function renameProfile(id, name) {
  const profiles = listProfiles();
  const p = profiles.find((x) => x.id === id);
  if (p) {
    p.name = name;
    write(PROFILES_KEY, profiles);
  }
  return p;
}

export function deleteProfile(id) {
  const profiles = listProfiles().filter((p) => p.id !== id);
  write(PROFILES_KEY, profiles);
  for (const part of ['progress', 'srs', 'position', 'activity', 'settings']) {
    try { localStorage.removeItem(keyFor(id, part)); } catch { /* ignore */ }
  }
  if (getActiveProfileId() === id) write(ACTIVE_KEY, null);
}

/** Everyday reset: wipes ONE profile's progress/deck/position. Keeps the profile (name,
 *  settings, activity heatmap) and every other profile untouched. */
export function clearProfileData(id) {
  for (const part of ['progress', 'srs', 'position']) {
    try { localStorage.removeItem(keyFor(id, part)); } catch { /* ignore */ }
  }
}

/** Factory reset: wipes every mitkartebitte:* key in localStorage — all profiles, all data. */
export function resetAllData() {
  try {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(`${NS}:`)) keys.push(k);
    }
    keys.forEach((k) => localStorage.removeItem(k));
  } catch { /* storage unavailable */ }
}

export function getActiveProfileId() {
  return read(ACTIVE_KEY, null);
}

export function setActiveProfileId(id) {
  write(ACTIVE_KEY, id);
}

// ---------------------------------------------------------------- course progress (per level + pinned verbs)

const LEVELS = ['A1', 'A2', 'B1'];

function defaultProgress() {
  return { levels: Object.fromEntries(LEVELS.map((l) => [l, { checkpointPassed: false }])), pinnedVerbs: [] };
}

/** { levels: { A1: { checkpointPassed }, A2: {...}, B1: {...} }, pinnedVerbs: [infinitive] }
 *  Per-verb mastery/retention is computed live from the SRS deck, never stored here.
 *  Defensively shape-checked, not just presence-checked: migrateIfNeeded() should always
 *  clear a pre-restructure profile's progress before this is ever read, but a shape this
 *  central is worth a second line of defense - an unexpected/old-shaped value here falls
 *  back to a fresh default instead of crashing every view that reads `.levels`. */
export function getProgress(profileId) {
  const raw = read(keyFor(profileId, 'progress'), null);
  if (!raw || typeof raw !== 'object' || !raw.levels || !Array.isArray(raw.pinnedVerbs)) return defaultProgress();
  return raw;
}

function writeProgress(profileId, progress) {
  write(keyFor(profileId, 'progress'), progress);
  return progress;
}

export function setCheckpointPassed(profileId, level, passed) {
  const progress = getProgress(profileId);
  progress.levels[level] = { ...(progress.levels[level] || {}), checkpointPassed: passed };
  return writeProgress(profileId, progress);
}

export function isCheckpointPassed(profileId, level) {
  return !!getProgress(profileId).levels[level]?.checkpointPassed;
}

/** Verbs the user has explicitly added to Practice via a verb card's "Add to practice",
 *  independent of whether their level's checkpoint is passed yet - gives early, targeted
 *  practice access without waiting for (or bypassing the intent of) the level gate. */
export function togglePinnedVerb(profileId, infinitive) {
  const progress = getProgress(profileId);
  const set = new Set(progress.pinnedVerbs);
  if (set.has(infinitive)) set.delete(infinitive);
  else set.add(infinitive);
  progress.pinnedVerbs = [...set];
  writeProgress(profileId, progress);
  return set.has(infinitive);
}

export function isPinnedVerb(profileId, infinitive) {
  return getProgress(profileId).pinnedVerbs.includes(infinitive);
}

// ---------------------------------------------------------------- SRS deck

/** { facts: { [factKey]: { box, dueAt, correctStreak, lastSeen, timesSeen } } } */
export function getSRSDeck(profileId) {
  return read(keyFor(profileId, 'srs'), { facts: {} });
}

export function saveSRSDeck(profileId, deck) {
  write(keyFor(profileId, 'srs'), deck);
}

// ---------------------------------------------------------------- position (resume)

export function getPosition(profileId) {
  return read(keyFor(profileId, 'position'), null);
}

export function setPosition(profileId, position) {
  write(keyFor(profileId, 'position'), position);
}

// ---------------------------------------------------------------- activity heatmap (opt-in)

export function getActivity(profileId) {
  return read(keyFor(profileId, 'activity'), {});
}

/** Local calendar-day key (not UTC) - toISOString() would misfile any session between
 *  local midnight and the local UTC offset (e.g. 00:00-02:00 in CEST) under the
 *  previous day, since that moment is still "yesterday" in UTC. */
export function activityDateKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function recordActivity(profileId) {
  const settings = getSettings(profileId);
  if (!settings.heatmapEnabled) return;
  const activity = getActivity(profileId);
  const day = activityDateKey();
  activity[day] = (activity[day] || 0) + 1;
  write(keyFor(profileId, 'activity'), activity);
}

// ---------------------------------------------------------------- settings

export function getSettings(profileId) {
  return read(keyFor(profileId, 'settings'), {
    heatmapEnabled: false,
    speed: 1,
    onboardingDone: false,
    restructureNoticePending: false,
  });
}

export function setSetting(profileId, key, value) {
  const settings = getSettings(profileId);
  settings[key] = value;
  write(keyFor(profileId, 'settings'), settings);
  return settings;
}

// ---------------------------------------------------------------- export / import

function collectProfileData(id) {
  return {
    profile: listProfiles().find((p) => p.id === id),
    progress: getProgress(id),
    srs: getSRSDeck(id),
    position: getPosition(id),
    activity: getActivity(id),
    settings: getSettings(id),
  };
}

export function exportProfile(id) {
  return { version: 2, exportedAt: new Date().toISOString(), profiles: [collectProfileData(id)] };
}

export function exportAllProfiles() {
  return { version: 2, exportedAt: new Date().toISOString(), profiles: listProfiles().map((p) => collectProfileData(p.id)) };
}

/** Imports a previously-exported bundle. New ids are minted so importing never clobbers an existing profile. */
export function importData(bundle) {
  if (!bundle || !Array.isArray(bundle.profiles)) throw new Error('Not a mit Karte, bitte export file.');
  const profiles = listProfiles();
  let imported = 0;
  for (const entry of bundle.profiles) {
    if (!entry.profile) continue;
    const newId = uid();
    profiles.push({ id: newId, name: `${entry.profile.name} (imported)`, createdAt: Date.now() });
    if (entry.progress) write(keyFor(newId, 'progress'), entry.progress);
    if (entry.srs) write(keyFor(newId, 'srs'), entry.srs);
    if (entry.position) write(keyFor(newId, 'position'), entry.position);
    if (entry.activity) write(keyFor(newId, 'activity'), entry.activity);
    if (entry.settings) write(keyFor(newId, 'settings'), entry.settings);
    imported++;
  }
  write(PROFILES_KEY, profiles);
  return imported;
}

/** Restores a backup directly into an existing profile (overwriting its progress/deck), keeping its id and name. */
export function importIntoProfile(profileId, bundle) {
  if (!bundle || !Array.isArray(bundle.profiles) || !bundle.profiles[0]) throw new Error('Not a mit Karte, bitte export file.');
  const entry = bundle.profiles[0];
  if (entry.progress) write(keyFor(profileId, 'progress'), entry.progress);
  if (entry.srs) write(keyFor(profileId, 'srs'), entry.srs);
  if (entry.position) write(keyFor(profileId, 'position'), entry.position);
  if (entry.activity) write(keyFor(profileId, 'activity'), entry.activity);
  if (entry.settings) write(keyFor(profileId, 'settings'), { ...getSettings(profileId), ...entry.settings });
}

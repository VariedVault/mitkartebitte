// Local persistence. Namespaced localStorage keys, per spec:
//   mitkartebitte:profiles                      -> index of all profiles
//   mitkartebitte:profile:<id>:progress          -> per-module completion/mastery
//   mitkartebitte:profile:<id>:srs                -> Leitner deck state
//   mitkartebitte:profile:<id>:position           -> resume-where-you-left-off
//   mitkartebitte:profile:<id>:activity           -> heatmap dates (opt-in, off by default)
//   mitkartebitte:profile:<id>:settings           -> per-profile preferences

const NS = 'mitkartebitte';
const PROFILES_KEY = `${NS}:profiles`;
const ACTIVE_KEY = `${NS}:activeProfile`;

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

// ---------------------------------------------------------------- progress

/** { [moduleId]: { percent, checkpointPassed, mastery, attempts } } */
export function getProgress(profileId) {
  return read(keyFor(profileId, 'progress'), {});
}

export function setModuleProgress(profileId, moduleId, patch) {
  const progress = getProgress(profileId);
  progress[moduleId] = { ...(progress[moduleId] || { percent: 0, checkpointPassed: false, mastery: 0, attempts: 0 }), ...patch };
  write(keyFor(profileId, 'progress'), progress);
  return progress[moduleId];
}

// ---------------------------------------------------------------- SRS deck

/** { facts: { [factKey]: { box, dueAt, correctStreak, lastSeen } } } */
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

export function recordActivity(profileId) {
  const settings = getSettings(profileId);
  if (!settings.heatmapEnabled) return;
  const activity = getActivity(profileId);
  const day = new Date().toISOString().slice(0, 10);
  activity[day] = (activity[day] || 0) + 1;
  write(keyFor(profileId, 'activity'), activity);
}

// ---------------------------------------------------------------- settings

export function getSettings(profileId) {
  return read(keyFor(profileId, 'settings'), {
    heatmapEnabled: false,
    speed: 1,
    onboardingDone: false,
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
  return { version: 1, exportedAt: new Date().toISOString(), profiles: [collectProfileData(id)] };
}

export function exportAllProfiles() {
  return { version: 1, exportedAt: new Date().toISOString(), profiles: listProfiles().map((p) => collectProfileData(p.id)) };
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

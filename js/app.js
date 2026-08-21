import * as store from './store.js';
import { route, startRouter, navigate, currentPath } from './router.js';
import { initTTS } from './tts.js';
import { renderCourseMap } from './views/courseMap.js';
import { renderOnboarding } from './views/onboarding.js';
import { renderLesson } from './views/lesson.js';
import { renderPractice } from './views/practice.js';
import { renderDataPanel } from './views/dataPanel.js';
import { renderImpressum, renderDatenschutz, renderContact } from './views/legal.js';

initTTS();
store.ensureSeedProfiles();

const els = {
  header: document.getElementById('appHeader'),
  breadcrumb: document.getElementById('breadcrumb'),
  profilePill: document.getElementById('profilePill'),
  view: document.getElementById('view'),
  nav: document.getElementById('bottomNav'),
};

export function activeProfileId() {
  return store.getActiveProfileId();
}

/** Single-user app: always resolves to a real profile, auto-activating the first one if none is set yet. */
export function requireProfile() {
  let id = store.getActiveProfileId();
  const profiles = store.listProfiles();
  if (!id || !profiles.some((p) => p.id === id)) {
    id = profiles[0]?.id || null;
    if (id) store.setActiveProfileId(id);
  }
  return id;
}

export function setBreadcrumb(text) {
  els.breadcrumb.textContent = text || '';
}

export function refreshProfilePill() {
  const id = store.getActiveProfileId();
  const profile = store.listProfiles().find((p) => p.id === id);
  els.profilePill.innerHTML = '';
  if (!profile) {
    els.profilePill.hidden = true;
    return;
  }
  els.profilePill.hidden = false;
  const avatar = document.createElement('span');
  avatar.className = 'profile-avatar';
  avatar.textContent = profile.name.slice(0, 1).toUpperCase();
  const name = document.createElement('span');
  name.textContent = profile.name;
  els.profilePill.appendChild(avatar);
  els.profilePill.appendChild(name);
}

function setActiveNav(name) {
  els.nav.querySelectorAll('button').forEach((b) => b.classList.toggle('active', b.dataset.nav === name));
}

/** "Home" is the map for a returning user, onboarding for a brand-new one. Always
 *  rendered at the bare root (no hash) - see router.js's navigate('') support. */
export function goToCourseMap() {
  navigate('');
}

// ---------------------------------------------------------------- routes

/** Shared by the bare-root route and the /course-map alias (kept for any stray deep link). */
async function renderHome() {
  const id = requireProfile();
  const settings = store.getSettings(id);
  setActiveNav('map');
  refreshProfilePill();
  if (!settings.onboardingDone) {
    setBreadcrumb('Module 0 · Get started');
    await renderOnboarding(els.view, {
      profileId: id,
      onDone: () => {
        store.setSetting(id, 'onboardingDone', true);
        refreshProfilePill();
        navigate(''); // re-render the bare root, now as the map
      },
    });
    return;
  }
  setBreadcrumb('');
  await renderCourseMap(els.view, { profileId: id });
}

route('/', renderHome);
route('/course-map', renderHome); // alias - internal links always use the bare root instead

route('/module/:id', async ({ id: moduleId }) => {
  const profileId = requireProfile();
  setActiveNav('map');
  refreshProfilePill();
  await renderLesson(els.view, { profileId, moduleId, setBreadcrumb });
});

route('/practice', async () => {
  const profileId = requireProfile();
  setBreadcrumb('Practice · Ride the deck');
  setActiveNav('practice');
  refreshProfilePill();
  await renderPractice(els.view, { profileId });
});

route('/data', async () => {
  const profileId = requireProfile();
  setBreadcrumb('Backup & settings');
  setActiveNav('settings');
  refreshProfilePill();
  await renderDataPanel(els.view, { profileId });
});

route('/impressum', async () => {
  requireProfile();
  setBreadcrumb('Impressum');
  setActiveNav('');
  refreshProfilePill();
  await renderImpressum(els.view);
});

route('/datenschutz', async () => {
  requireProfile();
  setBreadcrumb('Datenschutzerklärung');
  setActiveNav('');
  refreshProfilePill();
  await renderDatenschutz(els.view);
});

route('/contact', async () => {
  requireProfile();
  setBreadcrumb('Contact');
  setActiveNav('');
  refreshProfilePill();
  await renderContact(els.view);
});

document.getElementById('wordmarkBtn').addEventListener('click', () => navigate(''));
els.profilePill.addEventListener('click', () => navigate('/data'));
els.nav.querySelectorAll('button').forEach((btn) => {
  btn.addEventListener('click', () => navigate(btn.dataset.path));
});

startRouter();

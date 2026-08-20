import * as store from './store.js';
import { route, startRouter, navigate, currentPath } from './router.js';
import { initTTS } from './tts.js';
import { renderProfiles } from './views/profiles.js';
import { renderCourseMap } from './views/courseMap.js';
import { renderOnboarding } from './views/onboarding.js';
import { renderLesson } from './views/lesson.js';
import { renderPractice } from './views/practice.js';
import { renderDataPanel } from './views/dataPanel.js';

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

export function requireProfile() {
  const id = store.getActiveProfileId();
  if (!id || !store.listProfiles().some((p) => p.id === id)) return null;
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

export function goToCourseMap() {
  navigate('/course-map');
}

// ---------------------------------------------------------------- routes

route('/', async () => {
  const id = requireProfile();
  if (!id) return navigate('/profiles');
  const settings = store.getSettings(id);
  if (!settings.onboardingDone) return navigate('/onboarding');
  const pos = store.getPosition(id);
  if (pos && pos.path && pos.path !== '/') return navigate(pos.path);
  return navigate('/course-map');
});

route('/profiles', async () => {
  setBreadcrumb('');
  setActiveNav('');
  refreshProfilePill();
  await renderProfiles(els.view, { onSelected: (id) => afterProfileSelected(id) });
});

route('/onboarding', async () => {
  const id = requireProfile();
  if (!id) return navigate('/profiles');
  setBreadcrumb('Module 0 · Get started');
  setActiveNav('map');
  refreshProfilePill();
  await renderOnboarding(els.view, {
    profileId: id,
    onDone: () => {
      store.setSetting(id, 'onboardingDone', true);
      navigate('/course-map');
    },
  });
});

route('/course-map', async () => {
  const id = requireProfile();
  if (!id) return navigate('/profiles');
  setBreadcrumb('');
  setActiveNav('map');
  refreshProfilePill();
  store.setPosition(id, { path: '/course-map' });
  await renderCourseMap(els.view, { profileId: id });
});

route('/module/:id', async ({ id: moduleId }) => {
  const profileId = requireProfile();
  if (!profileId) return navigate('/profiles');
  setActiveNav('map');
  refreshProfilePill();
  store.setPosition(profileId, { path: `/module/${moduleId}` });
  await renderLesson(els.view, { profileId, moduleId, setBreadcrumb });
});

route('/practice', async () => {
  const profileId = requireProfile();
  if (!profileId) return navigate('/profiles');
  setBreadcrumb('Practice · Ride the deck');
  setActiveNav('practice');
  refreshProfilePill();
  await renderPractice(els.view, { profileId });
});

route('/data', async () => {
  const profileId = requireProfile();
  if (!profileId) return navigate('/profiles');
  setBreadcrumb('Backup & settings');
  setActiveNav('settings');
  refreshProfilePill();
  await renderDataPanel(els.view, { profileId });
});

function afterProfileSelected(id) {
  store.setActiveProfileId(id);
  const settings = store.getSettings(id);
  refreshProfilePill();
  if (!settings.onboardingDone) return navigate('/onboarding');
  const pos = store.getPosition(id);
  navigate(pos && pos.path && pos.path !== '/profiles' ? pos.path : '/course-map');
}

document.getElementById('wordmarkBtn').addEventListener('click', () => navigate('/course-map'));
els.profilePill.addEventListener('click', () => navigate('/profiles'));
els.nav.querySelectorAll('button').forEach((btn) => {
  btn.addEventListener('click', () => navigate(btn.dataset.path));
});

startRouter();

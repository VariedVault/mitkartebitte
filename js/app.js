import * as store from './store.js';
import { route, startRouter, navigate, currentPath } from './router.js';
import { initTTS } from './tts.js';
import { renderLearnHome } from './views/learnHome.js';
import { renderOnboarding } from './views/onboarding.js';
import { renderLevel } from './views/level.js';
import { renderVerbCard } from './views/verbCard.js';
import { renderGrammarRules } from './views/grammarRules.js';
import { renderCheckpoint } from './views/checkpoint.js';
import { renderPractice } from './views/practice.js';
import { renderDataPanel } from './views/dataPanel.js';
import { renderImpressum, renderDatenschutz, renderContact } from './views/legal.js';
import { renderFoundationsHome } from './views/foundationsHome.js';
import { renderFoundationsGroup } from './views/foundationsGroup.js';
import { renderFoundationsCard } from './views/foundationsCard.js';
import { renderCasesStub } from './views/casesGrammar.js';
import { renderGrammarA1Home } from './views/grammarA1.js';
import { renderGrammarTierHome } from './views/grammarTierHome.js';
import { renderGrammarPoint } from './views/grammarPoint.js';
import { renderGrammarLesson } from './views/grammarLesson.js';
import { renderGrammarCheckpoint } from './views/grammarCheckpoint.js';

store.migrateIfNeeded(); // must run before anything else reads profile-scoped storage
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

/** "Home" is Learn for a returning user, onboarding for a brand-new one. Always rendered
 *  at the bare root (no hash) - see router.js's navigate('') support. */
export function goToLearnHome() {
  navigate('');
}

// ---------------------------------------------------------------- routes

/** Shared by the bare-root route and the /learn alias (kept for any stray deep link). */
async function renderHome() {
  const id = requireProfile();
  const settings = store.getSettings(id);
  setActiveNav('learn');
  refreshProfilePill();
  if (!settings.onboardingDone) {
    setBreadcrumb('Get started');
    await renderOnboarding(els.view, {
      profileId: id,
      onDone: () => {
        store.setSetting(id, 'onboardingDone', true);
        refreshProfilePill();
        navigate(''); // re-render the bare root, now as Learn home
      },
    });
    return;
  }
  setBreadcrumb('');
  await renderLearnHome(els.view, { profileId: id });
}

route('/', renderHome);
route('/learn', renderHome); // alias - internal links always use the bare root instead

route('/level/:level', async ({ level }) => {
  const profileId = requireProfile();
  setActiveNav('learn');
  refreshProfilePill();
  await renderLevel(els.view, { profileId, level, setBreadcrumb });
});

route('/verb/:infinitive', async ({ infinitive }) => {
  const profileId = requireProfile();
  setActiveNav('learn');
  refreshProfilePill();
  await renderVerbCard(els.view, { profileId, infinitive, setBreadcrumb });
});

route('/foundations', async () => {
  const profileId = requireProfile();
  setActiveNav('learn');
  refreshProfilePill();
  await renderFoundationsHome(els.view, { profileId, setBreadcrumb });
});

route('/foundations/:group', async ({ group }) => {
  requireProfile();
  setActiveNav('learn');
  refreshProfilePill();
  await renderFoundationsGroup(els.view, { group, setBreadcrumb });
});

route('/foundations/:group/:index', async ({ group, index }) => {
  requireProfile();
  setActiveNav('learn');
  refreshProfilePill();
  await renderFoundationsCard(els.view, { group, index, setBreadcrumb });
});

route('/grammar/:tense', async ({ tense }) => {
  requireProfile();
  setActiveNav('learn');
  refreshProfilePill();
  await renderGrammarRules(els.view, { tense, setBreadcrumb });
});

// A1 Cases & Grammar - the real built tier. These specific routes are registered BEFORE the
// generic /cases/:tier stub below so /cases/a1 resolves to the real home; /cases/a2 and
// /cases/b1 still fall through to the "Coming soon" stub. All additive, distinct namespace.
route('/cases/a1', async () => {
  const profileId = requireProfile();
  setActiveNav('learn');
  refreshProfilePill();
  renderGrammarA1Home(els.view, { profileId, setBreadcrumb });
});
route('/cases/a1/point/:pointId', async ({ pointId }) => {
  requireProfile();
  setActiveNav('learn');
  refreshProfilePill();
  renderGrammarPoint(els.view, { pointId, setBreadcrumb });
});
route('/cases/a1/lesson/:lessonId', async ({ lessonId }) => {
  requireProfile();
  setActiveNav('learn');
  refreshProfilePill();
  renderGrammarLesson(els.view, { lessonId, setBreadcrumb });
});
route('/cases/a1/checkpoint', async () => {
  const profileId = requireProfile();
  setActiveNav('learn');
  refreshProfilePill();
  renderGrammarCheckpoint(els.view, { profileId, setBreadcrumb });
});

// A2 Cases & Grammar - real built tier (generic tier home + shared point/lesson/checkpoint
// renderers). Registered before /cases/:tier so /cases/a2 is the real home; B1 still stubs.
route('/cases/a2', async () => {
  const profileId = requireProfile();
  setActiveNav('learn');
  refreshProfilePill();
  renderGrammarTierHome(els.view, { profileId, tier: 'A2', setBreadcrumb });
});
route('/cases/a2/point/:pointId', async ({ pointId }) => {
  requireProfile();
  setActiveNav('learn');
  refreshProfilePill();
  renderGrammarPoint(els.view, { pointId, setBreadcrumb });
});
route('/cases/a2/lesson/:lessonId', async ({ lessonId }) => {
  requireProfile();
  setActiveNav('learn');
  refreshProfilePill();
  renderGrammarLesson(els.view, { lessonId, setBreadcrumb });
});
route('/cases/a2/checkpoint', async () => {
  const profileId = requireProfile();
  setActiveNav('learn');
  refreshProfilePill();
  renderGrammarCheckpoint(els.view, { profileId, tier: 'A2', setBreadcrumb });
});

// Cases & Grammar placeholder stub (B1) - distinct /cases/ namespace so it never
// overlaps the /grammar/:tense route above. Additive only.
route('/cases/:tier', async ({ tier }) => {
  requireProfile();
  setActiveNav('learn');
  refreshProfilePill();
  await renderCasesStub(els.view, { tier, setBreadcrumb });
});

route('/checkpoint/:level', async ({ level }) => {
  const profileId = requireProfile();
  setActiveNav('learn');
  refreshProfilePill();
  await renderCheckpoint(els.view, { profileId, level, setBreadcrumb });
});

route('/practice', async () => {
  const profileId = requireProfile();
  setBreadcrumb('Practice');
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

import * as store from '../store.js';
import * as srs from '../srs.js';
import { el } from '../ui/components.js';
import { VERBS } from '../data/verbs-a1.js';
import { factKeysFor } from '../ui/verbUtils.js';
import { navigate } from '../router.js';

const LEVELS = ['A1', 'A2', 'B1'];
const A1_VERBS = VERBS.filter((v) => v.level === 'A1');
const A1_TENSES = ['praesens', 'imperativ', 'perfekt'];
const A1_KEYS = factKeysFor(A1_VERBS, A1_TENSES);

/** The main return signal: how many already-seen A1 facts are due for review right now.
 *  Earned (only counts real review debt, not new material), calm when it's zero, never a
 *  streak or a guilt trip - see srs.js's dueCount for the "why never-seen isn't due" note. */
function returnHookCard(profileId) {
  const deck = store.getSRSDeck(profileId);
  const due = srs.dueCount(deck, A1_KEYS);
  const mastery = srs.masteryForKeys(deck, A1_KEYS);

  const card = el('div', { class: 'card', style: 'text-align:center' });
  if (due > 0) {
    card.appendChild(el('div', { style: 'font-size:38px;font-weight:800;font-family:var(--font-display);color:var(--felt-900)' }, String(due)));
    card.appendChild(el('p', { style: 'margin:4px 0 14px' }, `card${due === 1 ? '' : 's'} due for review today`));
    const btn = el('button', { class: 'btn btn-primary btn-lg' }, 'Review now');
    btn.addEventListener('click', () => navigate('/practice'));
    card.appendChild(btn);
  } else {
    card.appendChild(el('div', { style: 'font-size:30px' }, '✓'));
    card.appendChild(el('p', { style: 'margin:6px 0 0;color:var(--ink-soft)' }, 'Nothing due today. Come back tomorrow, or practice anyway.'));
  }
  card.appendChild(el('p', { style: 'margin-top:14px;font-size:12.5px;color:var(--ink-soft)' }, `A1 mastery: ${mastery}%`));
  return card;
}

function restructureNotice(profileId) {
  const banner = el('div', { class: 'banner', style: 'margin-bottom:16px' }, [
    el('strong', {}, 'Note - '),
    'the course has been restructured — progress has been reset.',
  ]);
  const dismiss = el('button', { class: 'btn', style: 'font-size:11.5px;padding:6px 10px;margin-top:8px' }, 'Got it');
  dismiss.addEventListener('click', () => {
    store.setSetting(profileId, 'restructureNoticePending', false);
    banner.remove();
  });
  const wrap = el('div');
  wrap.appendChild(banner);
  wrap.appendChild(dismiss);
  return wrap;
}

function foundationsCard() {
  const card = el('div', { class: 'card track-card track-card--locked' });
  card.appendChild(el('div', { class: 'track-card-title' }, ['🔤 Foundations', el('span', { class: 'track-card-tag' }, 'Coming soon')]));
  card.appendChild(el('p', { style: 'color:var(--ink-soft);margin:0' }, 'The alphabet, pronunciation, and numbers - a future phase.'));
  return card;
}

function levelCard(profileId, level) {
  const levelVerbs = VERBS.filter((v) => v.level === level);
  const passed = store.isCheckpointPassed(profileId, level);
  const active = level === 'A1'; // only A1 has data this phase

  const card = el('button', { class: `card track-card level-card${!active ? ' track-card--locked' : ''}` });
  card.appendChild(
    el('div', { class: 'track-card-title' }, [
      `${level} Conjugation`,
      passed ? el('span', { class: 'track-card-tag track-card-tag--done' }, '✓ Practice unlocked') : !active ? el('span', { class: 'track-card-tag' }, '🔒 Locked') : null,
    ])
  );
  card.appendChild(
    el(
      'p',
      { style: 'color:var(--ink-soft);margin:0' },
      active
        ? `${levelVerbs.length} verbs · Präsens, Imperativ, Perfekt`
        : 'Verb data and tenses for this level arrive in a later phase.'
    )
  );
  if (active) {
    card.addEventListener('click', () => navigate(`/level/${level}`));
  } else {
    card.disabled = true;
  }
  return card;
}

export async function renderLearnHome(container, { profileId }) {
  container.innerHTML = '';
  const profile = store.listProfiles().find((p) => p.id === profileId);
  container.appendChild(el('h1', {}, 'Learn'));
  container.appendChild(el('p', { style: 'color:var(--cream-dim)' }, `Hi ${profile ? profile.name : 'there'}. No streaks, no lives - just what's actually due.`));

  const settings = store.getSettings(profileId);
  if (settings.restructureNoticePending) container.appendChild(restructureNotice(profileId));

  container.appendChild(returnHookCard(profileId));

  container.appendChild(el('h2', { style: 'margin:24px 0 12px;font-size:15px;letter-spacing:0.04em;text-transform:uppercase;color:var(--cream-dim)' }, 'Foundations'));
  container.appendChild(foundationsCard());

  container.appendChild(el('h2', { style: 'margin:24px 0 12px;font-size:15px;letter-spacing:0.04em;text-transform:uppercase;color:var(--cream-dim)' }, 'Conjugation'));
  const trackGrid = el('div', { style: 'display:flex;flex-direction:column;gap:12px' });
  for (const level of LEVELS) trackGrid.appendChild(levelCard(profileId, level));
  container.appendChild(trackGrid);
}

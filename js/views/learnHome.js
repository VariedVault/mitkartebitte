import * as store from '../store.js';
import * as srs from '../srs.js';
import { el } from '../ui/components.js';
import { VERBS } from '../data/verbs-a1.js';
import { practicePoolKeys, unlockedLevels, LEVELS } from '../data/practicePool.js';
import { navigate } from '../router.js';

/** The main return signal: how many already-seen facts (across whatever's currently
 *  unlocked for Practice - same pool practice.js draws from, so the number here always
 *  matches what Practice actually shows) are due for review right now. Earned (only
 *  counts real review debt, not new material), calm when it's zero, never a streak or a
 *  guilt trip - see srs.js's dueCount for the "why never-seen isn't due" note. */
function returnHookCard(profileId) {
  const deck = store.getSRSDeck(profileId);
  const keys = practicePoolKeys(profileId);
  const due = srs.dueCount(deck, keys);
  const mastery = srs.masteryForKeys(deck, keys);
  const levels = unlockedLevels(profileId);
  const levelLabel = levels.length > 0 ? levels.join('+') : 'starter set';

  const card = el('div', { class: 'card', style: 'text-align:center' });
  if (due > 0) {
    card.appendChild(el('div', { style: 'font-size:38px;font-weight:800;font-family:var(--font-display);color:var(--felt-900)' }, String(due)));
    card.appendChild(el('p', { style: 'margin:4px 0 14px' }, `card${due === 1 ? '' : 's'} due for review today`));
    const btn = el('button', { class: 'btn btn-primary btn-lg' }, 'Review now');
    btn.addEventListener('click', () => navigate('/practice'));
    card.appendChild(btn);
  } else {
    card.appendChild(el('div', { style: 'font-size:30px' }, '✓'));
  }
  card.appendChild(el('p', { style: 'margin-top:14px;font-size:12.5px;color:var(--ink-soft)' }, `${levelLabel} mastery: ${mastery}%`));
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

function foundationsCard(profileId) {
  const studied = !!store.getSettings(profileId).foundationsStudied;
  const card = el('button', { class: 'card track-card', style: 'text-align:left' });
  card.appendChild(
    el('div', { class: 'track-card-title' }, [
      '🔤 Foundations',
      studied ? el('span', { class: 'track-card-tag track-card-tag--done' }, '✓ Studied') : null,
    ])
  );
  card.appendChild(el('p', { style: 'color:var(--ink-soft);margin:0' }, 'The alphabet, umlauts, and the sound rules that trip up beginners - reference only.'));
  card.addEventListener('click', () => navigate('/foundations'));
  return card;
}

/** Compact, centered, side-by-side-with-its-siblings card - deliberately NOT the same
 *  left-aligned title+subtitle layout as foundationsCard/other .track-card uses, since this
 *  one has to survive being squeezed to a third of the screen width (see .level-grid). */
function levelCard(profileId, level) {
  const levelVerbs = VERBS.filter((v) => v.level === level);
  const passed = store.isCheckpointPassed(profileId, level);
  const active = levelVerbs.length > 0; // this level has verb data authored, whichever level it is

  const card = el('button', { class: `card level-card${!active ? ' track-card--locked' : ''}` });
  card.appendChild(el('div', { class: 'level-card-badge' }, passed ? '✓' : active ? ' ' : '🔒'));
  card.appendChild(el('div', { class: 'level-card-name' }, level));
  card.appendChild(el('div', { class: 'level-card-count' }, active ? `${levelVerbs.length} verbs` : 'Later phase'));
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

  container.appendChild(el('h2', { style: 'margin:16px 0 10px;font-size:15px;letter-spacing:0.04em;text-transform:uppercase;color:var(--cream-dim)' }, 'Foundations'));
  container.appendChild(foundationsCard(profileId));

  container.appendChild(el('h2', { style: 'margin:16px 0 10px;font-size:15px;letter-spacing:0.04em;text-transform:uppercase;color:var(--cream-dim)' }, 'Conjugation'));
  const trackGrid = el('div', { class: 'level-grid' });
  for (const level of LEVELS) trackGrid.appendChild(levelCard(profileId, level));
  container.appendChild(trackGrid);
}

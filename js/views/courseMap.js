import * as store from '../store.js';
import { el, progressRing } from '../ui/components.js';
import { allModules, isModuleSoftLocked, previousModule, isLevelStudied } from '../data/modules/index.js';
import { factKeysForModule } from '../ui/drills.js';
import { masteryForKeys } from '../srs.js';
import { navigate } from '../router.js';
import { VERBS } from '../data/verbs.js';

const TIER_META = {
  1: { label: 'Tier 1 · A1 Foundations', color: 'var(--tier1)' },
  2: { label: 'Tier 2 · A2 Past Tenses', color: 'var(--tier2)' },
  3: { label: 'Tier 3 · B1 Prefixes & Reflexives', color: 'var(--tier3)' },
  4: { label: 'Tier 4 · B1 Advanced', color: 'var(--tier4)' },
};

const LEVELS = ['A1', 'A2', 'B1'];
const CUMULATIVE_LABEL = { A1: 'A1', A2: 'A1 + A2', B1: 'A1 + A2 + B1' };

// Categories are pure study material now (see lesson.js) - the only gate left is per CEFR
// level: study every category in a level and the cumulative Practice tab picks up that
// level's tenses/verbs (modules/index.js's unlockedTenses/unlockedVerbRank), on top of
// whatever earlier levels already unlocked. This banner is the single place that relationship
// is surfaced, since the per-category cards below no longer say anything about practice.
function levelSummaryBanner(modules, progress) {
  const card = el('div', { class: 'card', style: 'margin-bottom:20px' });
  card.appendChild(el('h3', {}, 'Practice'));
  card.appendChild(
    el('p', { style: 'color:var(--ink-soft);font-size:13.5px;margin-bottom:12px' }, 'Study every category in a level below, then practice everything you\'ve studied so far in one cumulative deck.')
  );

  let highestComplete = null;
  for (const level of LEVELS) {
    const levelModules = modules.filter((m) => m.level === level);
    const studiedCount = levelModules.filter((m) => progress[m.id]?.studied).length;
    if (isLevelStudied(level, progress)) highestComplete = level;
    card.appendChild(
      el('div', { style: 'display:flex;align-items:center;justify-content:space-between;padding:6px 0' }, [
        el('span', {}, `${level}${studiedCount === levelModules.length ? ' ✓' : ''}`),
        el('span', { style: 'color:var(--ink-soft);font-size:13px' }, `${studiedCount} / ${levelModules.length} studied`),
      ])
    );
  }

  if (highestComplete) {
    const btn = el('button', { class: 'btn btn-primary btn-block', style: 'margin-top:10px' }, `Practice ${CUMULATIVE_LABEL[highestComplete]} →`);
    btn.addEventListener('click', () => navigate('/practice'));
    card.appendChild(btn);
  } else {
    card.appendChild(el('p', { style: 'color:var(--ink-soft);font-size:13px;margin-top:6px' }, "Finish studying A1's categories to unlock practice."));
  }
  return card;
}

export async function renderCourseMap(container, { profileId }) {
  container.innerHTML = '';
  const profile = store.listProfiles().find((p) => p.id === profileId);
  container.appendChild(el('h1', {}, 'Course Map'));
  container.appendChild(
    el('p', { style: 'color:var(--cream-dim)' }, `Hi ${profile ? profile.name : 'there'}. Sixteen stops, four tiers. 🔒 just means "usually comes later" - every module is still one tap away whenever you want it.`)
  );

  const deck = store.getSRSDeck(profileId);
  const progress = store.getProgress(profileId);
  const modules = allModules();

  if (modules.length === 0) {
    container.appendChild(el('div', { class: 'card' }, 'No modules loaded yet.'));
    return;
  }

  container.appendChild(levelSummaryBanner(modules, progress));

  for (const tier of [1, 2, 3, 4]) {
    const tierModules = modules.filter((m) => m.tier === tier);
    if (tierModules.length === 0) continue;
    const meta = TIER_META[tier];
    const section = el('div', { class: 'tier-section' });
    section.appendChild(
      el('div', { class: 'tier-heading' }, [el('span', { class: 'tier-dot', style: `background:${meta.color}` }), el('h2', {}, meta.label)])
    );
    const grid = el('div', { class: 'module-grid' });
    for (const mod of tierModules) {
      const pool = mod.verbPool(VERBS);
      const keys = factKeysForModule(pool, mod.tenses);
      const mastery = masteryForKeys(deck, keys);
      const modProgress = progress[mod.id];
      const studied = !!modProgress?.studied;
      const mastered = mastery >= 100;
      const softLocked = !studied && isModuleSoftLocked(mod, progress);
      const node = el('button', { class: `module-node${mastered ? ' mastered' : ''}`, style: `border-color:${mastered ? meta.color : 'transparent'}` });
      node.appendChild(el('div', { class: 'num' }, `${mod.level} · ${String(mod.order).padStart(2, '0')}${softLocked ? ' · 🔒' : ''}`));
      node.appendChild(el('div', { class: 'title', style: softLocked ? 'opacity:.75' : '' }, mod.title));
      // Binary status - studied or not - matches what the category page actually asks of
      // the user now (read it, tap "Got it"). Practice progress lives in the banner above.
      let statusText = mastered ? '✓ Mastered' : studied ? '✓ Studied' : 'Not studied yet';
      if (softLocked) {
        const prev = previousModule(mod);
        statusText = `Usually after "${prev.title}"`;
      }
      node.appendChild(el('div', { class: 'status', style: `color:${softLocked ? 'var(--ink-soft)' : studied ? meta.color : 'var(--ink-soft)'}` }, statusText));
      const ring = progressRing(mastery, { size: 30, stroke: 4 });
      ring.classList.add('mini-ring');
      node.appendChild(ring);
      node.addEventListener('click', () => navigate(`/module/${mod.id}`));
      grid.appendChild(node);
    }
    section.appendChild(grid);
    container.appendChild(section);
  }
}

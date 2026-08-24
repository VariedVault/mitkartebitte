import * as store from '../store.js';
import { el, progressRing } from '../ui/components.js';
import { allModules, isModuleSoftLocked, previousModule } from '../data/modules/index.js';
import { factKeysForModule, unstartedVerbTenseCount } from '../ui/drills.js';
import { masteryForKeys } from '../srs.js';
import { navigate } from '../router.js';
import { VERBS } from '../data/verbs.js';

const TIER_META = {
  1: { label: 'Tier 1 · A1 Foundations', color: 'var(--tier1)' },
  2: { label: 'Tier 2 · A2 Past Tenses', color: 'var(--tier2)' },
  3: { label: 'Tier 3 · B1 Prefixes & Reflexives', color: 'var(--tier3)' },
  4: { label: 'Tier 4 · B1 Advanced', color: 'var(--tier4)' },
};

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
      const { total, remaining } = unstartedVerbTenseCount(deck, pool, mod.tenses);
      const modProgress = progress[mod.id];
      const mastered = mastery >= 100;
      const softLocked = !modProgress?.practiced && isModuleSoftLocked(mod, progress);
      const node = el('button', { class: `module-node${mastered ? ' mastered' : ''}`, style: `border-color:${mastered ? meta.color : 'transparent'}` });
      node.appendChild(el('div', { class: 'num' }, `${mod.level} · ${String(mod.order).padStart(2, '0')}${softLocked ? ' · 🔒' : ''}`));
      node.appendChild(el('div', { class: 'title', style: softLocked ? 'opacity:.75' : '' }, mod.title));
      // Status text stays in one vocabulary throughout - verb counts, never a percentage -
      // so it reads as one consistent progression instead of switching mental models
      // partway through: not started -> N left to try -> all practiced -> mastered.
      let statusText = mastered
        ? '✓ Mastered'
        : remaining === total
          ? 'Not started'
          : remaining === 0
            ? 'All verbs practiced'
            : `${remaining} verb${remaining === 1 ? '' : 's'} left to try`;
      if (softLocked) {
        const prev = previousModule(mod);
        statusText = `Usually after "${prev.title}"`;
      }
      node.appendChild(el('div', { class: 'status', style: `color:${softLocked ? 'var(--ink-soft)' : mastery > 0 ? meta.color : 'var(--ink-soft)'}` }, statusText));
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

import * as store from '../store.js';
import { el, speakerButton } from '../ui/components.js';
import { getModule, isModuleSoftLocked, previousModule } from '../data/modules/index.js';
import { VERBS } from '../data/verbs.js';
import { pronounsFor, pronounLabel, getForm } from '../ui/drills.js';
import { navigate } from '../router.js';

function backToMapLink() {
  const link = el('button', { class: 'btn', style: 'font-size:12.5px;padding:7px 12px;margin-bottom:14px;background:transparent;border-color:rgba(255,255,255,0.25)' }, '← Back to map');
  link.addEventListener('click', () => navigate(''));
  return link;
}

export async function renderLesson(container, { profileId, moduleId, setBreadcrumb }) {
  const mod = getModule(moduleId);
  if (!mod) {
    container.innerHTML = '';
    container.appendChild(backToMapLink());
    container.appendChild(el('div', { class: 'card' }, `Module "${moduleId}" not found.`));
    return;
  }
  setBreadcrumb(`Tier ${mod.tier} · ${mod.title}`);
  container.innerHTML = '';
  renderStudyPhase(container, mod, profileId);
}

// A category page is pure reference material - the full conjugation pattern (ich through
// sie/Sie) for one demo verb, plus the rest of the category's vocabulary below it. There's
// no quiz here: tapping "Got it" just marks the category studied. Actual drilling happens
// in the cumulative Practice tab once a whole CEFR level has been studied (see
// modules/index.js's isLevelStudied/unlockedTenses/unlockedVerbRank).
function renderStudyPhase(container, mod, profileId) {
  container.innerHTML = '';
  container.appendChild(backToMapLink());
  container.appendChild(el('h1', {}, mod.title));
  container.appendChild(el('p', { style: 'color:var(--cream-dim)' }, `${mod.level} · ${mod.summary}`));

  const progress = store.getProgress(profileId);
  const alreadyStudied = !!progress[mod.id]?.studied;
  if (!alreadyStudied && isModuleSoftLocked(mod, progress)) {
    const prev = previousModule(mod);
    container.appendChild(
      el('div', { class: 'banner', style: 'margin-bottom:16px' }, [
        el('strong', {}, '💡 Heads up - '),
        `this usually comes after "${prev.title}", which you haven't studied yet. Nothing's stopping you though - dive in whenever you like.`,
      ])
    );
  }

  const card = el('div', { class: 'card explain' });
  container.appendChild(card);

  const ex = mod.explanation;
  if (ex.intro) {
    for (const para of ex.intro.split('\n\n')) card.appendChild(el('p', {}, para));
  }
  for (const rule of ex.rules || []) {
    card.appendChild(el('h3', {}, rule.heading));
    card.appendChild(el('div', { class: 'rule-box' }, el('p', { style: 'margin:0' }, rule.body)));
  }
  let demoInfinitive = null;
  if (ex.tableDemo) {
    const demoVerb = VERBS.find((v) => v.infinitive === ex.tableDemo.verb);
    if (demoVerb) {
      demoInfinitive = demoVerb.infinitive;
      card.appendChild(demoTable(demoVerb, ex.tableDemo.tense));
    }
  }
  if (ex.examples?.length) {
    card.appendChild(el('h3', {}, 'In context'));
    for (const example of ex.examples) {
      card.appendChild(
        el('div', { class: 'example-line' }, [
          el('span', {}, example.de),
          el('span', { style: 'display:flex;align-items:center;gap:8px' }, [el('span', { style: 'color:var(--ink-soft);font-family:var(--font-body);font-size:13px' }, example.en), speakerButton(example.de)]),
        ])
      );
    }
  }

  const pool = mod.verbPool(VERBS);
  const verbList = verbListSection(pool, demoInfinitive);
  if (verbList) card.appendChild(verbList);

  const actions = el('div', { class: 'toolbar', style: 'margin-top:18px' });
  if (alreadyStudied) {
    actions.appendChild(el('div', { class: 'unlock-banner' }, '✓ Studied'));
    const backBtn = el('button', { class: 'btn' }, 'Back to map');
    backBtn.addEventListener('click', () => navigate(''));
    actions.appendChild(backBtn);
  } else {
    const gotItBtn = el('button', { class: 'btn btn-primary btn-lg' }, 'Got it - mark as studied');
    gotItBtn.addEventListener('click', () => {
      store.setModuleProgress(profileId, mod.id, { studied: true });
      store.recordActivity(profileId);
      navigate('');
    });
    actions.appendChild(gotItBtn);
  }
  container.appendChild(actions);
}

function verbListSection(pool, excludeInfinitive) {
  const others = excludeInfinitive ? pool.filter((v) => v.infinitive !== excludeInfinitive) : pool;
  if (others.length === 0) return null;
  const wrap = el('div', { style: 'margin-top:20px' });
  wrap.appendChild(el('h3', {}, excludeInfinitive ? `Other verbs in this category (${others.length})` : `Verbs in this category (${others.length})`));
  const list = el('div', { class: 'verb-list' });
  for (const v of others) {
    list.appendChild(el('span', { class: 'verb-chip' }, [el('strong', {}, v.infinitive), ` — ${v.english}`]));
  }
  wrap.appendChild(list);
  return wrap;
}

/** Full conjugation table (ich through sie/Sie) for one verb in one tense - the teaching
 *  example on a category page, and reused by practice.js as the flashcard reveal fallback. */
export function demoTable(verb, tense, highlightPronoun) {
  const table = el('table', { class: 'conj-table' });
  const tbody = el('tbody');
  for (const p of pronounsFor(tense)) {
    const form = getForm(verb, tense, p);
    if (form == null) continue;
    tbody.appendChild(
      el('tr', { style: p === highlightPronoun ? 'font-weight:800' : '' }, [
        el('td', { class: `pron-cell pron-${tense === 'imperativ' ? '' : p}`.trim() }, pronounLabel(tense, p)),
        el('td', { class: 'form-cell' }, [form, ' ', speakerButton(form)]),
      ])
    );
  }
  table.appendChild(tbody);
  return table;
}

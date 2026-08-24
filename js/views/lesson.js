import * as store from '../store.js';
import * as srs from '../srs.js';
import { el, speakerButton, progressRing, pronounChip, toast, reviewList, keyboardHelper } from '../ui/components.js';
import { getModule, isModuleSoftLocked, previousModule } from '../data/modules/index.js';
import { VERBS, PRONOUN_LABELS } from '../data/verbs.js';
import {
  pronounsFor, pronounLabel, TENSE_LABELS, answersMatch, factLabel,
  buildFillBlank, buildMultipleChoice, factKeyFor, factKeysForModule, getForm,
} from '../ui/drills.js';
import { navigate } from '../router.js';

function backToMapLink() {
  const link = el('button', { class: 'btn', style: 'font-size:12.5px;padding:7px 12px;margin-bottom:14px;background:transparent;border-color:rgba(255,255,255,0.25)' }, '← Back to map');
  link.addEventListener('click', () => navigate(''));
  return link;
}

// Groups fact keys by verb+tense (one entry per unique combination, regardless of how
// many pronoun forms it has) and hands them to srs.buildVtQueue so a session never
// repeats a verb+tense until every one in the pool has come up at least once. Pools
// smaller than `count` naturally produce a shorter plan instead of forcing repeats.
function buildSessionPlan(pool, tenses, deck, count, exerciseTypes) {
  const vtInfo = new Map();
  for (const verb of pool) {
    for (const tense of tenses) {
      const pronouns = pronounsFor(tense).filter((p) => getForm(verb, tense, p) != null);
      if (pronouns.length === 0) continue;
      const vt = `${verb.infinitive}|${tense}`;
      vtInfo.set(vt, { verb, tense, pronouns });
    }
  }
  const entries = [...vtInfo.entries()].map(([vt, { verb, tense, pronouns }]) => ({
    vt,
    factKeys: pronouns.map((p) => factKeyFor(verb, tense, p)),
  }));
  const ordered = srs.buildVtQueue(deck, entries).slice(0, count);

  const plan = [];
  let typeIdx = 0;
  for (const vt of ordered) {
    const { verb, tense, pronouns } = vtInfo.get(vt);
    const pronoun = pronouns[Math.floor(Math.random() * pronouns.length)];
    const type = exerciseTypes[typeIdx % exerciseTypes.length];
    typeIdx++;
    const exercise = type === 'mc' ? buildMultipleChoice(verb, tense, pronoun, pool) : buildFillBlank(verb, tense, pronoun);
    if (exercise) plan.push(exercise);
  }
  return plan;
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
  renderExplanationPhase(container, mod, profileId);
}

// ---------------------------------------------------------------- explanation phase

function renderExplanationPhase(container, mod, profileId) {
  container.innerHTML = '';
  container.appendChild(backToMapLink());
  container.appendChild(el('h1', {}, mod.title));
  container.appendChild(el('p', { style: 'color:var(--cream-dim)' }, `${mod.level} · ${mod.summary}`));

  const progress = store.getProgress(profileId);
  const alreadyPracticed = !!progress[mod.id]?.practiced;
  if (!alreadyPracticed && isModuleSoftLocked(mod, progress)) {
    const prev = previousModule(mod);
    container.appendChild(
      el('div', { class: 'banner', style: 'margin-bottom:16px' }, [
        el('strong', {}, '💡 Heads up - '),
        `this usually comes after "${prev.title}", which you haven't finished yet. Nothing's stopping you though - dive in whenever you like.`,
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
  if (ex.tableDemo) {
    const demoVerb = VERBS.find((v) => v.infinitive === ex.tableDemo.verb);
    if (demoVerb) card.appendChild(demoTable(demoVerb, ex.tableDemo.tense));
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

  const actions = el('div', { class: 'toolbar', style: 'margin-top:18px' });
  const startBtn = el('button', { class: 'btn btn-primary btn-lg' }, 'Start practice');
  startBtn.addEventListener('click', () => renderPracticePhase(container, mod, profileId));
  actions.appendChild(startBtn);
  container.appendChild(actions);
}

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

// ---------------------------------------------------------------- practice phase

function renderPracticePhase(container, mod, profileId) {
  const deck = store.getSRSDeck(profileId);
  const pool = mod.verbPool(VERBS);
  const plan = buildSessionPlan(pool, mod.tenses, deck, 6, mod.exerciseTypes);

  if (plan.length === 0) {
    container.innerHTML = '';
    container.appendChild(el('div', { class: 'card' }, 'Not enough verb data for this module yet.'));
    return;
  }

  let idx = 0;
  let correctCount = 0;
  const queue = plan;
  const history = [];
  const HARD_CAP = plan.length * 2; // requeues must never make a session run forever

  container.innerHTML = '';
  container.appendChild(backToMapLink());
  container.appendChild(el('h1', {}, mod.title));
  const headerRow = el('div', { style: 'display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap' });
  const progressLine = el('p', { style: 'color:var(--cream-dim);margin:0' });
  const reviewBtn = el('button', { class: 'btn', style: 'font-size:11.5px;padding:6px 10px' }, '📋 Review answers');
  reviewBtn.disabled = true;
  reviewBtn.addEventListener('click', renderReview);
  headerRow.appendChild(progressLine);
  headerRow.appendChild(reviewBtn);
  container.appendChild(headerRow);
  const stage = el('div', { style: 'margin-top:12px' });
  container.appendChild(stage);

  function updateProgressLine() {
    progressLine.textContent = `Practice · ${Math.min(idx + 1, queue.length)} / ${queue.length}`;
  }

  function renderReview() {
    stage.innerHTML = '';
    stage.appendChild(reviewList(history, renderCurrent, 'Back to practice'));
  }

  function next() {
    idx++;
    if (idx >= queue.length || idx >= HARD_CAP) return finishPractice();
    renderCurrent();
  }

  function finishPractice() {
    store.recordActivity(profileId);
    const priorProgress = store.getProgress(profileId)[mod.id];
    store.setModuleProgress(profileId, mod.id, {
      practiced: true,
      mastery: srs.masteryForKeys(deck, factKeysForModule(pool, mod.tenses)),
      attempts: (priorProgress?.attempts || 0) + 1,
    });
    reviewBtn.disabled = true;
    stage.innerHTML = '';
    stage.appendChild(
      el('div', { class: 'card celebrate' }, [
        el('span', { class: 'big-emoji' }, '🃏'),
        el('h2', {}, 'Practice round done.'),
        el('p', { style: 'color:var(--ink-soft)' }, `${correctCount} / ${queue.length} correct this round - the deck remembers, so weak spots come back sooner.`),
        el('div', { class: 'toolbar', style: 'justify-content:center;margin-top:14px' }, [
          (() => {
            const b = el('button', { class: 'btn btn-primary' }, 'Practice again');
            b.addEventListener('click', () => renderPracticePhase(container, mod, profileId));
            return b;
          })(),
          (() => {
            const b = el('button', { class: 'btn' }, 'Back to map');
            b.addEventListener('click', () => navigate(''));
            return b;
          })(),
        ]),
      ])
    );
  }

  function recordAndAdvance(factKey, correct, entry) {
    srs.recordAnswer(deck, factKey, correct);
    store.saveSRSDeck(profileId, deck);
    if (entry) history.push(entry);
    reviewBtn.disabled = history.length === 0;
    if (correct) correctCount++;
    else queue.splice(Math.min(queue.length, idx + 3), 0, requeueExercise(queue[idx]));
  }

  function requeueExercise(exercise) {
    if (exercise.type === 'mc') return buildMultipleChoice(exercise.verb, exercise.tense, exercise.pronoun, pool) || exercise;
    return buildFillBlank(exercise.verb, exercise.tense, exercise.pronoun) || exercise;
  }

  function renderCurrent() {
    updateProgressLine();
    stage.innerHTML = '';
    stage.appendChild(
      renderExercise(queue[idx], { onAnswered: ({ correct, factKey, entry }) => recordAndAdvance(factKey, correct, entry), onNext: next })
    );
  }

  renderCurrent();
}

// ---------------------------------------------------------------- exercise rendering (fill / mc / table)

function exerciseHeader(verb, tense, pronoun) {
  const wrap = el('div', { style: 'margin-bottom:14px' });
  wrap.appendChild(
    el('div', { style: 'display:flex;align-items:center;gap:8px;flex-wrap:wrap' }, [
      el('span', { class: `chip type-${verb.type}`, style: 'background:rgba(0,0,0,0.06)' }, verb.type),
      el('strong', { style: 'font-family:var(--font-mono);font-size:16px' }, verb.infinitive),
      speakerButton(verb.infinitive),
      el('span', { style: 'color:var(--ink-soft);font-size:13px' }, `“${verb.english}”`),
    ])
  );
  wrap.appendChild(el('div', { style: 'margin-top:6px;color:var(--ink-soft);font-size:13px' }, `${TENSE_LABELS[tense]}${pronoun ? ' · ' + pronounLabel(tense, pronoun) : ''}`));
  return wrap;
}

function exampleContext(verb) {
  if (!verb.example) return null;
  return el('div', { class: 'example-line', style: 'margin-top:14px' }, [
    el('span', {}, verb.example.de),
    el('span', { style: 'display:flex;align-items:center;gap:8px' }, [el('span', { style: 'color:var(--ink-soft);font-family:var(--font-body);font-size:12.5px' }, verb.example.en), speakerButton(verb.example.de)]),
  ]);
}

function renderExercise(exercise, { onAnswered, onNext }) {
  if (exercise.type === 'mc') return renderChoiceExercise(exercise, { onAnswered, onNext });
  return renderFillExercise(exercise, { onAnswered, onNext });
}

function renderFillExercise(exercise, { onAnswered, onNext }) {
  const { verb, tense, pronoun, answer, factKey } = exercise;
  const box = el('div', { class: 'drill-box' });
  box.appendChild(exerciseHeader(verb, tense, pronoun));
  const input = el('input', { class: 'drill-input', autocomplete: 'off', autocapitalize: 'off', spellcheck: 'false', placeholder: 'Type the form…' });
  box.appendChild(input);
  box.appendChild(keyboardHelper(input));
  const feedback = el('div', { style: 'margin-top:10px;min-height:22px;font-weight:700' });
  box.appendChild(feedback);
  const submit = el('button', { class: 'btn btn-primary btn-block', style: 'margin-top:12px' }, 'Check');
  box.appendChild(submit);
  const ctx = exampleContext(verb);
  if (ctx) box.appendChild(ctx);

  let answered = false;
  function check() {
    if (answered) return;
    answered = true;
    const correct = answersMatch(input.value, answer);
    input.classList.add(correct ? 'flash-correct' : 'flash-incorrect');
    feedback.style.color = correct ? 'var(--correct)' : 'var(--incorrect)';
    feedback.textContent = correct ? '✓ Genau!' : `→ ${answer}`;
    input.disabled = true;
    submit.textContent = 'Next →';
    onAnswered({ correct, factKey, entry: { prompt: factLabel(verb, tense, pronoun), userAnswer: input.value.trim() || '(blank)', correctAnswer: answer, correct } });
    submit.onclick = () => onNext();
  }
  submit.addEventListener('click', () => (answered ? onNext() : check()));
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); answered ? onNext() : check(); } });
  setTimeout(() => input.focus(), 30);
  return box;
}

function renderChoiceExercise(exercise, { onAnswered, onNext }) {
  const { verb, tense, pronoun, answer, choices, factKey } = exercise;
  const box = el('div', { class: 'drill-box' });
  box.appendChild(exerciseHeader(verb, tense, pronoun));
  const options = el('div', { class: 'mc-options' });
  let answered = false;
  for (const choice of choices) {
    const btn = el('button', { class: 'mc-option', type: 'button' }, choice);
    btn.addEventListener('click', () => {
      if (answered) return;
      answered = true;
      const correct = choice === answer;
      btn.classList.add(correct ? 'correct' : 'incorrect');
      if (!correct) [...options.children].find((c) => c.textContent === answer)?.classList.add('correct');
      onAnswered({ correct, factKey, entry: { prompt: factLabel(verb, tense, pronoun), userAnswer: choice, correctAnswer: answer, correct } });
      setTimeout(onNext, 850);
    });
    options.appendChild(btn);
  }
  box.appendChild(options);
  const ctx = exampleContext(verb);
  if (ctx) box.appendChild(ctx);
  return box;
}

import * as store from '../store.js';
import * as srs from '../srs.js';
import { el, speakerButton, progressRing, pronounChip, toast, reviewList } from '../ui/components.js';
import { getModule, isModuleSoftLocked, previousModule } from '../data/modules/index.js';
import { VERBS, PRONOUN_LABELS } from '../data/verbs.js';
import {
  pronounsFor, pronounLabel, TENSE_LABELS, answersMatch, factLabel,
  buildFillBlank, buildMultipleChoice, buildTableCompletion, factKeysForModule, getForm,
} from '../ui/drills.js';
import { navigate } from '../router.js';

const KEY_HELPERS = ['ä', 'ö', 'ü', 'ß'];

function backToMapLink() {
  const link = el('button', { class: 'btn', style: 'font-size:12.5px;padding:7px 12px;margin-bottom:14px;background:transparent;border-color:rgba(255,255,255,0.25)' }, '← Back to map');
  link.addEventListener('click', () => navigate('/course-map'));
  return link;
}

function randomPronoun(tense) {
  const list = pronounsFor(tense);
  return list[Math.floor(Math.random() * list.length)];
}

function buildSessionPlan(pool, tenses, deck, count, exerciseTypes) {
  const candidateKeys = factKeysForModule(pool, tenses);
  const ordered = srs.buildSessionQueue(deck, candidateKeys, candidateKeys.length);
  const seenVerbTense = new Set();
  const plan = [];
  let typeIdx = 0;
  for (const key of ordered) {
    if (plan.length >= count) break;
    const [infinitive, tense] = key.split('|');
    const vt = `${infinitive}|${tense}`;
    if (seenVerbTense.has(vt)) continue;
    seenVerbTense.add(vt);
    const verb = VERBS.find((v) => v.infinitive === infinitive);
    const type = exerciseTypes[typeIdx % exerciseTypes.length];
    typeIdx++;
    let exercise = null;
    if (type === 'table') exercise = buildTableCompletion(verb, tense);
    else if (type === 'mc') exercise = buildMultipleChoice(verb, tense, randomPronoun(tense), pool);
    else exercise = buildFillBlank(verb, tense, randomPronoun(tense));
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
  const alreadyPassed = !!progress[mod.id]?.checkpointPassed;
  if (!alreadyPassed && isModuleSoftLocked(mod, progress)) {
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
  const skipBtn = el('button', { class: 'btn' }, 'Skip to checkpoint (test out)');
  skipBtn.addEventListener('click', () => renderCheckpointPhase(container, mod, profileId));
  actions.appendChild(startBtn);
  actions.appendChild(skipBtn);
  container.appendChild(actions);
}

function demoTable(verb, tense) {
  const table = el('table', { class: 'conj-table' });
  const tbody = el('tbody');
  for (const p of pronounsFor(tense)) {
    const form = getForm(verb, tense, p);
    if (form == null) continue;
    tbody.appendChild(
      el('tr', {}, [
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
  const plan = buildSessionPlan(pool, mod.tenses, deck, 10, mod.exerciseTypes);

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
    reviewBtn.disabled = true;
    stage.innerHTML = '';
    stage.appendChild(
      el('div', { class: 'card celebrate' }, [
        el('span', { class: 'big-emoji' }, '🃏'),
        el('h2', {}, 'Practice round done.'),
        el('p', { style: 'color:var(--ink-soft)' }, `${correctCount} / ${queue.length} correct this round - the deck remembers, so weak spots come back sooner.`),
        el('div', { class: 'toolbar', style: 'justify-content:center;margin-top:14px' }, [
          (() => {
            const b = el('button', { class: 'btn btn-primary' }, 'Take the checkpoint');
            b.addEventListener('click', () => renderCheckpointPhase(container, mod, profileId));
            return b;
          })(),
          (() => {
            const b = el('button', { class: 'btn' }, 'Practice again');
            b.addEventListener('click', () => renderPracticePhase(container, mod, profileId));
            return b;
          })(),
          (() => {
            const b = el('button', { class: 'btn' }, 'Back to map');
            b.addEventListener('click', () => navigate('/course-map'));
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

function keyboardHelper(input) {
  const bar = el('div', { class: 'keyboard-helper' });
  for (const ch of KEY_HELPERS) {
    const btn = el('button', { type: 'button' }, ch);
    btn.addEventListener('click', () => {
      const start = input.selectionStart ?? input.value.length;
      const end = input.selectionEnd ?? input.value.length;
      input.value = input.value.slice(0, start) + ch + input.value.slice(end);
      input.focus();
      input.selectionStart = input.selectionEnd = start + 1;
    });
    bar.appendChild(btn);
  }
  return bar;
}

function renderExercise(exercise, { onAnswered, onNext }) {
  if (exercise.type === 'table') return renderTableExercise(exercise, { onAnswered, onNext });
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

function renderTableExercise(exercise, { onAnswered, onNext }) {
  const { verb, tense, cells } = exercise;
  const box = el('div', { class: 'drill-box' });
  box.appendChild(exerciseHeader(verb, tense, null));
  box.appendChild(el('p', { style: 'color:var(--ink-soft);font-size:13px' }, 'Fill in every form, then check the whole table.'));
  const table = el('table', { class: 'conj-table' });
  const tbody = el('tbody');
  const inputs = [];
  for (const cell of cells) {
    const input = el('input', { class: 'conj-cell-input', autocomplete: 'off', autocapitalize: 'off', spellcheck: 'false' });
    inputs.push({ input, cell });
    tbody.appendChild(
      el('tr', {}, [
        el('td', { class: `pron-cell pron-${tense === 'imperativ' ? '' : cell.pronoun}`.trim(), style: 'width:38%' }, pronounLabel(tense, cell.pronoun)),
        el('td', {}, input),
      ])
    );
  }
  table.appendChild(tbody);
  box.appendChild(table);
  box.appendChild(keyboardHelper(inputs[0].input));
  const submit = el('button', { class: 'btn btn-primary btn-block', style: 'margin-top:12px' }, 'Check table');
  box.appendChild(submit);

  let answered = false;
  submit.addEventListener('click', () => {
    if (answered) {
      onNext();
      return;
    }
    answered = true;
    let allCorrect = true;
    for (const { input, cell } of inputs) {
      const typed = input.value.trim();
      const correct = answersMatch(input.value, cell.answer);
      input.classList.add('filled', correct ? '' : 'wrong');
      if (!correct) {
        allCorrect = false;
        input.value = cell.answer;
      }
      input.disabled = true;
      onAnswered({
        correct,
        factKey: cell.factKey,
        entry: { prompt: factLabel(verb, tense, cell.pronoun), userAnswer: typed || '(blank)', correctAnswer: cell.answer, correct },
      });
    }
    submit.textContent = allCorrect ? '✓ Alles richtig - Next →' : 'Corrected - Next →';
    submit.style.background = allCorrect ? '' : '';
  });
  return box;
}

// ---------------------------------------------------------------- checkpoint phase

function renderCheckpointPhase(container, mod, profileId) {
  const deck = store.getSRSDeck(profileId);
  const pool = mod.verbPool(VERBS);
  const count = mod.checkpoint?.count || 10;
  const types = mod.exerciseTypes.filter((t) => t !== 'table').length ? mod.exerciseTypes.filter((t) => t !== 'table') : ['fill'];
  const plan = buildSessionPlan(pool, mod.tenses, deck, count, types);

  let idx = 0;
  let correct = 0;
  const history = [];

  container.innerHTML = '';
  container.appendChild(backToMapLink());
  container.appendChild(el('h1', {}, `${mod.title} · Checkpoint`));
  const headerRow = el('div', { style: 'display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap' });
  const progressLine = el('p', { style: 'color:var(--cream-dim);margin:0' }, `Question 1 / ${plan.length}`);
  const reviewBtn = el('button', { class: 'btn', style: 'font-size:11.5px;padding:6px 10px' }, '📋 Review answers');
  reviewBtn.disabled = true;
  reviewBtn.addEventListener('click', renderReview);
  headerRow.appendChild(progressLine);
  headerRow.appendChild(reviewBtn);
  container.appendChild(headerRow);
  const stage = el('div', { style: 'margin-top:12px' });
  container.appendChild(stage);

  function renderReview() {
    stage.innerHTML = '';
    stage.appendChild(reviewList(history, renderCurrent, 'Back to checkpoint'));
  }

  function renderCurrent() {
    progressLine.textContent = `Question ${idx + 1} / ${plan.length}`;
    stage.innerHTML = '';
    stage.appendChild(
      renderExercise(plan[idx], {
        onAnswered: ({ correct: isCorrect, factKey, entry }) => {
          srs.recordAnswer(deck, factKey, isCorrect);
          if (entry) history.push(entry);
          reviewBtn.disabled = history.length === 0;
          if (isCorrect) correct++;
        },
        onNext: () => {
          idx++;
          if (idx >= plan.length) finish();
          else renderCurrent();
        },
      })
    );
  }

  function finish() {
    store.saveSRSDeck(profileId, deck);
    store.recordActivity(profileId);
    reviewBtn.disabled = true;
    const pct = Math.round((correct / plan.length) * 100);
    const threshold = Math.round((mod.checkpoint?.passThreshold ?? 0.8) * 100);
    const passed = pct >= threshold;
    const priorProgress = store.getProgress(profileId)[mod.id];
    store.setModuleProgress(profileId, mod.id, {
      percent: pct,
      checkpointPassed: passed || !!priorProgress?.checkpointPassed,
      mastery: srs.masteryForKeys(deck, factKeysForModule(pool, mod.tenses)),
      attempts: (priorProgress?.attempts || 0) + 1,
    });

    stage.innerHTML = '';
    const card = el('div', { class: 'card celebrate' });
    if (passed) {
      card.appendChild(el('span', { class: 'big-emoji' }, '✨'));
      card.appendChild(el('div', { class: 'unlock-banner' }, `Checkpoint cleared - ${pct}%`));
      card.appendChild(el('p', { style: 'margin-top:14px;color:var(--ink-soft)' }, 'This module is marked mastered. Jump anywhere on the map - nothing here was ever locked.'));
    } else {
      card.appendChild(el('span', { class: 'big-emoji' }, '🃏'));
      card.appendChild(el('h2', {}, `${pct}% this time`));
      card.appendChild(el('p', { style: 'color:var(--ink-soft)' }, `Needed ${threshold}% to clear it - no rush, no streak to lose. Practice a bit more and retake it whenever you like.`));
    }
    card.appendChild(
      el('div', { class: 'toolbar', style: 'justify-content:center;margin-top:14px' }, [
        (() => { const b = el('button', { class: 'btn' }, 'Practice more'); b.addEventListener('click', () => renderPracticePhase(container, mod, profileId)); return b; })(),
        (() => { const b = el('button', { class: 'btn' }, 'Retake checkpoint'); b.addEventListener('click', () => renderCheckpointPhase(container, mod, profileId)); return b; })(),
        (() => { const b = el('button', { class: 'btn btn-primary' }, 'Back to map'); b.addEventListener('click', () => navigate('/course-map')); return b; })(),
      ])
    );
    stage.appendChild(card);
  }

  renderCurrent();
}

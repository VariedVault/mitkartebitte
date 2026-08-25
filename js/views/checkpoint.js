import * as store from '../store.js';
import * as srs from '../srs.js';
import { el, speakerButton, backLink } from '../ui/components.js';
import { VERBS } from '../data/verbs-a1.js';
import { pronounLabel, spokenPronoun, factKeysFor, availableTenses, TENSE_LABELS } from '../ui/verbUtils.js';
import { navigate } from '../router.js';

const QUESTION_COUNT = 8;
const PASS_THRESHOLD = 0.8;

/** Every tense this level's verbs have data for, except Imperativ - Imperativ stays
 *  reference-only (not quizzed) at every level, by design, not by accident. */
function checkpointTenses(levelVerbs) {
  const set = new Set();
  for (const verb of levelVerbs) for (const t of availableTenses(verb)) if (t !== 'imperativ') set.add(t);
  return [...set];
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Fixed card, self-graded (flip, then "Got it"/"Missed it") - same honesty-based grading
 *  as the cumulative Practice deck, just over a fixed question set instead of endless. */
export async function renderCheckpoint(container, { profileId, level, setBreadcrumb }) {
  setBreadcrumb(`${level} Checkpoint`);
  const levelVerbs = VERBS.filter((v) => v.level === level);
  const pool = shuffle(factKeysFor(levelVerbs, checkpointTenses(levelVerbs))).slice(0, QUESTION_COUNT);

  container.innerHTML = '';
  container.appendChild(backLink(`${level} Conjugation`, () => navigate(`/level/${level}`)));
  container.appendChild(el('h1', {}, `${level} Checkpoint`));

  if (pool.length === 0) {
    container.appendChild(el('div', { class: 'card' }, 'Not enough verb data for this level yet.'));
    return;
  }

  container.appendChild(
    el('p', { style: 'color:var(--cream-dim)' }, `${pool.length} questions · flip each card, then grade yourself honestly. Need ${Math.round(PASS_THRESHOLD * 100)}% to pass - no rush if not, retake anytime.`)
  );

  const progressLine = el('p', { style: 'color:var(--cream-dim);text-align:center;margin-top:4px' });
  container.appendChild(progressLine);
  const stage = el('div', { style: 'margin-top:8px' });
  container.appendChild(stage);

  let idx = 0;
  let correctCount = 0;

  function factFromKey(key) {
    const { infinitive, tense, pronoun } = srs.parseFactKey(key);
    const verb = VERBS.find((v) => v.infinitive === infinitive);
    return { verb, tense, pronoun, answer: verb.tables[tense][pronoun] };
  }

  function renderQuestion() {
    progressLine.textContent = `Question ${idx + 1} / ${pool.length}`;
    stage.innerHTML = '';
    const { verb, tense, pronoun, answer } = factFromKey(pool[idx]);

    const scene = el('div', { class: 'flip-scene' });
    const flipCard = el('div', { class: 'flip-card' });
    const inner = el('div', { class: 'flip-card-inner' });

    const front = el('div', { class: 'flip-card-face flip-card-front' });
    front.appendChild(el('div', { style: 'font-size:12px;letter-spacing:.05em;text-transform:uppercase;color:var(--ink-soft)' }, TENSE_LABELS[tense]));
    front.appendChild(el('div', { style: 'font-size:26px;font-weight:800;font-family:var(--font-mono);margin-top:8px' }, `${pronounLabel(tense, pronoun)} · ${verb.infinitive}`));
    front.appendChild(el('div', { style: 'margin-top:6px;color:var(--ink-soft)' }, verb.english));
    const revealBtn = el('button', { class: 'btn btn-primary', style: 'margin-top:16px' }, 'Reveal ↻');
    revealBtn.addEventListener('click', () => flipCard.classList.add('flipped'));
    front.appendChild(revealBtn);

    // Tense label repeated here too - the back face is where you actually grade
    // yourself, and by then the front (the only place that said "Perfekt") is gone.
    // Without this, a Perfekt answer like "sind gefahren" reads as an unexplained past
    // tense showing up in what looks like a present-tense quiz.
    const back = el('div', { class: 'flip-card-face flip-card-back' });
    back.appendChild(el('div', { style: 'font-size:12px;letter-spacing:.05em;text-transform:uppercase;color:var(--cream-dim)' }, TENSE_LABELS[tense]));
    back.appendChild(
      el('div', { style: 'font-size:26px;font-weight:800;font-family:var(--font-mono);margin-top:4px' }, [
        el('span', {}, `${pronounLabel(tense, pronoun)} `),
        answer,
        ' ',
        speakerButton(`${spokenPronoun(tense, pronoun)} ${answer}`),
      ])
    );
    const gradeRow = el('div', { class: 'toolbar', style: 'justify-content:center;margin-top:18px' });
    const missBtn = el('button', { class: 'btn' }, '😵 Missed it');
    const gotBtn = el('button', { class: 'btn btn-primary' }, '✅ Got it');
    missBtn.addEventListener('click', () => grade(false));
    gotBtn.addEventListener('click', () => grade(true));
    gradeRow.appendChild(missBtn);
    gradeRow.appendChild(gotBtn);
    back.appendChild(gradeRow);

    inner.appendChild(front);
    inner.appendChild(back);
    flipCard.appendChild(inner);
    scene.appendChild(flipCard);
    stage.appendChild(scene);
  }

  function grade(correct) {
    if (correct) correctCount++;
    const deck = store.getSRSDeck(profileId);
    srs.recordAnswer(deck, pool[idx], correct);
    store.saveSRSDeck(profileId, deck);
    idx++;
    if (idx >= pool.length) finish();
    else renderQuestion();
  }

  function finish() {
    store.recordActivity(profileId);
    const pct = Math.round((correctCount / pool.length) * 100);
    const passed = pct >= Math.round(PASS_THRESHOLD * 100);
    const alreadyPassed = store.isCheckpointPassed(profileId, level);
    if (passed || alreadyPassed) store.setCheckpointPassed(profileId, level, true);

    stage.innerHTML = '';
    const card = el('div', { class: 'card celebrate' });
    if (passed) {
      card.appendChild(el('span', { class: 'big-emoji' }, '✨'));
      card.appendChild(el('div', { class: 'unlock-banner' }, `Practice unlocked - ${pct}%`));
      card.appendChild(el('p', { style: 'margin-top:14px;color:var(--ink-soft)' }, `${level}'s verbs are now in the cumulative Practice deck - keep practicing to actually retain them.`));
    } else {
      card.appendChild(el('span', { class: 'big-emoji' }, '🃏'));
      card.appendChild(el('h2', {}, `${pct}% this time`));
      card.appendChild(el('p', { style: 'color:var(--ink-soft)' }, `Needed ${Math.round(PASS_THRESHOLD * 100)}% to unlock Practice - no rush, no streak to lose. Study a bit more and retake whenever you like.`));
    }
    card.appendChild(
      el('div', { class: 'toolbar', style: 'justify-content:center;margin-top:14px' }, passed
        ? [
            (() => { const b = el('button', { class: 'btn btn-primary' }, 'Go practice these verbs →'); b.addEventListener('click', () => navigate('/practice')); return b; })(),
            (() => { const b = el('button', { class: 'btn' }, 'Back to Learn'); b.addEventListener('click', () => navigate('')); return b; })(),
          ]
        : [
            (() => { const b = el('button', { class: 'btn btn-primary' }, 'Retake'); b.addEventListener('click', () => navigate(`/checkpoint/${level}`)); return b; })(),
            (() => { const b = el('button', { class: 'btn' }, 'Back to Learn'); b.addEventListener('click', () => navigate('')); return b; })(),
          ]
      )
    );
    stage.appendChild(card);
  }

  renderQuestion();
}

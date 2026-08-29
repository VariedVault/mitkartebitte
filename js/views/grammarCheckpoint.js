import * as store from '../store.js';
import * as srs from '../srs.js';
import { el, backLink } from '../ui/components.js';
import { drillFactsForTier } from '../data/grammarPoints.js';
import { navigate } from '../router.js';

const QUESTION_COUNT = 8;
const PASS_THRESHOLD = 0.8;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Cases & Grammar checkpoint - the grammar analogue of the verb checkpoint, on the
 *  SEPARATE grammar deck + grammar checkpoint state. Passing unlocks that tier's grammar in
 *  Grammar Practice; it never touches Conjugation progress or the verb deck. `tier` defaults
 *  to 'A1' so the A1 route's existing call is behaviourally identical. */
export function renderGrammarCheckpoint(container, { profileId, tier = 'A1', setBreadcrumb }) {
  const tierPath = `/cases/${tier.toLowerCase()}`;
  setBreadcrumb(`${tier} Cases & Grammar Checkpoint`);
  const facts = drillFactsForTier(tier);
  const pool = shuffle(facts).slice(0, QUESTION_COUNT);

  container.innerHTML = '';
  container.appendChild(backLink(`${tier} Cases & Grammar`, () => navigate(tierPath)));
  container.appendChild(el('h1', {}, `${tier} Grammar Checkpoint`));

  if (pool.length === 0) {
    container.appendChild(el('div', { class: 'card' }, 'No grammar facts to test yet.'));
    return;
  }

  container.appendChild(
    el('p', { style: 'color:var(--cream-dim)' }, `${pool.length} questions · flip each card, then grade yourself honestly. Need ${Math.round(PASS_THRESHOLD * 100)}% to pass - retake anytime, no rush.`)
  );

  const progressLine = el('p', { style: 'color:var(--cream-dim);text-align:center;margin-top:4px' });
  container.appendChild(progressLine);
  const stage = el('div', { style: 'margin-top:8px' });
  container.appendChild(stage);

  let idx = 0;
  let correctCount = 0;

  function renderQuestion() {
    progressLine.textContent = `Question ${idx + 1} / ${pool.length}`;
    stage.innerHTML = '';
    const fact = pool[idx];

    const scene = el('div', { class: 'flip-scene' });
    const flipCard = el('div', { class: 'flip-card' });
    const inner = el('div', { class: 'flip-card-inner' });

    const front = el('div', { class: 'flip-card-face flip-card-front' });
    front.appendChild(el('div', { style: 'font-size:12px;letter-spacing:.05em;text-transform:uppercase;color:var(--ink-soft)' }, 'Grammar'));
    front.appendChild(el('div', { style: 'font-size:19px;font-weight:700;margin-top:10px;line-height:1.4' }, fact.prompt));
    const revealBtn = el('button', { class: 'btn btn-primary', style: 'margin-top:16px' }, 'Reveal ↻');
    revealBtn.addEventListener('click', () => flipCard.classList.add('flipped'));
    front.appendChild(revealBtn);

    const back = el('div', { class: 'flip-card-face flip-card-back' });
    back.appendChild(el('div', { style: 'font-size:23px;font-weight:800;font-family:var(--font-mono)' }, fact.answer));
    back.appendChild(el('div', { style: 'margin-top:10px;font-size:13.5px;color:var(--cream-dim);line-height:1.5' }, fact.why));
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
    const deck = store.getGrammarDeck(profileId);
    srs.recordAnswer(deck, pool[idx].key, correct);
    store.saveGrammarDeck(profileId, deck);
    idx++;
    if (idx >= pool.length) finish();
    else renderQuestion();
  }

  function finish() {
    store.recordActivity(profileId);
    const pct = Math.round((correctCount / pool.length) * 100);
    const passed = pct >= Math.round(PASS_THRESHOLD * 100);
    const alreadyPassed = store.isGrammarCheckpointPassed(profileId, tier);
    if (passed || alreadyPassed) store.setGrammarCheckpointPassed(profileId, tier, true);

    stage.innerHTML = '';
    const card = el('div', { class: 'card celebrate' });
    if (passed) {
      card.appendChild(el('span', { class: 'big-emoji' }, '✨'));
      card.appendChild(el('div', { class: 'unlock-banner' }, `Grammar Practice unlocked - ${pct}%`));
      card.appendChild(el('p', { style: 'margin-top:14px;color:var(--ink-soft)' }, `${tier} grammar is now in your Grammar Practice deck - keep practicing to actually retain it.`));
    } else {
      card.appendChild(el('span', { class: 'big-emoji' }, '🃏'));
      card.appendChild(el('h2', {}, `${pct}% this time`));
      card.appendChild(el('p', { style: 'color:var(--ink-soft)' }, `Needed ${Math.round(PASS_THRESHOLD * 100)}% to unlock Grammar Practice - read the reference lessons and retake whenever you like.`));
    }
    card.appendChild(
      el('div', { class: 'toolbar', style: 'justify-content:center;margin-top:14px' }, passed
        ? [
            (() => { const b = el('button', { class: 'btn btn-primary' }, 'Go to Grammar Practice →'); b.addEventListener('click', () => { store.setSetting(profileId, 'practiceDeck', 'grammar'); navigate('/practice'); }); return b; })(),
            (() => { const b = el('button', { class: 'btn' }, 'Back'); b.addEventListener('click', () => navigate(tierPath)); return b; })(),
          ]
        : [
            (() => { const b = el('button', { class: 'btn btn-primary' }, 'Retake'); b.addEventListener('click', () => navigate(`${tierPath}/checkpoint`)); return b; })(),
            (() => { const b = el('button', { class: 'btn' }, 'Back'); b.addEventListener('click', () => navigate(tierPath)); return b; })(),
          ]
      )
    );
    stage.appendChild(card);
  }

  renderQuestion();
}

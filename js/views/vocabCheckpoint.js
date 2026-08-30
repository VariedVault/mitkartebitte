import * as store from '../store.js';
import * as srs from '../srs.js';
import { el, backLink } from '../ui/components.js';
import { drillFactsForTier, wordById } from '../data/vocabulary.js';
import { wordCardBody } from './vocabSection.js';
import { promptFor } from './vocabPractice.js';
import { navigate } from '../router.js';

const QUESTION_COUNT = 8;
const PASS_THRESHOLD = 0.8;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

/** Per-tier Vocabulary checkpoint - mirrors the verb/grammar checkpoints on the SEPARATE
 *  vocab deck + vocab checkpoint state. Passing unlocks that tier in Vocabulary Practice;
 *  never touches the verb or grammar systems. */
export function renderVocabCheckpoint(container, { profileId, tier, setBreadcrumb }) {
  const tierPath = `/vocab/${tier.toLowerCase()}`;
  setBreadcrumb(`${tier} Vocabulary Checkpoint`);
  const pool = shuffle(drillFactsForTier(tier)).slice(0, QUESTION_COUNT);

  container.innerHTML = '';
  container.appendChild(backLink(`${tier} Vocabulary`, () => navigate(tierPath)));
  container.appendChild(el('h1', {}, `${tier} Vocabulary Checkpoint`));

  if (pool.length === 0) { container.appendChild(el('div', { class: 'card' }, 'No vocabulary to test yet.')); return; }

  container.appendChild(el('p', { style: 'color:var(--cream-dim)' }, `${pool.length} questions · flip each card, then grade yourself honestly. Need ${Math.round(PASS_THRESHOLD * 100)}% to pass - retake anytime.`));
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
    const v = wordById(fact.wordId);
    const { label, big } = promptFor(fact.type, v);

    const scene = el('div', { class: 'flip-scene' });
    const flipCard = el('div', { class: 'flip-card' });
    const inner = el('div', { class: 'flip-card-inner' });

    const front = el('div', { class: 'flip-card-face flip-card-front' });
    front.appendChild(el('div', { style: 'font-size:12px;letter-spacing:.05em;text-transform:uppercase;color:var(--ink-soft)' }, label));
    front.appendChild(el('div', { style: 'font-size:24px;font-weight:800;margin-top:10px;font-family:var(--font-mono)' }, big));
    const revealBtn = el('button', { class: 'btn btn-primary', style: 'margin-top:16px' }, 'Reveal ↻');
    revealBtn.addEventListener('click', () => flipCard.classList.add('flipped'));
    front.appendChild(revealBtn);

    const back = el('div', { class: 'flip-card-face flip-card-back', style: 'text-align:left' });
    const bg = el('div', { style: 'background:var(--cream);color:var(--ink);border-radius:12px;padding:14px;width:100%;box-sizing:border-box' });
    bg.appendChild(wordCardBody(v));
    back.appendChild(bg);
    const gradeRow = el('div', { class: 'toolbar', style: 'justify-content:center;margin-top:16px' });
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
    const deck = store.getVocabDeck(profileId);
    srs.recordAnswer(deck, pool[idx].key, correct);
    store.saveVocabDeck(profileId, deck);
    idx++;
    if (idx >= pool.length) finish();
    else renderQuestion();
  }

  function finish() {
    store.recordActivity(profileId);
    const pct = Math.round((correctCount / pool.length) * 100);
    const passed = pct >= Math.round(PASS_THRESHOLD * 100);
    const alreadyPassed = store.isVocabCheckpointPassed(profileId, tier);
    if (passed || alreadyPassed) store.setVocabCheckpointPassed(profileId, tier, true);

    stage.innerHTML = '';
    const card = el('div', { class: 'card celebrate' });
    if (passed) {
      card.appendChild(el('span', { class: 'big-emoji' }, '✨'));
      card.appendChild(el('div', { class: 'unlock-banner' }, `Vocabulary Practice unlocked - ${pct}%`));
      card.appendChild(el('p', { style: 'margin-top:14px;color:var(--ink-soft)' }, `${tier} vocabulary is now in your Vocabulary Practice deck - keep practicing to actually retain it.`));
    } else {
      card.appendChild(el('span', { class: 'big-emoji' }, '🃏'));
      card.appendChild(el('h2', {}, `${pct}% this time`));
      card.appendChild(el('p', { style: 'color:var(--ink-soft)' }, `Needed ${Math.round(PASS_THRESHOLD * 100)}% to unlock Vocabulary Practice - browse the words a bit more and retake whenever you like.`));
    }
    card.appendChild(
      el('div', { class: 'toolbar', style: 'justify-content:center;margin-top:14px' }, passed
        ? [
            (() => { const b = el('button', { class: 'btn btn-primary' }, 'Go to Vocabulary Practice →'); b.addEventListener('click', () => { store.setSetting(profileId, 'practiceDeck', 'vocab'); navigate('/practice'); }); return b; })(),
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

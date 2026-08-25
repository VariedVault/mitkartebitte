import * as store from '../store.js';
import * as srs from '../srs.js';
import { el, speakerButton, reviewList } from '../ui/components.js';
import { VERBS, PRONOUN_COLORS } from '../data/verbs-a1.js';
import { practicePoolKeys } from '../data/practicePool.js';
import { TENSE_LABELS, pronounLabel, spokenPronoun, factLabel } from '../ui/verbUtils.js';
import { navigate } from '../router.js';

const DAY_MS = 24 * 60 * 60 * 1000;

/** SRS-weighted random pick: overdue/new facts draw far more often than well-known ones,
 *  but nothing is ever fully excluded - keeps the whole unlocked pool "endless" and alive.
 *  Avoids repeating the immediately-previous card when there's any alternative. */
function weightedDraw(deck, keys, excludeKey) {
  const now = Date.now();
  const weighted = keys.map((key) => {
    const f = deck.facts[key];
    let weight;
    if (!f) weight = 8; // never-seen facts surface often
    else if (f.dueAt <= now) weight = 10 + (srs.MAX_BOX - f.box) * 2; // overdue, lower box = more urgent
    else weight = Math.max(0.5, 3 - ((f.dueAt - now) / DAY_MS) * 0.3); // small residual chance pre-due
    return { key, weight };
  });
  const pool = keys.length > 1 ? weighted.filter((w) => w.key !== excludeKey) : weighted;
  const total = pool.reduce((sum, w) => sum + w.weight, 0);
  let r = Math.random() * total;
  for (const w of pool) {
    r -= w.weight;
    if (r <= 0) return w.key;
  }
  return pool[pool.length - 1].key;
}

function factFromKey(key) {
  const { infinitive, tense, pronoun } = srs.parseFactKey(key);
  const verb = VERBS.find((v) => v.infinitive === infinitive);
  return { verb, tense, pronoun, answer: verb.tables[tense]?.[pronoun] ?? null };
}

/** Tense label first - so a Perfekt/Imperativ card is never mistaken for Präsens once
 *  you're looking at the reveal face, not just the (already-flipped-away) front. Then
 *  pronoun + form together, color-coded - never the bare, ambiguous form alone. Then the
 *  matched per-pronoun example when one exists (Präsens only, this phase). No conjugation-
 *  table fallback for tenses without one: the fixed-height card has no room for a 6-row
 *  table without forcing a scroll just to reach the grading buttons, and the pronoun+form
 *  line above is already the complete, correct answer on its own. */
function buildReveal(verb, tense, pronoun, answer) {
  const wrap = el('div');
  const color = PRONOUN_COLORS[pronoun.toLowerCase()] || 'inherit';
  wrap.appendChild(el('div', { style: 'font-size:12px;letter-spacing:.05em;text-transform:uppercase;color:var(--cream-dim)' }, TENSE_LABELS[tense]));
  wrap.appendChild(
    el('div', { style: 'font-size:26px;font-weight:800;font-family:var(--font-mono);margin-top:4px' }, [
      el('span', { style: `color:${color}` }, `${pronounLabel(tense, pronoun)} `),
      answer,
      ' ',
      speakerButton(`${spokenPronoun(tense, pronoun)} ${answer}`),
    ])
  );

  const matchedExample = tense === 'praesens' ? verb.examplesByPronoun.praesens?.[pronoun] : null;
  if (matchedExample) {
    wrap.appendChild(
      el('div', { style: 'margin-top:10px;font-size:14px;color:var(--cream-dim)' }, [matchedExample.de, ' ', speakerButton(matchedExample.de)])
    );
    wrap.appendChild(el('div', { style: 'margin-top:2px;font-size:12.5px;color:var(--ink-soft)' }, matchedExample.en));
  }
  return wrap;
}

export async function renderPractice(container, { profileId }) {
  const deck = store.getSRSDeck(profileId);
  const keys = practicePoolKeys(profileId);

  container.innerHTML = '';
  container.appendChild(el('h1', {}, 'Practice'));
  container.appendChild(el('p', { style: 'color:var(--cream-dim)' }, 'Flip each card, grade yourself honestly - that’s what makes the schedule work.'));

  const modeRow = el('div', { class: 'toolbar', style: 'margin-bottom:16px' });
  let speakingMode = false;
  const modeBtn = el('button', { class: 'btn' }, '🗣️ Switch to speaking mode');
  modeBtn.addEventListener('click', () => {
    speakingMode = !speakingMode;
    modeBtn.textContent = speakingMode ? '⌨️ Switch to quick review' : '🗣️ Switch to speaking mode';
    renderCard();
  });
  modeRow.appendChild(modeBtn);
  container.appendChild(modeRow);

  if (keys.length === 0) {
    container.appendChild(el('div', { class: 'card' }, 'Nothing to practice yet - visit a verb from Learn first.'));
    return;
  }

  const stage = el('div');
  container.appendChild(stage);
  const progressLine = el('p', { style: 'color:var(--cream-dim);text-align:center;margin-top:12px' });
  container.appendChild(progressLine);

  let cardNumber = 0;
  let currentKey = null;
  const history = [];

  const reviewBtn = el('button', { class: 'btn', style: 'font-size:11.5px;padding:6px 10px' }, '📋 Review answers');
  reviewBtn.disabled = true;
  reviewBtn.addEventListener('click', () => {
    stage.innerHTML = '';
    stage.appendChild(reviewList(history, renderCard, 'Back to deck'));
  });
  modeRow.appendChild(reviewBtn);

  const doneBtn = el('button', { class: 'btn', style: 'font-size:11.5px;padding:6px 10px' }, 'Done for now');
  doneBtn.addEventListener('click', () => navigate(''));
  modeRow.appendChild(doneBtn);

  function drawNext() {
    currentKey = weightedDraw(deck, keys, currentKey);
    cardNumber++;
  }

  function renderCard() {
    if (currentKey == null) drawNext();
    stage.innerHTML = '';
    progressLine.textContent = `Card ${cardNumber}`;
    const { verb, tense, pronoun, answer } = factFromKey(currentKey);

    // Fixed-size scene - .flip-card has a fixed CSS height (not computed per card), and
    // each face scrolls internally if its content is tall. Card-to-card navigation never
    // shifts the page, unlike the old per-card offsetHeight resize.
    const scene = el('div', { class: 'flip-scene' });
    const flipCard = el('div', { class: 'flip-card' });
    const inner = el('div', { class: 'flip-card-inner' });

    const front = el('div', { class: 'flip-card-face flip-card-front' });
    if (speakingMode) {
      const hint = tense === 'praesens' ? verb.examplesByPronoun.praesens?.[pronoun]?.en : null;
      front.appendChild(el('div', { style: 'font-size:12px;letter-spacing:.05em;text-transform:uppercase;color:var(--ink-soft)' }, 'Say it in German:'));
      front.appendChild(el('div', { style: 'font-size:19px;font-weight:700;margin-top:8px' }, `“${pronoun} ${verb.english}” - ${TENSE_LABELS[tense]}`));
      front.appendChild(el('div', { style: 'margin-top:6px;color:var(--ink-soft);font-size:13px' }, hint ? `Hint: ${hint}` : ''));
    } else {
      front.appendChild(el('div', { style: 'font-size:12px;letter-spacing:.05em;text-transform:uppercase;color:var(--ink-soft)' }, TENSE_LABELS[tense]));
      front.appendChild(el('div', { style: 'font-size:26px;font-weight:800;font-family:var(--font-mono);margin-top:8px' }, `${pronounLabel(tense, pronoun)} · ${verb.infinitive}`));
      front.appendChild(el('div', { style: 'margin-top:6px;color:var(--ink-soft)' }, verb.english));
    }
    front.appendChild(el('button', { class: 'btn btn-primary', style: 'margin-top:16px' }, 'Reveal ↻'));
    front.querySelector('button').addEventListener('click', flip);

    const back = el('div', { class: 'flip-card-face flip-card-back' });
    back.appendChild(buildReveal(verb, tense, pronoun, answer));
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

    function flip() {
      flipCard.classList.add('flipped');
    }
  }

  function grade(correct) {
    const { verb, tense, pronoun, answer } = factFromKey(currentKey);
    srs.recordAnswer(deck, currentKey, correct);
    store.saveSRSDeck(profileId, deck);
    store.recordActivity(profileId);
    history.push({ prompt: factLabel(verb, tense, pronoun), correctAnswer: answer, correct });
    reviewBtn.disabled = false;
    drawNext();
    renderCard();
  }

  renderCard();
}

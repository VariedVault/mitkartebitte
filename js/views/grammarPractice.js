import * as store from '../store.js';
import * as srs from '../srs.js';
import { el } from '../ui/components.js';
import { grammarPracticeKeys } from '../data/grammarDeck.js';
import { grammarFactByKey } from '../data/grammarPoints.js';
import { navigate } from '../router.js';

const DAY_MS = 24 * 60 * 60 * 1000;

/** The Verbs / Grammar deck toggle shown at the top of the Practice tab. Persists the
 *  choice in a per-profile setting and re-renders Practice in that mode. The verb ("Verbs")
 *  path in practice.js is completely unchanged; this only adds a second mode. */
export function deckToggle(profileId) {
  const mode = store.getSettings(profileId).practiceDeck === 'grammar' ? 'grammar' : 'verbs';
  const row = el('div', { class: 'toolbar', style: 'margin-bottom:16px' });
  const mk = (label, value) => {
    const b = el('button', { class: `btn ${mode === value ? 'btn-primary' : ''}` }, label);
    b.addEventListener('click', () => {
      if (mode === value) return;
      store.setSetting(profileId, 'practiceDeck', value);
      navigate('/practice');
    });
    return b;
  };
  row.appendChild(mk('Verbs', 'verbs'));
  row.appendChild(mk('Grammar', 'grammar'));
  return row;
}

/** SRS-weighted random pick from the grammar deck - same weighting as the verb deck's, on
 *  its own keys; avoids repeating the immediately-previous card. */
function weightedDraw(deck, keys, excludeKey) {
  const now = Date.now();
  const weighted = keys.map((key) => {
    const f = deck.facts[key];
    let weight;
    if (!f) weight = 8;
    else if (f.dueAt <= now) weight = 10 + (srs.MAX_BOX - f.box) * 2;
    else weight = Math.max(0.5, 3 - ((f.dueAt - now) / DAY_MS) * 0.3);
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

/** Grammar Practice body - appended below the shared deck toggle (which practice.js renders).
 *  Flip-card, self-graded, exactly like verb Practice but drawing from the separate grammar
 *  deck and showing the fact's prompt → answer + one-line "why". */
export function renderGrammarPractice(container, { profileId }) {
  const deck = store.getGrammarDeck(profileId);
  const keys = grammarPracticeKeys(profileId);

  container.appendChild(el('h1', {}, 'Practice · Grammar'));
  container.appendChild(el('p', { style: 'color:var(--cream-dim)' }, 'Flip each card, grade yourself honestly - the schedule does the rest.'));

  if (keys.length === 0) {
    container.appendChild(el('div', { class: 'card' }, 'Nothing to practice yet - visit A1 Cases & Grammar first.'));
    return;
  }

  const stage = el('div');
  container.appendChild(stage);
  const progressLine = el('p', { style: 'color:var(--cream-dim);text-align:center;margin-top:12px' });
  container.appendChild(progressLine);

  let cardNumber = 0;
  let currentKey = null;

  function drawNext() {
    currentKey = weightedDraw(deck, keys, currentKey);
    cardNumber++;
  }

  function renderCard() {
    if (currentKey == null) drawNext();
    stage.innerHTML = '';
    progressLine.textContent = `Card ${cardNumber}`;
    const fact = grammarFactByKey(currentKey);
    if (!fact) { drawNext(); renderCard(); return; }

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
    srs.recordAnswer(deck, currentKey, correct);
    store.saveGrammarDeck(profileId, deck);
    store.recordActivity(profileId);
    drawNext();
    renderCard();
  }

  renderCard();
}

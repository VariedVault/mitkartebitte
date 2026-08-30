import * as store from '../store.js';
import * as srs from '../srs.js';
import { el } from '../ui/components.js';
import { vocabPracticeKeys } from '../data/vocabDeck.js';
import { vocabFactByKey, wordById, displayWord } from '../data/vocabulary.js';
import { wordCardBody } from './vocabSection.js';
import { navigate } from '../router.js';

const DAY_MS = 24 * 60 * 60 * 1000;

/** The three-way Verbs / Grammar / Vocabulary deck toggle at the top of the Practice tab.
 *  Persists the choice in a per-profile setting and re-renders Practice in that mode. This
 *  REPLACES the old two-way toggle; the verb and grammar rendering paths are unchanged - it
 *  only adds a third destination. */
export function deckToggle3(profileId) {
  const mode = store.getSettings(profileId).practiceDeck;
  const active = mode === 'grammar' || mode === 'vocab' ? mode : 'verbs';
  const row = el('div', { class: 'toolbar', style: 'margin-bottom:16px' });
  const mk = (label, value) => {
    const b = el('button', { class: `btn ${active === value ? 'btn-primary' : ''}` }, label);
    b.addEventListener('click', () => { if (active === value) return; store.setSetting(profileId, 'practiceDeck', value); navigate('/practice'); });
    return b;
  };
  row.appendChild(mk('Verbs', 'verbs'));
  row.appendChild(mk('Grammar', 'grammar'));
  row.appendChild(mk('Vocabulary', 'vocab'));
  return row;
}

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
  for (const w of pool) { r -= w.weight; if (r <= 0) return w.key; }
  return pool[pool.length - 1].key;
}

/** Front-of-card prompt for a given drill type; the reveal is always the full word card. */
export function promptFor(type, v) {
  switch (type) {
    case 'production': return { label: 'Say it in German', big: v.english };
    case 'gender': return { label: 'der, die or das?', big: v.word };
    case 'plural': return { label: 'What is the plural?', big: displayWord(v) };
    default: return { label: 'What does this mean?', big: displayWord(v) }; // recognition
  }
}

export function renderVocabPractice(container, { profileId }) {
  const deck = store.getVocabDeck(profileId);
  const keys = vocabPracticeKeys(profileId);

  container.appendChild(el('h1', {}, 'Practice · Vocabulary'));
  container.appendChild(el('p', { style: 'color:var(--cream-dim)' }, 'Flip each card, grade yourself honestly - recognition, production, gender and plural, mixed.'));

  if (keys.length === 0) {
    container.appendChild(el('div', { class: 'card' }, 'Nothing to practice yet - browse a Vocabulary tier and add some words first.'));
    return;
  }

  const stage = el('div');
  container.appendChild(stage);
  const progressLine = el('p', { style: 'color:var(--cream-dim);text-align:center;margin-top:12px' });
  container.appendChild(progressLine);

  let cardNumber = 0;
  let currentKey = null;
  const drawNext = () => { currentKey = weightedDraw(deck, keys, currentKey); cardNumber++; };

  function renderCard() {
    if (currentKey == null) drawNext();
    stage.innerHTML = '';
    progressLine.textContent = `Card ${cardNumber}`;
    const fact = vocabFactByKey(currentKey);
    const v = fact && wordById(fact.wordId);
    if (!v) { drawNext(); renderCard(); return; }
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
    srs.recordAnswer(deck, currentKey, correct);
    store.saveVocabDeck(profileId, deck);
    store.recordActivity(profileId);
    drawNext();
    renderCard();
  }

  renderCard();
}

import * as store from '../store.js';
import * as srs from '../srs.js';
import { el, speakerButton } from '../ui/components.js';
import { allModules } from '../data/modules/index.js';
import { VERBS } from '../data/verbs.js';
import { factKeysForModule, getForm, TENSE_LABELS, pronounLabel } from '../ui/drills.js';
import { navigate } from '../router.js';

function startedModulePools(profileId, deck) {
  const progress = store.getProgress(profileId);
  const modules = allModules();
  const started = modules.filter((m) => progress[m.id] || moduleHasDeckHits(m, deck));
  return started.length ? started : modules.slice(0, 1);
}

function moduleHasDeckHits(mod, deck) {
  return factKeysForModule(mod.verbPool(VERBS), mod.tenses).some((k) => deck.facts[k]);
}

export async function renderPractice(container, { profileId }) {
  const deck = store.getSRSDeck(profileId);
  const modules = startedModulePools(profileId, deck);
  const candidateKeys = [...new Set(modules.flatMap((m) => factKeysForModule(m.verbPool(VERBS), m.tenses)))];
  const queue = srs.buildSessionQueue(deck, candidateKeys, 15);

  container.innerHTML = '';
  container.appendChild(el('h1', {}, 'Ride the deck'));
  const sub = el('p', { style: 'color:var(--cream-dim)' }, 'Flip each card, grade yourself honestly — that’s what makes the schedule work.');
  container.appendChild(sub);

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

  if (queue.length === 0) {
    container.appendChild(el('div', { class: 'card' }, 'Nothing due yet — play a module from the course map first.'));
    return;
  }

  const stage = el('div');
  container.appendChild(stage);
  const progressLine = el('p', { style: 'color:var(--cream-dim);text-align:center;margin-top:12px' });
  container.appendChild(progressLine);

  let idx = 0;
  let flipped = false;

  function currentFact() {
    const [infinitive, tense, pronoun] = queue[idx].split('|');
    const verb = VERBS.find((v) => v.infinitive === infinitive);
    return { verb, tense, pronoun, answer: getForm(verb, tense, pronoun) };
  }

  function renderCard() {
    flipped = false;
    stage.innerHTML = '';
    progressLine.textContent = `Card ${idx + 1} / ${queue.length}`;
    const { verb, tense, pronoun, answer } = currentFact();

    const scene = el('div', { class: 'flip-scene' });
    const flipCard = el('div', { class: 'flip-card' });
    const inner = el('div', { class: 'flip-card-inner' });

    const front = el('div', { class: 'flip-card-face flip-card-front' });
    if (speakingMode) {
      front.appendChild(el('div', { style: 'font-size:12px;letter-spacing:.05em;text-transform:uppercase;color:var(--ink-soft)' }, 'Say it in German:'));
      front.appendChild(el('div', { style: 'font-size:19px;font-weight:700;margin-top:8px' }, `“${pronounHint(pronoun, tense)} ${verb.english}” — ${TENSE_LABELS[tense]}`));
      front.appendChild(el('div', { style: 'margin-top:6px;color:var(--ink-soft);font-size:13px' }, verb.example ? `Hint: ${verb.example.en}` : ''));
    } else {
      front.appendChild(el('div', { style: 'font-size:12px;letter-spacing:.05em;text-transform:uppercase;color:var(--ink-soft)' }, TENSE_LABELS[tense]));
      front.appendChild(el('div', { style: 'font-size:26px;font-weight:800;font-family:var(--font-mono);margin-top:8px' }, `${pronounLabel(tense, pronoun)} · ${verb.infinitive}`));
      front.appendChild(el('div', { style: 'margin-top:6px;color:var(--ink-soft)' }, verb.english));
    }
    front.appendChild(el('button', { class: 'btn btn-primary', style: 'margin-top:16px' }, 'Reveal ↻'));
    front.querySelector('button').addEventListener('click', flip);

    const back = el('div', { class: 'flip-card-face flip-card-back' });
    back.appendChild(el('div', { style: 'font-size:26px;font-weight:800;font-family:var(--font-mono)' }, [answer, ' ', speakerButton(answer)]));
    if (verb.example) back.appendChild(el('div', { style: 'margin-top:10px;font-size:14px;color:var(--cream-dim)' }, [verb.example.de, ' ', speakerButton(verb.example.de)]));
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
      flipped = true;
      flipCard.classList.add('flipped');
    }
  }

  function grade(correct) {
    const key = queue[idx];
    srs.recordAnswer(deck, key, correct);
    store.saveSRSDeck(profileId, deck);
    store.recordActivity(profileId);
    idx++;
    if (idx >= queue.length) {
      stage.innerHTML = '';
      stage.appendChild(
        el('div', { class: 'card celebrate' }, [
          el('span', { class: 'big-emoji' }, '🎉'),
          el('h2', {}, 'Deck cleared for now.'),
          el('div', { class: 'toolbar', style: 'justify-content:center;margin-top:14px' }, [
            (() => { const b = el('button', { class: 'btn btn-primary' }, 'Back to map'); b.addEventListener('click', () => navigate('/course-map')); return b; })(),
          ]),
        ])
      );
      progressLine.textContent = '';
      return;
    }
    renderCard();
  }

  function pronounHint(pronoun, tense) {
    return tense === 'imperativ' ? pronoun : pronoun;
  }

  renderCard();
}

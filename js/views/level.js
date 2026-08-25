import * as store from '../store.js';
import * as srs from '../srs.js';
import { el, progressRing, backLink } from '../ui/components.js';
import { VERBS } from '../data/verbs-a1.js';
import { factKeysFor, TENSE_LABELS, TENSE_ORDER, availableTenses, displayInfinitive } from '../ui/verbUtils.js';
import { navigate } from '../router.js';

const GRAMMAR_BLURBS = {
  praesens: 'The present tense - talking about now, habits, and near-future plans.',
  imperativ: 'Commands and requests - "Come here!", "Please wait!".',
  perfekt: 'The everyday past tense used in speech - "I have done...".',
  praeteritum: 'The written/narrative past tense - and how sein/haben/werden and modals actually prefer it even in speech.',
};

const LEVELS = ['A1', 'A2', 'B1'];

/** Union of every tense any verb in this level actually has data for, in canonical
 *  order - drives the summary caption and (in checkpoint.js) which tenses get quizzed,
 *  so a level's UI never hardcodes which tenses it covers. */
function levelTenses(levelVerbs) {
  const set = new Set();
  for (const verb of levelVerbs) for (const t of availableTenses(verb)) set.add(t);
  return TENSE_ORDER.filter((t) => set.has(t));
}

/** Which level's grammar page a tense's reference lesson belongs on - a curriculum
 *  decision, not something derivable from which verbs happen to carry data for a tense.
 *  Präteritum is a deliberate exception: the spiral revisit backfills it onto the A1
 *  verbs too (so A1 vocabulary can drill A2 grammar), which would make a purely
 *  data-driven "first level with this tense" check wrongly attribute the lesson to A1. */
const TENSE_INTRODUCED_AT = { praesens: 'A1', imperativ: 'A1', perfekt: 'A1', praeteritum: 'A2' };

/** Tenses genuinely NEW at this level - A2's page only needs a Präteritum grammar-rule
 *  link, not Präsens/Imperativ/Perfekt again, since A1's page already covers those. */
function newTensesForLevel(level) {
  return levelTenses(VERBS.filter((v) => v.level === level)).filter((t) => TENSE_INTRODUCED_AT[t] === level);
}

export async function renderLevel(container, { profileId, level, setBreadcrumb }) {
  setBreadcrumb(`Learn · ${level} Conjugation`);
  container.innerHTML = '';
  container.appendChild(backLink('Learn', () => navigate('')));

  const levelVerbs = VERBS.filter((v) => v.level === level);
  if (levelVerbs.length === 0) {
    container.appendChild(el('h1', {}, `${level} Conjugation`));
    container.appendChild(el('div', { class: 'card' }, 'This level arrives in a later phase.'));
    return;
  }

  container.appendChild(el('h1', {}, `${level} Conjugation`));
  const deck = store.getSRSDeck(profileId);
  const tenses = levelTenses(levelVerbs);
  const keys = factKeysFor(levelVerbs, tenses);
  const mastery = srs.masteryForKeys(deck, keys);
  const passed = store.isCheckpointPassed(profileId, level);

  // "Practice unlocked" and the mastery ring are two different axes (did you pass an
  // 8-question checkpoint, vs. how much long-term SRS retention you've built through
  // Practice) - avoid a word like "Certified" that reads as "you've mastered this, move
  // on to A2" when it only means the checkpoint is passed. A low ring % right next to it
  // would also contradict it, so the ring only shows pre-unlock, as a "you've started" cue.
  const summary = el('div', { class: 'card', style: 'display:flex;align-items:center;gap:16px' });
  if (!passed) summary.appendChild(progressRing(mastery, { size: 52, stroke: 5 }));
  const summaryText = el('div', { style: 'flex:1' });
  summaryText.appendChild(el('p', { style: 'margin:0;font-weight:700;color:var(--ink)' }, `${levelVerbs.length} verbs · ${tenses.map((t) => TENSE_LABELS[t]).join(', ')}`));
  summaryText.appendChild(
    el(
      'p',
      { style: 'margin:4px 0 0;color:var(--ink-soft);font-size:13px' },
      passed ? '✓ Practice unlocked - mastery only grows by practicing, not by retaking this checkpoint.' : 'Pass the checkpoint to unlock this level for Practice.'
    )
  );
  summary.appendChild(summaryText);
  if (passed) summary.appendChild(el('span', { style: 'font-size:28px' }, '✓'));
  container.appendChild(summary);

  if (passed) {
    // Once unlocked, Practice - not the checkpoint - is the actual next step for
    // building mastery. Make it the obvious primary action here instead of leaving
    // "Retake the checkpoint" as the only button on the page (which is what made
    // retaking it look like the intended way to make progress).
    const practiceBtn = el('button', { class: 'btn btn-primary btn-block', style: 'margin-top:12px' }, 'Go practice these verbs →');
    practiceBtn.addEventListener('click', () => navigate('/practice'));
    container.appendChild(practiceBtn);
  }
  const checkpointBtn = el('button', { class: 'btn btn-block', style: 'margin-top:10px' }, passed ? 'Retake the checkpoint' : 'Take the checkpoint');
  checkpointBtn.classList.toggle('btn-primary', !passed);
  checkpointBtn.addEventListener('click', () => navigate(`/checkpoint/${level}`));
  container.appendChild(checkpointBtn);

  const newTenses = newTensesForLevel(level);
  if (newTenses.length > 0) {
    container.appendChild(el('h2', { style: 'margin:24px 0 10px;font-size:15px;letter-spacing:0.04em;text-transform:uppercase;color:var(--cream-dim)' }, 'Grammar rules'));
    container.appendChild(el('p', { style: 'color:var(--cream-dim);font-size:13px;margin:0 0 12px' }, 'Short reference lessons - read anytime, nothing to complete.'));
    const grammarGrid = el('div', { style: 'display:flex;flex-direction:column;gap:10px' });
    for (const t of newTenses) {
      const gcard = el('button', { class: 'card', style: 'text-align:left' }, [
        el('div', { style: 'font-weight:700;color:var(--ink)' }, TENSE_LABELS[t]),
        el('div', { style: 'color:var(--ink-soft);font-size:13px;margin-top:2px' }, GRAMMAR_BLURBS[t]),
      ]);
      gcard.addEventListener('click', () => navigate(`/grammar/${t}`));
      grammarGrid.appendChild(gcard);
    }
    container.appendChild(grammarGrid);
  }

  container.appendChild(el('h2', { style: 'margin:24px 0 10px;font-size:15px;letter-spacing:0.04em;text-transform:uppercase;color:var(--cream-dim)' }, `Verbs (${levelVerbs.length})`));
  const verbGrid = el('div', { style: 'display:grid;grid-template-columns:repeat(auto-fill, minmax(150px, 1fr));gap:10px' });
  for (const verb of levelVerbs) {
    const verbKeys = factKeysFor([verb], availableTenses(verb));
    const verbMastery = srs.masteryForKeys(deck, verbKeys);
    const vcard = el('button', { class: 'card', style: 'text-align:left;position:relative;padding:12px 14px' }, [
      el('div', { style: 'font-family:var(--font-mono);font-weight:700;color:var(--ink)' }, displayInfinitive(verb)),
      el('div', { style: 'color:var(--ink-soft);font-size:12.5px;margin-top:2px' }, verb.english),
      verbMastery > 0 ? el('div', { style: 'margin-top:6px;font-size:11px;font-weight:700;color:var(--gold)' }, `${verbMastery}%`) : null,
    ]);
    vcard.addEventListener('click', () => navigate(`/verb/${verb.infinitive}`));
    verbGrid.appendChild(vcard);
  }
  container.appendChild(verbGrid);
}

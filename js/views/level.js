import * as store from '../store.js';
import * as srs from '../srs.js';
import { el, progressRing, backLink } from '../ui/components.js';
import { VERBS } from '../data/verbs-a1.js';
import { factKeysFor, TENSE_ORDER, availableTenses, displayInfinitive, tenseColorFor, TENSE_LEVEL, levelAtLeast } from '../ui/verbUtils.js';
import { navigate } from '../router.js';

// Passiv is 4 separate tense-table slots (passivPraesens/passivPraeteritum/passivPerfekt/
// passivZustand - see verbUtils.js's TENSE_ORDER comment) but ONE grammar lesson/summary
// entry - a learner doesn't need 4 nearly-identical "Passiv" cards. LESSON_ID_FOR_TENSE
// collapses them; every other tense maps 1:1 to its own lesson id.
const LESSON_ID_FOR_TENSE = {
  praesens: 'praesens', imperativ: 'imperativ', perfekt: 'perfekt', praeteritum: 'praeteritum',
  konjunktiv2: 'konjunktiv2', futur1: 'futur1', plusquamperfekt: 'plusquamperfekt',
  passivPraesens: 'passiv', passivPraeteritum: 'passiv', passivPerfekt: 'passiv', passivZustand: 'passiv',
};
const LESSON_LABELS = {
  praesens: 'Präsens', imperativ: 'Imperativ', perfekt: 'Perfekt', praeteritum: 'Präteritum',
  konjunktiv2: 'Konjunktiv II', futur1: 'Futur I', plusquamperfekt: 'Plusquamperfekt', passiv: 'Passiv',
};
const GRAMMAR_BLURBS = {
  praesens: 'The present tense - talking about now, habits, and near-future plans.',
  imperativ: 'Commands and requests - "Come here!", "Please wait!".',
  perfekt: 'The everyday past tense used in speech - "I have done...".',
  praeteritum: 'The written/narrative past tense - and how sein/haben/werden and modals actually prefer it even in speech.',
  konjunktiv2: 'The "would" mood - würde + infinitive for most verbs, but a handful of high-frequency verbs (wäre, hätte, könnte, ginge...) keep their own short form instead.',
  futur1: 'The future tense - werden + infinitive. Mostly for predictions/promises; everyday German often just uses Präsens for the future instead.',
  plusquamperfekt: 'The "past before the past" - what had already happened before another past event.',
  passiv: 'The passive voice - when the action matters more than who does it, plus the "is/was done" state vs. "is being done" action distinction.',
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

/** Collapses a tense list down to its distinct lesson ids, in first-seen (canonical) order -
 *  used for both the summary caption and the grammar-links section, so Passiv's 4 slots
 *  never render as 4 separate entries anywhere. */
function lessonIdsFor(tenses) {
  const seen = new Set();
  const ids = [];
  for (const t of tenses) {
    const id = LESSON_ID_FOR_TENSE[t];
    if (!seen.has(id)) {
      seen.add(id);
      ids.push(id);
    }
  }
  return ids;
}

/** Tenses genuinely NEW at this level (TENSE_LEVEL matches exactly, not cumulative) - what
 *  the Grammar Rules section links to. levelTenses() returns everything any verb here has
 *  DATA for, which by this phase is every tense on every verb (the spiral revisit backfills
 *  Präteritum onto A1 verbs and Konjunktiv II/Futur I/Plusquamperfekt/Passiv onto A1+A2
 *  verbs, purely so those verbs can resurface with new tenses in the cumulative Practice
 *  pool once a later checkpoint is passed) - showing all of that on A1's page would dump
 *  Konjunktiv II and Passiv on a first-time learner, and repeating Präsens/Imperativ/Perfekt
 *  on A2's and B1's pages too would be redundant with A1's own page. Each lesson lives on
 *  exactly one level's page: A2 shows only the Präteritum tile, not Präsens/Imperativ/
 *  Perfekt again. (Individual VERB CARDS are a different, cumulative case - see
 *  verbUtils.js's studyTenses(), used in verbCard.js - a "tragen" (A2) page should still
 *  show its own Präsens/Imperativ/Perfekt, not just Präteritum.) */
function newTensesForLevel(level, tenses) {
  return tenses.filter((t) => TENSE_LEVEL[t] === level);
}

/** Tenses this level's own verbs cover cumulatively (their own level's tenses plus every
 *  earlier level's) - used only for the summary caption's prose, which should read as an
 *  honest "here's everything these verbs cover" rather than the Grammar Rules section's
 *  "here's what's new" framing. A2's caption says "Präsens, Imperativ, Perfekt,
 *  Präteritum", not just "Präteritum" - the verbs really do have all four. */
function coreTensesForLevel(level, tenses) {
  return tenses.filter((t) => levelAtLeast(level, TENSE_LEVEL[t]));
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

  // Grammar Rules first: only the lessons genuinely NEW at THIS level, not every tense the
  // data technically carries and not repeats of lessons already covered on an earlier
  // level's page - color-coded per tense so the same color always means the same tense
  // everywhere in the app (verb-card columns included). Reading the rules comes before the
  // verb list/practice status, not after - you want the reference material before you start
  // drilling, not below it.
  const lessons = lessonIdsFor(newTensesForLevel(level, tenses));
  if (lessons.length > 0) {
    container.appendChild(el('h2', { style: 'margin:8px 0 10px;font-size:15px;letter-spacing:0.04em;text-transform:uppercase;color:var(--cream-dim)' }, 'Grammar rules'));
    container.appendChild(el('p', { style: 'color:var(--cream-dim);font-size:13px;margin:0 0 12px' }, 'Short reference lessons - read anytime, nothing to complete.'));
    const grammarGrid = el('div', { style: 'display:flex;flex-direction:column;gap:10px' });
    for (const id of lessons) {
      const gcard = el('button', { class: 'card', style: `text-align:left;border-left:5px solid ${tenseColorFor(id)}` }, [
        el('div', { style: 'font-weight:700;color:var(--ink)' }, LESSON_LABELS[id]),
        el('div', { style: 'color:var(--ink-soft);font-size:13px;margin-top:2px' }, GRAMMAR_BLURBS[id]),
      ]);
      gcard.addEventListener('click', () => navigate(`/grammar/${id}`));
      grammarGrid.appendChild(gcard);
    }
    container.appendChild(grammarGrid);
  }

  // "Practice unlocked" and the mastery ring are two different axes (did you pass an
  // 8-question checkpoint, vs. how much long-term SRS retention you've built through
  // Practice) - avoid a word like "Certified" that reads as "you've mastered this, move
  // on to A2" when it only means the checkpoint is passed. A low ring % right next to it
  // would also contradict it, so the ring only shows pre-unlock, as a "you've started" cue.
  const summary = el('div', { class: 'card', style: 'display:flex;align-items:center;gap:16px;margin-top:24px' });
  if (!passed) summary.appendChild(progressRing(mastery, { size: 52, stroke: 5 }));
  const summaryText = el('div', { style: 'flex:1' });
  const coreLessons = lessonIdsFor(coreTensesForLevel(level, tenses));
  summaryText.appendChild(el('p', { style: 'margin:0;font-weight:700;color:var(--ink)' }, `${levelVerbs.length} verbs · ${coreLessons.map((id) => LESSON_LABELS[id]).join(', ')}`));
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

  container.appendChild(el('h2', { style: 'margin:24px 0 10px;font-size:15px;letter-spacing:0.04em;text-transform:uppercase;color:var(--cream-dim)' }, `Verbs (${levelVerbs.length})`));
  const verbGrid = el('div', { style: 'display:grid;grid-template-columns:repeat(auto-fill, minmax(150px, 1fr));gap:10px' });
  for (const verb of levelVerbs) {
    const verbKeys = factKeysFor([verb], availableTenses(verb));
    const verbMastery = srs.masteryForKeys(deck, verbKeys);
    const vcard = el('button', { class: 'card verb-tile', style: 'text-align:left;position:relative;padding:12px 14px' }, [
      el('div', { style: 'font-family:var(--font-mono);font-weight:700;color:var(--ink)' }, displayInfinitive(verb)),
      el('div', { class: 'verb-tile-gloss', style: 'color:var(--ink-soft);font-size:12.5px;margin-top:2px' }, verb.english),
      verbMastery > 0 ? el('div', { style: 'margin-top:6px;font-size:11px;font-weight:700;color:var(--gold)' }, `${verbMastery}%`) : null,
    ]);
    vcard.addEventListener('click', () => navigate(`/verb/${verb.infinitive}`));
    verbGrid.appendChild(vcard);
  }
  container.appendChild(verbGrid);
}

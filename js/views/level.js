import * as store from '../store.js';
import * as srs from '../srs.js';
import { el, progressRing, backLink } from '../ui/components.js';
import { VERBS } from '../data/verbs-a1.js';
import { factKeysFor } from '../ui/verbUtils.js';
import { navigate } from '../router.js';

const GRAMMAR_TENSES = [
  { tense: 'praesens', label: 'Präsens', blurb: 'The present tense - talking about now, habits, and near-future plans.' },
  { tense: 'imperativ', label: 'Imperativ', blurb: 'Commands and requests - "Come here!", "Please wait!".' },
  { tense: 'perfekt', label: 'Perfekt', blurb: 'The everyday past tense used in speech - "I have done...".' },
];

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
  const keys = factKeysFor(levelVerbs, ['praesens', 'imperativ', 'perfekt']);
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
  summaryText.appendChild(el('p', { style: 'margin:0;font-weight:700;color:var(--ink)' }, `${levelVerbs.length} verbs · Präsens, Imperativ, Perfekt`));
  summaryText.appendChild(
    el('p', { style: 'margin:4px 0 0;color:var(--ink-soft);font-size:13px' }, passed ? '✓ Practice unlocked - keep practicing to actually retain it.' : 'Pass the checkpoint to unlock this level for Practice.')
  );
  summary.appendChild(summaryText);
  if (passed) summary.appendChild(el('span', { style: 'font-size:28px' }, '✓'));
  container.appendChild(summary);

  const checkpointBtn = el('button', { class: `btn ${passed ? '' : 'btn-primary'} btn-block`, style: 'margin-top:12px' }, passed ? 'Retake the checkpoint' : 'Take the checkpoint');
  checkpointBtn.addEventListener('click', () => navigate(`/checkpoint/${level}`));
  container.appendChild(checkpointBtn);

  container.appendChild(el('h2', { style: 'margin:24px 0 10px;font-size:15px;letter-spacing:0.04em;text-transform:uppercase;color:var(--cream-dim)' }, 'Grammar rules'));
  container.appendChild(el('p', { style: 'color:var(--cream-dim);font-size:13px;margin:0 0 12px' }, 'Short reference lessons - read anytime, nothing to complete.'));
  const grammarGrid = el('div', { style: 'display:flex;flex-direction:column;gap:10px' });
  for (const g of GRAMMAR_TENSES) {
    const gcard = el('button', { class: 'card', style: 'text-align:left' }, [
      el('div', { style: 'font-weight:700;color:var(--ink)' }, g.label),
      el('div', { style: 'color:var(--ink-soft);font-size:13px;margin-top:2px' }, g.blurb),
    ]);
    gcard.addEventListener('click', () => navigate(`/grammar/${g.tense}`));
    grammarGrid.appendChild(gcard);
  }
  container.appendChild(grammarGrid);

  container.appendChild(el('h2', { style: 'margin:24px 0 10px;font-size:15px;letter-spacing:0.04em;text-transform:uppercase;color:var(--cream-dim)' }, `Verbs (${levelVerbs.length})`));
  const verbGrid = el('div', { style: 'display:grid;grid-template-columns:repeat(auto-fill, minmax(150px, 1fr));gap:10px' });
  for (const verb of levelVerbs) {
    const verbKeys = factKeysFor([verb], ['praesens', 'imperativ', 'perfekt']);
    const verbMastery = srs.masteryForKeys(deck, verbKeys);
    const vcard = el('button', { class: 'card', style: 'text-align:left;position:relative;padding:12px 14px' }, [
      el('div', { style: 'font-family:var(--font-mono);font-weight:700;color:var(--ink)' }, verb.infinitive),
      el('div', { style: 'color:var(--ink-soft);font-size:12.5px;margin-top:2px' }, verb.english),
      verbMastery > 0 ? el('div', { style: 'margin-top:6px;font-size:11px;font-weight:700;color:var(--gold)' }, `${verbMastery}%`) : null,
    ]);
    vcard.addEventListener('click', () => navigate(`/verb/${verb.infinitive}`));
    verbGrid.appendChild(vcard);
  }
  container.appendChild(verbGrid);
}

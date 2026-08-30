import * as store from '../store.js';
import * as srs from '../srs.js';
import { el, progressRing, backLink } from '../ui/components.js';
import { pointsForTier, lessonsForTier, drillFactsForTier } from '../data/grammarPoints.js';
import { navigate } from '../router.js';

const TIER = 'A1';

/** A1 Cases & Grammar home - the grammar analogue of the verb level page. Separate deck,
 *  separate checkpoint; reads only grammar state. */
export function renderGrammarA1Home(container, { profileId, setBreadcrumb }) {
  setBreadcrumb('Learn · A1 Cases & Grammar');
  container.innerHTML = '';
  container.appendChild(backLink('Learn', () => navigate('')));

  container.appendChild(el('h1', {}, 'A1 · Cases & Grammar'));

  const points = pointsForTier(TIER);
  const lessons = lessonsForTier(TIER);
  const facts = drillFactsForTier(TIER);
  const keys = facts.map((f) => f.key);

  const deck = store.getGrammarDeck(profileId);
  const mastery = srs.masteryForKeys(deck, keys);
  const due = srs.dueCount(deck, keys);
  const passed = store.isGrammarCheckpointPassed(profileId, TIER);

  // Summary card - mirrors the verb level page: ring pre-unlock, checkmark post.
  const summary = el('div', { class: 'card', style: 'display:flex;align-items:center;gap:16px' });
  if (!passed) summary.appendChild(progressRing(mastery, { size: 52, stroke: 5 }));
  const summaryText = el('div', { style: 'flex:1' });
  summaryText.appendChild(el('p', { style: 'margin:0;font-weight:700;color:var(--ink)' }, `${points.length} grammar points · ${facts.length} drill cards`));
  summaryText.appendChild(
    el('p', { style: 'margin:4px 0 0;color:var(--ink-soft);font-size:13px' },
      passed
        ? (due > 0 ? `✓ Grammar Practice unlocked · ${due} card${due === 1 ? '' : 's'} due` : '✓ Grammar Practice unlocked - keep practicing to retain it.')
        : 'Pass the checkpoint to unlock these in Grammar Practice.')
  );
  summary.appendChild(summaryText);
  if (passed) summary.appendChild(el('span', { style: 'font-size:28px' }, '✓'));
  container.appendChild(summary);

  if (passed) {
    const practiceBtn = el('button', { class: 'btn btn-primary btn-block', style: 'margin-top:12px' }, 'Go to Grammar Practice →');
    practiceBtn.addEventListener('click', () => {
      store.setSetting(profileId, 'practiceDeck', 'grammar');
      navigate('/practice');
    });
    container.appendChild(practiceBtn);
  }
  const checkpointBtn = el('button', { class: 'btn btn-block', style: 'margin-top:10px' }, passed ? 'Retake the checkpoint' : 'Take the checkpoint');
  checkpointBtn.classList.toggle('btn-primary', !passed);
  checkpointBtn.addEventListener('click', () => navigate('/cases/a1/checkpoint'));
  container.appendChild(checkpointBtn);

  // Reference lessons (read-only, taught once)
  container.appendChild(el('h2', { style: 'margin:24px 0 10px;font-size:15px;letter-spacing:0.04em;text-transform:uppercase;color:var(--cream-dim)' }, 'Reference lessons'));
  container.appendChild(el('p', { style: 'color:var(--cream-dim);font-size:13px;margin:0 0 12px' }, 'Short reference pages - read anytime, nothing to complete.'));
  const lessonGrid = el('div', { style: 'display:flex;flex-direction:column;gap:10px' });
  for (const lesson of lessons) {
    const lc = el('button', { class: 'card', style: 'text-align:left' }, [
      el('div', { style: 'font-weight:700;color:var(--ink)' }, lesson.title),
      el('div', { style: 'color:var(--ink-soft);font-size:13px;margin-top:2px' }, lesson.intro.length > 110 ? lesson.intro.slice(0, 108) + '…' : lesson.intro),
    ]);
    lc.addEventListener('click', () => navigate(`/cases/a1/lesson/${lesson.id}`));
    lessonGrid.appendChild(lc);
  }
  container.appendChild(lessonGrid);

  // Grammar points
  container.appendChild(el('h2', { style: 'margin:24px 0 10px;font-size:15px;letter-spacing:0.04em;text-transform:uppercase;color:var(--cream-dim)' }, `Grammar points (${points.length})`));
  const grid = el('div', { style: 'display:grid;grid-template-columns:repeat(auto-fill, minmax(150px, 1fr));gap:10px' });
  for (const point of points) {
    // margin-top:0 cancels the global `.card + .card` stacked-list spacing, which in a grid
    // row otherwise pushes every card except the first 14px lower than its row-mates (the
    // same fix as the verb grid / Foundations tiles). Inline so it beats the stylesheet.
    const card = el('button', { class: 'card', style: 'text-align:left;padding:14px;margin-top:0' }, [
      el('div', { style: 'font-weight:700;color:var(--ink);overflow-wrap:anywhere' }, point.title),
      el('div', { style: 'color:var(--ink-soft);font-size:12px;margin-top:3px;text-transform:capitalize' }, point.topic),
    ]);
    card.addEventListener('click', () => navigate(`/cases/a1/point/${point.id}`));
    grid.appendChild(card);
  }
  container.appendChild(grid);
}

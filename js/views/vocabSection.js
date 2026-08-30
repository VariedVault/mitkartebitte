import * as store from '../store.js';
import * as srs from '../srs.js';
import { el, speakerButton, progressRing, backLink } from '../ui/components.js';
import { VOCAB_TIERS, wordsForTier, themesForTier, wordsForTheme, drillFactsForTier, drillFactsForWord, displayWord, ARTICLE_COLORS } from '../data/vocabulary.js';
import { navigate } from '../router.js';

const TIER_SUBTITLE = { A1: 'Everyday words', A2: 'Wider everyday vocabulary', B1: 'Abstract & advanced words' };
const TIER_INTRO = {
  A1: 'The most common everyday words - people, food, home, time and more. Browse by theme, listen, and add words to your Vocabulary Practice.',
  A2: 'A wider set of everyday vocabulary for describing situations, work, health and travel.',
  B1: 'More abstract and advanced words - society, ideas, feelings and connectors for expressing opinions.',
};

export function themeSlug(theme) {
  return theme.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

/** Shared word-card body (headline with gender-coloured article + TTS, meaning, plural,
 *  example with TTS, note) - reused by the theme browser and the Practice/checkpoint reveal
 *  so a word always looks the same everywhere. */
export function wordCardBody(v) {
  const wrap = el('div');
  const head = el('div', { style: 'display:flex;align-items:center;gap:8px;flex-wrap:wrap' });
  if (v.article) head.appendChild(el('span', { style: `font-family:var(--font-mono);font-weight:800;font-size:22px;color:${ARTICLE_COLORS[v.article]}` }, v.article));
  head.appendChild(el('span', { style: 'font-family:var(--font-mono);font-weight:800;font-size:22px;color:var(--ink)' }, v.word));
  head.appendChild(speakerButton(displayWord(v)));
  wrap.appendChild(head);
  wrap.appendChild(el('div', { style: 'color:var(--ink-soft);margin-top:2px' }, v.partOfSpeech === 'noun' ? v.english : `${v.english} · ${v.partOfSpeech}`));
  if (v.article && v.plural) wrap.appendChild(el('div', { style: 'color:var(--ink-soft);font-size:12.5px;margin-top:2px' }, `Plural: ${v.plural}`));
  const ex = el('div', { class: 'example-line', style: 'margin-top:12px;flex-direction:column;align-items:flex-start;gap:4px' });
  ex.appendChild(el('div', { style: 'display:flex;align-items:center;gap:8px;width:100%;justify-content:space-between' }, [el('span', { style: 'font-weight:600' }, v.example.de), speakerButton(v.example.de)]));
  ex.appendChild(el('div', { style: 'color:var(--ink-soft);font-size:13px;font-family:var(--font-body)' }, v.example.en));
  wrap.appendChild(ex);
  if (v.note) wrap.appendChild(el('div', { style: 'margin-top:8px;color:var(--ink-soft);font-size:12.5px;font-style:italic' }, v.note));
  return wrap;
}

// ---------------------------------------------------------------- Learn-screen "Vocabulary" section
const BUILT = new Set(['A1', 'A2', 'B1']);

function vocabDueTag(profileId, tier) {
  if (!store.isVocabCheckpointPassed(profileId, tier)) return null;
  const keys = drillFactsForTier(tier).map((f) => f.key);
  const due = srs.dueCount(store.getVocabDeck(profileId), keys);
  return due > 0 ? el('span', { class: 'track-card-tag track-card-tag--done' }, `${due} due`) : null;
}

/** The Learn-screen "Vocabulary" section - three tier tiles, native .card/.track-card style. */
export function vocabSection(profileId) {
  const wrap = el('div');
  wrap.appendChild(el('h2', { style: 'margin:16px 0 10px;font-size:15px;letter-spacing:0.04em;text-transform:uppercase;color:var(--cream-dim)' }, 'Vocabulary'));
  const grid = el('div', { style: 'display:flex;flex-direction:column;gap:12px' });
  for (const tier of VOCAB_TIERS) {
    const count = wordsForTier(tier).length;
    const card = el('button', { class: 'card track-card', style: 'text-align:left' });
    card.appendChild(el('div', { class: 'track-card-title' }, [`${tier} · ${TIER_SUBTITLE[tier]}`, BUILT.has(tier) ? vocabDueTag(profileId, tier) : el('span', { class: 'track-card-tag' }, 'Coming soon')]));
    card.appendChild(el('p', { style: 'color:var(--ink-soft);margin:0' }, `${count} words across ${themesForTier(tier).length} themes`));
    card.addEventListener('click', () => navigate(`/vocab/${tier.toLowerCase()}`));
    grid.appendChild(card);
  }
  wrap.appendChild(grid);
  return wrap;
}

// ---------------------------------------------------------------- tier home (themes)
export function renderVocabTierHome(container, { profileId, tier, setBreadcrumb }) {
  const tierPath = `/vocab/${tier.toLowerCase()}`;
  setBreadcrumb(`Learn · ${tier} Vocabulary`);
  container.innerHTML = '';
  container.appendChild(backLink('Learn', () => navigate('')));
  container.appendChild(el('h1', {}, `${tier} · Vocabulary`));
  container.appendChild(el('p', { style: 'color:var(--cream-dim)' }, TIER_INTRO[tier]));

  const words = wordsForTier(tier);
  const keys = drillFactsForTier(tier).map((f) => f.key);
  const deck = store.getVocabDeck(profileId);
  const mastery = srs.masteryForKeys(deck, keys);
  const due = srs.dueCount(deck, keys);
  const passed = store.isVocabCheckpointPassed(profileId, tier);

  const summary = el('div', { class: 'card', style: 'display:flex;align-items:center;gap:16px' });
  if (!passed) summary.appendChild(progressRing(mastery, { size: 52, stroke: 5 }));
  const st = el('div', { style: 'flex:1' });
  st.appendChild(el('p', { style: 'margin:0;font-weight:700;color:var(--ink)' }, `${words.length} words · ${themesForTier(tier).length} themes`));
  st.appendChild(el('p', { style: 'margin:4px 0 0;color:var(--ink-soft);font-size:13px' },
    passed ? (due > 0 ? `✓ Vocabulary Practice unlocked · ${due} card${due === 1 ? '' : 's'} due` : '✓ Vocabulary Practice unlocked - keep practicing to retain it.')
           : 'Pass the checkpoint to add this tier to Vocabulary Practice (cumulative).'));
  summary.appendChild(st);
  if (passed) summary.appendChild(el('span', { style: 'font-size:28px' }, '✓'));
  container.appendChild(summary);

  if (passed) {
    const pb = el('button', { class: 'btn btn-primary btn-block', style: 'margin-top:12px' }, 'Go to Vocabulary Practice →');
    pb.addEventListener('click', () => { store.setSetting(profileId, 'practiceDeck', 'vocab'); navigate('/practice'); });
    container.appendChild(pb);
  }
  const cb = el('button', { class: 'btn btn-block', style: 'margin-top:10px' }, passed ? 'Retake the checkpoint' : 'Take the checkpoint');
  cb.classList.toggle('btn-primary', !passed);
  cb.addEventListener('click', () => navigate(`${tierPath}/checkpoint`));
  container.appendChild(cb);

  container.appendChild(el('h2', { style: 'margin:24px 0 10px;font-size:15px;letter-spacing:0.04em;text-transform:uppercase;color:var(--cream-dim)' }, 'Themes'));
  const grid = el('div', { style: 'display:grid;grid-template-columns:repeat(auto-fill, minmax(150px, 1fr));gap:10px' });
  for (const theme of themesForTier(tier)) {
    const n = wordsForTheme(tier, theme).length;
    const card = el('button', { class: 'card', style: 'text-align:left;padding:14px;margin-top:0' }, [
      el('div', { style: 'font-weight:700;color:var(--ink);overflow-wrap:anywhere' }, theme),
      el('div', { style: 'color:var(--ink-soft);font-size:12px;margin-top:3px' }, `${n} word${n === 1 ? '' : 's'}`),
    ]);
    card.addEventListener('click', () => navigate(`${tierPath}/theme/${themeSlug(theme)}`));
    grid.appendChild(card);
  }
  container.appendChild(grid);
}

// ---------------------------------------------------------------- theme view (word cards)
export function renderVocabTheme(container, { profileId, tier, slug, setBreadcrumb }) {
  const tierPath = `/vocab/${tier.toLowerCase()}`;
  const theme = themesForTier(tier).find((t) => themeSlug(t) === slug);
  container.innerHTML = '';
  container.appendChild(backLink(`${tier} Vocabulary`, () => navigate(tierPath)));
  if (!theme) {
    setBreadcrumb('Vocabulary');
    container.appendChild(el('div', { class: 'card' }, 'That theme does not exist.'));
    return;
  }
  setBreadcrumb(`Vocabulary · ${tier} · ${theme}`);
  container.appendChild(el('h1', {}, theme));
  container.appendChild(el('p', { style: 'color:var(--cream-dim)' }, `${tier} · tap 🔊 to listen, or add a word to Vocabulary Practice.`));

  const list = el('div', { style: 'display:flex;flex-direction:column;gap:12px' });
  for (const v of wordsForTheme(tier, theme)) {
    const card = el('div', { class: 'card' });
    card.appendChild(wordCardBody(v));
    const pinned = store.isPinnedVocab(profileId, v.id);
    const pinBtn = el('button', { class: `btn ${pinned ? '' : 'btn-primary'}`, style: 'margin-top:12px;font-size:12.5px;padding:7px 12px' }, pinned ? '✓ In practice' : '+ Add to practice');
    pinBtn.addEventListener('click', () => {
      const now = store.togglePinnedVocab(profileId, v.id);
      pinBtn.textContent = now ? '✓ In practice' : '+ Add to practice';
      pinBtn.classList.toggle('btn-primary', !now);
    });
    card.appendChild(pinBtn);
    list.appendChild(card);
  }
  container.appendChild(list);
}

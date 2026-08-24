import * as store from '../store.js';
import * as srs from '../srs.js';
import { el, speakerButton, progressRing, backLink } from '../ui/components.js';
import { VERBS } from '../data/verbs-a1.js';
import { TENSE_LABELS, factKeysFor, conjugationTable } from '../ui/verbUtils.js';
import { navigate } from '../router.js';

/** Fixed-size, vertically-centered, internal-scroll-if-tall - the whole point being that
 *  navigating card to card (Learn's verb list, or later a "next verb" flow) never causes
 *  the page to jump, unlike the old resize-per-card layout. */
export async function renderVerbCard(container, { profileId, infinitive, setBreadcrumb }) {
  const verb = VERBS.find((v) => v.infinitive === infinitive);
  container.innerHTML = '';
  container.appendChild(backLink(`${verb ? verb.level : ''} verbs`, () => navigate(verb ? `/level/${verb.level}` : '')));

  if (!verb) {
    setBreadcrumb('Verb not found');
    container.appendChild(el('div', { class: 'card' }, `"${infinitive}" isn't in the course yet.`));
    return;
  }
  setBreadcrumb(`${verb.level} · ${verb.infinitive}`);

  const deck = store.getSRSDeck(profileId);
  const keys = factKeysFor([verb], ['praesens', 'imperativ', 'perfekt']);
  const mastery = srs.masteryForKeys(deck, keys);
  const pinned = store.isPinnedVerb(profileId, verb.infinitive);
  const primaryExample = verb.examplesByPronoun.praesens?.ich;

  const scene = el('div', { class: 'verb-card-scene' });
  const card = el('div', { class: 'card verb-card' });
  const scroll = el('div', { class: 'verb-card-scroll' });

  const headRow = el('div', { style: 'display:flex;align-items:flex-start;justify-content:space-between;gap:10px' });
  headRow.appendChild(
    el('div', {}, [
      el('div', { style: 'font-family:var(--font-mono);font-size:26px;font-weight:800;color:var(--ink);display:flex;align-items:center;gap:8px' }, [
        verb.infinitive,
        speakerButton(verb.infinitive),
      ]),
      el('div', { style: 'color:var(--ink-soft);margin-top:2px' }, verb.english),
    ])
  );
  headRow.appendChild(progressRing(mastery, { size: 46, stroke: 4 }));
  scroll.appendChild(headRow);

  if (primaryExample) {
    scroll.appendChild(
      el('div', { class: 'example-line', style: 'margin-top:14px' }, [
        el('span', {}, primaryExample.de),
        el('span', { style: 'display:flex;align-items:center;gap:8px' }, [
          el('span', { style: 'color:var(--ink-soft);font-family:var(--font-body);font-size:12.5px' }, primaryExample.en),
          speakerButton(primaryExample.de),
        ]),
      ])
    );
  }

  const pinBtn = el('button', { class: `btn ${pinned ? '' : 'btn-primary'} btn-block`, style: 'margin-top:14px' }, pinned ? '✓ Added to practice' : '+ Add to practice');
  pinBtn.addEventListener('click', () => {
    const nowPinned = store.togglePinnedVerb(profileId, verb.infinitive);
    pinBtn.textContent = nowPinned ? '✓ Added to practice' : '+ Add to practice';
    pinBtn.classList.toggle('btn-primary', !nowPinned);
  });
  scroll.appendChild(pinBtn);

  for (const tense of ['praesens', 'imperativ', 'perfekt']) {
    if (verb.tables[tense] == null) continue;
    scroll.appendChild(el('h3', { style: 'margin-top:20px' }, TENSE_LABELS[tense]));
    scroll.appendChild(conjugationTable(verb, tense));
  }

  card.appendChild(scroll);
  scene.appendChild(card);
  container.appendChild(scene);
}

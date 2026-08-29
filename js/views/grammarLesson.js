import { el, backLink } from '../ui/components.js';
import { lessonById } from '../data/grammarPoints.js';
import { navigate } from '../router.js';

/** Read-only reference lesson (never drilled) - same visual pattern as the Conjugation
 *  grammar-rule lessons: intro paragraph + a series of headed rule boxes. */
export function renderGrammarLesson(container, { lessonId, setBreadcrumb }) {
  const lesson = lessonById(lessonId);
  container.innerHTML = '';
  const tier = lesson ? lesson.tier : 'A1';
  container.appendChild(backLink(`${tier} Cases & Grammar`, () => navigate(`/cases/${tier.toLowerCase()}`)));

  if (!lesson) {
    setBreadcrumb('Cases & Grammar');
    container.appendChild(el('div', { class: 'card' }, 'That lesson does not exist.'));
    return;
  }
  setBreadcrumb(`Grammar · ${lesson.title}`);

  container.appendChild(el('h1', {}, lesson.title));
  container.appendChild(el('p', { style: 'color:var(--cream-dim)' }, `${lesson.tier} · reference only - nothing here is graded.`));

  const card = el('div', { class: 'card explain' });
  card.appendChild(el('p', { style: 'margin-top:0' }, lesson.intro));
  for (const rule of lesson.rules) {
    card.appendChild(el('h3', {}, rule.heading));
    card.appendChild(el('div', { class: 'rule-box' }, el('p', { style: 'margin:0' }, rule.body)));
  }
  container.appendChild(card);
}

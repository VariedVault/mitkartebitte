import { el, speakerButton, pronounChip } from '../ui/components.js';
import { getVerb } from '../data/conjugate.js';
import { PRONOUNS, PRONOUN_LABELS } from '../data/verbs.js';

const PRONOUN_ENGLISH = { ich: 'I', du: 'you (informal, one person)', er: 'he / she / it', wir: 'we', ihr: 'you all (informal, group)', sie: 'they / you (formal)' };

export async function renderOnboarding(container, { onDone }) {
  container.innerHTML = '';
  container.appendChild(el('h1', {}, 'Module 0 · Before we start'));
  container.appendChild(el('p', { style: 'color:var(--cream-dim)' }, 'Two things to know before Tier 1: who’s "talking" (the pronouns), and what "conjugation" even means.'));

  const card = el('div', { class: 'card explain' });
  container.appendChild(card);

  card.appendChild(el('h3', {}, 'The 6 subject pronouns'));
  card.appendChild(
    el('p', {}, 'Every German sentence needs to know WHO is doing the action. There are six "slots" — memorize these six, because every table in this course is built around them.')
  );

  const list = el('div', { style: 'display:grid;gap:8px;margin:14px 0' });
  for (const p of PRONOUNS) {
    list.appendChild(
      el('div', { class: 'example-line' }, [
        el('span', {}, [pronounChip(p), el('span', { style: 'margin-left:10px;font-weight:700' }, p === 'er' ? 'er / sie / es' : p === 'sie' ? 'sie / Sie' : p)]),
        el('span', { style: 'color:var(--ink-soft)' }, PRONOUN_ENGLISH[p]),
      ])
    );
  }
  card.appendChild(list);
  card.appendChild(
    el('div', { class: 'rule-box' }, [
      el('p', { style: 'margin:0' }, [
        el('strong', {}, 'Note: '),
        '"sie" (lowercase) means "they". "Sie" (capitalized, anywhere in a sentence) is the polite, formal "you" — for strangers, in shops, at work. They conjugate identically, so this course groups them together.',
      ]),
    ])
  );

  card.appendChild(el('h3', {}, 'What "conjugation" means'));
  card.appendChild(
    el('p', {}, 'In English, verbs barely change: I make, you make, she makes. In German, the verb ENDING changes for almost every pronoun — that changing pattern is called conjugation. Here’s the verb machen ("to make/do") fully conjugated:')
  );

  const machen = getVerb('machen');
  const table = el('table', { class: 'conj-table' });
  const tbody = el('tbody');
  for (const p of PRONOUNS) {
    tbody.appendChild(
      el('tr', {}, [
        el('td', { class: `pron-cell pron-${p}` }, PRONOUN_LABELS[p]),
        el('td', { class: 'form-cell' }, [machen.tables.praesens[p], ' ', speakerButton(`ich ${machen.tables.praesens.ich} machen`.replace('ich', PRONOUN_LABELS[p].split('/')[0]))]),
      ])
    );
  }
  table.appendChild(tbody);
  card.appendChild(table);
  card.appendChild(
    el('div', { class: 'rule-box' }, [
      el('p', { style: 'margin:0' }, 'See the pattern? -e, -st, -t, -en, -t, -en. Most weak verbs follow exactly this pattern — that’s Module 1. Some verbs (strong verbs) bend the vowel too, and a handful are irregular. You’ll meet all of it, in order, starting now.'),
    ])
  );

  const goBtn = el('button', { class: 'btn btn-primary btn-lg btn-block', style: 'margin-top:18px' }, 'Start the course →');
  goBtn.addEventListener('click', onDone);
  container.appendChild(goBtn);
}

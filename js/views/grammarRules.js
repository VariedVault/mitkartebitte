import { el, speakerButton, backLink } from '../ui/components.js';
import { VERBS } from '../data/verbs-a1.js';
import { navigate } from '../router.js';

// Short, plain-English reference lessons for the A1 tenses. Read-only - not drilled, no
// embedded quiz. Kept independent of any one verb so it reads correctly regardless of
// which verb a learner arrived from.
const LESSONS = {
  praesens: {
    title: 'Präsens (Present Tense)',
    level: 'A1',
    intro: 'Präsens is how you talk about now, habits, and - very often in German - the near future too ("Ich komme morgen" = "I\'m coming tomorrow" is perfectly normal).',
    rules: [
      {
        heading: 'The six endings',
        body: 'Most German verbs are "weak" (regular): drop the -en from the infinitive and add one of six endings. ich -e · du -st · er/sie/es -t · wir -en · ihr -t · sie/Sie -en. wir and sie/Sie both just reuse the bare infinitive ending - that repetition is free, not something to memorize twice.',
      },
      {
        heading: 'Stems ending in -t, -d, or a hard consonant cluster',
        body: 'A few verbs (arbeiten, finden) would be unpronounceable with the raw ending - "er arbeitt" - so an -e- is inserted: er arbeitet, du findest.',
      },
      {
        heading: 'Stem-changing verbs',
        body: 'A subset of "strong" verbs change their stem vowel ONLY for du and er/sie/es: e→i (geben → du gibst), e→ie (sehen → du siehst), a→ä (fahren → du fährst), au→äu (laufen → du läufst). wir/ihr/sie always use the plain stem.',
      },
      {
        heading: 'Modals and a few irregulars',
        body: 'können, müssen, wollen, dürfen, sollen, mögen, and wissen don\'t follow the regular pattern at all - their singular forms (ich/du/er) use a different stem than the plural. These are worth memorizing as their own small group.',
      },
    ],
    exampleVerb: 'machen',
  },
  imperativ: {
    title: 'Imperativ (Commands)',
    level: 'A1',
    intro: 'The imperative gives instructions or requests - "Come here!", "Please wait!". German has three forms depending on who you\'re addressing.',
    rules: [
      {
        heading: 'du (informal, one person)',
        body: 'Usually just the stem, no ending: "Mach!", "Kauf!". If the stem ends in -d/-t or a hard consonant cluster, keep a linking -e for pronounceability: "Arbeite!", "Finde!".',
      },
      {
        heading: 'ihr (informal, group)',
        body: 'Identical to the ihr-form of Präsens: "Macht!", "Arbeitet!".',
      },
      {
        heading: 'Sie (formal)',
        body: 'The bare infinitive, plus "Sie": "Machen Sie!", "Arbeiten Sie!". Always regular, even for stem-changing verbs.',
      },
      {
        heading: 'Stem-changers keep e→i/e→ie in du, but NOT a→ä/au→äu',
        body: 'geben → "Gib!", sehen → "Sieh!" keep the change. But fahren → "Fahr!" (not "Fähr!"), laufen → "Lauf!" (not "Läuf!") drop it. A genuine quirk of German, not an inconsistency in this app.',
      },
      {
        heading: 'No imperative for modals',
        body: 'können, müssen, wollen, dürfen, sollen, mögen (and, in practice, wissen) don\'t have a natural imperative form in everyday German - you\'ll see this reflected as "no imperativ" on those verb pages.',
      },
    ],
    exampleVerb: 'kommen',
  },
  perfekt: {
    title: 'Perfekt (Conversational Past)',
    level: 'A1',
    intro: 'Perfekt is the everyday past tense used in speech: "Ich habe das gemacht" ("I did that / I have done that"). It\'s built from two pieces, not conjugated directly.',
    rules: [
      {
        heading: 'The formula',
        body: 'auxiliary (haben or sein, conjugated for the subject) + partizip II (a fixed past-participle form) at the end of the clause: "Ich habe gegessen." "Er ist gegangen."',
      },
      {
        heading: 'Which auxiliary?',
        body: 'Most verbs take haben. sein is used for verbs of motion or change of state (gehen, kommen, fahren, laufen, bleiben, werden) - a small, learnable list, not a rule you can derive from the verb\'s meaning alone.',
      },
      {
        heading: 'Regular partizip II',
        body: 'Weak verbs: ge- + stem + -t (machen → gemacht, kaufen → gekauft). Strong verbs change the stem vowel and end in -en instead (gehen → gegangen, essen → gegessen) - these have to be learned per verb, the same way English "go/went/gone" isn\'t predictable from a rule.',
      },
      {
        heading: 'Separable verbs',
        body: 'The ge- goes between the prefix and the stem: aufstehen → aufgestanden, einkaufen → eingekauft.',
      },
    ],
    exampleVerb: 'gehen',
  },
};

export async function renderGrammarRules(container, { tense, setBreadcrumb }) {
  const lesson = LESSONS[tense];
  container.innerHTML = '';
  container.appendChild(backLink('A1 Conjugation', () => navigate('/level/A1')));

  if (!lesson) {
    setBreadcrumb('Grammar');
    container.appendChild(el('div', { class: 'card' }, `No reference lesson for "${tense}" yet.`));
    return;
  }
  setBreadcrumb(`Grammar · ${lesson.title}`);

  container.appendChild(el('h1', {}, lesson.title));
  container.appendChild(el('p', { style: 'color:var(--cream-dim)' }, `${lesson.level} · reference only - nothing here is graded.`));

  const card = el('div', { class: 'card explain' });
  container.appendChild(card);
  card.appendChild(el('p', {}, lesson.intro));
  for (const rule of lesson.rules) {
    card.appendChild(el('h3', {}, rule.heading));
    card.appendChild(el('div', { class: 'rule-box' }, el('p', { style: 'margin:0' }, rule.body)));
  }

  const demoVerb = VERBS.find((v) => v.infinitive === lesson.exampleVerb);
  if (demoVerb && demoVerb.tables[tense]) {
    card.appendChild(el('h3', {}, `${demoVerb.infinitive} in ${lesson.title.split(' ')[0]}`));
    const table = el('table', { class: 'conj-table' });
    const tbody = el('tbody');
    const pronouns = tense === 'imperativ' ? ['du', 'ihr', 'Sie'] : ['ich', 'du', 'er', 'wir', 'ihr', 'sie'];
    for (const p of pronouns) {
      const form = demoVerb.tables[tense][p];
      if (form == null) continue;
      const label = tense === 'imperativ' ? p : { ich: 'ich', du: 'du', er: 'er/sie/es', wir: 'wir', ihr: 'ihr', sie: 'sie/Sie' }[p];
      tbody.appendChild(
        el('tr', {}, [
          el('td', { class: `pron-cell pron-${tense === 'imperativ' ? '' : p}`.trim() }, label),
          el('td', { class: 'form-cell' }, [form, ' ', speakerButton(form)]),
        ])
      );
    }
    table.appendChild(tbody);
    card.appendChild(table);
  }
}

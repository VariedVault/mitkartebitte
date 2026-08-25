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
  praeteritum: {
    title: 'Präteritum (Narrative Past)',
    level: 'A2',
    intro: 'Präteritum is the past tense used in writing (books, news, formal texts) and, for a handful of very common verbs, in speech too - Germans say "ich war" and "ich hatte", not "ich bin gewesen" / "ich habe gehabt", even in casual conversation.',
    rules: [
      {
        heading: 'Weak verbs: -te off the stem',
        body: 'Add -te/-test/-te/-ten/-tet/-ten to the stem: machen → machte, kaufte, kauften... Same linking -e- as Präsens for stems ending in -d/-t or a hard cluster: arbeiten → arbeitete (not "arbeittete").',
      },
      {
        heading: 'Strong verbs: a changed stem, then almost-bare endings',
        body: 'Strong verbs use an irregular ("ablaut") stem you have to learn per verb - gehen → ging, sehen → sah, tragen → trug. From that stem, ich and er/sie/es take NO ending at all (a genuine exception - every other tense marks 1st/3rd singular differently): ich ging, er ging. du/wir/ihr/sie add -st/-en/-t/-en: du gingst, wir gingen.',
      },
      {
        heading: 'Mixed verbs: a changed stem, but weak endings',
        body: 'A small group (denken, bringen, wissen, kennen, nennen) changes its stem like a strong verb AND keeps the weak -te ending: denken → dachte, dachtest, dachte, dachten... These have to be memorized as their own group, same as modals in Präsens.',
      },
      {
        heading: 'sein, haben, werden, and the modals',
        body: 'All fully irregular, all worth memorizing outright: sein → war, haben → hatte, werden → wurde. Modals lose their Präsens umlaut in Präteritum: können → konnte (not "könnte" - that spelling is actually Konjunktiv II, a different, later tense), müssen → musste, dürfen → durfte.',
      },
      {
        heading: 'Reflexive and separable verbs',
        body: 'Reflexive verbs keep the same pronoun placement as Präsens: "ich fühlte mich", "wir ärgerten uns". Separable verbs split in a main clause exactly like Präsens, with the prefix at the end: "Ich räumte das Zimmer auf."',
      },
    ],
    exampleVerb: 'gehen',
  },
  konjunktiv2: {
    title: 'Konjunktiv II (Would/Could/Should)',
    level: 'B1',
    intro: 'Konjunktiv II is the "unreal" mood - wishes, polite requests, hypotheticals, and advice: "Ich würde das nicht machen" ("I wouldn\'t do that"), "Könntest du mir helfen?" ("Could you help me?").',
    rules: [
      {
        heading: 'The modern default: würde + infinitive',
        body: 'For the vast majority of verbs, modern German just uses würde (conjugated: würde/würdest/würde/würden/würdet/würden) plus the bare infinitive at the end - "Ich würde gern kommen." This is always safe to use and is what native speakers actually say for most verbs.',
      },
      {
        heading: 'When a verb keeps its own short form instead',
        body: 'A small set of very high-frequency verbs sound old-fashioned or clunky with würde and keep a short synthetic form instead: sein → wäre, haben → hätte, werden → würde (werden IS its own würde-form), and the modals können → könnte, müssen → müsste, dürfen → dürfte, mögen → möchte, sollen → sollte, wollen → wollte. "Ich wäre froh" sounds natural; "ich würde froh sein" sounds off. Use the short form for these.',
      },
      {
        heading: 'A handful of strong verbs still in normal use',
        body: 'gehen → ginge, kommen → käme, geben → gäbe, wissen → wüsste, finden → fände, bleiben → bliebe are still commonly heard in their short form ("Das gäbe es nicht" / "Ich wüsste nicht warum"), though würde + infinitive works for these too and is never wrong.',
      },
      {
        heading: 'How the short form is built',
        body: 'Take the Präteritum stem, add an umlaut if the vowel is a/o/u (a→ä, o→ö, u→ü - konnte→könnte), then add -e/-(e)st/-e/-en/-(e)t/-en. Verbs whose Präteritum vowel is i or ie (ging, blieb) can\'t umlaut, so a couple of them use the fuller -est/-et endings instead of the usual contracted -st/-t, specifically so the Konjunktiv II form doesn\'t collide with the plain Präteritum ("du gingest", not "du gingst", which is already gehen\'s ordinary past tense).',
      },
    ],
    exampleVerb: 'gehen',
  },
  futur1: {
    title: 'Futur I (Future Tense)',
    level: 'B1',
    intro: 'Futur I talks about the future: "Ich werde morgen anrufen" ("I will call tomorrow"). It\'s built the same way for every verb, no exceptions to memorize.',
    rules: [
      {
        heading: 'The formula',
        body: 'werden (conjugated for the subject) + the bare infinitive at the end of the clause: "Ich werde kommen." "Sie werden es verstehen." Even werden itself follows this ("ich werde werden" is grammatically valid, if unusual).',
      },
      {
        heading: 'Separable verbs stay whole',
        body: 'Unlike Präsens, a separable verb does NOT split here - the full infinitive stays together at the end: "Ich werde aufstehen," not "Ich werde auf stehen" or "Ich stehe werden auf."',
      },
      {
        heading: 'Everyday German often skips it',
        body: 'For near-future plans, spoken German very often just uses Präsens with a time word instead: "Ich komme morgen" rather than "Ich werde morgen kommen." Futur I is still correct and common for predictions, promises, and formal writing.',
      },
    ],
    exampleVerb: 'kommen',
  },
  plusquamperfekt: {
    title: 'Plusquamperfekt (Past Perfect)',
    level: 'B1',
    intro: 'Plusquamperfekt is "the past before the past" - what had already happened before another past event: "Ich hatte schon gegessen, bevor du kamst" ("I had already eaten before you came").',
    rules: [
      {
        heading: 'The formula',
        body: 'Exactly like Perfekt, but the auxiliary is in Präteritum instead of Präsens: haben/sein in Präteritum (hatte/war...) + partizip II. "Ich hatte gegessen." "Sie war gegangen."',
      },
      {
        heading: 'Same auxiliary choice as Perfekt',
        body: 'If a verb takes haben in Perfekt, it takes hatte here; if it takes sein, it takes war. Nothing new to learn about which verbs use which - it\'s the identical list.',
      },
      {
        heading: 'What it\'s for',
        body: 'Almost always used alongside another past-tense clause to show which event came first: "Nachdem wir gegessen hatten, gingen wir spazieren" ("After we had eaten, we went for a walk").',
      },
    ],
    exampleVerb: 'gehen',
  },
  passiv: {
    title: 'Passiv (Passive Voice)',
    level: 'B1',
    intro: 'Passiv shifts focus from WHO does something to what HAPPENS: "Der Brief wird geschrieben" ("The letter is being written") instead of "Sie schreibt den Brief" ("She writes the letter"). Only verbs with a direct (accusative) object can form it - "helfen" and "zuhören" take a dative object and can\'t.',
    rules: [
      {
        heading: 'Vorgangspassiv - the action happening',
        body: 'werden (conjugated) + partizip II, describing the action in progress: Präsens "wird gemacht" (is being done), Präteritum "wurde gemacht" (was being done). This is the "default" passive most learners mean by the word.',
      },
      {
        heading: 'Perfekt passive uses "worden", not "geworden"',
        body: 'sein (conjugated) + partizip II + worden: "Das Haus ist gebaut worden" ("The house has been built"). "Worden" is a special invariant form used only here - werden\'s normal partizip II is "geworden" (as in "Er ist müde geworden" = "He has become tired"), but that never appears in a passive construction. Mixing these up is the single most common Passiv mistake.',
      },
      {
        heading: 'Zustandspassiv - the resulting state',
        body: 'sein (conjugated) + partizip II, but describing a STATE rather than an action: "Die Tür ist geöffnet" (the door is [now] open) vs. Vorgangspassiv "Die Tür wird geöffnet" (the door is [currently] being opened). Same words, different focus: process vs. result.',
      },
      {
        heading: 'Only for verbs with a direct object',
        body: 'A verb needs a plain accusative object to form a personal passive: "man macht das" → "das wird gemacht". Verbs that only take a dative object (helfen, zuhören - "man hilft MIR", never "man hilft MICH") cannot form one; you\'ll see this marked as not applicable on those verb pages instead of a made-up form.',
      },
    ],
    exampleVerb: 'machen',
  },
};

// Which actual tables[...] key(s) to demo per lesson, with a heading for each - almost
// always a 1:1 match to the lesson id, except 'passiv' which fans out into all 4 Passiv
// sub-tenses (see verbUtils.js's TENSE_ORDER comment for why Passiv is 4 slots, not 1).
const DEMO_TENSES = {
  praesens: [{ key: 'praesens', heading: 'in Präsens' }],
  imperativ: [{ key: 'imperativ', heading: 'in Imperativ' }],
  perfekt: [{ key: 'perfekt', heading: 'in Perfekt' }],
  praeteritum: [{ key: 'praeteritum', heading: 'in Präteritum' }],
  konjunktiv2: [{ key: 'konjunktiv2', heading: 'in Konjunktiv II' }],
  futur1: [{ key: 'futur1', heading: 'in Futur I' }],
  plusquamperfekt: [{ key: 'plusquamperfekt', heading: 'in Plusquamperfekt' }],
  passiv: [
    { key: 'passivPraesens', heading: 'Vorgangspassiv - Präsens' },
    { key: 'passivPraeteritum', heading: 'Vorgangspassiv - Präteritum' },
    { key: 'passivPerfekt', heading: 'Vorgangspassiv - Perfekt (note: "worden")' },
    { key: 'passivZustand', heading: 'Zustandspassiv' },
  ],
};

export async function renderGrammarRules(container, { tense, setBreadcrumb }) {
  const lesson = LESSONS[tense];
  container.innerHTML = '';
  const backLevel = lesson?.level ?? 'A1';
  container.appendChild(backLink(`${backLevel} Conjugation`, () => navigate(`/level/${backLevel}`)));

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
  for (const { key, heading } of DEMO_TENSES[tense] ?? []) {
    if (!demoVerb || demoVerb.tables[key] == null) continue;
    card.appendChild(el('h3', {}, `${demoVerb.infinitive} - ${heading}`));
    const table = el('table', { class: 'conj-table' });
    const tbody = el('tbody');
    const pronouns = key === 'imperativ' ? ['du', 'ihr', 'Sie'] : ['ich', 'du', 'er', 'wir', 'ihr', 'sie'];
    for (const p of pronouns) {
      const form = demoVerb.tables[key][p];
      if (form == null) continue;
      const label = key === 'imperativ' ? p : { ich: 'ich', du: 'du', er: 'er/sie/es', wir: 'wir', ihr: 'ihr', sie: 'sie/Sie' }[p];
      tbody.appendChild(
        el('tr', {}, [
          el('td', { class: `pron-cell pron-${key === 'imperativ' ? '' : p}`.trim() }, label),
          el('td', { class: 'form-cell' }, [form, ' ', speakerButton(form)]),
        ])
      );
    }
    table.appendChild(tbody);
    card.appendChild(table);
  }
}

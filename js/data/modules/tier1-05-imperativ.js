export default {
  id: 'tier1-05-imperativ',
  tier: 1,
  order: 5,
  title: 'Imperativ',
  level: 'A1',
  summary: 'Commands and requests - du, ihr, and the polite Sie form.',
  verbPool: (verbs) => verbs.filter((v) => v.tables.imperativ != null),
  tenses: ['imperativ'],
  exerciseTypes: ['fill', 'mc'],
  explanation: {
    intro:
      'The imperative gives commands, instructions, and casual requests. German has three imperative forms depending on who you\'re talking to - and unlike English, you have to pick.',
    rules: [
      { heading: 'du-form: drop everything', body: 'Take the du-praesens form, drop the -st: du machst → Mach! du fährst → Fahr!. Weak verbs sometimes keep a soft -e: Warte! Öffne!.' },
      {
        heading: 'e→i / e→ie DOES carry over - a→ä does NOT',
        body: 'sprechen → Sprich! and sehen → Sieh! keep their vowel change. But fahren → Fahr! and laufen → Lauf! use the plain vowel, never Führ! or Läuf!. This is the single most common imperative mistake - worth drilling deliberately.',
      },
      { heading: 'ihr-form', body: 'Identical to the ihr-praesens form: Macht! Fahrt! Sprecht!.' },
      { heading: 'Sie-form (polite)', body: 'Infinitive + Sie, verb first: Machen Sie! Fahren Sie! Sprechen Sie!. This is the safe default with strangers.' },
      { heading: 'sein is irregular here too', body: 'Sei ruhig! (du) · Seid ruhig! (ihr) · Seien Sie ruhig! (Sie) - suppletive, just like its praesens.' },
    ],
    tableDemo: { verb: 'sein', tense: 'imperativ' },
    examples: [
      { de: 'Sprich langsamer, bitte!', en: 'Speak more slowly, please!' },
      { de: 'Fahr vorsichtig!', en: 'Drive carefully!' },
      { de: 'Kommen Sie herein!', en: 'Come in!' },
    ],
  },
};

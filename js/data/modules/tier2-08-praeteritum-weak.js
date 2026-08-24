export default {
  id: 'tier2-08-praeteritum-weak',
  tier: 2,
  order: 8,
  title: 'Präteritum: Weak Verbs',
  level: 'A2',
  summary: 'The "written past" - regular, and needed for the modals and sein/haben you already use constantly.',
  verbPool: (verbs) => verbs.filter((v) => v.type === 'weak'),
  tenses: ['praeteritum'],
  exerciseTypes: ['fill', 'mc'],
  checkpoint: { count: 8, passThreshold: 0.8 },
  explanation: {
    intro:
      'Präteritum is the simple past - one word instead of Perfekt\'s two. In speech, Germans reach for it mostly with sein, haben, the modals, and a handful of very common verbs; everywhere else, Perfekt (Module 6–7) is what you\'ll actually hear. But Präteritum shows up constantly in writing - books, news, stories - so it\'s essential reading knowledge, and it\'s also the base every other past-based tense in this course builds on.',
    rules: [
      { heading: 'The rule for weak verbs', body: 'stem + -te + the same personal endings, minus the ich/er -e: machen → machte, machtest, machte, machten, machtet, machten. Compare it to Perfekt\'s partizip2 (gemacht) - same -t- signature, different job.' },
      { heading: 'The linking -e- again', body: 'arbeiten → arbeitete (not "arbeitte") - the same dental-stem rule from Präsens and the partizip2 shows up here too. öffnen → öffnete for the same reason.' },
    ],
    tableDemo: { verb: 'machen', tense: 'praeteritum' },
    examples: [
      { de: 'Ich machte die Hausaufgaben.', en: 'I did the homework.' },
      { de: 'Er wohnte zehn Jahre in München.', en: 'He lived in Munich for ten years.' },
      { de: 'Sie kaufte ein neues Auto.', en: 'She bought a new car.' },
    ],
  },
};

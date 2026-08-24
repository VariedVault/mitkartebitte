export default {
  id: 'tier4-12-plusquamperfekt',
  tier: 4,
  order: 12,
  title: 'Plusquamperfekt',
  level: 'B1',
  summary: 'The "past before the past" - for when one thing happened before another already-past thing.',
  verbPool: (verbs) => verbs.filter((v) => v.type !== 'modal' && v.infinitive !== 'möchten' && !v.reflexive),
  tenses: ['plusquamperfekt'],
  explanation: {
    intro:
      'Plusquamperfekt (past perfect) describes something that had already happened before another past event. If Perfekt/Präteritum is "I ate", Plusquamperfekt is "I had already eaten (before you arrived)". You already know every piece of it - this module is really just Perfekt\'s structure with the auxiliary rewound one tense further.',
    rules: [
      { heading: 'The formula', body: 'Präteritum of haben/sein + partizip2. Compare: Perfekt "ich habe gegessen" (aux in praesens) vs. Plusquamperfekt "ich hatte gegessen" (aux in präteritum). Same partizip2, same haben/sein choice you already learned - only the auxiliary\'s own tense moves back.' },
      { heading: 'The classic use: bevor / nachdem', body: '"Nachdem ich gegessen hatte, ging ich ins Bett." (After I had eaten, I went to bed.) The earlier action gets Plusquamperfekt; the later one gets Präteritum or Perfekt. That contrast IS the whole point of this tense.' },
    ],
    tableDemo: { verb: 'essen', tense: 'plusquamperfekt' },
    examples: [
      { de: 'Ich hatte das Buch schon gelesen.', en: 'I had already read the book.' },
      { de: 'Sie war schon angekommen, als wir ankamen.', en: 'She had already arrived when we arrived.' },
      { de: 'Wir hatten nichts gegessen.', en: "We hadn't eaten anything." },
    ],
  },
};

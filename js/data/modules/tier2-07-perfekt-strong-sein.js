export default {
  id: 'tier2-07-perfekt-strong-sein',
  tier: 2,
  order: 7,
  title: 'Perfekt: Strong Verbs + sein',
  level: 'A2',
  summary: 'Movement and change-of-state verbs use sein instead of haben.',
  verbPool: (verbs) => verbs.filter((v) => (v.type === 'strong' || v.type === 'irregular') && v.auxiliary === 'sein'),
  tenses: ['perfekt'],
  exerciseTypes: ['fill', 'mc'],
  explanation: {
    intro:
      'Most verbs use haben in the Perfekt - but a specific group uses sein instead. The rule isn\'t random: sein-verbs describe MOVEMENT from one place to another (gehen, fahren, kommen) or a CHANGE OF STATE (werden, sterben) - plus the two odd-ones-out sein and bleiben, which describe a state rather than an action at all.',
    rules: [
      { heading: 'The test', body: 'Ask: does the verb describe a change of location or condition, with no direct object? gehen (I go - no object) → sein. essen (I eat something - has an object) → haben, even though eating "moves" food around, grammatically it doesn\'t count.' },
      { heading: 'Partizip2 is still strong', body: 'The participle itself is built the same irregular way as any strong verb: gehen → gegangen, kommen → gekommen, fahren → gefahren. Only the AUXILIARY choice is new information here.' },
      { heading: 'Separable verbs follow their base verb', body: 'aufstehen (base: stehen, sein) → aufgestanden. ankommen (base: kommen, sein) → angekommen. The prefix fuses with ge-: auf+ge+standen.' },
    ],
    tableDemo: { verb: 'gehen', tense: 'perfekt' },
    examples: [
      { de: 'Ich bin nach Hause gegangen.', en: 'I went home.' },
      { de: 'Wir sind um sieben aufgestanden.', en: 'We got up at seven.' },
      { de: 'Der Zug ist angekommen.', en: 'The train has arrived.' },
    ],
  },
};

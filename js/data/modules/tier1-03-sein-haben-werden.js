export default {
  id: 'tier1-03-sein-haben-werden',
  tier: 1,
  order: 3,
  title: 'sein, haben, werden',
  level: 'A1',
  summary: 'The three most important irregular verbs - and the three tense-building auxiliaries.',
  verbPool: (verbs) => verbs.filter((v) => ['sein', 'haben', 'werden'].includes(v.infinitive)),
  tenses: ['praesens'],
  exerciseTypes: ['fill', 'mc'],
  explanation: {
    intro:
      'sein (to be), haben (to have), and werden (to become) are the three most-used verbs in German, full stop. They\'re also completely irregular - no ending pattern will save you here, they just have to be memorized. The good news: once you know them, you already have a head start on Perfekt, Plusquamperfekt, Futur, and Passiv (Tiers 2–4), because every one of those tenses is built out of one of these three verbs.',
    rules: [
      { heading: 'sein - to be', body: 'ich bin, du bist, er ist, wir sind, ihr seid, sie sind. No "-e/-st/-t" pattern anywhere in sight.' },
      { heading: 'haben - to have', body: 'ich habe, du hast, er hat, wir haben, ihr habt, sie haben. Almost regular, except du/er drop the -b-.' },
      { heading: 'werden - to become', body: 'ich werde, du wirst, er wird, wir werden, ihr werdet, sie werden. This is also how you\'ll build the future tense and the passive voice later.' },
    ],
    tableDemo: { verb: 'sein', tense: 'praesens' },
    examples: [
      { de: 'Ich bin müde.', en: 'I am tired.' },
      { de: 'Wir haben keine Zeit.', en: "We don't have time." },
      { de: 'Es wird kalt.', en: "It's getting cold." },
    ],
  },
};

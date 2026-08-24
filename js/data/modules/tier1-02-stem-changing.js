export default {
  id: 'tier1-02-stem-changing',
  tier: 1,
  order: 2,
  title: 'Stem-Changing Verbs',
  level: 'A1',
  summary: 'a→ä, e→i, e→ie - the present-tense vowel shifts, and why the imperative ignores one of them.',
  verbPool: (verbs) => verbs.filter((v) => v.type === 'strong' && (v.tags || []).some((t) => t === 'ablaut-a-ä' || t === 'ablaut-e-i' || t === 'ablaut-e-ie')),
  tenses: ['praesens'],
  exerciseTypes: ['fill', 'mc'],
  explanation: {
    intro:
      'Some verbs are "strong" - a family of everyday, high-frequency verbs that bend a vowel instead of (or alongside) taking regular endings. In the present tense, exactly three patterns exist, and the change only ever happens in du and er/sie/es - never ich, wir, ihr, or sie/Sie.',
    rules: [
      { heading: 'a → ä', body: 'fahren → du fährst, er fährt. Also: schlafen (schläft), tragen (trägt), halten (hält).' },
      { heading: 'e → i', body: 'sprechen → du sprichst, er spricht. Also: essen (isst), geben (gibt), nehmen (nimmt), helfen (hilft).' },
      { heading: 'e → ie', body: 'sehen → du siehst, er sieht. Also: lesen (liest), empfehlen (empfiehlt).' },
      {
        heading: 'The trap: imperatives',
        body: 'e→i and e→ie carry over into the du-imperative (Sprich! Sieh!) - but a→ä does NOT: it\'s "Fahr!", never "Fähr!". You\'ll drill this properly in Module 5, but it\'s worth knowing the asymmetry exists now.',
      },
    ],
    tableDemo: { verb: 'sprechen', tense: 'praesens' },
    examples: [
      { de: 'Er fährt mit dem Auto.', en: 'He drives (by car).' },
      { de: 'Sie isst gern Pasta.', en: 'She likes eating pasta.' },
      { de: 'Siehst du den Bus?', en: 'Do you see the bus?' },
    ],
  },
};

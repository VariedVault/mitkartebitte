export default {
  id: 'tier3-10-separable-prefixes',
  tier: 3,
  order: 10,
  title: 'Separable & Inseparable Prefixes',
  level: 'B1',
  summary: 'Prefixes that fly to the end of the sentence - and the ones that never do.',
  verbPool: (verbs) => verbs.filter((v) => v.separable || ['bezahlen', 'verstehen', 'empfehlen', 'beginnen', 'passieren'].includes(v.infinitive)),
  tenses: ['praesens', 'perfekt'],
  exerciseTypes: ['fill', 'mc'],
  explanation: {
    intro:
      'German verb prefixes come in two personalities. Separable prefixes (auf-, an-, ein-, mit-, fern-, and many more) are stressed, carry real meaning, and physically detach from the verb in a main clause, flying to the very end. Inseparable prefixes (be-, ver-, emp-, ent-, er-, ge-, zer-) are unstressed, never separate, and - as you already noticed in Perfekt - block ge-.',
    rules: [
      { heading: 'Separable in Präsens/Präteritum', body: 'aufstehen: "Ich stehe um sieben auf." The conjugated part (stehe) stays in position 2; auf lands at the very end of the clause. In a subordinate clause (after weil, dass...) they reunite: "...weil ich aufstehe."' },
      { heading: 'Separable in Perfekt', body: 'The prefix reunites with ge-: aufstehen → aufgestanden, anrufen → angerufen, einkaufen → eingekauft. The whole thing becomes one word again.' },
      { heading: 'Inseparable: never splits, never takes ge-', body: 'verstehen → versteht (never "steht ver"), Perfekt: verstanden (no ge-). bezahlen → bezahlt. These prefixes fuse permanently with the verb.' },
      { heading: 'Same spelling, different verb', body: 'Some prefixes exist both ways depending on the verb - but for the set you\'re learning here, treat separable and inseparable as two clearly distinct groups and you\'ll be right almost every time.' },
    ],
    tableDemo: { verb: 'aufstehen', tense: 'praesens' },
    examples: [
      { de: 'Ich rufe dich morgen an.', en: 'I’ll call you tomorrow.' },
      { de: 'Ich habe dich gestern angerufen.', en: 'I called you yesterday.' },
      { de: 'Ich verstehe die Frage nicht.', en: "I don't understand the question." },
    ],
  },
};

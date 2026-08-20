export default {
  id: 'tier2-06-perfekt-weak',
  tier: 2,
  order: 6,
  title: 'Perfekt: Weak Verbs + haben',
  level: 'A2',
  summary: 'The everyday spoken past: haben + a ge-...-t participle.',
  verbPool: (verbs) => verbs.filter((v) => v.type === 'weak' && v.auxiliary === 'haben'),
  tenses: ['perfekt'],
  exerciseTypes: ['fill', 'mc', 'table'],
  checkpoint: { count: 10, passThreshold: 0.8 },
  explanation: {
    intro:
      'Perfekt is how Germans actually talk about the past in conversation - far more than Präteritum (Module 8), which mostly lives in writing. It\'s a two-piece tense: a conjugated auxiliary (haben or sein) in second position, plus a participle (partizip2) pushed to the very end of the sentence.',
    rules: [
      { heading: 'Building the partizip2', body: 'For a regular weak verb: ge- + stem + -t. machen → gemacht. kaufen → gekauft. arbeiten → gearbeitet (keeps its linking -e-, same rule as praesens).' },
      { heading: 'Two prefixes that block ge-', body: 'Verbs starting with an unstressed prefix (be-, ver-, emp-, ent-, er-, ge-, zer-) never take ge-: bezahlen → bezahlt, not gebezahlt. Verbs ending in -ieren never take ge- either: passieren → passiert.' },
      { heading: 'Word order', body: 'The auxiliary sits in the normal verb-second slot; the participle goes to the end: "Ich habe das Frühstück gemacht." Everything in between - objects, time, place - sits inside that frame.' },
    ],
    tableDemo: { verb: 'kaufen', tense: 'perfekt' },
    examples: [
      { de: 'Ich habe Brot gekauft.', en: 'I bought bread.' },
      { de: 'Hast du die Rechnung schon bezahlt?', en: 'Have you already paid the bill?' },
      { de: 'Wir haben lange gewartet.', en: 'We waited a long time.' },
    ],
  },
};

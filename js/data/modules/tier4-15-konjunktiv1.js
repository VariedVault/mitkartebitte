export default {
  id: 'tier4-15-konjunktiv1',
  tier: 4,
  order: 15,
  title: 'Konjunktiv I (Reported Speech)',
  level: 'B1',
  summary: 'Er sagt, er sei müde. Signaling "this is what someone else said," without endorsing it.',
  verbPool: (verbs) => verbs.filter((v) => v.infinitive !== 'möchten' && !v.reflexive),
  tenses: ['konjunktiv1'],
  exerciseTypes: ['fill', 'mc'],
  checkpoint: { count: 10, passThreshold: 0.8 },
  explanation: {
    intro:
      'Konjunktiv I\'s one real job in modern German is reported speech — newspapers and news broadcasts use it constantly to mark "this is a claim someone made," without the writer taking a position on whether it\'s true. "Der Minister sagte, er sei zurückgetreten" (The minister said he had resigned) — that "sei" signals distance from the claim.',
    rules: [
      { heading: 'The formula — genuinely regular', body: 'Unlike Konjunktiv II, this one has almost no irregularity: infinitive stem + -e/-est/-e/-en/-et/-en. gehen → gehe, gehest, gehe, gehen, gehet, gehen. Even strong verbs and modals follow this exact rule: können → könne, müssen → müsse.' },
      { heading: 'The one exception: sein', body: 'sei, seist, sei, seien, seiet, seien — no -e- infix, and note "seist" (not "seiest"). This is the single form worth memorizing by itself; it\'s also by far the most common Konjunktiv I form you\'ll encounter.' },
      { heading: 'When the form looks identical to normal Präsens', body: 'ich/wir/sie forms are often identical to regular Präsens (ich mache = both indicative and technically Konj. I) — so in practice, Konjunktiv I is really only NOTICEABLE (and therefore really used) in the du/er forms, especially "er sei", "er habe", "er könne".' },
      { heading: 'Reported speech in the past', body: 'Konjunktiv I perfekt: haben/sein (Konj. I) + partizip2 — "Sie sagte, er sei gegangen" (She said he had left / gone).' },
    ],
    tableDemo: { verb: 'sein', tense: 'konjunktiv1' },
    examples: [
      { de: 'Er sagt, er sei krank.', en: 'He says he is sick.' },
      { de: 'Sie meint, sie habe recht.', en: 'She thinks she is right.' },
      { de: 'Der Sprecher sagte, die Preise würden steigen.', en: 'The spokesperson said prices would rise.' },
    ],
  },
};

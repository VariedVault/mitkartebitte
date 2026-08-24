export default {
  id: 'tier2-09-praeteritum-strong-modals',
  tier: 2,
  order: 9,
  title: 'Präteritum: Strong Verbs & Modals',
  level: 'A2',
  summary: 'The irregular past stems - genuinely worth memorizing, since Perfekt reuses the same root.',
  verbPool: (verbs) => verbs.filter((v) => v.type === 'strong' || v.type === 'modal'),
  tenses: ['praeteritum'],
  explanation: {
    intro:
      'Strong verbs don\'t add -te - they change their stem vowel entirely, then take a lighter set of endings (and ich/er take NO ending at all). This is the "irregular" everyone worries about - but the payoff is real: the partizip2 you learned in Modules 6–7 is built from the same irregular root family, so recognizing the pattern here makes both tenses easier.',
    rules: [
      { heading: 'The pattern', body: 'gehen → ging, gingst, ging, gingen, gingt, gingen. No -e- on ich or er - that\'s the tell that separates strong Präteritum from weak.' },
      { heading: 'Modals lose their umlaut in the past', body: 'können → konnte (not könnte - that\'s Konjunktiv II, Module 14!). müssen → musste. The vowel change that marks the praesens singular disappears entirely in the past.' },
      { heading: 'Dental stems still insert -e-', body: 'finden → fand, but du/ihr need the buffer: fandest, fandet. halten → hielt, hieltest, hieltet. Same rule as always, just now on a strong-verb stem.' },
    ],
    tableDemo: { verb: 'gehen', tense: 'praeteritum' },
    examples: [
      { de: 'Ich ging gestern ins Kino.', en: 'I went to the cinema yesterday.' },
      { de: 'Sie musste früh aufstehen.', en: 'She had to get up early.' },
      { de: 'Wir fanden die Adresse nicht.', en: "We couldn't find the address." },
    ],
  },
};

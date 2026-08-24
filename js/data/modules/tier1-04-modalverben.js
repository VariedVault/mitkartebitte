export default {
  id: 'tier1-04-modalverben',
  tier: 1,
  order: 4,
  title: 'Modalverben',
  level: 'A1',
  summary: 'können, müssen, dürfen, sollen, wollen, mögen - plus the everyday "möchte".',
  verbPool: (verbs) => verbs.filter((v) => v.type === 'modal'),
  tenses: ['praesens'],
  exerciseTypes: ['fill', 'mc'],
  explanation: {
    intro:
      'Modal verbs add a shade of meaning - ability, obligation, permission, desire - to another verb. They\'re a closed set of six, and they\'re all irregular in the same distinctive way: in the singular (ich/du/er), the vowel changes and, most noticeably, ich and er/sie/es use the EXACT SAME FORM, with no ending at all.',
    rules: [
      {
        heading: 'The pattern',
        body: 'ich kann, du kannst, er kann - see how ich and er match? That happens for all six modals. wir/ihr/sie go back to the plain infinitive stem: wir können, ihr könnt, sie können.',
      },
      {
        heading: 'The six, plus one',
        body: 'können (can/able to) · müssen (must) · dürfen (may/allowed to) · sollen (should) · wollen (want to) · mögen (to like). A modal is almost always paired with a second verb pushed to the end of the sentence in its infinitive: "Ich muss jetzt gehen."',
      },
      {
        heading: 'möchte - don\'t skip this one',
        body: 'möchte(n) is technically the Konjunktiv II form of mögen, but in everyday speech it\'s used as its own polite present tense - "I would like". It\'s one of the single most useful phrases in spoken German: "Ich möchte einen Kaffee, bitte." You\'ll meet the grammatical explanation again in Module 14; for now, just learn its forms.',
      },
    ],
    tableDemo: { verb: 'können', tense: 'praesens' },
    examples: [
      { de: 'Ich kann gut kochen.', en: 'I can cook well.' },
      { de: 'Darf ich hier rauchen?', en: 'May I smoke here?' },
      { de: 'Ich möchte einen Kaffee, bitte.', en: "I'd like a coffee, please." },
    ],
  },
};

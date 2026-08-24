export default {
  id: 'tier3-11-reflexive',
  tier: 3,
  order: 11,
  title: 'Reflexive Verbs',
  level: 'B1',
  summary: 'Verbs where the action bounces back to the subject - mich, dich, sich, uns, euch, sich.',
  verbPool: (verbs) => verbs.filter((v) => v.reflexive),
  tenses: ['praesens', 'perfekt'],
  explanation: {
    intro:
      'A reflexive verb is one where the subject does the action to itself: sich freuen (to be glad - literally "to make oneself happy"), sich waschen (to wash oneself). German uses reflexive verbs far more often than English does - many verbs that are reflexive in German have no "-self" in their English translation at all.',
    rules: [
      { heading: 'The reflexive pronoun set', body: 'mich (ich) · dich (du) · sich (er/sie/es) · uns (wir) · euch (ihr) · sich (sie/Sie). Notice sich covers both 3rd-person-singular AND all of 3rd-person-plural/formal - one word, two jobs.' },
      { heading: 'Where it goes', body: 'Right after the conjugated verb in a normal statement: "Ich freue mich auf das Wochenende." The verb itself conjugates completely normally - reflexivity only adds this one extra word.' },
      { heading: 'It survives into every other tense', body: 'Perfekt: "Ich habe mich gefreut." Imperative: "Freu dich!" The reflexive pronoun never disappears - it just moves to wherever the grammar of that tense puts it.' },
    ],
    tableDemo: { verb: 'sich freuen', tense: 'praesens' },
    examples: [
      { de: 'Ich fühle mich gut.', en: 'I feel good.' },
      { de: 'Wir ziehen uns schnell an.', en: 'We get dressed quickly.' },
      { de: 'Hast du dich gewaschen?', en: 'Did you wash (yourself)?' },
    ],
  },
};

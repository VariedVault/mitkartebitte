export default {
  id: 'tier4-13-futur',
  tier: 4,
  order: 13,
  title: 'Futur I (+ II)',
  level: 'B1',
  summary: 'werden + infinitive - used more for emphasis and prediction than plain future time.',
  verbPool: (verbs) => verbs.filter((v) => v.type !== 'modal' && v.infinitive !== 'möchten' && !v.reflexive),
  tenses: ['futur1'],
  exerciseTypes: ['fill', 'mc'],
  checkpoint: { count: 10, passThreshold: 0.8 },
  explanation: {
    intro:
      'Here\'s the twist: Germans mostly DON\'T use Futur I to talk about the future - Präsens plus a time word ("Ich komme morgen") does that job just fine, as you saw back in Module 1. Futur I is reserved for prediction, promises, and assumption: "Es wird regnen" (it\'s going to rain) carries more certainty/emphasis than just describing a scheduled event.',
    rules: [
      { heading: 'The formula', body: 'werden (conjugated) + bare infinitive at the end: "Ich werde anrufen." "Sie wird kommen." Only werden conjugates - the main verb stays in its infinitive form untouched.' },
      { heading: 'Also used for assumptions about NOW', body: '"Er wird zu Hause sein" doesn\'t mean "he will be home" in the future - it means "he\'s probably home right now." This present-tense-guess use is extremely common in speech.' },
      {
        heading: 'Futur II, briefly',
        body: 'werden + partizip2 + haben/sein - expresses a guess about something already completed: "Sie wird schon angekommen sein" (She\'s probably already arrived). Rare in speech, but good to recognize when you read it.',
      },
    ],
    tableDemo: { verb: 'kommen', tense: 'futur1' },
    examples: [
      { de: 'Es wird bald regnen.', en: "It's going to rain soon." },
      { de: 'Ich werde dich morgen anrufen.', en: "I'll call you tomorrow." },
      { de: 'Sie wird schon angekommen sein.', en: 'She has probably already arrived.' },
    ],
  },
};

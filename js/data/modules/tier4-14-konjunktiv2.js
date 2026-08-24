export default {
  id: 'tier4-14-konjunktiv2',
  tier: 4,
  order: 14,
  title: 'Konjunktiv II',
  level: 'B1',
  summary: 'würde, hätte, wäre, könnte - the mood of hypotheticals, wishes, and polite requests.',
  verbPool: (verbs) => verbs.filter((v) => v.infinitive !== 'möchten' && !v.reflexive),
  tenses: ['konjunktiv2'],
  exerciseTypes: ['fill', 'mc'],
  checkpoint: { count: 8, passThreshold: 0.8 },
  explanation: {
    intro:
      'Konjunktiv II is the "unreal" mood: wishes, hypotheticals, polite requests, and if-then statements that aren\'t (or might not be) true. You\'ve secretly already used it - "möchte" (Module 4) is Konjunktiv II of mögen, and that\'s the key to this whole module: it works differently depending on the verb.',
    rules: [
      {
        heading: 'Living synthetic forms',
        body: 'A handful of high-frequency irregular verbs still use their own one-word Konjunktiv II in everyday speech: sein → wäre, haben → hätte, werden → würde, wissen → wüsste, and all six modals (könnte, müsste, dürfte, sollte, wollte, möchte). Learn these as vocabulary - they\'re used constantly.',
      },
      {
        heading: 'Everything else: würde + infinitive',
        body: 'For the vast majority of verbs, the "textbook" synthetic form (e.g. "führe" for fahren, "schriebe" for schreiben) sounds archaic or literary today. Real spoken German uses würde (Konjunktiv II of werden) + the infinitive instead: "Ich würde das nicht machen." This is what native speakers actually say.',
      },
      { heading: 'The classic if-then', body: 'Wenn ich Zeit hätte, würde ich kommen. (If I had time, I would come.) One clause often uses a synthetic form, the other würde - mixing them is completely normal.' },
    ],
    tableDemo: { verb: 'haben', tense: 'konjunktiv2' },
    examples: [
      { de: 'Ich hätte gern einen Kaffee.', en: "I'd like a coffee." },
      { de: 'Das wäre schön.', en: 'That would be nice.' },
      { de: 'Ich würde das anders machen.', en: 'I would do that differently.' },
    ],
  },
};

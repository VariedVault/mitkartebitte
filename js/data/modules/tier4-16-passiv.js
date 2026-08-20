const PASSIV_VERBS = ['machen', 'kaufen', 'geben', 'schreiben', 'lesen', 'bringen', 'essen', 'trinken', 'bezahlen', 'öffnen', 'suchen', 'fragen'];

export default {
  id: 'tier4-16-passiv',
  tier: 4,
  order: 16,
  title: 'Passiv',
  level: 'B1',
  summary: 'When the thing being done to matters more than who\'s doing it.',
  verbPool: (verbs) => verbs.filter((v) => PASSIV_VERBS.includes(v.infinitive)),
  tenses: ['passivVorgang'],
  exerciseTypes: ['fill', 'mc'],
  checkpoint: { count: 10, passThreshold: 0.8 },
  explanation: {
    intro:
      'Active voice: "Der Kellner bringt die Rechnung" (the waiter brings the bill) - the doer is the subject. Passive voice: "Die Rechnung wird gebracht" (the bill is brought/being brought) - the thing being acted on becomes the subject, and the doer either disappears entirely or gets demoted to a "von + dative" phrase. German reaches for this constantly in instructions, news, and anywhere the ACTION matters more than who did it.',
    rules: [
      { heading: 'Vorgangspassiv - the "process" passive', body: 'werden (conjugated) + partizip2, participle at the end, exactly like Perfekt\'s skeleton but with werden instead of haben/sein: "Das Buch wird gelesen" (The book is being read). This is what people usually just call "Passiv".' },
      { heading: 'Only transitive verbs passivize', body: 'You need a direct object to promote into the new subject. gehen has no object, so "*wird gegangen" for a normal sentence doesn\'t work the same way - that\'s why this module only drills verbs that take a direct accusative object: kaufen, schreiben, lesen, bringen, essen...' },
      { heading: 'Naming the doer (optional)', body: 'If you DO want to mention who did it, use von + dative: "Die Rechnung wird vom Kellner gebracht" (The bill is brought by the waiter).' },
      { heading: 'Zustandspassiv - the "result state" passive', body: 'sein + partizip2 describes the RESULT rather than the action: "Der Laden ist geöffnet" (The shop is open) describes a state, versus Vorgangspassiv "Der Laden wird geöffnet" (The shop is being opened) describing the action happening right now.' },
    ],
    tableDemo: { verb: 'kaufen', tense: 'passivVorgang' },
    examples: [
      { de: 'Die Rechnung wird gebracht.', en: 'The bill is being brought.' },
      { de: 'Die Fenster werden jeden Morgen geöffnet.', en: 'The windows are opened every morning.' },
      { de: 'Der Laden ist geöffnet.', en: 'The shop is open. (Zustandspassiv - a state, not an action)' },
    ],
  },
};

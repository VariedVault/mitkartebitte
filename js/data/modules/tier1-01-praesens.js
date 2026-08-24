export default {
  id: 'tier1-01-praesens',
  tier: 1,
  order: 1,
  title: 'Präsens: Regular Verbs & Pronouns',
  level: 'A1',
  summary: 'The -e/-st/-t/-en/-t/-en pattern that most German verbs follow.',
  verbPool: (verbs) => verbs.filter((v) => v.type === 'weak' && !v.separable && !v.reflexive),
  tenses: ['praesens'],
  explanation: {
    intro:
      'Präsens (present tense) is how you talk about now, habits, and - very often in German - the near future too ("Ich komme morgen" = "I\'m coming tomorrow" is perfectly normal). Most German verbs are "weak" (regular): you take the infinitive, drop the -en, and add one of six endings depending on who\'s doing the action.\n\nThat\'s the whole system for a regular verb. No vowel changes, no surprises - just the ending changes.',
    rules: [
      {
        heading: 'The six endings',
        body: 'ich -e · du -st · er/sie/es -t · wir -en · ihr -t · sie/Sie -en. Notice wir and sie/Sie both just use the bare infinitive ending (-en) - that repetition is free, not something to memorize twice.',
      },
      {
        heading: 'Stems ending in -t, -d, or -n+consonant',
        body: 'A few verbs (arbeiten, warten, öffnen) would be unpronounceable with the raw ending - "er arbeitt" - so an -e- is inserted: er arbeitet, du wartest, du öffnest. You\'ll see this pattern again and again across every tense, so it\'s worth noticing now.',
      },
    ],
    tableDemo: { verb: 'lernen', tense: 'praesens' },
    examples: [
      { de: 'Ich lerne Deutsch.', en: 'I am learning German.' },
      { de: 'Du arbeitest viel.', en: 'You work a lot.' },
      { de: 'Wir wohnen in Berlin.', en: 'We live in Berlin.' },
    ],
  },
};

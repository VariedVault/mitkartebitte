// Shared verb-data pool. Every course module FILTERS this pool — none owns its own verbs.
// Hand-authored and verified: praesens, praeteritum (strong/mixed/irregular), partizip2,
// imperativ, and konjunktiv2 (only where a living synthetic form exists — see conjugate.js
// for why most verbs derive Konjunktiv II via würde + infinitive instead of a fabricated form).
//
// Pronoun key convention used everywhere in this app:
//   ich | du | er (covers er/sie/es — identical verb form) | wir | ihr | sie (covers sie/Sie)
// Imperativ only ever has three addressee forms: du | ihr | Sie.

export const PRONOUNS = ['ich', 'du', 'er', 'wir', 'ihr', 'sie'];

export const PRONOUN_LABELS = {
  ich: 'ich',
  du: 'du',
  er: 'er/sie/es',
  wir: 'wir',
  ihr: 'ihr',
  sie: 'sie/Sie',
};

// Consistent accent color per pronoun, used everywhere a pronoun appears (memory aid).
export const PRONOUN_COLORS = {
  ich: '#FF6B6B',
  du: '#4ECDC4',
  er: '#FFD166',
  wir: '#6C8EFF',
  ihr: '#C77DFF',
  sie: '#5FD98A',
};

export const REFLEXIVE_PRONOUNS = { ich: 'mich', du: 'dich', er: 'sich', wir: 'uns', ihr: 'euch', sie: 'sich' };

export const TYPE_COLORS = {
  weak: '#4ECDC4',
  strong: '#FF6B6B',
  mixed: '#FFD166',
  modal: '#6C8EFF',
  irregular: '#C77DFF',
};

function t(ich, du, er, wir, ihr, sie) {
  return { ich, du, er, wir, ihr, sie };
}

export const VERBS = [
  // ---------------------------------------------------------------- WEAK / haben (routine, transaction, communication)
  {
    infinitive: 'machen', english: 'to do, to make', type: 'weak', auxiliary: 'haben', level: 'A1',
    separable: false, reflexive: false, partizip2: 'gemacht',
    tables: {
      praesens: t('mache', 'machst', 'macht', 'machen', 'macht', 'machen'),
      praeteritum: t('machte', 'machtest', 'machte', 'machten', 'machtet', 'machten'),
      imperativ: { du: 'Mach!', ihr: 'Macht!', Sie: 'Machen Sie!' },
    },
    tags: ['routine'],
    example: { de: 'Ich mache das Frühstück.', en: 'I make breakfast.' },
  },
  {
    infinitive: 'sagen', english: 'to say', type: 'weak', auxiliary: 'haben', level: 'A1',
    separable: false, reflexive: false, partizip2: 'gesagt',
    tables: {
      praesens: t('sage', 'sagst', 'sagt', 'sagen', 'sagt', 'sagen'),
      praeteritum: t('sagte', 'sagtest', 'sagte', 'sagten', 'sagtet', 'sagten'),
      imperativ: { du: 'Sag!', ihr: 'Sagt!', Sie: 'Sagen Sie!' },
    },
    tags: ['communication'],
    example: { de: 'Was sagst du dazu?', en: 'What do you say to that?' },
  },
  {
    infinitive: 'fragen', english: 'to ask', type: 'weak', auxiliary: 'haben', level: 'A1',
    separable: false, reflexive: false, partizip2: 'gefragt',
    tables: {
      praesens: t('frage', 'fragst', 'fragt', 'fragen', 'fragt', 'fragen'),
      praeteritum: t('fragte', 'fragtest', 'fragte', 'fragten', 'fragtet', 'fragten'),
      imperativ: { du: 'Frag!', ihr: 'Fragt!', Sie: 'Fragen Sie!' },
    },
    tags: ['communication'],
    example: { de: 'Ich frage den Kellner.', en: 'I ask the waiter.' },
  },
  {
    infinitive: 'brauchen', english: 'to need', type: 'weak', auxiliary: 'haben', level: 'A1',
    separable: false, reflexive: false, partizip2: 'gebraucht',
    tables: {
      praesens: t('brauche', 'brauchst', 'braucht', 'brauchen', 'braucht', 'brauchen'),
      praeteritum: t('brauchte', 'brauchtest', 'brauchte', 'brauchten', 'brauchtet', 'brauchten'),
      imperativ: { du: 'Brauch!', ihr: 'Braucht!', Sie: 'Brauchen Sie!' },
    },
    tags: ['routine'],
    example: { de: 'Ich brauche mehr Zeit.', en: 'I need more time.' },
  },
  {
    infinitive: 'kaufen', english: 'to buy', type: 'weak', auxiliary: 'haben', level: 'A1',
    separable: false, reflexive: false, partizip2: 'gekauft',
    tables: {
      praesens: t('kaufe', 'kaufst', 'kauft', 'kaufen', 'kauft', 'kaufen'),
      praeteritum: t('kaufte', 'kauftest', 'kaufte', 'kauften', 'kauftet', 'kauften'),
      imperativ: { du: 'Kauf!', ihr: 'Kauft!', Sie: 'Kaufen Sie!' },
    },
    tags: ['transaction'],
    example: { de: 'Ich kaufe frisches Brot.', en: 'I buy fresh bread.' },
  },
  {
    infinitive: 'spielen', english: 'to play', type: 'weak', auxiliary: 'haben', level: 'A1',
    separable: false, reflexive: false, partizip2: 'gespielt',
    tables: {
      praesens: t('spiele', 'spielst', 'spielt', 'spielen', 'spielt', 'spielen'),
      praeteritum: t('spielte', 'spieltest', 'spielte', 'spielten', 'spieltet', 'spielten'),
      imperativ: { du: 'Spiel!', ihr: 'Spielt!', Sie: 'Spielen Sie!' },
    },
    tags: ['routine'],
    example: { de: 'Die Kinder spielen im Park.', en: 'The children are playing in the park.' },
  },
  {
    infinitive: 'wohnen', english: 'to live, to reside', type: 'weak', auxiliary: 'haben', level: 'A1',
    separable: false, reflexive: false, partizip2: 'gewohnt',
    tables: {
      praesens: t('wohne', 'wohnst', 'wohnt', 'wohnen', 'wohnt', 'wohnen'),
      praeteritum: t('wohnte', 'wohntest', 'wohnte', 'wohnten', 'wohntet', 'wohnten'),
      imperativ: { du: 'Wohn!', ihr: 'Wohnt!', Sie: 'Wohnen Sie!' },
    },
    tags: ['routine'],
    example: { de: 'Wir wohnen in Berlin.', en: 'We live in Berlin.' },
  },
  {
    infinitive: 'arbeiten', english: 'to work', type: 'weak', auxiliary: 'haben', level: 'A1',
    separable: false, reflexive: false, partizip2: 'gearbeitet',
    tables: {
      praesens: t('arbeite', 'arbeitest', 'arbeitet', 'arbeiten', 'arbeitet', 'arbeiten'),
      praeteritum: t('arbeitete', 'arbeitetest', 'arbeitete', 'arbeiteten', 'arbeitetet', 'arbeiteten'),
      imperativ: { du: 'Arbeite!', ihr: 'Arbeitet!', Sie: 'Arbeiten Sie!' },
    },
    tags: ['routine'],
    notes: 'Stem ends in -t, so praesens/praeteritum insert an -e- before consonant endings (du arbeitest, not arbeitst).',
    example: { de: 'Ich arbeite von zu Hause.', en: 'I work from home.' },
  },
  {
    infinitive: 'lernen', english: 'to learn', type: 'weak', auxiliary: 'haben', level: 'A1',
    separable: false, reflexive: false, partizip2: 'gelernt',
    tables: {
      praesens: t('lerne', 'lernst', 'lernt', 'lernen', 'lernt', 'lernen'),
      praeteritum: t('lernte', 'lerntest', 'lernte', 'lernten', 'lerntet', 'lernten'),
      imperativ: { du: 'Lern!', ihr: 'Lernt!', Sie: 'Lernen Sie!' },
    },
    tags: ['routine'],
    example: { de: 'Ich lerne Deutsch.', en: 'I am learning German.' },
  },
  {
    infinitive: 'hören', english: 'to hear, to listen', type: 'weak', auxiliary: 'haben', level: 'A1',
    separable: false, reflexive: false, partizip2: 'gehört',
    tables: {
      praesens: t('höre', 'hörst', 'hört', 'hören', 'hört', 'hören'),
      praeteritum: t('hörte', 'hörtest', 'hörte', 'hörten', 'hörtet', 'hörten'),
      imperativ: { du: 'Hör!', ihr: 'Hört!', Sie: 'Hören Sie!' },
    },
    tags: ['routine'],
    example: { de: 'Ich höre gern Musik.', en: 'I like listening to music.' },
  },
  {
    infinitive: 'suchen', english: 'to look for, to search', type: 'weak', auxiliary: 'haben', level: 'A1',
    separable: false, reflexive: false, partizip2: 'gesucht',
    tables: {
      praesens: t('suche', 'suchst', 'sucht', 'suchen', 'sucht', 'suchen'),
      praeteritum: t('suchte', 'suchtest', 'suchte', 'suchten', 'suchtet', 'suchten'),
      imperativ: { du: 'Such!', ihr: 'Sucht!', Sie: 'Suchen Sie!' },
    },
    tags: ['routine'],
    example: { de: 'Ich suche den Bahnhof.', en: 'I am looking for the train station.' },
  },
  {
    infinitive: 'bezahlen', english: 'to pay', type: 'weak', auxiliary: 'haben', level: 'A1',
    separable: false, reflexive: false, partizip2: 'bezahlt',
    tables: {
      praesens: t('bezahle', 'bezahlst', 'bezahlt', 'bezahlen', 'bezahlt', 'bezahlen'),
      praeteritum: t('bezahlte', 'bezahltest', 'bezahlte', 'bezahlten', 'bezahltet', 'bezahlten'),
      imperativ: { du: 'Bezahl!', ihr: 'Bezahlt!', Sie: 'Bezahlen Sie!' },
    },
    tags: ['transaction'],
    notes: 'be- is an inseparable, unstressed prefix, so the partizip2 takes no ge-: bezahlt, not gebezahlt.',
    example: { de: 'Ich bezahle mit Karte, bitte.', en: "I'll pay by card, please." },
  },
  {
    infinitive: 'kosten', english: 'to cost', type: 'weak', auxiliary: 'haben', level: 'A1',
    separable: false, reflexive: false, partizip2: 'gekostet',
    tables: {
      praesens: t('koste', 'kostest', 'kostet', 'kosten', 'kostet', 'kosten'),
      praeteritum: t('kostete', 'kostetest', 'kostete', 'kosteten', 'kostetet', 'kosteten'),
      imperativ: { du: 'Koste!', ihr: 'Kostet!', Sie: 'Kosten Sie!' },
    },
    tags: ['transaction'],
    example: { de: 'Was kostet das?', en: 'How much does that cost?' },
  },
  {
    infinitive: 'öffnen', english: 'to open', type: 'weak', auxiliary: 'haben', level: 'A2',
    separable: false, reflexive: false, partizip2: 'geöffnet',
    tables: {
      praesens: t('öffne', 'öffnest', 'öffnet', 'öffnen', 'öffnet', 'öffnen'),
      praeteritum: t('öffnete', 'öffnetest', 'öffnete', 'öffneten', 'öffnetet', 'öffneten'),
      imperativ: { du: 'Öffne!', ihr: 'Öffnet!', Sie: 'Öffnen Sie!' },
    },
    tags: ['routine'],
    notes: 'Stem ends in -n after a consonant, so an -e- is inserted (du öffnest), same pattern as regnen, atmen.',
    example: { de: 'Ich öffne das Fenster.', en: 'I open the window.' },
  },
  {
    infinitive: 'warten', english: 'to wait', type: 'weak', auxiliary: 'haben', level: 'A1',
    separable: false, reflexive: false, partizip2: 'gewartet',
    tables: {
      praesens: t('warte', 'wartest', 'wartet', 'warten', 'wartet', 'warten'),
      praeteritum: t('wartete', 'wartetest', 'wartete', 'warteten', 'wartetet', 'warteten'),
      imperativ: { du: 'Warte!', ihr: 'Wartet!', Sie: 'Warten Sie!' },
    },
    tags: ['routine'],
    example: { de: 'Ich warte auf den Bus.', en: 'I am waiting for the bus.' },
  },
  {
    infinitive: 'reisen', english: 'to travel', type: 'weak', auxiliary: 'sein', level: 'A2',
    separable: false, reflexive: false, partizip2: 'gereist',
    tables: {
      praesens: t('reise', 'reist', 'reist', 'reisen', 'reist', 'reisen'),
      praeteritum: t('reiste', 'reistest', 'reiste', 'reisten', 'reistet', 'reisten'),
      imperativ: { du: 'Reise!', ihr: 'Reist!', Sie: 'Reisen Sie!' },
    },
    tags: ['movement'],
    notes: 'A weak verb that still takes sein — it describes a change of location, not just an action.',
    example: { de: 'Wir sind nach Italien gereist.', en: 'We traveled to Italy.' },
  },
  {
    infinitive: 'passieren', english: 'to happen', type: 'weak', auxiliary: 'sein', level: 'A2',
    separable: false, reflexive: false, partizip2: 'passiert',
    tables: {
      praesens: t('passiere', 'passierst', 'passiert', 'passieren', 'passiert', 'passieren'),
      praeteritum: t('passierte', 'passiertest', 'passierte', 'passierten', 'passiertet', 'passierten'),
      imperativ: { du: 'Passier!', ihr: 'Passiert!', Sie: 'Passieren Sie!' },
    },
    tags: ['thinking'],
    notes: '-ieren verbs never take ge- in the partizip2.',
    example: { de: 'Was ist passiert?', en: 'What happened?' },
  },

  // ---------------------------------------------------------------- STRONG a → ä
  {
    infinitive: 'fahren', english: 'to drive, to go (by vehicle)', type: 'strong', auxiliary: 'sein', level: 'A1',
    separable: false, reflexive: false, partizip2: 'gefahren',
    tables: {
      praesens: t('fahre', 'fährst', 'fährt', 'fahren', 'fahrt', 'fahren'),
      praeteritum: t('fuhr', 'fuhrst', 'fuhr', 'fuhren', 'fuhrt', 'fuhren'),
      imperativ: { du: 'Fahr!', ihr: 'Fahrt!', Sie: 'Fahren Sie!' },
    },
    tags: ['movement', 'ablaut-a-ä'],
    notes: 'a→ä stem change only in du/er praesens. The imperative does NOT carry the umlaut: Fahr!, not Fähr!.',
    example: { de: 'Ich fahre mit dem Bus zur Arbeit.', en: 'I go to work by bus.' },
  },
  {
    infinitive: 'tragen', english: 'to carry, to wear', type: 'strong', auxiliary: 'haben', level: 'A2',
    separable: false, reflexive: false, partizip2: 'getragen',
    tables: {
      praesens: t('trage', 'trägst', 'trägt', 'tragen', 'tragt', 'tragen'),
      praeteritum: t('trug', 'trugst', 'trug', 'trugen', 'trugt', 'trugen'),
      imperativ: { du: 'Trag!', ihr: 'Tragt!', Sie: 'Tragen Sie!' },
    },
    tags: ['routine', 'ablaut-a-ä'],
    example: { de: 'Sie trägt eine rote Jacke.', en: 'She is wearing a red jacket.' },
  },
  {
    infinitive: 'halten', english: 'to hold, to stop', type: 'strong', auxiliary: 'haben', level: 'A2',
    separable: false, reflexive: false, partizip2: 'gehalten',
    tables: {
      praesens: t('halte', 'hältst', 'hält', 'halten', 'haltet', 'halten'),
      praeteritum: t('hielt', 'hieltest', 'hielt', 'hielten', 'hieltet', 'hielten'),
      imperativ: { du: 'Halt!', ihr: 'Haltet!', Sie: 'Halten Sie!' },
    },
    tags: ['routine', 'ablaut-a-ä'],
    notes: 'Praeteritum stem "hielt" ends in -t, so du/ihr insert -e- (hieltest, hieltet).',
    example: { de: 'Der Bus hält hier.', en: 'The bus stops here.' },
  },
  {
    infinitive: 'schlafen', english: 'to sleep', type: 'strong', auxiliary: 'haben', level: 'A1',
    separable: false, reflexive: false, partizip2: 'geschlafen',
    tables: {
      praesens: t('schlafe', 'schläfst', 'schläft', 'schlafen', 'schlaft', 'schlafen'),
      praeteritum: t('schlief', 'schliefst', 'schlief', 'schliefen', 'schlieft', 'schliefen'),
      imperativ: { du: 'Schlaf!', ihr: 'Schlaft!', Sie: 'Schlafen Sie!' },
    },
    tags: ['routine', 'ablaut-a-ä'],
    example: { de: 'Ich schlafe acht Stunden.', en: 'I sleep eight hours.' },
  },

  // ---------------------------------------------------------------- STRONG e → i
  {
    infinitive: 'sprechen', english: 'to speak', type: 'strong', auxiliary: 'haben', level: 'A1',
    separable: false, reflexive: false, partizip2: 'gesprochen',
    tables: {
      praesens: t('spreche', 'sprichst', 'spricht', 'sprechen', 'sprecht', 'sprechen'),
      praeteritum: t('sprach', 'sprachst', 'sprach', 'sprachen', 'spracht', 'sprachen'),
      imperativ: { du: 'Sprich!', ihr: 'Sprecht!', Sie: 'Sprechen Sie!' },
    },
    tags: ['communication', 'ablaut-e-i'],
    example: { de: 'Ich spreche ein bisschen Deutsch.', en: 'I speak a little German.' },
  },
  {
    infinitive: 'essen', english: 'to eat', type: 'strong', auxiliary: 'haben', level: 'A1',
    separable: false, reflexive: false, partizip2: 'gegessen',
    tables: {
      praesens: t('esse', 'isst', 'isst', 'essen', 'esst', 'essen'),
      praeteritum: t('aß', 'aßt', 'aß', 'aßen', 'aßt', 'aßen'),
      imperativ: { du: 'Iss!', ihr: 'Esst!', Sie: 'Essen Sie!' },
    },
    tags: ['routine', 'ablaut-e-i'],
    notes: 'Stem ends in a sibilant (ß), so du/ihr praeteritum use a single -t with no linking -e-: du aßt.',
    example: { de: 'Wir essen um sieben Uhr.', en: 'We eat at seven o’clock.' },
  },
  {
    infinitive: 'geben', english: 'to give', type: 'strong', auxiliary: 'haben', level: 'A1',
    separable: false, reflexive: false, partizip2: 'gegeben',
    tables: {
      praesens: t('gebe', 'gibst', 'gibt', 'geben', 'gebt', 'geben'),
      praeteritum: t('gab', 'gabst', 'gab', 'gaben', 'gabt', 'gaben'),
      imperativ: { du: 'Gib!', ihr: 'Gebt!', Sie: 'Geben Sie!' },
    },
    tags: ['transaction', 'ablaut-e-i'],
    example: { de: 'Ich gebe dir die Speisekarte.', en: 'I’ll give you the menu.' },
  },
  {
    infinitive: 'nehmen', english: 'to take', type: 'strong', auxiliary: 'haben', level: 'A1',
    separable: false, reflexive: false, partizip2: 'genommen',
    tables: {
      praesens: t('nehme', 'nimmst', 'nimmt', 'nehmen', 'nehmt', 'nehmen'),
      praeteritum: t('nahm', 'nahmst', 'nahm', 'nahmen', 'nahmt', 'nahmen'),
      imperativ: { du: 'Nimm!', ihr: 'Nehmt!', Sie: 'Nehmen Sie!' },
    },
    tags: ['transaction', 'ablaut-e-i'],
    notes: 'The stem consonant also changes (hm→mm) in du/er praesens and the imperative: nimmst, nimmt, Nimm!.',
    example: { de: 'Ich nehme den Bus.', en: 'I’ll take the bus.' },
  },
  {
    infinitive: 'helfen', english: 'to help', type: 'strong', auxiliary: 'haben', level: 'A1',
    separable: false, reflexive: false, partizip2: 'geholfen',
    tables: {
      praesens: t('helfe', 'hilfst', 'hilft', 'helfen', 'helft', 'helfen'),
      praeteritum: t('half', 'halfst', 'half', 'halfen', 'halft', 'halfen'),
      imperativ: { du: 'Hilf!', ihr: 'Helft!', Sie: 'Helfen Sie!' },
    },
    tags: ['routine', 'ablaut-e-i'],
    example: { de: 'Kannst du mir helfen?', en: 'Can you help me?' },
  },

  // ---------------------------------------------------------------- STRONG e → ie
  {
    infinitive: 'sehen', english: 'to see', type: 'strong', auxiliary: 'haben', level: 'A1',
    separable: false, reflexive: false, partizip2: 'gesehen',
    tables: {
      praesens: t('sehe', 'siehst', 'sieht', 'sehen', 'seht', 'sehen'),
      praeteritum: t('sah', 'sahst', 'sah', 'sahen', 'saht', 'sahen'),
      imperativ: { du: 'Sieh!', ihr: 'Seht!', Sie: 'Sehen Sie!' },
    },
    tags: ['thinking', 'ablaut-e-ie'],
    example: { de: 'Ich sehe den Zug.', en: 'I see the train.' },
  },
  {
    infinitive: 'lesen', english: 'to read', type: 'strong', auxiliary: 'haben', level: 'A1',
    separable: false, reflexive: false, partizip2: 'gelesen',
    tables: {
      praesens: t('lese', 'liest', 'liest', 'lesen', 'lest', 'lesen'),
      praeteritum: t('las', 'last', 'las', 'lasen', 'last', 'lasen'),
      imperativ: { du: 'Lies!', ihr: 'Lest!', Sie: 'Lesen Sie!' },
    },
    tags: ['routine', 'ablaut-e-ie'],
    notes: 'Stem ends in -s, so du/ihr praeteritum contract to a single -t: du last, ihr last (not lasest).',
    example: { de: 'Ich lese die Zeitung.', en: 'I read the newspaper.' },
  },
  {
    infinitive: 'empfehlen', english: 'to recommend', type: 'strong', auxiliary: 'haben', level: 'B1',
    separable: false, reflexive: false, partizip2: 'empfohlen',
    tables: {
      praesens: t('empfehle', 'empfiehlst', 'empfiehlt', 'empfehlen', 'empfehlt', 'empfehlen'),
      praeteritum: t('empfahl', 'empfahlst', 'empfahl', 'empfahlen', 'empfahlt', 'empfahlen'),
      imperativ: { du: 'Empfiehl!', ihr: 'Empfehlt!', Sie: 'Empfehlen Sie!' },
    },
    tags: ['communication', 'ablaut-e-ie'],
    notes: 'emp- behaves as an inseparable prefix, so no ge- — and the partizip2 vowel shifts again to o: empfohlen.',
    example: { de: 'Was empfehlen Sie?', en: 'What do you recommend?' },
  },

  // ---------------------------------------------------------------- STRONG ei → ie → ie
  {
    infinitive: 'bleiben', english: 'to stay', type: 'strong', auxiliary: 'sein', level: 'A1',
    separable: false, reflexive: false, partizip2: 'geblieben',
    tables: {
      praesens: t('bleibe', 'bleibst', 'bleibt', 'bleiben', 'bleibt', 'bleiben'),
      praeteritum: t('blieb', 'bliebst', 'blieb', 'blieben', 'bliebt', 'blieben'),
      imperativ: { du: 'Bleib!', ihr: 'Bleibt!', Sie: 'Bleiben Sie!' },
    },
    tags: ['movement', 'ablaut-ei-ie-ie'],
    example: { de: 'Ich bleibe zu Hause.', en: 'I am staying home.' },
  },
  {
    infinitive: 'schreiben', english: 'to write', type: 'strong', auxiliary: 'haben', level: 'A1',
    separable: false, reflexive: false, partizip2: 'geschrieben',
    tables: {
      praesens: t('schreibe', 'schreibst', 'schreibt', 'schreiben', 'schreibt', 'schreiben'),
      praeteritum: t('schrieb', 'schriebst', 'schrieb', 'schrieben', 'schriebt', 'schrieben'),
      imperativ: { du: 'Schreib!', ihr: 'Schreibt!', Sie: 'Schreiben Sie!' },
    },
    tags: ['communication', 'ablaut-ei-ie-ie'],
    example: { de: 'Ich schreibe eine E-Mail.', en: 'I am writing an email.' },
  },
  {
    infinitive: 'steigen', english: 'to climb, to board, to rise', type: 'strong', auxiliary: 'sein', level: 'A2',
    separable: false, reflexive: false, partizip2: 'gestiegen',
    tables: {
      praesens: t('steige', 'steigst', 'steigt', 'steigen', 'steigt', 'steigen'),
      praeteritum: t('stieg', 'stiegst', 'stieg', 'stiegen', 'stiegt', 'stiegen'),
      imperativ: { du: 'Steig!', ihr: 'Steigt!', Sie: 'Steigen Sie!' },
    },
    tags: ['movement', 'ablaut-ei-ie-ie'],
    example: { de: 'Ich steige in den Zug.', en: 'I am boarding the train.' },
  },

  // ---------------------------------------------------------------- STRONG i → a → u
  {
    infinitive: 'singen', english: 'to sing', type: 'strong', auxiliary: 'haben', level: 'A2',
    separable: false, reflexive: false, partizip2: 'gesungen',
    tables: {
      praesens: t('singe', 'singst', 'singt', 'singen', 'singt', 'singen'),
      praeteritum: t('sang', 'sangst', 'sang', 'sangen', 'sangt', 'sangen'),
      imperativ: { du: 'Sing!', ihr: 'Singt!', Sie: 'Singen Sie!' },
    },
    tags: ['routine', 'ablaut-i-a-u'],
    example: { de: 'Sie singt sehr gut.', en: 'She sings very well.' },
  },
  {
    infinitive: 'trinken', english: 'to drink', type: 'strong', auxiliary: 'haben', level: 'A1',
    separable: false, reflexive: false, partizip2: 'getrunken',
    tables: {
      praesens: t('trinke', 'trinkst', 'trinkt', 'trinken', 'trinkt', 'trinken'),
      praeteritum: t('trank', 'trankst', 'trank', 'tranken', 'trankt', 'tranken'),
      imperativ: { du: 'Trink!', ihr: 'Trinkt!', Sie: 'Trinken Sie!' },
    },
    tags: ['routine', 'ablaut-i-a-u'],
    example: { de: 'Ich trinke einen Kaffee.', en: 'I am drinking a coffee.' },
  },
  {
    infinitive: 'finden', english: 'to find', type: 'strong', auxiliary: 'haben', level: 'A1',
    separable: false, reflexive: false, partizip2: 'gefunden',
    tables: {
      praesens: t('finde', 'findest', 'findet', 'finden', 'findet', 'finden'),
      praeteritum: t('fand', 'fandest', 'fand', 'fanden', 'fandet', 'fanden'),
      imperativ: { du: 'Find!', ihr: 'Findet!', Sie: 'Finden Sie!' },
    },
    tags: ['thinking', 'ablaut-i-a-u'],
    notes: 'Praeteritum stem "fand" ends in -d, so du/ihr insert -e- (fandest, fandet).',
    example: { de: 'Ich finde die Adresse nicht.', en: "I can't find the address." },
  },
  {
    infinitive: 'beginnen', english: 'to begin', type: 'strong', auxiliary: 'haben', level: 'A2',
    separable: false, reflexive: false, partizip2: 'begonnen',
    tables: {
      praesens: t('beginne', 'beginnst', 'beginnt', 'beginnen', 'beginnt', 'beginnen'),
      praeteritum: t('begann', 'begannst', 'begann', 'begannen', 'begannt', 'begannen'),
      imperativ: { du: 'Beginn!', ihr: 'Beginnt!', Sie: 'Beginnen Sie!' },
    },
    tags: ['routine', 'ablaut-i-a-u'],
    notes: 'be- is inseparable, so no ge- in the partizip2.',
    example: { de: 'Der Film beginnt um acht.', en: 'The film starts at eight.' },
  },

  // ---------------------------------------------------------------- STRONG — other high-frequency movement/misc
  {
    infinitive: 'gehen', english: 'to go, to walk', type: 'strong', auxiliary: 'sein', level: 'A1',
    separable: false, reflexive: false, partizip2: 'gegangen',
    tables: {
      praesens: t('gehe', 'gehst', 'geht', 'gehen', 'geht', 'gehen'),
      praeteritum: t('ging', 'gingst', 'ging', 'gingen', 'gingt', 'gingen'),
      imperativ: { du: 'Geh!', ihr: 'Geht!', Sie: 'Gehen Sie!' },
    },
    tags: ['movement'],
    example: { de: 'Ich gehe jetzt nach Hause.', en: 'I am going home now.' },
  },
  {
    infinitive: 'kommen', english: 'to come', type: 'strong', auxiliary: 'sein', level: 'A1',
    separable: false, reflexive: false, partizip2: 'gekommen',
    tables: {
      praesens: t('komme', 'kommst', 'kommt', 'kommen', 'kommt', 'kommen'),
      praeteritum: t('kam', 'kamst', 'kam', 'kamen', 'kamt', 'kamen'),
      imperativ: { du: 'Komm!', ihr: 'Kommt!', Sie: 'Kommen Sie!' },
    },
    tags: ['movement'],
    konjunktiv2: t('käme', 'kämst', 'käme', 'kämen', 'kämt', 'kämen'),
    example: { de: 'Ich komme sofort.', en: "I'm coming right away." },
  },
  {
    infinitive: 'fliegen', english: 'to fly', type: 'strong', auxiliary: 'sein', level: 'A2',
    separable: false, reflexive: false, partizip2: 'geflogen',
    tables: {
      praesens: t('fliege', 'fliegst', 'fliegt', 'fliegen', 'fliegt', 'fliegen'),
      praeteritum: t('flog', 'flogst', 'flog', 'flogen', 'flogt', 'flogen'),
      imperativ: { du: 'Flieg!', ihr: 'Fliegt!', Sie: 'Fliegen Sie!' },
    },
    tags: ['movement'],
    example: { de: 'Wir fliegen nach Berlin.', en: 'We are flying to Berlin.' },
  },
  {
    infinitive: 'laufen', english: 'to run, to walk', type: 'strong', auxiliary: 'sein', level: 'A2',
    separable: false, reflexive: false, partizip2: 'gelaufen',
    tables: {
      praesens: t('laufe', 'läufst', 'läuft', 'laufen', 'lauft', 'laufen'),
      praeteritum: t('lief', 'liefst', 'lief', 'liefen', 'lieft', 'liefen'),
      imperativ: { du: 'Lauf!', ihr: 'Lauft!', Sie: 'Laufen Sie!' },
    },
    tags: ['movement'],
    notes: 'au→äu stem change in du/er praesens. Like a→ä, this does NOT carry into the imperative: Lauf!, not Läuf!.',
    example: { de: 'Ich laufe jeden Morgen.', en: 'I run every morning.' },
  },
  {
    infinitive: 'sitzen', english: 'to sit', type: 'strong', auxiliary: 'haben', level: 'A2',
    separable: false, reflexive: false, partizip2: 'gesessen',
    tables: {
      praesens: t('sitze', 'sitzt', 'sitzt', 'sitzen', 'sitzt', 'sitzen'),
      praeteritum: t('saß', 'saßt', 'saß', 'saßen', 'saßt', 'saßen'),
      imperativ: { du: 'Sitz!', ihr: 'Sitzt!', Sie: 'Sitzen Sie!' },
    },
    tags: ['routine'],
    notes: 'Praesens has no vowel change, but praeteritum/partizip2 are strong: saß / gesessen.',
    example: { de: 'Ich sitze am Fenster.', en: 'I am sitting by the window.' },
  },
  {
    infinitive: 'verstehen', english: 'to understand', type: 'strong', auxiliary: 'haben', level: 'A2',
    separable: false, reflexive: false, partizip2: 'verstanden',
    tables: {
      praesens: t('verstehe', 'verstehst', 'versteht', 'verstehen', 'versteht', 'verstehen'),
      praeteritum: t('verstand', 'verstandest', 'verstand', 'verstanden', 'verstandet', 'verstanden'),
      imperativ: { du: 'Versteh!', ihr: 'Versteht!', Sie: 'Verstehen Sie!' },
    },
    tags: ['communication'],
    notes: 'ver- is inseparable: no ge- in the partizip2.',
    example: { de: 'Ich verstehe das nicht.', en: "I don't understand that." },
  },
  {
    infinitive: 'sterben', english: 'to die', type: 'strong', auxiliary: 'sein', level: 'B1',
    separable: false, reflexive: false, partizip2: 'gestorben',
    tables: {
      praesens: t('sterbe', 'stirbst', 'stirbt', 'sterben', 'sterbt', 'sterben'),
      praeteritum: t('starb', 'starbst', 'starb', 'starben', 'starbt', 'starben'),
      imperativ: { du: 'Stirb!', ihr: 'Sterbt!', Sie: 'Sterben Sie!' },
    },
    tags: ['thinking', 'ablaut-e-i'],
    example: { de: 'Die Pflanze stirbt ohne Wasser.', en: 'The plant dies without water.' },
  },

  // ---------------------------------------------------------------- IRREGULAR (preterite-present)
  {
    infinitive: 'wissen', english: 'to know (a fact)', type: 'irregular', auxiliary: 'haben', level: 'A2',
    separable: false, reflexive: false, partizip2: 'gewusst',
    tables: {
      praesens: t('weiß', 'weißt', 'weiß', 'wissen', 'wisst', 'wissen'),
      praeteritum: t('wusste', 'wusstest', 'wusste', 'wussten', 'wusstet', 'wussten'),
      imperativ: { du: 'Wisse!', ihr: 'Wisst!', Sie: 'Wissen Sie!' },
    },
    konjunktiv2: t('wüsste', 'wüsstest', 'wüsste', 'wüssten', 'wüsstet', 'wüssten'),
    tags: ['thinking'],
    notes: 'Praesens ich/er share one irregular form (weiß) with no ending — same family as the modal verbs.',
    example: { de: 'Ich weiß es nicht.', en: "I don't know." },
  },

  // ---------------------------------------------------------------- sein / haben / werden
  {
    infinitive: 'sein', english: 'to be', type: 'irregular', auxiliary: 'sein', level: 'A1',
    separable: false, reflexive: false, partizip2: 'gewesen',
    tables: {
      praesens: t('bin', 'bist', 'ist', 'sind', 'seid', 'sind'),
      praeteritum: t('war', 'warst', 'war', 'waren', 'wart', 'waren'),
      imperativ: { du: 'Sei!', ihr: 'Seid!', Sie: 'Seien Sie!' },
    },
    konjunktiv2: t('wäre', 'wärst', 'wäre', 'wären', 'wärt', 'wären'),
    tags: ['core'],
    example: { de: 'Ich bin müde.', en: 'I am tired.' },
  },
  {
    infinitive: 'haben', english: 'to have', type: 'irregular', auxiliary: 'haben', level: 'A1',
    separable: false, reflexive: false, partizip2: 'gehabt',
    tables: {
      praesens: t('habe', 'hast', 'hat', 'haben', 'habt', 'haben'),
      praeteritum: t('hatte', 'hattest', 'hatte', 'hatten', 'hattet', 'hatten'),
      imperativ: { du: 'Hab!', ihr: 'Habt!', Sie: 'Haben Sie!' },
    },
    konjunktiv2: t('hätte', 'hättest', 'hätte', 'hätten', 'hättet', 'hätten'),
    tags: ['core'],
    example: { de: 'Ich habe Hunger.', en: 'I am hungry.' },
  },
  {
    infinitive: 'werden', english: 'to become', type: 'irregular', auxiliary: 'sein', level: 'A1',
    separable: false, reflexive: false, partizip2: 'geworden',
    partizip2Passive: 'worden',
    tables: {
      praesens: t('werde', 'wirst', 'wird', 'werden', 'werdet', 'werden'),
      praeteritum: t('wurde', 'wurdest', 'wurde', 'wurden', 'wurdet', 'wurden'),
      imperativ: { du: 'Werde!', ihr: 'Werdet!', Sie: 'Werden Sie!' },
    },
    konjunktiv2: t('würde', 'würdest', 'würde', 'würden', 'würdet', 'würden'),
    tags: ['core'],
    notes: 'As a full verb "to become" the partizip2 is geworden. As the Passiv auxiliary it drops to worden (no ge-).',
    example: { de: 'Es wird kalt.', en: "It's getting cold." },
  },

  // ---------------------------------------------------------------- MODALS (6) + möchten
  {
    infinitive: 'können', english: 'can, to be able to', type: 'modal', auxiliary: 'haben', level: 'A1',
    separable: false, reflexive: false, partizip2: 'gekonnt',
    tables: {
      praesens: t('kann', 'kannst', 'kann', 'können', 'könnt', 'können'),
      praeteritum: t('konnte', 'konntest', 'konnte', 'konnten', 'konntet', 'konnten'),
      imperativ: null,
    },
    konjunktiv2: t('könnte', 'könntest', 'könnte', 'könnten', 'könntet', 'könnten'),
    tags: ['modal'],
    example: { de: 'Ich kann gut kochen.', en: 'I can cook well.' },
  },
  {
    infinitive: 'müssen', english: 'must, to have to', type: 'modal', auxiliary: 'haben', level: 'A1',
    separable: false, reflexive: false, partizip2: 'gemusst',
    tables: {
      praesens: t('muss', 'musst', 'muss', 'müssen', 'müsst', 'müssen'),
      praeteritum: t('musste', 'musstest', 'musste', 'mussten', 'musstet', 'mussten'),
      imperativ: null,
    },
    konjunktiv2: t('müsste', 'müsstest', 'müsste', 'müssten', 'müsstet', 'müssten'),
    tags: ['modal'],
    example: { de: 'Ich muss jetzt gehen.', en: 'I have to go now.' },
  },
  {
    infinitive: 'dürfen', english: 'may, to be allowed to', type: 'modal', auxiliary: 'haben', level: 'A1',
    separable: false, reflexive: false, partizip2: 'gedurft',
    tables: {
      praesens: t('darf', 'darfst', 'darf', 'dürfen', 'dürft', 'dürfen'),
      praeteritum: t('durfte', 'durftest', 'durfte', 'durften', 'durftet', 'durften'),
      imperativ: null,
    },
    konjunktiv2: t('dürfte', 'dürftest', 'dürfte', 'dürften', 'dürftet', 'dürften'),
    tags: ['modal'],
    example: { de: 'Darf ich hier rauchen?', en: 'May I smoke here?' },
  },
  {
    infinitive: 'sollen', english: 'should, to be supposed to', type: 'modal', auxiliary: 'haben', level: 'A1',
    separable: false, reflexive: false, partizip2: 'gesollt',
    tables: {
      praesens: t('soll', 'sollst', 'soll', 'sollen', 'sollt', 'sollen'),
      praeteritum: t('sollte', 'solltest', 'sollte', 'sollten', 'solltet', 'sollten'),
      imperativ: null,
    },
    konjunktiv2: t('sollte', 'solltest', 'sollte', 'sollten', 'solltet', 'sollten'),
    tags: ['modal'],
    notes: 'sollen has no umlaut to shift, so its Konjunktiv II is identical to the praeteritum.',
    example: { de: 'Ich soll um acht da sein.', en: "I'm supposed to be there at eight." },
  },
  {
    infinitive: 'wollen', english: 'to want to', type: 'modal', auxiliary: 'haben', level: 'A1',
    separable: false, reflexive: false, partizip2: 'gewollt',
    tables: {
      praesens: t('will', 'willst', 'will', 'wollen', 'wollt', 'wollen'),
      praeteritum: t('wollte', 'wolltest', 'wollte', 'wollten', 'wolltet', 'wollten'),
      imperativ: null,
    },
    konjunktiv2: t('wollte', 'wolltest', 'wollte', 'wollten', 'wolltet', 'wollten'),
    tags: ['modal'],
    notes: 'Like sollen, wollen has no umlaut, so its Konjunktiv II matches the praeteritum.',
    example: { de: 'Ich will das nicht.', en: "I don't want that." },
  },
  {
    infinitive: 'mögen', english: 'to like', type: 'modal', auxiliary: 'haben', level: 'A1',
    separable: false, reflexive: false, partizip2: 'gemocht',
    tables: {
      praesens: t('mag', 'magst', 'mag', 'mögen', 'mögt', 'mögen'),
      praeteritum: t('mochte', 'mochtest', 'mochte', 'mochten', 'mochtet', 'mochten'),
      imperativ: null,
    },
    konjunktiv2: t('möchte', 'möchtest', 'möchte', 'möchten', 'möchtet', 'möchten'),
    tags: ['modal'],
    notes: 'mögen’s own Konjunktiv II form is möchte — which is exactly the polite "would like" verb below.',
    example: { de: 'Ich mag Kaffee.', en: 'I like coffee.' },
  },
  {
    infinitive: 'möchten', english: 'would like (polite)', type: 'modal', auxiliary: 'haben', level: 'A1',
    separable: false, reflexive: false, partizip2: null,
    tables: {
      praesens: t('möchte', 'möchtest', 'möchte', 'möchten', 'möchtet', 'möchten'),
      praeteritum: null,
      imperativ: null,
    },
    tags: ['modal', 'polite'],
    notes: 'Not a separate verb — this is mögen’s Konjunktiv II, lexicalized as the everyday polite present tense. To talk about the past, use wollte or mochte instead.',
    example: { de: 'Ich möchte einen Kaffee, bitte.', en: "I'd like a coffee, please." },
  },

  // ---------------------------------------------------------------- MIXED (weak endings, changed stem)
  {
    infinitive: 'denken', english: 'to think', type: 'mixed', auxiliary: 'haben', level: 'A2',
    separable: false, reflexive: false, partizip2: 'gedacht',
    tables: {
      praesens: t('denke', 'denkst', 'denkt', 'denken', 'denkt', 'denken'),
      praeteritum: t('dachte', 'dachtest', 'dachte', 'dachten', 'dachtet', 'dachten'),
      imperativ: { du: 'Denk!', ihr: 'Denkt!', Sie: 'Denken Sie!' },
    },
    konjunktiv2: t('dächte', 'dächtest', 'dächte', 'dächten', 'dächtet', 'dächten'),
    tags: ['thinking'],
    example: { de: 'Ich denke oft an dich.', en: 'I think of you often.' },
  },
  {
    infinitive: 'bringen', english: 'to bring', type: 'mixed', auxiliary: 'haben', level: 'A2',
    separable: false, reflexive: false, partizip2: 'gebracht',
    tables: {
      praesens: t('bringe', 'bringst', 'bringt', 'bringen', 'bringt', 'bringen'),
      praeteritum: t('brachte', 'brachtest', 'brachte', 'brachten', 'brachtet', 'brachten'),
      imperativ: { du: 'Bring!', ihr: 'Bringt!', Sie: 'Bringen Sie!' },
    },
    tags: ['transaction'],
    example: { de: 'Können Sie mir die Rechnung bringen?', en: 'Can you bring me the bill?' },
  },
  {
    infinitive: 'kennen', english: 'to know (be familiar with)', type: 'mixed', auxiliary: 'haben', level: 'A2',
    separable: false, reflexive: false, partizip2: 'gekannt',
    tables: {
      praesens: t('kenne', 'kennst', 'kennt', 'kennen', 'kennt', 'kennen'),
      praeteritum: t('kannte', 'kanntest', 'kannte', 'kannten', 'kanntet', 'kannten'),
      imperativ: { du: 'Kenn!', ihr: 'Kennt!', Sie: 'Kennen Sie!' },
    },
    tags: ['thinking'],
    example: { de: 'Ich kenne diese Straße.', en: 'I know this street.' },
  },
  {
    infinitive: 'nennen', english: 'to name, to call', type: 'mixed', auxiliary: 'haben', level: 'B1',
    separable: false, reflexive: false, partizip2: 'genannt',
    tables: {
      praesens: t('nenne', 'nennst', 'nennt', 'nennen', 'nennt', 'nennen'),
      praeteritum: t('nannte', 'nanntest', 'nannte', 'nannten', 'nanntet', 'nannten'),
      imperativ: { du: 'Nenn!', ihr: 'Nennt!', Sie: 'Nennen Sie!' },
    },
    tags: ['communication'],
    example: { de: 'Man nennt ihn den Kapitän.', en: 'They call him the captain.' },
  },

  // ---------------------------------------------------------------- SEPARABLE-PREFIX
  {
    infinitive: 'aufstehen', english: 'to get up', type: 'strong', auxiliary: 'sein', level: 'A1',
    separable: true, prefix: 'auf', reflexive: false, partizip2: 'aufgestanden',
    tables: {
      praesens: t('stehe', 'stehst', 'steht', 'stehen', 'steht', 'stehen'),
      praeteritum: t('stand', 'standest', 'stand', 'standen', 'standet', 'standen'),
      imperativ: { du: 'Steh auf!', ihr: 'Steht auf!', Sie: 'Stehen Sie auf!' },
    },
    tags: ['routine'],
    notes: 'Base verb stehen, separable prefix auf-. In a main clause the prefix moves to the end: Ich stehe um 7 Uhr auf.',
    example: { de: 'Ich stehe um sieben Uhr auf.', en: 'I get up at seven o’clock.' },
  },
  {
    infinitive: 'anrufen', english: 'to call (on the phone)', type: 'strong', auxiliary: 'haben', level: 'A1',
    separable: true, prefix: 'an', reflexive: false, partizip2: 'angerufen',
    tables: {
      praesens: t('rufe', 'rufst', 'ruft', 'rufen', 'ruft', 'rufen'),
      praeteritum: t('rief', 'riefst', 'rief', 'riefen', 'rieft', 'riefen'),
      imperativ: { du: 'Ruf an!', ihr: 'Ruft an!', Sie: 'Rufen Sie an!' },
    },
    tags: ['communication'],
    example: { de: 'Ich rufe dich später an.', en: 'I’ll call you later.' },
  },
  {
    infinitive: 'einkaufen', english: 'to shop, to buy groceries', type: 'weak', auxiliary: 'haben', level: 'A1',
    separable: true, prefix: 'ein', reflexive: false, partizip2: 'eingekauft',
    tables: {
      praesens: t('kaufe', 'kaufst', 'kauft', 'kaufen', 'kauft', 'kaufen'),
      praeteritum: t('kaufte', 'kauftest', 'kaufte', 'kauften', 'kauftet', 'kauften'),
      imperativ: { du: 'Kauf ein!', ihr: 'Kauft ein!', Sie: 'Kaufen Sie ein!' },
    },
    tags: ['transaction'],
    example: { de: 'Ich kaufe samstags ein.', en: 'I go grocery shopping on Saturdays.' },
  },
  {
    infinitive: 'ankommen', english: 'to arrive', type: 'strong', auxiliary: 'sein', level: 'A2',
    separable: true, prefix: 'an', reflexive: false, partizip2: 'angekommen',
    tables: {
      praesens: t('komme', 'kommst', 'kommt', 'kommen', 'kommt', 'kommen'),
      praeteritum: t('kam', 'kamst', 'kam', 'kamen', 'kamt', 'kamen'),
      imperativ: { du: 'Komm an!', ihr: 'Kommt an!', Sie: 'Kommen Sie an!' },
    },
    tags: ['movement'],
    example: { de: 'Der Zug kommt um zehn Uhr an.', en: 'The train arrives at ten o’clock.' },
  },
  {
    infinitive: 'fernsehen', english: 'to watch TV', type: 'strong', auxiliary: 'haben', level: 'A2',
    separable: true, prefix: 'fern', reflexive: false, partizip2: 'ferngesehen',
    tables: {
      praesens: t('sehe', 'siehst', 'sieht', 'sehen', 'seht', 'sehen'),
      praeteritum: t('sah', 'sahst', 'sah', 'sahen', 'saht', 'sahen'),
      imperativ: { du: 'Sieh fern!', ihr: 'Seht fern!', Sie: 'Sehen Sie fern!' },
    },
    tags: ['routine'],
    example: { de: 'Wir sehen abends fern.', en: 'We watch TV in the evenings.' },
  },
  {
    infinitive: 'mitkommen', english: 'to come along', type: 'strong', auxiliary: 'sein', level: 'A2',
    separable: true, prefix: 'mit', reflexive: false, partizip2: 'mitgekommen',
    tables: {
      praesens: t('komme', 'kommst', 'kommt', 'kommen', 'kommt', 'kommen'),
      praeteritum: t('kam', 'kamst', 'kam', 'kamen', 'kamt', 'kamen'),
      imperativ: { du: 'Komm mit!', ihr: 'Kommt mit!', Sie: 'Kommen Sie mit!' },
    },
    tags: ['movement'],
    example: { de: 'Kommst du mit?', en: 'Are you coming along?' },
  },

  // ---------------------------------------------------------------- REFLEXIVE
  {
    infinitive: 'sich freuen', english: 'to be glad, to look forward to', type: 'weak', auxiliary: 'haben', level: 'A2',
    separable: false, reflexive: true, partizip2: 'gefreut',
    tables: {
      praesens: t('freue', 'freust', 'freut', 'freuen', 'freut', 'freuen'),
      praeteritum: t('freute', 'freutest', 'freute', 'freuten', 'freutet', 'freuten'),
      imperativ: { du: 'Freu dich!', ihr: 'Freut euch!', Sie: 'Freuen Sie sich!' },
    },
    tags: ['feeling'],
    example: { de: 'Ich freue mich auf das Wochenende.', en: 'I am looking forward to the weekend.' },
  },
  {
    infinitive: 'sich fühlen', english: 'to feel', type: 'weak', auxiliary: 'haben', level: 'A2',
    separable: false, reflexive: true, partizip2: 'gefühlt',
    tables: {
      praesens: t('fühle', 'fühlst', 'fühlt', 'fühlen', 'fühlt', 'fühlen'),
      praeteritum: t('fühlte', 'fühltest', 'fühlte', 'fühlten', 'fühltet', 'fühlten'),
      imperativ: { du: 'Fühl dich!', ihr: 'Fühlt euch!', Sie: 'Fühlen Sie sich!' },
    },
    tags: ['feeling'],
    example: { de: 'Ich fühle mich gut.', en: 'I feel good.' },
  },
  {
    infinitive: 'sich waschen', english: 'to wash (oneself)', type: 'strong', auxiliary: 'haben', level: 'A2',
    separable: false, reflexive: true, partizip2: 'gewaschen',
    tables: {
      praesens: t('wasche', 'wäschst', 'wäscht', 'waschen', 'wascht', 'waschen'),
      praeteritum: t('wusch', 'wuschst', 'wusch', 'wuschen', 'wuscht', 'wuschen'),
      imperativ: { du: 'Wasch dich!', ihr: 'Wascht euch!', Sie: 'Waschen Sie sich!' },
    },
    tags: ['routine', 'ablaut-a-ä'],
    example: { de: 'Ich wasche mich jeden Morgen.', en: 'I wash (myself) every morning.' },
  },
  {
    infinitive: 'sich anziehen', english: 'to get dressed', type: 'strong', auxiliary: 'haben', level: 'B1',
    separable: true, prefix: 'an', reflexive: true, partizip2: 'angezogen',
    tables: {
      praesens: t('ziehe', 'ziehst', 'zieht', 'ziehen', 'zieht', 'ziehen'),
      praeteritum: t('zog', 'zogst', 'zog', 'zogen', 'zogt', 'zogen'),
      imperativ: { du: 'Zieh dich an!', ihr: 'Zieht euch an!', Sie: 'Ziehen Sie sich an!' },
    },
    tags: ['routine', 'ablaut-i-a-u'],
    notes: 'Combines separable prefix + reflexive: Ich ziehe mich an.',
    example: { de: 'Ich ziehe mich schnell an.', en: 'I get dressed quickly.' },
  },
];

// Verbs with a living synthetic Konjunktiv II already declared above via `konjunktiv2`
// (sein, haben, werden, wissen, the 6 modals, denken, kommen). All other verbs derive
// Konjunktiv II periphrastically (würde + infinitive) in conjugate.js — that mirrors how
// Konjunktiv II actually works in modern spoken German instead of resurrecting archaic
// synthetic forms (e.g. "führe", "schriebe") nobody actually says.

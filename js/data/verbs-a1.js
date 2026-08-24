// The A1 verb core - ~35 verbs confirmed against the official Goethe-Institut A1
// wordlist (reference only; no list content is reproduced here - every conjugation
// and example sentence below is authored independently for this app).
//
// FULL SCHEMA, A1-DEPTH DATA: every verb carries all seven tense slots so A2/B1 phases
// only ever populate a field, never restructure one. This phase fills only praesens,
// imperativ, and perfekt - praeteritum/konjunktiv2/futur1/plusquamperfekt/passiv are
// present as explicit `null` placeholders.
//
// CORRECT BY CONSTRUCTION: every regular form below is a literal call into rules.js at
// module load, not a hand-typed string - see rules.js's header for why. Only genuinely
// irregular stems (stem-changers' du/er, strong/mixed partizip2, sein/haben/werden, the
// modals, wissen) are hand-typed string literals; scripts/verify.mjs re-derives every
// non-hand-flagged form and fails the build if a shipped form ever disagrees.
//
// verb.tags carries a short REGULARITY NOTE for the per-verb review table in
// scripts/verify.mjs's output - not used by the UI.

import { PRONOUNS, regularPraesens, regularImperativ, regularPartizip2, buildPerfekt } from './rules.js';

export { PRONOUNS };

export const PRONOUN_LABELS = { ich: 'ich', du: 'du', er: 'er/sie/es', wir: 'wir', ihr: 'ihr', sie: 'sie/Sie' };

// Consistent accent color per pronoun, used everywhere a pronoun appears (memory aid).
export const PRONOUN_COLORS = {
  ich: '#FF6B6B', du: '#4ECDC4', er: '#FFD166', wir: '#6C8EFF', ihr: '#C77DFF', sie: '#5FD98A',
};

export const REFLEXIVE_PRONOUNS = { ich: 'mich', du: 'dich', er: 'sich', wir: 'uns', ihr: 'euch', sie: 'sich' };

// The empty-schema shape every unfilled tense uses this phase - keeps `tables` a
// consistent 8-key object everywhere instead of some verbs having the key and others not.
const EMPTY_TENSES = {
  praeteritum: null,
  konjunktiv2: null,
  futur1: null,
  plusquamperfekt: null,
  passiv: null,
};
const EMPTY_EXAMPLES = { praeteritum: null, perfekt: null, konjunktiv2: null, futur1: null, plusquamperfekt: null, passiv: null };

// ---------------------------------------------------------------- the three auxiliaries
// Fully hand-typed - sein/haben/werden are themselves the irregular foundation everything
// else (perfekt, later futur1/passiv) assembles from. No verb this phase is more load-bearing
// or more scrutinized; see the per-verb table in scripts/verify.mjs for the manual-review flag.

const SEIN_PRAESENS = { ich: 'bin', du: 'bist', er: 'ist', wir: 'sind', ihr: 'seid', sie: 'sind' };
const HABEN_PRAESENS = { ich: 'habe', du: 'hast', er: 'hat', wir: 'haben', ihr: 'habt', sie: 'haben' };
const WERDEN_PRAESENS = { ich: 'werde', du: 'wirst', er: 'wird', wir: 'werden', ihr: 'werdet', sie: 'werden' };

const SEIN = {
  infinitive: 'sein', english: 'to be', level: 'A1', type: 'irregular', auxiliary: 'sein',
  separable: false, reflexive: false, partizip2: 'gewesen',
  tables: {
    praesens: SEIN_PRAESENS,
    imperativ: { du: 'Sei!', ihr: 'Seid!', Sie: 'Seien Sie!' },
    perfekt: buildPerfekt(SEIN_PRAESENS, 'gewesen'),
    ...EMPTY_TENSES,
  },
  examplesByPronoun: {
    praesens: {
      ich: { de: 'Ich bin müde.', en: 'I am tired.' },
      du: { de: 'Du bist sehr nett.', en: 'You are very nice.' },
      er: { de: 'Er ist Lehrer.', en: 'He is a teacher.' },
      wir: { de: 'Wir sind zu Hause.', en: 'We are at home.' },
      ihr: { de: 'Ihr seid spät dran.', en: "You all are running late." },
      sie: { de: 'Sie sind aus Berlin.', en: 'They are from Berlin.' },
    },
    ...EMPTY_EXAMPLES,
  },
  tags: ['irregular - hand-typed foundation verb'],
};

const HABEN = {
  infinitive: 'haben', english: 'to have', level: 'A1', type: 'irregular', auxiliary: 'haben',
  separable: false, reflexive: false, partizip2: 'gehabt',
  tables: {
    praesens: HABEN_PRAESENS,
    imperativ: { du: 'Hab!', ihr: 'Habt!', Sie: 'Haben Sie!' },
    perfekt: buildPerfekt(HABEN_PRAESENS, 'gehabt'),
    ...EMPTY_TENSES,
  },
  examplesByPronoun: {
    praesens: {
      ich: { de: 'Ich habe einen Hund.', en: 'I have a dog.' },
      du: { de: 'Du hast Recht.', en: 'You are right.' },
      er: { de: 'Er hat keine Zeit.', en: 'He has no time.' },
      wir: { de: 'Wir haben Hunger.', en: 'We are hungry.' },
      ihr: { de: 'Ihr habt eine gute Idee.', en: 'You all have a good idea.' },
      sie: { de: 'Sie haben drei Kinder.', en: 'They have three children.' },
    },
    ...EMPTY_EXAMPLES,
  },
  tags: ['irregular - hand-typed foundation verb'],
};

const WERDEN = {
  infinitive: 'werden', english: 'to become', level: 'A1', type: 'irregular', auxiliary: 'sein',
  separable: false, reflexive: false, partizip2: 'geworden',
  tables: {
    praesens: WERDEN_PRAESENS,
    imperativ: { du: 'Werde!', ihr: 'Werdet!', Sie: 'Werden Sie!' },
    perfekt: buildPerfekt(SEIN_PRAESENS, 'geworden'),
    ...EMPTY_TENSES,
  },
  examplesByPronoun: {
    praesens: {
      ich: { de: 'Ich werde langsam müde.', en: 'I am slowly getting tired.' },
      du: { de: 'Du wirst jeden Tag besser.', en: 'You get better every day.' },
      er: { de: 'Er wird bald dreißig.', en: 'He is turning thirty soon.' },
      wir: { de: 'Wir werden jetzt ruhig.', en: 'We are getting calm now.' },
      ihr: { de: 'Ihr werdet immer lauter.', en: 'You all keep getting louder.' },
      sie: { de: 'Sie werden gute Freunde.', en: 'They are becoming good friends.' },
    },
    ...EMPTY_EXAMPLES,
  },
  tags: ['irregular - hand-typed foundation verb'],
};

// ---------------------------------------------------------------- fully regular (praesens + partizip2 both by rule)

const MACHEN = {
  infinitive: 'machen', english: 'to do, to make', level: 'A1', type: 'weak', auxiliary: 'haben',
  separable: false, reflexive: false, partizip2: regularPartizip2('machen'),
  tables: {
    praesens: regularPraesens('machen'),
    imperativ: regularImperativ('machen', regularPraesens('machen')),
    perfekt: buildPerfekt(HABEN_PRAESENS, regularPartizip2('machen')),
    ...EMPTY_TENSES,
  },
  examplesByPronoun: {
    praesens: {
      ich: { de: 'Ich mache das Frühstück.', en: "I'm making breakfast." },
      du: { de: 'Du machst das sehr gut.', en: "You're doing that very well." },
      er: { de: 'Er macht heute Sport.', en: "He's doing sports today." },
      wir: { de: 'Wir machen eine Pause.', en: "We're taking a break." },
      ihr: { de: 'Ihr macht zu viel Lärm.', en: 'You all are making too much noise.' },
      sie: { de: 'Sie machen das jeden Tag.', en: 'They do that every day.' },
    },
    ...EMPTY_EXAMPLES,
  },
  tags: ['regular - rule-generated'],
};

const KAUFEN = {
  infinitive: 'kaufen', english: 'to buy', level: 'A1', type: 'weak', auxiliary: 'haben',
  separable: false, reflexive: false, partizip2: regularPartizip2('kaufen'),
  tables: {
    praesens: regularPraesens('kaufen'),
    imperativ: regularImperativ('kaufen', regularPraesens('kaufen')),
    perfekt: buildPerfekt(HABEN_PRAESENS, regularPartizip2('kaufen')),
    ...EMPTY_TENSES,
  },
  examplesByPronoun: {
    praesens: {
      ich: { de: 'Ich kaufe frisches Brot.', en: "I'm buying fresh bread." },
      du: { de: 'Du kaufst zu viele Schuhe.', en: "You buy too many shoes." },
      er: { de: 'Er kauft ein neues Auto.', en: "He's buying a new car." },
      wir: { de: 'Wir kaufen Gemüse auf dem Markt.', en: "We buy vegetables at the market." },
      ihr: { de: 'Ihr kauft immer die teuersten Sachen.', en: "You all always buy the most expensive things." },
      sie: { de: 'Sie kaufen ein Geschenk für die Party.', en: "They're buying a gift for the party." },
    },
    ...EMPTY_EXAMPLES,
  },
  tags: ['regular - rule-generated'],
};

const WOHNEN = {
  infinitive: 'wohnen', english: 'to live, to reside', level: 'A1', type: 'weak', auxiliary: 'haben',
  separable: false, reflexive: false, partizip2: regularPartizip2('wohnen'),
  tables: {
    praesens: regularPraesens('wohnen'),
    imperativ: regularImperativ('wohnen', regularPraesens('wohnen')),
    perfekt: buildPerfekt(HABEN_PRAESENS, regularPartizip2('wohnen')),
    ...EMPTY_TENSES,
  },
  examplesByPronoun: {
    praesens: {
      ich: { de: 'Ich wohne in Berlin.', en: 'I live in Berlin.' },
      du: { de: 'Du wohnst sehr zentral.', en: 'You live very centrally.' },
      er: { de: 'Er wohnt bei seinen Eltern.', en: 'He lives with his parents.' },
      wir: { de: 'Wir wohnen im dritten Stock.', en: 'We live on the third floor.' },
      ihr: { de: 'Ihr wohnt ziemlich weit weg.', en: 'You all live pretty far away.' },
      sie: { de: 'Sie wohnen seit einem Jahr hier.', en: "They've lived here for a year." },
    },
    ...EMPTY_EXAMPLES,
  },
  tags: ['regular - rule-generated'],
};

const ARBEITEN = {
  infinitive: 'arbeiten', english: 'to work', level: 'A1', type: 'weak', auxiliary: 'haben',
  separable: false, reflexive: false, partizip2: regularPartizip2('arbeiten'),
  tables: {
    praesens: regularPraesens('arbeiten'),
    imperativ: regularImperativ('arbeiten', regularPraesens('arbeiten')),
    perfekt: buildPerfekt(HABEN_PRAESENS, regularPartizip2('arbeiten')),
    ...EMPTY_TENSES,
  },
  examplesByPronoun: {
    praesens: {
      ich: { de: 'Ich arbeite von zu Hause.', en: 'I work from home.' },
      du: { de: 'Du arbeitest zu viel.', en: 'You work too much.' },
      er: { de: 'Er arbeitet in einem Büro.', en: 'He works in an office.' },
      wir: { de: 'Wir arbeiten heute zusammen.', en: "We're working together today." },
      ihr: { de: 'Ihr arbeitet sehr schnell.', en: 'You all work very fast.' },
      sie: { de: 'Sie arbeiten bis achtzehn Uhr.', en: 'They work until six p.m.' },
    },
    ...EMPTY_EXAMPLES,
  },
  tags: ['regular - rule-generated (linking-e stem)'],
};

// ---------------------------------------------------------------- semi-regular (regular praesens, hand-typed strong/mixed partizip2)

const GEHEN = {
  infinitive: 'gehen', english: 'to go, to walk', level: 'A1', type: 'strong', auxiliary: 'sein',
  separable: false, reflexive: false, partizip2: 'gegangen',
  tables: {
    praesens: regularPraesens('gehen'),
    imperativ: regularImperativ('gehen', regularPraesens('gehen')),
    perfekt: buildPerfekt(SEIN_PRAESENS, 'gegangen'),
    ...EMPTY_TENSES,
  },
  examplesByPronoun: {
    praesens: {
      ich: { de: 'Ich gehe jetzt nach Hause.', en: "I'm going home now." },
      du: { de: 'Du gehst zu schnell.', en: "You're walking too fast." },
      er: { de: 'Er geht jeden Morgen joggen.', en: 'He goes jogging every morning.' },
      wir: { de: 'Wir gehen heute Abend ins Kino.', en: "We're going to the cinema tonight." },
      ihr: { de: 'Ihr geht schon wieder einkaufen?', en: "You all are going shopping again?" },
      sie: { de: 'Sie gehen zusammen spazieren.', en: 'They go for a walk together.' },
    },
    ...EMPTY_EXAMPLES,
  },
  tags: ['strong - regular praesens, hand-typed partizip2 (ablaut)'],
};

const KOMMEN = {
  infinitive: 'kommen', english: 'to come', level: 'A1', type: 'strong', auxiliary: 'sein',
  separable: false, reflexive: false, partizip2: 'gekommen',
  tables: {
    praesens: regularPraesens('kommen'),
    imperativ: regularImperativ('kommen', regularPraesens('kommen')),
    perfekt: buildPerfekt(SEIN_PRAESENS, 'gekommen'),
    ...EMPTY_TENSES,
  },
  examplesByPronoun: {
    praesens: {
      ich: { de: 'Ich komme sofort.', en: "I'm coming right away." },
      du: { de: 'Du kommst immer zu spät.', en: "You always come too late." },
      er: { de: 'Er kommt aus Spanien.', en: 'He comes from Spain.' },
      wir: { de: 'Wir kommen morgen vorbei.', en: "We're coming by tomorrow." },
      ihr: { de: 'Ihr kommt genau richtig.', en: "You all are arriving at just the right time." },
      sie: { de: 'Sie kommen mit dem Zug.', en: 'They are coming by train.' },
    },
    ...EMPTY_EXAMPLES,
  },
  tags: ['strong - regular praesens, hand-typed partizip2 (ablaut)'],
};

const BLEIBEN = {
  infinitive: 'bleiben', english: 'to stay, to remain', level: 'A1', type: 'strong', auxiliary: 'sein',
  separable: false, reflexive: false, partizip2: 'geblieben',
  tables: {
    praesens: regularPraesens('bleiben'),
    imperativ: regularImperativ('bleiben', regularPraesens('bleiben')),
    perfekt: buildPerfekt(SEIN_PRAESENS, 'geblieben'),
    ...EMPTY_TENSES,
  },
  examplesByPronoun: {
    praesens: {
      ich: { de: 'Ich bleibe heute zu Hause.', en: "I'm staying home today." },
      du: { de: 'Du bleibst hoffentlich ruhig.', en: 'Hopefully you stay calm.' },
      er: { de: 'Er bleibt noch eine Woche.', en: "He's staying one more week." },
      wir: { de: 'Wir bleiben bis Mitternacht.', en: "We're staying until midnight." },
      ihr: { de: 'Ihr bleibt viel zu lange weg.', en: "You all stay away for way too long." },
      sie: { de: 'Sie bleiben lieber drinnen.', en: 'They prefer to stay inside.' },
    },
    ...EMPTY_EXAMPLES,
  },
  tags: ['strong - regular praesens, hand-typed partizip2 (ablaut)'],
};

const SCHREIBEN = {
  infinitive: 'schreiben', english: 'to write', level: 'A1', type: 'strong', auxiliary: 'haben',
  separable: false, reflexive: false, partizip2: 'geschrieben',
  tables: {
    praesens: regularPraesens('schreiben'),
    imperativ: regularImperativ('schreiben', regularPraesens('schreiben')),
    perfekt: buildPerfekt(HABEN_PRAESENS, 'geschrieben'),
    ...EMPTY_TENSES,
  },
  examplesByPronoun: {
    praesens: {
      ich: { de: 'Ich schreibe eine E-Mail.', en: "I'm writing an email." },
      du: { de: 'Du schreibst sehr ordentlich.', en: 'You write very neatly.' },
      er: { de: 'Er schreibt einen Brief an seine Oma.', en: "He's writing a letter to his grandma." },
      wir: { de: 'Wir schreiben heute einen Test.', en: "We're writing a test today." },
      ihr: { de: 'Ihr schreibt viel zu schnell.', en: "You all write way too fast." },
      sie: { de: 'Sie schreiben zusammen ein Buch.', en: "They're writing a book together." },
    },
    ...EMPTY_EXAMPLES,
  },
  tags: ['strong - regular praesens, hand-typed partizip2 (ablaut)'],
};

const HEISSEN = {
  infinitive: 'heißen', english: 'to be called', level: 'A1', type: 'strong', auxiliary: 'haben',
  separable: false, reflexive: false, partizip2: 'geheißen',
  tables: {
    praesens: regularPraesens('heißen'),
    imperativ: regularImperativ('heißen', regularPraesens('heißen')),
    perfekt: buildPerfekt(HABEN_PRAESENS, 'geheißen'),
    ...EMPTY_TENSES,
  },
  examplesByPronoun: {
    praesens: {
      ich: { de: 'Ich heiße Anna.', en: 'My name is Anna.' },
      du: { de: 'Du heißt bestimmt Max, oder?', en: "You're Max, right?" },
      er: { de: 'Er heißt eigentlich Alexander.', en: "His name is actually Alexander." },
      wir: { de: 'Wir heißen beide Schmidt.', en: "We're both named Schmidt." },
      ihr: { de: 'Ihr heißt beide gleich?', en: 'You two have the same name?' },
      sie: { de: 'Sie heißen Herr und Frau Meier.', en: 'Their names are Mr. and Mrs. Meier.' },
    },
    ...EMPTY_EXAMPLES,
  },
  tags: ['strong - regular praesens (s-stem contraction), hand-typed partizip2'],
};

const TRINKEN = {
  infinitive: 'trinken', english: 'to drink', level: 'A1', type: 'strong', auxiliary: 'haben',
  separable: false, reflexive: false, partizip2: 'getrunken',
  tables: {
    praesens: regularPraesens('trinken'),
    imperativ: regularImperativ('trinken', regularPraesens('trinken')),
    perfekt: buildPerfekt(HABEN_PRAESENS, 'getrunken'),
    ...EMPTY_TENSES,
  },
  examplesByPronoun: {
    praesens: {
      ich: { de: 'Ich trinke einen Kaffee.', en: "I'm drinking a coffee." },
      du: { de: 'Du trinkst viel zu wenig Wasser.', en: 'You drink way too little water.' },
      er: { de: 'Er trinkt nur Tee.', en: 'He only drinks tea.' },
      wir: { de: 'Wir trinken auf dein Glück.', en: "We're drinking to your good fortune." },
      ihr: { de: 'Ihr trinkt schon wieder Limonade?', en: "You all are drinking soda again?" },
      sie: { de: 'Sie trinken gern Orangensaft.', en: 'They like drinking orange juice.' },
    },
    ...EMPTY_EXAMPLES,
  },
  tags: ['strong - regular praesens, hand-typed partizip2 (ablaut)'],
};

const FINDEN = {
  infinitive: 'finden', english: 'to find', level: 'A1', type: 'strong', auxiliary: 'haben',
  separable: false, reflexive: false, partizip2: 'gefunden',
  tables: {
    praesens: regularPraesens('finden'),
    imperativ: regularImperativ('finden', regularPraesens('finden')),
    perfekt: buildPerfekt(HABEN_PRAESENS, 'gefunden'),
    ...EMPTY_TENSES,
  },
  examplesByPronoun: {
    praesens: {
      ich: { de: 'Ich finde meinen Schlüssel nicht.', en: "I can't find my key." },
      du: { de: 'Du findest immer eine Lösung.', en: 'You always find a solution.' },
      er: { de: 'Er findet das Buch total spannend.', en: 'He finds the book really exciting.' },
      wir: { de: 'Wir finden den Weg schon.', en: "We'll find the way." },
      ihr: { de: 'Ihr findet das wirklich lustig?', en: 'You all really find that funny?' },
      sie: { de: 'Sie finden endlich eine Wohnung.', en: "They're finally finding an apartment." },
    },
    ...EMPTY_EXAMPLES,
  },
  tags: ['strong - regular praesens (linking-e stem), hand-typed partizip2 (ablaut)'],
};

const KENNEN = {
  infinitive: 'kennen', english: 'to know (be familiar with)', level: 'A1', type: 'mixed', auxiliary: 'haben',
  separable: false, reflexive: false, partizip2: 'gekannt',
  tables: {
    praesens: regularPraesens('kennen'),
    imperativ: regularImperativ('kennen', regularPraesens('kennen')),
    perfekt: buildPerfekt(HABEN_PRAESENS, 'gekannt'),
    ...EMPTY_TENSES,
  },
  examplesByPronoun: {
    praesens: {
      ich: { de: 'Ich kenne diese Stadt gut.', en: 'I know this city well.' },
      du: { de: 'Du kennst bestimmt viele Leute hier.', en: 'You probably know a lot of people here.' },
      er: { de: 'Er kennt den Weg zum Bahnhof.', en: 'He knows the way to the station.' },
      wir: { de: 'Wir kennen uns schon lange.', en: "We've known each other a long time." },
      ihr: { de: 'Ihr kennt euch aus der Schule, oder?', en: 'You two know each other from school, right?' },
      sie: { de: 'Sie kennen das Restaurant nicht.', en: "They don't know the restaurant." },
    },
    ...EMPTY_EXAMPLES,
  },
  tags: ['mixed - regular praesens, hand-typed partizip2 (mixed ablaut)'],
};

// ---------------------------------------------------------------- irregular praesens (stem-changing du/er)

const FAHREN = {
  infinitive: 'fahren', english: 'to drive, to go (by vehicle)', level: 'A1', type: 'strong', auxiliary: 'sein',
  separable: false, reflexive: false, partizip2: 'gefahren',
  tables: {
    praesens: { ...regularPraesens('fahren'), du: 'fährst', er: 'fährt' },
    imperativ: regularImperativ('fahren', regularPraesens('fahren')), // a->ä changers use the UNCHANGED stem in imperativ
    perfekt: buildPerfekt(SEIN_PRAESENS, 'gefahren'),
    ...EMPTY_TENSES,
  },
  examplesByPronoun: {
    praesens: {
      ich: { de: 'Ich fahre mit dem Bus.', en: "I'm going by bus." },
      du: { de: 'Du fährst viel zu schnell.', en: "You're driving way too fast." },
      er: { de: 'Er fährt jeden Tag zur Arbeit.', en: 'He drives to work every day.' },
      wir: { de: 'Wir fahren morgen nach München.', en: "We're driving to Munich tomorrow." },
      ihr: { de: 'Ihr fahrt schon wieder in den Urlaub?', en: "You all are going on vacation again?" },
      sie: { de: 'Sie fahren mit dem Fahrrad zur Schule.', en: 'They ride their bikes to school.' },
    },
    ...EMPTY_EXAMPLES,
  },
  tags: ['strong - irregular du/er stem (a->ä), hand-typed partizip2'],
};

const ESSEN = {
  infinitive: 'essen', english: 'to eat', level: 'A1', type: 'strong', auxiliary: 'haben',
  separable: false, reflexive: false, partizip2: 'gegessen',
  tables: {
    praesens: { ...regularPraesens('essen'), du: 'isst', er: 'isst' },
    imperativ: { ...regularImperativ('essen', regularPraesens('essen')), du: 'Iss!' },
    perfekt: buildPerfekt(HABEN_PRAESENS, 'gegessen'),
    ...EMPTY_TENSES,
  },
  examplesByPronoun: {
    praesens: {
      ich: { de: 'Ich esse gern Pizza.', en: 'I like eating pizza.' },
      du: { de: 'Du isst viel zu wenig.', en: 'You eat far too little.' },
      er: { de: 'Er isst kein Fleisch.', en: "He doesn't eat meat." },
      wir: { de: 'Wir essen zusammen zu Abend.', en: "We're eating dinner together." },
      ihr: { de: 'Ihr esst schon wieder Süßigkeiten?', en: "You all are eating sweets again?" },
      sie: { de: 'Sie essen jeden Sonntag im Restaurant.', en: 'They eat at a restaurant every Sunday.' },
    },
    ...EMPTY_EXAMPLES,
  },
  tags: ['strong - irregular du/er stem (e->i, s-contraction), hand-typed partizip2'],
};

const GEBEN = {
  infinitive: 'geben', english: 'to give', level: 'A1', type: 'strong', auxiliary: 'haben',
  separable: false, reflexive: false, partizip2: 'gegeben',
  tables: {
    praesens: { ...regularPraesens('geben'), du: 'gibst', er: 'gibt' },
    imperativ: { ...regularImperativ('geben', regularPraesens('geben')), du: 'Gib!' },
    perfekt: buildPerfekt(HABEN_PRAESENS, 'gegeben'),
    ...EMPTY_TENSES,
  },
  examplesByPronoun: {
    praesens: {
      ich: { de: 'Ich gebe dir mein Buch.', en: "I'm giving you my book." },
      du: { de: 'Du gibst nie auf.', en: 'You never give up.' },
      er: { de: 'Er gibt mir sein Telefon.', en: 'He gives me his phone.' },
      wir: { de: 'Wir geben heute eine kleine Party.', en: "We're throwing a small party today." },
      ihr: { de: 'Ihr gebt zu viel Geld aus.', en: 'You all spend too much money.' },
      sie: { de: 'Sie geben dem Kellner Trinkgeld.', en: 'They give the waiter a tip.' },
    },
    ...EMPTY_EXAMPLES,
  },
  tags: ['strong - irregular du/er stem (e->i), hand-typed partizip2'],
};

const NEHMEN = {
  infinitive: 'nehmen', english: 'to take', level: 'A1', type: 'strong', auxiliary: 'haben',
  separable: false, reflexive: false, partizip2: 'genommen',
  tables: {
    praesens: { ...regularPraesens('nehmen'), du: 'nimmst', er: 'nimmt' },
    imperativ: { ...regularImperativ('nehmen', regularPraesens('nehmen')), du: 'Nimm!' },
    perfekt: buildPerfekt(HABEN_PRAESENS, 'genommen'),
    ...EMPTY_TENSES,
  },
  examplesByPronoun: {
    praesens: {
      ich: { de: 'Ich nehme den Zug um acht.', en: "I'm taking the eight o'clock train." },
      du: { de: 'Du nimmst dir zu wenig Zeit.', en: "You don't give yourself enough time." },
      er: { de: 'Er nimmt immer den gleichen Weg.', en: 'He always takes the same route.' },
      wir: { de: 'Wir nehmen das kleine Zimmer.', en: "We'll take the small room." },
      ihr: { de: 'Ihr nehmt hoffentlich Regenschirme mit.', en: "Hopefully you all bring umbrellas." },
      sie: { de: 'Sie nehmen den Fahrstuhl nach oben.', en: 'They take the elevator up.' },
    },
    ...EMPTY_EXAMPLES,
  },
  tags: ['strong - irregular du/er stem (e->i, consonant doubling), hand-typed partizip2'],
};

const SEHEN = {
  infinitive: 'sehen', english: 'to see', level: 'A1', type: 'strong', auxiliary: 'haben',
  separable: false, reflexive: false, partizip2: 'gesehen',
  tables: {
    praesens: { ...regularPraesens('sehen'), du: 'siehst', er: 'sieht' },
    imperativ: { ...regularImperativ('sehen', regularPraesens('sehen')), du: 'Sieh!' },
    perfekt: buildPerfekt(HABEN_PRAESENS, 'gesehen'),
    ...EMPTY_TENSES,
  },
  examplesByPronoun: {
    praesens: {
      ich: { de: 'Ich sehe dich später.', en: "I'll see you later." },
      du: { de: 'Du siehst heute müde aus.', en: 'You look tired today.' },
      er: { de: 'Er sieht seine Freunde am Wochenende.', en: 'He sees his friends on the weekend.' },
      wir: { de: 'Wir sehen uns morgen wieder.', en: "We'll see each other again tomorrow." },
      ihr: { de: 'Ihr seht den Fehler nicht.', en: "You all don't see the mistake." },
      sie: { de: 'Sie sehen den Berg von hier aus.', en: 'They can see the mountain from here.' },
    },
    ...EMPTY_EXAMPLES,
  },
  tags: ['strong - irregular du/er stem (e->ie), hand-typed partizip2'],
};

const LESEN = {
  infinitive: 'lesen', english: 'to read', level: 'A1', type: 'strong', auxiliary: 'haben',
  separable: false, reflexive: false, partizip2: 'gelesen',
  tables: {
    praesens: { ...regularPraesens('lesen'), du: 'liest', er: 'liest' },
    imperativ: { ...regularImperativ('lesen', regularPraesens('lesen')), du: 'Lies!' },
    perfekt: buildPerfekt(HABEN_PRAESENS, 'gelesen'),
    ...EMPTY_TENSES,
  },
  examplesByPronoun: {
    praesens: {
      ich: { de: 'Ich lese ein spannendes Buch.', en: "I'm reading an exciting book." },
      du: { de: 'Du liest viel zu schnell.', en: 'You read way too fast.' },
      er: { de: 'Er liest jeden Morgen die Zeitung.', en: 'He reads the newspaper every morning.' },
      wir: { de: 'Wir lesen den Text zusammen.', en: "We're reading the text together." },
      ihr: { de: 'Ihr lest das gleiche Buch?', en: 'You two are reading the same book?' },
      sie: { de: 'Sie lesen die Nachrichten online.', en: 'They read the news online.' },
    },
    ...EMPTY_EXAMPLES,
  },
  tags: ['strong - irregular du/er stem (e->ie, s-contraction), hand-typed partizip2'],
};

const SPRECHEN = {
  infinitive: 'sprechen', english: 'to speak', level: 'A1', type: 'strong', auxiliary: 'haben',
  separable: false, reflexive: false, partizip2: 'gesprochen',
  tables: {
    praesens: { ...regularPraesens('sprechen'), du: 'sprichst', er: 'spricht' },
    imperativ: { ...regularImperativ('sprechen', regularPraesens('sprechen')), du: 'Sprich!' },
    perfekt: buildPerfekt(HABEN_PRAESENS, 'gesprochen'),
    ...EMPTY_TENSES,
  },
  examplesByPronoun: {
    praesens: {
      ich: { de: 'Ich spreche ein bisschen Deutsch.', en: 'I speak a little German.' },
      du: { de: 'Du sprichst sehr deutlich.', en: 'You speak very clearly.' },
      er: { de: 'Er spricht drei Sprachen.', en: 'He speaks three languages.' },
      wir: { de: 'Wir sprechen morgen darüber.', en: "We'll talk about it tomorrow." },
      ihr: { de: 'Ihr sprecht zu leise.', en: "You all are speaking too quietly." },
      sie: { de: 'Sie sprechen miteinander Englisch.', en: 'They speak English with each other.' },
    },
    ...EMPTY_EXAMPLES,
  },
  tags: ['strong - irregular du/er stem (e->i), hand-typed partizip2'],
};

const SCHLAFEN = {
  infinitive: 'schlafen', english: 'to sleep', level: 'A1', type: 'strong', auxiliary: 'haben',
  separable: false, reflexive: false, partizip2: 'geschlafen',
  tables: {
    praesens: { ...regularPraesens('schlafen'), du: 'schläfst', er: 'schläft' },
    imperativ: regularImperativ('schlafen', regularPraesens('schlafen')), // a->ä changers use the UNCHANGED stem in imperativ
    perfekt: buildPerfekt(HABEN_PRAESENS, 'geschlafen'),
    ...EMPTY_TENSES,
  },
  examplesByPronoun: {
    praesens: {
      ich: { de: 'Ich schlafe meistens acht Stunden.', en: 'I usually sleep eight hours.' },
      du: { de: 'Du schläfst schon wieder ein.', en: "You're falling asleep again." },
      er: { de: 'Er schläft am Wochenende lange.', en: 'He sleeps in on weekends.' },
      wir: { de: 'Wir schlafen heute im Zelt.', en: "We're sleeping in a tent tonight." },
      ihr: { de: 'Ihr schlaft viel zu wenig.', en: "You all sleep far too little." },
      sie: { de: 'Sie schlafen bei offenem Fenster.', en: 'They sleep with the window open.' },
    },
    ...EMPTY_EXAMPLES,
  },
  tags: ['strong - irregular du/er stem (a->ä), hand-typed partizip2'],
};

const LAUFEN = {
  infinitive: 'laufen', english: 'to run, to walk', level: 'A1', type: 'strong', auxiliary: 'sein',
  separable: false, reflexive: false, partizip2: 'gelaufen',
  tables: {
    praesens: { ...regularPraesens('laufen'), du: 'läufst', er: 'läuft' },
    imperativ: regularImperativ('laufen', regularPraesens('laufen')), // au->äu changers use the UNCHANGED stem in imperativ
    perfekt: buildPerfekt(SEIN_PRAESENS, 'gelaufen'),
    ...EMPTY_TENSES,
  },
  examplesByPronoun: {
    praesens: {
      ich: { de: 'Ich laufe jeden Morgen im Park.', en: 'I run in the park every morning.' },
      du: { de: 'Du läufst wirklich schnell.', en: 'You run really fast.' },
      er: { de: 'Er läuft zur Arbeit, wenn es warm ist.', en: 'He walks to work when it is warm.' },
      wir: { de: 'Wir laufen zusammen einen Marathon.', en: "We're running a marathon together." },
      ihr: { de: 'Ihr lauft schon wieder barfuß?', en: 'You two are walking barefoot again?' },
      sie: { de: 'Sie laufen jeden Abend eine Runde.', en: 'They go for a run every evening.' },
    },
    ...EMPTY_EXAMPLES,
  },
  tags: ['strong - irregular du/er stem (au->äu), hand-typed partizip2'],
};

const HELFEN = {
  infinitive: 'helfen', english: 'to help', level: 'A1', type: 'strong', auxiliary: 'haben',
  separable: false, reflexive: false, partizip2: 'geholfen',
  tables: {
    praesens: { ...regularPraesens('helfen'), du: 'hilfst', er: 'hilft' },
    imperativ: { ...regularImperativ('helfen', regularPraesens('helfen')), du: 'Hilf!' },
    perfekt: buildPerfekt(HABEN_PRAESENS, 'geholfen'),
    ...EMPTY_TENSES,
  },
  examplesByPronoun: {
    praesens: {
      ich: { de: 'Ich helfe dir gern.', en: "I'm happy to help you." },
      du: { de: 'Du hilfst mir wirklich sehr.', en: "You're really helping me a lot." },
      er: { de: 'Er hilft seiner Schwester bei den Hausaufgaben.', en: 'He helps his sister with homework.' },
      wir: { de: 'Wir helfen euch beim Umzug.', en: "We'll help you all with the move." },
      ihr: { de: 'Ihr helft immer sofort.', en: 'You all always help right away.' },
      sie: { de: 'Sie helfen älteren Nachbarn.', en: 'They help elderly neighbors.' },
    },
    ...EMPTY_EXAMPLES,
  },
  tags: ['strong - irregular du/er stem (e->i), hand-typed partizip2'],
};

const TREFFEN = {
  infinitive: 'treffen', english: 'to meet', level: 'A1', type: 'strong', auxiliary: 'haben',
  separable: false, reflexive: false, partizip2: 'getroffen',
  tables: {
    praesens: { ...regularPraesens('treffen'), du: 'triffst', er: 'trifft' },
    imperativ: { ...regularImperativ('treffen', regularPraesens('treffen')), du: 'Triff!' },
    perfekt: buildPerfekt(HABEN_PRAESENS, 'getroffen'),
    ...EMPTY_TENSES,
  },
  examplesByPronoun: {
    praesens: {
      ich: { de: 'Ich treffe meine Freunde im Café.', en: "I'm meeting my friends at the café." },
      du: { de: 'Du triffst immer die richtige Entscheidung.', en: 'You always make the right decision.' },
      er: { de: 'Er trifft seinen alten Kollegen.', en: "He's meeting his old colleague." },
      wir: { de: 'Wir treffen uns um sieben Uhr.', en: "We're meeting at seven o'clock." },
      ihr: { de: 'Ihr trefft euch schon wieder?', en: 'You two are meeting up again?' },
      sie: { de: 'Sie treffen sich jeden Freitag.', en: 'They meet every Friday.' },
    },
    ...EMPTY_EXAMPLES,
  },
  tags: ['strong - irregular du/er stem (e->i, consonant doubling), hand-typed partizip2'],
};

// ---------------------------------------------------------------- modals + wissen (fully hand-typed, no imperativ)

const KOENNEN = {
  infinitive: 'können', english: 'can, to be able to', level: 'A1', type: 'modal', auxiliary: 'haben',
  separable: false, reflexive: false, partizip2: 'gekonnt',
  tables: {
    praesens: { ich: 'kann', du: 'kannst', er: 'kann', wir: 'können', ihr: 'könnt', sie: 'können' },
    imperativ: null, // modals have no imperative mood in standard German
    perfekt: buildPerfekt(HABEN_PRAESENS, 'gekonnt'),
    ...EMPTY_TENSES,
  },
  examplesByPronoun: {
    praesens: {
      ich: { de: 'Ich kann gut schwimmen.', en: 'I can swim well.' },
      du: { de: 'Du kannst das bestimmt schaffen.', en: "You can definitely do it." },
      er: { de: 'Er kann heute leider nicht kommen.', en: "He can't come today, unfortunately." },
      wir: { de: 'Wir können morgen früh starten.', en: 'We can start early tomorrow.' },
      ihr: { de: 'Ihr könnt gerne mitkommen.', en: "You all are welcome to come along." },
      sie: { de: 'Sie können sehr gut kochen.', en: 'They can cook very well.' },
    },
    ...EMPTY_EXAMPLES,
  },
  tags: ['modal - fully hand-typed, no imperativ'],
};

const MUESSEN = {
  infinitive: 'müssen', english: 'must, to have to', level: 'A1', type: 'modal', auxiliary: 'haben',
  separable: false, reflexive: false, partizip2: 'gemusst',
  tables: {
    praesens: { ich: 'muss', du: 'musst', er: 'muss', wir: 'müssen', ihr: 'müsst', sie: 'müssen' },
    imperativ: null,
    perfekt: buildPerfekt(HABEN_PRAESENS, 'gemusst'),
    ...EMPTY_TENSES,
  },
  examplesByPronoun: {
    praesens: {
      ich: { de: 'Ich muss jetzt los.', en: 'I have to go now.' },
      du: { de: 'Du musst das nicht sofort machen.', en: "You don't have to do that right away." },
      er: { de: 'Er muss morgen früh aufstehen.', en: 'He has to get up early tomorrow.' },
      wir: { de: 'Wir müssen den Bus noch erreichen.', en: 'We still have to catch the bus.' },
      ihr: { de: 'Ihr müsst wirklich leiser sein.', en: 'You all really have to be quieter.' },
      sie: { de: 'Sie müssen das Formular ausfüllen.', en: 'They have to fill out the form.' },
    },
    ...EMPTY_EXAMPLES,
  },
  tags: ['modal - fully hand-typed, no imperativ'],
};

const WOLLEN = {
  infinitive: 'wollen', english: 'to want to', level: 'A1', type: 'modal', auxiliary: 'haben',
  separable: false, reflexive: false, partizip2: 'gewollt',
  tables: {
    praesens: { ich: 'will', du: 'willst', er: 'will', wir: 'wollen', ihr: 'wollt', sie: 'wollen' },
    imperativ: null,
    perfekt: buildPerfekt(HABEN_PRAESENS, 'gewollt'),
    ...EMPTY_TENSES,
  },
  examplesByPronoun: {
    praesens: {
      ich: { de: 'Ich will heute früh schlafen gehen.', en: 'I want to go to bed early today.' },
      du: { de: 'Du willst schon wieder Pizza essen?', en: 'You want to eat pizza again?' },
      er: { de: 'Er will Arzt werden.', en: 'He wants to become a doctor.' },
      wir: { de: 'Wir wollen dieses Jahr nach Italien.', en: 'We want to go to Italy this year.' },
      ihr: { de: 'Ihr wollt schon nach Hause?', en: 'You all want to go home already?' },
      sie: { de: 'Sie wollen zusammen ein Haus kaufen.', en: 'They want to buy a house together.' },
    },
    ...EMPTY_EXAMPLES,
  },
  tags: ['modal - fully hand-typed, no imperativ'],
};

const DUERFEN = {
  infinitive: 'dürfen', english: 'may, to be allowed to', level: 'A1', type: 'modal', auxiliary: 'haben',
  separable: false, reflexive: false, partizip2: 'gedurft',
  tables: {
    praesens: { ich: 'darf', du: 'darfst', er: 'darf', wir: 'dürfen', ihr: 'dürft', sie: 'dürfen' },
    imperativ: null,
    perfekt: buildPerfekt(HABEN_PRAESENS, 'gedurft'),
    ...EMPTY_TENSES,
  },
  examplesByPronoun: {
    praesens: {
      ich: { de: 'Ich darf heute länger aufbleiben.', en: 'I am allowed to stay up later today.' },
      du: { de: 'Du darfst hier nicht rauchen.', en: 'You are not allowed to smoke here.' },
      er: { de: 'Er darf noch nicht Auto fahren.', en: "He isn't allowed to drive yet." },
      wir: { de: 'Wir dürfen den Hund mitbringen.', en: "We're allowed to bring the dog." },
      ihr: { de: 'Ihr dürft gerne hierbleiben.', en: 'You all are welcome to stay here.' },
      sie: { de: 'Sie dürfen früher gehen.', en: 'They are allowed to leave early.' },
    },
    ...EMPTY_EXAMPLES,
  },
  tags: ['modal - fully hand-typed, no imperativ'],
};

const SOLLEN = {
  infinitive: 'sollen', english: 'should, to be supposed to', level: 'A1', type: 'modal', auxiliary: 'haben',
  separable: false, reflexive: false, partizip2: 'gesollt',
  tables: {
    praesens: { ich: 'soll', du: 'sollst', er: 'soll', wir: 'sollen', ihr: 'sollt', sie: 'sollen' },
    imperativ: null,
    perfekt: buildPerfekt(HABEN_PRAESENS, 'gesollt'),
    ...EMPTY_TENSES,
  },
  examplesByPronoun: {
    praesens: {
      ich: { de: 'Ich soll dich vom Bahnhof abholen.', en: "I'm supposed to pick you up from the station." },
      du: { de: 'Du sollst mehr Wasser trinken.', en: 'You should drink more water.' },
      er: { de: 'Er soll um neun Uhr da sein.', en: "He's supposed to be there at nine." },
      wir: { de: 'Wir sollen leiser sein.', en: "We're supposed to be quieter." },
      ihr: { de: 'Ihr sollt pünktlich kommen.', en: "You all should arrive on time." },
      sie: { de: 'Sie sollen das Zimmer aufräumen.', en: "They're supposed to tidy the room." },
    },
    ...EMPTY_EXAMPLES,
  },
  tags: ['modal - fully hand-typed, no imperativ'],
};

const MOEGEN = {
  infinitive: 'mögen', english: 'to like', level: 'A1', type: 'modal', auxiliary: 'haben',
  separable: false, reflexive: false, partizip2: 'gemocht',
  tables: {
    praesens: { ich: 'mag', du: 'magst', er: 'mag', wir: 'mögen', ihr: 'mögt', sie: 'mögen' },
    imperativ: null,
    perfekt: buildPerfekt(HABEN_PRAESENS, 'gemocht'),
    ...EMPTY_TENSES,
  },
  examplesByPronoun: {
    praesens: {
      ich: { de: 'Ich mag klassische Musik.', en: 'I like classical music.' },
      du: { de: 'Du magst wirklich jeden.', en: 'You really like everyone.' },
      er: { de: 'Er mag keinen Kaffee.', en: "He doesn't like coffee." },
      wir: { de: 'Wir mögen diesen Film sehr.', en: 'We like this film a lot.' },
      ihr: { de: 'Ihr mögt beide Katzen, oder?', en: 'You two both like cats, right?' },
      sie: { de: 'Sie mögen laute Konzerte nicht.', en: "They don't like loud concerts." },
    },
    ...EMPTY_EXAMPLES,
  },
  tags: ['modal - fully hand-typed, no imperativ'],
};

const WISSEN = {
  infinitive: 'wissen', english: 'to know (a fact)', level: 'A1', type: 'irregular', auxiliary: 'haben',
  separable: false, reflexive: false, partizip2: 'gewusst',
  tables: {
    praesens: { ich: 'weiß', du: 'weißt', er: 'weiß', wir: 'wissen', ihr: 'wisst', sie: 'wissen' },
    imperativ: null, // grammatically exists ("Wisse...") but archaic/literary - skipped as out of scope for A1 register
    perfekt: buildPerfekt(HABEN_PRAESENS, 'gewusst'),
    ...EMPTY_TENSES,
  },
  examplesByPronoun: {
    praesens: {
      ich: { de: 'Ich weiß die Antwort nicht.', en: "I don't know the answer." },
      du: { de: 'Du weißt das doch genau.', en: 'You know that perfectly well.' },
      er: { de: 'Er weiß immer, was zu tun ist.', en: 'He always knows what to do.' },
      wir: { de: 'Wir wissen noch nicht, wann wir kommen.', en: "We don't know yet when we're coming." },
      ihr: { de: 'Ihr wisst das bestimmt schon.', en: "You all surely know that already." },
      sie: { de: 'Sie wissen viel über Geschichte.', en: 'They know a lot about history.' },
    },
    ...EMPTY_EXAMPLES,
  },
  tags: ['irregular - hand-typed singular stem, no imperativ (rare/archaic form skipped)'],
};

// ---------------------------------------------------------------- separable verbs

const AUFSTEHEN = {
  infinitive: 'aufstehen', english: 'to get up', level: 'A1', type: 'strong', auxiliary: 'sein',
  separable: true, prefix: 'auf', reflexive: false, partizip2: 'aufgestanden',
  tables: {
    praesens: regularPraesens('stehen'),
    imperativ: regularImperativ('stehen', regularPraesens('stehen')),
    perfekt: buildPerfekt(SEIN_PRAESENS, 'aufgestanden'),
    ...EMPTY_TENSES,
  },
  examplesByPronoun: {
    praesens: {
      ich: { de: 'Ich stehe um sieben auf.', en: 'I get up at seven.' },
      du: { de: 'Du stehst heute spät auf.', en: "You're getting up late today." },
      er: { de: 'Er steht jeden Tag früh auf.', en: 'He gets up early every day.' },
      wir: { de: 'Wir stehen am Wochenende später auf.', en: 'We get up later on weekends.' },
      ihr: { de: 'Ihr steht schon wieder so spät auf?', en: "You all are getting up this late again?" },
      sie: { de: 'Sie stehen gemeinsam um sechs auf.', en: 'They get up together at six.' },
    },
    ...EMPTY_EXAMPLES,
  },
  tags: ['separable, strong base "stehen" - regular praesens, hand-typed partizip2'],
};

const ANRUFEN = {
  infinitive: 'anrufen', english: 'to call (phone)', level: 'A1', type: 'strong', auxiliary: 'haben',
  separable: true, prefix: 'an', reflexive: false, partizip2: 'angerufen',
  tables: {
    praesens: regularPraesens('rufen'),
    imperativ: regularImperativ('rufen', regularPraesens('rufen')),
    perfekt: buildPerfekt(HABEN_PRAESENS, 'angerufen'),
    ...EMPTY_TENSES,
  },
  examplesByPronoun: {
    praesens: {
      ich: { de: 'Ich rufe dich morgen an.', en: "I'll call you tomorrow." },
      du: { de: 'Du rufst mich nie an.', en: 'You never call me.' },
      er: { de: 'Er ruft seine Mutter jeden Sonntag an.', en: 'He calls his mother every Sunday.' },
      wir: { de: 'Wir rufen den Kundendienst an.', en: "We're calling customer service." },
      ihr: { de: 'Ihr ruft uns bitte vorher an.', en: 'Please call us beforehand.' },
      sie: { de: 'Sie rufen ein Taxi an.', en: "They're calling a taxi." },
    },
    ...EMPTY_EXAMPLES,
  },
  tags: ['separable, strong base "rufen" - regular praesens, hand-typed partizip2'],
};

const EINKAUFEN = {
  infinitive: 'einkaufen', english: 'to shop, to buy groceries', level: 'A1', type: 'weak', auxiliary: 'haben',
  separable: true, prefix: 'ein', reflexive: false, partizip2: regularPartizip2('kaufen', 'ein'),
  tables: {
    praesens: regularPraesens('kaufen'),
    imperativ: regularImperativ('kaufen', regularPraesens('kaufen')),
    perfekt: buildPerfekt(HABEN_PRAESENS, regularPartizip2('kaufen', 'ein')),
    ...EMPTY_TENSES,
  },
  examplesByPronoun: {
    praesens: {
      ich: { de: 'Ich kaufe samstags ein.', en: 'I go grocery shopping on Saturdays.' },
      du: { de: 'Du kaufst viel zu oft ein.', en: 'You go shopping way too often.' },
      er: { de: 'Er kauft für die ganze Woche ein.', en: "He's shopping for the whole week." },
      wir: { de: 'Wir kaufen zusammen im Supermarkt ein.', en: "We're shopping together at the supermarket." },
      ihr: { de: 'Ihr kauft schon wieder Chips ein?', en: 'You all are buying chips again?' },
      sie: { de: 'Sie kaufen online statt im Laden ein.', en: 'They shop online instead of in-store.' },
    },
    ...EMPTY_EXAMPLES,
  },
  tags: ['separable, weak base "kaufen" - fully regular praesens + partizip2'],
};

export const VERBS = [
  SEIN, HABEN, WERDEN,
  MACHEN, KAUFEN, WOHNEN, ARBEITEN,
  GEHEN, KOMMEN, BLEIBEN, SCHREIBEN, HEISSEN, TRINKEN, FINDEN, KENNEN,
  FAHREN, ESSEN, GEBEN, NEHMEN, SEHEN, LESEN, SPRECHEN, SCHLAFEN, LAUFEN, HELFEN, TREFFEN,
  KOENNEN, MUESSEN, WOLLEN, DUERFEN, SOLLEN, MOEGEN, WISSEN,
  AUFSTEHEN, ANRUFEN, EINKAUFEN,
];

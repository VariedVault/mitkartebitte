// The A1 + A2 verb core - ~59 verbs, each confirmed at its stated CEFR level against the
// official Goethe-Institut wordlists (reference only; no list content is reproduced here -
// every conjugation and example sentence below is authored independently for this app).
//
// FULL SCHEMA: every verb carries all eight tense slots so B1 only ever populates a field,
// never restructures one. This phase (A1+A2) fills praesens, imperativ, perfekt, and now
// praeteritum (added to the A1 core too - the "spiral revisit") - konjunktiv2/futur1/
// plusquamperfekt/passiv are still explicit `null` placeholders for B1.
//
// CORRECT BY CONSTRUCTION: every regular form below is a literal call into rules.js at
// module load, not a hand-typed string - see rules.js's header for why. Only genuinely
// irregular stems (stem-changers' du/er, strong/mixed ablaut, sein/haben/werden, the
// modals, wissen) are hand-typed string literals; scripts/verify.mjs re-derives every
// non-hand-flagged form and fails the build if a shipped form ever disagrees.
//
// REFLEXIVE VERBS store the bare base infinitive (e.g. 'fühlen', not 'sich fühlen') since
// rules.js's functions operate on that; `reflexive: true` plus rules.js's applyReflexive()
// bakes the reflexive pronoun into every stored form, and ui/verbUtils.js's
// displayInfinitive() prepends "sich " wherever the infinitive is shown to a learner.
//
// verb.tags carries a short REGULARITY NOTE for the per-verb review table in
// scripts/verify.mjs's output - not used by the UI.

import {
  PRONOUNS, regularPraesens, regularImperativ, regularPartizip2, buildPerfekt,
  regularPraeteritum, strongPraeteritumEndings, weakPraeteritumEndings, applyReflexive, REFLEXIVE_PRONOUNS,
  buildPlusquamperfekt, buildFutur1, buildWuerdeKonjunktiv2, buildPassiv, WUERDE_KONJUNKTIV2, withSeparablePrefix,
} from './rules.js';

export { PRONOUNS, REFLEXIVE_PRONOUNS };
// Re-exported so scripts/verify.mjs can cross-check "passiv is null IFF reflexive or
// intransitive" and "konjunktiv2 is hand-typed IFF in this map" as genuine regression
// guards against the source-of-truth data below, instead of duplicating these lists.
export { PASSIV_NOT_APPLICABLE, SYNTHETIC_KONJUNKTIV2 };

export const PRONOUN_LABELS = { ich: 'ich', du: 'du', er: 'er/sie/es', wir: 'wir', ihr: 'ihr', sie: 'sie/Sie' };

// Consistent accent color per pronoun, used everywhere a pronoun appears (memory aid).
export const PRONOUN_COLORS = {
  ich: '#FF6B6B', du: '#4ECDC4', er: '#FFD166', wir: '#6C8EFF', ihr: '#C77DFF', sie: '#5FD98A',
};

// The empty-schema shape every unfilled tense uses this phase - keeps `tables` a
// consistent 8-key object everywhere instead of some verbs having the key and others not.
const EMPTY_TENSES = {
  konjunktiv2: null,
  futur1: null,
  plusquamperfekt: null,
  passivPraesens: null,
  passivPraeteritum: null,
  passivPerfekt: null,
  passivZustand: null,
};
const EMPTY_EXAMPLES = {
  praeteritum: null, perfekt: null, konjunktiv2: null, futur1: null, plusquamperfekt: null,
  passivPraesens: null, passivPraeteritum: null, passivPerfekt: null, passivZustand: null,
};

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
    praeteritum: strongPraeteritumEndings('war'),
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
    praeteritum: weakPraeteritumEndings('hatte'),
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
    praeteritum: weakPraeteritumEndings('wurde'),
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

// ================================================================== B1: derived-tense fill pass
// Plusquamperfekt, Futur I, Konjunktiv II, and Passiv are all near-fully mechanical given
// data already on each verb (auxiliary, partizip2, infinitive) - rather than hand-writing
// 4 more lines into every one of the 56 non-auxiliary verb blocks above/below, this fills
// them in a single pass applied to the whole VERBS array once it's assembled (see the
// bottom of this file). Every verb block above/below stays exactly as authored through the
// A2 phase; this section is purely additive.

// Hand-typed, cross-checked against Wiktionary German conjugation tables (see the B1 phase
// report) - the one genuine exception to "derive, don't hand-type" in this section. Modern
// German defaults to würde + infinitive for every OTHER verb (buildWuerdeKonjunktiv2 below).
// du/ihr forms use the contracted variant EXCEPT for gehen/bleiben, where contracting would
// make the Konjunktiv II form string-identical to the Präteritum indicative (ging/gingst/
// gingt has no umlaut-able vowel to distinguish it; same for blieb/bliebst/bliebt) - the
// full -est/-et form is used there specifically to keep the two tenses distinguishable as
// separate flashcard answers, not just for archaic flavor.
const SYNTHETIC_KONJUNKTIV2 = {
  sein: { ich: 'wäre', du: 'wärst', er: 'wäre', wir: 'wären', ihr: 'wärt', sie: 'wären' },
  haben: { ich: 'hätte', du: 'hättest', er: 'hätte', wir: 'hätten', ihr: 'hättet', sie: 'hätten' },
  werden: WUERDE_KONJUNKTIV2,
  können: { ich: 'könnte', du: 'könntest', er: 'könnte', wir: 'könnten', ihr: 'könntet', sie: 'könnten' },
  müssen: { ich: 'müsste', du: 'müsstest', er: 'müsste', wir: 'müssten', ihr: 'müsstet', sie: 'müssten' },
  dürfen: { ich: 'dürfte', du: 'dürftest', er: 'dürfte', wir: 'dürften', ihr: 'dürftet', sie: 'dürften' },
  mögen: { ich: 'möchte', du: 'möchtest', er: 'möchte', wir: 'möchten', ihr: 'möchtet', sie: 'möchten' },
  sollen: { ich: 'sollte', du: 'solltest', er: 'sollte', wir: 'sollten', ihr: 'solltet', sie: 'sollten' },
  wollen: { ich: 'wollte', du: 'wolltest', er: 'wollte', wir: 'wollten', ihr: 'wolltet', sie: 'wollten' },
  gehen: { ich: 'ginge', du: 'gingest', er: 'ginge', wir: 'gingen', ihr: 'ginget', sie: 'gingen' },
  kommen: { ich: 'käme', du: 'kämst', er: 'käme', wir: 'kämen', ihr: 'kämt', sie: 'kämen' },
  geben: { ich: 'gäbe', du: 'gäbst', er: 'gäbe', wir: 'gäben', ihr: 'gäbt', sie: 'gäben' },
  wissen: { ich: 'wüsste', du: 'wüsstest', er: 'wüsste', wir: 'wüssten', ihr: 'wüsstet', sie: 'wüssten' },
  finden: { ich: 'fände', du: 'fändest', er: 'fände', wir: 'fänden', ihr: 'fändet', sie: 'fänden' },
  bleiben: { ich: 'bliebe', du: 'bliebest', er: 'bliebe', wir: 'blieben', ihr: 'bliebet', sie: 'blieben' },
};

// Verbs with no direct accusative object - either genuinely intransitive (gehen, wohnen,
// schlafen, ...), dative-only (helfen, zuhören - "*wird geholfen" retains the dative, it's
// never "jemand wird geholfen"), impersonal (geschehen), or the auxiliaries/modals
// themselves, where a personal passive is either ungrammatical or so vanishingly rare it
// would mislead a learner to present it as a normal form. Reflexive verbs are excluded from
// Passiv separately (via verb.reflexive) rather than listed here - their accusative slot is
// already the reflexive pronoun. buildPassiv() turns this into 4 explicit nulls, not a
// fabricated form.
const PASSIV_NOT_APPLICABLE = new Set([
  'sein', 'haben', 'werden', 'können', 'müssen', 'wollen', 'dürfen', 'sollen', 'mögen',
  'wohnen', 'arbeiten', 'gehen', 'kommen', 'bleiben', 'heißen', 'schlafen', 'laufen', 'aufstehen', 'helfen',
  'fallen', 'sterben', 'denken', 'zuhören', 'zurückkommen', 'umsteigen',
  'geschehen',
]);

const AUX_PRAETERITUM_TABLE = { haben: HABEN.tables.praeteritum, sein: SEIN.tables.praeteritum };

/** Mutates verb.tables in place, filling the four B1 tense slots from data the verb
 *  already carries. Called once over the fully-assembled VERBS array at the bottom of this
 *  file, so it runs after every verb block above/below has set its own praesens/imperativ/
 *  perfekt/praeteritum/partizip2/auxiliary/infinitive/reflexive fields. */
function fillDerivedTenses(verb) {
  verb.tables.plusquamperfekt = buildPlusquamperfekt(AUX_PRAETERITUM_TABLE[verb.auxiliary], verb.partizip2, verb.reflexive);
  verb.tables.futur1 = buildFutur1(WERDEN_PRAESENS, verb.infinitive, verb.reflexive);
  verb.tables.konjunktiv2 = SYNTHETIC_KONJUNKTIV2[verb.infinitive] ?? buildWuerdeKonjunktiv2(verb.infinitive, verb.reflexive);
  const transitive = !verb.reflexive && !PASSIV_NOT_APPLICABLE.has(verb.infinitive);
  const passiv = buildPassiv({
    werdenPraesens: WERDEN_PRAESENS,
    werdenPraeteritum: WERDEN.tables.praeteritum,
    seinPraesens: SEIN_PRAESENS,
    partizip2: verb.partizip2,
    transitive,
  });
  verb.tables.passivPraesens = passiv.passivPraesens;
  verb.tables.passivPraeteritum = passiv.passivPraeteritum;
  verb.tables.passivPerfekt = passiv.passivPerfekt;
  verb.tables.passivZustand = passiv.passivZustand;
}

// ---------------------------------------------------------------- fully regular (praesens + partizip2 both by rule)

const MACHEN = {
  infinitive: 'machen', english: 'to do, to make', level: 'A1', type: 'weak', auxiliary: 'haben',
  separable: false, reflexive: false, partizip2: regularPartizip2('machen'),
  tables: {
    praesens: regularPraesens('machen'),
    imperativ: regularImperativ('machen', regularPraesens('machen')),
    perfekt: buildPerfekt(HABEN_PRAESENS, regularPartizip2('machen')),
    praeteritum: regularPraeteritum('machen'),
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
    praeteritum: regularPraeteritum('kaufen'),
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
    praeteritum: regularPraeteritum('wohnen'),
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
    praeteritum: regularPraeteritum('arbeiten'),
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
    praeteritum: strongPraeteritumEndings('ging'),
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
    praeteritum: strongPraeteritumEndings('kam'),
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
    praeteritum: strongPraeteritumEndings('blieb'),
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
    praeteritum: strongPraeteritumEndings('schrieb'),
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
    praeteritum: strongPraeteritumEndings('hieß'),
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
    praeteritum: strongPraeteritumEndings('trank'),
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
    praeteritum: strongPraeteritumEndings('fand'),
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
    praeteritum: weakPraeteritumEndings('kannte'),
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
    praeteritum: strongPraeteritumEndings('fuhr'),
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
    praeteritum: strongPraeteritumEndings('aß'),
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
    praeteritum: strongPraeteritumEndings('gab'),
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
    praeteritum: strongPraeteritumEndings('nahm'),
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
    praeteritum: strongPraeteritumEndings('sah'),
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
    praeteritum: strongPraeteritumEndings('las'),
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
    praeteritum: strongPraeteritumEndings('sprach'),
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
    praeteritum: strongPraeteritumEndings('schlief'),
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
    praeteritum: strongPraeteritumEndings('lief'),
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
    praeteritum: strongPraeteritumEndings('half'),
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
    praeteritum: strongPraeteritumEndings('traf'),
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
    praeteritum: weakPraeteritumEndings('konnte'),
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
    praeteritum: weakPraeteritumEndings('musste'),
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
    praeteritum: weakPraeteritumEndings('wollte'),
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
    praeteritum: weakPraeteritumEndings('durfte'),
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
    praeteritum: weakPraeteritumEndings('sollte'),
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
    praeteritum: weakPraeteritumEndings('mochte'),
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
    praeteritum: weakPraeteritumEndings('wusste'),
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
    imperativ: withSeparablePrefix(regularImperativ('stehen', regularPraesens('stehen')), 'auf'),
    perfekt: buildPerfekt(SEIN_PRAESENS, 'aufgestanden'),
    praeteritum: strongPraeteritumEndings('stand'),
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
    imperativ: withSeparablePrefix(regularImperativ('rufen', regularPraesens('rufen')), 'an'),
    perfekt: buildPerfekt(HABEN_PRAESENS, 'angerufen'),
    praeteritum: strongPraeteritumEndings('rief'),
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
    imperativ: withSeparablePrefix(regularImperativ('kaufen', regularPraesens('kaufen')), 'ein'),
    perfekt: buildPerfekt(HABEN_PRAESENS, regularPartizip2('kaufen', 'ein')),
    praeteritum: regularPraeteritum('kaufen'),
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

// ================================================================== A2 CORE ==================================================================
// ~23 verbs, each individually checked against the DWDS/Goethe A2 wordlist
// (https://www.dwds.de/api/lemma/goethe/A2.csv) - several originally-proposed verbs
// turned out to be A1 (anfangen, verstehen, gefallen, empfehlen, waschen, anziehen,
// bringen, halten, schließen, freuen, treffen) or B1 (steigen, wachsen) per that source
// and were swapped out; see the phase report for the full swap list. None collide with
// an existing A1 infinitive.

// ---------------------------------------------------------------- strong (irregular praesens, hand-typed partizip2/praeteritum)

const TRAGEN = {
  infinitive: 'tragen', english: 'to carry, to wear', level: 'A2', type: 'strong', auxiliary: 'haben',
  separable: false, reflexive: false, partizip2: 'getragen',
  tables: {
    praesens: { ...regularPraesens('tragen'), du: 'trägst', er: 'trägt' },
    imperativ: regularImperativ('tragen', regularPraesens('tragen')), // a->ä changers use the UNCHANGED stem in imperativ
    perfekt: buildPerfekt(HABEN_PRAESENS, 'getragen'),
    praeteritum: strongPraeteritumEndings('trug'),
    ...EMPTY_TENSES,
  },
  examplesByPronoun: {
    praesens: {
      ich: { de: 'Ich trage eine neue Jacke.', en: "I'm wearing a new jacket." },
      du: { de: 'Du trägst immer die gleichen Schuhe.', en: 'You always wear the same shoes.' },
      er: { de: 'Er trägt die Tasche für seine Mutter.', en: "He's carrying the bag for his mother." },
      wir: { de: 'Wir tragen die Kisten in die Wohnung.', en: "We're carrying the boxes into the apartment." },
      ihr: { de: 'Ihr tragt heute alle Blau.', en: 'You all are wearing blue today.' },
      sie: { de: 'Sie tragen die Möbel in den zweiten Stock.', en: "They're carrying the furniture to the second floor." },
    },
    ...EMPTY_EXAMPLES,
  },
  tags: ['strong - irregular du/er stem (a->ä), hand-typed partizip2/praeteritum'],
};

const FALLEN = {
  infinitive: 'fallen', english: 'to fall', level: 'A2', type: 'strong', auxiliary: 'sein',
  separable: false, reflexive: false, partizip2: 'gefallen',
  tables: {
    praesens: { ...regularPraesens('fallen'), du: 'fällst', er: 'fällt' },
    imperativ: regularImperativ('fallen', regularPraesens('fallen')),
    perfekt: buildPerfekt(SEIN_PRAESENS, 'gefallen'),
    praeteritum: strongPraeteritumEndings('fiel'),
    ...EMPTY_TENSES,
  },
  examplesByPronoun: {
    praesens: {
      ich: { de: 'Ich falle fast hin.', en: 'I almost fall over.' },
      du: { de: 'Du fällst mir in die Arme.', en: 'You fall into my arms.' },
      er: { de: 'Er fällt vom Fahrrad.', en: 'He falls off his bike.' },
      wir: { de: 'Wir fallen beide gleichzeitig um.', en: 'We both fall over at the same time.' },
      ihr: { de: 'Ihr fallt ständig übereinander.', en: 'You all keep falling over each other.' },
      sie: { de: 'Sie fallen langsam in einen tiefen Schlaf.', en: 'They slowly fall into a deep sleep.' },
    },
    ...EMPTY_EXAMPLES,
  },
  tags: ['strong - irregular du/er stem (a->ä), hand-typed partizip2/praeteritum'],
};

const LASSEN = {
  infinitive: 'lassen', english: 'to let, to leave', level: 'A2', type: 'strong', auxiliary: 'haben',
  separable: false, reflexive: false, partizip2: 'gelassen',
  tables: {
    praesens: { ...regularPraesens('lassen'), du: 'lässt', er: 'lässt' },
    imperativ: regularImperativ('lassen', regularPraesens('lassen')),
    perfekt: buildPerfekt(HABEN_PRAESENS, 'gelassen'),
    praeteritum: strongPraeteritumEndings('ließ'),
    ...EMPTY_TENSES,
  },
  examplesByPronoun: {
    praesens: {
      ich: { de: 'Ich lasse das Fenster offen.', en: 'I leave the window open.' },
      du: { de: 'Du lässt mich nie in Ruhe.', en: 'You never leave me alone.' },
      er: { de: 'Er lässt seinen Hund im Garten.', en: 'He leaves his dog in the garden.' },
      wir: { de: 'Wir lassen die Kinder heute zu Hause.', en: "We're leaving the kids at home today." },
      ihr: { de: 'Ihr lasst eure Sachen überall liegen.', en: 'You all leave your things lying around everywhere.' },
      sie: { de: 'Sie lassen die Tür offen.', en: 'They leave the door open.' },
    },
    ...EMPTY_EXAMPLES,
  },
  tags: ['strong - irregular du/er stem (a->ä, s-contraction), hand-typed partizip2/praeteritum'],
};

const RUFEN = {
  infinitive: 'rufen', english: 'to call, to shout', level: 'A2', type: 'strong', auxiliary: 'haben',
  separable: false, reflexive: false, partizip2: 'gerufen',
  tables: {
    praesens: regularPraesens('rufen'),
    imperativ: regularImperativ('rufen', regularPraesens('rufen')),
    perfekt: buildPerfekt(HABEN_PRAESENS, 'gerufen'),
    praeteritum: strongPraeteritumEndings('rief'),
    ...EMPTY_TENSES,
  },
  examplesByPronoun: {
    praesens: {
      ich: { de: 'Ich rufe laut nach dir.', en: 'I call out loudly for you.' },
      du: { de: 'Du rufst mich immer zu spät.', en: 'You always call me too late.' },
      er: { de: 'Er ruft schnell einen Arzt.', en: 'He quickly calls a doctor.' },
      wir: { de: 'Wir rufen ein Taxi.', en: "We're calling a taxi." },
      ihr: { de: 'Ihr ruft viel zu laut.', en: 'You all are shouting way too loud.' },
      sie: { de: 'Sie rufen aus dem Fenster.', en: 'They call out from the window.' },
    },
    ...EMPTY_EXAMPLES,
  },
  tags: ['strong - regular praesens, hand-typed partizip2/praeteritum'],
};

const VERGESSEN = {
  infinitive: 'vergessen', english: 'to forget', level: 'A2', type: 'strong', auxiliary: 'haben',
  separable: false, reflexive: false, partizip2: 'vergessen', // inseparable ver- takes no ge-; coincidentally identical to the infinitive
  tables: {
    praesens: { ...regularPraesens('vergessen'), du: 'vergisst', er: 'vergisst' },
    imperativ: { ...regularImperativ('vergessen', regularPraesens('vergessen')), du: 'Vergiss!' },
    perfekt: buildPerfekt(HABEN_PRAESENS, 'vergessen'),
    praeteritum: strongPraeteritumEndings('vergaß'),
    ...EMPTY_TENSES,
  },
  examplesByPronoun: {
    praesens: {
      ich: { de: 'Ich vergesse oft meinen Schlüssel.', en: 'I often forget my key.' },
      du: { de: 'Du vergisst nie einen Geburtstag.', en: 'You never forget a birthday.' },
      er: { de: 'Er vergisst seinen Regenschirm im Bus.', en: 'He forgets his umbrella on the bus.' },
      wir: { de: 'Wir vergessen die Zeit beim Reden.', en: 'We lose track of time talking.' },
      ihr: { de: 'Ihr vergesst immer die Hausaufgaben.', en: 'You all always forget your homework.' },
      sie: { de: 'Sie vergessen den Termin.', en: 'They forget the appointment.' },
    },
    ...EMPTY_EXAMPLES,
  },
  tags: ['strong - irregular du/er stem (e->i, s-contraction), inseparable ver- (no ge-), hand-typed praeteritum'],
};

const VERLIEREN = {
  infinitive: 'verlieren', english: 'to lose', level: 'A2', type: 'strong', auxiliary: 'haben',
  separable: false, reflexive: false, partizip2: 'verloren', // inseparable ver-, no ge-
  tables: {
    praesens: regularPraesens('verlieren'),
    imperativ: regularImperativ('verlieren', regularPraesens('verlieren')),
    perfekt: buildPerfekt(HABEN_PRAESENS, 'verloren'),
    praeteritum: strongPraeteritumEndings('verlor'),
    ...EMPTY_TENSES,
  },
  examplesByPronoun: {
    praesens: {
      ich: { de: 'Ich verliere ständig meine Schlüssel.', en: 'I constantly lose my keys.' },
      du: { de: 'Du verlierst nie die Geduld.', en: 'You never lose your patience.' },
      er: { de: 'Er verliert das Spiel knapp.', en: 'He loses the game narrowly.' },
      wir: { de: 'Wir verlieren langsam die Orientierung.', en: "We're slowly losing our bearings." },
      ihr: { de: 'Ihr verliert wieder beim Kartenspiel.', en: 'You all are losing at cards again.' },
      sie: { de: 'Sie verlieren kein einziges Spiel.', en: "They don't lose a single game." },
    },
    ...EMPTY_EXAMPLES,
  },
  tags: ['strong - regular praesens, inseparable ver- (no ge-), hand-typed praeteritum'],
};

const BESCHREIBEN = {
  infinitive: 'beschreiben', english: 'to describe', level: 'A2', type: 'strong', auxiliary: 'haben',
  separable: false, reflexive: false, partizip2: 'beschrieben', // inseparable be-, no ge-
  tables: {
    praesens: regularPraesens('beschreiben'),
    imperativ: regularImperativ('beschreiben', regularPraesens('beschreiben')),
    perfekt: buildPerfekt(HABEN_PRAESENS, 'beschrieben'),
    praeteritum: strongPraeteritumEndings('beschrieb'),
    ...EMPTY_TENSES,
  },
  examplesByPronoun: {
    praesens: {
      ich: { de: 'Ich beschreibe den Weg zum Bahnhof.', en: 'I describe the way to the station.' },
      du: { de: 'Du beschreibst das Problem sehr genau.', en: 'You describe the problem very precisely.' },
      er: { de: 'Er beschreibt seine Wohnung im Detail.', en: 'He describes his apartment in detail.' },
      wir: { de: 'Wir beschreiben unsere Erfahrungen.', en: 'We describe our experiences.' },
      ihr: { de: 'Ihr beschreibt die Situation ganz anders.', en: 'You all describe the situation quite differently.' },
      sie: { de: 'Sie beschreiben den Täter der Polizei.', en: 'They describe the culprit to the police.' },
    },
    ...EMPTY_EXAMPLES,
  },
  tags: ['strong - regular praesens, inseparable be- (no ge-), hand-typed praeteritum'],
};

const SINGEN = {
  infinitive: 'singen', english: 'to sing', level: 'A2', type: 'strong', auxiliary: 'haben',
  separable: false, reflexive: false, partizip2: 'gesungen',
  tables: {
    praesens: regularPraesens('singen'),
    imperativ: regularImperativ('singen', regularPraesens('singen')),
    perfekt: buildPerfekt(HABEN_PRAESENS, 'gesungen'),
    praeteritum: strongPraeteritumEndings('sang'),
    ...EMPTY_TENSES,
  },
  examplesByPronoun: {
    praesens: {
      ich: { de: 'Ich singe gern unter der Dusche.', en: 'I like singing in the shower.' },
      du: { de: 'Du singst wirklich schön.', en: 'You sing really beautifully.' },
      er: { de: 'Er singt in einem Chor.', en: 'He sings in a choir.' },
      wir: { de: 'Wir singen zusammen ein Lied.', en: "We're singing a song together." },
      ihr: { de: 'Ihr singt viel zu laut.', en: 'You all are singing way too loud.' },
      sie: { de: 'Sie singen bei jeder Party.', en: 'They sing at every party.' },
    },
    ...EMPTY_EXAMPLES,
  },
  tags: ['strong - regular praesens, hand-typed partizip2/praeteritum'],
};

const SCHNEIDEN = {
  infinitive: 'schneiden', english: 'to cut', level: 'A2', type: 'strong', auxiliary: 'haben',
  separable: false, reflexive: false, partizip2: 'geschnitten',
  tables: {
    praesens: regularPraesens('schneiden'),
    imperativ: regularImperativ('schneiden', regularPraesens('schneiden')),
    perfekt: buildPerfekt(HABEN_PRAESENS, 'geschnitten'),
    praeteritum: strongPraeteritumEndings('schnitt'),
    ...EMPTY_TENSES,
  },
  examplesByPronoun: {
    praesens: {
      ich: { de: 'Ich schneide das Gemüse klein.', en: 'I cut the vegetables into small pieces.' },
      du: { de: 'Du schneidest dir die Haare selbst.', en: 'You cut your own hair.' },
      er: { de: 'Er schneidet das Brot in Scheiben.', en: 'He cuts the bread into slices.' },
      wir: { de: 'Wir schneiden den Kuchen in acht Stücke.', en: 'We cut the cake into eight pieces.' },
      ihr: { de: 'Ihr schneidet die Pizza in Stücke.', en: 'You all cut the pizza into pieces.' },
      sie: { de: 'Sie schneiden die Blumen im Garten.', en: 'They cut the flowers in the garden.' },
    },
    ...EMPTY_EXAMPLES,
  },
  tags: ['strong - regular praesens (linking-e stem), hand-typed partizip2/praeteritum'],
};

const STERBEN = {
  infinitive: 'sterben', english: 'to die', level: 'A2', type: 'strong', auxiliary: 'sein',
  separable: false, reflexive: false, partizip2: 'gestorben',
  tables: {
    praesens: { ...regularPraesens('sterben'), du: 'stirbst', er: 'stirbt' },
    imperativ: { ...regularImperativ('sterben', regularPraesens('sterben')), du: 'Stirb!' },
    perfekt: buildPerfekt(SEIN_PRAESENS, 'gestorben'),
    praeteritum: strongPraeteritumEndings('starb'),
    ...EMPTY_TENSES,
  },
  examplesByPronoun: {
    // All idiomatic "sterben vor X" (to be dying of X) - common, light hyperbole, not literal.
    praesens: {
      ich: { de: 'Ich sterbe fast vor Hunger.', en: "I'm practically dying of hunger." },
      du: { de: 'Du stirbst noch vor Lachen.', en: "You'll die laughing." },
      er: { de: 'Er stirbt fast vor Langeweile.', en: "He's practically dying of boredom." },
      wir: { de: 'Wir sterben vor Neugier.', en: "We're dying of curiosity." },
      ihr: { de: 'Ihr sterbt wohl vor Durst.', en: 'You all must be dying of thirst.' },
      sie: { de: 'Sie sterben fast vor Aufregung.', en: "They're practically dying of excitement." },
    },
    ...EMPTY_EXAMPLES,
  },
  tags: ['strong - irregular du/er stem (e->i), hand-typed partizip2/praeteritum'],
};

// ---------------------------------------------------------------- mixed (regular praesens, hand-typed praeteritum/partizip2)

const DENKEN = {
  infinitive: 'denken', english: 'to think', level: 'A2', type: 'mixed', auxiliary: 'haben',
  separable: false, reflexive: false, partizip2: 'gedacht',
  tables: {
    praesens: regularPraesens('denken'),
    imperativ: regularImperativ('denken', regularPraesens('denken')),
    perfekt: buildPerfekt(HABEN_PRAESENS, 'gedacht'),
    praeteritum: weakPraeteritumEndings('dachte'),
    ...EMPTY_TENSES,
  },
  examplesByPronoun: {
    praesens: {
      ich: { de: 'Ich denke oft an dich.', en: 'I often think of you.' },
      du: { de: 'Du denkst zu viel nach.', en: 'You overthink things.' },
      er: { de: 'Er denkt über das Angebot nach.', en: "He's thinking over the offer." },
      wir: { de: 'Wir denken an den Urlaub.', en: "We're thinking about the vacation." },
      ihr: { de: 'Ihr denkt immer positiv.', en: 'You all always think positively.' },
      sie: { de: 'Sie denken gemeinsam über die Lösung nach.', en: 'They think about the solution together.' },
    },
    ...EMPTY_EXAMPLES,
  },
  tags: ['mixed - regular praesens, hand-typed partizip2/praeteritum (ablaut)'],
};

const NENNEN = {
  infinitive: 'nennen', english: 'to name, to call', level: 'A2', type: 'mixed', auxiliary: 'haben',
  separable: false, reflexive: false, partizip2: 'genannt',
  tables: {
    praesens: regularPraesens('nennen'),
    imperativ: regularImperativ('nennen', regularPraesens('nennen')),
    perfekt: buildPerfekt(HABEN_PRAESENS, 'genannt'),
    praeteritum: weakPraeteritumEndings('nannte'),
    ...EMPTY_TENSES,
  },
  examplesByPronoun: {
    praesens: {
      ich: { de: 'Ich nenne meinen Sohn Max.', en: "I'm naming my son Max." },
      du: { de: 'Du nennst mich immer "Schatz".', en: 'You always call me "honey".' },
      er: { de: 'Er nennt das Problem beim Namen.', en: 'He addresses the problem directly.' },
      wir: { de: 'Wir nennen unser Boot "Freiheit".', en: 'We\'re naming our boat "Freedom".' },
      ihr: { de: 'Ihr nennt eure Katze Minka.', en: 'You all are naming your cat Minka.' },
      sie: { de: 'Sie nennen ihn einfach "Chef".', en: 'They just call him "boss".' },
    },
    ...EMPTY_EXAMPLES,
  },
  tags: ['mixed - regular praesens, hand-typed partizip2/praeteritum (ablaut)'],
};

// ---------------------------------------------------------------- fully regular weak

const PLANEN = {
  infinitive: 'planen', english: 'to plan', level: 'A2', type: 'weak', auxiliary: 'haben',
  separable: false, reflexive: false, partizip2: regularPartizip2('planen'),
  tables: {
    praesens: regularPraesens('planen'),
    imperativ: regularImperativ('planen', regularPraesens('planen')),
    perfekt: buildPerfekt(HABEN_PRAESENS, regularPartizip2('planen')),
    praeteritum: regularPraeteritum('planen'),
    ...EMPTY_TENSES,
  },
  examplesByPronoun: {
    praesens: {
      ich: { de: 'Ich plane die ganze Reise allein.', en: "I'm planning the whole trip alone." },
      du: { de: 'Du planst immer sehr genau.', en: 'You always plan very precisely.' },
      er: { de: 'Er plant eine große Überraschung.', en: "He's planning a big surprise." },
      wir: { de: 'Wir planen unsere Hochzeit.', en: "We're planning our wedding." },
      ihr: { de: 'Ihr plant zu viel auf einmal.', en: 'You all are planning too much at once.' },
      sie: { de: 'Sie planen ein neues Projekt.', en: "They're planning a new project." },
    },
    ...EMPTY_EXAMPLES,
  },
  tags: ['regular - rule-generated'],
};

const PROBIEREN = {
  infinitive: 'probieren', english: 'to try', level: 'A2', type: 'weak', auxiliary: 'haben',
  separable: false, reflexive: false, partizip2: 'probiert', // -ieren verbs take NO ge- in partizip2 (a general rule this phase hand-types rather than adding a single-case rule-engine branch for)
  tables: {
    praesens: regularPraesens('probieren'),
    imperativ: regularImperativ('probieren', regularPraesens('probieren')),
    perfekt: buildPerfekt(HABEN_PRAESENS, 'probiert'),
    praeteritum: regularPraeteritum('probieren'),
    ...EMPTY_TENSES,
  },
  examplesByPronoun: {
    praesens: {
      ich: { de: 'Ich probiere die neue Suppe.', en: "I'm trying the new soup." },
      du: { de: 'Du probierst den Kuchen.', en: "You're trying the cake." },
      er: { de: 'Er probiert den neuen Kaffee.', en: "He's trying the new coffee." },
      wir: { de: 'Wir probieren das Restaurant zum ersten Mal.', en: "We're trying the restaurant for the first time." },
      ihr: { de: 'Ihr probiert alle Sorten.', en: "You all are trying every flavor." },
      sie: { de: 'Sie probieren das Gericht vorsichtig.', en: 'They cautiously try the dish.' },
    },
    ...EMPTY_EXAMPLES,
  },
  tags: ['regular - rule-generated praesens/praeteritum, hand-typed partizip2 (-ieren verbs take no ge-)'],
};

// ---------------------------------------------------------------- separable

const AUFRAEUMEN = {
  infinitive: 'aufräumen', english: 'to tidy up', level: 'A2', type: 'weak', auxiliary: 'haben',
  separable: true, prefix: 'auf', reflexive: false, partizip2: regularPartizip2('räumen', 'auf'),
  tables: {
    praesens: regularPraesens('räumen'),
    imperativ: withSeparablePrefix(regularImperativ('räumen', regularPraesens('räumen')), 'auf'),
    perfekt: buildPerfekt(HABEN_PRAESENS, regularPartizip2('räumen', 'auf')),
    praeteritum: regularPraeteritum('räumen'),
    ...EMPTY_TENSES,
  },
  examplesByPronoun: {
    praesens: {
      ich: { de: 'Ich räume mein Zimmer auf.', en: "I'm tidying up my room." },
      du: { de: 'Du räumst nie deinen Schreibtisch auf.', en: 'You never tidy up your desk.' },
      er: { de: 'Er räumt die Küche nach dem Essen auf.', en: 'He tidies the kitchen after eating.' },
      wir: { de: 'Wir räumen zusammen die Wohnung auf.', en: "We're tidying the apartment together." },
      ihr: { de: 'Ihr räumt eure Sachen bitte auf.', en: 'Please tidy up your things.' },
      sie: { de: 'Sie räumen den Keller auf.', en: "They're tidying up the basement." },
    },
    ...EMPTY_EXAMPLES,
  },
  tags: ['separable, weak base "räumen" - fully regular praesens/partizip2/praeteritum'],
};

const ZUMACHEN = {
  infinitive: 'zumachen', english: 'to close', level: 'A2', type: 'weak', auxiliary: 'haben',
  separable: true, prefix: 'zu', reflexive: false, partizip2: regularPartizip2('machen', 'zu'),
  tables: {
    praesens: regularPraesens('machen'),
    imperativ: withSeparablePrefix(regularImperativ('machen', regularPraesens('machen')), 'zu'),
    perfekt: buildPerfekt(HABEN_PRAESENS, regularPartizip2('machen', 'zu')),
    praeteritum: regularPraeteritum('machen'),
    ...EMPTY_TENSES,
  },
  examplesByPronoun: {
    praesens: {
      ich: { de: 'Ich mache das Fenster zu.', en: "I'm closing the window." },
      du: { de: 'Du machst die Tür nicht zu.', en: "You don't close the door." },
      er: { de: 'Er macht den Laden um acht zu.', en: 'He closes the shop at eight.' },
      wir: { de: 'Wir machen den Koffer zu.', en: "We're closing the suitcase." },
      ihr: { de: 'Ihr macht die Augen zu.', en: 'You all close your eyes.' },
      sie: { de: 'Sie machen das Geschäft früh zu.', en: 'They close the store early.' },
    },
    ...EMPTY_EXAMPLES,
  },
  tags: ['separable, weak base "machen" (shared with A1 machen) - fully regular'],
};

const ZUHOEREN = {
  infinitive: 'zuhören', english: 'to listen', level: 'A2', type: 'weak', auxiliary: 'haben',
  separable: true, prefix: 'zu', reflexive: false, partizip2: regularPartizip2('hören', 'zu'),
  tables: {
    praesens: regularPraesens('hören'),
    imperativ: withSeparablePrefix(regularImperativ('hören', regularPraesens('hören')), 'zu'),
    perfekt: buildPerfekt(HABEN_PRAESENS, regularPartizip2('hören', 'zu')),
    praeteritum: regularPraeteritum('hören'),
    ...EMPTY_TENSES,
  },
  examplesByPronoun: {
    praesens: {
      ich: { de: 'Ich höre dir aufmerksam zu.', en: "I'm listening to you attentively." },
      du: { de: 'Du hörst nie richtig zu.', en: 'You never really listen.' },
      er: { de: 'Er hört dem Lehrer genau zu.', en: 'He listens carefully to the teacher.' },
      wir: { de: 'Wir hören der Musik zu.', en: "We're listening to the music." },
      ihr: { de: 'Ihr hört gar nicht zu.', en: "You all aren't listening at all." },
      sie: { de: 'Sie hören dem Vortrag zu.', en: 'They listen to the lecture.' },
    },
    ...EMPTY_EXAMPLES,
  },
  tags: ['separable, weak base "hören" - fully regular praesens/partizip2/praeteritum'],
};

const ZURUECKKOMMEN = {
  infinitive: 'zurückkommen', english: 'to come back', level: 'A2', type: 'strong', auxiliary: 'sein',
  separable: true, prefix: 'zurück', reflexive: false, partizip2: 'zurückgekommen',
  tables: {
    praesens: regularPraesens('kommen'), // base shared with A1's kommen - already regular praesens
    imperativ: withSeparablePrefix(regularImperativ('kommen', regularPraesens('kommen')), 'zurück'),
    perfekt: buildPerfekt(SEIN_PRAESENS, 'zurückgekommen'),
    praeteritum: strongPraeteritumEndings('kam'),
    ...EMPTY_TENSES,
  },
  examplesByPronoun: {
    praesens: {
      ich: { de: 'Ich komme morgen zurück.', en: "I'm coming back tomorrow." },
      du: { de: 'Du kommst viel zu spät zurück.', en: 'You come back way too late.' },
      er: { de: 'Er kommt aus dem Urlaub zurück.', en: "He's coming back from vacation." },
      wir: { de: 'Wir kommen nächste Woche zurück.', en: "We're coming back next week." },
      ihr: { de: 'Ihr kommt hoffentlich bald zurück.', en: 'Hopefully you all come back soon.' },
      sie: { de: 'Sie kommen gemeinsam zurück.', en: 'They come back together.' },
    },
    ...EMPTY_EXAMPLES,
  },
  tags: ['separable, strong base "kommen" (shared with A1 kommen) - hand-typed partizip2/praeteritum'],
};

const ZURUECKGEBEN = {
  infinitive: 'zurückgeben', english: 'to give back', level: 'A2', type: 'strong', auxiliary: 'haben',
  separable: true, prefix: 'zurück', reflexive: false, partizip2: 'zurückgegeben',
  tables: {
    praesens: { ...regularPraesens('geben'), du: 'gibst', er: 'gibt' }, // base shared with A1's geben
    imperativ: withSeparablePrefix({ ...regularImperativ('geben', regularPraesens('geben')), du: 'Gib!' }, 'zurück'),
    perfekt: buildPerfekt(HABEN_PRAESENS, 'zurückgegeben'),
    praeteritum: strongPraeteritumEndings('gab'),
    ...EMPTY_TENSES,
  },
  examplesByPronoun: {
    praesens: {
      ich: { de: 'Ich gebe dir das Buch morgen zurück.', en: "I'll give you the book back tomorrow." },
      du: { de: 'Du gibst mir nie mein Geld zurück.', en: 'You never give me my money back.' },
      er: { de: 'Er gibt der Verkäuferin das Kleid zurück.', en: 'He gives the dress back to the saleswoman.' },
      wir: { de: 'Wir geben die Schlüssel am Ende zurück.', en: 'We give the keys back at the end.' },
      ihr: { de: 'Ihr gebt das Auto pünktlich zurück.', en: 'You all return the car on time.' },
      sie: { de: 'Sie geben die Bücher in die Bibliothek zurück.', en: 'They return the books to the library.' },
    },
    ...EMPTY_EXAMPLES,
  },
  tags: ['separable, strong base "geben" (shared with A1 geben) - hand-typed partizip2/praeteritum'],
};

const UMSTEIGEN = {
  infinitive: 'umsteigen', english: 'to change (trains, transport)', level: 'A2', type: 'strong', auxiliary: 'sein',
  separable: true, prefix: 'um', reflexive: false, partizip2: 'umgestiegen',
  tables: {
    praesens: regularPraesens('steigen'), // new base this phase - regular praesens (no stem vowel change)
    imperativ: withSeparablePrefix(regularImperativ('steigen', regularPraesens('steigen')), 'um'),
    perfekt: buildPerfekt(SEIN_PRAESENS, 'umgestiegen'),
    praeteritum: strongPraeteritumEndings('stieg'),
    ...EMPTY_TENSES,
  },
  examplesByPronoun: {
    praesens: {
      ich: { de: 'Ich steige in Frankfurt um.', en: 'I change trains in Frankfurt.' },
      du: { de: 'Du steigst an der falschen Station um.', en: 'You change trains at the wrong station.' },
      er: { de: 'Er steigt schnell in den nächsten Zug um.', en: 'He quickly changes to the next train.' },
      wir: { de: 'Wir steigen zweimal um.', en: 'We change trains twice.' },
      ihr: { de: 'Ihr steigt hier in die U-Bahn um.', en: 'You all change to the subway here.' },
      sie: { de: 'Sie steigen am Hauptbahnhof um.', en: 'They change trains at the main station.' },
    },
    ...EMPTY_EXAMPLES,
  },
  tags: ['separable, strong base "steigen" (new base this phase) - regular praesens, hand-typed partizip2/praeteritum'],
};

// ---------------------------------------------------------------- reflexive

const FUEHLEN_SICH = {
  infinitive: 'fühlen', english: 'to feel', level: 'A2', type: 'weak', auxiliary: 'haben',
  separable: false, reflexive: true, partizip2: regularPartizip2('fühlen'),
  tables: {
    praesens: applyReflexive(regularPraesens('fühlen')),
    imperativ: applyReflexive(regularImperativ('fühlen', regularPraesens('fühlen'))),
    perfekt: buildPerfekt(HABEN_PRAESENS, regularPartizip2('fühlen'), true),
    praeteritum: applyReflexive(regularPraeteritum('fühlen')),
    ...EMPTY_TENSES,
  },
  examplesByPronoun: {
    praesens: {
      ich: { de: 'Ich fühle mich heute sehr gut.', en: 'I feel very good today.' },
      du: { de: 'Du fühlst dich schon besser, oder?', en: "You're feeling better already, right?" },
      er: { de: 'Er fühlt sich nicht wohl.', en: "He doesn't feel well." },
      wir: { de: 'Wir fühlen uns hier zu Hause.', en: 'We feel at home here.' },
      ihr: { de: 'Ihr fühlt euch sicher müde.', en: 'You all surely feel tired.' },
      sie: { de: 'Sie fühlen sich in der neuen Stadt wohl.', en: 'They feel comfortable in the new city.' },
    },
    ...EMPTY_EXAMPLES,
  },
  tags: ['reflexive, regular - rule-generated then reflexive pronoun applied'],
};

const AERGERN_SICH = {
  infinitive: 'ärgern', english: 'to get annoyed, to be angry', level: 'A2', type: 'weak', auxiliary: 'haben',
  separable: false, reflexive: true, partizip2: regularPartizip2('ärgern'),
  tables: {
    praesens: applyReflexive(regularPraesens('ärgern')),
    imperativ: applyReflexive(regularImperativ('ärgern', regularPraesens('ärgern'))),
    perfekt: buildPerfekt(HABEN_PRAESENS, regularPartizip2('ärgern'), true),
    praeteritum: applyReflexive(regularPraeteritum('ärgern')),
    ...EMPTY_TENSES,
  },
  examplesByPronoun: {
    praesens: {
      ich: { de: 'Ich ärgere mich über den Verkehr.', en: 'I get annoyed about the traffic.' },
      du: { de: 'Du ärgerst dich zu schnell.', en: 'You get annoyed too quickly.' },
      er: { de: 'Er ärgert sich über den Fehler.', en: "He's annoyed about the mistake." },
      wir: { de: 'Wir ärgern uns über das Wetter.', en: "We're annoyed about the weather." },
      ihr: { de: 'Ihr ärgert euch wegen Kleinigkeiten.', en: 'You all get annoyed over small things.' },
      sie: { de: 'Sie ärgern sich über den Nachbarn.', en: "They're annoyed about the neighbor." },
    },
    ...EMPTY_EXAMPLES,
  },
  tags: ['reflexive, regular -eln/-ern class - rule-generated then reflexive pronoun applied'],
};

const VERABREDEN_SICH = {
  infinitive: 'verabreden', english: 'to arrange to meet', level: 'A2', type: 'weak', auxiliary: 'haben',
  separable: false, reflexive: true, partizip2: 'verabredet', // inseparable ver-, no ge- (would otherwise be regular)
  tables: {
    praesens: applyReflexive(regularPraesens('verabreden')),
    imperativ: applyReflexive(regularImperativ('verabreden', regularPraesens('verabreden'))),
    perfekt: buildPerfekt(HABEN_PRAESENS, 'verabredet', true),
    praeteritum: applyReflexive(regularPraeteritum('verabreden')),
    ...EMPTY_TENSES,
  },
  examplesByPronoun: {
    praesens: {
      ich: { de: 'Ich verabrede mich mit meiner Freundin.', en: "I'm arranging to meet my friend." },
      du: { de: 'Du verabredest dich schon wieder mit ihm?', en: "You're meeting up with him again?" },
      er: { de: 'Er verabredet sich zum Kaffee.', en: 'He arranges to meet for coffee.' },
      wir: { de: 'Wir verabreden uns für Samstag.', en: 'We arrange to meet on Saturday.' },
      ihr: { de: 'Ihr verabredet euch zu oft ohne mich.', en: 'You all arrange to meet too often without me.' },
      sie: { de: 'Sie verabreden sich im Park.', en: 'They arrange to meet in the park.' },
    },
    ...EMPTY_EXAMPLES,
  },
  tags: ['reflexive, regular praesens/praeteritum, inseparable ver- (no ge-) hand-typed partizip2'],
};

// ================================================================== B1 CORE ==================================================================
// 20 verbs, each individually checked against the DWDS/Goethe B1 wordlist
// (https://www.dwds.de/api/lemma/goethe/B1.csv) - several originally-proposed verbs turned
// out to be A1 (bekommen, beschreiben [already in our A2 core], erklären, gehören,
// wiederholen, benutzen) or A2 (erreichen, versuchen, vergleichen) per that source and were
// swapped out; see the phase report for the full swap list. None collide with an existing
// A1/A2 infinitive.

// ---------------------------------------------------------------- strong (irregular praesens and/or hand-typed partizip2/praeteritum)

const ENTSCHEIDEN = {
  infinitive: 'entscheiden', english: 'to decide', level: 'B1', type: 'strong', auxiliary: 'haben',
  separable: false, reflexive: false, partizip2: 'entschieden', // inseparable ent-, no ge-
  tables: {
    praesens: regularPraesens('entscheiden'),
    imperativ: regularImperativ('entscheiden', regularPraesens('entscheiden')),
    perfekt: buildPerfekt(HABEN_PRAESENS, 'entschieden'),
    praeteritum: strongPraeteritumEndings('entschied'),
    ...EMPTY_TENSES,
  },
  examplesByPronoun: {
    praesens: {
      ich: { de: 'Ich entscheide diese Frage allein.', en: "I'm deciding this question alone." },
      du: { de: 'Du entscheidest zu schnell.', en: 'You decide too quickly.' },
      er: { de: 'Er entscheidet über das Budget.', en: "He's deciding on the budget." },
      wir: { de: 'Wir entscheiden gemeinsam.', en: "We're deciding together." },
      ihr: { de: 'Ihr entscheidet heute noch.', en: "You all are deciding today." },
      sie: { de: 'Sie entscheiden den Streit.', en: 'They decide the dispute.' },
    },
    ...EMPTY_EXAMPLES,
  },
  tags: ['strong - regular praesens, inseparable ent- (no ge-), hand-typed praeteritum'],
};

const UNTERSCHEIDEN = {
  infinitive: 'unterscheiden', english: 'to distinguish', level: 'B1', type: 'strong', auxiliary: 'haben',
  separable: false, reflexive: false, partizip2: 'unterschieden', // inseparable unter-, no ge-
  tables: {
    praesens: regularPraesens('unterscheiden'),
    imperativ: regularImperativ('unterscheiden', regularPraesens('unterscheiden')),
    perfekt: buildPerfekt(HABEN_PRAESENS, 'unterschieden'),
    praeteritum: strongPraeteritumEndings('unterschied'),
    ...EMPTY_TENSES,
  },
  examplesByPronoun: {
    praesens: {
      ich: { de: 'Ich unterscheide die beiden Farben kaum.', en: "I barely distinguish the two colors." },
      du: { de: 'Du unterscheidest die Zwillinge sofort.', en: 'You tell the twins apart immediately.' },
      er: { de: 'Er unterscheidet gut zwischen den Optionen.', en: 'He distinguishes well between the options.' },
      wir: { de: 'Wir unterscheiden zwei Arten von Fehlern.', en: 'We distinguish two kinds of mistakes.' },
      ihr: { de: 'Ihr unterscheidet die Stile nicht.', en: "You all don't distinguish the styles." },
      sie: { de: 'Sie unterscheiden die Dialekte genau.', en: 'They distinguish the dialects precisely.' },
    },
    ...EMPTY_EXAMPLES,
  },
  tags: ['strong - regular praesens, inseparable unter- (no ge-), hand-typed praeteritum'],
};

const BEWEISEN = {
  infinitive: 'beweisen', english: 'to prove', level: 'B1', type: 'strong', auxiliary: 'haben',
  separable: false, reflexive: false, partizip2: 'bewiesen', // inseparable be-, no ge-
  tables: {
    praesens: regularPraesens('beweisen'),
    imperativ: regularImperativ('beweisen', regularPraesens('beweisen')),
    perfekt: buildPerfekt(HABEN_PRAESENS, 'bewiesen'),
    praeteritum: strongPraeteritumEndings('bewies'),
    ...EMPTY_TENSES,
  },
  examplesByPronoun: {
    praesens: {
      ich: { de: 'Ich beweise meine Unschuld.', en: "I'm proving my innocence." },
      du: { de: 'Du beweist deinen Mut.', en: 'You prove your courage.' },
      er: { de: 'Er beweist die Theorie mathematisch.', en: 'He proves the theory mathematically.' },
      wir: { de: 'Wir beweisen unseren Standpunkt.', en: "We're proving our point." },
      ihr: { de: 'Ihr beweist mir gar nichts.', en: "You all aren't proving anything to me." },
      sie: { de: 'Sie beweisen ihre Fähigkeiten.', en: 'They prove their abilities.' },
    },
    ...EMPTY_EXAMPLES,
  },
  tags: ['strong - regular praesens (s-stem contraction), inseparable be- (no ge-), hand-typed praeteritum'],
};

const EMPFANGEN = {
  infinitive: 'empfangen', english: 'to receive (a guest/signal)', level: 'B1', type: 'strong', auxiliary: 'haben',
  separable: false, reflexive: false, partizip2: 'empfangen', // inseparable emp-, no ge-; identical to infinitive like vergessen
  tables: {
    praesens: { ...regularPraesens('empfangen'), du: 'empfängst', er: 'empfängt' },
    imperativ: regularImperativ('empfangen', regularPraesens('empfangen')), // a->ä changers use the UNCHANGED stem in imperativ
    perfekt: buildPerfekt(HABEN_PRAESENS, 'empfangen'),
    praeteritum: strongPraeteritumEndings('empfing'),
    ...EMPTY_TENSES,
  },
  examplesByPronoun: {
    praesens: {
      ich: { de: 'Ich empfange die Gäste an der Tür.', en: "I'm receiving the guests at the door." },
      du: { de: 'Du empfängst das Signal nicht.', en: "You're not receiving the signal." },
      er: { de: 'Er empfängt den Besuch sehr herzlich.', en: 'He welcomes the visit very warmly.' },
      wir: { de: 'Wir empfangen den neuen Kollegen.', en: "We're welcoming the new colleague." },
      ihr: { de: 'Ihr empfangt uns immer so freundlich.', en: 'You all always welcome us so kindly.' },
      sie: { de: 'Sie empfangen den Präsidenten am Flughafen.', en: 'They receive the president at the airport.' },
    },
    ...EMPTY_EXAMPLES,
  },
  tags: ['strong - irregular du/er stem (a->ä), inseparable emp- (no ge-), hand-typed praeteritum'],
};

const GESCHEHEN = {
  infinitive: 'geschehen', english: 'to happen', level: 'B1', type: 'strong', auxiliary: 'sein',
  separable: false, reflexive: false, partizip2: 'geschehen', // inseparable ge-, no additional ge-
  tables: {
    praesens: { ...regularPraesens('geschehen'), du: 'geschiehst', er: 'geschieht' },
    imperativ: regularImperativ('geschehen', regularPraesens('geschehen')),
    perfekt: buildPerfekt(SEIN_PRAESENS, 'geschehen'),
    praeteritum: strongPraeteritumEndings('geschah'),
    ...EMPTY_TENSES,
  },
  // Usage note (flagged for review): geschehen is almost always used impersonally/in the
  // 3rd person ("es geschieht", "solche Dinge geschehen") - Wiktionary itself notes
  // ich/du/wir/ihr forms are "very rare, though not impossible." The forms below are
  // grammatically correct but stylistically marked/literary for those persons - included
  // for schema completeness and because the rule engine + Wiktionary both confirm the
  // forms are valid, not because they're common conversational German.
  examplesByPronoun: {
    praesens: {
      ich: { de: 'Ich geschehe jeden Tag ein bisschen neu.', en: 'I happen anew a little each day.' },
      du: { de: 'Du geschiehst mir wie ein Wunder.', en: 'You happen to me like a miracle.' },
      er: { de: 'Er geschieht nicht einfach so.', en: "It doesn't just happen (of its own accord)." },
      wir: { de: 'Wir geschehen einander jeden Tag neu.', en: 'We happen to each other anew every day.' },
      ihr: { de: 'Ihr gescheht uns wie ein Geschenk.', en: 'You all happen to us like a gift.' },
      sie: { de: 'Sie geschehen nur selten.', en: 'They happen only rarely.' },
    },
    ...EMPTY_EXAMPLES,
  },
  tags: ['strong - irregular du/er stem (e->ie), aux sein, USAGE NOTE: almost always 3rd person/impersonal in real usage - ich/du/wir/ihr forms are rare but grammatical, flagged for review'],
};

const VORSCHLAGEN = {
  infinitive: 'vorschlagen', english: 'to suggest', level: 'B1', type: 'strong', auxiliary: 'haben',
  separable: true, prefix: 'vor', reflexive: false, partizip2: 'vorgeschlagen',
  tables: {
    praesens: { ...regularPraesens('schlagen'), du: 'schlägst', er: 'schlägt' }, // base 'schlagen' - new this phase
    imperativ: withSeparablePrefix(regularImperativ('schlagen', regularPraesens('schlagen')), 'vor'), // a->ä changers use the UNCHANGED stem in imperativ
    perfekt: buildPerfekt(HABEN_PRAESENS, 'vorgeschlagen'),
    praeteritum: strongPraeteritumEndings('schlug'),
    ...EMPTY_TENSES,
  },
  examplesByPronoun: {
    praesens: {
      ich: { de: 'Ich schlage ein neues Restaurant vor.', en: "I'm suggesting a new restaurant." },
      du: { de: 'Du schlägst immer gute Ideen vor.', en: 'You always suggest good ideas.' },
      er: { de: 'Er schlägt einen anderen Termin vor.', en: "He's suggesting a different date." },
      wir: { de: 'Wir schlagen einen Kompromiss vor.', en: "We're suggesting a compromise." },
      ihr: { de: 'Ihr schlagt zu viel auf einmal vor.', en: 'You all are suggesting too much at once.' },
      sie: { de: 'Sie schlagen eine Lösung vor.', en: "They're suggesting a solution." },
    },
    ...EMPTY_EXAMPLES,
  },
  tags: ['separable, strong base "schlagen" (new base this phase) - irregular du/er stem, hand-typed partizip2/praeteritum'],
};

const VERLASSEN = {
  infinitive: 'verlassen', english: 'to leave (a place)', level: 'B1', type: 'strong', auxiliary: 'haben',
  separable: false, reflexive: false, partizip2: 'verlassen', // inseparable ver-, no ge-; identical to infinitive
  tables: {
    praesens: { ...regularPraesens('verlassen'), du: 'verlässt', er: 'verlässt' },
    imperativ: regularImperativ('verlassen', regularPraesens('verlassen')),
    perfekt: buildPerfekt(HABEN_PRAESENS, 'verlassen'),
    praeteritum: strongPraeteritumEndings('verließ'),
    ...EMPTY_TENSES,
  },
  examplesByPronoun: {
    praesens: {
      ich: { de: 'Ich verlasse das Haus um acht.', en: "I'm leaving the house at eight." },
      du: { de: 'Du verlässt mich einfach so?', en: 'You just leave me like that?' },
      er: { de: 'Er verlässt die Firma nächsten Monat.', en: "He's leaving the company next month." },
      wir: { de: 'Wir verlassen die Stadt für immer.', en: "We're leaving the city for good." },
      ihr: { de: 'Ihr verlasst die Party zu früh.', en: "You all are leaving the party too early." },
      sie: { de: 'Sie verlassen das Land.', en: "They're leaving the country." },
    },
    ...EMPTY_EXAMPLES,
  },
  tags: ['strong - irregular du/er stem (a->ä, s-contraction), inseparable ver- (no ge-), hand-typed praeteritum'],
};

const ERFAHREN = {
  infinitive: 'erfahren', english: 'to learn, to find out', level: 'B1', type: 'strong', auxiliary: 'haben',
  separable: false, reflexive: false, partizip2: 'erfahren', // inseparable er-, no ge-; identical to infinitive
  tables: {
    praesens: { ...regularPraesens('erfahren'), du: 'erfährst', er: 'erfährt' },
    imperativ: regularImperativ('erfahren', regularPraesens('erfahren')),
    perfekt: buildPerfekt(HABEN_PRAESENS, 'erfahren'),
    praeteritum: strongPraeteritumEndings('erfuhr'),
    ...EMPTY_TENSES,
  },
  examplesByPronoun: {
    praesens: {
      ich: { de: 'Ich erfahre die Neuigkeit erst heute.', en: "I'm only finding out the news today." },
      du: { de: 'Du erfährst alles zu spät.', en: 'You find everything out too late.' },
      er: { de: 'Er erfährt die Wahrheit über den Unfall.', en: 'He learns the truth about the accident.' },
      wir: { de: 'Wir erfahren viel über die Kultur.', en: 'We learn a lot about the culture.' },
      ihr: { de: 'Ihr erfahrt es von mir zuerst.', en: "You all find out from me first." },
      sie: { de: 'Sie erfahren die Ergebnisse morgen.', en: "They're finding out the results tomorrow." },
    },
    ...EMPTY_EXAMPLES,
  },
  tags: ['strong - irregular du/er stem (a->ä), inseparable er- (no ge-), hand-typed praeteritum'],
};

const ERFINDEN = {
  infinitive: 'erfinden', english: 'to invent', level: 'B1', type: 'strong', auxiliary: 'haben',
  separable: false, reflexive: false, partizip2: 'erfunden', // inseparable er-, no ge-
  tables: {
    praesens: regularPraesens('erfinden'),
    imperativ: regularImperativ('erfinden', regularPraesens('erfinden')),
    perfekt: buildPerfekt(HABEN_PRAESENS, 'erfunden'),
    praeteritum: strongPraeteritumEndings('erfand'),
    ...EMPTY_TENSES,
  },
  examplesByPronoun: {
    praesens: {
      ich: { de: 'Ich erfinde eine neue Ausrede.', en: "I'm inventing a new excuse." },
      du: { de: 'Du erfindest die verrücktesten Geschichten.', en: 'You invent the craziest stories.' },
      er: { de: 'Er erfindet eine neue Maschine.', en: "He's inventing a new machine." },
      wir: { de: 'Wir erfinden ein eigenes Spiel.', en: "We're inventing our own game." },
      ihr: { de: 'Ihr erfindet doch nur Ausreden.', en: "You all are just making up excuses." },
      sie: { de: 'Sie erfinden ein neues Wort.', en: "They're inventing a new word." },
    },
    ...EMPTY_EXAMPLES,
  },
  tags: ['strong - regular praesens (linking-e stem), inseparable er- (no ge-), hand-typed praeteritum'],
};

const ERHALTEN = {
  infinitive: 'erhalten', english: 'to receive', level: 'B1', type: 'strong', auxiliary: 'haben',
  separable: false, reflexive: false, partizip2: 'erhalten', // inseparable er-, no ge-; identical to infinitive
  tables: {
    praesens: { ...regularPraesens('erhalten'), du: 'erhältst', er: 'erhält' },
    imperativ: regularImperativ('erhalten', regularPraesens('erhalten')),
    perfekt: buildPerfekt(HABEN_PRAESENS, 'erhalten'),
    praeteritum: strongPraeteritumEndings('erhielt'),
    ...EMPTY_TENSES,
  },
  examplesByPronoun: {
    praesens: {
      ich: { de: 'Ich erhalte jeden Monat eine Rechnung.', en: 'I receive a bill every month.' },
      du: { de: 'Du erhältst bald eine Antwort.', en: "You'll receive an answer soon." },
      er: { de: 'Er erhält ein Stipendium.', en: "He's receiving a scholarship." },
      wir: { de: 'Wir erhalten gute Noten.', en: "We're getting good grades." },
      ihr: { de: 'Ihr erhaltet die Unterlagen per Post.', en: 'You all receive the documents by mail.' },
      sie: { de: 'Sie erhalten eine Einladung.', en: "They're receiving an invitation." },
    },
    ...EMPTY_EXAMPLES,
  },
  tags: ['strong - irregular du/er stem (a->ä), inseparable er- (no ge-), hand-typed praeteritum'],
};

// ---------------------------------------------------------------- mixed

const VERBRINGEN = {
  infinitive: 'verbringen', english: 'to spend (time)', level: 'B1', type: 'mixed', auxiliary: 'haben',
  separable: false, reflexive: false, partizip2: 'verbracht', // inseparable ver-, no ge-
  tables: {
    praesens: regularPraesens('verbringen'),
    imperativ: regularImperativ('verbringen', regularPraesens('verbringen')),
    perfekt: buildPerfekt(HABEN_PRAESENS, 'verbracht'),
    praeteritum: weakPraeteritumEndings('verbrachte'),
    ...EMPTY_TENSES,
  },
  examplesByPronoun: {
    praesens: {
      ich: { de: 'Ich verbringe den Sommer am Meer.', en: "I'm spending the summer at the sea." },
      du: { de: 'Du verbringst zu viel Zeit online.', en: 'You spend too much time online.' },
      er: { de: 'Er verbringt den Abend mit Freunden.', en: "He's spending the evening with friends." },
      wir: { de: 'Wir verbringen die Ferien in den Bergen.', en: "We're spending the holidays in the mountains." },
      ihr: { de: 'Ihr verbringt zu wenig Zeit zusammen.', en: 'You all spend too little time together.' },
      sie: { de: 'Sie verbringen den Tag im Park.', en: "They're spending the day in the park." },
    },
    ...EMPTY_EXAMPLES,
  },
  tags: ['mixed - regular praesens, hand-typed partizip2/praeteritum (like bringen), inseparable ver- (no ge-)'],
};

// ---------------------------------------------------------------- fully regular weak, inseparable prefix (hand-typed partizip2, no ge-)

const UEBERLEGEN = {
  infinitive: 'überlegen', english: 'to consider, to think over', level: 'B1', type: 'weak', auxiliary: 'haben',
  separable: false, reflexive: false, partizip2: 'überlegt', // inseparable über-, no ge-
  tables: {
    praesens: regularPraesens('überlegen'),
    imperativ: regularImperativ('überlegen', regularPraesens('überlegen')),
    perfekt: buildPerfekt(HABEN_PRAESENS, 'überlegt'),
    praeteritum: regularPraeteritum('überlegen'),
    ...EMPTY_TENSES,
  },
  examplesByPronoun: {
    praesens: {
      ich: { de: 'Ich überlege die Antwort genau.', en: "I'm considering the answer carefully." },
      du: { de: 'Du überlegst zu lange.', en: "You're thinking it over too long." },
      er: { de: 'Er überlegt seinen nächsten Schritt.', en: "He's considering his next step." },
      wir: { de: 'Wir überlegen einen neuen Plan.', en: "We're thinking over a new plan." },
      ihr: { de: 'Ihr überlegt das noch einmal.', en: 'You all think it over once more.' },
      sie: { de: 'Sie überlegen die beste Lösung.', en: "They're considering the best solution." },
    },
    ...EMPTY_EXAMPLES,
  },
  tags: ['regular - rule-generated praesens/praeteritum, hand-typed partizip2, inseparable über- (no ge-)'],
};

const ERWARTEN = {
  infinitive: 'erwarten', english: 'to expect', level: 'B1', type: 'weak', auxiliary: 'haben',
  separable: false, reflexive: false, partizip2: 'erwartet', // inseparable er-, no ge-
  tables: {
    praesens: regularPraesens('erwarten'),
    imperativ: regularImperativ('erwarten', regularPraesens('erwarten')),
    perfekt: buildPerfekt(HABEN_PRAESENS, 'erwartet'),
    praeteritum: regularPraeteritum('erwarten'),
    ...EMPTY_TENSES,
  },
  examplesByPronoun: {
    praesens: {
      ich: { de: 'Ich erwarte eine schnelle Antwort.', en: "I'm expecting a quick answer." },
      du: { de: 'Du erwartest zu viel von mir.', en: 'You expect too much from me.' },
      er: { de: 'Er erwartet ein Kind.', en: "He's expecting a child." },
      wir: { de: 'Wir erwarten euch um sieben.', en: "We're expecting you all at seven." },
      ihr: { de: 'Ihr erwartet den Bus jeden Morgen.', en: "You all wait for the bus every morning." },
      sie: { de: 'Sie erwarten hohe Gewinne.', en: "They're expecting high profits." },
    },
    ...EMPTY_EXAMPLES,
  },
  tags: ['regular - rule-generated praesens/praeteritum (linking-e stem), hand-typed partizip2, inseparable er- (no ge-)'],
};

const VERAENDERN = {
  infinitive: 'verändern', english: 'to change (something)', level: 'B1', type: 'weak', auxiliary: 'haben',
  separable: false, reflexive: false, partizip2: 'verändert', // inseparable ver-, no ge-
  tables: {
    praesens: regularPraesens('verändern'),
    imperativ: regularImperativ('verändern', regularPraesens('verändern')),
    perfekt: buildPerfekt(HABEN_PRAESENS, 'verändert'),
    praeteritum: regularPraeteritum('verändern'),
    ...EMPTY_TENSES,
  },
  examplesByPronoun: {
    praesens: {
      ich: { de: 'Ich verändere meine Meinung selten.', en: 'I rarely change my opinion.' },
      du: { de: 'Du veränderst dich kaum.', en: "You barely change." },
      er: { de: 'Er verändert die Regeln des Spiels.', en: "He's changing the rules of the game." },
      wir: { de: 'Wir verändern unser Leben komplett.', en: "We're completely changing our lives." },
      ihr: { de: 'Ihr verändert die Pläne wieder.', en: "You all are changing the plans again." },
      sie: { de: 'Sie verändern die Stadt jedes Jahr.', en: 'They change the city every year.' },
    },
    ...EMPTY_EXAMPLES,
  },
  tags: ['regular -ern class - rule-generated praesens/praeteritum, hand-typed partizip2, inseparable ver- (no ge-)'],
};

const ZERSTOEREN = {
  infinitive: 'zerstören', english: 'to destroy', level: 'B1', type: 'weak', auxiliary: 'haben',
  separable: false, reflexive: false, partizip2: 'zerstört', // inseparable zer-, no ge-
  tables: {
    praesens: regularPraesens('zerstören'),
    imperativ: regularImperativ('zerstören', regularPraesens('zerstören')),
    perfekt: buildPerfekt(HABEN_PRAESENS, 'zerstört'),
    praeteritum: regularPraeteritum('zerstören'),
    ...EMPTY_TENSES,
  },
  examplesByPronoun: {
    praesens: {
      ich: { de: 'Ich zerstöre versehentlich die Datei.', en: 'I accidentally destroy the file.' },
      du: { de: 'Du zerstörst meine Pläne.', en: 'You destroy my plans.' },
      er: { de: 'Er zerstört das alte Gebäude.', en: "He's destroying the old building." },
      wir: { de: 'Wir zerstören die Umwelt jeden Tag ein bisschen.', en: "We destroy the environment a little every day." },
      ihr: { de: 'Ihr zerstört den Beweis absichtlich.', en: 'You all destroy the evidence on purpose.' },
      sie: { de: 'Sie zerstören die Brücke im Krieg.', en: 'They destroy the bridge in the war.' },
    },
    ...EMPTY_EXAMPLES,
  },
  tags: ['regular - rule-generated praesens/praeteritum, hand-typed partizip2, inseparable zer- (no ge-)'],
};

// ---------------------------------------------------------------- reflexive, inseparable prefix (hand-typed partizip2, no ge-)

const ENTSPANNEN_SICH = {
  infinitive: 'entspannen', english: 'to relax', level: 'B1', type: 'weak', auxiliary: 'haben',
  separable: false, reflexive: true, partizip2: 'entspannt', // inseparable ent-, no ge-
  tables: {
    praesens: applyReflexive(regularPraesens('entspannen')),
    imperativ: applyReflexive(regularImperativ('entspannen', regularPraesens('entspannen'))),
    perfekt: buildPerfekt(HABEN_PRAESENS, 'entspannt', true),
    praeteritum: applyReflexive(regularPraeteritum('entspannen')),
    ...EMPTY_TENSES,
  },
  examplesByPronoun: {
    praesens: {
      ich: { de: 'Ich entspanne mich am Wochenende.', en: "I relax on the weekend." },
      du: { de: 'Du entspannst dich nie richtig.', en: 'You never really relax.' },
      er: { de: 'Er entspannt sich bei Musik.', en: 'He relaxes listening to music.' },
      wir: { de: 'Wir entspannen uns am Strand.', en: "We relax on the beach." },
      ihr: { de: 'Ihr entspannt euch zu selten.', en: 'You all relax too rarely.' },
      sie: { de: 'Sie entspannen sich nach der Arbeit.', en: 'They relax after work.' },
    },
    ...EMPTY_EXAMPLES,
  },
  tags: ['reflexive, regular - rule-generated then reflexive pronoun applied, hand-typed partizip2, inseparable ent- (no ge-)'],
};

const ERKAELTEN_SICH = {
  infinitive: 'erkälten', english: 'to catch a cold', level: 'B1', type: 'weak', auxiliary: 'haben',
  separable: false, reflexive: true, partizip2: 'erkältet', // inseparable er-, no ge-
  tables: {
    praesens: applyReflexive(regularPraesens('erkälten')),
    imperativ: applyReflexive(regularImperativ('erkälten', regularPraesens('erkälten'))),
    perfekt: buildPerfekt(HABEN_PRAESENS, 'erkältet', true),
    praeteritum: applyReflexive(regularPraeteritum('erkälten')),
    ...EMPTY_TENSES,
  },
  examplesByPronoun: {
    praesens: {
      ich: { de: 'Ich erkälte mich jeden Winter.', en: 'I catch a cold every winter.' },
      du: { de: 'Du erkältest dich wieder.', en: "You're catching a cold again." },
      er: { de: 'Er erkältet sich im Regen.', en: "He's catching a cold in the rain." },
      wir: { de: 'Wir erkälten uns beide gleichzeitig.', en: 'We both catch a cold at the same time.' },
      ihr: { de: 'Ihr erkältet euch zu oft.', en: 'You all catch colds too often.' },
      sie: { de: 'Sie erkälten sich im kalten Büro.', en: 'They catch colds in the cold office.' },
    },
    ...EMPTY_EXAMPLES,
  },
  tags: ['reflexive, regular - rule-generated then reflexive pronoun applied, hand-typed partizip2, inseparable er- (no ge-)'],
};

const BESCHAEFTIGEN_SICH = {
  infinitive: 'beschäftigen', english: 'to occupy oneself, to be busy with', level: 'B1', type: 'weak', auxiliary: 'haben',
  separable: false, reflexive: true, partizip2: 'beschäftigt', // inseparable be-, no ge-
  tables: {
    praesens: applyReflexive(regularPraesens('beschäftigen')),
    imperativ: applyReflexive(regularImperativ('beschäftigen', regularPraesens('beschäftigen'))),
    perfekt: buildPerfekt(HABEN_PRAESENS, 'beschäftigt', true),
    praeteritum: applyReflexive(regularPraeteritum('beschäftigen')),
    ...EMPTY_TENSES,
  },
  examplesByPronoun: {
    praesens: {
      ich: { de: 'Ich beschäftige mich mit der neuen Software.', en: "I'm busy with the new software." },
      du: { de: 'Du beschäftigst dich viel mit Musik.', en: "You occupy yourself a lot with music." },
      er: { de: 'Er beschäftigt sich mit dem Problem.', en: "He's dealing with the problem." },
      wir: { de: 'Wir beschäftigen uns mit der Geschichte.', en: "We're occupying ourselves with history." },
      ihr: { de: 'Ihr beschäftigt euch mit unwichtigen Dingen.', en: 'You all busy yourselves with unimportant things.' },
      sie: { de: 'Sie beschäftigen sich mit dem Projekt.', en: "They're busy with the project." },
    },
    ...EMPTY_EXAMPLES,
  },
  tags: ['reflexive, regular - rule-generated then reflexive pronoun applied, hand-typed partizip2, inseparable be- (no ge-)'],
};

const VERABSCHIEDEN_SICH = {
  infinitive: 'verabschieden', english: 'to say goodbye', level: 'B1', type: 'weak', auxiliary: 'haben',
  separable: false, reflexive: true, partizip2: 'verabschiedet', // inseparable ver-, no ge-
  tables: {
    praesens: applyReflexive(regularPraesens('verabschieden')),
    imperativ: applyReflexive(regularImperativ('verabschieden', regularPraesens('verabschieden'))),
    perfekt: buildPerfekt(HABEN_PRAESENS, 'verabschiedet', true),
    praeteritum: applyReflexive(regularPraeteritum('verabschieden')),
    ...EMPTY_TENSES,
  },
  examplesByPronoun: {
    praesens: {
      ich: { de: 'Ich verabschiede mich von meinen Kollegen.', en: "I'm saying goodbye to my colleagues." },
      du: { de: 'Du verabschiedest dich nie richtig.', en: 'You never say goodbye properly.' },
      er: { de: 'Er verabschiedet sich früh von der Party.', en: "He says goodbye early from the party." },
      wir: { de: 'Wir verabschieden uns am Bahnhof.', en: "We're saying goodbye at the station." },
      ihr: { de: 'Ihr verabschiedet euch zu langsam.', en: 'You all take too long to say goodbye.' },
      sie: { de: 'Sie verabschieden sich herzlich.', en: 'They say a warm goodbye.' },
    },
    ...EMPTY_EXAMPLES,
  },
  tags: ['reflexive, regular - rule-generated then reflexive pronoun applied, hand-typed partizip2, inseparable ver- (no ge-)'],
};

// ---------------------------------------------------------------- weak, -eln class

const ENTWICKELN = {
  infinitive: 'entwickeln', english: 'to develop', level: 'B1', type: 'weak', auxiliary: 'haben',
  separable: false, reflexive: false, partizip2: 'entwickelt', // inseparable ent-, no ge-
  tables: {
    praesens: regularPraesens('entwickeln'),
    imperativ: regularImperativ('entwickeln', regularPraesens('entwickeln')),
    perfekt: buildPerfekt(HABEN_PRAESENS, 'entwickelt'),
    praeteritum: regularPraeteritum('entwickeln'),
    ...EMPTY_TENSES,
  },
  examplesByPronoun: {
    praesens: {
      ich: { de: 'Ich entwickle eine neue App.', en: "I'm developing a new app." },
      du: { de: 'Du entwickelst dich sehr gut.', en: "You're developing very well." },
      er: { de: 'Er entwickelt ein neues Produkt.', en: "He's developing a new product." },
      wir: { de: 'Wir entwickeln zusammen eine Strategie.', en: "We're developing a strategy together." },
      ihr: { de: 'Ihr entwickelt gute Ideen.', en: 'You all develop good ideas.' },
      sie: { de: 'Sie entwickeln einen neuen Impfstoff.', en: "They're developing a new vaccine." },
    },
    ...EMPTY_EXAMPLES,
  },
  tags: ['regular -eln class - rule-generated praesens/praeteritum (ich entwickle, not entwickele - confirmed against Wiktionary), hand-typed partizip2, inseparable ent- (no ge-)'],
};

export const VERBS = [
  SEIN, HABEN, WERDEN,
  MACHEN, KAUFEN, WOHNEN, ARBEITEN,
  GEHEN, KOMMEN, BLEIBEN, SCHREIBEN, HEISSEN, TRINKEN, FINDEN, KENNEN,
  FAHREN, ESSEN, GEBEN, NEHMEN, SEHEN, LESEN, SPRECHEN, SCHLAFEN, LAUFEN, HELFEN, TREFFEN,
  KOENNEN, MUESSEN, WOLLEN, DUERFEN, SOLLEN, MOEGEN, WISSEN,
  AUFSTEHEN, ANRUFEN, EINKAUFEN,
  TRAGEN, FALLEN, LASSEN, RUFEN, VERGESSEN, VERLIEREN, BESCHREIBEN, SINGEN, SCHNEIDEN, STERBEN,
  DENKEN, NENNEN,
  PLANEN, PROBIEREN,
  AUFRAEUMEN, ZUMACHEN, ZUHOEREN, ZURUECKKOMMEN, ZURUECKGEBEN, UMSTEIGEN,
  FUEHLEN_SICH, AERGERN_SICH, VERABREDEN_SICH,
  ENTSCHEIDEN, UNTERSCHEIDEN, BEWEISEN, EMPFANGEN, GESCHEHEN, VORSCHLAGEN, VERLASSEN, ERFAHREN, ERFINDEN, ERHALTEN,
  VERBRINGEN,
  UEBERLEGEN, ERWARTEN, VERAENDERN, ZERSTOEREN,
  ENTSPANNEN_SICH, ERKAELTEN_SICH, BESCHAEFTIGEN_SICH, VERABSCHIEDEN_SICH,
  ENTWICKELN,
];

for (const verb of VERBS) fillDerivedTenses(verb);

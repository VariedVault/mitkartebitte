// Cases & Grammar - grammar-point content, kept ENTIRELY separate from the verb pool
// (js/data/verbs-a1.js) and the verb SRS deck. This is a new, self-contained content type;
// nothing here touches or depends on the Conjugation system.
//
// A grammar-point unit:
//   { id, tier ('A1'|'A2'|'B1'), topic ('gender'|'cases'|'declension'|'preposition'|...),
//     title, explanation (plain English),
//     table? (optional structured paradigm - see the table shape below),
//     examples: [ { de, en, note? } ],
//     drillFacts: [ { id, type, prompt, answer, why } ] }   // the SRS-trackable atoms
//
// A table:
//   { caption?, columns: [headerCells], rows: [ { label?, cells: [...] } ],
//     rowAccent?: [caseId per row], colAccent?: [genderId per column, aligned to cells] }
//   rowAccent tints each row's label; colAccent tints each column's header - purely a
//   memory aid, applied by the renderer (js/views/grammarPoint.js).
//
// A drillFact type is one of: 'gender' | 'identify-case' | 'article-fill' | 'prep-case'.
// Every fact's SRS key is `g|${fact.id}` (see grammarDeck.js) - a namespace distinct from
// the verb deck's `infinitive|tense|pronoun` keys, so the two decks can never collide.
//
// All article/case tables and preposition-case assignments below are FIXED, CLOSED
// paradigms, each verified against Wiktionary (der, ein, kein) / standard grammar. See the
// phase report for the verification tables.
//
// A2/B1 topics (Wechselpräpositionen, Adjektivdeklination, Relativpronomen) are intended to
// be DATA-ONLY additions to GRAMMAR_POINTS with tier 'A2'/'B1' - no code changes needed.

export const CASE_COLORS = {
  nom: '#FF6B6B', // Nominativ
  akk: '#4ECDC4', // Akkusativ
  dat: '#6C8EFF', // Dativ
  gen: '#C77DFF', // Genitiv
};

export const GENDER_COLORS = {
  m: '#6C8EFF', // Maskulin (der)
  f: '#FF6B6B', // Feminin (die)
  n: '#5FD98A', // Neutrum (das)
  pl: '#FFA94D', // Plural
};

export const GRAMMAR_POINTS = [
  // ---------------------------------------------------------------- gender
  {
    id: 'a1-gender',
    tier: 'A1',
    topic: 'gender',
    title: 'Gender: der / die / das',
    explanation:
      'Every German noun has one of three genders: masculine (der), feminine (die), or neuter (das). Gender is a property of the noun itself, not its meaning - it is mostly not predictable, so the reliable approach is to learn each noun together with its article ("der Tisch", not just "Tisch"). Plural nouns of every gender share one article: die.',
    table: {
      caption: 'A few common nouns per gender',
      columns: ['Maskulin — der', 'Feminin — die', 'Neutrum — das'],
      colAccent: ['m', 'f', 'n'],
      rows: [
        { cells: ['der Mann (man)', 'die Frau (woman)', 'das Kind (child)'] },
        { cells: ['der Tisch (table)', 'die Lampe (lamp)', 'das Buch (book)'] },
        { cells: ['der Hund (dog)', 'die Katze (cat)', 'das Haus (house)'] },
      ],
    },
    examples: [
      { de: 'Der Hund schläft.', en: 'The dog is sleeping.' },
      { de: 'Die Katze trinkt Milch.', en: 'The cat drinks milk.' },
      { de: 'Das Kind spielt im Garten.', en: 'The child plays in the garden.' },
    ],
    drillFacts: [
      { id: 'gender-mann', type: 'gender', prompt: 'Which article: ___ Mann (man)?', answer: 'der (masculine)', why: 'Mann is masculine → der Mann.' },
      { id: 'gender-frau', type: 'gender', prompt: 'Which article: ___ Frau (woman)?', answer: 'die (feminine)', why: 'Frau is feminine → die Frau.' },
      { id: 'gender-kind', type: 'gender', prompt: 'Which article: ___ Kind (child)?', answer: 'das (neuter)', why: 'Kind is neuter → das Kind.' },
      { id: 'gender-tisch', type: 'gender', prompt: 'Which article: ___ Tisch (table)?', answer: 'der (masculine)', why: 'Tisch is masculine → der Tisch.' },
      { id: 'gender-lampe', type: 'gender', prompt: 'Which article: ___ Lampe (lamp)?', answer: 'die (feminine)', why: 'Lampe is feminine → die Lampe.' },
      { id: 'gender-buch', type: 'gender', prompt: 'Which article: ___ Buch (book)?', answer: 'das (neuter)', why: 'Buch is neuter → das Buch.' },
      { id: 'gender-hund', type: 'gender', prompt: 'Which article: ___ Hund (dog)?', answer: 'der (masculine)', why: 'Hund is masculine → der Hund.' },
      { id: 'gender-katze', type: 'gender', prompt: 'Which article: ___ Katze (cat)?', answer: 'die (feminine)', why: 'Katze is feminine → die Katze.' },
      { id: 'gender-haus', type: 'gender', prompt: 'Which article: ___ Haus (house)?', answer: 'das (neuter)', why: 'Haus is neuter → das Haus.' },
    ],
  },

  // ---------------------------------------------------------------- the 4 cases
  {
    id: 'a1-cases',
    tier: 'A1',
    topic: 'cases',
    title: 'The 4 Cases',
    explanation:
      'German marks the ROLE a noun plays in a sentence by changing the article in front of it - this is "case". Nominativ is the subject (who does the action). Akkusativ is the direct object (what the action happens to). Dativ is the indirect object (to or for whom). Genitiv shows possession (whose) and is used far more in writing than in everyday speech. Think "who does what to whom": the doer is Nominativ, the thing acted on is Akkusativ, the receiver is Dativ.',
    table: {
      caption: 'The four cases at a glance',
      columns: ['Case', 'Role', 'Question word'],
      rowAccent: ['nom', 'akk', 'dat', 'gen'],
      rows: [
        { label: 'Nominativ', cells: ['subject — who does it', 'Wer? / Was?'] },
        { label: 'Akkusativ', cells: ['direct object — what it happens to', 'Wen? / Was?'] },
        { label: 'Dativ', cells: ['indirect object — to/for whom', 'Wem?'] },
        { label: 'Genitiv', cells: ['possession — whose (mostly written)', 'Wessen?'] },
      ],
    },
    examples: [
      { de: 'Der Mann kauft einen Apfel.', en: 'The man buys an apple.', note: '"Der Mann" = Nominativ (the buyer); "einen Apfel" = Akkusativ (what is bought).' },
      { de: 'Ich gebe dem Kind einen Ball.', en: 'I give the child a ball.', note: '"dem Kind" = Dativ (to whom); "einen Ball" = Akkusativ (what).' },
      { de: 'Das ist das Auto des Mannes.', en: "That is the man's car.", note: '"des Mannes" = Genitiv (whose car) - common in writing, in speech people often say "von dem Mann".' },
    ],
    drillFacts: [
      { id: 'case-id-subj', type: 'identify-case', prompt: 'Which case is "Der Mann" in? — "Der Mann kauft einen Apfel."', answer: 'Nominativ', why: '"Der Mann" is the subject - the one doing the buying.' },
      { id: 'case-id-obj', type: 'identify-case', prompt: 'Which case is "einen Apfel" in? — "Der Mann kauft einen Apfel."', answer: 'Akkusativ', why: '"einen Apfel" is the direct object - what gets bought.' },
      { id: 'case-id-dat', type: 'identify-case', prompt: 'Which case is "dem Kind" in? — "Ich gebe dem Kind einen Ball."', answer: 'Dativ', why: '"dem Kind" is the indirect object - the receiver the ball is given to.' },
      { id: 'case-id-gen', type: 'identify-case', prompt: 'Which case is "des Mannes" in? — "das Auto des Mannes"', answer: 'Genitiv', why: '"des Mannes" shows possession - whose car it is.' },
    ],
  },

  // ---------------------------------------------------------------- der-words
  {
    id: 'a1-der-words',
    tier: 'A1',
    topic: 'declension',
    title: 'Der-words (definite article)',
    explanation:
      'The definite article ("the") changes its form for each case and gender. This one table is the backbone of German case: learn it, and you can read the case off almost any noun phrase. Words that follow the SAME endings - dieser (this), jeder (every), welcher (which) - are called "der-words".',
    table: {
      caption: 'Definite article: der / die / das',
      columns: ['', 'Maskulin', 'Feminin', 'Neutrum', 'Plural'],
      colAccent: [null, 'm', 'f', 'n', 'pl'],
      rowAccent: ['nom', 'akk', 'dat', 'gen'],
      rows: [
        { label: 'Nominativ', cells: ['der', 'die', 'das', 'die'] },
        { label: 'Akkusativ', cells: ['den', 'die', 'das', 'die'] },
        { label: 'Dativ', cells: ['dem', 'der', 'dem', 'den'] },
        { label: 'Genitiv', cells: ['des', 'der', 'des', 'der'] },
      ],
    },
    examples: [
      { de: 'Der Hund sieht die Katze.', en: 'The dog sees the cat.', note: '"der" = Nom. masc. (subject); "die" = Akk. fem. (object).' },
      { de: 'Ich gebe dem Mann das Buch.', en: 'I give the man the book.', note: '"dem" = Dat. masc. (receiver); "das" = Akk. neut. (what).' },
      { de: 'Die Farbe des Autos ist rot.', en: 'The colour of the car is red.', note: '"des" = Gen. neut. (whose colour).' },
    ],
    drillFacts: [
      { id: 'der-fill-akk-m', type: 'article-fill', prompt: 'Complete: "Ich sehe ___ Mann." (Akkusativ, masculine)', answer: 'den', why: 'Akkusativ masculine definite article = den.' },
      { id: 'der-fill-dat-f', type: 'article-fill', prompt: 'Complete: "Ich helfe ___ Frau." (Dativ, feminine)', answer: 'der', why: 'helfen takes Dativ; Dativ feminine definite article = der.' },
      { id: 'der-fill-nom-n', type: 'article-fill', prompt: 'Complete: "___ Kind spielt." (Nominativ, neuter)', answer: 'das', why: 'Nominativ neuter definite article = das.' },
      { id: 'der-fill-dat-pl', type: 'article-fill', prompt: 'Complete: "Ich gebe ___ Kindern Bonbons." (Dativ, plural)', answer: 'den', why: 'Dativ plural definite article = den (and the noun itself adds -n: Kindern).' },
    ],
  },

  // ---------------------------------------------------------------- ein-words
  {
    id: 'a1-ein-words',
    tier: 'A1',
    topic: 'declension',
    title: 'Ein-words (indefinite / kein / mein)',
    explanation:
      'The indefinite article "ein" ("a/an") takes almost the same endings as the der-words, with two gaps: masculine Nominativ ("ein", no ending) and neuter Nominativ/Akkusativ ("ein"). "ein" has no plural. But "kein" (no/not any) and the possessives (mein, dein, sein, ...) follow the exact same pattern AND have a plural, so they are the ones to drill for the plural forms.',
    tables: [
      {
        caption: 'Indefinite article: ein (singular only)',
        columns: ['', 'Maskulin', 'Feminin', 'Neutrum'],
        colAccent: [null, 'm', 'f', 'n'],
        rowAccent: ['nom', 'akk', 'dat', 'gen'],
        rows: [
          { label: 'Nominativ', cells: ['ein', 'eine', 'ein'] },
          { label: 'Akkusativ', cells: ['einen', 'eine', 'ein'] },
          { label: 'Dativ', cells: ['einem', 'einer', 'einem'] },
          { label: 'Genitiv', cells: ['eines', 'einer', 'eines'] },
        ],
      },
      {
        caption: 'kein / mein pattern (with plural)',
        columns: ['', 'Maskulin', 'Feminin', 'Neutrum', 'Plural'],
        colAccent: [null, 'm', 'f', 'n', 'pl'],
        rowAccent: ['nom', 'akk', 'dat', 'gen'],
        rows: [
          { label: 'Nominativ', cells: ['kein', 'keine', 'kein', 'keine'] },
          { label: 'Akkusativ', cells: ['keinen', 'keine', 'kein', 'keine'] },
          { label: 'Dativ', cells: ['keinem', 'keiner', 'keinem', 'keinen'] },
          { label: 'Genitiv', cells: ['keines', 'keiner', 'keines', 'keiner'] },
        ],
      },
    ],
    examples: [
      { de: 'Ich habe einen Hund.', en: 'I have a dog.', note: '"einen" = Akk. masc. (direct object).' },
      { de: 'Sie hat keine Zeit.', en: 'She has no time.', note: '"keine" = Akk. fem. (Zeit is feminine).' },
      { de: 'Wir spielen mit einem Ball.', en: 'We play with a ball.', note: '"einem" = Dat. masc. after "mit".' },
    ],
    drillFacts: [
      { id: 'ein-fill-akk-m', type: 'article-fill', prompt: 'Complete: "Ich kaufe ___ Apfel." (Akkusativ, masculine)', answer: 'einen', why: 'Akkusativ masculine: ein → einen.' },
      { id: 'ein-fill-dat-n', type: 'article-fill', prompt: 'Complete: "Ich fahre mit ___ Auto." (Dativ, neuter)', answer: 'einem', why: '"mit" takes Dativ; neuter ein → einem.' },
      { id: 'ein-fill-pl-kein', type: 'article-fill', prompt: 'Complete: "Ich habe ___ Bücher." (plural, "kein")', answer: 'keine', why: 'Nominativ/Akkusativ plural: kein → keine.' },
    ],
  },

  // ---------------------------------------------------------------- accusative prepositions
  {
    id: 'a1-prep-akk',
    tier: 'A1',
    topic: 'preposition',
    title: 'Accusative prepositions',
    explanation:
      'These five prepositions ALWAYS put the noun after them into the Accusative case, every time, no exceptions to weigh: für, durch, gegen, ohne, um. A common memory aid is "FUDGO" (für, um, durch, gegen, ohne). Learn the five as a set and you never have to think about their case again.',
    table: {
      caption: 'The 5 accusative prepositions',
      columns: ['Preposition', 'Meaning', 'Memory aid'],
      rows: [
        { cells: ['für', 'for', 'für dich (for you)'] },
        { cells: ['durch', 'through', 'durch den Park (through the park)'] },
        { cells: ['gegen', 'against', 'gegen die Wand (against the wall)'] },
        { cells: ['ohne', 'without', 'ohne dich (without you)'] },
        { cells: ['um', 'around / at (a time)', 'um die Ecke (around the corner)'] },
      ],
    },
    examples: [
      { de: 'Das Geschenk ist für dich.', en: 'The gift is for you.', note: '"für" → Akkusativ; "dich" is the accusative form of "du".' },
      { de: 'Wir gehen durch den Park.', en: 'We walk through the park.', note: '"durch" → Akkusativ; "den Park" (masc.).' },
      { de: 'Ich habe nichts gegen ihn.', en: 'I have nothing against him.', note: '"gegen" → Akkusativ; "ihn" is the accusative form of "er".' },
      { de: 'Sie geht ohne einen Mantel raus.', en: 'She goes out without a coat.', note: '"ohne" → Akkusativ; "einen Mantel" (masc.).' },
      { de: 'Wir sitzen um den Tisch.', en: 'We sit around the table.', note: '"um" → Akkusativ; "den Tisch" (masc.).' },
    ],
    drillFacts: [
      { id: 'prep-fuer', type: 'prep-case', prompt: 'Which case does "für" take?', answer: 'Akkusativ', why: '"für" is a fixed accusative preposition.' },
      { id: 'prep-durch', type: 'prep-case', prompt: 'Which case does "durch" take?', answer: 'Akkusativ', why: '"durch" is a fixed accusative preposition.' },
      { id: 'prep-gegen', type: 'prep-case', prompt: 'Which case does "gegen" take?', answer: 'Akkusativ', why: '"gegen" is a fixed accusative preposition.' },
      { id: 'prep-ohne', type: 'prep-case', prompt: 'Which case does "ohne" take?', answer: 'Akkusativ', why: '"ohne" is a fixed accusative preposition.' },
      { id: 'prep-um', type: 'prep-case', prompt: 'Which case does "um" take?', answer: 'Akkusativ', why: '"um" is a fixed accusative preposition.' },
      { id: 'prep-akk-fill-durch', type: 'article-fill', prompt: 'Complete: "Wir gehen durch ___ Park." (masculine, definite)', answer: 'den', why: '"durch" → Akkusativ; masc. Akk. definite article = den.' },
      { id: 'prep-akk-fill-fuer', type: 'article-fill', prompt: 'Complete: "Das ist für ___ Mann." (masculine, definite)', answer: 'den', why: '"für" → Akkusativ; masc. Akk. definite article = den.' },
    ],
  },

  // ---------------------------------------------------------------- dative prepositions
  {
    id: 'a1-prep-dat',
    tier: 'A1',
    topic: 'preposition',
    title: 'Dative prepositions',
    explanation:
      'These seven prepositions ALWAYS put the noun after them into the Dative case: mit, nach, bei, seit, von, zu, aus. Many learners memorize them as a little chant - "aus, bei, mit, nach, seit, von, zu — they all take Dativ, and so do you!". Note "zu dem" and "von dem" usually contract to "zum" / "vom", and "bei dem" to "beim".',
    table: {
      caption: 'The 7 dative prepositions',
      columns: ['Preposition', 'Meaning', 'Memory aid'],
      rows: [
        { cells: ['mit', 'with / by', 'mit dem Bus (by bus)'] },
        { cells: ['nach', 'after / to (places, home)', 'nach der Arbeit (after work)'] },
        { cells: ['bei', 'at / near / at someone’s place', 'bei mir (at my place)'] },
        { cells: ['seit', 'since / for (time)', 'seit einem Jahr (for a year)'] },
        { cells: ['von', 'from / of', 'von der Stadt (from the city)'] },
        { cells: ['zu', 'to', 'zum Arzt (to the doctor)'] },
        { cells: ['aus', 'out of / from', 'aus dem Haus (out of the house)'] },
      ],
    },
    examples: [
      { de: 'Ich fahre mit dem Bus.', en: 'I go by bus.', note: '"mit" → Dativ; "dem Bus" (masc.).' },
      { de: 'Nach der Arbeit gehe ich nach Hause.', en: 'After work I go home.', note: '"nach" → Dativ; "der Arbeit" (fem.).' },
      { de: 'Ich wohne bei meiner Mutter.', en: 'I live at my mother’s.', note: '"bei" → Dativ; "meiner Mutter" (fem.).' },
      { de: 'Wir kommen aus der Schweiz.', en: 'We come from Switzerland.', note: '"aus" → Dativ; "der Schweiz" (fem.).' },
      { de: 'Er geht zu dem Arzt.', en: 'He goes to the doctor.', note: '"zu" → Dativ; "dem Arzt" (masc.). Usually contracted: "zum Arzt".' },
    ],
    drillFacts: [
      { id: 'prep-mit', type: 'prep-case', prompt: 'Which case does "mit" take?', answer: 'Dativ', why: '"mit" is a fixed dative preposition.' },
      { id: 'prep-nach', type: 'prep-case', prompt: 'Which case does "nach" take?', answer: 'Dativ', why: '"nach" is a fixed dative preposition.' },
      { id: 'prep-bei', type: 'prep-case', prompt: 'Which case does "bei" take?', answer: 'Dativ', why: '"bei" is a fixed dative preposition.' },
      { id: 'prep-seit', type: 'prep-case', prompt: 'Which case does "seit" take?', answer: 'Dativ', why: '"seit" is a fixed dative preposition.' },
      { id: 'prep-von', type: 'prep-case', prompt: 'Which case does "von" take?', answer: 'Dativ', why: '"von" is a fixed dative preposition.' },
      { id: 'prep-zu', type: 'prep-case', prompt: 'Which case does "zu" take?', answer: 'Dativ', why: '"zu" is a fixed dative preposition.' },
      { id: 'prep-aus', type: 'prep-case', prompt: 'Which case does "aus" take?', answer: 'Dativ', why: '"aus" is a fixed dative preposition.' },
      { id: 'prep-dat-fill-mit', type: 'article-fill', prompt: 'Complete: "Ich fahre mit ___ Bus." (masculine, definite)', answer: 'dem', why: '"mit" → Dativ; masc. Dat. definite article = dem.' },
      { id: 'prep-dat-fill-aus', type: 'article-fill', prompt: 'Complete: "Ich komme aus ___ Stadt." (feminine, definite)', answer: 'der', why: '"aus" → Dativ; fem. Dat. definite article = der.' },
      { id: 'prep-dat-fill-bei', type: 'article-fill', prompt: 'Complete: "Ich wohne bei ___ Frau." (feminine, definite)', answer: 'der', why: '"bei" → Dativ; fem. Dat. definite article = der.' },
    ],
  },
];

// ---------------------------------------------------------------- reference lessons (read-only, not drilled)
export const GRAMMAR_LESSONS = [
  {
    id: 'what-cases-are',
    tier: 'A1',
    title: 'What cases are',
    intro: 'English shows who-does-what mostly through word order ("the dog bites the man" vs "the man bites the dog"). German can rely on word order too, but its main tool is CASE: the little word in front of the noun changes shape to show the noun’s job in the sentence.',
    rules: [
      { heading: 'Four jobs, four cases', body: 'Nominativ = the subject (who does it). Akkusativ = the direct object (what it happens to). Dativ = the indirect object (to/for whom). Genitiv = possession (whose). Every noun phrase in a sentence is in exactly one of these.' },
      { heading: 'The article carries the case', body: 'You usually do not change the noun itself - you change its article. "der Mann" (subject) becomes "den Mann" (object) becomes "dem Mann" (receiver). Same man, three jobs, three articles.' },
      { heading: 'Ask a question to find the case', body: 'Wer/Was? finds the Nominativ subject. Wen? finds the Akkusativ object. Wem? finds the Dativ receiver. Wessen? finds the Genitiv owner. This "ask the question" trick works for any sentence.' },
      { heading: 'Genitiv is lighter in speech', body: 'Genitiv is still everywhere in writing, but in everyday spoken German people often replace it with "von + Dativ": "das Auto von dem Mann" instead of "das Auto des Mannes". Learn to recognize it; you can lean on "von" when speaking.' },
    ],
  },
  {
    id: 'der-vs-ein',
    tier: 'A1',
    title: 'Der-words vs Ein-words',
    intro: 'German article-like words fall into two families that decline slightly differently. Knowing which family a word belongs to tells you its endings.',
    rules: [
      { heading: 'Der-words take the full endings', body: 'der/die/das plus dieser (this), jeder (every), welcher (which), mancher (some) all take the complete set of endings - including a clear ending in masculine Nominativ (der/dieser) and neuter Nominativ (das/dieses).' },
      { heading: 'Ein-words have two bare spots', body: 'ein, kein, and the possessives (mein, dein, sein, ihr, unser, euer) copy the der-word endings EXCEPT in two places where they take no ending: masculine Nominativ ("ein", "mein") and neuter Nominativ/Akkusativ ("ein", "mein").' },
      { heading: '"ein" has no plural, "kein/mein" do', body: 'You cannot say "a books", so "ein" has no plural. But "kein" (no/not any) and the possessives do: keine, keine, keinen, keiner across the plural cases - identical to the der-word plural endings (die/die/den/der) with a k-/m- stem.' },
    ],
  },
  {
    id: 'akk-vs-dat-preps',
    tier: 'A1',
    title: 'Accusative vs Dative prepositions',
    intro: 'Some prepositions lock their noun into one fixed case no matter what. There is nothing to reason about - you just memorize which preposition belongs to which case. Here are the two A1 sets.',
    rules: [
      { heading: 'Always Accusative: für, durch, gegen, ohne, um', body: 'These five never change case. Memory aid "FUDGO". Whatever follows goes into the Accusative: "für dich", "durch den Park", "gegen ihn", "ohne einen Mantel", "um den Tisch".' },
      { heading: 'Always Dative: mit, nach, bei, seit, von, zu, aus', body: 'These seven always take the Dative. Chant them: "aus, bei, mit, nach, seit, von, zu". Examples: "mit dem Bus", "nach der Arbeit", "bei der Frau", "aus der Schweiz", "zum Arzt".' },
      { heading: 'Watch for contractions', body: 'Dative "zu dem" → "zum", "zu der" → "zur", "von dem" → "vom", "bei dem" → "beim". Accusative "für das" → "fürs", "um das" → "ums", "durch das" → "durchs". These are normal and expected - not separate rules to memorize, just squished-together versions.' },
    ],
  },
];

// ---------------------------------------------------------------- lookups / fact helpers
export const GRAMMAR_TIERS = ['A1', 'A2', 'B1'];

export function pointsForTier(tier) {
  return GRAMMAR_POINTS.filter((p) => p.tier === tier);
}

export function lessonsForTier(tier) {
  return GRAMMAR_LESSONS.filter((l) => l.tier === tier);
}

export function pointById(id) {
  return GRAMMAR_POINTS.find((p) => p.id === id);
}

export function lessonById(id) {
  return GRAMMAR_LESSONS.find((l) => l.id === id);
}

/** The SRS key for a drill fact - a `g|` namespace, distinct from verb keys. */
export function grammarFactKey(fact) {
  return `g|${fact.id}`;
}

/** All drill facts for a tier, each annotated with its owning point and SRS key. */
export function drillFactsForTier(tier) {
  const out = [];
  for (const point of pointsForTier(tier)) {
    for (const fact of point.drillFacts || []) {
      out.push({ ...fact, pointId: point.id, tier: point.tier, key: grammarFactKey(fact) });
    }
  }
  return out;
}

const FACT_BY_KEY = (() => {
  const map = {};
  for (const tier of GRAMMAR_TIERS) for (const f of drillFactsForTier(tier)) map[f.key] = f;
  return map;
})();

export function grammarFactByKey(key) {
  return FACT_BY_KEY[key] || null;
}

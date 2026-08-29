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

  // ================================================================ A2 TIER ================================================================
  // Two-way prepositions + weak adjective declension. Depends on the A1 case tables above
  // (der/die/das, Akkusativ vs Dativ) - reused, never redefined.

  // ---------------------------------------------------------------- Wechselpräpositionen
  {
    id: 'a2-wechsel',
    tier: 'A2',
    topic: 'preposition',
    title: 'Two-way prepositions (Wechselpräpositionen)',
    explanation:
      'Nine prepositions can take EITHER Akkusativ or Dativ - the case tells you whether there is movement into a place or a fixed position. Motion / a change of location (answers "Wohin?" - where to?) → Akkusativ. Static location / position (answers "Wo?" - where?) → Dativ. Same preposition, two meanings: "in den Park" (into the park, motion) vs "in dem Park" (in the park, location). The nine are: in, an, auf, über, unter, vor, hinter, neben, zwischen.',
    table: {
      caption: 'Motion (Wohin? → Akkusativ) vs location (Wo? → Dativ)',
      columns: ['Prep', 'Wohin? → Akkusativ (motion)', 'Wo? → Dativ (location)'],
      rows: [
        { cells: ['in (in/into)', 'Ich gehe in den Park.', 'Ich bin in dem Park. (im Park)'] },
        { cells: ['an (at/on)', 'Ich hänge das Bild an die Wand.', 'Das Bild hängt an der Wand.'] },
        { cells: ['auf (on)', 'Ich lege das Buch auf den Tisch.', 'Das Buch liegt auf dem Tisch.'] },
        { cells: ['über (over)', 'Ich hänge die Lampe über den Tisch.', 'Die Lampe hängt über dem Tisch.'] },
        { cells: ['unter (under)', 'Die Katze geht unter den Tisch.', 'Die Katze schläft unter dem Tisch.'] },
        { cells: ['vor (in front of)', 'Ich stelle das Auto vor das Haus.', 'Das Auto steht vor dem Haus.'] },
        { cells: ['hinter (behind)', 'Ich stelle den Stuhl hinter den Tisch.', 'Der Stuhl steht hinter dem Tisch.'] },
        { cells: ['neben (next to)', 'Ich setze mich neben den Mann.', 'Ich sitze neben dem Mann.'] },
        { cells: ['zwischen (between)', 'Ich stelle die Lampe zwischen die Bücher.', 'Die Lampe steht zwischen den Büchern.'] },
      ],
    },
    examples: [
      { de: 'Ich gehe in den Park.', en: 'I go into the park.', note: 'Motion (Wohin?) → Akkusativ; "den Park" (masc. Akk.).' },
      { de: 'Ich sitze in dem Park.', en: 'I sit in the park.', note: 'Location (Wo?) → Dativ; "dem Park" (masc. Dat.), usually contracted "im Park".' },
      { de: 'Ich hänge das Bild an die Wand.', en: 'I hang the picture on the wall.', note: 'Motion → Akkusativ; "die Wand" (fem. Akk.).' },
      { de: 'Das Bild hängt an der Wand.', en: 'The picture hangs on the wall.', note: 'Location → Dativ; "der Wand" (fem. Dat.).' },
      { de: 'Das Auto steht vor dem Haus.', en: 'The car is parked in front of the house.', note: 'Location → Dativ; "dem Haus" (neut. Dat.).' },
    ],
    note: 'Contractions are normal and expected: in dem → im, in das → ins, an dem → am, an das → ans.',
    drillFacts: [
      // Wohin / Wo case-choice drill (the highest-value drill of this tier).
      { id: 'wechsel-in-wohin', type: 'wechsel-case', prompt: 'Wohin gehst du? — "Ich gehe in ___ Park." (masculine)', answer: 'den (Akkusativ)', why: '"Wohin?" = motion → Akkusativ; masc. Akk. = den.' },
      { id: 'wechsel-in-wo', type: 'wechsel-case', prompt: 'Wo bist du? — "Ich bin in ___ Park." (masculine)', answer: 'dem (Dativ)', why: '"Wo?" = location → Dativ; masc. Dat. = dem.' },
      { id: 'wechsel-an-wohin', type: 'wechsel-case', prompt: 'Wohin hängst du das Bild? — "an ___ Wand" (feminine)', answer: 'die (Akkusativ)', why: 'Motion → Akkusativ; fem. Akk. = die.' },
      { id: 'wechsel-an-wo', type: 'wechsel-case', prompt: 'Wo hängt das Bild? — "an ___ Wand" (feminine)', answer: 'der (Dativ)', why: 'Location → Dativ; fem. Dat. = der.' },
      { id: 'wechsel-auf-wohin', type: 'wechsel-case', prompt: 'Wohin legst du das Buch? — "auf ___ Tisch" (masculine)', answer: 'den (Akkusativ)', why: 'Motion → Akkusativ; masc. Akk. = den.' },
      { id: 'wechsel-auf-wo', type: 'wechsel-case', prompt: 'Wo liegt das Buch? — "auf ___ Tisch" (masculine)', answer: 'dem (Dativ)', why: 'Location → Dativ; masc. Dat. = dem.' },
      { id: 'wechsel-vor-wo', type: 'wechsel-case', prompt: 'Wo steht das Auto? — "vor ___ Haus" (neuter)', answer: 'dem (Dativ)', why: 'Location → Dativ; neut. Dat. = dem.' },
      { id: 'wechsel-unter-wohin', type: 'wechsel-case', prompt: 'Wohin geht die Katze? — "unter ___ Tisch" (masculine)', answer: 'den (Akkusativ)', why: 'Motion → Akkusativ; masc. Akk. = den.' },
      // Which case does the meaning call for?
      { id: 'wechsel-case-motion', type: 'wechsel-case', prompt: 'A Wechselpräposition with MOTION (Wohin?) takes which case?', answer: 'Akkusativ', why: 'Movement / change of place → Akkusativ.' },
      { id: 'wechsel-case-location', type: 'wechsel-case', prompt: 'A Wechselpräposition with LOCATION (Wo?) takes which case?', answer: 'Dativ', why: 'Fixed position / no movement → Dativ.' },
    ],
  },

  // ---------------------------------------------------------------- weak adjective declension
  {
    id: 'a2-adj-weak',
    tier: 'A2',
    topic: 'declension',
    title: 'Adjective endings after der-words (weak)',
    explanation:
      'When an adjective sits between a der-word (der/die/das, dieser, jeder…) and its noun, it takes a "weak" ending - and weak endings are the easy ones: only -e or -en. The rule of thumb: the five Nominativ/Akkusativ singular spots that are not masculine-accusative take -e; everything else takes -en. The der-word already shows the case, so the adjective barely has to.',
    tables: [
      {
        caption: 'Weak endings (adjective after a definite article)',
        columns: ['', 'Maskulin', 'Feminin', 'Neutrum', 'Plural'],
        colAccent: [null, 'm', 'f', 'n', 'pl'],
        rowAccent: ['nom', 'akk', 'dat', 'gen'],
        rows: [
          { label: 'Nominativ', cells: ['-e', '-e', '-e', '-en'] },
          { label: 'Akkusativ', cells: ['-en', '-e', '-e', '-en'] },
          { label: 'Dativ', cells: ['-en', '-en', '-en', '-en'] },
          { label: 'Genitiv', cells: ['-en', '-en', '-en', '-en'] },
        ],
      },
      {
        caption: 'Adjective core (base form → sample "der …e")',
        columns: ['Adjective', 'Meaning', 'In context'],
        rows: [
          { cells: ['gut', 'good', 'der gute Wein'] },
          { cells: ['groß', 'big / tall', 'der große Mann'] },
          { cells: ['klein', 'small', 'das kleine Kind'] },
          { cells: ['neu', 'new', 'das neue Auto'] },
          { cells: ['alt', 'old', 'die alte Stadt'] },
          { cells: ['schön', 'beautiful', 'die schöne Frau'] },
          { cells: ['jung', 'young', 'der junge Mann'] },
          { cells: ['teuer', 'expensive', 'der teure Mantel'] },
          { cells: ['billig', 'cheap', 'das billige Buch'] },
          { cells: ['kalt', 'cold', 'das kalte Wasser'] },
          { cells: ['warm', 'warm', 'die warme Suppe'] },
          { cells: ['schnell', 'fast', 'das schnelle Auto'] },
        ],
      },
    ],
    examples: [
      { de: 'Der große Mann liest ein Buch.', en: 'The tall man reads a book.', note: 'Nom. masc. → -e: "der große Mann".' },
      { de: 'Ich sehe den großen Mann.', en: 'I see the tall man.', note: 'Akk. masc. → -en: "den großen Mann".' },
      { de: 'Ich helfe dem großen Mann.', en: 'I help the tall man.', note: 'Dat. masc. → -en: "dem großen Mann".' },
      { de: 'Die schöne Frau singt.', en: 'The beautiful woman sings.', note: 'Nom. fem. → -e: "die schöne Frau".' },
      { de: 'Das ist der teure Mantel.', en: 'That is the expensive coat.', note: '"teuer" drops its -e- before an ending → "teure".' },
    ],
    note: 'This is only the WEAK declension (after der-words). Adjectives after "ein/kein" (mixed) and with no article (strong) come in the B1 tier.',
    drillFacts: [
      { id: 'adj-weak-nom-m', type: 'weak-adj', prompt: 'Complete: "der ___ Mann" (groß, Nominativ)', answer: 'große', why: 'Weak Nom. masc. ending = -e → große.' },
      { id: 'adj-weak-akk-m', type: 'weak-adj', prompt: 'Complete: "den ___ Mann" (groß, Akkusativ)', answer: 'großen', why: 'Weak Akk. masc. ending = -en → großen.' },
      { id: 'adj-weak-dat-m', type: 'weak-adj', prompt: 'Complete: "dem ___ Mann" (gut, Dativ)', answer: 'guten', why: 'Weak Dativ ending is always -en → guten.' },
      { id: 'adj-weak-nom-f', type: 'weak-adj', prompt: 'Complete: "die ___ Frau" (schön, Nominativ)', answer: 'schöne', why: 'Weak Nom. fem. ending = -e → schöne.' },
      { id: 'adj-weak-akk-n', type: 'weak-adj', prompt: 'Complete: "das ___ Kind" (klein, Akkusativ)', answer: 'kleine', why: 'Weak Akk. neut. ending = -e → kleine.' },
      { id: 'adj-weak-nom-pl', type: 'weak-adj', prompt: 'Complete: "die ___ Kinder" (jung, Nominativ plural)', answer: 'jungen', why: 'Weak plural ending is always -en → jungen.' },
      { id: 'adj-weak-teuer', type: 'weak-adj', prompt: 'Complete: "der ___ Mantel" (teuer, Nominativ)', answer: 'teure', why: '"teuer" drops its -e- → teur- + Nom. masc. -e = teure.' },
    ],
  },

  // ================================================================ B1 TIER ================================================================
  // Full adjective declension (weak/mixed/strong), relative pronouns, Genitiv prepositions.
  // Builds on the A1 case tables and the A2 weak declension - reused, never redefined.

  // ---------------------------------------------------------------- full adjective declension
  {
    id: 'b1-adj-full',
    tier: 'B1',
    topic: 'declension',
    title: 'Adjective endings: weak, mixed, strong',
    explanation:
      'Which endings an adjective takes depends on what stands in front of it. The adjective and the article "share the work" of showing gender and case. WEAK (after a der-word, which already shows the case clearly): the easy -e/-en set (the A2 pattern). MIXED (after ein/kein/mein, which is vague in a few spots): the adjective fills those gaps with a strong ending (-er masc Nom, -es neut Nom/Akk), otherwise -e/-en. STRONG (no article at all): the adjective does the whole job and takes the endings the article would have carried.',
    tables: [
      {
        caption: 'Weak — after der/die/das (recap from A2)',
        columns: ['', 'Maskulin', 'Feminin', 'Neutrum', 'Plural'],
        colAccent: [null, 'm', 'f', 'n', 'pl'],
        rowAccent: ['nom', 'akk', 'dat', 'gen'],
        rows: [
          { label: 'Nominativ', cells: ['-e', '-e', '-e', '-en'] },
          { label: 'Akkusativ', cells: ['-en', '-e', '-e', '-en'] },
          { label: 'Dativ', cells: ['-en', '-en', '-en', '-en'] },
          { label: 'Genitiv', cells: ['-en', '-en', '-en', '-en'] },
        ],
      },
      {
        caption: 'Mixed — after ein / kein / mein',
        columns: ['', 'Maskulin', 'Feminin', 'Neutrum', 'Plural'],
        colAccent: [null, 'm', 'f', 'n', 'pl'],
        rowAccent: ['nom', 'akk', 'dat', 'gen'],
        rows: [
          { label: 'Nominativ', cells: ['-er', '-e', '-es', '-en'] },
          { label: 'Akkusativ', cells: ['-en', '-e', '-es', '-en'] },
          { label: 'Dativ', cells: ['-en', '-en', '-en', '-en'] },
          { label: 'Genitiv', cells: ['-en', '-en', '-en', '-en'] },
        ],
      },
      {
        caption: 'Strong — no article',
        columns: ['', 'Maskulin', 'Feminin', 'Neutrum', 'Plural'],
        colAccent: [null, 'm', 'f', 'n', 'pl'],
        rowAccent: ['nom', 'akk', 'dat', 'gen'],
        rows: [
          { label: 'Nominativ', cells: ['-er', '-e', '-es', '-e'] },
          { label: 'Akkusativ', cells: ['-en', '-e', '-es', '-e'] },
          { label: 'Dativ', cells: ['-em', '-er', '-em', '-en'] },
          { label: 'Genitiv', cells: ['-en', '-er', '-en', '-er'] },
        ],
      },
    ],
    examples: [
      { de: 'Ein guter Wein ist teuer.', en: 'A good wine is expensive.', note: 'Mixed, Nom. masc. → -er: "ein" shows no ending, so the adjective takes -er.' },
      { de: 'Ich trinke ein gutes Bier.', en: 'I drink a good beer.', note: 'Mixed, Akk. neut. → -es: "ein gutes Bier".' },
      { de: 'Guter Wein ist teuer.', en: 'Good wine is expensive.', note: 'Strong (no article), Nom. masc. → -er.' },
      { de: 'Ich koche mit gutem Wein.', en: 'I cook with good wine.', note: 'Strong, Dat. masc. → -em: "mit gutem Wein".' },
      { de: 'Kaltes Bier schmeckt gut.', en: 'Cold beer tastes good.', note: 'Strong, Nom. neut. → -es.' },
    ],
    drillFacts: [
      { id: 'adj-mixed-nom-m', type: 'mixed-adj', prompt: 'Complete: "ein ___ Mann" (gut, Nominativ)', answer: 'guter', why: 'Mixed Nom. masc. → -er (ein has no ending, so the adjective shows it).' },
      { id: 'adj-mixed-nom-n', type: 'mixed-adj', prompt: 'Complete: "ein ___ Kind" (gut, Nominativ neuter)', answer: 'gutes', why: 'Mixed Nom. neut. → -es.' },
      { id: 'adj-mixed-akk-m', type: 'mixed-adj', prompt: 'Complete: "einen ___ Mann" (gut, Akkusativ)', answer: 'guten', why: 'Mixed Akk. masc. → -en.' },
      { id: 'adj-mixed-dat-m', type: 'mixed-adj', prompt: 'Complete: "mit einem ___ Mann" (gut, Dativ)', answer: 'guten', why: 'Mixed Dativ is always -en.' },
      { id: 'adj-strong-nom-m', type: 'strong-adj', prompt: 'Complete: "___ Wein" (gut, Nominativ masc, no article)', answer: 'guter', why: 'Strong Nom. masc. → -er (the adjective carries the case).' },
      { id: 'adj-strong-akk-m', type: 'strong-adj', prompt: 'Complete: "Ich trinke ___ Wein." (gut, Akkusativ masc, no article)', answer: 'guten', why: 'Strong Akk. masc. → -en.' },
      { id: 'adj-strong-dat-m', type: 'strong-adj', prompt: 'Complete: "mit ___ Wein" (gut, Dativ masc, no article)', answer: 'gutem', why: 'Strong Dat. masc. → -em.' },
      { id: 'adj-strong-nom-n', type: 'strong-adj', prompt: 'Complete: "___ Bier" (kalt, Nominativ neuter, no article)', answer: 'kaltes', why: 'Strong Nom. neut. → -es.' },
    ],
  },

  // ---------------------------------------------------------------- relative pronouns
  {
    id: 'b1-relativ',
    tier: 'B1',
    topic: 'relative',
    title: 'Relative pronouns (Relativpronomen)',
    explanation:
      'A relative clause adds information about a noun ("the man WHO lives here", "the book THAT I read"). It is introduced by a relative pronoun whose form has two inputs: the GENDER comes from the noun it refers back to, and the CASE comes from the pronoun\'s role INSIDE the relative clause. The forms are the same as the definite article, with three exceptions: Dativ plural is "denen" (not den), and every Genitiv is "dessen" (masc/neut) or "deren" (fem/plural). The conjugated verb goes to the END of the relative clause.',
    table: {
      caption: 'Relative pronoun forms (der/die/das)',
      columns: ['', 'Maskulin', 'Feminin', 'Neutrum', 'Plural'],
      colAccent: [null, 'm', 'f', 'n', 'pl'],
      rowAccent: ['nom', 'akk', 'dat', 'gen'],
      rows: [
        { label: 'Nominativ', cells: ['der', 'die', 'das', 'die'] },
        { label: 'Akkusativ', cells: ['den', 'die', 'das', 'die'] },
        { label: 'Dativ', cells: ['dem', 'der', 'dem', 'denen'] },
        { label: 'Genitiv', cells: ['dessen', 'deren', 'dessen', 'deren'] },
      ],
    },
    examples: [
      { de: 'Der Mann, der dort steht, ist mein Vater.', en: 'The man who is standing there is my father.', note: 'Refers to "der Mann" (masc); subject inside the clause → Nom. masc. = der.' },
      { de: 'Der Mann, den ich sehe, ist alt.', en: 'The man (whom) I see is old.', note: 'Object inside the clause → Akk. masc. = den.' },
      { de: 'Die Frau, der ich helfe, ist nett.', en: 'The woman (whom) I help is nice.', note: 'helfen takes Dativ → Dat. fem. = der.' },
      { de: 'Das Kind, dessen Mutter Ärztin ist, spielt.', en: 'The child whose mother is a doctor is playing.', note: 'Possession → Genitiv; masc/neut = dessen.' },
      { de: 'Die Leute, denen ich danke, sind freundlich.', en: 'The people (whom) I thank are friendly.', note: 'danken takes Dativ; plural → denen (not den).' },
    ],
    drillFacts: [
      { id: 'rel-akk-m', type: 'relativ', prompt: 'Complete: "Der Mann, ___ ich sehe, ist alt." (masc; object in the clause)', answer: 'den', why: 'Object → Akkusativ; rel. Akk. masc. = den.' },
      { id: 'rel-dat-f', type: 'relativ', prompt: 'Complete: "Die Frau, ___ ich helfe, ist nett." (fem)', answer: 'der', why: 'helfen → Dativ; rel. Dat. fem. = der.' },
      { id: 'rel-akk-n', type: 'relativ', prompt: 'Complete: "Das Auto, ___ ich fahre, ist neu." (neut; object)', answer: 'das', why: 'Object → Akkusativ; rel. Akk. neut. = das.' },
      { id: 'rel-dat-pl', type: 'relativ', prompt: 'Complete: "Die Leute, ___ ich danke, ..." (plural; danken + Dativ)', answer: 'denen', why: 'Dativ plural relative pronoun = denen (NOT den).' },
      { id: 'rel-gen-m', type: 'relativ', prompt: 'Complete: "Der Mann, ___ Auto rot ist, ..." (masc; whose)', answer: 'dessen', why: 'Possession → Genitiv; masc/neut = dessen.' },
      { id: 'rel-gen-f', type: 'relativ', prompt: 'Complete: "Die Frau, ___ Mann Arzt ist, ..." (fem; whose)', answer: 'deren', why: 'Possession → Genitiv; fem/plural = deren.' },
      { id: 'rel-case-role', type: 'relativ', prompt: 'The case of a relative pronoun comes from what?', answer: 'its role INSIDE the relative clause', why: 'Gender comes from the noun it refers to; case from its job in the clause.' },
    ],
  },

  // ---------------------------------------------------------------- genitive prepositions
  {
    id: 'b1-prep-genitiv',
    tier: 'B1',
    topic: 'preposition',
    title: 'Genitive prepositions',
    explanation:
      'A set of prepositions govern the Genitiv case. The common ones at B1 are trotz (despite), während (during) and wegen (because of). In careful and written German they take the Genitiv; in casual speech you will often hear the Dativ instead ("wegen dem Wetter"), but the Genitiv is the standard form to learn.',
    table: {
      caption: 'The three common B1 genitive prepositions',
      columns: ['Preposition', 'Meaning', 'Example'],
      rows: [
        { cells: ['trotz', 'despite / in spite of', 'trotz des Regens (despite the rain)'] },
        { cells: ['während', 'during', 'während der Woche (during the week)'] },
        { cells: ['wegen', 'because of', 'wegen des Wetters (because of the weather)'] },
      ],
    },
    examples: [
      { de: 'Trotz des Regens gehen wir spazieren.', en: 'Despite the rain, we go for a walk.', note: '"trotz" → Genitiv; "des Regens" (masc. Gen.).' },
      { de: 'Während der Woche arbeite ich viel.', en: 'During the week I work a lot.', note: '"während" → Genitiv; "der Woche" (fem. Gen.).' },
      { de: 'Wegen des Wetters bleiben wir zu Hause.', en: 'Because of the weather, we stay home.', note: '"wegen" → Genitiv; "des Wetters" (neut. Gen.).' },
    ],
    drillFacts: [
      { id: 'prep-trotz', type: 'prep-case', prompt: 'Which case does "trotz" take?', answer: 'Genitiv', why: '"trotz" is a genitive preposition.' },
      { id: 'prep-waehrend', type: 'prep-case', prompt: 'Which case does "während" take?', answer: 'Genitiv', why: '"während" is a genitive preposition.' },
      { id: 'prep-wegen', type: 'prep-case', prompt: 'Which case does "wegen" take?', answer: 'Genitiv', why: '"wegen" is a genitive preposition.' },
      { id: 'prep-gen-fill-trotz', type: 'article-fill', prompt: 'Complete: "trotz ___ Regens" (masculine, definite)', answer: 'des', why: '"trotz" → Genitiv; masc. Gen. definite = des.' },
      { id: 'prep-gen-fill-waehrend', type: 'article-fill', prompt: 'Complete: "während ___ Woche" (feminine, definite)', answer: 'der', why: '"während" → Genitiv; fem. Gen. definite = der.' },
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

  // -------------------------------------------------------------- A2 lessons
  {
    id: 'wechsel-wohin-wo',
    tier: 'A2',
    title: 'Wechselpräpositionen: Wohin vs Wo',
    intro: 'Nine prepositions - in, an, auf, über, unter, vor, hinter, neben, zwischen - can take Akkusativ OR Dativ. Which one depends entirely on meaning: is something MOVING to a new place, or is it simply THERE?',
    rules: [
      { heading: 'Motion → Akkusativ (Wohin?)', body: 'If the phrase answers "Wohin?" (where TO?) - there is movement or a change of location into/onto/under something - use Akkusativ. "Ich gehe in den Park" (I go into the park), "Ich lege das Buch auf den Tisch" (I put the book onto the table).' },
      { heading: 'Location → Dativ (Wo?)', body: 'If the phrase answers "Wo?" (where?) - a fixed position, no movement into a new place - use Dativ. "Ich bin in dem Park" (I am in the park), "Das Buch liegt auf dem Tisch" (the book lies on the table).' },
      { heading: 'The verb is a big clue', body: 'Motion verbs (gehen, legen, stellen, hängen [put], sich setzen) usually pair with Akkusativ; position verbs (sein, liegen, stehen, hängen [be hanging], sitzen) usually pair with Dativ. Same preposition, the verb tells you the direction.' },
      { heading: 'Contractions', body: 'in dem → im, in das → ins, an dem → am, an das → ans. "Ich gehe ins Kino" (motion, Akk.), "Ich bin im Kino" (location, Dat.).' },
    ],
  },
  {
    id: 'adj-weak-intro',
    tier: 'A2',
    title: 'Adjective endings after der-words (weak)',
    intro: 'German adjectives take an ending when they stand in front of a noun. After a der-word (der/die/das, dieser, jeder…) those endings are the simplest set in the language - only -e or -en.',
    rules: [
      { heading: 'Only two endings: -e and -en', body: 'After a definite article, an adjective ends in either -e or -en. There is no third option to worry about in this pattern.' },
      { heading: 'Where -e goes', body: 'Use -e in the singular Nominativ (all three genders) and in the singular Akkusativ for feminine and neuter: "der gute Wein", "die schöne Frau", "das kleine Kind". Five spots, all -e.' },
      { heading: 'Where -en goes', body: 'Everything else takes -en: masculine Akkusativ ("den guten Wein"), the entire Dativ ("dem guten Wein"), the entire Genitiv, and the entire plural ("die guten Weine").' },
      { heading: 'This is only the start', body: 'This weak pattern is for adjectives after der-words. After "ein/kein" (mixed endings) and with no article at all (strong endings), the endings differ - those two patterns come in the B1 tier.' },
    ],
  },

  // -------------------------------------------------------------- B1 lessons
  {
    id: 'adj-three-types',
    tier: 'B1',
    title: 'Adjective endings: weak, mixed, strong',
    intro: 'You already know the weak endings (after der-words). The full picture has three patterns, and which one you use depends entirely on what - if anything - comes before the adjective. The principle: the adjective and the article together must show the gender and case ONCE. If the article already shows it clearly, the adjective relaxes; if not, the adjective steps up.',
    rules: [
      { heading: 'Weak — after a der-word', body: 'der/die/das (and dieser, jeder…) already mark the case, so the adjective takes the easy -e/-en set. "der gute Wein", "dem guten Wein". This is the A2 pattern.' },
      { heading: 'Mixed — after ein / kein / mein', body: 'These are unmarked in exactly the spots where "ein" has no ending: masculine Nominativ and neuter Nominativ/Akkusativ. There the adjective takes a STRONG ending to fill the gap: "ein guter Wein" (-er), "ein gutes Bier" (-es). Everywhere else it is the same -e/-en as weak.' },
      { heading: 'Strong — no article at all', body: 'With no article, the adjective does the whole job and takes the endings the article would have had: "guter Wein" (-er), "gutem Wein" (Dat. -em), "gutes Bier" (-es). One quirk: masculine/neuter Genitiv is -en, not -es, because the noun already shows the -s ("guten Weines").' },
      { heading: 'How to choose', body: 'Look left of the adjective: a der-word → weak; an ein-word → mixed; nothing → strong. That single check picks the pattern every time.' },
    ],
  },
  {
    id: 'relative-clauses',
    tier: 'B1',
    title: 'Relative clauses (Relativpronomen)',
    intro: 'A relative clause describes a noun in more detail - "the man WHO lives here", "the book THAT I read". German builds them with a relative pronoun (der/die/das) and a very reliable word-order rule.',
    rules: [
      { heading: 'Two inputs decide the form', body: 'GENDER (and singular/plural) comes from the noun the clause describes. CASE comes from the pronoun\'s role INSIDE the relative clause - is it the subject (Nom), the object (Akk), the receiver (Dat), or a possessor (Gen)? Combine the two to pick the form.' },
      { heading: 'Mostly like the definite article - with 3 exceptions', body: 'The forms match der/die/das EXCEPT: Dativ plural is "denen" (not den), and every Genitiv is "dessen" (masc/neut) or "deren" (fem/plural). Those three are the only ones to memorize specially.' },
      { heading: 'The verb goes to the end', body: 'In the relative clause, the conjugated verb moves to the very end: "Der Mann, der dort wohnt, ..." / "Das Buch, das ich gestern gekauft habe, ...". Commas fence the clause off on both sides.' },
      { heading: 'The preposition comes first', body: 'If the pronoun follows a preposition, the preposition sits in front of it and fixes the case: "die Stadt, in der ich wohne" (in + Dativ), "der Freund, mit dem ich spiele" (mit + Dativ).' },
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

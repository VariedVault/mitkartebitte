// Vocabulary track - a NEW content type, kept entirely separate from the verb pool and the
// grammar points, feeding its OWN SRS deck (see vocabDeck.js + store.js's vocab-srs key).
// Nothing here touches or depends on the Conjugation or Cases & Grammar systems.
//
// A vocab card:
//   { id, tier ('A1'|'A2'|'B1'), theme,
//     word, partOfSpeech ('noun'|'adjective'|'adverb'|'phrase'|'other'),
//     article ('der'|'die'|'das'|null),   // required for nouns, null otherwise
//     plural (string|null),               // required for nouns, null otherwise ('—' = uncountable/rare)
//     english, example: { de, en }, note? }
//
// ACCURACY: noun gender + plural are pure memorization and the #1 error risk. Every noun's
// ARTICLE and LEVEL below is cross-checked against the DWDS Goethe wordlists (© Goethe-
// Institut, reference only - all definitions/examples here are original). Plurals are
// authored from standard dictionary forms; any uncertain ones are flagged in the phase
// report. Content is curated/Goethe-ALIGNED, NOT the official list reproduced.
//
// Verbs are intentionally excluded (they live in the Conjugation track) - this track is
// nouns (majority), adjectives, adverbs and set expressions.

// One consistent colour per gender, matching the Cases & Grammar track's gender colours so
// "this colour = this gender" is a single mental map across the whole app.
export const ARTICLE_COLORS = { der: '#6C8EFF', die: '#FF6B6B', das: '#5FD98A' };

export const VOCAB = [
  // ============================================================ A1 ============================================================
  // ---- People & Family
  { id: 'v-a1-mann', tier: 'A1', theme: 'People & Family', word: 'Mann', partOfSpeech: 'noun', article: 'der', plural: 'die Männer', english: 'man; husband', example: { de: 'Der Mann liest die Zeitung.', en: 'The man is reading the newspaper.' } },
  { id: 'v-a1-frau', tier: 'A1', theme: 'People & Family', word: 'Frau', partOfSpeech: 'noun', article: 'die', plural: 'die Frauen', english: 'woman; wife', example: { de: 'Die Frau arbeitet im Büro.', en: 'The woman works in the office.' } },
  { id: 'v-a1-kind', tier: 'A1', theme: 'People & Family', word: 'Kind', partOfSpeech: 'noun', article: 'das', plural: 'die Kinder', english: 'child', example: { de: 'Das Kind spielt im Garten.', en: 'The child is playing in the garden.' } },
  { id: 'v-a1-familie', tier: 'A1', theme: 'People & Family', word: 'Familie', partOfSpeech: 'noun', article: 'die', plural: 'die Familien', english: 'family', example: { de: 'Meine Familie ist groß.', en: 'My family is big.' } },
  { id: 'v-a1-freund', tier: 'A1', theme: 'People & Family', word: 'Freund', partOfSpeech: 'noun', article: 'der', plural: 'die Freunde', english: 'friend (male); boyfriend', example: { de: 'Mein Freund wohnt in Berlin.', en: 'My friend lives in Berlin.' } },
  { id: 'v-a1-freundin', tier: 'A1', theme: 'People & Family', word: 'Freundin', partOfSpeech: 'noun', article: 'die', plural: 'die Freundinnen', english: 'friend (female); girlfriend', example: { de: 'Ich besuche meine Freundin.', en: 'I am visiting my friend.' } },
  { id: 'v-a1-mutter', tier: 'A1', theme: 'People & Family', word: 'Mutter', partOfSpeech: 'noun', article: 'die', plural: 'die Mütter', english: 'mother', example: { de: 'Meine Mutter kocht gern.', en: 'My mother likes to cook.' } },
  { id: 'v-a1-vater', tier: 'A1', theme: 'People & Family', word: 'Vater', partOfSpeech: 'noun', article: 'der', plural: 'die Väter', english: 'father', example: { de: 'Mein Vater fährt zur Arbeit.', en: 'My father drives to work.' } },
  { id: 'v-a1-bruder', tier: 'A1', theme: 'People & Family', word: 'Bruder', partOfSpeech: 'noun', article: 'der', plural: 'die Brüder', english: 'brother', example: { de: 'Mein Bruder ist zehn Jahre alt.', en: 'My brother is ten years old.' } },
  { id: 'v-a1-schwester', tier: 'A1', theme: 'People & Family', word: 'Schwester', partOfSpeech: 'noun', article: 'die', plural: 'die Schwestern', english: 'sister', example: { de: 'Meine Schwester studiert Medizin.', en: 'My sister studies medicine.' } },
  { id: 'v-a1-eltern', tier: 'A1', theme: 'People & Family', word: 'Eltern', partOfSpeech: 'noun', article: 'die', plural: 'die Eltern', english: 'parents', example: { de: 'Meine Eltern wohnen auf dem Land.', en: 'My parents live in the countryside.' }, note: 'Plural-only noun (no singular).' },
  { id: 'v-a1-name', tier: 'A1', theme: 'People & Family', word: 'Name', partOfSpeech: 'noun', article: 'der', plural: 'die Namen', english: 'name', example: { de: 'Wie ist Ihr Name?', en: 'What is your name?' } },

  // ---- Food & Drink
  { id: 'v-a1-brot', tier: 'A1', theme: 'Food & Drink', word: 'Brot', partOfSpeech: 'noun', article: 'das', plural: 'die Brote', english: 'bread', example: { de: 'Ich kaufe frisches Brot.', en: 'I buy fresh bread.' } },
  { id: 'v-a1-ei', tier: 'A1', theme: 'Food & Drink', word: 'Ei', partOfSpeech: 'noun', article: 'das', plural: 'die Eier', english: 'egg', example: { de: 'Zum Frühstück esse ich ein Ei.', en: 'I eat an egg for breakfast.' } },
  { id: 'v-a1-apfel', tier: 'A1', theme: 'Food & Drink', word: 'Apfel', partOfSpeech: 'noun', article: 'der', plural: 'die Äpfel', english: 'apple', example: { de: 'Der Apfel ist rot und süß.', en: 'The apple is red and sweet.' } },
  { id: 'v-a1-kaffee', tier: 'A1', theme: 'Food & Drink', word: 'Kaffee', partOfSpeech: 'noun', article: 'der', plural: 'die Kaffees', english: 'coffee', example: { de: 'Möchtest du einen Kaffee?', en: 'Would you like a coffee?' } },
  { id: 'v-a1-tee', tier: 'A1', theme: 'Food & Drink', word: 'Tee', partOfSpeech: 'noun', article: 'der', plural: 'die Tees', english: 'tea', example: { de: 'Am Abend trinke ich Tee.', en: 'In the evening I drink tea.' } },
  { id: 'v-a1-milch', tier: 'A1', theme: 'Food & Drink', word: 'Milch', partOfSpeech: 'noun', article: 'die', plural: '—', english: 'milk', example: { de: 'Die Milch ist im Kühlschrank.', en: 'The milk is in the fridge.' }, note: 'Usually uncountable (no everyday plural).' },
  { id: 'v-a1-kaese', tier: 'A1', theme: 'Food & Drink', word: 'Käse', partOfSpeech: 'noun', article: 'der', plural: '—', english: 'cheese', example: { de: 'Der Käse schmeckt sehr gut.', en: 'The cheese tastes very good.' }, note: 'Usually uncountable in everyday use.' },
  { id: 'v-a1-wasser', tier: 'A1', theme: 'Food & Drink', word: 'Wasser', partOfSpeech: 'noun', article: 'das', plural: '—', english: 'water', example: { de: 'Ich trinke ein Glas Wasser.', en: 'I drink a glass of water.' }, note: 'Usually uncountable (plural "Wässer" is rare/technical).' },
  { id: 'v-a1-obst', tier: 'A1', theme: 'Food & Drink', word: 'Obst', partOfSpeech: 'noun', article: 'das', plural: '—', english: 'fruit (collective)', example: { de: 'Obst ist gesund.', en: 'Fruit is healthy.' }, note: 'Collective noun, no plural.' },
  { id: 'v-a1-gemuese', tier: 'A1', theme: 'Food & Drink', word: 'Gemüse', partOfSpeech: 'noun', article: 'das', plural: '—', english: 'vegetable(s)', example: { de: 'Ich esse gern Gemüse.', en: 'I like eating vegetables.' }, note: 'Collective noun, normally no plural.' },

  // ---- Home
  { id: 'v-a1-haus', tier: 'A1', theme: 'Home', word: 'Haus', partOfSpeech: 'noun', article: 'das', plural: 'die Häuser', english: 'house', example: { de: 'Das Haus hat einen Garten.', en: 'The house has a garden.' } },
  { id: 'v-a1-wohnung', tier: 'A1', theme: 'Home', word: 'Wohnung', partOfSpeech: 'noun', article: 'die', plural: 'die Wohnungen', english: 'apartment, flat', example: { de: 'Unsere Wohnung ist klein.', en: 'Our apartment is small.' } },
  { id: 'v-a1-zimmer', tier: 'A1', theme: 'Home', word: 'Zimmer', partOfSpeech: 'noun', article: 'das', plural: 'die Zimmer', english: 'room', example: { de: 'Mein Zimmer ist oben.', en: 'My room is upstairs.' } },
  { id: 'v-a1-tisch', tier: 'A1', theme: 'Home', word: 'Tisch', partOfSpeech: 'noun', article: 'der', plural: 'die Tische', english: 'table', example: { de: 'Das Essen steht auf dem Tisch.', en: 'The food is on the table.' } },
  { id: 'v-a1-stuhl', tier: 'A1', theme: 'Home', word: 'Stuhl', partOfSpeech: 'noun', article: 'der', plural: 'die Stühle', english: 'chair', example: { de: 'Der Stuhl ist bequem.', en: 'The chair is comfortable.' } },
  { id: 'v-a1-bett', tier: 'A1', theme: 'Home', word: 'Bett', partOfSpeech: 'noun', article: 'das', plural: 'die Betten', english: 'bed', example: { de: 'Das Kind geht ins Bett.', en: 'The child goes to bed.' } },
  { id: 'v-a1-tuer', tier: 'A1', theme: 'Home', word: 'Tür', partOfSpeech: 'noun', article: 'die', plural: 'die Türen', english: 'door', example: { de: 'Mach bitte die Tür zu.', en: 'Please close the door.' } },
  { id: 'v-a1-fenster', tier: 'A1', theme: 'Home', word: 'Fenster', partOfSpeech: 'noun', article: 'das', plural: 'die Fenster', english: 'window', example: { de: 'Das Fenster ist offen.', en: 'The window is open.' } },
  { id: 'v-a1-kueche', tier: 'A1', theme: 'Home', word: 'Küche', partOfSpeech: 'noun', article: 'die', plural: 'die Küchen', english: 'kitchen', example: { de: 'Wir essen in der Küche.', en: 'We eat in the kitchen.' } },
  { id: 'v-a1-lampe', tier: 'A1', theme: 'Home', word: 'Lampe', partOfSpeech: 'noun', article: 'die', plural: 'die Lampen', english: 'lamp', example: { de: 'Die Lampe ist kaputt.', en: 'The lamp is broken.' } },

  // ---- Travel & Transport
  { id: 'v-a1-auto', tier: 'A1', theme: 'Travel & Transport', word: 'Auto', partOfSpeech: 'noun', article: 'das', plural: 'die Autos', english: 'car', example: { de: 'Das Auto steht vor dem Haus.', en: 'The car is parked in front of the house.' } },
  { id: 'v-a1-zug', tier: 'A1', theme: 'Travel & Transport', word: 'Zug', partOfSpeech: 'noun', article: 'der', plural: 'die Züge', english: 'train', example: { de: 'Der Zug kommt um acht Uhr.', en: 'The train comes at eight o\'clock.' } },
  { id: 'v-a1-bus', tier: 'A1', theme: 'Travel & Transport', word: 'Bus', partOfSpeech: 'noun', article: 'der', plural: 'die Busse', english: 'bus', example: { de: 'Ich fahre mit dem Bus zur Schule.', en: 'I take the bus to school.' } },
  { id: 'v-a1-bahnhof', tier: 'A1', theme: 'Travel & Transport', word: 'Bahnhof', partOfSpeech: 'noun', article: 'der', plural: 'die Bahnhöfe', english: 'train station', example: { de: 'Wo ist der Bahnhof?', en: 'Where is the train station?' } },
  { id: 'v-a1-strasse', tier: 'A1', theme: 'Travel & Transport', word: 'Straße', partOfSpeech: 'noun', article: 'die', plural: 'die Straßen', english: 'street', example: { de: 'Ich wohne in dieser Straße.', en: 'I live on this street.' } },
  { id: 'v-a1-fahrrad', tier: 'A1', theme: 'Travel & Transport', word: 'Fahrrad', partOfSpeech: 'noun', article: 'das', plural: 'die Fahrräder', english: 'bicycle', example: { de: 'Mein Fahrrad ist neu.', en: 'My bicycle is new.' } },
  { id: 'v-a1-reise', tier: 'A1', theme: 'Travel & Transport', word: 'Reise', partOfSpeech: 'noun', article: 'die', plural: 'die Reisen', english: 'trip, journey', example: { de: 'Die Reise war lang.', en: 'The journey was long.' } },

  // ---- Work & School
  { id: 'v-a1-arbeit', tier: 'A1', theme: 'Work & School', word: 'Arbeit', partOfSpeech: 'noun', article: 'die', plural: 'die Arbeiten', english: 'work; job', example: { de: 'Die Arbeit macht mir Spaß.', en: 'I enjoy the work.' } },
  { id: 'v-a1-schule', tier: 'A1', theme: 'Work & School', word: 'Schule', partOfSpeech: 'noun', article: 'die', plural: 'die Schulen', english: 'school', example: { de: 'Die Kinder gehen in die Schule.', en: 'The children go to school.' } },
  { id: 'v-a1-lehrer', tier: 'A1', theme: 'Work & School', word: 'Lehrer', partOfSpeech: 'noun', article: 'der', plural: 'die Lehrer', english: 'teacher (male)', example: { de: 'Der Lehrer erklärt die Aufgabe.', en: 'The teacher explains the task.' } },
  { id: 'v-a1-lehrerin', tier: 'A1', theme: 'Work & School', word: 'Lehrerin', partOfSpeech: 'noun', article: 'die', plural: 'die Lehrerinnen', english: 'teacher (female)', example: { de: 'Die Lehrerin ist sehr nett.', en: 'The teacher is very nice.' } },
  { id: 'v-a1-buch', tier: 'A1', theme: 'Work & School', word: 'Buch', partOfSpeech: 'noun', article: 'das', plural: 'die Bücher', english: 'book', example: { de: 'Das Buch ist spannend.', en: 'The book is exciting.' } },
  { id: 'v-a1-stift', tier: 'A1', theme: 'Work & School', word: 'Stift', partOfSpeech: 'noun', article: 'der', plural: 'die Stifte', english: 'pen, pencil', example: { de: 'Der Stift schreibt nicht mehr.', en: 'The pen no longer writes.' } },
  { id: 'v-a1-buero', tier: 'A1', theme: 'Work & School', word: 'Büro', partOfSpeech: 'noun', article: 'das', plural: 'die Büros', english: 'office', example: { de: 'Sie arbeitet im Büro.', en: 'She works in the office.' } },
  { id: 'v-a1-beruf', tier: 'A1', theme: 'Work & School', word: 'Beruf', partOfSpeech: 'noun', article: 'der', plural: 'die Berufe', english: 'profession, job', example: { de: 'Was sind Sie von Beruf?', en: 'What is your profession?' } },

  // ---- Time & Dates
  { id: 'v-a1-tag', tier: 'A1', theme: 'Time & Dates', word: 'Tag', partOfSpeech: 'noun', article: 'der', plural: 'die Tage', english: 'day', example: { de: 'Der Tag war sehr schön.', en: 'The day was very nice.' } },
  { id: 'v-a1-woche', tier: 'A1', theme: 'Time & Dates', word: 'Woche', partOfSpeech: 'noun', article: 'die', plural: 'die Wochen', english: 'week', example: { de: 'Nächste Woche habe ich Urlaub.', en: 'Next week I am on holiday.' } },
  { id: 'v-a1-monat', tier: 'A1', theme: 'Time & Dates', word: 'Monat', partOfSpeech: 'noun', article: 'der', plural: 'die Monate', english: 'month', example: { de: 'Der Monat Mai ist warm.', en: 'The month of May is warm.' } },
  { id: 'v-a1-jahr', tier: 'A1', theme: 'Time & Dates', word: 'Jahr', partOfSpeech: 'noun', article: 'das', plural: 'die Jahre', english: 'year', example: { de: 'Das Jahr hat zwölf Monate.', en: 'The year has twelve months.' } },
  { id: 'v-a1-stunde', tier: 'A1', theme: 'Time & Dates', word: 'Stunde', partOfSpeech: 'noun', article: 'die', plural: 'die Stunden', english: 'hour', example: { de: 'Ich warte seit einer Stunde.', en: 'I have been waiting for an hour.' } },
  { id: 'v-a1-minute', tier: 'A1', theme: 'Time & Dates', word: 'Minute', partOfSpeech: 'noun', article: 'die', plural: 'die Minuten', english: 'minute', example: { de: 'Warte eine Minute, bitte.', en: 'Wait a minute, please.' } },
  { id: 'v-a1-uhr', tier: 'A1', theme: 'Time & Dates', word: 'Uhr', partOfSpeech: 'noun', article: 'die', plural: 'die Uhren', english: 'clock; watch; o\'clock', example: { de: 'Die Uhr an der Wand ist alt.', en: 'The clock on the wall is old.' } },
  { id: 'v-a1-abend', tier: 'A1', theme: 'Time & Dates', word: 'Abend', partOfSpeech: 'noun', article: 'der', plural: 'die Abende', english: 'evening', example: { de: 'Am Abend sehe ich fern.', en: 'In the evening I watch TV.' } },
  { id: 'v-a1-nacht', tier: 'A1', theme: 'Time & Dates', word: 'Nacht', partOfSpeech: 'noun', article: 'die', plural: 'die Nächte', english: 'night', example: { de: 'Gute Nacht!', en: 'Good night!' } },

  // ---- Body & Health
  { id: 'v-a1-kopf', tier: 'A1', theme: 'Body & Health', word: 'Kopf', partOfSpeech: 'noun', article: 'der', plural: 'die Köpfe', english: 'head', example: { de: 'Mein Kopf tut weh.', en: 'My head hurts.' } },
  { id: 'v-a1-hand', tier: 'A1', theme: 'Body & Health', word: 'Hand', partOfSpeech: 'noun', article: 'die', plural: 'die Hände', english: 'hand', example: { de: 'Gib mir deine Hand.', en: 'Give me your hand.' } },
  { id: 'v-a1-auge', tier: 'A1', theme: 'Body & Health', word: 'Auge', partOfSpeech: 'noun', article: 'das', plural: 'die Augen', english: 'eye', example: { de: 'Sie hat blaue Augen.', en: 'She has blue eyes.' } },
  { id: 'v-a1-arzt', tier: 'A1', theme: 'Body & Health', word: 'Arzt', partOfSpeech: 'noun', article: 'der', plural: 'die Ärzte', english: 'doctor (male)', example: { de: 'Ich gehe heute zum Arzt.', en: 'I am going to the doctor today.' } },
  { id: 'v-a1-apotheke', tier: 'A1', theme: 'Body & Health', word: 'Apotheke', partOfSpeech: 'noun', article: 'die', plural: 'die Apotheken', english: 'pharmacy', example: { de: 'Die Apotheke ist um die Ecke.', en: 'The pharmacy is around the corner.' } },

  // ---- Shopping & Money
  { id: 'v-a1-geld', tier: 'A1', theme: 'Shopping & Money', word: 'Geld', partOfSpeech: 'noun', article: 'das', plural: '—', english: 'money', example: { de: 'Ich habe kein Geld dabei.', en: 'I have no money on me.' }, note: 'Usually uncountable ("Gelder" = funds, formal).' },
  { id: 'v-a1-preis', tier: 'A1', theme: 'Shopping & Money', word: 'Preis', partOfSpeech: 'noun', article: 'der', plural: 'die Preise', english: 'price', example: { de: 'Der Preis ist zu hoch.', en: 'The price is too high.' } },
  { id: 'v-a1-geschaeft', tier: 'A1', theme: 'Shopping & Money', word: 'Geschäft', partOfSpeech: 'noun', article: 'das', plural: 'die Geschäfte', english: 'shop; business', example: { de: 'Das Geschäft schließt um acht.', en: 'The shop closes at eight.' } },
  { id: 'v-a1-markt', tier: 'A1', theme: 'Shopping & Money', word: 'Markt', partOfSpeech: 'noun', article: 'der', plural: 'die Märkte', english: 'market', example: { de: 'Am Samstag gehen wir auf den Markt.', en: 'On Saturday we go to the market.' } },
  { id: 'v-a1-tasche', tier: 'A1', theme: 'Shopping & Money', word: 'Tasche', partOfSpeech: 'noun', article: 'die', plural: 'die Taschen', english: 'bag; pocket', example: { de: 'Meine Tasche ist schwer.', en: 'My bag is heavy.' } },

  // ---- City & Places
  { id: 'v-a1-stadt', tier: 'A1', theme: 'City & Places', word: 'Stadt', partOfSpeech: 'noun', article: 'die', plural: 'die Städte', english: 'city, town', example: { de: 'Die Stadt ist sehr alt.', en: 'The city is very old.' } },
  { id: 'v-a1-land', tier: 'A1', theme: 'City & Places', word: 'Land', partOfSpeech: 'noun', article: 'das', plural: 'die Länder', english: 'country; countryside', example: { de: 'Deutschland ist ein schönes Land.', en: 'Germany is a beautiful country.' } },
  { id: 'v-a1-park', tier: 'A1', theme: 'City & Places', word: 'Park', partOfSpeech: 'noun', article: 'der', plural: 'die Parks', english: 'park', example: { de: 'Wir gehen im Park spazieren.', en: 'We go for a walk in the park.' } },
  { id: 'v-a1-kino', tier: 'A1', theme: 'City & Places', word: 'Kino', partOfSpeech: 'noun', article: 'das', plural: 'die Kinos', english: 'cinema', example: { de: 'Heute Abend gehen wir ins Kino.', en: 'Tonight we are going to the cinema.' } },
  { id: 'v-a1-hotel', tier: 'A1', theme: 'City & Places', word: 'Hotel', partOfSpeech: 'noun', article: 'das', plural: 'die Hotels', english: 'hotel', example: { de: 'Das Hotel liegt am Meer.', en: 'The hotel is by the sea.' } },

  // ---- Adjectives
  { id: 'v-a1-gross', tier: 'A1', theme: 'Adjectives', word: 'groß', partOfSpeech: 'adjective', article: null, plural: null, english: 'big, tall', example: { de: 'Der Hund ist sehr groß.', en: 'The dog is very big.' } },
  { id: 'v-a1-klein', tier: 'A1', theme: 'Adjectives', word: 'klein', partOfSpeech: 'adjective', article: null, plural: null, english: 'small, little', example: { de: 'Das Zimmer ist klein.', en: 'The room is small.' } },
  { id: 'v-a1-gut', tier: 'A1', theme: 'Adjectives', word: 'gut', partOfSpeech: 'adjective', article: null, plural: null, english: 'good', example: { de: 'Das Essen ist gut.', en: 'The food is good.' } },
  { id: 'v-a1-schlecht', tier: 'A1', theme: 'Adjectives', word: 'schlecht', partOfSpeech: 'adjective', article: null, plural: null, english: 'bad', example: { de: 'Das Wetter ist heute schlecht.', en: 'The weather is bad today.' } },
  { id: 'v-a1-neu', tier: 'A1', theme: 'Adjectives', word: 'neu', partOfSpeech: 'adjective', article: null, plural: null, english: 'new', example: { de: 'Ich habe ein neues Handy.', en: 'I have a new phone.' } },
  { id: 'v-a1-alt', tier: 'A1', theme: 'Adjectives', word: 'alt', partOfSpeech: 'adjective', article: null, plural: null, english: 'old', example: { de: 'Das Auto ist schon alt.', en: 'The car is already old.' } },
  { id: 'v-a1-schoen', tier: 'A1', theme: 'Adjectives', word: 'schön', partOfSpeech: 'adjective', article: null, plural: null, english: 'beautiful, nice', example: { de: 'Was für ein schöner Tag!', en: 'What a beautiful day!' } },
  { id: 'v-a1-teuer', tier: 'A1', theme: 'Adjectives', word: 'teuer', partOfSpeech: 'adjective', article: null, plural: null, english: 'expensive', example: { de: 'Diese Schuhe sind zu teuer.', en: 'These shoes are too expensive.' } },
  { id: 'v-a1-billig', tier: 'A1', theme: 'Adjectives', word: 'billig', partOfSpeech: 'adjective', article: null, plural: null, english: 'cheap', example: { de: 'Das Brot hier ist billig.', en: 'The bread here is cheap.' } },
  { id: 'v-a1-warm', tier: 'A1', theme: 'Adjectives', word: 'warm', partOfSpeech: 'adjective', article: null, plural: null, english: 'warm', example: { de: 'Die Suppe ist noch warm.', en: 'The soup is still warm.' } },
  { id: 'v-a1-kalt', tier: 'A1', theme: 'Adjectives', word: 'kalt', partOfSpeech: 'adjective', article: null, plural: null, english: 'cold', example: { de: 'Im Winter ist es kalt.', en: 'In winter it is cold.' } },
  { id: 'v-a1-schnell', tier: 'A1', theme: 'Adjectives', word: 'schnell', partOfSpeech: 'adjective', article: null, plural: null, english: 'fast, quick', example: { de: 'Der Zug ist sehr schnell.', en: 'The train is very fast.' } },
  { id: 'v-a1-langsam', tier: 'A1', theme: 'Adjectives', word: 'langsam', partOfSpeech: 'adjective', article: null, plural: null, english: 'slow', example: { de: 'Bitte sprich langsam.', en: 'Please speak slowly.' } },
  { id: 'v-a1-jung', tier: 'A1', theme: 'Adjectives', word: 'jung', partOfSpeech: 'adjective', article: null, plural: null, english: 'young', example: { de: 'Sie ist noch sehr jung.', en: 'She is still very young.' } },
  { id: 'v-a1-muede', tier: 'A1', theme: 'Adjectives', word: 'müde', partOfSpeech: 'adjective', article: null, plural: null, english: 'tired', example: { de: 'Ich bin heute sehr müde.', en: 'I am very tired today.' } },
  { id: 'v-a1-hungrig', tier: 'A1', theme: 'Adjectives', word: 'hungrig', partOfSpeech: 'adjective', article: null, plural: null, english: 'hungry', example: { de: 'Nach dem Sport bin ich hungrig.', en: 'After sport I am hungry.' } },
  { id: 'v-a1-richtig', tier: 'A1', theme: 'Adjectives', word: 'richtig', partOfSpeech: 'adjective', article: null, plural: null, english: 'correct, right', example: { de: 'Deine Antwort ist richtig.', en: 'Your answer is correct.' } },
  { id: 'v-a1-falsch', tier: 'A1', theme: 'Adjectives', word: 'falsch', partOfSpeech: 'adjective', article: null, plural: null, english: 'wrong, false', example: { de: 'Das ist die falsche Adresse.', en: 'That is the wrong address.' } },

  // ---- Adverbs & common words
  { id: 'v-a1-hier', tier: 'A1', theme: 'Common words', word: 'hier', partOfSpeech: 'adverb', article: null, plural: null, english: 'here', example: { de: 'Ich wohne hier.', en: 'I live here.' } },
  { id: 'v-a1-dort', tier: 'A1', theme: 'Common words', word: 'dort', partOfSpeech: 'adverb', article: null, plural: null, english: 'there', example: { de: 'Dort ist der Bahnhof.', en: 'The station is over there.' } },
  { id: 'v-a1-jetzt', tier: 'A1', theme: 'Common words', word: 'jetzt', partOfSpeech: 'adverb', article: null, plural: null, english: 'now', example: { de: 'Wir müssen jetzt gehen.', en: 'We have to go now.' } },
  { id: 'v-a1-immer', tier: 'A1', theme: 'Common words', word: 'immer', partOfSpeech: 'adverb', article: null, plural: null, english: 'always', example: { de: 'Er kommt immer zu spät.', en: 'He is always late.' } },
  { id: 'v-a1-oft', tier: 'A1', theme: 'Common words', word: 'oft', partOfSpeech: 'adverb', article: null, plural: null, english: 'often', example: { de: 'Wir gehen oft schwimmen.', en: 'We often go swimming.' } },
  { id: 'v-a1-manchmal', tier: 'A1', theme: 'Common words', word: 'manchmal', partOfSpeech: 'adverb', article: null, plural: null, english: 'sometimes', example: { de: 'Manchmal koche ich selbst.', en: 'Sometimes I cook myself.' } },
  { id: 'v-a1-sehr', tier: 'A1', theme: 'Common words', word: 'sehr', partOfSpeech: 'adverb', article: null, plural: null, english: 'very', example: { de: 'Das Buch ist sehr gut.', en: 'The book is very good.' } },
  { id: 'v-a1-gern', tier: 'A1', theme: 'Common words', word: 'gern', partOfSpeech: 'adverb', article: null, plural: null, english: 'gladly, like to', example: { de: 'Ich trinke gern Kaffee.', en: 'I like drinking coffee.' } },
  { id: 'v-a1-auch', tier: 'A1', theme: 'Common words', word: 'auch', partOfSpeech: 'adverb', article: null, plural: null, english: 'also, too', example: { de: 'Ich komme auch mit.', en: 'I am coming along too.' } },
  { id: 'v-a1-nur', tier: 'A1', theme: 'Common words', word: 'nur', partOfSpeech: 'adverb', article: null, plural: null, english: 'only, just', example: { de: 'Ich habe nur zehn Euro.', en: 'I only have ten euros.' } },

  // ---- Everyday expressions
  { id: 'v-a1-guten-morgen', tier: 'A1', theme: 'Expressions', word: 'Guten Morgen', partOfSpeech: 'phrase', article: null, plural: null, english: 'Good morning', example: { de: 'Guten Morgen! Wie geht es dir?', en: 'Good morning! How are you?' } },
  { id: 'v-a1-guten-tag', tier: 'A1', theme: 'Expressions', word: 'Guten Tag', partOfSpeech: 'phrase', article: null, plural: null, english: 'Hello / Good day', example: { de: 'Guten Tag, ich hätte gern ein Brot.', en: 'Hello, I would like a loaf of bread.' } },
  { id: 'v-a1-auf-wiedersehen', tier: 'A1', theme: 'Expressions', word: 'Auf Wiedersehen', partOfSpeech: 'phrase', article: null, plural: null, english: 'Goodbye', example: { de: 'Auf Wiedersehen, bis morgen!', en: 'Goodbye, see you tomorrow!' } },
  { id: 'v-a1-danke-schoen', tier: 'A1', theme: 'Expressions', word: 'Danke schön', partOfSpeech: 'phrase', article: null, plural: null, english: 'Thank you very much', example: { de: 'Danke schön für die Hilfe!', en: 'Thank you very much for the help!' } },
  { id: 'v-a1-bitte', tier: 'A1', theme: 'Expressions', word: 'bitte', partOfSpeech: 'phrase', article: null, plural: null, english: 'please; you\'re welcome', example: { de: 'Einen Kaffee, bitte.', en: 'A coffee, please.' } },
  { id: 'v-a1-entschuldigung', tier: 'A1', theme: 'Expressions', word: 'Entschuldigung', partOfSpeech: 'phrase', article: null, plural: null, english: 'Excuse me; sorry', example: { de: 'Entschuldigung, wo ist der Ausgang?', en: 'Excuse me, where is the exit?' } },
  { id: 'v-a1-wie-gehts', tier: 'A1', theme: 'Expressions', word: 'Wie geht\'s?', partOfSpeech: 'phrase', article: null, plural: null, english: 'How are you?', example: { de: 'Hallo Anna, wie geht\'s?', en: 'Hi Anna, how are you?' } },

  // ============================================================ A2 ============================================================
  // ---- People & Family
  { id: 'v-a2-dame', tier: 'A2', theme: 'People & Family', word: 'Dame', partOfSpeech: 'noun', article: 'die', plural: 'die Damen', english: 'lady', example: { de: 'Die Dame am Schalter war sehr freundlich.', en: 'The lady at the counter was very friendly.' } },
  { id: 'v-a2-nachbar', tier: 'A2', theme: 'People & Family', word: 'Nachbar', partOfSpeech: 'noun', article: 'der', plural: 'die Nachbarn', english: 'neighbour', example: { de: 'Unser Nachbar ist sehr laut.', en: 'Our neighbour is very loud.' }, note: 'N-declension: den/dem/des Nachbarn.' },
  { id: 'v-a2-gast', tier: 'A2', theme: 'People & Family', word: 'Gast', partOfSpeech: 'noun', article: 'der', plural: 'die Gäste', english: 'guest', example: { de: 'Wir haben heute Abend Gäste.', en: 'We have guests this evening.' } },
  { id: 'v-a2-kollege', tier: 'A2', theme: 'People & Family', word: 'Kollege', partOfSpeech: 'noun', article: 'der', plural: 'die Kollegen', english: 'colleague (male)', example: { de: 'Mein Kollege hilft mir oft.', en: 'My colleague often helps me.' }, note: 'N-declension: den/dem/des Kollegen.' },
  { id: 'v-a2-chef', tier: 'A2', theme: 'People & Family', word: 'Chef', partOfSpeech: 'noun', article: 'der', plural: 'die Chefs', english: 'boss (male)', example: { de: 'Der Chef ist heute nicht da.', en: 'The boss is not here today.' } },
  { id: 'v-a2-chefin', tier: 'A2', theme: 'People & Family', word: 'Chefin', partOfSpeech: 'noun', article: 'die', plural: 'die Chefinnen', english: 'boss (female)', example: { de: 'Meine Chefin ist sehr fair.', en: 'My boss is very fair.' } },

  // ---- Food & Drink
  { id: 'v-a2-gericht', tier: 'A2', theme: 'Food & Drink', word: 'Gericht', partOfSpeech: 'noun', article: 'das', plural: 'die Gerichte', english: 'dish (food); court', example: { de: 'Dieses Gericht schmeckt fantastisch.', en: 'This dish tastes fantastic.' } },
  { id: 'v-a2-suppe', tier: 'A2', theme: 'Food & Drink', word: 'Suppe', partOfSpeech: 'noun', article: 'die', plural: 'die Suppen', english: 'soup', example: { de: 'Die Suppe ist noch zu heiß.', en: 'The soup is still too hot.' } },
  { id: 'v-a2-kuchen', tier: 'A2', theme: 'Food & Drink', word: 'Kuchen', partOfSpeech: 'noun', article: 'der', plural: 'die Kuchen', english: 'cake', example: { de: 'Meine Oma backt den besten Kuchen.', en: 'My grandma bakes the best cake.' } },
  { id: 'v-a2-eis', tier: 'A2', theme: 'Food & Drink', word: 'Eis', partOfSpeech: 'noun', article: 'das', plural: '—', english: 'ice; ice cream', example: { de: 'Im Sommer esse ich gern Eis.', en: 'In summer I like eating ice cream.' }, note: 'Usually uncountable in everyday use.' },
  { id: 'v-a2-fleisch', tier: 'A2', theme: 'Food & Drink', word: 'Fleisch', partOfSpeech: 'noun', article: 'das', plural: '—', english: 'meat', example: { de: 'Ich esse kein Fleisch.', en: 'I do not eat meat.' }, note: 'Uncountable.' },

  // ---- Home
  { id: 'v-a2-garten', tier: 'A2', theme: 'Home', word: 'Garten', partOfSpeech: 'noun', article: 'der', plural: 'die Gärten', english: 'garden', example: { de: 'Im Garten wachsen Tomaten.', en: 'Tomatoes grow in the garden.' } },
  { id: 'v-a2-keller', tier: 'A2', theme: 'Home', word: 'Keller', partOfSpeech: 'noun', article: 'der', plural: 'die Keller', english: 'cellar, basement', example: { de: 'Die Getränke sind im Keller.', en: 'The drinks are in the basement.' } },
  { id: 'v-a2-balkon', tier: 'A2', theme: 'Home', word: 'Balkon', partOfSpeech: 'noun', article: 'der', plural: 'die Balkone', english: 'balcony', example: { de: 'Wir frühstücken auf dem Balkon.', en: 'We have breakfast on the balcony.' } },
  { id: 'v-a2-garage', tier: 'A2', theme: 'Home', word: 'Garage', partOfSpeech: 'noun', article: 'die', plural: 'die Garagen', english: 'garage', example: { de: 'Das Auto steht in der Garage.', en: 'The car is in the garage.' } },
  { id: 'v-a2-heizung', tier: 'A2', theme: 'Home', word: 'Heizung', partOfSpeech: 'noun', article: 'die', plural: 'die Heizungen', english: 'heating', example: { de: 'Die Heizung funktioniert nicht.', en: 'The heating is not working.' } },
  { id: 'v-a2-moebel', tier: 'A2', theme: 'Home', word: 'Möbel', partOfSpeech: 'noun', article: 'das', plural: 'die Möbel', english: 'furniture (piece of)', example: { de: 'Die Möbel sind neu.', en: 'The furniture is new.' }, note: 'Mostly used in the plural (die Möbel).' },

  // ---- Travel & Transport
  { id: 'v-a2-flug', tier: 'A2', theme: 'Travel & Transport', word: 'Flug', partOfSpeech: 'noun', article: 'der', plural: 'die Flüge', english: 'flight', example: { de: 'Der Flug nach Rom war günstig.', en: 'The flight to Rome was cheap.' } },
  { id: 'v-a2-fahrplan', tier: 'A2', theme: 'Travel & Transport', word: 'Fahrplan', partOfSpeech: 'noun', article: 'der', plural: 'die Fahrpläne', english: 'timetable, schedule', example: { de: 'Der Fahrplan hängt am Bahnhof.', en: 'The timetable is posted at the station.' } },
  { id: 'v-a2-fuehrerschein', tier: 'A2', theme: 'Travel & Transport', word: 'Führerschein', partOfSpeech: 'noun', article: 'der', plural: 'die Führerscheine', english: 'driving licence', example: { de: 'Ich mache gerade meinen Führerschein.', en: 'I am currently getting my driving licence.' } },
  { id: 'v-a2-ampel', tier: 'A2', theme: 'Travel & Transport', word: 'Ampel', partOfSpeech: 'noun', article: 'die', plural: 'die Ampeln', english: 'traffic light', example: { de: 'An der Ampel musst du rechts abbiegen.', en: 'At the traffic light you have to turn right.' } },
  { id: 'v-a2-bruecke', tier: 'A2', theme: 'Travel & Transport', word: 'Brücke', partOfSpeech: 'noun', article: 'die', plural: 'die Brücken', english: 'bridge', example: { de: 'Die Brücke ist sehr alt.', en: 'The bridge is very old.' } },
  { id: 'v-a2-ausflug', tier: 'A2', theme: 'Travel & Transport', word: 'Ausflug', partOfSpeech: 'noun', article: 'der', plural: 'die Ausflüge', english: 'excursion, day trip', example: { de: 'Wir machen einen Ausflug ans Meer.', en: 'We are taking a trip to the seaside.' } },
  { id: 'v-a2-berg', tier: 'A2', theme: 'Travel & Transport', word: 'Berg', partOfSpeech: 'noun', article: 'der', plural: 'die Berge', english: 'mountain', example: { de: 'Im Winter fahren wir in die Berge.', en: 'In winter we go to the mountains.' } },
  { id: 'v-a2-fluss', tier: 'A2', theme: 'Travel & Transport', word: 'Fluss', partOfSpeech: 'noun', article: 'der', plural: 'die Flüsse', english: 'river', example: { de: 'Der Fluss fließt durch die Stadt.', en: 'The river flows through the city.' } },

  // ---- Work & School
  { id: 'v-a2-ausbildung', tier: 'A2', theme: 'Work & School', word: 'Ausbildung', partOfSpeech: 'noun', article: 'die', plural: 'die Ausbildungen', english: 'training, apprenticeship', example: { de: 'Sie macht eine Ausbildung als Krankenschwester.', en: 'She is training to be a nurse.' } },
  { id: 'v-a2-bewerbung', tier: 'A2', theme: 'Work & School', word: 'Bewerbung', partOfSpeech: 'noun', article: 'die', plural: 'die Bewerbungen', english: 'application (job)', example: { de: 'Ich schreibe gerade eine Bewerbung.', en: 'I am writing a job application right now.' } },
  { id: 'v-a2-erfahrung', tier: 'A2', theme: 'Work & School', word: 'Erfahrung', partOfSpeech: 'noun', article: 'die', plural: 'die Erfahrungen', english: 'experience', example: { de: 'Er hat viel Erfahrung im Verkauf.', en: 'He has a lot of experience in sales.' } },
  { id: 'v-a2-gehalt', tier: 'A2', theme: 'Work & School', word: 'Gehalt', partOfSpeech: 'noun', article: 'das', plural: 'die Gehälter', english: 'salary', example: { de: 'Das Gehalt ist am Monatsende auf dem Konto.', en: 'The salary is in the account at the end of the month.' } },
  { id: 'v-a2-termin', tier: 'A2', theme: 'Work & School', word: 'Termin', partOfSpeech: 'noun', article: 'der', plural: 'die Termine', english: 'appointment', example: { de: 'Ich habe morgen einen wichtigen Termin.', en: 'I have an important appointment tomorrow.' } },
  { id: 'v-a2-kurs', tier: 'A2', theme: 'Work & School', word: 'Kurs', partOfSpeech: 'noun', article: 'der', plural: 'die Kurse', english: 'course, class', example: { de: 'Der Deutschkurs beginnt im September.', en: 'The German course starts in September.' } },
  { id: 'v-a2-pruefung', tier: 'A2', theme: 'Work & School', word: 'Prüfung', partOfSpeech: 'noun', article: 'die', plural: 'die Prüfungen', english: 'exam, test', example: { de: 'Die Prüfung war ziemlich schwer.', en: 'The exam was quite hard.' } },

  // ---- Time & Dates
  { id: 'v-a2-ferien', tier: 'A2', theme: 'Time & Dates', word: 'Ferien', partOfSpeech: 'noun', article: 'die', plural: 'die Ferien', english: 'holidays, vacation', example: { de: 'In den Ferien fahren wir nach Spanien.', en: 'During the holidays we go to Spain.' }, note: 'Plural-only noun.' },
  { id: 'v-a2-feier', tier: 'A2', theme: 'Time & Dates', word: 'Feier', partOfSpeech: 'noun', article: 'die', plural: 'die Feiern', english: 'celebration, party', example: { de: 'Die Feier war ein großer Erfolg.', en: 'The celebration was a big success.' } },
  { id: 'v-a2-fest', tier: 'A2', theme: 'Time & Dates', word: 'Fest', partOfSpeech: 'noun', article: 'das', plural: 'die Feste', english: 'festival, celebration', example: { de: 'Das Fest dauert bis Mitternacht.', en: 'The festival lasts until midnight.' } },

  // ---- Body & Health
  { id: 'v-a2-hals', tier: 'A2', theme: 'Body & Health', word: 'Hals', partOfSpeech: 'noun', article: 'der', plural: 'die Hälse', english: 'neck; throat', example: { de: 'Mein Hals tut weh.', en: 'My throat hurts.' } },
  { id: 'v-a2-zahn', tier: 'A2', theme: 'Body & Health', word: 'Zahn', partOfSpeech: 'noun', article: 'der', plural: 'die Zähne', english: 'tooth', example: { de: 'Der Zahn tut seit gestern weh.', en: 'The tooth has hurt since yesterday.' } },
  { id: 'v-a2-bauch', tier: 'A2', theme: 'Body & Health', word: 'Bauch', partOfSpeech: 'noun', article: 'der', plural: 'die Bäuche', english: 'belly, stomach', example: { de: 'Nach dem Essen tut mir der Bauch weh.', en: 'After the meal my stomach hurts.' } },
  { id: 'v-a2-grippe', tier: 'A2', theme: 'Body & Health', word: 'Grippe', partOfSpeech: 'noun', article: 'die', plural: '—', english: 'flu', example: { de: 'Sie liegt mit Grippe im Bett.', en: 'She is in bed with the flu.' }, note: 'Normally used without a plural.' },
  { id: 'v-a2-fieber', tier: 'A2', theme: 'Body & Health', word: 'Fieber', partOfSpeech: 'noun', article: 'das', plural: '—', english: 'fever', example: { de: 'Das Kind hat hohes Fieber.', en: 'The child has a high fever.' }, note: 'Normally uncountable.' },
  { id: 'v-a2-krankenhaus', tier: 'A2', theme: 'Body & Health', word: 'Krankenhaus', partOfSpeech: 'noun', article: 'das', plural: 'die Krankenhäuser', english: 'hospital', example: { de: 'Er liegt seit einer Woche im Krankenhaus.', en: 'He has been in hospital for a week.' } },

  // ---- Shopping & Money
  { id: 'v-a2-kasse', tier: 'A2', theme: 'Shopping & Money', word: 'Kasse', partOfSpeech: 'noun', article: 'die', plural: 'die Kassen', english: 'checkout, till', example: { de: 'Bitte zahlen Sie an der Kasse.', en: 'Please pay at the checkout.' } },
  { id: 'v-a2-rechnung', tier: 'A2', theme: 'Shopping & Money', word: 'Rechnung', partOfSpeech: 'noun', article: 'die', plural: 'die Rechnungen', english: 'bill, invoice', example: { de: 'Die Rechnung, bitte!', en: 'The bill, please!' } },
  { id: 'v-a2-angebot', tier: 'A2', theme: 'Shopping & Money', word: 'Angebot', partOfSpeech: 'noun', article: 'das', plural: 'die Angebote', english: 'offer, deal', example: { de: 'Heute gibt es ein gutes Angebot.', en: 'Today there is a good offer.' } },
  { id: 'v-a2-groesse', tier: 'A2', theme: 'Shopping & Money', word: 'Größe', partOfSpeech: 'noun', article: 'die', plural: 'die Größen', english: 'size', example: { de: 'Haben Sie das in Größe M?', en: 'Do you have this in size M?' } },
  { id: 'v-a2-geldboerse', tier: 'A2', theme: 'Shopping & Money', word: 'Geldbörse', partOfSpeech: 'noun', article: 'die', plural: 'die Geldbörsen', english: 'wallet, purse', example: { de: 'Ich habe meine Geldbörse verloren.', en: 'I have lost my wallet.' } },

  // ---- City & Places
  { id: 'v-a2-bibliothek', tier: 'A2', theme: 'City & Places', word: 'Bibliothek', partOfSpeech: 'noun', article: 'die', plural: 'die Bibliotheken', english: 'library', example: { de: 'In der Bibliothek muss man leise sein.', en: 'In the library you have to be quiet.' } },
  { id: 'v-a2-hauptstadt', tier: 'A2', theme: 'City & Places', word: 'Hauptstadt', partOfSpeech: 'noun', article: 'die', plural: 'die Hauptstädte', english: 'capital city', example: { de: 'Berlin ist die Hauptstadt von Deutschland.', en: 'Berlin is the capital of Germany.' } },
  { id: 'v-a2-kirche', tier: 'A2', theme: 'City & Places', word: 'Kirche', partOfSpeech: 'noun', article: 'die', plural: 'die Kirchen', english: 'church', example: { de: 'Die Kirche steht im Zentrum.', en: 'The church is in the centre.' } },
  { id: 'v-a2-platz', tier: 'A2', theme: 'City & Places', word: 'Platz', partOfSpeech: 'noun', article: 'der', plural: 'die Plätze', english: 'square; space; seat', example: { de: 'Auf dem Platz ist ein Markt.', en: 'There is a market on the square.' } },

  // ---- Ideas & Everyday
  { id: 'v-a2-angst', tier: 'A2', theme: 'Ideas & Everyday', word: 'Angst', partOfSpeech: 'noun', article: 'die', plural: 'die Ängste', english: 'fear', example: { de: 'Ich habe Angst vor Spinnen.', en: 'I am afraid of spiders.' } },
  { id: 'v-a2-ding', tier: 'A2', theme: 'Ideas & Everyday', word: 'Ding', partOfSpeech: 'noun', article: 'das', plural: 'die Dinge', english: 'thing', example: { de: 'So ein Ding habe ich noch nie gesehen.', en: 'I have never seen a thing like that.' } },
  { id: 'v-a2-geschichte', tier: 'A2', theme: 'Ideas & Everyday', word: 'Geschichte', partOfSpeech: 'noun', article: 'die', plural: 'die Geschichten', english: 'story; history', example: { de: 'Erzähl mir eine Geschichte!', en: 'Tell me a story!' } },
  { id: 'v-a2-idee', tier: 'A2', theme: 'Ideas & Everyday', word: 'Idee', partOfSpeech: 'noun', article: 'die', plural: 'die Ideen', english: 'idea', example: { de: 'Das ist eine gute Idee.', en: 'That is a good idea.' } },
  { id: 'v-a2-problem', tier: 'A2', theme: 'Ideas & Everyday', word: 'Problem', partOfSpeech: 'noun', article: 'das', plural: 'die Probleme', english: 'problem', example: { de: 'Wir haben ein kleines Problem.', en: 'We have a small problem.' } },
  { id: 'v-a2-meinung', tier: 'A2', theme: 'Ideas & Everyday', word: 'Meinung', partOfSpeech: 'noun', article: 'die', plural: 'die Meinungen', english: 'opinion', example: { de: 'Meiner Meinung nach ist das falsch.', en: 'In my opinion that is wrong.' } },

  // ---- Adjectives
  { id: 'v-a2-wichtig', tier: 'A2', theme: 'Adjectives', word: 'wichtig', partOfSpeech: 'adjective', article: null, plural: null, english: 'important', example: { de: 'Das ist eine wichtige Frage.', en: 'That is an important question.' } },
  { id: 'v-a2-moeglich', tier: 'A2', theme: 'Adjectives', word: 'möglich', partOfSpeech: 'adjective', article: null, plural: null, english: 'possible', example: { de: 'Ist das möglich?', en: 'Is that possible?' } },
  { id: 'v-a2-gefaehrlich', tier: 'A2', theme: 'Adjectives', word: 'gefährlich', partOfSpeech: 'adjective', article: null, plural: null, english: 'dangerous', example: { de: 'Die Straße ist bei Nacht gefährlich.', en: 'The road is dangerous at night.' } },
  { id: 'v-a2-freundlich', tier: 'A2', theme: 'Adjectives', word: 'freundlich', partOfSpeech: 'adjective', article: null, plural: null, english: 'friendly', example: { de: 'Die Verkäuferin war sehr freundlich.', en: 'The saleswoman was very friendly.' } },
  { id: 'v-a2-ruhig', tier: 'A2', theme: 'Adjectives', word: 'ruhig', partOfSpeech: 'adjective', article: null, plural: null, english: 'quiet, calm', example: { de: 'Die Wohnung liegt in einer ruhigen Straße.', en: 'The apartment is on a quiet street.' } },
  { id: 'v-a2-laut', tier: 'A2', theme: 'Adjectives', word: 'laut', partOfSpeech: 'adjective', article: null, plural: null, english: 'loud', example: { de: 'Die Musik ist zu laut.', en: 'The music is too loud.' } },
  { id: 'v-a2-sauber', tier: 'A2', theme: 'Adjectives', word: 'sauber', partOfSpeech: 'adjective', article: null, plural: null, english: 'clean', example: { de: 'Die Küche ist wieder sauber.', en: 'The kitchen is clean again.' } },
  { id: 'v-a2-schmutzig', tier: 'A2', theme: 'Adjectives', word: 'schmutzig', partOfSpeech: 'adjective', article: null, plural: null, english: 'dirty', example: { de: 'Meine Schuhe sind ganz schmutzig.', en: 'My shoes are all dirty.' } },
  { id: 'v-a2-gesund', tier: 'A2', theme: 'Adjectives', word: 'gesund', partOfSpeech: 'adjective', article: null, plural: null, english: 'healthy', example: { de: 'Obst und Gemüse sind gesund.', en: 'Fruit and vegetables are healthy.' } },
  { id: 'v-a2-krank', tier: 'A2', theme: 'Adjectives', word: 'krank', partOfSpeech: 'adjective', article: null, plural: null, english: 'ill, sick', example: { de: 'Ich bin heute krank.', en: 'I am ill today.' } },
  { id: 'v-a2-fertig', tier: 'A2', theme: 'Adjectives', word: 'fertig', partOfSpeech: 'adjective', article: null, plural: null, english: 'finished, ready', example: { de: 'Das Essen ist gleich fertig.', en: 'The food is almost ready.' } },
  { id: 'v-a2-leicht', tier: 'A2', theme: 'Adjectives', word: 'leicht', partOfSpeech: 'adjective', article: null, plural: null, english: 'easy; light', example: { de: 'Die Aufgabe war ganz leicht.', en: 'The task was quite easy.' } },
  { id: 'v-a2-schwer', tier: 'A2', theme: 'Adjectives', word: 'schwer', partOfSpeech: 'adjective', article: null, plural: null, english: 'difficult; heavy', example: { de: 'Der Koffer ist sehr schwer.', en: 'The suitcase is very heavy.' } },
  { id: 'v-a2-frueh', tier: 'A2', theme: 'Adjectives', word: 'früh', partOfSpeech: 'adjective', article: null, plural: null, english: 'early', example: { de: 'Am Montag stehe ich früh auf.', en: 'On Monday I get up early.' } },
  { id: 'v-a2-spaet', tier: 'A2', theme: 'Adjectives', word: 'spät', partOfSpeech: 'adjective', article: null, plural: null, english: 'late', example: { de: 'Es ist schon spät.', en: 'It is already late.' } },
  { id: 'v-a2-puenktlich', tier: 'A2', theme: 'Adjectives', word: 'pünktlich', partOfSpeech: 'adjective', article: null, plural: null, english: 'punctual, on time', example: { de: 'Der Bus war heute pünktlich.', en: 'The bus was on time today.' } },
  { id: 'v-a2-interessant', tier: 'A2', theme: 'Adjectives', word: 'interessant', partOfSpeech: 'adjective', article: null, plural: null, english: 'interesting', example: { de: 'Der Film war sehr interessant.', en: 'The film was very interesting.' } },
  { id: 'v-a2-langweilig', tier: 'A2', theme: 'Adjectives', word: 'langweilig', partOfSpeech: 'adjective', article: null, plural: null, english: 'boring', example: { de: 'Das Buch ist mir zu langweilig.', en: 'The book is too boring for me.' } },

  // ---- Adverbs & common words
  { id: 'v-a2-vielleicht', tier: 'A2', theme: 'Common words', word: 'vielleicht', partOfSpeech: 'adverb', article: null, plural: null, english: 'maybe, perhaps', example: { de: 'Vielleicht kommt sie später.', en: 'Maybe she will come later.' } },
  { id: 'v-a2-endlich', tier: 'A2', theme: 'Common words', word: 'endlich', partOfSpeech: 'adverb', article: null, plural: null, english: 'finally, at last', example: { de: 'Endlich ist Wochenende!', en: 'Finally it is the weekend!' } },
  { id: 'v-a2-sofort', tier: 'A2', theme: 'Common words', word: 'sofort', partOfSpeech: 'adverb', article: null, plural: null, english: 'immediately, right away', example: { de: 'Ich komme sofort.', en: 'I am coming right away.' } },
  { id: 'v-a2-zuerst', tier: 'A2', theme: 'Common words', word: 'zuerst', partOfSpeech: 'adverb', article: null, plural: null, english: 'first, at first', example: { de: 'Zuerst gehen wir einkaufen.', en: 'First we go shopping.' } },
  { id: 'v-a2-wieder', tier: 'A2', theme: 'Common words', word: 'wieder', partOfSpeech: 'adverb', article: null, plural: null, english: 'again', example: { de: 'Er ist schon wieder zu spät.', en: 'He is late again.' } },
  { id: 'v-a2-zusammen', tier: 'A2', theme: 'Common words', word: 'zusammen', partOfSpeech: 'adverb', article: null, plural: null, english: 'together', example: { de: 'Wir kochen heute zusammen.', en: 'We are cooking together today.' } },
  { id: 'v-a2-draussen', tier: 'A2', theme: 'Common words', word: 'draußen', partOfSpeech: 'adverb', article: null, plural: null, english: 'outside', example: { de: 'Die Kinder spielen draußen.', en: 'The children are playing outside.' } },
  { id: 'v-a2-links', tier: 'A2', theme: 'Common words', word: 'links', partOfSpeech: 'adverb', article: null, plural: null, english: 'left', example: { de: 'Gehen Sie an der Ecke nach links.', en: 'Turn left at the corner.' } },
  { id: 'v-a2-rechts', tier: 'A2', theme: 'Common words', word: 'rechts', partOfSpeech: 'adverb', article: null, plural: null, english: 'right', example: { de: 'Das Café ist rechts.', en: 'The café is on the right.' } },
  { id: 'v-a2-geradeaus', tier: 'A2', theme: 'Common words', word: 'geradeaus', partOfSpeech: 'adverb', article: null, plural: null, english: 'straight ahead', example: { de: 'Gehen Sie immer geradeaus.', en: 'Keep going straight ahead.' } },

  // ---- Expressions
  { id: 'v-a2-viel-spass', tier: 'A2', theme: 'Expressions', word: 'Viel Spaß', partOfSpeech: 'phrase', article: null, plural: null, english: 'Have fun', example: { de: 'Viel Spaß beim Konzert!', en: 'Have fun at the concert!' } },
  { id: 'v-a2-gute-besserung', tier: 'A2', theme: 'Expressions', word: 'Gute Besserung', partOfSpeech: 'phrase', article: null, plural: null, english: 'Get well soon', example: { de: 'Du bist krank? Gute Besserung!', en: 'You are ill? Get well soon!' } },
  { id: 'v-a2-glueckwunsch', tier: 'A2', theme: 'Expressions', word: 'Herzlichen Glückwunsch', partOfSpeech: 'phrase', article: null, plural: null, english: 'Congratulations', example: { de: 'Herzlichen Glückwunsch zum Geburtstag!', en: 'Happy birthday! (lit. Congratulations on your birthday!)' } },
  { id: 'v-a2-tut-mir-leid', tier: 'A2', theme: 'Expressions', word: 'Es tut mir leid', partOfSpeech: 'phrase', article: null, plural: null, english: 'I am sorry', example: { de: 'Es tut mir leid, ich habe keine Zeit.', en: 'I am sorry, I have no time.' } },
  { id: 'v-a2-kein-problem', tier: 'A2', theme: 'Expressions', word: 'Kein Problem', partOfSpeech: 'phrase', article: null, plural: null, english: 'No problem', example: { de: 'Kein Problem, ich helfe dir gern.', en: 'No problem, I am happy to help you.' } },
  { id: 'v-a2-guten-appetit', tier: 'A2', theme: 'Expressions', word: 'Guten Appetit', partOfSpeech: 'phrase', article: null, plural: null, english: 'Enjoy your meal', example: { de: 'Das Essen ist fertig. Guten Appetit!', en: 'The food is ready. Enjoy your meal!' } },

  // ============================================================ B1 ============================================================
  // ---- Society & World
  { id: 'v-b1-gesellschaft', tier: 'B1', theme: 'Society & World', word: 'Gesellschaft', partOfSpeech: 'noun', article: 'die', plural: 'die Gesellschaften', english: 'society', example: { de: 'Die Gesellschaft verändert sich schnell.', en: 'Society is changing quickly.' } },
  { id: 'v-b1-regierung', tier: 'B1', theme: 'Society & World', word: 'Regierung', partOfSpeech: 'noun', article: 'die', plural: 'die Regierungen', english: 'government', example: { de: 'Die Regierung plant neue Gesetze.', en: 'The government is planning new laws.' } },
  { id: 'v-b1-politik', tier: 'B1', theme: 'Society & World', word: 'Politik', partOfSpeech: 'noun', article: 'die', plural: '—', english: 'politics; policy', example: { de: 'Für Politik interessiere ich mich sehr.', en: 'I am very interested in politics.' }, note: 'Normally uncountable.' },
  { id: 'v-b1-wirtschaft', tier: 'B1', theme: 'Society & World', word: 'Wirtschaft', partOfSpeech: 'noun', article: 'die', plural: '—', english: 'economy', example: { de: 'Die Wirtschaft wächst langsam.', en: 'The economy is growing slowly.' }, note: 'Usually uncountable in this sense.' },
  { id: 'v-b1-umwelt', tier: 'B1', theme: 'Society & World', word: 'Umwelt', partOfSpeech: 'noun', article: 'die', plural: '—', english: 'environment', example: { de: 'Wir müssen die Umwelt schützen.', en: 'We have to protect the environment.' }, note: 'Uncountable.' },
  { id: 'v-b1-gesetz', tier: 'B1', theme: 'Society & World', word: 'Gesetz', partOfSpeech: 'noun', article: 'das', plural: 'die Gesetze', english: 'law', example: { de: 'Das neue Gesetz gilt ab Januar.', en: 'The new law applies from January.' } },
  { id: 'v-b1-recht', tier: 'B1', theme: 'Society & World', word: 'Recht', partOfSpeech: 'noun', article: 'das', plural: 'die Rechte', english: 'right; law', example: { de: 'Jeder hat das Recht auf Bildung.', en: 'Everyone has the right to education.' } },
  { id: 'v-b1-krieg', tier: 'B1', theme: 'Society & World', word: 'Krieg', partOfSpeech: 'noun', article: 'der', plural: 'die Kriege', english: 'war', example: { de: 'Der Krieg dauerte vier Jahre.', en: 'The war lasted four years.' } },
  { id: 'v-b1-frieden', tier: 'B1', theme: 'Society & World', word: 'Frieden', partOfSpeech: 'noun', article: 'der', plural: '—', english: 'peace', example: { de: 'Alle Menschen wünschen sich Frieden.', en: 'All people wish for peace.' }, note: 'Usually uncountable.' },
  { id: 'v-b1-werbung', tier: 'B1', theme: 'Society & World', word: 'Werbung', partOfSpeech: 'noun', article: 'die', plural: '—', english: 'advertising, ads', example: { de: 'Im Fernsehen gibt es zu viel Werbung.', en: 'There are too many ads on television.' }, note: 'Usually uncountable.' },
  { id: 'v-b1-nachricht', tier: 'B1', theme: 'Society & World', word: 'Nachricht', partOfSpeech: 'noun', article: 'die', plural: 'die Nachrichten', english: 'message; (pl.) the news', example: { de: 'Ich habe dir eine Nachricht geschickt.', en: 'I sent you a message.' } },

  // ---- Work & Study
  { id: 'v-b1-erfolg', tier: 'B1', theme: 'Work & Study', word: 'Erfolg', partOfSpeech: 'noun', article: 'der', plural: 'die Erfolge', english: 'success', example: { de: 'Die Firma hatte großen Erfolg.', en: 'The company had great success.' } },
  { id: 'v-b1-ziel', tier: 'B1', theme: 'Work & Study', word: 'Ziel', partOfSpeech: 'noun', article: 'das', plural: 'die Ziele', english: 'goal, aim; destination', example: { de: 'Mein Ziel ist eine bessere Stelle.', en: 'My goal is a better position.' } },
  { id: 'v-b1-aufgabe', tier: 'B1', theme: 'Work & Study', word: 'Aufgabe', partOfSpeech: 'noun', article: 'die', plural: 'die Aufgaben', english: 'task; exercise', example: { de: 'Diese Aufgabe ist schwierig.', en: 'This task is difficult.' } },
  { id: 'v-b1-leistung', tier: 'B1', theme: 'Work & Study', word: 'Leistung', partOfSpeech: 'noun', article: 'die', plural: 'die Leistungen', english: 'performance, achievement', example: { de: 'Seine Leistung war ausgezeichnet.', en: 'His performance was excellent.' } },
  { id: 'v-b1-verantwortung', tier: 'B1', theme: 'Work & Study', word: 'Verantwortung', partOfSpeech: 'noun', article: 'die', plural: '—', english: 'responsibility', example: { de: 'Sie trägt viel Verantwortung.', en: 'She carries a lot of responsibility.' }, note: 'Usually uncountable.' },
  { id: 'v-b1-faehigkeit', tier: 'B1', theme: 'Work & Study', word: 'Fähigkeit', partOfSpeech: 'noun', article: 'die', plural: 'die Fähigkeiten', english: 'ability, skill', example: { de: 'Er hat die Fähigkeit, gut zu erklären.', en: 'He has the ability to explain well.' } },
  { id: 'v-b1-bildung', tier: 'B1', theme: 'Work & Study', word: 'Bildung', partOfSpeech: 'noun', article: 'die', plural: '—', english: 'education', example: { de: 'Bildung ist sehr wichtig.', en: 'Education is very important.' }, note: 'Uncountable.' },
  { id: 'v-b1-wissenschaft', tier: 'B1', theme: 'Work & Study', word: 'Wissenschaft', partOfSpeech: 'noun', article: 'die', plural: 'die Wissenschaften', english: 'science', example: { de: 'Sie arbeitet in der Wissenschaft.', en: 'She works in science.' } },
  { id: 'v-b1-forschung', tier: 'B1', theme: 'Work & Study', word: 'Forschung', partOfSpeech: 'noun', article: 'die', plural: 'die Forschungen', english: 'research', example: { de: 'Die Forschung braucht mehr Geld.', en: 'Research needs more money.' } },
  { id: 'v-b1-wettbewerb', tier: 'B1', theme: 'Work & Study', word: 'Wettbewerb', partOfSpeech: 'noun', article: 'der', plural: 'die Wettbewerbe', english: 'competition', example: { de: 'Sie hat den Wettbewerb gewonnen.', en: 'She won the competition.' } },

  // ---- Ideas & Feelings
  { id: 'v-b1-gefuehl', tier: 'B1', theme: 'Ideas & Feelings', word: 'Gefühl', partOfSpeech: 'noun', article: 'das', plural: 'die Gefühle', english: 'feeling', example: { de: 'Ich hatte ein komisches Gefühl.', en: 'I had a strange feeling.' } },
  { id: 'v-b1-beziehung', tier: 'B1', theme: 'Ideas & Feelings', word: 'Beziehung', partOfSpeech: 'noun', article: 'die', plural: 'die Beziehungen', english: 'relationship', example: { de: 'Sie haben eine gute Beziehung.', en: 'They have a good relationship.' } },
  { id: 'v-b1-erinnerung', tier: 'B1', theme: 'Ideas & Feelings', word: 'Erinnerung', partOfSpeech: 'noun', article: 'die', plural: 'die Erinnerungen', english: 'memory, recollection', example: { de: 'Ich habe schöne Erinnerungen an die Reise.', en: 'I have nice memories of the trip.' } },
  { id: 'v-b1-hoffnung', tier: 'B1', theme: 'Ideas & Feelings', word: 'Hoffnung', partOfSpeech: 'noun', article: 'die', plural: 'die Hoffnungen', english: 'hope', example: { de: 'Wir geben die Hoffnung nicht auf.', en: 'We are not giving up hope.' } },
  { id: 'v-b1-sorge', tier: 'B1', theme: 'Ideas & Feelings', word: 'Sorge', partOfSpeech: 'noun', article: 'die', plural: 'die Sorgen', english: 'worry, concern', example: { de: 'Mach dir keine Sorgen!', en: 'Do not worry!' } },
  { id: 'v-b1-wunsch', tier: 'B1', theme: 'Ideas & Feelings', word: 'Wunsch', partOfSpeech: 'noun', article: 'der', plural: 'die Wünsche', english: 'wish', example: { de: 'Hast du einen besonderen Wunsch?', en: 'Do you have a special wish?' } },
  { id: 'v-b1-eindruck', tier: 'B1', theme: 'Ideas & Feelings', word: 'Eindruck', partOfSpeech: 'noun', article: 'der', plural: 'die Eindrücke', english: 'impression', example: { de: 'Sie hat einen guten Eindruck gemacht.', en: 'She made a good impression.' } },
  { id: 'v-b1-bedeutung', tier: 'B1', theme: 'Ideas & Feelings', word: 'Bedeutung', partOfSpeech: 'noun', article: 'die', plural: 'die Bedeutungen', english: 'meaning; importance', example: { de: 'Was ist die Bedeutung dieses Wortes?', en: 'What is the meaning of this word?' } },
  { id: 'v-b1-meinung', tier: 'B1', theme: 'Ideas & Feelings', word: 'Ansicht', partOfSpeech: 'noun', article: 'die', plural: 'die Ansichten', english: 'view, opinion', example: { de: 'Ich bin anderer Ansicht.', en: 'I am of a different opinion.' } },

  // ---- Life & Change
  { id: 'v-b1-entwicklung', tier: 'B1', theme: 'Life & Change', word: 'Entwicklung', partOfSpeech: 'noun', article: 'die', plural: 'die Entwicklungen', english: 'development', example: { de: 'Die Entwicklung der Stadt ist beeindruckend.', en: 'The development of the city is impressive.' } },
  { id: 'v-b1-entscheidung', tier: 'B1', theme: 'Life & Change', word: 'Entscheidung', partOfSpeech: 'noun', article: 'die', plural: 'die Entscheidungen', english: 'decision', example: { de: 'Das war eine schwere Entscheidung.', en: 'That was a hard decision.' } },
  { id: 'v-b1-moeglichkeit', tier: 'B1', theme: 'Life & Change', word: 'Möglichkeit', partOfSpeech: 'noun', article: 'die', plural: 'die Möglichkeiten', english: 'possibility, opportunity', example: { de: 'Es gibt viele Möglichkeiten.', en: 'There are many possibilities.' } },
  { id: 'v-b1-loesung', tier: 'B1', theme: 'Life & Change', word: 'Lösung', partOfSpeech: 'noun', article: 'die', plural: 'die Lösungen', english: 'solution', example: { de: 'Wir suchen eine Lösung für das Problem.', en: 'We are looking for a solution to the problem.' } },
  { id: 'v-b1-grund', tier: 'B1', theme: 'Life & Change', word: 'Grund', partOfSpeech: 'noun', article: 'der', plural: 'die Gründe', english: 'reason', example: { de: 'Aus welchem Grund kommst du nicht?', en: 'For what reason are you not coming?' } },
  { id: 'v-b1-vorteil', tier: 'B1', theme: 'Life & Change', word: 'Vorteil', partOfSpeech: 'noun', article: 'der', plural: 'die Vorteile', english: 'advantage', example: { de: 'Das hat einen großen Vorteil.', en: 'That has a big advantage.' } },
  { id: 'v-b1-nachteil', tier: 'B1', theme: 'Life & Change', word: 'Nachteil', partOfSpeech: 'noun', article: 'der', plural: 'die Nachteile', english: 'disadvantage', example: { de: 'Der Nachteil ist der hohe Preis.', en: 'The disadvantage is the high price.' } },
  { id: 'v-b1-unterschied', tier: 'B1', theme: 'Life & Change', word: 'Unterschied', partOfSpeech: 'noun', article: 'der', plural: 'die Unterschiede', english: 'difference', example: { de: 'Was ist der Unterschied zwischen den beiden?', en: 'What is the difference between the two?' } },
  { id: 'v-b1-zukunft', tier: 'B1', theme: 'Life & Change', word: 'Zukunft', partOfSpeech: 'noun', article: 'die', plural: '—', english: 'future', example: { de: 'In der Zukunft möchte ich reisen.', en: 'In the future I would like to travel.' }, note: 'Normally uncountable.' },
  { id: 'v-b1-vergangenheit', tier: 'B1', theme: 'Life & Change', word: 'Vergangenheit', partOfSpeech: 'noun', article: 'die', plural: '—', english: 'past', example: { de: 'Das gehört der Vergangenheit an.', en: 'That belongs to the past.' }, note: 'Normally uncountable.' },
  { id: 'v-b1-erlebnis', tier: 'B1', theme: 'Life & Change', word: 'Erlebnis', partOfSpeech: 'noun', article: 'das', plural: 'die Erlebnisse', english: 'experience (an event)', example: { de: 'Die Reise war ein tolles Erlebnis.', en: 'The trip was a great experience.' } },
  { id: 'v-b1-ereignis', tier: 'B1', theme: 'Life & Change', word: 'Ereignis', partOfSpeech: 'noun', article: 'das', plural: 'die Ereignisse', english: 'event', example: { de: 'Die Hochzeit war das Ereignis des Jahres.', en: 'The wedding was the event of the year.' } },
  { id: 'v-b1-gewohnheit', tier: 'B1', theme: 'Life & Change', word: 'Gewohnheit', partOfSpeech: 'noun', article: 'die', plural: 'die Gewohnheiten', english: 'habit', example: { de: 'Rauchen ist eine schlechte Gewohnheit.', en: 'Smoking is a bad habit.' } },
  { id: 'v-b1-vorschlag', tier: 'B1', theme: 'Life & Change', word: 'Vorschlag', partOfSpeech: 'noun', article: 'der', plural: 'die Vorschläge', english: 'suggestion, proposal', example: { de: 'Ich habe einen Vorschlag.', en: 'I have a suggestion.' } },
  { id: 'v-b1-verhalten', tier: 'B1', theme: 'Life & Change', word: 'Verhalten', partOfSpeech: 'noun', article: 'das', plural: '—', english: 'behaviour', example: { de: 'Sein Verhalten war seltsam.', en: 'His behaviour was strange.' }, note: 'Normally uncountable.' },
  { id: 'v-b1-zusammenhang', tier: 'B1', theme: 'Life & Change', word: 'Zusammenhang', partOfSpeech: 'noun', article: 'der', plural: 'die Zusammenhänge', english: 'connection, context', example: { de: 'Ich sehe da keinen Zusammenhang.', en: 'I do not see a connection there.' } },
  { id: 'v-b1-bereich', tier: 'B1', theme: 'Life & Change', word: 'Bereich', partOfSpeech: 'noun', article: 'der', plural: 'die Bereiche', english: 'area, field', example: { de: 'In diesem Bereich kenne ich mich aus.', en: 'I know my way around in this field.' } },

  // ---- Adjectives
  { id: 'v-b1-typisch', tier: 'B1', theme: 'Adjectives', word: 'typisch', partOfSpeech: 'adjective', article: null, plural: null, english: 'typical', example: { de: 'Das ist typisch für ihn.', en: 'That is typical of him.' } },
  { id: 'v-b1-notwendig', tier: 'B1', theme: 'Adjectives', word: 'notwendig', partOfSpeech: 'adjective', article: null, plural: null, english: 'necessary', example: { de: 'Eine Reservierung ist nicht notwendig.', en: 'A reservation is not necessary.' } },
  { id: 'v-b1-deutlich', tier: 'B1', theme: 'Adjectives', word: 'deutlich', partOfSpeech: 'adjective', article: null, plural: null, english: 'clear, distinct', example: { de: 'Bitte sprich deutlich.', en: 'Please speak clearly.' } },
  { id: 'v-b1-ploetzlich', tier: 'B1', theme: 'Adjectives', word: 'plötzlich', partOfSpeech: 'adjective', article: null, plural: null, english: 'sudden(ly)', example: { de: 'Plötzlich fing es an zu regnen.', en: 'Suddenly it started to rain.' } },
  { id: 'v-b1-wahrscheinlich', tier: 'B1', theme: 'Adjectives', word: 'wahrscheinlich', partOfSpeech: 'adjective', article: null, plural: null, english: 'probable, likely', example: { de: 'Wahrscheinlich komme ich später.', en: 'I will probably come later.' } },
  { id: 'v-b1-zufrieden', tier: 'B1', theme: 'Adjectives', word: 'zufrieden', partOfSpeech: 'adjective', article: null, plural: null, english: 'satisfied, content', example: { de: 'Ich bin mit dem Ergebnis zufrieden.', en: 'I am satisfied with the result.' } },
  { id: 'v-b1-erfolgreich', tier: 'B1', theme: 'Adjectives', word: 'erfolgreich', partOfSpeech: 'adjective', article: null, plural: null, english: 'successful', example: { de: 'Das Projekt war sehr erfolgreich.', en: 'The project was very successful.' } },
  { id: 'v-b1-verschieden', tier: 'B1', theme: 'Adjectives', word: 'verschieden', partOfSpeech: 'adjective', article: null, plural: null, english: 'different, various', example: { de: 'Wir haben verschiedene Meinungen.', en: 'We have different opinions.' } },
  { id: 'v-b1-aehnlich', tier: 'B1', theme: 'Adjectives', word: 'ähnlich', partOfSpeech: 'adjective', article: null, plural: null, english: 'similar', example: { de: 'Die zwei Schwestern sind sich sehr ähnlich.', en: 'The two sisters are very similar.' } },
  { id: 'v-b1-beruehmt', tier: 'B1', theme: 'Adjectives', word: 'berühmt', partOfSpeech: 'adjective', article: null, plural: null, english: 'famous', example: { de: 'Der Maler ist weltberühmt.', en: 'The painter is world-famous.' } },
  { id: 'v-b1-ehrlich', tier: 'B1', theme: 'Adjectives', word: 'ehrlich', partOfSpeech: 'adjective', article: null, plural: null, english: 'honest', example: { de: 'Sei bitte ehrlich zu mir.', en: 'Please be honest with me.' } },
  { id: 'v-b1-hoeflich', tier: 'B1', theme: 'Adjectives', word: 'höflich', partOfSpeech: 'adjective', article: null, plural: null, english: 'polite', example: { de: 'Er ist immer sehr höflich.', en: 'He is always very polite.' } },
  { id: 'v-b1-vorsichtig', tier: 'B1', theme: 'Adjectives', word: 'vorsichtig', partOfSpeech: 'adjective', article: null, plural: null, english: 'careful, cautious', example: { de: 'Sei vorsichtig auf der Treppe!', en: 'Be careful on the stairs!' } },
  { id: 'v-b1-nervoes', tier: 'B1', theme: 'Adjectives', word: 'nervös', partOfSpeech: 'adjective', article: null, plural: null, english: 'nervous', example: { de: 'Vor der Prüfung bin ich immer nervös.', en: 'Before an exam I am always nervous.' } },
  { id: 'v-b1-stolz', tier: 'B1', theme: 'Adjectives', word: 'stolz', partOfSpeech: 'adjective', article: null, plural: null, english: 'proud', example: { de: 'Die Eltern sind stolz auf ihr Kind.', en: 'The parents are proud of their child.' } },
  { id: 'v-b1-neugierig', tier: 'B1', theme: 'Adjectives', word: 'neugierig', partOfSpeech: 'adjective', article: null, plural: null, english: 'curious', example: { de: 'Kinder sind von Natur aus neugierig.', en: 'Children are naturally curious.' } },

  // ---- Connectors & adverbs
  { id: 'v-b1-trotzdem', tier: 'B1', theme: 'Connectors', word: 'trotzdem', partOfSpeech: 'adverb', article: null, plural: null, english: 'nevertheless, still', example: { de: 'Es regnete, trotzdem gingen wir spazieren.', en: 'It was raining; nevertheless we went for a walk.' } },
  { id: 'v-b1-deshalb', tier: 'B1', theme: 'Connectors', word: 'deshalb', partOfSpeech: 'adverb', article: null, plural: null, english: 'therefore, that is why', example: { de: 'Ich war krank, deshalb blieb ich zu Hause.', en: 'I was ill, that is why I stayed home.' } },
  { id: 'v-b1-ausserdem', tier: 'B1', theme: 'Connectors', word: 'außerdem', partOfSpeech: 'adverb', article: null, plural: null, english: 'besides, in addition', example: { de: 'Es ist teuer, und außerdem hässlich.', en: 'It is expensive, and besides, ugly.' } },
  { id: 'v-b1-obwohl', tier: 'B1', theme: 'Connectors', word: 'obwohl', partOfSpeech: 'other', article: null, plural: null, english: 'although (conjunction)', example: { de: 'Obwohl es spät war, arbeitete sie weiter.', en: 'Although it was late, she kept working.' }, note: 'Subordinating conjunction — sends the verb to the end.' },
  { id: 'v-b1-meistens', tier: 'B1', theme: 'Connectors', word: 'meistens', partOfSpeech: 'adverb', article: null, plural: null, english: 'mostly, usually', example: { de: 'Am Wochenende schlafe ich meistens lange.', en: 'On weekends I usually sleep in.' } },
  { id: 'v-b1-normalerweise', tier: 'B1', theme: 'Connectors', word: 'normalerweise', partOfSpeech: 'adverb', article: null, plural: null, english: 'normally, usually', example: { de: 'Normalerweise fahre ich mit dem Rad.', en: 'Normally I go by bike.' } },
  { id: 'v-b1-eigentlich', tier: 'B1', theme: 'Connectors', word: 'eigentlich', partOfSpeech: 'adverb', article: null, plural: null, english: 'actually', example: { de: 'Eigentlich wollte ich früher kommen.', en: 'Actually I wanted to come earlier.' } },
  { id: 'v-b1-unbedingt', tier: 'B1', theme: 'Connectors', word: 'unbedingt', partOfSpeech: 'adverb', article: null, plural: null, english: 'absolutely, definitely', example: { de: 'Du musst diesen Film unbedingt sehen.', en: 'You absolutely have to see this film.' } },
  { id: 'v-b1-ungefaehr', tier: 'B1', theme: 'Connectors', word: 'ungefähr', partOfSpeech: 'adverb', article: null, plural: null, english: 'approximately, about', example: { de: 'Es dauert ungefähr eine Stunde.', en: 'It takes about an hour.' } },
  { id: 'v-b1-besonders', tier: 'B1', theme: 'Connectors', word: 'besonders', partOfSpeech: 'adverb', article: null, plural: null, english: 'especially, particularly', example: { de: 'Heute ist es besonders kalt.', en: 'Today it is especially cold.' } },

  // ---- Expressions
  { id: 'v-b1-meiner-meinung-nach', tier: 'B1', theme: 'Expressions', word: 'meiner Meinung nach', partOfSpeech: 'phrase', article: null, plural: null, english: 'in my opinion', example: { de: 'Meiner Meinung nach ist das zu teuer.', en: 'In my opinion that is too expensive.' } },
  { id: 'v-b1-auf-jeden-fall', tier: 'B1', theme: 'Expressions', word: 'auf jeden Fall', partOfSpeech: 'phrase', article: null, plural: null, english: 'in any case, definitely', example: { de: 'Ich komme auf jeden Fall zu deiner Party.', en: 'I will definitely come to your party.' } },
  { id: 'v-b1-auf-keinen-fall', tier: 'B1', theme: 'Expressions', word: 'auf keinen Fall', partOfSpeech: 'phrase', article: null, plural: null, english: 'no way, under no circumstances', example: { de: 'Das mache ich auf keinen Fall.', en: 'I will do that under no circumstances.' } },
  { id: 'v-b1-zum-beispiel', tier: 'B1', theme: 'Expressions', word: 'zum Beispiel', partOfSpeech: 'phrase', article: null, plural: null, english: 'for example', example: { de: 'Ich mag Sport, zum Beispiel Fußball.', en: 'I like sport, for example football.' } },
  { id: 'v-b1-im-gegenteil', tier: 'B1', theme: 'Expressions', word: 'im Gegenteil', partOfSpeech: 'phrase', article: null, plural: null, english: 'on the contrary', example: { de: 'Es war nicht langweilig – im Gegenteil!', en: 'It was not boring – on the contrary!' } },

  // ---- Society & World (more)
  { id: 'v-b1-verkehr', tier: 'B1', theme: 'Society & World', word: 'Verkehr', partOfSpeech: 'noun', article: 'der', plural: '—', english: 'traffic', example: { de: 'Auf der Autobahn ist viel Verkehr.', en: 'There is a lot of traffic on the motorway.' }, note: 'Uncountable.' },
  { id: 'v-b1-kultur', tier: 'B1', theme: 'Society & World', word: 'Kultur', partOfSpeech: 'noun', article: 'die', plural: 'die Kulturen', english: 'culture', example: { de: 'Die japanische Kultur fasziniert mich.', en: 'Japanese culture fascinates me.' } },
  { id: 'v-b1-publikum', tier: 'B1', theme: 'Society & World', word: 'Publikum', partOfSpeech: 'noun', article: 'das', plural: '—', english: 'audience', example: { de: 'Das Publikum applaudierte lange.', en: 'The audience applauded for a long time.' }, note: 'Collective noun, normally no plural.' },
  { id: 'v-b1-verein', tier: 'B1', theme: 'Society & World', word: 'Verein', partOfSpeech: 'noun', article: 'der', plural: 'die Vereine', english: 'club, association', example: { de: 'Er ist in einem Sportverein.', en: 'He is in a sports club.' } },
  { id: 'v-b1-mehrheit', tier: 'B1', theme: 'Society & World', word: 'Mehrheit', partOfSpeech: 'noun', article: 'die', plural: 'die Mehrheiten', english: 'majority', example: { de: 'Die Mehrheit war dafür.', en: 'The majority was in favour.' } },
  { id: 'v-b1-umgebung', tier: 'B1', theme: 'Society & World', word: 'Umgebung', partOfSpeech: 'noun', article: 'die', plural: 'die Umgebungen', english: 'surroundings, area', example: { de: 'Die Umgebung der Stadt ist sehr grün.', en: 'The area around the city is very green.' } },

  // ---- Ideas & Feelings (more)
  { id: 'v-b1-absicht', tier: 'B1', theme: 'Ideas & Feelings', word: 'Absicht', partOfSpeech: 'noun', article: 'die', plural: 'die Absichten', english: 'intention', example: { de: 'Das war keine Absicht, Entschuldigung.', en: 'That was not on purpose, sorry.' } },
  { id: 'v-b1-kenntnis', tier: 'B1', theme: 'Ideas & Feelings', word: 'Kenntnis', partOfSpeech: 'noun', article: 'die', plural: 'die Kenntnisse', english: 'knowledge (of sth)', example: { de: 'Sie hat gute Englischkenntnisse.', en: 'She has a good knowledge of English.' }, note: 'Often used in the plural (Kenntnisse).' },

  // ---- Work & Study (more)
  { id: 'v-b1-thema', tier: 'B1', theme: 'Work & Study', word: 'Thema', partOfSpeech: 'noun', article: 'das', plural: 'die Themen', english: 'topic, subject', example: { de: 'Das ist ein schwieriges Thema.', en: 'That is a difficult topic.' }, note: 'Irregular plural: Themen.' },
  { id: 'v-b1-vorbild', tier: 'B1', theme: 'Work & Study', word: 'Vorbild', partOfSpeech: 'noun', article: 'das', plural: 'die Vorbilder', english: 'role model', example: { de: 'Sein Vater ist sein großes Vorbild.', en: 'His father is his great role model.' } },

  // ---- Life & Change (more)
  { id: 'v-b1-zustand', tier: 'B1', theme: 'Life & Change', word: 'Zustand', partOfSpeech: 'noun', article: 'der', plural: 'die Zustände', english: 'condition, state', example: { de: 'Das Auto ist in gutem Zustand.', en: 'The car is in good condition.' } },
  { id: 'v-b1-ausnahme', tier: 'B1', theme: 'Life & Change', word: 'Ausnahme', partOfSpeech: 'noun', article: 'die', plural: 'die Ausnahmen', english: 'exception', example: { de: 'Heute mache ich eine Ausnahme.', en: 'Today I am making an exception.' } },
];


// ---------------------------------------------------------------- lookups / fact helpers
export const VOCAB_TIERS = ['A1', 'A2', 'B1'];

export function wordsForTier(tier) {
  return VOCAB.filter((v) => v.tier === tier);
}

/** Themes present in a tier, in first-seen order (matches the authored grouping). */
export function themesForTier(tier) {
  const seen = [];
  for (const v of wordsForTier(tier)) if (!seen.includes(v.theme)) seen.push(v.theme);
  return seen;
}

export function wordsForTheme(tier, theme) {
  return VOCAB.filter((v) => v.tier === tier && v.theme === theme);
}

export function wordById(id) {
  return VOCAB.find((v) => v.id === id) || null;
}

/** "die Frau" for nouns (article + word), else the bare word - the canonical spoken/display
 *  form, also what TTS reads. */
export function displayWord(v) {
  return v.article ? `${v.article} ${v.word}` : v.word;
}

// A vocab drill fact is one memorizable angle on a word. Key namespace `vo|` is distinct
// from verb (`infinitive|tense|pronoun`) and grammar (`g|`) keys, so the three decks never
// collide. The card renderer builds the prompt from the type and always reveals the full
// word card, so a fact only needs to name the word + which angle is asked.
export const VOCAB_DRILL_TYPES = ['recognition', 'production', 'gender', 'plural'];

export function vocabFactKey(wordId, type) {
  return `vo|${wordId}|${type}`;
}

export function drillFactsForWord(v) {
  const facts = [
    { type: 'recognition', wordId: v.id, tier: v.tier, key: vocabFactKey(v.id, 'recognition') },
    { type: 'production', wordId: v.id, tier: v.tier, key: vocabFactKey(v.id, 'production') },
  ];
  if (v.article) facts.push({ type: 'gender', wordId: v.id, tier: v.tier, key: vocabFactKey(v.id, 'gender') });
  if (v.article && v.plural && v.plural !== '—') facts.push({ type: 'plural', wordId: v.id, tier: v.tier, key: vocabFactKey(v.id, 'plural') });
  return facts;
}

export function drillFactsForTier(tier) {
  return wordsForTier(tier).flatMap(drillFactsForWord);
}

const VOCAB_FACT_BY_KEY = (() => {
  const map = {};
  for (const t of VOCAB_TIERS) for (const f of drillFactsForTier(t)) map[f.key] = f;
  return map;
})();

export function vocabFactByKey(key) {
  return VOCAB_FACT_BY_KEY[key] || null;
}

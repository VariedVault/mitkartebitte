// Foundations: a from-zero pronunciation primer - the alphabet, umlauts/ß, and the sound
// rules that trip up beginners. Deliberately separate from the verb pool (js/data/verbs-a1.js):
// this is reference material, not drilled - it never feeds the SRS deck, has no checkpoint,
// and is tracked with a single per-profile "studied" boolean (see store.js), not mastery %.
//
// Every exampleWord below is a real, correctly-spelled, common German word chosen
// specifically to demonstrate the paired sound - see the phase report for the full list and
// any pairing flagged for review. No two entries share the same exampleWord, so nothing
// reads as accidentally recycled.
//
// type: 'letter' | 'umlaut' | 'digraph' | 'special'
//   - letter:  the 26 base letters A-Z
//   - umlaut:  ä, ö, ü, ß (grouped in the UI as "Umlauts & ß")
//   - digraph: a two-letter (or two-vowel) combination with its own sound (ch, sch, ei/ie,
//              eu/äu, sp-/st-)
//   - special: a single letter whose sound is a common beginner surprise (v, w, z, r, final
//              -er, word-initial s+vowel)

export const LETTERS = [
  { id: 'letter-a', character: 'A', type: 'letter', soundDescription: 'Letter name: "ah". In words, a short, open "ah" like the a in "father".', exampleWord: 'Apfel', exampleWordEnglish: 'apple' },
  { id: 'letter-b', character: 'B', type: 'letter', soundDescription: 'Letter name: "beh". Sounds like the English b.', exampleWord: 'Buch', exampleWordEnglish: 'book', note: 'At the end of a word, b can harden toward a p sound.' },
  { id: 'letter-c', character: 'C', type: 'letter', soundDescription: 'Letter name: "tseh". Rare on its own in native German words - it almost always shows up as part of ch, sch, or ck. Alone, it usually keeps a loanword\'s original sound.', exampleWord: 'Computer', exampleWordEnglish: 'computer', note: 'A borrowed word, kept here because standalone C is genuinely uncommon in native vocabulary.' },
  { id: 'letter-d', character: 'D', type: 'letter', soundDescription: 'Letter name: "deh". Sounds like the English d.', exampleWord: 'Dach', exampleWordEnglish: 'roof', note: 'At the end of a word, d devoices toward a t sound (e.g. "Rad" is said like "raht").' },
  { id: 'letter-e', character: 'E', type: 'letter', soundDescription: 'Letter name: "eh". A short e like in "bed", or a longer, closed "ay" sound depending on the word.', exampleWord: 'Ende', exampleWordEnglish: 'end' },
  { id: 'letter-f', character: 'F', type: 'letter', soundDescription: 'Letter name: "eff". Sounds like the English f.', exampleWord: 'Fenster', exampleWordEnglish: 'window' },
  { id: 'letter-g', character: 'G', type: 'letter', soundDescription: 'Letter name: "geh". A hard g, like in "go" - never soft like the g in "giant".', exampleWord: 'Garten', exampleWordEnglish: 'garden' },
  { id: 'letter-h', character: 'H', type: 'letter', soundDescription: 'Letter name: "hah". A breathy h at the start of a word or syllable, same as English.', exampleWord: 'Haus', exampleWordEnglish: 'house', note: 'After a vowel, h often goes silent and just lengthens that vowel instead of being pronounced.' },
  { id: 'letter-i', character: 'I', type: 'letter', soundDescription: 'Letter name: "ee". A short "ih" like in "bit", or a long "ee" like in "see" - never sounds like English "eye".', exampleWord: 'Insel', exampleWordEnglish: 'island' },
  { id: 'letter-j', character: 'J', type: 'letter', soundDescription: 'Letter name: "yot". Sounds like the English y in "yes" - never like the English j in "jump".', exampleWord: 'Ja', exampleWordEnglish: 'yes' },
  { id: 'letter-k', character: 'K', type: 'letter', soundDescription: 'Letter name: "kah". Sounds like the English k.', exampleWord: 'Katze', exampleWordEnglish: 'cat' },
  { id: 'letter-l', character: 'L', type: 'letter', soundDescription: 'Letter name: "ell". Sounds like the English l.', exampleWord: 'Lampe', exampleWordEnglish: 'lamp' },
  { id: 'letter-m', character: 'M', type: 'letter', soundDescription: 'Letter name: "emm". Sounds like the English m.', exampleWord: 'Milch', exampleWordEnglish: 'milk' },
  { id: 'letter-n', character: 'N', type: 'letter', soundDescription: 'Letter name: "enn". Sounds like the English n.', exampleWord: 'Name', exampleWordEnglish: 'name' },
  { id: 'letter-o', character: 'O', type: 'letter', soundDescription: 'Letter name: "oh". A short or long "oh" sound.', exampleWord: 'Onkel', exampleWordEnglish: 'uncle' },
  { id: 'letter-p', character: 'P', type: 'letter', soundDescription: 'Letter name: "peh". Sounds like the English p.', exampleWord: 'Papier', exampleWordEnglish: 'paper' },
  { id: 'letter-q', character: 'Q', type: 'letter', soundDescription: 'Letter name: "koo". Always followed by u, and the pair "qu" sounds like "kv" - never like the English "kw".', exampleWord: 'Quelle', exampleWordEnglish: 'spring, source' },
  { id: 'letter-r', character: 'R', type: 'letter', soundDescription: 'Letter name: "err". A rasp made in the back of the throat, not the tongue-tip r of English - see the "R" card under Tricky Sounds for more.', exampleWord: 'Rad', exampleWordEnglish: 'wheel, bike' },
  { id: 'letter-s', character: 'S', type: 'letter', soundDescription: 'Letter name: "ess". At the start of a word before a vowel it sounds like an English z; elsewhere it sounds like a plain English s - see "S before a vowel" under Tricky Sounds.', exampleWord: 'Sonne', exampleWordEnglish: 'sun' },
  { id: 'letter-t', character: 'T', type: 'letter', soundDescription: 'Letter name: "teh". Sounds like the English t.', exampleWord: 'Tisch', exampleWordEnglish: 'table' },
  { id: 'letter-u', character: 'U', type: 'letter', soundDescription: 'Letter name: "oo". A short or long "oo" sound, like in "put" or "boot".', exampleWord: 'Uhr', exampleWordEnglish: 'clock, watch' },
  { id: 'letter-v', character: 'V', type: 'letter', soundDescription: 'Letter name: "fow" (rhymes with "how"). Usually sounds like an English f - see "V" under Tricky Sounds.', exampleWord: 'Vogel', exampleWordEnglish: 'bird' },
  { id: 'letter-w', character: 'W', type: 'letter', soundDescription: 'Letter name: "veh". Sounds like an English v - see "W" under Tricky Sounds.', exampleWord: 'Winter', exampleWordEnglish: 'winter' },
  { id: 'letter-x', character: 'X', type: 'letter', soundDescription: 'Letter name: "iks". Sounds like "ks", same as English x. Rare at the start of native German words.', exampleWord: 'Taxi', exampleWordEnglish: 'taxi' },
  { id: 'letter-y', character: 'Y', type: 'letter', soundDescription: 'Letter name: "üpsilon". Mostly appears in loanwords; its sound varies - sometimes close to ü (Lyrik), sometimes a y-glide like in English (Yoga).', exampleWord: 'Yoga', exampleWordEnglish: 'yoga' },
  { id: 'letter-z', character: 'Z', type: 'letter', soundDescription: 'Letter name: "tsett". Sounds like "ts" - never like an English z. See "Z" under Tricky Sounds.', exampleWord: 'Zug', exampleWordEnglish: 'train' },
];

export const UMLAUTS = [
  { id: 'umlaut-ae', character: 'Ä', type: 'umlaut', soundDescription: 'A brighter, more open version of e - similar to the e in "bed" but a little longer and more open.', exampleWord: 'Käse', exampleWordEnglish: 'cheese' },
  { id: 'umlaut-oe', character: 'Ö', type: 'umlaut', soundDescription: 'No real English equivalent - round your lips as if to say "oh", but say "eh" instead. It sounds a little like the vowel in "bird" said with rounded lips.', exampleWord: 'Löffel', exampleWordEnglish: 'spoon' },
  { id: 'umlaut-ue', character: 'Ü', type: 'umlaut', soundDescription: 'No real English equivalent - round your lips tightly as if to whistle or say "oo", but say "ee" instead.', exampleWord: 'Tür', exampleWordEnglish: 'door' },
  { id: 'umlaut-ss', character: 'ß', type: 'umlaut', soundDescription: 'Called "Eszett" or "scharfes S" - just a plain "ss" sound, same as a double s. It never appears at the very start of a word.', exampleWord: 'Fuß', exampleWordEnglish: 'foot' },
];

export const TRICKY_SOUNDS = [
  {
    id: 'tricky-ch',
    character: 'CH',
    type: 'digraph',
    soundDescription: 'Two different sounds depending on what comes before it. After e, i, ä, ö, ü, or eu, it\'s the soft "ich-Laut" - a hiss made with the tongue high in the mouth, like a whispered "hy". After a, o, u, or au, it\'s the harsher "ach-Laut" - a raspy sound from the back of the throat, like clearing your throat gently.',
    exampleWord: 'ich',
    exampleWordEnglish: 'I',
    note: 'Compare the soft ch in "ich" (I) with the harsh ch in "auch" (also) or "Buch" (book) - same two letters, two different sounds.',
  },
  {
    id: 'tricky-sch',
    character: 'SCH',
    type: 'digraph',
    soundDescription: 'Always the "sh" sound, as in English "shoe" - one sound written with three letters.',
    exampleWord: 'schön',
    exampleWordEnglish: 'beautiful',
  },
  {
    id: 'tricky-ei-ie',
    character: 'EI vs IE',
    type: 'digraph',
    soundDescription: 'The classic beginner trap, because the two look swapped from English. "ei" sounds like the English word "eye". "ie" sounds like a long English "ee", as in "see". The trick: say the SECOND letter using its ENGLISH alphabet name - "ie" ends in e, and English "e" is said "ee"; "ei" ends in i, and English "i" is said "eye". That English letter-name is exactly the German sound.',
    exampleWord: 'mein',
    exampleWordEnglish: 'my',
    note: 'Contrast "mein" (my, sounds like "mine") with "die" (the, sounds like "dee").',
  },
  {
    id: 'tricky-eu-aeu',
    character: 'EU / ÄU',
    type: 'digraph',
    soundDescription: 'Both spellings make the same sound: "oy", like in English "boy".',
    exampleWord: 'neu',
    exampleWordEnglish: 'new',
    note: 'Same sound in "Häuser" (houses) - eu and äu are interchangeable in pronunciation, just different spellings depending on the word\'s root.',
  },
  {
    id: 'tricky-sp-st',
    character: 'SP- / ST-',
    type: 'digraph',
    soundDescription: 'At the START of a word (or word-part), sp and st are pronounced "shp" and "sht" - the s picks up an "sh" sound. In the middle or end of a word, they stay a plain "sp"/"st".',
    exampleWord: 'sprechen',
    exampleWordEnglish: 'to speak',
    note: 'Same shift in "Straße" (street, said "SHTRAH-suh") - but NOT in a word like "Wespe" (wasp), where sp is mid-word and stays plain.',
  },
  {
    id: 'tricky-v',
    character: 'V',
    type: 'special',
    soundDescription: 'Usually sounds like an English f - a common surprise, since English v is a totally different sound.',
    exampleWord: 'Vater',
    exampleWordEnglish: 'father',
    note: 'A few loanwords (like "Vase") keep the English-style v sound instead - the f-sound is the default for native words.',
  },
  {
    id: 'tricky-w',
    character: 'W',
    type: 'special',
    soundDescription: 'Sounds like an English v - this is the flip side of the V surprise above: German W takes over the sound English W doesn\'t use.',
    exampleWord: 'Wasser',
    exampleWordEnglish: 'water',
  },
  {
    id: 'tricky-z',
    character: 'Z',
    type: 'special',
    soundDescription: 'Always a "ts" sound, like the end of English "cats" - never the buzzing English z sound.',
    exampleWord: 'Zeit',
    exampleWordEnglish: 'time',
  },
  {
    id: 'tricky-r',
    character: 'R',
    type: 'special',
    soundDescription: 'Not the English r (where the tongue curls back). The standard German r is made in the back of the throat, close to a gargle or a soft version of the French r. It\'s a big adjustment for English speakers - listen closely and imitate rather than trying to describe it further.',
    exampleWord: 'Brot',
    exampleWordEnglish: 'bread',
  },
  {
    id: 'tricky-final-er',
    character: '-ER (at the end of a word)',
    type: 'special',
    soundDescription: 'At the end of a word, -er is NOT a hard r sound - it relaxes into a soft "uh" (a schwa), similar to the "-er" in a British English "butter" without pronouncing the r at all.',
    exampleWord: 'Bruder',
    exampleWordEnglish: 'brother',
    note: 'Same soft "-uh" ending in "Vater" (father) and "Mutter" (mother) - listen for the pattern across family words.',
  },
  {
    id: 'tricky-s-vowel',
    character: 'S (before a vowel, at the start of a word)',
    type: 'special',
    soundDescription: 'When s starts a word and is directly followed by a vowel, it sounds like an English z, not a plain s.',
    exampleWord: 'sagen',
    exampleWordEnglish: 'to say',
    note: 'Compare "sieben" (seven, starts with a z-sound) - but a word like "Espresso", where s is mid-word, keeps a plain s sound.',
  },
];

export const FOUNDATIONS = [...LETTERS, ...UMLAUTS, ...TRICKY_SOUNDS];

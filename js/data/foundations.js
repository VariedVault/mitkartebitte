// Foundations: a from-zero primer covering the alphabet/pronunciation AND core vocabulary
// (numbers, calendar & time words). Deliberately separate from the verb pool
// (js/data/verbs-a1.js): this is reference material, not drilled - it never feeds the SRS
// deck, has no checkpoint, and is tracked with a single per-profile "studied" boolean (see
// store.js), not mastery %.
//
// Every exampleWord below is a real, correctly-spelled, common German word/number chosen
// specifically to demonstrate the paired sound or concept - see the phase reports for the
// full lists and anything flagged for review. No two entries share the same exampleWord
// (letter W intentionally uses "Woche" rather than "Winter", since "Winter" is also a
// Seasons entry), so nothing reads as accidentally recycled.
//
// type: 'letter' | 'umlaut' | 'digraph' | 'special'
//     | 'number-basic' | 'number-decade' | 'number-compound'
//     | 'weekday' | 'month' | 'season' | 'time-word'
//   - letter:  the 26 base letters A-Z
//   - umlaut:  ä, ö, ü, ß (grouped in the UI as "Umlauts & ß")
//   - digraph: a two-letter (or two-vowel) combination with its own sound (ch, sch, ei/ie,
//              eu/äu, sp-/st-)
//   - special: a single letter whose sound is a common beginner surprise (v, w, z, r, final
//              -er, word-initial s+vowel)
//   - number-basic/-decade/-compound: 0-100 cardinals, split into three UI sub-sections (see
//              NUMBERS below and foundationsGroup.js's subGroups)
//   - weekday/month/season/time-word: the four sub-sections of "Calendar & Time" (see
//              CALENDAR_TIME below)

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
  { id: 'letter-w', character: 'W', type: 'letter', soundDescription: 'Letter name: "veh". Sounds like an English v - see "W" under Tricky Sounds.', exampleWord: 'Woche', exampleWordEnglish: 'week' },
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
    character: '-ER',
    type: 'special',
    soundDescription: 'At the end of a word, -er is NOT a hard r sound - it relaxes into a soft "uh" (a schwa), similar to the "-er" in a British English "butter" without pronouncing the r at all.',
    exampleWord: 'Bruder',
    exampleWordEnglish: 'brother',
    note: 'Same soft "-uh" ending in "Vater" (father) and "Mutter" (mother) - listen for the pattern across family words.',
  },
  {
    id: 'tricky-s-vowel',
    character: 'S-',
    type: 'special',
    soundDescription: 'When s starts a word and is directly followed by a vowel, it sounds like an English z, not a plain s.',
    exampleWord: 'sagen',
    exampleWordEnglish: 'to say',
    note: 'Compare "sieben" (seven, starts with a z-sound) - but a word like "Espresso", where s is mid-word, keeps a plain s sound.',
  },
];

// ================================================================== NUMBERS ==================================================================
// 0-100 cardinals, no ordinals. type is split into three sub-kinds purely so the UI can
// show them as three labeled sub-sections (0-20, decades, then the combining pattern) -
// see foundationsGroup.js's subGroups. `character` is the numeral, `exampleWord` the
// spelled-out German word - this is the one place in Foundations where exampleWord IS the
// main content, not a demo sentence-word.
export const NUMBERS = [
  { id: 'number-0', character: '0', type: 'number-basic', soundDescription: 'Zero - also used more generally to mean "nothing".', exampleWord: 'null', exampleWordEnglish: 'zero' },
  { id: 'number-1', character: '1', type: 'number-basic', soundDescription: 'One. This bare counting form changes to "ein/eine" when actually counting a noun: "ein Buch", "eine Frau".', exampleWord: 'eins', exampleWordEnglish: 'one' },
  { id: 'number-2', character: '2', type: 'number-basic', soundDescription: 'Two. Often said as "zwo" instead on the phone or in noisy places, since "zwei" and "drei" can sound similar.', exampleWord: 'zwei', exampleWordEnglish: 'two' },
  { id: 'number-3', character: '3', type: 'number-basic', soundDescription: 'Three.', exampleWord: 'drei', exampleWordEnglish: 'three' },
  { id: 'number-4', character: '4', type: 'number-basic', soundDescription: 'Four.', exampleWord: 'vier', exampleWordEnglish: 'four' },
  { id: 'number-5', character: '5', type: 'number-basic', soundDescription: 'Five.', exampleWord: 'fünf', exampleWordEnglish: 'five' },
  { id: 'number-6', character: '6', type: 'number-basic', soundDescription: 'Six.', exampleWord: 'sechs', exampleWordEnglish: 'six' },
  { id: 'number-7', character: '7', type: 'number-basic', soundDescription: 'Seven.', exampleWord: 'sieben', exampleWordEnglish: 'seven' },
  { id: 'number-8', character: '8', type: 'number-basic', soundDescription: 'Eight.', exampleWord: 'acht', exampleWordEnglish: 'eight' },
  { id: 'number-9', character: '9', type: 'number-basic', soundDescription: 'Nine.', exampleWord: 'neun', exampleWordEnglish: 'nine' },
  { id: 'number-10', character: '10', type: 'number-basic', soundDescription: 'Ten.', exampleWord: 'zehn', exampleWordEnglish: 'ten' },
  { id: 'number-11', character: '11', type: 'number-basic', soundDescription: 'Eleven - along with twelve, the only "teen" with its own irregular word instead of being built from zehn (ten).', exampleWord: 'elf', exampleWordEnglish: 'eleven' },
  { id: 'number-12', character: '12', type: 'number-basic', soundDescription: 'Twelve - the other irregular teen (compare elf).', exampleWord: 'zwölf', exampleWordEnglish: 'twelve' },
  { id: 'number-13', character: '13', type: 'number-basic', soundDescription: 'Thirteen - from here on, teens are just [ones] + zehn: drei + zehn.', exampleWord: 'dreizehn', exampleWordEnglish: 'thirteen' },
  { id: 'number-14', character: '14', type: 'number-basic', soundDescription: 'Fourteen - vier + zehn.', exampleWord: 'vierzehn', exampleWordEnglish: 'fourteen' },
  { id: 'number-15', character: '15', type: 'number-basic', soundDescription: 'Fifteen - fünf + zehn.', exampleWord: 'fünfzehn', exampleWordEnglish: 'fifteen' },
  { id: 'number-16', character: '16', type: 'number-basic', soundDescription: 'Sixteen - sechs loses its final -s here: "sechzehn", not "sechszehn".', exampleWord: 'sechzehn', exampleWordEnglish: 'sixteen' },
  { id: 'number-17', character: '17', type: 'number-basic', soundDescription: 'Seventeen - sieben loses its -en here: "siebzehn", not "siebenzehn".', exampleWord: 'siebzehn', exampleWordEnglish: 'seventeen' },
  { id: 'number-18', character: '18', type: 'number-basic', soundDescription: 'Eighteen - acht + zehn.', exampleWord: 'achtzehn', exampleWordEnglish: 'eighteen' },
  { id: 'number-19', character: '19', type: 'number-basic', soundDescription: 'Nineteen - neun + zehn.', exampleWord: 'neunzehn', exampleWordEnglish: 'nineteen' },
  { id: 'number-20', character: '20', type: 'number-basic', soundDescription: 'Twenty - the decade pattern starts here: its own word, no longer built from zehn.', exampleWord: 'zwanzig', exampleWordEnglish: 'twenty' },
  { id: 'number-30', character: '30', type: 'number-decade', soundDescription: 'Thirty - the one decade that uses -ßig instead of -zig.', exampleWord: 'dreißig', exampleWordEnglish: 'thirty' },
  { id: 'number-40', character: '40', type: 'number-decade', soundDescription: 'Forty - vier + zig.', exampleWord: 'vierzig', exampleWordEnglish: 'forty' },
  { id: 'number-50', character: '50', type: 'number-decade', soundDescription: 'Fifty - fünf + zig.', exampleWord: 'fünfzig', exampleWordEnglish: 'fifty' },
  { id: 'number-60', character: '60', type: 'number-decade', soundDescription: 'Sixty - like sechzehn, sechs drops its final -s: "sechzig", not "sechszig".', exampleWord: 'sechzig', exampleWordEnglish: 'sixty' },
  { id: 'number-70', character: '70', type: 'number-decade', soundDescription: 'Seventy - like siebzehn, sieben drops its -en: "siebzig", not "siebenzig".', exampleWord: 'siebzig', exampleWordEnglish: 'seventy' },
  { id: 'number-80', character: '80', type: 'number-decade', soundDescription: 'Eighty - acht + zig.', exampleWord: 'achtzig', exampleWordEnglish: 'eighty' },
  { id: 'number-90', character: '90', type: 'number-decade', soundDescription: 'Ninety - neun + zig.', exampleWord: 'neunzig', exampleWordEnglish: 'ninety' },
  { id: 'number-100', character: '100', type: 'number-decade', soundDescription: 'One hundred - usually just "hundert" on its own in everyday speech, though "einhundert" is also correct.', exampleWord: 'hundert', exampleWordEnglish: 'one hundred' },
  {
    id: 'number-combo-21', character: '21', type: 'number-compound',
    soundDescription: 'ein + und + zwanzig, literally "one-and-twenty" - German says the ONES digit first, the reverse of English "twenty-one". This backwards pattern holds for every two-digit number from 21 to 99.',
    exampleWord: 'einundzwanzig', exampleWordEnglish: 'twenty-one',
  },
  {
    id: 'number-combo-32', character: '32', type: 'number-compound',
    soundDescription: 'zwei + und + dreißig - same backwards pattern: say the "2", then "und" ("and"), then "30".',
    exampleWord: 'zweiunddreißig', exampleWordEnglish: 'thirty-two',
  },
  {
    id: 'number-combo-47', character: '47', type: 'number-compound',
    soundDescription: 'sieben + und + vierzig - the same rule again: say the "7", then "und", then "40". Once you know 0-20 and the decades, every number up to 99 follows this one pattern.',
    exampleWord: 'siebenundvierzig', exampleWordEnglish: 'forty-seven',
  },
];

// ================================================================== CALENDAR & TIME ==================================================================
// Weekdays, months, seasons, and today/tomorrow/yesterday - four sub-kinds shown as four
// labeled sub-sections in the UI (see foundationsGroup.js's subGroups), all under one
// "Calendar & Time" Foundations section. `character` is a short abbreviation for weekdays/
// months (the ones actually used on German calendars and forms), the full word where an
// abbreviation wouldn't help (seasons, time words).

export const WEEKDAYS = [
  { id: 'weekday-montag', character: 'Mo', type: 'weekday', soundDescription: 'Mond (moon) + Tag (day) - "moon day", the same logic as English "Monday".', exampleWord: 'Montag', exampleWordEnglish: 'Monday' },
  { id: 'weekday-dienstag', character: 'Di', type: 'weekday', soundDescription: 'From an old Germanic god\'s name (Ziu) + Tag - not obviously related to "Tuesday" in spelling, but the same weekday and origin story (a war-god\'s day).', exampleWord: 'Dienstag', exampleWordEnglish: 'Tuesday' },
  { id: 'weekday-mittwoch', character: 'Mi', type: 'weekday', soundDescription: 'Literally "mid-week" (Mitte + Woche) - unlike English "Wednesday", this one is fully transparent once you know the two root words.', exampleWord: 'Mittwoch', exampleWordEnglish: 'Wednesday' },
  { id: 'weekday-donnerstag', character: 'Do', type: 'weekday', soundDescription: 'Donner (thunder) + Tag - Thor\'s day, same thunder-god logic as English "Thursday".', exampleWord: 'Donnerstag', exampleWordEnglish: 'Thursday' },
  { id: 'weekday-freitag', character: 'Fr', type: 'weekday', soundDescription: 'From the goddess Freya + Tag - same naming pattern as English "Friday".', exampleWord: 'Freitag', exampleWordEnglish: 'Friday' },
  { id: 'weekday-samstag', character: 'Sa', type: 'weekday', soundDescription: 'From "Sabbat" (Sabbath).', exampleWord: 'Samstag', exampleWordEnglish: 'Saturday', note: 'Northern and eastern Germany often say "Sonnabend" (literally "Sunday-eve") instead - both mean Saturday.' },
  { id: 'weekday-sonntag', character: 'So', type: 'weekday', soundDescription: 'Sonne (sun) + Tag - "sun day", a direct parallel to English "Sunday".', exampleWord: 'Sonntag', exampleWordEnglish: 'Sunday' },
];

export const MONTHS = [
  { id: 'month-januar', character: 'Jan', type: 'month', soundDescription: 'Close to the English "January" - easy to recognize.', exampleWord: 'Januar', exampleWordEnglish: 'January' },
  { id: 'month-februar', character: 'Feb', type: 'month', soundDescription: 'Close to the English "February".', exampleWord: 'Februar', exampleWordEnglish: 'February' },
  { id: 'month-maerz', character: 'Mär', type: 'month', soundDescription: 'Close to the English "March", but shorter.', exampleWord: 'März', exampleWordEnglish: 'March' },
  { id: 'month-april', character: 'Apr', type: 'month', soundDescription: 'Spelled the same as English "April" - only the pronunciation (German a/i vowel sounds) differs.', exampleWord: 'April', exampleWordEnglish: 'April' },
  { id: 'month-mai', character: 'Mai', type: 'month', soundDescription: 'Short and easy - rhymes with English "my", not "may".', exampleWord: 'Mai', exampleWordEnglish: 'May' },
  { id: 'month-juni', character: 'Jun', type: 'month', soundDescription: 'Said "YOO-nee".', exampleWord: 'Juni', exampleWordEnglish: 'June', note: 'Juni and Juli sound very close - in spoken German people often say "Juno" for June and "Julei" (with stress on the last syllable) for July to avoid confusion, especially on the phone.' },
  { id: 'month-juli', character: 'Jul', type: 'month', soundDescription: 'Said "YOO-lee" - see the Juni note about avoiding mix-ups.', exampleWord: 'Juli', exampleWordEnglish: 'July' },
  { id: 'month-august', character: 'Aug', type: 'month', soundDescription: 'Spelled the same as English "August" - stress falls on the second syllable, "au-GUST".', exampleWord: 'August', exampleWordEnglish: 'August' },
  { id: 'month-september', character: 'Sep', type: 'month', soundDescription: 'Close to the English "September".', exampleWord: 'September', exampleWordEnglish: 'September' },
  { id: 'month-oktober', character: 'Okt', type: 'month', soundDescription: 'Close to the English "October", spelled with a K.', exampleWord: 'Oktober', exampleWordEnglish: 'October' },
  { id: 'month-november', character: 'Nov', type: 'month', soundDescription: 'Close to the English "November".', exampleWord: 'November', exampleWordEnglish: 'November' },
  { id: 'month-dezember', character: 'Dez', type: 'month', soundDescription: 'Close to the English "December", spelled with a Z.', exampleWord: 'Dezember', exampleWordEnglish: 'December' },
];

export const SEASONS = [
  { id: 'season-fruehling', character: 'Frühling', type: 'season', soundDescription: 'Spring.', exampleWord: 'Frühling', exampleWordEnglish: 'spring' },
  { id: 'season-sommer', character: 'Sommer', type: 'season', soundDescription: 'Summer - close to the English word.', exampleWord: 'Sommer', exampleWordEnglish: 'summer' },
  { id: 'season-herbst', character: 'Herbst', type: 'season', soundDescription: 'Autumn/fall.', exampleWord: 'Herbst', exampleWordEnglish: 'autumn, fall' },
  { id: 'season-winter', character: 'Winter', type: 'season', soundDescription: 'Winter - spelled and said close to the English word.', exampleWord: 'Winter', exampleWordEnglish: 'winter' },
];

export const TIME_WORDS = [
  { id: 'time-heute', character: 'Heute', type: 'time-word', soundDescription: 'Today.', exampleWord: 'heute', exampleWordEnglish: 'today' },
  { id: 'time-morgen', character: 'Morgen', type: 'time-word', soundDescription: 'Tomorrow.', exampleWord: 'morgen', exampleWordEnglish: 'tomorrow', note: 'Capitalized "Morgen" is a different word meaning "morning" (der Morgen) - lowercase "morgen" as used here is the adverb for "tomorrow". Context tells them apart.' },
  { id: 'time-gestern', character: 'Gestern', type: 'time-word', soundDescription: 'Yesterday.', exampleWord: 'gestern', exampleWordEnglish: 'yesterday' },
];

export const CALENDAR_TIME = [...WEEKDAYS, ...MONTHS, ...SEASONS, ...TIME_WORDS];

export const FOUNDATIONS = [...LETTERS, ...UMLAUTS, ...TRICKY_SOUNDS, ...NUMBERS, ...CALENDAR_TIME];

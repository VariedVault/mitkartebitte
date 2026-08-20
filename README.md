# mit Karte, bitte

A German grammar course, A1 → B1, built around one idea: conjugation should feel like
learning to play a card game, not filling out a worksheet. No accounts, no backend, no
tracking - everything runs in your browser and installs as an offline app.

**Live app:** https://variedvault.github.io/mitkartebitte/

## What it is

- **16 fully-authored modules**, four tiers, A1 through B1 - Präsens through Passiv.
  Every module has a real grammar explanation up front (not just drills), then practice,
  then a checkpoint quiz.
- **A shared, spaced-repetition (Leitner box) engine** schedules every verb×tense×pronoun
  fact across every module you've touched. Wrong answers re-queue - no lives, no streaks,
  no guilt for a skipped day.
- **Multiple local profiles** (seeded with "You" and "Wife", both renameable, plus
  "+ New") - each with fully independent progress, deck, and resume position.
- **A curated, hand-verified 68-verb dataset**, covering every strong-verb ablaut
  pattern, all 6 modal verbs, sein/haben/werden, separable & reflexive verbs, and the
  weak-verbs-that-still-take-sein exceptions (reisen, passieren).
- **Installable PWA** - add it to your home screen, works fully offline after first load.
- **Free, browser-native text-to-speech** on every verb and example sentence.

## Running locally

No build step, no dependencies. From the project folder:

```
python3 -m http.server 8000
```

Then open `http://localhost:8000/`. (Any static file server works - the app is plain
HTML/CSS/ES modules.)

## Architecture - how a course plugs in

This is a course *platform*; conjugation is just the first course.

- `js/data/verbs.js` - the shared verb-data pool. Every module **filters** this pool; no
  module owns its own verbs. Praesens, praeteritum (for strong/mixed/irregular verbs),
  partizip2, imperativ, and konjunktiv2 (only where a living synthetic form exists) are
  hand-authored and verified here.
- `js/data/conjugate.js` - derives compound tenses (Perfekt, Plusquamperfekt, Futur,
  Konjunktiv I, Passiv) from those verified primitives via regular sentence-assembly
  rules. It never guesses an irregular stem - it only assembles pieces that are already
  correct. Konjunktiv II uses a hand-authored synthetic form for the ~13 verbs where
  that's still the living spoken form (sein, haben, werden, wissen, the 6 modals,
  denken, kommen) and derives würde + infinitive for every other verb - which is how
  Konjunktiv II actually works in modern spoken German.
- `js/ui/drills.js` - turns verb data + a tense into exercises (fill-in-blank, multiple
  choice, full conjugation-table completion). Shared by every module.
- `js/views/lesson.js` - the generic module runner: explanation → practice → checkpoint.
  This is what lets all 16 modules ship at *uniform* quality without 16 bespoke UIs.
- `js/data/modules/index.js` - the course registry. **A future course (cases,
  prepositions, adjective endings, word order) is just another array of module
  descriptors pushed onto `COURSES` - nothing else in the app needs to change.**

### Adding a verb

Append an object to the `VERBS` array in `js/data/verbs.js` following the shape
documented at the top of that file. Any module whose `verbPool` filter matches it (by
`type`, `tags`, `auxiliary`, etc.) picks it up automatically - no other file changes.

### Adding a module

Create a new file in `js/data/modules/` exporting a module descriptor (shape documented
at the top of `js/data/modules/index.js`), then add one import + one array entry in that
file. The shared lesson runner, drill engine, and SRS scheduler handle the rest.

## Design notes worth knowing

- **No forced streak, no hearts, no lock-in.** The activity heatmap is opt-in and off by
  default (Profile → Backup & settings). Progress is expressed as mastery %, never
  consecutive days. Every module is reachable from the course map at any time - the
  tier order is a *recommendation*, not a gate. Passing a checkpoint marks a module
  mastered from wherever you start ("test out").
- **Export/import is both backup and cross-device transfer**, since everything lives in
  this browser's `localStorage` only. Profile tab → Backup & settings → Export/Import.

## Privacy

No backend, no analytics, no accounts. Everything is stored in `localStorage` under
keys namespaced `mitkartebitte:*`. The only thing that ever leaves your device is a file
you explicitly export yourself.

## License

MIT.

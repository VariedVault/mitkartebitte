# mit Karte, bitte

A German grammar course, A1 → B1, built around one idea: conjugation should feel like
learning to play a card game, not filling out a worksheet. No accounts, no backend, no
tracking - everything runs in your browser and installs as an offline app.

**Live app:** https://mitkarte-bitte.de

## Deployment

Served via GitHub Pages on a custom domain. The repo root contains a `CNAME` file
with exactly one line: `mitkarte-bitte.de`.

**Never delete, overwrite, rename, or regenerate that file.** GitHub Pages reads it on
every deploy to know which custom domain to serve; removing it (even temporarily, even
by an automated "regenerate root files" step) breaks the custom domain until it's
manually re-added and DNS re-verifies. If root files are ever bulk-regenerated for any
reason, re-create `CNAME` immediately afterward with that single line.

## What it is

- **Two tracks on the Learn screen**: Foundations (alphabet/pronunciation/numbers - not
  yet built) and Conjugation, structured as CEFR levels (A1 active; A2/B1 visible but
  locked until their verb data ships in a later phase).
- **Each verb has its own fixed-size reference card** - infinitive, English, audio, an
  example sentence, and a full pronoun-color-coded conjugation table for every tense
  populated so far. Pure reference, nothing graded.
- **Short plain-English grammar-rule pages** per tense (Präsens, Imperativ, Perfekt for
  A1) - read anytime, nothing to complete.
- **One checkpoint per level** (~8 questions, 80% to pass) certifies that level and
  unlocks it for Practice - cumulatively, so passing A2's checkpoint later keeps A1
  included, not just A2.
- **A single cumulative, SRS-weighted Practice deck** draws endlessly from every
  certified level's verbs, plus anything pinned early via a verb card's "Add to
  practice". A small starter set keeps it non-empty even before any checkpoint is passed.
- **Learn home's return signal is "X cards due for review today"** - earned, calm when
  it's zero, never a streak or a guilt trip.
- **Installable PWA** - add it to your home screen, works fully offline after first load,
  no third-party scripts.
- **Free, browser-native text-to-speech** on every verb, table cell, and example
  sentence.

## Running locally

No build step, no dependencies. From the project folder:

```
python3 -m http.server 8000
```

Then open `http://localhost:8000/`. (Any static file server works - the app is plain
HTML/CSS/ES modules.)

## Architecture

- `js/data/verbs-a1.js` - the verb data pool for the current phase (A1, ~36 verbs). Every
  verb carries the **full schema** - all seven tenses as explicit keys - even though only
  `praesens`, `imperativ`, and `perfekt` are populated this phase; the rest are `null`
  placeholders a later phase fills in without restructuring anything.
- `js/data/rules.js` - the rule engine. Regular forms (weak-verb Präsens endings,
  Imperativ derivation, Perfekt assembly from auxiliary + partizip2) are generated here,
  not hand-typed - "correct by construction." Only genuine irregulars (stem-changers'
  du/er, strong/mixed partizip2, sein/haben/werden, the modals, wissen) are hand-typed
  string literals in `verbs-a1.js`.
- `scripts/verify.mjs` - the living accuracy audit. Re-derives every regular form and
  fails the build on any disagreement, checks every example sentence contains its
  verb's correct conjugated form, and prints a full per-verb table for manual review.
  Run it after any data change: `node scripts/verify.mjs`.
- `js/ui/verbUtils.js` - table lookups, fact keys, and the shared conjugation-table
  renderer used by the verb card, grammar pages, and Practice's reveal.
- `js/srs.js` - the Leitner spaced-repetition engine (fact = one verb+tense+pronoun).
  Tense/course-shape-agnostic, unchanged since the very first version of this app.
- `js/store.js` - localStorage persistence, including `migrateIfNeeded()`, which clears
  a profile's course progress (not its name/settings) if it predates the current course
  structure, and surfaces a one-time "the course has been restructured" notice instead
  of crashing on an old shape.

### Adding a verb

Append an object to the `VERBS` array in `js/data/verbs-a1.js` following the shape
documented at the top of that file - call into `rules.js` for every regular form, hand-
type only genuine irregulars, then run `node scripts/verify.mjs` and check its per-verb
table before shipping.

### A2/B1 (future phases)

The schema, gating (`store.isCheckpointPassed`/`isLevelStudied`-style cumulative unlock),
and UI (Learn home's level cards, `/level/:level`, `/checkpoint/:level`) already handle
any number of levels - a future phase only needs to add A2/B1 verb records with their
`level` field set and the newly-relevant `tables` keys filled in.

## Design notes worth knowing

- **No forced streak, no hearts, no lock-in.** The activity heatmap is opt-in and off by
  default (Settings). Progress is expressed as mastery %, never consecutive days. Every
  verb page and grammar-rule page is readable anytime - a level's checkpoint gates the
  Practice unlock, not study access ("test out" is always allowed).
- **Export/import is both backup and cross-device transfer**, since everything lives in
  this browser's `localStorage` only. Settings → Export/Import.

## Privacy

No backend, no analytics, no accounts, no third-party scripts. Everything is stored in
`localStorage` under keys namespaced `mitkartebitte:*`. The only thing that ever leaves
your device is a file you explicitly export yourself.

## License

MIT — see [LICENSE](./LICENSE). Copyright (c) 2026 Balaji Jayakumar (VariedVault).

# Grammar Accuracy Audit — superseded

This audit covered the pre-revamp dataset (`js/data/verbs.js`, 68 verbs, 16 course
modules), which no longer exists in this repo — it was replaced by the A1 verb core
(`js/data/verbs-a1.js`, ~36 verbs) as part of the staged course revamp.

**The current, living audit is `scripts/verify.mjs`.** Run `node scripts/verify.mjs` to
get an up-to-date accuracy report: every regular form re-derived against the rule engine
in `js/data/rules.js` (fails the build on disagreement), every example sentence checked
against its verb's conjugated form, and a full per-verb table printed for manual review.

The original 68-verb audit (dated 2026-08-20) is preserved in this file's git history
(`git log -- GRAMMAR_AUDIT.md`) prior to the revamp commit, if useful for reference.

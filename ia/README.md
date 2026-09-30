# Transform9 clone — information architecture

`ia.json` is the only file to hand-edit here. `IA.md` and `matrix.csv` are generated from it — re-run the scripts below after any change, and never hand-edit the generated files.

```bash
cd ia
node validate.mjs   # checks route/template totals, referential integrity, category coverage
node build.mjs       # regenerates IA.md and matrix.csv
```

## What this documents

All 18 in-scope routes of the Transform9 clone (`/Users/riyaghosh/V3/transform`), across 8 templates. Source: `https://www.transform9.com/`, measured live 2026-09-30 (see `../CLONE_SPEC.md` and `../specs/*.md`); pages on external domains (careers, login portal, EMR marketplaces, social) are out of scope per `../PROJECT_SCOPE.md` and stay as outbound links. This is an **update pass**: it supersedes the earlier homepage-only IA (git `486e41d`) now that the site has been built out to every in-scope route, and it was re-derived directly from the current codebase (`src/routes.jsx`, `src/pages/*`, `src/components/**`, `content/blog/*.json`, `content/case-studies/*.json`) rather than from prose reports — every `implementedBy` path was checked against the real file tree (43/43 resolve) and the 18-route total matches `src/routes.jsx`'s route table exactly.

This revision was built while Motion-4 (blog/case-study hover polish) and Phase 2 QA (`clone-agents:animation-qa` + `clone-agents:full-site-qa`) were still in progress. Neither changes routes, sections, or templates, so the IA doesn't need to wait for them — but `meta.sourceRevision` (git `6837462`) should be bumped, and any structural findings from QA folded in, before this IA is cited by the design-repo extraction.

## Findings

- **Templates are lopsided by design, not by accident.** The CMS templates (Blog post, Legal, Case study) account for 13 of 18 routes (72%), but they're only 3 templates built from 2 shared renderers (`PostBody`/`RichText` for blog posts and case studies; one `LegalContent` component with 3 data variants for the legal pages). The other 5 templates are one-off pages. The real build effort was in the 5 unique templates and the shared shell, not in replicating markup across the CMS routes.
- **11 of 43 sections are shared across templates** — mostly shell chrome (`shell.page-layers`, `shell.navbar`, `shell.mobile-menu`, `shell.footer-bottom-reveal` are on all 18 routes) plus `conversion.cta`, which appears on 14 of 18 routes and is the single most-reused *content* section in the site. The remaining 32 sections are single-template and correctly stay page-local (e.g. every `compare.*` and `product.*` section) — they have one caller today, so promoting them to a shared library would be speculative.
- **`/compare` reuses two homepage sections in a different skin.** `compare.specialty-white` and `compare.integrations-white` are the homepage's `fit.specialties`/`fit.integrations` React components rendered with a `variant="white"` prop, not copies. They're modeled as their own IA sections (not aliases of the homepage ones) because their content and hover treatment genuinely differ — this is the "two sections, not one shared id with a context-dependent meaning" rule from the IA schema, applied to a real additive-prop reuse pattern in the code.
- **Two intentional "18 but not 18" numbers survive in the scope prose** for `shell.preloader` (16 routes: everywhere except home and `/book-a-demo`) and `shell.footer` (17 routes: everywhere except `/book-a-demo`, which keeps only the sticky footer reveal). These are correct, different subsets — not a copy-paste error — and `validate.mjs` surfaces them as informational notes rather than failures for exactly that reason.

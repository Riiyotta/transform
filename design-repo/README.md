# Transform9 design-repo

Status: **design-review-pending** (`productionApproved: false`) - see `registry.manifest.json`.

An AI-ready, machine-validated PageSpec system for the Transform9 clone (React + Vite + Tailwind v3, source site https://www.transform9.com/). It lets a generator compose pages from measured tokens, primitives, components, 43 section contracts and 8 templates without inventing a colour, a copy budget, a section or an asset. Everything here is derived bottom-up from real evidence (the clone's source, CLONE_SPEC.md, specs/*.md, QA/audit/motion reports) and every value cites it.

<!-- counts: tokens=260 primitives=16 components=15 sections=43 templates=8 routes=18 motionPatterns=48 assetRoles=19 graphRules=11 -->

## Counts (recomputed from disk by `extraction/verify_all.py`)

| Item | Count |
|---|---|
| Sections | 43 |
| Templates | 8 |
| Routes | 18 |
| Primitives | 16 |
| Components | 15 |
| Tokens | 260 |
| Motion patterns | 48 |
| Asset roles | 19 |
| Graph rules | 11 |

## Layout

```
README.md  CHANGELOG.md  registry.manifest.json
tokens/00-foundation/   color, opacity, gradient, typography, spacing, radius, breakpoint, elevation, icon-size, motion, motion-patterns
tokens/10-semantic/     semantic roles (text.primary, surface.page, border.default, ...)
tokens/20-component/    component-scoped token groups
tokens/30-layout/       grid, hairline, z-index stack, hero, footer reveal
tokens/themes/          dark (default) and light (white-section surface) - every semantic token mapped
tokens/llm/             component-allowlist.json (closed, versioned), token-catalog.json, token-policy.json
primitives/ components/ sections/   one JSON contract per id
templates/              templates.json (explicit node sequences) and routes.json (18 routes -> 8 templates)
compatibility/graph.json   rhythm rules with severity
assets/asset-roles.json    closed assetRole registry with generation / licensing policy
schema/                 pagespec.schema.json (Draft-07), section-contract.schema.json, example.pagespec.json,
                        semantic_validate.py, tests/adversarial_test.py
extraction/             measured-values.json (evidence ledger), verify_all.py, prove_drift.py
```

## Use

```
python3 schema/semantic_validate.py schema/example.pagespec.json   # schema + semantic validation of a PageSpec
python3 schema/tests/adversarial_test.py                            # controls pass, every mutation rejected
python3 extraction/verify_all.py                                    # 17 drift-proof checks (add --source-root DIR to verify citations)
python3 extraction/prove_drift.py --source-root DIR                 # proves the drift checks actually fail on injected drift
```

Requires Python 3.9+ and the `jsonschema` package. All scripts derive the repo root from their own location; there are no absolute paths in this package.

## PageSpec model

A PageSpec has `pageSpecVersion`, `usage`, `template`, `route`, `title`, `metaDescription` and `nodes`. A node has only `section`, `variant` (only where the section defines variants), `content` and `motion`. There is **no style or token-override field** (see `tokens/llm/token-policy.json`): styling is owned entirely by the section and component contracts. Every object schema is closed (`additionalProperties: false`), including `motion`.

* `content` is the section's contract: exact field list, `maxWords` on every text-bearing field, exact observed list sizes. Fixed chrome (navbar links, footer columns, popup form, wordmark links) is recorded in `fixedContent` and is not settable.
* `motion` = `{patterns[], reducedMotionFallback}`. `patterns` are drawn from a closed registry of 48 patterns that were measured on the live site and verified on the clone (`tokens/00-foundation/motion-patterns.json`); each section lists the patterns it may carry. `reducedMotionFallback` is required and const-locked per section to one of three values: `video-still-image` (measured: the video is not played and the still shows), `parity-unchanged` (measured: the original keeps marquees, interactions and intros running under `prefers-reduced-motion`, and the clone reproduces that on purpose; this is parity, not an accessibility upgrade) and `static-no-motion`.
* Heading text is a list of segments `{text, tone, breakAfter}`; segments are joined with one space. `tone` is `default`, `accent-green` or `accent-blue`.

### Templates and routes

| Template | Family | Routes | Nodes | Shell |
|---|---|---|---|---|
| `template.home` | home | 1 (/) | 22 | footer=full modal=true preloader=false video=true |
| `template.compare` | compare | 1 (/compare) | 19 | footer=full modal=true preloader=true video=true |
| `template.book-a-demo` | book-a-demo | 1 (/book-a-demo) | 5 | footer=bottom modal=false preloader=false video=true |
| `template.legal` | legal | 3 (/{terms-of-use|privacy-policy|hipaa}) | 8 | footer=full modal=false preloader=true video=true |
| `template.blog-index` | blog-index | 1 (/blog) | 9 | footer=full modal=false preloader=true video=true |
| `template.blog-post` | blog-post | 8 (/blog/<slug>) | 9 | footer=full modal=false preloader=true video=false |
| `template.case-studies-index` | case-studies-index | 1 (/case-studies) | 9 | footer=full modal=false preloader=true video=true |
| `template.case-study` | case-study | 2 (/case-studies/<slug>) | 10 | footer=full modal=false preloader=true video=false |

Node order of the shell sections follows `ia/ia.json` (a logical layer order); the React render order is recorded in `templates/templates.json` (`renderOrderNote`). Page-level sections follow each page component exactly. A template's `nodes` are structured objects (`section`, `required`, `repeatable`); the semantic validator cross-references a PageSpec's declared template against that template's real node list (missing / extra / duplicate / order) and against the route's template and shell flags.

### Compatibility graph

| Rule | Severity |
|---|---|
| `SHELL_ORDER` | error |
| `ONE_HERO_PER_PAGE` | error |
| `FOOTER_BOTTOM_LAST` | error |
| `MODAL_NEEDS_CALL_LINK` | error |
| `CTA_CALL_LINK_NEEDS_MODAL` | warn |
| `TRANSITION_PAIR_ORDER` | error |
| `NO_CONSECUTIVE_TRANSITIONS` | error |
| `LIGHT_SURFACE_BRACKET` | error |
| `READ_NEXT_CASE_STUDY_ONLY` | error |
| `NO_CTA_ON_FORM_OR_LEGAL` | warn |
| `NO_ADJACENT_SAME_CATEGORY` | warn |

Every rule id in the graph is implemented in `schema/semantic_validate.py` (`RULES`); `verify_all.py` fails if the two sets drift, and all 8 real templates are checked against every error rule.

## Assets, licensing and AI generation

The source is a REAL company's site. Per PROJECT_SCOPE the assets and copy are reused locally **for private/internal use only; no redistribution**. Forms render every state and submit nowhere; tracking is stripped; pages on external domains (Careers, Login, EMR marketplaces, LinkedIn, YouTube) are excluded and stay outbound links.

Every media field is const-locked to one value of the closed `assetRole` enum (`assets/asset-roles.json`, `definitions.assetRole` in the schema, `assetRoles` in the allowlist, and every role is used by a field in the example or a contract). `usage` selects the context:

* `internal-clone` - the private clone: exact reuse of original assets and copy is the documented, scoped decision.
* `generated-derivative` - AI-generated new pages or derivatives. **Must not reproduce real logos (client, partner, certification, third-party marks), real people's photos, names or quotes, real metrics and competitive claims, real legal text, real product UI, or live endpoints (a real video id).** Roles that depict something real accept only `placeholder:` tokens a human replaces with authorised assets; sections flagged `claimsPolicy: must-not-fabricate` are rejected outright.

Generation policies: `may-generate-new` (generic, non-brand, non-person material), `must-reuse-exact` (the company's own wordmarks: reference, never redraw), `must-not-fabricate` (real customers, partners, certifications, people, third-party marks, real product UI) and `must-not-reuse-live-endpoint` (the YouTube id). The compliance-critical roles are pinned to exact values in `verify_all.py` (not just enum membership).

| Role | Generation policy | Used by |
|---|---|---|
| `bg.noise-tile` | may-generate-new | shell.page-layers |
| `bg.section-image` | may-generate-new | compare.generic, compare.privacy, conversion.cta, fit.security, proof.stats |
| `bg.still-fallback` | may-generate-new | shell.page-layers |
| `bg.video-loop` | may-generate-new | shell.page-layers |
| `brand.wordmark-black` | must-reuse-exact | shell.navbar |
| `brand.wordmark-footer` | must-reuse-exact | shell.footer-bottom-reveal |
| `brand.wordmark-white` | must-reuse-exact | compare.comparison-table, shell.navbar |
| `certification.badge` | must-not-fabricate | fit.security |
| `client.logo` | must-not-fabricate | content.case-header, content.case-list, content.read-next, proof.client-logos, proof.testimonials |
| `editorial.hero-image` | may-generate-new | content.blog-list, content.post-header, hero.blog-index |
| `embed.video` | must-not-reuse-live-endpoint | proof.client-spotlight |
| `partner.logo` | must-not-fabricate | compare.integrations-white, fit.integrations |
| `person.photo` | must-not-fabricate | proof.testimonials |
| `product.outreach-icon` | may-generate-new | product.outreach-agent |
| `product.ui-illustration` | must-not-fabricate | product.navigator-agent, product.scheduling-agent, product.tasking-agent |
| `specialty.image` | may-generate-new | compare.specialty-white, fit.specialties |
| `stat.hover-image` | may-generate-new | proof.stats |
| `ui.icon` | may-generate-new | compare.comparison-table |
| `ui.social-mark` | must-not-fabricate | content.post-body |

Not referenced by any PageSpec field: the PolySans Neutral typeface (licence terms unknown, private use only) and favicon/webclip/og images.

## Word budgets

`maxWords` = the next multiple of 5 at or above `observedMax`, where `observedMax` is the largest word count of that field across every real instance in the source (minimum 5). The rule is a design-repo policy, not a measurement; `observedMax` is stored beside each budget and verified. List sizes are the exact observed counts (e.g. 13 specialties, 4 stats blocks, 5 outreach cards).

## What was re-diffed against the current source (and what did not hold up)

The design-repo was built from the current working tree (git 900a82b plus uncommitted `cmsHover.js` changes), not from `ia/ia.json`'s recorded revision 6837462. Routes (18), templates (8), sections (43) and node lists are identical to ia.json. Findings that did not hold up are listed in `extraction/measured-values.json` (`findings`, `structuralNotes`) and summarised here:

* ia.json `sourceRevision` is stale (HEAD is later); no route/section/template changed in between.
* ia.json ids are logical dotted names, not literal `data-section` attributes (six heroes share `data-section="hero"`; shell sections use `data-component`).
* `shell.call-alex-modal` is on home and /compare in the clone (and ia.json), but the live site also renders it on blog and case-study pages; the clone's CTA Call Alex link is inert on those four templates. Recorded as a known gap and as warn rule `CTA_CALL_LINK_NEEDS_MODAL`.
* `src/pages/PageStub.jsx` is mounted as the not-found fallback (empty 100vh section inside the full shell), not dead; it is outside the 18 routes and has no template. Its stale "placeholder" comment is noted.
* ROUTES.md status column and QA_REPORT.md scope sentence are stale (all 18 routes are built).
* CLONE_SPEC section 17b says the big footer logo is hidden at <=767; the CSS (and specs/book-a-demo.md) hide it at <=479; the CSS value is used.
* ia.json `productionApproved: true` applies to the IA only; this repo is `design-review-pending`.

## Versioning

`allowlistVersion` (manifest) is machine-checked against `tokens/llm/component-allowlist.json`. `repositoryVersion` and `pageSpecVersion` are documentation-only markers. The counts block, README table and CHANGELOG marker are recomputed from disk by `verify_all.py`.

## Snapshot caveat

This design-repo is a snapshot of the source project at the revision above. If the clone changes (dependency bump, new route, refactor), re-run `verify_all.py` with `--source-root` and re-diff stack versions (`registry.manifest.json` `sourceProject.stack`), routes and counts before trusting it.

## Known limits / open decisions

* Reduced motion: parity with the original is recorded; a static settled state for `prefers-reduced-motion` was not measured and needs a human decision.
* Touch/swipe behaviour of the testimonial slider and hover-as-click on touch devices were never measured.
* The footer HubSpot form replica's success copy is an unverified placeholder; the 800 ms "Submitting..." hold on /book-a-demo is a clone choice.
* The not-found page was never measured on the live site.
* `design-repo.zip` is a build artifact generated after verification and is git-ignored; never commit it.

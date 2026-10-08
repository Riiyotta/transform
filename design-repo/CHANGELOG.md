# Changelog

<!-- counts: tokens=260 primitives=16 components=15 sections=43 templates=8 routes=18 motionPatterns=48 assetRoles=19 graphRules=11 -->

## 0.1.0 - 2026-10-01 - initial build (design-review-pending)

First complete build of the design-repo from the current clone source (git 900a82b + uncommitted cmsHover.js), built bottom-up: tokens, primitives, components, sections, templates, compatibility graph, schema, example, semantic validator, adversarial tests, manifest/allowlist/docs.

- 260 tokens: foundation (colour, opacity, gradient, typography, spacing, radius, breakpoint, elevation, icon size, motion), semantic roles, component groups, layout; dark (default) and light themes; LLM catalog, policy and allowlist.
- 16 primitives and 15 components.
- 43 section contracts (one per ia.json section), each with a closed content schema, maxWords budgets from observed maxima, constraints, motion with a required reducedMotionFallback, structured responsive changes and citations.
- 8 templates mapped 1:1 from 18 routes (legal pages share one template).
- 11 compatibility rules with severity; every id implemented in the validator.
- 48 measured motion patterns; the motion schema is closed.
- 19 closed assetRole values wired through schema, allowlist, asset-roles.json and the example, with generation/licensing policy and pinned compliance-critical roles.
- Example instance: the real `/blog/redefining-healthcare-ai` post (template.blog-post), 0 schema errors.
- Adversarial suite and drift proofs (allowlist parity, citation range, counts, pinned asset role).
- Recorded rather than normalised away: PageStub is the mounted not-found fallback; the clone omits the Call Alex modal on CMS templates where live renders it; stale ia.json revision, non-literal section ids, stale ROUTES.md/QA_REPORT.md statements.

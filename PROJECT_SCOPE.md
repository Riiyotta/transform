# Project Scope — Transform9 clone

Recorded 2026-09-30.

## Decisions
| Topic | Decision |
|---|---|
| Target | https://www.transform9.com/ (all same-domain pages; see ROUTES.md) |
| Authority | **Live site** is authoritative. Saved snapshot (`Transform9 — Maximize Every Call with a Custom AI Agent.html` + `_files/`) is a source of assets and a cross-check. Drift between the two is recorded in CLONE_SPEC.md. |
| Pages | **Full site on www.transform9.com** (user decision 2026-09-30, expanding the original homepage-only scope): 18 routes in 10 template families, see ROUTES.md. Pages on external domains are excluded and remain outbound links. |
| Build path | Reconstruct: React + Vite + Tailwind v3 (clone skill stack). |
| Tracking | Strip all analytics/tracking/reCAPTCHA/third-party scripts. |
| Forms | Render all states; no submission to any endpoint. |
| External links | Keep as real links (no auto-navigation, no prefetch). |
| Assets/content | Reuse original text, images, logos, fonts locally, **for private/internal use only**. No redistribution. |
| Viewports | 1440, 1024, 768, 390 px (plus intermediate widths when checking fluid sizing). |
| Agents | Background agents authorized per workflow; direct execution by main session is an authorized fallback. |
| Delivery | This folder. Local git only — no remote push, no publishing. |

## Required deliverables
1. Working clone (all 18 in-scope routes)
2. IA: `ia.json`, generated `IA.md`, `matrix.csv`, passing validation
3. `design-repo/` with tokens, contracts, schemas, validators, adversarial tests, manifest

## Process
Phase order per the revised workflow (2026-09-30): Build all in-scope pages → QA (all routes) → IA → design-repo → delivery. Code health is optional, at the end (CODE_HEALTH.md Schedule). The homepage IA committed at 486e41d predates this order and will be rebuilt in the IA phase to cover all templates.

## Open / deferred decisions
- None blocking. Any repository visibility/publishing requires a new explicit request.

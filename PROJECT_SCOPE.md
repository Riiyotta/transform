# Project Scope — Transform9 clone

Recorded 2026-09-30.

## Decisions
| Topic | Decision |
|---|---|
| Target | https://www.transform9.com/ (homepage) |
| Authority | **Live site** is authoritative. Saved snapshot (`Transform9 — Maximize Every Call with a Custom AI Agent.html` + `_files/`) is a source of assets and a cross-check. Drift between the two is recorded in CLONE_SPEC.md. |
| Pages | Homepage only (`/`). Nav/footer links to other routes (/compare, /blog, /case-studies, /book-a-demo, /hipaa, /terms-of-use, /privacy-policy) remain as links; those pages are **not** cloned. |
| Build path | Reconstruct: React + Vite + Tailwind v3 (clone skill stack). |
| Tracking | Strip all analytics/tracking/reCAPTCHA/third-party scripts. |
| Forms | Render all states; no submission to any endpoint. |
| External links | Keep as real links (no auto-navigation, no prefetch). |
| Assets/content | Reuse original text, images, logos, fonts locally, **for private/internal use only**. No redistribution. |
| Viewports | 1440, 1024, 768, 390 px (plus intermediate widths when checking fluid sizing). |
| Agents | Background agents authorized per workflow; direct execution by main session is an authorized fallback. |
| Delivery | This folder. Local git only — no remote push, no publishing. |

## Required deliverables
1. Working clone (homepage)
2. IA: `ia.json`, generated `IA.md`, `matrix.csv`, passing validation
3. `design-repo/` with tokens, contracts, schemas, validators, adversarial tests, manifest

## Open / deferred decisions
- None blocking. Any repository visibility/publishing requires a new explicit request.

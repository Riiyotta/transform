# Code health — pre-extraction audit

Audit: read-only `Explore` pass, 2026-09-30, at git d0e2be0. Findings verified by the auditor against imports, JSX/CSS usage, template-string classes, CSS `url()` and asset paths. Main-session decisions in the **Decision** column. Status is updated as cleanup lands.

| # | Location | Category | Evidence | Decision / action | Risk | Checks after | Status |
|---|---|---|---|---|---|---|---|
| 1 | `src/motion/gsap.js` vs `src/components/ui/ixMotion.js` | Duplicate logic (inconsistent) | Two CustomEase registrations; `outQuad` = bezier(.25,.46,.45,.94) in gsap.js (Navbar M15 only) vs `power1.out` in ixMotion (Testimonials, CallAlexModal). | Merge into one `src/motion/` module with a single EASE map; `outQuad` = `power1.out` (exact quad-out, matches measured samples). Move hover/group runners to `src/motion/ix2.js`. | M15 mid-frame shifts ~1–2% | motion M15/M18/M13/M16 | confirmed |
| 2 | SchedulingAgent `stackStep`/`data-depth`/`.is-stacked`; HowItWorks `activeIndex`/`data-active` + CSS | Dead code | Props never passed; rules never match or are overridden by GSAP inline styles. Only old recon state scripts write them. | Remove props/attrs/rules; update SELECTORS-A.md; mark old recon state scripts as superseded. | None with JS; no-JS render unchanged (step 0) | smoke | confirmed |
| 3 | `--color-card-tint-1..3`; hardcoded tints/green/gray in SchedulingAgent/HowItWorks JS | Duplicate values | Tokens referenced only by dead rules; JS hardcodes hex. | Keep tokens; JS reads them via `getComputedStyle(:root)` so tokens remain the single source. | None | motion M7/M9 | confirmed |
| 4 | Cta pixel grid vs TransitionPixels | Duplicate logic | Same ROWS/COLS/mix formula and ~12 identical CSS rule bodies; scoping was a builder-collision workaround. Real differences: container, noise per pixel vs per wrap, row suffix, direction. | Extract `PixelGrid` primitive + one base CSS block; three instances keep their variants and DOM order/noise count. | Pixel parity | pixel (3 transitions), motion M8 | confirmed |
| 5 | `tailwind.config.js` theme | Unused tokens / latent bug | Only `text-16`, `text-56` (name collisions with Webflow class names), `w-nav` (generates width:60px, neutralised by later rule), `underline` generated. No responsive prefixes used. | **CSS custom properties are the token system.** Tailwind kept for preflight only: trim theme to `fontFamily`/`borderColor`, add `blocklist` for `w-nav`, `underline`, `text-16`, `text-56`; verify `.text-16/.text-56` typography is fully owned by CSS. | Typography if text-16/56 not fully overridden | pixel typography, smoke | confirmed |
| 6 | Static `:hover` END-state rules in index.css / integrations / security / testimonials | Dead (overridden) | Every target gets inline rest values from GSAP on mount. | Delete; keep all `transition` rules and `.stats-block:hover { flex-basis }`. | No-JS hover only | motion hovers | confirmed |
| 7 | `.is-hidden`, `.is-on-white`, `.modal-wrap.is-open`, `.stats-block.is-active` CSS bodies | Redundant CSS | Classes added after tweens finish; used as QA hooks. | Keep JS class toggles (QA hooks); delete redundant CSS bodies except required base widths; comment as QA hooks. | No-JS only | smoke, motion QA scripts | confirmed |
| 8 | Stale "Animation owns…" / "static end state" / "observer" comments; SELECTORS.md stub rows | Misleading docs | Contradict implemented code. | Rewrite to point at the implementing file. | None | none | confirmed |
| 9 | `index.css` `.section-stub--white` | Dead code | No usage. | Delete. | None | none | confirmed |
| 10 | NavigatorAgent vs Specialties hover-tab logic; Tasking uses `w--current` | Duplicate logic | Identical hover-activate + arrow-key roving. | Extract `useHoverTabs(count)`; keep Tasking's `w--` classes (click tabs with timer — different component) but document. | Low | smoke tabs-video | confirmed |
| 11 | `motion-interactions.css` imported only by ClientLogos | Hidden coupling | Also drives Integrations marquees. | Import from Integrations too (or split per section). | Removing ClientLogos silently breaks M2 | motion M1/M2 | confirmed |
| 12 | Unused public assets: armina.webp, eye-doctors.webp, uca.svg (hidden on live); `_map.tsv` shipped; `webclip-white.png` unlinked | Unused assets | 0 references. Live has an apple-touch-icon. | Move 3 hidden logos + `_map.tsv` to `recon/assets-unused/`; add `<link rel="apple-touch-icon">` (faithful to live). | None | smoke | confirmed |
| 13 | `--ease-out-quad`, `--ease-in-out-quad` | Unused tokens | Only referenced via unused Tailwind config. | Keep as documented reference values for the motion EASE map, or delete with #5. | None | none | confirmed |
| 14 | TransitionPixels `data-row/col/index/layer` (400 attrs) | Unnecessary complexity | No readers in src/qa/recon. | Keep only `data-layer`. | DOM size only | pixel | confirmed |
| 15 | Navbar/Footer `linkProps`; `DESKTOP_QUERY` vs `MQ.desktop` | Minor duplication | Byte-identical. | Share. | None | none | confirmed |
| 16 | `window.__motion` (DEV-only); `?popup=` hook | Dev/QA code | `?popup=` ships to prod; used by QA against builds. | Intentionally retained; label `?popup=` as QA-only in code + IA (not a route/state of the product). | — | — | intentionally retained |
| 17 | `eslint-disable` comments | Noise | No eslint installed. | Remove. | None | none | confirmed |

## Correctness risks (from audit; low likelihood)
| R | Location | Risk | Action |
|---|---|---|---|
| R1 | `ixMotion.runGroups` delayed calls not killed on cleanup | Same-frame race after unmount/matchMedia exit | Track and kill delayed calls in cleanup. |
| R2 | `bindBlockHover`, M16 close button capture rest bg via getComputedStyle at mount | Hover colour sticks if pointer is over element at mount | Hard-set rest values. |
| R3 | Navbar `useNavRoll` ignores mouseleave below 992 | Rolled text can stick after resize across breakpoint | Reset y in matchMedia cleanup. |
| R4 | Lenis own rAF vs gsap.ticker | Possible 1-frame ScrollTrigger lag | Drive Lenis from gsap.ticker (standard pattern); verify M22 wheel curve unchanged. |
| R5 | Tailwind `w-nav` | Latent 60px-wide nav | Covered by #5 blocklist. |

## Schedule (user-directed restructure, 2026-09-30)
The user asked to move cleanup to the end or remove what isn't necessary. This departs from the workflow's "cleanup before extraction" gate; the reasoning is recorded here.

**Source frozen for IA + design-repo extraction at git `c223e50`** (no cleanup applied).

| Group | Items | Handling |
|---|---|---|
| Would mislead extraction | #1, #3, #4, #5 | No code change. The design-repo records the canonical model: one ease map (`outQuad` = `power1.out`; the Navbar M15 bezier is an equivalent CSS approximation, which measured within one frame of live); one `PixelGrid` contract with three variants; CSS custom properties as the token system (Tailwind = preflight only); tint/green/gray colours owned by tokens. Each is listed in the design-repo as a known implementation duplication, citing this file. |
| Small correctness risks | R1, R2, R3, #9, #11, #12 (apple-touch-icon link), #17 | Deferred to the very end, optional, main session. If applied: rerun smoke/edges/motion spot checks, then refresh any affected design-repo citations. |
| Tidy-up only | #2, #6, #7, #8, #10, #13, #14, #15, R4 | Dropped. Rewriting QA-passed code risks regressions with no benefit to the deliverables. The extractor is told to treat stale comments (#8) and dead hooks (#2, #7) as non-authoritative. |

The two cleanup agents dispatched at c223e50 were stopped before editing any source.

## Added during full-site build
| # | Location | Category | Evidence | Decision | Status |
|---|---|---|---|---|---|
| 18 | `src/pages/ComparePage.jsx` no-op `gsap.ticker` listener | Page-local workaround | GSAP's ticker sleeps when no GSAP tween runs (clone marquees are CSS; live's run on GSAP), so the first hover frame starts one frame late. Homepage M14 has the same one-frame wake-up (within measured tolerance). | Candidate to move into global motion setup together with R4 (drive Lenis from `gsap.ticker`), which keeps the ticker awake on every page. Deferred with R4. | deferred |

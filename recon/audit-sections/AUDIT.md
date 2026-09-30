# Pixel audit — sections testimonials → CTA (+ nav on white)

Transcribed by the main session from the pixel-audit agent's report (2026-09-30); the agent's rules prevented it from writing this file. Raw evidence is in this folder (tools/, *.json, diff-*.txt, before/, after/).

- **Method:** Playwright Chromium DPR 1, fonts awaited, marquees frozen, video paused, full scroll for lazy images. Element-level diff of 36 computed props + rect across 13 section roots, 7,314 live elements at 1440/1200/1024/768/600/390; screenshot diffs (>40/255 mask); state checks at 1440/1024/768/390.
- **Result after fixes:** 0 geometry/computed mismatches in default state at all six widths; section tops/heights Δ0.0; state screenshot diffs 0.00–0.14%.

## Defects fixed
| # | Section | Defect | Before → after | File |
|---|---|---|---|---|
| 1 | CTA | black-to-img pixel grid in start state (opacity 1) painted a black band over the image | CTA-top diff 1440 21.5% → 2.0% (remainder = live mid-scrub), 390 14.5% → 0.8% | styles/cta.css, Cta.jsx (comment) |
| 2 | How it works | position static vs live relative | static → relative | styles/how-it-works.css |
| 3 | Integrations | max-width:100% on div blocks (live: only on `a` blocks via .w-inline-block) | 100% → none on divs | styles/integrations.css |

## Adjudicated (no change)
- `.white-section` position:static — live is also static; gray tint only in Playwright full-page captures.
- U+2028 after "decrease in call abandonment" — present on live; widths match.
- Testimonial slider grid stacking — only hidden slide's x differs; visible diff ≤0.06%.
- `.testim-point` 14px at ≤767 — matches live.

## Remaining (motion / out of scope)
HIW step offsets and highlight, scheduling scrub, tasking progress + auto-rotate, pixel transitions mid-scrub, marquee positions. Live sometimes leaves two HIW words green after a programmatic jump — treat as a live artifact; follow the spec trace.
Nav logo/menu-btn inherited color/font-size differences with no rendering effect (pilot-owned).

## Not checked
Hover/state at 1200 and 600; focus rings (added afterwards as D7); intermediate scrub positions; slide cross-fade timing.

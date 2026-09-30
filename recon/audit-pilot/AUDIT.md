# Pixel audit: Transform9 PILOT slice

Date: 2026-09-30. Clone http://127.0.0.1:5179 (base rev 42717e8, plus the edits below). Reference: live https://www.transform9.com/.
Method: Playwright 1.63 Chromium headless, DPR 1, `document.fonts.ready` awaited. Viewports 1440×900, 1200×900, 1024×900, 768×1024, 600×900, 390×844. For static captures the marquee transforms were forced to `none` and the video was paused at t=0.
Harness: `recon/audit-pilot/tools/measure.mjs` (live|clone) and `diff.mjs`. Raw data is in `tools/live.json`, `tools/clone-before.json` and `tools/clone-after.json`. The diff compares ~95 element keys per width: document rect (footer rects are relative to `section.footer` / `.footer-bottom-wrap`), plus font-size, line-height, color, background, padding, margin, borders, box-shadow, backdrop-filter, opacity, transform, flex props, overflow and white-space. Geometry tolerance is 1px.
States measured: default; desktop stats hover (block 2); desktop nav-link hover; footer at page bottom (sticky reveal); mobile menu open (768/600/390); popup default, error and success (live: by clicking "Call Alex" and un-hiding `.w-form-fail` / `.w-form-done`; clone: click plus `?popup=error|success`); hover and focus end states (CTA, Call Alex underline, footer link underline, legal links, close button, submit underline, hero/popup input focus); keyboard Tab order and outline.
Screenshots: `before/` and `after/` hold `{live,clone}-{w}-{top,bottom,footer-top,menu,modal,modal-error,modal-success,stats,stats-hover}.png`, plus `*-1440-spotlight.png`.

## Checkpoint 1: font, type scale, left rail (1440 and 390)
- Font: `Polysans Neutral` loads on both at every width (`document.fonts.check` true). The clone's local woff2 produces identical glyph advances: every text box width matches live within 0.1px (hero H1 1198.1×189.1 @1440, 287.5×201.7 @390; nav link widths 77.5/68.3/124.5/89.5).
- Type scale: all computed sizes and line-heights are identical at all six widths, including hero 93.6/94.536 @1440, 78/78.78 @1200, 49.92/50.42 @390; 30-text 29.9952/35.9942; 56-text 56.0016; 16-text 16/22.4; popup head 56/56; 49.92 @390.
- Left rail: stats-left, footer-top-left and stats-block x are identical (385 @1440, 273.8 @1024, 205.3 @768). The rail collapses to full width at ≤767 on both.

## Summary
Before this pass the builder's slice already matched live within 1px on every measured element and state at all six widths, except for the 3 defects below (plus one class-name collision). After the fixes, `diff.mjs` reports **0 geometry or computed-style mismatches** for every measured element and state, apart from the documented deviations. Default-state screenshot pixel diff (threshold 40/255) is **0.00%** for top-of-page at all widths, 0.00% for mobile menu open (was 0.66–1.11%) and 0.00% for stats at 768/600/390.

## Defects found and fixed
| # | Section / viewport | Defect (measured) | Before (clone) | After / live | Fix (file) |
|---|---|---|---|---|---|
| 1 | Mobile menu open, 768/600/390 | Open-menu link text colour. Live IX2 a-28 sets `.nav-link-block` color → `--white` on open (a-30 never reverts it). The spec missed this. | Compare/Blog/Case Studies/Careers/Login `rgba(255,255,255,.7)` | `rgb(255,255,255)`; the CTA label stays `#020801` via `.cta` | `src/index.css` (≤991 block: `.nav-menu.is-open .nav-link-block{color:var(--color-white)}`) |
| 2 | Popup ≤767 (600, 390) | `.popup-bottom-wrap` was nested inside `.call-form-bottom`, which at ≤767 is a flex column with gap 16. On live it is a sibling (child of `form.call-form`). | bottom row y 821.8 / submit y 923.8 @390 (819 / 921 @600) | 805.8 / 907.8 @390 (803 / 905 @600): Δ16 → 0 | `src/components/CallAlexModal.jsx` (moved the element out) |
| 3 | Shared underline pair, all widths | Webflow class `.underline` collides with Tailwind's generated `underline` utility, giving the bar divs `text-decoration-line: underline` (live: none). No pixels now, but a latent hazard for any text inside. | `underline` | `none` | `src/index.css` (`.underline{text-decoration-line:none}`) |
| 4 | Mobile menu open | `text-align` on the open menu: live `center` (Webflow `[data-nav-menu-open]`), clone `start`. No visual effect (flex links); changed for computed parity. | start | center | `src/index.css` (`.nav-menu.is-open .nav-links`) |

## Builder deviations adjudicated
| Item | Verdict | Evidence (live = clone) |
|---|---|---|
| (a) nav ~87px tall at 480–767 | **Confirmed correct** | @600 nav 600×87.8 on both. It is 60 at 768 and at 390. |
| (b) menu bottom inset 80 at ≤479 | **Confirmed correct** | @390 `.nav-links-left` 0,60 390×704 (bottom inset 80) and `.nav-links-right` y784 h60 on both. @600/768 the right bar is 80 tall. |
| (c) footer logo hidden only at ≤479 | **Confirmed correct; CLONE_SPEC §17b is wrong** ("hidden at ≤767") | Live logo is displayed at 768 (728×123.8) and 600 (560×95.2) and `display:none` at 390. The clone matches. |
| (d) `.nav-text-wrap` overflow hidden | **Confirmed** | Computed `overflow:hidden` on live, 57.5×19.6 @1440 |
| (e) empty 304×78 captcha spacer | **Keep** | Live `.captcha-popup` is 304×78 at the same x/y at every width. The popup window is 566×703.8 @1440 on both. The only pixel diff is the reCAPTCHA widget artwork (stripped by policy). |
| (f) stats tablet pre-JS state | **Matches live post-JS** | @768 blocks 393.9/56.3/56.3/56.3 ×400; @600 and @390 600|390×260 then 62.4 ×3, identical to live |

## Per-section × viewport measurements (after fixes)
Format: `x,y w×h · font-size/line-height · color`. `ft.*` y is relative to `section.footer` top and `fb.*` to `.footer-bottom-wrap` top. `m.*` values are viewport coords in popup default state.

#### 1440
| element | live | clone |
|---|---|---|
| nav | 0,0 1440×60 · 14px/19.6px · (2, 8, 1) | 0,0 1440×60 · 14px/19.6px · (2, 8, 1) |
| nav.link#0 | 175.6,0 77.5×60 · 14px/19.6px · (255, 255, 255, 0.7) | 175.6,0 77.5×60 · 14px/19.6px · (255, 255, 255, 0.7) |
| hero.h1 | 76,230 1198.1×189.1 · 93.6px/94.536px · (255, 255, 255) | 76,230 1198.1×189.1 · 93.6px/94.536px · (255, 255, 255) |
| hero.p | 36,719 556.6×144 · 29.9952px/35.9942px · (255, 255, 255) | 36,719 556.6×144 · 29.9952px/35.9942px · (255, 255, 255) |
| hero.labelR | 799,632.6 605×22.4 · 16px/22.4px · (255, 255, 255) | 799,632.6 605×22.4 · 16px/22.4px · (255, 255, 255) |
| hero.input | 756,803 314.7×60 · 18px/25.7143px · (51, 51, 51) | 756,803 314.7×60 · 18px/25.7143px · (51, 51, 51) |
| hero.ctaText | 1183.1,803 220.9×56 · 56.0016px/56.0016px · (255, 255, 255) | 1183.1,803 220.9×56 · 56.0016px/56.0016px · (255, 255, 255) |
| logos | 0,900 1440×270 · 14px/19.6px · (2, 8, 1) | 0,900 1440×270 · 14px/19.6px · (2, 8, 1) |
| logos.logo0 | 60,1010 110.7×50 · 14px/19.6px · (2, 8, 1) | 60,1010 110.7×50 · 14px/19.6px · (2, 8, 1) |
| spot.h2 | 76,1290 1198.1×189.1 · 93.6px/94.536px · (255, 255, 255) | 76,1290 1198.1×189.1 · 93.6px/94.536px · (255, 255, 255) |
| stats | 0,2270 1440×600 · 14px/19.6px · (2, 8, 1) | 0,2270 1440×600 · 14px/19.6px · (2, 8, 1) |
| stats.text | 36,2306 313×224 · 56.0016px/56.0016px · (2, 8, 1) | 36,2306 313×224 · 56.0016px/56.0016px · (2, 8, 1) |
| stats.block#0 | 385,2270 263.8×600 · 14px/19.6px · (2, 8, 1) | 385,2270 263.8×600 · 14px/19.6px · (2, 8, 1) |
| stats.block#1 hover | 515.3,2270 664.1×600 · 14px/19.6px · (2, 8, 1) | 515.3,2270 664.1×600 · 14px/19.6px · (2, 8, 1) |
| ft (h) | 0,0 1440×750.1 · 14px/19.6px · (2, 8, 1) | 0,0 1440×750.1 · 14px/19.6px · (2, 8, 1) |
| ft.blurb | 36,267 250.9×58.8 · 14px/19.6px · (255, 255, 255) | 36,267 250.9×58.8 · 14px/19.6px · (255, 255, 255) |
| ft.phone | 78,631.1 294.9×45 · 29.9952px/35.9942px · (255, 255, 255) | 78,631.2 294.9×45 · 29.9952px/35.9942px · (255, 255, 255) |
| fb | 0,0 1440×365.1 · 14px/19.6px · (2, 8, 1) | 0,0 1440×365.1 · 14px/19.6px · (2, 8, 1) |
| fb.logo | 36,36 1368×232.5 · 14px/19.6px · (2, 8, 1) | 36,36 1368×232.5 · 14px/19.6px · (2, 8, 1) |
| m.win | 437,98.1 566×703.8 · 14px/19.6px · (2, 8, 1) | 437,98.1 566×703.8 · 14px/19.6px · (2, 8, 1) |
| m.head | 474,241.1 358.6×112 · 56px/56px · (255, 255, 255) | 474,241.1 358.6×112 · 56px/56px · (255, 255, 255) |
| m.input#0 | 474,433.7 228×43 · 18px/25.7143px · (255, 255, 255) | 474,433.7 228×43 · 18px/25.7143px · (255, 255, 255) |
| m.bottom | 474,686.9 492×114 · 14px/19.6px · (2, 8, 1) | 474,686.9 492×114 · 14px/19.6px · (2, 8, 1) |

#### 1200
| element | live | clone |
|---|---|---|
| nav | 0,0 1200×60 · 14px/19.6px · (2, 8, 1) | 0,0 1200×60 · 14px/19.6px · (2, 8, 1) |
| nav.link#0 | 171.4,0 77.5×60 · 14px/19.6px · (255, 255, 255, 0.7) | 171.4,0 77.5×60 · 14px/19.6px · (255, 255, 255, 0.7) |
| hero.h1 | 76,230 998.4×157.6 · 78px/78.78px · (255, 255, 255) | 76,230 998.4×157.6 · 78px/78.78px · (255, 255, 255) |
| hero.p | 36,743 463.8×120 · 24.996px/29.9952px · (255, 255, 255) | 36,743 463.8×120 · 24.996px/29.9952px · (255, 255, 255) |
| hero.labelR | 679,636 485×22.4 · 16px/22.4px · (255, 255, 255) | 679,636 485×22.4 · 16px/22.4px · (255, 255, 255) |
| hero.input | 636,813 246×50 · 15px/21.4286px · (51, 51, 51) | 636,813 246×50 · 15px/21.4286px · (51, 51, 51) |
| hero.ctaText | 980,813 184×46.7 · 46.668px/46.668px · (255, 255, 255) | 980,813 184×46.7 · 46.668px/46.668px · (255, 255, 255) |
| logos | 0,900 1200×261.7 · 14px/19.6px · (2, 8, 1) | 0,900 1200×261.7 · 14px/19.6px · (2, 8, 1) |
| logos.logo0 | 60,1010 92.3×41.7 · 14px/19.6px · (2, 8, 1) | 60,1010 92.3×41.7 · 14px/19.6px · (2, 8, 1) |
| spot.h2 | 76,1281.7 998.4×157.6 · 78px/78.78px · (255, 255, 255) | 76,1281.7 998.4×157.6 · 78px/78.78px · (255, 255, 255) |
| stats | 0,2108.8 1200×500 · 14px/19.6px · (2, 8, 1) | 0,2108.8 1200×500 · 14px/19.6px · (2, 8, 1) |
| stats.text | 36,2144.8 248.8×186.7 · 46.668px/46.668px · (2, 8, 1) | 36,2144.8 248.8×186.7 · 46.668px/46.668px · (2, 8, 1) |
| stats.block#0 | 320.8,2108.8 219.8×500 · 14px/19.6px · (2, 8, 1) | 320.8,2108.8 219.8×500 · 14px/19.6px · (2, 8, 1) |
| stats.block#1 hover | 432.9,2108.8 543×500 · 14px/19.6px · (2, 8, 1) | 432.9,2108.8 543×500 · 14px/19.6px · (2, 8, 1) |
| ft (h) | 0,0 1200×711.8 · 14px/19.6px · (2, 8, 1) | 0,0 1200×711.8 · 14px/19.6px · (2, 8, 1) |
| ft.blurb | 36,228.6 248.8×58.8 · 14px/19.6px · (255, 255, 255) | 36,228.7 248.8×58.8 · 14px/19.6px · (255, 255, 255) |
| ft.phone | 78,604.8 245.7×39 · 24.996px/29.9952px · (255, 255, 255) | 78,604.8 245.7×39 · 24.996px/29.9952px · (255, 255, 255) |
| fb | 0,0 1200×324.3 · 14px/19.6px · (2, 8, 1) | 0,0 1200×324.3 · 14px/19.6px · (2, 8, 1) |
| fb.logo | 36,36 1128×191.8 · 14px/19.6px · (2, 8, 1) | 36,36 1128×191.8 · 14px/19.6px · (2, 8, 1) |
| m.win | 317,103.5 566×693 · 14px/19.6px · (2, 8, 1) | 317,103.5 566×693 · 14px/19.6px · (2, 8, 1) |
| m.head | 354,241.2 358.6×112 · 56px/56px · (255, 255, 255) | 354,241.2 358.6×112 · 56px/56px · (255, 255, 255) |
| m.input#0 | 354,432.3 228×43 · 18px/25.7143px · (255, 255, 255) | 354,432.3 228×43 · 18px/25.7143px · (255, 255, 255) |
| m.bottom | 354,681.5 492×114 · 14px/19.6px · (2, 8, 1) | 354,681.5 492×114 · 14px/19.6px · (2, 8, 1) |

#### 1024
| element | live | clone |
|---|---|---|
| nav | 0,0 1024×60 · 14px/19.6px · (2, 8, 1) | 0,0 1024×60 · 14px/19.6px · (2, 8, 1) |
| nav.link#0 | 167.3,0 77.5×60 · 14px/19.6px · (255, 255, 255, 0.7) | 167.3,0 77.5×60 · 14px/19.6px · (255, 255, 255, 0.7) |
| hero.h1 | 76,230 829×134.4 · 66.56px/67.2256px · (255, 255, 255) | 76,230 829×134.4 · 66.56px/67.2256px · (255, 255, 255) |
| hero.p | 36,760.6 395.7×102.4 · 21.3299px/25.5959px · (255, 255, 255) | 36,760.6 395.7×102.4 · 21.3299px/25.5959px · (255, 255, 255) |
| hero.labelR | 591,636 397×22.4 · 16px/22.4px · (255, 255, 255) | 591,636 397×22.4 · 16px/22.4px · (255, 255, 255) |
| hero.input | 548,820.3 195.5×42.7 · 12.8px/18.2857px · (51, 51, 51) | 548,820.3 195.5×42.7 · 12.8px/18.2857px · (51, 51, 51) |
| hero.ctaText | 830.9,820.3 157.1×39.8 · 39.8234px/39.8234px · (255, 255, 255) | 830.9,820.3 157.1×39.8 · 39.8234px/39.8234px · (255, 255, 255) |
| logos | 0,900 1024×255.5 · 14px/19.6px · (2, 8, 1) | 0,900 1024×255.5 · 14px/19.6px · (2, 8, 1) |
| logos.logo0 | 60,1010 78.7×35.5 · 14px/19.6px · (2, 8, 1) | 60,1010 78.7×35.5 · 14px/19.6px · (2, 8, 1) |
| spot.h2 | 76,1275.5 829×134.4 · 66.56px/67.2256px · (255, 255, 255) | 76,1275.5 829×134.4 · 66.56px/67.2256px · (255, 255, 255) |
| stats | 0,1990.7 1024×426.7 · 14px/19.6px · (2, 8, 1) | 0,1990.7 1024×426.7 · 14px/19.6px · (2, 8, 1) |
| stats.text | 36,2026.7 201.8×159.3 · 39.8234px/39.8234px · (2, 8, 1) | 36,2026.7 201.8×159.3 · 39.8234px/39.8234px · (2, 8, 1) |
| stats.block#0 | 273.8,1990.7 187.5×426.7 · 14px/19.6px · (2, 8, 1) | 273.8,1990.7 187.5×426.7 · 14px/19.6px · (2, 8, 1) |
| stats.block#1 hover | 372.8,1990.7 453.2×426.7 · 14px/19.6px · (2, 8, 1) | 372.8,1990.7 453.2×426.7 · 14px/19.6px · (2, 8, 1) |
| ft (h) | 0,0 1024×683.7 · 14px/19.6px · (2, 8, 1) | 0,0 1024×683.7 · 14px/19.6px · (2, 8, 1) |
| ft.blurb | 36,200.5 201.8×78.4 · 14px/19.6px · (255, 255, 255) | 36,200.5 201.8×78.4 · 14px/19.6px · (255, 255, 255) |
| ft.phone | 78,585.5 209.6×34.6 · 21.3299px/25.5959px · (255, 255, 255) | 78,585.5 209.6×34.6 · 21.3299px/25.5959px · (255, 255, 255) |
| fb | 0,0 1024×294.4 · 14px/19.6px · (2, 8, 1) | 0,0 1024×294.4 · 14px/19.6px · (2, 8, 1) |
| fb.logo | 36,36 952×161.8 · 14px/19.6px · (2, 8, 1) | 36,36 952×161.8 · 14px/19.6px · (2, 8, 1) |
| m.win | 229,103.5 566×693 · 14px/19.6px · (2, 8, 1) | 229,103.5 566×693 · 14px/19.6px · (2, 8, 1) |
| m.head | 266,238.5 358.6×112 · 56px/56px · (255, 255, 255) | 266,238.5 358.6×112 · 56px/56px · (255, 255, 255) |
| m.input#0 | 266,435.3 228×43 · 18px/25.7143px · (255, 255, 255) | 266,435.3 228×43 · 18px/25.7143px · (255, 255, 255) |
| m.bottom | 266,681.5 492×114 · 14px/19.6px · (2, 8, 1) | 266,681.5 492×114 · 14px/19.6px · (2, 8, 1) |

#### 768
| element | live | clone |
|---|---|---|
| nav | 0,0 768×60 · 14px/19.6px · (2, 8, 1) | 0,0 768×60 · 14px/19.6px · (2, 8, 1) |
| nav.link#0 | 0,0 0×0 · 48px/67.2px · (255, 255, 255, 0.7) | 0,0 0×0 · 48px/67.2px · (255, 255, 255, 0.7) |
| hero.h1 | 47,230 602×227.3 · 75px/75.75px · (255, 255, 255) | 47,230 602×227.3 · 75px/75.75px · (255, 255, 255) |
| hero.p | 20,885.9 334.1×86.4 · 18px/21.6px · (255, 255, 255) | 20,885.9 334.1×86.4 · 18px/21.6px · (255, 255, 255) |
| hero.labelR | 447,713.3 301×19.6 · 14px/19.6px · (255, 255, 255) | 447,713.3 301×19.6 · 14px/19.6px · (255, 255, 255) |
| hero.input | 404,922.3 193.7×50 · 14px/20px · (51, 51, 51) | 404,922.3 193.7×50 · 14px/20px · (51, 51, 51) |
| hero.ctaText | 629.7,940.8 118.3×30 · 30px/30px · (255, 255, 255) | 629.7,940.8 118.3×30 · 30px/30px · (255, 255, 255) |
| logos | 0,1024 768×210 · 14px/19.6px · (2, 8, 1) | 0,1024 768×210 · 14px/19.6px · (2, 8, 1) |
| logos.logo0 | 60,1104 110.8×50 · 14px/19.6px · (2, 8, 1) | 60,1104 110.8×50 · 14px/19.6px · (2, 8, 1) |
| spot.h2 | 47,1354 602×227.3 · 75px/75.75px · (255, 255, 255) | 47,1354 602×227.3 · 75px/75.75px · (255, 255, 255) |
| stats | 0,2032.5 768×400 · 14px/19.6px · (2, 8, 1) | 0,2032.5 768×400 · 14px/19.6px · (2, 8, 1) |
| stats.text | 20,2052.5 165.3×120 · 30px/30px · (2, 8, 1) | 20,2052.5 165.3×120 · 30px/30px · (2, 8, 1) |
| stats.block#0 | 205.3,2032.5 393.9×400 · 14px/19.6px · (2, 8, 1) | 205.3,2032.5 393.9×400 · 14px/19.6px · (2, 8, 1) |
| ft (h) | 0,0 768×713.3 · 14px/19.6px · (2, 8, 1) | 0,0 768×713.3 · 14px/19.6px · (2, 8, 1) |
| ft.blurb | 20,205.9 165.3×98 · 14px/19.6px · (255, 255, 255) | 20,205.9 165.3×98 · 14px/19.6px · (255, 255, 255) |
| ft.phone | 62,639 177×30.6 · 18px/21.6px · (255, 255, 255) | 62,639 177×30.6 · 18px/21.6px · (255, 255, 255) |
| fb | 0,0 768×280.3 · 14px/19.6px · (2, 8, 1) | 0,0 768×280.3 · 14px/19.6px · (2, 8, 1) |
| fb.logo | 20,36 728×123.8 · 14px/19.6px · (2, 8, 1) | 20,36 728×123.8 · 14px/19.6px · (2, 8, 1) |
| menu linksLeft | 0,60 768×884 · 14px/19.6px · (2, 8, 1) | 0,60 768×884 · 14px/19.6px · (2, 8, 1) |
| menu link#0 | 0,346.4 768×125.2 · 48px/67.2px · (255, 255, 255) | 0,346.4 768×125.2 · 48px/67.2px · (255, 255, 255) |
| m.win | 101,160.5 566×703.1 · 14px/19.6px · (2, 8, 1) | 101,160.5 566×703.1 · 14px/19.6px · (2, 8, 1) |
| m.head | 122,263.5 358.6×112 · 56px/56px · (255, 255, 255) | 122,263.5 358.6×112 · 56px/56px · (255, 255, 255) |
| m.input#0 | 122,529.9 244×43 · 18px/25.7143px · (255, 255, 255) | 122,529.9 244×43 · 18px/25.7143px · (255, 255, 255) |
| m.bottom | 122,764.6 524×98 · 14px/19.6px · (2, 8, 1) | 122,764.6 524×98 · 14px/19.6px · (2, 8, 1) |

#### 600
| element | live | clone |
|---|---|---|
| nav | 0,0 600×87.8 · 14px/19.6px · (2, 8, 1) | 0,0 600×87.8 · 14px/19.6px · (2, 8, 1) |
| nav.link#0 | 0,0 0×0 · 37.5px/52.5px · (255, 255, 255, 0.7) | 0,0 0×0 · 37.5px/52.5px · (255, 255, 255, 0.7) |
| hero.h1 | 30,230 451×310.3 · 76.8px/77.568px · (255, 255, 255) | 30,230 451×310.3 · 76.8px/77.568px · (255, 255, 255) |
| hero.p | 20,1184.1 445.4×115.2 · 24px/28.8px · (255, 255, 255) | 20,1184.1 445.4×115.2 · 24px/28.8px · (255, 255, 255) |
| hero.labelR | 63,620.3 517×22.4 · 16px/22.4px · (255, 255, 255) | 63,620.3 517×22.4 · 16px/22.4px · (255, 255, 255) |
| hero.input | 20,817.1 560×60 · 16px/22.8571px · (51, 51, 51) | 20,817.1 560×60 · 16px/22.8571px · (51, 51, 51) |
| hero.ctaText | 461.7,909.1 118.3×30 · 30px/30px · (255, 255, 255) | 461.7,909.1 118.3×30 · 30px/30px · (255, 255, 255) |
| logos | 0,1401.3 600×210 · 14px/19.6px · (2, 8, 1) | 0,1401.3 600×210 · 14px/19.6px · (2, 8, 1) |
| logos.logo0 | 60,1481.3 110.8×50 · 14px/19.6px · (2, 8, 1) | 60,1481.3 110.8×50 · 14px/19.6px · (2, 8, 1) |
| spot.h2 | 30,1731.3 451×387.8 · 76.8px/77.568px · (255, 255, 255) | 30,1731.3 451×387.8 · 76.8px/77.568px · (255, 255, 255) |
| stats | 0,2536.4 600×826.4 · 14px/19.6px · (2, 8, 1) | 0,2536.4 600×826.4 · 14px/19.6px · (2, 8, 1) |
| stats.text | 20,2556.4 389×243.2 · 60.798px/60.798px · (2, 8, 1) | 20,2556.4 389×243.2 · 60.798px/60.798px · (2, 8, 1) |
| stats.block#0 | 0,2915.6 600×260 · 14px/19.6px · (2, 8, 1) | 0,2915.6 600×260 · 14px/19.6px · (2, 8, 1) |
| ft (h) | 0,0 600×1012.3 · 14px/19.6px · (2, 8, 1) | 0,0 600×1012.3 · 14px/19.6px · (2, 8, 1) |
| ft.blurb | 20,169 286.7×67.2 · 16px/22.4px · (255, 255, 255) | 20,169 286.7×67.2 · 16px/22.4px · (255, 255, 255) |
| ft.phone | 62,691.3 236×37.8 · 24px/28.8px · (255, 255, 255) | 62,691.3 236×37.8 · 24px/28.8px · (255, 255, 255) |
| fb | 0,0 600×289 · 14px/19.6px · (2, 8, 1) | 0,0 600×289 · 14px/19.6px · (2, 8, 1) |
| fb.logo | 20,36 560×95.2 · 14px/19.6px · (2, 8, 1) | 20,36 560×95.2 · 14px/19.6px · (2, 8, 1) |
| menu linksLeft | 0,60 600×760 · 14px/19.6px · (2, 8, 1) | 0,60 600×760 · 14px/19.6px · (2, 8, 1) |
| menu link#0 | 0,303 600×110.5 · 37.5px/52.5px · (255, 255, 255) | 0,303 600×110.5 · 37.5px/52.5px · (255, 255, 255) |
| m.win | 0,0 600×900 · 14px/19.6px · (2, 8, 1) | 0,0 600×900 · 14px/19.6px · (2, 8, 1) |
| m.head | 20,102 358.6×112 · 56px/56px · (255, 255, 255) | 20,102 358.6×112 · 56px/56px · (255, 255, 255) |
| m.input#0 | 20,365.4 560×43 · 18px/25.7143px · (255, 255, 255) | 20,365.4 560×43 · 18px/25.7143px · (255, 255, 255) |
| m.bottom | 20,803 560×158 · 14px/19.6px · (2, 8, 1) | 20,803 560×158 · 14px/19.6px · (2, 8, 1) |

#### 390
| element | live | clone |
|---|---|---|
| nav | 0,0 390×60 · 14px/19.6px · (2, 8, 1) | 0,0 390×60 · 14px/19.6px · (2, 8, 1) |
| nav.link#0 | 0,0 0×0 · 24.375px/34.125px · (255, 255, 255, 0.7) | 0,0 0×0 · 24.375px/34.125px · (255, 255, 255, 0.7) |
| hero.h1 | 34,86 287.5×201.7 · 49.92px/50.4192px · (255, 255, 255) | 34,86 287.5×201.7 · 49.92px/50.4192px · (255, 255, 255) |
| hero.p | 20,873 312×117 · 19.5px/23.4px · (255, 255, 255) | 20,873 312×117 · 19.5px/23.4px · (255, 255, 255) |
| hero.labelR | 20,403 350×22.4 · 16px/22.4px · (255, 255, 255) | 20,403 350×22.4 · 16px/22.4px · (255, 255, 255) |
| hero.input | 20,500.2 350×60 · 16px/22.8571px · (51, 51, 51) | 20,500.2 350×60 · 16px/22.8571px · (51, 51, 51) |
| hero.ctaText | 251.7,592.2 118.3×30 · 30px/30px · (255, 255, 255) | 251.7,592.2 118.3×30 · 30px/30px · (255, 255, 255) |
| logos | 0,1117 390×210 · 14px/19.6px · (2, 8, 1) | 0,1117 390×210 · 14px/19.6px · (2, 8, 1) |
| logos.logo0 | 60,1197 110.8×50 · 14px/19.6px · (2, 8, 1) | 60,1197 110.8×50 · 14px/19.6px · (2, 8, 1) |
| spot.h2 | 34,1352.3 287.5×252.1 · 49.92px/50.4192px · (255, 255, 255) | 34,1352.3 287.5×252.1 · 49.92px/50.4192px · (255, 255, 255) |
| stats | 0,1879.6 390×782.9 · 14px/19.6px · (2, 8, 1) | 0,1879.6 390×782.9 · 14px/19.6px · (2, 8, 1) |
| stats.text | 20,1899.6 319.5×199.7 · 49.92px/49.92px · (2, 8, 1) | 20,1899.6 319.5×199.7 · 49.92px/49.92px · (2, 8, 1) |
| stats.block#0 | 0,2215.3 390×260 · 14px/19.6px · (2, 8, 1) | 0,2215.3 390×260 · 14px/19.6px · (2, 8, 1) |
| ft (h) | 0,0 390×1077.6 · 14px/19.6px · (2, 8, 1) | 0,0 390×1077.6 · 14px/19.6px · (2, 8, 1) |
| ft.blurb | 20,122.8 286.7×67.2 · 16px/22.4px · (255, 255, 255) | 20,122.8 286.7×67.2 · 16px/22.4px · (255, 255, 255) |
| ft.phone | 62,756.7 236×37.8 · 24px/28.8px · (255, 255, 255) | 62,756.6 236×37.8 · 24px/28.8px · (255, 255, 255) |
| fb | 0,0 390×188.2 · 14px/19.6px · (2, 8, 1) | 0,0 390×188.2 · 14px/19.6px · (2, 8, 1) |
| fb.logo | hidden | hidden |
| menu linksLeft | 0,60 390×704 · 14px/19.6px · (2, 8, 1) | 0,60 390×704 · 14px/19.6px · (2, 8, 1) |
| menu link#0 | 0,411.8 390×76.1 · 24.375px/34.125px · (255, 255, 255) | 0,411.8 390×76.1 · 24.375px/34.125px · (255, 255, 255) |
| m.win | 0,0 390×844 · 14px/19.6px · (2, 8, 1) | 0,0 390×844 · 14px/19.6px · (2, 8, 1) |
| m.head | 20,102 319.7×99.8 · 49.92px/49.92px · (255, 255, 255) | 20,102 319.7×99.8 · 49.92px/49.92px · (255, 255, 255) |
| m.input#0 | 20,353.2 350×43 · 18px/25.7143px · (255, 255, 255) | 20,353.2 350×43 · 18px/25.7143px · (255, 255, 255) |
| m.bottom | 20,805.8 350×169.2 · 14px/19.6px · (2, 8, 1) | 20,805.8 350×169.2 · 14px/19.6px · (2, 8, 1) |

All rows are identical within 1px (the largest delta is ft.phone y 631.1 vs 631.2 @1440). Stats hover @1440 is 130.3/664.1/130.3/130.3 on both; @1200 and @1024 it also matches. Nav link hover (−19.6px roll) matches at 1440/1200/1024.

Hover/focus end states (1440, identical live = clone): nav CTA hover bg `rgb(241,243,243)`. Call Alex hover: underline _1 0 / _2 220.9, height 2.875. Footer link hover: underline-small 36.5×1, bottom 6, _1 opacity 0. Legal links hover opacity .3 → 1. Close hover bg `#fff`. Submit underline 0 → 171.8. Hero input focus border `rgb(56,152,236)`, 314.7×60, padding 0 24. Popup input focus bottom border `#fff`. Tab order and focus rings match live (`auto 1px rgb(0,95,204)`; the hero input has none on both; facade offset 0).

## Verification
- `npm run build`: passes.
- Console errors: 0 at every width and state. Non-localhost requests from the clone: 0 (the YouTube iframe is only created on click; not clicked).
- Horizontal overflow: `scrollWidth == clientWidth` at 1440/1200/1024/768/600/390, and with the menu open at 768/600/390. (Live itself overflows to 1903/2251px with the menu open at 390/768. That is a live bug and is not reproduced.)

## Remaining deviations (with reasons)
1. **Client Spotlight video facade: live renders an empty 728px gap.** On live, `figure.yt-facade` computes to **width 0** (x = 50vw, `padding-top` 727.95 @1440). The thumbnail and play button are therefore clipped and invisible, and the section is a black gap. This is the case now and in recon's `live-1440-full.png`; CLONE_SPEC §6 wrongly states 1296×728. The clone renders the intended 1296×728 facade (thumb plus 84×84 play button centred) per CLONE_SPEC §6 and the scope. Section height, heading and margins match exactly (the h2 and the following stats y are identical). **Left as-is; this needs an orchestrator decision** (match the live bug or keep the working facade). Evidence: `after/live-1440-spotlight.png` vs `after/clone-1440-spotlight.png`.
2. reCAPTCHA widget art is absent in the popup (policy: stripped). The footprint is kept, so the diff is confined to the 304×78 box.
3. Screenshot diffs of 2–6% in `footer-top`/`bottom` come from (i) the live nav's `backdrop-filter` blurring the real CTA/pixel sections behind it, which are stubs in the clone, and (ii) ≤1px sub-pixel scroll offsets because document heights differ (stubs). Element geometry relative to the footer matches within 0.1px.
4. Document height differs at ≠1440 widths because the App.jsx stubs are sized from 1440 heights (out of scope; not touched).
5. Ignored immaterial computed differences: burger/cross `img` display inline-block vs block and parent font-size 24 vs 14 inside a flex-centred 60×60 box (no geometry change); logo `img` `color`; popup logo inline-block vs block (no geometry change).

## Coverage and what was NOT checked
- Checked: everything listed above at 6 widths, in default, hover, menu, popup ×3 and footer-reveal states.
- Not checked: motion and timing (Animation's job); the on-white nav state (M4), because the white section is a stub; the YouTube iframe after click (would create an external request); the footer HubSpot replica's error/success states against the live iframe (cross-origin, not measurable in the same way); native validation bubbles; 1920px and heights other than those listed; real touch devices; Firefox/WebKit.
- The live spotlight gap was verified only in headless Chromium.

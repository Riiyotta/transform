# MOTION-3: page-load intros + /compare, /book-a-demo, legal motion

Method: Playwright (headless Chromium) on live https://www.transform9.com and the clone at http://127.0.0.1:5179, at 1440x900 and 390x844.
Intros: rAF sampling from document start (`intro.mjs`). t0 is fitted the SAME way on both sides: a first estimate from the preloader's first in-flight sample (or the pixels wrapper on /book-a-demo), then refined as the median inverse of the nav's 1.2s expo.out curve over about 20-30 samples. Values are linearly interpolated at t0 + 0/100/300/600/1000/1500/2500ms. Live t0 is the start of the IX3 load timeline (2.7-5.1s after navigation). Clone t0 is mount (D11): the timeline starts 7-11ms after the rAF sampler sees the React mount.
Hovers: `hover.mjs`, real mouse moves, colours read in rAF relative to the `mouseover` event.
Values are shown as live / clone. Tolerance is opacity ±0.06, line ±25px, word y ±1.5px.

| id | route | viewport | trigger | method | expected (live) / observed (clone) | status |
|---|---|---|---|---|---|---|
| CMP-M1 | /compare | 1440 | page load (mount, D11) | intro.mjs, shared t0 | 100ms pre 0/0.004 nav 0.025/0.009 ov 1/1 L 0/0 R 0/0 lh 0/0 lv 0/0; 300ms pre 0/0 nav 0.681/0.681 ov 1/1 L 0/0 R 0/0 lh 0/0 lv 0/0; 1000ms pre 0/0 nav 0.998/0.998 ov 1/1 L 0.904/0.904 R 0/0 lh 1358.43/1357.91 lv 0/0; 1500ms pre 0/0 nav 1/1 ov 0.198/0.192 L 0.998/0.998 R 0.897/0.9 lh 1439.63/1439.67 lv 351.251/352.104 | PASS |
| BAD-M1 | /book-a-demo | 1440 | page load (mount, D11) | intro.mjs, shared t0 | 100ms px 0.995/0.997 nav 0.023/0.025; 300ms px 1/1 nav 0.681/0.669; 1000ms px 1/1 nav 0.998/0.998; 1500ms px 1/1 nav 1/1 | PASS |
| LGL-M1 | /terms-of-use | 1440 | page load (mount, D11) | intro.mjs, shared t0 | 100ms pre 0.001/0 nav 0.037/0.009 FW 0/0 lh 0/0; 300ms pre 0/0 nav 0.665/0.686 FW 0/0 lh 0/0; 1000ms pre 0/0 nav 0.998/0.998 FW 0.9/0.902 lh 1354.45/1355.64; 1500ms pre 0/0 nav 1/1 FW 0.999/0.998 lh 1439.72/1439.7 | PASS |
| BLOG-M1..M4 | /blog | 1440 | page load (mount, D11) | intro.mjs, shared t0 | 100ms pre 0/0.003 nav 0.043/0.022 featured 0.043/0.022 list 0.043/0.022 w1o 0.051/0.027 w1y 44.836/45.997 w4y 47.27/47.27 wLy 47.27/47.27; 300ms pre 0/0 nav 0.683/0.674 featured 0.683/0.674 list 0.683/0.674 w1o 0.748/0.74 w1y 11.891/12.28 w4y 47.27/47.27 wLy 47.27/47.27; 1000ms pre 0/0 nav 0.998/0.998 featured 0.998/0.998 list 0.998/0.998 w1o 1/1 w1y 0.017/0.01 w4y 0.605/0.419 wLy 15.235/12.013; 1500ms pre 0/0 nav 1/1 featured 1/1 list 1/1 w1o 1/1 w1y 0/0 w4y 0/0 wLy 0.133/0.191 | PASS |
| BLOG-M1..M4 (CS) | /case-studies | 1440 | page load (mount, D11) | intro.mjs, shared t0 | 100ms pre 0.006/0.002 nav 0.007/0.023 list 0.007/0.023 w1y 46.873/45.995 w4y 47.27/47.27 wLy 47.27/47.27; 300ms pre 0/0 nav 0.679/0.678 list 0.679/0.678 w1y 12.059/12.106 w4y 47.27/47.27 wLy 47.27/47.27; 1000ms pre 0/0 nav 0.998/0.998 list 0.998/0.998 w1y 0.01/0.01 w4y 0.419/0.409 wLy 2.686/2.653; 1500ms pre 0/0 nav 1/1 list 1/1 w1y 0/0 w4y 0/0 wLy 0.01/0.01 | PASS |
| BLOG-M1/M2 detail | /blog/ai-voice-agents-… | 1440 | page load (mount, D11) | intro.mjs, shared t0 | 100ms pre 0.001/0 nav 0.043/0.03 header 0.043/0.03 body 0.043/0.03; 300ms pre 0/0 nav 0.682/0.681 header 0.682/0.681 body 0.682/0.681; 1000ms pre 0/0 nav 0.998/0.998 header 0.998/0.998 body 0.998/0.998; 1500ms pre 0/0 nav 1/1 header 1/1 body 1/1 | PASS |
| BLOG-M1/M2 detail (CS) | /case-studies/southern-bone-joint | 1440 | page load (mount, D11) | intro.mjs, shared t0 | 100ms pre 0/0.002 nav 0.041/0.034 header 0.041/0.034 body 0.041/0.034; 300ms pre 0/0 nav 0.679/0.685 header 0.679/0.685 body 0.679/0.685; 1000ms pre 0/0 nav 0.998/0.998 header 0.998/0.998 body 0.998/0.998; 1500ms pre 0/0 nav 1/1 header 1/1 body 1/1 | PASS |
| CMP-M1 | /compare | 390 | page load (mount, D11) | intro.mjs, shared t0 | 100ms pre 0/0.001 nav 0.007/0.011 ov 1/1 L 0/0 R 0/0 lh 0/0 lv 0/0; 300ms pre 0/0 nav 0.683/0.682 ov 1/1 L 0/0 R 0/0 lh 0/0 lv 0/0; 1000ms pre 0/0 nav 0.998/0.998 ov 1/1 L 0.904/0.905 R 0/0 lh 368.039/368.222 lv 0/0; 1500ms pre 0/0 nav 1/1 ov 0.185/0.183 L 0.998/0.998 R 0.904/0.905 lh 389.9/389.9 lv 0/0 | PASS |
| BAD-M1 | /book-a-demo | 390 | page load (mount, D11) | intro.mjs, shared t0 | 100ms px 0.995/0.998 nav 0.019/0.019; 300ms px 1/1 nav 0.68/0.68; 1000ms px 1/1 nav 0.998/0.998; 1500ms px 1/1 nav 1/1 | PASS |
| LGL-M1 | /terms-of-use | 390 | page load (mount, D11) | intro.mjs, shared t0 | 100ms pre 0.002/0.003 nav 0.023/0.033 FW 0/0 lh 0/0; 300ms pre 0/0 nav 0.682/0.682 FW 0/0 lh 0/0; 1000ms pre 0/0 nav 0.998/0.998 FW 0.905/0.904 lh 368.109/367.91; 1500ms pre 0/0 nav 1/1 FW 0.998/0.998 lh 389.9/389.9 | PASS |
| BLOG-M1..M4 | /blog | 390 | page load (mount, D11) | intro.mjs, shared t0 | 100ms pre 0.004/0.006 nav 0.014/0.027 featured 0.014/0.027 list 0.014/0.027 w1o 0.017/0.032 w1y 24.788/24.395 w4y 25.21/25.21 wLy 25.21/25.21; 300ms pre 0/0 nav 0.679/0.679 featured 0.679/0.679 list 0.679/0.679 w1o 0.745/0.745 w1y 6.429/6.423 w4y 25.21/25.21 wLy 25.21/25.21; 1000ms pre 0/0 nav 0.998/0.998 featured 0.998/0.998 list 0.998/0.998 w1o 1/1 w1y 0.002/0.002 w4y 0.219/0.22 wLy 6.409/6.425; 1500ms pre 0/0 nav 1/1 featured 1/1 list 1/1 w1o 1/1 w1y 0/0 w4y 0/0 wLy 0.071/0.073 | PASS |
| BLOG-M1..M4 (CS) | /case-studies | 390 | page load (mount, D11) | intro.mjs, shared t0 | 100ms pre 0/0.002 nav 0.003/0.023 list 0.003/0.023 w1y 25.125/24.52 w4y 25.21/25.21 wLy 25.21/25.21; 300ms pre 0/0 nav 0.68/0.683 list 0.68/0.683 w1y 6.397/6.33 w4y 25.21/25.21 wLy 25.21/25.21; 1000ms pre 0/0 nav 0.998/0.998 list 0.998/0.998 w1y 0/0.004 w4y 0.218/0.218 wLy 1.41/1.415; 1500ms pre 0/0 nav 1/1 list 1/1 w1y 0/0 w4y 0/0 wLy 0/0.005 | PASS |
| BLOG-M1/M2 detail | /blog/ai-voice-agents-… | 390 | page load (mount, D11) | intro.mjs, shared t0 | 100ms pre 0.003/0.005 nav 0.014/0.021 header 0.014/0.021 body 0.014/0.021; 300ms pre 0/0 nav 0.683/0.682 header 0.683/0.682 body 0.683/0.682; 1000ms pre 0/0 nav 0.998/0.998 header 0.998/0.998 body 0.998/0.998; 1500ms pre 0/0 nav 1/1 header 1/1 body 1/1 | PASS |
| BLOG-M1/M2 detail (CS) | /case-studies/southern-bone-joint | 390 | page load (mount, D11) | intro.mjs, shared t0 | 100ms pre 0.001/0.003 nav 0.015/0.014 header 0.015/0.014 body 0.015/0.014; 300ms pre 0/0 nav 0.684/0.683 header 0.684/0.683 body 0.684/0.683; 1000ms pre 0/0 nav 0.998/0.998 header 0.998/0.998 body 0.998/0.998; 1500ms pre 0/0 nav 1/1 header 1/1 body 1/1 | PASS |
| CMP-M1 (first frame) | /compare, /terms-of-use, /book-a-demo, /blog, /case-studies, both details | 1440 + 390 | mount | first rAF sample after React mount | live: targets hidden (anti-flicker) until t0, then from-values / clone: first painted frame = from-values (pre 1, nav 0, px 0, blocks 0, line 0, words 0 / +50% = 47.27px@1440, 25.21px@390). No settled-state flash | PASS |
| LGL-M1 / BLOG-M1..M3 | /terms-of-use, /blog | 1440 | page load, prefers-reduced-motion: reduce | intro.mjs reduce | live runs the full intro under reduce (IX3 has no guard) / clone runs it identically (intro-*-1440-reduce.json) | PASS |
| CMP-M2 in | /compare | 1440 | mouseenter .privacy-block | hover.mjs | bg: 2ms rgba(34, 34, 34, 0.133) / rgba(37, 37, 37, 0.145); 65ms rgba(151, 151, 151, 0.592) / rgba(149, 149, 149, 0.584); 149ms rgba(244, 244, 244, 0.957) / rgba(243, 243, 243, 0.953); 300ms rgb(255, 255, 255) / rgb(255, 255, 255) ; head: 2ms rgb(221, 222, 221) / rgb(218, 219, 218); 65ms rgb(106, 109, 105) / rgb(108, 111, 107); 149ms rgb(13, 19, 12) / rgb(14, 20, 13); 300ms rgb(2, 8, 1) / rgb(2, 8, 1) ; other blocks' heads stay rgb(255,255,255) on both | PASS |
| CMP-M2 out | /compare | 1440 | mouseleave | hover.mjs | bg: 2ms rgba(255, 255, 255, 0.867) / rgba(255, 255, 255, 0.855); 67ms rgba(255, 255, 255, 0.408) / rgba(255, 255, 255, 0.404); 149ms rgba(255, 255, 255, 0.043) / rgba(255, 255, 255, 0.043); 298ms rgba(255, 255, 255, 0) / rgba(255, 255, 255, 0) ; text: 2ms rgba(36, 41, 35, 0.933) / rgba(39, 44, 38, 0.93); 67ms rgba(152, 154, 151, 0.706) / rgba(152, 155, 152, 0.7); 149ms rgba(244, 244, 244, 0.52) / rgba(244, 244, 244, 0.52); 298ms rgba(255, 255, 255, 0.5) / rgba(255, 255, 255, 0.5) | PASS |
| CMP-M3 in | /compare | 1440 | mouseenter .integration-block.wh | hover.mjs | 1ms rgb(242, 254, 240) / rgb(242, 254, 240); 66ms rgb(200, 252, 188) / rgb(201, 252, 189); 150ms rgb(166, 250, 147) / rgb(166, 250, 147); 300ms rgb(162, 250, 142) / rgb(162, 250, 142) | PASS |
| CMP-M3 out | /compare | 1440 | mouseleave | hover.mjs | 1ms rgb(175, 251, 157) / rgb(175, 251, 157); 66ms rgb(217, 253, 209) / rgb(217, 253, 209); 149ms rgb(251, 255, 250) / rgb(250, 255, 249); 299ms rgb(255, 255, 255) / rgb(255, 255, 255) | PASS |
| CMP-M2 in | /compare | 390 | mouseenter .privacy-block | hover.mjs | bg: 2ms rgba(34, 34, 34, 0.133) / rgba(37, 37, 37, 0.145); 66ms rgba(151, 151, 151, 0.592) / rgba(152, 152, 152, 0.596); 149ms rgba(244, 244, 244, 0.957) / rgba(244, 244, 244, 0.957); 299ms rgb(255, 255, 255) / rgb(255, 255, 255) ; head: 2ms rgb(221, 222, 221) / rgb(218, 219, 218); 66ms rgb(106, 109, 105) / rgb(105, 108, 104); 149ms rgb(13, 19, 12) / rgb(13, 19, 12); 299ms rgb(2, 8, 1) / rgb(2, 8, 1) ; other blocks' heads stay rgb(255,255,255) on both | PASS |
| CMP-M2 out | /compare | 390 | mouseleave | hover.mjs | bg: 1ms rgba(255, 255, 255, 0.867) / rgba(255, 255, 255, 0.855); 67ms rgba(255, 255, 255, 0.408) / rgba(255, 255, 255, 0.4); 150ms rgba(255, 255, 255, 0.043) / rgba(255, 255, 255, 0.043); 300ms rgba(255, 255, 255, 0) / rgba(255, 255, 255, 0) ; text: 1ms rgba(36, 41, 35, 0.933) / rgba(39, 44, 38, 0.93); 67ms rgba(151, 154, 151, 0.706) / rgba(154, 156, 153, 0.698); 150ms rgba(244, 244, 244, 0.52) / rgba(245, 245, 244, 0.52); 300ms rgba(255, 255, 255, 0.5) / rgba(255, 255, 255, 0.5) | PASS |
| CMP-M3 in | /compare | 390 | mouseenter .integration-block.wh | hover.mjs | 1ms rgb(242, 254, 240) / rgb(242, 254, 240); 66ms rgb(200, 252, 188) / rgb(200, 252, 188); 150ms rgb(166, 250, 147) / rgb(166, 250, 147); 299ms rgb(162, 250, 142) / rgb(162, 250, 142) | PASS |
| CMP-M3 out | /compare | 390 | mouseleave | hover.mjs | 1ms rgb(175, 251, 157) / rgb(175, 251, 157); 67ms rgb(217, 253, 209) / rgb(217, 253, 209); 152ms rgb(251, 255, 250) / rgb(251, 255, 250); 300ms rgb(255, 255, 255) / rgb(255, 255, 255) | PASS |
| CMP-M4 | /compare | 1440 | click .ev-tab #3 | checks.mjs | same-frame switch: tab 3 `rgb(255, 255, 255) block`, others `none` / `rgb(255, 255, 255) block`, identical at +300ms; no transition | PASS |
| CMP-M4 | /compare | 390 | click .ev-tab #3 | checks.mjs | same-frame switch: tab 3 `rgb(255, 255, 255) block`, others `none` / `rgb(255, 255, 255) block`, identical at +300ms; no transition | PASS |
| CMP-M5 | /compare | 390 | scroll into table | checks.mjs | `.table-row.head` sticky top 60px rect.top 60 / sticky top 60px rect.top 60 (CSS) | PASS |
| BAD-M2 | /book-a-demo | 1440 | :focus .w-input | checks.mjs | rgb(204, 204, 204) 0s → rgb(56, 152, 236) 0s (instant) / rgb(204, 204, 204) 0s → rgb(56, 152, 236) 0s | PASS |
| BAD-M2 | /book-a-demo | 390 | :focus .w-input | checks.mjs | rgb(204, 204, 204) 0s → rgb(56, 152, 236) 0s (instant) / rgb(204, 204, 204) 0s → rgb(56, 152, 236) 0s | PASS |
| M3b | /compare | 1440 | scroll 30vh past `[data-section=hero]` and back | checks.mjs | wrapper opacity 1→0→1 / 1→0→1 | PASS |
| M3b | /compare | 390 | scroll 30vh past `[data-section=hero]` and back | checks.mjs | wrapper opacity 1→0→1 / 1→0→1 | PASS |
| M3b | /book-a-demo | 1440 | scroll 30vh past `[data-section=hero]` and back | checks.mjs | wrapper opacity 1→0→1 / 1→0→1 | PASS |
| M3b | /book-a-demo | 390 | scroll 30vh past `[data-section=hero]` and back | checks.mjs | wrapper opacity 1→0→1 / 1→0→1 | PASS |
| M3b | /terms-of-use | 1440 | scroll 30vh past `[data-section=hero]` and back | checks.mjs | wrapper opacity 1→0→1 / 1→0→1 | PASS |
| M3b | /terms-of-use | 390 | scroll 30vh past `[data-section=hero]` and back | checks.mjs | wrapper opacity 1→0→1 / 1→0→1 | PASS |
| M3b | /blog | 1440 | scroll 30vh past `[data-section=hero]` and back | checks.mjs | wrapper opacity 1→0→1 / 1→0→1 | PASS |
| M3b | /blog | 390 | scroll 30vh past `[data-section=hero]` and back | checks.mjs | wrapper opacity 1→0→1 / 1→0→1 | PASS |

## Measured values implemented (for Animation-QA)

These come from the IX3/IX2 data and are confirmed by the live curves above. Timeline positions are seconds from t0.

- **t-bd0be8f7** (CMP-M1 / BAD-M1 / LGL-M1), `src/motion/pageIntro.js` `eccee`:
  - `.preloader-wrap` opacity 1→0, .1s power1.out @0
  - `.bg-pixels(-wrapper)` 0→1, .08s power1.out @.02
  - `.nav-menu` 0→1, 1.2s expo.out @.1
  - `.hero-bottom-block.left` and `.full-width` 0→1, 1.2s expo.out @.6
  - `.line-hor.on-hero` width 0%→100%, 1s expo.out @.6
  - `.hero-bottom-block.right` 0→1, 1.2s expo.out @1.1
  - `.line-vert` (all on the page) height 0%→100%, 1s expo.out @1.1
  - `.bg-pixels-overlay` 1→0, .7s power1.out @1.1
- **t-04b74f4a** (BLOG-M1..M4, both indexes):
  - preloader, pixels and nav as above
  - `.hero-heading .gsap_split_word` opacity 0→1 and y 50%→0%, 1s expo.out @.1, stagger .1 (8 words on the blog, 6 on case studies)
  - `.featured-post` and `.all-blogs-section` 0→1, 1.2s expo.out @.1
  - overlay 1→0, .7s @.61 (no element on the index)
- **t-72fecfeb** (BLOG-M1/M2, both detail templates):
  - preloader, pixels and nav as above
  - `.blog-top-header` and `.post-body-section` 0→1, 1.2s expo.out @.1
  - overlay @.6 (not rendered in the clone)
- **CMP-M2** `.privacy-block`: one IX2 group, 200ms `easeOut` = cubic-bezier(0,0,.58,1), from the current value, channel-wise:
  - in: bg → rgba(255,255,255,1); `.privacy-head` and `.privacy-text` → rgba(2,8,1,1)
  - out: bg → rgba(255,255,255,0), head → #fff, text → rgba(255,255,255,.5)
  - Children are scoped to the hovered block (live measured).
- **CMP-M3** `.integration-block.wh`: 200ms easeOut, bg → rgba(162,250,142,1) in, rgba(255,255,255,1) out.
- **CMP-M4, CMP-M5, BAD-M2**: instant, CSS/state only (already implemented by Build). Verified unchanged.

## Notes

- **Timebase residuals.** The only samples outside tolerance in any run fall at the start instant of a steep curve: the terms line at exactly 600ms, and the 8th blog word at 1000ms (200ms into its expo.out). There the ±10-15ms error of the t0 fit dominates, and the sign flips between runs. Every other point agrees within ±0.02 opacity, ±1px and ±1.5px.
- **GSAP ticker.** Live's GSAP ticker never idles on /compare, because IX3 drives the marquees. The clone's marquees are CSS, so GSAP slept and CMP-M3 "in" ran one frame behind (rgb 220 vs 200 at 66ms). ComparePage now adds a no-op ticker listener while mounted; the measured curves then match. The homepage M14 has the same one-frame wake-up behaviour. That is not changed here (out of scope).
- **Detail overlay.** Live has a `.bg-pixels-overlay` on blog and case-study detail pages (BLOG-M5, black on black, invisible). The clone does not render it (PageLayers decision), so it is skipped. Counts for every other intro target are equal on live and clone.

## Homepage regression (HEAD worktree on :5197 vs working tree on :5179)

- `qa/motion-spot.mjs` M14 row:
  - HEAD pass 1: 0ms .145 / 60ms .584 / 150ms .953 / 300ms 1
  - HEAD pass 2: .130 / .490 / .953 / 1
  - new: .145 / .498 / .957 / 1 and .145 / .482 / .953 / 1
  - The 60ms point is sampling jitter present in HEAD itself; all other points are identical.
- M13, M19, M16 and M22: identical within the same jitter (`motion-spot-*.log`).
- `qa/hover-sample.mjs`: identical rows in the same jitter band. Both HEAD and new abort at the same pre-existing `scrollIntoViewIfNeeded` timeout (`hover-sample-*.log`).
- `qa/smoke.mjs`: PASS at 1440, 1024, 768 and 390 (heights 25922 / 22731 / 14430 / 17939, Δ0).
- `qa/routes.mjs` (18 routes × 4 widths): 72/72 PASS (height Δ ≤2, no overflow, 0 console errors, 0 external requests); routes.log.

## Files
- intro.mjs, compare-intro.py
- intro-{live,clone}-{1440,390}.json, intro-{live,clone}-1440-reduce.json
- hover.mjs, hover-{live,clone}-{1440,390}.json
- checks.mjs, checks-{live,clone}.json
- motion-spot-*.log, hover-sample-*.log, routes.log

# Pixel audit: /compare, /book-a-demo, /terms-of-use, /privacy-policy, /hipaa

Audit date 2026-09-30. Clone at http://127.0.0.1:5179 (project git 2c2536b) was compared with live https://www.transform9.com. Setup: Playwright Chromium headless at DPR 1, 1440×900, 1200×900, 1024×900, 768×1024, 600×900 and 390×844. For every capture the page was loaded, fonts awaited, and the live intro waited out (`.preloader-wrap` at opacity 0, then another 3.5s). Marquees were frozen (`transform:none`) and videos paused and seeked to 0. The page was scrolled through once and then returned to the top.

## Result

**No static or state defects were found. No source files were changed.** Each check below was done independently of the builders' reports, and the builders' ≤1px / exact-height claims hold.

## Method

| Check | Tool (recon/audit-pages-1/tools/) | Output |
|---|---|---|
| Full-page screenshot diff, 5 routes × 6 widths (per-channel threshold 40) | `pshots.mjs` + `../audit-sections/tools/compose.mjs` | `before/`, `before/cmp/`, `after/`, `after/cmp/` |
| Computed-style dump of every element in every page section (47 properties, including fontFamily, letter-spacing, colours, borders, radius, object-fit/position, background image, text-decoration and list-style) | `pdump.mjs` | `dumps/{live,clone-before}-<route>.json` |
| Keyed diff (text / img / input / identical class), tolerance 1px | `../audit-sections/tools/diff.mjs` | `dumps/diff-before-<route>.txt` |
| Strict DOM-order diff of every element, including unkeyed containers | `odiff.mjs` | `dumps/odiff-before-<route>.txt` |
| Interactive end states (hover, click, focus, sticky, forced form states): probe values, section dump and viewport screenshot | `pstates.mjs`, `sdiff.mjs` | `states/`, `states/shots*/cmp/` |
| Full innerText per section (raw, no normalisation), plus a no-op hover check on ev tab and table row | ad-hoc | all 15 sections raw-equal; hover causes no change on either side |

## Per page × viewport (live / clone)

"Els" is the number of dumped elements. Live has 2 more on each hero: two `display:none` `.bg-circle` divs. On /book-a-demo, live's hero has the honeypot input and the clone's does not (D9). "Max Δ" is the largest x/y/w/h difference over all visible elements paired in DOM order, excluding the marquee tracks (whose frozen phase differs) and the CTA underline DOM-order swap (see below).

| Page | W | docH | docW | H1 font-size / line-height, box | Els | Max Δ px |
|---|---|---|---|---|---|---|
| compare | 1440 | 12791 / 12791 | 1440 / 1440 | 93.60/94.5 1198.1x189.1 / 93.60/94.5 1198.1x189.1 | 1117 / 1115 | 0.0 |
| compare | 1200 | 11828 / 11828 | 1200 / 1200 | 78.00/78.8 998.4x157.6 / 78.00/78.8 998.4x157.6 | 1117 / 1115 | 0.0 |
| compare | 1024 | 11313 / 11313 | 1024 / 1024 | 66.56/67.2 829x134.4 / 66.56/67.2 829x134.4 | 1117 / 1115 | 0.0 |
| compare | 768 | 9853 / 9853 | 768 / 768 | 75.00/75.8 602x227.3 / 75.00/75.8 602x227.3 | 1117 / 1115 | 0.0 |
| compare | 600 | 13866 / 13866 | 600 / 600 | 76.80/77.6 451x387.8 / 76.80/77.6 451x387.8 | 1117 / 1115 | 0.0 |
| compare | 390 | 12625 / 12625 | 390 / 390 | 49.92/50.4 346x151.3 / 49.92/50.4 346x151.3 | 1117 / 1115 | 0.0 |
| book-a-demo | 1440 | 1265 / 1265 | 1440 / 1440 | 93.60/94.5 613.3x378.1 / 93.60/94.5 613.3x378.1 | 24 / 23 | 0.0 |
| book-a-demo | 1200 | 1224 / 1224 | 1200 / 1200 | 78.00/78.8 493.2x315.1 / 78.00/78.8 493.2x315.1 | 24 / 23 | 0.0 |
| book-a-demo | 1024 | 1194 / 1194 | 1024 / 1024 | 66.56/67.2 405.1x268.9 / 66.56/67.2 405.1x268.9 | 24 / 23 | 0.0 |
| book-a-demo | 768 | 1468 / 1468 | 768 / 768 | 75.00/75.8 672x227.3 / 75.00/75.8 672x227.3 | 24 / 23 | 0.0 |
| book-a-demo | 600 | 1584 / 1584 | 600 / 600 | 76.80/77.6 540.7x310.3 / 76.80/77.6 540.7x310.3 | 24 / 23 | 0.0 |
| book-a-demo | 390 | 1085 / 1085 | 390 / 390 | 49.92/50.4 287.5x201.7 / 49.92/50.4 287.5x201.7 | 24 / 23 | 0.0 |
| terms-of-use | 1440 | 16886 / 16886 | 1440 / 1440 | 93.60/94.5 1198.1x189.1 / 93.60/94.5 1198.1x189.1 | 105 / 103 | 0.0 |
| terms-of-use | 1200 | 16639 / 16639 | 1200 / 1200 | 78.00/78.8 998.4x157.6 / 78.00/78.8 998.4x157.6 | 105 / 103 | 0.0 |
| terms-of-use | 1024 | 16458 / 16458 | 1024 / 1024 | 66.56/67.2 829x134.4 / 66.56/67.2 829x134.4 | 105 / 103 | 0.0 |
| terms-of-use | 768 | 13883 / 13883 | 768 / 768 | 75.00/75.8 602x303 / 75.00/75.8 602x303 | 105 / 103 | 0.0 |
| terms-of-use | 600 | 19982 / 19982 | 600 / 600 | 76.80/77.6 451x387.8 / 76.80/77.6 451x387.8 | 105 / 103 | 0.0 |
| terms-of-use | 390 | 25968 / 25968 | 390 / 390 | 49.92/50.4 287.5x252.1 / 49.92/50.4 287.5x252.1 | 105 / 103 | 0.0 |
| privacy-policy | 1440 | 8142 / 8142 | 1440 / 1440 | 93.60/94.5 1198.1x189.1 / 93.60/94.5 1198.1x189.1 | 144 / 142 | 0.0 |
| privacy-policy | 1200 | 7961 / 7961 | 1200 / 1200 | 78.00/78.8 998.4x157.6 / 78.00/78.8 998.4x157.6 | 144 / 142 | 0.0 |
| privacy-policy | 1024 | 7828 / 7828 | 1024 / 1024 | 66.56/67.2 829x134.4 / 66.56/67.2 829x134.4 | 144 / 142 | 0.0 |
| privacy-policy | 768 | 7278 / 7278 | 768 / 768 | 75.00/75.8 602x303 / 75.00/75.8 602x303 | 144 / 142 | 0.0 |
| privacy-policy | 600 | 8973 / 8973 | 600 / 600 | 76.80/77.6 451x465.4 / 76.80/77.6 451x465.4 | 144 / 142 | 0.0 |
| privacy-policy | 390 | 10092 / 10092 | 471 / 471 | 49.92/50.4 287.5x302.5 / 49.92/50.4 287.5x302.5 | 144 / 142 | 0.0 |
| hipaa | 1440 | 4406 / 4406 | 1440 / 1440 | 93.60/94.5 1198.1x189.1 / 93.60/94.5 1198.1x189.1 | 60 / 58 | 0.0 |
| hipaa | 1200 | 4291 / 4291 | 1200 / 1200 | 78.00/78.8 998.4x157.6 / 78.00/78.8 998.4x157.6 | 60 / 58 | 0.0 |
| hipaa | 1024 | 4206 / 4206 | 1024 / 1024 | 66.56/67.2 829x134.4 / 66.56/67.2 829x134.4 | 60 / 58 | 0.0 |
| hipaa | 768 | 4000 / 4000 | 768 / 768 | 75.00/75.8 602x303 / 75.00/75.8 602x303 | 60 / 58 | 0.0 |
| hipaa | 600 | 4974 / 4974 | 600 / 600 | 76.80/77.6 451x387.8 / 76.80/77.6 451x387.8 | 60 / 58 | 0.0 |
| hipaa | 390 | 5589 / 5589 | 390 / 390 | 49.92/50.4 287.5x252.1 / 49.92/50.4 287.5x252.1 | 60 / 58 | 0.0 |

Pixel diff, full page (share of pixels over threshold):
- **compare:** 0.00% at all six widths.
- **terms-of-use:** 0.00% at all six widths.
- **hipaa:** ≤0.01% at all six widths.
- **privacy-policy:** 0.00%. The first pass gave 1.14% @1440 and 0.97% @1200. Both came from the background video showing a different frame when captured: it is the same `Tablet-Final` video on both sides, and the seek to 0 had not finished. After waiting for `seeked`, both widths were 0.00% (`tmp/cmp`).
- **book-a-demo:** 0.14–0.64%, entirely from the D12 white labels.
- **Residual micro-bands on every route:**
  - the shell footer HubSpot "Submit" glyphs (about 130px);
  - one athenahealth logo anti-aliasing band at compare-390 (16px).

## States verified (end values, live = clone unless noted)

Widths: 1440, 1200, 1024, 768, 600 and 390. The legal link hover was checked at 1440/1024/768/390.

- **/compare hero "Book a Live Demo" hover (M12):** `.underline._1` goes to w 0 and `._2` to full link width (454.3 @1440, 243.4 @390), top 56px / 30px. The table-bottom link behaves the same.
- **Sticky table header:**
  - ≤767: `position:sticky; top:60px; z 1; bg rgba(2,8,1,.5); backdrop-filter blur(80px)`, with the rect pinned at y 60 while mid-table (390, 600).
  - ≥768: static.
- **Specialty (white) tabs:**
  - Hovering tab 4 at ≥768, or clicking it below 768, makes it active with bg `#a2fa8e`, text `#020801`, pl 20.0016 / pt 12.
  - The image pane is sticky, top 60, 385×463 @1440, and `display:none` ≤767.
  - At 390, re-selecting tab 1 leaves its bg transparent, as on live.
  - Screenshots: 0.00%.
- **Integration block (white) hover (CMP-M3):** bg `rgb(162,250,142)`, and the box shadow is the same.
- **Privacy block hover (CMP-M2):** bg `#fff`, head and text `#020801`. The dump diff shows no colour mismatch. Screenshots: 0.00%.
- **EV accordion, tab 2 then tab 4 (CMP-M4):**
  - The active tab has bg `#fff` and text `#020801`.
  - Heights: 161.8 / 160.8 active and 77 closed @1440; 201.8 / 229.5 active and 69.8 closed @390.
  - Hovering a tab does nothing on either side.
- **/book-a-demo:**
  - Input focus border `#3898ec` matches, and submit hover shows no change on either side.
  - Forced success and error blocks match in geometry and colour.
- **/privacy-policy `a.link-transp` hover:** no change (opacity .5, underline).
- **Terms and hipaa:** no inline links, so there is no hover state to check.

## Defects fixed

None. No file was edited.

## Remaining differences (not defects)

| Difference | Why |
|---|---|
| /book-a-demo labels white vs live `#020801` | D12 |
| /book-a-demo honeypot `website_url` input absent | D9 |
| `.w-form-done` shows a 2px `:focus-visible` ring when the state is forced with the QA hook `?form=success` | This happens only for programmatic focus on load. After a real mouse submit, `:focus-visible` is false and outline is none (verified). This is D7 behaviour. |
| Two `display:none` `.bg-circle` divs missing from the hero | Not rendered on live either |
| h2 `transform: matrix(1,0,0,1,0,0)` vs `none` | Identity transform; paints the same |
| Shared CTA: `.underline` pair comes before the `.text-56` label in the clone's DOM | Geometry is identical when paired by class (keyed diff shows 0) |
| Noise and background image filenames differ (hash prefixes) | Same assets |
| Marquee phase in the frozen state | The rows are animated; the frozen offset is arbitrary |
| Transition-pixel pattern mid-scroll (seen in the integ-hover @390 and ev-tab @768/1024 shots) | Scroll-driven motion (M8), not a static state. At rest the full-page shots are 0.00%. Not audited here: this is motion scope. |
| /privacy-policy 81px horizontal overflow at 390 | Faithful to live |
| Footer HubSpot "Submit" glyph band | Shell, out of scope |

## Verification

- `npm run build`: OK (chunk-size warning only).
- `node qa/routes.mjs /compare,/book-a-demo,/terms-of-use,/privacy-policy,/hipaa`: 20/20 PASS, all Δ0. Overflow matches (privacy 390 is 81/81). No errors and no external requests.
- `node qa/smoke.mjs`: PASS at 1440/1024/768/390.
- No shared homepage files were touched, so no homepage regression run was needed.

## Not checked

- Motion and timing: the load intros (CMP-M1, LGL-M1, BAD-M1), hover transition curves, the pixel transitions and the video fade. Only end states were compared.
- Keyboard focus rings (D7, excluded) and the Call Alex popup on /compare (a shared homepage component, covered by earlier audits).
- The /book-a-demo native validation messages and the "Submitting..." intermediate state (D9 behaviour).
- Touch or tap behaviour of hover effects (tested with mouse emulation only).
- Nav on-white colours were not probed directly: my probe selector hit the wrong element. They are covered visually by the specialty-tab screenshots taken inside the white section (0.00% at all widths).
- Widths other than the six listed; DPR 2.

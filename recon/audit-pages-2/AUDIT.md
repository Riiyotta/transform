# Pixel audit 2: CMS templates (/blog, 8 posts, /case-studies, 2 studies)

Auditor: pixel-audit (independent re-measurement; the builder's compare.mjs output was not trusted).
Clone http://127.0.0.1:5179 vs live https://www.transform9.com, 2026-09-30.

## Method

- `tools/cap.mjs`: one load per route and width. Live waits for the preloader to reach opacity 0, then 3.5 s. Both sides scroll through the page, videos are hidden, and a full-page PNG is taken. It also dumps **every** rendered element in the page sections (index: `section.hero`, `section.all-blogs-section`; detail: `section.blog-top-header`, `section.post-body-section`, `section.read-next-section`). The dump records the rect, rendered line count of the own text, href, and 50 computed props, including font family, size, line-height, weight, style, letter-spacing, colour, margins and paddings, all four borders, text-decoration line/colour/offset, list-style, white-space, background size/position/image, object-fit and overflow.
- `tools/odiff.mjs`: a **DOM-order** diff (element i vs element i, tolerance 0.6 px). Unlike the builder's comparator, this checks every instance, not only the first element of each class combo. Every rich-text `p`/`li`/`strong`/`em`/`a`/`blockquote`/`h2`/`h3` is compared individually, so wrapping drift shows as a line-count or height delta.
- `tools/diff.mjs`: a text/class-keyed diff (from audit-sections, with a 1 px tolerance). It catches reorderings that odiff would misattribute.
- `tools/compose.mjs`: live | clone | diff composite. Here it uses a per-channel threshold of **10** (`TH=10`; the default is 40) and lists the diff bands (y/x ranges).
- `tools/states.mjs`: hover END states for the blog card, featured row, Load More, case card, read-next card, back link and share icon. It also covers the Load More click result (item count, titles, every card rect, docH, URL, link removed) and the sticky share column at 0/30/60/98 % through the post body. Each state is measured as computed props plus an element screenshot, at 1440/768/390.
- `node qa/routes.mjs` (12 routes × 4 widths) and `node qa/smoke.mjs`.

Checkpoint side-by-sides (full page, 1440 and 390) are `before/cmp10/cmp-{blog,athena,cs,sbj}-{1440,390}.png`. All 24 composites are in `before/cmp10/`.

## Results: template × viewport

Cell = odiff mismatching elements / screenshot diff % (TH 10) within the page sections. "–" means not captured at that width (no screenshot at the mid widths; element dumps only).

| Route | 1440 | 1200 | 1024 | 768 | 600 | 390 |
|---|---|---|---|---|---|---|
| /blog (hero + list) | 0 / 0.00 | 0 / – | 0 / – | 0 / – | 0 / – | 0 / 0.01¹ |
| athena (post) before fix | **2** / 0.00 | **2** | **2** | **2** | **2** | **2** / 0.00 |
| athena after fix | 0 / 0.00 | 0 | 0 | 0 | 0 | 0 / 0.01¹ |
| january | 0 / 0.00 | 0 | 0 | 0 | 0 | 0 / 0.07¹ |
| ent | 0 / 0.00 | 0 | 0 | 0 | 0 | 0 / 0.01¹ |
| ortho | 0 / 0.00 | 0 | 0 | 0 | 0 | 0 / 0.01¹ |
| redefining | 0 / 0.00 | 0 | 0 | 0 | 0 | 0 / 0.01¹ |
| twelve | 0 / 0.00 | 0 | 0 | 0 | 0 | 0 / 0.01¹ |
| ivr | 0 / 0.00 | 0 | 0 | 0 | 0 | 0 / 0.05¹ |
| generic | 0 / 0.00 | 0 | 0 | 0 | 0 | 2² / 0.05¹ |
| /case-studies | 0 / 0.00 | 0 | 0 | 0 | 0 | 0 / 0.02¹ |
| southern-bone-joint (highlight variant) | 0 / 0.00 | 0 | 0 | 0 | 0 | 0 / 0.06¹ |
| the-orthopaedic-center (2-stat variant) | 0 / 0.00 | 0 | 0 | 0 | 0 | 0 / 0.10¹ |

Rendered element counts are identical per section on every route (for example, athena body 130/130, SBJ read-next 24/24 at 1440 and 22/22 at 390). docH and docW are identical at all six widths on every dumped route.

¹ All remaining screenshot-diff bands are **outside the CMS sections**. They fall in the shell CTA (`section.cta-section`, a 1 px shift of the silhouette/pixel overlay at 390) and the footer HubSpot form (anti-aliasing on the "Email"/"Submit" glyphs, visually identical). Both are shell-owned; see Remaining deviations.
² A live flake: the first share icon (X) had not loaded on live (img 24×0) in that capture. It is 24×24 in every other live capture.

## States (1440 / 768 / 390): 0 mismatches

Every probed prop matches before and after hover. The only differences are border colours on zero-width borders (Tailwind preflight `border-color` vs Webflow `currentColor`/`#ccc`), which are invisible.
- Blog card: bottom #fff, title/meta #020801, meta rule #0033cc, image scale 1.1, arrow opacity 1. Composite 0.11–1.6 %, all inside the scaled photo: sub-pixel resampling of a scale(1.1) raster, not a geometry difference.
- Featured: image scale 1.1 (same resampling noise).
- Case card and read-next card: cell #f1f3f3, white/black logo swap, bottom #fff, texts #020801, stat rule #0033cc, arrow 1. Screenshot diff 0.00 %.
- Back link (opacity 1, arrows −28 px = −100 %), share icon (opacity 1), Load More hover: 0.00 %.
- Load More click: 8 items, same titles and order, all 8 card rects within 1 px, list height and docH identical (1440 6971, 768 5274, 390 7100), link removed, URL stays `/blog`.
- Sticky share: `.left-sticky-block` top is 60 at 0/30/60 % and −46.9 at the section end (1440). It is static at 768 and 390, with identical tops at all four scroll points.

## Defects found and fixed

| # | Defect | Evidence (before → after) | File |
|---|---|---|---|
| 1 | Linked + bold run nested inverted: the clone rendered `<strong><a>book a demo</a></strong>`, live has `<a target=_blank><strong>book a demo</strong></a>` (athena post, last paragraph). The DOM and the computed text-decoration/cursor on the two elements were swapped. Visually the underline was the same, but the element tree, hover target and computed styles differed. It is the only linked+bold run in all 10 source HTML files (grep of `recon/pages/*/html`). | odiff athena: 2 elements (tag a→strong, textDecorationLine underline→none, cursor pointer→auto) at all 6 widths → 0 at all 6 widths | `src/components/cms/RichText.jsx` (`Inline`: link is now the outermost wrapper) |

No content JSON extraction errors were found. Text, line counts and hrefs match on every element.

## Remaining deviations (not fixed, with reasons)

1. **Card image scale after mouse-out**: live leaves `.post-img-hor` at `scale(1.01)` after the first hover-out (IX2 a-49, spec BLOG-M6). The clone returns to `none`. This is motion (out tween end state), so it goes to the Animation pass: after the first mouseout, the resting scale should be 1.01. This caused the 0.13–1.37 % diff in `states/cmp/cmp-loadmore-after-*.png` (the first card only).
2. **Shell CTA at 390** (`src/components/Cta.jsx`, not mine): the silhouette/overlay image is shifted about 1 px (outline band in `before/cmp10/cmp-toc-390.png`, y≈3545–4018). It appears on every route at 390, so it is a shell issue. It was reported, not edited.
3. **Shell footer form** (not mine): sub-threshold anti-aliasing on the HubSpot "Email"/"Submit" text. It is visually identical, and the diff appears only at TH 10.
4. Invisible: zero-width border colours differ (Tailwind preflight default `rgba(255,255,255,.2)` vs `currentColor`). There is no rendered effect. The root is in `index.css` preflight, so it is not changed here.

Expected, not defects: D13 inert share icons, D14 `?page=2`, D15 hidden style-guide block, hidden blog read-next (display:none on live, not rendered in the clone), no background video on detail pages, and source typos.

## Verification

- `npm run build`: OK.
- `node qa/smoke.mjs`: PASS ×4.
- `node qa/routes.mjs <12 CMS routes>` (1440/1024/768/390): **48/48 PASS** (heights Δ0, no overflow, no errors, no external requests). Output is in `routes-after.txt`.

## Coverage and what was not checked

- Screenshot diffs: all 12 routes at 1440 and 390 (`before/cmp10`), plus the athena re-check after the fix (`after/cmp`).
- Element-level diffs: all 12 routes at 1440, 1200, 1024, 768, 600 and 390 (every rendered element, DOM order and keyed).
- States: 1440, 768 and 390 only (not 1200/1024/600). Hover was checked on the first card of each list only. Read-next hover was checked on SBJ only (TOC's read-next card is the SBJ highlight variant, which is statically identical).
- Not checked: focus-visible styles, Load More at 1200/1024/600, hover on appended page-2 cards, the ≥1620 px clamp ceiling (for example `--fs-clamp-16-18` → 18 px), and widths between the tested breakpoints (for example 992/991 and 479/480 boundaries). Load-intro motion (preloader, word split, fades) was not compared; the clone renders the settled state by design.
- Size note: this folder is about 600 MB (full-page PNGs and composites). Delete `before/cmp10` and `after/cmp` if space matters; they can be regenerated with `tools/compose.mjs`.

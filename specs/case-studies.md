Source: https://www.transform9.com/case-studies

# Case-studies family: clone build spec (index `/case-studies` + detail `/case-studies/<slug>`)

Measured 2026-09-30 on the live site with the same method as `specs/blog.md` (read that first). This family **reuses the blog templates' classes**. Only the differences and page-specific values are listed here. "Blog §n" means `specs/blog.md` section n.

## 0. Templates and ids
| Page | Webflow page id | Notes |
|---|---|---|
| `/case-studies` | `6971638a9ea15e3a1fb91fd5` | Same IX3 load timeline as the blog index (i-7723a9c6). No pagination (2 items). |
| `/case-studies/<slug>` | `697149b061298badae113701` | **One template for both studies, with one data-driven variant**: the header shows either a **highlight text** (Southern Bone & Joint) or a **2-stat block** (The Orthopaedic Center). The unused element is **omitted from the server HTML** (not `w-condition-invisible`), and the index card follows the same rule. Posts use the IX3 load timeline i-452c7296 (shared with blog posts). |
Head: `<title>` = study name ("Southern Bone & Joint", "The Orthopaedic Center"; index "Case Studies"). Meta description = CMS summary (see JSON). **No og:image and no JSON-LD** on case studies (unlike blog posts).

## 1. Shell differences
Identical to Blog §1: index = blog-index column, detail = blog-post column, including the preloader, load-in, top offset 60 on detail, the invisible `.bg-pixels`/overlay on detail, the video bg + `.hero.hide-on-scroll` fade on the index, and the hidden style-guide block (with Twitter/YouTube loads) on detail. Nav `w--current`: "Case Studies" on the index (no visual change), none on detail. Footer `w--current`: "Case Studies" on the index. CTA and footer measured identical to the homepage (1506 / 1070.9 / 1152 / 1275; 750.1 / 683.7 / 713.3 / 1077.6).

## 2. Tokens
Blog §2 applies. **NEW** on this family:
| Token | Value | Use |
|---|---|---|
| **NEW** logo cell tint | `rgba(255,255,255,.01)` (`#ffffff03`) | `.post-img-wrap.cs` bg at rest, `.cl-logo-overlay` |
| **NEW** header divider | `#3a3e39` rgb(58,62,57) | `.blog-header-right.cs` border-left (≥768) |
| **NEW** gradient edge | `#000` 1px | `.post-top-linear.cs` border-left |
| gray `--gray` `#f1f3f3` (existing) | | logo cell bg on card hover |

## 3. Index `/case-studies`

### 3.1 Section order (y / height)
| # | Section | 1440 | 1024 | 768 | 390 |
|---|---|---|---|---|---|
| 1 | `section.hero.blog.hide-on-scroll.cs` | 0/528.9 | 0/445.1 | 0/496.3 | 0/408.1 |
| 2 | `section.all-blogs-section.cs` | 528.9/1345.5 | 445.1/1064.2 | 496.3/1051.2 | 408.1/1017.9 |
| 3 | `section.cta-section` | 2018.4/1506 | 1611.7/1070.9 | 1624.3/1152 | 1465/1275 |
| 4 | `section.footer.section` | 3524.4/750.1 | 2682.7/683.7 | 2776.3/713.3 | 2740/1077.6 |
Doc height 4640 / 3661 / 3770 / 4006.

### 3.2 Hero
Same as Blog §3.2 but **without a featured post**. `.cs` adds padding-bottom 7vw (100.8 / 71.68), 30 at ≤991. H1 `h1.white-text.hero-home.blog` **"Case Studies | Proven Success Stories"**: same sizes and margins as the blog H1, split into 6 words (`Case`, `Studies`, `|`, `Proven`, `Success`, `Stories`) for BLOG-M3. Lines at 1440: "Case Studies | Proven" / "Success Stories" (189.1 tall). At 390: 5 lines, 252.1 tall.

### 3.3 List `section.all-blogs-section.cs`
- bg `#020801`, relative, margin-bottom 10vw (144 / 102.4 / 76.8 / 39); border-bottom 1px `.2` at ≥992 (none ≤991). **No `.articles-head-wrap`** (no "All Articles" heading): the list starts directly under the hero.
- `div.blogs-list-wrap` (border-top 1px `.2`): left rail `.left-sticky-wrap.blogs` > sticky block > `div._16px-text.white-text` **"Insights & Stories"** (hidden ≤991, same as Blog §3.3) + `div.blog-list-right` > `div.posts-wrap.cs` (padding 36/20 top and bottom) > `div.blogs-wrapper.cs.w-dyn-list` > **`div.blogs-list.cs.w-dyn-items`**: **flex column** (not grid), padding 0 36 (0 20 ≤991), gap 36 (20 ≤991). No Finsweet attributes and no pagination.
- **Card** `div.blogs-item.cs.w-dyn-item` (width 100%) > `a.post-link-block.cs.w-inline-block` (border 1px `.2`, flex column). Sizes: SBJ 982×576.6 / 677.2×444.6 / 728×468.7 / 350×431.2; TOC 982×659 @1440.
  - `div.post-img-wrap.cs` (flex centred, overflow hidden, bg `rgba(255,255,255,.01)`, height `22.222vw` = 320 / 227.5; `30vw` = 230.4 at 768; `48vw` = 187.2 at 390). It holds two logo images stacked: `img.cl-wh-logo-on-cell` (height 50%: 160 / 113.8 / 115.2 / 93.6; width auto, 297.1 @1440) and `img.cl-bl-logo-on-cell` (absolute, same box, **opacity 0**). Logos are 780×420 WebP with a `-p-500` srcset variant used at 390.
  - `div.post-bottom-wrap.cs` (padding 36/20, border-top 1px `.2`, flex column `space-between`, row-gap 7vw = 100.8 / 71.68; **12vw** = 92.16 at 768; 18vw = 70.2 at 390):
    - `div._30px-text.white.cs-title` (name): 30 / 21.33 / **30** / **30** px (30 at ≤991), line-height 1.2.
    - **Variant A (highlight)** `div._16px-text.white-text.highlight-text-alt`: `white-space:pre-wrap` (**preserve the `\n`** in the CMS text), max-width 50ch (512); 70% at ≤991; 90% at ≤479. 16/22.4 (14/19.6 at ≤767), ml 43 at ≥480. SBJ: "A Partnership Built on Trust:\nHow Southern Bone & Joint Humanized Patient Access with “Ronnie”".
    - **Variant B (stats)** `div.testim-bottom-cont.blog.cs`: flex row, gap 5vw (72 / 51.2 / 38.4; max-width 384 at 768); **column, gap 24 at ≤479**. Two `div.testim-point-wrap.blog.cs` (1px `#a2fa8e` left border, padding-left 16, gap `1.667vw` = 24 / 17.07 / 12.8 / 6.5, width 275 / 275 / 172.8 / 308): `div._30px-text.white.testim-num.cs` (30 / 21.33 / 24 / 24; "80%", "90%") + `div._16px-text.white-text.blog-point.cs` (16/22.4; 14/19.6 ≤767; max-width 21ch = 215.04; none at ≤479; ml 43 at ≥480): "reduction in call abandonment rate — from 20% to just 3%", "decrease in average patient hold times".
    - `div.post-arrow-wrap` (100×100 `#0033cc`, arrow 28, opacity 0; display none ≤991), as Blog §3.3.
  - Order: 1. Southern Bone & Joint (variant A), 2. The Orthopaedic Center (variant B).

### 3.4 Card hover (IX2 e-62 / e-63 → a-52 / a-53, class `.post-link-block.cs`, all breakpoints; also applies to the detail-page read-next card)
| Target | Rest | Hover (measured end) | Out |
|---|---|---|---|
| `.post-img-wrap.cs` bg | `rgba(255,255,255,.01)` | `#f1f3f3` | `rgba(255,255,255,.01)` |
| `.cl-wh-logo-on-cell` opacity | 1 | 0 | 1 |
| `.cl-bl-logo-on-cell` opacity | 0 | 1 | 0 |
| `.post-bottom-wrap` bg | transparent | `#fff` | `rgba(255,255,255,0)` |
| `._30px-text.white` (title, stat numbers) | `#fff` | `#020801` | `#fff` |
| `.blog-point.cs`, `.highlight-text-alt` | `#fff` | `#020801` | `#fff` |
| `.testim-point-wrap.blog.cs` border-left | `#a2fa8e` | `#0033cc` | `#a2fa8e` |
| `.post-arrow-wrap` opacity | 0 | 1 | 0 |
Timing: IX2 group 1 (instant-ish: arrow → 0, black logo → 0 over 500ms linear, img-wrap → .01 alpha), then group 2: all the above at **300ms outQuad**. On out the logo swap is 300ms outQuad. Screenshot `recon/pages/case-studies/shots/state-1440-card-hover.png`.

## 4. Detail `/case-studies/<slug>`

### 4.1 Section order (y / height)
| # | Section | SBJ 1440 / 1024 / 768 / 390 | TOC 1440 / 1024 / 768 / 390 |
|---|---|---|---|
| 1 | `section.blog-top-header` (mt 60) | 60/481 · 60/351.7 · 60/344.2 · 60/463.5 | 60/481 · 60/416.7 · 60/397 · 60/558.1 |
| 2 | `section.post-body-section` | 541/3071.8 · 411.7/3541.3 · 404.2/3442.4 · 523.5/5533.8 | 541/1065.7 · 476.7/1214.5 · 457/1286.8 · 618.1/1967.1 |
| 3 | `section.read-next-section.read-next` (**visible**) | 3612.8/1099.3 · 3953/871.5 · 3846.6/745.2 · 6057.3/735.9 | 1606.7/1017 · 1691.2/806.4 · 1743.8/692.4 · 2585.1/641.3 |
| 4 | `section.cta-section` | 4856.2/1506 · … | 2767.6/1506 · … |
| 5 | `section.footer.section` | 6362.2/750.1 · … | 4273.6/750.1 · … |
Doc height SBJ 7477 / 6976 / 6814 / 9373; TOC 5389 / 4649 / 4659 / 5806.

### 4.2 Header (differences from Blog §4.2)
- Left `div.post-img-vert-wrap.cs.post-page`: **no hero photo and no borders** (`.cs` removes border-right and border-bottom; `.post-page` border-top 0). bg `#020801`, height 33.403vw (481 / 342), min 40vw at ≤991 (it stretches with the row: 344.2 / 397 @768), 53vw at ≤767 (206.7). Children: `div.bg-noise.stat-img` (.5), `div.cl-logo-overlay` (absolute fill, `rgba(255,255,255,.01)`), **`img.cl-logo-on-post`** (the white logo, **width 70%** of the cell, centred by flex): 269.5×145.1 @1440, 191.6×103.2 @1024, 143.7×77.4 @768, 273×146.9 @390.
- `div.blog-header-right.cs`: **border-left 1px `#3a3e39`** (≥768). At ≤767: no left border, **border-top 1px `.2`**, gap 80 at ≤479. Padding and space-between are as in the blog post.
  - `div.post-top-linear.cs`: the same gradient plus border-left 1px `#000`; starts 1px right (x 386).
  - Back link href `/case-studies`, text **"Back to Case Studies"** (link box 233.4 wide @1440). Same arrows and hover (BLOG-M8; IX2 e-60 / e-61, ≥992).
  - Title `h2._56-px-text.white.blog-page-title` = study name (sizes as Blog §4.2; single line at every width: 56 tall @1440, 33 @390).
  - **Bottom slot (variant):**
    - A, SBJ: `div._16px-text.white-text.highlight-text-alt.post-page`: font `clamp(1rem,1.111vw,1.125rem)` (16 at ≤1440), **14 at ≤479**, line-height 1.4; pre-wrap; max-width 60ch (614.4), 100% at ≤991; ml 43 at ≥480. Measured 505×44.8 @1440 (2 lines, split at the CMS newline).
    - B, TOC: `div.testim-bottom-cont.blog.open-page.cs`: the stats block exactly as the index card variant B (§3.3), 622.1×127.2 @1440, 601.3×109.8 @1024, 384×120 @768, 350×153.4 (column) @390.
- There is no author, date, category or tag.

### 4.3 Body
Identical to Blog §4.3–§4.4 (same `.post-body-wrap`, 5 slots, rich-text styles, share block "Found this useful? Share it" with X/Facebook/LinkedIn, sticky top 60, which moves below the body at ≤991). Visible slots: SBJ `1st`, `bl-2`, `bl-3` (2 hairline separators); TOC `1st`, `bl-2`, `bl-3`, `bl-4`. Block types used: h2, p (with ZWJ spacers), blockquote (SBJ 7, TOC 2), ul (TOC 1, 3 items), strong. The **TOC copy contains missing-space typos** in the CMS source (e.g. "teamhas", "staffinginefficiencies", "TOCreceives", "saying,and"). These are preserved verbatim in the JSON and must not be "fixed".

### 4.4 Read-next `section.read-next-section.read-next` (visible on case studies)
- margin-bottom 10vw (144 / 102.4 / 76.8 / 39); border-bottom 1px `.2` (none ≤991); no top border.
- `div.post-right-side`: margin-left = rail, border-left 1px `.2`, flex column (ml 0 and no border ≤991).
  - `div.right-side-head-wrap`: padding 36 (20 ≤991), border-bottom 1px `.2`, flex column `space-between`, gap **15vw** (216 / 153.6 / 115.2), **120 at ≤767**.
    - `div._16px-text.white-text` "Keep exploring" (ml 43 ≥480; 16/22.4, 14/19.6 at 768).
    - `div._56-px-text.white.right-side-heading` "Read Next" (56 / 39.82 / 30 / 30; max-width 70%).
  - `div.posts-wrap.read-next.cs` (padding 36/20 top and bottom; `.read-next` adds side padding at ≤767, which `.cs` cancels to 0) > `div.blogs-wrapper.cs` > `div.blogs-list.cs` (flex column, padding 0 36 / 0 20) > **1 card: the other case study**, same markup as the index card **except** the bottom uses `div.post-bottom-wrap` (not `.cs`: row-gap 7vw / **11vw** = 84.48 at 768 / 18vw) and the title is `div._30px-text.white` (not `.cs-title`): **30 / 21.33 / 18 / 24 px**. Card sizes: on SBJ (showing TOC) 982×659 / 677.2×509.6 / 728×499.4 / 350×482.5.
  - Hover: same as §3.4 (measured on the SBJ page: img-wrap `#f1f3f3`, white logo 0, bottom `#fff`, title `#020801`, arrow 1).
  - The logo img reported naturalWidth 1439×775 in this card at 1440, while the files are 780×420. That is a runtime/responsive-image artefact; the visual box is the same 297.1×160.

## 5. Motion
Reuse the Blog §5 ids: BLOG-M1 (preloader), BLOG-M2 (index: `.nav-menu`, `.all-blogs-section` [+ `.featured-post`, absent here]; detail: `.nav-menu`, `.blog-top-header`, `.post-body-section`), BLOG-M3 (index H1 words, 6 words → last word starts at t 0.6), BLOG-M4 (index bg video in), BLOG-M5 (detail invisible layers), BLOG-M8 (back link), BLOG-M9 (share), BLOG-M10 (sticky share), M12 / M8c / shell. Measured on the case-study index: load at 3232ms; word 1 opacity .44 at +172ms, word 2 starts +0.18s, word 6 starts ≈ +0.5s; nav and list .386 at +172ms and ≈1 at +1.27s. Measured on the SBJ detail: header and body .406 at +173ms and 1 at +1.29s.

| # | Element | Trigger | Properties | Duration | Easing | Delay / stagger | Repeat | Breakpoints | Source |
|---|---|---|---|---|---|---|---|---|---|
| CS-M1 | `a.post-link-block.cs` (index cards + detail read-next card) | mouseover / mouseout | see §3.4 table | 300ms (group 1: 500ms linear for the black-logo reset) | outQuad | group 2 after group 1 | – | all (arrow hidden ≤991) | IX2 e-62 / e-63 → a-52 / a-53 |

## 6. Forms and embeds
None page-specific. The hidden style-guide embeds should be dropped (Blog §6). Share buttons need the same decision (Blog §4.5).

## 7. Content
- `content/case-studies/_index.json`: meta, hero heading, left label "Insights & Stories", `list[]` cards `{href, title, logoWhite, logoBlack, highlight|null, stats[{value,label}]}`.
- `content/case-studies/<slug>.json`: `meta` (no og:image, no JSON-LD), `title`, `logo` (white), `logoAlt` (empty), `highlight{text}` | null, `stats[]`, `backLink`, share, `slots[]`, `readNext{visible:true, eyebrow "Keep exploring", heading "Read Next", items[1]}`, `summary`, `category:null`, `tags:[]`, `body[]` (same block schema as Blog §7).
- **Variant rule:** render `highlight` if non-null, otherwise `stats`. Both the header and the cards follow it.

## 8. Asset inventory (live URLs, not downloaded)
| Asset | URL (`https://cdn.prod.website-files.com/` + …) | Type / intrinsic | Used by |
|---|---|---|---|
| SBJ logo white | `6961001f1082da89878fcb00/698c60b11b32134b897d931c_SBJ-wh.webp` (+ `-p-500.webp`) | WebP 780×420, 25 KB | index card, detail header, TOC read-next |
| SBJ logo black | `6961001f1082da89878fcb00/698c60b597afd6b738f5589b_SBJ-bl.webp` (+ `-p-500`) | WebP 780×420, 11 KB | card hover |
| TOC logo white | `6961001f1082da89878fcb00/697155d042ff46942e0a512d_toc-2-wh.webp` (+ `-p-500`) | WebP 780×420, 21 KB | card, header, SBJ read-next |
| TOC logo black | `6961001f1082da89878fcb00/697155d4ccf7e923e9b73400_toc-2-bl.webp` (+ `-p-500`) | WebP 780×420, 20 KB | card hover |
| Back arrow, card arrow, share icons | as Blog §8 | SVG | |
The other shell assets are in ASSET_MANIFEST.md.

## 9. Unknowns and flags
1. Logo `<img>` attributes: `srcset="…-p-500.webp 500w, ….webp 780w"`. `sizes` is `(max-width: 991px) 100vw, 780px` on one img role and `100vw` on the other (both appear across the cards and the header; not mapped per element). The measured rendered boxes are authoritative, and the `-p-500` variants load at 390.
2. There is no og:image on case studies. Whether to fall back to the site default OG image (`68b191f59984678d1bd51942_Open%20Graph-opt.png`, 1200×630) is a main-session decision; live has none.
3. Touch behaviour of card hover was not tested (as for the blog).

## 10. Evidence
`/Users/riyaghosh/V3/transform/recon/pages/case-studies/`: `html/`, `measure/<page>-<w>.json`, `table-*.txt`, `outline-*-1440.txt`, `shots/` (full pages at 4 widths, `state-1440-card-hover.png`, `preload-cs-4s.png`). Shared motion, IX and CSS files are in `recon/pages/blog/shared/` (see Blog §10).

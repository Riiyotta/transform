Source: https://www.transform9.com/blog

# Blog family: clone build spec (index `/blog` + post template `/blog/<slug>`)

Measured 2026-09-30 on the live site (authoritative). Playwright 1.63 Chromium headless, DPR 1, viewports 1440×900, 1024×900, 768×1024, 390×844, `document.fonts.ready` awaited, and IX3 load timeline let finish (≥2.5 s after `load`) before reading. Every px below is computed style / `getBoundingClientRect` unless marked *(CSS)*, which means copied from `transform9.webflow.shared.8b0b439cc.css` (the same file as the homepage). Homepage spec references (`CLONE_SPEC §n`, `M#`) point to `/Users/riyaghosh/V3/transform/CLONE_SPEC.md`.

The case-study family reuses most of this template. `specs/case-studies.md` refers back to sections here by number.

---

## 0. Templates and ids

| Page | Webflow page id | Collection | Notes |
|---|---|---|---|
| `/blog` (index) | `69664f533e7e9450caa2aa30` | – | One template. Page 2 (`?523ae0d4_page=2`) is the same template; see §3.5. |
| `/blog/<slug>` (post) | `6961001f74e092b614cb17b7` | `6961001f74e092b614cb179f` | **All 8 posts use one template with no layout variants.** The only data-driven differences are title length (header height), how many of the 5 rich-text slots are filled (§4.4), and hero image. |

Head per post: `<title>` = post title. `meta description` = og:description = twitter:description = CMS summary. og:image = twitter:image = hero image. There is a JSON-LD `BlogPosting` (headline, description, image, author Organization "Transform9", publisher, datePublished = dateModified in `YYYY-MM-DD`). All of these are in `content/blog/<slug>.json → meta`. The blog index title is "Blog" and its description is "Our blog is regularly updated with insights, tips, and success stories to help you improve patient experience and stay ahead in healthcare."

---

## 1. Shell: how it differs from the homepage (CLONE_SPEC §2, §3, §15, §17)

**These are identical to the homepage and should reuse its components:** navbar (§3) including hover M15 and the mobile menu M18; "Call Alex" modal (§16); CTA section (§15) including the `black-to-img` pixel transition M8c and the underline pairs M12; footer (§17a) including the HubSpot form replica; sticky footer reveal (§17b); noise overlay; Lenis (M22). Measured CTA heights are 1506 / 1070.9 / 1152 / 1275 and footer heights 750.1 / 683.7 / 713.3 / 1077.6 at 1440/1024/768/390, which equals the homepage. Text is identical too.

| Shell item | Homepage | Blog index | Blog post |
|---|---|---|---|
| Nav `w--current` | none | "Blog" link has `.w--current`. **No visual difference was measured**: colour stays `rgba(255,255,255,.7)`. | none |
| Footer `w--current` | "Home" | "Blog" | none |
| Nav on-white swap (M4) | yes | **never fires** (no `.white-section`). Nav stays `rgba(2,8,1,.5)` + blur the whole page. | same (measured at scrollY 0/800/1600) |
| Fixed bg video `.bg-pixels-wrapper` (+ `.bg-video-pixels`, `html.has-video`) | yes | **yes, identical markup and assets** | **absent.** Replaced by `div.bg-pixels.test-size`: an **empty** fixed div with no background, opacity 0 → 1 at load; nothing visible. Plus `div.bg-pixels-overlay`: fixed, 100vw × 100dvh, bg `#020801`, z −2, opacity 1 → 0 at load. Both sit behind `.page-wrap-solid-bg`, so **neither is visible**. The clone may omit both (record only). |
| Video fade on scroll | M3 via `.hero.home` | **same behaviour, different trigger class**: `.hero.hide-on-scroll` start "top top", end "top −10%" (IX3 i-37f61121). Measured wrapper opacity 1 at y 60 and 0 at y 100 @1440×900. | n/a. IX3 i-94db35ea (`.blog-top-header` "top top"→"bottom 90%") fades `.bg-pixels`, which is invisible anyway, so it is a no-op. |
| `.preloader-wrap.post` | not present | **present**: fixed, inset 0, 100vw × 100dvh, bg `#020801`, z 4, pointer-events none, `display:block` via inline head CSS. It covers the page until window `load`, then fades out (BLOG-M1). | same |
| Load-in animation | none (§18 "no entrance animations") | **yes**: BLOG-M1 … M4 | **yes**: BLOG-M1, M2, M5 |
| Pre-IX hide list (inline `<style>`) | homepage selectors | adds `.preloader-wrap, .bg-pixels, .bg-pixels-wrapper, .white-text.hero-home, .nav-menu, .bg-pixels-overlay, .featured-post, .all-blogs-section` (`visibility:hidden` until IX3 is ready) | adds `.preloader-wrap, .bg-pixels, .bg-pixels-wrapper, .nav-menu, .bg-pixels-overlay, .blog-top-header, .post-body-section` |
| Top offset | hero starts at y 0 under the fixed nav | hero starts at y 0 (`.hero.blog` padding-top 110 / 90 at ≤479) | `section.blog-top-header { margin-top:60px }` *(CSS)*. The margin collapses through `.page-wrap` and body (body rect y = 60), so content starts at y 60 under the 60px nav. Build as a 60px top offset. |
| `.page-wrap` children | many | `bg-noise-wrap, bg-pixels-wrapper, page-wrap-solid-bg, hero, all-blogs-section, cta-section, footer` | `bg-noise-wrap, bg-pixels.test-size, bg-pixels-overlay, page-wrap-solid-bg, blog-top-header, post-body-section, read-next-section(hidden), cta-section, footer` |
| Extra third-party loads | – | – | `platform.twitter.com/widgets.js`, a YouTube iframe (`www-player.css`, `generate_204`) and `syndication.twitter.com`. **All come from the hidden `.rich-text-post.example-for-edit` style-guide block** (display:none). Strip them (D1) and do **not** render that block. |

Z-order and footer reveal are unchanged: `.page-wrap` z 2, `.footer-bottom-wrap` sticky z 1.

---

## 2. Tokens

All colours map to existing homepage tokens (CLONE_SPEC §1.3) except those marked **NEW**.

| Token | Value | Use here |
|---|---|---|
| black `--black` | `#020801` | page bg, preloader, `.post-body-section` bg, hover text |
| white `--white` | `#fff` | text, card-hover bottom bg |
| green `--green` | `#a2fa8e` | 1px left rule of meta cells (`.testim-point-wrap`), blockquote 6px left border |
| blue-dark `--blue-dark` | `#0033cc` | `.post-arrow-wrap` bg, meta-cell rule on hover |
| gray `--gray` | `#f1f3f3` | (case-study card hover, see case-studies spec) |
| stroke on dark `--white-0-2` | `rgba(255,255,255,.2)` | every hairline |
| **NEW** `--white-0-6` | `rgba(255,255,255,.6)` (`#fff9`) | rich-text `p`, `li`, `em` colour |
| **NEW** `--white-0-5` | `rgba(255,255,255,.5)` (`#ffffff80`) | rich-text `figcaption` (style guide only) |
| **NEW** `--_typography---clamp-16px-18px` | `clamp(1rem, 1.111vw, 1.125rem)` | rich-text p/li/h4–h6. Measured 16 at every viewport ≤1440 (max 18 at ≥1620). |
| **NEW** `--_typography---clamp-14px-16px` | `clamp(.875rem, .972vw, 1rem)` | figcaption |
| **NEW** post-top gradient | `linear-gradient(270deg, #fff0, #020801)` | `.post-top-linear`: 40% width overlay at the left of the header's right column |
| **NEW** Webflow default pagination button | bg `#fafafa`, border 1px `#ccc`, radius 2px, padding 9px 20px, text `#333` 14px, margin 0 10px | `a.w-pagination-previous`; visible only in the page-2 state (§3.5) |
| **NEW** code block | bg `#2b2b2b`, text `#f8f8f2`, monospace 14/19.6, padding 7px; hljs `.xml` `#d4d0ab`, `.hljs-attr` `#ffa07a` | style guide only (no post uses `pre`) |

Typography: `"Polysans Neutral", Arial, sans-serif`, weight 400 everywhere (rich-text `strong` is **also 400**; bold is expressed by colour white vs .6-white). Letter-spacing normal. Reused size roles: hero `.white-text.hero-home`, `._56-px-text`, `._30px-text`, `._16px-text`, `._14px-text` (CLONE_SPEC §1.4). Page-specific overrides are listed per element below.

Spacing: `--_paddings--margins---padding` 36 → 36 → 20 → 20; left rail `--_size---left-side` 26.7361vw (385 / 273.78 / 205.33; collapses ≤767).

---

## 3. Blog index `/blog`

### 3.1 Section order and metrics (y / height)
| # | Section (classes) | 1440 | 1024 | 768 | 390 |
|---|---|---|---|---|---|
| 1 | `section.hero.blog.hide-on-scroll` (contains the h1 and the featured post) | 0/1107.4 | 0/921.2 | 0/917.6 | 0/935.8 |
| 2 | `section.all-blogs-section` | 1107.4/1849.1 | 921.2/1495.9 | 917.6/1275.5 | 935.8/2023.3 |
| 3 | `section.cta-section` (shell) | 3100.5/1506 | 2519.5/1070.9 | 2269.9/1152 | 2998.1/1275 |
| 4 | `section.footer.section` (shell) | 4606.5/750.1 | 3590.4/683.7 | 3421.9/713.3 | 4273.1/1077.6 |
| – | `div.footer-bottom-wrap` (sticky) | h 365.1 | 294.4 | 280.3 | 188.2 |
Document height: 5722 / 4569 / 4416 / 5539 (page 1, before Load More). After Load More at 1440: 6971.

### 3.2 Hero `section.hero.blog.hide-on-scroll`
- flex column; padding-top 110 (90 at ≤479); gap `7vw` (100.8 / 71.68), 30 at ≤991 *(CSS)*; height auto; no bottom padding.
- **H1** `h1.white-text.hero-home.blog`, text "Transform 9 Blog: Expert Insights & Growth Strategies" (source text, including the space in "Transform 9"). It uses the homepage hero H1 role: 93.6 / 66.56 / 75 / 49.92 px, line-height 101% (94.54 / 67.23 / 75.75 / 50.42), white. Margins: top 120 (12 at 390), bottom 9 (24 at 390), left 76 / 76 / 47 / 34. `.blog` adds margin-right 114px *(CSS)*. Box widths 1198.1 / 834 / 607 / 242. Rendered lines at 1440: "Transform 9 Blog: Expert" / "Insights & Growth" / "Strategies" (3 lines, 283.6 tall). At 390: 6 lines, 302.5 tall. It is split into per-word `span.gsap_split_word` (inline-block, relative) by GSAP SplitText for BLOG-M3. The clone should render words as inline-block spans.
- **Featured post** `div.featured-post.w-dyn-list > .featured-list > .featured-item > a.post-hor-wrap.featured.w-inline-block` → the newest post (`content/blog/_index.json → page1.featured[0]`). Full-bleed flex row (column at ≤767):
  - `div.post-img-vert-wrap`: width = left rail (385 / 273.8 / 205.3; 100% at ≤767), height `33.403vw` (481 / 342) *(CSS)*, `auto; min-height 40vw` at ≤991, `53vw` (206.7) at ≤767. bg `#020801`, borders top/right/bottom 1px `.2`, overflow hidden. Contains `div.blog-img-vert` (absolute fill, `background-size:cover; background-position:50% 50%`, the post hero image) and `div.bg-noise.stat-img` (opacity .5).
  - `div.blog-header-right.featured`: flex column `space-between`, padding 36 (20 ≤991), row-gap 150 (78 = 20vw at 390), bg `#020801`, borders top+bottom 1px `.2` (top none ≤767). Measured 1055×484 @1440, 750.2×408.9 @1024, 562.7×345.6 @768, 390×270.6 @390.
    - `h2._56-px-text.white.featured-head` (post title), max-width 70% (none ≤767): 56.0 / 39.82 / 30 / 30 px; line-height 100% at ≥992 and 110% (33) at ≤991.
    - `div.featured-bottom` (flex `space-between`, align flex-end; column with gap 24 at ≤479):
      - `div.testim-bottom-cont.blog`: flex row, gap 5vw (72 / 51.2 / 38.4), 16 at ≤767. Two `div.testim-point-wrap.blog` (1px `#a2fa8e` left border, padding-left 16, gap 16). Each holds `div._16px-text.white-text.blog-point` (16/22.4; 14/19.6 at 768 and 390; margin-left 43 at ≥480): author, then date.
      - `div._30px-text.white._w-underline.featured` "Read Article" (30 / 21.33 / 18 px; line-height 1.2) with an underline pair (M12). `display:none` at ≤479.
- Featured item at page load: "AI Voice Agents for athenahealth: 7 Questions to Ask Before Choosing a Platform", author **"Transorm9"** (sic: a CMS typo on this post only, preserve it), "September 17, 2026".

### 3.3 All articles `section.all-blogs-section`
- border-bottom 1px `.2`; margin-bottom `10vw` (144 / 102.4 / 76.8 / 39).
- `div.articles-head-wrap`: margin-left = rail, border-left 1px `.2`, padding `18vw 36px 36px` (259.2 / 184.32 top). At ≤991: no margin or border, flex column, padding-top 130, sides 20.
  - `div._56-px-text.white.right-side-heading` "All Articles": 56 / 39.82 / 30 / 30, line-height 100%, max-width 70%. At 1440 its top is y 1366.6.
- `div.blogs-list-wrap` (border-top 1px `.2`, relative):
  - `div.left-sticky-wrap.blogs` (absolute, rail width, full height; `display:none` ≤991) > `div.left-sticky-block.blogs` (sticky top 60, padding 36, gap 24) > `div._16px-text.white-text` "Thoughts & Notes" (ml 43).
  - `div.blog-list-right`: margin-left = rail, border-left 1px `.2`, flex column, gap 10vw. At ≤991: ml 0 and no border.
    - `div.posts-wrap` padding 36/20 top and bottom > `div.blogs-wrapper.all.w-dyn-list` (padding 0 36, 0 20 ≤991) > **`div.blogs-list.all.w-dyn-items`** with `fs-list-element="list" fs-list-load="more" fs-list-resetix="true"`: **CSS grid of 2 equal columns**, gap 36 (20 ≤991); 1 column at ≤767. Columns measured 473 / 320.6 / 354 / 350.
    - **Card** `div.blogs-item.w-dyn-item > a.post-link-block.bl.w-inline-block` (border 1px `.2`, flex column, height 100%). Card size 473×588.4 / 320.6×465.3 / 354×409.4 / 350×390.2.
      - `div.post-img-wrap` (overflow hidden, height `17.292vw` = 249 / 177.1; 24vw = 184.3 at 768; 48vw = 187.2 at 390) > `div.post-img-hor` (absolute fill, cover, 50% 50%, the hero image) + `div.bg-noise.stat-img`.
      - `div.post-bottom-wrap` (padding 36/20, border-top 1px `.2`, flex column `space-between`, row-gap 7vw = 100.8 / 71.68; 11vw = 84.48 at 768; 18vw = 70.2 at 390):
        - `div._30px-text.white.blog-title` (title): 30 / 21.33 / 20 / 18 px; line-height 1.2 at ≥992, 130% at ≤991 (26 / 23.4).
        - `div.post-bottom-line-wrap` (flex, gap `clamp(40px,2.778vw,2.778vw)` = 40 @1440–1024; 24 ≤991): two `div.testim-point-wrap.blog.post-cell` (1px green left border, padding-left `clamp(12px,.833vw,16px)` = 12) > `div._14px-text.white-text.blog-data` (14/19.6): author, date.
        - `div.post-arrow-wrap`: absolute bottom-right, 100×100, bg `#0033cc`, flex-centred `img.arrow.white.post-arrow` 28×28 (`arrow.svg`). **opacity 0 at rest**; `display:none` at ≤991.
    - **Pagination** `div.w-pagination-wrapper.pagination` (role navigation, aria-label "List"): flex `space-between`, align flex-end, margin-top 10vw (144 / 102.4), 130 at ≤991. At ≤479: column-reverse, align flex-start, gap 28, margin-top 80.
      - `div._16px-text.white-text.blogs-descr` "Our blog is regularly updated with insights, tips, and success stories to help you improve patient experience and stay ahead in healthcare." max-width 36ch (368.64), 50vw at ≤767, none at ≤479; ml 43 at ≥480.
      - `a.w-pagination-next._30px-text.white._w-underline.load-more` (aria-label "Next Page", href `?523ae0d4_page=2`) "Load More": transparent, no border or padding; 30 / 21.33 / 18 / 24 px; underline pair M12.
      - `a.w-pagination-previous`: `display:none` on page 1.
      - `div.w-page-count.page-count` "1 / 2": always `display:none`.

### 3.4 Blog-index interactions
| State | Measured |
|---|---|
| Card hover (`.post-link-block.bl`, all breakpoints; IX2 a-48 / a-49) | see BLOG-M6. End state: `.post-bottom-wrap` bg `#fff`, title and meta text `#020801`, meta-cell left rule `#0033cc`, image `scale(1.1)`, arrow tile opacity 1. On mouse-out: bg `rgba(255,255,255,0)`, text `#fff`, rule `#a2fa8e`, **image `scale(1.01)`** (not 1), arrow 0. |
| Featured hover (IX2 a-50 / a-51) | `.blog-img-vert` scale 1 → 1.1 (out → 1). `featured-head` opacity is set to 1 in both directions (no-op). Hovering the card does **not** play the "Read Article" underline; that only runs when the pointer is over the underline link itself (M12). |
| Load More hover | M12 (measured end: `_1` width 0, `_2` 144.67 @1440). |
| **Load More click** | Finsweet `fs-list-load="more"`: page-2 items are fetched in the background after load (no request is seen at click time) and **appended in place** under the first 4. No animation (new item opacity 1 at 100 ms). URL unchanged. The Load More link gets `display:none`; the description remains. 8 cards total, in order: page1 ×4 then page2 ×4 (see `content/blog/_index.json`). Hover works on the appended cards (fs-list-resetix). List height 2461.6 @1440; doc height 6971. Screenshot `recon/pages/blog/shots/state-1440-load-more-after.png`. |

### 3.5 Pagination `?523ae0d4_page=` (the homepage finding)
- `523ae0d4` is the id of **this blog-index `.blogs-list.all` CMS list**. Its links are relative (`href="?523ae0d4_page=2"`). The crawler (`recon/crawl.mjs`, whose `norm()` resolves hrefs against the site root instead of `/blog`) turned that into `/?523ae0d4_page=2`. **The homepage has no paginated list.** `/?523ae0d4_page=2` returns the normal homepage: the server HTML is byte-identical except for one runtime-generated pre-IX hide-list selector (`.h1-text` missing), with no content change. **The clone needs no homepage state for it.**
- The real page 2 is `/blog?523ae0d4_page=2`. **Server HTML** (static): the same template with list items 5–8 (why-generic, why-traditional-ivr, 12-month-shift, redefining), `a.w-pagination-previous` (href `?523ae0d4_page=1`, "Previous" with a chevron svg), no next link, and page count "2 / 2".
- **Live runtime at that URL (measured)**: Finsweet re-initialises and **shows the page-1 items** (athenahealth, january, ent, orthopedic) with page count "1 / 2" and a "Load More" (`?523ae0d4_page=2`) that **appends nothing when clicked**. It also shows the **unstyled Webflow "Previous" button** (111.8×39.6, `#fafafa`/`#ccc`/`#333`, at x 990.6 @1440 between the description and Load More). Screenshot `recon/pages/blog/shots/state-1440-page2-pagination.png`. This looks like a live bug.
- **Decision needed (main session):** the clone should either (a) treat `/blog?523ae0d4_page=2` like `/blog` (recommended; it is what users actually get, minus the broken button), (b) replicate the broken live state exactly, or (c) render the static server page 2. Only Load More (append) is needed for normal use.

---

## 4. Blog post template `/blog/<slug>`

Measured on: **the-12-month-shift…** (longest body: 15.9k chars, 46 blocks, ul, em, links), **redefining-healthcare-ai** (the only post using blockquote and 5 rich-text slots), **ent-reimbursement…** (h1, h3, ol), and **ai-voice-agents-for-athenahealth…** (h3, 7 ul, 39 li). The other 4 posts were extracted (content) and structurally compared; they use the same classes.

### 4.1 Section order and metrics (y / height)
| # | Section | 12-month 1440 / 1024 / 768 / 390 | redefining 1440 / 1024 / 768 / 390 |
|---|---|---|---|
| 1 | `section.blog-top-header` (margin-top 60) | 60/520.4 · 60/448.8 · 60/481.4 · 60/542.3 | 60/481 · 60/369.1 · 60/389 · 60/476.3 |
| 2 | `section.post-body-section` | 580.4/4102.3 · 508.8/5365.8 · 541.4/5109.4 · 602.3/9512.8 | 541/2380.4 · 429.1/2861 · 449/2679.8 · 536.3/4302.8 |
| – | `section.read-next-section.read-next.hide` | **`display:none`** at all widths (see §4.6) | same |
| 3 | `section.cta-section` (shell) | 4682.7/1506 · 5874.6/1070.9 · 5650.8/1152 · 10115.1/1275 | 2921.4/1506 · … |
| 4 | `section.footer.section` (shell) | 6188.7/750.1 · … | 4427.3/750.1 · … |
Doc height: 12-month 7304 / 7924 / 7796 / 12656; redefining 5543 / 5339 / 5274 / 7380; ent 7570 / 7837 / 7707 / 11634; athenahealth 8037 / 8222 / 8119 / 11921.

### 4.2 Header `section.blog-top-header` (flex row; margin-top 60)
- `div.post-hor-wrap` (flex; column ≤767):
  - `div.post-img-vert-wrap.blog-post`: rail width (385 / 273.8 / 205.3; 100% ≤767). Height 100% of the row with `min-height:33.403vw` (481 / 342), `min-height:40vw` ≤991, `53vw` ≤767 (206.7). bg `#020801`, border-right and border-bottom 1px `.2` (no top border). Contains `div.blog-img-vert` (absolute, cover, 50% 50%, hero image) + `div.bg-noise.stat-img` (.5).
  - `div.blog-header-right`: flex column `space-between`, align flex-start, padding 36 (20 ≤991), gap 150 (100 at ≤767), relative. At 390 it sits below the image at y 266.7.
    - `div.post-top-linear` (absolute top-left, width 40%, height 100%, `linear-gradient(270deg,#fff0,#020801)`): measured 422 / 300.1 / 225.1 / 156 wide.
    - `div.blog-top` (flex column, gap `1.667vw` = 24 / 17.07 / 12.8; 16 at ≤479):
      - Back link `a.icon-w-text.w-inline-block` href `/blog` (opacity .5, flex, gap .4vw = 5.76 / 4.1 / 3.07 / 1.56, 28px tall): `div.back-icon-wrap` (28×28, overflow hidden, relative) holds two `img.arrow.white` (`arrow-white-left.svg`, 28×28): `.back-1` in flow and `.back-2` absolute at left 28 (just outside the clip). Then `div._16px-text.white-text` **"Back to Blog"** (16/22.4; 14/19.6 at 768; ml 43 at ≥480).
      - Title `h2._56-px-text.white.blog-page-title`: 56.0 / 39.82 / **42** / **30** px; line-height 100% at ≥992, **110%** at ≤991 (46.2 / 33); max-width 70% (≥992), 90% (≤991), none (≤479). 12-month title box 688.1×224 @1440 (4 lines).
    - `div.testim-bottom-cont.blog.open-page` (flex row, gap 5vw = 72 / 51.2 / 38.4; 32 at ≤767; max-width 384 at 768): two `div.testim-point-wrap.blog` (1px `#a2fa8e` left border, padding-left 16) > `div._16px-text.white-text.blog-point`: author, date (16/22.4; 14/19.6 at 768 and 390).
- There is no category, tag, read-time or author avatar: **the CMS has no such fields** (none in HTML or JSON-LD).

### 4.3 Body `section.post-body-section`
- bg `#020801`, border-top and border-bottom 1px `.2`, relative, noise overlay `div.bg-noise`.
- `div.post-body-wrap`: margin-left = rail, padding 0 36 (0 20 ≤991), border-left 1px `.2`, flex column, white. At ≤991: ml 0 and no border.
  - Hidden `div.rich-text-post.example-for-edit` (display none): the designer's style guide. **Do not render it.** It carries the Twitter embed and YouTube iframe noted in §1.
  - `div.post-block-wrap` ×5 (max-width 960px) = slots `1st`, `bl-2`, `bl-3`, `bl-4`, `bl-5`. Empty slots carry `w-condition-invisible` → `display:none`. Each holds a `div.rich-text-post.w-richtext`:
    - `.rich-text-post`: width 100%, border-top 1px `.2`, padding-top `max(8px,.556vw)` (8.0 @1440), padding-bottom `max(36px,2.5vw)` (36). At ≤991: padding 16 top and bottom. **`._1st` has no top border.** So each filled slot after the first draws a full-width hairline between blocks (visible in redefining-healthcare-ai).
    - Base font inside is 14/19.6 white; children override it (§4.4).
  - `div.left-sticky-wrap` (absolute, top 0, rail width, full height) > `div.left-sticky-block` (sticky **top 60**, padding 36, gap 24; measured pinned at viewport top 60 while scrolling):
    - `div._16px-text.white-text.share-post` "Found this useful? Share it" (ml 43; wraps to 2 lines at 1024: 158.8 wide).
    - `div.share-links` (flex, gap 16): 3 × `a.share-link-block.w-inline-block` (opacity .5, width `clamp(24px,1.667vw,32px)` = 24; hover opacity 1, `transition: opacity .3s cubic-bezier(.25,.46,.45,.94)`) > `img.share-icon` (width 100%): X (`x-icon.svg`), Facebook (`fb-icon.svg`), LinkedIn (`in-icon.svg`), each 24×24.
    - **At ≤991 the share block moves below the body**: `.left-sticky-wrap` becomes relative, width 100%, and is placed after `.post-body-wrap` in the DOM. `.left-sticky-block` is static, padding 36 / 20. Measured at y 5510.2 @768 and 9971.7 @390 for 12-month.

### 4.4 Rich-text element styles (`.rich-text-post …`); identical on every post
Values at 1440 / 1024 / 768 / 390. No letter-spacing, weight 400, family PolySans.
| Element | font-size | line-height | colour | margins / padding | notes |
|---|---|---|---|---|---|
| `h1` (only ENT post, 1×) | 56.0 / 39.82 / 30 / 30 (`3.889vw`; 30 ≤991) | 100% (56 / 39.82) · 120% (36) ≤991 | `#fff` | mt `max(24px,1.667vw)` = 24.0, mb `max(16px,1.111vw)` = 16 | |
| `h2` | 30 / 30 / 26 / 26 (`max(30px,2.083vw)`; 26 ≤991) | 1.2 (36 / 36 / 31.2 / 31.2) | `#fff` | mt 24.0, mb 16 | Some posts wrap the h2 text in `<strong>` (no visual change) |
| `h3` | 20.0 / 20 / 20 / 20 (`max(20px,1.389vw)`; 20 ≤991) | 1.2 (24) | `#fff` | mt `max(30px,2.083vw)` = 30, mb 16 | |
| `h4`, `h5`, `h6` (style guide only) | 16 (clamp 16–18) | 1.4 (22.4) | `#fff` | mt 24.0, mb 16 | h6 explicitly sets the family |
| `p` | 16 (clamp 16–18) | 22.4 | `rgba(255,255,255,.6)` | mt `max(12px,.833vw)` = 12, mb 12 | Empty `<p>‍</p>` (ZWJ) spacer paragraphs exist: keep them (22.4 tall + margins) |
| `strong` (in p / li / h2) | inherits | inherits | **`#fff`** | – | weight stays 400; "bold" = white vs .6 |
| `em` | inherits | inherits | `.6` white | – | italic (synthetic, since the font has only 400 normal) |
| `a` | inherits | inherits | `#fff` | – | `text-decoration: underline`; **no hover style and no transition**; `target="_blank"` on some links, as authored (keep per-link from JSON) |
| `ul` | 14 base | 19.6 | `#fff` | mt 12, **mb 0**, padding-left `max(32px,2.222vw)` = 32 | disc markers; Webflow `.w-richtext ul{overflow:hidden}` |
| `ol` | 14 base | 19.6 | `#fff` | mt 12, **mb 10**, padding-left 32 | decimal |
| `li` | 16 | 22.4 | `.6` white | mb `max(4px,.278vw)` = 4.0 | marker colour follows li colour (.6 white) |
| `blockquote` | 20.0 / 20 / 20 / 20 (`clamp(1.25rem,1.389vw,1.5rem)`; 20 ≤991) | 1.3 (26) | `#fff` | mt 12, mb 0, padding 8px 16px, **border-left 6px solid `#a2fa8e`** | no background |
| `figure` (style guide only) | – | – | – | mb 10; flex column; width/min-width 100% | `img` width 100%; Webflow figure `max-width:60%` is overridden to 100% for fullwidth |
| `figcaption` (style guide only) | 14 (clamp 14–16) | 19.6 | `rgba(255,255,255,.5)` | mt 16 | italic, left |
| `pre.w-code-block` (style guide only) | 14 monospace | 19.6 | `#f8f8f2` on `#2b2b2b` | padding 7 | see §2 |
Faux bullets: several posts (orthopedic, ivr, generic…) use **paragraphs beginning with "• "** plus a leading `<strong>` label rather than `ul`. They are `p` blocks in the JSON and are rendered as plain paragraphs.

### 4.5 Post-level interactions
| State | Measured |
|---|---|
| Back link hover (IX2 a-46 / a-47, **≥992 only**) | link opacity .5 → 1; both arrows `translateX(0 → −100%)` = −28px (the `.back-2` arrow slides into the clip from the right while `.back-1` exits left). 300ms outQuad (−27.66 at 250ms). Out: opacity .5 and x 0, 300ms outQuad. ≤991: no hover animation (static .5). |
| Share icon hover | opacity .5 → 1, CSS transition .3s cubic-bezier(.25,.46,.45,.94) |
| Share click | Live `href="#"` + Finsweet `fs-socialshare-element="x|facebook|linkedin"` opens a share popup at runtime (Finsweet script D1-stripped). **Decision needed**: implement as real share-intent links (`https://twitter.com/intent/tweet?url=…`, `https://www.facebook.com/sharer/sharer.php?u=…`, `https://www.linkedin.com/sharing/share-offsite/?url=…`, target _blank, rel noopener), or keep inert `#`. Popup size and exact URLs were not observed (third-party behaviour). |
| Rich-text links | no hover change |
| Nav | stays dark (no M4) |

### 4.6 Read-next section (blog posts): hidden
`section.read-next-section.read-next.hide` is `display:none` on every post. It still contains 2 CMS items (the data is in `content/blog/<slug>.json → readNext.items`, `visible:false`). Its structure matches the case-study read-next (case-studies spec §4.4) but with a `w-row` 2-column list (`.w-col.w-col-6`). IX2 e-44 / e-45 (a-48 / a-49 card hover) target it. **Do not render it** (live parity). Build it only if the main session wants it; it needs no new styles beyond the index card.

---

## 5. Motion inventory (CLONE_SPEC §18 format; new ids)

IX3 ease map as in §18 (2 power1.out, 26 expo.out). "Timeline t" = seconds after the window `load` event (IX3 `wf:load`). The IX3 data is in `recon/pages/blog/shared/ix-index-ix3-readable.txt` (index: i-7723a9c6 / t-04b74f4a) and `ix-detail-ix3-readable.txt` (posts: i-452c7296 / t-72fecfeb). The measured curve is in `recon/pages/blog/shared/states-1440.json` and `load-timeline-detail.json`. **Before `load` fires the page is covered by the black preloader** (measured load at 3.2–5.7 s; one outlier at 50 s caused by the hidden third-party iframes). **Clone recommendation:** start the timeline once fonts and the first paint are ready, not on window load.

| # | Element | Trigger | Properties | Duration | Easing | Delay / stagger | Repeat | Breakpoints | Source |
|---|---|---|---|---|---|---|---|---|---|
| BLOG-M1 | `.preloader-wrap` (black full-screen) | page load | opacity 1 → 0 (stays display block, pointer-events none) | 0.1s | power1.out (default) | t 0 | – | all | IX3 index + post. Measured 1 → .14 in 61ms, 0 by ~130ms |
| BLOG-M2 | `.nav-menu`; **index:** `.featured-post`, `.all-blogs-section`; **post:** `.blog-top-header`, `.post-body-section` | page load | opacity 0 → 1 | 1.2s | expo.out | t 0.1 | – | all | measured .153 at +130ms, .606 at +260ms, .92 at +530ms, ≈1 at +1.26s |
| BLOG-M3 | index `h1.white-text.hero-home` split into **words** | page load | per word: opacity 0 → 1, translateY 50% → 0 (47.27px at 1440 = 50% of the 94.54 line box) | 1.0s each | expo.out | t 0.1, stagger **0.1s per word** (8 words → last starts at 0.8) | – | all | IX3 `splitText:{type:'words'}`; measured word 4 starts ≈ +0.33s, word 8 ≈ +0.73s |
| BLOG-M4 | index `.bg-pixels-wrapper` (bg video) | page load | opacity 0 → 1 | 0.08s | power1.out | t 0.02 | – | all | then M3-equivalent scroll fade (§1) |
| BLOG-M5 | post `.bg-pixels` / `.bg-pixels-overlay` | page load | `.bg-pixels` 0 → 1 (0.08s, t .02); overlay 1 → 0 (0.7s, t 0.6; index timeline has the same overlay at t 0.61 but there is no overlay element on the index) | | power1.out | | – | all | **invisible** (black on black). Optional. |
| BLOG-M6 | `a.post-link-block.bl` (index cards; also appended cards) | mouseover / mouseout | over: `.post-bottom-wrap` bg → `#fff`; `._30px-text.white` and `._14px-text.white-text` colour → `#020801`; `.testim-point-wrap.post-cell` border-left colour → `#0033cc`; `.post-img-hor` scale → 1.1; `.post-arrow-wrap` opacity → 1. out: bg → `rgba(255,255,255,0)`, text → `#fff`, rule → `#a2fa8e`, image scale → **1.01**, arrow → 0 | 300ms | outQuad | – | – | all (the arrow is display:none ≤991) | IX2 e-50 / e-51 → a-48 / a-49. Mid-state at 150ms: bg rgba(216,216,216,.85), scale 1.089 (IX2 interpolates from transparent black) |
| BLOG-M7 | featured `a.post-hor-wrap.featured` | mouseover / out | `.blog-img-vert` scale 1 → 1.1 / → 1 | 300ms | outQuad | – | – | all | IX2 e-52 / e-53 → a-50 / a-51 |
| BLOG-M8 | post back link `a.icon-w-text` | mouseover / out | see §4.5 | 300ms | outQuad | – | – | ≥992 | IX2 e-42 / e-43 → a-46 / a-47 |
| BLOG-M9 | `.share-link-block` | CSS hover | opacity .5 → 1 | .3s | cubic-bezier(.25,.46,.45,.94) | – | – | all | CSS |
| BLOG-M10 | `.left-sticky-block` | scroll | `position:sticky; top:60px` | – | – | – | – | ≥992 | CSS |
| reuse | "Read Article", "Load More", CTA links | hover | M12 underline pair | | | | | | |
| reuse | CTA pixel transition, footer underline, nav, modal | | M8c, M12b, M15–M18, M11 | | | | | | |
| reuse | index bg-video scroll fade | scroll `.hero.hide-on-scroll` top top → top −10% | M3 values | | | | | | IX3 i-37f61121 |

There are no scroll-triggered reveals of cards or rich text, and nothing animates on Load More append. Reduced motion is not honoured by the original (same as §18).

---

## 6. Forms and embeds
- **No page-specific forms.** The shell forms (CTA phone input + "Call Alex" modal, footer HubSpot) follow D2.
- **Embeds needing a decision:** only in the hidden style-guide block (Twitter tweet embed + YouTube iframe). They are never visible. **Recommendation: drop them** (not rendered, no request). No real post contains an image, video or embed (verified across all 8: block types are only h1/h2/h3/p/ul/ol/blockquote).
- Share buttons: see §4.5 (decision).

## 7. Content (data-driven)
- `content/blog/_index.json`: index metadata, hero heading, `page1.featured[]`, `page1.list[]` (4), `page2.list[]` (4), pagination links, `fs-list` attributes, `paginationParam: "523ae0d4_page"`, `pageSize: 4`. Card fields: `href, title, image, meta[author,date]`.
- `content/blog/<slug>.json` ×8: `slug, url, template, meta{title, description, og*, twitter*, jsonLd, wfPage, wfCollection, wfItemSlug}, title, author, date, heroImage, backLink, shareLabel, share[], slots[{slot, visible, empty, blockCount}], readNext{visible:false, items[]}, summary (= meta description), category: null, tags: [], body[]`.
- `body[]` is the ordered block list across visible slots: `{slot, type: h1|h2|h3|p|ul|ol|blockquote, text, inlines[] | items[{text, inlines[]}], spacer?}`. `inlines[]` runs: `{text, bold?, italic?, link?{href, target?}, br?}`. Adjacent runs with the same marks are merged. **Text is exact** (curly quotes, em-dashes, "‍" ZWJ spacers, the source typo "Transorm9").
- Render slot boundaries: every slot after `1st` starts a new `.rich-text-post` with the top hairline.
- Posts, index order (newest first): athenahealth (Sep 17 2026, author "Transorm9"), january call volume (Sep 16), ENT reimbursement (Aug 31), orthopedic (Aug 18), why-generic (Aug 10), why-traditional-IVR (Aug 7), 12-month-shift (Aug 6), redefining (Jan 15 2026).

## 8. Asset inventory (live URLs; not downloaded to the project)
Base `https://cdn.prod.website-files.com/`. Shell assets (logo, noise, CTA image, font, footer logo, bg video, poster, tablet-pixels, burger and close icons) are the homepage ones in ASSET_MANIFEST.md.
| Asset | URL (suffix) | Type / intrinsic | Used by |
|---|---|---|---|
| Hero athenahealth | `6961001f1082da89878fcb00/6aac50cd7d67b3ee047d814c_featured-compressed.jpeg` | JPEG 2000×1116, 288 KB | featured, card, post header, og |
| Hero january | `6961001f1082da89878fcb00/6aaaeb672e1e0997bba4a0a0_featured-compressed.jpeg` | JPEG 2000×1116, 287 KB | card, post, og |
| Hero ENT | `6961001f1082da89878fcb00/6a9620058ff8e8731722e05d_featured.png` | PNG 1376×768, 1.72 MB | card, post, og |
| Hero orthopedic | `6961001f1082da89878fcb00/6a84b734cfe28e9a4355d574_featured-compressed.jpeg` | JPEG 2000×1116, 242 KB | card, post, og |
| Hero why-generic | `6961001f1082da89878fcb00/6a7a5062d71f1eb2d1d87d96_front%20desk%20image.jpg` | JPEG 1000×667, 68 KB | card, post, og |
| Hero why-IVR | `6961001f1082da89878fcb00/6a76262bcb74f74bb12693ea_Screenshot%202026-08-07%20at%201.38.27%E2%80%AFPM.png` | PNG 2390×1350, 4.05 MB | card, post, og |
| Hero 12-month | `6961001f1082da89878fcb00/6a74a84e37d8d93140d6c51a_Screenshot%202026-08-06%20at%2010.29.05%E2%80%AFAM.png` | PNG 2396×1346, 2.51 MB | card, post, og |
| Hero redefining | `6961001f1082da89878fcb00/6970b17878db95b46a287768_5.webp` | WebP 1200×675, 69 KB | card, post, og |
| Back arrow | `684a82e3294991569082d379/68af375b6ed817d8303e6d01_arrow-white-left.svg` | SVG 28×28 | post back link (×2) |
| Card arrow | `684a82e3294991569082d379/687f9e315c0a9b7f071b0a0c_arrow.svg` | SVG 28×28 | `.post-arrow-wrap` (already in homepage set) |
| X icon | `684a82e3294991569082d379/696e6fc3c1ef2e8dba004c36_x-icon.svg` | SVG 24×24 | share |
| Facebook icon | `684a82e3294991569082d379/696e6fc3ae5b9aa0a271a803_fb-icon.svg` | SVG 24×24 | share |
| LinkedIn icon | `684a82e3294991569082d379/696e6fc3101115fca7e234e0_in-icon.svg` | SVG 24×24 | share |
| (hidden) style-guide image | `…69691ac291fe330196ea732a_test-img.webp` | failed to load (0×0) | not rendered |
Images are CSS `background-image` (cover, centre); there is no srcset for them. Large PNGs (1.7–4 MB) are served as-is on live. Optimising local copies is a build decision.

## 9. Unknowns and flags
1. `/blog?523ae0d4_page=2` live behaviour is broken (§3.5): decision needed.
2. Share-button behaviour depends on the Finsweet runtime: decision needed (§4.5).
3. Live timeline start is tied to window `load`, which third-party scripts delay (3–6 s typical, 50 s once). The clone should use its own ready signal (flagged, not a measured value).
4. Touch behaviour of card hovers on mobile was not tested. The IX2 events are listed for all breakpoints, so a tap likely sticks the hover state until the next tap elsewhere.
5. Heading sizes above 1440 keep scaling (h1 3.889vw, h2 `max(30px,2.083vw)`, h3 `max(20px,1.389vw)`, blockquote clamp max 24, p clamp max 18). These were not spot-measured above 1440.
6. The blog-post read-next is hidden on live. Its data exists, but its layout at ≥992 (`w-row`/`w-col-6`) was not measured because it is display:none.

## 10. Evidence (`/Users/riyaghosh/V3/transform/recon/pages/`)
- `blog/html/*.html`: raw server HTML (index, page 2, 8 posts). `blog/shared/home.html`, `blog/shared/home-page2.html`: homepage with and without the param.
- `blog/measure/<page>-<w>.json`: per class-combo computed styles and rects, sections, shell probes, style-guide clone, network. `blog/table-*.txt`: cross-viewport tables.
- `blog/outline-*-1440.txt`: rendered DOM outlines. `blog/shots/*-full.png`, `state-1440-*.png`.
- `blog/shared/page-rules.css`: source CSS for these families' classes (by media query). `blog/shared/new-classes.txt`: classes not in `homepage-rules.css`.
- `blog/shared/`: `ix-index.json`, `ix-detail.json`, `*-ix3-readable.txt`, `ix2-pages-readable.txt` (IX3/IX2 data); `states-1440.json`, `load-timeline-detail.json` (measured motion and states).
- `blog/tools/*.mjs|py` (run from `recon/pages/`): the scripts used (outline, measure, states, loadtl, page2, extract-content, ixextract, cssrules, table).

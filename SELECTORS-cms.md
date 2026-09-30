# Selectors: CMS templates (/blog, /blog/<slug>, /case-studies, /case-studies/<slug>)

These are the QA/IA hooks for the four CMS templates. Each section root has `data-section`, and each shared piece has `data-component`. Shared component styles and the PROMOTE tokens are in `src/components/cms/cms.css`. Page-only rules are in `src/styles/page-{blog-index,blog-post,case-studies-index,case-study}.css`. Data comes from `src/data/cms.js`, which loads `content/blog/*.json` and `content/case-studies/*.json`.

Webflow class names are kept for page-specific classes, so a clone rect can be diffed against `recon/pages/*/measure/*.json` by class combo. For the comparator and its latest output, see `recon/build-cms/compare.mjs` and `recon/build-cms/compare-vs-live.txt`. Shared roles use the homepage helpers; the renamed classes are listed at the end.

## Page sections (in DOM order)

| Template | `data-section` | Root selector | Component | Spec |
|---|---|---|---|---|
| /blog | `hero` | `section.hero.blog.hide-on-scroll` | `cms/IndexHero.jsx` (+ `cms/FeaturedPost.jsx`) | blog §3.2 |
| /blog | `all-articles` | `section.all-blogs-section` | `cms/ListSection.jsx` + `cms/PostCard.jsx` | blog §3.3 |
| /case-studies | `hero` | `section.hero.blog.hide-on-scroll.cs` | `cms/IndexHero.jsx` | cs §3.2 |
| /case-studies | `all-case-studies` | `section.all-blogs-section.cs` | `cms/ListSection.jsx` + `cms/CaseCard.jsx` | cs §3.3 |
| posts + studies | `post-header` | `section.blog-top-header` (margin-top 60) | `cms/DetailHeader.jsx` | blog §4.2, cs §4.2 |
| posts + studies | `post-body` | `section.post-body-section` | `cms/PostBody.jsx` | blog §4.3 |
| studies only | `read-next` | `section.read-next-section.read-next` | `cms/ReadNext.jsx` | cs §4.4 |
| all four | `cta`, `footer`, `footer-bottom` | shell (`src/components/Cta.jsx`, `Footer.jsx`) | reused unchanged | CLONE_SPEC §15, §17 |

On live, the blog-post read-next section (`.read-next-section.read-next.hide`) is `display:none`. **It is not rendered**, but its data stays available as `getPost(slug).readNext`.

`data-section="hero"` on both index heroes is the trigger for the shell's M3b video fade (PageLayers).

## Components (`src/components/cms/`)

| `data-component` | File | Key selectors |
|---|---|---|
| `featured-post` | `FeaturedPost.jsx` | `.featured-post > .featured-list > .featured-item > a.post-hor-wrap.featured`, `.post-img-vert-wrap > .blog-img-vert`, `.blog-header-right.featured`, `h2.text-56.featured-head`, `.featured-bottom`, `.w-underline-link.featured` ("Read Article") |
| `card-list` | `ListSection.jsx`, `ReadNext.jsx` | `.blogs-list.all` (grid, blog) / `.blogs-list.cs` (column, case studies + read-next), `role="list"` |
| `post-card` | `PostCard.jsx` | `.blogs-item > a.post-link-block.bl`, `.post-img-wrap > .post-img-hor`, `.post-bottom-wrap`, `.blog-title`, `.post-bottom-line-wrap`, `.testim-point-wrap.blog.post-cell > .text-14-white.blog-data`, `.post-arrow-wrap > img.arrow.post-arrow` |
| `case-card` | `CaseCard.jsx` | `.blogs-item.cs > a.post-link-block.cs`, `.post-img-wrap.cs > img.cl-wh-logo-on-cell + img.cl-bl-logo-on-cell`, `.post-bottom-wrap.cs` (index) / `.post-bottom-wrap` (read-next), `.cs-title` (index) / `.rn-title` (read-next), `.post-arrow-wrap` |
| `cs-highlight` | `CaseVariant.jsx` | `.label-16.highlight-text-alt[.post-page]` (pre-wrap, keeps the CMS `\n`) |
| `cs-stats` | `CaseVariant.jsx` | `.testim-bottom-cont.blog[.open-page].cs > .testim-point-wrap.blog.cs > .testim-num.cs + .label-16.blog-point.cs` |
| `meta-points` | `MetaPoints.jsx` | `.testim-bottom-cont.blog[.open-page] > .testim-point-wrap.blog > .label-16.blog-point` (author, date) |
| `back-link` | `BackLink.jsx` | `a.icon-w-text > .back-icon-wrap > img.arrow.back-1 + img.arrow.back-2`, `.label-16` |
| `rich-text` | `RichText.jsx` | `.post-block-wrap[.bl-2…bl-5][data-slot] > .rich-text-post[._1st].w-richtext > h1/h2/h3/p/ul/ol/blockquote` (inline `strong`, `em`, `a`) |
| `share-column` | `ShareColumn.jsx` | `.left-sticky-wrap > .left-sticky-block > .label-16.share-post + .share-links > a.share-link-block[data-network] > img.share-icon` |
| `load-more` | `pages/BlogIndexPage.jsx` | `.w-pagination-wrapper.pagination > .label-16.blogs-descr + a.w-pagination-next.w-underline-link.load-more` (removed after the click) |
| `page-noise` | `DetailLayers.jsx` | detail pages only: `.bg-noise-wrap > .bg-noise` + `.page-wrap-solid-bg` (the shell's classes) |
| `noise`, `underline-pair` | shared `ui/` | `.bg-noise.stat-img` in image cells, and UnderlinePair on "Read Article" / "Load More" |

Hook `src/components/cms/useDocumentTitle.js` sets `document.title` from `meta.title` on the detail pages.

## States (static END states in CSS; the Animation pass owns the tweens)

| State | Selector | Motion id |
|---|---|---|
| Blog card hover | `a.post-link-block.bl:hover` → `.post-bottom-wrap` #fff, `.blog-title`/`.blog-data` #020801, `.post-cell` rule #0033cc, `.post-img-hor` scale 1.1, `.post-arrow-wrap` opacity 1 | BLOG-M6 |
| Featured hover | `.post-hor-wrap.featured:hover .blog-img-vert` scale 1.1 | BLOG-M7 |
| Case card hover | `a.post-link-block.cs:hover` → `.post-img-wrap.cs` #f1f3f3, logo swap (wh 0 / bl 1), bottom #fff, texts #020801, `.testim-point-wrap.blog.cs` rule #0033cc, arrow 1 | CS-M1 |
| Back link hover (≥992) | `.icon-w-text:hover` opacity 1, `.arrow` translateX(−100%) | BLOG-M8 |
| Share hover | `.share-link-block:hover` opacity 1 (CSS transition .3s, from the source) | BLOG-M9 |
| Sticky share (≥992) | `.left-sticky-block` sticky top 60 | BLOG-M10 |
| Load More | the `a.load-more` click appends the page-2 cards (8 total) and removes the link; the URL stays the same | blog §3.4 |

## QA hooks

- `/blog?523ae0d4_page=2` renders the normal index (D14).
- For an unknown slug (`/blog/<x>`, `/case-studies/<x>`), the page component returns `null` and only the shell renders. NotFound wiring is the router's job.
- The share icons have `href="#"` and are inert: the click is prevented (D13).

## Renamed or introduced classes (vs Webflow)

| Clone | Original |
|---|---|
| `.hero-heading.blog` | `h1.white-text.hero-home.blog` (words: `span.gsap_split_word.gsap_split_wordN`) |
| `.label-16` | `._16px-text.white-text` |
| `.text-56` | `._56-px-text.white` (+ `.featured-head` / `.blog-page-title` / `.right-side-heading`) |
| `.text-14-white` | `._14px-text.white-text` |
| `.w-underline-link` | `._30px-text.white._w-underline` (+ `.featured` / `.load-more`) |
| `.blog-title`, `.cs-title`, `.testim-num.cs` | `._30px-text.white.blog-title`, `._30px-text.white.cs-title`, `._30px-text.white.testim-num.cs` |
| `.rn-title` | plain `._30px-text.white` (read-next card title) |
| dropped | `w-inline-block`, `w-dyn-list`, `w-dyn-items`, `w-dyn-item` (no styles needed) |

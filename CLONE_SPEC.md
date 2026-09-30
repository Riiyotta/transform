Source: https://www.transform9.com/

# Transform9 homepage: clone build spec

## 0. Reference baseline

| Item | Value |
|---|---|
| Date measured | 2026-09-30 |
| URL | `https://www.transform9.com/` (live site is authoritative) |
| Browser | Playwright 1.63.0, Chromium build 1243 headless (UA reports `HeadlessChrome/153.0.8010.12`). DPR 1. |
| Viewports (w×h) | 1440×900, 1024×900, 768×1024, 390×844. Spot checks at 1920, 1200 and 600 for fluid sizing. |
| Fonts | Waited on `document.fonts.ready` before every measurement. `Polysans Neutral` loaded; `webflow-icons` is unused and never loaded. |
| Consent | The HubSpot cookie-banner script (`js.hs-banner.com/v2/48695808/banner.js`) loads, but **no banner or consent UI was rendered** at any viewport (checked `#hs-eu-cookie-confirmation`, `#hs-banner-parent` and `[id*=cookie]`). Requests left from an IN geo (`google.co.in` pixels). Nothing needed dismissing. The state is identical across all runs. |
| Page Webflow ids | site `684a82e3294991569082d379`, page `6899dffb096a12112e48e34f` |
| Document height | 1440: 25922px · 1024: 22731px · 768: 14430px · 390: 17939px. Several sections use `vh`, so height depends on viewport height. |
| Evidence folder | `/Users/riyaghosh/V3/transform/recon/`. See §14 for the file list. |

**How values were obtained:** every px value below is a computed style or `getBoundingClientRect` read from the live page, unless it is marked *(CSS)*. *(CSS)* values are the source rule from `transform9.webflow.shared.8b0b439cc.css`, which is the same file on live and in the snapshot. All homepage-relevant rules are extracted to `recon/homepage-rules.css`. Motion values come from the decoded Webflow IX3/IX2 data (`recon/ix3-readable.txt`, `recon/ix2-actions.txt`) and were cross-checked by sampling the live page over time.

---

## 1. Global system

### 1.1 Breakpoints (Webflow standard)
| Name (IX2) | Range | CSS |
|---|---|---|
| main / desktop | ≥ 992px | base rules |
| medium / tablet | 768–991px | `@media screen and (max-width: 991px)` |
| small / mobile landscape | 480–767px | `@media screen and (max-width: 767px)` |
| tiny / mobile portrait | ≤ 479px | `@media screen and (max-width: 479px)` |

At 1024 the desktop rules apply, so every desktop `vw` value scales down. At 768 the tablet rules apply, and the `vw` values that tablet does not override keep scaling. At 390 all three max-width blocks apply.

### 1.2 Layout grid
- **Full-bleed layout. There is no centered container and no max-width.** Every section spans 100vw.
- **Left rail column:** `--_size---left-side: 26.7361vw`, which is 385px at 1440, 273.78 at 1024 and 205.33 at 768. It is used by `.left-side`, `.stats-left`, `.testim-top-left`, `.testim-photo-block`, `.hiw-left-wrap`, `.footer-top-left`, `.row-tabs-content`, and the `margin-left` of `.how-works-right*` and `.right-side-w-line`. At ≤767 it collapses to full width or auto.
- **Gutter/padding token:** `--_paddings--margins---padding` is **36px** at ≥992 and **20px** at ≤991. It is used as the padding on almost every block.
- **Hairlines:** `1px solid rgba(255,255,255,.2)` on dark and `1px solid rgba(2,8,1,.15)` on white. These draw a visible grid of vertical and horizontal lines, and the vertical line at x = 26.7361vw runs through most sections.
- **Radii:** 0 everywhere (the Webflow base is `border-radius:0`). The only rounded shapes are `.bg-circle` at 100% (always `display:none`) and the slider dots (hidden).
- **Shadows:** there are no drop shadows. Box-shadows are used only as 1px lines: `0 1px 0 0 rgba(255,255,255,.2)` on the nav, `1px 0 0 0 rgba(2,8,1,.15)` on some left columns, and `0 1px 0 .5px rgba(255,255,255,.2)` on the integration blocks.
- **Backdrop blur 80px:** on `.nav-menu` and `.hero-bottom-block.bottom-left` (CTA).
- **Noise texture:** `.bg-noise` is an absolutely positioned full-size overlay. It uses `noise.webp`, tiled at `background-size:200px`, with `opacity:.5` at ≥992 and `.3` at ≤991, and `pointer-events:none`. It is placed on the page, nav (tablet), popup, stats images, scheduling cards, task panes, specialty images, CTA and footer.

### 1.3 Token table: colors (measured computed values; CSS var name in parentheses)
| Token | Value | Where |
|---|---|---|
| black (`--black`) | `#020801` rgb(2,8,1) | page bg, text on white, dark cards |
| white (`--white`) | `#ffffff` | text on dark, white section bg |
| green (`--green`) | `#a2fa8e` rgb(162,250,142) | accent spans, nav CTA bg, CTA right block, author title bg, testimonial highlight |
| blue-light (`--blue-light`) | `#168ae2` rgb(22,138,226) | "Powerful Impact.", "Trusted.", stats block 01, nav hidden-text on white |
| blue-dark (`--blue-dark`) | `#0033cc` rgb(0,51,204) | outreach card 01, tab progress bar, blue pixels |
| stats/outreach blue 2 | `#00269b` | stats block 02, outreach card 02 |
| stats/outreach blue 3 | `#001a6a` | stats block 03, outreach card 03 |
| stats/outreach blue 4 | `#000d39` | stats block 04, outreach card 04 |
| gray (`--gray`) | `#f1f3f3` rgb(241,243,243) | testimonial photo bg, active Tasking tab, Navigator image pane bg, nav CTA hover |
| stroke on dark (`--white-0-2`) | `rgba(255,255,255,.2)` (`#fff3`) | all dark-surface hairlines |
| stroke on light (`--black-0-15`) | `rgba(2,8,1,.15)` | hairlines in the white section; nav bottom line on white |
| nav bg | `rgba(2,8,1,.5)` | `.nav-menu` default |
| nav link text | `rgba(255,255,255,.7)` (`#ffffffb3`) | desktop nav links |
| hiw inactive | `#4c4c4c` | "How it works" inactive words |
| stacked card tints | `#e9e9eb`, `#c1c0c7`, `#858391` | scheduling cards 1/2/3 once they are stacked (scroll) |
| modal overlay | `rgba(2,8,1,.9)` + `linear-gradient(#ffffff05,#ffffff05)` | `.modal-overlay` |
| YouTube play button | `#67bd53` (`--_apps---colors--primary`), icon `#030303` | `.yt-facade__play` |
| error | text `#e64141`, bg `rgba(230,65,65,.1)` | popup error |
| hero input | bg `#fff`, text `#333`, border `1px #ccc`, focus border `#3898ec`, placeholder `rgba(2,8,1,.5)` | `.input-white.w-input` |
| popup input | text `#fff`, bottom border `rgba(255,255,255,.2)` → `#fff` on focus, placeholder `rgba(255,255,255,.3)` | `.form-input` |
| inactive w-tab text | `#222` rgb(34,34,34) | Tasking/Navigator inactive tab-link color (Webflow default) |
| muted text | white at opacity .5 (footer headings/description), .3 (legal row, "/ 02", popup disclaimer), .4 ("And other specialties"), .6 (≤479 secondary texts) | |

### 1.4 Token table: typography
**Family:** `"Polysans Neutral", Arial, sans-serif`. **Weight 400 only. Letter-spacing `normal` everywhere.** `body { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale }` (inline head style). Body base: 14px (`.875rem`), line-height 1.4.

| Role (Webflow class) | CSS formula | 1440 | 1024 | 768 | 390 | line-height |
|---|---|---|---|---|---|---|
| Hero H1 / Spotlight H2 (`.white-text.hero-home`) | 6.5vw; ≤991 75px; ≤767 12.8vw | 93.6 | 66.56 | 75 | 49.92 | 101% (94.54 / 67.23 / 75.75 / 50.42) |
| Section display (`.h1-text`) | 7.083vw; ≤767 10.133vw; ≤479 12.8vw | 102.0 | 72.53 | 54.40 | 49.92 | 100% (CTA heading uses 104%) |
| HIW words (`.hiw-text`) | 7.778vw; ≤767 12.8vw | 112.0 | 79.65 | 59.74 | 49.92 | 100%, margin-top −.8vw |
| 56 text (`._56-px-text`) | 3.889vw; ≤991 30px; stats-text ≤767 10.133vw, ≤479 12.8vw | 56.0 | 39.82 | 30 | 30 (stats 49.92) | 100%, `white-space:nowrap` |
| Popup head (`.popup-head`) | clamp(56px, 3.889vw, 6.222vh); ≤479 12.8vw | 56 | 56 | 56 | 49.92 | 100% |
| 30 text (`._30px-text`) | 2.083vw; ≤991 18px; ≤767 24px | 30.0 | 21.33 | 18 | 24 | 1.2 |
| – hero paragraph | ≤479 5vw | 30 | 21.33 | 18 | 19.5 | 1.2 |
| – testimonial quote | ≤767 22px | 30 | 21.33 | 18 | 22 | 1.2 |
| – stack-card-head, testim-num | ≤991 24px | 30 | 21.33 | 24 | 24 | 1.2 |
| – stack-card-left "01" | ≤479 16px @ .6 opacity | 30 | 21.33 | 18 | 16 | 1.2 |
| 16 text (`._16px-text`) | clamp(1rem, 1.111vw, 1.125rem); ≤991 14px; ≤767 16px | 16 | 16 | 14 | 16 | 1.4 (22.4 / 19.6) |
| – "Designed for Your Specialty" | ≤767 10.133vw, lh 100% | 16 | 16 | 14 | 39.52 | |
| 14 text (`._14px-text`) | clamp(.875rem, .972vw, 1rem); ≤991 14px; ≤767 16px | 14 | 14 | 14 | 16 | 1.4 |
| Nav link (desktop) | clamp(.875rem, .972vw, 1rem) | 14 | 14 | – | – | 1.4 |
| Nav link (menu overlay) | 6.25vw | – | – | 48 | 24.375 | 1.4 |
| Nav Login/CTA (menu) | ≤991 22px; ≤479 16px | 14 | 14 | 22 | 16 | 1.4 |
| Popup input (`.form-input`) | clamp(1.125rem, 1.25vw, 1.25rem) | 18 | 18 | 18 | 18 | |
| Hero input (`.input-white`) | 1.25vw; ≤991 14px; ≤767 16px | 18 | 12.8 | 14 | 16 | |

Fluid check: at 1920 the hero H1 is 124.8, `.h1-text` 135.99, HIW 149.34, 56-text 74.67, 30-text 39.99, 16-text 18 (clamp max) and 14-text 16. At 1200 the values are 78 / 85.0 / 93.34 / 46.67 / 25.0 / 16 / 14. **There is no upper clamp on the display sizes, so they keep scaling with vw.**

### 1.5 Spacing tokens (measured at 1440 → 1024 → 768 → 390)
- Block padding: 36 → 36 → 20 → 20.
- Section vertical rhythm is vw-based *(CSS)*: `.stats` margin-bottom 17.361vw (250px @1440), `.white-section` padding-bottom 10vw / 15vw ≤991 / 20vw ≤767, `.stacking-cards-section` margin-bottom 17vw, `.row-tabs-section` mb 17vw (25vw ≤991), `.secure-section` mb 10vw (20vw ≤767), `.integration-section` pb 16.667vw (22vw ≤991), `.specialty-section` mt 5vw (20vw ≤767), `.client-logos` padding max(110px, 7.639vw) top and bottom (80px ≤991).
- `._16px-text.white-text` has `margin-left: 43px` at ≥480 (0 at ≤479). This is the recurring indent on small labels.

### 1.6 Section order and vertical metrics (y top / height, px)
| # | Section root (Webflow classes) | 1440 | 1024 | 768 | 390 |
|---|---|---|---|---|---|
| – | `div.nav-menu.w-nav#book-demo-btn` (fixed) | 0/60 | 0/60 | 0/60 | 0/60 |
| 1 | `section.hero.home` | 0/900 | 0/900 | 0/1024 | 0/844 (+ mb 273 = 70vw) |
| 2 | `div.div-block-3 > section.client-logos` | 900/270 | 900/255.5 | 1024/210 | 1117/210 |
| 3 | `div.div-block-5` (Client Spotlight) | 1290/926 | 1275.5/661 | 1354/624.5 | 1352/473 |
| 4 | `section.stats` | 2270/600 | 1990.7/426.7 | 2032.5/400 | 1879.6/782.9 |
| 5 | `section.testimonials#testimonials` | 3120/1119.4 | 2595/796 | 2592.5/692 | 2822/1462.5 |
| 6 | `section.how-it-works` | 4239/2278 | 3391/1620 | 3285/747 | 4285/840 |
| 7 | `section.white-section` (contains 7a–7e) | 6517/13266 | 5011/12575 | 4032/5741 | 5125/7291.5 |
| 7a | `div.transition-cont.black-to-white` | h 360 | 255.9 | 192 | 195 |
| 7b | `div.stacking-cards-section.schudule-agent#products` (Scheduling Agent #1) | 6949/3553 | 5318/2537 | 4262.5/1843 | 5339.5/2462 |
| 7c | `div.half-split-wrap` (Tasking Agent #2) | 10747/1800 | 8030/1800 | 6236/614 | 7868/973 |
| 7d | `div.row-tabs-section` (Navigator Agent #3) | 12547/847 | 9830/752 | 7043/657.5 | 8939/1294.5 |
| 7e | `div.split-cards-section` (Outreach Agent #4) | 13639/6000 | 10755.5/6728 | 7892/1766 | 10331/2008 |
| 8 | `div.transition-cont.white-to-black` | 19783/360 | 17586/256 | 9773/192 | 12416/195 |
| 9 | `section.specialty-section#specialties` | 20215/1054 | 17893/869 | 10003.5/768 | 12689/993 |
| 10 | `section.integration-section#integrations` | 21269/1044 | 18762/975 | 10771.5/787 | 13683/700 |
| 11 | `section.secure-section#security` | 22313/843 | 19737/843 | 11559/649 | 14383/937 |
| 12 | `section.cta-section` | 23300/1506 | 20682/1071 | 12285/1152 | 15398/1275 |
| 13 | `section.footer.section` | 24806/750 | 21753/684 | 13437/713 | 16673/1078 |
| 14 | `div.footer-bottom-wrap` (sticky reveal, outside `.page-wrap`) | h 365 | 294 | 280 | 188 |
| – | `div.modal-wrap` ("Call Alex" popup, fixed, hidden) | – | – | – | – |

---

## 2. Page shell and background layers

DOM: `body.body` contains `.nav-menu`, `.modal-wrap`, `.page-wrap` (z-index 2, relative) and `.footer-bottom-wrap` (z-index 1, `position:sticky; inset:auto 0 0`).

Inside `.page-wrap`, back to front:
1. `.page-wrap-solid-bg`: absolute, fills `.page-wrap`, z −3, bg `#020801`.
2. `.bg-pixels-wrapper`: `position:fixed; top:0; left:0; width/max-width:99.9vw; min-height:100vh; z −2; pointer-events:none`. It contains
   - `.bg-video-pixels.w-background-video`: height 100vh. The `<video autoplay loop muted playsinline>` uses `object-fit:cover`, with sources `Tablet-Final_mp4.mp4` then `Tablet-Final_webm.webm` and the poster `Tablet-Final_poster.0000000.jpg`. Measured: 520×720 intrinsic, duration 15.07s, playing.
   - `.bg-pic-pixels`: 100vh, `background: url(tablet-pixels.webp) 50%/cover`. This is the fallback.
   - Inline CSS: `.bg-pic-pixels{display:block!important}.bg-video-pixels{display:none!important}.has-video .bg-video-pixels{display:block!important}.has-video .bg-pic-pixels{display:none!important}`. A script adds `html.has-video` on the video's first `playing` event, and skips `play()` entirely when `prefers-reduced-motion: reduce`, in which case the still image shows (verified).
   - It fades out on scroll; see motion M3.
3. `.bg-noise-wrap`: fixed 100vw×100vh, z −1, contains `.bg-noise` (opacity .5/.3).
4. Sections. Hero, logos, spotlight and the how-it-works top area have transparent backgrounds, so the fixed video shows through them.

`.bg-circle*` elements (blue blurred circles) exist in the hero, stats, testimonials, integrations and popup, but they are **all `display:none`**. Do not render them.

**Smooth scroll:** Lenis 1.0.23 with `{lerp: 0.1, wheelMultiplier: 0.7, gestureOrientation:'vertical', normalizeWheel:false, smoothTouch:false}` driven by rAF, and `html.lenis.lenis-smooth`. Lenis is stopped (plus `html{overflow:hidden}`, `body{overscroll-behavior:none; touch-action:none}`) while the mobile menu is open.

**Footer reveal:** `.footer-bottom-wrap` is sticky to the viewport bottom but sits under `.page-wrap` (z 1 < 2). As the end of `.page-wrap` scrolls up, the big footer logo and legal row are revealed from behind it like a curtain.

---

## 3. Navbar (`.nav-menu.w-nav`, `data-collapse="medium"`, `data-animation="default"`, `data-duration="0"`)

- `position:fixed; inset:0 0 auto; z-index:3; min-height:60px`, which measures 60px tall. bg `rgba(2,8,1,.5)`, `backdrop-filter: blur(80px)`, `box-shadow: 0 1px 0 0 rgba(255,255,255,.2)`.
- Layout: flex, `justify-content:space-between`.
  - `.logo-wrap.w-nav-brand` is `width:200px` *(CSS)* but flex-shrinks, measuring 175.6 @1440 and 167.3 @1024. It is 170 at ≤991 and 160 at ≤479, with the logo centred. The logo SVG is 130×38 at y 11. `.logo-white` shows by default. `.logo-black` is absolutely stacked at opacity 0.
  - `.nav-links` (desktop) is a flex row. Left group `.nav-links-left`: Compare (`/compare`), Blog (`/blog`), Case Studies (`/case-studies`), Careers (`https://apply.workable.com/transform9/`). Right group: Login (`https://portal.transform9.com/`) and **Book a Demo** (`/book-a-demo`).
  - Link blocks: padding 20px (the first link has padding-left 0; Login and CTA have 24px left/right), full 60px height. Measured x at 1440: Compare 175.6 (w 77.5), Blog 253.1 (68.3), Case Studies 321.4 (124.5), Careers 445.9 (89.5), Login 1224.9 (82.7), CTA 1307.7 (132.3).
  - CTA: bg `#a2fa8e`, text `#020801`, `transition: background-color .2s cubic-bezier(.215,.61,.355,1)`, hover bg `#f1f3f3` (measured).
- **Hover rolling text (desktop only):** each link holds `.nav-text-wrap` (overflow hidden, 19.6px tall) with two `.nav-text`: a visible one (`rgba(255,255,255,.7)`) and `.nav-text.hiden` absolutely positioned 100% below, in white. On hover both translateY(−100%) (measured −19.59px), 250ms, outQuad. Mouse-out returns them to 0 with the same timing. This does not apply to the CTA.
- **On-white state (scroll):** while `.white-section` spans from 60px below the viewport top to its bottom at 60px (motion M4), the nav bg becomes `#fff`, link text `#020801`, `.nav-text.hiden` `#168ae2`, `.logo-white` opacity 0, `.logo-black` 1, `.burger-white` 0, `.burger-black` 1, and `.nav-border-on-white` (1px `rgba(2,8,1,.15)` bottom line) opacity 1. Measured at scrollY inside the white section: bg rgb(255,255,255) and links rgb(2,8,1).
- **≤991 (tablet/mobile):** the desktop menu is hidden and `.menu-btn.w-nav-button` shows (60×60, right edge). It contains the icons `menu-burger.svg` (white, 24×24), `close-icon-white.svg` (24) and `menu-burger-close.svg` (black burger used on white). `.menu-btn-wrap` has 1px left/bottom borders that are transparent when closed.
- **≤767:** `.nav-link-block.cta.mobil-top-cta` "Book a Demo" appears in the bar: green, 170×60 at x 160 @390, padding 8px, 16px text.
- **Mobile menu open** (measured 768 and 390):
  - `.nav-links` is fixed `inset:0`, height 100dvh, bg `#020801`, flex column, justify flex-end. It covers the logo and the top CTA.
  - `.nav-links-left` is absolute `top:60px; bottom:80px` (bottom 60 at ≤479) with `padding-bottom:13vw` (99.84 @768, 50.7 @390). The links stack at the bottom: 6.25vw text (48px @768, 24.375 @390), padding 28/24 (20/24 at ≤479), 1px `rgba(255,255,255,.2)` bottom borders, and the first link also has a top border. Row heights are 125.2 @768 and 76.1 @390.
  - `.nav-links-right` is a bottom bar 80px tall (60 at ≤479) with Login and Book a Demo each `flex:1`, centred, 22px (16 at ≤479). Login has a top border.
  - Burger to close (IX2 a-28): burgers `display:none`, `.nav-cross-white` opacity 0→1 over 100ms after a 100ms delay, easeOut, and the `.menu-btn-wrap` border colour goes to `rgba(255,255,255,.2)` over 200ms easeOut. Close (a-30) reverses this: cross opacity 0 over 100ms, burgers back after 100ms, border transparent over 200ms.
  - The menu itself appears and disappears instantly (nav data-duration 0).
  - Scroll is locked while the menu is open (see §2).
  - Screenshot: `recon/state-390-menu-open.png`, `recon/state-768-menu-open.png`.
- There are **no dropdowns or mega-menu.**

---

## 4. Hero (`section.hero.home`)

**Content**
- H1 `h1.white-text.hero-home`: "Maximize Every **Call** with a **Custom AI Agent**". Spans: `.head-span-1` "Call", `.head-span-2` "with a" (`nowrap`) and `.head-span-3` "Custom AI Agent" (`#a2fa8e`). At ≤991 span-3 is `display:block`; at ≤767 it goes back to inline.
- Bottom-left `.hero-bottom-block.left`: label `._16px-text.white-text` "Who We Are:", then paragraph `p._30px-text.home-hero-text.white`: "Uniquely built AI voice agents for specialty physician practices that eliminate hold times, reduce call center costs, and fill physician schedules 24/7" (max-width 29ch; 25ch and 5vw at ≤479).
- Bottom-right `.hero-bottom-block.right`: label "Test Our AI Agent", then form `#email-form-1` (`data-disable-enter="true"`) with phone input `#input-main-phone` (type tel, placeholder "Your phone number", maxlength 256, not required) and link `a.hero-cta-link.get-a-call` "Call Alex" (`._56-px-text.hero-cta`) with an underline pair.

**Layout**
- `min-height:100dvh`, padding-top 110px (74 at ≤479), flex column, `space-between`, overflow hidden (visible at ≤767).
- H1: margin 120 119 9 76, max-width 20ch (1198px @1440). Top 230 at 1440/1024/768, 86 @390. At ≤991: 75px, max 14ch, ml 47. At ≤767: 12.8vw, max 11ch, ml 30, mb 60. At ≤479: margin 12 10 24 34, max 9ch.
- `.hero-home-bottom`: flex row, min-height max(300px, 20.833vw) (303.4 @1440), 1px bottom hairline, plus `.line-hor` (top hairline) and `.line-vert.on-hero` (a centre vertical at 50%, hidden at ≤767). The two blocks are `width:100%` each (720/720 @1440), padding 36 (20), column `space-between`, gap 64, bg `rgba(2,8,1,.01)`.
- Input row: `.input-hero-wrap` is a flex row with gap 6vw (86.4 @1440). The input is 4.167vw tall (60 @1440, 42.7 @1024, 50 @≤991, 60 @≤767), padding 0 1.667vw (16px at ≤991), margin-right max(26px, 1.806vw), 314.7px wide @1440. "Call Alex" is 220.9×56 @1440, anchored bottom-right.
- ≤767: the input stacks above "Call Alex" (column, align flex-end, gap 32) and the input is full width (350 @390).
- ≤767: the hero bottom becomes a column. `.hero-bottom-block.left` becomes `position:absolute; top:100%` (below the hero, 60vw tall; 70vw at ≤479 with mt −105), which is why the hero gets `margin-bottom:70vw` (273px @390). At 390 the right block (form) sits at y 383–643 and the left block (paragraph) at y 738–1011.
- The hero background is transparent (video shows through).

**Interactions:** "Call Alex" opens the popup (§16). The hero, popup and footer phone inputs are value-synced on `input` (verified: typing in one fills all three). Enter is suppressed in this form. The underline hover is motion M12. Screenshot: `recon/live-1440-top.png`.

---

## 5. Client logo marquee (`section.client-logos`)
- Padding max(110px, 7.639vw) top and bottom (110 @1440/1024; 80 at ≤991, where it also gets mb 3vh). Flex, overflow hidden.
- There are two identical `.logos-wrapper` tracks side by side (`flex:none; min-width:100%`, flex row, `justify-content:space-between`, gap 5.4vw = 77.76 @1440, 60px at ≤991, padding-left 60). The track width is 2434.2px @1440, 1748.4 @1024, 2132.1 @768 and 2158.9 @390.
- Logos: `img.client-logo` at height 3.472vw (50px @1440, 35.5 @1024, 50px at ≤991), `object-fit:contain`. The SBJ logo is 2.2vw tall (31.7 @1440; 5.5vw at ≤479).
- Order: The Orthopaedic Center, Resurgens Orthopaedics, North Florida Surgeons, Semmes Murphey, SBJ (Southern Bone & Joint, empty alt), Andrews Sports Medicine & Orthopaedic Center, TOC, Florida Orthopaedic Institute, Hughston Clinic, US Orthopedic Partners, United Musculoskeletal Partners, Orthopaedic Solutions Management, Central Dermatology Center.
- Three more (`.client-logo.hide`: Eye Doctors of Washington, Armina Health, Urology Centers of Alabama) are in the DOM but `display:none`. Do not render them.
- Motion: M1, a continuous leftward scroll.

## 6. Client Spotlight (`div.div-block-5`)
- `h2.white-text.hero-home` (same style as the hero H1): "Client Spotlight -" then `<br>` then `span.text-span-14` "Andrews Sports Medicine" in `#a2fa8e`. Top at 1290 @1440 (margin-top 120).
- `.div-block-6`: padding 0 5vw (72 @1440), margin-bottom 54. It holds `figure.yt-facade` (`tabindex=0`, `role=button`, `data-video-id="yG3PtcRGQLc"`), which is 100% wide with `padding-top:56.17%` (1296×728 @1440, 921.6×517.7 @1024, 691×388 @768, 351×197 @390).
  - Thumbnail: `https://i.ytimg.com/vi/yG3PtcRGQLc/maxresdefault.jpg` (srcset mqdefault 320w / maxres 1280w), `object-fit:cover`.
  - Play button `.yt-facade__play`: 84×84, centred, bg `#67bd53`, square (radius 0), with a 24×24 inline SVG triangle (viewBox 0 0 330 330, `fill:currentColor`, `#030303`). Hover scales it to 1.07 with `transition: transform .18s cubic-bezier(.645,.045,.355,1)`.
  - Click, Enter or Space replaces the figure's content with a YouTube iframe: `https://www.youtube.com/embed/yG3PtcRGQLc?autoplay=1&enablejsapi=1&rel=0&controls=1&playsinline=1`, positioned absolute inset 0 at 100%×100% with no border.
  - Per the scope decision the clone must not auto-load or prefetch it. Render the facade, and only create the iframe on user click (a real external embed), or link out.

## 7. Stats (`section.stats`)
- Height 41.667vw (600 @1440, 426.7 @1024), 400px at ≤991, auto at ≤767. Margin-bottom 17.361vw, or 160 at ≤991.
- `.stats-left` (left rail, 26.7361vw, bg `#fff`, padding 36): text `._56-px-text.stats-text` in `#020801`, "Proven Results. " + `span.stats-span` "Powerful Impact." in `#168ae2`, `white-space:break-spaces`. It also holds `img.img-stats` (`gr-bl.webp`, a blue-green gradient graphic 770×527), absolute at bottom 1.5vw and full width of the rail (385×263.5 @1440). At ≤767 it is 100vw wide with right −44%.
- `.stats-right` holds 4 × `.stats-block`:
  - `flex:16%` desktop, padding 36, bg `#168ae2` / `#00269b` / `#001a6a` / `#000d39`, overflow hidden, `transition: flex-basis .6s cubic-bezier(.645,.045,.355,1)`.
  - Each block has an index `._14px-text` "01"–"04" at the top.
  - At the bottom-left, `.stats-bottom` (absolute, gap 1.2vw) holds `.stat-head-text-wrap` (overflow hidden) with `.h1-text.stat-head` and `.stat-descr-wrap` (overflow hidden) with `._16px-text.stat-descr` (nowrap).
  - `.stats-img-wrap` holds a full-size `.stats-img` background (`stat-1..4.webp`, cover) plus `.bg-noise.stat-img` (.5), at opacity 0 until the block is active.
  - Values: **2,000+** "Providers" · **96%** "Patient Satisfaction" · **8:1** "Cost Savings vs. Human Agents" · **80%** "Decrease in Call Abandonment".
- Desktop default: every block is 263.8px wide @1440. The heading and description are translated down 100% (hidden inside their overflow masks: stat-head translateY 102px, descr 22.39px) and the image is at opacity 0.
- **Desktop hover** (M5): the hovered block goes to `flex-basis:100%`, so the widths become 130.3 / 664.1 / 130.3 / 130.3 @1440. Its heading and description slide up to 0 and its image fades in.
- **Tablet 768–991** (M6): accordion by click. The active block is 70% wide (393.9 @768) and the others 10% (56.3). The first block is opened on load by a script. The heading and description of the active block are visible.
- **≤767** (M6): vertical stack. Active block height 260px, others auto (62.4px). The first block is open on load. `.stats-left` sits on top (335.7 tall @390, heading 10.133vw/12.8vw, max 10ch, mb 96).
- Screenshots: `recon/state-1440-stats-hover.png`, `recon/state-768-stats-click.png`, `recon/state-390-stats-click.png`.

## 8. Testimonials (`section.testimonials#testimonials`)
- 1px top hairline, overflow hidden.
- `.testimonials-top` (height 36vw = 518.4 @1440; 40vw at ≤991; auto and column at ≤767 with gap 21.333vw):
  - `.testim-top-left` (rail, right hairline): `._16px-text.white-text` "Featured<br>Testimonials".
  - `.testim-top-right`: `h2.h1-text.white-text.testim-heading` "Don’t Just Take Our Word for It", max-width 55vw (80vw at ≤479).
- Slider `.testimonials-slider.w-slider`: `data-animation="cross"`, `data-duration="400"`, `data-easing="ease"`, `data-autoplay="false"`, `data-infinite="false"`, `data-hide-arrows="false"`, swipe enabled. Height 41.667vw (600 @1440), 50vw at ≤991, auto at ≤767. Top and bottom hairlines. Dots `.slide-nav` are `display:none`.
- Each slide `.testim-slide-wrap` is a flex row:
  - `.testim-photo-block`: rail width, bg `#f1f3f3`, overflow hidden. It holds the photo `img.testim-photo` (height 103%, centred, 395.9×615.9 @1440) and the author tags at the bottom-left: `.testim-author-name` (bg white, padding 14 24, or 12 20 at ≤991, `._16px-text` black) and `.testim-author-title` (bg `#a2fa8e`, same padding).
  - `.testim-right-side`: padding 36, left hairline, column `space-between`. It holds the quote `p._30px-text.testimonial` (max-width 50vw = 720 @1440, 22px at ≤767) with `span.testim-highlight` in green (inline-block desktop), then `.testim-bottom-cont` (flex, gap 5vw) of `.testim-point-wrap` items (1px green left border, padding-left clamp(16px, 1.111vw, 24px), gap 1.667vw). Each point is a number `._30px-text.white.testim-num` plus text `._16px-text.white-text.testim-point`. The practice logo `img.testim-logo` is absolute at bottom 24 / right 36, height 4.167vw (60 @1440; 6vw ≤991; 11vw ≤767; 12vw and static at ≤479). The counter `.sider-count` (absolute, `bottom:100%`, mb 36) reads "01" + "/ 02" (the latter at opacity .3).
  - Slide 1: Tammy Jackson, "CAO, The Orthopaedic Center". Quote: “The Transform9 team has been one of our best vendor relationships. Their people know what they're doing, hear what we're saying, and even look out for things we don't even know to look out for. **It's been a great relationship.**” Points: **80%** "decrease in call abandonment" / "from 20% to 3% in 1 month"; **90%** "decrease in" / "patient hold times". Logo: The Orthopaedic Center.
  - Slide 2: Scott Griffin, MBA, "CEO, Southern Bone & Joint Specialists". Quote: “Implementing Transform9 has been one of our best decisions. Their team is incredibly knowledgeable, accommodating, and always looking for ways to further support our practice. We have experienced significant impacts in our operations and **enjoy our relationship with the entire team.**” Point: **93%** "patient satisfaction". Logo: Southern Bone and Joint Specialists.
- Arrows `.test-arrow-wrap` (100×100; 60×60 at ≤991; left and bottom hairlines) sit top-right of the slider. The left arrow is at x 1240 and the right at 1340 @1440. Each holds a white arrow (28px, `clamp(28px,1.7vw,36px)`) and a black arrow offset by 250% (translateX 70px).
- Hover (M13): the white arrow slides out 250%, the black arrow slides in to 0, and the bg goes to `#fff`, all 250ms outQuad. It reverses on mouse-out.
- **Slide change measured:** cross-fade. At 150ms after the click the two slides' opacities were .42 and .50. At 950ms slide 2 is at opacity 1 and slide 1 is `visibility:hidden`. Both slides share translateX −1440 (Webflow stacks them). Arrows stay visible at the ends. Screenshot: `recon/state-1440-testimonial-2.png`.
- ≤767: the slide stacks. The photo block is 100% wide × 130vw tall, the right side has padding 40 20, and the counter sits above the photo (`margin-bottom: calc(130vw + 20px)`).

## 9. How It Works (`section.how-it-works`)
- `.how-works-right.top` is a 13vw spacer (187.2 @1440) with a left hairline at the rail (hidden at ≤767).
- `.how-works-sticky-cont` has height 130vw (1872 @1440; auto at ≤991). It contains:
  - `.how-works-sticky` (`position:sticky; top:0`), which holds
    - `.how-works-right-text.top`: label "How It Works" (height calc(1.5vw + 2×pad + 60px) = 153.6 @1440).
    - `.how-works-heads-wrap` (top and bottom hairlines, flex row; column at ≤767).
      - Left rail `.hiw-left-wrap` > `.hiw-text-block.left` "AI that" (white, nowrap, `.h1-text.hiw-text` at 7.778vw) and a mobile duplicate `.left-mob`.
      - Right `.hiw-right-wrap` (padding-left 36, left border `1px #020801`) with three `.hiw-text-block` rows (padding 2.5vw top and bottom, bottom hairline): "Speaks" (`._1`), "Schedules" (`._2`) and "Supports Patients" (`._3`, whose row has no border).
      - Row pitch: 173.5px @1440, which equals 12vw.
  - `.hiw-triggers`: absolute, z −1, four stacked 100%-height trigger divs (468px each @1440) used as scroll triggers.
- After that come `.how-works-right-text.bottom-w-text` with `._16px-text.white-text.hiw-bottom` (max 38ch): "Built specifically for high-volume medical practices, our platform streamlines operations, enhances patient access, and drives revenue growth.", and a `.bottom` spacer.
- Motion M7 (scroll-stepped highlight). Measured trace (`recon/hiw-scroll-trace.txt`) at 1440×900:
  - scrollY < ~4445: "AI that" at y 0 and "Speaks" green.
  - ~4445–4912: "AI that" moves to 12vw (172.8px) and "Schedules" goes green.
  - ~4912 onward: 24vw (345.6) and "Supports Patients" green.
  - After scrollY ≈ 6299 (the section is off-screen) it resets to the first state.
  - Scrolling back reverses the same steps.
  - Inactive words are `#4c4c4c`; the active word is `#a2fa8e`.
- ≤767: the section is not sticky. "AI that" is its own row (`.left-mob`), all three words are listed at 12.8vw, and they remain coloured by the same triggers.

## 10. White section (`section.white-section`, bg `#fff`, padding-bottom 10vw)

### 10a. Pixel transition black to white (`.transition-cont.black-to-white`)
- Container bg `#020801`, overflow hidden, height 5 rows × 5vw (360 @1440). Row order in the DOM is `.grid-row._5` (top) → `._1` (bottom).
- Each row has 20 `.pixel` squares, `flex:1`, 5vw × 5vw (72px @1440). At ≤767 pixels are 10vw and 10 per row; `.mob-hide` pixels are hidden.
- Layers: `.transition-wrap.white` (z 2) with white pixels, and `.transition-wrap.mix` (absolute, z 1) with a checker of `.pixel.blue` (#03c) and `.pixel.green` (#a2fa8e). Odd rows start blue; even rows start green.
- All pixels start at opacity 0 and flip to 1 (motion M8).
- `.right-side-w-line` draws the rail hairline over the transition.

### 10b. Scheduling Agent #1 (`.stacking-cards-section.schudule-agent#products`, margin-top 5vw)
- `.horizontal-wrap.scheduling` (top hairline `rgba(2,8,1,.15)`):
  - Rail `.left-side.our-products` "Our Products".
  - `.right-side.agent.schedule` with `h2.h1-text.agent.sch` "Scheduling Agent" (max 43vw, black) and `._16px-text.num-agent-1` "#1" (right).
- `.sheduling-top-space`: sticky top 0, height 10vw, with a rail box-shadow line.
- `.scheduling-cards`: height 220vw, column, gap 20vw (288 @1440), padding 0 36. It holds 4 × `.scheduling-card`:
  - Sticky `top:10vw` (144px), height 35.208vw (507 @1440), bg `#020801`, top hairline white .2, full width minus padding (1368 @1440).
  - `._30px-text.white.stack-card-left` "01"–"04" absolute at 36/36.
  - `.stack-card-text-wrap` absolute at left 26.7361vw, column `space-between`, padding 36 0, containing the title `._30px-text.white.stack-card-head` (max 16ch; card 2 max 12ch) and the body `._14px-text.white-text.stack-card-text` (max 35ch).
  - Right image `img.sch-img` (absolute right, height 100%, 598.8×506 @1440).
  - Noise overlay.
  - Cards:
    1. "Comprehensive Scheduling" / "Supports scheduling, rescheduling, cancelling, and confirming all appointment types — office visits, procedures, and ancillaries — including multiple visits in a single conversation."
    2. "New Patient Intake With Insurance Verification" / "Collect patient info and verify insurance before the visit—saving your staff time and reducing delays."
    3. "Industry Leading Scheduling Rules Engine" / "AI follows your practice’s custom scheduling rules 100% accurately every time, reducing costly human agent training time and mistakes."
    4. "Fill Schedules and Maximize Revenue" / "Automatically fill physician schedules to desired capacity, preventing missed opportunities for appointments."
- Motion M9 (stacking deck). The measured state with card 4 in view: card1 scale .91, y −77.76, bg `#e9e9eb`; card2 .94, −51.84, `#c1c0c7`; card3 .97, −25.92, `#858391`; `sch-img._3` opacity .2. Screenshot: `recon/state-1440-stacking-cards.png`.
- ≤991: cards are 40vw tall and sticky at `calc(30vw + 59px)`, and the heading row is sticky at 59px.
- ≤767: cards are 120vw tall (auto at ≤479), a column with the image below, `sch-img` max 90% at the bottom-right, and the text relative with mt 12vw.

### 10c. Tasking Agent #2 (`.half-split-wrap`, height 200vh; auto at ≤991)
- `.half-split-section`: sticky top 60, height calc(100vh − 60px) = 840 @1440×900, margin-bottom 17vw.
- `.half-head-text-wrap.task-agent` sits absolute top-left (50% width, top hairline) with `h2.h1-text.agent.task` "Tasking Agent" and "#2".
- `#pairTabs.tabs.w-tabs` (`data-duration-in/out=300`, `data-easing=ease-out`): flex row, align flex-end.
  - Left `.tabs-menu` (50%, top hairline, column justify end) holds 3 × `a.tab-link`:
    - padding 36, bottom hairline, transparent bg.
    - Active tab (`.w--current`): bg `#f1f3f3`, bottom border and `box-shadow 0 -1px 0 0` in the same `#f1f3f3`.
    - Title `._30px-text.black`.
    - `.tab-progress-vert` (absolute left, 6px wide, bg `#03c`, height 0%).
    - A hidden `.task-text-row`.
    - Tab heights: 109px each @1440.
  - Tabs: "Patient-to-Provider Messaging" (Routes patient inquiries to the appropriate provider or department.) · "Prescription Refill Management" (Automates prescription refill tasks and order creation, improving medication adherence.) · "Department-Specific Patient Cases" (Supports messaging any internal team such as billing or medical records via patient cases, email, phone messages, or internal tasking systems.).
  - Right `.tabs-content` (50%, 100% height, bg `#020801`): each pane `.tab-pane-wrap` is a column with `.task-img-wrap` (max-height 90%) holding `img.task-img` (`task-img-1..3.avif`, 1440×1408, height 100%), then `._14px-text.white-text.task-text` (max 36ch, ml 36) and noise.
- **Auto-rotation (desktop ≥992 only, M10):** it advances every 4000ms and clicking a tab restarts the timer. The progress bar grows 0→100% height linearly over 4s. The measured rate was 27.2px/s on a 109px tab, which is linear. Pane change is a 300ms ease-out fade.
- ≤991: the progress bar is off and there is no auto-rotation (verified). The active tab reveals `.task-text-row` (black text, mt 38) inside it (IX2 a-29). The section is 80vw tall.
- ≤767: column-reverse (content 121vw tall above the tabs), and the heading is static at the top.

### 10d. Navigator Agent #3 (`.row-tabs-section`, mb 17vw)
- `.horizontal-wrap.navigator`: a rail with a right border, and `.right-side.agent.navigator` with "Navigator<br>Agent" and "#3" (padding-bottom 8.75vw = 126 @1440).
- `.row-tabs.w-tabs` (`data-duration-in/out=0`): flex row-reverse.
  - Left `.row-tabs-content` is the rail (385 wide), bg `#f1f3f3`, top and bottom hairlines. It holds panes with `img.nav-agent-img` (`nav-img-1..4.avif`, 1155×1383), shown at 385×461 @1440 (`.nav-agent-img-wrap` height 101%, absolute).
  - Right `.row-tabs-menu` holds 4 × `a.row-tab-link` (`ms-code-onhover="click"`: **hovering activates the tab**). Each has padding max(36px, 2.5vw) / max(38px, 2.6vw) / left max(36px, 2.5vw), height 119.8 @1440, a bottom hairline, the title `._30px-text.row-tab-head` (width 36vw) and the text `._16px-text.row-tab-text` (max 35ch).
  - Inactive: transparent bg, text `#222`. Active: bg `#020801`, text `#fff`.
  - Tabs: "Smart Call Routing" (Efficiently directs calls to the right department or staff—no lengthy phone tree needed.) · "Answers FAQs" (Answers common patient questions about locations, providers, billing, and services.) · "After-Hours Support" (Ensures patients receive assistance even when your office is closed.) · "The Voice of Your Brand" (Choose your practice's custom AI agent name and from 4,000+ unique voice options).
  - Pane switch is instant. Screenshot: `recon/state-1440-navigator-hover.png`.
- ≤767: column-reverse (image area 121vw tall, images scaled 1.05), and the links become a column with the text below (mt 38).

### 10e. Outreach Agent #4 (`.split-cards-section`)
- Left `.split-cards-left-wrap`: sticky top 60, height calc(100vh − 60px), 50% wide, bottom hairline and right box-shadow line. It holds "Outreach<br>Agent" / "#4" and, at the bottom, `._16px-text.out-left-bottom` "Proactive Patient Engagement & Follow-Ups" (max 22ch).
- Right `.split-cards-right-wrap`: column, padding-top calc(14vw + 144px) (345.6 @1440), gap calc(100vh − 21vw − 60px) (537.6 @1440×900).
- It holds 5 × `.out-card`:
  - sticky `top: calc(204px + 14vw)`, height calc(100vh − 204px − 14vw) = 494.4 @1440×900, min-height 21vw, padding 36, column `space-between`.
  - Top row: title `._30px-text.white` plus the number `._16px-text.white-text.blue-card`.
  - Bottom text `._16px-text.white-text.out-card-text-bottom` (max 33ch).
  - Icon `img.out-icon`: absolute at bottom 24 / right 22, width 6.944vw (100 @1440), 400×400 webp.
- Card colours and fixed offsets (the stacked-deck look, pure CSS):
  - _1 `#03c`, translateY(−14vw − 144px)
  - _2 `#00269b`, (−10.5vw − 108px)
  - _3 `#001a6a`, (−7vw − 72px)
  - _4 `#000d39`, (−3.5vw − 36px)
  - _5 `#020801`, no offset
  - Measured offsets @1440: −345.6, −259.2, −172.8, −86.4, 0.
  - A transparent `.out-card.space` follows (hidden at ≤991).
- Cards: "Patient Recall & Surveys" 01 (Reconnect with past patients and collect feedback to improve care.) · "Targeted Campaigns" 02 (Send customized messages about new services, promotions, and updates.) · "Last-Minute Appointment Slot Fill" 03 (Proactively reach out to backfill cancellations and open appointment slots.) · "Outbound Scheduling Support" 04 (Manage referred patient calls and recover incomplete inquiries automatically.) · "Appointment Reminders" 05 (Reduce no-shows with timely appointment and prescription refill nudges.).
- ≤991: the left wrap is calc(60vh − 60px), and card heights are calc(60vh − 204px − 14vw).
- ≤767: column layout with the left wrap not sticky, cards 60vw tall (80vw at ≤479), icon 16vw (17vw at ≤479).
- Screenshot: `recon/state-1440-outreach.png`.

## 11. Pixel transition white to black (`.transition-cont.white-to-black`)
Container bg `#fff`. Layers: `.transition-wrap.black` (pixels `.pixel.black` (#020801), each holding a `.bg-noise.b-to-w` at z 3) and the blue/green mix layer. All start at opacity 0. Motion M8.

## 12. Specialties (`section.specialty-section#specialties`, mt 5vw, top hairline)
- Rail `.left-side.specialty` with a sticky (top 96) `.specialty-left-side-wrap` (height 32.153vw): `._16px-text.white-text.specialty` "Designed for " + `span.text-span-13` "Your Specialty" (max 12ch). At ≤767 this is 10.133vw display text with the span in green.
- Right `.specialty-tabs.w-tabs` (duration 0), in a row:
  - `.specialty-tabs-menu` (flex 1, mr 36) holds 13 `a.specialty-tab-link` (`ms-code-onhover="click"`, hover activates):
    - padding max(12px, .833vw) 0, bottom hairline, `._30px-text` white, 61px tall @1440.
    - Active: bg `#fff`, text `#020801`, padding-left max(20px, 1.389vw) (20 @1440).
    - Items in order: Orthopedics & physical therapy · Neurology · Ophthalmology & optometry · Podiatry · Gastroenterology · Dermatology · Cardiology · Dentistry & oral surgery · Urology · OB/GYN · ENT · Primary care · Pediatrics.
  - `.specialty-tabs-content`: sticky top 96, width 26.736vw (385), pane height 32.153vw (463) with `img.specialty-img` (1155×1389 avif, max-width 101%, absolute) plus noise.
- `.specialty-bottom-row` has `._16px-text.white-text.specialty-bottom` "And other specialties" (opacity .4, mt 30, padding-bottom 11.944vw).
- ≤767: the image column is hidden, and the active item shows no highlight (transparent bg, white, no indent).
- Screenshot: `recon/state-1440-specialty-hover.png`.

## 13. Integrations (`section.integration-section#integrations`)
- `.integration-top-wrap` (height max(480px, 33.333vw)):
  - `h2.h1-text.white-text.integration-head` "Built to " + `span.integration-head-span` "Connect" (green), max 8ch, margin 36.
  - Right half `.integration-top-right-wrap` (50%): `._16px-text.white-text.integration` "Connect instantly with your EMR, phone system, and workflows—no extra overhead, no missed steps." (max 30ch) and `._30px-text.white.integration` "Native Integrations" (mt −.5vw).
- `.integration-bottom-wrap` (bottom hairline) holds two marquee rows:
  - Row 1 `.integ-row-cont > .intagrations-row._1` ×2, each 1800px @1440, moving left (M2). Items in order:
    - Athena (link `https://marketplace.athenahealth.com/product/transform9`)
    - NextGen (link `https://www.nextgen.com/solutions/marketplace/transform9`)
    - ModMed (link `https://synapsys.modmed.com/s/partner-app/a9YVV00000003lt2AA/transform9`)
    - Epic (no link)
    - Greenway Health (no link)
  - Row 2 `.integ-row-cont._2` (justify flex-end) `> .intagrations-row._2` ×2, each 1440px @1440, moving right: Nextech, Veradigm, eClinicalWorks, systemedx (none linked).
  - Blocks `.integration-block.bl`: min-width 25vw (360), height max(160px, 11.111vw), bg `rgba(2,8,1,.01)`, box-shadow line, centred logo at height max(50px, 3.472vw). The white logo shows by default; a black logo is stacked at opacity 0.
  - ≤991: 30vw × 16vw, logo 40px. ≤767: 48vw × 24vw. ≤479: 50vw × 26vw, logo 32px.
- Hover (M14): the block bg goes to `#fff` over 200ms easeOut, and the logos swap instantly (white opacity 0, black 1).

## 14. Security (`section.secure-section#security`, top and bottom hairlines, mb 10vw)
- Rail `.left-side.security`: bg `#020801` + `secure.avif` (cover, centred). At ≤767 it is 80vw tall (60vw with 120% size at ≤479).
- `.right-side.security`:
  - `.secure-right-top-wrap` (height max(515px, 35.764vw)): `h2.h1-text.white-text.secure` "Secure. Compliant. " + `span.secure-head-span` "Trusted." (`#168ae2`), and `._16px-text.white-text.secure` "We meet the highest standards of HIPAA compliance in healthcare data protection—so your patient information stays safe, secure, and compliant." (max 40ch).
  - `.secure-right-bottom-wrap` (top hairline, row) holds 2 × `.security-row-of-2`, 4 cells in total:
    - NIST 800-53 Moderate Controls (`nist-white.svg` / hover `nist-white-1.svg`, height max(90px, 6.25vw))
    - NIST 800-30 Risk Assessment (`nist-2-white.svg` / `nist-2-white-1.svg`)
    - SOC 2 Type 2 (`soc-white.svg` / `soc-white-1.svg`, height max(132px, 9.167vw))
    - an empty `.secure-block.right`
  - Cells are `flex:1`, height max(325px, 22.569vw), with right hairlines.
- Hover (M14): cell bg `#fff` over 200ms easeOut, logos swap to the black versions. Screenshot `recon/state-1440-secure-hover.png`.
- ≤991: 2×2 grid (row 1 is row-reverse wrap-reverse), cells 20vw tall. ≤767: 40vw tall.

## 15. CTA (`section.cta-section`)
- Height 104.583vw (1506 @1440), 150vw at ≤991, auto at ≤767. Background `cta-img-upd-2.webp`: cover at 40% 60% (50% at ≤991; 230% at 50% −10% at ≤767; 250% at 50% 0 at ≤479). Column justify end, overflow hidden.
- `.transition-cont.black-to-img` sits absolute at the top (transparent container). Black pixels plus the mix layer start at opacity 1 and are removed (M8). Height 25vw at ≤991, 50vw at ≤767.
- `.cta-content-wrap` (height 79.583vw; 125vw at ≤991; 240vw at ≤767; 1080px at ≤479) has a noise overlay and contains:
  - `.cta-top-wrap` (column `space-between`):
    - `.cta-text-top-wrap` (padding 36, top hairline): left "AI Agents" + list "Scheduling / Tasking / Navigator / Outreach" (gap 108), right "Quick Start" + "Live in 60 Days" (gap 90). All are `._16px-text.white-text` with ml 43.
    - Heading `h2.h1-text.white-text.cta-bottom` "Skip the Hold Music." + `span.cta-head-span` "Forever." (green, block; inline at ≤479), line-height 104%, mb 5.65vw.
  - `.hero-home-bottom` (same component as the hero):
    - Left `.hero-bottom-block.bottom-left` (backdrop blur 80px, bg `rgba(2,8,1,.01)`): "Test Our AI Agent" + form `#email-form` with `#input-footer-phone` + "Call Alex" (opens the popup).
    - Right `.hero-bottom-block.bottom-right` (bg `#a2fa8e`, align end): `._16px-text.bottom-cta-right` "See It in Action" (black) + `a.hero-cta-link.black` → `/book-a-demo`, "Book a Demo" in `._56-px-text` with black underlines.
    - Each block is 720×299 @1440.

## 16. "Call Alex" popup (`.modal-wrap`)
- `position:fixed; inset:0; z-index:4; display:none`. When opened: flex column, centred.
- `.modal-overlay`: fixed, `rgba(2,8,1,.9)` + a 2% white gradient. Clicking it closes the popup.
- `.modal-window`: width 39.306vw with min 566 and max 860 (566 @1440), min-height 77vh (693 @900h), padding 36 36 0, border 1px `rgba(255,255,255,.2)`, bg `#020801`, overflow auto, auto margins. Measured 566×703.8 at x 437, y 98.
  - ≤991: min-height auto.
  - ≤767: full-screen, width 100%, min-height 100dvh, no border.
- Contents:
  - Popup logo `.logo-white.popup` (9vw, min 130px).
  - Head "A few details" + `span.text-span-8` (block, green) "before AI calls" (clamp(56px, 3.889vw, 6.222vh), margins clamp(24px,2.222vw,3.556vh) / clamp(24px,3.889vw,6.222vh)).
  - Form `#wf-form-Get-a-Call-Form` (`data-name="Get a Call Form"`, method post): 2×2 grid of fields, gap 36 (24 at ≤767, where it becomes a single column). Each field has a label `._14px-text.white-text.label` (mb 5) and an input `.form-input`. Inputs are transparent with a 1px bottom border `rgba(255,255,255,.2)`, which becomes `#fff` on focus (measured), padding 12 0, 18px text, placeholder `rgba(255,255,255,.3)`, 228×43 @1440.
    - First Name: `First-Name`, text, placeholder "John", required, autofocus.
    - Last Name: `Last-Name`, "Smith", required.
    - Phone Number: `Phone` (#input-popup-phone), tel, "1234567890", required.
    - Email: `Email`, email, "john.smith@company.com", required.
    - All have maxlength 256.
  - Disclaimer `._14px-text.white-text.popup-disc` (color `rgba(255,255,255,.3)`, mt 1.667vw, mb max(40px, 7vh)): "By continuing, you agree to our [Terms of Use](/terms-of-use) and [Privacy Policy](/privacy-policy)". The links are `.links-legal`: underlined, white at .3 opacity, hover 1, `transition: opacity .2s cubic-bezier(.215,.61,.355,1)`.
  - Bottom row: a reCAPTCHA widget (left; strip it) and a submit `input._30px-text.submit-form` "Call Me Now" (`data-wait="Please wait..."`, transparent, white, right-aligned, 30px) with an underline pair (M12).
- **States:**
  - Default.
  - Native validation (`required`). Measured messages: "Please fill out this field." and, for a bad email, "Please include an '@' in the email address. 'not-an-email' is missing an '@'."
  - Success `.success-popup-call-wrap.w-form-done` (replaces the form): "AI Agent" + green "is calling you..." and `._16px-text` "You can close this window".
  - Error `.error-message.popup.w-form-fail`: bg `rgba(230,65,65,.1)`, padding 12 16, mt 24, text `#e64141` "Oops! Something went wrong while submitting the form."
  - Per scope, the clone must **render all of these states with no network submission**. The original POSTs to a hubspotonwebflow endpoint and fires `fetch` to an AWS API. Neither may be reproduced.
- Close button `.close-popup-wrap`: absolute top-right, 60×60, left and bottom hairlines, 24px close icon. Hover: bg `#fff` and the white icon swaps to the black one, 250ms outQuad (measured).
- Open and close timing: see M11. Screenshot `recon/state-1440-modal.png`.
- The hero and CTA inline forms (`#email-form-1`, `#email-form`) have hidden Webflow `w-form-done` ("Thank you! Your submission has been received!", bg `#ddd`, padding 20) and `w-form-fail` ("Oops! Something went wrong while submitting the form.", bg `#ffdede`) blocks. They are never shown in practice because these forms are never submitted (Enter is blocked, and "Call Alex" is a link).

## 17. Footer

### 17a. `section.footer.section` > `.footer-top-wrap`
bg `#020801`, noise overlay, bottom hairline, min-height 48.264vw (695 @1440), padding-top 15.972vw (230 @1440; 22vw at ≤991).
- `.footer-top-row` (top hairline):
  - Rail `.footer-top-left`: "Transform9 improves access, generates savings, and increases efficiency for practices and patients." (`._14px-text` white .5, max 28ch).
  - `.right-side.footer-top-right` (row, `space-between`) holds `.footer-columns-wrap` (gap 120; 50 at ≤991; 2-col grid at ≤479) with columns (gap 26):
    - **Navigate**: Home (`/`, current), Compare, Blog, Case Studies, Careers (workable)
    - **Integrate**: Athenahealth, ModMed, NextGen (the marketplace URLs from §13)
    - **Follow**: LinkedIn (`https://www.linkedin.com/company/transform9`), YouTube (`https://www.youtube.com/@Transform9`)
  - A right group `.footer-top-right` (gap 28) holds Login (portal) and Book a Demo.
  - Column headings are `._14px-text` white .5. Links are `._14px-text.white-text.footer-link` (padding-bottom 6) with `underline-small` pairs (M12b).
- `.footer-subs-wrap` (row, `space-between`):
  - `.footer-bottom-center` (ml 42, padding 36): "Contact Us" then one `mailto:info@transform9.com` link (`._30px-text.white._w-underline`) containing "(205) 892-2888" (`.text-block-4`, pb 9) and "info@transform9.com" with an underline pair.
  - A hidden `.left-side.footer-subs.hide` block has "Call Us" / `tel:+12059083709` "(205) 908-3709" and is `display:none`. Do not render it.
  - `.footer-bottom-right` (mr 74, padding 36, gap clamp(26px,1.806vw,1.806vw)): "Stay Updated" plus the **HubSpot embedded form** (portal 48695808, form f337fd1d-ba9c-494c-bca4-d3ea4891b0a8), rendered in an iframe of 300×154. Measured contents:
    - Label "Email" + red "*" (14px Helvetica Neue, `#33475b`, weight 500).
    - Email input 270×40, bg `#f5f8fa`, border 1px `#cbd6e2`, radius 3, padding 9 10, 16px.
    - "Submit" button: bg `#ff7a59`, white, 700 weight, 14px, padding 12 24, radius 3, hover `#ff8f73`, active `#e66e50`.
    - Error: input border `#c87872` with the message in `#f2545b`.
    - Per scope: replace it with a static, non-submitting replica of these measured HubSpot styles. The inner HubSpot font is Helvetica Neue, not PolySans.

### 17b. `.footer-bottom-wrap` (sticky reveal; see §2)
- `.footer-logo-wrap` (padding 36, bottom hairline): `img.footer-logo` (`logo-footer.svg`, 400×68 viewBox) at full width (1368×232.5 @1440; hidden at ≤767).
- `.footer-bottom-row` (padding max(20px, 1.389vw) 36; 32 at ≤991; column-reverse at ≤767): "© 2026 Transform9. All Rights Reserved." (white .3) and, on the right (gap 36), HIPAA (`/hipaa`), Terms of Use (`/terms-of-use`) and Privacy Policy (`/privacy-policy`). These links are white at .3 opacity, hover 1, with `transition: opacity .2s cubic-bezier(.215,.61,.355,1)`.

Screenshot `recon/state-1440-footer.png`.

---

## 18. Motion inventory

The runtimes are Webflow IX3 (GSAP 3.15 + ScrollTrigger) and IX2.

- IX3 ease index map (verified in runtime): 0 none/linear, 1 power1.in, 2 power1.out, 3 power1.inOut, 5 power2.out, 26 expo.out.
- IX3 default duration when unspecified: **0.5s** (runtime `DEFAULTS.DURATION=.5`).
- IX3 tween types: 0 to, 1 from, 2 fromTo.
- IX2 eases: outCubic = cubic-bezier(.215,.61,.355,1); outQuad = cubic-bezier(.25,.46,.45,.94); inOutQuad = cubic-bezier(.455,.03,.515,.955); easeOut = ease-out. Empty IX2 easing was measured as linear (the tab progress bar).

**Reduced motion:** the original honours `prefers-reduced-motion` **only for the background video**, where the still image is shown instead (verified). The marquees kept moving under `reduce` (−231.9 → −341.1px in 2s), and IX2/IX3 and Lenis are unaffected. *Decision for the main session: the clone may add reduced-motion guards. This spec records the original behaviour.*

| # | Element (selector) | Trigger | Properties | Duration | Easing | Delay / stagger | Repeat | Breakpoints | Source |
|---|---|---|---|---|---|---|---|---|---|
| M1 | `.logos-wrapper` (both tracks) | page load | translateX 0 → −100% of own width, then instant reset to 0 | 44.99s (+0.001s reset) | linear | – | infinite | all | IX3 i-bbae69fc. **Measured speed: 54.05 px/s @1440** (2434px / 45s). Speed scales with track width: 1024 ≈ 38.9 px/s, 768 ≈ 47.4, 390 ≈ 48.0 (computed from widths). |
| M2a | `.intagrations-row._1` ×2 | page load | translateX 0 → −100% | 29.99s | linear | – | infinite | all | IX3 i-d038c279. **Measured 59.96 px/s @1440** (1800/30). 1024: 42.7, 768: 38.4, 390: 32.5. |
| M2b | `.intagrations-row._2` ×2 | page load | translateX 0 → +100% (moves right) | 29.99s | linear | – | infinite | all | IX3 i-7beaf5de. **Measured 47.97 px/s @1440** (1440/30). 1024: 34.1, 768: 30.7, 390: 26.0. |
| M3 | `.bg-pixels-wrapper` (fixed video) | scroll: `.hero.home` start "top top", end "top −10%": leave → play, enterBack → reverse | opacity → 0 | 0.5s (default) | power1.out | – | – | all | IX3 i-819b0df0. The video fades out once the hero has scrolled 10% of the viewport and fades back when scrolling above that. |
| M4 | nav colour swap: `.nav-menu` bg → #fff, `.nav-link-block` color → #020801, `.nav-text.hiden` → #168ae2, `.logo-white`/`.burger-white` → 0, `.logo-black`/`.burger-black` → 1, `.nav-border-on-white` → 1 | scroll: `.white-section` start "top 60", end "bottom 60"; enter play / leave reverse / enterBack play / leaveBack reverse | colours and opacities | 0.05s | power2.out | – | – | all | IX3 i-5ede2c9a (measured on-white values) |
| M5 | `.stats-block` (desktop) | hover (CSS `:hover`) plus IX2 mouseover/out | flex-basis 16% → 100% | 0.6s | cubic-bezier(.645,.045,.355,1) | – | – | ≥992 | CSS |
|   | └ `.stat-head`, `.stat-descr` in hovered block | mouseover | translateY 100% → 0 | 500ms | outCubic | – | – | ≥992 | IX2 a-14 (initial 100% measured) |
|   | └ `.stats-img-wrap` in hovered block | mouseover | opacity 0 → 1 | 200ms | ease-out | – | – | ≥992 | IX2 a-14 |
|   | └ same, on mouseout | mouseout | translateY → 100% (500ms outCubic); image opacity → 0 (200ms ease-out) | | | | | | IX2 a-15 |
| M6 | `.stats-block` tablet/mobile accordion | click (first block auto-clicked on load at ≤991) | 768–991: clicked width → 70%, siblings → 10% (500ms ease-out; pre-step 200ms). ≤767: clicked height → 260px, siblings auto (500ms ease-out). Heading and description of the clicked block translateY 100% → 0 (500ms outCubic); others → 100% (200ms outCubic). Image opacity crossfade (200ms). | 200–500ms | ease-out / outCubic | – | – | ≤991 | IX2 a-17 (medium), a-31 (small/tiny); measured widths 393.9/56.3 @768 and heights 260/62.4 @390 |
| M7 | How It Works: `.hiw-text-block.left` + `.hiw-text._1/_2/_3` | scroll. `.hiw-trigger._1` start/end "bottom center": enter play, enterBack reverse. `.hiw-trigger._2` same. `.hiw-trigger.space` "bottom top": enter play, enterBack reverse. | step 1: left y 0 → 12vw; _1 #a2fa8e → #4c4c4c; _2 #4c4c4c → #a2fa8e. step 2: left y 12vw → 24vw; _2 → #4c4c4c; _3 → #a2fa8e. space: "from" tween back to the initial state (left y 0, _1 green) once the section has left the viewport. | 0.25s | position: power1.inOut; colour: power1.in | – | – | all (the left block is hidden ≤767) | IX3 i-874c7080, i-25416c39, i-d17e6d2e. Measured trace `recon/hiw-scroll-trace.txt`. |
| M8a | `.transition-cont.black-to-white .pixel` (white and mix layers) | scroll scrub 0: container start "top bottom" → end "top −20%" | opacity 0 → 1 (instant flips) | 0 per pixel | none | Row _1 (bottom) at timeline 0, _2 at .2, _3 .4, _4 .6, _5 (top) .8. Within each row a stagger of `amount:1, from:'random', axis:x`. The whole 1.8-unit timeline maps onto the scroll range (≈1.2 × viewport height). | – | all | IX3 i-13bbf4dd |
| M8b | `.transition-cont.white-to-black .pixel` | same scroll scrub | opacity 0 → 1 | 0 | none | same row offsets and random stagger | – | all | IX3 i-65264235 |
| M8c | `.transition-cont.black-to-img .pixel` | same scroll scrub | opacity 1 → 0 (reveals the CTA image) | 0 | none | same | – | all | IX3 i-967dd2ef |
| M9 | Scheduling cards (sticky deck) | scroll scrub 0.5. When card 2 enters (start "top center" → end "bottom bottom 20%"): card 1 y 0 → −1.8vw, scale 1 → .97, bg → #e9e9eb. When card 3 enters: card 2 y → −1.8vw, scale .97, bg → #c1c0c7; card 1 → y −3.6vw, scale .94. When card 4 enters (end "bottom bottom"): card 3 y −1.8vw, scale .97, bg → #858391; card 2 → −3.6vw/.94; card 1 → −5.4vw/.91; `.sch-img._3` opacity → .2 (0.1s power1.out). | 0.25s in-timeline (scrubbed) | none | – | – | all | IX3 i-50410ed3, i-9a9d6453, i-e19166ac. Measured end state @1440: scales .91/.94/.97, y −77.76/−51.84/−25.92px. |
| M10 | Tasking tabs `.tab-link` | auto every 4000ms (≥992, paused while the nav menu is open); a click resets the timer | `.tab-progress-vert` height 0 → 100% on the active tab (the others reset to 0 instantly); pane fade | bar 4000ms; pane 300ms in / 300ms out | bar linear (measured); pane ease-out | – | loops through tabs 1→2→3→1 | ≥992 | inline script (ROTATE_MS 4000), IX2 a-4/a-5, Webflow tabs data-duration 300 |
| M10b | Tasking tabs tablet/mobile | click | active tab shows `.task-text-row` (display none → block) | 0 | – | – | – | ≤991 | IX2 a-29/a-19 |
| M11 | `.modal-wrap` open | click `.hero-cta-link.get-a-call` (hero or CTA "Call Alex") | display none → flex (instant), opacity 0 → 1 | 0.5s (default) | expo.out | – | – | all | IX3 i-75f1d5f3. Measured .68 at 80ms and 1 at 980ms. |
| M11b | `.modal-wrap` close | click `.close-popup-wrap` or `.modal-overlay` | opacity 1 → 0, then display → none at 0.5s | 0.5s | expo.out | display set at 0.5s | – | all | IX3 i-138c644f. Measured .25 at 100ms and none at 1000ms. |
| M12 | underline pair `.underline._1/_2` inside `.hero-cta-link`, `.submit-form-wrap`, `._w-underline` links | mouseover | _1 (anchored right, default 100%) width → 0 (250ms inOutQuad), **then** _2 (anchored left, default 0) width 0 → 100% (250ms inOutQuad) | 250ms + 250ms sequential | inOutQuad | 2nd group starts after the 1st | – | all | IX2 a-32. Measured at 120ms: _1 96/221px, _2 0. |
|   | same | mouseout | instant reset: _1 100%, _2 0 | 0 | – | – | – | all | IX2 a-33 |
| M12b | `.footer-link-wrap .underline-small` (1px, bottom 6px) | mouseover | _1 (left-anchored) 0 → 100% (250ms inOutQuad), then _2 (right-anchored) set to 100% and _1 opacity → 0 | 250ms | inOutQuad | sequential | – | ≥992 | IX2 a-44 (measured end: _1 57.5px op 0, _2 57.5px op 1) |
|   | same | mouseout | _2 and _1 widths → 0 (250ms inOutQuad; the _2 line retracts to the right), then _1 opacity → 1 | 250ms | inOutQuad | – | – | ≥992 | IX2 a-45 |
| M13 | `.test-arrow-wrap.right` / `.left` | mouseover / out | bg rgba(255,255,255,0) → #fff; `.arrow.white` translateX 0 → ±250% (out); `.arrow.black` from ∓250% → 0 | 250ms | outQuad | – | – | all | IX2 a-34..a-37 (measured bg #fff, black arrow 0) |
| M14 | `.integration-block.bl`, `.secure-block` | mouseover / out | bg → #fff / → rgba(2,8,1,0) (200ms ease-out); logo swap white ↔ black (0ms) | 200ms | ease-out | – | – | all | IX2 a-10..a-13 (measured) |
| M15 | `.nav-link-block .nav-text` | mouseover / out | translateY 0 ↔ −100% | 250ms | outQuad | – | – | ≥992 | IX2 a-40/a-41 (measured −19.59px) |
| M16 | `.close-popup-wrap` | mouseover / out | bg → #fff; white icon opacity → 0, black → 1 | 250ms | outQuad | – | – | all | IX2 a-38/a-39 |
| M17 | Nav CTA, legal links, footer legal links, YT play | CSS hover | CTA bg → #f1f3f3 (.2s cubic-bezier(.215,.61,.355,1)); `.links-legal`/bottom-links opacity .3 → 1 (.2s same curve); YT play scale 1.07 (.18s cubic-bezier(.645,.045,.355,1)) | | | | | all | CSS |
| M18 | Mobile menu icons and border | NAVBAR_OPEN / CLOSE | see §3 | 100–200ms | ease-out | 100ms | – | ≤991 | IX2 a-28/a-30 |
| M19 | Testimonial slider | arrow click / swipe | cross-fade between slides | 400ms | ease | – | – | all | Webflow slider data attrs (measured) |
| M20 | Navigator and Specialty tabs | mouseenter (= click) | instant pane swap, active style swap | 0 | – | – | – | hover on desktop; tap on touch | MemberScript #79 + Webflow tabs (duration 0) |
| M21 | Background video | autoplay loop | 15.07s loop | – | – | – | infinite | all (skipped with reduced motion) | inline script |
| M22 | Page scroll | wheel | Lenis smoothing lerp 0.1, wheelMultiplier 0.7 | – | – | – | – | all | inline script |

There are **no load-in or entrance animations** for text, headings or images. The only IX3 load triggers are the marquees. `i-4421358a`, `i-3d901237` and `i-b9fa1e67` have no timelines, so they do nothing. Timelines that target `.bg-pixels`, `.blog-top-header` or `.hero.hide-on-scroll` point to elements that do not exist on the homepage.

---

## 19. Saved snapshot vs live drift

A normalized DOM outline diff shows the **structure and text are identical** (`recon/saved-outline.txt` vs `recon/live-outline.txt`). The differences are:
1. The snapshot was saved from `https://www.transform9.com/?ref=saaspo.com`. Its internal links are absolute (`https://www.transform9.com/compare` and so on) where live uses relative ones (`/compare`), and its `href="#"` anchors became `https://www.transform9.com/?ref=saaspo.com#`.
2. Asset URLs are rewritten to `./…_files/…` in the snapshot. Several assets referenced from CSS, video and meta were **not saved**; see ASSET_MANIFEST.md.
3. The Tasking tab state was captured mid-rotation: the snapshot has tab 3 current and live-at-load has tab 1. This is runtime state, not content.
4. The snapshot's `<html>` already carries runtime classes (`w-mod-js w-mod-ix lenis lenis-smooth has-video w-mod-ix3`).
5. The copyright is identical in both: "© 2026 Transform9. All Rights Reserved."

## 20. Third-party and tracking scripts to strip (all found live)

| Vendor | IDs / URLs |
|---|---|
| Google Tag Manager | `GTM-NDPRKLX3` (inline), `GTM-PHX5M3XF` (Webflow-hosted loader `…phx5m3xf-1.1.1.js`) and the `ns.html` noscript iframe |
| Google Analytics 4 | `G-22T2YVQMMG`, plus `G-P10MKTBZNK` via GTM |
| Google Ads / DoubleClick | `AW-11239851886`, remarketing `18438861906`, `googleads.g.doubleclick.net`, `ad.doubleclick.net`, `google.com/ccm/collect`, `pagead/1p-user-list` |
| LinkedIn Insight | partner `8899442` (`snap.licdn.com/li.lms-analytics/insight.min.js`, `px.ads.linkedin.com`, noscript pixel img) |
| HubSpot | portal `48695808`: `js.hs-scripts.com/48695808.js`, `js.hs-analytics.net`, `js.hs-banner.com` (cookie banner), `js.hscollectedforms.net/collectedforms.js`, `js.hsadspixel.net/pixels.js`, `hs_trackcode_48695808-1.0.6.js`, `track.hubspot.com/__ptq.gif`, forms embed `js.hsforms.net/forms/embed/v2.js` (footer form f337fd1d…), `api.hubapi.com` |
| HubSpot-on-Webflow | `hubspotonwebflow.com/assets/js/form-124.js`, blockList API (popup form endpoint `hubspotonwebflow.com/api/forms/8ab5c64c-43b0-404b-84dd-915bea514c13`) |
| Custom form webhook | on popup submit: `fetch('https://n7bfcway1k.execute-api.us-east-1.amazonaws.com/default/T9-website-outbound')`. **Must not be reproduced.** |
| Intellimize (Webflow Optimize) | customer `117158212` (`cdn.intellimize.co/snippet/117158212.js`, `api.intellimize.co`), anti-flicker style block, localStorage writes |
| OpenAI ads pixel | `bzrcdn.openai.com/sdk/oaiq.min.js`, pixel `EEn1ZCUUpqUwhFfTpp9xkU` |
| ZoomInfo | `js.zi-scripts.com/zi-tag.js` (obfuscated loader), `ws.zoominfo.com/pixel/677446bf12012cd5ddb7567c` |
| Google reCAPTCHA | `google.com/recaptcha/api.js`, site key `6LeN4McrAAAAAHTVeuoChwTLlXRMj50W5mh2NT9v` (popup) |
| Finsweet Attributes v2 | `cdn.jsdelivr.net/npm/@finsweet/attributes@2/attributes.js` (`fs-list`, `fs-socialshare`). Not used visibly on the homepage. |
| Other inline | UTM first-touch cookie script (`t9_utm_*`), `dataLayer` pushes (`ix2_failsafe`, `hubspot_demo_form_success`) |
| Runtime libs (reimplement, don't load) | jQuery 3.5.1, Webflow runtime chunks, GSAP 3.15 + ScrollTrigger, Lenis 1.0.23 |

**External links on the page** (keep as real links, with no prefetch):
- `https://apply.workable.com/transform9/`
- `https://portal.transform9.com/`
- `https://marketplace.athenahealth.com/product/transform9`
- `https://www.nextgen.com/solutions/marketplace/transform9`
- `https://synapsys.modmed.com/s/partner-app/a9YVV00000003lt2AA/transform9`
- `https://www.linkedin.com/company/transform9`
- `https://www.youtube.com/@Transform9`
- `mailto:info@transform9.com`
- `tel:+12059083709` (hidden block only)
- YouTube video `yG3PtcRGQLc` (facade and embed)

Internal routes that stay as links (not cloned): `/compare`, `/blog`, `/case-studies`, `/book-a-demo`, `/hipaa`, `/terms-of-use`, `/privacy-policy`, `/`.

**Head metadata (live):**
- Title: "Transform9 — Maximize Every Call with a Custom AI Agent".
- Meta description, og:description and twitter:description: "Uniquely built AI voice agents for specialty physician practices that eliminate hold times, reduce call center costs, and fill physician schedules 24/7."
- og:image: `68b191f59984678d1bd51942_Open%20Graph-opt.png`. Favicon: `68b1a0c9c9ebd677661d6e72_Favicon.png`. Apple touch icon: `68b1a1cfecdee53d15e5d2f9_Webclip-white.png`. None of these are in the snapshot.
- JSON-LD Organization block: telephone +12059083709, email info@transform9.com, and sameAs LinkedIn and YouTube.

## 21. Unknowns and caveats (flagged, not invented)
1. **IX3 `end: "bottom bottom 20%"`** on scheduling cards 2 and 3 is copied verbatim from the Webflow data. How GSAP interprets that 3-token string was not measured frame by frame. Only the end state was measured.
2. **IX3 "space" trigger (M7)** uses tween type "from" with colours `#4c4c4c → hsla(0,0%,12.94%)` (#212121) for _1/_2. Measured behaviour: everything returns to the initial state (_1 green, left y 0) once the section is off-screen. The intermediate colour #212121 was never observed.
3. **Pixel-transition random order:** GSAP `stagger.from:'random'` generates a new order on every page load, so no fixed order exists.
4. **Marquee px/s at 1024/768/390** is computed from the measured track widths and the IX3 durations. Direct sampling was done at 1440 only.
5. **The HubSpot footer form** renders in an iframe. Its fields and styles were read from the same-origin iframe DOM. Its success and error states were not triggered, because that would require submission. The error styles quoted are from HubSpot's injected CSS.
6. **The YouTube thumbnail** (`i.ytimg.com`) is a third-party image and is not in the snapshot. Whether to hotlink it or save a local copy is a main-session decision.
7. **The reCAPTCHA widget's** size and position in the popup were not measured (it is third-party and should be stripped). Its container is `.captcha-popup` at the bottom-left of the popup.
8. Touch behaviour (swipe on the slider, hover-as-click on touch devices) was not tested. Only mouse emulation was used.
9. At 1440, `img.task-img` for tab 1 reported 0 width in one full-scroll pass because of lazy-load timing. The pane layout comes from CSS (`.task-img-wrap` max-height 90%; image height 100%, auto width, natural 1440×1408).

## 22. Evidence files (`/Users/riyaghosh/V3/transform/recon/`)
- `network-1440.json`: every request on live (status, type, URL).
- `live-dom-1440.html`, `live-outline.txt`, `saved-outline.txt`: rendered DOM and outlines used for the drift diff.
- `measure-{1440,1024,768,390}.json`: computed styles and rects for every distinct class combination (≈415 per viewport).
- `computed-compact.txt` (and `computed-summary.txt`): human-readable cross-viewport table of the above.
- `homepage-rules.css`: source CSS rules for the homepage classes, grouped by breakpoint.
- `ix3.json`, `ix3-readable.txt`, `ix3-register.js`: Webflow IX3 (GSAP) interactions and timelines.
- `ix2.json`, `ix2-events.txt`, `ix2-actions.txt`, `ix2-init.js`: Webflow IX2 events and action lists.
- `states-1440.json`, `states-mobile.json`, `hiw-scroll-trace.txt`: interaction and state measurements.
- `assets.json`: machine-readable asset inventory (see ASSET_MANIFEST.md).
- Screenshots: `live-{1440,1024,768,390}-full.png`, `live-*-top.png`, `state-1440-*.png`, `state-768-*.png`, `state-390-*.png`.

Source: https://www.transform9.com/book-a-demo

# /book-a-demo: build spec

Recon, 2026-09-30. The live site is authoritative. Browser conditions are those of CLONE_SPEC §0, and the viewports are 1440×900 / 1024×900 / 768×1024 / 390×844.

- Webflow page id: `689ee4e9c4e29b55e2476ea3`.
- Title and og/twitter title: "Book a Demo".
- Meta description, og:description and twitter:description: "Book a demo with Transform9 to see how AI voice agents cut call center costs, eliminate hold times, and improve patient access 24/7."
- og:image, favicon and webclip: the same as the homepage.
- JSON-LD: a `WebPage` block (name "Book a Demo", `url:/book-a-demo`, `about` = the Transform9 Organization with telephone, email and sameAs as on the homepage).
- Document height: 1265 @1440 · 1194 @1024 · 1468 @768 · 1085 @390.
- Evidence is in `/Users/riyaghosh/V3/transform/recon/pages/book-a-demo/`:
  - `bad-{w}.json` and `bad-{w}-outline.txt`.
  - `bad-computed-compact.txt`, the cross-viewport table.
  - `book-a-demo-rules.css`: the source CSS for the page classes.
  - `raw.html`.
  - Screenshots: `bad-{w}-top.png`, `bad-{w}-full.png`, `crop-390.png` and `state-{1440,390}-*.png` (focus, success-forced, fail-forced, scrolled-bottom).
  - Shared IX data and tools are in `../compare/shared/`.

---

## 0. Shell: differences from the homepage

| Shell part | Homepage | /book-a-demo |
|---|---|---|
| Navbar | §3 | **Identical DOM and styles.** `w--current` is on the desktop "Book a Demo" CTA and on `.mobil-top-cta`, and the logo no longer has it. No CSS targets it, so there is no visual change: the CTA stays green `#a2fa8e`. The initial state is identical. |
| Nav on-white swap (M4) | yes | **no.** There is no `.white-section`. The nav stays `rgba(2,8,1,.5)` with the blur. |
| `.preloader-wrap` | absent | **absent.** This page is in the IX3 intro scope, but it has no preloader element. |
| `.bg-pixels-overlay` | absent | absent |
| Background layers (`.page-wrap-solid-bg`, `.bg-pixels-wrapper` video/still, `.bg-noise-wrap`) | §2 | Identical. The video fade is **M3b**: the same timeline as M3, but triggered by `.hero.hide-on-scroll` (IX3 `i-37f61121`, start "top top", end "top −10%"). Verified: the video wrapper's opacity is 0 at scrollY 200. |
| Call Alex modal | yes | **absent.** There is no `.modal-wrap` in the DOM. |
| Footer | `section.footer` + `.footer-bottom-wrap` | **Only `.footer-bottom-wrap`** (logo + legal row, §17b). There is **no `section.footer.section`**: no top footer, no HubSpot footer form, no contact block. `.page-wrap` ends at the hero, so scrolling 365px (1440), 294 (1024), 280 (768) or 188 (390) reveals the sticky bottom footer from under the hero. At ≤479 `.footer-logo` is `display:none` (existing rule). |
| Page-load intro | none | IX3 `i-eccee64b` (BAD-M1). The only targets present on this page are the nav and the pixels wrapper. |

## 1. Section order

| # | Root | 1440 y/h | 1024 | 768 | 390 |
|---|---|---|---|---|---|
| 1 | `section.hero.hide-on-scroll.demo` | 0/900 | 0/900 | 0/1187.3 | 0/896.8 |
| 1a | └ `.book-demo-left` | 0/899 (w 701.3) | 0/899 (w 493.1) | 0/659 (w 768) | 0/434.2 |
| 1b | └ `.book-demo-right` | x 701.3, 0/899 (w 738.7) | x 493.1 (w 530.9) | 659/528.3 | 434.2/462.6 |
| 2 | `.footer-bottom-wrap` (sticky; outside `.page-wrap`) | h 365.1 | 294.4 | 280.3 | 188.2 |

## 2. Hero (`section.hero.hide-on-scroll.demo`)

**Section**
- Base: `display:flex; flex-direction:row; justify-content:space-between; position:relative; overflow:hidden`. min-height 100dvh (900 / 900 / 1024; 0 at ≤479), height auto, padding-top 0.
- Border-bottom 1px `rgba(255,255,255,.2)` at ≥992. None at ≤991.
- ≤991: `flex-direction:column; overflow:visible; padding-bottom:0`.
- The background is transparent, so the fixed video shows through on the left.

**Left `.book-demo-left`**
- Layout: `flex; column; justify-content:space-between; width:100%; padding-top:110px`. At ≤991 `flex:1`. At ≤479 padding-bottom 29.
- H1 `h1.white-text.hero-home.demo`: "30 minutes. Real Demo.<br>No Sales Script."
  - Colour: **`#a2fa8e`**, via `--_apps---sidebar--sidebar-primary-dark` = `var(--green)`.
  - Size: the homepage hero H1 scale, 93.6 / 66.56 / 75 / 49.92, line-height 101%.
  - Margins, top right bottom left: `-4 12 32 76` @1440 and 1024; `-4 12 32 47` @768; **`-27 12 80 34` @390**.
  - Max-width comes from the homepage H1 rules: 1198 / 852 / 672 / 287.5.
  - Measured rect: 76,106 613×378 @1440 · 76,106 405×269 @1024 · 47,106 672×227 @768 · 34,83 287.5×201.7 @390.
- Paragraph `div.text-block-5`: "A quick, 30-minute Q&A and demo so that you get the answers you need to the questions you're asking. No hard sell, just a chance to connect and show you how we're helping practices across the country."
  - The source has straight apostrophes (`&#x27;`) and ends with two spaces and a `<br>`.
  - Type: 14px / 19.6, weight 400, **colour `#e0e0e0`** (`--_apps---sidebar--sidebar`, NEW token), left-aligned.
  - Box: margin `0 43 139 76`, padding `0 41 96 0`. The rule also sets `position:static` and `top:-70px`, which has no effect.
  - ≤479: margin `-60 43 -52 34`, padding `0 41 35 0`.
  - Measured rect: 76,605.2 582×154.8 @1440 · 76,566 374×194 @1024 · 76,365.3 649×154.8 @768 · 34,304.7 313×152.6 @390.

**Right `.book-demo-right`**
- Box: width 100%, `position:relative`, bg **`#020801`** (it covers the video), left border 1px `rgba(255,255,255,.2)`.
- Padding: `120 36 36` at ≥992. ≤991: `80 20 3vh` (30.72 @768), top and bottom hairlines, no left border. ≤767: padding-bottom 36. ≤479: padding `7 20 38`.
- **Noise overlay** `.bg-noise.book-demo-form-noise`:
  - Absolute, inset 0, z-index 0, `pointer-events:none`, opacity .5 (≥992) / .3 (≤991). `display:none` at ≤479.
  - It is positioned and the form is not, so the noise **paints on top of the form fields**. That is why the white inputs look grain-tinted light grey in screenshots. Reproduce this stacking: noise above the form with pointer-events none.
- **Form** `.w-form > form#wf-form-T9-demo-form`:
  - Attributes: `name="wf-form-T9-demo-form"`, `data-name="T9 demo form"`, method get.
  - The form uses **Webflow default form styles, with no custom classes.**
  - Width: 665.7 @1440, 457.9 @1024, 728 @768, 350 @390. Height 400.6.
  - Top y: 120 (≥992); 740 @768 (page coordinates); 442.3 @390.
  - `.w-form` margin-bottom 15.
  - Fields in order, each a `<label for>` followed by `input.w-input` (type, `maxlength=256`, **required**):

| label (for) | name / id | type | placeholder |
|---|---|---|---|
| First Name | `first_name` | text | First Name |
| Last Name | `last_name` | text | Last Name |
| Email Address | `email` | email | Email |
| Practice Name | `practice_name` | text | Practice Name |
| EMR/PMS | `emr_pms` | text | EMR/PMS |

  - **Labels:** 14px / 19.6, **weight 700**, `display:block`, margin-bottom 5, cursor default. Colour **`#020801` on a `#020801` background, so they are invisible on live.** Reproduce them present but invisible, and keep them for accessibility.
  - **Inputs:**
    - Box: height 38, padding 8 12, margin-bottom 10, bg `#fff`, border 1px `#ccc`, radius 0.
    - Text: 14px / 20 PolySans, colour `#333`. Placeholder `#999`.
    - **Focus:** border `#3898ec`, outline none (measured).
  - **Submit** `input.w-button` "Book My Demo" (`data-wait="Please wait..."`):
    - Box: 125.8×37.6, `display:inline-block`, padding 9 15, bg **`#3898ec`**, radius 0.
    - Text: white, 14px / 19.6, centred, cursor pointer.
    - **No hover change** (measured).
    - Rect: 738.3,483 @1440; 20,805.2 @390.
- **Honeypot:** an inline script appends `input[name=website_url]` (absolute, left −9999px, `tabindex=-1`, `aria-hidden`). The clone does not need it, because it never submits. Omit it or keep it hidden.

## 3. Form states and behaviour (live)

- **Submit handling:** the inline script calls `preventDefault` and `stopImmediatePropagation`. It then runs `form.checkValidity()` and, if invalid, `form.reportValidity()`.
- **Validation:**
  - Native messages (Chromium): "Please fill out this field." for each empty field. The first invalid field (`first_name`) receives focus.
  - Bad email: "Please include an '@' in the email address. 'not-an-email' is missing an '@'."
- **Bot guard:** if the form is submitted less than 1500ms after load, or with the honeypot filled, the submission is silently ignored.
- **Submitting:** the button is disabled and its value becomes "Submitting...". The script then POSTs to `https://api.hsforms.com/submissions/v3/integration/submit/48695808/648fcbd8-42b8-43d6-9de7-dce32fd9ffb2`.
  - Payload fields: firstname, lastname, email (object 0-1); name = practice, emrpms and utm_* (object 0-2).
  - Context: pageUri, pageName and the hutk cookie.
- **Success:**
  - A `dataLayer` push `hubspot_demo_form_success` and a document CustomEvent.
  - **If HubSpot returns `redirectUri`, `window.location.assign(redirectUri)`.**
  - Otherwise the form is hidden and `.w-form-done` is shown and focused.
- **Success block** `.w-form-done`: "Thank you! Your submission has been received!", bg `#ddd`, padding 20, centred text, `#020801`. 665.7×59.6 at the form's position (forced; screenshot `state-1440-success-forced.png`).
- **Error block** `.w-form-fail`: "Oops! Something went wrong while submitting the form.", bg `#ffdede`, padding 10, margin-top 10, `#020801`. 665.7×39.6, shown below the form (forced; `state-1440-fail-forced.png`). The button is restored to "Book My Demo".
- **Clone policy (PROJECT_SCOPE, D2):** render the default, validation, success and error states with no network call. **Flag for the main session:**
  - (a) What the success state should show. Live may redirect to a HubSpot `redirectUri`, possibly a meetings scheduler, but that URL cannot be observed without a real submission. **UNKNOWN; not invented.**
  - (b) Whether to reproduce the "Submitting..." interim label.
  - (c) The honeypot and the 1500ms guard are unnecessary without submission.

## 4. Embeds and third-party scripts specific to this page
- **No scheduler/calendar iframe or embed exists on the page.** The live iframes are only the GTM noscript and one hidden empty iframe. The only "embed" is the scripted HubSpot Forms API call above. Strip it per D1/D2.
- **Finsweet `@finsweet/attributes-selectcustom@1/selectcustom.js`** is loaded. It has nothing to act on (there is no custom select). Strip it.
- **Inline "ms-code-dropdown-redirect" scripts ×2.** They look for a `select[ms-code-dropdown-redirect]` (none exists), would set a redirect or a `specialty` hidden field, and would `window.open` after success. They are dead code on the current page. Strip them.
- **Inline `<style>` for `#t9-hubspot-form`** (lime `#B8FF6F` button, transparent underlined inputs and so on). **No element with that id exists, so it is dead CSS.** Do not implement it.
- Everything else is the homepage vendor set (§20), except that **`js.hsforms.net/forms/embed/v2.js` is not loaded here** because there is no footer form. The page bundle is `webflow.a19627bd.2e649d53df280dc8.js` plus schunk `62ee8929a8944272` (IX data module 9282). The Webflow tabs module is not included.

## 5. Tokens

The homepage tokens are reused. **New:**

| Token | Value | Where |
|---|---|---|
| `text-muted-light` (`--_apps---sidebar--sidebar`) | `#e0e0e0` | `.text-block-5` |
| Webflow default form: label | `#020801` (the inherited body colour), 700 | labels (invisible) |
| Webflow default form: input text / border / placeholder / focus | `#333` / `#ccc` / `#999` / `#3898ec` | inputs (same values as the homepage `.input-white` defaults) |
| Webflow default button | bg `#3898ec`, text `#fff` | "Book My Demo" |
| Webflow done / fail bg | `#ddd` / `#ffdede` | state blocks (same values as homepage §16 notes) |

## 6. Motion inventory (/book-a-demo)

Shared, by homepage id:

| Id | Notes |
|---|---|
| M3b | The M3 values (opacity → 0, 0.5s default, power1.out; reverses on enterBack), triggered by `.hero.hide-on-scroll` |
| M15 | Nav link roll |
| M17 | Nav CTA hover and legal-link hover |
| M18 | Mobile menu |
| M21 | Background video loop |
| M22 | Lenis smooth scroll |
| Footer reveal | Sticky `.footer-bottom-wrap` (§2 of CLONE_SPEC) |

**Not present:** M1, M2, M4–M14, M16, M19 and M20.

| # | Element | Trigger | Properties | Duration | Easing | Delay | Repeat | Breakpoints | Source |
|---|---|---|---|---|---|---|---|---|---|
| BAD-M1 | Load intro (IX3 `i-eccee64b` / `t-bd0be8f7`; only the nav and pixels targets exist here) | page load | `.bg-pixels-wrapper` opacity 0→1; `.nav-menu` opacity 0→1 | pixels .08s; nav 1.2s | pixels power1.out; nav expo.out | pixels at .02s; nav at .1s | once | all | IX3 + rAF samples (`../compare/shared/states.json` → `book-a-demo-intro`): pixels 0.12 at +34ms and 1 at +117ms; nav 0.04 at +117ms, 0.51 at +233ms, 0.93 at +550ms, ≈1 at +1.2s. The H1, paragraph and form have **no** entrance animation. The `._16px-text.white-text.book-demo-hero` target does not exist in the DOM. |
| BAD-M2 | Input focus | `:focus` (Webflow CSS) | border `#ccc` → `#3898ec` | instant | – | – | – | all | measured |

**Anti-flicker (live):** `.nav-menu` and `.bg-pixels-wrapper` are `visibility:hidden` until `html.w-mod-ix3`, which the failsafe adds at 2000ms (measured 2.27s). The intro then started at 2.87s. The clone should start the intro on mount; this is the same main-session decision as for /compare.

## 7. External and internal links
- Nav and footer-bottom links only: HIPAA, Terms of Use, Privacy Policy, plus the nav set.
- There are no page-specific links.

## 8. Asset inventory (/book-a-demo)
**No new assets.** Everything loaded is already in the homepage manifest:
- The nav logos (`68639bb30a93107837363b04_logo-2.svg`, `68906575d051bc5b61776ed5_logo-black.svg`).
- The menu icons (`68a300503634463bc8a25527_menu-burger.svg`, `689caa3e67c8dbd2e70dc1bc_close-icon-white.svg`, `68a5a50307e780f41451718b_menu-burger-close.svg`).
- The noise (`6894eeb12060be5400f13d15_…_noise.webp`).
- The video (`6aae963300a522b95e867d73_Tablet-Final_mp4.mp4` / `_webm.webm` / `_poster.0000000.jpg`) and the still (`68aeb9fc729ad96012dc97f0_tablet-pixels.webp`).
- `68920b38695cade17f6e41a0_logo-footer.svg` (≥480 only) and `6883559817085db21b9e44bb_PolySans-Neutral.woff2`.

## 9. Unknowns
1. **HubSpot `redirectUri`.** It is unobservable without a real submission (see §3). The clone's success state defaults to the visible Webflow `.w-form-done` block.
2. **Label invisibility.** Black on black looks like a live styling oversight, but it is the measured live state. Keep it, and flag it for the main session in case it wants visible labels as an accessibility deviation.
3. **Touch.** Touch and virtual-keyboard behaviour was not tested.

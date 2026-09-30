Source: https://www.transform9.com/terms-of-use

# Legal pages: /terms-of-use, /privacy-policy, /hipaa (one template)

Recon, 2026-09-30. The live site is authoritative. The other sources are https://www.transform9.com/privacy-policy and https://www.transform9.com/hipaa. Browser conditions are those of CLONE_SPEC §0, and the viewports are 1440×900 / 1024×900 / 768×1024 / 390×844.

Evidence is in `/Users/riyaghosh/V3/transform/recon/pages/legal/`:
- Per-page files, where page = terms / privacy / hipaa:
  - `{page}-{w}.json`: computed styles, rects and network requests.
  - `{page}-{w}-outline.txt`: the DOM outline.
  - `{page}-computed-compact.txt`: a cross-viewport table.
- `legal-rules.css`: the source CSS for the template classes.
- `{slug}.raw.html`: the server HTML.
- **`{slug}-content.html`: the verbatim hero and legal-section markup. This is the content source for the build.**
- Screenshots: `{page}-{w}-top.png`, `{page}-{w}-full.png` and `crop-390-top.png`.

Shared IX data and tools are in `../compare/shared/`.

## 0. Template verdict

**The three pages share one template.** The sorted set of unique class keys and element types is identical across the three pages at 1440. The only differences are in content, and the same classes are used for them:

| Variant axis | /terms-of-use | /privacy-policy | /hipaa |
|---|---|---|---|
| Webflow page id | `689e1cfb97d0e7e685653b04` | `689dea200fb900e46da06e9d` | `68a2eb39d57a3099efd14ac5` |
| `<title>` / og:title | Terms of Use | Privacy Policy | HIPAA |
| Meta / og / twitter description (= hero intro text) | "At Transform9, we help you easily book appointments with your preferred doctor. This document outlines key information to review before making a decision." | "This Privacy Policy explains what Personally Identifiable Information (“PII”) is, as defined by US privacy law, and how we collect, use, protect, or otherwise handle it in connection with our website." | "Transform9 helps you book appointments and may share certain health information with your provider. Some of this data is considered 'PHI' under HIPAA and may require your authorization." |
| H1 | How To Understand Our Terms Of Use \| Transform9 | How We Protect Your Data: Privacy Policy \| Transform9 | HIPAA Compliance Services \| Expert Solutions |
| Hero paragraph modifier | `.legal-terms`: max 31ch, **no left margin** (x 36) | `.legal-privacy`: max 38ch, **ml 43** (x 79) | `.legal-privacy` (same) |
| Blocks | 18 (17 H2s; block 1 has no H2; last is `.last`) | 16 | 6 |
| Green sub-heads `p._22px-text-green` | 12 (in blocks 8, 9 and 18) | – | – |
| Bullet lists `ul.list-white.transp > li.list-item > p` | – | 8 lists / 24 items | 2 lists / 11 items |
| Inline links `a.link-transp` (`target=_blank`) | – | 2 | – |
| `<br>` inside paragraphs (paragraph breaks) | 85 | 39 | 8 |
| JSON-LD | `WebPage` (+ Organization `about`) | `WebPage` (inLanguage en, Organization `about`) | `WebPage` with `about` = `Article` "HIPAA Authorization and Protected Health Information" |
| Document height 1440 / 1024 / 768 / 390 | 16886 / 16458 / 13883 / 25968 | 8142 / 7828 / 7278 / 10092 | 4406 / 4206 / 4000 / 5589 |

There is no `<strong>`, `<em>` or `<span>` inside the legal content. Copy the text **verbatim** from `{slug}-content.html`, including curly quotes, “ ”, the `&#x27;` apostrophes, the zero-width joiners (U+200D) after some sentences in the privacy policy, and the `<br><br>` paragraph breaks.

**Build recommendation:** one `LegalPage` component with data `{title, h1, intro, introVariant: 'terms'|'privacy', blocks[]}`. Each block is `{h2?, items[]}`, where an item is a paragraph (HTML with `<br>` and links), a list (array of HTML strings), a green sub-head, or a text-wrap group (see §3 nesting).

## 1. Shell: differences from the homepage

| Shell part | Homepage | Legal pages |
|---|---|---|
| Navbar | §3 | **Identical**, and the logo loses `w--current`. The initial state is identical. |
| Nav on-white swap (M4) | yes | **no** (no white section). The nav stays `rgba(2,8,1,.5)`; measured over the content. |
| `.preloader-wrap` | absent | **present**: the same element and styles as on /compare. Fixed full-screen `#020801`, z 4, pointer-events none, head style `display:block`. It fades out in the intro. |
| `.bg-pixels-overlay` | absent | absent |
| Background layers | §2 | Identical. The video fades after 10% of hero scroll via **M3b**: IX3 `i-37f61121` on `.hero.hide-on-scroll`. Measured on /privacy-policy: opacity 1 at scrollY 89, 0 at 120. |
| Call Alex modal | yes | **absent** (no `.modal-wrap`) |
| Footer | §17 | **Identical, full footer** (`section.footer.section` including the HubSpot footer form, plus `.footer-bottom-wrap`). The current page's legal link in the bottom row gets `w--current`, which has no visual effect. |
| Page-load intro | none | IX3 `i-eccee64b` (LGL-M1) |

## 2. Section order

| # | Root | terms 1440 y/h | privacy | hipaa | notes |
|---|---|---|---|---|---|
| 1 | `section.hero.hide-on-scroll` | 0/900 | 0/900 | 0/900 | 900 / 900 / 1024 / 844 (100dvh) at the four widths |
| 2 | `section.legal-section > .legal-cont` | 900/14870.7 | 900/6126.4 | 900/2390.8 | starts at 900 / 900 / 1024 / 844 |
| 3 | `section.footer.section` | 15771/750 | 7026/750 | 3291/750 | footer heights as on the homepage (750 / 683.7 / 713.3 / 1077.6) |
| 4 | `.footer-bottom-wrap` | h 365.1 | | | 294.4 / 280.3 / 188.2 |

Legal-section heights at 1024 / 768 / 390:
- terms: 14580.2 / 11864.9 / 23857.8
- privacy: 5949.5 / 5260.4 / 7982.2
- hipaa: 2328.3 / 1982.6 / 3479

## 3. Hero (`section.hero.hide-on-scroll`)

- **Section:** the `.hero` base. `display:flex; column; justify-content:space-between; position:relative; overflow:hidden`, min-height 100dvh.
  - Padding-top 110, **90 @390**.
  - Padding-bottom 30.72 at 768, which is 3vh of the 1024px viewport height (the same tablet rule as the homepage `.hero`); 0 elsewhere.
  - Transparent, so the video shows through.
- **H1** `h1.white-text.hero-home.legal`:
  - White, the homepage hero H1 scale: 93.6 / 66.56 / 75 / 49.92, line-height 101%.
  - Margins 120 119 9 76; ml 47 @768; **12 10 24 34 @390**.
  - Max-width 1198.1 / 852 / 672 / 287.5 (homepage 20ch / 14ch / 9ch rules).
  - Top 230 at 1440 / 1024 / 768 and 102 @390.
  - Heights for terms: 189 / 134.4 / 303 / 252.1.
- **Bottom row** `.hero-home-bottom.legal`:
  - Flex, `position:relative`, bottom border `1px rgba(255,255,255,.2)`.
  - Min-height max(300px, 20.833vw) = 300 (auto at ≤479). Measured h 303.4 / 300 / 300 / 261.
  - y: 596.6 / 600 / 693.3 / 583.
  - Column at ≤479.
  - Contains:
    - `.hero-bottom-block.full-width`:
      - Box: the full width. Padding 36 (≥992) / 20. Column, `space-between`, gap 64. bg `rgba(2,8,1,.01)`. No right border (`.full-width`). `position:relative`.
      - Label `._16px-text.white-text` "About Page" (the same label on all three pages): white, 16 / 16 / 14 / 16px, ml 43 (0 @390).
      - Paragraph `p._30px-text.home-hero-text.white.legal-{terms|privacy}`: white, 30 / 21.33 / 18 / 19.5, line-height 1.2.
        - Max-width, terms: 595 / 423 / 357.1 / 386.9.
        - Max-width, privacy/hipaa: 729.4 / 518.5 / 437.8 / 474.2, with ml 43 at every width (x 79 / 79 / 63 / 63).
    - `.line-hor.on-hero`: absolute, top of the bottom row, 1px `rgba(255,255,255,.2)`, full width. It grows 0→100% in the intro.
- There is **no `.line-vert`** in the legal hero.
- `.bg-circle-wrap.home-hero.legal > .bg-circle` is present but `display:none`. Do not render it.

## 4. Legal content (`section.legal-section`)

- **`.legal-section`:** `display:flex; justify-content:center; align-items:flex-start`, padding-top max(80px, 5.556vw) (80 at every measured width; 106.7 @1920), padding-bottom 0. ≤991: padding 20 left and right.
- **`.legal-cont`:** `flex; column`, gap clamp(36px, 2.5vw, 2.5vw) (36 at ≤1440; 24 at ≤479).
  - Width 50vw, min 720, max 960. That is **720 at 1440 and 1024** (x 360 / 152), 960 at 1920.
  - ≤991: width 100%, min auto (728 @768, 350 @390).
- **`.legal-block`:** `flex; column`, gap clamp(30px, 2.083vw, 40px) (30; **20 at ≤479**), padding-bottom max(36px, 2.5vw) (36; **24 at ≤479**), bottom border `1px rgba(255,255,255,.2)`.
  - **`.legal-block.last`:** no border, padding-bottom 0.
- **Block heading** `h2._30px-text.white`: white, 30 / 21.33 / 18 / **24**, line-height 1.2. Terms heads are ALL CAPS in the source text, e.g. "1. ABOUT THE SITE".
- **`.legal-text-wrap`:** `flex; column`, gap 24px at every width.
- **Body paragraph** `p._16px-text.white-text.transp`:
  - Colour **`rgba(255,255,255,.5)`** (`#ffffff80`, not opacity). Size 16 / 16 / **14** / 16, line-height 1.4 (22.4 / 19.6).
  - **margin-left 43px** at ≥480 (from `._16px-text.white-text`), so body text is indented 43px relative to the headings. 0 at ≤479.
  - Margins are otherwise 0. Paragraph breaks inside one `<p>` are `<br><br>`.
- **Green sub-head** `p._22px-text-green` (terms only):
  - `#a2fa8e`, font-size max(1.375rem, 1.528vw) = 22 (22.0 @1440, 29.3 @1920), line-height 1.4 (30.8), **no indent**.
  - Texts: 7.1 Your Responsibilities Generally · 7.2 Responsibilities of Healthcare Providers and Others in the Healthcare or Medical Industries · 8.1 Changes to the Services; New Services · 8.2 Additional Terms · 17.1 Electronic Contracting; Copyright Dispute · 17.2 Changes to These Terms of Use · 17.3 Limitation of Claims · 17.4 Choice of Law; Arbitration Clause and Class Action Waiver – Important – Please Review as This Affects Your Legal Rights · 17.5 Entire Agreement · 17.6 Headings · 17.7 Assignment · 17.8 Eligibility.
- **Lists** `ul.list-white.transp`:
  - Colour `rgba(255,255,255,.5)`, so the disc bullets are .5 white. Browser default disc, padding-left 40, 14px base font.
  - `li.list-item`: `display:list-item`. It wraps `p._16px-text.white-text.transp`, which keeps its ml 43, so the text sits 43px right of the bullet column at ≥480.
  - List items are stacked with no gap. Measured @1440: items 22.4px per line with no extra spacing.
- **Inline link** `a.link-transp` (privacy only):
  - White, **opacity .5**, underline. **No hover change** (measured opacity .5 on hover; no transition).
  - Both links show their URL as the link text:
    - `https://support.google.com/adwordspolicy/answer/1316548?hl=en`
    - `http://consumercal.org/california-online-privacy-protection-act-caloppa/#sthash.0FdRbT51.dpuf`
  - Both are `target=_blank`. The clone adds `rel="noopener"` (the D6 pattern).
  - The `.link-transp.legal` variant (opacity .4) exists in CSS but is unused.

**Nesting rules** (verified in the source):
- A block is `h2` then one or more children.
- Normally the children are one `.legal-text-wrap` containing `p` and `ul` siblings (gap 24).
- In terms blocks 8, 9 and 18, green sub-heads appear as **direct children of `.legal-block`** (gap 30), for example `h2, p.green, .legal-text-wrap, p.green, .legal-text-wrap`.
- In terms block 18 ("17. MISCELLANEOUS"), after the first wrap, the `p.green` and `p._16px…transp` pairs are direct children of the block (gap 30 between all of them).
- Terms block 1 has no H2. It starts with "Effective Date: January 1, 2024<br>Last Modified: April 4, 2024<br><br>The following terms…".

**Block headings per page** (full text is in the content files):
- **Terms:** (block 1, no heading) · 1. ABOUT THE SITE · 2. WE DO NOT PROVIDE MEDICAL ADVICE · 3. NO DOCTOR PATIENT RELATIONSHIP · 4. AUTHORIZATION AND ACKNOWLEDGEMENT; IMPORTANT INFORMATION ABOUT HEALTHCARE PROVIDER RELATIONSHIPS AND HEALTHCARE PROVIDER LISTS · 5. THE SERVICES AND CONTENT ARE INFORMATIONAL AND EDUCATIONAL RESOURCES · 6. YOUR PERSONAL INFORMATION · 7. YOUR RESPONSIBILITIES · 8. CHANGES TO THE SERVICES; NEW SERVICES; ADDITIONAL TERMS · 9. LINKS TO OTHER WEBSITES · 10. CONTENT YOU POST OR SUBMIT · 11. YOUR USE OF CONTENT · 12. SHORT CODE STANDARDS FOR SMS AND MMS MESSAGING VIA MOBILE CARRIERS · 13. DISCLAIMER · 14. GENERAL LIMITATION OF LIABILITY · 15. TERMINATION · 16. INDEMNIFICATION · 17. MISCELLANEOUS (`.last`).
- **Privacy:** What personal information do we collect from the people that visit our blog, website or app? · When do we collect information? · How do we use your information? · How do we protect your information? · Do we use ‘cookies’? · Third-party disclosure · Third-party links · Google · We use Google AdSense Advertising on our website · California Online Privacy Protection Act · How does our site handle Do Not Track signals? · Does our site allow third-party behavioral tracking? · COPPA (Children Online Privacy Protection Act) · Fair Information Practices · CAN SPAM Act · Contacting Us (`.last`).
- **HIPAA:** HIPAA Authorization · Safeguards for PHI · Non-Protected Health Information · Your PHI Authorization · Redisclosure · Expiration and Revocation of Authorization (`.last`).

## 5. Tokens

Everything reuses homepage tokens except the following:

| Token | Value | Where |
|---|---|---|
| `text-white-50` (colour, not opacity) | `rgba(255,255,255,.5)` / `#ffffff80` | `.transp` paragraphs and lists |
| `legal-subhead` | `#a2fa8e`, max(1.375rem, 1.528vw) (22px up to 1440), lh 1.4 | `._22px-text-green` |
| `legal-cont` width | 50vw, clamp 720–960; 100% at ≤991 | content column |
| legal gaps | cont clamp(36px, 2.5vw, 2.5vw) / 24 ≤479; block clamp(30px, 2.083vw, 40px) / 20 ≤479; text-wrap 24; block pb max(36px, 2.5vw) / 24 ≤479; section pt max(80px, 5.556vw) | layout |

## 6. Motion inventory (legal)

Shared, by homepage id:

| Id | Notes |
|---|---|
| M3b | Video fade on `.hero.hide-on-scroll` (IX3 `i-37f61121`; the M3 values) |
| M12 | Footer contact underline, `._30px-text.white._w-underline` |
| M12b | Footer links |
| M15 | Nav link roll |
| M17 | Nav CTA hover and bottom legal links |
| M18 | Mobile menu |
| M21 | Background video loop |
| M22 | Lenis smooth scroll |
| Footer reveal | Sticky `.footer-bottom-wrap` |

**Not present:** M1, M2, M4–M11, M13, M14, M16, M19 and M20.

| # | Element | Trigger | Properties | Duration | Easing | Delay / position | Repeat | Breakpoints | Source |
|---|---|---|---|---|---|---|---|---|---|
| LGL-M1 | Load intro (IX3 `i-eccee64b` / `t-bd0be8f7`) | page load | `.preloader-wrap` opacity 1→0 · `.bg-pixels-wrapper` 0→1 · `.nav-menu` 0→1 · `.hero-bottom-block.full-width` 0→1 · `.line-hor.on-hero` width 0→100% | preloader .1s; pixels .08s; nav 1.2s; block 1.2s; line 1.0s | preloader power1.out (default, verified); pixels power1.out; nav, block and line expo.out | preloader 0; pixels .02; nav .1; block .6; line .6 | once | all | IX3 + rAF samples (`../compare/shared/states.json` → `legal-intro`, /terms-of-use @1440), measured from the timeline start. Preloader: .71 at +4ms, .40 at +37ms, 0 at +104ms. Nav: .19 at +137ms, .50 at +221ms, .90 at +488ms. Block: .02 at +605ms, .50 at +721ms. Line: 39px at +605ms, 808px at +721ms, 1306px at +938ms. |

There are no scroll-reveal or entrance animations on legal content.

**Anti-flicker (live):** the IX3 targets are `visibility:hidden` until `html.w-mod-ix3`. The failsafe added the class at 2.29s, and the intro started at 2.31s (headless). This is the same main-session decision as for /compare: start the intro on mount.

## 7. Forms, embeds and third-party scripts
- **Footer HubSpot form** (portal 48695808, form `f337fd1d-ba9c-494c-bca4-d3ea4891b0a8`, iframe 300×154 at x 1030 @1440) is the only form. It is the same as the homepage, so use the existing static replica (D2).
- There are no other embeds. Iframes are the GTM noscript and the HubSpot footer form only; the reCAPTCHA script loads but no widget renders because there is no popup.
- The script set is the homepage set. The page bundle is `webflow.a19627bd.2e649d53df280dc8.js` plus schunk `62ee8929a8944272` (IX data). No new vendors. Strip per D1.

## 8. External links
- The two privacy-policy links above (§4).
- The rest are the nav and footer set, identical to the homepage.

## 9. Asset inventory (legal)
**No new assets.** The pages load only shell assets that are already in the homepage manifest:
- `68639bb30a93107837363b04_logo-2.svg` and `68906575d051bc5b61776ed5_logo-black.svg`.
- `68a300503634463bc8a25527_menu-burger.svg`, `689caa3e67c8dbd2e70dc1bc_close-icon-white.svg` and `68a5a50307e780f41451718b_menu-burger-close.svg`.
- `6894eeb12060be5400f13d15_7f73b64e03536ee2d541bb35d323241b_noise.webp`.
- The Tablet-Final mp4/webm/poster (`6aae963300a522b95e867d73_…`) and `68aeb9fc729ad96012dc97f0_tablet-pixels.webp`.
- `68920b38695cade17f6e41a0_logo-footer.svg` (≥480) and `6883559817085db21b9e44bb_PolySans-Neutral.woff2`.

## 10. Unknowns and caveats
1. **List bullets.** The bullet glyph is the browser default disc, coloured by `ul` at `rgba(255,255,255,.5)`. Its exact size and offset were not measured separately, because it is a pseudo-marker.
2. **Block heading sizes.** The block `h2` (`._30px-text`) is 30 / 21.33 / 18 / 24px at 1440 / 1024 / 768 / 390. It is larger on mobile than on tablet, and this is the live computed value.
3. **Content.** The legal text was taken from the server HTML on 2026-09-30. The terms "Last Modified" date is April 4, 2024.

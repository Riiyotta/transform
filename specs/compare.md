Source: https://www.transform9.com/compare

# /compare: build spec

Recon, 2026-09-30. The live site is authoritative. Measurement conditions are those of CLONE_SPEC §0: Playwright Chromium headless, DPR 1, viewports 1440×900 / 1024×900 / 768×1024 / 390×844, `document.fonts.ready` awaited, and the full page scrolled once before reading.

- Webflow page id: `698f09360f48d4fd4f0a7459`.
- Title and og/twitter title: "Compare". Meta description: the same as the homepage.
- JSON-LD: an `Organization` block. It is the same as the homepage block plus `aggregateRating` (ratingValue 92, best 100, worst 0).
- Document height: 12791 @1440 · 11313 @1024 · 9853 @768 · 12625 @390.
- Evidence is in `/Users/riyaghosh/V3/transform/recon/pages/compare/`:
  - `compare-{w}.json`: every class-combo computed style, rect and network request.
  - `compare-{w}-outline.txt`: the DOM outline with text, attributes and rects.
  - `compare-computed-compact.txt`: a cross-viewport table. **This is the source for any value not repeated here.**
  - `compare-rules.css`: the source CSS for every class that is not on the homepage.
  - `raw.html`.
  - Screenshots: `compare-{w}-top.png`, `compare-{w}-full.png` and `state-*.png`.
  - `shared/`: tools, `states.json`, IX data `ix-9282.json`, `ix3-pages-readable.txt` and `ix2-pages-relevant.txt`.

---

## 0. Shell: differences from the homepage

| Shell part | Homepage | /compare |
|---|---|---|
| Navbar | CLONE_SPEC §3 | **Identical DOM and styles.** Only `w--current` moves from `.logo-wrap` to the "Compare" link. No CSS rule targets `w--current` on nav links, so nothing changes visually. The initial state is the same: bg `rgba(2,8,1,.5)`, white logo, links `rgba(255,255,255,.7)`. |
| Nav on-white swap (M4) | yes | **yes.** `section.white-section` is present. Measured: at scrollY 4788 the nav is `#fff` with `#020801` links, and at 7809 it is back to dark. |
| `.preloader-wrap` | absent | **present.** It is a direct child of `body` after the nav: `position:fixed; inset:0; width:100vw; height:100dvh; z-index:4; bg #020801; pointer-events:none`. The CSS sets `display:none`, but the page `<head>` style sets `.preloader-wrap{display:block}`. It starts at opacity 1 and fades out on load (CMP-M1). |
| `.bg-pixels-overlay` | absent | **present** (new). It sits inside `.page-wrap`, after `.bg-pixels-wrapper` and before `.page-wrap-solid-bg`: `position:fixed; inset:0; width:100vw; min-height:100dvh; z-index:-2; bg #020801; pointer-events:none`. The CSS opacity is 0, but the intro sets it to 1 and fades it 1→0 at t=1.1s (CMP-M1). Because it paints after the video wrapper at the same z-index, it dims the video in and out. |
| Background video, still image and noise layers | §2 | Identical. The hero is `section.hero.home`, so M3 (video fade after 10% scroll) applies unchanged. |
| Call Alex modal (`.modal-wrap`) | yes | **yes.** The DOM is identical to the homepage (§16). It is opened by the CTA section's "Call Alex" (`.hero-cta-link.get-a-call`). The hero has no Call Alex on this page. |
| Footer (`section.footer` + `.footer-bottom-wrap`) | §17 | Identical. `w--current` is on the footer "Compare" link, which has no visual effect. |
| Page-load intro | none | **IX3 `i-eccee64b`** (see CMP-M1). |
| Anti-flicker | as on the homepage | The inline head style hides the IX3 targets with `visibility:hidden !important` until `html.w-mod-ix3`. The targets are `.preloader-wrap`, `.bg-pixels`, `.bg-pixels-wrapper`, `.nav-menu`, `.bg-pixels-overlay`, `.hero-bottom-block.left`, `.hero-bottom-block.right`, `.hero-bottom-block.full-width`, `._16px-text.white-text.book-demo-hero`, `.line-hor.on-hero` and `.line-vert`, plus the homepage targets. A failsafe adds `w-mod-ix3` after 2000ms. Measured headless: `w-mod-ix3` arrived at about 2.2s and the intro started at 4.47s (after window load). **Decision for the main session:** the clone should run the intro on mount, not reproduce this blank wait. |

## 1. Section order

| # | Root (Webflow classes) | 1440 y/h | 1024 | 768 | 390 |
|---|---|---|---|---|---|
| 1 | `section.hero.home` | 0/900 | 0/900 | 0/1024 | 0/844 (mb 273) |
| 2 | `section.generic-section` | 1087/746 | 1033/551.8 | 1124/417.1 | 1117/823.7 |
| 3 | `section.table-section` | 1833/1953.7 | 1585/2409.9 | 1541/1855.2 | 1941/2667.8 |
| 4 | `section.access-section` | 3787/868.1 | 3995/764.7 | 3396/608.2 | 4609/859.8 |
| 5 | `section.white-section` (bg #fff) | 4828/2881.1 | 4882/2328.6 | 4096/1913.6 | 5531/2116.1 |
| 5a | └ `.transition-cont.black-to-white` | h 360 | 255.9 | 191.9 | 195 |
| 5b | └ `div.specialty-white` | 5260/1471.5 | 5190/1186 | 4327/1014.4 | 5788/1232.2 |
| 5c | └ `section.integration-section.white#integrations` | 6731/833.6 | 6376/733 | 5341/553.7 | 7020/548.5 |
| 6 | `div.transition-cont.white-to-black` | 7709/360 | 7211/255.9 | 6010/191.9 | 7647/195 |
| 7 | `section.privacy-section` | 8112/947.5 | 7498/868.2 | 6325/677.5 | 7904/1353.4 |
| 8 | `section.ev-section` | 9060/965.8 | 8366/795.4 | 7002/627.8 | 9258/764 |
| 9 | `section.cta-section` (= homepage §15) | 10169/1506 | 9264/1070.9 | 7707/1152 | 10084/1275 |
| 10 | `section.footer.section` (= §17a) | 11675/750.1 | 10335/683.7 | 8859/713.3 | 11359/1077.6 |
| 11 | `.footer-bottom-wrap` (= §17b) | h 365.1 | 294.4 | 280.3 | 188.2 |

All sections are full-bleed. The 26.7361vw rail (`--_size---left-side`: 385 / 273.78 / 205.33) is reused by every new section's left column. The block padding token is 36 → 20 at ≤991.

---

## 2. Hero (`section.hero.home`): the homepage hero with compare modifiers

The structure and every base rule are the homepage hero (§4): min-height 100dvh, padding-top 110 (74 at ≤479), the `.hero-home-bottom` row, `.line-hor.on-hero`, `.line-vert.on-hero`, and at ≤767 the absolute-positioned left block with the hero's `margin-bottom:70vw` (273 @390). The differences are listed below.

- **H1** `h1.white-text.hero-home.compare`:
  - Content: `span.compare-span-1` "Compare" (green `#a2fa8e`, inline), then " Our Solutions | Find Your Best Fit" in white.
  - `.compare` sets `max-width:20ch` **at every breakpoint**. It beats the homepage's 14ch/11ch/9ch because of specificity. Measured max-width: 1198.08 / 851.97 / 960 / 638.98.
  - Font sizes are the homepage H1 sizes: 93.6 / 66.56 / 75 / 49.92, line-height 101%.
  - Margins are the homepage's: 120 119 9 76, and 12 10 24 34 @390. H1 top is 230 @1440–768 and 86 @390.
- **Left block** `.hero-bottom-block.left` (same classes as the homepage):
  - Label `._16px-text.white-text` "What We Do:" with ml 43.
  - Paragraph `p._30px-text.home-hero-text.white` "Transform9 builds AI voice agents for specialty physician practices. Our intentional focus enables us to be experts in the space - especially within Orthopedics, Urology, Neurology, GI and Ophthalmology."
  - Paragraph max-width: 556.6 / 395.7 / 334.1 / 312. Its size is the homepage `._30px-text` scale: 30 / 21.33 / 18 / 19.5.
  - The class `.compare` is **not** on this paragraph, so the `._30px-text.home-hero-text.white.compare {max-width:33ch}` rule is unused.
- **Right block** `.hero-bottom-block.right.comparison-hero`:
  - Layout: column, `justify-content:space-between; align-items:flex-end`, gap 64, padding 36/20.
  - Label `._16px-text.white-text.full-width` "Test Our AI Agent" (width 100%, ml 43).
  - Link `a.hero-cta-link.compare-demo` → `/book-a-demo`, containing `._56-px-text.footer-cta` "Book a Live Demo" plus the `.underline._1/_2` pair.
  - Link text sizes: 56 / 39.82 / 30 / 30, `white-space:nowrap`. The link is 454.3×58.9 @1440, 323×41.9 @1024 and 243.4×31.5 @768/390.
  - `.compare-demo { height:auto }`. There is **no form or phone input** in this hero.
  - At 390 the block has `margin-bottom:200px`.
- Block geometry, y/h:
  - `.hero-home-bottom`: 524.6/375.4 @1440, 587/313 @1024, 693.3/300 @768.
  - At 390 `.hero-home-bottom` is 383/461. The right block is at 383, h 260, and the left block is absolute at y 738, h 273.
  - At 390, "What We Do:" and the paragraph sit below the fold, overlapping the hero's bottom margin. See `compare/crop-390-hero-generic.png`.
- Motion: the blocks and lines take part in the load intro (CMP-M1). Link hover is M12.

## 3. "Not Generic" section (`section.generic-section`)

- **Section:** flex row (column at ≤767). Top and bottom hairlines `rgba(255,255,255,.2)`. `margin-top:13vw` (187.2 / 133.1 / 99.8 / 50.7).
- **Rail** `.left-side.generic`:
  - Rail width, with padding 36/20.
  - bg `#020801` + `call-blue.avif`, `50%/cover no-repeat`.
  - Measured 385×744 @1440, 273.8×549.8 @1024, 205.3×415.1 @768.
  - ≤767: width 100% and **height 80vw** (312 @390).
  - No children; it is an image panel.
- **Right** `.right-side.generic`:
  - Column, `space-between`, gap 15vw (216 / 153.6 / 115.2; 0 at ≤767). Left hairline `rgba(255,255,255,.2)`. Padding 36/20.
  - Label `._16px-text.white-text.why-text` "Why Transform9":
    - Opacity .5, `position:absolute; bottom:100%; left:36/20`, margin-bottom = padding token (36/20), ml 43.
    - It therefore sits **above** the section's top border, inside the section margin. Measured y 1029.8 @1440, while the section starts at 1087.
    - ≤767: `position:relative`, in flow (y 1450 @390, ml 0).
  - `.gen-text-wrap` (column, `space-between`, gap 15vw; 20vw ≤767; 24vw ≤479) contains:
    - H2 `h2.h1-text.white-text.generic`: `span.generic-span` "Not Generic" (blue-light `#168ae2`), then "Call Center AI" (white).
      - Size: `.h1-text` scale 102 / 72.53 / 54.4 / 49.92, line-height 100%.
      - Max-width 11ch (718 @1440).
    - Paragraph `p._30px-text.white.generic-text` (max 40ch = 767.7 @1440):
      - Text: "Our AI voice agents are designed to handle real patient access workflows with precision, security, and consistency. Unlike general-purpose AI solutions, Transform9 is an expert in healthcare where accuracy and security matter most. Our knowledge and deep understanding of the industry separate us from our competition."
      - Size 30 / 21.33 / 18 / **19.5 (5vw at ≤479)**, line-height 1.2.
  - Content x = 422 @1440, which is rail + 1px border + 36.

## 4. Comparison table (`section.table-section`)

The comparison is a static table built from divs. It has no interaction, no hover and no sort. Row hover was measured and nothing changes.

- **Heading block** `.table-top-wrap`:
  - Padding: 16vw top, then 36/20 on the other sides. Top padding is 230.4 / 163.8 / 122.9 / **109.2 (28vw at ≤479; 20vw at ≤767)**.
  - Column, `justify-content:flex-end`.
  - H2 `h2.h1-text.white-text.table-head`: "How Transform9" + `span.table-span` "Compares" (blue-light, `display:block`). Uses the `.h1-text` scale. 770×204 @1440.
- **Table wrapper** `.table-wrap`: column, top hairline. Every `.table-row` is flex with a bottom hairline `rgba(255,255,255,.2)`.
- **Header row** `.table-row.head`:
  - `.table-cell.left-cell.head-left`: empty, rail width. `display:none` at ≤767.
  - `.table-right` (flex, 100%) holds two `.table-cell.right-cell.head` cells:
    - Centred, padding 24 vertically and 36/20 horizontally (16 at ≤479), left hairline.
    - Cell 1: `img.logo-table` (`logo-2.svg`, the white T9 logo). Width 13.5vw: 194.4×56.8 @1440, 138.2 @1024, 103.7 @768. **170px at ≤767, 116px at ≤479** (116×33.9 @390).
    - Cell 2: `p._30px-text.white.table-head` "Other AI Agents", centred. `._30px-text` scale, **16px at ≤479** (lh 19.2).
  - Row height: 105.8 / 89.4 / 79.3 / 82.9.
  - **≤767: the header row is sticky:** `position:sticky; top:60px; z-index:1; bg rgba(2,8,1,.5); backdrop-filter:blur(80px)`, column direction. Verified at 390: it stays at top 60 while the rows scroll. At 768 it is static.
- **Body rows** (10 × `.table-row`):
  - `.table-cell.left-cell` (label): rail width, padding max(20px, 1.389vw) vertically and 36/20 horizontally, `align-items:center`, gap 20.
  - `.table-right` holds two cells:
    - `.table-cell.right-cell.t9`: bg **`rgba(22,138,226,.06)`** (`#168ae20f`, NEW token), left hairline. It contains `img.tick-img` (`tick.svg`, 24×24; 20px at ≤479) and `._16px-text.white-text.table-text` (ml 43, 0 at ≤479).
    - `.table-cell.right-cell`: left hairline, `._16px-text.half-white.table-text`.
    - Cell padding at ≤479: 16px horizontally, gap 16 in the T9 cell.
  - Label text is `._16px-text.half-white.table-text`: white at opacity .5.
  - Table text size (NEW token): `clamp(1.25rem, 1.389vw, 1.375rem)` = **20.0 @1440, 20 @1024**, **14 at ≤991**. Line-height 1.4 (28 / 28 / 19.6 / 19.6).
  - **≤767:** each row is a column. The label cell becomes full width with a bottom hairline and padding 24 top / 12 bottom. The two value cells sit side by side, 195px each @390.
  - Measured row heights (1440 / 1024 / 768 / 390), in content order:

| # | Label | T9 cell | Other AI Agents cell | Row h |
|---|---|---|---|---|
| 1 | Purpose-built for healthcare | Designed specifically for healthcare access and front office workflows | Many platforms adapt generic call-center AI for healthcare use | 97 / 153 / 119.4 / 195.6 |
| 2 | Specialty-specific experts | Industry experts across Orthopedics, Neurology, Urology, Gastroenterology, Ophthalmology and others | Varies by vendor. Many have broad reach with limited expertise | 125 @1440 |
| 3 | Pricing structure | Tailored to match customer needs | Usage-based/per-call. Can be highly variable | 69 @1440 |
| 4 | Hidden fees | None/no overages - transparent pricing | Additional costs can often appear as call volume grows | 97 |
| 5 | Budget predictability | Easy to forecast monthly/annually | Costs may fluctuate month to month | 69 |
| 6 | IT lift required | Minimal burden on internal IT teams - the T9 team works hand in hand with you throughout the process | Often requires deeper IT involvement. Internal teams left responsible with minimal guidance or support | 125 |
| 7 | Security & compliance | T9 is in the top-5% of most secure/compliant vendors in the industry with HIPAA, SOC 2: Type I/II, FedRAMP 20x, NIST 800-30, NIST 800-53 designations | Most vendors are HIPAA 'aware' or HIPAA 'compliant' only - the lowest level of required security. | 181 |
| 8 | Customer support model | White-glove onboarding and ongoing partnership/customer support | Ticket-based or tiered support models - less involved following deployment | 97 |
| 9 | Product focus | Our focus is on healthcare only and our technology is designed specifically for it | Voice AI is often one product across multiple verticals - not healthcare focused | 97 |
| 10 | Long-term fit | Designed to scale with growing practices - lower "Technical Debt" than other offerings | Risk of outgrowing the solution - future costs can occur as a result of necessary updates | 125 |

  The rows have **no** alternating backgrounds. Only the T9 column is tinted.
- **Table bottom** `.table-bottom`:
  - Flex with a bottom hairline; column at ≤767.
  - Left `.table-bottom-left` (rail width):
    - Padding 7vw top (100.8 / 71.7 / 53.8; 36 at ≤767), then 36/20.
    - Text `._16px-text.half-white.table-bottom-left-text` (max 33ch): "The chart above highlights the fundamental differences between Transform9 and typical AI voice agents. Transform9 is designed around practice-specific workflows and healthcare-first principles — not templates or guess-based behavior."
  - Right `.table-bottom-right`:
    - 100% width, padding 36/20 (padding-top 56 at ≤767, 68 at ≤479), left hairline, items aligned flex-end/flex-end.
    - Second `a.hero-cta-link.compare-demo` "Book a Live Demo" → `/book-a-demo`, same styles as the hero link, with M12 underline.

## 5. Patient-access section (`section.access-section`)

- **Section:** flex, bottom hairline, `margin-bottom:12vw` (172.8 / 122.9 / 92.2; 16vw = 62.4 at ≤767).
- `.access-left`: rail spacer. `display:none` at ≤767.
- `.access-right`: column, left hairline (none at ≤767).
- **Top** `.access-right-top`:
  - Padding 36/20, column `space-between`, gap 14vw (201.6 / 143.4 / 107.5; 25vw at ≤767; 32vw = 124.8 at ≤479). Bottom hairline.
  - Label `._16px-text.half-white.access-top-label` "No Guessing. Only Defined Workflows." (opacity .5).
  - H2 `h2.h1-text.white-text.access`: "Built for Real" + `span.access-span` "Patient Access" (green).
    - The H2 font-size is **5vw at every width**: 72 / 51.2 / 38.4 / **19.5 @390**, line-height 100%. The rule `.h1-text.white-text.access{font-size:5vw}` outranks the responsive `.h1-text` sizes, so at 390 the heading is only 19.5px. This is what live renders; reproduce it.
    - Margins 11 49 0 81 (ml 44 at ≤479). Max-width 18ch. `display:block`.
- **Bottom** `.access-right-bottom`: flex, a column at ≤767. It holds two `.access-block`s:
  - Block layout: width 100%, padding 10vw top (144 / 102.4 / 76.8; 80 at ≤767; 64 at ≤479), 36/20 on the other sides, column, gap 2vw (28.8 / 20.5 / 15.4; 24 at ≤767).
  - The 2nd block (`._2nd`) has a left hairline (none at ≤767, where its padding-top is 40).
  - Block 1: head `p._30px-text.white.access-block-head` (max 20ch) "Patient access Is broken — and generic AI falls short". Text `._16px-text.half-white.access-block-text` (max 40ch): "Specialty practices face overwhelming call volumes and increasing strain on front office teams. Many AI voice agents attempt to solve this with generic intent detection and scripted responses, which often break down in real-world healthcare environments."
  - Block 2: head "An AI voice agent governed by precision". Text `.access-block-text._2` (max 50ch): "Healthcare requires consistency. AI voice agents should follow defined rules and workflows — not make guesses. Transform9 layers a proprietary rule engine and workflow orchestrator on top of AI reasoning, ensuring every action is checked against your practice’s rules and executed correctly within real systems." (curly apostrophe, verified against `raw.html`.)

## 6. White section (`section.white-section`): the homepage white section with different contents

- Section bg `#fff`, padding-bottom 10vw (144 / 102.4 / 115.2 [15vw] / 78 [20vw]), same as the homepage. M4 (nav on-white) applies across it.
- **6a. Pixel transition** `.transition-cont.black-to-white`: the DOM is identical to homepage §10a (5 rows × 20 pixels; white layer + blue/green mix layer; `.mob-hide` pixels). The **one difference: there is no `.right-side-w-line`** rail hairline over it. Motion M8a.
- **6b. `div.specialty-white`** (NEW wrapper): top hairline `rgba(2,8,1,.15)`, margin-top 5vw (72 / 51.2 / 38.4; 16vw = 62.4 at ≤767).
  - `.sp-wh-top` (flex):
    - `.sp-top-left`: rail spacer, hidden at ≤767.
    - `.sp-top-right`: padding 36/20 with padding-bottom 10vw (144 / 102.4 / 76.8; 20vw = 78 at ≤479). Left hairline `rgba(2,8,1,.15)` (none at ≤767). `position:relative`.
    - Label `._16px-text.sp-label` "Specialty-specific workflows": **black text** (inherits `#020801`), no ml. It uses the same absolute trick as `.why-text` (`bottom:100%`, mb 36/20; y 5202 @1440, above the hairline) and is static at ≤767.
    - H2 `h2.h1-text.sp-wh` "Built for Specialty Practices": black, `.h1-text` scale, max 14ch (913.8 @1440).
  - `div.specialty-section.white#specialties`: the **white variant of homepage §12**. Column, with a top border `rgba(255,255,255,.2)`, which is invisible on white.
    - `.specialty-top-row.wh > .specialty-tabs.wh.w-tabs` uses `flex-flow:row-reverse wrap`, so the image column sits **on the left** in the rail. Tabs: `data-current="Tab 1"`, `data-duration-in/out 0`, easing "ease".
    - Menu `.specialty-tabs-menu.wh`: padding-left 36/20, mr 36/20, left hairline `rgba(2,8,1,.15)`, flex 1. Starts at x 385 (the rail).
    - Links `a.specialty-tab-link.wh` (×13, `ms-code-onhover="click"`, same order and labels as homepage §12):
      - Bottom hairline `rgba(2,8,1,.15)`. Text `._30px-text` in `#020801`. Padding 12 0.
      - The first link (`._1`) also has a top hairline.
      - Heights: 62 (first) / 61, then 51.6/50.6 @1024, 47.6/46.6 @768, 54.8/53.8 @390.
      - **Active** (`w--current`): bg **`#a2fa8e`** (not white as on the homepage), text `#020801`, padding-left max(20px, 1.389vw) = 20. The first tab when active gets padding-top max(12px, .833vw).
      - ≤767: the active tab keeps the green bg and black text, but padding-left is 0 (homepage rule).
      - ≤479: `.specialty-tab-link.wh._1.w--current` gets bg transparent, so only the first tab loses its highlight at ≤479.
      - Measured: at 390 the active tab 2 had a green bg with pl 0. At 768 the active tab had a green bg with pl 20.
    - Image pane `.specialty-tabs-content.wh`: rail width (385 / 273.8 / 205.3), **sticky top 60px** (homepage: 96), overflow hidden, `display:none` at ≤767.
      - Pane height is the homepage value, 32.153vw (463 / 329.2 / 246.9).
      - The same 13 specialty avif images plus noise (opacity .5) as the homepage. `img.specialty-img` is absolute, inset about −2px, max-width 101%.
      - Pane swap is instant (M20).
    - `.specialty-bottom-row > .right-side.specialty-bottom.wh`:
      - ml rail width, left hairline `rgba(2,8,1,.15)`, padding-bottom 11.944vw (172 / 122.3 / 91.7; 78 @390).
      - Text `._16px-text.white-text.specialty-bottom.wh`: **`#020801` at opacity .5**, max 50ch, mt 30, ml 43.
      - Content: "Transform9 is designed to support complex specialty workflows, terminology, and scheduling requirements. Each agent is tailored to the unique needs of the specialty it serves, ensuring conversations feel natural, relevant, and accurate for patients." (Verified against `raw.html`.)
- **6c. `section.integration-section.white#integrations`**: the **white variant of homepage §13**. Column, `position:relative`, top border `rgba(2,8,1,.15)`.
  - Top `.integration-top-wrap.wh`: height auto, padding 36/20, column `space-between`, gap 10vw (144 / 102.4 / 76.8; 16vw at ≤767).
    - H2 `h2.h1-text.white-text.integration-head.wh`: "Works With Leading" + `span.integ-span` "EHR Platforms" (blue-light). Black text, max 15ch (979 @1440), margin 0.
    - `._16px-text.white-text.integration.wh-top` (black, max 37ch, ml 43; opacity .6 at ≤479): "Transform9 works with leading electronic health record platforms commonly used by physician practices. Integration capabilities vary by practice and workflow."
    - There is **no** "Native Integrations" line and no right-half wrapper, unlike the homepage.
  - Bottom `.integration-bottom-wrap.wh`: bottom hairline `rgba(2,8,1,.15)`. Two marquee rows with the homepage's classes, so **M2a and M2b apply unchanged**:
    - Row 1: `.integ-row-cont > .intagrations-row._1.wh` ×2, top hairline `rgba(2,8,1,.15)`. Items in order: Athena (link), NextGen (link), ModMed (link), Epic, Greenway. Linked items are `a.integration-block.wh` with `target=_blank`.
    - Row 2: `.integ-row-cont._2 > .intagrations-row._2.wh` ×2: Nextech, Veradigm, eClinicalWorks, systemedx.
  - Blocks `.integration-block.wh`:
    - bg **`#fff`**, border-right `1px rgba(2,8,1,.15)`. The homepage box-shadow `0 1px 0 .5px rgba(255,255,255,.2)` is still present but invisible.
    - Size is the homepage's: 360×160 @1440, 256×160 @1024, 230.4×122.9 @768, 195×101.4 @390.
  - Logos: **only the black logo** `img.integration-logo.black.on-wh` (opacity 1, `position:static`). There is no white logo and no swap. Logo height is the homepage's (50 / 50 / 40 / 32).
  - Hover is CMP-M3 (bg → green). It replaces M14.

## 7. Privacy & Security (`section.privacy-section`)

- **Section:** column, top hairline, margin-top 3vw (43.2 / 30.7; 16vw at ≤991 → 122.9 @768, 62.4 @390).
- **Top** `.privacy-top`: padding 36/20 with padding-bottom 12vw (172.8 / 122.9 / 92.2; 20vw = 78 at ≤767).
  - H2 `h2.h1-text.white-text.privacy` containing only `span.privacy-span` "Privacy & Security" (green, `display:block`). `.h1-text` scale, full width.
- **Bottom** `.privacy-bottom`: flex, top and bottom hairlines (none at ≤767), column at ≤767.
  - `.privacy-left`: rail, bg `#020801` + **`privacy-green.avif`** `50%/cover`. 385×633.7 @1440. ≤767: full width, height 80vw (312 @390).
  - `.privacy-right` (column) holds two `.privacy-row`s (flex; column at ≤767). The second row (`._2`) has a top hairline (none at ≤767).
  - Four `.privacy-block`s:
    - Padding 36/20, column `space-between`, gap 7vw (100.8 / 71.7 / 53.8 / 27.3).
    - Left hairline. At ≤767: no left border, a bottom hairline instead.
    - 527.5×334.4 @1440 (row 1), 298 tall in row 2.
  - Block content:
    - Head `._30px-text.white.privacy-head` (max 18ch).
    - Text `._16px-text.half-white.privacy-text`: colour `#ffffff80` with opacity 1 (overridden), max 40ch. The `.long` variant is max 44ch.
  - The four blocks:
    1. **FedRAMP 20x**: "FedRAMP Low ensures foundational cybersecurity for systems handling non-sensitive or public data, meeting baseline federal requirements for cloud security and operational trust."
    2. **NIST 800-30 Risk Assessment**: "NIST 800-30 ensures Transform9 proactively identifies and mitigates risks before they impact data or operations, demonstrating a mature, government-aligned approach to security continuity and compliance."
    3. **SOC 2 Type I/II** (text `.long`): "This designation provides a significantly higher level of patient data protection than HIPAA alone. Type II status places Transform9 among the top 10–15% of healthcare SaaS vendors for security maturity and trustworthiness."
    4. **NIST 800-53 Moderate**: "NIST 800-53 Moderate is the federal benchmark for securing sensitive data, with 260+ controls protecting PHI at the same level required by government healthcare systems."
  - Hover: CMP-M2 (block turns white, texts turn black).

## 8. Healthcare AI Evaluation (`section.ev-section`)

- **Section:** flex, bottom hairline, margin-bottom 10vw (144 / 102.4 / 76.8; 16vw = 62.4 at ≤767).
- `.ev-left`: rail spacer, hidden at ≤767.
- `.ev-right`: column, left hairline (none at ≤767).
- **Top** `.ev-top`: padding 36/20 (padding-top 32vw = 124.8 at ≤479), column, gap 14vw (201.6 / 143.4 / 107.5; 20vw ≤767; 16px ≤479), bottom hairline.
  - Label `._16px-text.half-white.ev-label` "Practices choose Transform9 for:".
  - H2 `h2.h1-text.white-text.ev` "Healthcare <br>AI Evaluation": white, `.h1-text` scale, 597×204 @1440.
- **Bottom** `.ev-bottom`: padding 36/20.
  - Webflow tabs `div.ev-tabs.w-tabs` (`data-current="1"`, `data-easing="ease"`, `data-duration-in="300"`, `data-duration-out="100"`) are **used as an accordion**. The content panes `.ev-tabs-content` are `display:none` and empty. Only the tab links render.
  - `.ev-tab-menu`: column. Four `a.ev-tab.w-tab-link`:
    - Layout: column, gap 2.778vw (40 / 28.4 / 21.3; 20 at ≤479), padding max(20px, 1.389vw), bottom hairline `rgba(255,255,255,.2)` (none on `.last`), bg transparent, text white.
    - Each tab holds `._30px-text.ev-head` (30 / 21.33 / 18 / 24) and `._16px-text.ev-tab-text` (max 70ch; 16 / 16 / 14 / 16).
    - **Current tab** (`w--current`): bg **`#fff`**, text **`#020801`**, and its `.ev-tab-text` is `display:block`. The texts of non-current tabs are `display:none` (IX2, CMP-M4).
    - Heights @1440: current 161.8, closed 77 / 77 / 76. @390: current (tab 3) 179.4, closed 69.8, last closed 97.6.
  - The tabs:
    1. **Accuracy and Consistency**: "Healthcare conversations need predictable outcomes. Systems that rely on guessing introduce risk and inconsistency into patient access workflows."
    2. **Healthcare-Specific Design**: "Tools built specifically for healthcare are more likely to align with regulatory, operational, and patient experience expectations than solutions adapted from other industries."
    3. **Uniqueness and Control**: "Practices should understand how much control they have over workflows, call logic, and ongoing changes as operational needs evolve."
    4. **Ownership and Accountability** (`.last`): "Long-term success depends on clear ownership and accountability. Practices should evaluate who is responsible for performance, optimization, and support after deployment."
  - Behaviour:
    - A click activates the tab. Hover does nothing (there is no `ms-code-onhover` here).
    - Clicking the already-open tab keeps it open, so it does not toggle closed.
    - Exactly one tab is always open. The switch is instant: the bg has no transition and the text display flips.
    - Keyboard: Webflow tabs support arrow keys, Home and End.

## 9. CTA, footer and popup
Identical to homepage §15, §17 and §16 (heights verified equal at all four widths). The CTA "Call Alex" opens the popup, and the CTA pixel transition (M8c) runs.

---

## 10. Tokens

The homepage tokens (CLONE_SPEC §1.3/§1.4) are reused. The **new** values are:

| Token (proposed) | Value | Where |
|---|---|---|
| `t9-tint` | `rgba(22,138,226,.06)` (`#168ae20f`) | `.table-cell.right-cell.t9` bg |
| half-white text | `#fff` at opacity .5 (`._16px-text.half-white`) | table labels/values, access and ev labels |
| `table-text` size | `clamp(1.25rem, 1.389vw, 1.375rem)` → 20 @1440/1024, 14 at ≤991; lh 1.4 | `.table-text` |
| access display | `5vw` at every breakpoint, lh 100% | `h2.access` (72 / 51.2 / 38.4 / 19.5) |
| `logo-table` width | 13.5vw; 170px ≤767; 116px ≤479 | table header logo |
| sticky table header | bg `rgba(2,8,1,.5)` + blur(80px), top 60, z 1 | ≤767 only |
| specialty active (white variant) | bg `#a2fa8e`, text `#020801` | `.specialty-tab-link.wh.w--current` |
| ev tab active | bg `#fff`, text `#020801` | `.ev-tab.w--current` |

Colours: all are existing tokens (`#020801`, `#fff`, `#a2fa8e`, `#168ae2`, `rgba(255,255,255,.2)`, `rgba(2,8,1,.15)`) except the T9 tint. Spacing is vw-based as listed per section, with no new px tokens beyond those listed.

## 11. Motion inventory (/compare)

Shared shell motion that applies unchanged, by homepage id:

| Id | Why it applies here |
|---|---|
| M2a / M2b | Integration marquee on the white rows (same classes) |
| M3 | Video fade (`.hero.home`) |
| M4 | Nav on-white |
| M8a / M8b / M8c | Pixel transitions |
| M11 / M11b | Popup open and close |
| M12 | Underline pair on `.hero-cta-link` ("Book a Live Demo" ×2, CTA links). Measured at 120ms: _1 64.7px, _2 0. At 720ms: _1 0, _2 454.3. |
| M12b | Footer links |
| M15 | Nav link roll |
| M16 | Popup close |
| M17 | CSS hovers |
| M18 | Mobile menu |
| M20 | White-variant specialty tabs (hover = click, instant) |
| M21 | Background video loop |
| M22 | Lenis smooth scroll |

**Not present** on this page: M1 (logos), M5–M7, M9, M10, M13, M14 and M19.

New motion:

| # | Element (selector) | Trigger | Properties | Duration | Easing | Delay / stagger | Repeat | Breakpoints | Source |
|---|---|---|---|---|---|---|---|---|---|
| CMP-M1 | Load intro (IX3 `i-eccee64b` / `t-bd0be8f7`, page-scoped). Initial "from" values are applied when the timeline starts. | page load (IX3 `wf:load`) | `.preloader-wrap` opacity 1→0 (dur .1, pos 0) · `.bg-pixels-wrapper` (and `.bg-pixels`, absent here) opacity 0→1 (dur .08, pos .02) · `.nav-menu` opacity 0→1 (dur 1.2, pos .1) · `.hero-bottom-block.left` opacity 0→1 (dur 1.2, pos .6) · `.line-hor.on-hero` width 0→100% (dur 1, pos .6) · `.hero-bottom-block.right` opacity 0→1 (dur 1.2, pos 1.1) · `.line-vert` (**all** `.line-vert` on the page; here only the hero's) height 0→100% (dur 1, pos 1.1) · `.bg-pixels-overlay` opacity 1→0 (dur .7, pos 1.1) | total 2.3s | preloader: default = power1.out (verified: .624 at 21ms, .397 at 37ms); pixels and overlay: power1.out; nav, blocks and lines: expo.out | positions as listed | once | all | IX3 decoded + rAF-sampled (`shared/states.json` → `compare-intro`). Measured relative to start: preloader .0016 and pixels .998 at +87ms (0 and 1 at +103ms), nav .52 at +219ms and .93 at +536ms. |
| CMP-M2 | `.privacy-block` | mouseover / mouseout (IX2 e-72/e-73, all breakpoints) | block bg transparent → `#fff`; `.privacy-head` `#fff`→`#020801`; `.privacy-text` `rgba(255,255,255,.5)`→`#020801`. Out: bg → `rgba(255,255,255,0)`, head → `#fff`, text → `rgba(255,255,255,.5)`. | 200ms | easeOut (ease-out) | – | – | all | IX2 a-60/a-61. Measured bg `rgba(175,175,175,.686)` at 80ms, `#fff` at 580ms. Screenshot `compare/state-1440-privacy-hover.png`. |
| CMP-M3 | `.integration-block.wh` (linked and unlinked) | mouseover / mouseout (IX2 e-70/e-71) | bg `#fff` → `#a2fa8e`; out → `#fff`. No logo swap. | 200ms | easeOut | – | – | all | IX2 a-58/a-59. Measured `rgb(191,252,178)` at 80ms, `#a2fa8e` at 480ms. Screenshot `state-1440-integration-wh-hover.png`. |
| CMP-M4 | `.ev-tab` accordion | click (Webflow tabs), then IX2 `TAB_ACTIVE`/`TAB_INACTIVE` (e-74/e-75) | Active: `.ev-tab-text` display none→block; tab bg → `#fff`, colour → `#020801` (CSS `w--current`, no transition). Inactive: text display → none. | 0 | – | – | – | all | IX2 a-62/a-63 plus CSS. Measured: switched within 30ms. Empty panes use Webflow duration-in 300 / out 100 ms, which is invisible. |
| CMP-M5 | Sticky table header | scroll | `position:sticky; top:60px` (not animated) | – | – | – | – | ≤767 | CSS; verified top 60 at 390 |

There are no entrance or scroll-reveal animations for text or images beyond CMP-M1.

## 12. Interactions and forms: policy flags for the main session

1. **CTA "Test Our AI Agent" form** (`#email-form`, `#input-footer-phone`) and the **Call Alex popup form** (`#wf-form-Get-a-Call-Form`) are identical to the homepage. The existing D2/D3 policy applies (render, never submit; reCAPTCHA replaced by a spacer).
2. **Footer HubSpot form** (portal 48695808, form `f337fd1d-ba9c-494c-bca4-d3ea4891b0a8`): the same as the homepage. Use the existing static replica.
3. There are no other forms, embeds or iframes on /compare. Live iframes are GTM noscript, the reCAPTCHA anchor/bframe (popup) and the HubSpot footer form (300×154 @1440). All are already covered by D1–D3.

## 13. Third-party scripts specific to /compare
Same set as the homepage (§20).
- The page bundle is `webflow.f92475cd.636bb8f2698a173f.js`, plus schunks including `62ee8929a8944272` (the IX2/IX3 data module 9282) and `121b0d7ff03e0f4a` (the Webflow tabs module).
- An inline MemberScript hover-to-click script (`[ms-code-onhover="click"]`) is also present on the homepage.
- An inline "auto-click first `.stats-block` at ≤991" script is present but is a no-op here (there is no `.stats-block`).
- No new vendors. Strip per D1.

## 14. External links on /compare
- Nav, footer and CTA links are the same as the homepage.
- Page-specific internal links: `/book-a-demo` ×2 ("Book a Live Demo") plus the CTA and nav "Book a Demo".
- Integration links (Athena, NextGen, ModMed) are the same URLs as the homepage, with `target=_blank` (D6: add `rel="noopener"`).

## 15. Asset inventory (/compare)

Only three assets are new relative to the homepage manifest. Everything else loaded is already in `recon/assets.json` / ASSET_MANIFEST.md. That includes the white T9 logo reused as `.logo-table`, the 13 specialty avifs, the black integration logos, the noise, the CTA image, the video and poster, the footer logo, the icons and the font.

| Asset | Live URL | Format / dims | Used by |
|---|---|---|---|
| call-blue | `https://cdn.prod.website-files.com/684a82e3294991569082d379/6992da8bade6530f1dab73f8_call-blue.avif` | AVIF 1680×1680, 142,869 B | `.left-side.generic` background (cover, 50%) |
| privacy-green | `https://cdn.prod.website-files.com/684a82e3294991569082d379/69946c2576805aff36fcf31a_privacy-green.avif` | AVIF 1680×1680, 172,412 B | `.privacy-left` background (cover, 50%) |
| tick | `https://cdn.prod.website-files.com/684a82e3294991569082d379/69930212d8ba3f0cb66dbbe1_tick.svg` | SVG 24×24 viewBox (fills `#A2FA8E` circle + white check), 1,176 B | `img.tick-img` ×10 (24px; 20px ≤479) |

Reused homepage assets on this page:
- `68639bb30a93107837363b04_logo-2.svg`: nav logo and `.logo-table`.
- `68906575d051bc5b61776ed5_logo-black.svg`.
- The 13 × `6895c81…` specialty avifs.
- Black integration logos: `6891ca03471a3b7540d45c51_athena-black.webp` (+ `-p-500` srcset at 390), `6899bf6d4e77eb1b7da9da53_nextgen black.webp`, `6891ca15ec2bbcfee664f148_modmed-black.svg`, `6891ca1486c64ec6dcfdbd93_epic-black.svg`, `6891ca151d6544e08918728b_greenway-black.svg`, `6891ca15287e4bd5ad5fcd73_nextech-black.svg`, `6891ca15f5c11a916ba8c8b6_veradigm-black.svg`, `6891ca150e6e639c350e5305_eclinic-black.svg`, `6899beee48af30a928765264_systemedx logo black.svg`.
- `68947313a36aa178a65e0a40_cta-img-upd-2.webp`.
- The noise webp, `tablet-pixels.webp`, the Tablet-Final mp4/webm/poster, `logo-footer.svg`, `close-icon-white.svg`, `menu-burger.svg`, `menu-burger-close.svg` and `PolySans-Neutral.woff2`.

## 16. Unknowns and caveats
1. **Intro start time.** On live the IX3 load timeline starts after window load. It started at 4.47s headless on this heavy page, and everything was hidden (anti-flicker) until then. The clone should start it at mount. This is a main-session decision and a candidate deviation.
2. **Text source.** All copy in this spec was checked against `raw.html`. The JSON `text` fields in the measurement files are truncated to 160 characters, so do not copy text from them.
3. **Touch.** Hover-only effects (CMP-M2, CMP-M3) run on all IX2 breakpoints but were only tested with mouse emulation. Touch behaviour (sticky hover after tap) was not tested.
4. **Access H2 at 390.** 19.5px at 390 looks unintended, but it is the live computed value. Reproduce it and flag it as live behaviour.
5. **Sticky table header at 390.** Its z-index is 1 and it sits under the fixed nav (z 3). The backdrop blur was not visually verified beyond the screenshot `state-390-table-sticky.png`.

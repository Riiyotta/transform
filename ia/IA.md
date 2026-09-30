# https://www.transform9.com/ (full site; see ROUTES.md). Pages on external domains are excluded per PROJECT_SCOPE.md.

Source: https://www.transform9.com/ (full site; see ROUTES.md). Pages on external domains are excluded per PROJECT_SCOPE.md.
Status: **validated** · production approved: **true**
18 routes · 8 templates · 43 unique sections

> Generated from `ia.json` by `build.mjs`. Edit the JSON, not this file.

## Shape of the site

The largest 3 templates (Blog post, Legal, Case study) account for 13 of 18 routes (72%). The remaining 5 routes span 5 templates.

| template | routes | share |
|---|---:|---:|
| Blog post | 8 | 44% |
| Legal | 3 | 17% |
| Case study | 2 | 11% |
| Homepage | 1 | 6% |
| Compare | 1 | 6% |
| Book a Demo | 1 | 6% |
| Blog index | 1 | 6% |
| Case studies index | 1 | 6% |

## Page chrome

**18 routes carry chrome = `unspecified`** — Homepage, Compare, Book a Demo, Legal, Blog index, Blog post, Case studies index, Case study.

## Sections by reuse

How widely a section is shared determines whether it belongs in a shared
component library or stays local to its page.

| section | category | templates | routes | implementation | scope |
|---|---|---:|---:|---|---|
| `shell.page-layers` | SHELL | 8 | 18 | `src/components/PageLayers.jsx` | Present on all 18 routes; the video is omitted on the 10 blog-post and case-study routes. |
| `shell.navbar` | SHELL | 8 | 18 | `src/components/Navbar.jsx` | Present on all 18 routes. |
| `shell.mobile-menu` | SHELL | 8 | 18 | `src/components/Navbar.jsx (mobile menu)` | Present on all 18 routes (visible at tablet/mobile widths only). |
| `shell.footer-bottom-reveal` | SHELL | 8 | 18 | `src/components/Footer.jsx > FooterBottom` | Present on all 18 routes. |
| `shell.footer` | SHELL | 7 | 17 | `src/components/Footer.jsx > FooterTop` | Present on 17 routes; /book-a-demo shows only shell.footer-bottom-reveal (no top footer, no email form). |
| `shell.preloader` | SHELL | 6 | 16 | `src/components/Preloader.jsx` | Present on 16 routes: /compare, the 3 legal routes, /blog, the 8 blog posts, /case-studies, and the 2 case studies. Absent on home and /book-a-demo. |
| `conversion.cta` | CONVERSION | 6 | 14 | `src/components/Cta.jsx` | Present on 14 routes: home, /compare, /blog, the 8 blog posts, /case-studies and the 2 case studies. Absent on /book-a-demo and the 3 legal routes. |
| `content.post-body` | CONTENT | 2 | 10 | `src/components/cms/PostBody.jsx (+ RichText.jsx)` | Present on the 8 blog-post and 2 case-study routes. |
| `content.post-header` | CONTENT | 1 | 8 | `src/components/cms/DetailHeader.jsx (+ MetaPoints.jsx)` | Present on the 8 blog-post routes. |
| `hero.legal` | HERO | 1 | 3 | `src/components/legal/LegalHero.jsx` | Present on the 3 legal routes (Terms of Use, Privacy Policy, HIPAA). |
| `legal.content` | LEGAL | 1 | 3 | `src/components/legal/LegalContent.jsx` | Present on the 3 legal routes. |
| `shell.call-alex-modal` | SHELL | 2 | 2 | `src/components/CallAlexModal.jsx` | Present on home and /compare (2 routes). |
| `transition.black-to-white` | TRANSITION | 2 | 2 | `src/components/TransitionPixels.jsx (variant black-to-white)` | Present on home and /compare (2 routes). |
| `transition.white-to-black` | TRANSITION | 2 | 2 | `src/components/TransitionPixels.jsx (variant white-to-black)` | Present on home and /compare (2 routes). |
| `content.case-header` | CONTENT | 1 | 2 | `src/components/cms/DetailHeader.jsx (+ CaseVariant.jsx)` | Present on the 2 case-study routes. |
| `content.read-next` | CONTENT | 1 | 2 | `src/components/cms/ReadNext.jsx` | Present on the 2 case-study routes. |
| `shell.bg-pixels-overlay` | SHELL | 1 | 1 | `src/components/compare/BgPixelsOverlay.jsx` | Present only on /compare (1 route). |
| `hero.home` | HERO | 1 | 1 | `src/components/Hero.jsx` | Present only on the homepage (1 route). |
| `hero.compare` | HERO | 1 | 1 | `src/components/compare/CompareHero.jsx` | Present only on /compare (1 route). |
| `hero.book-a-demo` | HERO | 1 | 1 | `src/components/demo/DemoHero.jsx` | Present only on /book-a-demo (1 route). |
| `hero.blog-index` | HERO | 1 | 1 | `src/components/cms/IndexHero.jsx (+ FeaturedPost.jsx)` | Present only on /blog (1 route). |
| `hero.case-studies-index` | HERO | 1 | 1 | `src/components/cms/IndexHero.jsx` | Present only on /case-studies (1 route). |
| `proof.client-logos` | PROOF | 1 | 1 | `src/components/ClientLogos.jsx` | Present only on the homepage (1 route). |
| `proof.client-spotlight` | PROOF | 1 | 1 | `src/components/ClientSpotlight.jsx` | Present only on the homepage (1 route). |
| `proof.stats` | PROOF | 1 | 1 | `src/components/Stats.jsx` | Present only on the homepage (1 route). |
| `proof.testimonials` | PROOF | 1 | 1 | `src/components/Testimonials.jsx` | Present only on the homepage (1 route). |
| `product.how-it-works` | PRODUCT | 1 | 1 | `src/components/HowItWorks.jsx` | Present only on the homepage (1 route). |
| `product.scheduling-agent` | PRODUCT | 1 | 1 | `src/components/SchedulingAgent.jsx` | Present only on the homepage (1 route). |
| `product.tasking-agent` | PRODUCT | 1 | 1 | `src/components/TaskingAgent.jsx` | Present only on the homepage (1 route). |
| `product.navigator-agent` | PRODUCT | 1 | 1 | `src/components/NavigatorAgent.jsx` | Present only on the homepage (1 route). |
| `product.outreach-agent` | PRODUCT | 1 | 1 | `src/components/OutreachAgent.jsx` | Present only on the homepage (1 route). |
| `fit.specialties` | FIT | 1 | 1 | `src/components/Specialties.jsx` | Present only on the homepage (1 route). |
| `fit.integrations` | FIT | 1 | 1 | `src/components/Integrations.jsx` | Present only on the homepage (1 route). |
| `fit.security` | FIT | 1 | 1 | `src/components/Security.jsx` | Present only on the homepage (1 route). |
| `compare.generic` | COMPARE | 1 | 1 | `src/components/compare/GenericSection.jsx` | Present only on /compare (1 route). |
| `compare.comparison-table` | COMPARE | 1 | 1 | `src/components/compare/ComparisonTable.jsx` | Present only on /compare (1 route). |
| `compare.access` | COMPARE | 1 | 1 | `src/components/compare/AccessSection.jsx` | Present only on /compare (1 route). |
| `compare.specialty-white` | COMPARE | 1 | 1 | `src/components/compare/CompareWhiteSection.jsx > Specialties (variant="white")` | Present only on /compare (1 route). |
| `compare.integrations-white` | COMPARE | 1 | 1 | `src/components/compare/CompareWhiteSection.jsx > Integrations (variant="white")` | Present only on /compare (1 route). |
| `compare.privacy` | COMPARE | 1 | 1 | `src/components/compare/PrivacySection.jsx` | Present only on /compare (1 route). |
| `compare.evaluation` | COMPARE | 1 | 1 | `src/components/compare/EvSection.jsx` | Present only on /compare (1 route). |
| `content.blog-list` | CONTENT | 1 | 1 | `src/components/cms/ListSection.jsx (+ PostCard.jsx, Pagination in BlogIndexPage.jsx)` | Present only on /blog (1 route). |
| `content.case-list` | CONTENT | 1 | 1 | `src/components/cms/ListSection.jsx (+ CaseCard.jsx)` | Present only on /case-studies (1 route). |

**11 shared sections** appear in more than one template and belong in a component library.

**32 single-use sections** appear in exactly one template. Building these
as "reusable" components up front would be speculative — keep them page-local
until a second caller actually appears.

## Templates

### Homepage — `template.home`

1 route · `/`

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.page-layers` | shared ×8 |
| 2 | SHELL | `shell.navbar` | shared ×8 |
| 3 | SHELL | `shell.mobile-menu` | shared ×8 |
| 4 | HERO | `hero.home` | page-local |
| 5 | PROOF | `proof.client-logos` | page-local |
| 6 | PROOF | `proof.client-spotlight` | page-local |
| 7 | PROOF | `proof.stats` | page-local |
| 8 | PROOF | `proof.testimonials` | page-local |
| 9 | PRODUCT | `product.how-it-works` | page-local |
| 10 | TRANSITION | `transition.black-to-white` | shared ×2 |
| 11 | PRODUCT | `product.scheduling-agent` | page-local |
| 12 | PRODUCT | `product.tasking-agent` | page-local |
| 13 | PRODUCT | `product.navigator-agent` | page-local |
| 14 | PRODUCT | `product.outreach-agent` | page-local |
| 15 | TRANSITION | `transition.white-to-black` | shared ×2 |
| 16 | FIT | `fit.specialties` | page-local |
| 17 | FIT | `fit.integrations` | page-local |
| 18 | FIT | `fit.security` | page-local |
| 19 | CONVERSION | `conversion.cta` | shared ×6 |
| 20 | SHELL | `shell.footer` | shared ×7 |
| 21 | SHELL | `shell.footer-bottom-reveal` | shared ×8 |
| 22 | SHELL | `shell.call-alex-modal` | shared ×2 |

### Compare — `template.compare`

1 route · `/compare`

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.page-layers` | shared ×8 |
| 2 | SHELL | `shell.navbar` | shared ×8 |
| 3 | SHELL | `shell.mobile-menu` | shared ×8 |
| 4 | SHELL | `shell.preloader` | shared ×6 |
| 5 | SHELL | `shell.bg-pixels-overlay` | page-local |
| 6 | HERO | `hero.compare` | page-local |
| 7 | COMPARE | `compare.generic` | page-local |
| 8 | COMPARE | `compare.comparison-table` | page-local |
| 9 | COMPARE | `compare.access` | page-local |
| 10 | TRANSITION | `transition.black-to-white` | shared ×2 |
| 11 | COMPARE | `compare.specialty-white` | page-local |
| 12 | COMPARE | `compare.integrations-white` | page-local |
| 13 | TRANSITION | `transition.white-to-black` | shared ×2 |
| 14 | COMPARE | `compare.privacy` | page-local |
| 15 | COMPARE | `compare.evaluation` | page-local |
| 16 | CONVERSION | `conversion.cta` | shared ×6 |
| 17 | SHELL | `shell.footer` | shared ×7 |
| 18 | SHELL | `shell.footer-bottom-reveal` | shared ×8 |
| 19 | SHELL | `shell.call-alex-modal` | shared ×2 |

### Book a Demo — `template.book-a-demo`

1 route · `/book-a-demo`

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.page-layers` | shared ×8 |
| 2 | SHELL | `shell.navbar` | shared ×8 |
| 3 | SHELL | `shell.mobile-menu` | shared ×8 |
| 4 | HERO | `hero.book-a-demo` | page-local |
| 5 | SHELL | `shell.footer-bottom-reveal` | shared ×8 |

### Legal — `template.legal`

3 routes · `/terms-of-use`, `/privacy-policy`, `/hipaa`

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.page-layers` | shared ×8 |
| 2 | SHELL | `shell.navbar` | shared ×8 |
| 3 | SHELL | `shell.mobile-menu` | shared ×8 |
| 4 | SHELL | `shell.preloader` | shared ×6 |
| 5 | HERO | `hero.legal` | page-local |
| 6 | LEGAL | `legal.content` | page-local |
| 7 | SHELL | `shell.footer` | shared ×7 |
| 8 | SHELL | `shell.footer-bottom-reveal` | shared ×8 |

### Blog index — `template.blog-index`

1 route · `/blog`

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.page-layers` | shared ×8 |
| 2 | SHELL | `shell.navbar` | shared ×8 |
| 3 | SHELL | `shell.mobile-menu` | shared ×8 |
| 4 | SHELL | `shell.preloader` | shared ×6 |
| 5 | HERO | `hero.blog-index` | page-local |
| 6 | CONTENT | `content.blog-list` | page-local |
| 7 | CONVERSION | `conversion.cta` | shared ×6 |
| 8 | SHELL | `shell.footer` | shared ×7 |
| 9 | SHELL | `shell.footer-bottom-reveal` | shared ×8 |

### Blog post — `template.blog-post`

8 routes · `/blog/ai-voice-agents-for-athenahealth-7-questions-to-ask-before-choosing-a-platform`, `/blog/medical-practice-call-volume-january`, `/blog/ent-reimbursement-in-2027-what-medicare-s-proposed-cuts-mean-for-otolaryngology-practices`, `/blog/orthopedic-ai-answering-service`, `/blog/redefining-healthcare-ai`, `/blog/the-12-month-shift-why-voice-ai-agents-are-now-a-financial-imperative-for-specialty-practices`, `/blog/why-traditional-ivr-is-failing-your-practice-and-how-ai-voice-agents-fix-the-press-0-trap`, `/blog/why-generic-ai-virtual-assistants-fail-specialty-medical-practices-and-what-actually-works`

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.page-layers` | shared ×8 |
| 2 | SHELL | `shell.navbar` | shared ×8 |
| 3 | SHELL | `shell.mobile-menu` | shared ×8 |
| 4 | SHELL | `shell.preloader` | shared ×6 |
| 5 | CONTENT | `content.post-header` | page-local |
| 6 | CONTENT | `content.post-body` | shared ×2 |
| 7 | CONVERSION | `conversion.cta` | shared ×6 |
| 8 | SHELL | `shell.footer` | shared ×7 |
| 9 | SHELL | `shell.footer-bottom-reveal` | shared ×8 |

### Case studies index — `template.case-studies-index`

1 route · `/case-studies`

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.page-layers` | shared ×8 |
| 2 | SHELL | `shell.navbar` | shared ×8 |
| 3 | SHELL | `shell.mobile-menu` | shared ×8 |
| 4 | SHELL | `shell.preloader` | shared ×6 |
| 5 | HERO | `hero.case-studies-index` | page-local |
| 6 | CONTENT | `content.case-list` | page-local |
| 7 | CONVERSION | `conversion.cta` | shared ×6 |
| 8 | SHELL | `shell.footer` | shared ×7 |
| 9 | SHELL | `shell.footer-bottom-reveal` | shared ×8 |

### Case study — `template.case-study`

2 routes · `/case-studies/southern-bone-joint`, `/case-studies/the-orthopaedic-center`

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.page-layers` | shared ×8 |
| 2 | SHELL | `shell.navbar` | shared ×8 |
| 3 | SHELL | `shell.mobile-menu` | shared ×8 |
| 4 | SHELL | `shell.preloader` | shared ×6 |
| 5 | CONTENT | `content.case-header` | page-local |
| 6 | CONTENT | `content.post-body` | shared ×2 |
| 7 | CONTENT | `content.read-next` | page-local |
| 8 | CONVERSION | `conversion.cta` | shared ×6 |
| 9 | SHELL | `shell.footer` | shared ×7 |
| 10 | SHELL | `shell.footer-bottom-reveal` | shared ×8 |

## Section reference

### SHELL

_Chrome present across many or all routes: navigation, mobile menu, background layers, preloader, popup, footer._

**`shell.page-layers`** — Fixed background layers behind page content: tiled noise overlay and solid background on every route, plus a looping hero video (with a still-image fallback under reduced motion) on templates that show one.

· Present on all 18 routes; the video is omitted on the 10 blog-post and case-study routes. · appears on 18 routes · implemented by `src/components/PageLayers.jsx`

**`shell.navbar`** — Fixed 60px top bar with a blurred translucent dark background: logo, primary links, Login, green Book a Demo button. Tweens to a white treatment while a white section (home, /compare) is under it.

· Present on all 18 routes. · appears on 18 routes · implemented by `src/components/Navbar.jsx`

**`shell.mobile-menu`** — Full-screen overlay menu opened from the burger at ≤991px: large nav links, Login and Book a Demo bar; stops smooth scroll while open.

· Present on all 18 routes (visible at tablet/mobile widths only). · appears on 18 routes · implemented by `src/components/Navbar.jsx (mobile menu)`

**`shell.preloader`** — Fixed full-screen black overlay shown until the page-load intro fades it out.

· Present on 16 routes: /compare, the 3 legal routes, /blog, the 8 blog posts, /case-studies, and the 2 case studies. Absent on home and /book-a-demo. · appears on 16 routes · implemented by `src/components/Preloader.jsx`

**`shell.bg-pixels-overlay`** — Fixed full-screen overlay that dims and undims the background video during the /compare page-load intro.

· Present only on /compare (1 route). · appears on 1 routes · implemented by `src/components/compare/BgPixelsOverlay.jsx`

**`shell.call-alex-modal`** — Hidden fixed 'Call Alex' popup with name/email/phone form, client-side validation and success/error states (no network); opened from a page's 'Call Alex' link(s).

· Present on home and /compare (2 routes). · appears on 2 routes · implemented by `src/components/CallAlexModal.jsx`

**`shell.footer`** — Footer top: rail with company description, Navigate/Legal/Social link columns and an email signup form (static, no network).

· Present on 17 routes; /book-a-demo shows only shell.footer-bottom-reveal (no top footer, no email form). · appears on 17 routes · implemented by `src/components/Footer.jsx > FooterTop`

**`shell.footer-bottom-reveal`** — Sticky bottom bar revealed beneath the page as it scrolls away: oversized wordmark and legal link row.

· Present on all 18 routes. · appears on 18 routes · implemented by `src/components/Footer.jsx > FooterBottom`

### HERO

_Page-opening header block: a headline, and where the template has one, a primary call to action or form._

**`hero.home`** — Full-viewport dark hero over the fixed video: 6.5vw headline 'Maximize Every Call with a Custom AI Agent', a 'Who We Are' statement, and a 'Test Our AI Agent' phone input plus 'Call Alex' link.

· Present only on the homepage (1 route). · appears on 1 routes · implemented by `src/components/Hero.jsx`

**`hero.compare`** — Full-viewport dark hero for /compare: headline, supporting paragraph and the same 'Call Alex' / phone-input CTA row pattern as the homepage hero.

· Present only on /compare (1 route). · appears on 1 routes · implemented by `src/components/compare/CompareHero.jsx`

**`hero.legal`** — Hero for the legal template: H1 plus an intro paragraph over the fixed video, shared verbatim by all three legal routes with only the H1/intro content varying.

· Present on the 3 legal routes (Terms of Use, Privacy Policy, HIPAA). · appears on 3 routes · implemented by `src/components/legal/LegalHero.jsx`

**`hero.book-a-demo`** — Split hero for /book-a-demo: green H1 and supporting copy on the left; the 5-field booking form (visible white labels per D12, client-side validation, static success block, no network per D2/D9) on the right. This is the whole page.

· Present only on /book-a-demo (1 route). · appears on 1 routes · implemented by `src/components/demo/DemoHero.jsx`

**`hero.blog-index`** — Word-by-word animated H1 (8 words) plus the featured-post card, above the article list.

· Present only on /blog (1 route). · appears on 1 routes · implemented by `src/components/cms/IndexHero.jsx (+ FeaturedPost.jsx)`

**`hero.case-studies-index`** — Word-by-word animated H1 (6 words) for the case-studies index; no featured item.

· Present only on /case-studies (1 route). · appears on 1 routes · implemented by `src/components/cms/IndexHero.jsx`

### PROOF

_Homepage-only social proof: client logos, case-study spotlight, metrics, testimonials._

**`proof.client-logos`** — Continuously scrolling marquee of client practice logos between hairlines.

· Present only on the homepage (1 route). · appears on 1 routes · implemented by `src/components/ClientLogos.jsx`

**`proof.client-spotlight`** — Case-study spotlight heading ('Client Spotlight – Andrews Sports Medicine') with a click-to-load YouTube facade.

· Present only on the homepage (1 route). · appears on 1 routes · implemented by `src/components/ClientSpotlight.jsx`

**`proof.stats`** — Four metric blocks in blue tints: hover expands a block and reveals its image on desktop; click accordion at ≤991.

· Present only on the homepage (1 route). · appears on 1 routes · implemented by `src/components/Stats.jsx`

**`proof.testimonials`** — Testimonial slider: photo block, quote, author with green title badge, practice logo, numbered prev/next arrows with cross-fade.

· Present only on the homepage (1 route). · appears on 1 routes · implemented by `src/components/Testimonials.jsx`

### PRODUCT

_Homepage-only product explanation and its four agent modules._

**`product.how-it-works`** — Scroll-stepped 'How it works' sequence where three large phrases highlight one at a time.

· Present only on the homepage (1 route). · appears on 1 routes · implemented by `src/components/HowItWorks.jsx`

**`product.scheduling-agent`** — Agent #1 Scheduling: sticky card deck where earlier cards scale down, lift and tint as later cards scroll in.

· Present only on the homepage (1 route). · appears on 1 routes · implemented by `src/components/SchedulingAgent.jsx`

**`product.tasking-agent`** — Agent #2 Tasking: 200vh half-split with auto-rotating vertical tabs (4s progress bar) and fading image panes; click tabs at ≤991.

· Present only on the homepage (1 route). · appears on 1 routes · implemented by `src/components/TaskingAgent.jsx`

**`product.navigator-agent`** — Agent #3 Navigator: four row tabs activated on hover, with the matching image in the left rail.

· Present only on the homepage (1 route). · appears on 1 routes · implemented by `src/components/NavigatorAgent.jsx`

**`product.outreach-agent`** — Agent #4 Outreach: sticky left title panel with five sticky stacking cards in blue tints on the right.

· Present only on the homepage (1 route). · appears on 1 routes · implemented by `src/components/OutreachAgent.jsx`

### TRANSITION

_Scroll-scrubbed pixel-grid transitions between dark and light surfaces, shared by templates that carry a dark/white split._

**`transition.black-to-white`** — Scroll-scrubbed pixel-grid transition from the dark page into a white section.

· Present on home and /compare (2 routes). · appears on 2 routes · implemented by `src/components/TransitionPixels.jsx (variant black-to-white)`

**`transition.white-to-black`** — Scroll-scrubbed pixel-grid transition from a white section back to the dark page.

· Present on home and /compare (2 routes). · appears on 2 routes · implemented by `src/components/TransitionPixels.jsx (variant white-to-black)`

### FIT

_Homepage-only buyer-fit content: specialties, EMR integrations, security/compliance._

**`fit.specialties`** — 'Designed for Your Specialty': 13 hover-activated specialty tabs with a matching image pane, plus 'And other specialties'.

· Present only on the homepage (1 route). · appears on 1 routes · implemented by `src/components/Specialties.jsx`

**`fit.integrations`** — 'Built to Connect': EMR/partner logos in two opposing marquee rows with hover background and logo swap; marketplace links open externally.

· Present only on the homepage (1 route). · appears on 1 routes · implemented by `src/components/Integrations.jsx`

**`fit.security`** — 'Secure. Compliant. Trusted.': image rail and a 2×2 grid of certification cells with hover background and logo swap.

· Present only on the homepage (1 route). · appears on 1 routes · implemented by `src/components/Security.jsx`

### CONVERSION

_Closing call-to-action block, reused across every marketing and content template._

**`conversion.cta`** — Closing CTA over a background image revealed by a scroll-scrubbed pixel grid: agent list, 'Quick Start / Live in 60 Days', large headline, phone input with 'Call Alex' and 'Book a Demo'.

· Present on 14 routes: home, /compare, /blog, the 8 blog posts, /case-studies and the 2 case studies. Absent on /book-a-demo and the 3 legal routes. · appears on 14 routes · implemented by `src/components/Cta.jsx`

### COMPARE

_/compare-specific comparison-narrative content._

**`compare.generic`** — 'Not Generic Call Center AI' claim section: image rail plus a headline and body paragraph.

· Present only on /compare (1 route). · appears on 1 routes · implemented by `src/components/compare/GenericSection.jsx`

**`compare.comparison-table`** — Static 10-row feature-comparison table against competitors; the Transform9 column is tinted. Header row is sticky at ≤767 (top 60, blurred).

· Present only on /compare (1 route). · appears on 1 routes · implemented by `src/components/compare/ComparisonTable.jsx`

**`compare.access`** — 'Built for Real Patient Access': a 5vw heading (fixed size at every width, including 390) over two workflow-claim blocks.

· Present only on /compare (1 route). · appears on 1 routes · implemented by `src/components/compare/AccessSection.jsx`

**`compare.specialty-white`** — White-background variant of the homepage specialty tabs (fit.specialties), reinforcing specialty fit inside the comparison narrative.

· Present only on /compare (1 route). · appears on 1 routes · implemented by `src/components/compare/CompareWhiteSection.jsx > Specialties (variant="white")`

**`compare.integrations-white`** — White-background variant of the homepage integration marquees (fit.integrations), with a green (not black) hover treatment.

· Present only on /compare (1 route). · appears on 1 routes · implemented by `src/components/compare/CompareWhiteSection.jsx > Integrations (variant="white")`

**`compare.privacy`** — Privacy & Security claim blocks with a hover state (background lightens on the hovered block only).

· Present only on /compare (1 route). · appears on 1 routes · implemented by `src/components/compare/PrivacySection.jsx`

**`compare.evaluation`** — 'Healthcare AI Evaluation': a four-item accordion (Webflow tabs used as an accordion; click activates, exactly one item open, arrow/Home/End keyboard support).

· Present only on /compare (1 route). · appears on 1 routes · implemented by `src/components/compare/EvSection.jsx`

### LEGAL

_Legal template content (Terms of Use, Privacy Policy, HIPAA)._

**`legal.content`** — Rich-text legal body: intro-paragraph style, green sub-heads, bullet lists and inline links (rel="noopener" per D10). One component, three content variants (Terms of Use, Privacy Policy, HIPAA) driven by src/data/legal/*.js.

· Present on the 3 legal routes. · appears on 3 routes · implemented by `src/components/legal/LegalContent.jsx`

### CONTENT

_Blog and case-study index and detail content, data-driven from content/*.json._

**`content.blog-list`** — Post-grid ('All Articles') list with a description line and a 'Load More' control that appends the remaining posts client-side, then hides itself; no network request (D14).

· Present only on /blog (1 route). · appears on 1 routes · implemented by `src/components/cms/ListSection.jsx (+ PostCard.jsx, Pagination in BlogIndexPage.jsx)`

**`content.case-list`** — Case-study card grid; no featured item and no pagination (all items shown at once).

· Present only on /case-studies (1 route). · appears on 1 routes · implemented by `src/components/cms/ListSection.jsx (+ CaseCard.jsx)`

**`content.post-header`** — Blog-post detail header: back link, hero image, title, and author/date meta points.

· Present on the 8 blog-post routes. · appears on 8 routes · implemented by `src/components/cms/DetailHeader.jsx (+ MetaPoints.jsx)`

**`content.case-header`** — Case-study detail header: back link, client-logo panel with a divider, title, and a data-driven highlight-quote or two-stat block (only the populated variant renders).

· Present on the 2 case-study routes. · appears on 2 routes · implemented by `src/components/cms/DetailHeader.jsx (+ CaseVariant.jsx)`

**`content.post-body`** — Rich-text article body rendered from structured content blocks (h1/h2/h3/p/ul/ol/blockquote, inline bold/italic/links), one hairline per body slot after the first, with a sticky share column (X/Facebook/LinkedIn icons, inert per D13).

· Present on the 8 blog-post and 2 case-study routes. · appears on 10 routes · implemented by `src/components/cms/PostBody.jsx (+ RichText.jsx)`

**`content.read-next`** — Single related-case-study card at the foot of a case study. The equivalent block on blog posts is hidden on the live site and is not rendered.

· Present on the 2 case-study routes. · appears on 2 routes · implemented by `src/components/cms/ReadNext.jsx`

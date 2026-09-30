# https://www.transform9.com/ (homepage only, per PROJECT_SCOPE.md)

Source: https://www.transform9.com/ (homepage only, per PROJECT_SCOPE.md)
Status: **validated** · production approved: **true**
1 routes · 1 templates · 22 unique sections

> Generated from `ia.json` by `build.mjs`. Edit the JSON, not this file.

## Shape of the site

The largest 1 template (Homepage) accounts for 1 of 1 routes (100%). The remaining 0 routes span 0 templates.

| template | routes | share |
|---|---:|---:|
| Homepage | 1 | 100% |

## Page chrome

**1 routes carry chrome = `full`** — Homepage.

## Sections by reuse

How widely a section is shared determines whether it belongs in a shared
component library or stays local to its page.

| section | category | templates | routes | implementation | scope |
|---|---|---:|---:|---|---|
| `shell.navbar` | SHELL | 1 | 1 | `src/components/Navbar.jsx` | Present on the 1 in-scope route. |
| `shell.mobile-menu` | SHELL | 1 | 1 | `src/components/Navbar.jsx (mobile menu)` | Present on the 1 in-scope route, visible at tablet/mobile widths only. |
| `shell.page-layers` | SHELL | 1 | 1 | `src/components/PageLayers.jsx` | Present on the 1 in-scope route. |
| `shell.call-alex-modal` | SHELL | 1 | 1 | `src/components/CallAlexModal.jsx` | Present on the 1 in-scope route. |
| `shell.footer` | SHELL | 1 | 1 | `src/components/Footer.jsx > FooterTop` | Present on the 1 in-scope route. |
| `shell.footer-bottom-reveal` | SHELL | 1 | 1 | `src/components/Footer.jsx > FooterBottom` | Present on the 1 in-scope route. |
| `hero.home` | HERO | 1 | 1 | `src/components/Hero.jsx` | Present on the 1 in-scope route. |
| `proof.client-logos` | PROOF | 1 | 1 | `src/components/ClientLogos.jsx` | Present on the 1 in-scope route. |
| `proof.client-spotlight` | PROOF | 1 | 1 | `src/components/ClientSpotlight.jsx` | Present on the 1 in-scope route. |
| `proof.stats` | PROOF | 1 | 1 | `src/components/Stats.jsx` | Present on the 1 in-scope route. |
| `proof.testimonials` | PROOF | 1 | 1 | `src/components/Testimonials.jsx` | Present on the 1 in-scope route. |
| `product.how-it-works` | PRODUCT | 1 | 1 | `src/components/HowItWorks.jsx` | Present on the 1 in-scope route. |
| `transition.black-to-white` | TRANSITION | 1 | 1 | `src/components/TransitionPixels.jsx (variant black-to-white)` | Present on the 1 in-scope route. |
| `product.scheduling-agent` | PRODUCT | 1 | 1 | `src/components/SchedulingAgent.jsx` | Present on the 1 in-scope route. |
| `product.tasking-agent` | PRODUCT | 1 | 1 | `src/components/TaskingAgent.jsx` | Present on the 1 in-scope route. |
| `product.navigator-agent` | PRODUCT | 1 | 1 | `src/components/NavigatorAgent.jsx` | Present on the 1 in-scope route. |
| `product.outreach-agent` | PRODUCT | 1 | 1 | `src/components/OutreachAgent.jsx` | Present on the 1 in-scope route. |
| `transition.white-to-black` | TRANSITION | 1 | 1 | `src/components/TransitionPixels.jsx (variant white-to-black)` | Present on the 1 in-scope route. |
| `fit.specialties` | FIT | 1 | 1 | `src/components/Specialties.jsx` | Present on the 1 in-scope route. |
| `fit.integrations` | FIT | 1 | 1 | `src/components/Integrations.jsx` | Present on the 1 in-scope route. |
| `fit.security` | FIT | 1 | 1 | `src/components/Security.jsx` | Present on the 1 in-scope route. |
| `conversion.cta` | CONVERSION | 1 | 1 | `src/components/Cta.jsx` | Present on the 1 in-scope route. |

**0 shared sections** appear in more than one template and belong in a component library.

**22 single-use sections** appear in exactly one template. Building these
as "reusable" components up front would be speculative — keep them page-local
until a second caller actually appears.

## Templates

### Homepage — `template.home`

1 route · `/` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.page-layers` | page-local |
| 2 | SHELL | `shell.navbar` | page-local |
| 3 | SHELL | `shell.mobile-menu` | page-local |
| 4 | HERO | `hero.home` | page-local |
| 5 | PROOF | `proof.client-logos` | page-local |
| 6 | PROOF | `proof.client-spotlight` | page-local |
| 7 | PROOF | `proof.stats` | page-local |
| 8 | PROOF | `proof.testimonials` | page-local |
| 9 | PRODUCT | `product.how-it-works` | page-local |
| 10 | TRANSITION | `transition.black-to-white` | page-local |
| 11 | PRODUCT | `product.scheduling-agent` | page-local |
| 12 | PRODUCT | `product.tasking-agent` | page-local |
| 13 | PRODUCT | `product.navigator-agent` | page-local |
| 14 | PRODUCT | `product.outreach-agent` | page-local |
| 15 | TRANSITION | `transition.white-to-black` | page-local |
| 16 | FIT | `fit.specialties` | page-local |
| 17 | FIT | `fit.integrations` | page-local |
| 18 | FIT | `fit.security` | page-local |
| 19 | CONVERSION | `conversion.cta` | page-local |
| 20 | SHELL | `shell.footer` | page-local |
| 21 | SHELL | `shell.footer-bottom-reveal` | page-local |
| 22 | SHELL | `shell.call-alex-modal` | page-local |

## Section reference

### SHELL

_Page chrome and page-level layers: fixed navigation, mobile menu, background layers, modal, footer._

**`shell.navbar`** — Fixed 60px top bar with blurred translucent dark background: logo, Compare/Blog/Case Studies/Careers links, Login, green Book a Demo button; tweens to a white treatment while the white section is under it.

· Present on the 1 in-scope route. · appears on 1 routes · implemented by `src/components/Navbar.jsx`

**`shell.mobile-menu`** — Full-screen overlay menu opened from the burger at ≤991px: large nav links, Login and Book a Demo bar; stops smooth scroll while open.

· Present on the 1 in-scope route, visible at tablet/mobile widths only. · appears on 1 routes · implemented by `src/components/Navbar.jsx (mobile menu)`

**`shell.page-layers`** — Fixed hero background video (tablet render, still-image fallback under reduced motion) that fades out after the hero, plus the tiled noise overlay.

· Present on the 1 in-scope route. · appears on 1 routes · implemented by `src/components/PageLayers.jsx`

**`shell.call-alex-modal`** — Hidden fixed 'Call Alex' popup with name/email/phone form, client-side validation and success/error states (no network); opened from the hero and CTA 'Call Alex' links.

· Present on the 1 in-scope route. · appears on 1 routes · implemented by `src/components/CallAlexModal.jsx`

**`shell.footer`** — Footer top: rail with company description, Navigate/Legal/Social link columns and an email signup form (static, no network).

· Present on the 1 in-scope route. · appears on 1 routes · implemented by `src/components/Footer.jsx > FooterTop`

**`shell.footer-bottom-reveal`** — Sticky bottom bar revealed beneath the page as it scrolls away: oversized wordmark and legal row.

· Present on the 1 in-scope route. · appears on 1 routes · implemented by `src/components/Footer.jsx > FooterBottom`

### HERO

_Page-opening statement with the primary call to action._

**`hero.home`** — Full-viewport dark hero over the fixed video: 6.5vw headline 'Maximize Every Call with a Custom AI Agent' and a bottom row with 'Who We Are' statement and 'Test Our AI Agent' phone input plus 'Call Alex' link.

· Present on the 1 in-scope route. · appears on 1 routes · implemented by `src/components/Hero.jsx`

### PROOF

_Social proof: client logos, case-study spotlight, metrics, testimonials._

**`proof.client-logos`** — Continuously scrolling marquee of client practice logos between hairlines.

· Present on the 1 in-scope route. · appears on 1 routes · implemented by `src/components/ClientLogos.jsx`

**`proof.client-spotlight`** — Case-study spotlight heading ('Client Spotlight – Andrews Sports Medicine') with a click-to-load YouTube facade.

· Present on the 1 in-scope route. · appears on 1 routes · implemented by `src/components/ClientSpotlight.jsx`

**`proof.stats`** — Four metric blocks in blue tints: hover expands a block and reveals its image on desktop; click accordion at ≤991.

· Present on the 1 in-scope route. · appears on 1 routes · implemented by `src/components/Stats.jsx`

**`proof.testimonials`** — Testimonial slider: photo block, quote, author with green title badge, practice logo, numbered prev/next arrows with cross-fade.

· Present on the 1 in-scope route. · appears on 1 routes · implemented by `src/components/Testimonials.jsx`

### PRODUCT

_Explanation of how the product works and its agent modules._

**`product.how-it-works`** — Scroll-stepped 'How it works' sequence where three large phrases highlight one at a time.

· Present on the 1 in-scope route. · appears on 1 routes · implemented by `src/components/HowItWorks.jsx`

**`product.scheduling-agent`** — Agent #1 Scheduling: sticky card deck where earlier cards scale down, lift and tint as later cards scroll in.

· Present on the 1 in-scope route. · appears on 1 routes · implemented by `src/components/SchedulingAgent.jsx`

**`product.tasking-agent`** — Agent #2 Tasking: 200vh half-split with auto-rotating vertical tabs (4s progress bar) and fading image panes; click tabs at ≤991.

· Present on the 1 in-scope route. · appears on 1 routes · implemented by `src/components/TaskingAgent.jsx`

**`product.navigator-agent`** — Agent #3 Navigator: four row tabs activated on hover, with the matching image in the left rail.

· Present on the 1 in-scope route. · appears on 1 routes · implemented by `src/components/NavigatorAgent.jsx`

**`product.outreach-agent`** — Agent #4 Outreach: sticky left title panel with five sticky stacking cards in blue tints on the right.

· Present on the 1 in-scope route. · appears on 1 routes · implemented by `src/components/OutreachAgent.jsx`

### TRANSITION

_Decorative full-width blocks that change the page between dark and light surfaces._

**`transition.black-to-white`** — Scroll-scrubbed pixel-grid transition from the dark page into the white section.

· Present on the 1 in-scope route. · appears on 1 routes · implemented by `src/components/TransitionPixels.jsx (variant black-to-white)`

**`transition.white-to-black`** — Scroll-scrubbed pixel-grid transition from the white section back to the dark page.

· Present on the 1 in-scope route. · appears on 1 routes · implemented by `src/components/TransitionPixels.jsx (variant white-to-black)`

### FIT

_Why the product fits the buyer: specialties, EMR integrations, security/compliance._

**`fit.specialties`** — 'Designed for Your Specialty': 13 hover-activated specialty tabs with a matching image pane, plus 'And other specialties'.

· Present on the 1 in-scope route. · appears on 1 routes · implemented by `src/components/Specialties.jsx`

**`fit.integrations`** — 'Built to Connect': EMR/partner logos in two opposing marquee rows with hover background and logo swap; marketplace links open externally.

· Present on the 1 in-scope route. · appears on 1 routes · implemented by `src/components/Integrations.jsx`

**`fit.security`** — 'Secure. Compliant. Trusted.': image rail and a 2×2 grid of certification cells with hover background and logo swap.

· Present on the 1 in-scope route. · appears on 1 routes · implemented by `src/components/Security.jsx`

### CONVERSION

_Closing call-to-action block._

**`conversion.cta`** — Closing CTA over a background image revealed by a scroll-scrubbed pixel grid: agent list, 'Quick Start / Live in 60 Days', large headline, phone input with 'Call Alex' and 'Book a Demo'.

· Present on the 1 in-scope route. · appears on 1 routes · implemented by `src/components/Cta.jsx`

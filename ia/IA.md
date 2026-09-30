# https://www.transform9.com/ (homepage only, per PROJECT_SCOPE.md)

Source: https://www.transform9.com/ (homepage only, per PROJECT_SCOPE.md)
Status: **draft** · production approved: **false**
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

| section | category | templates | routes | scope |
|---|---|---:|---:|---|
| `shell.navbar` | SHELL | 1 | 1 | Present on the 1 in-scope route. |
| `shell.mobile-menu` | SHELL | 1 | 1 | Present on the 1 in-scope route, visible at tablet/mobile widths only. |
| `shell.page-layers` | SHELL | 1 | 1 | Present on the 1 in-scope route. |
| `shell.call-alex-modal` | SHELL | 1 | 1 | Present on the 1 in-scope route. |
| `shell.footer` | SHELL | 1 | 1 | Present on the 1 in-scope route. |
| `shell.footer-bottom-reveal` | SHELL | 1 | 1 | Present on the 1 in-scope route. |
| `hero.home` | HERO | 1 | 1 | Present on the 1 in-scope route. |
| `proof.client-logos` | PROOF | 1 | 1 | Present on the 1 in-scope route. |
| `proof.client-spotlight` | PROOF | 1 | 1 | Present on the 1 in-scope route. |
| `proof.stats` | PROOF | 1 | 1 | Present on the 1 in-scope route. |
| `proof.testimonials` | PROOF | 1 | 1 | Present on the 1 in-scope route. |
| `product.how-it-works` | PRODUCT | 1 | 1 | Present on the 1 in-scope route. |
| `transition.black-to-white` | TRANSITION | 1 | 1 | Present on the 1 in-scope route. |
| `product.scheduling-agent` | PRODUCT | 1 | 1 | Present on the 1 in-scope route. |
| `product.tasking-agent` | PRODUCT | 1 | 1 | Present on the 1 in-scope route. |
| `product.navigator-agent` | PRODUCT | 1 | 1 | Present on the 1 in-scope route. |
| `product.outreach-agent` | PRODUCT | 1 | 1 | Present on the 1 in-scope route. |
| `transition.white-to-black` | TRANSITION | 1 | 1 | Present on the 1 in-scope route. |
| `fit.specialties` | FIT | 1 | 1 | Present on the 1 in-scope route. |
| `fit.integrations` | FIT | 1 | 1 | Present on the 1 in-scope route. |
| `fit.security` | FIT | 1 | 1 | Present on the 1 in-scope route. |
| `conversion.cta` | CONVERSION | 1 | 1 | Present on the 1 in-scope route. |

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

**`shell.navbar`** — Fixed 60px top bar with blurred translucent dark background: logo, anchor links, Login, green Book a Demo button; switches to a light treatment over the white section.

· Present on the 1 in-scope route. · appears on 1 routes

**`shell.mobile-menu`** — Full-screen overlay menu opened from the burger at ≤991px with large anchor links, Login and CTA.

· Present on the 1 in-scope route, visible at tablet/mobile widths only. · appears on 1 routes

**`shell.page-layers`** — Fixed hero background video (tablet render) with pixel-still fallback and the tiled noise overlay behind page content.

· Present on the 1 in-scope route. · appears on 1 routes

**`shell.call-alex-modal`** — Hidden fixed popup ("Call Alex") with name/email/phone form, validation and success/error states; opened from hero CTA.

· Present on the 1 in-scope route. · appears on 1 routes

**`shell.footer`** — Footer top: rail with logo/description, link columns, email signup form, social links.

· Present on the 1 in-scope route. · appears on 1 routes

**`shell.footer-bottom-reveal`** — Sticky bottom bar revealed beneath the page: oversized wordmark and legal row (HIPAA, Terms, Privacy).

· Present on the 1 in-scope route. · appears on 1 routes

### HERO

_Page-opening statement with the primary call to action._

**`hero.home`** — Full-viewport dark hero: 6.5vw headline, supporting paragraph, bottom CTA blocks (blurred left block and green right block) over the fixed video.

· Present on the 1 in-scope route. · appears on 1 routes

### PROOF

_Social proof: client logos, case-study spotlight, metrics, testimonials._

**`proof.client-logos`** — Continuously scrolling marquee of client practice logos between hairlines.

· Present on the 1 in-scope route. · appears on 1 routes

**`proof.client-spotlight`** — Case study spotlight (Andrews Sports Medicine) with headline and YouTube video facade.

· Present on the 1 in-scope route. · appears on 1 routes

**`proof.stats`** — Four metric blocks in blue tints that expand on hover to reveal an image; left rail heading.

· Present on the 1 in-scope route. · appears on 1 routes

**`proof.testimonials`** — Testimonial slider: photo block, quote, author with green title badge, practice logo, numbered prev/next controls.

· Present on the 1 in-scope route. · appears on 1 routes

### PRODUCT

_Explanation of how the product works and its agent modules._

**`product.how-it-works`** — Scroll-driven 'How it works' sequence where large words highlight step by step.

· Present on the 1 in-scope route. · appears on 1 routes

**`product.scheduling-agent`** — Agent #1 Scheduling: stacking cards that tint as they stack on scroll.

· Present on the 1 in-scope route. · appears on 1 routes

**`product.tasking-agent`** — Agent #2 Tasking: 200vh half-split with auto-rotating tabs with progress bar and image panes.

· Present on the 1 in-scope route. · appears on 1 routes

**`product.navigator-agent`** — Agent #3 Navigator: row tabs with hover-revealed image pane.

· Present on the 1 in-scope route. · appears on 1 routes

**`product.outreach-agent`** — Agent #4 Outreach: split cards in four blue tints.

· Present on the 1 in-scope route. · appears on 1 routes

### TRANSITION

_Decorative full-width blocks that change the page between dark and light surfaces._

**`transition.black-to-white`** — Pixel-grid transition from the dark page into the white section.

· Present on the 1 in-scope route. · appears on 1 routes

**`transition.white-to-black`** — Pixel-grid transition from the white section back to the dark page.

· Present on the 1 in-scope route. · appears on 1 routes

### FIT

_Why the product fits the buyer: specialties, EMR integrations, security/compliance._

**`fit.specialties`** — List of 14 medical specialties with hover-revealed specialty images.

· Present on the 1 in-scope route. · appears on 1 routes

**`fit.integrations`** — EMR integration logos in two opposing marquee rows with hover swap.

· Present on the 1 in-scope route. · appears on 1 routes

**`fit.security`** — Security/compliance section with image rail and certification items.

· Present on the 1 in-scope route. · appears on 1 routes

### CONVERSION

_Closing call-to-action block._

**`conversion.cta`** — Closing CTA over background image with headline and demo actions.

· Present on the 1 in-scope route. · appears on 1 routes

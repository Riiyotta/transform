# Selectors: section IDs, component files, and key selectors

These are stable QA/IA hooks for the Transform9 homepage clone. Every section root has `data-section="<id>"`. Shared components have `data-component="<name>"`. The CSS for each component is in its own commented block in `src/index.css`, with the block named after the component.

Class names follow the original Webflow classes wherever practical, so rects can be diffed against `recon/measure-*.json`. The places where a class was renamed are listed at the end.

## Page shell (in DOM order)

| Order | `data-section` / `data-component` | Component file | Key selectors | Spec |
|---|---|---|---|---|
| – | `[data-component="navbar"]` | `src/components/Navbar.jsx` | `.nav-menu` (fixed, 60px); state classes `.is-on-white` (M4) and `.is-open` (menu); `.logo-white`, `.logo-black`, `.nav-link-block` (`._1st`, `.login`, `.cta`, `.mobil-top-cta`), `.nav-text` / `.nav-text.hiden`, `.menu-btn`, `.menu-btn-wrap`, `.burger-white`, `.burger-black`, `.nav-cross-white`, `.nav-border-on-white` | §3 |
| – | `[data-component="mobile-menu"]` | `src/components/Navbar.jsx` | `nav.nav-links#nav-menu-links`, `.nav-links-left`, `.nav-links-right`, `.bg-noise.nav-tabet`; `html.is-menu-open` while open | §3 |
| – | `[data-component="call-alex-modal"]` | `src/components/CallAlexModal.jsx` | `.modal-wrap` (`.is-open`; `data-state` = `default`, `success` or `error`), `.modal-overlay`, `.modal-window`, `#wf-form-Get-a-Call-Form`, `#First-Name`, `#Last-Name`, `#input-popup-phone`, `#Email`, `.popup-head`, `.captcha-popup` (empty placeholder), `.submit-form`, `.success-popup-call-wrap`, `.error-message.popup`, `.close-popup-wrap` | §16 |
| – | `.page-wrap` | `src/App.jsx` | z 2 wrapper for everything down to the footer top | §2 |
| – | `[data-component="page-noise"]` | `src/components/PageLayers.jsx` | `.bg-noise-wrap > .bg-noise` (fixed, z −1) | §2 |
| – | `[data-component="hero-bg-video"]` | `src/components/PageLayers.jsx` | `.bg-pixels-wrapper` (`.is-hidden` = M3 hook), `.bg-video-pixels > video`, `.bg-pic-pixels`; `html.has-video` once the video plays | §2 |
| 1 | `[data-section="hero"]` | `src/components/Hero.jsx` | `section.hero.home`, `h1.hero-heading`, `.head-span-1/2/3`, `.hero-home-bottom`, `.hero-bottom-block.left/.right`, `.home-hero-text`, `#email-form-1`, `#input-main-phone`, `.hero-cta-link.get-a-call`, `.line-vert.on-hero`, `.line-hor.on-hero` | §4 |
| 2 | `[data-section="client-logos"]` | `src/components/ClientLogos.jsx` (data: `src/data/clientLogos.js`) | `.div-block-3 > section.client-logos`, `.logos-wrapper` ×2 (M1 target), `img.client-logo`, `img.client-logo.sbj` | §5 |
| 3 | `[data-section="client-spotlight"]` | `src/components/ClientSpotlight.jsx` | `.div-block-5`, `h2.hero-heading`, `.text-span-14`, `.div-block-6`, `figure.yt-facade` (`[data-component="yt-facade"]`), `.yt-facade__thumb`, `.yt-facade__play`; after a click: `.yt-facade iframe` | §6 |
| 4 | `[data-section="stats"]` | `src/components/Stats.jsx` (data: `src/data/stats.js`) | `section.stats`, `.stats-left`, `.stats-text`, `.stats-span`, `img.img-stats`, `.stats-right`, `.stats-block` (`._02`, `._03`, `._04`; `.is-active` applies at ≤991), `.stat-head`, `.stat-descr`, `.stats-img-wrap`, `.stats-img` | §7 |
| 5 | `[data-section="testimonials"]` | **stub** in `src/App.jsx` | `[data-stub]` | §8 |
| 6 | `[data-section="how-it-works"]` | **stub** | | §9 |
| 7 | `[data-section="white-section"]` | **stub** (white bg). Its bounds drive the navbar `.is-on-white` observer | Planned sub-IDs: `transition-black-to-white`, `scheduling-agent`, `tasking-agent`, `navigator-agent`, `outreach-agent` | §10 |
| 8 | `[data-section="transition-white-to-black"]` | **stub** | | §11 |
| 9 | `[data-section="specialties"]` | **stub** | | §12 |
| 10 | `[data-section="integrations"]` | **stub** | | §13 |
| 11 | `[data-section="security"]` | **stub** | | §14 |
| 12 | `[data-section="cta"]` | **stub**. When built, reuse `CallAlexLink` with `textClassName="footer-cta"` and `useSite().phone` for `#input-footer-phone` | | §15 |
| 13 | `[data-section="footer"]` | `src/components/Footer.jsx` → `FooterTop` (data: `src/data/footer.js`) | `section.footer.section`, `.footer-top-wrap`, `.footer-top-row`, `.footer-top-left`, `.footer-top-right-side`, `.footer-columns-wrap`, `.footer-column`, `a.footer-link-wrap` (`[data-component="footer-link"]`), `.underline-small._1/_2`, `.footer-top-right`, `.footer-subs-wrap`, `.footer-bottom-center`, `a.w-underline-link`, `.footer-bottom-right`, `[data-component="hubspot-form"]` (`data-state` = `default`, `error` or `success`), `#footer-hs-email`, `.hs-button` | §17a |
| 14 | `[data-section="footer-bottom"]` | `src/components/Footer.jsx` → `FooterBottom` | `.footer-bottom-wrap` (sticky, outside `.page-wrap`), `.footer-logo-wrap`, `img.footer-logo`, `.footer-bottom-row`, `.footer-transp.bottom-links` | §17b |

## Shared primitives (`src/components/ui/`)

| `data-component` | File | Notes |
|---|---|---|
| `underline-pair` | `UnderlinePair.jsx` | `.underline._1` / `.underline._2` (`.black` variant). The parent needs `.has-underline` and `position: relative`. M12 target. |
| `call-alex-link` | `CallAlexLink.jsx` | `a.hero-cta-link.get-a-call`; opens the popup. |
| `noise` | `Noise.jsx` | `.bg-noise` plus a modifier (`nav-tabet`, `stat-img`, `popup-noise`). |
| – | `SiteContext.jsx` | `SiteProvider` / `useSite()` provide the phone value synced across the hero, popup and CTA inputs, plus the popup's open flag and state. |

## QA hooks

- `?popup=open`, `?popup=success` or `?popup=error` opens the popup on load in that state. The success and error states cannot be reached otherwise, because nothing is submitted over the network.
- Motion hooks: every place that needs motion has a `MOTION: M<n>` comment in the JSX or CSS. The M-ids are the ones in CLONE_SPEC §18.

## Renamed or introduced classes (vs Webflow)

| Clone | Original | Reason |
|---|---|---|
| `.hero-heading` | `.white-text.hero-home` (h1 and h2) | Same style, reused by Hero and Spotlight |
| `.label-16` | `._16px-text.white-text` | Label with the 43px indent (0 at ≤479) |
| `.text-14-white` | `._14px-text.white-text` | |
| `.text-56` | `._56-px-text` | |
| `.home-hero-text` | `p._30px-text.home-hero-text.white` | |
| `.stats-text` / `.stat-head` / `.stat-descr` | `._56-px-text.stats-text` / `.h1-text.white-text.stat-head` / `._16px-text.white-text.stat-descr` | |
| `.popup-head`, `.label`, `.popup-disc`, `.error-text` | `._56-px-text.white-text.popup-head`, `._14px-text.white-text.label`, `…popup-disc`, `._14px-text.error-text` | |
| `.submit-form.call-me` | `input._30px-text.submit-form.call-me.w-button` | |
| `.footer-top-right-side` | `.right-side.footer-top-right` | The original reuses `.footer-top-right` for two different elements |
| `.footer-transp`, `.footer-link` | `._14px-text.white-text.footer-transp`, `…footer-link` | |
| `.w-underline-link` | `._30px-text.white._w-underline` | |
| `.hs-embed` + `.hs-embed__sizer` | HubSpot iframe | Static replica. The sizer reproduces the iframe's 300px intrinsic width |
| `.is-on-white`, `.is-open`, `.is-active`, `.is-hidden`, `.is-menu-open`, `.has-video` | Webflow IX inline styles and `w--open` | Static state classes for the Animation pass to tween |

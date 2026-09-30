# Selectors: /book-a-demo and the legal template

These are the QA and IA hooks for `/book-a-demo`, `/terms-of-use`, `/privacy-policy` and `/hipaa`. The shell parts (navbar, page layers, footer) are covered in `SELECTORS.md`. Page CSS is global in the bundle and loads before `src/index.css`, so every page rule is scoped under a page class (`.book-demo-hero`, `.legal-hero`, `.legal-section`).

## /book-a-demo (specs/book-a-demo.md)

Shell flags: `footer: 'bottom'` (FooterBottom only), no popup and no preloader.

| `data-section` / `data-component` | File | Key selectors | Spec |
|---|---|---|---|
| `[data-section="hero"]` | `src/components/demo/DemoHero.jsx` (data: `src/data/bookDemo.js`) | `section.hero.hide-on-scroll.demo.book-demo-hero`, `.book-demo-left`, `h1.hero-heading.demo`, `.text-block-5`, `.book-demo-right`, `.bg-noise.book-demo-form-noise` (`[data-component="noise"]`) | §2 |
| `[data-component="demo-form"]` | `src/components/demo/DemoForm.jsx` | `.w-form` with `data-state` = `default`, `submitting`, `success` or `error`; `form#wf-form-T9-demo-form.demo-form`; `label[for]`; `input.w-input` (`#first_name`, `#last_name`, `#email`, `#practice_name`, `#emr_pms`); `input.w-button`; `.w-form-done` and `.w-form-fail` (each gets `.is-shown` when visible) | §2, §3 |

Styles are in `src/styles/page-book-a-demo.css`. The label colour sits in its own commented rule, `.book-demo-hero .demo-form label` (D12: white; live is `#020801`).

**QA hook (this page only):** `?form=success` or `?form=error` renders that form state on load. The clone never submits, so the error state can only be reached this way. The success state can also be reached by submitting a valid form.

## Legal template (specs/legal.md)

Shell flags: `preloader: true`, full footer and no popup. `LegalPage` picks the content from the route slug (`params[0]`).

| `data-section` / `data-component` | File | Key selectors | Spec |
|---|---|---|---|
| `[data-section="hero"]` | `src/components/legal/LegalHero.jsx` | `section.hero.hide-on-scroll.legal-hero`, `h1.hero-heading.legal`, `.hero-home-bottom.legal`, `.hero-bottom-block.full-width`, `.label-16` ("About Page"), `p.home-hero-text.legal-terms` or `.legal-privacy`, `.line-hor.on-hero` | §3 |
| `[data-section="legal-content"]` | `src/components/legal/LegalContent.jsx` | `section.legal-section`, `.legal-cont`, `.legal-block` (`[data-component="legal-block"]`, plus `.last`), `h2.text-30.white`, `.legal-text-wrap`, `p.label-16.transp`, `p.text-22-green`, `ul.list-white.transp > li.list-item > p.label-16.transp`, `a.link-transp` (`[data-component="legal-link"]`) | §4 |

The content data is in `src/data/legal/termsOfUse.js`, `privacyPolicy.js` and `hipaa.js`. These files were generated from `recon/pages/legal/{slug}-content.html` with the text kept verbatim. `recon/build-demo-legal/text-check.mjs` checks the rendered text, `<br>` count, block structure and links against the source.

## Renamed classes (vs Webflow)

| Clone | Original |
|---|---|
| `.hero-heading.legal` / `.hero-heading.demo` | `h1.white-text.hero-home.legal` / `.demo` |
| `.label-16` (hero label) and `.label-16.transp` (body) | `._16px-text.white-text` and `._16px-text.white-text.transp` |
| `.home-hero-text.legal-terms` / `.legal-privacy` | `p._30px-text.home-hero-text.white.legal-terms` / `.legal-privacy` |
| `h2.text-30.white` | `h2._30px-text.white` |
| `p.text-22-green` | `p._22px-text-green` |
| `.legal-hero`, `.book-demo-hero`, `.demo-form` | (added scope classes) |
| `.is-shown` | Webflow's inline `display:block` on `.w-form-done` / `.w-form-fail` |

## Motion hooks (`MOTION:` comments)

| Id | Where |
|---|---|
| M3b | `DemoHero.jsx` and `LegalHero.jsx`. This is the video fade in the shell (PageLayers), and it already works through `[data-section="hero"]`: opacity is 1 at scrollY 0 and 0 at scrollY 200 on both templates. |
| BAD-M1 | `BookDemoPage.jsx`, `DemoHero.jsx`. Load intro on shell targets only (`.bg-pixels-wrapper`, `.nav-menu`). |
| BAD-M2 | `DemoForm.jsx`, `page-book-a-demo.css`. Input focus border, instant. Implemented in CSS. |
| LGL-M1 | `LegalPage.jsx`, `LegalHero.jsx`. Load intro: `.preloader-wrap`, `.bg-pixels-wrapper`, `.nav-menu`, `.hero-bottom-block.full-width` (opacity) and `.line-hor.on-hero` (width). These are rendered statically in their final state. |

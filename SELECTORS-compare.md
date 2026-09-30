# Selectors: /compare (Builder C)

These rows add to `SELECTORS.md` and use the same conventions. Page CSS is in `src/styles/page-compare.css`. Every rule there is scoped under a section class that only /compare uses, or under a compare-only modifier, because all page stylesheets share one bundle. The spec is `specs/compare.md`. The measure and state tools are `recon/build-compare/tools/measure.mjs` and `states.mjs`.

## Shell additions

| `data-component` | File | Key selectors | Spec |
|---|---|---|---|
| `preloader` | `src/components/Preloader.jsx` (CSS `src/styles/preloader.css`) | `.preloader-wrap`: fixed, z 4, settled at opacity 0. Also used by the legal routes. | §0, CMP-M1 / LGL-M1 |
| `bg-pixels-overlay` | `src/components/compare/BgPixelsOverlay.jsx` | `.bg-pixels-overlay`: fixed, z −2, settled at opacity 0. It is rendered after PageLayers, i.e. after `.page-wrap-solid-bg`; live has it before. Paint order is unchanged. | §0, CMP-M1 |

## Sections (DOM order)

| Order | `data-section` / `data-component` | Component (data: `src/data/compare.js`) | Key selectors and state hooks | Spec |
|---|---|---|---|---|
| 1 | `[data-section="hero"]` | `compare/CompareHero.jsx` | `section.hero.home` (homepage HERO CSS), `h1.hero-heading.compare`, `.compare-span-1`, `.hero-bottom-block.left`, `.home-hero-text`, `.hero-bottom-block.right.comparison-hero`, `.label-16.full-width`, `.line-vert.on-hero`, `.line-hor.on-hero`; `[data-component="book-live-demo-link"]` = `a.hero-cta-link.compare-demo` > `.text-56.footer-cta` + UnderlinePair | §2 |
| 2 | `[data-section="generic"]` | `compare/GenericSection.jsx` | `section.generic-section`, `.left-side.generic` (call-blue bg), `.right-side.generic`, `.label-16.why-text`, `.gen-text-wrap`, `h2.h1-text.generic`, `.generic-span`, `p.text-30.white.generic-text` | §3 |
| 3 | `[data-section="comparison-table"]` | `compare/ComparisonTable.jsx` | `section.table-section`, `.table-top-wrap`, `h2.h1-text.table-head`, `.table-span`; `[data-component="comparison-table"]` = `.table-wrap[role=table]` > `.table-row.head` (sticky at ≤767) > `.table-cell.left-cell.head-left` + `.table-right` > `.table-cell.right-cell.head` (`img.logo-table`, `p.text-30.white.table-head`); body `.table-row` ×10 > `.table-cell.left-cell` + `.table-right` > `.table-cell.right-cell.t9` (`img.tick-img`, `.label-16.table-text`) + `.table-cell.right-cell` (`.text-16.half-white.table-text`); `.table-bottom`, `.table-bottom-left`, `.table-bottom-left-text`, `.table-bottom-right` (second `book-live-demo-link`) | §4, CMP-M5 |
| 4 | `[data-section="access"]` | `compare/AccessSection.jsx` | `section.access-section`, `.access-left`, `.access-right`, `.access-right-top`, `.access-top-label`, `h2.h1-text.access` (5vw at every width), `.access-span`, `.access-right-bottom`, `.access-block` (`._2nd`), `p.access-block-head`, `.access-block-text` (`._2`) | §5 |
| 5 | `[data-section="white-section"][data-variant="compare"]` | `compare/CompareWhiteSection.jsx` | `section.white-section`. Its bounds drive the navbar `.is-on-white` (M4). | §6 |
| 5a | `[data-section="transition-black-to-white"]` | `TransitionPixels.jsx` (shared) | As on the homepage. `.right-side-w-line` is hidden with `display:none` on this page. | §6a, M8a |
| 5b | `[data-section="specialty-white"]` | `compare/CompareWhiteSection.jsx` | `div.specialty-white`, `.sp-wh-top`, `.sp-top-left`, `.sp-top-right`, `.text-16.sp-label`, `h2.h1-text.sp-wh` | §6b |
| 5b′ | `[data-section="specialties"][data-variant="white"]` | `Specialties.jsx` with `variant="white"` and `bottomText` | `div.specialty-section.white#specialties`, `.specialty-top-row.wh`, `[data-component="specialty-tabs"]` = `.specialty-tabs.wh` > `.specialty-tabs-menu.wh[role=tablist]` > `a.specialty-tab-link.wh` (first also `._1`; `.is-current` = green; `#specialty-tab-N`), `.specialty-tabs-content.wh` (sticky top 60) > `.specialty-tab-pane` (`.is-active`; `#specialty-pane-N`); `.right-side.specialty-bottom.wh` > `.label-16.specialty-bottom-text.wh` | §6b, M20 |
| 5c | `[data-section="integrations"][data-variant="white"]` | `Integrations.jsx` with `variant="white"` and `text` | `section.integration-section.white#integrations`, `.integration-top-wrap.wh`, `h2.integration-head.wh`, `.integ-span`, `.label-16.integration-text.wh-top`, `.integration-bottom-wrap.wh`, `[data-component="integration-track"]` = `.intagrations-row._1.wh` / `._2.wh` (×2 each), `[data-component="integration-block"]` = `.integration-block.wh` (`a` when linked) > `img.integration-logo.black.on-wh` | §6c, M2a/M2b, CMP-M3 |
| 6 | `[data-section="transition-white-to-black"]` | `TransitionPixels.jsx` (shared) | As on the homepage | M8b |
| 7 | `[data-section="privacy"]` | `compare/PrivacySection.jsx` | `section.privacy-section`, `.privacy-top`, `h2.h1-text.privacy`, `.privacy-span`, `.privacy-bottom`, `.privacy-left` (privacy-green bg), `.privacy-right`, `.privacy-row` (`._2`), `[data-component="privacy-block"]` = `.privacy-block` > `.text-30.white.privacy-head` + `.text-16.privacy-text` (`.long`) | §7, CMP-M2 |
| 8 | `[data-section="healthcare-evaluation"]` | `compare/EvSection.jsx` | `section.ev-section`, `.ev-left`, `.ev-right`, `.ev-top`, `.ev-label`, `h2.h1-text.ev`, `.ev-bottom`; `[data-component="ev-accordion"]` = `.ev-tabs[data-current=1..4]` > `.ev-tab-menu[role=tablist]` > `a.ev-tab` (`#ev-tab-N`, `.is-current`, `.last`) > `.text-30.ev-head` + `.text-16.ev-tab-text` (shown only in `.is-current`); `.ev-tabs-content` (display none) > `.w-tab-pane#ev-pane-N` (empty) | §8, CMP-M4 |
| 9 | `[data-section="cta"]` | `Cta.jsx` (shared) | As on the homepage | §9 |

## Renamed or introduced classes (vs Webflow)

| Clone | Original |
|---|---|
| `.hero-heading.compare` | `h1.white-text.hero-home.compare` |
| `.h1-text` (page-scoped; white except `.sp-wh`) | `.h1-text.white-text` / `.h1-text` |
| `.text-30`, `.text-30.white` | `._30px-text`, `._30px-text.white` |
| `.text-16`, `.text-16.half-white` | `._16px-text`, `._16px-text.half-white` |
| `.label-16` (global) | `._16px-text.white-text` |
| `.text-56.footer-cta` | `._56-px-text.footer-cta` |
| `.integration-head.wh`, `.integration-text.wh-top`, `.specialty-bottom-text.wh`, `.specialty-tab-text` | `h2.h1-text.white-text.integration-head.wh`, `._16px-text.white-text.integration.wh-top`, `._16px-text.white-text.specialty-bottom.wh`, `._30px-text` |
| `.is-current` / `.is-active` | Webflow `.w--current` / `.w--tab-active` |

## QA hooks

- The accordion is keyboard-operable. Click activates a tab and hover does nothing. The arrow keys, Home and End move between tabs.
- The popup can be forced open with `?popup=open|success|error`, as on the homepage.
- Motion hook comments: `MOTION: CMP-M1…M5`, plus the shared M2a/M2b, M3, M4, M8a/b/c, M11, M12 and M20.

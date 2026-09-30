# Selectors: Builder A sections

These rows add to `SELECTORS.md` and follow its conventions. Each section's CSS lives in its own `src/styles/<name>.css` file, scoped under the section root. Webflow class names are kept wherever practical so rects can be diffed against `recon/measure-*.json`. The measure tool is `recon/build-A/tools/measureA.mjs`.

| Order | `data-section` / `data-component` | Component file (data) | Key selectors and state hooks | Spec |
|---|---|---|---|---|
| 5 | `[data-section="testimonials"]` | `Testimonials.jsx` (`src/data/testimonials.js`) | `section.testimonials#testimonials`, `.testimonials-top`, `.testim-top-left/right`, `.testim-heading`, `[data-component="testimonial-slider"]` = `.testimonials-slider` (`data-current` = 0 or 1), `.testim-slider-mask`, `.testim-slide` (`.is-active`; the inactive slide is `visibility:hidden`; `data-index`), `.testim-photo-block`, `.testim-photo`, `.testim-author-name/title`, `.testim-right-side`, `p.testimonial`, `.testim-highlight`, `.testim-point-wrap`, `.testim-num` (`.testim-num-plain` on slide 2), `.testim-point`, `.testim-logo`, `.sider-count > .slider-current + .slider-all`, `[data-component="testim-arrow"]` = `button.test-arrow-wrap.left/.right` > `.arrow.white` + `.arrow.black` | §8, M13, M19 |
| 6 | `[data-section="how-it-works"]` | `HowItWorks.jsx` (prop `activeIndex` 0–2) | `section.how-it-works[data-active]`, `.how-works-right.top/.medium/.full`, `.how-works-sticky-cont`, `.how-works-sticky`, `.how-works-right-text.top/.bottom-w-text/.bottom`, `[data-component="hiw-words"]` = `.how-works-heads-wrap`, `.hiw-text-block.left` (translateY 0/12vw/24vw by `data-active`), `.hiw-text-block.left-mob`, `.hiw-text._1/_2/_3` (`.is-active` = green, `data-index`), `.hiw-trigger._1/_2/_3/.space` (ScrollTrigger targets), `.hiw-bottom` | §9, M7 |
| 7 | `[data-section="white-section"]` | `WhiteSection.jsx` | `section.white-section`. Its bounds drive the navbar's `.is-on-white` | §10, M4 |
| 7a / 8 | `[data-section="transition-black-to-white"]`, `[data-section="transition-white-to-black"]`, both `[data-component="transition-pixels"][data-variant]` | `TransitionPixels.jsx` (prop `variant`) | `.transition-cont.black-to-white` / `.white-to-black`, `.transition-wrap.white` / `.black` / `.mix` (`data-layer`), `.grid-row._5…_1` (`.b-w` / `._w-b`; `data-row`), `.pixel` (`.blue`, `.green`, `.black`, `.mob-hide`; `data-row` 1–5, `data-col` 0–19, `data-index` = (5−row)·20+col), `.bg-noise.b-to-w`, `.right-side-w-line`. Rendered in the settled state (opacity 1) | §10a, §11, M8a/M8b |
| 7b | `[data-section="scheduling-agent"]` | `SchedulingAgent.jsx` (prop `stackStep` 0–3; `src/data/schedulingCards.js`) | `#products.stacking-cards-section.schudule-agent[data-stack-step]`, `.horizontal-wrap.scheduling`, `.left-side.our-products`, `.right-side.agent.schedule`, `.h1-text.agent.sch`, `.num-agent-1`, `.sheduling-top-space`, `.scheduling-cards`, `[data-component="scheduling-card"]` = `.scheduling-card._1…_4` (`data-depth` 0–3, `.is-stacked` = tint), `.stack-card-left`, `.stack-card-text-wrap`, `.stack-card-head`, `.stack-card-text`, `.sch-img._1…_4`, `.bg-noise.cards` | §10b, M9 |
| 7c | `[data-section="tasking-agent"]` | `TaskingAgent.jsx` (`src/data/taskingTabs.js`) | `.half-split-wrap`, `.half-split-section` (sticky), `[data-component="tasking-tabs"]` = `#pairTabs.tabs[data-current="Tab N"]`, `.tabs-menu`, `a.tab-link` (`.w--current`; `#tasking-tab-N`), `.tab-title`, `.task-text-row`, `[data-component="tab-progress"]` = `.tab-progress-vert`, `.tabs-content`, `.tab-pane` (`.w--tab-active`; `#tasking-pane-N`), `.tab-pane-wrap`, `.task-img-wrap`, `.task-img`, `.task-text`, `.half-head-text-wrap.task-agent` | §10c, M10, M10b |

## Renamed or introduced classes (vs Webflow)

| Clone | Original | Reason |
|---|---|---|
| `button.test-arrow-wrap` | `div.test-arrow-wrap.w-slider-arrow-*[role=button]` | A native button, keyboard-operable |
| `.testim-slide.is-active` | Webflow slider inline styles | Static state class for the Animation pass |
| `.testim-num-plain` | `._30px-text.white` (slide 2 number) | That number has no `.testim-num` in the original, so it is 18px (not 24) at ≤991 |
| `.text-16` (section-scoped) | `._16px-text` (black, no indent) | |
| `.tab-title` | `._30px-text.black` | |
| `.hiw-text` | `.h1-text.white-text.hiw-text` | |
| `.stack-card-left/head/text` | `._30px-text.white.stack-card-*` / `._14px-text.white-text.stack-card-text` | |
| `.testimonial` | `p._30px-text.testimonial` | |
| `.is-active` (HIW), `.is-stacked`, `[data-depth]`, `[data-stack-step]`, `[data-active]` | IX3 inline styles | Static state hooks for the Animation pass |

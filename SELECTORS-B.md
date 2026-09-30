# Selectors (Builder B): Navigator, Outreach, Specialties, Integrations, Security, CTA

These rows extend `SELECTORS.md`, using the same conventions. Each section's CSS lives in its own file under `src/styles/`, and every rule there is scoped under the section root.

## Sections

| Order | `data-section` / `data-component` | Component file | Key selectors | Spec |
|---|---|---|---|---|
| 7d | `[data-section="navigator-agent"]` | `src/components/NavigatorAgent.jsx` (data: `src/data/navigator.js`), CSS `src/styles/navigator-agent.css` | `div.row-tabs-section`, `.horizontal-wrap.navigator`, `.left-side.with-line`, `.right-side.agent.navigator`, `h2.agent-head`, `.agent-num`; `[data-component="row-tabs"]` = `.row-tabs` > `.row-tabs-menu[role=tablist]` > `a.row-tab-link` (`#navigator-tab-N`, `.is-current`), `.row-tab-head`, `.row-tab-text`; `.row-tabs-content` > `.row-tab-pane` (`#navigator-pane-N`, `.is-active`) > `.row-tab-pane-wrap` > `.nav-agent-img-wrap` > `img.nav-agent-img` | §10d |
| 7e | `[data-section="outreach-agent"]` | `src/components/OutreachAgent.jsx` (data: `src/data/outreachCards.js`), CSS `src/styles/outreach-agent.css` | `div.split-cards-section`, `.split-cards-left-wrap` (sticky), `.half-head-text-wrap.out-agent`, `h2.agent-head`, `.agent-num`, `.out-left-bottom`, `.split-cards-right-wrap`; `[data-component="out-card"]` = `.out-card._1`…`._5` (sticky, fixed offsets), `.out-card.space`, `.out-card-top-wrap`, `.out-card-title`, `.blue-card`, `.out-card-text-bottom`, `img.out-icon` | §10e |
| 9 | `[data-section="specialties"]` | `src/components/Specialties.jsx` (data: `src/data/specialties.js`), CSS `src/styles/specialties.css` | `section.specialty-section#specialties`, `.specialty-top-row`, `.left-side.specialty`, `.specialty-left-side-wrap` (sticky), `.specialty-title`, `.text-span-13`; `[data-component="specialty-tabs"]` = `.specialty-tabs` > `.specialty-tabs-menu[role=tablist]` > `a.specialty-tab-link` (`#specialty-tab-N`, `.is-current`) > `.specialty-tab-text`; `.specialty-tabs-content` (sticky) > `.specialty-tab-pane` (`#specialty-pane-N`, `.is-active`) > `.specialty-tab-pane-wrap` > `img.specialty-img` + `.bg-noise.specialty-noise`; `.specialty-bottom-row`, `.right-side.specialty-bottom`, `.specialty-bottom-text` | §12 |
| 10 | `[data-section="integrations"]` | `src/components/Integrations.jsx` (data: `src/data/integrations.js`), CSS `src/styles/integrations.css` | `section.integration-section#integrations`, `.integration-top-wrap`, `h2.integration-head`, `.integration-head-span`, `.integration-top-right-wrap`, `.integration-text`, `.integration-label`, `.integration-bottom-wrap`, `.integ-row-cont` / `.integ-row-cont._2`; `[data-component="integration-track"]` = `.intagrations-row._1` ×2 (M2a) / `.intagrations-row._2` ×2 (M2b); `[data-component="integration-block"]` = `.integration-block.bl` (`a` when linked), `img.integration-logo.white` / `.black` | §13 |
| 11 | `[data-section="security"]` | `src/components/Security.jsx` (data: `src/data/security.js`), CSS `src/styles/security.css` | `section.secure-section#security`, `.left-side.security` (secure.avif), `.right-side.security`, `.secure-right-top-wrap`, `h2.secure-head`, `.secure-head-span`, `.secure-text`, `.secure-right-bottom-wrap`, `.security-row-of-2` (`._1`); `[data-component="secure-block"]` = `.secure-block` (`._2nd`, `.right` = empty), `img.secure-logo.white` / `.black` (`.sm`) | §14 |
| 12 | `[data-section="cta"]` | `src/components/Cta.jsx` (data: `src/data/cta.js`), CSS `src/styles/cta.css` | `section.cta-section`; `[data-component="transition-black-to-img"]` = `.transition-cont.black-to-img` > `.transition-wrap.black` / `.transition-wrap.mix` > `.grid-row._5…_1.b-i` > `.pixel` (`.black`, `.blue`, `.green`, `.mob-hide`) (M8c); `.cta-content-wrap`, `.cta-top-wrap`, `.cta-text-top-wrap`, `.cta-top-text-left`, `.cta-top-text-list`, `.cta-top-text-right`, `h2.cta-heading`, `.cta-head-span`; `.hero-home-bottom` > `.hero-bottom-block.bottom-left` (`#email-form`, `#input-footer-phone`, `[data-component="call-alex-link"]`) and `.hero-bottom-block.bottom-right` (`.bottom-cta-right`, `[data-component="book-demo-link"]` = `a.hero-cta-link.black`) | §15 |

## Renamed or introduced classes (compared with Webflow)

| Clone | Original | Reason |
|---|---|---|
| `.agent-head` | `h2.h1-text.agent` | Scoped per section; `.h1-text` is not a global helper in the clone |
| `.agent-num` | `._16px-text` ("#3" / "#4") | |
| `.row-tab-head`, `.row-tab-text` | `._30px-text.row-tab-head`, `._16px-text.row-tab-text` | |
| `.out-card-title` | `._30px-text.white` | |
| `.label-16.blue-card`, `.label-16.out-card-text-bottom` | `._16px-text.white-text.blue-card` / `.out-card-text-bottom` | Reuses the shared `.label-16` |
| `.specialty-title`, `.specialty-tab-text`, `.specialty-bottom-text` | `._16px-text.white-text.specialty`, `._30px-text`, `._16px-text.white-text.specialty-bottom` | |
| `.integration-head`, `.integration-text`, `.integration-label` | `h2.h1-text.white-text.integration-head`, `._16px-text.white-text.integration`, `._30px-text.white.integration` | |
| `.secure-head`, `.secure-text` | `h2.h1-text.white-text.secure`, `._16px-text.white-text.secure` | |
| `.cta-heading` | `h2.h1-text.white-text.cta-bottom` | |
| `.bottom-cta-right` | `._16px-text.bottom-cta-right` | |
| `.is-current` / `.is-active` | Webflow `.w--current` / `.w--tab-active` | React tab state |

## QA hooks

- Tabs: `#navigator-tab-N` / `#navigator-pane-N` (N = 0–3) and `#specialty-tab-N` / `#specialty-pane-N` (N = 0–12). Hovering, clicking or pressing the arrow keys activates a tab.
- Motion hooks: `MOTION: M<n>` comments in the JSX and CSS: M2a, M2b, M8c, M12, M14, M20 (plus M11 through the shared `CallAlexLink`).

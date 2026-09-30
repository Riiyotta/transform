# Intentional deviations from the live original

| # | Area | Live behaviour | Clone behaviour | Basis |
|---|---|---|---|---|
| D1 | Tracking / third-party scripts | GTM, HubSpot, ZoomInfo, LinkedIn, reCAPTCHA, etc. (CLONE_SPEC §20) | Stripped | PROJECT_SCOPE (user decision) |
| D2 | Forms (hero phone, Call Alex popup, footer HubSpot form) | Post to HubSpot / AWS API | Client-side validation + success/error states; no network. Footer form success copy is unverified placeholder. | PROJECT_SCOPE (user decision) |
| D3 | reCAPTCHA widget in popup | Rendered widget | Empty 304×78 spacer keeps the measured popup height | D1 consequence |
| D4 | Client Spotlight YouTube | Facade figure has 0 width → empty 728px black area (headless Chromium, 2026-09-30) | Working facade: local thumbnail + play button; youtube-nocookie iframe only after click | User decision 2026-09-30 |
| D5 | YouTube thumbnail | Hotlinked from i.ytimg.com | Local copy `/assets/yt-thumb.jpg` | Avoid third-party requests (ASSET_MANIFEST decisions) |
| D6 | EMR marketplace links | `target="_blank"` without rel | Adds `rel="noopener"` | Security hygiene; no visual/behavioural change |
| D7 | Keyboard focus | `:focus { outline: 0 }` on arrows, tabs, etc. | Visible `:focus-visible` ring (keyboard only) on links, buttons, tabs; text fields keep the original focus border only; no change for mouse users | User decision 2026-09-30 (approved accessibility deviation). Implemented in src/index.css (FOCUS-VISIBLE block). |
| D8 | Call Alex popup keyboard behaviour | Not measured / Webflow default | Focus moves into dialog on open, Escape closes, focus returns to opener on close | Accessibility; no visual change |
| D9 | /book-a-demo form | Posts to HubSpot, may redirect to an unseen `redirectUri`; honeypot + 1500ms spam guard | Client-side validation → brief "Submitting..." → Webflow "Thank you!" block; no network; spam guards omitted; dead Finsweet/dropdown-redirect scripts and `#t9-hubspot-form` CSS stripped | D2 policy (no submission); redirect target unknown and off-site |
| D10 | Privacy-policy inline links | `target=_blank` without rel | Adds `rel="noopener"` | Same as D6 |
| D11 | Page-load intro (compare, book-a-demo, legal, blog, case studies) | Starts when the Webflow runtime / window `load` fires (2.3–6s observed, once ~50s, due to third-party scripts) | Same intro timeline and values, started on mount | User decision 2026-09-30 |
| D12 | /book-a-demo form labels | Black on black (invisible) | Visible white labels, measured size/weight/spacing | User decision 2026-09-30 (accessibility) |
| D13 | Blog post share icons | Finsweet script opens share popups | Icons render with hover, clicks do nothing (script stripped, no replacement) | User decision 2026-09-30 |
| D14 | `/blog?523ae0d4_page=2` | Broken on live (page 1 again + unstyled Previous button) | Renders the normal blog index; Load More appends older posts in place as on live | User decision 2026-09-30 |
| D15 | Hidden style-guide block on blog/case-study detail pages | Hidden, but still loads Twitter widgets + a YouTube iframe | Not rendered; no third-party loads | D1 policy |

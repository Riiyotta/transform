# Intentional deviations from the live original

| # | Area | Live behaviour | Clone behaviour | Basis |
|---|---|---|---|---|
| D1 | Tracking / third-party scripts | GTM, HubSpot, ZoomInfo, LinkedIn, reCAPTCHA, etc. (CLONE_SPEC §20) | Stripped | PROJECT_SCOPE (user decision) |
| D2 | Forms (hero phone, Call Alex popup, footer HubSpot form) | Post to HubSpot / AWS API | Client-side validation + success/error states; no network. Footer form success copy is unverified placeholder. | PROJECT_SCOPE (user decision) |
| D3 | reCAPTCHA widget in popup | Rendered widget | Empty 304×78 spacer keeps the measured popup height | D1 consequence |
| D4 | Client Spotlight YouTube | Facade figure has 0 width → empty 728px black area (headless Chromium, 2026-09-30) | Working facade: local thumbnail + play button; youtube-nocookie iframe only after click | User decision 2026-09-30 |
| D5 | YouTube thumbnail | Hotlinked from i.ytimg.com | Local copy `/assets/yt-thumb.jpg` | Avoid third-party requests (ASSET_MANIFEST decisions) |

# QA report — Transform9 homepage clone

State at git revision following this file's commit. Route in scope: `/` only (PROJECT_SCOPE.md). Intentional deviations: DEVIATIONS.md (D1–D8).

## Coverage
| Layer | What was checked | How | Result | Evidence |
|---|---|---|---|---|
| Route smoke | title, 17 section roots, no stubs, 0 console errors, 0 non-localhost requests, 0 failed requests, 0 broken images, no horizontal overflow, document height vs live | `qa/smoke.mjs` (scrolls first for lazy images), dev + prod, 1440/1024/768/390 | PASS; heights equal live exactly (25922/22731/14430/17939) | qa/smoke.mjs |
| Breakpoint edges | overflow, errors, hero H1 = spec formula, burger visibility at ≤991 | `qa/edges.mjs` at 1920/992/991/768/767/480/479/320, dev + prod | PASS 8/8 both | qa/edges.mjs |
| Static fidelity — pilot | nav, menu, page layers, hero, logos, spotlight, stats, popup (3 states), footer | pixel-audit: ~95 elements × 6 widths, computed styles + rects vs live | 4 defects fixed; all within 1px after | recon/audit-pilot/ |
| Static fidelity — sections | testimonials → CTA, nav on white | pixel-audit: 7,314 live elements × 36 props × 6 widths + screenshot diffs + states | 3 defects fixed; 0 mismatches after | recon/audit-sections/AUDIT.md |
| Motion — scroll/global (M3, M4, M7, M8a–c, M9, M15, M18, M21, M22) | trigger positions, tween values over progress, resize, reverse | Motion-1 live-paired sampling using live runtime internals; main-session re-check of M22 wheel + PageDown and M21 reduced motion | PASS (triggers identical at 4 widths) | recon/motion-1/, qa/m22-wheel.mjs, qa/reduced-motion.mjs |
| Motion — interaction (M1, M2, M5, M6, M10, M11, M12, M12b, M13, M14, M16, M17, M19, M20) | values over time, repeated activation, breakpoints | Motion-2 live-paired sampling; main-session real-mouse re-check of M5/M12/M13/M14/M16/M19 and tab swap | PASS | recon/motion-2/, qa/hover-sample.mjs, qa/motion-spot.mjs, qa/tabs-video.mjs |
| Behaviour | links (56: 15 external, 17 internal, 23 anchors, 1 mailto), popup open/validate/close/Escape, phone sync, mobile menu, YouTube facade, keyboard focus ring, no focus traps | full-site QA agent + main-session re-checks | PASS | recon/full-qa/QA_REPORT.md |
| Deviations | D1–D8 implemented as described | full-site QA | PASS | recon/full-qa/QA_REPORT.md |

## Independent-QA findings that were rejected after verification
Nine defect claims from four QA passes were reproduced by the main session and found to be test-method errors (wrong selectors, hovers never triggered, no live comparison). Each is documented with counter-evidence at the end of the respective report: recon/motion-qa/MOTION-QA.md, recon/motion-qa/interaction/REPORT.md, recon/motion-qa/scroll/REPORT.md, recon/full-qa/QA_REPORT.md.

## Known, accepted differences
- Tasking tab auto-rotation starts on React mount (live: ~1–2s later when Webflow is ready); period and progress rate identical.
- M18: live snaps the close icon on the very first menu open (IX2 quirk); clone always animates.
- Pixel-transition order is random per load on both (by design); per-row opaque counts match.
- Out-of-scope internal routes (/compare, /blog, /case-studies, /book-a-demo, /hipaa, /terms-of-use, /privacy-policy) keep their original hrefs and 404 locally.

## Not tested
Real touch/swipe (slider swipe not implemented — threshold never measured), Safari/Firefox, screen readers/ARIA semantics beyond focus handling, mid-page reload scroll restoration, footer HubSpot success copy (unverified placeholder), performance metrics.

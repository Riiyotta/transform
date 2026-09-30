# Route inventory — www.transform9.com

Source: same-host crawl (`recon/crawl.mjs` → `recon/routes.json`), 2026-09-30. The site has no sitemap.xml (404) and no robots.txt. All crawled routes returned 200.

## In scope — 18 routes, 10 template families
| Family | Routes | Webflow page id (suffix) | Status |
|---|---|---|---|
| Home | `/` | …48e34f | **Built, QA-passed** |
| Compare | `/compare` | …0a7459 | to build |
| Blog index | `/blog` | …a2aa30 | to build |
| Blog post (CMS detail) | 8 × `/blog/<slug>` (listed below) | …cb17b7 (one template) | to build |
| Case-studies index | `/case-studies` | …b91fd5 | to build |
| Case study (CMS detail) | `/case-studies/southern-bone-joint`, `/case-studies/the-orthopaedic-center` | …113701 (one template) | to build |
| Book a Demo | `/book-a-demo` | …476ea3 | to build |
| Legal: Terms of Use | `/terms-of-use` | …653b04 | to build (likely shares a legal template) |
| Legal: Privacy Policy | `/privacy-policy` | …a06e9d | to build (likely shares a legal template) |
| Legal: HIPAA | `/hipaa` | …d14ac5 | to build (likely shares a legal template) |

Blog posts:
- `/blog/ai-voice-agents-for-athenahealth-7-questions-to-ask-before-choosing-a-platform`
- `/blog/medical-practice-call-volume-january`
- `/blog/ent-reimbursement-in-2027-what-medicare-s-proposed-cuts-mean-for-otolaryngology-practices`
- `/blog/orthopedic-ai-answering-service`
- `/blog/redefining-healthcare-ai`
- `/blog/the-12-month-shift-why-voice-ai-agents-are-now-a-financial-imperative-for-specialty-practices`
- `/blog/why-traditional-ivr-is-failing-your-practice-and-how-ai-voice-agents-fix-the-press-0-trap`
- `/blog/why-generic-ai-virtual-assistants-fail-specialty-medical-practices-and-what-actually-works`

Not a separate route: `/?523ae0d4_page=2` is the homepage with a Webflow CMS list's pagination query; recon to identify which list and whether the clone needs the state.

## Excluded — external domains (stay as outbound links, not cloned)
`apply.workable.com/transform9/` (Careers), `portal.transform9.com` (Login), `marketplace.athenahealth.com`, `synapsys.modmed.com`, `www.nextgen.com/solutions/marketplace`, `www.linkedin.com/company/transform9`, `www.youtube.com/@Transform9`. Tracking hosts (Intellimize etc.) are stripped per D1.

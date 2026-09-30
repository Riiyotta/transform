import HomePage from './pages/HomePage'
import PageStub from './pages/PageStub'
import { getPost, getCaseStudy } from './data/cms'
import ComparePage from './pages/ComparePage'
import BookDemoPage from './pages/BookDemoPage'
import LegalPage from './pages/LegalPage'
import BlogIndexPage from './pages/BlogIndexPage'
import BlogPostPage from './pages/BlogPostPage'
import CaseStudiesIndexPage from './pages/CaseStudiesIndexPage'
import CaseStudyPage from './pages/CaseStudyPage'

// Route table (ROUTES.md). The original is a multi-page Webflow site: every internal link is a
// full page load, so the clone keeps plain <a href> links and picks the page from the URL at
// load time instead of using client-side navigation. `family` is the IA template family.
// Detail routes take their slug from the path; unknown slugs fall through to NotFound.
// Shell flags (specs/*.md §1 "shell differences"; defaults = homepage shell):
//   footer: 'full' (FooterTop + FooterBottom) | 'bottom' (FooterBottom only, /book-a-demo)
//   modal: render the Call Alex popup (homepage + /compare only)
//   preloader: render `.preloader-wrap` for the load intro (/compare, legal, blog, case studies)
//   video: render the shell background video in PageLayers (noise + solid bg always render).
//     Blog/case-study detail pages have no visible video on live (specs/blog.md §1).
// `exists` (detail routes) sends unknown slugs to not-found.
// `title` is a string or a function of the route params (detail pages set theirs from content).
const SHELL = { footer: 'full', modal: false, preloader: false, video: true }
export const ROUTES = [
  { ...SHELL, modal: true, family: 'home', match: /^\/$/, title: 'Transform9 — Maximize Every Call with a Custom AI Agent', page: (params) => <HomePage /> },
  { ...SHELL, modal: true, preloader: true, family: 'compare', match: /^\/compare$/, title: 'Compare', page: (params) => <ComparePage params={params} /> },
  { ...SHELL, footer: 'bottom', family: 'book-a-demo', match: /^\/book-a-demo$/, title: 'Book a Demo', page: (params) => <BookDemoPage params={params} /> },
  { ...SHELL, preloader: true, family: 'blog-index', match: /^\/blog$/, title: 'Blog', page: (params) => <BlogIndexPage params={params} /> },
  { ...SHELL, preloader: true, video: false, exists: ([slug]) => !!getPost(slug), family: 'blog-post', match: /^\/blog\/([^/]+)$/, title: 'Blog', page: (params) => <BlogPostPage params={params} /> },
  { ...SHELL, preloader: true, family: 'case-studies-index', match: /^\/case-studies$/, title: 'Case Studies', page: (params) => <CaseStudiesIndexPage params={params} /> },
  { ...SHELL, preloader: true, video: false, exists: ([slug]) => !!getCaseStudy(slug), family: 'case-study', match: /^\/case-studies\/([^/]+)$/, title: 'Case Studies', page: (params) => <CaseStudyPage params={params} /> },
  { ...SHELL, preloader: true, family: 'legal', match: /^\/(terms-of-use|privacy-policy|hipaa)$/, title: ([slug]) => ({ 'terms-of-use': 'Terms of Use', 'privacy-policy': 'Privacy Policy', hipaa: 'HIPAA' })[slug], page: (params) => <LegalPage params={params} /> },
]

export function resolveRoute(pathname) {
  const path = pathname.replace(/\/+$/, '') || '/'
  for (const r of ROUTES) {
    const m = path.match(r.match)
    if (m && (!r.exists || r.exists(m.slice(1)))) return { ...r, params: m.slice(1) }
  }
  return { ...SHELL, family: 'not-found', title: 'Page Not Found', params: [], page: (params) => <PageStub family="not-found" /> }
}

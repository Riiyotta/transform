import HomePage from './pages/HomePage'
import PageStub from './pages/PageStub'

// Route table (ROUTES.md). The original is a multi-page Webflow site: every internal link is a
// full page load, so the clone keeps plain <a href> links and picks the page from the URL at
// load time instead of using client-side navigation. `family` is the IA template family.
// Detail routes take their slug from the path; unknown slugs fall through to NotFound.
export const ROUTES = [
  { family: 'home', match: /^\/$/, title: 'Transform9 — Maximize Every Call with a Custom AI Agent', page: () => <HomePage /> },
  { family: 'compare', match: /^\/compare$/, title: 'Compare', page: () => <PageStub family="compare" /> },
  { family: 'book-a-demo', match: /^\/book-a-demo$/, title: 'Book a Demo', page: () => <PageStub family="book-a-demo" /> },
  { family: 'blog-index', match: /^\/blog$/, title: 'Blog', page: () => <PageStub family="blog-index" /> },
  { family: 'blog-post', match: /^\/blog\/([^/]+)$/, title: 'Blog', page: () => <PageStub family="blog-post" /> },
  { family: 'case-studies-index', match: /^\/case-studies$/, title: 'Case Studies', page: () => <PageStub family="case-studies-index" /> },
  { family: 'case-study', match: /^\/case-studies\/([^/]+)$/, title: 'Case Studies', page: () => <PageStub family="case-study" /> },
  { family: 'legal', match: /^\/(terms-of-use|privacy-policy|hipaa)$/, title: 'Legal', page: () => <PageStub family="legal" /> },
]

export function resolveRoute(pathname) {
  const path = pathname.replace(/\/+$/, '') || '/'
  for (const r of ROUTES) {
    const m = path.match(r.match)
    if (m) return { ...r, params: m.slice(1) }
  }
  return { family: 'not-found', title: 'Page Not Found', params: [], page: () => <PageStub family="not-found" /> }
}

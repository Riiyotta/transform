import { useLayoutEffect } from 'react'
import Navbar from './components/Navbar'
import CallAlexModal from './components/CallAlexModal'
import PageLayers from './components/PageLayers'
import Preloader from './components/Preloader'
import { FooterBottom, FooterTop } from './components/Footer'
import { SiteProvider } from './components/ui/SiteContext'
import { useSmoothScroll } from './motion/smoothScroll'
import { usePageIntro } from './motion/pageIntro'
import { resolveRoute } from './routes'

const route = resolveRoute(window.location.pathname)

// Page shell — CLONE_SPEC §2: body > .nav-menu, .modal-wrap, .page-wrap (z 2),
// .footer-bottom-wrap (z 1, sticky reveal). The page inside .page-wrap comes from the route
// table (src/routes.jsx), which also sets the per-route shell flags (footer variant, popup,
// preloader). `data-page` on <html> names the template family for QA and IA.
export default function App() {
  // M22: Lenis smooth scroll + ScrollTrigger sync/refresh (src/motion/smoothScroll.js).
  useSmoothScroll()
  // CMP-M1 / BAD-M1 / LGL-M1 / BLOG-M1..M4: page-load intro, started on mount (D11). No-op on home.
  usePageIntro(route.family)
  useLayoutEffect(() => {
    document.title = typeof route.title === 'function' ? route.title(route.params) : route.title
    document.documentElement.dataset.page = route.family
  }, [])
  return (
    <SiteProvider>
      <Navbar />
      {route.preloader && <Preloader />}
      {route.modal && <CallAlexModal />}
      <div className="page-wrap">
        <PageLayers video={route.video} />
        {route.page(route.params)}
        {route.footer === 'full' && <FooterTop />}
      </div>
      <FooterBottom />
    </SiteProvider>
  )
}

import { useLayoutEffect } from 'react'
import Navbar from './components/Navbar'
import CallAlexModal from './components/CallAlexModal'
import { FooterBottom, FooterTop } from './components/Footer'
import { SiteProvider } from './components/ui/SiteContext'
import { useSmoothScroll } from './motion/smoothScroll'
import { resolveRoute } from './routes'

const route = resolveRoute(window.location.pathname)

// Page shell — CLONE_SPEC §2: body > .nav-menu, .modal-wrap, .page-wrap (z 2),
// .footer-bottom-wrap (z 1, sticky reveal). The page inside .page-wrap comes from the route
// table (src/routes.jsx); `data-page` on <html> names the template family for QA and IA.
export default function App() {
  // M22: Lenis smooth scroll + ScrollTrigger sync/refresh (src/motion/smoothScroll.js).
  useSmoothScroll()
  useLayoutEffect(() => {
    document.title = route.title
    document.documentElement.dataset.page = route.family
  }, [])
  return (
    <SiteProvider>
      <Navbar />
      <CallAlexModal />
      <div className="page-wrap">
        {route.page(route.params)}
        <FooterTop />
      </div>
      <FooterBottom />
    </SiteProvider>
  )
}

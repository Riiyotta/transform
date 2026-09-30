import Navbar from './components/Navbar'
import CallAlexModal from './components/CallAlexModal'
import PageLayers from './components/PageLayers'
import Hero from './components/Hero'
import ClientLogos from './components/ClientLogos'
import ClientSpotlight from './components/ClientSpotlight'
import Stats from './components/Stats'
import Testimonials from './components/Testimonials'
import HowItWorks from './components/HowItWorks'
import WhiteSection from './components/WhiteSection'
import TransitionPixels from './components/TransitionPixels'
import Specialties from './components/Specialties'
import Integrations from './components/Integrations'
import Security from './components/Security'
import Cta from './components/Cta'
import { FooterBottom, FooterTop } from './components/Footer'
import { SiteProvider } from './components/ui/SiteContext'
import { useSmoothScroll } from './motion/smoothScroll'

// Page shell — CLONE_SPEC §2: body > .nav-menu, .modal-wrap, .page-wrap (z 2),
// .footer-bottom-wrap (z 1, sticky reveal). Section order follows CLONE_SPEC §1.6.
export default function App() {
  // M22: Lenis smooth scroll + ScrollTrigger sync/refresh (src/motion/smoothScroll.js).
  useSmoothScroll()
  return (
    <SiteProvider>
      <Navbar />
      <CallAlexModal />
      <div className="page-wrap">
        <PageLayers />
        <Hero />
        <ClientLogos />
        <ClientSpotlight />
        <Stats />
        <Testimonials />
        <HowItWorks />
        <WhiteSection />
        <TransitionPixels variant="white-to-black" />
        <Specialties />
        <Integrations />
        <Security />
        <Cta />
        <FooterTop />
      </div>
      <FooterBottom />
    </SiteProvider>
  )
}

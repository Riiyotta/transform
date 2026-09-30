import Navbar from './components/Navbar'
import CallAlexModal from './components/CallAlexModal'
import PageLayers from './components/PageLayers'
import Hero from './components/Hero'
import ClientLogos from './components/ClientLogos'
import ClientSpotlight from './components/ClientSpotlight'
import Stats from './components/Stats'
import { FooterBottom, FooterTop } from './components/Footer'
import { SiteProvider } from './components/ui/SiteContext'

// Page shell — CLONE_SPEC §2: body > .nav-menu, .modal-wrap, .page-wrap (z 2),
// .footer-bottom-wrap (z 1, sticky reveal).
//
// SECTION STUBS: sections 5–12 are placeholders owned by later builders. Each keeps its
// final `data-section` id and DOM order; min-heights are the measured 1440px heights
// (CLONE_SPEC §1.6, incl. inter-section margins) converted to vw so page length and
// the footer reveal are roughly right at every width. Replace a stub with its own
// component file; do not reorder.
const STUBS = [
  { id: 'testimonials', minHeight: '77.74vw' }, // section.testimonials#testimonials
  { id: 'how-it-works', minHeight: '158.19vw' }, // section.how-it-works
  // section.white-section (7a black-to-white, 7b scheduling, 7c tasking, 7d navigator,
  // 7e outreach live inside it). Its bounds drive the navbar on-white state (M4).
  { id: 'white-section', minHeight: '921.25vw', white: true },
  { id: 'transition-white-to-black', minHeight: '25vw' }, // div.transition-cont.white-to-black
  { id: 'specialties', minHeight: '78.19vw' }, // section.specialty-section#specialties
  { id: 'integrations', minHeight: '72.5vw' }, // section.integration-section#integrations
  { id: 'security', minHeight: '68.54vw' }, // section.secure-section#security
  { id: 'cta', minHeight: '104.583vw' }, // section.cta-section
]

function SectionStub({ id, minHeight, white }) {
  return (
    <section
      data-section={id}
      data-stub="true"
      className={white ? 'section-stub section-stub--white' : 'section-stub'}
      style={{ minHeight }}
    />
  )
}

export default function App() {
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
        {STUBS.map((stub) => (
          <SectionStub key={stub.id} {...stub} />
        ))}
        <FooterTop />
      </div>
      <FooterBottom />
    </SiteProvider>
  )
}

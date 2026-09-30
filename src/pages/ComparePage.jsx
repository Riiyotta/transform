import '../styles/page-compare.css'
import BgPixelsOverlay from '../components/compare/BgPixelsOverlay'
import CompareHero from '../components/compare/CompareHero'
import GenericSection from '../components/compare/GenericSection'
import ComparisonTable from '../components/compare/ComparisonTable'
import AccessSection from '../components/compare/AccessSection'
import CompareWhiteSection from '../components/compare/CompareWhiteSection'
import PrivacySection from '../components/compare/PrivacySection'
import EvSection from '../components/compare/EvSection'
import TransitionPixels from '../components/TransitionPixels'
import Cta from '../components/Cta'

// /compare — specs/compare.md §1 section order. Shell (nav, preloader, popup, PageLayers,
// footer) comes from App via the route flags (modal + preloader + full footer).
export default function ComparePage() {
  return (
    <>
      <BgPixelsOverlay />
      <CompareHero />
      <GenericSection />
      <ComparisonTable />
      <AccessSection />
      <CompareWhiteSection />
      {/* MOTION: M8b — pixel transition (owned by TransitionPixels). */}
      <TransitionPixels variant="white-to-black" />
      <PrivacySection />
      <EvSection />
      {/* §9: identical to homepage §15 (Call Alex opens the popup; M8c, M11, M12). */}
      <Cta />
    </>
  )
}

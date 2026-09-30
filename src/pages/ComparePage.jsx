import '../styles/page-compare.css'
import { useLayoutEffect } from 'react'
import { gsap } from '../motion/gsap'
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
// Live drives the integration marquees with GSAP (IX3), so its ticker never sleeps and an
// IX2 hover tween renders its first frame in the frame of the event. The clone's marquees are
// CSS, so GSAP's ticker idles and would wake one frame late (measured: CMP-M3 "in" 1 frame
// behind live). A no-op ticker listener on this page restores the live frame timing for the
// CMP-M2 / CMP-M3 hovers (recon/motion-3/hover-*.json).
function useAwakeTicker() {
  useLayoutEffect(() => {
    const noop = () => {}
    gsap.ticker.add(noop)
    return () => gsap.ticker.remove(noop)
  }, [])
}

export default function ComparePage() {
  useAwakeTicker()
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

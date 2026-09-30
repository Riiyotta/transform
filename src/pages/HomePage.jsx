import Hero from '../components/Hero'
import ClientLogos from '../components/ClientLogos'
import ClientSpotlight from '../components/ClientSpotlight'
import Stats from '../components/Stats'
import Testimonials from '../components/Testimonials'
import HowItWorks from '../components/HowItWorks'
import WhiteSection from '../components/WhiteSection'
import TransitionPixels from '../components/TransitionPixels'
import Specialties from '../components/Specialties'
import Integrations from '../components/Integrations'
import Security from '../components/Security'
import Cta from '../components/Cta'

// Homepage `/` — section order follows CLONE_SPEC §1.6.
export default function HomePage() {
  return (
    <>
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
    </>
  )
}

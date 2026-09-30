import '../styles/page-legal.css'
import LegalHero from '../components/legal/LegalHero'
import LegalContent from '../components/legal/LegalContent'
import termsOfUse from '../data/legal/termsOfUse'
import privacyPolicy from '../data/legal/privacyPolicy'
import hipaa from '../data/legal/hipaa'

// Legal template — specs/legal.md. One template, three content variants (/terms-of-use,
// /privacy-policy, /hipaa); `params[0]` is the slug captured by src/routes.jsx.
// Shell (routes.jsx flags): preloader, full footer, no popup.
// MOTION: LGL-M1 — page-load intro (IX3 i-eccee64b): .preloader-wrap 1 -> 0 (.1s), .bg-pixels-wrapper
// 0 -> 1 (.08s at .02), .nav-menu 0 -> 1 (1.2s expo.out at .1), .hero-bottom-block.full-width 0 -> 1
// (1.2s expo.out at .6), .line-hor.on-hero width 0 -> 100% (1.0s expo.out at .6). Start on mount.
const CONTENT = { 'terms-of-use': termsOfUse, 'privacy-policy': privacyPolicy, hipaa }

export default function LegalPage({ params }) {
  const content = CONTENT[params[0]]
  return (
    <>
      <LegalHero h1={content.h1} intro={content.intro} introVariant={content.introVariant} />
      <LegalContent blocks={content.blocks} />
    </>
  )
}

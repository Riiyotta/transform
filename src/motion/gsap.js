// Shared GSAP instance + plugins. Original runtime: GSAP 3.15 + ScrollTrigger (Webflow IX3).
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CustomEase } from 'gsap/CustomEase'

gsap.registerPlugin(ScrollTrigger, CustomEase)

// IX2 easing curves (CLONE_SPEC §18) as exact cubic-beziers.
export const IX2 = {
  easeOut: CustomEase.create('ix2-easeOut', '0,0,0.58,1'),
  outQuad: CustomEase.create('ix2-outQuad', '0.25,0.46,0.45,0.94'),
}

export { gsap, ScrollTrigger }

// Dev-only handle for the motion QA scripts (recon/motion-1). Not present in builds.
if (import.meta.env.DEV && typeof window !== 'undefined') {
  window.__motion = { gsap, ScrollTrigger }
}

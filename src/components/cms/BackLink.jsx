import { useLayoutEffect, useRef } from 'react'
import { CMS_ICONS } from '../../data/cms'
import { bindBackLinkHover } from './cmsHover'

// Back link — `a.icon-w-text` (specs/blog.md §4.2, specs/case-studies.md §4.2). Two stacked
// arrows in a 28px clip: `.back-1` in flow, `.back-2` absolute just outside the clip (left 28).
// Hover is tweened by bindBackLinkHover (cmsHover.js, matchMedia >=992).
// MOTION: BLOG-M8 — IX2 a-46 / a-47 (>=992): link opacity .5 -> 1, both arrows
//   translateX(0 -> -100%) = -28px, 300ms outQuad; out reverses (300ms outQuad).
export default function BackLink({ href, text }) {
  const ref = useRef(null)
  useLayoutEffect(() => bindBackLinkHover(ref.current), [])
  return (
    <a ref={ref} href={href} className="icon-w-text" data-component="back-link">
      <div className="back-icon-wrap">
        <img src={CMS_ICONS.backArrow} loading="lazy" alt="" className="arrow white back-1" />
        <img src={CMS_ICONS.backArrow} loading="lazy" alt="" className="arrow white back-2" />
      </div>
      <div className="label-16">{text}</div>
    </a>
  )
}

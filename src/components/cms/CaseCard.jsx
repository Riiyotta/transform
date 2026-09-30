import { useLayoutEffect, useRef } from 'react'
import CaseVariant from './CaseVariant'
import { bindCaseCardHover } from './cmsHover'
import { CMS_ICONS, localAsset, localAssetVariant } from '../../data/cms'

// Case-study card — `div.blogs-item.cs > a.post-link-block.cs` (specs/case-studies.md §3.3).
// `readNext` renders the detail-page read-next variant (§4.4): the bottom is `.post-bottom-wrap`
// without `.cs` and the title is plain `._30px-text.white` (clone: `.rn-title`), and the logo
// imgs use sizes="100vw". Static rest state; hover is tweened by bindCaseCardHover (cmsHover.js).
// MOTION: CS-M1 — IX2 e-62 / e-63 -> a-52 / a-53 (mouseover / mouseout, all breakpoints):
//   group 1 (instant-ish): arrow -> 0, black logo -> 0 (500ms linear), img-wrap -> rgba(255,255,255,.01);
//   group 2 (300ms outQuad): .post-img-wrap.cs bg -> #f1f3f3, .cl-wh-logo-on-cell opacity -> 0,
//   .cl-bl-logo-on-cell -> 1, .post-bottom-wrap bg -> #fff, title / stat numbers / .blog-point.cs /
//   .highlight-text-alt -> #020801, .testim-point-wrap.blog.cs border-left -> #0033cc, arrow -> 1.
//   Out reverses (logo swap 300ms outQuad; bottom bg -> rgba(255,255,255,0)).
function Logo({ url, className, sizes }) {
  return (
    <img
      src={localAsset(url)}
      srcSet={`${localAssetVariant(url, '-p-500')} 500w, ${localAsset(url)} 780w`}
      sizes={sizes}
      loading="lazy"
      alt=""
      className={className}
    />
  )
}

export default function CaseCard({ item, readNext = false }) {
  const ref = useRef(null)
  useLayoutEffect(() => bindCaseCardHover(ref.current), [])
  const sizes = readNext ? '100vw' : '(max-width: 991px) 100vw, 780px'
  return (
    <div className="blogs-item cs" role="listitem">
      <a ref={ref} href={item.href} className="post-link-block cs" data-component="case-card">
        <div className="post-img-wrap cs">
          <Logo url={item.logoWhite} className="cl-wh-logo-on-cell" sizes={sizes} />
          <Logo url={item.logoBlack} className="cl-bl-logo-on-cell" sizes={sizes} />
        </div>
        <div className={readNext ? 'post-bottom-wrap' : 'post-bottom-wrap cs'}>
          <div className={readNext ? 'rn-title' : 'cs-title'}>{item.title}</div>
          <div className="post-arrow-wrap">
            <img src={CMS_ICONS.cardArrow} loading="lazy" alt="" className="arrow white post-arrow" />
          </div>
          <CaseVariant highlight={item.highlight} stats={item.stats} />
        </div>
      </a>
    </div>
  )
}

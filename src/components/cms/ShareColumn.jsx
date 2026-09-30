import { localAsset } from '../../data/cms'

// Share column — `div.left-sticky-wrap > div.left-sticky-block` (specs/blog.md §4.3).
// Absolute rail column with a sticky block at >=992; at <=991 it becomes a relative full-width
// block after the body (it is already after `.post-body-wrap` in the DOM).
// D13: the icons are inert (live uses the stripped Finsweet social-share script); they keep
// href="#" for parity, and clicks are swallowed so the URL/scroll never changes.
// MOTION: BLOG-M9 — share icon opacity .5 -> 1 on hover: CSS transition .3s
//   cubic-bezier(.25,.46,.45,.94) from the original stylesheet (cms.css).
// MOTION: BLOG-M10 — .left-sticky-block position:sticky; top:60px (CSS, >=992).
const ALT = { x: 'X logo', facebook: 'Facebook logo', linkedin: 'LinkedIn logo' }
const inert = (e) => e.preventDefault()

export default function ShareColumn({ label, share }) {
  return (
    <div className="left-sticky-wrap" data-component="share-column">
      <div className="left-sticky-block">
        <div className="label-16 share-post">{label}</div>
        <div className="share-links">
          {share.map((s) => (
            <a key={s.network} href={s.href} className="share-link-block" data-network={s.network} onClick={inert}>
              <img src={localAsset(s.icon)} loading="lazy" alt={ALT[s.network]} className="share-icon" />
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

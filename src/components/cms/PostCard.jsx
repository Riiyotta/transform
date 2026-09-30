import { useLayoutEffect, useRef } from 'react'
import Noise from '../ui/Noise'
import { bindPostCardHover } from './cmsHover'
import { CMS_ICONS, localAsset } from '../../data/cms'

// Blog index card — `div.blogs-item > a.post-link-block.bl` (specs/blog.md §3.3).
// Static rest state. Hover is tweened by bindPostCardHover (cmsHover.js); the CSS END state in
// cms.css only applies when unbound.
// MOTION: BLOG-M6 — IX2 a-48 / a-49 (mouseover / mouseout, 300ms outQuad, all breakpoints):
//   over: .post-bottom-wrap bg -> #fff; .blog-title + .blog-data colour -> #020801;
//         .testim-point-wrap.post-cell border-left -> #0033cc; .post-img-hor scale -> 1.1;
//         .post-arrow-wrap opacity -> 1.
//   out:  bg -> rgba(255,255,255,0), text -> #fff, rule -> #a2fa8e, image scale -> 1.01 (not 1),
//         arrow -> 0. Also bound on cards appended by Load More (each card binds on mount).
export default function PostCard({ post }) {
  const ref = useRef(null)
  useLayoutEffect(() => bindPostCardHover(ref.current), [])
  return (
    <div className="blogs-item" role="listitem">
      <a ref={ref} href={post.href} className="post-link-block bl" data-component="post-card">
        <div className="post-img-wrap">
          <div className="post-img-hor" style={{ backgroundImage: `url("${localAsset(post.image)}")` }} />
          <Noise className="stat-img" />
        </div>
        <div className="post-bottom-wrap">
          <div className="blog-title">{post.title}</div>
          <div className="post-bottom-line-wrap">
            {post.meta.map((text, i) => (
              <div key={i} className="testim-point-wrap blog post-cell">
                <div className="text-14-white blog-data">{text}</div>
              </div>
            ))}
          </div>
          <div className="post-arrow-wrap">
            <img src={CMS_ICONS.cardArrow} loading="lazy" alt="" className="arrow white post-arrow" />
          </div>
        </div>
      </a>
    </div>
  )
}

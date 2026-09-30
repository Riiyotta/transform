import { useLayoutEffect, useRef } from 'react'
import Noise from '../ui/Noise'
import { bindFeaturedHover } from './cmsHover'
import UnderlinePair from '../ui/UnderlinePair'
import MetaPoints from './MetaPoints'
import { localAsset } from '../../data/cms'

// Featured post (blog index hero) — `div.featured-post > … > a.post-hor-wrap.featured`
// (specs/blog.md §3.2). Newest post; full-bleed row (column at <=767).
// MOTION: BLOG-M2 — .featured-post opacity 0 -> 1 (1.2s expo.out, t 0.1) on load.
// MOTION: BLOG-M7 — IX2 a-50 / a-51: .blog-img-vert scale 1 -> 1.1 on mouseover, -> 1 on
//   mouseout (300ms outQuad, all breakpoints), bindFeaturedHover (cmsHover.js).
// MOTION: M12 — "Read Article" underline pair runs only while the pointer is over the
//   underline element itself (UnderlinePair binds its own parent), not on card hover.
export default function FeaturedPost({ post }) {
  const ref = useRef(null)
  useLayoutEffect(() => bindFeaturedHover(ref.current), [])
  return (
    <div className="featured-post" data-component="featured-post">
      <div className="featured-list" role="list">
        <div className="featured-item" role="listitem">
          <a ref={ref} href={post.href} className="post-hor-wrap featured">
            <div className="post-img-vert-wrap">
              <div className="blog-img-vert" style={{ backgroundImage: `url("${localAsset(post.image)}")` }} />
              <Noise className="stat-img" />
            </div>
            <div className="blog-header-right featured">
              <Noise />
              <h2 className="text-56 featured-head">{post.title}</h2>
              <div className="featured-bottom">
                <MetaPoints items={post.meta} />
                <div className="w-underline-link featured has-underline">
                  <div>Read Article</div>
                  <UnderlinePair />
                </div>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  )
}

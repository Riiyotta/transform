import { useState } from 'react'
import '../components/cms/cms.css'
import '../styles/page-blog-index.css'
import IndexHero from '../components/cms/IndexHero'
import FeaturedPost from '../components/cms/FeaturedPost'
import ListSection from '../components/cms/ListSection'
import PostCard from '../components/cms/PostCard'
import UnderlinePair from '../components/ui/UnderlinePair'
import Cta from '../components/Cta'
import { blogIndex } from '../data/cms'

// /blog — specs/blog.md §3. Shell (routes.jsx): preloader, background video (M3b fade on the
// hero), full footer, no popup. `/blog?523ae0d4_page=2` renders this same page (D14).
// MOTION: BLOG-M1..M4 — load intro (preloader out, nav/featured/list fade in, H1 words, bg video in),
//   started on mount (D11). No animation on Load More append.
function Pagination({ loaded, onLoadMore }) {
  return (
    <div className="w-pagination-wrapper pagination" role="navigation" aria-label="List">
      <div className="label-16 blogs-descr">{blogIndex.description}</div>
      {!loaded && (
        // Finsweet fs-list-load="more": appends page-2 items in place, then the link is hidden.
        // No fetch: the data is local. The href is kept for parity; the click is handled here.
        // MOTION: M12 — underline pair hover.
        <a
          href={blogIndex.loadMore.href}
          aria-label={blogIndex.loadMore.aria}
          className="w-pagination-next w-underline-link load-more has-underline"
          data-component="load-more"
          onClick={onLoadMore}
        >
          <div>{blogIndex.loadMore.text}</div>
          <UnderlinePair />
        </a>
      )}
    </div>
  )
}

export default function BlogIndexPage() {
  const [loaded, setLoaded] = useState(false)
  const posts = loaded ? [...blogIndex.page1, ...blogIndex.page2] : blogIndex.page1
  const loadMore = (e) => {
    e.preventDefault()
    setLoaded(true)
  }
  return (
    <>
      <IndexHero heading={blogIndex.heroHeading}>
        <FeaturedPost post={blogIndex.featured} />
      </IndexHero>
      <ListSection
        id="all-articles"
        heading={blogIndex.listHeading}
        label={blogIndex.leftLabel}
        footer={<Pagination loaded={loaded} onLoadMore={loadMore} />}
      >
        {posts.map((post) => (
          <PostCard key={post.href} post={post} />
        ))}
      </ListSection>
      <Cta />
    </>
  )
}

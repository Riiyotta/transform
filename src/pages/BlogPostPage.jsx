import '../components/cms/cms.css'
import '../styles/page-blog-post.css'
import DetailHeader from '../components/cms/DetailHeader'
import MetaPoints from '../components/cms/MetaPoints'
import PostBody from '../components/cms/PostBody'
import useDocumentTitle from '../components/cms/useDocumentTitle'
import Noise from '../components/ui/Noise'
import Cta from '../components/Cta'
import { getPost, localAsset } from '../data/cms'

// /blog/<slug> — specs/blog.md §4. One template for all 8 posts; data-driven title, hero image,
// author/date and 1–5 rich-text slots. The read-next section is display:none on live and is not
// rendered (data: post.readNext). Unknown slug -> nothing page-specific (NotFound is the router's).
// MOTION: BLOG-M1, M2, M5 — load intro started on mount (D11).
export default function BlogPostPage({ params }) {
  const post = getPost(params[0])
  useDocumentTitle(post?.meta.title)
  if (!post) return null
  return (
    <>
      <DetailHeader
        media={
          <div className="post-img-vert-wrap blog-post">
            <div className="blog-img-vert" style={{ backgroundImage: `url("${localAsset(post.heroImage)}")` }} />
            <Noise className="stat-img" />
          </div>
        }
        backLink={post.backLink}
        title={post.title}
        bottom={<MetaPoints items={[post.author, post.date]} openPage />}
      />
      <PostBody entry={post} />
      <Cta />
    </>
  )
}

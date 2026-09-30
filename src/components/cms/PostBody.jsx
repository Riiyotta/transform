import Noise from '../ui/Noise'
import RichTextSlot from './RichText'
import ShareColumn from './ShareColumn'
import { bodySlots } from '../../data/cms'

// Post body — `section.post-body-section` (specs/blog.md §4.3–§4.4). Up to 5 rich-text slots
// (only visible ones rendered) + the share column. The hidden style-guide block
// (`.rich-text-post.example-for-edit`, with its Twitter/YouTube embeds) is not rendered (D15).
// MOTION: BLOG-M2 — .post-body-section opacity 0 -> 1 (1.2s expo.out, t 0.1) on load.
export default function PostBody({ entry }) {
  return (
    <section className="post-body-section" data-section="post-body">
      <Noise />
      <div className="post-body-wrap">
        {bodySlots(entry).map((s) => (
          <RichTextSlot key={s.slot} slot={s.slot} blocks={s.blocks} />
        ))}
      </div>
      <ShareColumn label={entry.shareLabel} share={entry.share} />
    </section>
  )
}

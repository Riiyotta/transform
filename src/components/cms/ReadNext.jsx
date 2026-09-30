import CaseCard from './CaseCard'

// Read-next — `section.read-next-section.read-next` (specs/case-studies.md §4.4). Visible on
// case studies only; the blog-post read-next is `display:none` on live and is not rendered
// (its data stays in content/blog/<slug>.json → readNext).
// Card hover: CS-M1 (see CaseCard).
export default function ReadNext({ readNext }) {
  return (
    <section className="read-next-section read-next" data-section="read-next">
      <div className="post-right-side">
        <div className="right-side-head-wrap">
          <div className="label-16">{readNext.eyebrow}</div>
          <div className="text-56 right-side-heading">{readNext.heading}</div>
        </div>
        <div className="posts-wrap read-next cs">
          <div className="blogs-wrapper cs">
            <div className="blogs-list cs" role="list" data-component="card-list">
              {readNext.items.map((item) => (
                <CaseCard key={item.href} item={item} readNext />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

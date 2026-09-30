// Author / date cells — `div.testim-bottom-cont.blog` with two `.testim-point-wrap.blog`
// (1px green left rule). Used by the featured post (index) and the post header (`openPage`).
// specs/blog.md §3.2, §4.2.
export default function MetaPoints({ items, openPage = false }) {
  return (
    <div className={`testim-bottom-cont blog${openPage ? ' open-page' : ''}`} data-component="meta-points">
      {items.map((text, i) => (
        <div key={i} className="testim-point-wrap blog">
          <div className="label-16 blog-point">{text}</div>
        </div>
      ))}
    </div>
  )
}

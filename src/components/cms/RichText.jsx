// Rich-text renderer for CMS body blocks (specs/blog.md §4.4, §7).
// Block schema: {type: h1|h2|h3|p|ul|ol|blockquote, inlines[] | items[{inlines[]}], spacer?}.
// Inline runs: {text, bold?, italic?, link?{href, target?, rel?}, br?}. Text is rendered
// verbatim (curly quotes, ZWJ spacer paragraphs, source typos). Styles: cms.css RICH TEXT.

function Inline({ run }) {
  if (run.br) return <br />
  let node = run.text
  if (run.link) {
    node = (
      <a href={run.link.href} target={run.link.target} rel={run.link.rel}>
        {node}
      </a>
    )
  }
  if (run.italic) node = <em>{node}</em>
  if (run.bold) node = <strong>{node}</strong>
  return node
}

function Inlines({ runs }) {
  return runs.map((run, i) => <Inline key={i} run={run} />)
}

function Block({ block }) {
  switch (block.type) {
    case 'h1':
    case 'h2':
    case 'h3':
    case 'p':
    case 'blockquote': {
      const Tag = block.type
      return (
        <Tag>
          <Inlines runs={block.inlines} />
        </Tag>
      )
    }
    case 'ul':
    case 'ol': {
      const Tag = block.type
      return (
        <Tag>
          {block.items.map((item, i) => (
            <li key={i}>
              <Inlines runs={item.inlines} />
            </li>
          ))}
        </Tag>
      )
    }
    default:
      return null
  }
}

// One `.post-block-wrap` slot: `1st` has no top hairline, every later slot (`bl-2`…`bl-5`)
// starts with the full-width 1px hairline of `.rich-text-post`.
export default function RichTextSlot({ slot, blocks }) {
  const first = slot === '1st'
  return (
    <div className={first ? 'post-block-wrap' : `post-block-wrap ${slot}`} data-slot={slot}>
      <div className={`rich-text-post${first ? ' _1st' : ''} w-richtext`} data-component="rich-text">
        {blocks.map((block, i) => (
          <Block key={i} block={block} />
        ))}
      </div>
    </div>
  )
}

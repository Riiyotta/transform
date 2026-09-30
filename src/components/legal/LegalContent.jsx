import { Fragment } from 'react'

// Legal content — specs/legal.md §4. Renders the structured blocks from src/data/legal/*.js.
// Nesting follows the source exactly: a block is an optional h2, then `.legal-text-wrap`
// groups (p / ul siblings, gap 24), green sub-heads and loose paragraphs as direct children
// (gap 30). Paragraph breaks are the source <br>s. No entrance motion on this section.

// A line is a string or an array of strings and links. Links are `a.link-transp`;
// target=_blank links get rel="noopener" (DEVIATIONS D6 pattern).
function Inline({ line }) {
  if (typeof line === 'string') return line
  return line.map((seg, i) =>
    typeof seg === 'string' ? (
      seg
    ) : (
      <a
        key={i}
        href={seg.href}
        className="link-transp"
        data-component="legal-link"
        {...(seg.target ? { target: seg.target, rel: 'noopener' } : {})}
      >
        {seg.text}
      </a>
    ),
  )
}

function Lines({ lines }) {
  return lines.map((line, i) => (
    <Fragment key={i}>
      {i > 0 && <br />}
      <Inline line={line} />
    </Fragment>
  ))
}

// p._16px-text.white-text.transp
function Paragraph({ lines }) {
  return (
    <p className="label-16 transp">
      <Lines lines={lines} />
    </p>
  )
}

// ul.list-white.transp > li.list-item > p._16px-text.white-text.transp
function List({ items }) {
  return (
    <ul className="list-white transp">
      {items.map((lines, i) => (
        <li key={i} className="list-item">
          <Paragraph lines={lines} />
        </li>
      ))}
    </ul>
  )
}

function Item({ item }) {
  switch (item.type) {
    case 'wrap':
      return (
        <div className="legal-text-wrap">
          {item.items.map((child, i) =>
            child.type === 'list' ? <List key={i} items={child.items} /> : <Paragraph key={i} lines={child.lines} />,
          )}
        </div>
      )
    case 'green':
      return <p className="text-22-green">{item.text}</p>
    case 'p':
      return <Paragraph lines={item.lines} />
    default:
      return null
  }
}

function LegalBlock({ block }) {
  return (
    <div className={`legal-block${block.last ? ' last' : ''}`} data-component="legal-block">
      {block.h2 !== undefined && <h2 className="text-30 white">{block.h2}</h2>}
      {block.items.map((item, i) => (
        <Item key={i} item={item} />
      ))}
    </div>
  )
}

export default function LegalContent({ blocks }) {
  return (
    <section className="legal-section" data-section="legal-content">
      <div className="legal-cont">
        {blocks.map((block, i) => (
          <LegalBlock key={i} block={block} />
        ))}
      </div>
    </section>
  )
}

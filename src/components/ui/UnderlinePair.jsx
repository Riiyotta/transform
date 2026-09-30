// `.underline._1` (anchored right, 100%) + `.underline._2` (anchored left, 0%).
// The parent must be position:relative and carry `has-underline` for the hover state.
// MOTION: M12 — see the SHARED block in index.css.
export default function UnderlinePair({ black = false }) {
  const tone = black ? ' black' : ''
  return (
    <>
      <div className={`underline${tone} _1`} data-component="underline-pair" />
      <div className={`underline${tone} _2`} />
    </>
  )
}

import { useRef } from 'react'
import '../styles/transition-pixels.css'
import { createPixelTransition } from '../motion/pixelTransition'
import { useGsapContext } from '../motion/useGsapContext'
import Noise from './ui/Noise'

// Pixel-grid transition — CLONE_SPEC §10a (black-to-white) and §11 (white-to-black).
// 5 rows x 20 pixels per layer. DOM row order is top `_5` -> bottom `_1` (as in Webflow);
// pixels 10-19 of each row are `.mob-hide` (hidden at <=767, where pixels are 10vw).
//
// Layers:
//   black-to-white: `.transition-wrap.white` (z 2, white pixels) over `.transition-wrap.mix`
//                   (z 1, blue/green checker), plus `.right-side-w-line` and a `.bg-noise`.
//   white-to-black: `.transition-wrap.black` (black pixels, each with `.bg-noise.b-to-w`)
//                   over the same mix layer.
//
// Static render = the SETTLED end state (every pixel opacity 1), so the page reads
// correctly without motion.
// MOTION: M8a (black-to-white) / M8b (white-to-black) — src/motion/pixelTransition.js:
//   every `.pixel` is set to opacity 0 on mount, then scrubbed 0 -> 1 (instant flips) over
//   the container's scroll range ("clamp(top bottom)" -> "clamp(top -20%)", scrub 0):
//   row `_1` at timeline 0, `_2` .2, `_3` .4, `_4` .6, `_5` .8; inside each row (both
//   layers together) stagger {amount 1, from 'random', grid 'auto', axis 'x'}.
// Hooks: `[data-row]` (1-5, = Webflow `_N`), `[data-col]` (0-19), `[data-index]`
//   (deterministic per layer: (5 - row) * 20 + col, i.e. DOM order), `[data-layer]`.
const ROWS = [5, 4, 3, 2, 1]
const COLS = Array.from({ length: 20 }, (_, i) => i)
const MOB_VISIBLE = 10

function mixColor(row, col) {
  // Odd rows (_5, _3, _1) start blue; even rows (_4, _2) start green.
  const startBlue = row % 2 === 1
  return (col % 2 === 0) === startBlue ? 'blue' : 'green'
}

function Layer({ layer, rowSuffix }) {
  return (
    <div className={`transition-wrap ${layer}`} data-layer={layer}>
      {ROWS.map((row) => (
        <div key={row} className={`grid-row _${row} ${rowSuffix}`} data-row={row}>
          {COLS.map((col) => {
            const tone = layer === 'mix' ? ` ${mixColor(row, col)}` : layer === 'black' ? ' black' : ''
            const hide = col >= MOB_VISIBLE ? ' mob-hide' : ''
            return (
              <div
                key={col}
                className={`pixel${tone}${hide}`}
                data-row={row}
                data-col={col}
                data-index={(5 - row) * 20 + col}
              >
                {layer === 'black' && <Noise className="b-to-w" />}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}

// railLine: /compare's black-to-white transition has no `.right-side-w-line` (specs/compare.md §6).
export default function TransitionPixels({ variant, railLine = true }) {
  const toWhite = variant === 'black-to-white'
  const rowSuffix = toWhite ? 'b-w' : '_w-b'
  const ref = useRef(null)
  useGsapContext(ref, (el) => createPixelTransition(el, { from: 0, to: 1 }))
  return (
    <div
      ref={ref}
      data-section={`transition-${variant}`}
      data-component="transition-pixels"
      data-variant={variant}
      className={`transition-cont ${variant}`}
      aria-hidden="true"
    >
      <Layer layer={toWhite ? 'white' : 'black'} rowSuffix={rowSuffix} />
      <Layer layer="mix" rowSuffix={rowSuffix} />
      {toWhite && railLine && <div className="right-side-w-line" />}
      {toWhite && <Noise />}
    </div>
  )
}

import { useState } from 'react'
import { ASSETS } from '../data/assets'
import { STATS } from '../data/stats'
import Noise from './ui/Noise'

// Stats — CLONE_SPEC §7. Styles: STATS block in src/index.css.
// >=992: CSS :hover expands a block (flex-basis 16% -> 100%) and reveals its heading,
//        description and image (static end state; MOTION: M5).
// <=991: click accordion; block 1 is active on load (MOTION: M6). `.is-active` has no
//        effect at >=992.
export default function Stats() {
  const [active, setActive] = useState(0)

  return (
    <section className="stats" data-section="stats">
      <div className="stats-row">
        <div className="stats-left">
          <div className="stats-text">
            Proven Results. <span className="stats-span">Powerful Impact.</span>
          </div>
          <img src={ASSETS.statsGradient} loading="lazy" alt="" className="img-stats" />
        </div>
        <div className="stats-right">
          {STATS.map((stat, i) => (
            <div
              key={stat.index}
              className={`stats-block${stat.variant ? ` ${stat.variant}` : ''}${active === i ? ' is-active' : ''}`}
              onClick={() => setActive(i)}
            >
              <div className="text-14-white">{stat.index}</div>
              <div className="stats-bottom">
                <div className="stat-head-text-wrap">
                  <div className="stat-head">{stat.value}</div>
                </div>
                <div className="stat-descr-wrap">
                  <div className="stat-descr">{stat.label}</div>
                </div>
              </div>
              <div className="stats-img-wrap">
                <div className={`stats-img${stat.img ? ` ${stat.img}` : ''}`} />
                <Noise className="stat-img" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

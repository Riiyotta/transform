import { useState } from 'react'
import { ASSETS } from '../data/assets'

// Client Spotlight — CLONE_SPEC §6. Styles: CLIENT SPOTLIGHT block in src/index.css.
// YouTube facade: local thumbnail + play button; the youtube-nocookie iframe is only
// created after an explicit click / Enter / Space (no auto-load, no prefetch).
const VIDEO_ID = 'yG3PtcRGQLc'
const EMBED_SRC = `https://www.youtube-nocookie.com/embed/${VIDEO_ID}?autoplay=1&rel=0&controls=1&playsinline=1`

function PlayIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 330 330" fill="currentColor" aria-hidden="true">
      <path d="M37.728,328.12c2.266,1.256,4.77,1.88,7.272,1.88c2.763,0,5.522-0.763,7.95-2.28l240-149.999c4.386-2.741,7.05-7.548,7.05-12.72c0-5.172-2.664-9.979-7.05-12.72L52.95,2.28c-4.625-2.891-10.453-3.043-15.222-0.4C32.959,4.524,30,9.547,30,15v300C30,320.453,32.959,325.476,37.728,328.12z" />
    </svg>
  )
}

export default function ClientSpotlight() {
  const [playing, setPlaying] = useState(false)

  const play = () => setPlaying(true)
  const onKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      play()
    }
  }

  const facadeProps = playing
    ? {}
    : { tabIndex: 0, role: 'button', 'aria-label': 'Play video: Client Spotlight - Andrews Sports Medicine', onClick: play, onKeyDown }

  return (
    <div className="div-block-5" data-section="client-spotlight">
      <h2 className="hero-heading">
        Client Spotlight - <span className="text-span-14"><br />Andrews Sports Medicine</span>
      </h2>
      <div className="div-block-6">
        <figure className="yt-facade" data-video-id={VIDEO_ID} data-component="yt-facade" {...facadeProps}>
          {playing ? (
            <iframe
              src={EMBED_SRC}
              title="Client Spotlight - Andrews Sports Medicine"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <>
              <img src={ASSETS.ytThumb} alt="" loading="lazy" className="yt-facade__thumb" />
              <div aria-hidden="true" className="yt-facade__play">
                <div className="code-embed">
                  <PlayIcon />
                </div>
              </div>
            </>
          )}
        </figure>
      </div>
    </div>
  )
}

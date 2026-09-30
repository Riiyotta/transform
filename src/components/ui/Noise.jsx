// `.bg-noise` overlay (noise.webp tiled at 200px, opacity .5 / .3 at <=991).
export default function Noise({ className = '' }) {
  return <div className={`bg-noise${className ? ` ${className}` : ''}`} data-component="noise" aria-hidden="true" />
}

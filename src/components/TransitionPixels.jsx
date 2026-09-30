import '../styles/transition-pixels.css'

// STUB — pixel-grid transition used twice (CLONE_SPEC §10a black-to-white, §11 white-to-black).
// variant: 'black-to-white' | 'white-to-black'. Keep the data-section ids.
export default function TransitionPixels({ variant }) {
  return (
    <div
      data-section={`transition-${variant}`}
      data-stub="true"
      className={variant === 'black-to-white' ? 'section-stub section-stub--white' : 'section-stub'}
      style={{ minHeight: '25vw' }}
    />
  )
}

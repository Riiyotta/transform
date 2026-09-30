import Noise from '../ui/Noise'

// Detail-page background layers (specs/blog.md §1, `.page-wrap` children on posts/case studies).
// The route sets `layers: false` (no background video), which also drops the shell's fixed
// page noise and solid bg. Live detail pages keep both, so they are rendered here with the
// shell's own classes (index.css PAGE LAYERS). The invisible `.bg-pixels.test-size` /
// `.bg-pixels-overlay` (black on black, behind the solid bg) are omitted, as the spec allows.
// MOTION: BLOG-M5 — (optional, invisible) .bg-pixels 0 -> 1, .bg-pixels-overlay 1 -> 0.
export default function DetailLayers() {
  return (
    <>
      <div className="bg-noise-wrap" data-component="page-noise">
        <Noise />
      </div>
      <div className="page-wrap-solid-bg" />
    </>
  )
}

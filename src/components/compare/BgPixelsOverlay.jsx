// `.bg-pixels-overlay` (specs/compare.md §0): fixed, inset 0, 100vw x min 100dvh, z -2,
// bg #020801, pointer-events none. Rendered in its SETTLED state (opacity 0).
// DOM note: live places it inside .page-wrap between .bg-pixels-wrapper and
// .page-wrap-solid-bg; here it follows PageLayers (after .page-wrap-solid-bg). It paints
// after the video wrapper at the same z-index either way, so the result is identical.
// MOTION: CMP-M1 — the load intro sets opacity 1 and fades it 1 -> 0 (0.7s power1.out,
// timeline position 1.1s), dimming the hero video in.
export default function BgPixelsOverlay() {
  return <div className="bg-pixels-overlay" data-component="bg-pixels-overlay" aria-hidden="true" />
}

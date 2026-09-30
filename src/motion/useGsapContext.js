import { useLayoutEffect } from 'react'
import { gsap } from './gsap'

// Runs `setup(ctx)` inside a gsap.context scoped to `scopeRef.current` and reverts it on
// unmount (kills tweens + ScrollTriggers and restores inline styles), so StrictMode's
// double mount never leaves duplicate triggers behind.
export function useGsapContext(scopeRef, setup, deps = []) {
  useLayoutEffect(() => {
    const scope = scopeRef.current
    if (!scope) return undefined
    const ctx = gsap.context((self) => setup(scope, self), scope)
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

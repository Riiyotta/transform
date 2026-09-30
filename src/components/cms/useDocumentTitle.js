import { useEffect } from 'react'

// Detail pages take their <title> from content (specs/blog.md §0, specs/case-studies.md §0).
// useEffect (not layout effect) so it runs after App's route-title layout effect.
export default function useDocumentTitle(title) {
  useEffect(() => {
    if (title) document.title = title
  }, [title])
}

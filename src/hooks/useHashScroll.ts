import { useEffect } from 'react'

/**
 * Anchor links only work on first load if the target already exists, which it
 * never does in a client-rendered page — the browser resolves `#pricing`
 * before React has mounted anything. This re-runs the jump once the section
 * is actually in the document, so a shared deep link lands where it should.
 */
export function useHashScroll(ready: boolean) {
  useEffect(() => {
    if (!ready) return
    const id = window.location.hash.slice(1)
    if (!id) return

    let frame = 0
    let attempts = 0
    const tryScroll = () => {
      const el = document.getElementById(id)
      if (el) {
        el.scrollIntoView({ behavior: 'auto', block: 'start' })
        return
      }
      if (attempts++ < 40) frame = requestAnimationFrame(tryScroll)
    }
    frame = requestAnimationFrame(tryScroll)
    return () => cancelAnimationFrame(frame)
  }, [ready])
}

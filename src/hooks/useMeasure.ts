import { useEffect, useRef, useState } from 'react'

/**
 * Observes an element's box. Charts render at real pixel dimensions rather
 * than scaling a fixed viewBox, so stroke weights and type stay exact at
 * every breakpoint.
 */
export function useMeasure<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null)
  const [size, setSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      const box = entry.contentRect
      setSize((prev) =>
        Math.abs(prev.width - box.width) > 0.5 || Math.abs(prev.height - box.height) > 0.5
          ? { width: box.width, height: box.height }
          : prev,
      )
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return { ref, ...size }
}

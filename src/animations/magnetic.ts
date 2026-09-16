import { useEffect, useRef } from 'react'
import { useMotionValue, useSpring } from 'framer-motion'

/**
 * Magnetic pull: the element leans toward the cursor while it is nearby,
 * then springs back. Strength is capped so buttons never detach from their
 * hit area — the visual and the target stay in sync.
 */
export function useMagnetic<T extends HTMLElement>(strength = 0.35, disabled = false) {
  const ref = useRef<T>(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const x = useSpring(mx, { stiffness: 260, damping: 18, mass: 0.5 })
  const y = useSpring(my, { stiffness: 260, damping: 18, mass: 0.5 })

  useEffect(() => {
    const el = ref.current
    if (!el || disabled) return

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      const dx = e.clientX - (r.left + r.width / 2)
      const dy = e.clientY - (r.top + r.height / 2)
      const cap = Math.min(r.width, r.height) * 0.45
      mx.set(Math.max(-cap, Math.min(cap, dx * strength)))
      my.set(Math.max(-cap, Math.min(cap, dy * strength)))
    }
    const reset = () => { mx.set(0); my.set(0) }

    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', reset)
    el.addEventListener('blur', reset)
    return () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', reset)
      el.removeEventListener('blur', reset)
    }
  }, [strength, disabled, mx, my])

  return { ref, x, y }
}

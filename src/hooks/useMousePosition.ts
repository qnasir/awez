import { useEffect } from 'react'
import { useMotionValue, useSpring, type MotionValue } from 'framer-motion'

type Options = {
  /** Spring stiffness; lower = heavier, more cinematic follow. */
  stiffness?: number
  damping?: number
  /** Skip all listeners (touch devices, reduced motion). */
  disabled?: boolean
}

export type PointerField = {
  /** -0.5 .. 0.5 relative to the element centre. */
  x: MotionValue<number>
  y: MotionValue<number>
  /** 0 .. 1 relative to element box, for lighting positions. */
  px: MotionValue<number>
  py: MotionValue<number>
}

/**
 * Tracks the pointer relative to a ref'd element and exposes spring-smoothed
 * motion values. Listeners are attached to the element, not the window, and
 * all reads happen inside the pointer event (no layout thrash in rAF).
 */
export function usePointerField(
  ref: React.RefObject<HTMLElement | null>,
  { stiffness = 90, damping = 22, disabled = false }: Options = {},
): PointerField {
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const rawPX = useMotionValue(0.5)
  const rawPY = useMotionValue(0.5)

  const x = useSpring(rawX, { stiffness, damping, mass: 0.6 })
  const y = useSpring(rawY, { stiffness, damping, mass: 0.6 })
  const px = useSpring(rawPX, { stiffness: 140, damping: 26 })
  const py = useSpring(rawPY, { stiffness: 140, damping: 26 })

  useEffect(() => {
    const el = ref.current
    if (!el || disabled) return

    let rect = el.getBoundingClientRect()
    const measure = () => { rect = el.getBoundingClientRect() }

    const onMove = (e: PointerEvent) => {
      const nx = (e.clientX - rect.left) / rect.width
      const ny = (e.clientY - rect.top) / rect.height
      rawPX.set(nx)
      rawPY.set(ny)
      rawX.set(nx - 0.5)
      rawY.set(ny - 0.5)
    }
    const onLeave = () => {
      rawX.set(0); rawY.set(0); rawPX.set(0.5); rawPY.set(0.5)
    }

    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    window.addEventListener('resize', measure, { passive: true })
    window.addEventListener('scroll', measure, { passive: true })

    return () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('resize', measure)
      window.removeEventListener('scroll', measure)
    }
  }, [ref, disabled, rawX, rawY, rawPX, rawPY])

  return { x, y, px, py }
}

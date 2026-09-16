import { useEffect, useRef, useState } from 'react'
import { animate, useInView } from 'framer-motion'
import { useReducedMotion } from './useReducedMotion'

type Options = {
  from?: number
  duration?: number
  delay?: number
  /** Decimal places to retain while animating. */
  precision?: number
}

/**
 * Counts to `to` the first time the element enters the viewport.
 * Respects reduced motion by jumping straight to the final value —
 * the number is information, so it is never withheld.
 */
export function useCountUp(to: number, { from = 0, duration = 1.6, delay = 0, precision = 0 }: Options = {}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-15% 0px -15% 0px' })
  const reduced = useReducedMotion()
  // With motion off there is nothing to wait for, so the final value is the
  // first value. A number is content: it must never depend on a viewport
  // observer firing, or the tile sits there reading "0".
  const [value, setValue] = useState(reduced ? to : from)

  useEffect(() => {
    if (reduced) { setValue(to); return }
    if (!inView) return

    const factor = 10 ** precision
    const controls = animate(from, to, {
      duration,
      delay,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setValue(Math.round(v * factor) / factor),
    })
    return () => controls.stop()
  }, [inView, reduced, to, from, duration, delay, precision])

  return { ref, value, inView }
}

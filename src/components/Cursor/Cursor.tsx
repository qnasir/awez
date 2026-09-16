import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion'
import { useIsTouch } from '@/hooks/useMediaQuery'
import { useReducedMotion } from '@/hooks/useReducedMotion'

type Mode = { size: number; label: string | null }

const DEFAULT: Mode = { size: 32, label: null }

/**
 * A two-part cursor: an instant dot that tracks the pointer exactly, and a
 * lagging ring that gives the motion weight.
 *
 * Elements opt in by declaring `data-cursor="Explore"` — the ring grows and
 * carries that word. The native cursor is only hidden once this component is
 * actually mounted and moving, so a pointer is never lost.
 */
export function Cursor() {
  const isTouch = useIsTouch()
  const reduced = useReducedMotion()
  const disabled = isTouch || reduced

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const ringX = useSpring(x, { stiffness: 320, damping: 28, mass: 0.45 })
  const ringY = useSpring(y, { stiffness: 320, damping: 28, mass: 0.45 })

  const [mode, setMode] = useState<Mode>(DEFAULT)
  const [active, setActive] = useState(false)
  const [pressed, setPressed] = useState(false)

  useEffect(() => {
    if (disabled) return

    const onMove = (e: PointerEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
      if (!active) setActive(true)

      const el = (e.target as HTMLElement)?.closest<HTMLElement>('[data-cursor], a, button, [role="button"], input, textarea')
      if (!el) { setMode(DEFAULT); return }

      const label = el.dataset.cursor
      if (label && label !== 'link') setMode({ size: 78, label })
      else setMode({ size: 62, label: null })
    }

    const onDown = () => setPressed(true)
    const onUp = () => setPressed(false)
    const onLeave = () => setActive(false)

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)
    document.addEventListener('pointerleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      document.removeEventListener('pointerleave', onLeave)
    }
  }, [disabled, x, y, active])

  useEffect(() => {
    if (disabled || !active) return
    document.documentElement.style.cursor = 'none'
    return () => { document.documentElement.style.cursor = '' }
  }, [disabled, active])

  if (disabled) return null

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[150] hidden lg:block">
      {/* Lagging ring — size is animated rather than scaled, so the
          label inside stays at its true rendered size and never blurs. */}
      <motion.div
        className="absolute left-0 top-0 grid place-items-center rounded-full border backdrop-blur-[1px]"
        style={{ x: ringX, y: ringY, translateX: '-50%', translateY: '-50%' }}
        animate={{
          width: mode.size * (pressed ? 0.88 : 1),
          height: mode.size * (pressed ? 0.88 : 1),
          opacity: active ? 1 : 0,
          backgroundColor: mode.label ? 'rgba(199,240,72,0.95)' : 'rgba(255,255,255,0.045)',
          borderColor: mode.label ? 'rgba(199,240,72,0)' : 'rgba(255,255,255,0.32)',
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 32 }}
      >
        <AnimatePresence>
          {mode.label && (
            <motion.span
              key={mode.label}
              className="whitespace-nowrap font-mono text-[0.5rem] font-semibold uppercase tracking-[0.14em] text-volt-ink"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.18 }}
            >
              {mode.label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Exact dot */}
      <motion.div
        className="absolute left-0 top-0 h-1.5 w-1.5 rounded-full bg-chalk"
        style={{ x, y, translateX: '-50%', translateY: '-50%' }}
        animate={{ opacity: active && !mode.label ? 1 : 0, scale: pressed ? 0.6 : 1 }}
        transition={{ duration: 0.15 }}
      />
    </div>
  )
}

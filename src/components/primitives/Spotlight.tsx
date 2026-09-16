import { useRef, type ReactNode } from 'react'
import { motion, useMotionTemplate } from 'framer-motion'
import { usePointerField } from '@/hooks/useMousePosition'
import { useIsTouch } from '@/hooks/useMediaQuery'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { cn } from '@/lib/utils'

type Props = {
  children: ReactNode
  className?: string
  /** Radius of the light pool, in px. */
  radius?: number
  /** Light strength, 0–1. */
  intensity?: number
  /** Accent-tinted light instead of neutral white. */
  tint?: 'white' | 'volt'
}

/**
 * A soft light pool that follows the cursor across a surface.
 * Used on the hero and on card grids — never on text-only blocks,
 * where it would compete with the reading line.
 */
export function Spotlight({ children, className, radius = 480, intensity = 0.09, tint = 'white' }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const isTouch = useIsTouch()
  const reduced = useReducedMotion()
  const disabled = isTouch || reduced

  const { px, py } = usePointerField(ref, { disabled, stiffness: 160, damping: 28 })
  const rgb = tint === 'volt' ? '199,240,72' : '255,255,255'
  const background = useMotionTemplate`radial-gradient(${radius}px circle at calc(${px} * 100%) calc(${py} * 100%), rgba(${rgb},${intensity}), transparent 70%)`

  return (
    <div ref={ref} className={cn('relative', className)}>
      {!disabled && (
        <motion.div aria-hidden className="pointer-events-none absolute inset-0 z-0" style={{ background }} />
      )}
      {children}
    </div>
  )
}

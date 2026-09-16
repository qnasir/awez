import { useRef, type ReactNode } from 'react'
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion'
import { useIsTouch } from '@/hooks/useMediaQuery'
import { cn } from '@/lib/utils'

type Props = {
  children: ReactNode
  className?: string
  /** Lights the border where the cursor is, like a bevelled edge catching light. */
  interactive?: boolean
  as?: 'div' | 'article' | 'li'
}

/**
 * The site's standard layered surface: graphite fill, top edge highlight,
 * hairline border, and — when interactive — a border that lights up under
 * the cursor. This is the one card treatment; nothing else invents its own.
 */
export function Panel({ children, className, interactive = true, as: Tag = 'div' }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const isTouch = useIsTouch()
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const active = interactive && !isTouch

  const border = useMotionTemplate`radial-gradient(240px circle at ${mx}px ${my}px, rgba(199,240,72,0.35), transparent 65%)`
  const glow = useMotionTemplate`radial-gradient(360px circle at ${mx}px ${my}px, rgba(255,255,255,0.055), transparent 70%)`

  const MotionTag = motion[Tag]

  return (
    <MotionTag
      ref={ref as never}
      onPointerMove={
        active
          ? (e: React.PointerEvent) => {
              const r = (e.currentTarget as HTMLElement).getBoundingClientRect()
              mx.set(e.clientX - r.left)
              my.set(e.clientY - r.top)
            }
          : undefined
      }
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-line',
        'bg-[linear-gradient(180deg,rgba(255,255,255,0.035),rgba(255,255,255,0.006)_42%,transparent)] bg-carbon',
        // A 2px lift and a cast shadow: the card leaves the page rather than
        // merely changing colour, which is what makes a hover feel physical.
        'transition-[transform,border-color,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
        active && 'hover:-translate-y-0.5 hover:border-line-strong hover:shadow-[0_22px_50px_-28px_rgba(0,0,0,0.9)]',
        className,
      )}
    >
      {/* Top edge highlight */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent"
      />

      {active && (
        <>
          {/* Border lighting: a tinted layer masked to the 1px frame */}
          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{
              background: border,
              WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
              padding: 1,
            }}
          />
          {/* Interior glow */}
          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{ background: glow }}
          />
        </>
      )}

      <div className="relative z-10 h-full">{children}</div>
    </MotionTag>
  )
}

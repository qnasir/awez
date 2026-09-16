import { Children, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { useReducedMotion } from '@/hooks/useReducedMotion'

type Props = {
  children: ReactNode
  /** Seconds for one full pass. Higher = slower. */
  duration?: number
  reverse?: boolean
  className?: string
  /** Pause the belt when the pointer is anywhere over it. */
  pauseOnHover?: boolean
  gap?: string
}

/**
 * A CSS-driven infinite belt. The track is duplicated once and translated
 * by exactly -50%, so the loop is seamless at any width. Runs entirely on
 * the compositor — no JS ticks, no layout reads.
 */
export function Marquee({
  children,
  duration = 42,
  reverse = false,
  className,
  pauseOnHover = true,
  gap = '3.5rem',
}: Props) {
  const items = Children.toArray(children)
  const reduced = useReducedMotion()

  // A stopped belt is not a belt: frozen mid-translate it clips the first and
  // last items. Under reduced motion the same content becomes a centred,
  // wrapping list — everything readable, nothing moving.
  if (reduced) {
    return (
      <div className={cn('flex flex-wrap items-center justify-center', className)} style={{ gap }}>
        {items}
      </div>
    )
  }

  return (
    <div className={cn('group/marquee relative overflow-hidden fade-x', className)}>
      <div
        className={cn(
          'flex w-max will-change-transform',
          pauseOnHover && 'group-hover/marquee:[animation-play-state:paused]',
        )}
        style={{
          gap,
          paddingRight: gap,
          animation: `drift ${duration}s linear infinite`,
          animationDirection: reverse ? 'reverse' : 'normal',
        }}
      >
        {items}
        {/* Duplicate track — aria-hidden so the belt is announced once */}
        <div className="flex shrink-0" style={{ gap, paddingLeft: gap }} aria-hidden>
          {items}
        </div>
      </div>
    </div>
  )
}

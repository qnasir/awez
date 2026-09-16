import { cn } from '@/lib/utils'

type Props = {
  className?: string
  /** Hide the wordmark and show the glyph alone. */
  markOnly?: boolean
  size?: number
}

/**
 * The KINETIQ mark: a sheared K built from three strokes — a stem and two
 * arms that read as forward motion. Drawn, never an image file, so it stays
 * sharp at any size and inherits the accent token.
 */
export function Logo({ className, markOnly = false, size = 30 }: Props) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <span
        aria-hidden
        className="relative grid place-items-center rounded-[0.55rem] border border-line-strong bg-[linear-gradient(160deg,#1B1E26,#0B0C10)]"
        style={{ width: size, height: size }}
      >
        <svg viewBox="0 0 32 32" width={size * 0.66} height={size * 0.66} fill="none">
          <g
            transform="translate(16 16) skewX(-8) translate(-16 -16)"
            stroke="currentColor"
            className="text-volt"
            strokeWidth="3"
            strokeLinecap="square"
          >
            <path d="M10 7 V25" />
            <path d="M14.5 16 L23 7" />
            <path d="M14.5 16 L23 25" />
          </g>
        </svg>
      </span>
      {!markOnly && (
        <span className="font-display text-[0.9375rem] font-extrabold tracking-[0.22em] text-chalk">
          KINETIQ
        </span>
      )}
      <span className="sr-only">KINETIQ</span>
    </span>
  )
}

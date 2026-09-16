import { cn } from '@/lib/utils'

type Props = {
  className?: string
  /** Grid cell size in px. */
  size?: number
  /** Radial mask so the grid dissolves toward the edges. */
  fade?: boolean
  opacity?: number
}

/**
 * The technical substrate under most sections: a hairline grid that fades
 * out radially. It sits at the slowest tier of the depth system — visible
 * enough to read as engineering, quiet enough to never compete.
 */
export function GridBackdrop({ className, size = 64, fade = true, opacity = 0.055 }: Props) {
  return (
    <div
      aria-hidden
      className={cn('pointer-events-none absolute inset-0', className)}
      style={{
        backgroundImage: `linear-gradient(to right, rgba(255,255,255,${opacity}) 1px, transparent 1px),
                          linear-gradient(to bottom, rgba(255,255,255,${opacity}) 1px, transparent 1px)`,
        backgroundSize: `${size}px ${size}px`,
        ...(fade
          ? {
              WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, #000 20%, transparent 78%)',
              maskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, #000 20%, transparent 78%)',
            }
          : {}),
      }}
    />
  )
}

/** A single slow-moving beam of light. Used at most once per section. */
export function LightBeam({
  className,
  color = 'rgba(199,240,72,0.14)',
  size = '60rem',
}: {
  className?: string
  color?: string
  size?: string
}) {
  return (
    <div
      aria-hidden
      className={cn('pointer-events-none absolute rounded-full blur-[120px]', className)}
      style={{
        width: size,
        height: size,
        // Never let a decorative beam outgrow the viewport it is lighting.
        maxWidth: '150vw',
        maxHeight: '150vw',
        background: `radial-gradient(circle, ${color}, transparent 68%)`,
      }}
    />
  )
}

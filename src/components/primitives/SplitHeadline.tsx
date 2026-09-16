import { motion, type Variants } from 'framer-motion'
import { EASE, viewportOnce } from '@/animations'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { cn } from '@/lib/utils'

/**
 * How a headline's emphasised line is rendered.
 *
 * `solid` is the loudest and is rationed — used where the page needs to shout.
 * `outline` and `light` create typographic contrast *within* one headline,
 * which is what separates editorial type from merely large type.
 */
export type Treatment = 'solid' | 'outline' | 'light' | 'plain'

/**
 * Display size. Passed as a prop rather than through `className`: font-size
 * utilities collide, and the base class wins the cascade regardless of the
 * order they are written in — which silently collapsed the whole type scale
 * by one step.
 */
export type Size = 'd1' | 'd2' | 'd3' | 'inherit'

const SIZE: Record<Size, string> = {
  d1: 'text-d1',
  d2: 'text-d2',
  d3: 'text-d3',
  inherit: '',
}

type Props = {
  /** One string per visual line. Words rise in sequence across all lines. */
  lines: readonly string[]
  className?: string
  /** Index of the line that carries the emphasis treatment. */
  accentLine?: number
  treatment?: Treatment
  size?: Size
  as?: 'h1' | 'h2' | 'h3' | 'p'
  delay?: number
  /** Animate on mount rather than on scroll — used by the hero. */
  immediate?: boolean
  /** Lets a section point `aria-labelledby` at its own visible headline. */
  id?: string
}

const container = (delay: number): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: 0.055, delayChildren: delay } },
})

const word: Variants = {
  hidden: { y: '108%' },
  show: { y: '0%', transition: { duration: 0.9, ease: EASE } },
}

const TREATMENT: Record<Treatment, string> = {
  solid: 'text-volt',
  // Stroke with a whisper of fill. Pure stroke reads as washed out at display
  // size — the faint interior gives the letterforms enough body to carry a
  // payoff line while still sitting a step quieter than solid.
  outline: 'text-volt/[0.14] [-webkit-text-stroke:2px_var(--color-volt)]',
  // Weight contrast inside a single headline — 800 against 300.
  light: 'font-normal text-chalk/80',
  plain: '',
}

/**
 * The site's signature headline motion: words rise out of a clipped line box.
 * One orchestrator drives every word, so the cascade stays perfectly even.
 * Screen readers receive the intact sentence — the split is decorative.
 */
export function SplitHeadline({
  lines,
  className,
  accentLine,
  treatment = 'solid',
  size = 'd2',
  as: Tag = 'h2',
  delay = 0,
  immediate = false,
  id,
}: Props) {
  const reduced = useReducedMotion()
  const emphasis = (i: number) => (i === accentLine ? TREATMENT[treatment] : undefined)

  if (reduced) {
    return (
      <Tag id={id} className={cn(SIZE[size], className)}>
        {lines.map((line, i) => (
          <span key={line} className={cn('block', emphasis(i))}>
            {line}
          </span>
        ))}
      </Tag>
    )
  }

  const MotionTag = motion[Tag]
  const trigger = immediate
    ? { initial: 'hidden' as const, animate: 'show' as const }
    : { initial: 'hidden' as const, whileInView: 'show' as const, viewport: viewportOnce }

  return (
    <MotionTag id={id} className={cn(SIZE[size], className)} variants={container(delay)} {...trigger}>
      <span className="sr-only">{lines.join(' ')}</span>
      <span aria-hidden>
        {lines.map((line, lineIndex) => (
          <span key={line} className="block overflow-hidden pb-[0.14em] -mb-[0.14em]">
            <span className={cn('block', emphasis(lineIndex))}>
              {line.split(' ').map((w, i) => (
                <span key={`${w}-${i}`} className="inline-block overflow-hidden align-bottom">
                  <motion.span className="inline-block" variants={word}>
                    {w}
                    {' '}
                  </motion.span>
                </span>
              ))}
            </span>
          </span>
        ))}
      </span>
    </MotionTag>
  )
}

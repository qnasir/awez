import { motion, type Variants } from 'framer-motion'
import { EASE, viewportOnce } from '@/animations'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { cn } from '@/lib/utils'

type Props = {
  /** One string per visual line. Words rise in sequence across all lines. */
  lines: readonly string[]
  className?: string
  /** Index of the line rendered in the accent colour. */
  accentLine?: number
  as?: 'h1' | 'h2' | 'h3'
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

/**
 * The site's signature headline motion: words rise out of a clipped line box.
 * One orchestrator drives every word, so the cascade stays perfectly even.
 * Screen readers receive the intact sentence — the split is decorative.
 */
export function SplitHeadline({
  lines,
  className,
  accentLine,
  as: Tag = 'h2',
  delay = 0,
  immediate = false,
  id,
}: Props) {
  const reduced = useReducedMotion()

  if (reduced) {
    return (
      <Tag id={id} className={cn('text-d2', className)}>
        {lines.map((line, i) => (
          <span key={line} className={cn('block', i === accentLine && 'text-volt')}>
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
    <MotionTag id={id} className={cn('text-d2', className)} variants={container(delay)} {...trigger}>
      <span className="sr-only">{lines.join(' ')}</span>
      <span aria-hidden>
        {lines.map((line, lineIndex) => (
          <span key={line} className="block overflow-hidden pb-[0.14em] -mb-[0.14em]">
            <span className={cn('block', lineIndex === accentLine && 'text-volt')}>
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

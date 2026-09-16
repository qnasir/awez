import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Section } from '@/components/primitives/Section'
import { Counter } from '@/components/primitives/Counter'
import { useReducedMotion } from '@/hooks/useReducedMotion'

/**
 * Short enough that every declared line holds at display size. A statement
 * that wraps into orphans is a statement nobody finishes reading.
 */
const LINES = [
  { text: 'EVERY GYM GETS THE', weight: 'light' as const },
  { text: 'SAME 24 HOURS.', weight: 'bold' as const },
  { text: 'THE DIFFERENCE IS', weight: 'light' as const },
  { text: 'WHERE THEY GO.', weight: 'accent' as const },
]

/**
 * A rhythm break.
 *
 * Every other chapter on the page opens the same structural way — eyebrow,
 * headline, deck, content — and after eight of those the reader stops seeing
 * the openings at all. This is a full-bleed statement with no eyebrow, no
 * deck and no product: one sentence at display scale, set in alternating
 * weights, that exists purely to change the page's breathing.
 *
 * The lines drift at slightly different rates as it passes, so the sentence
 * assembles itself rather than sliding as a block.
 */
export function Statement() {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const driftA = useTransform(scrollYProgress, [0, 1], [70, -70])
  const driftB = useTransform(scrollYProgress, [0, 1], [30, -30])

  return (
    <Section ref={ref} space="tight" className="overflow-hidden border-y border-line">
      {/* Background plane — moves slowest, so the type reads as nearer */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-1/2 h-[30rem] -translate-y-1/2"
        style={reduced ? undefined : { y: driftB }}
      >
        <div className="mx-auto h-full w-[70rem] max-w-[140vw] rounded-[50%] bg-volt/[0.055] blur-[130px]" />
      </motion.div>

      <div className="container-x relative">
        <motion.p
          className="font-display text-[clamp(2.125rem,6.2vw,5.75rem)] leading-[0.92] tracking-[-0.04em]"
          style={reduced ? undefined : { y: driftA }}
        >
          {LINES.map((line, i) => (
            <span key={line.text} className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
              <motion.span
                className={
                  line.weight === 'bold'
                    ? 'block font-extrabold text-chalk'
                    : line.weight === 'accent'
                      ? 'block font-extrabold text-volt'
                      : 'block font-normal text-smoke'
                }
                initial={reduced ? false : { y: '105%' }}
                whileInView={{ y: '0%' }}
                viewport={{ once: true, margin: '-18% 0px -18% 0px' }}
                transition={{ duration: 0.95, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
              >
                {line.text}
              </motion.span>
            </span>
          ))}
        </motion.p>

        <motion.div
          className="mt-10 flex flex-wrap items-baseline gap-x-4 gap-y-2 border-t border-line pt-6 md:mt-12 lg:justify-end"
          initial={reduced ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-15% 0px -15% 0px' }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="font-display text-[2.5rem] font-extrabold leading-none tracking-tight text-volt md:text-[3.25rem]">
            <Counter to={11} suffix=" hrs" duration={1.4} />
          </span>
          <span className="max-w-[26ch] text-[0.9375rem] leading-snug text-ash">
            handed back to the average KINETIQ gym, every week.
          </span>
        </motion.div>
      </div>
    </Section>
  )
}

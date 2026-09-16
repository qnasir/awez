import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Check } from 'lucide-react'
import { FEATURE_STORIES, CAPABILITY_INDEX, type FeatureStory } from '@/lib/content'
import { Section } from '@/components/primitives/Section'
import { SectionHeader } from '@/components/primitives/SectionHeader'
import { SplitHeadline } from '@/components/primitives/SplitHeadline'
import { Reveal } from '@/components/primitives/Reveal'
import { GridBackdrop, LightBeam } from '@/components/primitives/GridBackdrop'
import { FeatureVisual } from './FeatureVisual'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { cn } from '@/lib/utils'

/**
 * One feature, one screen-height chapter: a statement on the left, the product
 * doing that exact thing on the right. The visual parallaxes slightly faster
 * than the type, which is what separates the two planes as you scroll.
 */
function Story({ story, index }: { story: FeatureStory; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const flip = index % 2 === 1

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const visualY = useTransform(scrollYProgress, [0, 1], [46, -46])

  return (
    <div
      ref={ref}
      className={cn(
        // `relative` is required: useScroll measures against the nearest
        // positioned ancestor, and a static one skews the parallax offsets.
        'relative grid items-center gap-10 lg:grid-cols-2 lg:gap-16 xl:gap-24',
        flip && 'lg:[&>*:first-child]:order-2',
      )}
    >
      {/* Type column */}
      <div className={cn(flip && 'lg:pl-4')}>
        <Reveal distance={14} speed="detail">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[0.6875rem] font-medium tracking-widest text-volt">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span className="h-px w-6 bg-line-strong" />
            <span className="mono-label">{story.eyebrow}</span>
          </div>
        </Reveal>

        <SplitHeadline
          lines={story.title}
          accentLine={1}
          size="d3"
          delay={0.06}
          className="mt-5 font-extrabold text-gradient"
        />

        <Reveal delay={0.16} distance={18} speed="product">
          <p className="mt-5 max-w-[46ch] text-[0.9375rem] leading-relaxed text-ash">{story.body}</p>
        </Reveal>

        <motion.ul
          className="mt-7 flex flex-col gap-2.5"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.2 } } }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-15% 0px -15% 0px' }}
        >
          {story.points.map((p) => (
            <motion.li
              key={p}
              variants={
                reduced
                  ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
                  : {
                      hidden: { opacity: 0, x: -12 },
                      show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
                    }
              }
              className="flex items-start gap-2.5 text-[0.875rem] text-smoke"
            >
              <span className="mt-[0.3rem] grid h-3.5 w-3.5 shrink-0 place-items-center rounded-full bg-volt/12">
                <Check size={9} className="text-volt" strokeWidth={3} />
              </span>
              {p}
            </motion.li>
          ))}
        </motion.ul>
      </div>

      {/* Product column */}
      <motion.div style={reduced ? undefined : { y: visualY }} className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-6 rounded-[50%] bg-volt/[0.07] blur-[80px]"
        />
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 30, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-12% 0px -12% 0px' }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <FeatureVisual kind={story.visual} />
        </motion.div>
      </motion.div>
    </div>
  )
}

export function FeatureSection() {
  return (
    <Section id="features" space="base" aria-labelledby="features-heading">
      <GridBackdrop size={96} opacity={0.04} />
      <LightBeam className="-left-72 top-1/3" size="56rem" color="rgba(199,240,72,0.07)" />

      <div className="container-x">
        <SectionHeader
          id="features-heading"
          eyebrow="Built for the work"
          lines={['LESS ADMIN.', 'MORE GROWTH.']}
          accentLine={1}
          layout="split"
          body="Each of these replaces something you are currently doing by hand, in a spreadsheet, or from memory."
        />

        <div className="mt-16 flex flex-col gap-24 md:mt-20 md:gap-32 lg:gap-40">
          {FEATURE_STORIES.map((story, i) => (
            <Story key={story.id} story={story} index={i} />
          ))}
        </div>

        {/* ---- The complete index, as an editorial table rather than more cards ---- */}
        <div className="mt-24 border-t border-line pt-14 md:mt-28">
          <Reveal distance={14} speed="detail">
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <h3 className="font-display text-xl font-bold tracking-tight text-chalk md:text-2xl">
                Everything in the platform
              </h3>
              <p className="mono-label">24 modules · one subscription</p>
            </div>
          </Reveal>

          <dl className="mt-10 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {CAPABILITY_INDEX.map((group, gi) => (
              <Reveal key={group.group} delay={gi * 0.05} distance={16} speed="product">
                <div className="border-t border-line pt-4">
                  <dt className="mono-label text-volt/80">{group.group}</dt>
                  <dd>
                    <ul className="mt-3 flex flex-col gap-2">
                      {group.items.map((item) => (
                        <li key={item}>
                          {/* The rule extends and the row steps right — the
                              response reads as the list acknowledging the
                              pointer, not as a colour swap. */}
                          <span className="group/item flex cursor-default items-center gap-2.5 py-1 text-[0.875rem] text-ash transition-[color,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:translate-x-1 hover:text-chalk">
                            <span className="h-px w-3 shrink-0 bg-dim transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/item:w-6 group-hover/item:bg-volt" />
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
              </Reveal>
            ))}
          </dl>
        </div>
      </div>
    </Section>
  )
}

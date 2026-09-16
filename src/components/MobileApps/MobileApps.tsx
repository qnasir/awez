import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Check } from 'lucide-react'
import { APPS } from '@/lib/content'
import { Phone, ScaledPhone } from './Phone'
import { Section } from '@/components/primitives/Section'
import { SectionHeader } from '@/components/primitives/SectionHeader'
import { LightBeam } from '@/components/primitives/GridBackdrop'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useIsDesktop } from '@/hooks/useMediaQuery'
import { cn } from '@/lib/utils'

const EASE = [0.16, 1, 0.3, 1] as const
const KIND = ['member', 'trainer', 'owner'] as const

/**
 * Three apps, three devices. On desktop they sit in a shallow 3D fan and
 * counter-rotate as the section passes — enough parallax to read as physical
 * objects, never enough to make the screens hard to read.
 *
 * On mobile the fan is dropped: one phone per card, stacked, because three
 * overlapping devices at 380px wide is a puzzle, not a product shot.
 */
export function MobileApps() {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const isDesktop = useIsDesktop()
  const staged = isDesktop && !reduced

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const rotate = useTransform(scrollYProgress, [0, 1], [7, -7])
  const lift = useTransform(scrollYProgress, [0, 1], [50, -50])

  return (
    <Section id="apps" aria-labelledby="apps-heading">
      <LightBeam className="left-1/2 top-10 -translate-x-1/2" size="58rem" color="rgba(199,240,72,0.08)" />

      <div className="container-x">
        <SectionHeader
          id="apps-heading"
          eyebrow="Mobile"
          lines={['YOUR GYM,', 'IN THREE POCKETS.']}
          accentLine={1}
          body="Members book and pay. Trainers run their roster. You watch the business. One system of record behind all three, so nothing is ever entered twice."
          align="center"
          className="mx-auto max-w-4xl"
        />

        <div ref={ref} className="relative mt-16 lg:mt-20">
          {/* ---- Desktop: a shallow fan ---- */}
          <motion.div
            className="relative mx-auto hidden max-w-4xl items-end justify-center gap-6 lg:flex"
            style={staged ? { perspective: 1600 } : undefined}
          >
            {KIND.map((kind, i) => {
              const centre = i === 1
              const tilt = centre ? 0 : i === 0 ? 14 : -14
              return (
                // Entrance and live parallax are split across two elements: a
                // MotionValue in `style` would otherwise swallow the `animate`
                // on the same transform key.
                <motion.div
                  key={kind}
                  className={cn('relative w-[16.5rem]', centre ? 'z-20' : 'z-10')}
                  initial={reduced ? false : { opacity: 0, y: 60, rotateX: 14 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                  viewport={{ once: true, margin: '-10% 0px -10% 0px' }}
                  transition={{ duration: 0.95, delay: 0.1 + i * 0.13, ease: EASE }}
                  style={staged ? { transformStyle: 'preserve-3d' } : undefined}
                >
                  <motion.div
                    style={staged ? { rotateY: tilt, y: centre ? lift : rotate, transformStyle: 'preserve-3d' } : undefined}
                  >
                    <div
                      aria-hidden
                      className="pointer-events-none absolute -inset-4 rounded-[50%] bg-volt/[0.08] blur-[60px]"
                    />
                    <div className={cn('relative', centre ? 'scale-[1.08]' : 'mb-8')}>
                      <Phone kind={kind} />
                    </div>
                  </motion.div>
                </motion.div>
              )
            })}
          </motion.div>

          {/* Captions under the fan */}
          <div className="mx-auto mt-12 hidden max-w-4xl grid-cols-3 gap-6 lg:grid">
            {APPS.map((app, i) => (
              <motion.div
                key={app.id}
                initial={reduced ? false : { opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10% 0px -10% 0px' }}
                transition={{ duration: 0.6, delay: 0.5 + i * 0.1, ease: EASE }}
                className={cn('text-center', i === 1 && 'mt-3')}
              >
                <h3 className="font-display text-base font-bold tracking-tight text-chalk">{app.name}</h3>
                <p className="mt-1 text-sm font-medium text-volt">{app.line}</p>
                <ul className="mt-3 flex flex-col gap-1.5">
                  {app.points.map((p) => (
                    <li key={p} className="text-[0.8125rem] text-smoke">
                      {p}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* ---- Mobile & tablet: one device per card ---- */}
          <div className="flex flex-col gap-10 lg:hidden">
            {APPS.map((app, i) => (
              <motion.article
                key={app.id}
                initial={reduced ? false : { opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10% 0px -10% 0px' }}
                transition={{ duration: 0.75, ease: EASE }}
                className="mx-auto flex w-full max-w-lg items-center gap-5 sm:max-w-2xl sm:gap-10"
              >
                <div className="relative shrink-0">
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -inset-3 rounded-[50%] bg-volt/[0.08] blur-[46px]"
                  />
                  <div className="relative sm:hidden">
                    <ScaledPhone kind={KIND[i]} width={132} />
                  </div>
                  <div className="relative hidden sm:block">
                    <ScaledPhone kind={KIND[i]} width={176} />
                  </div>
                </div>
                <div className="min-w-0">
                  <h3 className="font-display text-lg font-bold tracking-tight text-chalk">{app.name}</h3>
                  <p className="mt-1 text-[0.9375rem] font-medium text-volt">{app.line}</p>
                  <ul className="mt-3 flex flex-col gap-2">
                    {app.points.map((p) => (
                      <li key={p} className="flex items-start gap-2 text-[0.8125rem] text-smoke">
                        <span className="mt-[0.3rem] grid h-3 w-3 shrink-0 place-items-center rounded-full bg-volt/12">
                          <Check size={8} className="text-volt" strokeWidth={3} />
                        </span>
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </Section>
  )
}

import { useRef, useState } from 'react'
import { motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { PRODUCT_CHAPTERS } from '@/lib/content'
import { AppWindow } from '@/components/Dashboard/AppWindow'
import { SectionHeader } from '@/components/primitives/SectionHeader'
import { Section } from '@/components/primitives/Section'
import { GridBackdrop, LightBeam } from '@/components/primitives/GridBackdrop'
import { useIsDesktop } from '@/hooks/useMediaQuery'
import { cn } from '@/lib/utils'

const EASE = [0.16, 1, 0.3, 1] as const

/**
 * The pinned, scroll-driven view.
 *
 * Kept in its own component and mounted only on desktop, so `useScroll` always
 * has a real element to measure — pointing it at a ref that the current
 * breakpoint never renders measures nothing and warns.
 */
function PinnedShowcase() {
  const trackRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  const { scrollYProgress } = useScroll({ target: trackRef, offset: ['start start', 'end end'] })

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const i = Math.min(PRODUCT_CHAPTERS.length - 1, Math.floor(v * PRODUCT_CHAPTERS.length))
    setActive((prev) => (prev === i ? prev : i))
  })

  const chapter = PRODUCT_CHAPTERS[active]

  return (
    <div ref={trackRef} className="relative mt-6" style={{ height: `${PRODUCT_CHAPTERS.length * 80}vh` }}>
      <div className="sticky top-0 flex h-screen items-center">
        <div className="container-x grid w-full grid-cols-12 items-center gap-10">
          {/* Copy column */}
          <div className="relative col-span-4">
            <ol className="flex flex-col gap-8">
              {PRODUCT_CHAPTERS.map((c, i) => {
                const on = i === active
                return (
                  <li key={c.id} className="relative pl-6">
                    <span
                      className={cn(
                        'absolute left-0 top-[0.55rem] h-1.5 w-1.5 rounded-full transition-all duration-500',
                        on ? 'scale-125 bg-volt' : 'bg-dim',
                      )}
                    />
                    {on && (
                      <motion.span
                        layoutId="chapter-rail"
                        className="absolute -left-px top-0 h-full w-px bg-gradient-to-b from-volt/70 to-transparent"
                        transition={{ type: 'spring', stiffness: 260, damping: 32 }}
                      />
                    )}
                    <motion.div animate={{ opacity: on ? 1 : 0.3 }} transition={{ duration: 0.45, ease: EASE }}>
                      <div className="flex items-baseline gap-2.5">
                        <span className="font-mono text-[0.625rem] tracking-widest text-dim">{c.index}</span>
                        <h3 className="font-display text-xl font-bold tracking-tight text-chalk">{c.title}</h3>
                      </div>
                      <p className="mt-1.5 font-display text-[1.375rem] font-semibold leading-tight tracking-tight text-volt">
                        {c.line}
                      </p>
                      <motion.p
                        className="overflow-hidden text-[0.875rem] leading-relaxed text-ash"
                        animate={{ height: on ? 'auto' : 0, opacity: on ? 1 : 0, marginTop: on ? 12 : 0 }}
                        transition={{ duration: 0.45, ease: EASE }}
                      >
                        {c.body}
                      </motion.p>
                    </motion.div>
                  </li>
                )
              })}
            </ol>
          </div>

          {/* Pinned product */}
          <div className="col-span-8">
            <div className="relative">
              <div aria-hidden className="pointer-events-none absolute inset-8 rounded-[50%] bg-volt/[0.09] blur-[100px]" />
              <div className="relative aspect-[16/10]" data-cursor="Explore">
                <AppWindow highlight={chapter.id} live />
              </div>

              {/* Metrics read out of the highlighted region */}
              <div className="mt-5 grid grid-cols-3 gap-3">
                {chapter.metrics.map((m) => (
                  <motion.div
                    key={`${chapter.id}-${m.label}`}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: EASE }}
                    className="rounded-xl border border-line bg-white/[0.02] p-3.5"
                  >
                    <p className="text-[0.625rem] uppercase tracking-[0.12em] text-dim">{m.label}</p>
                    <p className="mt-1.5 font-display text-lg font-bold tracking-tight text-chalk tabular-nums">
                      {m.value}
                    </p>
                    {m.delta && <p className="mt-0.5 text-[0.6875rem] font-medium text-volt">{m.delta}</p>}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Mobile & tablet: each chapter becomes a self-contained card.
 * A sticky pane in a 400px-tall viewport leaves no room to read, so the pin is
 * dropped entirely rather than shrunk — this is a different story, not a
 * degraded one.
 */
function StackedShowcase() {
  return (
    <div className="container-x mt-10 flex flex-col gap-3">
      {PRODUCT_CHAPTERS.map((c) => (
        <motion.article
          key={c.id}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-12% 0px -12% 0px' }}
          transition={{ duration: 0.7, ease: EASE }}
          className="overflow-hidden rounded-2xl border border-line bg-carbon"
        >
          <div className="border-b border-line p-5">
            <div className="flex items-baseline gap-2.5">
              <span className="font-mono text-[0.625rem] tracking-widest text-dim">{c.index}</span>
              <h3 className="font-display text-lg font-bold tracking-tight text-chalk">{c.title}</h3>
            </div>
            <p className="mt-1.5 font-display text-xl font-semibold leading-tight tracking-tight text-volt">{c.line}</p>
            <p className="mt-3 text-sm leading-relaxed text-ash">{c.body}</p>
          </div>
          <dl className="grid grid-cols-3 divide-x divide-line">
            {c.metrics.map((m) => (
              <div key={m.label} className="p-3.5">
                <dt className="text-[0.5625rem] uppercase tracking-[0.1em] text-dim">{m.label}</dt>
                <dd className="mt-1 font-display text-sm font-bold tracking-tight text-chalk tabular-nums">
                  {m.value}
                </dd>
              </div>
            ))}
          </dl>
        </motion.article>
      ))}
    </div>
  )
}

/**
 * The product, explained by scrolling through it. On desktop the window pins
 * while the copy advances, and the active chapter lights its region inside the
 * product while the rest dims — leading the eye to the exact surface described.
 */
export function ProductShowcase() {
  const isDesktop = useIsDesktop()

  return (
    <Section id="product" space="wide" aria-labelledby="product-heading">
      <GridBackdrop size={80} opacity={0.045} />
      <LightBeam className="-right-60 top-20" size="52rem" color="rgba(199,240,72,0.08)" />

      <div className="container-x">
        <SectionHeader
          id="product-heading"
          eyebrow="The platform"
          lines={['EVERYTHING YOUR GYM NEEDS.', 'ONE INTELLIGENT PLATFORM.']}
          accentLine={1}
          treatment="outline"
          layout="split"
          body="Five surfaces, one system of record. Nothing is re-entered, nothing is reconciled by hand, and nothing lives in a file on somebody's desktop."
        />
      </div>

      {isDesktop ? <PinnedShowcase /> : <StackedShowcase />}
    </Section>
  )
}

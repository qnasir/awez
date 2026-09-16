import { useRef } from 'react'
import { motion, useMotionTemplate, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { HERO } from '@/lib/content'
import { Button } from '@/components/primitives/Button'
import { SplitHeadline } from '@/components/primitives/SplitHeadline'
import { GridBackdrop, LightBeam } from '@/components/primitives/GridBackdrop'
import { Particles } from './Particles'
import { DashboardScene } from './DashboardScene'
import { usePointerField } from '@/hooks/useMousePosition'
import { useIsTouch } from '@/hooks/useMediaQuery'
import { useReducedMotion } from '@/hooks/useReducedMotion'

type Props = { ready: boolean }

/**
 * The opening. Everything is sequenced off a single `ready` flag handed down
 * from the loader, so the reveal begins exactly as the loading panel lifts —
 * one continuous movement instead of two competing ones.
 *
 * Typography moves at the STRUCTURE tier, the product slab at PRODUCT, and the
 * background light at ATMOSPHERE. That spread is what makes it read as depth.
 */
export function Hero({ ready }: Props) {
  const sectionRef = useRef<HTMLElement>(null)
  const isTouch = useIsTouch()
  const reduced = useReducedMotion()
  const lightsOn = !isTouch && !reduced

  const { px, py } = usePointerField(sectionRef, { disabled: !lightsOn, stiffness: 55, damping: 24 })
  const spotlight = useMotionTemplate`radial-gradient(760px circle at calc(${px} * 100%) calc(${py} * 100%), rgba(199,240,72,0.055), transparent 62%)`

  // Copy drifts up slightly faster than the background as you scroll away.
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] })
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -110])
  const copyFade = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  // One orchestrator drives the whole opening beat. Children declare only
  // their position in the sequence, so the rhythm stays even and nothing can
  // be left behind in a hidden state.
  const sequence = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
  }
  const item = reduced
    ? { hidden: { opacity: 1, y: 0 }, show: { opacity: 1, y: 0 } }
    : {
        hidden: { opacity: 0, y: 24 },
        show: { opacity: 1, y: 0, transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] as const } },
      }

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative isolate overflow-hidden grain pb-20 pt-28 md:pb-28 md:pt-36 lg:pb-32 lg:pt-44"
    >
      {/* ---- Atmosphere ---- */}
      <GridBackdrop size={72} opacity={0.05} />
      <LightBeam className="left-1/2 top-[-22rem] -translate-x-1/2" size="72rem" color="rgba(199,240,72,0.10)" />
      <LightBeam className="-left-72 top-40" size="46rem" color="rgba(107,124,255,0.07)" />
      <Particles className="absolute inset-0 -z-10 h-full w-full" count={40} />
      {lightsOn && (
        <motion.div aria-hidden className="pointer-events-none absolute inset-0 -z-10" style={{ background: spotlight }} />
      )}
      {/* Horizon glow that grounds the slab */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-void via-void/70 to-transparent"
      />

      <div className="container-x relative">
        <motion.div
          className="mx-auto flex max-w-5xl flex-col items-center text-center"
          style={reduced ? undefined : { y: copyY, opacity: copyFade }}
          variants={sequence}
          initial="hidden"
          animate={ready ? 'show' : 'hidden'}
        >
          {/* Eyebrow */}
          <motion.a
            href="#ai"
            variants={item}
            className="group inline-flex items-center gap-2 rounded-full border border-line bg-white/[0.03] py-1 pl-1 pr-3 transition-colors hover:border-line-strong"
          >
            <span className="rounded-full bg-volt px-2 py-0.5 text-[0.5625rem] font-bold uppercase tracking-[0.12em] text-volt-ink">
              New
            </span>
            <span className="text-xs font-medium text-ash sm:text-[0.8125rem]">{HERO.eyebrow} — with AI insights</span>
            <ArrowRight size={12} className="shrink-0 text-dim transition-transform duration-300 group-hover:translate-x-0.5" />
          </motion.a>

          {/* Headline — its own line box, wider than the reading column */}
          <SplitHeadline
            as="h1"
            lines={HERO.headline}
            accentLine={1}
            immediate={ready}
            delay={0.25}
            className="mt-7 text-d1 font-extrabold text-chalk md:mt-8"
          />

          <motion.p
            variants={item}
            className="mt-7 max-w-[52ch] text-base leading-relaxed text-ash md:mt-8 md:text-[1.0625rem]"
          >
            {HERO.sub}
          </motion.p>

          <motion.div variants={item} className="mt-9 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row md:mt-10">
            <Button href="#contact" size="lg" className="w-full sm:w-auto" data-cursor="Demo" icon={<ArrowUpRight size={16} />}>
              {HERO.primaryCta}
            </Button>
            <Button href="#product" size="lg" variant="secondary" className="w-full sm:w-auto" icon={<ArrowRight size={16} />}>
              {HERO.secondaryCta}
            </Button>
          </motion.div>

          <motion.p variants={item} className="mono-label mt-6 text-[0.625rem] normal-case tracking-[0.08em]">
            {HERO.footnote}
          </motion.p>
        </motion.div>

        {/* ---- Product ---- */}
        <div className="mt-14 md:mt-16 lg:mt-20">
          <DashboardScene ready={ready} />
        </div>
      </div>
    </section>
  )
}

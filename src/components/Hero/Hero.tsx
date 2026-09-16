import { useRef } from 'react'
import { motion, useMotionTemplate, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { HERO } from '@/lib/content'
import { Button } from '@/components/primitives/Button'
import { SplitHeadline } from '@/components/primitives/SplitHeadline'
import { GridBackdrop, LightBeam } from '@/components/primitives/GridBackdrop'
import { Particles } from './Particles'
import { DashboardScene } from './DashboardScene'
import { LiveRail } from './LiveRail'
import { usePointerField } from '@/hooks/useMousePosition'
import { useIsTouch } from '@/hooks/useMediaQuery'
import { useReducedMotion } from '@/hooks/useReducedMotion'

type Props = { ready: boolean }

/**
 * The opening.
 *
 * Composed against the centred-headline-over-a-screenshot pattern that every
 * SaaS hero uses. Instead: the type is left-aligned and editorial, a live
 * feed of floor activity sits in the foreground beside it, and the product
 * itself is full-bleed and *cropped by the fold* — a window into the software
 * rather than a picture of it placed underneath the words.
 *
 * Everything is sequenced off a single `ready` flag handed down from the
 * loader, so the reveal begins exactly as the loading panel lifts. Typography
 * moves at the STRUCTURE tier, the product slab at PRODUCT, background light
 * at ATMOSPHERE — that spread is what reads as depth.
 */
export function Hero({ ready }: Props) {
  const sectionRef = useRef<HTMLElement>(null)
  const isTouch = useIsTouch()
  const reduced = useReducedMotion()
  const lightsOn = !isTouch && !reduced

  const { px, py } = usePointerField(sectionRef, { disabled: !lightsOn, stiffness: 55, damping: 24 })
  const spotlight = useMotionTemplate`radial-gradient(760px circle at calc(${px} * 100%) calc(${py} * 100%), rgba(199,240,72,0.06), transparent 62%)`

  // Copy leaves faster than the background — the parallax spread is the depth.
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] })
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -150])
  const copyFade = useTransform(scrollYProgress, [0, 0.55], [1, 0])

  const sequence = {
    hidden: {},
    show: { transition: { staggerChildren: 0.11, delayChildren: 0.05 } },
  }
  const item = reduced
    ? { hidden: { opacity: 1, y: 0 }, show: { opacity: 1, y: 0 } }
    : {
        hidden: { opacity: 0, y: 26 },
        show: { opacity: 1, y: 0, transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] as const } },
      }

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden grain pt-24 md:pt-28"
    >
      {/* ---- Background plate ---- */}
      <GridBackdrop size={72} opacity={0.05} />
      <LightBeam className="left-[58%] top-[-26rem] -translate-x-1/2" size="74rem" color="rgba(199,240,72,0.10)" />
      <LightBeam className="-left-72 top-52" size="44rem" color="rgba(107,124,255,0.07)" />
      <Particles className="absolute inset-0 -z-10 h-full w-full" count={24} />
      {lightsOn && (
        <motion.div aria-hidden className="pointer-events-none absolute inset-0 -z-10" style={{ background: spotlight }} />
      )}

      {/* ---- Midground: type + live rail ---- */}
      <motion.div
        className="container-x relative w-full"
        style={reduced ? undefined : { y: copyY, opacity: copyFade }}
        variants={sequence}
        initial="hidden"
        animate={ready ? 'show' : 'hidden'}
      >
        {/* The headline takes the full measure — cramming it into a column
            beside the rail would cost it a third of its size, and scale is
            the whole point of an opening statement. */}
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

        <SplitHeadline
          as="h1"
          lines={HERO.headline}
          accentLine={1}
          immediate={ready}
          size="d1"
          delay={0.22}
          className="mt-5 font-extrabold text-chalk md:mt-6"
        />

        <div className="mt-8 grid gap-x-8 gap-y-9 md:mt-9 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <motion.p variants={item} className="max-w-[58ch] text-base leading-relaxed text-ash md:text-[1.0625rem]">
              {HERO.sub}
            </motion.p>

            <motion.div variants={item} className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
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

            {/* Phones get the live signal as a single-line ticker — the column
                needs width the screen does not have, but the proof that the
                product is running is worth keeping at every size. */}
            <motion.div variants={item} className="mt-7 lg:hidden">
              <LiveRail ready={ready} variant="ticker" />
            </motion.div>
          </div>

          {/* Foreground layer — sits nearest the viewer and never stops moving */}
          <motion.div variants={item} className="hidden lg:col-span-4 lg:col-start-9 lg:block">
            <LiveRail ready={ready} />
          </motion.div>
        </div>
      </motion.div>

      {/* ---- Foreground: the product, cropped by the fold ---- */}
      <div className="relative mt-10 flex-1 md:mt-12">
        <DashboardScene ready={ready} />
      </div>
    </section>
  )
}

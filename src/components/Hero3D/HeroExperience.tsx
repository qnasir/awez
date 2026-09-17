import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { HERO, HERO_BEATS } from '@/lib/content'
import { Button } from '@/components/primitives/Button'
import { SplitHeadline } from '@/components/primitives/SplitHeadline'
import { DashboardScene } from '@/components/Hero/DashboardScene'
import { GridBackdrop, LightBeam } from '@/components/primitives/GridBackdrop'
import { LiveRail } from '@/components/Hero/LiveRail'
import { useIsTouch } from '@/hooks/useMediaQuery'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useSceneCapability } from './useSceneCapability'
import { scene, subscribe, resetScene } from './sceneState'
import type { Beat } from './sceneConfig'

/** The WebGL scene and everything it pulls in load only once a device qualifies. */
const GymScene = lazy(() => import('./GymScene'))

const EASE = [0.16, 1, 0.3, 1] as const
/**
 * Hero height in viewports — the distance the camera's journey is spent
 * against. Phones get a shorter run: three and a half screens of scroll
 * before the page proper begins is patience a desktop reader has and a
 * thumb does not.
 */
const TRACK_DESKTOP = 360
const TRACK_MOBILE = 220

export function HeroExperience({ ready }: { ready: boolean }) {
  const trackRef = useRef<HTMLElement>(null)
  const capability = useSceneCapability()
  const reduced = useReducedMotion()
  const isTouch = useIsTouch()
  const [beat, setBeat] = useState<Beat>('wide')

  const use3D = capability.status === 'ready'
  const compact = use3D && capability.budget.tier === 'low'
  const trackVh = compact ? TRACK_MOBILE : TRACK_DESKTOP

  const { scrollYProgress } = useScroll({ target: trackRef, offset: ['start start', 'end end'] })

  // The scroll value is pushed into the mutable scene store rather than React
  // state: the camera reads it sixty times a second and must not re-render
  // the tree to do so.
  useMotionValueEvent(scrollYProgress, 'change', (v) => { scene.scroll = v })

  useEffect(() => subscribe((b) => setBeat(b)), [])
  useEffect(() => () => resetScene(), [])

  // Pointer drives the camera, the panels and the lighting direction.
  useEffect(() => {
    if (!use3D || isTouch) return
    const el = trackRef.current
    if (!el) return
    const onMove = (e: PointerEvent) => {
      scene.targetX = (e.clientX / window.innerWidth) * 2 - 1
      scene.targetY = (e.clientY / window.innerHeight) * 2 - 1
    }
    const onLeave = () => { scene.targetX = 0; scene.targetY = 0 }
    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
    }
  }, [use3D, isTouch])

  /* ---- Overlay choreography, driven by the same scroll ---- */
  const copyOpacity = useTransform(scrollYProgress, [0, 0.1, 0.17], [1, 1, 0])
  const copyY = useTransform(scrollYProgress, [0, 0.17], [0, -70])
  const captionOpacity = useTransform(scrollYProgress, [0.16, 0.24, 0.95, 1], [0, 1, 1, 0.9])
  const railOpacity = useTransform(scrollYProgress, [0, 0.08, 0.15], [1, 1, 0])
  const cueOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0])
  // Once the copy has faded it must stop intercepting the pointer, or the
  // invisible headline block keeps the 3D panels behind it un-hoverable.
  const copyEvents = useTransform(scrollYProgress, (v) => (v > 0.15 ? 'none' : 'auto'))

  const caption = HERO_BEATS[beat]

  return (
    <section
      ref={trackRef}
      id="top"
      className="relative isolate"
      style={{ height: use3D && !reduced ? `${trackVh}vh` : undefined }}
    >
      <div
        className={
          use3D && !reduced
            ? 'sticky top-0 flex h-[100svh] flex-col overflow-hidden grain'
            : 'relative flex min-h-[100svh] flex-col overflow-hidden grain pt-24 md:pt-28'
        }
      >
        {/* ---- Layer 0: the room ----
            On a phone the canvas is a window across the top rather than a
            full-bleed backdrop. A portrait frame cannot compose a room behind
            a block of copy — the interesting half of the scene always ends up
            underneath the headline. A window frames it properly and leaves
            the pitch on solid ground. */}
        {use3D ? (
          <Suspense fallback={null}>
            <GymScene
              budget={capability.budget}
              className={compact ? 'relative h-[46svh] w-full shrink-0' : 'absolute inset-0'}
            />
          </Suspense>
        ) : (
          <>
            <GridBackdrop size={72} opacity={0.05} />
            <LightBeam className="left-[58%] top-[-26rem] -translate-x-1/2" size="74rem" color="rgba(199,240,72,0.10)" />
            <LightBeam className="-left-72 top-52" size="44rem" color="rgba(107,124,255,0.07)" />
          </>
        )}

        {/* Readability scrim. Type over a lit 3D room needs a ground of its
            own, but a flat wash would kill the depth — this only darkens the
            left third, where the copy actually sits. */}
        {use3D && (
          <div
            aria-hidden
            className={
              compact
                ? 'pointer-events-none absolute inset-x-0 top-[30svh] h-[18svh] bg-gradient-to-b from-transparent to-void'
                : 'pointer-events-none absolute inset-0 bg-[radial-gradient(130%_95%_at_-5%_58%,rgba(5,5,7,0.93)_0%,rgba(5,5,7,0.6)_34%,rgba(5,5,7,0.16)_58%,transparent_76%)]'
            }
          />
        )}
        {use3D && !compact && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-void to-transparent"
          />
        )}

        {/* ---- Layer 1: the marketing copy ---- */}
        <div
          className={
            use3D
              // The copy layer sits over the canvas, so it must not swallow
              // the pointer — the panels behind it are interactive. Only the
              // links and buttons take events back.
              ? compact
                ? 'container-x pointer-events-none relative flex min-h-0 flex-1 flex-col justify-center'
                : 'container-x pointer-events-none relative flex h-full flex-col justify-center pt-20'
              : 'container-x relative w-full'
          }
        >
          <motion.div
            style={use3D && !reduced ? { opacity: copyOpacity, y: copyY, pointerEvents: copyEvents } : undefined}
          >
            <motion.div
              initial={reduced ? false : 'hidden'}
              animate={ready ? 'show' : 'hidden'}
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.11, delayChildren: 0.05 } } }}
            >
              <motion.a
                href="#ai"
                variants={
                  reduced
                    ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
                    : { hidden: { opacity: 0, y: 26 }, show: { opacity: 1, y: 0, transition: { duration: 0.85, ease: EASE } } }
                }
                className="group pointer-events-auto inline-flex items-center gap-2 rounded-full border border-line bg-white/[0.04] py-1 pl-1 pr-3 transition-colors hover:border-line-strong"
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
                // Over a lit room the type steps back a size. A 118px headline
                // spans two-thirds of the frame and buries the command centre
                // behind it — and on a cinematic product page the scene is the
                // hero, not the wordmark.
                size={use3D ? 'd2' : 'd1'}
                delay={0.22}
                className="mt-5 font-extrabold text-chalk md:mt-6"
              />

              <div className="mt-8 grid gap-x-8 gap-y-9 md:mt-9 lg:grid-cols-12">
                <div className="lg:col-span-7">
                  <motion.p
                    variants={
                      reduced
                        ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
                        : { hidden: { opacity: 0, y: 26 }, show: { opacity: 1, y: 0, transition: { duration: 0.85, ease: EASE } } }
                    }
                    className="max-w-[40ch] text-base leading-relaxed text-ash md:text-[1.0625rem]"
                  >
                    {HERO.sub}
                  </motion.p>

                  <motion.div
                    variants={
                      reduced
                        ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
                        : { hidden: { opacity: 0, y: 26 }, show: { opacity: 1, y: 0, transition: { duration: 0.85, ease: EASE } } }
                    }
                    className="pointer-events-auto mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center"
                  >
                    <Button href="#contact" size="lg" className="w-full sm:w-auto" data-cursor="Demo" icon={<ArrowUpRight size={16} />}>
                      {HERO.primaryCta}
                    </Button>
                    <Button href="#product" size="lg" variant="secondary" className="w-full sm:w-auto" icon={<ArrowRight size={16} />}>
                      {HERO.secondaryCta}
                    </Button>
                  </motion.div>

                  <motion.p
                    variants={
                      reduced
                        ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
                        : { hidden: { opacity: 0, y: 26 }, show: { opacity: 1, y: 0, transition: { duration: 0.85, ease: EASE } } }
                    }
                    className="mono-label mt-6 text-[0.625rem] normal-case tracking-[0.08em]"
                  >
                    {HERO.footnote}
                  </motion.p>

                  {!use3D && (
                    <motion.div
                      variants={
                        reduced
                          ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
                          : { hidden: { opacity: 0, y: 26 }, show: { opacity: 1, y: 0, transition: { duration: 0.85, ease: EASE } } }
                      }
                      className="mt-7 lg:hidden"
                    >
                      <LiveRail ready={ready} variant="ticker" />
                    </motion.div>
                  )}
                </div>

                {!use3D && (
                  <motion.div
                    style={reduced ? undefined : { opacity: railOpacity }}
                    className="hidden lg:col-span-4 lg:col-start-9 lg:block"
                  >
                    <LiveRail ready={ready} />
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* ---- Layer 2: the 2.5D fallback product ---- */}
        {!use3D && (
          <div className="relative mt-10 flex-1 md:mt-12">
            <DashboardScene ready={ready} />
          </div>
        )}

        {/* ---- Layer 3: beat captions, handed off as the camera travels ---- */}
        {use3D && !reduced && !compact && (
          <motion.div
            style={{ opacity: captionOpacity }}
            className="pointer-events-none absolute inset-x-0 bottom-0"
          >
            <div className="container-x pb-10 md:pb-14">
              <div className="flex items-end justify-between gap-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={beat}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.45, ease: EASE }}
                    className="max-w-[34rem]"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[0.6875rem] tabular-nums text-volt">{caption.index}</span>
                      <span className="h-px w-7 bg-volt/50" />
                      <span className="mono-label">{caption.label}</span>
                    </div>
                    <p className="mt-3 font-display text-[1.375rem] font-bold leading-tight tracking-[-0.025em] text-chalk md:text-[1.75rem]">
                      {caption.line}
                    </p>
                  </motion.div>
                </AnimatePresence>

                <div className="pointer-events-auto hidden shrink-0 md:block">
                  <Button href="#contact" size="md" data-cursor="Demo" icon={<ArrowUpRight size={14} />}>
                    {HERO.primaryCta}
                  </Button>
                </div>
              </div>

              {/* Progress through the journey, as a hairline */}
              <div className="mt-6 h-px w-full bg-line">
                <motion.div className="h-px origin-left bg-volt" style={{ scaleX: scrollYProgress }} />
              </div>
            </div>
          </motion.div>
        )}

        {/* ---- Layer 4: scroll cue ---- */}
        {use3D && !reduced && !compact && (
          <motion.div
            style={{ opacity: cueOpacity }}
            className="pointer-events-none absolute inset-x-0 bottom-7 flex justify-center"
          >
            <span className="mono-label text-[0.5625rem]">Scroll to enter</span>
          </motion.div>
        )}
      </div>
    </section>
  )
}

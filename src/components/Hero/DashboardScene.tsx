import { useRef } from 'react'
import { motion, useTransform, useScroll, useSpring } from 'framer-motion'
import { UserPlus, IndianRupee, ShieldCheck, Activity } from 'lucide-react'
import { AppWindow } from '@/components/Dashboard/AppWindow'
import { usePointerField } from '@/hooks/useMousePosition'
import { useIsTouch, useIsDesktop } from '@/hooks/useMediaQuery'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { cn } from '@/lib/utils'

type Props = { ready: boolean }

/**
 * The hero's product environment.
 *
 * Built with CSS 3D rather than WebGL on purpose: the dashboard is real DOM,
 * so its type stays vector-sharp at every density, it costs no shader or
 * texture budget, it is selectable and inspectable, and it degrades to a flat
 * card with one media query. A Three.js plane would have given a blurrier
 * result for an order of magnitude more weight.
 *
 * Two things make it read as a window rather than a screenshot: it is wider
 * than the page's text container, so it breaks the measure the copy sits in;
 * and its lower third dissolves into the page instead of ending on a border,
 * so the fold crops the product rather than framing it.
 */
export function DashboardScene({ ready }: Props) {
  const stageRef = useRef<HTMLDivElement>(null)
  const isTouch = useIsTouch()
  const isDesktop = useIsDesktop()
  const reduced = useReducedMotion()
  const interactive = !isTouch && !reduced && isDesktop

  const { x, y } = usePointerField(stageRef, { disabled: !interactive, stiffness: 70, damping: 20 })

  // Pointer tilt — deliberately small. Past ~8° the UI starts to read as a
  // photograph of a screen rather than a screen.
  const rotateY = useTransform(x, [-0.5, 0.5], [6, -6])
  const rotateX = useTransform(y, [-0.5, 0.5], [-4.5, 4.5])

  // Scroll camera: the slab recedes and lifts as you leave the hero.
  const { scrollYProgress } = useScroll({ target: stageRef, offset: ['start 65%', 'end start'] })
  const scrollLift = useSpring(useTransform(scrollYProgress, [0, 1], [0, -90]), { stiffness: 80, damping: 24 })
  const scrollTilt = useTransform(scrollYProgress, [0, 1], [0, 10])
  const scrollScale = useTransform(scrollYProgress, [0, 1], [1, 0.94])

  const cards = [
    {
      id: 'join',
      icon: <UserPlus size={13} />,
      title: 'New member',
      body: 'Sneha P. · Annual plan',
      pos: '-left-2 top-[30%] lg:-left-6',
      depth: 90,
      delay: 0.5,
    },
    {
      id: 'pay',
      icon: <IndianRupee size={13} />,
      title: 'Payment received',
      body: '₹4,500 · UPI autopay',
      pos: '-right-2 -top-5 lg:-right-6',
      depth: 130,
      delay: 0.72,
    },
    {
      id: 'renew',
      icon: <ShieldCheck size={13} />,
      title: '23 likely to renew',
      body: 'Campaign queued',
      pos: '-right-2 top-[42%] lg:-right-7',
      depth: 70,
      delay: 0.94,
    },
    {
      id: 'live',
      icon: <Activity size={13} />,
      title: '418 check-ins',
      body: 'Live · peak 7–8 PM',
      pos: '-left-2 -top-4 lg:-left-5',
      depth: 110,
      delay: 1.12,
    },
  ]

  return (
    <div
      ref={stageRef}
      // Wider than `container-x`: the product deliberately breaks the measure
      // the copy is set in, which is what makes it read as a separate plane.
      className="relative mx-auto w-full max-w-[88rem] px-4 md:px-8 lg:px-10"
      style={{ perspective: interactive ? 1900 : undefined }}
      data-cursor="Explore"
    >
      {/* Light pooling beneath the slab, so it reads as sitting in space */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[38%] h-[52%] w-[86%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-volt/[0.12] blur-[120px]"
      />

      {/*
        Three nested layers, deliberately. A MotionValue in `style` takes
        precedence over the same key in `animate`, so mixing the entrance with
        the live pointer and scroll transforms on one element silently drops
        the entrance. Each layer owns one job:
          1. entrance from depth   2. scroll camera   3. pointer tilt
      */}
      <motion.div
        initial={reduced ? false : { opacity: 0, z: -560, rotateX: 24, y: 90 }}
        animate={ready ? { opacity: 1, z: 0, rotateX: 0, y: 0 } : undefined}
        transition={{ duration: 1.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        style={interactive ? { transformStyle: 'preserve-3d' } : undefined}
      >
        <motion.div
          style={
            interactive
              ? { y: scrollLift, scale: scrollScale, rotateX: scrollTilt, transformStyle: 'preserve-3d' }
              : { y: scrollLift, scale: scrollScale }
          }
        >
          <motion.div
            className="relative"
            style={interactive ? { rotateX, rotateY, transformStyle: 'preserve-3d' } : undefined}
          >
            <div
              className="relative aspect-[16/11] w-full sm:aspect-[16/10] lg:aspect-[16/8.5]"
              style={interactive ? { transform: 'translateZ(0px)' } : undefined}
            >
              <AppWindow live={ready} />

              {/* The fold crops the product: its lower third dissolves into the
                  page instead of ending on a border. */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 h-[42%] bg-gradient-to-b from-transparent via-void/70 to-void"
              />
            </div>

            {/* Floating context cards, each at its own depth */}
            {cards.map((c) => (
              <motion.div
                key={c.id}
                className={cn('absolute z-20 hidden sm:block', c.pos)}
                style={interactive ? { transform: `translateZ(${c.depth}px)` } : undefined}
                initial={reduced ? false : { opacity: 0, y: 18, scale: 0.94 }}
                animate={ready ? { opacity: 1, y: 0, scale: 1 } : undefined}
                transition={{ duration: 0.8, delay: 1.2 + c.delay, ease: [0.16, 1, 0.3, 1] }}
              >
                <motion.div
                  animate={reduced ? undefined : { y: [0, -7, 0] }}
                  transition={{ duration: 6 + c.depth / 40, repeat: Infinity, ease: 'easeInOut', delay: c.delay }}
                  className="flex items-center gap-2.5 rounded-xl border border-line-strong bg-ink/85 px-3 py-2.5 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.95)] backdrop-blur-xl"
                >
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-volt/12 text-volt">
                    {c.icon}
                  </span>
                  <span className="min-w-0">
                    <span className="block whitespace-nowrap text-[0.6875rem] font-semibold text-chalk">{c.title}</span>
                    <span className="block whitespace-nowrap text-[0.625rem] text-smoke">{c.body}</span>
                  </span>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}

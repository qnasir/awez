/**
 * The site's motion vocabulary.
 *
 * Four speeds create cinematic depth, and every component picks one:
 *   ATMOSPHERE — backgrounds and light. Slowest, never draws attention.
 *   STRUCTURE  — display typography and section frames.
 *   PRODUCT    — dashboard surfaces and cards.
 *   DETAIL     — badges, numbers, icons. Fastest.
 */
import type { Variants, Transition } from 'framer-motion'

export const EASE = [0.16, 1, 0.3, 1] as const
export const EASE_SOFT = [0.65, 0, 0.35, 1] as const

export const SPEED = {
  atmosphere: 1.6,
  structure: 0.9,
  product: 0.7,
  detail: 0.45,
} as const

export const spring = {
  gentle: { type: 'spring', stiffness: 120, damping: 20, mass: 0.8 },
  snappy: { type: 'spring', stiffness: 380, damping: 30 },
  float: { type: 'spring', stiffness: 60, damping: 18, mass: 1.2 },
} satisfies Record<string, Transition>

/* ---------- Reveals ---------- */

export const fadeUp = (delay = 0, distance = 28, speed: keyof typeof SPEED = 'structure'): Variants => ({
  hidden: { opacity: 0, y: distance },
  show: { opacity: 1, y: 0, transition: { duration: SPEED[speed], delay, ease: EASE } },
})

export const fadeIn = (delay = 0, speed: keyof typeof SPEED = 'structure'): Variants => ({
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: SPEED[speed], delay, ease: EASE } },
})

/** Blur-to-sharp: reads as a lens pulling focus. Used sparingly, on key statements. */
export const focusIn = (delay = 0): Variants => ({
  hidden: { opacity: 0, filter: 'blur(14px)', y: 20 },
  show: {
    opacity: 1,
    filter: 'blur(0px)',
    y: 0,
    transition: { duration: SPEED.structure, delay, ease: EASE },
  },
})

/** Clip-path wipe for images and product frames. */
export const clipReveal = (delay = 0): Variants => ({
  hidden: { clipPath: 'inset(0 0 100% 0)', opacity: 0 },
  show: {
    clipPath: 'inset(0 0 0% 0)',
    opacity: 1,
    transition: { duration: 1.1, delay, ease: EASE },
  },
})

/** Per-word headline reveal — the site's signature headline motion. */
export const wordReveal: Variants = {
  hidden: { y: '110%', opacity: 0 },
  show: (i: number = 0) => ({
    y: '0%',
    opacity: 1,
    transition: { duration: 0.85, delay: 0.04 * i, ease: EASE },
  }),
}

/* ---------- Orchestration ---------- */

export const stagger = (each = 0.07, delayChildren = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: each, delayChildren } },
})

/** Shared viewport config so every section triggers at the same visual moment. */
export const viewportOnce = { once: true, margin: '-15% 0px -15% 0px' } as const

/* ---------- Reduced motion ---------- */

/**
 * Collapses any variant set to an instant, fully-visible state.
 * Layout, colour and hierarchy survive; only movement is removed.
 */
export const still: Variants = {
  hidden: { opacity: 1, y: 0, x: 0, scale: 1, filter: 'none', clipPath: 'none' },
  show: { opacity: 1, y: 0, x: 0, scale: 1, filter: 'none', clipPath: 'none', transition: { duration: 0 } },
}

export const pick = (reduced: boolean, variants: Variants): Variants => (reduced ? still : variants)

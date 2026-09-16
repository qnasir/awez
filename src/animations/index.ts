/**
 * The site's motion vocabulary.
 *
 * Four speeds create cinematic depth, and every component picks one:
 *   ATMOSPHERE — backgrounds and light. Slowest, never draws attention.
 *   STRUCTURE  — display typography and section frames.
 *   PRODUCT    — dashboard surfaces and cards.
 *   DETAIL     — badges, numbers, icons. Fastest.
 */
import type { Variants } from 'framer-motion'

export const EASE = [0.16, 1, 0.3, 1] as const

export const SPEED = {
  atmosphere: 1.6,
  structure: 0.9,
  product: 0.7,
  detail: 0.45,
} as const

/* ---------- Reveals ---------- */

export const fadeUp = (delay = 0, distance = 28, speed: keyof typeof SPEED = 'structure'): Variants => ({
  hidden: { opacity: 0, y: distance },
  show: { opacity: 1, y: 0, transition: { duration: SPEED[speed], delay, ease: EASE } },
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

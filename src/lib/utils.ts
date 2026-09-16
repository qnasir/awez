/** Tiny class joiner — no clsx dependency needed for this surface area. */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ')
}

/** Clamp a number into a range. */
export const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v))

/** Normalised progress of `v` between `a` and `b`. */
export const progress = (a: number, b: number, v: number) => clamp((v - a) / (b - a))

/** Linear interpolation. */
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t

/** Indian-format currency, e.g. 842500 -> "8,42,500" */
export function formatINR(value: number): string {
  return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(Math.round(value))
}

/** Compact number, e.g. 1284 -> "1,284" */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-IN').format(Math.round(value))
}

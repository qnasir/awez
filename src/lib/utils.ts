/** Tiny class joiner — no clsx dependency needed for this surface area. */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ')
}

/** Clamp a number into a range. */
export const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v))

/** Normalised progress of `v` between `a` and `b`. */
export const progress = (a: number, b: number, v: number) => clamp((v - a) / (b - a))

/** Indian-format currency, e.g. 842500 -> "8,42,500" */
export function formatINR(value: number): string {
  return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(Math.round(value))
}

/**
 * Shared chart machinery.
 *
 * Colour follows the project's data-viz decisions:
 *   VOLT  — the subject series. Every single-series chart uses this and nothing else.
 *   MUTED — the context/comparison series in an emphasis pair (reads as gray on purpose).
 *   EMBER — reserved for negative status only (lapsed, failed). Never a "series 3".
 *
 * Both real pairs were validated against the #0B0C10 chart surface:
 * volt↔muted ΔE 45.0 deutan, volt↔ember ΔE 16.5 deutan — both well clear of the
 * ΔE 8 target, and both clear 3:1 contrast.
 */
export const VIZ = {
  volt: '#C7F048',
  voltDim: 'rgba(199,240,72,0.10)',
  muted: '#5B616D',
  mutedDim: 'rgba(91,97,109,0.14)',
  ember: '#FF7A45',
  surface: '#0B0C10',
  grid: 'rgba(255,255,255,0.07)',
  axis: 'rgba(255,255,255,0.14)',
  ink: '#A7ACB6',
  inkDim: '#8A92A0',
} as const

/** Mark specs, fixed across every chart on the site. */
export const MARK = {
  line: 2,
  dot: 4.5,
  ring: 2,
  barMax: 24,
  /** Surface-coloured gap that separates touching marks. */
  gap: 2,
  radius: 4,
} as const

export type Scale = (v: number) => number

export function linearScale(d0: number, d1: number, r0: number, r1: number): Scale {
  const span = d1 - d0 || 1
  return (v) => r0 + ((v - d0) / span) * (r1 - r0)
}

/** Catmull-Rom → cubic Bézier. Smooths a series without overshooting its values. */
export function smoothPath(points: [number, number][], tension = 0.22): string {
  if (points.length < 2) return ''
  let d = `M ${points[0][0]} ${points[0][1]}`
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[i + 2] ?? p2
    const c1x = p1[0] + ((p2[0] - p0[0]) / 6) * (tension * 6)
    const c1y = p1[1] + ((p2[1] - p0[1]) / 6) * (tension * 6)
    const c2x = p2[0] - ((p3[0] - p1[0]) / 6) * (tension * 6)
    const c2y = p2[1] - ((p3[1] - p1[1]) / 6) * (tension * 6)
    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2[0]} ${p2[1]}`
  }
  return d
}

/** Rounded at the data end, square at the baseline — the site's bar spec. */
export function barPath(x: number, y: number, w: number, h: number, r: number = MARK.radius): string {
  const rr = Math.min(r, w / 2, Math.max(h, 0))
  if (h <= 0) return ''
  return `M ${x} ${y + h}
          L ${x} ${y + rr}
          Q ${x} ${y} ${x + rr} ${y}
          L ${x + w - rr} ${y}
          Q ${x + w} ${y} ${x + w} ${y + rr}
          L ${x + w} ${y + h} Z`
}

/** Same, rotated for horizontal bars: rounded right end, square at the axis. */
export function hBarPath(x: number, y: number, w: number, h: number, r: number = MARK.radius): string {
  const rr = Math.min(r, h / 2, Math.max(w, 0))
  if (w <= 0) return ''
  return `M ${x} ${y}
          L ${x + w - rr} ${y}
          Q ${x + w} ${y} ${x + w} ${y + rr}
          L ${x + w} ${y + h - rr}
          Q ${x + w} ${y + h} ${x + w - rr} ${y + h}
          L ${x} ${y + h} Z`
}

/**
 * Clean axis ticks — rounded to a readable step, never raw data values.
 *
 * The top tick is rounded *up* past the data max. Stopping at the last tick
 * below the max leaves the tallest mark outside the plot area, where the SVG
 * viewport silently clips it — every bar past the top tick renders the same
 * height and the chart quietly lies.
 */
export function niceTicks(max: number, count = 4): number[] {
  if (!Number.isFinite(max) || max <= 0) return [0]
  const raw = max / count
  const mag = 10 ** Math.floor(Math.log10(raw))
  const step = ([1, 2, 2.5, 5, 10].find((s) => s * mag >= raw) ?? 10) * mag
  const topTick = Math.ceil(max / step) * step
  const ticks: number[] = []
  for (let v = 0; v <= topTick + step * 1e-6; v += step) ticks.push(Number(v.toFixed(6)))
  return ticks
}

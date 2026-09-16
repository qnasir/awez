import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useMeasure } from '@/hooks/useMeasure'
import { useInViewOnce } from '@/hooks/useInViewOnce'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { VIZ, MARK, linearScale, smoothPath, niceTicks } from './chartKit'
import { ChartFrame, GridLines } from './ChartFrame'

export type Series = {
  label: string
  data: number[]
  color: string
  /** Context series render without a fill and sit behind the subject. */
  context?: boolean
}

type Props = {
  title: string
  subtitle?: string
  labels: string[]
  series: Series[]
  height?: number
  /** Formats values for axis ticks, the end label and the tooltip. */
  format?: (v: number) => string
  /** Value label drawn at the end of the subject series. */
  endLabel?: boolean
  className?: string
  tableCaption: string
}

/**
 * Line chart with an optional area wash. One subject series in the accent hue;
 * any second series is context, rendered in the de-emphasis gray — the
 * "emphasis" form, not a categorical pair.
 *
 * The line draws itself from zero on first view, and a crosshair reads exact
 * values on hover.
 */
export function AreaLineChart({
  title,
  subtitle,
  labels,
  series,
  height = 220,
  format = (v) => String(v),
  endLabel = true,
  className,
  tableCaption,
}: Props) {
  const { ref: boxRef, width } = useMeasure<HTMLDivElement>()
  const { ref: viewRef, inView } = useInViewOnce<HTMLDivElement>('-10% 0px -10% 0px')
  const reduced = useReducedMotion()
  const [hover, setHover] = useState<number | null>(null)

  const pad = { top: 14, right: endLabel ? 52 : 14, bottom: 26, left: 38 }

  const geom = useMemo(() => {
    if (!width) return null
    const max = Math.max(...series.flatMap((s) => s.data))
    const ticks = niceTicks(max, 4)
    const top = ticks[ticks.length - 1]
    const x = linearScale(0, labels.length - 1, pad.left, width - pad.right)
    const y = linearScale(0, top, height - pad.bottom, pad.top)

    return {
      ticks,
      x,
      y,
      paths: series.map((s) => {
        const pts = s.data.map((v, i) => [x(i), y(v)] as [number, number])
        const line = smoothPath(pts)
        const area = `${line} L ${pts[pts.length - 1][0]} ${height - pad.bottom} L ${pts[0][0]} ${height - pad.bottom} Z`
        return { line, area, pts }
      }),
    }
  }, [width, height, labels.length, series, pad.left, pad.right, pad.top, pad.bottom])

  const subject = series.findIndex((s) => !s.context)
  const subjectIndex = subject === -1 ? 0 : subject

  return (
    <ChartFrame
      title={title}
      subtitle={subtitle}
      className={className}
      legend={series.map((s) => ({ label: s.label, color: s.color }))}
      table={{
        caption: tableCaption,
        head: ['Period', ...series.map((s) => s.label)],
        rows: labels.map((l, i) => [l, ...series.map((s) => format(s.data[i]))]),
      }}
    >
      <div ref={boxRef} className="w-full">
        <div ref={viewRef}>
          {geom && (
            <svg
              width={width}
              height={height}
              role="img"
              aria-label={`${title}. ${tableCaption}`}
              className="overflow-visible"
              onPointerMove={(e) => {
                const r = e.currentTarget.getBoundingClientRect()
                const rel = e.clientX - r.left
                const step = (width - pad.left - pad.right) / (labels.length - 1)
                const i = Math.round((rel - pad.left) / step)
                setHover(i >= 0 && i < labels.length ? i : null)
              }}
              onPointerLeave={() => setHover(null)}
            >
              <defs>
                {series.map((s, i) => (
                  <linearGradient key={i} id={`fill-${title.replace(/\W/g, '')}-${i}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={s.color} stopOpacity={0.22} />
                    <stop offset="100%" stopColor={s.color} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>

              <GridLines ticks={geom.ticks} scale={geom.y} x0={pad.left} x1={width - pad.right} />

              {/* Y ticks — clean numbers, text token colour, never the series hue */}
              {geom.ticks.map((t) => (
                <text
                  key={t}
                  x={pad.left - 10}
                  y={geom.y(t) + 4}
                  textAnchor="end"
                  fontSize={10}
                  fill={VIZ.inkDim}
                  className="font-mono tabular-nums"
                >
                  {format(t)}
                </text>
              ))}

              {/* X labels — thinned so they never collide at narrow widths */}
              {labels.map((l, i) => {
                const every = width < 420 ? 3 : width < 620 ? 2 : 1
                if (i % every !== 0 && i !== labels.length - 1) return null
                return (
                  <text
                    key={l + i}
                    x={geom.x(i)}
                    y={height - 8}
                    textAnchor="middle"
                    fontSize={10}
                    fill={VIZ.inkDim}
                    className="font-mono"
                  >
                    {l}
                  </text>
                )
              })}

              {/* Context series first, so the subject always sits on top */}
              {series.map((s, i) => {
                const g = geom.paths[i]
                const id = `fill-${title.replace(/\W/g, '')}-${i}`
                return (
                  <g key={s.label} opacity={s.context ? 0.75 : 1}>
                    {!s.context && (
                      <motion.path
                        d={g.area}
                        fill={`url(#${id})`}
                        initial={reduced ? { opacity: 1 } : { opacity: 0 }}
                        animate={inView ? { opacity: 1 } : {}}
                        transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      />
                    )}
                    <motion.path
                      d={g.line}
                      fill="none"
                      stroke={s.color}
                      strokeWidth={MARK.line}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeDasharray={s.context ? '4 5' : undefined}
                      initial={reduced ? { pathLength: 1 } : { pathLength: 0 }}
                      animate={inView ? { pathLength: 1 } : {}}
                      transition={{ duration: 1.5, delay: s.context ? 0.1 : 0.25, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </g>
                )
              })}

              {/* End marker on the subject series — dot with a surface ring */}
              {endLabel && (() => {
                const g = geom.paths[subjectIndex]
                const [ex, ey] = g.pts[g.pts.length - 1]
                const v = series[subjectIndex].data[series[subjectIndex].data.length - 1]
                return (
                  <motion.g
                    initial={reduced ? { opacity: 1 } : { opacity: 0, scale: 0.6 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.5, delay: 1.45, ease: [0.16, 1, 0.3, 1] }}
                    style={{ transformOrigin: `${ex}px ${ey}px` }}
                  >
                    <circle cx={ex} cy={ey} r={MARK.dot + MARK.ring} fill={VIZ.surface} />
                    <circle cx={ex} cy={ey} r={MARK.dot} fill={series[subjectIndex].color} />
                    <text
                      x={ex + 11}
                      y={ey + 4}
                      fontSize={11}
                      fill={VIZ.ink}
                      className="font-mono font-medium tabular-nums"
                    >
                      {format(v)}
                    </text>
                  </motion.g>
                )
              })()}

              {/* Crosshair */}
              {hover !== null && (
                <g aria-hidden>
                  <line
                    x1={geom.x(hover)}
                    x2={geom.x(hover)}
                    y1={pad.top - 6}
                    y2={height - pad.bottom}
                    stroke={VIZ.axis}
                    strokeWidth={1}
                  />
                  {series.map((s) => (
                    <g key={s.label}>
                      <circle cx={geom.x(hover)} cy={geom.y(s.data[hover]!)} r={MARK.dot + MARK.ring} fill={VIZ.surface} />
                      <circle cx={geom.x(hover)} cy={geom.y(s.data[hover]!)} r={MARK.dot} fill={s.color} />
                    </g>
                  ))}
                </g>
              )}
            </svg>
          )}
        </div>

        {/* Tooltip lives in the DOM, not the SVG, so it can use real type styles */}
        {hover !== null && geom && (
          <div
            className="pointer-events-none absolute z-20 -translate-x-1/2 rounded-lg border border-line-strong bg-ink/95 px-3 py-2 shadow-2xl backdrop-blur"
            style={{ left: geom.x(hover), top: 0 }}
            role="status"
          >
            <div className="mono-label mb-1 text-[0.625rem]">{labels[hover]}</div>
            {series.map((s) => (
              <div key={s.label} className="flex items-center gap-2 whitespace-nowrap text-xs text-chalk">
                <span aria-hidden className="h-[3px] w-3 rounded-full" style={{ background: s.color }} />
                <span className="text-smoke">{s.label}</span>
                <span className="ml-auto font-mono tabular-nums">{format(s.data[hover]!)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </ChartFrame>
  )
}

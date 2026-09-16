import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useMeasure } from '@/hooks/useMeasure'
import { useInViewOnce } from '@/hooks/useInViewOnce'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { VIZ, MARK, linearScale, barPath, niceTicks } from './chartKit'
import { ChartFrame, GridLines } from './ChartFrame'

type Props = {
  title: string
  subtitle?: string
  data: { label: string; a: number; b: number }[]
  /** Series names: `a` is the positive outcome, `b` the negative one. */
  names: [string, string]
  height?: number
  className?: string
  tableCaption: string
}

/**
 * Part-to-whole over time. Two series only, and the second is a *status*
 * (lapsed), so it wears the reserved ember tone rather than a categorical slot.
 * A 2px surface gap — not a stroke — separates the segments.
 */
export function StackedColumnChart({ title, subtitle, data, names, height = 200, className, tableCaption }: Props) {
  const { ref: boxRef, width } = useMeasure<HTMLDivElement>()
  const { ref: viewRef, inView } = useInViewOnce<HTMLDivElement>('-10% 0px -10% 0px')
  const reduced = useReducedMotion()
  const [hover, setHover] = useState<number | null>(null)

  const pad = { top: 22, right: 8, bottom: 24, left: 32 }

  const geom = useMemo(() => {
    if (!width) return null
    const max = Math.max(...data.map((d) => d.a + d.b))
    const ticks = niceTicks(max, 3)
    const top = ticks[ticks.length - 1]
    const band = (width - pad.left - pad.right) / data.length
    const barW = Math.min(MARK.barMax, Math.max(6, band * 0.52))
    const y = linearScale(0, top, height - pad.bottom, pad.top)
    return { ticks, band, barW, y, baseline: height - pad.bottom }
  }, [width, height, data, pad.left, pad.right, pad.top, pad.bottom])

  return (
    <ChartFrame
      title={title}
      subtitle={subtitle}
      className={className}
      legend={[
        { label: names[0], color: VIZ.volt },
        { label: names[1], color: VIZ.ember },
      ]}
      table={{
        caption: tableCaption,
        head: ['Month', names[0], names[1]],
        rows: data.map((d) => [d.label, d.a, d.b]),
      }}
    >
      <div ref={boxRef} className="w-full">
        <div ref={viewRef}>
          {geom && (
            <svg width={width} height={height} role="img" aria-label={`${title}. ${tableCaption}`} onPointerLeave={() => setHover(null)}>
              <GridLines ticks={geom.ticks} scale={geom.y} x0={pad.left} x1={width - pad.right} />

              {geom.ticks.map((t) => (
                <text key={t} x={pad.left - 8} y={geom.y(t) + 4} textAnchor="end" fontSize={10} fill={VIZ.inkDim} className="font-mono tabular-nums">
                  {t}
                </text>
              ))}

              {data.map((d, i) => {
                const x = pad.left + geom.band * i + (geom.band - geom.barW) / 2
                const aH = geom.baseline - geom.y(d.a)
                const bH = geom.baseline - geom.y(d.b)
                const aTop = geom.baseline - aH
                // 2px surface gap separates the two segments
                const bTop = aTop - bH - MARK.gap
                const dim = hover !== null && hover !== i

                return (
                  <g key={d.label} opacity={dim ? 0.38 : 1} className="transition-opacity duration-200">
                    <rect
                      x={pad.left + geom.band * i}
                      y={pad.top - 10}
                      width={geom.band}
                      height={height - pad.bottom - pad.top + 10}
                      fill="transparent"
                      onPointerEnter={() => setHover(i)}
                    />
                    <motion.g
                      style={{ transformOrigin: `${x}px ${geom.baseline}px` }}
                      initial={reduced ? { scaleY: 1 } : { scaleY: 0 }}
                      animate={inView ? { scaleY: 1 } : {}}
                      transition={{ duration: 0.75, delay: 0.08 * i, ease: [0.16, 1, 0.3, 1] }}
                    >
                      {/* Positive segment sits on the baseline, square-footed */}
                      <path d={barPath(x, aTop, geom.barW, aH, 0)} fill={VIZ.volt} />
                      {/* Status segment caps the stack, rounded data-end */}
                      <path d={barPath(x, bTop, geom.barW, bH)} fill={VIZ.ember} />
                    </motion.g>
                  </g>
                )
              })}

              {data.map((d, i) => (
                <text
                  key={d.label}
                  x={pad.left + geom.band * i + geom.band / 2}
                  y={height - 7}
                  textAnchor="middle"
                  fontSize={10}
                  fill={VIZ.inkDim}
                  className="font-mono"
                >
                  {d.label}
                </text>
              ))}
            </svg>
          )}
        </div>

        {hover !== null && geom && (
          <div
            className="pointer-events-none absolute z-20 -translate-x-1/2 rounded-lg border border-line-strong bg-ink/95 px-3 py-2 text-xs shadow-2xl backdrop-blur"
            style={{ left: pad.left + geom.band * hover + geom.band / 2, top: -8 }}
            role="status"
          >
            <div className="mono-label mb-1 text-[0.625rem]">{data[hover].label}</div>
            <div className="flex items-center gap-2 whitespace-nowrap">
              <span aria-hidden className="h-[3px] w-3 rounded-full" style={{ background: VIZ.volt }} />
              <span className="text-smoke">{names[0]}</span>
              <span className="ml-auto font-mono tabular-nums text-chalk">{data[hover].a}</span>
            </div>
            <div className="flex items-center gap-2 whitespace-nowrap">
              <span aria-hidden className="h-[3px] w-3 rounded-full" style={{ background: VIZ.ember }} />
              <span className="text-smoke">{names[1]}</span>
              <span className="ml-auto font-mono tabular-nums text-chalk">{data[hover].b}</span>
            </div>
          </div>
        )}
      </div>
    </ChartFrame>
  )
}

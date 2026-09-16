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
  data: { label: string; value: number }[]
  height?: number
  /** Index that gets a direct label — the one value the chart is about. */
  annotate?: number
  annotateText?: string
  format?: (v: number) => string
  className?: string
  tableCaption: string
  unit?: string
}

/**
 * Single-series column chart. One hue for every column — column length already
 * encodes magnitude, so hue stays free. The story is carried by one annotated
 * peak rather than a value on every bar.
 */
export function ColumnChart({
  title,
  subtitle,
  data,
  height = 200,
  annotate,
  annotateText,
  format = (v) => String(v),
  className,
  tableCaption,
  unit = '',
}: Props) {
  const { ref: boxRef, width } = useMeasure<HTMLDivElement>()
  const { ref: viewRef, inView } = useInViewOnce<HTMLDivElement>('-10% 0px -10% 0px')
  const reduced = useReducedMotion()
  const [hover, setHover] = useState<number | null>(null)

  const pad = { top: 22, right: 8, bottom: 24, left: 34 }

  const geom = useMemo(() => {
    if (!width) return null
    const max = Math.max(...data.map((d) => d.value))
    const ticks = niceTicks(max, 3)
    const top = ticks[ticks.length - 1]
    const band = (width - pad.left - pad.right) / data.length
    const barW = Math.min(MARK.barMax, Math.max(3, band - MARK.gap * 2))
    const y = linearScale(0, top, height - pad.bottom, pad.top)
    return { ticks, band, barW, y, baseline: height - pad.bottom }
  }, [width, height, data, pad.left, pad.right, pad.top, pad.bottom])

  return (
    <ChartFrame
      title={title}
      subtitle={subtitle}
      className={className}
      table={{
        caption: tableCaption,
        head: ['Hour', title],
        rows: data.map((d) => [d.label, format(d.value)]),
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
              onPointerLeave={() => setHover(null)}
            >
              <GridLines ticks={geom.ticks} scale={geom.y} x0={pad.left} x1={width - pad.right} />

              {geom.ticks.map((t) => (
                <text
                  key={t}
                  x={pad.left - 8}
                  y={geom.y(t) + 4}
                  textAnchor="end"
                  fontSize={10}
                  fill={VIZ.inkDim}
                  className="font-mono tabular-nums"
                >
                  {format(t)}
                </text>
              ))}

              {data.map((d, i) => {
                const x = pad.left + geom.band * i + (geom.band - geom.barW) / 2
                const top = geom.y(d.value)
                const h = geom.baseline - top
                const isHot = hover === i
                return (
                  <g key={d.label}>
                    {/* Hit target is the full band, not the 8px bar */}
                    <rect
                      x={pad.left + geom.band * i}
                      y={pad.top - 10}
                      width={geom.band}
                      height={height - pad.bottom - pad.top + 10}
                      fill="transparent"
                      onPointerEnter={() => setHover(i)}
                    />
                    <motion.path
                      d={barPath(x, top, geom.barW, h)}
                      fill={VIZ.volt}
                      opacity={hover === null || isHot ? 1 : 0.4}
                      style={{ transformOrigin: `${x}px ${geom.baseline}px` }}
                      initial={reduced ? { scaleY: 1 } : { scaleY: 0 }}
                      animate={inView ? { scaleY: 1 } : {}}
                      transition={{
                        duration: 0.7,
                        delay: 0.06 * i,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="transition-opacity duration-200"
                    />
                  </g>
                )
              })}

              {/* X labels, thinned to fit */}
              {data.map((d, i) => {
                const every = width < 380 ? 4 : width < 560 ? 3 : 2
                if (i % every !== 0) return null
                return (
                  <text
                    key={d.label}
                    x={pad.left + geom.band * i + geom.band / 2}
                    y={height - 7}
                    textAnchor="middle"
                    fontSize={9.5}
                    fill={VIZ.inkDim}
                    className="font-mono"
                  >
                    {d.label}
                  </text>
                )
              })}

              {/* The one direct label: the peak */}
              {annotate !== undefined && (
                <motion.g
                  initial={reduced ? { opacity: 1 } : { opacity: 0, y: 6 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.06 * annotate + 0.6 }}
                >
                  <text
                    x={pad.left + geom.band * annotate + geom.band / 2}
                    y={geom.y(data[annotate].value) - 9}
                    textAnchor="middle"
                    fontSize={10.5}
                    fill={VIZ.ink}
                    className="font-mono font-medium tabular-nums"
                  >
                    {annotateText ?? `${format(data[annotate].value)}${unit}`}
                  </text>
                </motion.g>
              )}
            </svg>
          )}
        </div>

        {hover !== null && geom && (
          <div
            className="pointer-events-none absolute z-20 -translate-x-1/2 rounded-lg border border-line-strong bg-ink/95 px-2.5 py-1.5 text-xs shadow-2xl backdrop-blur"
            style={{ left: pad.left + geom.band * hover + geom.band / 2, top: -4 }}
            role="status"
          >
            <span className="text-smoke">{data[hover].label}</span>{' '}
            <span className="font-mono tabular-nums text-chalk">{format(data[hover].value)}{unit}</span>
          </div>
        )}
      </div>
    </ChartFrame>
  )
}

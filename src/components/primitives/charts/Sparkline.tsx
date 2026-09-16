import { motion } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { linearScale, smoothPath, VIZ } from './chartKit'

type Props = {
  data: number[]
  width?: number
  height?: number
  color?: string
  /** Fill the area under the line with a 10% wash. */
  fill?: boolean
  delay?: number
  animate?: boolean
}

/**
 * The 12-point trend line inside a stat tile. Decorative support for a number
 * that is already stated — no axes, no labels, and aria-hidden, because the
 * tile's value and delta carry the information.
 */
export function Sparkline({
  data,
  width = 96,
  height = 30,
  color = VIZ.volt,
  fill = true,
  delay = 0,
  animate = true,
}: Props) {
  const reduced = useReducedMotion()
  const min = Math.min(...data)
  const max = Math.max(...data)
  const x = linearScale(0, data.length - 1, 1, width - 1)
  const y = linearScale(min, max, height - 3, 3)
  const pts = data.map((v, i) => [x(i), y(v)] as [number, number])
  const line = smoothPath(pts)
  const area = `${line} L ${width - 1} ${height} L 1 ${height} Z`
  const id = `spark-${data.join('').slice(0, 12)}-${color.slice(1)}`

  return (
    <svg width={width} height={height} aria-hidden className="overflow-visible">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.28} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      {fill && <path d={area} fill={`url(#${id})`} />}
      <motion.path
        d={line}
        fill="none"
        stroke={color}
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={reduced || !animate ? { pathLength: 1 } : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] }}
      />
      <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r={3.5} fill={VIZ.surface} />
      <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r={2} fill={color} />
    </svg>
  )
}

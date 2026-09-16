import { motion } from 'framer-motion'
import { useInViewOnce } from '@/hooks/useInViewOnce'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { ChartFrame } from './ChartFrame'

type Props = {
  title: string
  subtitle?: string
  data: { label: string; value: number }[]
  className?: string
  tableCaption: string
  unit?: string
}

/**
 * Ranked nominal categories. Built from DOM elements rather than SVG so the
 * category names use real type and wrap properly at narrow widths.
 *
 * One hue for every bar: length already encodes magnitude, and lead sources
 * have no inherent order, so a value-ramp here would double-encode.
 */
export function HBarChart({ title, subtitle, data, className, tableCaption, unit = '%' }: Props) {
  const { ref, inView } = useInViewOnce<HTMLUListElement>('-10% 0px -10% 0px')
  const reduced = useReducedMotion()
  const max = Math.max(...data.map((d) => d.value))

  return (
    <ChartFrame
      title={title}
      subtitle={subtitle}
      className={className}
      table={{ caption: tableCaption, head: ['Source', 'Share'], rows: data.map((d) => [d.label, `${d.value}${unit}`]) }}
    >
      <ul ref={ref} className="flex h-full flex-col justify-center gap-3">
        {data.map((d, i) => (
          <li key={d.label} className="grid grid-cols-[5.5rem_1fr_2.5rem] items-center gap-3">
            <span className="truncate text-xs text-ash">{d.label}</span>
            <span className="relative h-2 overflow-hidden rounded-full bg-white/[0.045]">
              <motion.span
                className="absolute inset-y-0 left-0 rounded-r-[4px] bg-volt"
                initial={reduced ? { width: `${(d.value / max) * 100}%` } : { width: 0 }}
                animate={inView ? { width: `${(d.value / max) * 100}%` } : {}}
                transition={{ duration: 0.9, delay: 0.08 * i, ease: [0.16, 1, 0.3, 1] }}
              />
            </span>
            <span className="text-right font-mono text-xs tabular-nums text-chalk">
              {d.value}
              {unit}
            </span>
          </li>
        ))}
      </ul>
    </ChartFrame>
  )
}

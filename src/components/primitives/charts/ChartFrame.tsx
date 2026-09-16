import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { VIZ } from './chartKit'

type Props = {
  title: string
  subtitle?: string
  /** Series identity. Omitted entirely for single-series charts, per the legend rule. */
  legend?: { label: string; color: string }[]
  children: ReactNode
  className?: string
  /** Accessible fallback: the same data as a table, hidden visually. */
  table: { caption: string; head: string[]; rows: (string | number)[][] }
  action?: ReactNode
}

/**
 * Shared chart shell: title block, optional legend, the plot, and a
 * visually-hidden data table so every chart is readable without colour or
 * pointer interaction.
 */
export function ChartFrame({ title, subtitle, legend, children, className, table, action }: Props) {
  return (
    <figure className={cn('m-0 flex h-full flex-col', className)}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <figcaption className="text-[0.9375rem] font-semibold leading-tight text-chalk">{title}</figcaption>
          {subtitle && <p className="mt-1 text-xs text-smoke">{subtitle}</p>}
        </div>
        {action}
      </div>

      {legend && legend.length > 1 && (
        <ul className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5">
          {legend.map((s) => (
            <li key={s.label} className="flex items-center gap-1.5 text-[0.6875rem] text-ash">
              <span
                aria-hidden
                className="h-[3px] w-4 rounded-full"
                style={{ background: s.color }}
              />
              {s.label}
            </li>
          ))}
        </ul>
      )}

      <div className="relative mt-4 min-h-0 flex-1">{children}</div>

      {/* Accessible fallback. The wrapper carries `sr-only`, not the table —
          a table ignores the 1px clamp and sizes to its content instead. */}
      <div className="sr-only">
      <table>
        <caption>{table.caption}</caption>
        <thead>
          <tr>{table.head.map((h) => <th key={h} scope="col">{h}</th>)}</tr>
        </thead>
        <tbody>
          {table.rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) =>
                j === 0 ? <th key={j} scope="row">{cell}</th> : <td key={j}>{cell}</td>,
              )}
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </figure>
  )
}

/** Hairline horizontal gridlines, drawn one step off the surface. */
export function GridLines({ ticks, scale, x0, x1 }: { ticks: number[]; scale: (v: number) => number; x0: number; x1: number }) {
  return (
    <g aria-hidden>
      {ticks.map((t) => (
        <line key={t} x1={x0} x2={x1} y1={scale(t)} y2={scale(t)} stroke={VIZ.grid} strokeWidth={1} />
      ))}
    </g>
  )
}

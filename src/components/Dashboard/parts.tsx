import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

/**
 * Building blocks for the product window. These deliberately mirror real
 * application chrome — a rail, a toolbar, stat tiles, list rows — because the
 * whole point is that this reads as software, not as an illustration.
 */

export function Rail({ items, highlight }: { items: { id: string; icon: ReactNode; label: string }[]; highlight?: string | null }) {
  return (
    // A plain div, not <nav>: this is a picture of a sidebar, not navigation.
    <div className="flex h-full w-[3.25rem] shrink-0 flex-col items-center gap-1 border-r border-line bg-black/25 py-3 md:w-[11rem] md:items-stretch md:px-2.5">
      {items.map((it, i) => {
        const on = highlight ? highlight === it.id : i === 0
        return (
          <div
            key={it.id}
            className={cn(
              'relative flex items-center gap-2.5 rounded-lg px-2 py-[0.4rem] transition-colors duration-500',
              'md:justify-start justify-center',
              on ? 'bg-white/[0.07] text-chalk' : 'text-mute',
            )}
          >
            {on && (
              <motion.span
                layoutId="rail-active"
                className="absolute left-0 top-1/2 h-4 w-[2px] -translate-y-1/2 rounded-full bg-volt"
                transition={{ type: 'spring', stiffness: 400, damping: 34 }}
              />
            )}
            <span className="shrink-0">{it.icon}</span>
            <span className="hidden truncate text-[0.6875rem] font-medium md:block">{it.label}</span>
          </div>
        )
      })}
    </div>
  )
}

export function Tile({
  label,
  value,
  delta,
  positive = true,
  children,
  className,
}: {
  label: string
  value: ReactNode
  delta?: string
  positive?: boolean
  children?: ReactNode
  className?: string
}) {
  return (
    <div className={cn('min-w-0 rounded-lg border border-line bg-white/[0.02] p-2.5 md:p-3', className)}>
      <p className="truncate text-[0.5625rem] uppercase tracking-[0.12em] text-mute md:text-[0.625rem]">{label}</p>
      <div className="mt-1 flex items-end justify-between gap-2">
        <span className="min-w-0 truncate font-display text-[0.8125rem] font-bold leading-none tracking-tight text-chalk tabular-nums sm:text-[1.0625rem] md:text-xl">
          {value}
        </span>
        {/* The trend line is the first thing to go when the tile gets narrow —
            the value it decorates has to stay readable. */}
        <span className="hidden shrink-0 md:block">{children}</span>
      </div>
      {delta && (
        <p className={cn('mt-1.5 text-[0.5625rem] font-medium tabular-nums md:text-[0.625rem]', positive ? 'text-volt' : 'text-ember')}>
          {delta}
        </p>
      )}
    </div>
  )
}

export function PanelBlock({
  title,
  action,
  children,
  className,
  region,
  highlight,
}: {
  title: string
  action?: ReactNode
  children: ReactNode
  className?: string
  region?: string
  highlight?: string | null
}) {
  const dimmed = Boolean(highlight && region && highlight !== region)
  const lit = Boolean(highlight && region && highlight === region)

  return (
    <motion.div
      data-region={region}
      animate={{ opacity: dimmed ? 0.32 : 1 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'relative min-w-0 rounded-xl border bg-white/[0.015] p-3 transition-[border-color,box-shadow] duration-500 md:p-3.5',
        lit ? 'border-volt/45 shadow-[0_0_0_1px_rgba(199,240,72,0.14),0_18px_50px_-24px_rgba(199,240,72,0.4)]' : 'border-line',
        className,
      )}
    >
      <div className="mb-2.5 flex items-center justify-between gap-2">
        <p className="truncate font-sans text-[0.6875rem] font-semibold text-ash md:text-xs">{title}</p>
        {action}
      </div>
      {children}
    </motion.div>
  )
}

export function Row({
  name,
  meta,
  right,
  tone = 'neutral',
}: {
  name: string
  meta: string
  right?: ReactNode
  tone?: 'neutral' | 'good' | 'warn' | 'bad'
}) {
  const dot = {
    neutral: 'bg-dim',
    good: 'bg-volt',
    warn: 'bg-[#FFC53D]',
    bad: 'bg-ember',
  }[tone]

  return (
    <li className="flex items-center gap-2.5 border-b border-line/60 py-[0.4rem] last:border-b-0">
      <span className={cn('h-1.5 w-1.5 shrink-0 rounded-full', dot)} aria-hidden />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[0.6875rem] font-medium text-chalk">{name}</span>
        <span className="block truncate text-[0.5625rem] text-mute md:text-[0.625rem]">{meta}</span>
      </span>
      {right && <span className="shrink-0 font-mono text-[0.625rem] tabular-nums text-ash">{right}</span>}
    </li>
  )
}

/** A compact area plot for use inside the product window. */
export function MiniArea({
  data,
  height = 74,
  animate = true,
  delay = 0,
}: {
  data: number[]
  height?: number
  animate?: boolean
  delay?: number
}) {
  const w = 300
  const min = Math.min(...data) * 0.92
  const max = Math.max(...data) * 1.04
  const step = w / (data.length - 1)
  const pts = data.map((v, i) => [i * step, height - ((v - min) / (max - min)) * (height - 8) - 4])
  let d = `M ${pts[0][0]} ${pts[0][1]}`
  for (let i = 0; i < pts.length - 1; i++) {
    const [x1, y1] = pts[i]
    const [x2, y2] = pts[i + 1]
    d += ` C ${x1 + step / 2} ${y1}, ${x2 - step / 2} ${y2}, ${x2} ${y2}`
  }

  return (
    <svg viewBox={`0 0 ${w} ${height}`} className="h-full w-full" preserveAspectRatio="none" aria-hidden>
      <defs>
        <linearGradient id="mini-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C7F048" stopOpacity="0.26" />
          <stop offset="100%" stopColor="#C7F048" stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path
        d={`${d} L ${w} ${height} L 0 ${height} Z`}
        fill="url(#mini-fill)"
        initial={animate ? { opacity: 0 } : false}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: delay + 0.6 }}
      />
      <motion.path
        d={d}
        fill="none"
        stroke="#C7F048"
        strokeWidth="2"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        initial={animate ? { pathLength: 0 } : false}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.6, delay, ease: [0.16, 1, 0.3, 1] }}
      />
    </svg>
  )
}

/** Vertical bars for the in-window attendance strip. */
export function MiniBars({ data, delay = 0 }: { data: number[]; delay?: number }) {
  const max = Math.max(...data)
  return (
    <div className="flex h-full items-end gap-[3px]" aria-hidden>
      {data.map((v, i) => (
        <motion.span
          key={i}
          className="min-w-0 flex-1 rounded-t-[3px] bg-volt/85"
          style={{ height: `${Math.max(8, (v / max) * 100)}%`, transformOrigin: 'bottom' }}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.6, delay: delay + i * 0.035, ease: [0.16, 1, 0.3, 1] }}
        />
      ))}
    </div>
  )
}

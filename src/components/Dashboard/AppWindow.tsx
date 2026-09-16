import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  LayoutDashboard, Users, CreditCard, ScanLine, Dumbbell, BarChart3,
  Search, Bell, ChevronDown, Plus, TrendingUp,
} from 'lucide-react'
import { Rail, Tile, PanelBlock, Row, MiniArea, MiniBars } from './parts'
import { Sparkline } from '@/components/primitives/charts'
import { REVENUE_SERIES, ATTENDANCE_HOURS, MEMBER_SERIES } from '@/lib/content'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { formatINR, cn } from '@/lib/utils'

const RAIL = [
  { id: 'overview', icon: <LayoutDashboard size={14} />, label: 'Overview' },
  { id: 'memberships', icon: <Users size={14} />, label: 'Members' },
  { id: 'payments', icon: <CreditCard size={14} />, label: 'Payments' },
  { id: 'attendance', icon: <ScanLine size={14} />, label: 'Attendance' },
  { id: 'trainers', icon: <Dumbbell size={14} />, label: 'Trainers' },
  { id: 'analytics', icon: <BarChart3 size={14} />, label: 'Analytics' },
]

const CHECKINS = [
  { name: 'Aditya Rane', meta: 'Annual · 7:12 PM', tone: 'good' as const, right: 'IN' },
  { name: 'Sneha Pillai', meta: 'Quarterly · 7:09 PM', tone: 'good' as const, right: 'IN' },
  { name: 'Vikram Joshi', meta: 'Monthly · 7:04 PM', tone: 'good' as const, right: 'IN' },
  { name: 'Fatima Sheikh', meta: 'Annual · 6:58 PM', tone: 'good' as const, right: 'IN' },
]

const RENEWALS = [
  { name: 'Karan Mehta', meta: 'Expires in 2 days', tone: 'bad' as const, right: '94%' },
  { name: 'Priya Nambiar', meta: 'Expires in 4 days', tone: 'warn' as const, right: '81%' },
  { name: 'Imran Qureshi', meta: 'Expires in 6 days', tone: 'warn' as const, right: '77%' },
  { name: 'Anjali Rao', meta: 'Expires in 7 days', tone: 'good' as const, right: '68%' },
]

type Props = {
  /** Which region is spotlit; everything else dims. Null = all equal. */
  highlight?: string | null
  /** Run the internal entrance choreography. */
  live?: boolean
  className?: string
}

/**
 * The product. One component, used by the hero, the sticky showcase and the
 * live-dashboard section, so the software looks identical everywhere it appears.
 *
 * It is decorative imagery (`aria-hidden`): every number shown here is also
 * stated in real text or in an accessible chart elsewhere on the page.
 */
export function AppWindow({ highlight = null, live = false, className }: Props) {
  const reduced = useReducedMotion()
  const animate = live && !reduced

  // A slow counter on the revenue tile makes the window feel connected to
  // something, rather than frozen at a screenshot moment.
  const [revenue, setRevenue] = useState(animate ? 0 : 842500)
  const [checkins, setCheckins] = useState(animate ? 0 : 418)

  useEffect(() => {
    if (!animate) return
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 1800)
      const eased = 1 - Math.pow(1 - t, 4)
      setRevenue(Math.round(842500 * eased))
      setCheckins(Math.round(418 * eased))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [animate])

  const railHighlight = highlight === 'analytics' ? 'analytics' : highlight

  return (
    <div
      aria-hidden
      className={cn(
        'relative flex h-full w-full flex-col overflow-hidden rounded-xl border border-line-strong',
        'bg-[linear-gradient(180deg,#121419,#0A0B0E)] shadow-[0_60px_120px_-40px_rgba(0,0,0,0.9)]',
        className,
      )}
    >
      {/* Top edge catches light, like a bezel */}
      <span className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

      {/* ---- Toolbar ---- */}
      <div className="flex h-9 shrink-0 items-center gap-2 border-b border-line bg-black/30 px-3 md:h-11 md:gap-3 md:px-4">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-white/12" />
          <span className="h-2 w-2 rounded-full bg-white/12" />
          <span className="h-2 w-2 rounded-full bg-white/12" />
        </div>

        <div className="ml-1 hidden items-center gap-1.5 rounded-md border border-line bg-white/[0.03] px-2 py-1 sm:flex">
          <span className="text-[0.625rem] font-semibold text-chalk">Ironhaus · Koregaon Park</span>
          <ChevronDown size={11} className="text-mute" />
        </div>

        <div className="ml-auto flex min-w-0 items-center gap-2">
          <div className="hidden min-w-0 items-center gap-1.5 rounded-md border border-line bg-white/[0.03] px-2 py-1 md:flex">
            <Search size={11} className="shrink-0 text-mute" />
            <span className="truncate text-[0.625rem] text-mute">Search members, invoices…</span>
          </div>
          <span className="relative grid h-6 w-6 place-items-center rounded-md border border-line text-mute">
            <Bell size={11} />
            <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-volt" />
          </span>
          <span className="grid h-6 w-6 place-items-center rounded-md bg-volt text-[0.5625rem] font-bold text-volt-ink">
            RD
          </span>
        </div>
      </div>

      {/* ---- Body ---- */}
      <div className="flex min-h-0 flex-1">
        <Rail items={RAIL} highlight={railHighlight ?? 'overview'} />

        <div className="flex min-w-0 flex-1 flex-col gap-2.5 overflow-hidden p-2.5 md:gap-3 md:p-3.5">
          {/* Page header */}
          <div className="flex shrink-0 items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate font-display text-[0.9375rem] font-bold tracking-tight text-chalk md:text-lg">
                Overview
              </p>
              <p className="truncate text-[0.5625rem] text-mute md:text-[0.625rem]">March 2025 · Updated 2 min ago</p>
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              <span className="hidden rounded-md border border-line px-2 py-1 text-[0.5625rem] text-ash sm:block">
                This month
              </span>
              <span className="flex items-center gap-1 rounded-md bg-volt px-2 py-1 text-[0.5625rem] font-bold text-volt-ink">
                <Plus size={9} /> New member
              </span>
            </div>
          </div>

          {/* KPI row */}
          <motion.div
            className="grid shrink-0 grid-cols-3 gap-2 md:gap-2.5"
            initial={animate ? 'hidden' : false}
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.25 } } }}
          >
            {[
              <Tile key="r" label="Revenue" value={`₹${formatINR(revenue)}`} delta="▲ 18.4%">
                <Sparkline data={REVENUE_SERIES.slice(-8)} width={46} height={20} animate={animate} delay={0.9} />
              </Tile>,
              <Tile key="m" label="Active members" value="1,284" delta="▲ 4.9%">
                <Sparkline data={MEMBER_SERIES.slice(-8)} width={46} height={20} animate={animate} delay={1.0} />
              </Tile>,
              <Tile key="c" label="Check-ins" value={checkins.toLocaleString('en-IN')} delta="▲ 7.3%">
                <Sparkline data={[280, 310, 296, 341, 368, 352, 394, 418]} width={46} height={20} animate={animate} delay={1.1} />
              </Tile>,
            ].map((tile, i) => (
              <motion.div
                key={i}
                variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } } }}
                className="min-w-0"
              >
                {tile}
              </motion.div>
            ))}
          </motion.div>

          {/* Revenue panel */}
          <PanelBlock
            region="payments"
            highlight={highlight}
            title="Revenue · last 12 months"
            className="min-h-0 flex-1"
            action={
              <span className="flex items-center gap-1 rounded-full bg-volt/10 px-1.5 py-0.5 text-[0.5625rem] font-semibold text-volt">
                <TrendingUp size={9} /> ₹9.8L
              </span>
            }
          >
            <div className="h-[calc(100%-0.25rem)] min-h-[3.5rem]">
              <MiniArea data={REVENUE_SERIES} animate={animate} delay={0.6} />
            </div>
          </PanelBlock>

          {/* Bottom trio */}
          <div className="grid shrink-0 grid-cols-2 gap-2.5 lg:grid-cols-3">
            <PanelBlock region="attendance" highlight={highlight} title="Check-ins today" className="hidden lg:block">
              <div className="h-[3.25rem]">
                <MiniBars data={ATTENDANCE_HOURS.map((h) => h.v)} delay={1.1} />
              </div>
              <p className="mt-2 text-[0.5625rem] text-mute">Peak 7–8 PM · 96 in</p>
            </PanelBlock>

            <PanelBlock region="attendance" highlight={highlight} title="Live check-ins">
              <ul className="-my-0.5">
                {CHECKINS.slice(0, 3).map((c) => <Row key={c.name} {...c} />)}
              </ul>
            </PanelBlock>

            <PanelBlock region="memberships" highlight={highlight} title="Renewals due · 7 days">
              <ul className="-my-0.5">
                {RENEWALS.slice(0, 3).map((r) => <Row key={r.name} {...r} />)}
              </ul>
            </PanelBlock>
          </div>
        </div>
      </div>
    </div>
  )
}

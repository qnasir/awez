import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ScanLine, IndianRupee, RefreshCw, UserPlus, CalendarCheck } from 'lucide-react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { cn } from '@/lib/utils'

type Event = { id: number; kind: keyof typeof KIND; who: string; detail: string }

const KIND = {
  checkin: { icon: ScanLine, label: 'Check-in', tone: 'text-volt' },
  payment: { icon: IndianRupee, label: 'Payment', tone: 'text-volt' },
  renewal: { icon: RefreshCw, label: 'Renewal', tone: 'text-volt' },
  lead: { icon: UserPlus, label: 'Lead', tone: 'text-chalk' },
  booking: { icon: CalendarCheck, label: 'Booking', tone: 'text-chalk' },
} as const

/** A believable stream of floor activity for a gym doing ~400 check-ins a day. */
const POOL: Omit<Event, 'id'>[] = [
  { kind: 'checkin', who: 'Aditya Rane', detail: 'Annual · Koregaon Park' },
  { kind: 'payment', who: '₹4,500 received', detail: 'UPI autopay · Sneha P.' },
  { kind: 'booking', who: 'HIIT · 6:00 AM', detail: '18 of 20 booked' },
  { kind: 'checkin', who: 'Fatima Sheikh', detail: 'Quarterly · Baner' },
  { kind: 'renewal', who: 'Karan Mehta renewed', detail: 'Annual · one tap' },
  { kind: 'lead', who: 'New enquiry', detail: 'Instagram DM · assigned' },
  { kind: 'checkin', who: 'Vikram Joshi', detail: 'Monthly · Viman Nagar' },
  { kind: 'payment', who: '₹18,000 received', detail: 'Card · Meera K.' },
  { kind: 'booking', who: 'Strength · 7:30 PM', detail: 'Waitlist promoted ×2' },
  { kind: 'checkin', who: 'Priya Nambiar', detail: 'Annual · Koregaon Park' },
]

const VISIBLE = 4
const INTERVAL = 2600

/**
 * The hero's foreground layer: a live stream of what is happening on the floor
 * right now.
 *
 * This is the piece that makes the product feel alive rather than
 * photographed — a dashboard that counts up once and freezes is a screenshot.
 * The stream advances on a single interval that stops when the tab is hidden
 * or the rail scrolls out of view, and under reduced motion it renders as a
 * static list of the same events.
 */
type Variant = 'column' | 'ticker'

export function LiveRail({
  className,
  ready,
  variant = 'column',
}: {
  className?: string
  ready: boolean
  variant?: Variant
}) {
  const reduced = useReducedMotion()
  const hostRef = useRef<HTMLDivElement>(null)
  const cursor = useRef(VISIBLE)
  const [events, setEvents] = useState<Event[]>(() =>
    POOL.slice(0, VISIBLE).map((e, i) => ({ ...e, id: i })),
  )

  useEffect(() => {
    if (reduced || !ready) return
    const host = hostRef.current
    if (!host) return

    let timer: number | undefined
    const advance = () => {
      setEvents((prev) => {
        const next = POOL[cursor.current % POOL.length]
        cursor.current += 1
        return [{ ...next, id: cursor.current }, ...prev].slice(0, VISIBLE)
      })
    }
    const start = () => { if (timer === undefined) timer = window.setInterval(advance, INTERVAL) }
    const stop = () => { if (timer !== undefined) { clearInterval(timer); timer = undefined } }

    const io = new IntersectionObserver(([e]) => (e.isIntersecting && !document.hidden ? start() : stop()), {
      threshold: 0,
    })
    io.observe(host)
    const onVis = () => (document.hidden ? stop() : start())
    document.addEventListener('visibilitychange', onVis)

    return () => { stop(); io.disconnect(); document.removeEventListener('visibilitychange', onVis) }
  }, [reduced, ready])

  const pulse = (
    <span className="relative flex h-1.5 w-1.5 shrink-0">
      {!reduced && (
        <span
          className="absolute inset-0 rounded-full bg-volt"
          style={{ animation: 'pulse-ring 2.6s cubic-bezier(0.22,1,0.36,1) infinite' }}
        />
      )}
      <span className="relative h-1.5 w-1.5 rounded-full bg-volt" />
    </span>
  )

  if (variant === 'ticker') {
    const top = events[0]
    const { icon: Icon } = KIND[top.kind]
    return (
      <div
        ref={hostRef}
        className={cn(
          'flex items-center gap-3 overflow-hidden rounded-xl border border-line bg-white/[0.025] px-3 py-2.5',
          className,
        )}
      >
        {pulse}
        <span className="mono-label shrink-0 text-[0.5625rem]">Live</span>
        <span className="h-4 w-px shrink-0 bg-line-strong" />
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={top.id}
            initial={reduced ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex min-w-0 flex-1 items-center gap-2"
          >
            <Icon size={11} className="shrink-0 text-volt" />
            <span className="truncate text-[0.75rem] font-medium text-chalk">{top.who}</span>
            <span className="truncate text-[0.6875rem] text-dim">{top.detail}</span>
          </motion.span>
        </AnimatePresence>
      </div>
    )
  }

  return (
    <div ref={hostRef} className={cn('relative', className)}>
      <div className="flex items-center gap-2 pb-3">
        {pulse}
        <span className="mono-label text-[0.625rem]">Live on the floor</span>
      </div>

      {/* The stream dissolves at the bottom rather than ending on a hard edge */}
      <ul
        className="flex flex-col gap-px pb-4"
        style={{
          maskImage: 'linear-gradient(180deg, #000 84%, transparent)',
          WebkitMaskImage: 'linear-gradient(180deg, #000 84%, transparent)',
        }}
      >
        <AnimatePresence initial={false} mode="popLayout">
          {events.map((e, i) => {
            const { icon: Icon, label, tone } = KIND[e.kind]
            return (
              <motion.li
                key={e.id}
                layout={!reduced}
                initial={reduced ? false : { opacity: 0, y: -14 }}
                animate={{ opacity: 1 - i * 0.05, y: 0 }}
                exit={reduced ? undefined : { opacity: 0, y: 10, transition: { duration: 0.3 } }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-2.5 border-b border-line/70 py-2.5 last:border-b-0"
              >
                <span className={cn('grid h-6 w-6 shrink-0 place-items-center rounded-md bg-white/[0.05]', tone)}>
                  <Icon size={11} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[0.75rem] font-medium text-chalk">{e.who}</span>
                  <span className="block truncate text-[0.6875rem] text-dim">{e.detail}</span>
                </span>
                <span className="shrink-0 font-mono text-[0.5625rem] uppercase tracking-[0.1em] text-dim">
                  {label}
                </span>
              </motion.li>
            )
          })}
        </AnimatePresence>
      </ul>
    </div>
  )
}

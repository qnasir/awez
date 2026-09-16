import { motion } from 'framer-motion'
import { Check, CheckCheck, MessageCircle, Smartphone, Mail, Clock, Users2, TrendingUp } from 'lucide-react'
import { useInViewOnce } from '@/hooks/useInViewOnce'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { cn } from '@/lib/utils'

const EASE = [0.16, 1, 0.3, 1] as const

/** Shared frame so every feature visual sits on the same surface. */
function Frame({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div
      aria-hidden
      className="relative overflow-hidden rounded-2xl border border-line-strong bg-[linear-gradient(180deg,#121419,#0A0B0E)] shadow-[0_50px_100px_-45px_rgba(0,0,0,0.95)]"
    >
      <span className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/22 to-transparent" />
      <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
        <span className="text-[0.6875rem] font-semibold text-ash">{label}</span>
        <span className="flex items-center gap-1 rounded-full bg-volt/10 px-2 py-0.5 text-[0.5625rem] font-semibold text-volt">
          <span className="h-1 w-1 animate-pulse rounded-full bg-volt" /> Live
        </span>
      </div>
      <div className="p-4">{children}</div>
    </div>
  )
}

/* ---------------- 01 · Renewals ---------------- */

const EXPIRING = [
  { name: 'Karan Mehta', plan: 'Annual · ₹18,000', days: 2, p: 94 },
  { name: 'Priya Nambiar', plan: 'Quarterly · ₹6,500', days: 4, p: 81 },
  { name: 'Imran Qureshi', plan: 'Monthly · ₹2,400', days: 6, p: 77 },
  { name: 'Anjali Rao', plan: 'Annual · ₹18,000', days: 7, p: 42 },
]

function RenewalsVisual() {
  const { ref, inView } = useInViewOnce<HTMLDivElement>()
  const reduced = useReducedMotion()

  return (
    <div ref={ref}>
      <Frame label="Renewals · next 7 days">
        <div className="mb-3 flex items-end justify-between border-b border-line pb-3">
          <div>
            <p className="text-[0.625rem] uppercase tracking-[0.12em] text-mute">Expiring</p>
            <p className="font-display text-2xl font-extrabold leading-none tracking-tight text-chalk">47</p>
          </div>
          <div className="text-right">
            <p className="text-[0.625rem] uppercase tracking-[0.12em] text-mute">Likely to renew</p>
            <p className="font-display text-2xl font-extrabold leading-none tracking-tight text-volt">23</p>
          </div>
        </div>

        <ul className="flex flex-col gap-2.5">
          {EXPIRING.map((m, i) => (
            <motion.li
              key={m.name}
              initial={reduced ? false : { opacity: 0, x: 16 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.1 + i * 0.09, ease: EASE }}
              className="rounded-lg border border-line bg-white/[0.02] px-3 py-2.5"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-xs font-medium text-chalk">{m.name}</p>
                  <p className="truncate text-[0.625rem] text-mute">{m.plan}</p>
                </div>
                <span
                  className={cn(
                    'shrink-0 rounded-full px-2 py-0.5 text-[0.5625rem] font-semibold',
                    m.days <= 2 ? 'bg-ember/15 text-ember' : 'bg-white/[0.06] text-ash',
                  )}
                >
                  {m.days}d left
                </span>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <span className="relative h-1 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
                  <motion.span
                    className={cn('absolute inset-y-0 left-0 rounded-full', m.p >= 70 ? 'bg-volt' : 'bg-[#FFC53D]')}
                    initial={reduced ? false : { width: 0 }}
                    animate={inView ? { width: `${m.p}%` } : {}}
                    transition={{ duration: 0.9, delay: 0.3 + i * 0.09, ease: EASE }}
                  />
                </span>
                <span className="w-9 shrink-0 text-right font-mono text-[0.625rem] tabular-nums text-ash">{m.p}%</span>
              </div>
            </motion.li>
          ))}
        </ul>

        <motion.div
          initial={reduced ? false : { opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.85, ease: EASE }}
          className="mt-3 flex items-center gap-2 rounded-lg bg-volt px-3 py-2"
        >
          <Check size={13} className="text-volt-ink" />
          <span className="text-[0.6875rem] font-bold text-volt-ink">Renewal campaign queued · 47 members</span>
        </motion.div>
      </Frame>
    </div>
  )
}

/* ---------------- 02 · Leads ---------------- */

const PIPELINE = [
  { stage: 'New', count: 38, cards: ['Instagram DM', 'Missed call', 'Web form'] },
  { stage: 'Trial', count: 21, cards: ['Day 2 of 3', 'Day 1 of 3'] },
  { stage: 'Joined', count: 13, cards: ['Annual plan'] },
]

function LeadsVisual() {
  const { ref, inView } = useInViewOnce<HTMLDivElement>()
  const reduced = useReducedMotion()

  return (
    <div ref={ref}>
      <Frame label="Lead pipeline · March">
        <div className="grid grid-cols-3 gap-2.5">
          {PIPELINE.map((col, ci) => (
            <div key={col.stage} className="min-w-0">
              <div className="mb-2 flex items-center justify-between">
                <span className="truncate text-[0.625rem] font-semibold uppercase tracking-[0.1em] text-ash">
                  {col.stage}
                </span>
                <span className="font-mono text-[0.625rem] tabular-nums text-mute">{col.count}</span>
              </div>
              <span
                className={cn(
                  'mb-2 block h-[2px] w-full rounded-full',
                  ci === 2 ? 'bg-volt' : ci === 1 ? 'bg-volt/45' : 'bg-white/10',
                )}
              />
              <ul className="flex flex-col gap-1.5">
                {col.cards.map((c, i) => (
                  <motion.li
                    key={c}
                    initial={reduced ? false : { opacity: 0, y: 12 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.12 + ci * 0.12 + i * 0.07, ease: EASE }}
                    className={cn(
                      'rounded-md border px-2 py-1.5',
                      ci === 2 ? 'border-volt/40 bg-volt/[0.07]' : 'border-line bg-white/[0.025]',
                    )}
                  >
                    <span className="block truncate text-[0.625rem] font-medium text-chalk">{c}</span>
                    <span className="mt-0.5 flex items-center gap-1 text-[0.5625rem] text-mute">
                      <Clock size={8} /> {ci === 0 ? 'Due today' : ci === 1 ? 'Trainer: R. Iyer' : '₹18,000'}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <motion.div
          initial={reduced ? false : { opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.75 }}
          className="mt-3.5 flex items-center justify-between rounded-lg border border-line bg-white/[0.02] px-3 py-2"
        >
          <span className="flex items-center gap-1.5 text-[0.625rem] text-ash">
            <TrendingUp size={11} className="text-volt" /> Conversion, this month
          </span>
          <span className="font-mono text-xs font-semibold tabular-nums text-volt">34%</span>
        </motion.div>
      </Frame>
    </div>
  )
}

/* ---------------- 03 · Scheduling ---------------- */

const CLASSES = [
  { day: 'Mon', slots: [{ n: 'HIIT', t: '6:00', full: 92 }, { n: 'Yoga', t: '7:30', full: 64 }] },
  { day: 'Tue', slots: [{ n: 'Strength', t: '6:00', full: 100 }, { n: 'Spin', t: '7:30', full: 78 }] },
  { day: 'Wed', slots: [{ n: 'HIIT', t: '6:00', full: 86 }, { n: 'Mobility', t: '7:30', full: 41 }] },
  { day: 'Thu', slots: [{ n: 'Strength', t: '6:00', full: 97 }, { n: 'Yoga', t: '7:30', full: 58 }] },
]

function SchedulingVisual() {
  const { ref, inView } = useInViewOnce<HTMLDivElement>()
  const reduced = useReducedMotion()

  return (
    <div ref={ref}>
      <Frame label="Timetable · this week">
        <div className="grid grid-cols-4 gap-2">
          {CLASSES.map((d, ci) => (
            <div key={d.day} className="min-w-0">
              <p className="mb-2 text-center text-[0.625rem] font-semibold uppercase tracking-[0.1em] text-mute">
                {d.day}
              </p>
              <div className="flex flex-col gap-1.5">
                {d.slots.map((s, i) => (
                  <motion.div
                    key={s.n + s.t}
                    initial={reduced ? false : { opacity: 0, scale: 0.94 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.5, delay: 0.1 + ci * 0.07 + i * 0.05, ease: EASE }}
                    className={cn(
                      'rounded-md border p-1.5',
                      s.full >= 95 ? 'border-volt/45 bg-volt/[0.08]' : 'border-line bg-white/[0.025]',
                    )}
                  >
                    <p className="truncate text-[0.625rem] font-semibold text-chalk">{s.n}</p>
                    <p className="text-[0.5625rem] text-mute">{s.t} AM</p>
                    <span className="mt-1.5 block h-[3px] overflow-hidden rounded-full bg-white/[0.07]">
                      <motion.span
                        className={cn('block h-full rounded-full', s.full >= 95 ? 'bg-volt' : 'bg-volt/55')}
                        initial={reduced ? false : { width: 0 }}
                        animate={inView ? { width: `${s.full}%` } : {}}
                        transition={{ duration: 0.8, delay: 0.3 + ci * 0.07 + i * 0.05, ease: EASE }}
                      />
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <motion.div
          initial={reduced ? false : { opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.8, ease: EASE }}
          className="mt-3 flex items-center gap-2 rounded-lg border border-volt/30 bg-volt/[0.06] px-3 py-2"
        >
          <Users2 size={12} className="shrink-0 text-volt" />
          <span className="text-[0.6875rem] text-chalk">
            Tue 6:00 Strength full — <span className="font-semibold text-volt">2 promoted from waitlist</span>
          </span>
        </motion.div>
      </Frame>
    </div>
  )
}

/* ---------------- 04 · Notifications ---------------- */

const THREAD = [
  { ch: 'WhatsApp', icon: MessageCircle, text: 'Hi Sneha — your plan renews on 4 March. Tap to renew in one step.', out: true },
  { ch: 'Reply', icon: MessageCircle, text: 'Done, paid just now 👍', out: false },
  { ch: 'Push', icon: Smartphone, text: 'Renewed. Your 6 AM HIIT slot is held for Monday.', out: true },
]

function NotificationsVisual() {
  const { ref, inView } = useInViewOnce<HTMLDivElement>()
  const reduced = useReducedMotion()

  return (
    <div ref={ref}>
      <Frame label="Engagement · automated">
        <div className="mb-3 flex gap-1.5">
          {[
            { l: 'WhatsApp', i: MessageCircle, on: true },
            { l: 'SMS', i: Smartphone, on: true },
            { l: 'Email', i: Mail, on: false },
          ].map((c) => (
            <span
              key={c.l}
              className={cn(
                'flex items-center gap-1 rounded-full border px-2 py-1 text-[0.5625rem] font-medium',
                c.on ? 'border-volt/35 bg-volt/[0.07] text-volt' : 'border-line text-mute',
              )}
            >
              <c.i size={9} /> {c.l}
            </span>
          ))}
        </div>

        <ul className="flex flex-col gap-2">
          {THREAD.map((m, i) => (
            <motion.li
              key={m.text}
              initial={reduced ? false : { opacity: 0, y: 14, scale: 0.97 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.55, delay: 0.2 + i * 0.35, ease: EASE }}
              className={cn('flex', m.out ? 'justify-start' : 'justify-end')}
            >
              <div
                className={cn(
                  'max-w-[82%] rounded-xl px-3 py-2',
                  m.out ? 'rounded-tl-sm bg-white/[0.05]' : 'rounded-tr-sm bg-volt text-volt-ink',
                )}
              >
                <p className={cn('text-[0.6875rem] leading-snug', m.out ? 'text-chalk' : 'font-medium')}>{m.text}</p>
                <p
                  className={cn(
                    'mt-1 flex items-center gap-1 text-[0.5625rem]',
                    m.out ? 'text-mute' : 'text-volt-ink/70',
                  )}
                >
                  {m.ch} <CheckCheck size={9} />
                </p>
              </div>
            </motion.li>
          ))}
        </ul>

        <motion.div
          initial={reduced ? false : { opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 1.35 }}
          className="mt-3 grid grid-cols-3 gap-2 border-t border-line pt-3"
        >
          {[
            ['Delivered', '98.2%'],
            ['Opened', '76.4%'],
            ['Converted', '31.0%'],
          ].map(([l, v]) => (
            <div key={l}>
              <p className="text-[0.5625rem] uppercase tracking-[0.1em] text-mute">{l}</p>
              <p className="mt-0.5 font-mono text-xs font-semibold tabular-nums text-chalk">{v}</p>
            </div>
          ))}
        </motion.div>
      </Frame>
    </div>
  )
}

/* ---------------- 05 · Reports ---------------- */

const BRANCHES = [
  { name: 'Koregaon Park', rev: 9.8, members: 1284, retention: 88 },
  { name: 'Baner', rev: 7.1, members: 946, retention: 84 },
  { name: 'Viman Nagar', rev: 5.4, members: 712, retention: 79 },
]

function ReportsVisual() {
  const { ref, inView } = useInViewOnce<HTMLDivElement>()
  const reduced = useReducedMotion()
  const max = Math.max(...BRANCHES.map((b) => b.rev))

  return (
    <div ref={ref}>
      <Frame label="Group performance · March">
        <div className="mb-3.5 flex items-end justify-between border-b border-line pb-3">
          <div>
            <p className="text-[0.625rem] uppercase tracking-[0.12em] text-mute">Consolidated revenue</p>
            <p className="font-display text-2xl font-extrabold leading-none tracking-tight text-chalk tabular-nums">
              ₹22.3L
            </p>
          </div>
          <span className="rounded-full bg-volt/10 px-2 py-0.5 text-[0.625rem] font-semibold text-volt">▲ 12.6%</span>
        </div>

        <ul className="flex flex-col gap-3">
          {BRANCHES.map((b, i) => (
            <motion.li
              key={b.name}
              initial={reduced ? false : { opacity: 0, x: -14 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.12 + i * 0.1, ease: EASE }}
            >
              <div className="mb-1.5 flex items-center justify-between gap-2">
                <span className="truncate text-xs font-medium text-chalk">{b.name}</span>
                <span className="shrink-0 font-mono text-[0.6875rem] tabular-nums text-ash">₹{b.rev}L</span>
              </div>
              <span className="block h-1.5 overflow-hidden rounded-full bg-white/[0.05]">
                <motion.span
                  className="block h-full rounded-r-[4px] bg-volt"
                  initial={reduced ? false : { width: 0 }}
                  animate={inView ? { width: `${(b.rev / max) * 100}%` } : {}}
                  transition={{ duration: 0.9, delay: 0.25 + i * 0.1, ease: EASE }}
                />
              </span>
              <div className="mt-1.5 flex gap-3 text-[0.5625rem] text-mute">
                <span>{b.members.toLocaleString('en-IN')} members</span>
                <span>{b.retention}% retention</span>
              </div>
            </motion.li>
          ))}
        </ul>
      </Frame>
    </div>
  )
}

/* ---------------- Router ---------------- */

export function FeatureVisual({ kind }: { kind: 'renewals' | 'leads' | 'scheduling' | 'notifications' | 'reports' }) {
  switch (kind) {
    case 'renewals': return <RenewalsVisual />
    case 'leads': return <LeadsVisual />
    case 'scheduling': return <SchedulingVisual />
    case 'notifications': return <NotificationsVisual />
    case 'reports': return <ReportsVisual />
  }
}

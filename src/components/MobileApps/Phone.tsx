import { motion } from 'framer-motion'
import { Flame, CalendarCheck, IndianRupee, Users, ClipboardCheck, TrendingUp, Bell } from 'lucide-react'
import { Sparkline } from '@/components/primitives/charts'
import { cn } from '@/lib/utils'

/** The width the screens are designed against. Any other size is a scale of it. */
export const PHONE_BASE_PX = 264

/**
 * Renders a phone at `width` by drawing it at its design size and scaling the
 * whole device down. Re-flowing the UI at 120px would truncate every label;
 * scaling keeps the screen looking like a screen, just further away.
 */
export function ScaledPhone({ kind, width }: { kind: 'member' | 'trainer' | 'owner'; width: number }) {
  const scale = width / PHONE_BASE_PX
  return (
    <div className="relative aspect-[9/19]" style={{ width }}>
      <div
        className="absolute left-0 top-0 origin-top-left"
        style={{ width: PHONE_BASE_PX, transform: `scale(${scale})` }}
      >
        <Phone kind={kind} />
      </div>
    </div>
  )
}

/** A phone shell. Content is real markup, so the screens stay crisp at any size. */
export function Phone({ kind, className }: { kind: 'member' | 'trainer' | 'owner'; className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        'relative aspect-[9/19] w-full overflow-hidden rounded-[2rem] border-[3px] border-[#22252D] bg-[#0A0B0E]',
        'shadow-[0_50px_90px_-30px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,255,255,0.08)]',
        className,
      )}
    >
      {/* Speaker island */}
      <span className="absolute left-1/2 top-2 z-20 h-3.5 w-16 -translate-x-1/2 rounded-full bg-[#15171D]" />
      <div className="flex h-full flex-col px-3 pb-3 pt-7">
        {kind === 'member' && <MemberScreen />}
        {kind === 'trainer' && <TrainerScreen />}
        {kind === 'owner' && <OwnerScreen />}
      </div>
    </div>
  )
}

function Head({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <div className="min-w-0">
        <p className="truncate text-[0.5rem] uppercase tracking-[0.12em] text-mute">{sub}</p>
        <p className="truncate font-display text-[0.8125rem] font-bold tracking-tight text-chalk">{title}</p>
      </div>
      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-md border border-line text-mute">
        <Bell size={9} />
      </span>
    </div>
  )
}

function MemberScreen() {
  return (
    <>
      <Head sub="Good evening" title="Sneha" />
      <div className="rounded-xl border border-volt/35 bg-volt/[0.07] p-2.5">
        <div className="flex items-center gap-1.5">
          <Flame size={10} className="text-volt" />
          <span className="text-[0.5625rem] font-semibold text-volt">18-day streak</span>
        </div>
        <div className="mt-2 flex gap-[3px]">
          {Array.from({ length: 14 }).map((_, i) => (
            <span key={i} className={cn('h-4 flex-1 rounded-[2px]', i < 11 ? 'bg-volt' : 'bg-volt/20')} />
          ))}
        </div>
      </div>

      <p className="mt-3 text-[0.5rem] uppercase tracking-[0.12em] text-mute">Next class</p>
      <div className="mt-1.5 rounded-xl border border-line bg-white/[0.03] p-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[0.6875rem] font-semibold text-chalk">HIIT · 6:00 AM</span>
          <CalendarCheck size={11} className="text-volt" />
        </div>
        <p className="mt-0.5 text-[0.5rem] text-mute">Coach R. Iyer · Studio 2</p>
      </div>

      <p className="mt-3 text-[0.5rem] uppercase tracking-[0.12em] text-mute">This week</p>
      <ul className="mt-1.5 flex flex-col gap-1.5">
        {[['Bench press', '4 × 8 · 52kg'], ['Deadlift', '5 × 5 · 90kg'], ['Rows', '3 × 12 · 34kg']].map(([n, s]) => (
          <li key={n} className="flex items-center justify-between rounded-lg bg-white/[0.025] px-2.5 py-1.5">
            <span className="text-[0.625rem] text-chalk">{n}</span>
            <span className="font-mono text-[0.5625rem] text-mute">{s}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto rounded-xl bg-volt px-3 py-2 text-center">
        <span className="text-[0.625rem] font-bold text-volt-ink">Book tomorrow · 6:00 AM</span>
      </div>
    </>
  )
}

function TrainerScreen() {
  return (
    <>
      <Head sub="Today · 6 sessions" title="R. Iyer" />
      <div className="grid grid-cols-2 gap-1.5">
        {[['Sessions', '246'], ['Retention', '92%']].map(([l, v]) => (
          <div key={l} className="rounded-lg border border-line bg-white/[0.03] p-2">
            <p className="text-[0.5rem] uppercase tracking-[0.1em] text-mute">{l}</p>
            <p className="mt-0.5 font-display text-sm font-bold text-chalk tabular-nums">{v}</p>
          </div>
        ))}
      </div>

      <p className="mt-3 text-[0.5rem] uppercase tracking-[0.12em] text-mute">Roster</p>
      <ul className="mt-1.5 flex flex-col gap-1.5">
        {[
          ['6:00', 'HIIT · 18 booked', true],
          ['7:30', 'Aditya R. · PT', false],
          ['9:00', 'Fatima S. · PT', false],
          ['6:00p', 'Strength · 22', false],
        ].map(([t, n, on]) => (
          <li
            key={String(t)}
            className={cn(
              'flex items-center gap-2 rounded-lg border px-2 py-1.5',
              on ? 'border-volt/40 bg-volt/[0.07]' : 'border-line bg-white/[0.025]',
            )}
          >
            <span className="w-8 shrink-0 font-mono text-[0.5625rem] text-mute">{t}</span>
            <span className="min-w-0 flex-1 truncate text-[0.625rem] text-chalk">{n}</span>
            {on ? <ClipboardCheck size={9} className="shrink-0 text-volt" /> : <Users size={9} className="shrink-0 text-mute" />}
          </li>
        ))}
      </ul>

      <div className="mt-auto rounded-xl border border-line bg-white/[0.03] p-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[0.5625rem] text-mute">Commission · March</span>
          <span className="font-mono text-[0.6875rem] font-semibold text-volt">₹1,12,400</span>
        </div>
      </div>
    </>
  )
}

function OwnerScreen() {
  return (
    <>
      <Head sub="Ironhaus · 3 branches" title="Overview" />
      <div className="rounded-xl border border-line bg-white/[0.03] p-2.5">
        <div className="flex items-center justify-between">
          <p className="text-[0.5rem] uppercase tracking-[0.1em] text-mute">Revenue · MTD</p>
          <span className="flex items-center gap-0.5 text-[0.5rem] font-semibold text-volt">
            <TrendingUp size={8} /> 18.4%
          </span>
        </div>
        <p className="mt-1 font-display text-[1.0625rem] font-extrabold leading-none text-chalk tabular-nums">
          ₹22,30,000
        </p>
        <div className="mt-2">
          <Sparkline data={[5.9, 6.4, 7.1, 7.6, 8.1, 7.9, 9.4, 9.8]} width={112} height={26} animate={false} />
        </div>
      </div>

      <div className="mt-2 grid grid-cols-2 gap-1.5">
        {[['Members', '2,942'], ['Dues', '₹64,200']].map(([l, v]) => (
          <div key={l} className="rounded-lg border border-line bg-white/[0.03] p-2">
            <p className="text-[0.5rem] uppercase tracking-[0.1em] text-mute">{l}</p>
            <p className="mt-0.5 font-display text-[0.6875rem] font-bold text-chalk tabular-nums">{v}</p>
          </div>
        ))}
      </div>

      <p className="mt-3 text-[0.5rem] uppercase tracking-[0.12em] text-mute">Branches</p>
      <ul className="mt-1.5 flex flex-col gap-1.5">
        {[['Koregaon Park', 98], ['Baner', 71], ['Viman Nagar', 54]].map(([n, p]) => (
          <li key={String(n)} className="rounded-lg bg-white/[0.025] px-2 py-1.5">
            <div className="flex items-center justify-between">
              <span className="truncate text-[0.5625rem] text-chalk">{n}</span>
              <IndianRupee size={8} className="shrink-0 text-mute" />
            </div>
            <span className="mt-1 block h-1 overflow-hidden rounded-full bg-white/[0.06]">
              <span className="block h-full rounded-full bg-volt" style={{ width: `${p}%` }} />
            </span>
          </li>
        ))}
      </ul>

      <motion.div className="mt-auto rounded-xl border border-ember/35 bg-ember/[0.07] px-2.5 py-2">
        <span className="text-[0.5625rem] font-medium text-ember">8 members likely to lapse this week</span>
      </motion.div>
    </>
  )
}

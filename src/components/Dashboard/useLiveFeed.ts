import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

export type CheckIn = { id: number; name: string; meta: string }

const NAMES: [string, string][] = [
  ['Aditya Rane', 'Annual'],
  ['Sneha Pillai', 'Quarterly'],
  ['Vikram Joshi', 'Monthly'],
  ['Fatima Sheikh', 'Annual'],
  ['Priya Nambiar', 'Quarterly'],
  ['Imran Qureshi', 'Monthly'],
  ['Anjali Rao', 'Annual'],
  ['Dev Sharma', 'Monthly'],
  ['Kavya Menon', 'Annual'],
  ['Rahul Bose', 'Quarterly'],
]

/** 7:12 PM counting backwards, so the feed reads like a real evening rush. */
function clockAt(step: number) {
  const base = 19 * 60 + 12
  const m = base - step * 3
  const h = Math.floor(m / 60)
  const mm = String(m % 60).padStart(2, '0')
  return `${h > 12 ? h - 12 : h}:${mm} PM`
}

const make = (i: number): CheckIn => {
  const [name, plan] = NAMES[i % NAMES.length]
  return { id: i, name, meta: `${plan} · ${clockAt(i)}` }
}

type Feed = {
  checkIns: CheckIn[]
  /** Totals that keep moving, so the window is never a frozen screenshot. */
  revenue: number
  checkInCount: number
  /** Drives the entrance count-up; false once the initial ramp has finished. */
  settling: boolean
}

const REVENUE_TARGET = 842500
const CHECKIN_TARGET = 418

/**
 * Keeps the product window alive.
 *
 * A dashboard that counts up once on entry and then freezes is a screenshot
 * with an animation on it — and the "Live" pill beside it is a lie. This
 * feeds the window a slow trickle of real-looking floor activity: a new
 * check-in every few seconds, the day's totals creeping up with it.
 *
 * It costs one interval, which stops when the tab is hidden or the window
 * scrolls out of view, and it does not run at all under reduced motion.
 */
export function useLiveFeed(enabled: boolean, hostRef: React.RefObject<HTMLElement | null>): Feed {
  const reduced = useReducedMotion()
  const active = enabled && !reduced

  const [checkIns, setCheckIns] = useState<CheckIn[]>(() => [0, 1, 2, 3].map(make))
  const [revenue, setRevenue] = useState(active ? 0 : REVENUE_TARGET)
  const [checkInCount, setCheckInCount] = useState(active ? 0 : CHECKIN_TARGET)
  const [settling, setSettling] = useState(active)
  const cursor = useRef(4)

  // Entrance ramp: both totals climb to today's figure.
  useEffect(() => {
    if (!active) {
      setRevenue(REVENUE_TARGET)
      setCheckInCount(CHECKIN_TARGET)
      setSettling(false)
      return
    }
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 1800)
      const eased = 1 - Math.pow(1 - t, 4)
      setRevenue(Math.round(REVENUE_TARGET * eased))
      setCheckInCount(Math.round(CHECKIN_TARGET * eased))
      if (t < 1) raf = requestAnimationFrame(tick)
      else setSettling(false)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [active])

  // Ongoing trickle, once the ramp has landed.
  useEffect(() => {
    if (!active || settling) return
    const host = hostRef.current
    if (!host) return

    let timer: number | undefined
    const beat = () => {
      cursor.current += 1
      setCheckIns((prev) => [make(cursor.current), ...prev].slice(0, 4))
      setCheckInCount((n) => n + 1)
      // Not every walk-in pays at the desk.
      if (cursor.current % 3 === 0) setRevenue((r) => r + 1500 + Math.round(Math.random() * 3000))
    }
    const start = () => { if (timer === undefined) timer = window.setInterval(beat, 4200) }
    const stop = () => { if (timer !== undefined) { clearInterval(timer); timer = undefined } }

    const io = new IntersectionObserver(([e]) => (e.isIntersecting && !document.hidden ? start() : stop()), {
      threshold: 0,
    })
    io.observe(host)
    const onVis = () => (document.hidden ? stop() : start())
    document.addEventListener('visibilitychange', onVis)

    return () => { stop(); io.disconnect(); document.removeEventListener('visibilitychange', onVis) }
  }, [active, settling, hostRef])

  return { checkIns, revenue, checkInCount, settling }
}

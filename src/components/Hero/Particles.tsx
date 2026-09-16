import { useEffect, useRef } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

type Props = { className?: string; count?: number; color?: string }

/**
 * Atmospheric dust. A single canvas of slow-drifting motes at the slowest
 * tier of the depth system — it should register as air, never as content.
 *
 * It stops entirely when scrolled out of view or when the tab is hidden, and
 * renders nothing at all under reduced motion.
 */
export function Particles({ className, count = 42, color = '199,240,72' }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    let w = 0
    let h = 0
    let raf = 0
    let running = true
    // Deliberately 1×, not devicePixelRatio. These are soft sub-2px dots on a
    // near-black ground — at 2× the backing store quadruples and clearing it
    // every frame was, by measurement, the single most expensive thing on the
    // page. At 1× it is indistinguishable and four times cheaper.
    const dpr = 1

    type Mote = { x: number; y: number; r: number; vx: number; vy: number; a: number; warm: boolean }
    let motes: Mote[] = []

    const seed = () => {
      motes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.3 + 0.35,
        vx: (Math.random() - 0.5) * 0.12,
        vy: -(Math.random() * 0.16 + 0.03),
        a: Math.random() * 0.4 + 0.06,
        warm: Math.random() > 0.72,
      }))
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      w = rect.width
      h = rect.height
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      seed()
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      for (const m of motes) {
        m.x += m.vx
        m.y += m.vy
        if (m.y < -6) { m.y = h + 6; m.x = Math.random() * w }
        if (m.x < -6) m.x = w + 6
        if (m.x > w + 6) m.x = -6
        ctx.beginPath()
        ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2)
        ctx.fillStyle = m.warm ? `rgba(${color},${m.a})` : `rgba(255,255,255,${m.a * 0.55})`
        ctx.fill()
      }
      if (running) raf = requestAnimationFrame(draw)
    }

    const start = () => { if (!running) { running = true; raf = requestAnimationFrame(draw) } }
    const stop = () => { running = false; cancelAnimationFrame(raf) }

    resize()
    raf = requestAnimationFrame(draw)

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), { threshold: 0 })
    io.observe(canvas)

    const onVisibility = () => (document.hidden ? stop() : start())
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      stop()
      ro.disconnect()
      io.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [count, color, reduced])

  if (reduced) return null
  return <canvas ref={canvasRef} aria-hidden className={className} />
}

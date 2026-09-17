import { useEffect, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import { formatINR } from '@/lib/utils'

type Props = {
  to: number
  prefix?: string
  suffix?: string
  decimals?: number
  /** Counting starts once this crosses 0.15, so tiles fire with their reveal. */
  active: number
  font: string
  fontSize: number
  color: string
  position: [number, number, number]
  anchorX?: 'left' | 'center' | 'right'
  letterSpacing?: number
}

const FPS = 12

/**
 * A number that counts up, in 3D.
 *
 * Troika lays out and re-tessellates SDF glyphs whenever the string changes,
 * so driving this at display rate would re-mesh four numbers sixty times a
 * second. Counting is legible at 12fps — the value is throttled to that, and
 * stops updating entirely once it lands.
 */
export function CountText({
  to, prefix = '', suffix = '', decimals = 0, active,
  font, fontSize, color, position, anchorX = 'left', letterSpacing = 0,
}: Props) {
  const [shown, setShown] = useState(0)
  const started = useRef(false)
  const t = useRef(0)
  const lastPaint = useRef(0)
  const done = useRef(false)

  useEffect(() => { if (active < 0.05) { started.current = false; done.current = false; t.current = 0; setShown(0) } }, [active])

  useFrame((_, dt) => {
    if (done.current) return
    if (!started.current) {
      if (active < 0.15) return
      started.current = true
    }
    t.current = Math.min(1, t.current + Math.min(dt, 0.05) / 1.7)
    const eased = 1 - Math.pow(1 - t.current, 4)

    lastPaint.current += dt
    if (lastPaint.current < 1 / FPS && t.current < 1) return
    lastPaint.current = 0

    setShown(to * eased)
    if (t.current >= 1) done.current = true
  })

  const body = decimals > 0 ? shown.toFixed(decimals) : formatINR(shown)

  return (
    <Text font={font} position={position} anchorX={anchorX} anchorY="middle"
          fontSize={fontSize} color={color} letterSpacing={letterSpacing}>
      {`${prefix}${body}${suffix}`}
    </Text>
  )
}

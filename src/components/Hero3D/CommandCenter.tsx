import { useRef, useState } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { Dashboard3D } from './Dashboard3D'
import { FloatingMetric, type MetricSpec } from './FloatingMetric'
import { AttendanceVisualization } from './visualizations/AttendanceVisualization'
import { MemberVisualization } from './visualizations/MemberVisualization'
import { ROOM, C, type SceneBudget } from './sceneConfig'
import { scene, damp } from './sceneState'

/** Smooth 0→1 ramp between two scroll positions. */
const ramp = (t: number, a: number, b: number) => {
  const x = Math.max(0, Math.min(1, (t - a) / (b - a)))
  return x * x * (3 - 2 * x)
}

const PANELS: MetricSpec[] = [
  {
    id: 'members',
    label: 'Members',
    value: '1,284',
    delta: '+12.4%',
    detail: [
      { k: 'New this month', v: '62' },
      { k: 'On hold', v: '37' },
      { k: 'Avg. tenure', v: '14.2 mo' },
    ],
    position: [-4.15, 1.02, 1.35],
    depth: 1.0,
  },
  {
    id: 'attendance',
    label: "Today's attendance",
    value: '847',
    delta: '87.4%',
    detail: [
      { k: 'Peak hour', v: '7–8 PM' },
      { k: 'Active now', v: '212' },
      { k: 'At risk', v: '23' },
    ],
    position: [4.2, 0.86, 1.62],
    depth: 1.3,
  },
  {
    id: 'revenue',
    label: 'Revenue',
    value: '₹8.42L',
    delta: '+18.2%',
    detail: [
      { k: 'Monthly recurring', v: '₹11.96L' },
      { k: 'Pending payments', v: '₹64,200' },
      { k: 'Autopay active', v: '71%' },
    ],
    position: [-4.05, -0.92, 1.0],
    depth: 0.8,
  },
  {
    id: 'renewals',
    label: 'Renewals',
    value: '94.2%',
    delta: '47 due',
    detail: [
      { k: 'Likely to renew', v: '23' },
      { k: 'Needs a nudge', v: '16' },
      { k: 'Likely to lapse', v: '8' },
    ],
    position: [4.0, -1.05, 1.2],
    depth: 1.05,
    accent: C.signal,
  },
]

/**
 * The KINETIQ command centre — the digital business, standing where the
 * reception desk stands in the physical one.
 *
 * Reveals are quantised to tenths before they reach React. The underlying
 * value is continuous, but each visualisation damps toward whatever it is
 * handed, so ten steps is indistinguishable from sixty per second and costs
 * a tenth of the renders.
 */
export function CommandCenter({ budget }: { budget: SceneBudget }) {
  const group = useRef<THREE.Group>(null)
  const [r, setR] = useState({ dash: 0, members: 0, revenue: 0, attendance: 0 })
  const settle = useRef(0)

  useFrame((_, dt) => {
    const t = scene.scroll
    const next = {
      // The command centre is lit before the reader arrives at it — it is the
      // thing at the end of the room they are walking toward, so it cannot be
      // invisible in the establishing shot.
      dash: Math.round((0.42 + ramp(t, 0.06, 0.3) * 0.58) * 10) / 10,
      members: Math.round(ramp(t, 0.3, 0.48) * 10) / 10,
      revenue: Math.round(ramp(t, 0.48, 0.66) * 10) / 10,
      attendance: Math.round(ramp(t, 0.66, 0.84) * 10) / 10,
    }
    if (next.dash !== r.dash || next.members !== r.members || next.revenue !== r.revenue || next.attendance !== r.attendance) {
      setR(next)
    }

    const g = group.current
    if (!g) return
    // The rig settles into place as the camera closes on it, rather than
    // being parked at its final position from the first frame.
    settle.current = damp(settle.current, ramp(scene.scroll, 0.02, 0.26), 3, Math.min(dt, 0.05))
    g.position.y = ROOM.centre[1] - (1 - settle.current) * 0.55
    g.scale.setScalar(0.94 + settle.current * 0.06)
  })

  return (
    <group ref={group} position={[ROOM.centre[0], ROOM.centre[1], ROOM.centre[2]]}>
      {/* The columns belong to the dashboard, so they build with it. The
          revenue beat brings the camera to them and lights them. */}
      <Dashboard3D reveal={r.dash} revenueEmphasis={r.revenue} />

      {/* Attendance ring and the member constellation flank the surface,
          each at its own depth so the rig reads as a space, not a wall. */}
      <group position={[-2.95, -0.05, 0.42]}>
        <AttendanceVisualization active={r.attendance} />
      </group>
      <group position={[3.0, 0.0, 0.28]} scale={0.88}>
        <MemberVisualization active={r.members} count={budget.tier === 'low' ? 26 : 48} />
      </group>

      {budget.panels &&
        PANELS.map((p) => <FloatingMetric key={p.id} spec={p} showDetail={budget.tier !== 'low'} />)}
    </group>
  )
}

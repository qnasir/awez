import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import { REVENUE_SERIES } from '@/lib/content'
import { FONT_UI } from '../fonts'
import { C } from '../sceneConfig'
import { damp } from '../sceneState'

const COUNT = REVENUE_SERIES.length
const MAX = Math.max(...REVENUE_SERIES)
const GAP = 0.135
const BAR = 0.082
const TALL = 0.92

/**
 * Twelve months of revenue as columns standing on the command centre's floor.
 *
 * One InstancedMesh for all twelve: the whole chart is a single draw call, and
 * growing it is a matrix write per bar rather than twelve React updates. The
 * bars grow from their base because the base is where the floor is — a column
 * that scales about its centre reads as stretching, not building.
 */
export function RevenueVisualization({ active, emphasis = 0 }: { active: number; emphasis?: number }) {
  const mesh = useRef<THREE.InstancedMesh>(null)
  const grow = useRef(0)
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const mat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(C.volt),
        emissive: new THREE.Color(C.volt),
        emissiveIntensity: 0.55,
        roughness: 0.35,
        metalness: 0.1,
        transparent: true,
        opacity: 0,
      }),
    [],
  )
  useEffect(() => () => mat.dispose(), [mat])

  useFrame((_, dt) => {
    const d = Math.min(dt, 0.05)
    grow.current = damp(grow.current, active, 4, d)
    const g = grow.current
    mat.opacity = g * 0.95
    // The columns build with the dashboard and are *lit* by the revenue beat.
    // Tying height to the beat leaves a half-built chart sitting on the panel
    // for the whole approach, which reads as broken rather than as staged.
    mat.emissiveIntensity = 0.4 + emphasis * 0.75

    const m = mesh.current
    if (!m) return
    for (let i = 0; i < COUNT; i++) {
      // Each column starts a beat after the one before it, so the chart
      // builds left to right instead of inflating all at once.
      const local = Math.max(0, Math.min(1, (g - i * 0.022) / 0.68))
      const h = Math.max(0.001, (REVENUE_SERIES[i] / MAX) * TALL * local)
      dummy.position.set((i - (COUNT - 1) / 2) * GAP, h / 2, 0)
      dummy.scale.set(1, h, 1)
      dummy.updateMatrix()
      m.setMatrixAt(i, dummy.matrix)
    }
    m.instanceMatrix.needsUpdate = true
  })

  return (
    <group>
      <instancedMesh ref={mesh} args={[undefined, undefined, COUNT]} material={mat} frustumCulled={false}>
        <boxGeometry args={[BAR, 1, BAR]} />
      </instancedMesh>

      <Text font={FONT_UI} position={[-(COUNT - 1) / 2 * GAP, -0.14, 0]} anchorX="left" anchorY="middle"
            fontSize={0.062} letterSpacing={0.14} color="#7A828F" fillOpacity={active > 0.3 ? 0.9 : 0}>
        REVENUE · 12 MONTHS
      </Text>
    </group>
  )
}

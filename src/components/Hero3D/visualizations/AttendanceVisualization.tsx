import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import { FONT_DISPLAY, FONT_UI } from '../fonts'
import { C } from '../sceneConfig'
import { damp } from '../sceneState'

const TARGET = 0.874
const R = 0.52
const TUBE = 0.03

/**
 * Attendance as a ring that fills to today's rate.
 *
 * The arc is redrawn by swapping the torus geometry's draw range rather than
 * rebuilding it, so sweeping the ring costs an index count, not an allocation.
 */
export function AttendanceVisualization({ active }: { active: number }) {
  const arc = useRef<THREE.Mesh>(null)
  const fill = useRef(0)

  const geo = useMemo(() => new THREE.TorusGeometry(R, TUBE, 8, 128), [])
  const trackGeo = useMemo(() => new THREE.TorusGeometry(R, TUBE * 0.55, 6, 72), [])
  useEffect(() => () => { geo.dispose(); trackGeo.dispose() }, [geo, trackGeo])

  const mat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(C.volt),
        emissive: new THREE.Color(C.volt),
        emissiveIntensity: 0.8,
        roughness: 0.3,
        transparent: true,
        opacity: 0,
      }),
    [],
  )
  const trackMat = useMemo(
    () => new THREE.MeshBasicMaterial({ color: new THREE.Color('#222834'), transparent: true, opacity: 0 }),
    [],
  )
  useEffect(() => () => { mat.dispose(); trackMat.dispose() }, [mat, trackMat])

  const label = useRef<{ material: { opacity: number } } | null>(null)

  useFrame((_, dt) => {
    const d = Math.min(dt, 0.05)
    fill.current = damp(fill.current, active, 3.4, d)
    const f = fill.current
    mat.opacity = f
    trackMat.opacity = f * 0.9

    const a = arc.current
    if (a) {
      const total = geo.index!.count
      a.geometry.setDrawRange(0, Math.max(6, Math.floor(total * TARGET * f)))
      // A slow roll keeps the ring alive without spinning it like a loader.
      a.rotation.z = Math.PI / 2 - f * 0.12
    }
    if (label.current) label.current.material.opacity = Math.max(0, (f - 0.4) / 0.6)
  })

  return (
    <group>
      <mesh geometry={trackGeo} material={trackMat} rotation={[0, 0, Math.PI / 2]} />
      <mesh ref={arc} geometry={geo} material={mat} rotation={[0, 0, Math.PI / 2]} />
      <Text
        ref={(t) => { label.current = t as never }}
        font={FONT_DISPLAY} position={[0, 0.04, 0]} anchorX="center" anchorY="middle"
        fontSize={0.2} color={C.chalk} fillOpacity={0}
      >
        87.4%
      </Text>
      <Text font={FONT_UI} position={[0, -0.16, 0]} anchorX="center" anchorY="middle"
            fontSize={0.058} letterSpacing={0.14} color="#7A828F" fillOpacity={active > 0.4 ? 0.85 : 0}>
        ATTENDANCE
      </Text>
    </group>
  )
}

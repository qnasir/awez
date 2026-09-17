import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { ROOM, C, type SceneBudget } from './sceneConfig'
import { scene } from './sceneState'

/**
 * Members becoming data.
 *
 * Every particle is one person walking the room, and they all travel the same
 * direction: down the aisle, toward the command centre. That is the entire
 * argument of the product expressed as motion — activity on the floor turns
 * into signal in the software. It is emphatically not a starfield; particles
 * stay in the aisle, at roughly human height, moving at roughly walking pace.
 *
 * One BufferGeometry of points, advanced with a typed-array write per frame.
 */
export function ParticleSystem({ budget }: { budget: SceneBudget }) {
  const count = budget.flowParticles
  const points = useRef<THREE.Points>(null)

  const { geo, speeds, offsets } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const speeds = new Float32Array(count)
    const offsets = new Float32Array(count)
    const start = ROOM.bayStart + 8
    const end = ROOM.centre[2]

    for (let i = 0; i < count; i++) {
      const lane = (i % 7) / 6 - 0.5
      positions[i * 3] = lane * ROOM.aisle * 1.7
      positions[i * 3 + 1] = 0.3 + ((i * 13) % 11) / 11 * 1.25
      positions[i * 3 + 2] = end + ((i * 37) % 100) / 100 * (start - end)
      speeds[i] = 1.6 + ((i * 29) % 13) / 13 * 1.9
      offsets[i] = ((i * 19) % 31) / 31
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return { geo, speeds, offsets }
  }, [count])

  const mat = useMemo(
    () =>
      new THREE.PointsMaterial({
        color: new THREE.Color(C.volt),
        size: 0.03,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.5,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [],
  )
  useEffect(() => () => { geo.dispose(); mat.dispose() }, [geo, mat])

  useFrame((_, dt) => {
    const d = Math.min(dt, 0.05)
    const pos = geo.getAttribute('position') as THREE.BufferAttribute
    const arr = pos.array as Float32Array
    const start = ROOM.bayStart + 8
    const end = ROOM.centre[2]

    for (let i = 0; i < count; i++) {
      const zi = i * 3 + 2
      arr[zi] -= speeds[i] * d
      if (arr[zi] < end) {
        // Recycled to the far end rather than reallocated.
        arr[zi] = start
        arr[i * 3] = ((i % 7) / 6 - 0.5) * ROOM.aisle * 1.7 + (offsets[i] - 0.5) * 0.5
      }
    }
    pos.needsUpdate = true

    // The flow is faint while the room is physical and asserts itself as the
    // gym turns digital — data was always there, the software makes it visible.
    mat.opacity = 0.14 + scene.digital * 0.42
    mat.size = 0.026 + scene.digital * 0.016
  })

  return <points ref={points} geometry={geo} material={mat} frustumCulled={false} />
}

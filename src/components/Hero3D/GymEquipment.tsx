import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { getGeometry, getEdges, type EquipmentKind } from './geometry'
import { ROOM, C, type SceneBudget } from './sceneConfig'
import { scene } from './sceneState'

type Placement = {
  kind: EquipmentKind
  position: [number, number, number]
  rotation: number
}

/** Deterministic dressing — the room is composed, not randomised per reload. */
function layout(bays: number, deep: boolean): Placement[] {
  const left: EquipmentKind[] = ['rack', 'treadmill', 'cable', 'bench', 'plates']
  const right: EquipmentKind[] = ['dumbbells', 'plates', 'bench', 'treadmill', 'cable']
  const out: Placement[] = []

  for (let i = 0; i < bays; i++) {
    const z = ROOM.bayStart - i * ROOM.baySpacing
    // The command centre needs clear floor around it; a squat rack growing
    // through a floating dashboard is the fastest way to break the illusion.
    if (Math.abs(z - ROOM.centre[2]) < 4.5) continue
    const x = ROOM.aisle + 1.5 + (i % 2) * 0.35
    // Treadmills line up facing down the room the way they actually do;
    // everything else turns in toward the aisle.
    const face = (k: EquipmentKind, side: number) =>
      k === 'treadmill' ? Math.PI : side * Math.PI * 0.5

    const lk = left[i % left.length]
    const rk = right[i % right.length]
    out.push({ kind: lk, position: [-x, 0, z], rotation: face(lk, 1) })
    out.push({ kind: rk, position: [x, 0, z - 2.1], rotation: face(rk, -1) })

    // A second row against the walls. Density is what separates a gym floor
    // from a showroom with four machines in it, and these sit far enough out
    // that they cost silhouette rather than detail.
    if (deep && i % 2 === 0) {
      const dk = left[(i + 2) % left.length]
      const ek = right[(i + 3) % right.length]
      out.push({ kind: dk, position: [-(x + 2.2), 0, z - 3.1], rotation: face(dk, 1) })
      out.push({ kind: ek, position: [x + 2.2, 0, z + 0.6], rotation: face(ek, -1) })
    }
  }
  return out
}

/**
 * The physical gym.
 *
 * One material instance is shared by every machine and mutated in the frame
 * loop. The transformation is a property of the room, not of each object, so
 * it costs a single uniform update no matter how many machines are standing
 * in it — and there is no per-object React state to keep in sync.
 */
export function GymEquipment({ budget }: { budget: SceneBudget }) {
  const geo = getGeometry()
  const placements = useMemo(() => layout(budget.bays, budget.deepScenery), [budget.bays, budget.deepScenery])

  const solid = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#161A22'),
        roughness: 0.48,
        metalness: 0.88,
        emissive: new THREE.Color(C.volt),
        emissiveIntensity: 0,
        transparent: true,
      }),
    [],
  )

  const wire = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: new THREE.Color(C.volt),
        transparent: true,
        opacity: 0,
        depthWrite: false,
      }),
    [],
  )

  useEffect(() => () => { solid.dispose(); wire.dispose() }, [solid, wire])

  useFrame(() => {
    const d = scene.digital
    // The mass recedes as the schematic takes over but never vanishes — the
    // business stays physical underneath the software.
    solid.opacity = 1 - d * 0.55
    solid.emissiveIntensity = d * 0.09
    wire.opacity = 0.14 + d * 0.8
  })

  return (
    <group>
      {placements.map((p, i) => (
        <group key={i} position={p.position} rotation={[0, p.rotation, 0]}>
          <mesh geometry={geo[p.kind]} material={solid} />
          {budget.edges && <lineSegments geometry={getEdges(p.kind)} material={wire} />}
        </group>
      ))}

      {/* Reception: where a member meets the business, and where the command
          centre grows out of once the room turns digital. */}
      <group position={[-5.4, 0, ROOM.bayStart + 5.5]} rotation={[0, Math.PI * 0.62, 0]}>
        <mesh geometry={geo.reception} material={solid} />
        {budget.edges && <lineSegments geometry={getEdges('reception')} material={wire} />}
      </group>
    </group>
  )
}

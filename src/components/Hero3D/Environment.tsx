import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { Grid } from '@react-three/drei'
import { useRoomEnvironment } from './useRoomEnvironment'
import { getGeometry, getEdges } from './geometry'
import { ROOM, C, type SceneBudget } from './sceneConfig'
import { scene } from './sceneState'

/**
 * Overhead light bars.
 *
 * These do the heaviest lifting in the composition: a receding row of bright
 * horizontals is what makes the volume read as a long room rather than a dark
 * backdrop, and it gives the camera something to travel past. Each bar is an
 * emissive plane, not a light — six real area lights would cost far more than
 * they return in a scene this dark.
 *
 * A dimmer copy sits mirrored below the floor line. It costs one extra plane
 * per bar and reads as a wet-looking polished floor, where a genuine
 * reflection pass would cost a second render of the whole scene.
 */
function LightBars({ count }: { count: number }) {
  const bars = useMemo(
    () => Array.from({ length: count }, (_, i) => ROOM.bayStart + 2 - i * ROOM.baySpacing * 0.78),
    [count],
  )

  const glow = useMemo(
    () => new THREE.MeshBasicMaterial({ color: new THREE.Color('#D9E4F2'), transparent: true, opacity: 0.8 }),
    [],
  )
  const echo = useMemo(
    () => new THREE.MeshBasicMaterial({ color: new THREE.Color('#5E6E8A'), transparent: true, opacity: 0.07, depthWrite: false }),
    [],
  )
  useEffect(() => () => { glow.dispose(); echo.dispose() }, [glow, echo])

  useFrame(() => {
    // As the room turns digital the ceiling light resolves into data lines:
    // cooler, tighter, more signal than illumination.
    const d = scene.digital
    // The ceiling light resolves from warm-neutral illumination into cool
    // signal as the room turns digital.
    glow.color.setRGB(0.85 - d * 0.1, 0.89 + d * 0.03, 0.95 + d * 0.05)
    glow.opacity = 0.52 - d * 0.14
    echo.opacity = 0.07
  })

  return (
    <group>
      {bars.map((z, i) => (
        <group key={i}>
          <mesh position={[0, ROOM.ceiling, z]} rotation={[Math.PI / 2, 0, 0]} material={glow}>
            <planeGeometry args={[4.0, 0.13]} />
          </mesh>
          <mesh position={[0, 0.012, z]} rotation={[-Math.PI / 2, 0, 0]} material={echo}>
            <planeGeometry args={[5.4, 2.6]} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

/** Members on the floor — a presence, deliberately never a character. */
function Figures({ budget }: { budget: SceneBudget }) {
  const geo = getGeometry()
  const mat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#05070B'),
        roughness: 1,
        metalness: 0,
        // No environment response at all: the moment a figure catches a
        // specular highlight it stops being a silhouette and starts being a
        // mannequin, which is exactly the tone this scene cannot afford.
        envMapIntensity: 0,
        transparent: true,
        opacity: 0.88,
      }),
    [],
  )
  const wire = useMemo(
    () => new THREE.LineBasicMaterial({ color: new THREE.Color(C.signal), transparent: true, opacity: 0, depthWrite: false }),
    [],
  )
  useEffect(() => () => { mat.dispose(); wire.dispose() }, [mat, wire])

  const people = useMemo(
    () =>
      (
        [
          [-2.6, -3.2, 0.35],
          [2.75, -8.6, -0.5],
          [-2.5, -15.0, 0.2],
          [3.0, -0.4, -0.9],
        ] as const
      ).slice(0, budget.tier === 'low' ? 2 : 4),
    [budget.tier],
  )

  useFrame(() => {
    const d = scene.digital
    mat.opacity = 0.88 - d * 0.42
    // Members are the one thing that turns *cool* rather than volt — they are
    // the input to the system, not part of it.
    wire.opacity = d * 0.7
  })

  return (
    <group>
      {people.map(([x, z, r], i) => (
        <group key={i} position={[x, 0, z]} rotation={[0, r, 0]} scale={0.94}>
          <mesh geometry={geo.figure} material={mat} />
          {budget.edges && <lineSegments geometry={getEdges('figure')} material={wire} />}
        </group>
      ))}
    </group>
  )
}

/**
 * The room: floor, grid, ceiling light, fog and the light rig.
 *
 * Six lights total. In a volume this dark, form comes from a strong key and a
 * cold rim — adding more lights flattens it and costs per-fragment work on
 * every material in the scene.
 */
export function Environment({ budget }: { budget: SceneBudget }) {
  useRoomEnvironment()

  const floorMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#0A0C11'),
        roughness: 0.72,
        metalness: 0.18,
      }),
    [],
  )
  const shellMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#0A0C11'),
        roughness: 0.94,
        metalness: 0.04,
        side: THREE.DoubleSide,
      }),
    [],
  )
  const ceilMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#070910'),
        roughness: 1,
        metalness: 0,
        side: THREE.DoubleSide,
      }),
    [],
  )

  useEffect(
    () => () => { floorMat.dispose(); shellMat.dispose(); ceilMat.dispose() },
    [floorMat, shellMat, ceilMat],
  )

  const gridRef = useMemo(() => ({ current: null as THREE.Mesh | null }), [])

  useFrame(() => {
    const d = scene.digital
    floorMat.roughness = 0.72 - d * 0.22
    const g = gridRef.current
    if (g) {
      const m = g.material as THREE.Material & { opacity: number }
      // The grid is nearly invisible while the room is physical and asserts
      // itself as the floor becomes a data surface.
      m.opacity = 0.22 + d * 0.62
    }
  })

  return (
    <group>
      <fog attach="fog" args={[C.void, ROOM.fogNear, ROOM.fogFar]} />
      <color attach="background" args={[C.void]} />

      {/* --- Light rig ---
          Four lights. The accent is never a room light: volt appears only as
          emissive surface and as one tight pool around the command centre.
          Lighting a whole room in the brand colour is what makes a 3D scene
          read as a demo rather than a product shot. */}
      <ambientLight intensity={0.72} color="#8E9AB8" />
      {/* Key: high and forward, giving the machines their top planes */}
      <directionalLight position={[4, 11, 8]} intensity={2.2} color="#E4ECF7" />
      {/* Cold rim from behind separates the silhouettes from the fog.
          Kept desaturated — a saturated rim on a broad floor reads as a
          coloured splotch rather than as light. */}
      <directionalLight position={[-7, 5, -22]} intensity={0.3} color="#8E9BD6" />
      {/* Three of the ceiling strips are real lights, so the machines beneath
          them are actually lit. The rest are emissive geometry only. */}
      <pointLight position={[0, ROOM.ceiling - 1.15, 3]} intensity={20} distance={15} decay={2} color="#D7E2F2" />
      <pointLight position={[0, ROOM.ceiling - 1.15, -5]} intensity={17} distance={15} decay={2} color="#D7E2F2" />
      <pointLight position={[0, ROOM.ceiling - 1.15, -14]} intensity={14} distance={14} decay={2} color="#C8D6EC" />
      {/* The command centre lights its own few metres and nothing else */}
      <pointLight position={[0, 2.3, ROOM.centre[2] + 2.4]} intensity={9} distance={10} decay={2} color={C.volt} />

      {/* --- Shell ---
          Dark, matte and barely lit. Its job is not to be seen but to give
          the fog something to sit against and the light bars something to be
          mounted on. Without it every object floats in black. */}
      <group>
        {/* Side walls */}
        {[-1, 1].map((s) => (
          <mesh key={s} position={[s * ROOM.halfWidth, ROOM.ceiling / 2, (ROOM.back + ROOM.front) / 2]}
                rotation={[0, -s * Math.PI / 2, 0]} material={shellMat}>
            <planeGeometry args={[ROOM.front - ROOM.back, ROOM.ceiling * 2.1]} />
          </mesh>
        ))}
        {/* Ceiling */}
        <mesh position={[0, ROOM.ceiling + 0.55, (ROOM.back + ROOM.front) / 2]} rotation={[Math.PI / 2, 0, 0]} material={ceilMat}>
          <planeGeometry args={[ROOM.halfWidth * 2, ROOM.front - ROOM.back]} />
        </mesh>
        {/* Back wall, beyond the command centre */}
        <mesh position={[0, ROOM.ceiling / 2, ROOM.back]} material={shellMat}>
          <planeGeometry args={[ROOM.halfWidth * 2, ROOM.ceiling * 2.1]} />
        </mesh>
      </group>

      {/* --- Floor --- */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -12]} material={floorMat}>
        <planeGeometry args={[70, 90]} />
      </mesh>

      {budget.tier !== 'low' ? (
        <Grid
          ref={(r) => { gridRef.current = r as unknown as THREE.Mesh }}
          position={[0, 0.006, -12]}
          args={[70, 90]}
          cellSize={0.6}
          cellThickness={0.5}
          cellColor="#0F141C"
          sectionSize={3}
          sectionThickness={1}
          sectionColor="#1C2634"
          fadeDistance={54}
          fadeStrength={1.4}
          followCamera={false}
          infiniteGrid={false}
        />
      ) : (
        <Grid
          ref={(r) => { gridRef.current = r as unknown as THREE.Mesh }}
          position={[0, 0.006, -10]}
          args={[40, 60]}
          cellSize={1.2}
          cellThickness={0.6}
          cellColor="#0F141C"
          sectionSize={4.8}
          sectionThickness={1}
          sectionColor="#1C2634"
          fadeDistance={40}
          fadeStrength={1.5}
          followCamera={false}
          infiniteGrid={false}
        />
      )}

      <LightBars count={budget.lightBars} />
      <Figures budget={budget} />
    </group>
  )
}

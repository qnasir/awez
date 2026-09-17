import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import { FONT_UI } from '../fonts'
import { C } from '../sceneConfig'
import { damp, scene } from '../sceneState'

/**
 * The member base, as a constellation of nodes with the strongest
 * relationships drawn between them.
 *
 * This is the one visualisation that is not a chart: a membership is a set of
 * people, not a magnitude, and drawing it as a bar would say the wrong thing.
 * Nodes drift on their own phase so the cloud breathes; the link lines are a
 * single LineSegments buffer rewritten in place.
 */
export function MemberVisualization({ active, count = 48 }: { active: number; count?: number }) {
  const mesh = useRef<THREE.InstancedMesh>(null)
  const links = useRef<THREE.LineSegments>(null)
  const show = useRef(0)
  const dummy = useMemo(() => new THREE.Object3D(), [])

  // A deterministic cloud — the same shape every load, never a random scatter.
  const seeds = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const golden = 2.399963
        const a = i * golden
        const r = 0.14 + Math.sqrt(i / count) * 0.72
        return {
          x: Math.cos(a) * r,
          y: Math.sin(a) * r * 0.66,
          z: Math.sin(a * 1.7) * 0.22,
          phase: (i % 17) * 0.37,
          size: 0.016 + ((i * 7) % 5) * 0.004,
        }
      }),
    [count],
  )

  // Link the nearest handful of neighbours once, not every frame.
  const pairs = useMemo(() => {
    const out: [number, number][] = []
    for (let i = 0; i < seeds.length; i += 3) {
      const j = (i + 5) % seeds.length
      const dx = seeds[i].x - seeds[j].x
      const dy = seeds[i].y - seeds[j].y
      if (Math.hypot(dx, dy) < 0.6) out.push([i, j])
    }
    return out
  }, [seeds])

  const linkGeo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(pairs.length * 6), 3))
    return g
  }, [pairs.length])

  const nodeMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({ color: new THREE.Color(C.signal), transparent: true, opacity: 0 }),
    [],
  )
  const linkMat = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: new THREE.Color(C.signal),
        transparent: true,
        opacity: 0,
        depthWrite: false,
      }),
    [],
  )
  useEffect(() => () => { linkGeo.dispose(); nodeMat.dispose(); linkMat.dispose() }, [linkGeo, nodeMat, linkMat])

  useFrame((_, dt) => {
    const d = Math.min(dt, 0.05)
    show.current = damp(show.current, active, 3.2, d)
    const s = show.current
    nodeMat.opacity = s * 0.95
    linkMat.opacity = s * 0.3

    const m = mesh.current
    if (!m) return
    const t = scene.elapsed
    const pos = linkGeo.getAttribute('position') as THREE.BufferAttribute
    const px: number[] = []
    const py: number[] = []
    const pz: number[] = []

    for (let i = 0; i < seeds.length; i++) {
      const sd = seeds[i]
      const drift = Math.sin(t * 0.55 + sd.phase) * 0.035
      const x = sd.x
      const y = sd.y + drift
      const z = sd.z + Math.cos(t * 0.4 + sd.phase) * 0.03
      px[i] = x; py[i] = y; pz[i] = z
      dummy.position.set(x, y, z)
      const pop = Math.max(0, Math.min(1, (s - (i / seeds.length) * 0.35) / 0.4))
      dummy.scale.setScalar(sd.size * pop * 30)
      dummy.updateMatrix()
      m.setMatrixAt(i, dummy.matrix)
    }
    m.instanceMatrix.needsUpdate = true

    for (let k = 0; k < pairs.length; k++) {
      const [a, b] = pairs[k]
      pos.setXYZ(k * 2, px[a], py[a], pz[a])
      pos.setXYZ(k * 2 + 1, px[b], py[b], pz[b])
    }
    pos.needsUpdate = true
  })

  return (
    <group>
      <instancedMesh ref={mesh} args={[undefined, undefined, count]} material={nodeMat} frustumCulled={false}>
        <sphereGeometry args={[0.001, 6, 5]} />
      </instancedMesh>
      <lineSegments ref={links} geometry={linkGeo} material={linkMat} frustumCulled={false} />
      <Text font={FONT_UI} position={[0, -0.72, 0]} anchorX="center" anchorY="middle"
            fontSize={0.058} letterSpacing={0.14} color="#7A828F" fillOpacity={active > 0.4 ? 0.85 : 0}>
        1,284 ACTIVE MEMBERS
      </Text>
    </group>
  )
}

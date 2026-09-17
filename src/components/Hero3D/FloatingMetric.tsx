import { useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import { panelGeometry, borderGeometry } from './panelGeometry'
import { FONT_DISPLAY, FONT_UI } from './fonts'
import { C } from './sceneConfig'
import { scene, damp } from './sceneState'

export type MetricSpec = {
  id: string
  label: string
  value: string
  delta?: string
  /** Revealed on hover — the layer of software under the headline number. */
  detail: { k: string; v: string }[]
  position: [number, number, number]
  /** Higher = nearer the viewer, so it parallaxes further. */
  depth: number
  accent?: string
}

const W = 1.68
const H_FULL = 1.38
const H_REST = 0.8

type TextMesh = THREE.Mesh<THREE.BufferGeometry, THREE.Material & { opacity: number }>

/**
 * One floating KPI panel.
 *
 * Panels are real geometry at real depths rather than a flat HUD, so the
 * parallax on pointer move is genuine perspective — a near panel sweeps
 * further than a far one because it *is* nearer, not because it was handed a
 * bigger multiplier.
 *
 * Hover opens the layer of software beneath the headline number: the panel
 * grows downward from a fixed top edge, its border lights, and the supporting
 * rows fade up in sequence. The panel body is one geometry scaled on Y rather
 * than a second mesh, so opening costs no allocation.
 */
export function FloatingMetric({ spec, showDetail }: { spec: MetricSpec; showDetail: boolean }) {
  const group = useRef<THREE.Group>(null)
  const body = useRef<THREE.Group>(null)
  const rows = useRef<(TextMesh | null)[]>([])
  const [hovered, setHovered] = useState(false)
  const accent = spec.accent ?? C.volt

  const fill = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color('#0A0D13'),
        transparent: true,
        opacity: 0.84,
        depthWrite: false,
      }),
    [],
  )
  const border = useMemo(
    () => new THREE.LineBasicMaterial({ color: new THREE.Color(accent), transparent: true, opacity: 0.3 }),
    [accent],
  )

  const open = useRef(0)
  const detail = useRef<THREE.Group>(null)

  useFrame((_, dt) => {
    const g = group.current
    if (!g) return
    const d = Math.min(dt, 0.05)
    open.current = damp(open.current, hovered ? 1 : 0, 9, d)
    const o = open.current

    // Parallax: depth drives how far the panel swings with the pointer.
    const p = spec.depth
    const bob = Math.sin(scene.elapsed * 0.7 + spec.position[0] * 2) * 0.016
    // The hovered panel stops drifting so it can actually be caught.
    const drift = hovered ? 0.25 : 1
    g.position.x = spec.position[0] + scene.pointerX * 0.13 * p * drift
    g.position.y = spec.position[1] + bob - scene.pointerY * 0.09 * p * drift
    g.position.z = spec.position[2] + o * 0.34

    g.rotation.y = damp(g.rotation.y, -scene.pointerX * 0.11, 6, d)
    g.rotation.x = damp(g.rotation.x, scene.pointerY * 0.08, 6, d)
    g.scale.setScalar(1 + o * 0.04)

    // Grow downward: scale on Y, then offset so the top edge never moves.
    const k = (H_REST + (H_FULL - H_REST) * o) / H_FULL
    if (body.current) {
      body.current.scale.y = k
      body.current.position.y = (H_FULL / 2) * (1 - k)
    }

    border.opacity = 0.3 + o * 0.62
    fill.opacity = 0.84 + o * 0.1

    // Troika composes fill opacity into its own uniform, so writing
    // material.opacity does not hide the glyphs. The rows ride the panel's
    // own opening instead — they slide up into the space it makes.
    rows.current.forEach((t, i) => {
      if (!t) return
      const stagger = Math.max(0, Math.min(1, (o - 0.45 - i * 0.12) / 0.4))
      t.position.y = -0.03 - i * 0.118 - (1 - stagger) * 0.05
    })
    // The rows wait until the panel has actually made room for them. Revealing
    // them as the panel starts to grow leaves text hanging below its border.
    if (detail.current) detail.current.visible = o > 0.5
  })

  const top = H_FULL / 2

  return (
    <group ref={group} position={spec.position}>
      <group ref={body}>
        <mesh
          geometry={panelGeometry(W, H_FULL, 0.08)}
          material={fill}
          onPointerOver={(e) => { e.stopPropagation(); setHovered(true); scene.hovered = spec.id }}
          onPointerOut={() => { setHovered(false); if (scene.hovered === spec.id) scene.hovered = null }}
        />
        <lineLoop geometry={borderGeometry(W, H_FULL, 0.08)} material={border} />
      </group>

      {/* Accent tick — the one piece of colour that identifies the metric */}
      <mesh position={[-W / 2 + 0.15, top - 0.15, 0.003]}>
        <planeGeometry args={[0.05, 0.05]} />
        <meshBasicMaterial color={accent} transparent opacity={0.95} />
      </mesh>

      <Text font={FONT_UI} position={[-W / 2 + 0.25, top - 0.15, 0.005]} anchorX="left" anchorY="middle"
            fontSize={0.068} letterSpacing={0.15} color="#8A92A0">
        {spec.label.toUpperCase()}
      </Text>

      <Text font={FONT_DISPLAY} position={[-W / 2 + 0.16, top - 0.38, 0.005]} anchorX="left" anchorY="middle"
            fontSize={0.215} letterSpacing={-0.025} color={C.chalk}>
        {spec.value}
      </Text>

      {spec.delta && (
        <Text font={FONT_UI} position={[W / 2 - 0.16, top - 0.38, 0.005]} anchorX="right" anchorY="middle"
              fontSize={0.075} color={accent}>
          {spec.delta}
        </Text>
      )}

      {showDetail && (
        <group ref={detail} position={[0, top - 0.6, 0.005]} visible={false}>
          {spec.detail.map((row, i) => (
            <group key={row.k}>
              <Text
                ref={(t) => { rows.current[i * 2] = t as unknown as TextMesh }}
                font={FONT_UI} position={[-W / 2 + 0.16, -0.04 - i * 0.135, 0]}
                anchorX="left" anchorY="middle" fontSize={0.062} color="#7A828F"
              >
                {row.k}
              </Text>
              <Text
                ref={(t) => { rows.current[i * 2 + 1] = t as unknown as TextMesh }}
                font={FONT_UI} position={[W / 2 - 0.16, -0.04 - i * 0.135, 0]}
                anchorX="right" anchorY="middle" fontSize={0.062} color={C.chalk}
              >
                {row.v}
              </Text>
            </group>
          ))}
        </group>
      )}
    </group>
  )
}

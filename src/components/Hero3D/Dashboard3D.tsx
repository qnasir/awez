import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import { panelGeometry, borderGeometry } from './panelGeometry'
import { CountText } from './CountText'
import { RevenueVisualization } from './visualizations/RevenueVisualization'
import { FONT_DISPLAY, FONT_UI } from './fonts'
import { C } from './sceneConfig'
import { damp, scene } from './sceneState'

const W = 4.9
const H = 2.72

type Tile = {
  label: string
  to: number
  prefix?: string
  suffix?: string
  decimals?: number
  delta: string
}

const TILES: Tile[] = [
  { label: 'Revenue', to: 842500, prefix: '₹', delta: '+18.2%' },
  { label: 'Active members', to: 1284, delta: '+12.4%' },
  { label: 'Attendance', to: 87.4, suffix: '%', decimals: 1, delta: '847 today' },
  { label: 'Renewals', to: 94.2, suffix: '%', decimals: 1, delta: '47 due' },
]

/**
 * The KINETIQ command centre's main surface.
 *
 * Built from layered geometry rather than a screenshot on a quad: the
 * backplate, the panel face, the tile row and the revenue columns all sit at
 * different z, so the interface has genuine parallax and catches the room's
 * light at its own angle. The columns physically stand off the panel face —
 * that separation is the whole reason to render a dashboard in 3D at all.
 */
export function Dashboard3D({ reveal, revenueEmphasis }: { reveal: number; revenueEmphasis: number }) {
  const group = useRef<THREE.Group>(null)
  const shown = useRef(0)

  const back = useMemo(
    () => new THREE.MeshBasicMaterial({ color: new THREE.Color('#080A0E'), transparent: true, opacity: 0, depthWrite: false }),
    [],
  )
  const face = useMemo(
    () => new THREE.MeshBasicMaterial({ color: new THREE.Color('#0B0E14'), transparent: true, opacity: 0, depthWrite: false }),
    [],
  )
  const rim = useMemo(
    () => new THREE.LineBasicMaterial({ color: new THREE.Color(C.volt), transparent: true, opacity: 0 }),
    [],
  )
  const tileMat = useMemo(
    () => new THREE.MeshBasicMaterial({ color: new THREE.Color('#10141C'), transparent: true, opacity: 0, depthWrite: false }),
    [],
  )
  useEffect(() => () => { back.dispose(); face.dispose(); rim.dispose(); tileMat.dispose() }, [back, face, rim, tileMat])

  useFrame((_, dt) => {
    const d = Math.min(dt, 0.05)
    shown.current = damp(shown.current, reveal, 3.6, d)
    const s = shown.current
    back.opacity = s * 0.88
    face.opacity = s * 0.72
    rim.opacity = s * 0.5
    tileMat.opacity = s * 0.85

    const g = group.current
    if (!g) return
    // The whole surface leans very slightly into the pointer, as one object.
    g.rotation.y = damp(g.rotation.y, -scene.pointerX * 0.07, 5, d)
    g.rotation.x = damp(g.rotation.x, scene.pointerY * 0.05, 5, d)
    g.position.y = Math.sin(scene.elapsed * 0.45) * 0.014
  })

  const tileW = 1.06
  const tileH = 0.72
  const top = H / 2

  return (
    <group ref={group}>
      {/* Backplate, set behind the face so the panel has a shoulder */}
      <mesh geometry={panelGeometry(W + 0.5, H + 0.42, 0.14)} material={back} position={[0, 0, -0.26]} />
      <mesh geometry={panelGeometry(W, H, 0.1)} material={face} />
      <lineLoop geometry={borderGeometry(W, H, 0.1)} material={rim} position={[0, 0, 0.002]} />

      {/* Header */}
      <Text font={FONT_UI} position={[-W / 2 + 0.26, top - 0.26, 0.01]} anchorX="left" anchorY="middle"
            fontSize={0.082} letterSpacing={0.2} color="#8A92A0" fillOpacity={reveal > 0.2 ? 1 : 0}>
        KINETIQ · COMMAND CENTRE
      </Text>
      <mesh position={[W / 2 - 0.3, top - 0.26, 0.01]}>
        <circleGeometry args={[0.028, 12]} />
        <meshBasicMaterial color={C.volt} transparent opacity={reveal > 0.2 ? 0.95 : 0} />
      </mesh>
      <Text font={FONT_UI} position={[W / 2 - 0.38, top - 0.26, 0.01]} anchorX="right" anchorY="middle"
            fontSize={0.07} letterSpacing={0.14} color={C.volt} fillOpacity={reveal > 0.2 ? 0.9 : 0}>
        LIVE
      </Text>

      {/* KPI tile row */}
      {TILES.map((t, i) => {
        const x = (i - (TILES.length - 1) / 2) * (tileW + 0.12)
        const y = top - 0.72
        return (
          <group key={t.label} position={[x, y, 0.012]}>
            <mesh geometry={panelGeometry(tileW, tileH, 0.05)} material={tileMat} />
            <Text font={FONT_UI} position={[-tileW / 2 + 0.1, tileH / 2 - 0.13, 0.004]} anchorX="left" anchorY="middle"
                  fontSize={0.055} letterSpacing={0.12} color="#7A828F" fillOpacity={reveal > 0.25 ? 1 : 0}>
              {t.label.toUpperCase()}
            </Text>
            <CountText
              to={t.to} prefix={t.prefix} suffix={t.suffix} decimals={t.decimals} active={reveal}
              font={FONT_DISPLAY} fontSize={0.155} color={C.chalk} letterSpacing={-0.02}
              position={[-tileW / 2 + 0.1, tileH / 2 - 0.36, 0.004]}
            />
            <Text font={FONT_UI} position={[-tileW / 2 + 0.1, tileH / 2 - 0.56, 0.004]} anchorX="left" anchorY="middle"
                  fontSize={0.05} color={C.volt} fillOpacity={reveal > 0.35 ? 0.95 : 0}>
              {t.delta}
            </Text>
          </group>
        )
      })}

      {/* Revenue columns standing proud of the panel face */}
      <group position={[0, -H / 2 + 0.42, 0.2]}>
        <RevenueVisualization active={reveal} emphasis={revenueEmphasis} />
      </group>
    </group>
  )
}

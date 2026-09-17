import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { Canvas } from '@react-three/fiber'
import { SceneDriver } from './SceneDriver'
import { HeroCamera } from './HeroCamera'
import { Environment } from './Environment'
import { GymEquipment } from './GymEquipment'
import { CommandCenter } from './CommandCenter'
import { ParticleSystem } from './ParticleSystem'
import { disposeGeometry } from './geometry'
import { disposePanels } from './panelGeometry'
import type { SceneBudget } from './sceneConfig'

/**
 * The WebGL hero.
 *
 * Rendering stops entirely when the canvas leaves the viewport or the tab is
 * hidden. A 3D hero that keeps drawing while the reader is eight sections
 * further down the page is the most expensive mistake available here, and it
 * is invisible in every profile taken at the top of the page.
 */
export default function GymScene({ budget, className }: { budget: SceneBudget; className?: string }) {
  const host = useRef<HTMLDivElement>(null)
  const [running, setRunning] = useState(true)
  const [lost, setLost] = useState(false)

  useEffect(() => {
    const el = host.current
    if (!el) return
    let onScreen = true

    const sync = () => setRunning(onScreen && !document.hidden)
    const io = new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; sync() }, { threshold: 0 })
    io.observe(el)
    document.addEventListener('visibilitychange', sync)

    return () => { io.disconnect(); document.removeEventListener('visibilitychange', sync) }
  }, [])

  // Geometry is module-level and shared; it is released when the hero unmounts.
  useEffect(() => () => { disposeGeometry(); disposePanels() }, [])

  if (lost) return null

  return (
    // Decorative: every number and claim the scene renders is also stated in
    // real DOM text beside it, so the canvas is hidden from assistive tech
    // rather than given a label that could only ever be a poor summary.
    <div ref={host} aria-hidden className={className ?? 'absolute inset-0'}>
      <Canvas
        frameloop={running ? 'always' : 'never'}
        dpr={budget.dpr}
        gl={{
          antialias: budget.antialias,
          powerPreference: 'high-performance',
          alpha: false,
          stencil: false,
          depth: true,
        }}
        camera={{ fov: 46, near: 0.1, far: 110, position: [0, 2.9, 27] }}
        onCreated={({ gl, scene: three }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping
          gl.toneMappingExposure = 1.25
          gl.outputColorSpace = THREE.SRGBColorSpace
          three.matrixWorldAutoUpdate = true
          // A lost context on a marketing page should degrade to the 2.5D
          // hero, never to a black rectangle.
          gl.domElement.addEventListener('webglcontextlost', (e) => {
            e.preventDefault()
            setLost(true)
          })
        }}
      >
        {/* First in the tree so its frame callback runs before every consumer */}
        <SceneDriver />
        <HeroCamera aimY={budget.tier === 'low' ? -0.12 : 0} tStart={budget.tier === 'low' ? 0.24 : 0} />
        <Environment budget={budget} />
        <GymEquipment budget={budget} />
        <CommandCenter budget={budget} />
        <ParticleSystem budget={budget} />
      </Canvas>
    </div>
  )
}

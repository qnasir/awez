import { useEffect } from 'react'
import * as THREE from 'three'
import { useThree } from '@react-three/fiber'

/**
 * A procedural environment map for the room.
 *
 * Metal is nothing but reflections. Without an environment to reflect, a
 * high-metalness material renders almost black and the machines read as flat
 * cut-outs — which is the single biggest reason hand-built 3D scenes look
 * like developer demos next to product renders.
 *
 * Rather than fetch a 1–4 MB HDRI, this paints a 64×32 gradient with a bright
 * band where the ceiling strips are and runs it through PMREM. It costs a few
 * kilobytes of canvas and one prefilter pass at mount, and it gives every
 * metal surface a horizon, a sky and a specular highlight to catch.
 */
export function useRoomEnvironment() {
  const gl = useThree((s) => s.gl)
  const three = useThree((s) => s.scene)

  useEffect(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 64
    canvas.height = 32
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const g = ctx.createLinearGradient(0, 0, 0, 32)
    g.addColorStop(0, '#39445C')   // ceiling bounce
    g.addColorStop(0.34, '#1A2130')
    g.addColorStop(0.5, '#0C1017')  // horizon
    g.addColorStop(1, '#05060A')    // floor
    ctx.fillStyle = g
    ctx.fillRect(0, 0, 64, 32)

    // The ceiling strips, as the highlight metal will actually mirror.
    ctx.fillStyle = 'rgba(214,228,248,0.95)'
    ctx.fillRect(0, 3, 64, 3)
    // A cold kick from one side keeps highlights from being perfectly even.
    ctx.fillStyle = 'rgba(107,124,255,0.22)'
    ctx.fillRect(40, 8, 20, 6)

    const tex = new THREE.CanvasTexture(canvas)
    tex.mapping = THREE.EquirectangularReflectionMapping
    tex.colorSpace = THREE.SRGBColorSpace

    const pmrem = new THREE.PMREMGenerator(gl)
    pmrem.compileEquirectangularShader()
    const env = pmrem.fromEquirectangular(tex).texture

    three.environment = env
    three.environmentIntensity = 1.35

    tex.dispose()
    pmrem.dispose()

    return () => {
      three.environment = null
      env.dispose()
    }
  }, [gl, three])
}

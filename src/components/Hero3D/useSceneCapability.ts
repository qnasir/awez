import { useEffect, useState } from 'react'
import { BUDGET, type SceneBudget } from './sceneConfig'
import { useReducedMotion } from '@/hooks/useReducedMotion'

type Capability =
  | { status: 'probing' }
  | { status: 'unsupported'; reason: string }
  | { status: 'ready'; budget: SceneBudget }

/**
 * Decides whether this device gets the 3D hero, and how much of it.
 *
 * The probe creates a throwaway context rather than trusting a UA string: a
 * browser can advertise WebGL and still fail to create a context (blocklisted
 * driver, exhausted context pool, headless without a GPU). It also refuses the
 * scene outright under reduced motion — a camera flying through a room is the
 * exact thing that setting exists to prevent, and the 2.5D fallback carries
 * the same information without moving.
 */
export function useSceneCapability(): Capability {
  const reduced = useReducedMotion()
  const [cap, setCap] = useState<Capability>({ status: 'probing' })

  useEffect(() => {
    if (reduced) {
      setCap({ status: 'unsupported', reason: 'reduced-motion' })
      return
    }

    let canvas: HTMLCanvasElement | null = null
    try {
      canvas = document.createElement('canvas')
      const gl = (canvas.getContext('webgl2') ||
        canvas.getContext('webgl')) as WebGLRenderingContext | null

      if (!gl) {
        setCap({ status: 'unsupported', reason: 'no-webgl' })
        return
      }

      // Texture size is a decent proxy for "this is a real GPU, not a
      // software rasteriser falling back to the CPU".
      const maxTexture = gl.getParameter(gl.MAX_TEXTURE_SIZE) as number
      const cores = navigator.hardwareConcurrency ?? 4
      const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4
      const coarse = window.matchMedia('(pointer: coarse)').matches
      const narrow = window.innerWidth < 900

      if (maxTexture < 2048) {
        setCap({ status: 'unsupported', reason: 'weak-gpu' })
        return
      }

      const weak = cores <= 4 || memory <= 4
      const tier = coarse || narrow ? 'low' : weak ? 'medium' : 'high'
      setCap({ status: 'ready', budget: BUDGET[tier] })

      // Release the probe context immediately; browsers cap how many exist.
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    } catch {
      setCap({ status: 'unsupported', reason: 'probe-failed' })
    } finally {
      canvas = null
    }
  }, [reduced])

  return cap
}

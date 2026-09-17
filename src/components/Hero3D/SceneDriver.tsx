import { useFrame, useThree } from '@react-three/fiber'
import { beatAt } from './sceneConfig'
import { scene, damp, publish } from './sceneState'

const INTRO_TRANSFORM_DELAY = 2.4
const INTRO_TRANSFORM_TIME = 2.2
/** How far the room turns digital on its own, before the reader scrolls. */
const INTRO_TRANSFORM_DEPTH = 0.16

/**
 * The single place the scene's shared values advance.
 *
 * Mounted first in the tree so its `useFrame` runs before every consumer's —
 * R3F executes same-priority subscribers in registration order, and giving
 * this a real priority would hand over the render loop, which is not what it
 * wants to own.
 *
 * It does three things: damp the pointer, advance the clock, and decide how
 * digital the room currently is.
 */
export function SceneDriver() {
  const gl = useThree((s) => s.gl)

  // Dev-only budget readout. Draw calls and triangle count are the two numbers
  // that decide whether this scene is affordable on hardware the dev machine
  // is not, and they are not observable from outside the canvas. Stripped from
  // production by the `import.meta.env.DEV` guard.
  if (import.meta.env.DEV) {
    ;(window as unknown as { __kinetiqScene?: unknown }).__kinetiqScene = () => ({
      drawCalls: gl.info.render.calls,
      triangles: gl.info.render.triangles,
      geometries: gl.info.memory.geometries,
      textures: gl.info.memory.textures,
      programs: gl.info.programs?.length ?? 0,
      dpr: gl.getPixelRatio(),
      hovered: scene.hovered,
      pointer: [Math.round(scene.pointerX * 100) / 100, Math.round(scene.pointerY * 100) / 100],
    })
  }

  useFrame((_, dt) => {
    const d = Math.min(dt, 0.05)
    scene.elapsed += d

    scene.pointerX = damp(scene.pointerX, scene.targetX, 3.2, d)
    scene.pointerY = damp(scene.pointerY, scene.targetY, 3.2, d)

    // Two sources, whichever is further along. The room starts dissolving on
    // its own a couple of seconds in — enough to say "this is software", not
    // enough to spend the reveal before the reader has scrolled — and then
    // scroll takes over and carries it the rest of the way.
    const sinceIntro = Math.max(0, scene.elapsed - INTRO_TRANSFORM_DELAY)
    const auto = Math.min(1, sinceIntro / INTRO_TRANSFORM_TIME) * INTRO_TRANSFORM_DEPTH
    const scrolled = Math.max(0, Math.min(1, (scene.scroll - 0.12) / 0.72))
    const eased = scrolled * scrolled * (3 - 2 * scrolled)

    scene.digital = damp(scene.digital, Math.max(auto, eased), 3.5, d)

    publish(beatAt(scene.scroll), scene.hovered)
  })

  return null
}

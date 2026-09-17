import type { Beat } from './sceneConfig'

/**
 * The bridge between the DOM and the render loop.
 *
 * Scroll and pointer move every frame. Routing them through React state would
 * re-render the tree sixty times a second, so they live in one mutable object
 * that the DOM writes and `useFrame` reads. Only things the HTML overlay
 * genuinely needs to re-render for — the active story beat, the hovered
 * panel — go through React, via a tiny subscription.
 */
export type SceneState = {
  /** 0 → 1 through the hero's scroll journey. */
  scroll: number
  /** Pointer in normalised device coords, already damped. */
  pointerX: number
  pointerY: number
  /** Raw pointer target; the damping happens in the frame loop. */
  targetX: number
  targetY: number
  /** 0 → 1 physical gym → digital operating system. */
  digital: number
  /** Seconds since the scene mounted, for the intro choreography. */
  elapsed: number
  /** Which KPI panel the pointer is over, if any. */
  hovered: string | null
  /** True while the canvas is on screen; the loop idles when false. */
  visible: boolean
}

export const scene: SceneState = {
  scroll: 0,
  pointerX: 0,
  pointerY: 0,
  targetX: 0,
  targetY: 0,
  digital: 0,
  elapsed: 0,
  hovered: null,
  visible: true,
}

/* ---- Minimal pub/sub for the handful of values the overlay renders ---- */

type Listener = (beat: Beat, hovered: string | null) => void
const listeners = new Set<Listener>()

let lastBeat: Beat = 'wide'
let lastHovered: string | null = null

export function publish(beat: Beat, hovered: string | null) {
  if (beat === lastBeat && hovered === lastHovered) return
  lastBeat = beat
  lastHovered = hovered
  listeners.forEach((l) => l(beat, hovered))
}

export function subscribe(l: Listener) {
  listeners.add(l)
  l(lastBeat, lastHovered)
  return () => { listeners.delete(l) }
}

export function resetScene() {
  scene.scroll = 0
  scene.pointerX = 0
  scene.pointerY = 0
  scene.targetX = 0
  scene.targetY = 0
  scene.digital = 0
  scene.elapsed = 0
  scene.hovered = null
  lastBeat = 'wide'
  lastHovered = null
}

/** Frame-rate independent damping. */
export const damp = (current: number, target: number, lambda: number, dt: number) =>
  current + (target - current) * (1 - Math.exp(-lambda * dt))

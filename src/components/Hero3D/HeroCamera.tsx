import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { scene, damp } from './sceneState'

/**
 * The camera's route through the room, as two splines.
 *
 * Position and look-at are separate curves rather than one path with a fixed
 * forward vector. That is what lets the camera walk straight down the aisle
 * while turning to face the members panel — a single path can only ever look
 * where it is going, which is how architectural fly-throughs end up feeling
 * like a lift ride.
 *
 * Waypoints, in order: the doorway, walking in, the members panel, revenue,
 * attendance, and finally pulling up and back as the room turns to data.
 */
const POSITION = [
  new THREE.Vector3(0, 1.92, 9.5),
  new THREE.Vector3(-0.5, 2.0, 5.0),
  new THREE.Vector3(-1.7, 2.05, -3.2),
  new THREE.Vector3(1.85, 1.95, -3.6),
  new THREE.Vector3(-1.45, 2.25, -4.2),
  new THREE.Vector3(0, 2.95, 2.2),
]

const TARGET = [
  new THREE.Vector3(-1.35, 2.16, -4.0),
  new THREE.Vector3(-0.8, 2.05, -6.0),
  new THREE.Vector3(-1.5, 2.28, -11.2),
  new THREE.Vector3(0.6, 1.38, -11.6),
  new THREE.Vector3(-2.15, 1.98, -11.4),
  new THREE.Vector3(0, 1.75, -12.5),
]

/** Where the camera starts before the intro pushes it into the room. */
const ENTRY = new THREE.Vector3(0, 2.15, 16.5)
const ENTRY_TARGET = new THREE.Vector3(-1.1, 2.05, 3)

const INTRO_SECONDS = 2.6

export function HeroCamera({ aimY = 0, tStart = 0 }: { aimY?: number; tStart?: number }) {
  const { camera } = useThree()

  const posCurve = useMemo(() => new THREE.CatmullRomCurve3(POSITION, false, 'catmullrom', 0.25), [])
  const lookCurve = useMemo(() => new THREE.CatmullRomCurve3(TARGET, false, 'catmullrom', 0.25), [])

  const intro = useRef(0)
  /** 1 = full parallax, lower while a panel is being targeted. */
  const grip = useRef(1)
  const pos = useRef(new THREE.Vector3().copy(ENTRY))
  const look = useRef(new THREE.Vector3().copy(ENTRY_TARGET))
  const sampledPos = useMemo(() => new THREE.Vector3(), [])
  const sampledLook = useMemo(() => new THREE.Vector3(), [])

  useFrame((_, dt) => {
    const d = Math.min(dt, 0.05)

    // Ease the arrival rather than the whole journey: a constant-speed push-in
    // reads as a dolly, an eased one reads as a shot settling.
    intro.current = Math.min(1, intro.current + d / INTRO_SECONDS)
    const e = 1 - Math.pow(1 - intro.current, 3)

    // Phones skip the establishing wide shot. A room photographed from the
    // doorway needs width the frame does not have, so the journey starts
    // already inside it, closer to the command centre.
    const t = tStart + Math.max(0, Math.min(1, scene.scroll)) * (1 - tStart)
    posCurve.getPoint(t, sampledPos)
    lookCurve.getPoint(t, sampledLook)

    sampledPos.lerpVectors(ENTRY, sampledPos, e)
    sampledLook.lerpVectors(ENTRY_TARGET, sampledLook, e)

    // On a phone the copy owns the lower half of the screen, so the camera
    // tilts down to push the room into the upper half where it can be seen.
    sampledLook.y += aimY

    // Pointer parallax. The camera and its target move in opposite directions
    // so the room swings around a point rather than sliding sideways.
    //
    // It eases off while a panel is under the cursor. Parallax that keeps
    // moving during a hover drags the target out from under the pointer — the
    // effect fights the interaction it is supposed to support.
    grip.current = damp(grip.current, scene.hovered ? 0.25 : 1, 6, d)
    const g = grip.current
    sampledPos.x += scene.pointerX * 0.34 * g
    sampledPos.y += -scene.pointerY * 0.17 * g
    sampledLook.x -= scene.pointerX * 0.18 * g
    sampledLook.y += scene.pointerY * 0.1 * g

    // Damping is what keeps a mouse-driven camera from feeling twitchy. The
    // pointer proposes; the camera decides how fast it is willing to move.
    pos.current.x = damp(pos.current.x, sampledPos.x, 5, d)
    pos.current.y = damp(pos.current.y, sampledPos.y, 5, d)
    pos.current.z = damp(pos.current.z, sampledPos.z, 5, d)
    look.current.x = damp(look.current.x, sampledLook.x, 4.2, d)
    look.current.y = damp(look.current.y, sampledLook.y, 4.2, d)
    look.current.z = damp(look.current.z, sampledLook.z, 4.2, d)

    camera.position.copy(pos.current)
    camera.lookAt(look.current)
    // A whisper of roll as the camera turns, so the movement has a wrist.
    camera.rotation.z = damp(camera.rotation.z, -scene.pointerX * 0.014, 3, d)
  })

  return null
}

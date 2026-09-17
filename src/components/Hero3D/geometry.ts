import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

/**
 * Gym equipment, built as merged primitives.
 *
 * Each machine is authored as a handful of boxes and cylinders and then merged
 * into a single BufferGeometry, so the whole room costs roughly one draw call
 * per machine instead of one per strut. Geometries are built once at module
 * scope and shared by every bay that uses them.
 *
 * The forms are deliberately abstracted rather than modelled. Without an
 * artist's assets, chasing a photoreal treadmill lands in the uncanny valley
 * and reads as a game prop; a confident, minimal silhouette in a dark matte
 * material reads as a product render. It also means the schematic overlay —
 * the wireframe the room dissolves into — has clean edges to draw.
 */

const box = (w: number, h: number, d: number, x = 0, y = 0, z = 0, rx = 0) => {
  const g = new THREE.BoxGeometry(w, h, d)
  if (rx) g.rotateX(rx)
  g.translate(x, y, z)
  return g
}

const tube = (r: number, h: number, x = 0, y = 0, z = 0, axis: 'x' | 'y' | 'z' = 'y') => {
  const g = new THREE.CylinderGeometry(r, r, h, 10)
  if (axis === 'x') g.rotateZ(Math.PI / 2)
  if (axis === 'z') g.rotateX(Math.PI / 2)
  g.translate(x, y, z)
  return g
}

const plate = (r: number, thick: number, x = 0, y = 0, z = 0) => {
  const g = new THREE.CylinderGeometry(r, r, thick, 20)
  g.rotateZ(Math.PI / 2)
  g.translate(x, y, z)
  return g
}

const merge = (parts: THREE.BufferGeometry[]) => {
  const g = mergeGeometries(parts, false)!
  parts.forEach((p) => p.dispose())
  g.computeVertexNormals()
  return g
}

/* ---------------- Squat rack: two uprights, a crossbar, a loaded bar ---------------- */
function buildRack() {
  const P: THREE.BufferGeometry[] = []
  const H = 2.25
  for (const x of [-0.62, 0.62]) {
    P.push(box(0.1, H, 0.1, x, H / 2, 0))
    P.push(box(0.16, 0.06, 0.95, x, 0.03, 0.2)) // foot
    P.push(box(0.18, 0.05, 0.18, x, 1.42, 0.12)) // J-hook
  }
  P.push(box(1.34, 0.09, 0.09, 0, H - 0.06, 0)) // top crossbar
  P.push(box(1.34, 0.06, 0.06, 0, 0.55, 0)) // low brace
  P.push(tube(0.03, 1.95, 0, 1.47, 0.12, 'x')) // barbell
  for (const x of [-0.78, 0.78]) {
    P.push(plate(0.24, 0.05, x, 1.47, 0.12))
    P.push(plate(0.2, 0.05, x + (x > 0 ? -0.07 : 0.07), 1.47, 0.12))
  }
  return merge(P)
}

/* ---------------- Flat bench ---------------- */
function buildBench() {
  const P: THREE.BufferGeometry[] = []
  P.push(box(0.42, 0.11, 1.5, 0, 0.5, 0)) // pad
  P.push(box(0.36, 0.1, 0.5, 0, 0.62, -0.78, -0.22)) // incline back
  P.push(box(0.1, 0.44, 0.1, 0, 0.22, 0.58))
  P.push(box(0.1, 0.44, 0.1, 0, 0.22, -0.58))
  P.push(box(0.62, 0.05, 0.14, 0, 0.03, 0.58))
  P.push(box(0.62, 0.05, 0.14, 0, 0.03, -0.58))
  return merge(P)
}

/* ---------------- Treadmill: angled deck, rails, console ---------------- */
function buildTreadmill() {
  const P: THREE.BufferGeometry[] = []
  P.push(box(0.78, 0.09, 1.85, 0, 0.3, 0.1, -0.055)) // deck
  P.push(box(0.9, 0.12, 0.34, 0, 0.16, 1.0)) // motor cowl
  for (const x of [-0.42, 0.42]) {
    P.push(box(0.07, 1.02, 0.07, x, 0.75, 0.86)) // upright
    P.push(box(0.07, 0.07, 0.5, x, 1.02, 0.6)) // handrail
  }
  P.push(box(0.9, 0.42, 0.08, 0, 1.3, 0.86)) // console body
  P.push(box(0.55, 0.07, 0.06, 0, 1.02, 0.86)) // console shelf
  return merge(P)
}

/* ---------------- Plate tree ---------------- */
function buildPlateTree() {
  const P: THREE.BufferGeometry[] = []
  P.push(box(0.12, 1.5, 0.12, 0, 0.75, 0))
  P.push(box(0.7, 0.07, 0.7, 0, 0.04, 0))
  const rows: [number, number][] = [
    [0.35, 1.28],
    [0.31, 0.92],
    [0.27, 0.56],
    [0.22, 0.24],
  ]
  for (const [r, y] of rows) {
    for (const s of [-1, 1]) {
      P.push(tube(0.035, 0.34, s * 0.19, y, 0, 'x'))
      P.push(plate(r, 0.06, s * 0.3, y, 0))
      P.push(plate(r * 0.92, 0.06, s * 0.22, y, 0))
    }
  }
  return merge(P)
}

/* ---------------- Cable machine: frame, stack, pulley ---------------- */
function buildCable() {
  const P: THREE.BufferGeometry[] = []
  const H = 2.45
  for (const x of [-0.55, 0.55]) {
    P.push(box(0.11, H, 0.11, x, H / 2, 0))
    P.push(box(0.18, 0.06, 0.8, x, 0.03, 0.1))
  }
  P.push(box(1.21, 0.11, 0.11, 0, H - 0.06, 0))
  P.push(box(1.21, 0.07, 0.07, 0, 1.3, -0.06))
  P.push(box(0.46, 1.32, 0.34, 0, 0.7, -0.02)) // weight stack
  for (let i = 0; i < 9; i++) P.push(box(0.5, 0.055, 0.38, 0, 0.16 + i * 0.145, -0.02))
  P.push(tube(0.09, 0.05, 0, H - 0.18, 0.1, 'x')) // pulley
  P.push(tube(0.012, 1.1, 0, 1.78, 0.1)) // cable
  P.push(box(0.34, 0.05, 0.05, 0, 1.24, 0.1)) // handle bar
  return merge(P)
}

/* ---------------- Dumbbell rack ---------------- */
function buildDumbbells() {
  const P: THREE.BufferGeometry[] = []
  P.push(box(2.0, 0.08, 0.5, 0, 0.62, -0.02, -0.14)) // upper shelf
  P.push(box(2.0, 0.08, 0.5, 0, 0.26, 0.16, -0.14)) // lower shelf
  for (const x of [-0.98, 0.98]) {
    P.push(box(0.09, 0.7, 0.09, x, 0.35, -0.16))
    P.push(box(0.09, 0.34, 0.09, x, 0.17, 0.2))
    P.push(box(0.09, 0.09, 0.62, x, 0.03, 0.02))
  }
  // Pairs of dumbbells on both shelves, sized down the rack
  for (let i = 0; i < 5; i++) {
    const x = -0.72 + i * 0.36
    const r = 0.12 - i * 0.008
    for (const [y, z] of [
      [0.78, -0.02],
      [0.42, 0.16],
    ] as const) {
      P.push(tube(0.022, 0.3, x, y, z, 'x'))
      P.push(plate(r, 0.07, x - 0.13, y, z))
      P.push(plate(r, 0.07, x + 0.13, y, z))
    }
  }
  return merge(P)
}

/* ---------------- Reception desk ---------------- */
function buildReception() {
  const P: THREE.BufferGeometry[] = []
  P.push(box(2.9, 1.02, 0.62, 0, 0.51, 0)) // counter body
  P.push(box(3.06, 0.08, 0.78, 0, 1.06, 0)) // worktop overhang
  P.push(box(1.1, 0.62, 0.5, 1.6, 0.31, -0.5)) // return wing
  P.push(box(1.24, 0.07, 0.62, 1.6, 0.65, -0.5))
  return merge(P)
}

/** A standing figure, abstracted to the point of being a presence, not a person. */
function buildFigure() {
  const P: THREE.BufferGeometry[] = []
  const torso = new THREE.CapsuleGeometry(0.17, 0.44, 4, 10)
  torso.translate(0, 1.18, 0)
  P.push(torso)
  const head = new THREE.SphereGeometry(0.115, 12, 10)
  head.translate(0, 1.6, 0)
  P.push(head)
  for (const s of [-1, 1]) {
    const leg = new THREE.CapsuleGeometry(0.075, 0.6, 4, 8)
    leg.translate(s * 0.095, 0.44, 0)
    P.push(leg)
    const arm = new THREE.CapsuleGeometry(0.055, 0.46, 4, 8)
    arm.translate(s * 0.235, 1.16, 0.02)
    P.push(arm)
  }
  return merge(P)
}

export type EquipmentKind =
  | 'rack' | 'bench' | 'treadmill' | 'plates' | 'cable' | 'dumbbells' | 'reception' | 'figure'

let cache: Record<EquipmentKind, THREE.BufferGeometry> | null = null

/** Built lazily on first use so nothing is constructed for a fallback render. */
export function getGeometry(): Record<EquipmentKind, THREE.BufferGeometry> {
  if (!cache) {
    cache = {
      rack: buildRack(),
      bench: buildBench(),
      treadmill: buildTreadmill(),
      plates: buildPlateTree(),
      cable: buildCable(),
      dumbbells: buildDumbbells(),
      reception: buildReception(),
      figure: buildFigure(),
    }
  }
  return cache
}

/**
 * Edge geometry for the schematic overlay, derived once from the merged
 * meshes. This is what the room dissolves into when the physical gym becomes
 * the operating system — real edges off the real forms, not a second model.
 */
let edgeCache: Partial<Record<EquipmentKind, THREE.EdgesGeometry>> = {}

export function getEdges(kind: EquipmentKind): THREE.EdgesGeometry {
  let e = edgeCache[kind]
  if (!e) {
    e = new THREE.EdgesGeometry(getGeometry()[kind], 24)
    edgeCache[kind] = e
  }
  return e
}

export function disposeGeometry() {
  if (cache) {
    Object.values(cache).forEach((g) => g.dispose())
    cache = null
  }
  Object.values(edgeCache).forEach((g) => g?.dispose())
  edgeCache = {}
}

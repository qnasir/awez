import * as THREE from 'three'

/** A rounded rectangle as a flat shape, centred on its own origin. */
export function roundedShape(w: number, h: number, r: number) {
  const x = -w / 2
  const y = -h / 2
  const rad = Math.min(r, w / 2, h / 2)
  const s = new THREE.Shape()
  s.moveTo(x + rad, y)
  s.lineTo(x + w - rad, y)
  s.quadraticCurveTo(x + w, y, x + w, y + rad)
  s.lineTo(x + w, y + h - rad)
  s.quadraticCurveTo(x + w, y + h, x + w - rad, y + h)
  s.lineTo(x + rad, y + h)
  s.quadraticCurveTo(x, y + h, x, y + h - rad)
  s.lineTo(x, y + rad)
  s.quadraticCurveTo(x, y, x + rad, y)
  return s
}

const panelCache = new Map<string, THREE.ShapeGeometry>()
const borderCache = new Map<string, THREE.BufferGeometry>()

/** Cached fill geometry — panels repeat at a handful of sizes. */
export function panelGeometry(w: number, h: number, r = 0.06) {
  const key = `${w}:${h}:${r}`
  let g = panelCache.get(key)
  if (!g) {
    g = new THREE.ShapeGeometry(roundedShape(w, h, r), 6)
    panelCache.set(key, g)
  }
  return g
}

/** Cached hairline border, drawn as a closed loop off the same shape. */
export function borderGeometry(w: number, h: number, r = 0.06) {
  const key = `${w}:${h}:${r}`
  let g = borderCache.get(key)
  if (!g) {
    const pts = roundedShape(w, h, r).getPoints(48)
    g = new THREE.BufferGeometry().setFromPoints(pts.map((p) => new THREE.Vector3(p.x, p.y, 0)))
    borderCache.set(key, g)
  }
  return g
}

export function disposePanels() {
  panelCache.forEach((g) => g.dispose())
  borderCache.forEach((g) => g.dispose())
  panelCache.clear()
  borderCache.clear()
}

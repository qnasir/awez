/**
 * Scene budget.
 *
 * Every number the 3D hero spends is declared here rather than scattered
 * through components, so the cost of a quality tier can be read in one place
 * and a slow device can be stepped down without touching scene code.
 */
export type Tier = 'high' | 'medium' | 'low'

export type SceneBudget = {
  tier: Tier
  /** Device pixel ratio clamp. The single biggest lever on fill cost. */
  dpr: [number, number]
  /** Equipment bays down each side of the aisle. */
  bays: number
  /** Overhead light bars receding down the room. */
  lightBars: number
  /** Members flowing toward the command centre, as instanced points. */
  flowParticles: number
  /** Ambient motes in the volume. */
  dustParticles: number
  /** Draw schematic edges over equipment during the digital transformation. */
  edges: boolean
  /** Floating KPI panels around the command centre. */
  panels: boolean
  /** Extra depth objects far down the room. */
  deepScenery: boolean
  /** Antialias costs a full extra buffer; off below `high`. */
  antialias: boolean
}

const HIGH: SceneBudget = {
  tier: 'high',
  dpr: [1, 1.75],
  bays: 6,
  lightBars: 8,
  flowParticles: 220,
  dustParticles: 140,
  edges: true,
  panels: true,
  deepScenery: true,
  antialias: true,
}

const MEDIUM: SceneBudget = {
  ...HIGH,
  tier: 'medium',
  dpr: [1, 1.5],
  bays: 5,
  lightBars: 7,
  flowParticles: 140,
  dustParticles: 90,
  antialias: false,
}

const LOW: SceneBudget = {
  tier: 'low',
  dpr: [1, 1.25],
  bays: 3,
  lightBars: 5,
  flowParticles: 70,
  dustParticles: 40,
  edges: false,
  panels: true,
  deepScenery: false,
  antialias: false,
}

export const BUDGET: Record<Tier, SceneBudget> = { high: HIGH, medium: MEDIUM, low: LOW }

/* ============================================================
   Scene layout, in metres. The room is read at standing eye height.
   ============================================================ */

export const ROOM = {
  /** Half-width of the walking aisle the camera travels down. */
  aisle: 2.6,
  /** Distance between equipment bays along the room's depth. */
  baySpacing: 5.0,
  /** Where the first bay sits. Far enough ahead that the opening frame is a
   *  room, not a close-up of the nearest machine. */
  bayStart: 4,
  /** The command centre floats in the aisle at the far end. */
  centre: [0, 1.85, -12] as const,
  ceiling: 4.5,
  /** Half-width of the room. Walls are what make fog and depth legible — a
   *  gym floor with no boundaries reads as furniture in a void. */
  halfWidth: 7.6,
  /** The room's back wall, behind the command centre. */
  back: -27,
  /** How far in front of the camera's start the room is closed off. */
  front: 20,
  /** Fog starts well past the first bay so near objects stay crisp, and ends
   *  short of the back wall so the room dissolves rather than stopping. */
  fogNear: 14,
  fogFar: 62,
} as const

/** The story beats the camera and the scene move through, 0 → 1 of hero scroll. */
export const BEATS = {
  wide: 0,
  approach: 0.2,
  members: 0.4,
  revenue: 0.6,
  attendance: 0.8,
  digital: 1,
} as const

export type Beat = keyof typeof BEATS

/** Which metric the scene is featuring at a given scroll position. */
export function beatAt(t: number): Beat {
  if (t < 0.15) return 'wide'
  if (t < 0.33) return 'approach'
  if (t < 0.53) return 'members'
  if (t < 0.73) return 'revenue'
  if (t < 0.9) return 'attendance'
  return 'digital'
}

/* ---- Palette, mirroring the site's tokens in linear-ish sRGB ---- */
export const C = {
  volt: '#C7F048',
  voltDim: '#8FB024',
  chalk: '#F4F5F7',
  steel: '#20242E',
  iron: '#12151B',
  carbon: '#0B0C10',
  void: '#050507',
  /** The cool accent that keeps the room from reading as all-volt. */
  signal: '#6B7CFF',
  ember: '#FF7A45',
} as const

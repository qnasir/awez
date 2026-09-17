# KINETIQ

Marketing site for a fictional gym-management SaaS product. Single-page, dark,
motion-heavy, built to read as a real product rather than a brochure.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # typecheck + production build to dist/
npm run preview  # serve the build
npm run lint     # typecheck only
```

---

## The hero is a WebGL scene

The hero is a cinematic gym rendered in Three.js: a dark room you travel down,
with the KINETIQ command centre floating at the far end. Scroll drives a camera
through six beats — the floor, the command centre, members, revenue,
attendance, and the room dissolving into its own data — and the physical gym
turns to schematic wireframe as it goes. Every object earns its place: the
machines are the physical business, the command centre is the digital one, and
the particles flowing down the aisle toward it are members becoming data.

```
Hero3D/
  HeroExperience   the hero section: sticky canvas, copy, beat captions
  GymScene         the <Canvas>, quality budget, visibility pausing
  SceneDriver      the one place shared values advance (pointer, clock, digital)
  HeroCamera       two splines — position and look-at — plus pointer parallax
  Environment      shell, floor, ceiling strips, light rig, figures
  GymEquipment     merged machine geometry + the schematic overlay
  CommandCenter    the rig: dashboard, four metric panels, visualisations
  Dashboard3D      layered panel, KPI tiles, counting numbers
  FloatingMetric   one KPI panel, with hover opening the layer beneath it
  ParticleSystem   members flowing toward the command centre
  visualizations/  revenue columns, attendance ring, member constellation
  useRoomEnvironment  procedural PMREM env map
  useSceneCapability  who gets the scene, and how much of it
  geometry / panelGeometry / sceneConfig / sceneState / fonts
```

### What it costs, and who pays it

**108 draw calls, ~22k triangles, 14 programs, 2 textures.** Every machine is
authored as a dozen primitives and then *merged into one BufferGeometry*, so
the room costs roughly one draw call per machine rather than one per strut.
The revenue columns and the member constellation are `InstancedMesh`.

**Nobody pays for it unless they can use it.** `useSceneCapability` probes for
a real context — not a UA string — and refuses the scene on reduced motion, on
a missing or blocklisted WebGL implementation, and on a GPU whose max texture
size says it is a software rasteriser. Those visitors fetch **zero** 3D bytes:
verified by watching the network, not by reading the code.

That gating is easy to get wrong in two places, and both were:

1. **Vite preloads the dependencies of every dynamic import it can see**, so
   the 267 KB bundle was being handed to everyone before the probe had run.
   `build.modulePreload.resolveDependencies` filters it out.
2. **Vite's preload helper is a virtual module**, and Rollup allocated it into
   the 3D chunk — which gave the entry a *static* import of the whole bundle.
   It is now pinned to an eager chunk by name.

**Rendering stops when the canvas leaves the viewport or the tab is hidden**
(`frameloop` toggles to `never`). Measured: ~8 rAF/s with the scene on screen
under software rendering, 30 rAF/s once scrolled past — the rest of the page
runs as if the hero were not there.

Quality steps down by tier (`sceneConfig.ts`): bays, ceiling strips, particle
counts, the schematic overlay, antialiasing and the DPR clamp all come from one
budget object, so a slow device is stepped down without touching scene code.

### Three things that make it read as a product render, not a demo

- **A procedural environment map.** Metal is nothing but reflections; with
  nothing to reflect, high-metalness materials render almost black and the
  machines look like flat cut-outs. A 64×32 gradient canvas with a bright band
  where the ceiling strips are, run through PMREM, gives every surface a
  horizon and a highlight — for a few kilobytes instead of a 4 MB HDRI.
- **The accent is never a room light.** Volt appears as emissive surface and as
  one tight pool around the command centre. Lighting a whole room in the brand
  colour is the fastest way to look like a demo.
- **The figures have `envMapIntensity: 0`.** The moment a person catches a
  specular highlight they stop being a silhouette and start being a mannequin.

### Text in 3D

Panel type is real SDF text (troika via drei's `Text`), not a texture, so it
stays crisp at any camera distance. The fonts are the site's own — Archivo and
Inter, self-hosted and **subset to the ~90 glyphs the scene draws**: 650 KB of
full families becomes 40 KB. Counting numbers are throttled to 12fps, because
troika re-tessellates glyphs on every string change.

### Fallback

No WebGL, or reduced motion, and the hero falls back to the previous 2.5D
version — the CSS-3D product window with its live activity rail. It is a
designed hero in its own right, not a placeholder.

### Mobile

Phones get a different composition, not a squeezed one: the canvas is a
**window across the top** rather than a full-bleed backdrop, the copy sits
below it on solid ground, and the camera journey starts already inside the room
and runs over 220vh instead of 360vh. A portrait frame cannot compose a room
behind a block of copy — the interesting half always ends up under the
headline.

### One interaction bug worth remembering

The hero copy sits over the canvas. Once it faded out on scroll it was still
intercepting the pointer, so the 3D panels behind it could never be hovered.
The copy layer is `pointer-events: none` with only its links and buttons taking
events back, and it drops out entirely past 15% scroll.

## The design system

Everything visual derives from tokens in `src/styles/index.css`. Change them
there and the whole site follows.

**Surfaces** — a six-step graphite ramp (`void → ink → carbon → graphite →
steel → iron`). Never pure black; the ramp is what creates depth between
stacked panels.

**Accent** — one colour, `volt` (`#C7F048`). It marks the subject of a screen
and nothing else. Two supporting tones exist and are reserved: `ember` for
negative status only, `signal` as a cool neutral.

**Text** — `chalk → ash → smoke → dim`. Every step clears WCAG AA (4.5:1)
against the darkest surface in the ramp; hierarchy comes from size and weight,
not from pushing quiet text below legibility. A separate `mute` token exists
for chrome inside the `aria-hidden` product mockups, where text is imagery
rather than content — **never use `mute` for real copy.**

**Type** — Archivo for display, Inter for UI, Geist Mono for labels and data.
Display sizes are fluid (`text-d1/d2/d3`) and clamp so headlines hold their
declared line breaks at desktop width.

**Texture** — one procedural grain (`.grain`), generated by an inline SVG
filter, so there are zero image requests for texture.

## Motion

`src/animations/index.ts` defines four speed tiers, and every animated element
picks one. That spread is what reads as depth:

| Tier | Used for | Feel |
|---|---|---|
| `atmosphere` | backgrounds, light, particles | slowest, never noticed |
| `structure` | display type, section frames | the main reveal |
| `product` | dashboard surfaces, cards | slightly quicker |
| `detail` | badges, counters, icons | fastest |

**Reduced motion is a first-class path, not a fallback.** `prefers-reduced-motion`
keeps every layout, colour and reveal and removes only movement. Components
read it through `useReducedMotion()` and render a fully-composed state. Notably:
the marquees become static wrapping lists instead of frozen belts, counters
render their final value immediately, and GSAP is never loaded at all.

### Three gotchas worth knowing

1. **A MotionValue in `style` silently overrides the same key in `animate`.**
   Where an element needs both an entrance and a live scroll/pointer transform,
   they are split across nested elements — see `Hero/DashboardScene.tsx`, which
   layers entrance → scroll parallax → pointer tilt.
2. **`useScroll({ target })` measures against the nearest positioned ancestor.**
   Scroll targets and their containers carry `position: relative` (including
   `html` and `main`) so offsets are exact.
3. **A canvas is priced by its area, not by what is drawn on it.** The hero's
   24 barely-visible dust motes were, by measurement, the single most expensive
   thing on the page: the canvas spans the full hero, and clearing it at 2× DPR
   every frame halved the frame rate. It renders at 1× now — indistinguishable
   for sub-2px dots, four times cheaper.

## Architecture

```
src/
  animations/     motion vocabulary + the magnetic-cursor hook
  components/
    primitives/   Button, Panel, Reveal, SplitHeadline, Marquee, Counter,
                  Section, Spotlight, GridBackdrop, SectionHeader
      charts/     hand-rolled SVG charts (see below)
    Dashboard/    AppWindow + useLiveFeed — the product, shared by hero + showcase
    Statement/    the full-bleed rhythm break between chapters
    <Section>/    one folder per page chapter
  hooks/          media queries, pointer field, scroll progress, measure,
                  count-up, hash scroll, reduced motion
  lib/
    content.ts    every word and number on the site
    utils.ts
```

`content.ts` is the single source of copy and data. The voice is auditable in
one file, and no component invents its own numbers.

`AppWindow` is one component used by the hero and the sticky showcase, so the
software looks like the same software everywhere it appears. It is
`aria-hidden` decorative imagery — every number it shows is also stated in real
text or in an accessible chart elsewhere on the page.

**It does not freeze.** `useLiveFeed` trickles new check-ins into the window and
creeps the day's totals up behind them; the hero's `LiveRail` streams floor
activity beside the headline. A dashboard that counts up once on entry and then
stops is a screenshot with an animation on it, and the "Live" pill next to it is
a lie. Both stop on tab-hide and on scroll-out, and neither runs under reduced
motion.

## Charts

No charting library. Charts are SVG drawn at measured pixel dimensions
(`useMeasure`) rather than a scaled viewBox, so stroke weights and type stay
exact at every breakpoint.

Rules they all follow:

- **One hue per single-series chart.** Length already encodes magnitude, so a
  value-ramp across nominal categories would double-encode.
- **Emphasis, not categorical**, where a second series is context: the subject
  in `volt`, the comparison in a de-emphasis gray.
- **`ember` only for negative status** (lapsed, failed) — never as "series 3".
- **Top tick rounds up past the data max.** Stopping at the last tick below the
  max leaves the tallest mark outside the SVG viewport, where it is silently
  clipped and every large value renders the same height.
- **A hidden data table accompanies every chart**, so the same information is
  available without colour, motion or a pointer.

Both real colour pairs were validated for contrast and colour-vision
separation against the `#0B0C10` chart surface: volt↔gray ΔE 45.0 deutan,
volt↔ember ΔE 16.5 deutan, both clear of the ΔE 8 target and both above 3:1.

## Responsive

Breakpoints are design decisions, not shrink points. Where the desktop idea
does not survive a small screen, the small screen gets a different idea:

| Section | Desktop | Mobile |
|---|---|---|
| Product showcase | pinned window, advancing copy | self-contained chapter cards |
| Before / after | draggable wipe | stacked before → after |
| Mobile apps | 3D fan, counter-rotating | one device per row, scaled |
| Testimonials | GSAP pinned horizontal scroll | scroll-snapped rail |

The custom cursor, magnetic buttons and pointer spotlights disable on coarse
pointers rather than firing pointless listeners.

## Third-party weight

- **three / @react-three/fiber / drei** — the hero scene. **Dynamically
  imported**, ~267 KB gzip, and fetched only by devices that pass the
  capability probe.
- **framer-motion** — the motion system, used throughout.
- **GSAP + ScrollTrigger** — only for the pinned horizontal testimonials, where
  its pin-spacer maths, resize recalculation and scrub inertia genuinely beat a
  hand-rolled sticky translation. It is **dynamically imported**, so ~46 KB gzip
  loads for desktop visitors who reach that section and never for anyone else.
- **lucide-react** — icons, tree-shaken.

The **fallback** hero is still CSS 3D over real DOM — sharp at any density, no
shader budget, and it degrades with one media query.

Initial load is ~152 KB gzip (JS + CSS). The 3D bundle is additional and
conditional; it is never part of first load.

## Measured

Chrome, production build:

| | |
|---|---|
| First paint / FCP | 108 ms / 636 ms *(4× CPU throttle)* |
| Long tasks during load | 0 |
| Continuous scroll, full page, **2× DPR**, 4× CPU @ 1440px | median 16.7 ms, **p90 16.7 ms**, 5–10 frames over 33 ms of 425 |
| Continuous scroll, full page, **2× DPR**, 6× CPU @ 390px | median 16.7 ms, **p90 16.7 ms**, 9–13 frames over 33 ms of 458 |
| Horizontal overflow | none at 320 → 1920 px |
| Console errors / warnings | none, with and without the 3D scene |
| 3D scene cost | 108 draw calls · 22k triangles · 2 textures |
| 3D bytes on reduced-motion / no-WebGL | **0** |

Frame timings are measured by scrolling the whole page at ~55px per frame and
recording every frame interval — not by sampling a still viewport.

**The WebGL scene's frame rate is not measured here.** The only browser
available in this environment rasterises WebGL in software, where the scene
runs at roughly 8fps — a number that says nothing about real hardware. What is
verified is everything hardware-independent: the draw-call and triangle budget,
that rendering stops when the canvas is off screen, that the bundle is never
delivered to devices that cannot use it, and that the rest of the page is
unaffected either way.

## Accessibility

Single `h1`, no skipped heading levels, sections labelled by their own visible
headline. Landmarks are unique — decorative mockups deliberately contribute no
headings and no `<nav>`/`<header>`. The mobile menu is a focus-trapped
`role="dialog"` that locks scroll, closes on Escape and restores focus. The
comparison slider is a real `<input type="range">`, so it is draggable,
arrow-key operable and announced. Focus rings are visible on every interactive
element. All text passes WCAG AA against every surface it sits on.

## Development notes

- `?skipintro` skips the loading sequence — useful for automated capture and
  for jumping straight to a section during QA.
- In dev, `window.__kinetiqScene()` returns the live renderer budget — draw
  calls, triangles, programs, DPR, and the currently hovered panel. Stripped
  from production builds.
- The loader's completion gates the hero's entrance, with a 2.2 s failsafe in
  `App.tsx`: content is never allowed to depend on an animation callback firing.
- `useHashScroll` re-runs the anchor jump after mount, because a client-rendered
  page resolves `#pricing` before the section exists.

## Content

All copy, customer names, testimonials, logos and figures are fictional and
written for this build. The gym-management domain (memberships, billing,
attendance, trainers, leads, renewals, multi-branch, INR pricing) reflects how
the category actually operates; the brand, visual identity and wording are
original.

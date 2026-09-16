import { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { X, Check, MoveHorizontal, ArrowDown } from 'lucide-react'
import { COMPARISON } from '@/lib/content'
import { Section } from '@/components/primitives/Section'
import { SectionHeader } from '@/components/primitives/SectionHeader'
import { GridBackdrop } from '@/components/primitives/GridBackdrop'
import { useIsDesktop } from '@/hooks/useMediaQuery'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { clamp, cn } from '@/lib/utils'

type ColumnData = { label: string; caption: string; items: readonly string[] }

/**
 * A wipe comparison built for text rather than photographs.
 *
 * The two panels are anchored to opposite edges — chaos on the left, control
 * on the right — so at rest both read in full, and dragging trades space
 * between them. Anchoring matters: with both columns left-aligned (the naive
 * version of this) the wipe reveals an empty right half.
 */
function Column({ side, data }: { side: 'before' | 'after'; data: ColumnData }) {
  const after = side === 'after'

  return (
    <div
      className={cn(
        'flex h-full flex-col justify-center p-8 md:p-12 lg:p-16',
        after ? 'ml-auto bg-carbon' : 'mr-auto bg-[#08080A]',
        'w-full lg:w-1/2',
      )}
    >
      <div className="flex items-center gap-3">
        <span
          className={cn(
            'grid h-7 w-7 shrink-0 place-items-center rounded-full',
            after ? 'bg-volt text-volt-ink' : 'bg-white/[0.07] text-smoke',
          )}
        >
          {after ? <Check size={14} strokeWidth={3} /> : <X size={14} strokeWidth={3} />}
        </span>
        <span className="mono-label whitespace-nowrap">{data.caption}</span>
      </div>

      <h3
        className={cn(
          'mt-5 font-display text-[3.25rem] font-extrabold leading-[0.88] tracking-[-0.045em] md:text-[4.25rem]',
          after ? 'text-volt' : 'text-[#646B78]',
        )}
      >
        {data.label}
      </h3>

      <ul className="mt-8 flex flex-col gap-3.5">
        {data.items.map((item) => (
          <li
            key={item}
            className={cn(
              'flex items-start gap-3 text-[0.875rem] leading-snug md:text-[0.9375rem]',
              after ? 'text-ash' : 'text-smoke',
            )}
          >
            <span className={cn('mt-[0.42rem] h-1 w-1 shrink-0 rounded-full', after ? 'bg-volt' : 'bg-dim')} />
            <span className={cn(!after && 'line-through decoration-[#646B78] decoration-1')}>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function BeforeAfter() {
  const frameRef = useRef<HTMLDivElement>(null)
  const [split, setSplit] = useState(50)
  const [dragging, setDragging] = useState(false)
  const reduced = useReducedMotion()
  const isDesktop = useIsDesktop()

  const setFromClientX = useCallback((clientX: number) => {
    const rect = frameRef.current?.getBoundingClientRect()
    if (!rect) return
    setSplit(clamp((clientX - rect.left) / rect.width, 0.08, 0.92) * 100)
  }, [])

  useEffect(() => {
    if (!dragging) return
    const move = (e: PointerEvent) => setFromClientX(e.clientX)
    const up = () => setDragging(false)
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
    }
  }, [dragging, setFromClientX])

  return (
    <Section id="solutions" space="tight" aria-labelledby="solutions-heading">
      <GridBackdrop size={80} opacity={0.045} />

      <div className="container-x">
        <SectionHeader
          id="solutions-heading"
          eyebrow="Before / after"
          lines={['TWO WAYS TO RUN', 'THE SAME GYM.']}
          accentLine={1}
          treatment="light"
          layout="split"
          body="Everything on the left is work somebody is doing by hand right now."
        />

        <motion.div
          initial={reduced ? false : { opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-12% 0px -12% 0px' }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 md:mt-14"
        >
          {isDesktop ? (
            <>
              <div
                ref={frameRef}
                className="relative select-none overflow-hidden rounded-3xl border border-line-strong"
                style={{ touchAction: 'pan-y' }}
              >
                {/* CONTROL is the base layer, anchored right */}
                <div className="min-h-[32rem]">
                  <Column side="after" data={COMPARISON.after} />
                </div>

                {/* CHAOS wipes over it from the left, anchored left */}
                <div
                  className="absolute inset-0"
                  style={{ clipPath: `inset(0 ${100 - split}% 0 0)` }}
                  aria-hidden
                >
                  <div className="h-full min-h-[32rem]">
                    <Column side="before" data={COMPARISON.before} />
                  </div>
                </div>

                {/* Seam */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-y-0 z-10 w-px bg-gradient-to-b from-transparent via-volt to-transparent"
                  style={{ left: `${split}%` }}
                />

                {/* Handle */}
                <div
                  className="absolute inset-y-0 z-20 flex w-16 -translate-x-1/2 cursor-ew-resize items-center justify-center"
                  style={{ left: `${split}%` }}
                  onPointerDown={(e) => {
                    e.preventDefault()
                    setDragging(true)
                    setFromClientX(e.clientX)
                  }}
                >
                  <motion.span
                    animate={{ scale: dragging ? 1.14 : 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                    className="grid h-12 w-12 place-items-center rounded-full border border-volt/50 bg-ink/90 text-volt shadow-[0_0_34px_-6px_rgba(199,240,72,0.65)] backdrop-blur-sm"
                  >
                    <MoveHorizontal size={17} />
                  </motion.span>
                </div>

                {/* The real control: keyboard-operable and announced */}
                <label className="sr-only" htmlFor="chaos-control">
                  Reveal chaos versus control
                </label>
                <input
                  id="chaos-control"
                  type="range"
                  min={8}
                  max={92}
                  step={1}
                  value={Math.round(split)}
                  onChange={(e) => setSplit(Number(e.target.value))}
                  aria-valuetext={`${Math.round(split)} percent chaos, ${100 - Math.round(split)} percent control`}
                  className="absolute inset-x-0 bottom-0 z-30 h-16 w-full cursor-ew-resize opacity-0"
                />
              </div>

              <p className="mt-5 flex items-center justify-center gap-2 text-center text-xs text-dim">
                <MoveHorizontal size={13} /> Drag the handle, or focus it and use the arrow keys
              </p>
            </>
          ) : (
            /* ---- Mobile & tablet: two stacked panels, no drag ----
               Two 175px text columns would be unreadable, so the comparison
               becomes a vertical before → after instead of a shrunken wipe. */
            <div className="overflow-hidden rounded-3xl border border-line-strong">
              <Column side="before" data={COMPARISON.before} />
              <div className="relative flex items-center justify-center border-y border-line bg-void py-5">
                <span className="grid h-9 w-9 place-items-center rounded-full border border-volt/40 bg-volt/[0.07] text-volt">
                  <ArrowDown size={15} />
                </span>
              </div>
              <Column side="after" data={COMPARISON.after} />
            </div>
          )}
        </motion.div>
      </div>
    </Section>
  )
}

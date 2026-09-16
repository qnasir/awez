import { useRef, useState } from 'react'
import { motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion'
import {
  MessageSquare, Ticket, BadgeCheck, Send, UserCheck,
  ClipboardList, ScanLine, BellRing, CalendarClock, RefreshCw,
} from 'lucide-react'
import { AUTOMATION_FLOW } from '@/lib/content'
import { Section } from '@/components/primitives/Section'
import { SectionHeader } from '@/components/primitives/SectionHeader'
import { GridBackdrop } from '@/components/primitives/GridBackdrop'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { cn } from '@/lib/utils'

const ICONS = [MessageSquare, Ticket, BadgeCheck, Send, UserCheck, ClipboardList, ScanLine, BellRing, CalendarClock, RefreshCw]
const TOTAL = AUTOMATION_FLOW.length

function Node({ i, reached, reduced }: { i: number; reached: boolean; reduced: boolean }) {
  const step = AUTOMATION_FLOW[i]
  const Icon = ICONS[i]
  const last = i === TOTAL - 1

  return (
    <li className="relative z-10 flex min-w-0 flex-1 flex-col items-center text-center">
      <motion.span
        animate={{
          scale: reached ? 1 : 0.88,
          opacity: reached ? 1 : 0.45,
        }}
        transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 320, damping: 26 }}
        className={cn(
          'grid h-11 w-11 place-items-center rounded-xl border backdrop-blur-sm transition-colors duration-500',
          reached
            ? last
              ? 'border-volt/55 bg-volt text-volt-ink shadow-[0_0_28px_-6px_rgba(199,240,72,0.75)]'
              : 'border-volt/45 bg-ink text-volt shadow-[0_0_22px_-10px_rgba(199,240,72,0.9)]'
            : 'border-line bg-ink/60 text-mute',
        )}
      >
        <Icon size={16} />
      </motion.span>
      <motion.span
        animate={{ opacity: reached ? 1 : 0.4 }}
        transition={{ duration: 0.4 }}
        className="mt-3 block max-w-[10rem] text-[0.75rem] font-semibold leading-tight text-chalk"
      >
        {step.label}
      </motion.span>
      <span className="mt-1 block text-[0.625rem] leading-tight text-dim">{step.meta}</span>
    </li>
  )
}

/**
 * The member lifecycle, drawn as one continuous circuit.
 *
 * The light is driven by scroll position rather than a loop: the reader
 * advances the automation themselves, node by node, and the rail fills behind
 * them. A looping sweep plays whether anyone is watching or not — scrubbing
 * makes the section something you *do*, which is the whole claim the copy is
 * making.
 */
export function Automation() {
  const trackRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const [step, setStep] = useState(reduced ? TOTAL : 0)

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start 78%', 'end 45%'],
  })
  const eased = scrollYProgress

  useMotionValueEvent(eased, 'change', (v) => {
    const next = Math.round(v * TOTAL)
    setStep((prev) => (prev === next ? prev : next))
  })

  // Row one fills left→right over the first half, row two right→left over the second.
  const fillTop = useTransform(eased, [0, 0.46], [0, 1])
  const fillBottom = useTransform(eased, [0.54, 1], [0, 1])
  const elbow = useTransform(eased, [0.44, 0.58], [0, 1])
  const vertical = useTransform(eased, [0, 1], [0, 1])

  const reached = (i: number) => (reduced ? true : step > i)

  return (
    <Section id="automation" space="tight" aria-labelledby="automation-heading">
      <GridBackdrop size={64} opacity={0.05} />

      <div className="container-x">
        <SectionHeader
          id="automation-heading"
          eyebrow="Automation"
          lines={['SET IT ONCE.', 'IT RUNS FOREVER.']}
          accentLine={1}
          layout="center"
          body="One member's journey, from the first Instagram message to the renewal — with nobody remembering to do any of it."
          className="mx-auto max-w-4xl"
        />

        <div ref={trackRef} className="mt-14 lg:mt-16">
          {/* ---- Desktop: a serpentine circuit the reader drives ---- */}
          <div className="relative hidden lg:block">
            <ol className="relative flex items-start justify-between gap-2">
              <div aria-hidden className="pointer-events-none absolute inset-x-[10%] top-[1.375rem] h-px">
                <span className="absolute inset-0 bg-line-strong" />
                <motion.span
                  className="absolute inset-y-[-1px] left-0 w-full origin-left bg-gradient-to-r from-volt/70 to-volt"
                  style={{ scaleX: reduced ? 1 : fillTop }}
                />
              </div>
              {AUTOMATION_FLOW.slice(0, 5).map((_, i) => (
                <Node key={AUTOMATION_FLOW[i].id} i={i} reached={reached(i)} reduced={reduced} />
              ))}
            </ol>

            {/* The turn: a rounded elbow carrying the flow down to the second row */}
            <div aria-hidden className="relative h-20">
              <span className="absolute right-[10%] top-[-0.02rem] h-full w-[38%] rounded-br-[2.5rem] rounded-tr-[2.5rem] border-b border-r border-t-0 border-line-strong" />
              <motion.span
                className="absolute right-[10%] top-[-0.02rem] h-full w-[38%] rounded-br-[2.5rem] rounded-tr-[2.5rem] border-b border-r border-t-0 border-volt"
                style={{ opacity: reduced ? 1 : elbow }}
              />
            </div>

            <ol className="relative flex flex-row-reverse items-start justify-between gap-2">
              <div aria-hidden className="pointer-events-none absolute inset-x-[10%] top-[1.375rem] h-px">
                <span className="absolute inset-0 bg-line-strong" />
                <motion.span
                  className="absolute inset-y-[-1px] left-0 w-full origin-right bg-gradient-to-l from-volt/70 to-volt"
                  style={{ scaleX: reduced ? 1 : fillBottom }}
                />
              </div>
              {AUTOMATION_FLOW.slice(5).map((_, i) => (
                <Node key={AUTOMATION_FLOW[i + 5].id} i={i + 5} reached={reached(i + 5)} reduced={reduced} />
              ))}
            </ol>

            <motion.p
              animate={{ opacity: reached(TOTAL - 1) ? 1 : 0.25 }}
              transition={{ duration: 0.5 }}
              className="mt-12 text-center"
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-volt/30 bg-volt/[0.06] px-4 py-2 text-xs font-medium text-volt">
                <RefreshCw size={12} /> And the cycle starts again — automatically
              </span>
            </motion.p>
          </div>

          {/* ---- Mobile & tablet: a vertical rail that fills as you scroll ---- */}
          <ol className="relative flex flex-col gap-5 lg:hidden">
            <span aria-hidden className="absolute bottom-6 left-[1.375rem] top-6 w-px bg-line-strong" />
            <motion.span
              aria-hidden
              className="absolute bottom-6 left-[1.375rem] top-6 w-px origin-top bg-gradient-to-b from-volt to-volt/60"
              style={{ scaleY: reduced ? 1 : vertical }}
            />
            {AUTOMATION_FLOW.map((s, i) => {
              const Icon = ICONS[i]
              const last = i === TOTAL - 1
              const on = reached(i)
              return (
                <li key={s.id} className="relative z-10 flex items-center gap-4">
                  <motion.span
                    animate={{ scale: on ? 1 : 0.9, opacity: on ? 1 : 0.5 }}
                    transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 320, damping: 26 }}
                    className={cn(
                      'grid h-11 w-11 shrink-0 place-items-center rounded-xl border',
                      on
                        ? last
                          ? 'border-volt/55 bg-volt text-volt-ink'
                          : 'border-volt/45 bg-ink text-volt'
                        : 'border-line bg-ink/60 text-mute',
                    )}
                  >
                    <Icon size={16} />
                  </motion.span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-chalk">{s.label}</span>
                    <span className="block text-xs text-dim">{s.meta}</span>
                  </span>
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </Section>
  )
}

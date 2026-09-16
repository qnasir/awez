import { motion } from 'framer-motion'
import {
  MessageSquare, Ticket, BadgeCheck, Send, UserCheck,
  ClipboardList, ScanLine, BellRing, CalendarClock, RefreshCw,
} from 'lucide-react'
import { AUTOMATION_FLOW } from '@/lib/content'
import { Section } from '@/components/primitives/Section'
import { SectionHeader } from '@/components/primitives/SectionHeader'
import { GridBackdrop } from '@/components/primitives/GridBackdrop'
import { useInViewOnce } from '@/hooks/useInViewOnce'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { cn } from '@/lib/utils'

const ICONS = [MessageSquare, Ticket, BadgeCheck, Send, UserCheck, ClipboardList, ScanLine, BellRing, CalendarClock, RefreshCw]
const EASE = [0.16, 1, 0.3, 1] as const

function Node({ i, inView, reduced }: { i: number; inView: boolean; reduced: boolean }) {
  const step = AUTOMATION_FLOW[i]
  const Icon = ICONS[i]
  const last = i === AUTOMATION_FLOW.length - 1

  return (
    <motion.li
      initial={reduced ? false : { opacity: 0, y: 18, scale: 0.94 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.55, delay: 0.15 + i * 0.1, ease: EASE }}
      className="relative z-10 flex min-w-0 flex-1 flex-col items-center text-center"
    >
      <span
        className={cn(
          'grid h-11 w-11 place-items-center rounded-xl border backdrop-blur-sm transition-colors duration-500',
          last
            ? 'border-volt/55 bg-volt text-volt-ink shadow-[0_0_28px_-6px_rgba(199,240,72,0.75)]'
            : 'border-line-strong bg-ink text-volt',
        )}
      >
        <Icon size={16} />
      </span>
      <span className="mt-3 block max-w-[10rem] text-[0.75rem] font-semibold leading-tight text-chalk">
        {step.label}
      </span>
      <span className="mt-1 block text-[0.625rem] leading-tight text-dim">{step.meta}</span>
    </motion.li>
  )
}

/** The rail a row of nodes sits on, with a pulse of light travelling along it. */
function Rail({ reverse = false, active }: { reverse?: boolean; active: boolean }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-[10%] top-[1.375rem] h-px">
      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-line-strong to-transparent" />
      {active && (
        <span
          className="absolute inset-y-[-1px] w-24 bg-gradient-to-r from-transparent via-volt to-transparent blur-[1px]"
          style={{
            animation: 'sweep 3.4s cubic-bezier(0.65,0,0.35,1) infinite',
            animationDirection: reverse ? 'reverse' : 'normal',
          }}
        />
      )}
    </div>
  )
}

/**
 * The member lifecycle, drawn as one continuous circuit. Light runs the rail
 * to make the point that this is a loop the platform closes on its own — the
 * last node feeds the first.
 */
export function Automation() {
  const { ref, inView } = useInViewOnce<HTMLDivElement>('-12% 0px -12% 0px')
  const reduced = useReducedMotion()
  const top = AUTOMATION_FLOW.slice(0, 5)
  const bottom = AUTOMATION_FLOW.slice(5)

  return (
    <Section id="automation" aria-labelledby="automation-heading">
      <GridBackdrop size={64} opacity={0.05} />

      <div className="container-x">
        <SectionHeader
          id="automation-heading"
          eyebrow="Automation"
          lines={['SET IT ONCE.', 'IT RUNS FOREVER.']}
          accentLine={1}
          body="One member's journey, from the first Instagram message to the renewal — with nobody remembering to do any of it."
          align="center"
          className="mx-auto max-w-4xl"
        />

        <div ref={ref} className="mt-16 lg:mt-20">
          {/* ---- Desktop: a serpentine circuit ---- */}
          <div className="relative hidden lg:block">
            <ol className="relative flex items-start justify-between gap-2">
              <Rail active={inView && !reduced} />
              {top.map((_, i) => (
                <Node key={AUTOMATION_FLOW[i].id} i={i} inView={inView} reduced={reduced} />
              ))}
            </ol>

            {/* The turn: a rounded elbow carrying the flow down to the second row */}
            <div aria-hidden className="relative h-20">
              <span className="absolute right-[10%] top-[-0.02rem] h-full w-[38%] rounded-br-[2.5rem] rounded-tr-[2.5rem] border-b border-r border-t-0 border-line-strong" />
            </div>

            <ol className="relative flex flex-row-reverse items-start justify-between gap-2">
              <Rail active={inView && !reduced} reverse />
              {bottom.map((_, i) => (
                <Node key={AUTOMATION_FLOW[i + 5].id} i={i + 5} inView={inView} reduced={reduced} />
              ))}
            </ol>

            {/* The loop closes: renewal feeds back into the lifecycle */}
            <motion.p
              initial={reduced ? false : { opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 1.3 }}
              className="mt-12 text-center"
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-volt/30 bg-volt/[0.06] px-4 py-2 text-xs font-medium text-volt">
                <RefreshCw size={12} /> And the cycle starts again — automatically
              </span>
            </motion.p>
          </div>

          {/* ---- Mobile & tablet: a vertical rail, one node per row ---- */}
          <ol className="relative flex flex-col gap-5 lg:hidden">
            <span
              aria-hidden
              className="absolute bottom-6 left-[1.375rem] top-6 w-px bg-gradient-to-b from-volt/45 via-line-strong to-volt/45"
            />
            {AUTOMATION_FLOW.map((step, i) => {
              const Icon = ICONS[i]
              const last = i === AUTOMATION_FLOW.length - 1
              return (
                <motion.li
                  key={step.id}
                  initial={reduced ? false : { opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-8% 0px -8% 0px' }}
                  transition={{ duration: 0.5, delay: (i % 5) * 0.06, ease: EASE }}
                  className="relative z-10 flex items-center gap-4"
                >
                  <span
                    className={cn(
                      'grid h-11 w-11 shrink-0 place-items-center rounded-xl border',
                      last ? 'border-volt/55 bg-volt text-volt-ink' : 'border-line-strong bg-ink text-volt',
                    )}
                  >
                    <Icon size={16} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-chalk">{step.label}</span>
                    <span className="block text-xs text-dim">{step.meta}</span>
                  </span>
                </motion.li>
              )
            })}
          </ol>
        </div>
      </div>
    </Section>
  )
}

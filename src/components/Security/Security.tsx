import { Database, Lock, Cloud, History, KeyRound, ShieldCheck } from 'lucide-react'
import { SECURITY_LAYERS, COMPLIANCE } from '@/lib/content'
import { Section } from '@/components/primitives/Section'
import { SectionHeader } from '@/components/primitives/SectionHeader'
import { Reveal } from '@/components/primitives/Reveal'
import { motion } from 'framer-motion'
import { useInViewOnce } from '@/hooks/useInViewOnce'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const ICONS = [Database, Lock, Cloud, History, KeyRound]
const EASE = [0.16, 1, 0.3, 1] as const

/**
 * Security as an architecture diagram rather than a paragraph of promises:
 * five layers a record passes through, drawn as one descending stack.
 *
 * The restraint is the point — a security section that glows and pulses reads
 * as marketing. This one reads as documentation.
 */
export function Security() {
  const { ref, inView } = useInViewOnce<HTMLOListElement>('-12% 0px -12% 0px')
  const reduced = useReducedMotion()

  return (
    <Section id="security" aria-labelledby="security-heading" space="sm" className="border-y border-line bg-ink/40">
      <div className="container-x">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
          <div>
            <SectionHeader
              id="security-heading"
              eyebrow="Security & data"
              lines={['YOUR MEMBERS', 'TRUSTED YOU FIRST.']}
              accentLine={1}
              body="Their phone numbers, their payments, their fingerprints. Here is exactly what happens to a record after it leaves the front desk."
              size="md"
            />

            <ul className="mt-9 flex flex-wrap gap-2">
              {COMPLIANCE.map((c, i) => (
                <Reveal key={c} delay={i * 0.05} distance={10} speed="detail" as="li">
                  <span className="flex items-center gap-1.5 rounded-full border border-line bg-white/[0.02] px-3 py-1.5 text-[0.6875rem] font-medium text-ash">
                    <ShieldCheck size={11} className="text-volt" />
                    {c}
                  </span>
                </Reveal>
              ))}
            </ul>
          </div>

          {/* The stack */}
          <ol ref={ref} className="relative flex flex-col gap-3">
            {/* The spine every layer hangs from */}
            <span
              aria-hidden
              className="absolute bottom-8 left-[1.4rem] top-8 w-px bg-gradient-to-b from-volt/50 via-line-strong to-volt/50"
            />

            {SECURITY_LAYERS.map((layer, i) => {
              const Icon = ICONS[i]
              return (
                <motion.li
                  key={layer.id}
                  initial={reduced ? false : { opacity: 0, x: 22 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.1 + i * 0.09, ease: EASE }}
                  className="relative z-10 flex items-start gap-4"
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-line-strong bg-carbon text-volt">
                    <Icon size={16} />
                  </span>
                  <div className="min-w-0 flex-1 rounded-xl border border-line bg-white/[0.02] px-4 py-3">
                    <h3 className="text-[0.875rem] font-semibold text-chalk">{layer.title}</h3>
                    <p className="mt-1 text-[0.8125rem] leading-relaxed text-smoke">{layer.body}</p>
                  </div>
                </motion.li>
              )
            })}
          </ol>
        </div>
      </div>
    </Section>
  )
}

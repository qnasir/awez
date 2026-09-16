import { motion } from 'framer-motion'
import { Sparkles, CornerDownLeft, Check } from 'lucide-react'
import { AI_CONVERSATION, AI_CAPABILITIES } from '@/lib/content'
import { Section } from '@/components/primitives/Section'
import { SectionHeader } from '@/components/primitives/SectionHeader'
import { Reveal } from '@/components/primitives/Reveal'
import { GridBackdrop, LightBeam } from '@/components/primitives/GridBackdrop'
import { useInViewOnce } from '@/hooks/useInViewOnce'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { cn } from '@/lib/utils'

const EASE = [0.16, 1, 0.3, 1] as const
const TONE = {
  good: 'text-volt',
  warn: 'text-[#FFC53D]',
  bad: 'text-ember',
} as const

/**
 * The AI chapter. The glow here is the only place on the site where light is
 * allowed to feel synthetic — and even then it stays inside one frame, because
 * an assistant that looks like a toy will not be trusted with a P&L.
 *
 * The conversation plays once on entry, one turn at a time.
 */
export function AISection() {
  const { ref, inView } = useInViewOnce<HTMLDivElement>('-15% 0px -15% 0px')
  const reduced = useReducedMotion()

  // Each turn waits for the previous one to land.
  const turnDelay = (i: number) => 0.3 + i * 0.75

  return (
    <Section id="ai" space="wide" aria-labelledby="ai-heading">
      <GridBackdrop size={72} opacity={0.05} />
      <LightBeam className="left-1/2 top-0 -translate-x-1/2" size="60rem" color="rgba(199,240,72,0.09)" />
      <LightBeam className="-right-52 bottom-0" size="40rem" color="rgba(107,124,255,0.09)" />

      <div className="container-x">
        <SectionHeader
          id="ai-heading"
          eyebrow="KINETIQ Intelligence"
          lines={['YOUR GYM DATA.', 'NOW THINKING FOR YOU.']}
          accentLine={1}
          treatment="outline"
          layout="center"
          body="Every check-in, payment and missed session is a signal. KINETIQ reads them together and tells you what is about to happen — while there is still time to change it."
          className="mx-auto max-w-4xl"
        />

        <div className="mt-14 grid gap-8 lg:mt-16 lg:grid-cols-[1.35fr_1fr] lg:gap-10">
          {/* ---- Conversation ---- */}
          <motion.div
            ref={ref}
            initial={reduced ? false : { opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-12% 0px -12% 0px' }}
            transition={{ duration: 0.9, ease: EASE }}
            className="relative overflow-hidden rounded-2xl border border-line-strong bg-[linear-gradient(180deg,#12141A,#0A0B0E)] p-5 md:p-7"
          >
            <span className="pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-volt/45 to-transparent" />
            <div
              aria-hidden
              className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-volt/[0.10] blur-[70px]"
            />

            <div className="relative flex items-center gap-2.5 border-b border-line pb-4">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-volt/12 text-volt">
                <Sparkles size={13} />
              </span>
              <span className="text-[0.8125rem] font-semibold text-chalk">Ask KINETIQ</span>
              <span className="ml-auto flex items-center gap-1.5 text-[0.625rem] text-dim">
                <span className="h-1.5 w-1.5 rounded-full bg-volt" /> Reading 1,284 member records
              </span>
            </div>

            <ul className="relative mt-5 flex flex-col gap-4">
              {AI_CONVERSATION.map((turn, i) => (
                <motion.li
                  key={i}
                  initial={reduced ? false : { opacity: 0, y: 14 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: turnDelay(i), ease: EASE }}
                  className={cn('flex', turn.role === 'owner' ? 'justify-end' : 'justify-start')}
                >
                  <div className={cn('max-w-[88%]', turn.role === 'owner' && 'text-right')}>
                    <span className="mono-label mb-1.5 block text-[0.5625rem]">
                      {turn.role === 'owner' ? 'You' : 'KINETIQ'}
                    </span>

                    <div
                      className={cn(
                        'rounded-2xl px-4 py-3 text-left',
                        turn.role === 'owner'
                          ? 'rounded-tr-md bg-white/[0.05] text-chalk'
                          : 'rounded-tl-md border border-line bg-white/[0.02] text-chalk',
                      )}
                    >
                      <p className="text-[0.875rem] leading-relaxed">{turn.text}</p>

                      {'detail' in turn && turn.detail && (
                        <dl className="mt-3.5 grid grid-cols-3 gap-2 border-t border-line pt-3">
                          {turn.detail.map((d, di) => (
                            <motion.div
                              key={d.label}
                              initial={reduced ? false : { opacity: 0, y: 8 }}
                              animate={inView ? { opacity: 1, y: 0 } : {}}
                              transition={{ duration: 0.45, delay: turnDelay(i) + 0.35 + di * 0.12, ease: EASE }}
                            >
                              <dt className="text-[0.5625rem] leading-tight text-dim">{d.label}</dt>
                              <dd className={cn('mt-1 font-display text-lg font-bold tabular-nums', TONE[d.tone])}>
                                {d.value}
                              </dd>
                            </motion.div>
                          ))}
                        </dl>
                      )}

                      {'actions' in turn && turn.actions && (
                        <ul className="mt-3 flex flex-col gap-1.5 border-t border-line pt-3">
                          {turn.actions.map((a, ai) => (
                            <motion.li
                              key={a}
                              initial={reduced ? false : { opacity: 0, x: -8 }}
                              animate={inView ? { opacity: 1, x: 0 } : {}}
                              transition={{ duration: 0.4, delay: turnDelay(i) + 0.3 + ai * 0.14, ease: EASE }}
                              className="flex items-center gap-2 text-[0.75rem] text-ash"
                            >
                              <span className="grid h-3.5 w-3.5 shrink-0 place-items-center rounded-full bg-volt/15">
                                <Check size={8} className="text-volt" strokeWidth={3.5} />
                              </span>
                              {a}
                            </motion.li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </motion.li>
              ))}
            </ul>

            {/* Composer — static, but it tells you what kind of thing you can ask */}
            <motion.div
              initial={reduced ? false : { opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: turnDelay(AI_CONVERSATION.length) }}
              className="relative mt-6 flex items-center gap-2 rounded-xl border border-line bg-white/[0.02] px-3.5 py-3"
            >
              <Sparkles size={13} className="shrink-0 text-volt/70" />
              <span className="min-w-0 flex-1 truncate text-[0.8125rem] text-dim">
                Which trainers keep members the longest?
              </span>
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-white/[0.06] text-smoke">
                <CornerDownLeft size={11} />
              </span>
            </motion.div>
          </motion.div>

          {/* ---- Capabilities ---- */}
          <ul className="flex flex-col gap-3">
            {AI_CAPABILITIES.map((c, i) => (
              <Reveal key={c.title} delay={i * 0.08} distance={20} speed="product" as="li">
                <div className="group relative h-full overflow-hidden rounded-2xl border border-line bg-carbon p-5 transition-[transform,border-color,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-line-strong hover:shadow-[0_22px_50px_-28px_rgba(0,0,0,0.9)] md:p-6">
                  <span className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/14 to-transparent" />
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-[0.625rem] text-volt/70">{String(i + 1).padStart(2, '0')}</span>
                    <h3 className="font-display text-base font-bold tracking-tight text-chalk">{c.title}</h3>
                  </div>
                  <p className="mt-2 text-[0.8125rem] leading-relaxed text-smoke">{c.body}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  )
}

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Minus, Plus } from 'lucide-react'
import { PLANS, PRICING_NOTE, FAQS, type Plan } from '@/lib/content'
import { Section } from '@/components/primitives/Section'
import { SectionHeader } from '@/components/primitives/SectionHeader'
import { Reveal } from '@/components/primitives/Reveal'
import { Button } from '@/components/primitives/Button'
import { GridBackdrop } from '@/components/primitives/GridBackdrop'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { formatINR, cn } from '@/lib/utils'

const EASE = [0.16, 1, 0.3, 1] as const

/** Monthly/yearly switch — a real checkbox, so it is keyboard- and screen-reader-operable. */
function BillingToggle({ yearly, onChange }: { yearly: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-center gap-3.5">
      <span className={cn('text-sm transition-colors', yearly ? 'text-smoke' : 'text-chalk')}>Monthly</span>

      <label className="relative inline-flex cursor-pointer items-center">
        <input
          type="checkbox"
          className="peer sr-only"
          checked={yearly}
          onChange={(e) => onChange(e.target.checked)}
          aria-label="Bill yearly and save two months"
        />
        <span className="h-7 w-[3.25rem] rounded-full border border-line-strong bg-white/[0.04] transition-colors peer-checked:border-volt/45 peer-checked:bg-volt/15 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-volt" />
        <motion.span
          className="pointer-events-none absolute left-[0.2rem] top-1/2 h-[1.375rem] w-[1.375rem] -translate-y-1/2 rounded-full bg-chalk"
          animate={{ x: yearly ? 24 : 0, backgroundColor: yearly ? '#C7F048' : '#F4F5F7' }}
          transition={{ type: 'spring', stiffness: 520, damping: 32 }}
        />
      </label>

      <span className={cn('text-sm transition-colors', yearly ? 'text-chalk' : 'text-smoke')}>Yearly</span>
      <span className="rounded-full bg-volt/12 px-2.5 py-1 text-[0.6875rem] font-semibold text-volt">
        2 months free
      </span>
    </div>
  )
}

function PlanCard({ plan, yearly, index }: { plan: Plan; yearly: boolean; index: number }) {
  const reduced = useReducedMotion()
  const price = yearly ? plan.yearly : plan.monthly
  const featured = plan.featured

  return (
    <Reveal delay={index * 0.07} distance={26} speed="product" as="li" className="h-full">
      <article
        className={cn(
          'group relative flex h-full flex-col overflow-hidden rounded-2xl p-6 md:p-7',
          featured
            ? 'border border-volt/35 bg-[linear-gradient(180deg,rgba(199,240,72,0.07),rgba(199,240,72,0.012)_38%,transparent)] bg-carbon'
            : 'border border-line bg-carbon transition-colors duration-500 hover:border-line-strong',
        )}
      >
        {/* The recommended plan is marked by a travelling edge light, not a badge */}
        {featured && !reduced && (
          <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px overflow-hidden">
            <span className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-volt to-transparent"
                  style={{ animation: 'sweep 4.5s cubic-bezier(0.65,0,0.35,1) infinite' }} />
          </span>
        )}
        {featured && (
          <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-volt/25" />
        )}

        <header>
          <div className="flex items-baseline gap-2.5">
            <h3 className="font-display text-lg font-bold tracking-tight text-chalk">{plan.name}</h3>
            {featured && <span className="text-[0.625rem] font-medium uppercase tracking-[0.14em] text-volt">Most chosen</span>}
          </div>
          <p className="mt-1.5 min-h-[2.5rem] text-[0.8125rem] leading-snug text-smoke">{plan.tagline}</p>
        </header>

        <div className="mt-5 flex min-h-[3.5rem] items-baseline gap-1.5">
          {price === null ? (
            <span className="font-display text-[2rem] font-extrabold leading-none tracking-tight text-chalk">
              Custom
            </span>
          ) : (
            <>
              <span className="font-display text-[1.375rem] font-semibold leading-none text-smoke">₹</span>
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={price}
                  initial={reduced ? false : { y: 14, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={reduced ? undefined : { y: -14, opacity: 0 }}
                  transition={{ duration: 0.28, ease: EASE }}
                  className="font-display text-[2.25rem] font-extrabold leading-none tracking-tight text-chalk tabular-nums"
                >
                  {formatINR(price)}
                </motion.span>
              </AnimatePresence>
              <span className="text-[0.8125rem] text-smoke">/mo</span>
            </>
          )}
        </div>
        <p className="mt-1 text-[0.6875rem] text-dim">{plan.memberCap}</p>

        <div className="mt-6">
          <Button
            href="#contact"
            variant={featured ? 'primary' : 'secondary'}
            className="w-full"
            size="md"
          >
            {plan.cta}
          </Button>
        </div>

        <ul className="mt-7 flex flex-col gap-2.5 border-t border-line pt-6">
          {plan.features.map((f) => (
            <li key={f} className="flex items-start gap-2.5 text-[0.8125rem] leading-snug text-ash">
              <span
                className={cn(
                  'mt-[0.2rem] grid h-3.5 w-3.5 shrink-0 place-items-center rounded-full',
                  featured ? 'bg-volt/18' : 'bg-white/[0.07]',
                )}
              >
                <Check size={9} className={featured ? 'text-volt' : 'text-smoke'} strokeWidth={3} />
              </span>
              {f}
            </li>
          ))}
        </ul>
      </article>
    </Reveal>
  )
}

function Faq() {
  const [open, setOpen] = useState<number | null>(0)
  const reduced = useReducedMotion()

  return (
    <div className="mx-auto mt-24 max-w-3xl md:mt-32" id="faq">
      <Reveal distance={14} speed="detail">
        <h3 className="text-center font-display text-2xl font-bold tracking-tight text-chalk md:text-3xl">
          Before you ask
        </h3>
      </Reveal>

      <ul className="mt-10 border-t border-line">
        {FAQS.map((faq, i) => {
          const isOpen = open === i
          return (
            <Reveal key={faq.q} delay={i * 0.05} distance={14} speed="detail" as="li">
              <div className="border-b border-line">
                <h4>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${i}`}
                    id={`faq-trigger-${i}`}
                    className="flex w-full items-center justify-between gap-6 py-5 text-left transition-colors hover:text-chalk"
                  >
                    <span className={cn('text-[0.9375rem] font-medium md:text-base', isOpen ? 'text-chalk' : 'text-ash')}>
                      {faq.q}
                    </span>
                    <span
                      className={cn(
                        'grid h-7 w-7 shrink-0 place-items-center rounded-full border transition-colors duration-300',
                        isOpen ? 'border-volt/50 bg-volt/12 text-volt' : 'border-line text-smoke',
                      )}
                    >
                      {isOpen ? <Minus size={13} /> : <Plus size={13} />}
                    </span>
                  </button>
                </h4>
                <motion.div
                  id={`faq-panel-${i}`}
                  role="region"
                  aria-labelledby={`faq-trigger-${i}`}
                  initial={false}
                  animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                  transition={reduced ? { duration: 0 } : { duration: 0.42, ease: EASE }}
                  className="overflow-hidden"
                >
                  <p className="max-w-[62ch] pb-6 text-[0.875rem] leading-relaxed text-smoke">{faq.a}</p>
                </motion.div>
              </div>
            </Reveal>
          )
        })}
      </ul>
    </div>
  )
}

export function Pricing() {
  const [yearly, setYearly] = useState(true)

  return (
    <Section id="pricing" aria-labelledby="pricing-heading">
      <GridBackdrop size={80} opacity={0.045} />

      <div className="container-x">
        <SectionHeader
          id="pricing-heading"
          eyebrow="Pricing"
          lines={['PAY FOR THE FLOOR.', 'NOT PER FEATURE.']}
          accentLine={1}
          body="Every plan includes free migration, staff training and support. No setup fee, no per-seat billing, no contract on monthly plans."
          align="center"
          className="mx-auto max-w-4xl"
        />

        <div className="mt-10">
          <BillingToggle yearly={yearly} onChange={setYearly} />
        </div>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {PLANS.map((plan, i) => (
            <PlanCard key={plan.id} plan={plan} yearly={yearly} index={i} />
          ))}
        </ul>

        <Reveal delay={0.1} distance={12} speed="detail">
          <p className="mt-8 text-center text-xs text-dim">{PRICING_NOTE}</p>
        </Reveal>

        <Faq />
      </div>
    </Section>
  )
}

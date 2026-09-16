import { useRef, useState } from 'react'
import { motion, useMotionTemplate } from 'framer-motion'
import { ArrowUpRight, ArrowRight } from 'lucide-react'
import { FINAL_CTA, BRAND } from '@/lib/content'
import { Section } from '@/components/primitives/Section'
import { SplitHeadline } from '@/components/primitives/SplitHeadline'
import { Reveal } from '@/components/primitives/Reveal'
import { Button } from '@/components/primitives/Button'
import { GridBackdrop } from '@/components/primitives/GridBackdrop'
import { Particles } from '@/components/Hero/Particles'
import { usePointerField } from '@/hooks/useMousePosition'
import { useIsTouch } from '@/hooks/useMediaQuery'
import { useReducedMotion } from '@/hooks/useReducedMotion'

/**
 * The close. It mirrors the hero's lighting so the page ends where it began,
 * one octave brighter: the light pool follows the cursor and swells when the
 * primary action is hovered, so the page physically reacts to the decision.
 */
export function CTA() {
  const ref = useRef<HTMLElement | null>(null)
  const isTouch = useIsTouch()
  const reduced = useReducedMotion()
  const lightsOn = !isTouch && !reduced
  const [hot, setHot] = useState(false)

  const { px, py } = usePointerField(ref, { disabled: !lightsOn, stiffness: 60, damping: 24 })
  const light = useMotionTemplate`radial-gradient(620px circle at calc(${px} * 100%) calc(${py} * 100%), rgba(199,240,72,${
    hot ? 0.17 : 0.085
  }), transparent 62%)`

  return (
    <Section id="contact" ref={ref} className="overflow-hidden grain" aria-labelledby="cta-heading">
      <GridBackdrop size={64} opacity={0.055} />
      <Particles className="absolute inset-0 h-full w-full" count={34} />

      {/* Floor light that grounds the block */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[26rem] w-[62rem] max-w-[120vw] -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-volt/[0.09] blur-[130px] transition-opacity duration-700"
        style={{ opacity: hot ? 1 : 0.7 }}
      />
      {lightsOn && (
        <motion.div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: light }} />
      )}

      <div className="container-x relative">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <Reveal distance={12} speed="detail">
            <span className="mono-label">Start here</span>
          </Reveal>

          <SplitHeadline
            as="h2"
            id="cta-heading"
            lines={FINAL_CTA.headline}
            accentLine={1}
            delay={0.08}
            className="mt-6 text-d1 font-extrabold text-chalk"
          />
          <Reveal delay={0.2} distance={20} speed="product">
            <p className="mt-7 max-w-[42ch] text-base leading-relaxed text-ash md:text-lg">{FINAL_CTA.body}</p>
          </Reveal>

          <Reveal delay={0.3} distance={20} speed="product">
            <div
              className="mt-10 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row"
              onPointerEnter={() => setHot(true)}
              onPointerLeave={() => setHot(false)}
            >
              <Button href={`mailto:${BRAND.email}`} size="lg" className="w-full sm:w-auto" data-cursor="Demo" icon={<ArrowUpRight size={16} />}>
                {FINAL_CTA.primary}
              </Button>
              <Button href={`tel:${BRAND.phone.replace(/\s/g, '')}`} size="lg" variant="secondary" className="w-full sm:w-auto" icon={<ArrowRight size={16} />}>
                {FINAL_CTA.secondary}
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.4} distance={14} speed="detail">
            <p className="mono-label mt-7 text-[0.625rem] normal-case tracking-[0.08em]">{FINAL_CTA.reassure}</p>
          </Reveal>
        </div>
      </div>
    </Section>
  )
}

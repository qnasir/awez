import { useEffect, useRef } from 'react'
import { Quote } from 'lucide-react'
import { TESTIMONIALS } from '@/lib/content'
import { Section } from '@/components/primitives/Section'
import { SectionHeader } from '@/components/primitives/SectionHeader'
import { GridBackdrop } from '@/components/primitives/GridBackdrop'
import { useIsDesktop } from '@/hooks/useMediaQuery'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { cn } from '@/lib/utils'

/**
 * Editorial testimonials that travel sideways as the page scrolls down.
 *
 * This is the one place GSAP earns its weight: ScrollTrigger's pin + scrub
 * handles the pin-spacer maths, resize recalculation and scrub inertia that
 * a hand-rolled sticky translation gets subtly wrong. It is imported
 * dynamically, so the ~40KB only loads for desktop visitors who reach here —
 * and never for reduced-motion users, who get a scroll-snapped rail instead.
 */
export function Testimonials() {
  const pinRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const isDesktop = useIsDesktop()
  const reduced = useReducedMotion()
  const horizontal = isDesktop && !reduced

  useEffect(() => {
    if (!horizontal) return
    let cleanup: (() => void) | undefined
    let cancelled = false

    ;(async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ])
      if (cancelled) return
      gsap.registerPlugin(ScrollTrigger)

      const pin = pinRef.current
      const track = trackRef.current
      if (!pin || !track) return

      const ctx = gsap.context(() => {
        const distance = () => track.scrollWidth - pin.clientWidth

        gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: pin,
            start: 'top top',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        })
      }, pin)

      cleanup = () => ctx.revert()
    })()

    return () => {
      cancelled = true
      cleanup?.()
    }
  }, [horizontal])

  const cards = TESTIMONIALS.map((t, i) => (
    <figure
      key={t.name}
      className={cn(
        'relative flex shrink-0 flex-col justify-between overflow-hidden rounded-3xl border border-line bg-carbon p-7 md:p-10',
        horizontal ? 'h-[30rem] w-[40rem]' : 'w-[85vw] max-w-[32rem] snap-center lg:w-full lg:max-w-none',
      )}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/16 to-transparent"
      />
      <span aria-hidden className="absolute right-7 top-7 text-volt/12">
        <Quote size={54} strokeWidth={1.25} />
      </span>

      <div className="relative">
        <span className="mono-label">{String(i + 1).padStart(2, '0')} / {String(TESTIMONIALS.length).padStart(2, '0')}</span>
        <blockquote className="mt-5">
          <p className="font-display text-[1.625rem] font-extrabold leading-[1.04] tracking-[-0.035em] text-chalk md:text-[2.125rem]">
            {t.quote.map((line, li) => (
              <span key={line} className={cn('block', li === 1 && 'text-volt')}>
                {line}
              </span>
            ))}
          </p>
          <p className="mt-6 max-w-[46ch] text-[0.9375rem] leading-relaxed text-ash">{t.body}</p>
        </blockquote>
      </div>

      <figcaption className="relative mt-9 flex items-end justify-between gap-6 border-t border-line pt-6">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-chalk">{t.name}</p>
          <p className="mt-0.5 text-[0.8125rem] text-smoke">
            {t.role} · {t.org}
          </p>
          <p className="text-[0.8125rem] text-dim">{t.location}</p>
        </div>
        <div className="shrink-0 text-right">
          <p className="font-display text-2xl font-extrabold leading-none tracking-tight text-volt">{t.stat.value}</p>
          <p className="mt-1 max-w-[14ch] text-[0.6875rem] leading-tight text-dim">{t.stat.label}</p>
        </div>
      </figcaption>
    </figure>
  ))

  return (
    <Section aria-labelledby="testimonials-heading" className="overflow-hidden">
      <GridBackdrop size={80} opacity={0.04} />

      <div className="container-x">
        <SectionHeader
          id="testimonials-heading"
          eyebrow="Operators"
          lines={['THE PEOPLE', 'ON THE FLOOR.']}
          accentLine={1}
          body="Owners who replaced a drawer of registers and three spreadsheets with one platform."
          className="max-w-4xl"
        />
      </div>

      {horizontal ? (
        /* The pinned stage fills the viewport so the cards sit centred on
           screen rather than clinging to the top edge under the navbar. */
        <div ref={pinRef} className="mt-16 flex h-screen items-center">
          <div
            ref={trackRef}
            className="flex gap-6 pl-[max(1.25rem,calc((100vw-84rem)/2+3.5rem))] pr-[22vw]"
          >
            {cards}
          </div>
        </div>
      ) : (
        <div className="container-x">
          <div className="no-scrollbar -mx-5 mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 md:-mx-10 md:px-10 lg:mx-0 lg:grid lg:grid-cols-2 lg:gap-6 lg:overflow-visible lg:px-0">
            {cards}
          </div>
        </div>
      )}
    </Section>
  )
}

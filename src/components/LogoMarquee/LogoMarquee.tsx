import { CLIENTS, PROOF_STATS } from '@/lib/content'
import { Marquee } from '@/components/primitives/Marquee'
import { Reveal } from '@/components/primitives/Reveal'
import { Counter } from '@/components/primitives/Counter'
import { Section } from '@/components/primitives/Section'

/**
 * Social proof in two registers: a slow belt of customer wordmarks, then four
 * numbers that make the belt mean something.
 *
 * Hovering the belt stops it and lifts the hovered name out of the grayscale —
 * the surrounding names dim, so the interaction reads as focus rather than
 * decoration.
 */
export function LogoMarquee() {
  return (
    <Section space="sm" className="border-y border-line bg-ink/40">
      <div className="container-x">
        <Reveal distance={12} speed="detail">
          <p className="mono-label text-center">Trusted by modern fitness businesses</p>
        </Reveal>
      </div>

      <div className="group/belt relative mt-9">
        <Marquee duration={52} gap="4rem">
          {CLIENTS.map((name) => (
            <span
              key={name}
              className="shrink-0 cursor-default whitespace-nowrap font-display text-lg font-bold tracking-[0.06em] text-smoke transition-[color,opacity,transform] duration-500
                         hover:!text-chalk hover:!opacity-100 group-hover/belt:opacity-35 md:text-xl"
            >
              {name}
            </span>
          ))}
        </Marquee>
      </div>

      <div className="container-x mt-14 md:mt-16">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-9 border-t border-line pt-10 lg:grid-cols-4">
          {PROOF_STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.07} distance={18} speed="product">
              <div className="border-l border-line pl-4 md:pl-5">
                <dt className="sr-only">{s.label}</dt>
                <dd>
                  <span className="block font-display text-[2.25rem] font-extrabold leading-none tracking-tight text-chalk md:text-[2.75rem]">
                    <Counter
                      to={s.value}
                      suffix={s.suffix}
                      precision={'precision' in s ? (s.precision as number) : 0}
                      duration={1.8}
                      delay={i * 0.08}
                    />
                  </span>
                  <span className="mt-2.5 block max-w-[22ch] text-[0.8125rem] leading-snug text-smoke">
                    {s.label}
                  </span>
                </dd>
              </div>
            </Reveal>
          ))}
        </dl>
      </div>
    </Section>
  )
}

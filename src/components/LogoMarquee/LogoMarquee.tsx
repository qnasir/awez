import { CLIENTS, PROOF_STATS } from '@/lib/content'
import { Marquee } from '@/components/primitives/Marquee'
import { Reveal } from '@/components/primitives/Reveal'
import { Counter } from '@/components/primitives/Counter'
import { Section } from '@/components/primitives/Section'
import { BrandLockup } from './BrandLockup'

/**
 * Social proof in two registers: two counter-running belts of customer
 * lockups, then four numbers that make the belts mean something.
 *
 * Two rows travelling in opposite directions read as motion in a field rather
 * than a single sliding strip, and hovering the field dims everything except
 * the name under the cursor.
 */
export function LogoMarquee() {
  const half = Math.ceil(CLIENTS.length / 2)
  const rows = [CLIENTS.slice(0, half), CLIENTS.slice(half)]

  return (
    <Section space="band" className="border-y border-line bg-ink/40">
      <div className="container-x">
        <Reveal distance={12} speed="detail">
          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-gradient-to-r from-transparent to-line-strong" />
            <p className="mono-label text-center">Trusted by modern fitness businesses</p>
            <span className="h-px w-8 bg-gradient-to-l from-transparent to-line-strong" />
          </div>
        </Reveal>
      </div>

      <div className="group/belt relative mt-8 flex flex-col gap-4">
        {rows.map((row, i) => (
          <Marquee key={i} duration={i === 0 ? 56 : 68} reverse={i === 1} gap="3rem">
            {row.map((name, j) => (
              <BrandLockup
                key={name}
                name={name}
                index={i * half + j}
                className="hover:!text-chalk hover:!opacity-100 group-hover/belt:opacity-40"
              />
            ))}
          </Marquee>
        ))}
      </div>

      <div className="container-x mt-12 md:mt-14">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-9 border-t border-line pt-10 lg:grid-cols-4">
          {PROOF_STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.07} distance={18} speed="product">
              <div className="group/stat relative border-l border-line pl-4 transition-colors duration-500 hover:border-volt/50 md:pl-5">
                <dt className="sr-only">{s.label}</dt>
                <dd>
                  <span className="block font-display text-[2.375rem] font-extrabold leading-none tracking-[-0.04em] text-chalk md:text-[3rem]">
                    <Counter
                      to={s.value}
                      suffix={s.suffix}
                      precision={'precision' in s ? (s.precision as number) : 0}
                      duration={1.8}
                      delay={i * 0.08}
                    />
                  </span>
                  <span className="mt-3 block max-w-[22ch] text-[0.8125rem] leading-snug text-smoke">{s.label}</span>
                </dd>
              </div>
            </Reveal>
          ))}
        </dl>
      </div>
    </Section>
  )
}

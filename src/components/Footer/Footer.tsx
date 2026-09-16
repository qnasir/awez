import { ArrowUpRight, Instagram, Linkedin, Twitter, Youtube } from 'lucide-react'
import { BRAND, FOOTER_COLUMNS } from '@/lib/content'
import { Logo } from '@/components/Logo/Logo'
import { Reveal } from '@/components/primitives/Reveal'
import { Marquee } from '@/components/primitives/Marquee'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const SOCIAL = [
  { label: 'Instagram', icon: Instagram, href: '#' },
  { label: 'LinkedIn', icon: Linkedin, href: '#' },
  { label: 'X', icon: Twitter, href: '#' },
  { label: 'YouTube', icon: Youtube, href: '#' },
]

/**
 * The footer closes the page with the wordmark at display scale — the last
 * thing on screen is the brand, cut off by the edge like a masthead.
 */
export function Footer() {
  const reduced = useReducedMotion()

  return (
    <footer className="relative isolate overflow-hidden border-t border-line bg-ink grain">
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 left-1/2 h-[30rem] w-[70rem] max-w-[140vw] -translate-x-1/2 rounded-[50%] bg-volt/[0.055] blur-[120px]"
      />

      <div className="container-x relative pt-16 md:pt-20">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_2fr] lg:gap-16">
          {/* Brand & newsletter */}
          <div>
            <Logo size={32} />
            <p className="mt-5 max-w-[34ch] text-sm leading-relaxed text-smoke">
              {BRAND.tagline} Memberships, payments, attendance, trainers, leads and renewals — in one place.
            </p>

            <form
              className="mt-8 max-w-sm"
              onSubmit={(e) => e.preventDefault()}
              aria-labelledby="newsletter-label"
            >
              <label id="newsletter-label" htmlFor="newsletter" className="mono-label">
                Operator notes · monthly
              </label>
              <div className="group mt-3 flex items-center gap-2 rounded-full border border-line bg-white/[0.02] p-1 pl-4 transition-colors focus-within:border-volt/45">
                <input
                  id="newsletter"
                  type="email"
                  required
                  placeholder="you@yourgym.com"
                  className="min-w-0 flex-1 bg-transparent py-2 text-sm text-chalk outline-none placeholder:text-dim"
                />
                <button
                  type="submit"
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-volt text-volt-ink transition-transform duration-300 hover:scale-105 active:scale-95"
                  aria-label="Subscribe to Operator notes"
                >
                  <ArrowUpRight size={15} />
                </button>
              </div>
              <p className="mt-2.5 text-[0.6875rem] text-dim">
                One email a month on running a gym profitably. No product spam.
              </p>
            </form>
          </div>

          {/* Link columns */}
          <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {FOOTER_COLUMNS.map((col) => (
              <div key={col.title}>
                <h2 className="mono-label">{col.title}</h2>
                <ul className="mt-4 flex flex-col gap-2.5">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="group/link inline-flex items-center gap-1.5 text-[0.8125rem] text-ash transition-colors hover:text-chalk"
                      >
                        <span className="h-px w-0 bg-volt transition-all duration-300 group-hover/link:w-3" />
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* Contact & social */}
        <div className="mt-14 flex flex-col gap-6 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-[0.8125rem] text-smoke">
            <li>
              <a href={`mailto:${BRAND.email}`} className="transition-colors hover:text-chalk">{BRAND.email}</a>
            </li>
            <li>
              <a href={`tel:${BRAND.phone.replace(/\s/g, '')}`} className="transition-colors hover:text-chalk">{BRAND.phone}</a>
            </li>
            <li className="text-dim">{BRAND.city}</li>
          </ul>

          <ul className="flex gap-2">
            {SOCIAL.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  aria-label={s.label}
                  className="grid h-9 w-9 place-items-center rounded-full border border-line text-smoke transition-colors duration-300 hover:border-volt/45 hover:text-volt"
                >
                  <s.icon size={14} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Masthead wordmark — the last thing on screen is the brand.
          With motion off the belt becomes the bare wordmark, which fits the
          viewport; the full travelling line never would. */}
      <Reveal distance={30} speed="atmosphere" className="relative mt-12 md:mt-16">
        <div aria-hidden className="select-none overflow-hidden">
          {reduced ? (
            <span className="block whitespace-nowrap text-center font-display text-[19vw] font-extrabold leading-[0.8] tracking-[-0.05em] text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.10)]">
              KINETIQ
            </span>
          ) : (
            <Marquee duration={80} gap="4rem" pauseOnHover={false}>
              <span className="block whitespace-nowrap font-display text-[18vw] font-extrabold leading-[0.8] tracking-[-0.05em] text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.10)]">
                KINETIQ · RUN YOUR GYM LIKE A BUSINESS ·
              </span>
            </Marquee>
          )}
        </div>
      </Reveal>

      <div className="container-x relative flex flex-col gap-3 border-t border-line py-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[0.75rem] text-dim">
          © {new Date().getFullYear()} KINETIQ Technologies Pvt. Ltd. All rights reserved.
        </p>
        <ul className="flex gap-6 text-[0.75rem] text-dim">
          <li><a href="#" className="transition-colors hover:text-ash">Privacy</a></li>
          <li><a href="#" className="transition-colors hover:text-ash">Terms</a></li>
          <li><a href="#" className="transition-colors hover:text-ash">Status</a></li>
        </ul>
      </div>
    </footer>
  )
}

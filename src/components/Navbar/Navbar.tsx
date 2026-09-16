import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X, ArrowUpRight } from 'lucide-react'
import { NAV, SECTION_IDS, BRAND } from '@/lib/content'
import { Logo } from '@/components/Logo/Logo'
import { Button } from '@/components/primitives/Button'
import { useScrolledPast, useActiveSection, useDocumentProgress } from '@/hooks/useScrollProgress'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { cn } from '@/lib/utils'
import { MobileMenu } from './MobileMenu'

/**
 * A floating navbar that condenses as the page scrolls: it gains a blurred
 * backdrop, a hairline border and a shadow, and loses a little height —
 * signalling "you have left the top" without ever competing with the hero.
 */
export function Navbar() {
  const [hovered, setHovered] = useState<string | null>(null)
  const scrolled = useScrolledPast(40)
  const active = useActiveSection(SECTION_IDS)
  const progress = useDocumentProgress()
  const reduced = useReducedMotion()
  const [menuOpen, setMenuOpen] = useState(false)

  // Close the menu if the viewport grows past the mobile breakpoint.
  useEffect(() => {
    const mql = window.matchMedia('(min-width: 1024px)')
    const onChange = (e: MediaQueryListEvent) => e.matches && setMenuOpen(false)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  return (
    <>
      <a
        href="#product"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[210] focus:rounded-full focus:bg-volt focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-volt-ink"
      >
        Skip to content
      </a>

      <motion.header
        className="fixed inset-x-0 top-0 z-[100] flex justify-center px-3 pt-3 md:px-6 md:pt-5"
        initial={reduced ? false : { y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: reduced ? 0 : 0.15, ease: [0.16, 1, 0.3, 1] }}
      >
        <nav
          aria-label="Primary"
          className={cn(
            'relative flex w-full max-w-[84rem] items-center justify-between rounded-full',
            'transition-[height,background-color,border-color,box-shadow,backdrop-filter] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
            scrolled
              ? 'h-14 border border-line-strong bg-ink/72 px-3 shadow-[0_18px_40px_-24px_rgba(0,0,0,0.9)] backdrop-blur-xl md:px-4'
              : 'h-[4.25rem] border border-transparent bg-transparent px-2 md:px-3',
          )}
        >
          {/* Reading progress, drawn on the navbar's own edge */}
          <span
            aria-hidden
            className={cn(
              'absolute inset-x-5 bottom-0 h-px origin-left bg-gradient-to-r from-volt/80 to-volt/10 transition-opacity duration-500',
              scrolled ? 'opacity-100' : 'opacity-0',
            )}
            style={{ transform: `scaleX(${progress})` }}
          />

          <a href="#top" className="flex items-center rounded-full px-2 py-1" aria-label="KINETIQ home">
            <Logo />
          </a>

          <ul
            className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 lg:flex"
            onMouseLeave={() => setHovered(null)}
          >
            {NAV.map((item) => {
              const isActive = active === item.href.slice(1)
              return (
                <li key={item.label}>
                  <a
                    href={item.href}
                    onMouseEnter={() => setHovered(item.label)}
                    className={cn(
                      'relative block rounded-full px-3.5 py-2 text-[0.8125rem] font-medium transition-colors duration-300',
                      isActive ? 'text-chalk' : 'text-ash hover:text-chalk',
                    )}
                  >
                    {/* The hover surface slides between items rather than
                        fading in place — the pointer feels tracked, not polled. */}
                    {hovered === item.label && (
                      <motion.span
                        layoutId="nav-hover"
                        className="absolute inset-0 -z-10 rounded-full bg-white/[0.06]"
                        transition={{ type: 'spring', stiffness: 500, damping: 38 }}
                      />
                    )}
                    <span className="relative">{item.label}</span>
                    {isActive && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute inset-x-3.5 -bottom-0.5 h-px bg-volt"
                        transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                      />
                    )}
                  </a>
                </li>
              )
            })}
          </ul>

          <div className="flex items-center gap-2">
            <a
              href={`mailto:${BRAND.email}`}
              className="hidden rounded-full px-3 py-2 text-[0.8125rem] font-medium text-ash transition-colors hover:text-chalk xl:block"
            >
              Sign in
            </a>
            {/* Wrapped rather than given `hidden sm:inline-flex` directly:
                Button sets its own `inline-flex`, which wins the cascade. */}
            <span className="hidden sm:block">
              <Button href="#contact" size="sm" icon={<ArrowUpRight size={14} />}>
                Book a Demo
              </Button>
            </span>

            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              className="grid h-10 w-10 place-items-center rounded-full border border-line text-chalk transition-colors hover:border-line-strong lg:hidden"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={menuOpen ? 'x' : 'menu'}
                  initial={{ opacity: 0, rotate: -45 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 45 }}
                  transition={{ duration: 0.18 }}
                  className="grid place-items-center"
                >
                  {menuOpen ? <X size={18} /> : <Menu size={18} />}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        </nav>
      </motion.header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} active={active} />
    </>
  )
}

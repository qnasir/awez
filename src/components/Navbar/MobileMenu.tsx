import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { NAV, BRAND } from '@/lib/content'
import { Button } from '@/components/primitives/Button'
import { GridBackdrop, LightBeam } from '@/components/primitives/GridBackdrop'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { cn } from '@/lib/utils'

type Props = { open: boolean; onClose: () => void; active: string | null }

/**
 * Full-screen mobile navigation.
 *
 * Designed for the thumb, not shrunk from desktop: items are large editorial
 * type at the bottom two-thirds of the screen, each with its own index, and
 * the panel traps focus and restores it on close.
 */
export function MobileMenu({ open, onClose, active }: Props) {
  const panelRef = useRef<HTMLDivElement>(null)
  const restoreTo = useRef<HTMLElement | null>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (!open) return
    restoreTo.current = document.activeElement as HTMLElement
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return }
      if (e.key !== 'Tab') return
      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      )
      if (!focusables?.length) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
    }

    document.addEventListener('keydown', onKey)
    const t = setTimeout(() => panelRef.current?.querySelector<HTMLElement>('a')?.focus(), 350)

    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
      clearTimeout(t)
      restoreTo.current?.focus()
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="mobile-menu"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="fixed inset-0 z-[99] flex flex-col bg-void grain lg:hidden"
          initial={reduced ? { opacity: 0 } : { clipPath: 'inset(0 0 100% 0)' }}
          animate={reduced ? { opacity: 1 } : { clipPath: 'inset(0 0 0% 0)' }}
          exit={reduced ? { opacity: 0 } : { clipPath: 'inset(0 0 100% 0)' }}
          transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
        >
          <GridBackdrop size={56} opacity={0.05} />
          <LightBeam className="-right-40 -top-40" size="34rem" color="rgba(199,240,72,0.11)" />

          <div className="relative flex min-h-0 flex-1 flex-col justify-end px-5 pb-8 pt-24">
            <ul className="flex flex-col">
              {NAV.map((item, i) => (
                <motion.li
                  key={item.label}
                  initial={reduced ? false : { opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: 0.16 + i * 0.055, ease: [0.16, 1, 0.3, 1] }}
                  className="border-b border-line last:border-b-0"
                >
                  <a
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      'flex items-baseline gap-4 py-4 font-display text-[2rem] font-bold leading-none tracking-[-0.03em] transition-colors',
                      active === item.href.slice(1) ? 'text-volt' : 'text-chalk active:text-volt',
                    )}
                  >
                    <span className="font-mono text-[0.625rem] font-medium tracking-widest text-dim">
                      0{i + 1}
                    </span>
                    {item.label}
                  </a>
                </motion.li>
              ))}
            </ul>

            <motion.div
              className="mt-8 flex flex-col gap-3"
              initial={reduced ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <Button href="#contact" size="lg" className="w-full" onClick={onClose} icon={<ArrowUpRight size={16} />}>
                Book a Demo
              </Button>
              <a
                href={`mailto:${BRAND.email}`}
                className="flex h-12 items-center justify-center rounded-full border border-line text-sm font-medium text-ash"
              >
                Sign in
              </a>
              <p className="mt-2 text-center text-xs text-dim">
                {BRAND.phone} · {BRAND.city}
              </p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

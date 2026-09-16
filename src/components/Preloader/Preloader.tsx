import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Logo } from '@/components/Logo/Logo'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const DURATION = 1400

/**
 * A 1.4s opening beat: the mark lands, a line draws under a single statement,
 * then the whole panel lifts away as a mask.
 *
 * It is an overlay, not a gate — the page is fully rendered underneath the
 * whole time, so crawlers and reduced-motion users never wait for it. It runs
 * once per session.
 */
export function Preloader({ onDone }: { onDone: () => void }) {
  const reduced = useReducedMotion()
  const [visible, setVisible] = useState(() => {
    if (typeof window === 'undefined') return false
    // `?skipintro` lets automated capture and QA reach any page state directly.
    if (new URLSearchParams(window.location.search).has('skipintro')) return false
    return !sessionStorage.getItem('kinetiq:seen')
  })

  useEffect(() => {
    if (!visible || reduced) {
      onDone()
      setVisible(false)
      return
    }
    document.body.style.overflow = 'hidden'
    const t = setTimeout(() => {
      sessionStorage.setItem('kinetiq:seen', '1')
      setVisible(false)
      document.body.style.overflow = ''
      onDone()
    }, DURATION)
    return () => {
      clearTimeout(t)
      document.body.style.overflow = ''
    }
  }, [visible, reduced, onDone])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[200] grid place-items-center bg-void grain"
          aria-hidden
          exit={{ y: '-100%' }}
          transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, filter: 'blur(8px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <Logo size={48} markOnly />
            </motion.div>

            <motion.p
              className="mono-label mt-6 text-[0.625rem]"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              Powering fitness operations
            </motion.p>

            <motion.span
              className="mt-5 h-px w-40 origin-left bg-gradient-to-r from-transparent via-volt to-transparent"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

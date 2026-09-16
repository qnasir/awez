import { useRef } from 'react'
import { useInView } from 'framer-motion'

/**
 * Fire-once viewport detection with a consistent trigger band, so every
 * scroll-triggered animation across the site starts at the same visual moment.
 */
export function useInViewOnce<T extends HTMLElement = HTMLDivElement>(margin = '-18% 0px -18% 0px') {
  const ref = useRef<T>(null)
  const inView = useInView(ref, { once: true, margin: margin as `${number}% ${number}px ${number}% ${number}px` })
  return { ref, inView }
}

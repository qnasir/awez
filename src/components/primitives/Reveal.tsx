import type { ReactNode, ElementType } from 'react'
import { motion, type Variants } from 'framer-motion'
import { fadeUp, viewportOnce, still as stillVariants } from '@/animations'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { cn } from '@/lib/utils'

type Props = {
  children: ReactNode
  delay?: number
  distance?: number
  className?: string
  as?: ElementType
  variants?: Variants
  /** Movement speed tier — see src/animations/index.ts */
  speed?: 'atmosphere' | 'structure' | 'product' | 'detail'
}

/** Scroll-triggered entrance. The workhorse wrapper used across the page. */
export function Reveal({
  children,
  delay = 0,
  distance = 28,
  className,
  as = 'div',
  variants,
  speed = 'structure',
}: Props) {
  const reduced = useReducedMotion()
  const MotionTag = motion[as as 'div'] as typeof motion.div
  const resolved = reduced ? stillVariants : (variants ?? fadeUp(delay, distance, speed))

  return (
    <MotionTag
      className={cn(className)}
      variants={resolved}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
    >
      {children}
    </MotionTag>
  )
}

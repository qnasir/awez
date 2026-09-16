import { forwardRef, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

type Space = 'flush' | 'band' | 'tight' | 'base' | 'wide' | 'close'

type Props = {
  id?: string
  children: ReactNode
  className?: string
  /**
   * Vertical rhythm. Chapters alternate between tiers on purpose — eleven
   * sections at one padding value reads as a metronome, not as pacing.
   */
  space?: Space
  as?: 'section' | 'div'
  'aria-labelledby'?: string
}

const SPACE: Record<Space, string> = {
  flush: '',
  band: 'py-14 md:py-16', // compressed strips — proof bars, trust rails
  tight: 'py-20 md:py-24',
  base: 'py-24 md:py-32',
  wide: 'py-28 md:py-40',
  close: 'py-32 md:py-44 lg:py-52', // the final statement only
}

/**
 * One wrapper owns the page's vertical rhythm, but it owns a *scale*, not a
 * single value. Sections pick a tier so the page breathes in and out instead
 * of ticking.
 */
export const Section = forwardRef<HTMLElement, Props>(function Section(
  { id, children, className, space = 'base', as: Tag = 'section', ...rest },
  ref,
) {
  return (
    <Tag
      ref={ref as never}
      id={id}
      className={cn('relative isolate', SPACE[space], className)}
      {...rest}
    >
      {children}
    </Tag>
  )
})


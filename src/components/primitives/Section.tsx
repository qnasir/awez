import { forwardRef, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

type Props = {
  id?: string
  children: ReactNode
  className?: string
  /** Vertical rhythm. `lg` is the default chapter spacing for the whole page. */
  space?: 'sm' | 'lg' | 'none'
  as?: 'section' | 'div'
  'aria-labelledby'?: string
}

/**
 * One wrapper owns the page's vertical rhythm. Sections never set their own
 * top/bottom padding, which is what keeps twenty chapters feeling evenly cut.
 */
export const Section = forwardRef<HTMLElement, Props>(function Section(
  { id, children, className, space = 'lg', as: Tag = 'section', ...rest },
  ref,
) {
  const pad = {
    lg: 'py-24 md:py-32 lg:py-40',
    sm: 'py-16 md:py-20',
    none: '',
  }[space]

  return (
    <Tag ref={ref as never} id={id} className={cn('relative isolate', pad, className)} {...rest}>
      {children}
    </Tag>
  )
})

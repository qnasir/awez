import type { ReactNode } from 'react'
import { Reveal } from './Reveal'
import { SplitHeadline } from './SplitHeadline'
import { cn } from '@/lib/utils'

type Props = {
  eyebrow: string
  lines: readonly string[]
  accentLine?: number
  body?: ReactNode
  align?: 'left' | 'center'
  className?: string
  size?: 'lg' | 'md'
  /** Id placed on the headline so the section can be labelled by it. */
  id?: string
}

/**
 * Every section opens the same way: a mono eyebrow with a rule,
 * a display headline, and at most one paragraph. Consistency here is
 * what makes twenty different sections read as one product.
 */
export function SectionHeader({
  eyebrow,
  lines,
  accentLine,
  body,
  align = 'left',
  className,
  size = 'lg',
  id,
}: Props) {
  const centered = align === 'center'

  return (
    <div className={cn(centered && 'flex flex-col items-center text-center', className)}>
      <Reveal delay={0} distance={14} speed="detail">
        <div className={cn('flex items-center gap-3', centered && 'justify-center')}>
          <span className="h-px w-8 bg-gradient-to-r from-volt/70 to-transparent" />
          <span className="mono-label">{eyebrow}</span>
        </div>
      </Reveal>

      <SplitHeadline
        id={id}
        lines={lines}
        accentLine={accentLine}
        delay={0.08}
        className={cn(
          'mt-5 text-gradient',
          size === 'lg' ? 'text-d2' : 'text-d3',
          centered && 'mx-auto',
        )}
      />

      {body && (
        <Reveal delay={0.18} distance={20} speed="product">
          <p className={cn('mt-6 max-w-[46ch] text-[0.975rem] leading-relaxed text-ash', centered && 'mx-auto')}>
            {body}
          </p>
        </Reveal>
      )}
    </div>
  )
}

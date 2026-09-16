import type { ReactNode } from 'react'
import { Reveal } from './Reveal'
import { SplitHeadline, type Treatment } from './SplitHeadline'
import { cn } from '@/lib/utils'

type Layout = 'stack' | 'center' | 'split'

type Props = {
  eyebrow: string
  lines: readonly string[]
  accentLine?: number
  treatment?: Treatment
  body?: ReactNode
  /**
   * `split` sets the headline against the body copy in a two-column measure —
   * it fills the empty right half that a left-stacked header always leaves,
   * and it stops every chapter opening the same way.
   */
  layout?: Layout
  className?: string
  size?: 'lg' | 'md'
  id?: string
  /** Editorial chapter numeral, set on the eyebrow rail. */
  index?: string
  /** Extra content pinned to the bottom-right of a split header. */
  aside?: ReactNode
}

function Eyebrow({ text, index, centered }: { text: string; index?: string; centered?: boolean }) {
  return (
    <Reveal delay={0} distance={14} speed="detail">
      <div className={cn('flex items-center gap-3', centered && 'justify-center')}>
        {index && (
          <span className="font-mono text-[0.6875rem] font-medium tabular-nums text-volt">{index}</span>
        )}
        <span className="h-px w-8 bg-gradient-to-r from-volt/70 to-transparent" />
        <span className="mono-label">{text}</span>
      </div>
    </Reveal>
  )
}

/**
 * Section openings. Three layouts, not one — a chapter heading that never
 * changes shape is the clearest tell that a page was assembled from a
 * template rather than designed.
 */
export function SectionHeader({
  eyebrow,
  lines,
  accentLine,
  treatment = 'solid',
  body,
  layout = 'stack',
  className,
  size = 'lg',
  id,
  index,
  aside,
}: Props) {
  const headline = (
    <SplitHeadline
      id={id}
      lines={lines}
      accentLine={accentLine}
      treatment={treatment}
      size={size === 'lg' ? 'd2' : 'd3'}
      delay={0.08}
      className="text-gradient"
    />
  )

  if (layout === 'split') {
    // The headline runs the full measure and the deck sits beneath it, offset
    // right. Boxing a 26-character line into a 60% column costs it a third of
    // its size and wraps it into orphans — and a left-stacked header always
    // leaves the right half of the row empty anyway.
    return (
      <div className={className}>
        <Eyebrow text={eyebrow} index={index} />
        <div className="mt-5">{headline}</div>

        {(body || aside) && (
          <div className="mt-7 grid lg:grid-cols-12">
            <div className="lg:col-span-6 lg:col-start-7 xl:col-span-5 xl:col-start-8">
              {body && (
                <Reveal delay={0.18} distance={20} speed="product">
                  <p className="border-l border-line pl-5 text-[0.975rem] leading-relaxed text-ash">{body}</p>
                </Reveal>
              )}
              {aside && (
                <Reveal delay={0.26} distance={16} speed="detail">
                  <div className="mt-6 pl-5">{aside}</div>
                </Reveal>
              )}
            </div>
          </div>
        )}
      </div>
    )
  }

  const centered = layout === 'center'

  return (
    <div className={cn(centered && 'flex flex-col items-center text-center', className)}>
      <Eyebrow text={eyebrow} index={index} centered={centered} />
      <div className={cn('mt-5', centered && 'mx-auto')}>{headline}</div>
      {body && (
        <Reveal delay={0.18} distance={20} speed="product">
          <p className={cn('mt-6 max-w-[46ch] text-[0.975rem] leading-relaxed text-ash', centered && 'mx-auto')}>
            {body}
          </p>
        </Reveal>
      )}
      {aside && (
        <Reveal delay={0.26} distance={16} speed="detail">
          <div className={cn('mt-7', centered && 'mx-auto')}>{aside}</div>
        </Reveal>
      )}
    </div>
  )
}

import { cn } from '@/lib/utils'

/**
 * Abstract marks for the (fictional) customer brands.
 *
 * A trust strip made of bare words reads as unstyled placeholder text — the
 * thing that makes a logo strip legible as *logos* is that each entry is a
 * mark plus a wordmark, and that the marks differ from one another. These are
 * geometric and monochrome so they never compete with the product's accent.
 */
const MARKS = [
  // concentric — "orbit"
  <>
    <circle cx="12" cy="12" r="7.5" strokeWidth="2" />
    <circle cx="12" cy="12" r="2.5" fill="currentColor" stroke="none" />
  </>,
  // stacked bars — "levels"
  <>
    <path d="M5 16.5h14M7.5 12h9M10 7.5h4" strokeWidth="2.2" strokeLinecap="round" />
  </>,
  // chevron pair — "forward"
  <>
    <path d="M6 6.5 12 12l-6 5.5M13 6.5 19 12l-6 5.5" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </>,
  // split square — "grid"
  <>
    <rect x="5" y="5" width="6" height="6" rx="1.4" strokeWidth="2" />
    <rect x="13" y="13" width="6" height="6" rx="1.4" strokeWidth="2" />
    <path d="M13 8h6M5 16h6" strokeWidth="2" strokeLinecap="round" />
  </>,
  // diamond — "apex"
  <>
    <path d="M12 4.5 19.5 12 12 19.5 4.5 12Z" strokeWidth="2" strokeLinejoin="round" />
  </>,
  // arc — "pulse"
  <>
    <path d="M4.5 14.5c3 0 3-6 6-6s3 6 6 6 3-3 3-3" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </>,
  // hex — "core"
  <>
    <path d="M12 4.5 18.5 8.25v7.5L12 19.5 5.5 15.75v-7.5Z" strokeWidth="2" strokeLinejoin="round" />
  </>,
  // cross bars — "anchor"
  <>
    <path d="M12 5v14M6.5 9.5h11M6.5 14.5h11" strokeWidth="2.2" strokeLinecap="round" />
  </>,
]

export function BrandLockup({ name, index, className }: { name: string; index: number; className?: string }) {
  return (
    <span
      className={cn(
        'group/brand flex shrink-0 cursor-default items-center gap-2.5 whitespace-nowrap',
        'text-smoke transition-colors duration-500 hover:text-chalk',
        className,
      )}
    >
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-line bg-white/[0.02] transition-colors duration-500 group-hover/brand:border-line-strong">
        <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" aria-hidden>
          {MARKS[index % MARKS.length]}
        </svg>
      </span>
      <span className="font-display text-[0.9375rem] font-bold tracking-[0.1em] md:text-base">{name}</span>
    </span>
  )
}

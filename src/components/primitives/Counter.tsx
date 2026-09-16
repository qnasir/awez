import { useCountUp } from '@/hooks/useCountUp'
import { formatINR } from '@/lib/utils'
import { cn } from '@/lib/utils'

type Props = {
  to: number
  prefix?: string
  suffix?: string
  precision?: number
  duration?: number
  delay?: number
  className?: string
}

/**
 * A number that counts up the first time it is seen.
 * Uses Indian digit grouping (1,28,400) because the audience reads in lakhs.
 * `tabular-nums` keeps the box from twitching as digits change.
 */
export function Counter({ to, prefix, suffix, precision = 0, duration = 1.6, delay = 0, className }: Props) {
  const { ref, value } = useCountUp(to, { duration, delay, precision })
  const text = precision > 0 ? value.toFixed(precision) : formatINR(value)

  return (
    <span ref={ref} className={cn('tabular-nums', className)}>
      {prefix}
      {text}
      {suffix}
    </span>
  )
}

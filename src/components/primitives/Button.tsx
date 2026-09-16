import { forwardRef, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useMagnetic } from '@/animations/magnetic'
import { useIsTouch } from '@/hooks/useMediaQuery'
import { useReducedMotion } from '@/hooks/useReducedMotion'

type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

type Props = {
  children: ReactNode
  variant?: Variant
  size?: Size
  href?: string
  className?: string
  icon?: ReactNode
  onClick?: () => void
  'aria-label'?: string
}

const sizes: Record<Size, string> = {
  sm: 'h-9 px-4 text-[0.8125rem]',
  md: 'h-11 px-5 text-sm',
  lg: 'h-[3.25rem] px-7 text-[0.9375rem]',
}

const variants: Record<Variant, string> = {
  primary: 'bg-volt text-volt-ink font-semibold shadow-[0_8px_30px_-10px_rgba(199,240,72,0.55)]',
  secondary: 'surface text-chalk font-medium hover:border-line-strong',
  ghost: 'text-ash font-medium hover:text-chalk',
}

/**
 * The site's only button. Three variants, one interaction language:
 * a magnetic lean toward the cursor, a light sweep across the face,
 * and a press that actually compresses.
 */
export const Button = forwardRef<HTMLElement, Props>(function Button(
  { children, variant = 'primary', size = 'md', href, className, icon, onClick, ...rest },
  _ref,
) {
  const isTouch = useIsTouch()
  const reduced = useReducedMotion()
  const still = isTouch || reduced
  const { ref, x, y } = useMagnetic<HTMLElement>(variant === 'primary' ? 0.3 : 0.22, still)

  const content = (
    <>
      {/* Light sweep — travels across the face on hover, primary only */}
      {variant === 'primary' && !still && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]"
        >
          <span className="absolute inset-y-0 -left-full w-1/2 skew-x-[-20deg] bg-white/45 blur-[6px] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-[320%]" />
        </span>
      )}

      {/* Edge highlight on the secondary surface */}
      {variant === 'secondary' && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-100"
        />
      )}

      <span className="relative z-10 flex items-center gap-2 whitespace-nowrap">
        {children}
        {icon && (
          <span className="transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1">
            {icon}
          </span>
        )}
      </span>
    </>
  )

  const classes = cn(
    'group relative inline-flex items-center justify-center rounded-full',
    'transition-colors duration-300 will-change-transform',
    'active:scale-[0.97] transition-transform',
    sizes[size],
    variants[variant],
    className,
  )

  const style = still ? undefined : { x, y }

  if (href) {
    return (
      <motion.a ref={ref as React.Ref<HTMLAnchorElement>} href={href} className={classes} style={style} {...rest}>
        {content}
      </motion.a>
    )
  }

  return (
    <motion.button
      ref={ref as React.Ref<HTMLButtonElement>}
      type="button"
      onClick={onClick}
      className={classes}
      style={style}
      {...rest}
    >
      {content}
    </motion.button>
  )
})

import { useMediaQuery } from './useMediaQuery'

/**
 * The project's single source of truth for motion preference.
 * Every animated component reads this and degrades to an instant,
 * fully-composed state rather than hiding content.
 */
export function useReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)')
}

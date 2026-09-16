import { useEffect, useState } from 'react'

/** Subscribes to a media query. SSR-safe and listener-cleaned. */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false,
  )

  useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches)
    setMatches(mql.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [query])

  return matches
}

/** True on devices without a precise pointer — used to strip cursor/hover affordances. */
export const useIsTouch = () => useMediaQuery('(hover: none), (pointer: coarse)')

/** Desktop breakpoint, matching the Tailwind `lg` step. */
export const useIsDesktop = () => useMediaQuery('(min-width: 1024px)')

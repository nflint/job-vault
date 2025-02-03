/**
 * @fileoverview Hook for detecting mobile viewport state
 * Provides a reactive way to determine if the current viewport is mobile-sized
 */

import * as React from "react"

/** Mobile breakpoint in pixels */
const MOBILE_BREAKPOINT = 768

/**
 * React hook that detects if the current viewport is mobile-sized
 * Uses a media query to track viewport width changes
 * 
 * @returns {boolean} True if viewport width is less than MOBILE_BREAKPOINT
 * 
 * @example
 * function MyComponent() {
 *   const isMobile = useIsMobile();
 *   return (
 *     <div>
 *       {isMobile ? 'Mobile View' : 'Desktop View'}
 *     </div>
 *   );
 * }
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    /**
     * Updates the mobile state based on window width
     */
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}

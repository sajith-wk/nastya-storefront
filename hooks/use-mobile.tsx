"use client"

import * as React from "react"

const MOBILE_BREAKPOINT = 1026 // Devices with width < 1025px will be considered mobile/tablet

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      const newIsMobile = window.innerWidth < MOBILE_BREAKPOINT
      setIsMobile(newIsMobile)
      console.log("useIsMobile: Media query changed. New state:", newIsMobile)
    }
    mql.addEventListener("change", onChange)

    // Set initial state immediately
    const initialIsMobile = window.innerWidth < MOBILE_BREAKPOINT
    setIsMobile(initialIsMobile)
    console.log("useIsMobile: Initial state:", initialIsMobile)

    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}

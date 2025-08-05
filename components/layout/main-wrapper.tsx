"use client"

import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import type React from "react"

interface MainWrapperProps {
  children: React.ReactNode
}

export function MainWrapper({ children }: MainWrapperProps) {
  const pathname = usePathname()
  const isVirtualTourPage = pathname === "/" || pathname.startsWith("/room-")

  return (
    <main
      className={cn(
        "flex-1", // Default to flex-1 to take available space
        isVirtualTourPage ? "p-0 overflow-hidden" : "pt-14 pb-14", // No padding and hide overflow for virtual tour pages
      )}
    >
      {children}
    </main>
  )
}

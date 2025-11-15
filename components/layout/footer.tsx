"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button" // Import Button
import { useCart } from "@/context/cart-context" // Import useCart

interface FooterProps {
  isTransparent?: boolean
  onMenuClick?: () => void // New prop for menu button click
}

export function Footer({ isTransparent = false, onMenuClick }: FooterProps) {
  const { cart, openCart } = useCart() // Use useCart hook

  return (
    <footer
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 transition-colors duration-300",
        isTransparent ? "bg-transparent text-white" : "bg-background text-foreground",
      )}
    >
      {/* Desktop Footer Content (hidden on mobile) */}
      <p
  className={cn(
    "hidden sm:block text-xs",
    isTransparent ? "text-black" : "text-muted-foreground"
  )}
>
  &copy; {new Date().getFullYear()} Nastya Rovenskaya. All rights reserved. 
</p>

      <nav className="hidden sm:ml-auto sm:flex gap-4 sm:gap-6">
        <Link
          href="https://golart.com/policies/terms-of-service"
          target="_blank"
          rel="noopener noreferrer"
          className={cn("text-xs hover:underline underline-offset-4", isTransparent ? "text-black" : "text-foreground")}
        >
          Terms of Service
        </Link>
        <Link
          href="https://golart.com/policies/privacy-policy"
          target="_blank"
          rel="noopener noreferrer"
          className={cn("text-xs hover:underline underline-offset-4", isTransparent ? "text-black" : "text-foreground")}
        >
          Privacy
        </Link>
      </nav>

      {/* Mobile Footer Buttons (visible on mobile) */}
      <div className="flex sm:hidden w-full justify-between px-4">
        <Button
          variant="outline"
          className="bg-transparent border-black text-black  rounded-lg px-4 py-2"
          onClick={onMenuClick}
        >
          Menu
        </Button>
        {/* Updated Cart Button */}
        <Button variant="outline" className="bg-transparent border-black text-black  rounded-lg px-4 py-2" onClick={openCart}>
          Cart ({cart?.totalQuantity || 0})
        </Button>
      </div>
    </footer>
  )
}

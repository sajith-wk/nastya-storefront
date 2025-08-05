"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/cart-context" // Import useCart

interface AddToCartButtonProps {
  productId: string
  variantId: string
  productTitle: string
  quantity: number // Add this line
  disabled?: boolean // Add disabled prop
}

export function AddToCartButton({ productId, variantId, productTitle, quantity, disabled }: AddToCartButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { addToCart } = useCart() // Use addToCart from context

  const handleAddToCart = async () => {
    setIsLoading(true)
    try {
      await addToCart(variantId, quantity) // Use the quantity prop here
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button size="sm" className="w-28 md:w-25" onClick={handleAddToCart} disabled={isLoading || disabled}>
      {isLoading ? "Adding to Cart..." : "Add to Cart"}
    </Button>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MinusIcon, PlusIcon } from "lucide-react"
import { AddToCartButton } from "@/components/add-to-cart-button"

interface ProductActionsProps {
  productId: string
  variantId: string
  productTitle: string
  availableForSale: boolean
  quantityAvailable: number
}

export function ProductActions({
  productId,
  variantId,
  productTitle,
  availableForSale,
  quantityAvailable,
}: ProductActionsProps) {
  const [quantity, setQuantity] = useState(1)

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity > 0 && newQuantity <= quantityAvailable) {
      setQuantity(newQuantity)
    }
  }

  const isOutOfStock = !availableForSale || quantityAvailable === 0
  const isAddToCartDisabled = isOutOfStock || quantity === 0

  return (
    <div className="grid gap-4">
      {/* Stock Information */}
      <p className="text-sm font-medium">
        Stock:{" "}
        {isOutOfStock ? (
          <span className="text-red-500">Out of Stock</span>
        ) : (
          <span className="text-green-600">{quantityAvailable} In Stock</span>
        )}
      </p>

      {/* Quantity Selector */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleQuantityChange(quantity - 1)}
          disabled={quantity <= 1 || isOutOfStock}
          aria-label="Decrease quantity"
        >
          <MinusIcon className="h-4 w-4" />
        </Button>
        <span className="w-12 text-center border rounded-md py-2 text-lg font-medium">{quantity}</span>
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleQuantityChange(quantity + 1)}
          disabled={quantity >= quantityAvailable || isOutOfStock}
          aria-label="Increase quantity"
        >
          <PlusIcon className="h-4 w-4" />
        </Button>
      </div>

      {/* Add to Cart Button */}
      <AddToCartButton
        productId={productId}
        variantId={variantId}
        productTitle={productTitle}
        quantity={quantity}
        disabled={isAddToCartDisabled}
      />
    </div>
  )
}

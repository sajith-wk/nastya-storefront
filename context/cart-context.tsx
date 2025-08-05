"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { useToast } from "@/hooks/use-toast"

interface CartLineItem {
  id: string
  quantity: number
  merchandise: {
    id: string
    title: string
    product: {
      handle: string
      title: string
    }
    image?: {
      url: string
      altText: string
      width: number
      height: number
    }
    price: {
      amount: string
      currencyCode: string
    }
  }
}

interface Cart {
  id: string
  checkoutUrl: string
  totalQuantity: number
  cost: {
    totalAmount: {
      amount: string
      currencyCode: string
    }
    subtotalAmount: {
      amount: string
      currencyCode: string
    }
  }
  lines: {
    edges: {
      node: CartLineItem
    }[]
  }
}

interface CartContextType {
  cart: Cart | null
  isCartOpen: boolean
  isLoadingCart: boolean
  openCart: () => void
  closeCart: () => void
  refreshCart: () => Promise<void>
  addToCart: (variantId: string, quantity: number) => Promise<void>
  updateCartLine: (lineId: string, quantity: number) => Promise<void>
  removeCartLine: (lineId: string) => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isLoadingCart, setIsLoadingCart] = useState(true) // Initial loading state for cart
  const { toast } = useToast()

  const fetchCart = useCallback(async () => {
    setIsLoadingCart(true)
    try {
      const response = await fetch("/api/cart/get")
      if (!response.ok) {
        throw new Error("Failed to fetch cart data")
      }
      const data = await response.json()
      setCart(data.cart)
    } catch (error) {
      console.error("Error fetching cart:", error)
      setCart(null) // Clear cart if there's an error
    } finally {
      setIsLoadingCart(false)
    }
  }, [])

  useEffect(() => {
    fetchCart()
  }, [fetchCart])

  const openCart = () => setIsCartOpen(true)
  const closeCart = () => setIsCartOpen(false)
  const refreshCart = fetchCart

  const addToCart = async (variantId: string, quantity: number) => {
    try {
      const response = await fetch("/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ variantId, quantity }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to add to cart")
      }

      const data = await response.json()
      setCart(data.cart) // Update cart state with the new cart data
      toast({
        title: "Item Added to Cart!",
        description: `${data.cart.lines.edges[0]?.node.merchandise.product.title || "Product"} has been added to your cart.`,
        variant: "default",
      })
      openCart() // Open the cart sidebar after adding
    } catch (error: any) {
      console.error("Error adding to cart:", error)
      toast({
        title: "Failed to Add to Cart",
        description: error.message || "There was an error adding the item to your cart. Please try again.",
        variant: "destructive",
      })
    }
  }

  const updateCartLine = async (lineId: string, quantity: number) => {
    try {
      const response = await fetch("/api/cart/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ lineId, quantity }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update cart item")
      }

      const data = await response.json()
      setCart(data.cart)
      toast({
        title: "Cart Updated!",
        description: "Item quantity has been updated.",
        variant: "default",
      })
    } catch (error: any) {
      console.error("Error updating cart item:", error)
      toast({
        title: "Failed to Update Cart",
        description: error.message || "There was an error updating the item quantity. Please try again.",
        variant: "destructive",
      })
    }
  }

  const removeCartLine = async (lineId: string) => {
    try {
      const response = await fetch("/api/cart/remove", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ lineId }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to remove cart item")
      }

      const data = await response.json()
      setCart(data.cart)
      toast({
        title: "Item Removed!",
        description: "The item has been removed from your cart.",
        variant: "default",
      })
    } catch (error: any) {
      console.error("Error removing cart item:", error)
      toast({
        title: "Failed to Remove Item",
        description: error.message || "There was an error removing the item from your cart. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        isCartOpen,
        isLoadingCart,
        openCart,
        closeCart,
        refreshCart,
        addToCart,
        updateCartLine,
        removeCartLine,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

import { NextResponse } from "next/server"
import { addLinesToCart, getCartIdFromCookie, createCart } from "@/lib/shopify"

export async function POST(request: Request) {
  try {
    const { variantId, quantity } = await request.json()

    if (!variantId || !quantity) {
      return NextResponse.json({ error: "Missing variantId or quantity" }, { status: 400 })
    }

    let cartId = getCartIdFromCookie()

    // If no cartId exists, create a new cart first
    if (!cartId) {
      const newCart = await createCart()
      cartId = newCart.id
    }

    const updatedCart = await addLinesToCart(cartId, [{ merchandiseId: variantId, quantity }])

    return NextResponse.json({ cart: updatedCart })
  } catch (error) {
    console.error("Error adding to cart:", error)
    return NextResponse.json({ error: "Failed to add item to cart" }, { status: 500 })
  }
}

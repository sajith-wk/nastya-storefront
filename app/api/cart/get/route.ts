import { NextResponse } from "next/server"
import { getCart, getCartIdFromCookie } from "@/lib/shopify"

export async function GET() {
  try {
    const cartId = getCartIdFromCookie()

    if (!cartId) {
      return NextResponse.json({ cart: null, message: "No cart found" }, { status: 200 })
    }

    const cart = await getCart(cartId)

    if (!cart) {
      // If cart not found on Shopify, clear the cookie
      const response = NextResponse.json({ cart: null, message: "Cart not found on Shopify" }, { status: 200 })
      response.cookies.delete("cartId")
      return response
    }

    return NextResponse.json({ cart })
  } catch (error) {
    console.error("Error fetching cart:", error)
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 })
  }
}

import { NextResponse } from "next/server"
import { getCartIdFromCookie, removeLinesFromCart } from "@/lib/shopify"

export async function POST(request: Request) {
  try {
    const { lineId } = await request.json()

    if (!lineId) {
      return NextResponse.json({ error: "Missing lineId" }, { status: 400 })
    }

    const cartId = getCartIdFromCookie()

    if (!cartId) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 })
    }

    const updatedCart = await removeLinesFromCart(cartId, [lineId])

    return NextResponse.json({ cart: updatedCart })
  } catch (error) {
    console.error("Error removing cart item:", error)
    return NextResponse.json({ error: "Failed to remove item from cart" }, { status: 500 })
  }
}

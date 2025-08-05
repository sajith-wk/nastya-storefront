import { NextResponse } from "next/server"
import { getCartIdFromCookie, updateLinesInCart } from "@/lib/shopify"

export async function POST(request: Request) {
  try {
    const { lineId, quantity } = await request.json()

    if (!lineId || quantity === undefined) {
      return NextResponse.json({ error: "Missing lineId or quantity" }, { status: 400 })
    }

    const cartId = getCartIdFromCookie()

    if (!cartId) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 })
    }

    const updatedCart = await updateLinesInCart(cartId, [{ id: lineId, quantity }])

    return NextResponse.json({ cart: updatedCart })
  } catch (error) {
    console.error("Error updating cart item:", error)
    return NextResponse.json({ error: "Failed to update item in cart" }, { status: 500 })
  }
}

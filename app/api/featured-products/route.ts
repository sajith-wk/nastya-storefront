import { NextResponse } from "next/server"
import { getProductsByTag } from "@/lib/shopify"

export async function GET() {
  try {
    const vendor = "Nastya Rovenskaya"
    const featuredProducts = await getProductsByTag("featured", vendor)
    return NextResponse.json({ products: featuredProducts })
  } catch (err) {
    console.error("Error fetching featured products", err)
    return NextResponse.json({ products: [] }, { status: 500 })
  }
}

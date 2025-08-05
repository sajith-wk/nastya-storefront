"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { XIcon, MinusIcon, PlusIcon, Trash2, ShoppingCart } from "lucide-react" // Changed ArrowRight to ShoppingCart
import { useCart } from "@/context/cart-context"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"

export function CartSidebar() {
  const { cart, isCartOpen, closeCart, isLoadingCart, updateCartLine, removeCartLine } = useCart()

  const cartItems = cart?.lines?.edges || []
  const totalQuantity = cart?.totalQuantity || 0
  const subtotalAmount = cart?.cost?.subtotalAmount?.amount || "0.00"
  const currencyCode = cart?.cost?.subtotalAmount?.currencyCode || "USD"
  const checkoutUrl = cart?.checkoutUrl || "#"

  return (
    <Sheet open={isCartOpen} onOpenChange={closeCart}>
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col [&>button]:hidden">
        {" "}
        {/* Added [&>button]:hidden here */}
        <SheetHeader className="flex flex-row items-center justify-between pb-4">
          <SheetTitle className="text-xl font-bold">Cart ({totalQuantity})</SheetTitle>
          <Button variant="ghost" size="icon" onClick={closeCart} aria-label="Close cart">
            <XIcon className="h-5 w-5" />
          </Button>
        </SheetHeader>
        <Separator />
        {isLoadingCart ? (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">Loading cart...</div>
        ) : cartItems.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">Your cart is empty.</div>
        ) : (
          <>
            <ScrollArea className="flex-1 py-4">
              <div className="grid gap-6">
                {cartItems.map((item) => (
                  <div key={item.node.id} className="flex items-center gap-4">
                    <div className="relative w-20 h-20 shrink-0 rounded-md overflow-hidden border">
                      <Image
                        src={item.node.merchandise.image?.url || "/placeholder.svg?height=80&width=80&text=Product"}
                        alt={item.node.merchandise.image?.altText || item.node.merchandise.product.title}
                        fill
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                    <div className="flex-1 grid gap-1">
                      <Link
                        href={`/shop/${item.node.merchandise.product.handle}`}
                        onClick={closeCart}
                        className="font-semibold hover:underline"
                      >
                        {item.node.merchandise.product.title}
                      </Link>
                      <p className="text-sm text-muted-foreground">{item.node.merchandise.title}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-medium">
                          {item.node.merchandise.price.amount} {item.node.merchandise.price.currencyCode}
                        </span>
                        <div className="flex items-center gap-2">
                          {/* Quantity controls */}
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7 bg-transparent"
                            onClick={() => updateCartLine(item.node.id, item.node.quantity - 1)}
                            disabled={item.node.quantity <= 1}
                          >
                            <MinusIcon className="h-4 w-4" />
                          </Button>
                          <span className="text-sm font-medium">{item.node.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7 bg-transparent"
                            onClick={() => updateCartLine(item.node.id, item.node.quantity + 1)}
                          >
                            <PlusIcon className="h-4 w-4" />
                          </Button>
                          {/* Delete button */}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive hover:bg-destructive/10"
                            onClick={() => removeCartLine(item.node.id)}
                            aria-label="Remove item"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <Separator className="my-4" />
            <div className="flex justify-between items-center font-semibold text-lg">
              <span>Subtotal</span>
              <span>
                {subtotalAmount} {currencyCode}
              </span>
            </div>
            <Button
              asChild
              className="w-full mt-4 h-12 rounded-lg border border-white text-white font-bold text-lg shadow-md
                         bg-gradient-to-r from-checkout-green to-checkout-blue hover:from-checkout-green/90 hover:to-checkout-blue/90"
              size="lg"
            >
              <Link
                href={checkoutUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2"
              >
                <ShoppingCart className="h-5 w-5" /> {/* Shopping cart icon */}
                Checkout
              </Link>
            </Button>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}

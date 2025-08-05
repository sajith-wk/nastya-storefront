import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { HeaderWrapper } from "@/components/layout/header-wrapper"
import { FooterWrapper } from "@/components/layout/footer-wrapper"
import { MainWrapper } from "@/components/layout/main-wrapper"
import { CartProvider } from "@/context/cart-context" // Import CartProvider
import { CartSidebar } from "@/components/cart-sidebar" // Import CartSidebar

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Nastya Rovenskaya - Art & Shop",
  description: "Official website of Nastya Rovenskaya",
  generator: "Nastya Rovenskaya - Art & Shop created by sqopi.com",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="color-scheme" content="light" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <CartProvider>
            {" "}
            {/* Wrap with CartProvider */}
            <div className="flex flex-col min-h-screen">
              <HeaderWrapper />
              <MainWrapper>{children}</MainWrapper>
              <FooterWrapper />
            </div>
            <CartSidebar /> {/* Render CartSidebar here */}
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

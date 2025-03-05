import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/toaster"


export const metadata: Metadata = {
  title: "Veto | Acompanhamento Legislativo",
  description: "Acompanhe propostas legislativas no Parlamento Português",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased")}>
      {children}
      <Toaster />
      </body>
    </html>
  )
}

import './globals.css'
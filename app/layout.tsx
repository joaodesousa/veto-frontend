import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/sonner"


export const metadata: Metadata = {
  title: "Veto | Acompanhamento Legislativo",
  description: "Acompanhe propostas legislativas no Parlamento Português",
  metadataBase: new URL('https://veto.pt'),
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt" suppressHydrationWarning>
      <head>
      <script defer src="https://umami.outplay.cloud/script.js" data-website-id="fc1a5619-75ce-4100-9357-7baeac458ce7"></script>
      </head>
      <body className={cn("min-h-screen bg-background font-sans antialiased")}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Toaster />
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}


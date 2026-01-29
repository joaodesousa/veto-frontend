import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/sonner"


export const metadata: Metadata = {
  title: "Veto | Monitorização de Legislação Portuguesa em Tempo Real",
  description: "Acompanhe e analise propostas legislativas no Parlamento Português com alertas personalizados e análises detalhadas. A sua voz na democracia.",
  metadataBase: new URL('https://veto.pt'),
  keywords: ["política", "legislação", "parlamento", "Portugal", "propostas legislativas", "acompanhamento", "leis", "democracia", "cidadania", "monitorização legislativa"],
  authors: [{ name: "Veto", url: "https://veto.pt" }],
  creator: "Veto",
  publisher: "Veto",
  openGraph: {
    type: "website",
    locale: "pt_PT",
    url: "https://veto.pt",
    title: "Veto | Monitorização de Legislação Portuguesa em Tempo Real",
    description: "Acompanhe e analise propostas legislativas no Parlamento Português com alertas personalizados e análises detalhadas. A sua voz na democracia.",
    siteName: "Veto",
    images: [
      {
        url: "https://veto.pt/og-image.png",
        width: 1200,
        height: 630,
        alt: "VETO",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Veto | Monitorização de Legislação Portuguesa em Tempo Real",
    description: "Acompanhe e analise propostas legislativas no Parlamento Português com alertas personalizados e análises detalhadas.",
    images: ["https://veto.pt/og-image.png"],
    creator: "@vetopt",
  },
  alternates: {
    canonical: "https://veto.pt",
    languages: {
      "pt-PT": "https://veto.pt",
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <script defer src="https://u.xiu.sh/script.js" data-website-id="a59bd50d-810c-463e-9ee8-d8e69f4cb683"></script>
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


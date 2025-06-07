import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Governo | Veto",
  description: "Conheça a estrutura e composição do Governo Português. Explore informações sobre o Primeiro-Ministro, Ministros de Estado e todos os membros do Conselho de Ministros do XXV Governo Constitucional.",
  keywords: [
    "governo português",
    "conselho de ministros",
    "primeiro-ministro",
    "ministros de estado",
    "ministros",
    "governo constitucional",
    "estrutura governamental",
    "executivo português",
    "palácio de São Bento",
    "administração pública"
  ],
  openGraph: {
    title: "Governo | Veto",
    description: "Conheça a estrutura e composição do Governo Português. Explore informações sobre o Primeiro-Ministro, Ministros de Estado e todos os membros do Conselho de Ministros.",
    url: "https://veto.pt/governo",
    type: "website",
    images: [
      {
        url: "https://veto.pt/og-image.png",
        width: 1200,
        height: 630,
        alt: "Governo Português - Estrutura e Membros | Veto",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Governo | Veto",
    description: "Conheça a estrutura e composição do Governo Português. Explore informações sobre o Primeiro-Ministro, Ministros de Estado e membros do Conselho de Ministros.",
    images: ["https://veto.pt/og-image.png"],
  },
  alternates: {
    canonical: "https://veto.pt/governo",
  },
}

export default function GovernoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Parlamento | Veto",
  description: "Explore informações detalhadas sobre deputados portugueses, partidos políticos, composição do parlamento e representação por círculo eleitoral. Acompanhe a atividade parlamentar em tempo real.",
  keywords: [
    "parlamento português",
    "deputados",
    "partidos políticos", 
    "assembleia da república",
    "composição parlamentar",
    "círculos eleitorais",
    "representação política",
    "mandatos",
    "grupos parlamentares"
  ],
  openGraph: {
    title: "Parlamento | Deputados e Partidos Políticos | Veto",
    description: "Explore informações detalhadas sobre deputados portugueses, partidos políticos, composição do parlamento e representação por círculo eleitoral.",
    url: "https://veto.pt/parlamento",
    type: "website",
    images: [
      {
        url: "https://veto.pt/og-image.png",
        width: 1200,
        height: 630,
        alt: "Parlamento Português - Deputados e Partidos",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Parlamento | Deputados e Partidos Políticos | Veto",
    description: "Explore informações detalhadas sobre deputados portugueses, partidos políticos e composição do parlamento.",
    images: ["https://veto.pt/og-image.png"],
  },
  alternates: {
    canonical: "https://veto.pt/parlamento",
  },
}

export default function ParlamentoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

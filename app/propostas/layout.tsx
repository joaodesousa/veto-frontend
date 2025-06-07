import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Propostas | Veto",
  description: "Explore e siga propostas legislativas portuguesas em tempo real. Filtre por legislatura, tipo, fase, autores e partidos políticos. Acompanhe o progresso das iniciativas no Parlamento Português.",
  keywords: [
    "propostas legislativas",
    "legislação portuguesa",
    "parlamento português",
    "iniciativas legislativas",
    "leis",
    "decretos",
    "projetos de lei",
    "monitorização legislativa",
    "assembleia da república",
    "acompanhamento parlamentar"
  ],
  openGraph: {
    title: "Propostas | Veto",
    description: "Explore e siga propostas legislativas portuguesas em tempo real. Filtre por legislatura, tipo, fase, autores e partidos políticos.",
    url: "https://veto.pt/propostas",
    type: "website",
    images: [
      {
        url: "https://veto.pt/og-image.png",
        width: 1200,
        height: 630,
        alt: "Propostas Legislativas Portuguesas - Veto",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Propostas | Veto",
    description: "Explore e siga propostas legislativas portuguesas em tempo real. Filtre por legislatura, tipo, fase, autores e partidos.",
    images: ["https://veto.pt/og-image.png"],
  },
  alternates: {
    canonical: "https://veto.pt/propostas",
  },
}

export default function PropostasLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

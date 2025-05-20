import { HeroSection } from "@/components/hero-section"
import { ProposalsSection } from "@/components/proposals-section"
import { StatsSection } from "@/components/stats-section"
import { getHomePageProposals, getStats } from "@/lib/server-api"


export async function generateMetadata() {
  
  const title ="VETO"
  const description = "Descubra como os deputados votam em temas que importam para si. Acompanhe, compare e participe na democracia portuguesa."

  return {
    title: title,
    description: description,
    openGraph: {
      images: [{
        url: `https://veto.pt/api/og?title=${title}&description=${description}`,
        width: 1200,
        height: 630,
      }]
    }
  }
}

export default async function Home() {
  // Fetch both proposals and statistics in parallel for better performance
  const [proposalsData, stats] = await Promise.all([
    getHomePageProposals(4),
    getStats()
  ]);
  
  const { proposals, totalCount } = proposalsData;

  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <StatsSection stats={stats} />
      <ProposalsSection proposals={proposals} />
    </div>
  )
}


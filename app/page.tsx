import { HeroSection } from "@/components/hero-section"
import { ProposalsSection } from "@/components/proposals-section"
import { StatsSection } from "@/components/stats-section"
import { getHomePageProposals, getDashboardStatistics } from "@/lib/server-api"

export default async function Home() {
  // Fetch both proposals and statistics in parallel for better performance
  const [proposalsData, stats] = await Promise.all([
    getHomePageProposals(4),
    getDashboardStatistics()
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


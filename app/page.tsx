"use client"
import Link from "next/link"
import { 
  ArrowRight, 
  BarChart3, 
  Clock, 
  FileText, 
  Search, 
  Users, 
  Vote, 
  Building2,
  AlertCircle,
  CheckCircle2
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { HeroSection } from "@/components/hero-section"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ProposalCard } from "@/components/proposal-card"
import { StatsCard } from "@/components/stats-card"
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

      {/* Stats section - Now with dynamic statistics */}
      <section className="w-full py-12 md:py-16 lg:py-20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Legislatura em Números
              </h2>
              <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Estatísticas atualizadas sobre a atividade parlamentar em Portugal
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            <StatsCard
              title="Propostas"
              value={stats.total_proposals.toString()}
              description="Propostas nesta legislatura"
              icon={<FileText className="h-5 w-5" />}
            />
            <StatsCard
              title="Votações"
              value={stats.total_votes.toString()}
              description="Votações realizadas"
              icon={<BarChart3 className="h-5 w-5" />}
            />
            <StatsCard
              title="Propostas Recentes"
              value={stats.recent_proposals.toString()}
              description="Propostas apresentadas no último mês"
              icon={<FileText className="h-5 w-5" />}
            />
            <StatsCard
              title="Partidos"
              value={`${stats.party_with_most_proposals.join(' e ')} (${stats.proposals_count_for_party})`}
              description="Partido com mais propostas"
              icon={<Vote className="h-5 w-5" />}
            />
          </div>
        </div>
      </section>

      {/* Proposals section */}
      <section className="w-full py-12 md:py-16 ">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Encontre Propostas Legislativas
              </h2>
              <p className="max-w-[700px] text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Pesquise e filtre propostas por tema, estado, partido ou data
              </p>
            </div>
          </div>
          <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {proposals.map((proposal) => {
                      // Safely extract the latest phase name
                      const latestPhase = proposal.phases && Array.isArray(proposal.phases) && proposal.phases.length > 0
                        ? proposal.phases[proposal.phases.length - 1]
                        : null;
                      
                      const phaseDisplay = latestPhase 
                        ? (typeof latestPhase === 'string' ? latestPhase : (latestPhase.name || 'Sem estado'))
                        : 'Sem estado';
                      
                      // Safely extract the party/author
                      let partyDisplay = "Desconhecido";
                      if (proposal.authors && Array.isArray(proposal.authors)) {
                        // First try to find a "Grupo" type author
                        const partyAuthor = proposal.authors.find(a => 
                          a && typeof a === 'object' && a.author_type === "Grupo"
                        );
                        
                        if (partyAuthor) {
                          partyDisplay = typeof partyAuthor.name === 'string' ? partyAuthor.name : "Desconhecido";
                        } else {
                          // If no party, try to find "Outro" type
                          const otherAuthor = proposal.authors.find(a => 
                            a && typeof a === 'object' && a.author_type === "Outro"
                          );
                          
                          if (otherAuthor) {
                            partyDisplay = typeof otherAuthor.name === 'string' ? otherAuthor.name : "Desconhecido";
                          }
                        }
                      }
                      
                      return (
                        <ProposalCard
                          key={proposal.id}
                          title={proposal.title}
                          number={proposal.external_id}
                          status={phaseDisplay}
                          date={proposal.date}
                          party={partyDisplay}
                          type={proposal.type}
                        />
                      );
                    })}
                  </div>
            <div className="flex justify-center mt-8">
              <Button variant="outline" className="gap-1.5 text-black border-black hover:bg-black hover:text-white dark:bg-transparent dark:border-white dark:text-white dark:hover:bg-white/10" asChild>
                <Link href="/propostas">
                  Ver Todas as Propostas
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
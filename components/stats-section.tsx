// components/stats-section.tsx
"use client"
import { StatsCard } from "@/components/stats-card"
import { BarChart3, FileText, Vote } from "lucide-react"
import { DashboardStats } from "@/lib/types"

interface StatsProps {
  stats: DashboardStats
}

export function StatsSection({ stats }: StatsProps) {
  return (
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
  )
}
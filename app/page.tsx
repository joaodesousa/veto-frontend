import Link from "next/link"
import { ArrowRight, BarChart3, Clock, FileText, Search, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ProposalCard } from "@/components/proposal-card"
import { StatsCard } from "@/components/stats-card"
import { getHomePageProposals } from "@/lib/server-api"

export default async function Home() {
  const { proposals, totalCount } = await getHomePageProposals(4);

  return (
    <div className="flex flex-col min-h-screen">
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-blue-50 to-white dark:from-blue-950 dark:to-background">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <Badge
                  variant="outline"
                  className="inline-flex items-center border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400"
                >
                  <span>Democracia Transparente</span>
                </Badge>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-6xl/none">
                  Acompanhe o Parlamento Português
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Passos Perdidos permite-lhe acompanhar propostas legislativas, votações e atividade parlamentar de
                  forma simples e transparente.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button size="lg" className="gap-1.5" asChild>
                  <Link href="/propostas">
                    Explorar Propostas
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/sobre">Saber Mais</Link>
                </Button>
              </div>
            </div>
            <div className="relative mx-auto lg:mr-0 w-full max-w-[500px] aspect-video">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900 dark:to-blue-950 rounded-xl shadow-xl overflow-hidden">
                <div className="absolute inset-0 bg-white/90 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
                  <div className="text-center">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-primary" />
                    <h3 className="text-xl font-semibold mb-2">Visualização Interativa</h3>
                    <p className="text-sm text-muted-foreground">
                      Explore propostas legislativas com visualizações interativas e dados em tempo real
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-16 lg:py-20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Acompanhamento Legislativo em Números
              </h2>
              <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Estatísticas atualizadas sobre a atividade parlamentar em Portugal
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            <StatsCard
              title="Propostas"
              value={totalCount}
              description="Propostas nesta legislatura"
              icon={<FileText className="h-5 w-5" />}
            />
            <StatsCard
              title="Votações"
              value="1,432"
              description="Votações realizadas"
              icon={<BarChart3 className="h-5 w-5" />}
            />
            <StatsCard
              title="Deputados"
              value="230"
              description="Deputados em funções"
              icon={<Users className="h-5 w-5" />}
            />
            <StatsCard
              title="Tempo Médio"
              value="127"
              description="Dias até aprovação"
              icon={<Clock className="h-5 w-5" />}
            />
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-16 ">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-white">
                Encontre Propostas Legislativas
              </h2>
              <p className="max-w-[700px] text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Pesquise e filtre propostas por tema, estado, partido ou data
              </p>
            </div>
          </div>
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Pesquisar propostas..." className="pl-8 bg-white dark:bg-slate-950" />
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {proposals.length > 0 ? (
                proposals.map((proposal) => (
                  <ProposalCard
                    key={proposal.id}
                    title={proposal.title}
                    type={proposal.type}
                    number={`${proposal.external_id}`}
                    status={proposal.phases?.[proposal.phases.length-1]?.name || 'Sem Estado'}
                    date={proposal.date}
                    party={proposal.authors?.find(author => author.author_type === "Grupo")?.name || "Desconhecido"}
                  />
                ))
              ) : (
                <div className="col-span-full text-center text-gray-400 py-8">
                  Não foram encontradas propostas
                </div>
              )}
            </div>
            <div className="flex justify-center mt-8">
              <Button variant="outline" className="gap-1.5 text-white border-white hover:bg-white/10" asChild>
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
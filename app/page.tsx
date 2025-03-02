import { ArrowRight, BarChart3, Clock, FileText, Search, TrendingUp, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProposalCard } from "@/components/proposal-card"
import { StatsCard } from "@/components/stats-card"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
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
                <Button size="lg" className="gap-1.5">
                  Explorar Propostas
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline">
                  Saber Mais
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

      {/* Stats Section */}
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
              title="Propostas Ativas"
              value="237"
              description="Propostas em discussão"
              icon={<FileText className="h-5 w-5" />}
              trend="+12% este mês"
              trendUp={true}
            />
            <StatsCard
              title="Votações"
              value="1,432"
              description="Votações realizadas"
              icon={<BarChart3 className="h-5 w-5" />}
              trend="+8% este mês"
              trendUp={true}
            />
            <StatsCard
              title="Deputados"
              value="230"
              description="Deputados em funções"
              icon={<Users className="h-5 w-5" />}
              trend="0% este mês"
              trendUp={null}
            />
            <StatsCard
              title="Tempo Médio"
              value="127"
              description="Dias até aprovação"
              icon={<Clock className="h-5 w-5" />}
              trend="-5% este mês"
              trendUp={false}
            />
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="w-full py-12 md:py-16 bg-black">
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
              <Button>Pesquisar</Button>
            </div>
            <Tabs defaultValue="recentes" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="recentes">Recentes</TabsTrigger>
                <TabsTrigger value="populares">Populares</TabsTrigger>
                <TabsTrigger value="aprovadas">Aprovadas</TabsTrigger>
                <TabsTrigger value="rejeitadas">Rejeitadas</TabsTrigger>
              </TabsList>
              <TabsContent value="recentes" className="mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <ProposalCard
                    title="Alteração ao Regime Jurídico das Autarquias Locais"
                    number="PL 45/XV/1"
                    status="Em Comissão"
                    date="2023-05-15"
                    party="PS"
                    tags={["Autarquias", "Administração Pública"]}
                  />
                  <ProposalCard
                    title="Medidas de Apoio às Famílias e à Natalidade"
                    number="PJL 121/XV/1"
                    status="Agendada"
                    date="2023-05-10"
                    party="PSD"
                    tags={["Família", "Apoios Sociais"]}
                  />
                  <ProposalCard
                    title="Estratégia Nacional para a Mobilidade Sustentável"
                    number="PPL 33/XV/1"
                    status="Em Discussão"
                    date="2023-05-02"
                    party="GOV"
                    tags={["Ambiente", "Transportes"]}
                  />
                </div>
              </TabsContent>
              <TabsContent value="populares" className="mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <ProposalCard
                    title="Revisão do Estatuto dos Profissionais de Saúde"
                    number="PJL 89/XV/1"
                    status="Em Comissão"
                    date="2023-04-20"
                    party="BE"
                    tags={["Saúde", "Trabalho"]}
                  />
                  <ProposalCard
                    title="Programa Nacional de Habitação Acessível"
                    number="PPL 28/XV/1"
                    status="Aprovada"
                    date="2023-04-12"
                    party="GOV"
                    tags={["Habitação", "Economia"]}
                  />
                </div>
              </TabsContent>
              <TabsContent value="aprovadas" className="mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <ProposalCard
                    title="Programa Nacional de Habitação Acessível"
                    number="PPL 28/XV/1"
                    status="Aprovada"
                    date="2023-04-12"
                    party="GOV"
                    tags={["Habitação", "Economia"]}
                  />
                  <ProposalCard
                    title="Alterações ao Código do Trabalho"
                    number="PL 19/XV/1"
                    status="Aprovada"
                    date="2023-03-28"
                    party="PS"
                    tags={["Trabalho", "Economia"]}
                  />
                </div>
              </TabsContent>
              <TabsContent value="rejeitadas" className="mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <ProposalCard
                    title="Redução do IVA na Energia"
                    number="PJL 76/XV/1"
                    status="Rejeitada"
                    date="2023-04-05"
                    party="CH"
                    tags={["Impostos", "Energia"]}
                  />
                  <ProposalCard
                    title="Nacionalização dos CTT"
                    number="PJL 62/XV/1"
                    status="Rejeitada"
                    date="2023-03-15"
                    party="PCP"
                    tags={["Serviços Públicos", "Economia"]}
                  />
                </div>
              </TabsContent>
            </Tabs>
            <div className="flex justify-center mt-8">
              <Button variant="outline" className="gap-1.5">
                Ver Todas as Propostas
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      
    </div>
  )
}


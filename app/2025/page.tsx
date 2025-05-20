"use client"

import { useState, useEffect } from "react"
import {
  ArrowRight,
  Calendar,
  Filter,
  Info,
  Search,
  Bell,
  BarChart3,
  Map,
  PieChart,
  TrendingUp,
  Users,
  Share2,
  Download,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { PartyCard } from "./components/party-card"
import { IssueCard } from "./components/issue-card"
import { ElectionCountdown } from "./components/election-countdown"
import { ElectionMap } from "./components/election-map"
import { PollChart } from "./components/poll-chart"
import { VotingIntentionChart } from "./components/voting-intention-chart"
import { ParticipationChart } from "./components/participation-chart"
import { LiveUpdatesPanel } from "./components/live-updates-panel"

export default function ElectionsPage() {
  const [showLiveAlert, setShowLiveAlert] = useState(false)
  const [selectedView, setSelectedView] = useState<"chart" | "map">("chart")
  const [isElectionDay, setIsElectionDay] = useState(false)

  // Simulate checking if it's election day
  useEffect(() => {
    // This would normally check against the actual election date
    const mockElectionDay = false
    setIsElectionDay(mockElectionDay)

    // Simulate a live update coming in
    const timer = setTimeout(() => {
      setShowLiveAlert(true)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-br from-blue-600 to-blue-800 dark:from-blue-900 dark:to-blue-950">
        <div className="container px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center text-white">
            <Badge className="bg-white/20 text-white hover:bg-white/30 border-none mb-4">
              <Calendar className="mr-1 h-3 w-3" /> 10 de Março de 2025
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
              Eleições Legislativas 2025
            </h1>
            <p className="text-xl text-white/80 mb-6">
              Acompanhe em tempo real os resultados, sondagens e análises das eleições legislativas
            </p>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8">
              <ElectionCountdown targetDate="2025-03-10T08:00:00" />
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-white text-blue-700 hover:bg-white/90">
                <BarChart3 className="mr-2 h-4 w-4" />
                Ver Resultados
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Map className="mr-2 h-4 w-4" />
                Mapa Eleitoral
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Bell className="mr-2 h-4 w-4" />
                Receber Alertas
              </Button>
            </div>
          </div>
        </div>
        <div className="h-16 bg-gradient-to-t from-background to-transparent"></div>
      </section>

      {/* Live Alert */}
      {showLiveAlert && (
        <div className="container px-4 -mt-8 mb-8 relative z-10">
          <Alert className="bg-red-500 text-white border-none animate-pulse">
            <Bell className="h-4 w-4" />
            <AlertTitle>Nova Sondagem Publicada</AlertTitle>
            <AlertDescription className="flex justify-between items-center">
              <span>A última sondagem mostra alterações significativas nas intenções de voto.</span>
              <Button
                variant="outline"
                size="sm"
                className="text-white border-white hover:bg-white/20 hover:text-white"
              >
                Ver Detalhes
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Main Content */}
      <section className="flex-1 py-8">
        <div className="container px-4">
          <Tabs defaultValue="dashboard" className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <TabsList className="h-10">
                <TabsTrigger value="dashboard" className="text-sm">
                  Dashboard
                </TabsTrigger>
                <TabsTrigger value="parties" className="text-sm">
                  Partidos
                </TabsTrigger>
                <TabsTrigger value="issues" className="text-sm">
                  Temas
                </TabsTrigger>
                <TabsTrigger value="compare" className="text-sm">
                  Comparar
                </TabsTrigger>
              </TabsList>

              <div className="relative w-full md:w-auto md:min-w-[300px]">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Pesquisar partidos ou temas..." className="pl-8" />
              </div>
            </div>

            {/* Dashboard Tab */}
            <TabsContent value="dashboard" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Dashboard Eleitoral</h2>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-1">
                    <Share2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Partilhar</span>
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Download className="h-4 w-4" />
                    <span className="hidden sm:inline">Exportar</span>
                  </Button>
                </div>
              </div>

              {isElectionDay ? (
                <LiveUpdatesPanel />
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <PieChart className="h-5 w-5 text-blue-500" />
                          Intenção de Voto
                        </CardTitle>
                        <CardDescription>Última atualização: 15 de fevereiro</CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="h-[300px]">
                          <VotingIntentionChart />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <TrendingUp className="h-5 w-5 text-green-500" />
                          Evolução das Sondagens
                        </CardTitle>
                        <CardDescription>Últimos 6 meses</CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="h-[300px]">
                          <PollChart />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Users className="h-5 w-5 text-purple-500" />
                          Participação Eleitoral
                        </CardTitle>
                        <CardDescription>Histórico das últimas eleições</CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="h-[300px]">
                          <ParticipationChart />
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Map className="h-5 w-5 text-amber-500" />
                            Mapa Eleitoral
                          </CardTitle>
                          <div className="flex gap-2">
                            <Button
                              variant={selectedView === "map" ? "default" : "outline"}
                              size="sm"
                              onClick={() => setSelectedView("map")}
                            >
                              <Map className="h-4 w-4" />
                            </Button>
                            <Button
                              variant={selectedView === "chart" ? "default" : "outline"}
                              size="sm"
                              onClick={() => setSelectedView("chart")}
                            >
                              <BarChart3 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <CardDescription>Resultados das eleições de 2022 por distrito</CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="h-[400px]">
                          {selectedView === "map" ? (
                            <ElectionMap />
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full overflow-y-auto py-4">
                              {[
                                "Lisboa",
                                "Porto",
                                "Braga",
                                "Setúbal",
                                "Aveiro",
                                "Leiria",
                                "Santarém",
                                "Faro",
                                "Coimbra",
                                "Viseu",
                              ].map((district) => (
                                <div key={district} className="space-y-2">
                                  <h3 className="font-medium">{district}</h3>
                                  <div className="space-y-3">
                                    <div className="flex items-center justify-between text-sm">
                                      <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-[#F8567B]"></div>
                                        <span>PS</span>
                                      </div>
                                      <span className="font-medium">
                                        {district === "Lisboa"
                                          ? "32.4%"
                                          : district === "Porto"
                                            ? "30.1%"
                                            : district === "Braga"
                                              ? "29.8%"
                                              : "28.5%"}
                                      </span>
                                    </div>
                                    <Progress
                                      value={
                                        district === "Lisboa"
                                          ? 32.4
                                          : district === "Porto"
                                            ? 30.1
                                            : district === "Braga"
                                              ? 29.8
                                              : 28.5
                                      }
                                      className="h-2 bg-muted"
                                      indicatorClassName="bg-[#F8567B]"
                                    />

                                    <div className="flex items-center justify-between text-sm">
                                      <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-[#FF821E]"></div>
                                        <span>PSD</span>
                                      </div>
                                      <span className="font-medium">
                                        {district === "Lisboa"
                                          ? "27.8%"
                                          : district === "Porto"
                                            ? "29.2%"
                                            : district === "Braga"
                                              ? "31.5%"
                                              : "30.2%"}
                                      </span>
                                    </div>
                                    <Progress
                                      value={
                                        district === "Lisboa"
                                          ? 27.8
                                          : district === "Porto"
                                            ? 29.2
                                            : district === "Braga"
                                              ? 31.5
                                              : 30.2
                                      }
                                      className="h-2 bg-muted"
                                      indicatorClassName="bg-[#FF821E]"
                                    />

                                    <div className="flex items-center justify-between text-sm">
                                      <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-[#202056]"></div>
                                        <span>CH</span>
                                      </div>
                                      <span className="font-medium">
                                        {district === "Lisboa"
                                          ? "12.3%"
                                          : district === "Porto"
                                            ? "11.8%"
                                            : district === "Braga"
                                              ? "10.5%"
                                              : "13.1%"}
                                      </span>
                                    </div>
                                    <Progress
                                      value={
                                        district === "Lisboa"
                                          ? 12.3
                                          : district === "Porto"
                                            ? 11.8
                                            : district === "Braga"
                                              ? 10.5
                                              : 13.1
                                      }
                                      className="h-2 bg-muted"
                                      indicatorClassName="bg-[#202056]"
                                    />

                                    <div className="flex items-center justify-between text-sm">
                                      <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-[#00AEEF]"></div>
                                        <span>IL</span>
                                      </div>
                                      <span className="font-medium">
                                        {district === "Lisboa"
                                          ? "8.7%"
                                          : district === "Porto"
                                            ? "7.9%"
                                            : district === "Braga"
                                              ? "6.8%"
                                              : "5.4%"}
                                      </span>
                                    </div>
                                    <Progress
                                      value={
                                        district === "Lisboa"
                                          ? 8.7
                                          : district === "Porto"
                                            ? 7.9
                                            : district === "Braga"
                                              ? 6.8
                                              : 5.4
                                      }
                                      className="h-2 bg-muted"
                                      indicatorClassName="bg-[#00AEEF]"
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Temas Mais Importantes</CardTitle>
                        <CardDescription>Segundo os eleitores portugueses</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Habitação</span>
                              <span className="text-sm font-medium">78%</span>
                            </div>
                            <Progress value={78} className="h-2" />
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Saúde</span>
                              <span className="text-sm font-medium">72%</span>
                            </div>
                            <Progress value={72} className="h-2" />
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Economia</span>
                              <span className="text-sm font-medium">65%</span>
                            </div>
                            <Progress value={65} className="h-2" />
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Educação</span>
                              <span className="text-sm font-medium">58%</span>
                            </div>
                            <Progress value={58} className="h-2" />
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Ambiente</span>
                              <span className="text-sm font-medium">42%</span>
                            </div>
                            <Progress value={42} className="h-2" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Próximos Eventos</CardTitle>
                        <CardDescription>Debates e momentos-chave da campanha</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex gap-4 items-start">
                            <div className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-md p-2 text-center min-w-[60px]">
                              <div className="text-xs font-medium">FEV</div>
                              <div className="text-lg font-bold">18</div>
                            </div>
                            <div>
                              <h4 className="font-medium">Debate: PS vs PSD</h4>
                              <p className="text-sm text-muted-foreground">21:00 - RTP1</p>
                              <Badge className="mt-2">Debate Televisivo</Badge>
                            </div>
                          </div>

                          <Separator />

                          <div className="flex gap-4 items-start">
                            <div className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-md p-2 text-center min-w-[60px]">
                              <div className="text-xs font-medium">FEV</div>
                              <div className="text-lg font-bold">22</div>
                            </div>
                            <div>
                              <h4 className="font-medium">Debate: Todos os Partidos</h4>
                              <p className="text-sm text-muted-foreground">21:00 - SIC</p>
                              <Badge className="mt-2">Debate Televisivo</Badge>
                            </div>
                          </div>

                          <Separator />

                          <div className="flex gap-4 items-start">
                            <div className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-md p-2 text-center min-w-[60px]">
                              <div className="text-xs font-medium">MAR</div>
                              <div className="text-lg font-bold">01</div>
                            </div>
                            <div>
                              <h4 className="font-medium">Início da Campanha Oficial</h4>
                              <p className="text-sm text-muted-foreground">Em todo o país</p>
                              <Badge className="mt-2" variant="outline">
                                Campanha
                              </Badge>
                            </div>
                          </div>

                          <Separator />

                          <div className="flex gap-4 items-start">
                            <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-md p-2 text-center min-w-[60px]">
                              <div className="text-xs font-medium">MAR</div>
                              <div className="text-lg font-bold">10</div>
                            </div>
                            <div>
                              <h4 className="font-medium">Dia das Eleições</h4>
                              <p className="text-sm text-muted-foreground">8:00 - 19:00</p>
                              <Badge className="mt-2" variant="destructive">
                                Dia da Eleição
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </>
              )}
            </TabsContent>

            {/* Parties Tab */}
            <TabsContent value="parties" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Partidos Políticos</h2>
                <Button variant="outline" size="sm" className="gap-1">
                  <Filter className="h-4 w-4" />
                  <span className="hidden sm:inline">Filtrar</span>
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <PartyCard
                  acronym="PS"
                  name="Partido Socialista"
                  color="#F8567B"
                  logo="/placeholder.svg?height=80&width=80"
                  leader="Pedro Nuno Santos"
                  currentPolls={32.5}
                  previousResult={36.3}
                  trend="down"
                />
                <PartyCard
                  acronym="PSD"
                  name="Partido Social Democrata"
                  color="#FF821E"
                  logo="/placeholder.svg?height=80&width=80"
                  leader="Luís Montenegro"
                  currentPolls={28.7}
                  previousResult={27.8}
                  trend="up"
                />
                <PartyCard
                  acronym="CH"
                  name="Chega"
                  color="#202056"
                  logo="/placeholder.svg?height=80&width=80"
                  leader="André Ventura"
                  currentPolls={12.4}
                  previousResult={7.2}
                  trend="up"
                />
                <PartyCard
                  acronym="IL"
                  name="Iniciativa Liberal"
                  color="#00AEEF"
                  logo="/placeholder.svg?height=80&width=80"
                  leader="Rui Rocha"
                  currentPolls={7.8}
                  previousResult={4.9}
                  trend="up"
                />
                <PartyCard
                  acronym="BE"
                  name="Bloco de Esquerda"
                  color="#C4161C"
                  logo="/placeholder.svg?height=80&width=80"
                  leader="Mariana Mortágua"
                  currentPolls={5.2}
                  previousResult={4.4}
                  trend="up"
                />
                <PartyCard
                  acronym="PCP"
                  name="Partido Comunista Português"
                  color="#C4161C"
                  logo="/placeholder.svg?height=80&width=80"
                  leader="Paulo Raimundo"
                  currentPolls={3.8}
                  previousResult={4.1}
                  trend="down"
                />
                <PartyCard
                  acronym="L"
                  name="Livre"
                  color="#00AA4F"
                  logo="/placeholder.svg?height=80&width=80"
                  leader="Rui Tavares"
                  currentPolls={3.5}
                  previousResult={1.3}
                  trend="up"
                />
                <PartyCard
                  acronym="PAN"
                  name="Pessoas-Animais-Natureza"
                  color="#01796F"
                  logo="/placeholder.svg?height=80&width=80"
                  leader="Inês Sousa Real"
                  currentPolls={1.8}
                  previousResult={1.6}
                  trend="up"
                />
              </div>
            </TabsContent>

            {/* Issues Tab */}
            <TabsContent value="issues" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Temas Principais</h2>
                <Button variant="outline" size="sm" className="gap-1">
                  <Filter className="h-4 w-4" />
                  <span className="hidden sm:inline">Filtrar</span>
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <IssueCard
                  title="Economia"
                  description="Propostas sobre crescimento económico, impostos, orçamento e finanças públicas."
                  icon="💶"
                  partiesCount={8}
                  importance={65}
                />
                <IssueCard
                  title="Saúde"
                  description="Propostas sobre o Serviço Nacional de Saúde, acesso a cuidados e profissionais de saúde."
                  icon="🏥"
                  partiesCount={8}
                  importance={72}
                />
                <IssueCard
                  title="Educação"
                  description="Propostas sobre escolas, universidades, professores e sistema educativo."
                  icon="🎓"
                  partiesCount={8}
                  importance={58}
                />
                <IssueCard
                  title="Habitação"
                  description="Propostas sobre acesso à habitação, arrendamento e políticas de habitação."
                  icon="🏠"
                  partiesCount={8}
                  importance={78}
                />
                <IssueCard
                  title="Ambiente"
                  description="Propostas sobre alterações climáticas, sustentabilidade e transição energética."
                  icon="🌍"
                  partiesCount={7}
                  importance={42}
                />
                <IssueCard
                  title="Trabalho"
                  description="Propostas sobre emprego, direitos laborais, salários e condições de trabalho."
                  icon="👷‍♂️"
                  partiesCount={8}
                  importance={54}
                />
                <IssueCard
                  title="Segurança"
                  description="Propostas sobre segurança pública, forças policiais e combate ao crime."
                  icon="🛡️"
                  partiesCount={6}
                  importance={48}
                />
                <IssueCard
                  title="Imigração"
                  description="Propostas sobre políticas migratórias, integração e fronteiras."
                  icon="🌐"
                  partiesCount={7}
                  importance={39}
                />
                <IssueCard
                  title="Justiça"
                  description="Propostas sobre sistema judicial, tribunais e combate à corrupção."
                  icon="⚖️"
                  partiesCount={8}
                  importance={45}
                />
              </div>
            </TabsContent>

            {/* Compare Tab */}
            <TabsContent value="compare" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Comparar Programas</h2>
                <Button variant="outline" size="sm" className="gap-1">
                  <Info className="h-4 w-4" />
                  <span className="hidden sm:inline">Como Funciona</span>
                </Button>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Selecione os partidos para comparar</CardTitle>
                  <CardDescription>Escolha até 3 partidos para uma comparação detalhada</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {["PS", "PSD", "CH", "IL", "BE", "PCP", "L", "PAN"].map((party) => (
                      <div key={party} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`party-${party}`}
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <label htmlFor={`party-${party}`} className="text-sm font-medium">
                          {party}
                        </label>
                      </div>
                    ))}
                  </div>

                  <Separator className="my-6" />

                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Selecione os temas para comparar</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {["Economia", "Saúde", "Educação", "Habitação", "Ambiente", "Trabalho"].map((issue) => (
                        <div key={issue} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`issue-${issue}`}
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <label htmlFor={`issue-${issue}`} className="text-sm font-medium">
                            {issue}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full sm:w-auto">Comparar Selecionados</Button>
                </CardFooter>
              </Card>

              <div className="bg-muted rounded-lg p-6 text-center">
                <h3 className="text-lg font-medium mb-2">Comparações Populares</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                  <Button variant="outline" className="justify-between">
                    <span>PS vs PSD</span>
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                  <Button variant="outline" className="justify-between">
                    <span>PSD vs IL</span>
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                  <Button variant="outline" className="justify-between">
                    <span>PS vs BE vs PCP</span>
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Featured Comparisons */}
      <section className="py-12 bg-slate-50 dark:bg-slate-950 border-t">
        <div className="container px-4">
          <div className="max-w-3xl mx-auto text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Análises em Destaque</h2>
            <p className="text-muted-foreground">
              Exploramos em profundidade as diferenças entre os programas eleitorais em temas chave
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Habitação: Soluções Divergentes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Análise das diferentes abordagens dos partidos para resolver a crise da habitação em Portugal.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="secondary">PS</Badge>
                  <Badge variant="secondary">PSD</Badge>
                  <Badge variant="secondary">IL</Badge>
                  <Badge variant="secondary">BE</Badge>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="gap-1 ml-auto">
                  Ler análise
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Impostos: Quem Propõe o Quê?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Comparação detalhada das propostas fiscais dos principais partidos políticos.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="secondary">PS</Badge>
                  <Badge variant="secondary">PSD</Badge>
                  <Badge variant="secondary">IL</Badge>
                  <Badge variant="secondary">CH</Badge>
                  <Badge variant="secondary">PCP</Badge>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="gap-1 ml-auto">
                  Ler análise
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">SNS: Visões para a Saúde</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  As diferentes visões para o futuro do Serviço Nacional de Saúde nos programas eleitorais.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="secondary">PS</Badge>
                  <Badge variant="secondary">PSD</Badge>
                  <Badge variant="secondary">CH</Badge>
                  <Badge variant="secondary">BE</Badge>
                  <Badge variant="secondary">L</Badge>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="gap-1 ml-auto">
                  Ler análise
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-gradient-to-br from-blue-600 to-blue-800 dark:from-blue-900 dark:to-blue-950 text-white">
        <div className="container px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Voto Informado, Democracia Fortalecida</h2>
            <p className="text-xl text-white/80 mb-6">
              Explore os programas eleitorais, compare propostas e faça uma escolha informada nas próximas eleições.
            </p>
            <Button size="lg" className="bg-white text-blue-700 hover:bg-white/90">
              Começar a Comparar
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}


import Link from "next/link"
import { ArrowLeft, Calendar, Check, ChevronRight, FileText, ThumbsDown, ThumbsUp, Users, X } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Timeline, TimelineItem } from "@/components/timeline"

export default function ProposalDetailPage({ params }: { params: { id: string } }) {
  // This would normally be fetched from an API
  const proposal = {
    id: params.id,
    title: "Alteração ao Regime Jurídico das Autarquias Locais",
    number: "PL 45/XV/1",
    status: "Em Comissão",
    date: "15 de Maio de 2023",
    party: "PS",
    tags: ["Autarquias", "Administração Pública"],
    description:
      "Proposta de alteração ao Regime Jurídico das Autarquias Locais, visando reforçar a autonomia local e melhorar a eficiência da gestão autárquica. A proposta inclui medidas para simplificar procedimentos administrativos, clarificar competências entre diferentes níveis de governo local e promover a transparência na gestão de recursos públicos.",
    authors: ["Maria Silva", "João Santos", "Ana Pereira"],
    timeline: [
      {
        date: "15/05/2023",
        title: "Apresentação",
        description: "Proposta apresentada no Parlamento",
      },
      {
        date: "20/05/2023",
        title: "Admissão",
        description: "Proposta admitida e enviada à comissão",
      },
      {
        date: "10/06/2023",
        title: "Discussão na Comissão",
        description: "Discussão na Comissão de Administração Pública",
      },
      {
        date: "25/06/2023",
        title: "Audições Públicas",
        description: "Audição de especialistas e entidades",
      },
      {
        date: "15/07/2023",
        title: "Em Análise",
        description: "Análise de propostas de alteração",
      },
    ],
    votes: {
      favor: 108,
      against: 79,
      abstention: 43,
      parties: {
        PS: "favor",
        PSD: "against",
        CH: "against",
        IL: "abstention",
        BE: "abstention",
        PCP: "against",
        PAN: "favor",
        L: "favor",
      },
    },
    documents: [
      {
        title: "Texto da Proposta",
        type: "PDF",
        date: "15/05/2023",
      },
      {
        title: "Parecer da Comissão",
        type: "PDF",
        date: "12/06/2023",
      },
      {
        title: "Propostas de Alteração",
        type: "PDF",
        date: "01/07/2023",
      },
    ],
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            Início
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/propostas" className="hover:text-foreground">
            Propostas
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground font-medium">{proposal.number}</span>
        </div>

        {/* Back Button */}
        <Button variant="ghost" size="sm" className="w-fit" asChild>
          <Link href="/propostas">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar às Propostas
          </Link>
        </Button>

        {/* Header */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900">
              {proposal.status}
            </Badge>
            <Badge variant="outline">{proposal.party}</Badge>
            {proposal.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
          <h1 className="text-3xl font-bold">{proposal.title}</h1>
          <div className="flex flex-col sm:flex-row gap-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              <FileText className="mr-2 h-4 w-4" />
              {proposal.number}
            </div>
            <div className="flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              {proposal.date}
            </div>
            <div className="flex items-center">
              <Users className="mr-2 h-4 w-4" />
              {proposal.authors.length} autor{proposal.authors.length !== 1 ? "es" : ""}
            </div>
          </div>
        </div>

        <Separator />

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Sobre a Proposta</CardTitle>
                <CardDescription>Descrição e detalhes da proposta legislativa</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{proposal.description}</p>
                <div className="mt-6">
                  <h4 className="font-semibold mb-2">Autores</h4>
                  <ul className="list-disc list-inside text-muted-foreground">
                    {proposal.authors.map((author) => (
                      <li key={author}>{author}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="timeline">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="timeline">Cronologia</TabsTrigger>
                <TabsTrigger value="voting">Votação</TabsTrigger>
                <TabsTrigger value="documents">Documentos</TabsTrigger>
              </TabsList>
              <TabsContent value="timeline" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Cronologia da Proposta</CardTitle>
                    <CardDescription>Acompanhe o percurso desta proposta legislativa</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Timeline>
                      {proposal.timeline.map((item, index) => (
                        <TimelineItem
                          key={index}
                          date={item.date}
                          title={item.title}
                          description={item.description}
                          isLast={index === proposal.timeline.length - 1}
                        />
                      ))}
                    </Timeline>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="voting" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Resultados da Votação</CardTitle>
                    <CardDescription>Como votaram os deputados e partidos</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <Card className="bg-green-50 dark:bg-green-950 border-green-100 dark:border-green-900">
                        <CardContent className="p-4 flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-green-600 dark:text-green-400">A Favor</p>
                            <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                              {proposal.votes.favor}
                            </p>
                          </div>
                          <ThumbsUp className="h-8 w-8 text-green-500 dark:text-green-400" />
                        </CardContent>
                      </Card>
                      <Card className="bg-red-50 dark:bg-red-950 border-red-100 dark:border-red-900">
                        <CardContent className="p-4 flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-red-600 dark:text-red-400">Contra</p>
                            <p className="text-2xl font-bold text-red-700 dark:text-red-300">
                              {proposal.votes.against}
                            </p>
                          </div>
                          <ThumbsDown className="h-8 w-8 text-red-500 dark:text-red-400" />
                        </CardContent>
                      </Card>
                      <Card className="bg-gray-50 dark:bg-gray-900 border-gray-100 dark:border-gray-800">
                        <CardContent className="p-4 flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Abstenção</p>
                            <p className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                              {proposal.votes.abstention}
                            </p>
                          </div>
                          <span className="h-8 w-8 rounded-full border-2 border-gray-400 dark:border-gray-500 flex items-center justify-center text-gray-500 dark:text-gray-400">
                            ?
                          </span>
                        </CardContent>
                      </Card>
                    </div>
                    <h4 className="font-semibold mb-3">Votação por Partido</h4>
                    <div className="space-y-2">
                      {Object.entries(proposal.votes.parties).map(([party, vote]) => (
                        <div key={party} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                          <span className="font-medium">{party}</span>
                          <Badge
                            className={
                              vote === "favor"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                : vote === "against"
                                  ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                                  : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                            }
                          >
                            {vote === "favor" ? (
                              <Check className="mr-1 h-3 w-3" />
                            ) : vote === "against" ? (
                              <X className="mr-1 h-3 w-3" />
                            ) : null}
                            {vote === "favor" ? "A Favor" : vote === "against" ? "Contra" : "Abstenção"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="documents" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Documentos Relacionados</CardTitle>
                    <CardDescription>Aceda aos documentos oficiais desta proposta</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {proposal.documents.map((doc, index) => (
                        <div key={index} className="flex items-center justify-between p-3 rounded-md bg-muted/50">
                          <div className="flex items-center">
                            <FileText className="h-5 w-5 mr-2 text-primary" />
                            <div>
                              <p className="font-medium">{doc.title}</p>
                              <p className="text-xs text-muted-foreground">{doc.date}</p>
                            </div>
                          </div>
                          <Button size="sm" variant="outline">
                            Download
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Estado Atual</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Estado:</span>
                    <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900">
                      {proposal.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Fase Atual:</span>
                    <span className="text-sm">{proposal.timeline[proposal.timeline.length - 1].title}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Última Atualização:</span>
                    <span className="text-sm">{proposal.timeline[proposal.timeline.length - 1].date}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Próxima Etapa:</span>
                    <span className="text-sm">Votação na Especialidade</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Propostas Relacionadas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-md border p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-sm">PJL 48/XV/1</p>
                      <p className="text-xs text-muted-foreground mt-1">Alterações à Lei das Finanças Locais</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      PSD
                    </Badge>
                  </div>
                  <Button variant="link" size="sm" className="px-0 h-auto mt-2" asChild>
                    <Link href="#">Ver proposta</Link>
                  </Button>
                </div>
                <div className="rounded-md border p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-sm">PJL 52/XV/1</p>
                      <p className="text-xs text-muted-foreground mt-1">Competências das Juntas de Freguesia</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      BE
                    </Badge>
                  </div>
                  <Button variant="link" size="sm" className="px-0 h-auto mt-2" asChild>
                    <Link href="#">Ver proposta</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Subscrever Atualizações</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Receba notificações sobre alterações nesta proposta legislativa.
                </p>
                <Button className="w-full">Subscrever</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}


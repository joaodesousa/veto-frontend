import Link from "next/link"
import { notFound } from "next/navigation"
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BookmarkPlus,
  Calendar,
  ChevronRight,
  Clock,
  Eye,
  FileText,
  Flag,
  MessageSquare,
  Share2,
  Users,
  Bell
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { getProposalForId } from "@/lib/server-api"
import { formatProposalData } from "../utils/formatters"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ProposalTabs } from "./components/ProposalTabs"
import { ProposalSidebar } from "./components/ProposalSidebar"
import { CopyUrlButton } from "./components/CopyUrl"
import { ProposalRelated } from "./components/ProposalRelated"
import { SocialShareCard } from "./components/SocialShareCard"

export async function generateMetadata({ params }: { params: { external_id: string } }) {
  const proposal = await getProposalForId(params.external_id)
  
  if (!proposal) {
    return {
      title: "Proposta não encontrada",
      description: "A proposta legislativa solicitada não foi encontrada."
    }
  }
  
  return {
    title: `${proposal.type} - ${proposal.title}`,
    description: proposal.description || 'Sem descrição disponível',
    openGraph: {
      images: [{
        url: `https://veto.pt/api/og?title=${encodeURIComponent(proposal.title)}&subtitle=${encodeURIComponent(`${proposal.type}`)}`,
        width: 1200,
        height: 630,
      }]
    }
  }
}

export default async function ProposalDetailPage({ params }: { params: { external_id: string } }) {
  try {
    const proposal = await getProposalForId(params.external_id)
    
    if (!proposal) {
      notFound()
    }

    // Format the proposal data for the UI
    const formattedProposal = formatProposalData(proposal)

    const firstPhaseDate = (() => {
      if (formattedProposal.phases && formattedProposal.phases.length > 0) {
        // Sort phases by date (oldest first)
        const sortedPhases = [...formattedProposal.phases].sort((a, b) => {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        });
        // Format the date of the first phase
        return new Date(sortedPhases[0].date).toLocaleDateString('pt-PT');
      }
      // Fallback to proposal date if no phases available
      return formattedProposal.date;
    })();

    // Calculate progress percentage based on timeline
    const progressSteps = [
      "Apresentação",
      "Admissão",
      "Discussão na Comissão",
      "Audições Públicas",
      "Em Análise",
      "Votação na Especialidade",
      "Votação Final Global",
      "Promulgação",
      "Publicação",
    ]

    // Find the current step by matching the last timeline item to progressSteps
    let currentStepIndex = 0
    if (formattedProposal.timeline && formattedProposal.timeline.length > 0) {
      const lastPhaseTitle = formattedProposal.timeline[formattedProposal.timeline.length - 1].title
      const matchingIndex = progressSteps.findIndex(step => 
        lastPhaseTitle.includes(step) || step.includes(lastPhaseTitle)
      )
      if (matchingIndex !== -1) {
        currentStepIndex = matchingIndex
      }
    }
    
    const progressPercentage = Math.round(((currentStepIndex + 1) / progressSteps.length) * 100)

    // Stats for the proposal
    const stats = {
      views: 1245,
      follows: 87,
      comments: 32,
    }

    const partyDisplay = (() => {
      if (proposal.authors && Array.isArray(proposal.authors)) {
        // First try to find a "Grupo" type author
        const partyAuthor = proposal.authors.find(a => 
          a && typeof a === 'object' && a.author_type === "Grupo"
        );

        if (partyAuthor) {
          return typeof partyAuthor.name === 'string' ? partyAuthor.name : "Desconhecido";
        } else {
          // If no party, try to find "Outro" type
          const otherAuthor = proposal.authors.find(a => 
            a && typeof a === 'object' && a.author_type === "Outro"
          );

          if (otherAuthor) {
            return typeof otherAuthor.name === 'string' ? otherAuthor.name : "Desconhecido";
          }
        }
      }
      return "Desconhecido"; // Fallback if no authors found
    })();

    return (
      <div className="min-h-screen pb-16">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-800 dark:to-blue-900 text-white pt-16">
          <div className="container py-8 md:py-12">
            {/* Breadcrumb */}
            <div className="flex items-center gap-1 text-sm text-white/80 mb-6 overflow-hidden">
              <Link href="/" className="hover:text-white whitespace-nowrap">
                Início
              </Link>
              <ChevronRight className="h-4 w-4 shrink-0" />
              <Link href="/propostas" className="hover:text-white whitespace-nowrap">
                Propostas
              </Link>
              <ChevronRight className="h-4 w-4 shrink-0" />
              <span 
                className="text-white font-medium truncate max-w-[50vw] block whitespace-nowrap overflow-hidden text-ellipsis"
              >
                {formattedProposal.title}
              </span>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-blue-500 hover:bg-blue-400 text-white">{formattedProposal.status}</Badge>
                <Badge variant="outline" className="border-white/30 text-white hover:bg-white/10">
                  {partyDisplay}
                </Badge>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold">{formattedProposal.title}</h1>
              <div className="flex flex-col sm:flex-row gap-4 text-sm text-white/80">
                <div className="flex items-center">
                  <FileText className="mr-2 h-4 w-4" />
                  {formattedProposal.type}
                </div>
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  {firstPhaseDate}
                </div>
                <div className="flex items-center">
                  <Users className="mr-2 h-4 w-4" />
                  {formattedProposal.authors.length} autor{formattedProposal.authors.length !== 1 ? "es" : ""}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white dark:bg-slate-900 border-b">
          <div className="container py-4">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Progresso Legislativo</span>
                <span>{progressPercentage}%</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Apresentação</span>
                <span>Publicação</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="bg-white dark:bg-slate-900 border-b sticky top-16 z-20">
          <div className="container py-2">
            <div className="flex justify-between items-center">
              <Button variant="ghost" size="sm" className="gap-1" asChild>
                <Link href="/propostas">
                  <ArrowLeft className="h-4 w-4" />
                  Voltar
                </Link>
              </Button>
              <div className="flex items-center gap-2">
                {/* <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" className="gap-1">
                        <BookmarkPlus className="h-4 w-4" />
                        <span className="hidden sm:inline">Guardar</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Guardar esta proposta</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider> */}

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" className="gap-1">
                        <Share2 className="h-4 w-4" />
                        <span className="hidden sm:inline">Partilhar</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Partilhar esta proposta</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                {/* <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" className="gap-1">
                        <Flag className="h-4 w-4" />
                        <span className="hidden sm:inline">Reportar</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Reportar um problema</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider> */}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Summary Card */}
              {/* <Card className="border-blue-100 dark:border-blue-800 shadow-sm">
                <CardHeader className="pb-2 bg-blue-50/50 dark:bg-blue-950/50">
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    Resumo da Proposta
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-muted-foreground leading-relaxed">{formattedProposal.description}</p>
                </CardContent>
              </Card> */}

              {/* Main Content Tabs */}
              <ProposalTabs proposal={formattedProposal} />
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Current Status Card - This is replaced by ProposalSidebar */}
              <ProposalSidebar proposal={formattedProposal} />

              {/* Related Proposals Card */}
              {formattedProposal.relatedProposals && formattedProposal.relatedProposals.length > 0 && (
                <ProposalRelated relatedProposals={formattedProposal.relatedProposals} />
              )}

              {/* Share Card - Updated with copy functionality */}
              <SocialShareCard 
                url={`https://veto.pt/propostas/${formattedProposal.id}`}
                title={formattedProposal.title}
              />
            </div>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error(`Error loading proposal ${params.external_id}:`, error);
    notFound();
  }
}
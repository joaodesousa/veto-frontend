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
  Bell,
  Info
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { getProposalForId } from "@/lib/server-api"
import { formatProposalData } from "../utils/formatters"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ProposalTabs } from "./components/ProposalTabs"
import { ProposalSidebar } from "./components/ProposalSidebar"
import { CopyUrlButton } from "./components/CopyUrl"
import { ProposalRelated } from "./components/ProposalRelated"
import { SocialShareCard } from "./components/SocialShareCard"
import { calculateProposalProgress } from "@/lib/phase-constants"
import { ShareButton } from "./components/ShareButton"
import { SmartBackButton } from "./components/SmartBackButton"

export async function generateMetadata({ params }: { params: { external_id: string } }) {
  const proposal = await getProposalForId(params.external_id)
  
  if (!proposal) {
    return {
      title: "Proposta não encontrada",
      description: "A proposta legislativa solicitada não foi encontrada."
    }
  }
  
  return {
    title: `${proposal.descType || proposal.type} - ${proposal.title}`,
    description: proposal.description || 'Sem descrição disponível',
    openGraph: {
      images: [{
        url: `https://veto.pt/api/og?title=${encodeURIComponent(proposal.title)}&subtitle=${encodeURIComponent(`${proposal.descType || proposal.type}`)}`,
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

    // Calculate accurate progress based on actual phases
    const progressInfo = calculateProposalProgress(formattedProposal.phases)

    // Stats for the proposal
    const stats = {
      views: 1245,
      follows: 87,
      comments: 32,
    }

    // Directly use the raw API data stored in the proposal
    const partyDisplay = (() => {
      // First check if parliamentary groups are available (IniAutorGruposParlamentares)
      if (proposal.IniAutorGruposParlamentares) {
        if (Array.isArray(proposal.IniAutorGruposParlamentares) && proposal.IniAutorGruposParlamentares.length > 0) {
          // Format parliamentary groups
          return proposal.IniAutorGruposParlamentares
            .map(group => group.GP || "")
            .filter(Boolean)
            .join(", ");
        }
      }
      
      // If no parliamentary groups, check for other authors (IniAutorOutros)
      if (proposal.IniAutorOutros) {
        if (Array.isArray(proposal.IniAutorOutros) && proposal.IniAutorOutros.length > 0) {
          // Handle when IniAutorOutros is an array
          return proposal.IniAutorOutros
            .map(other => other.nome || other.sigla || "")
            .filter(Boolean)
            .join(", ");
        } else if (typeof proposal.IniAutorOutros === 'object') {
          // Handle when IniAutorOutros is a single object
          return proposal.IniAutorOutros.nome || proposal.IniAutorOutros.sigla || "Desconhecido";
        }
      }
      
      // Fallback to using the processed authors array
      if (proposal.authors && Array.isArray(proposal.authors) && proposal.authors.length > 0) {
        // Group by author_type
        const authorsByType = proposal.authors.reduce((acc, author) => {
          const type = author.author_type || 'Unknown';
          if (!acc[type]) acc[type] = [];
          acc[type].push(author);
          return acc;
        }, {} as Record<string, typeof proposal.authors>);
        
        // Prefer Grupo authors, then Outro authors
        if (authorsByType['Grupo']?.length > 0) {
          return authorsByType['Grupo']
            .map(a => a.name || "")
            .filter(Boolean)
            .join(", ");
        } else if (authorsByType['Outro']?.length > 0) {
          return authorsByType['Outro']
            .map(a => a.name || "")
            .filter(Boolean)
            .join(", ");
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
              <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-white/80">
                <div className="flex items-center">
                  <FileText className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="truncate">{formattedProposal.descType || formattedProposal.type}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="truncate">{firstPhaseDate}</span>
                </div>
                <div className="flex items-center">
                  <Users className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="truncate">
                    {(() => {
                      // First check if IniAutorDeputados exists
                      if (proposal.IniAutorDeputados && Array.isArray(proposal.IniAutorDeputados)) {
                        const count = proposal.IniAutorDeputados.length;
                        return `${count} autor${count !== 1 ? 'es' : ''}`;
                      }
                      // If no deputies, check IniAutorOutros
                      else if (proposal.IniAutorOutros) {
                        // Handle both array and single object formats
                        const count = Array.isArray(proposal.IniAutorOutros) 
                          ? proposal.IniAutorOutros.length 
                          : 1;
                        return `${count} autor${count !== 1 ? 'es' : ''}`;
                      }
                      // Fallback to the processed authors array
                      else {
                        const count = formattedProposal.authors.length;
                        return `${count} autor${count !== 1 ? 'es' : ''}`;
                      }
                    })()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white dark:bg-slate-900 border-b">
          <div className="container py-3 md:py-4">
            <div className="flex flex-col gap-3">
              {/* Mobile Layout */}
              <div className="block md:hidden">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-medium text-foreground">Progresso</span>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-5 w-5 text-muted-foreground hover:text-foreground">
                          <Info className="h-3 w-3" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-[calc(100vw-2rem)] w-full sm:max-w-lg mx-auto">
                        <DialogHeader>
                          <DialogTitle>Como é calculado o progresso?</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            O progresso é calculado com base na fase atual do processo parlamentar:
                          </p>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-700">
                              <span className="text-sm font-medium">0-15%</span>
                              <span className="text-sm text-muted-foreground">Fases iniciais</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-700">
                              <span className="text-sm font-medium">15-40%</span>
                              <span className="text-sm text-muted-foreground">Discussão na generalidade</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-700">
                              <span className="text-sm font-medium">40-70%</span>
                              <span className="text-sm text-muted-foreground">Especialidade</span>
                            </div>
                            <div className="flex justify-between pt-2">
                              <span className="text-sm font-medium">70-100%</span>
                              <span className="text-sm text-muted-foreground">Fases finais</span>
                            </div>
                          </div>

                          <p className="text-xs text-muted-foreground border-t border-slate-200 dark:border-slate-700 pt-3">
                            Baseado na fase mais avançada do sistema parlamentar oficial.
                          </p>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <div className="text-lg font-bold text-foreground">{progressInfo.percentage}%</div>
                </div>
                <div className="relative">
                  <Progress value={progressInfo.percentage} className="h-2 [&>div]:rounded-none rounded-none" />
                  {/* Visual anchor bars */}
                  <div className="absolute -top-1 left-0 w-0.5 h-4 bg-slate-400"></div>
                  <div className="absolute -top-1 right-0 w-0.5 h-4 bg-slate-400"></div>
                </div>
                <div className="text-xs text-muted-foreground text-center mt-2 mb-2">
                  {progressInfo.currentPhase}
                </div>
                <div className="flex justify-between text-xs">
                  <div className="text-center">
                    <div className="text-muted-foreground">Apresentação</div>
                  </div>
                  <div className="text-center">
                    <div className="text-muted-foreground">Publicação</div>
                  </div>
                </div>
              </div>

              {/* Desktop Layout */}
              <div className="hidden md:block">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-foreground">Fase atual</span>
                    <span className="text-sm text-muted-foreground">
                      {progressInfo.currentPhase}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-foreground">{progressInfo.percentage}%</div>
                    <div className="text-sm text-muted-foreground">concluído</div>
                  </div>
                </div>
                <div className="relative">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="cursor-help">
                          <Progress value={progressInfo.percentage} className="h-3 [&>div]:rounded-none rounded-none" />
                          {/* Visual anchor bars */}
                          <div className="absolute -top-1 left-0 w-0.5 h-5 bg-slate-400"></div>
                          <div className="absolute -top-1 right-0 w-0.5 h-5 bg-slate-400"></div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <div className="space-y-3">
                          <p className="text-xs font-medium">Como é calculado o progresso?</p>
                          <p className="text-xs text-muted-foreground">
                            O progresso é calculado com base na fase atual do processo parlamentar:
                          </p>
                          <div className="space-y-1">
                            <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                              <span className="text-xs font-medium">0-15%</span>
                              <span className="text-xs text-muted-foreground">Fases iniciais</span>
                            </div>
                            <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                              <span className="text-xs font-medium">15-40%</span>
                              <span className="text-xs text-muted-foreground">Discussão na generalidade</span>
                            </div>
                            <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                              <span className="text-xs font-medium">40-70%</span>
                              <span className="text-xs text-muted-foreground">Especialidade</span>
                            </div>
                            <div className="flex justify-between pt-1">
                              <span className="text-xs font-medium">70-100%</span>
                              <span className="text-xs text-muted-foreground">Fases finais</span>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground border-t border-slate-200 dark:border-slate-700 pt-2">
                            Baseado na fase mais avançada do sistema parlamentar oficial.
                          </p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="flex justify-between mt-3">
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground">Apresentação</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground">Publicação</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="bg-white dark:bg-slate-900 border-b sticky top-16 z-20">
          <div className="container py-2">
            <div className="flex justify-between items-center">
              <SmartBackButton />
              <div className="flex items-center gap-2">
                <ShareButton 
                  url={`https://veto.pt/propostas/${formattedProposal.id}`}
                  title={formattedProposal.title}
                  className="gap-1"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2">
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
              <ProposalSidebar 
                proposal={formattedProposal}
                authors={formattedProposal.authors}
                IniAutorDeputados={proposal.IniAutorDeputados}
                IniAutorGruposParlamentares={proposal.IniAutorGruposParlamentares}
                IniAutorOutros={proposal.IniAutorOutros}
              />

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
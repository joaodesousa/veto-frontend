import Link from "next/link"
import { ArrowLeft, ChevronRight } from "lucide-react"
import { notFound } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { getProposalForId } from "@/lib/server-api"
import { formatProposalData } from "../utils/formatters"
import { ProposalHeader } from "../[external_id]/components/ProposalHeader"
import { ProposalTabs } from "../[external_id]/components/ProposalTabs"
import { ProposalSidebar } from "../[external_id]/components/ProposalSidebar"

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
        url: `/api/og?title=${encodeURIComponent(proposal.title)}&subtitle=${encodeURIComponent(`${proposal.type}`)}`,
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
            <span className="text-foreground font-medium">{formattedProposal.number}</span>
          </div>

          {/* Back Button */}
          <Button variant="ghost" size="sm" className="w-fit" asChild>
            <Link href="/propostas">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar às Propostas
            </Link>
          </Button>

          {/* Header */}
          <ProposalHeader proposal={formattedProposal} />

          <Separator />

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              <ProposalTabs proposal={formattedProposal} />
            </div>

            {/* Right Column */}
            <ProposalSidebar proposal={formattedProposal} />
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error(`Error loading proposal ${params.external_id}:`, error);
    notFound();
  }
}
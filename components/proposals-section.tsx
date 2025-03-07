// components/proposals-section.tsx
"use client"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProposalCard } from "@/components/proposal-card"
import { Proposal } from "@/lib/types"

interface ProposalsSectionProps {
  proposals: Proposal[]
}

export function ProposalsSection({ proposals }: ProposalsSectionProps) {
  return (
    <section className="w-full py-12 md:py-16 ">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              Encontre Propostas Legislativas
            </h2>
            <p className="max-w-[700px] text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Pesquise e filtre propostas partido, estado ou data
            </p>
          </div>
        </div>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {proposals.map((proposal) => {
              // Process proposal data...
              const latestPhase = proposal.phases && Array.isArray(proposal.phases) && proposal.phases.length > 0
                ? proposal.phases[proposal.phases.length - 1]
                : null;
              
              const phaseDisplay = latestPhase 
                ? (typeof latestPhase === 'string' ? latestPhase : (latestPhase.name || 'Sem estado'))
                : 'Sem estado';
              
              let partyDisplay = "Desconhecido";
              if (proposal.authors && Array.isArray(proposal.authors)) {
                const partyAuthor = proposal.authors.find(a => 
                  a && typeof a === 'object' && a.author_type === "Grupo"
                );
                
                if (partyAuthor) {
                  partyDisplay = typeof partyAuthor.name === 'string' ? partyAuthor.name : "Desconhecido";
                } else {
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
  )
}
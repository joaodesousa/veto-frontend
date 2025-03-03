import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProposalAbout } from "./ProposalAbout"
import { ProposalTimeline } from "./ProposalTimeline"
import { ProposalVoting } from "./ProposalVoting"
import { ProposalDocuments } from "./ProposalDocuments"

// Define an interface for the proposal prop
interface ProposalTabsProps {
  proposal: {
    description: string;
    timeline: any[];
    votes: any;
    documents: any[];
  }
}

export function ProposalTabs({ proposal }: ProposalTabsProps) {
  return (
    <>
      <ProposalAbout description={proposal.description} />

      <Tabs defaultValue="timeline">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="timeline">Cronologia</TabsTrigger>
          <TabsTrigger value="voting">Votação</TabsTrigger>
          <TabsTrigger value="documents">Documentos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="timeline" className="mt-4">
          <ProposalTimeline timeline={proposal.timeline} />
        </TabsContent>
        
        <TabsContent value="voting" className="mt-4">
          <ProposalVoting votes={proposal.votes} />
        </TabsContent>
        
        <TabsContent value="documents" className="mt-4">
          <ProposalDocuments documents={proposal.documents} />
        </TabsContent>
      </Tabs>
    </>
  )
}
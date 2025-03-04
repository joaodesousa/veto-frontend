import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProposalAbout } from "./ProposalAbout"
import { ProposalTimeline } from "./ProposalTimeline"
import { ProposalVoting } from "./ProposalVoting"
import { ProposalDocuments } from "./ProposalDocuments"

// Define an interface for the proposal prop
interface TimelineItem {
  date: string;
  title: string;
  description: string;
}

interface VotesData {
  favor: number;
  against: number;
  abstention: number;
  parties: { [key: string]: "favor" | "against" | "abstention" };
  allVotes: number;
  result: string;
  date: string;
}

interface DocumentItem {
  title: string;
  type: string;
  date: string;
  url: string;
}

interface ProposalTabsProps {
  proposal: {
    description: string;
    timeline: TimelineItem[];
    votes: VotesData & { hasVotes?: boolean };
    documents: DocumentItem[];
  }
}

export function ProposalTabs({ proposal }: ProposalTabsProps) {
  return (
    <>
      {/* <ProposalAbout description={proposal.description || 'Sem descrição disponível'} /> */}

      <Tabs defaultValue="timeline" className="mt-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="timeline">Cronologia</TabsTrigger>
          <TabsTrigger value="voting">Votação</TabsTrigger>
          <TabsTrigger value="documents">Documentos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="timeline" className="mt-4">
          <ProposalTimeline timeline={proposal.timeline} />
        </TabsContent>
        
        <TabsContent value="voting" className="mt-4">
          <ProposalVoting votes={{ ...proposal.votes, allVotes: [] }} />
        </TabsContent>
        
        <TabsContent value="documents" className="mt-4">
          <ProposalDocuments documents={proposal.documents} />
        </TabsContent>
      </Tabs>
    </>
  )
}
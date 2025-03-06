// app/propostas/[external_id]/components/ProposalTabs.tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProposalAbout } from "./ProposalAbout"
import { ProposalTimeline } from "./ProposalTimeline"
import { ProposalVoting } from "./ProposalVoting"
import { ProposalDocuments } from "./ProposalDocuments"
import { Phase, TimelineItem } from "@/lib/types"

// Define the types for the ProposalTabs component props
interface VotesData {
  favor: number;
  against: number;
  abstention: number;
  parties: { [key: string]: "favor" | "against" | "abstention" };
  allVotes: Array<{
    favor: number;
    against: number;
    abstention: number;
    parties: { [key: string]: "favor" | "against" | "abstention" };
    result: string;
    date: string;
    description?: string;
  }>;
  result: string;
  date: string;
  hasVotes?: boolean;
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
    timeline?: TimelineItem[]; // Pre-processed timeline with subitems
    phases?: Phase[];         // Raw phases data (optional)
    votes: VotesData;
    documents: DocumentItem[];
  }
}

export function ProposalTabs({ proposal }: ProposalTabsProps) {
  return (
    <>
      <Tabs defaultValue="timeline" className="mt-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="timeline">Cronologia</TabsTrigger>
          <TabsTrigger value="voting">Votação</TabsTrigger>
          <TabsTrigger value="documents">Documentos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="timeline" className="mt-4">
          <ProposalTimeline 
            timeline={proposal.timeline} 
            phases={proposal.phases}
          />
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
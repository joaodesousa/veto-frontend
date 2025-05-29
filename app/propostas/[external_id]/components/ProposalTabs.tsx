// app/propostas/[external_id]/components/ProposalTabs.tsx
"use client";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProposalAbout } from "./ProposalAbout"
import { ProposalTimeline } from "./ProposalTimeline"
import { EnhancedProposalVoting } from "./EnhancedProposalVoting"
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
  hasVotes: boolean;
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
    legislature?: number;     // Add legislature information
  }
}

export function ProposalTabs({ proposal }: ProposalTabsProps) {
  const [activeTab, setActiveTab] = useState("timeline");
  const [scrollToVoteId, setScrollToVoteId] = useState<string | undefined>();

  const handleVoteClick = (voteId: string) => {
    setScrollToVoteId(voteId);
    setActiveTab("voting");
  };

  // Convert legislature number to Roman numeral string
  const getLegislatureString = (legislature?: number): string => {
    if (!legislature) return "XV"; // Default to XV if not provided
    
    // Simple conversion to Roman numerals for common legislatures
    const romanNumerals: Record<number, string> = {
      13: "XIII",
      14: "XIV", 
      15: "XV",
      16: "XVI",
      17: "XVII"
    };
    
    return romanNumerals[legislature] || legislature.toString();
  };

  return (
    <>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="timeline">Cronologia</TabsTrigger>
          <TabsTrigger value="voting">Votação</TabsTrigger>
          <TabsTrigger value="documents">Documentos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="timeline" className="mt-4">
          <ProposalTimeline 
            timeline={proposal.timeline} 
            phases={proposal.phases}
            onVoteClick={handleVoteClick}
          />
        </TabsContent>
        
        <TabsContent value="voting" className="mt-4">
          <EnhancedProposalVoting 
            votes={proposal.votes} 
            scrollToVoteId={scrollToVoteId}
            legislature={getLegislatureString(proposal.legislature)}
          />
        </TabsContent>
        
        <TabsContent value="documents" className="mt-4">
          <ProposalDocuments documents={proposal.documents} />
        </TabsContent>
      </Tabs>
    </>
  )
}
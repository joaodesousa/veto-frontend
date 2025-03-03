// app/propostas/utils/formatters.ts
import { Proposal, Author, Phase, Vote, Attachment } from "@/lib/types";

export interface FormattedProposal {
  id: string;
  title: string;
  type: string;
  number: string;
  status: string;
  date: string;
  lastUpdate: string;
  party: string;
  description: string;
  authors: string[];
  deputies: { name: string; party?: string }[];
  timeline: { date: string; title: string; description: string }[];
  votes: {
    favor: number;
    against: number;
    abstention: number;
    parties: { [key: string]: "favor" | "against" | "abstention" };
    result: string;
    date: string;
    hasVotes: boolean;
    allVotes: Array<{
      favor: number;
      against: number;
      abstention: number;
      parties: { [key: string]: "favor" | "against" | "abstention" };
      result: string;
      date: string;
    }>;
  };
  documents: { title: string; type: string; date: string; url: string }[];
}

// Helper function to format dates consistently
const formatDate = (dateString: string): string => {
  try {
    return new Date(dateString).toLocaleDateString('pt-PT');
  } catch (e) {
    return dateString;
  }
};

// Helper function to format names in Title Case
const toTitleCase = (name: string): string => {
  return name.toLowerCase().split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Separate function to format author data
const formatAuthors = (authors: Author[] = []): {
  authorsList: string[];
  deputies: { name: string; party?: string }[];
  primaryParty: string;
} => {
  const authorsList = authors.map(author => 
    author.name ? toTitleCase(author.name) : ""
  );
  
  const deputies = authors
    .filter(author => author.author_type === "Deputado" || !author.author_type)
    .map(author => ({
      name: author.name ? toTitleCase(author.name) : "",
      party: author.party || undefined
    }));
  
  const primaryParty = authors.find(author => author.author_type === "Grupo")?.name || "Desconhecido";
  
  return { authorsList, deputies, primaryParty };
};

// Separate function to format timeline data
const formatTimeline = (phases: Phase[] = [], proposalDate: string): {
  timeline: { date: string; title: string; description: string }[];
  status: string;
  lastUpdate: string;
} => {
  const timeline = phases.map(phase => ({
    date: formatDate(phase.date),
    title: phase.name,
    description: `Fase: ${phase.name}`,
  }));
  
  const status = phases.length > 0 
    ? phases[phases.length - 1].name 
    : "Em Processamento";
    
  const lastUpdate = phases.length > 0 
    ? formatDate(phases[phases.length - 1].date) 
    : formatDate(proposalDate);
    
  return { timeline, status, lastUpdate };
};

// Separate function to process vote data
const formatVotes = (votes: Vote[] = []): FormattedProposal['votes'] => {
  const voteData: FormattedProposal['votes'] = {
    favor: 0,
    against: 0,
    abstention: 0,
    parties: {},
    result: "",
    date: "",
    hasVotes: false,
    allVotes: []
  };
  
  if (!votes.length) return voteData;
  
  voteData.hasVotes = true;
  
  // Format all votes for history display
  voteData.allVotes = votes.map(vote => {
    const voteInfo = {
      favor: vote.votes?.a_favor?.length || 0,
      against: vote.votes?.contra?.length || 0,
      abstention: vote.votes?.abstencao?.length || 0,
      parties: {} as { [key: string]: "favor" | "against" | "abstention" },
      result: vote.result || "",
      date: vote.date ? formatDate(vote.date) : ""
    };
    
    // Process party votes
    if (vote.votes) {
      (vote.votes.a_favor || []).forEach(party => {
        voteInfo.parties[party] = "favor";
      });
      
      (vote.votes.contra || []).forEach(party => {
        voteInfo.parties[party] = "against";
      });
      
      (vote.votes.abstencao || []).forEach(party => {
        voteInfo.parties[party] = "abstention";
      });
    }
    
    return voteInfo;
  });
  
  // If we have votes, set the main vote object to the most recent vote
  if (voteData.allVotes.length > 0) {
    const latestVote = voteData.allVotes[0];
    voteData.favor = latestVote.favor;
    voteData.against = latestVote.against;
    voteData.abstention = latestVote.abstention;
    voteData.parties = latestVote.parties;
    voteData.result = latestVote.result;
    voteData.date = latestVote.date;
  }
  
  return voteData;
};

// Separate function to format documents
const formatDocuments = (
  attachments: Attachment[] = [], 
  publicationUrl: string | null = null, 
  publicationDate: string | null = null
): FormattedProposal['documents'] => {
  const documents = [
    // Attachments
    ...attachments.map(attachment => ({
      title: attachment.name,
      type: "PDF",
      date: formatDate(new Date().toISOString()),
      url: attachment.file_url,
    })),
    
    // Publication (if available)
    ...(publicationUrl ? [{
      title: "Publicação",
      type: "PDF",
      date: publicationDate ? formatDate(publicationDate) : formatDate(new Date().toISOString()),
      url: publicationUrl,
    }] : []),
  ];
  
  return documents;
};

// Main formatter function with improved modularity
export function formatProposalData(proposal: Proposal): FormattedProposal {
  // Handle the id conversion safely, ensuring it's treated as a string
  const id = String(proposal.id);
  
  // Format authors data
  const { authorsList, deputies, primaryParty } = formatAuthors(proposal.authors);
  
  // Format timeline data
  const { timeline, status, lastUpdate } = formatTimeline(proposal.phases, proposal.date);
  
  // Format votes data
  const votes = formatVotes(proposal.votes);
  
  // Format documents data
  const documents = formatDocuments(
    proposal.attachments, 
    proposal.publication_url, 
    proposal.publication_date
  );
  
  return {
    id,
    title: proposal.title,
    type: proposal.type,
    number: `${proposal.type} ${proposal.external_id}`,
    status,
    date: formatDate(proposal.date),
    lastUpdate,
    party: primaryParty,
    description: proposal.description || "Sem descrição disponível",
    authors: authorsList,
    deputies,
    timeline,
    votes,
    documents,
  };
}
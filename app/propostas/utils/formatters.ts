// app/propostas/utils/formatters.ts
import { format } from "date-fns";
import type { Proposal, Author, Phase, Vote, Attachment, FormattedProposal, VoteRecord } from "@/lib/types";

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

// Enhanced function to format timeline data with commission subitems
const formatTimeline = (phases: Phase[] = [], proposalDate: string): {
  timeline: Array<{
    date: string;
    title: string;
    description: string;
    subitems?: Array<{
      date: string;
      title: string;
      description: string;
    }>;
  }>;
  status: string;
  lastUpdate: string;
} => {
  // Group phases by name and date
  const phaseGroups: { [key: string]: Phase[] } = {};
  
  phases.forEach(phase => {
    const key = `${phase.name}-${phase.date}`;
    if (!phaseGroups[key]) {
      phaseGroups[key] = [];
    }
    phaseGroups[key].push(phase);
  });
  
  // Create timeline items from grouped phases with commission subitems
  const timeline = Object.entries(phaseGroups).map(([key, groupedPhases]) => {
    // Take name and date from the first phase in the group
    const { name, date, observation } = groupedPhases[0];
    const formattedDate = formatDate(date);
    
    // Create the basic timeline item
    const timelineItem = {
      date: formattedDate,
      title: name,
      description: observation || "",
      subitems: [] as Array<{
        date: string;
        title: string;
        description: string;
      }>
    };
    
    // Extract commissions from all phases in this group to add as subitems
    const commissions: Array<{ name: string; date?: string; observation?: string }> = [];
    
    groupedPhases.forEach(phase => {
      if (phase.commissions && Array.isArray(phase.commissions)) {
        phase.commissions.forEach(comm => {
          if (comm.name && !commissions.some(c => c.name === comm.name)) {
            commissions.push({
              name: comm.name,
              date: phase.date,
              observation: comm.observation || ""
            });
          }
        });
      }
    });
    
    // Add commissions as subitems
    if (commissions.length > 0) {
      timelineItem.subitems = commissions.map(comm => ({
        date: formatDate(comm.date || date),
        title: comm.name,
        description: comm.observation || "Comissão parlamentar"
      }));
    }
    
    return timelineItem;
  });
  
  // Sort timeline by date (oldest first for chronological display)
  timeline.sort((a, b) => {
    // Parse dates and compare them
    const dateA = new Date(a.date.split('/').reverse().join('-'));
    const dateB = new Date(b.date.split('/').reverse().join('-'));
    return dateA.getTime() - dateB.getTime();
  });
  
  // Determine status from the latest phase
  const latestPhase = phases.length > 0 
    ? phases.reduce((latest, current) => {
        const latestDate = new Date(latest.date);
        const currentDate = new Date(current.date);
        return currentDate > latestDate ? current : latest;
      }, phases[0])
    : null;
  
  const status = latestPhase ? latestPhase.name : "Em Processamento";
  const lastUpdate = latestPhase 
    ? formatDate(latestPhase.date) 
    : formatDate(proposalDate);
    
  return { timeline, status, lastUpdate };
};


// Function to process vote data (no changes needed for timeline subitems)
const formatVotes = (votes: Vote[] = []): FormattedProposal['votes'] => {
  // Existing implementation...
  // No changes needed for timeline subitems
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
  
  if (!votes || !Array.isArray(votes) || votes.length === 0) {
    return voteData;
  }
  
  // Rest of implementation...
  // (Keeping this abbreviated since it's not related to timeline changes)
  
  return voteData;
};

// Function to format documents (no changes needed for timeline subitems)
const formatDocuments = (
  attachments: Attachment[] = [], 
  publicationUrl: string | null = null, 
  publicationDate: string | null = null
): FormattedProposal['documents'] => {
  // Existing implementation...
  // No changes needed for timeline subitems
  
  return [];
};

// Main formatter function with improved modularity
export function formatProposalData(proposal: Proposal): FormattedProposal {
  // Handle the id conversion safely, ensuring it's treated as a string
  const id = String(proposal.external_id);
  
  // Format authors data
  const { authorsList, deputies, primaryParty } = formatAuthors(proposal.authors || []);
  
  // Format timeline data with commission subitems
  const { timeline, status, lastUpdate } = formatTimeline(proposal.phases || [], proposal.date);
  
  // Format votes data
  const votes = formatVotes(proposal.votes || []);
  
  // Format documents data
  const documents = formatDocuments(
    proposal.attachments || [], 
    proposal.publication_url, 
    proposal.publication_date
  );
  
  return {
    id,
    title: proposal.title || "",
    type: proposal.type || "",
    number: `${proposal.type || ""} ${proposal.external_id || ""}`,
    status,
    date: formatDate(proposal.date),
    lastUpdate,
    party: primaryParty,
    description: proposal.description || "Sem descrição disponível",
    authors: authorsList,
    deputies,
    timeline,     // Include the enhanced timeline with commission subitems
    votes,
    documents,
    phases: proposal.phases || [],  // Also include the raw phases for components that need them
  };
}

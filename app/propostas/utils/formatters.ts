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
// Function to process vote data
const formatVotes = (votes: Vote[] = []): FormattedProposal['votes'] => {
  // Initialize the vote data structure
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
  
  // If no votes, return empty structure
  if (!votes || !Array.isArray(votes) || votes.length === 0) {
    return voteData;
  }

  // Mark that we have votes
  voteData.hasVotes = true;
  
  // Process all votes and create individual vote records
  voteData.allVotes = votes.map(vote => {
    const voteRecord: VoteRecord = {
      favor: 0,
      against: 0,
      abstention: 0,
      parties: {},
      result: vote.result || "",
      date: vote.date ? formatDate(vote.date) : "",
      description: vote.description || ""
    };
    
    // Process party votes from the 'votes' object if it exists
    if (vote.votes) {
      // Count parties voting in favor
      if (vote.votes.a_favor && Array.isArray(vote.votes.a_favor)) {
        voteRecord.favor = vote.votes.a_favor.length;
        vote.votes.a_favor.forEach(party => {
          voteRecord.parties[party] = "favor";
        });
      }
      
      // Count parties voting against
      if (vote.votes.contra && Array.isArray(vote.votes.contra)) {
        voteRecord.against = vote.votes.contra.length;
        vote.votes.contra.forEach(party => {
          voteRecord.parties[party] = "against";
        });
      }
      
      // Count parties abstaining
      if (vote.votes.abstencao && Array.isArray(vote.votes.abstencao)) {
        voteRecord.abstention = vote.votes.abstencao.length;
        vote.votes.abstencao.forEach(party => {
          voteRecord.parties[party] = "abstention";
        });
      }
      
      // Handle unanimous votes
      if (vote.votes.unanime === "unanime" || vote.unanimous === "unanime") {
        voteRecord.parties = { "Todos os partidos": "favor" };
        voteRecord.favor = 1;
      }
    }
    
    return voteRecord;
  });
  
  // If we have vote records, use the most recent one as the main vote data
  if (voteData.allVotes.length > 0) {
    const mainVote = voteData.allVotes[voteData.allVotes.length - 1];
    voteData.favor = mainVote.favor;
    voteData.against = mainVote.against;
    voteData.abstention = mainVote.abstention;
    voteData.parties = mainVote.parties;
    voteData.result = mainVote.result;
    voteData.date = mainVote.date;
  }
  
  return voteData;
};

// Function to extract documents from phases
const extractDocumentsFromPhases = (phases: Phase[] = []): FormattedProposal['documents'] => {
  const documents: FormattedProposal['documents'] = [];
  
  if (!phases || !Array.isArray(phases) || phases.length === 0) {
    return documents;
  }
  
  // Iterate through each phase
  phases.forEach(phase => {
    // Check if the phase has commissions
    if (phase.commissions && Array.isArray(phase.commissions)) {
      // Iterate through each commission
      phase.commissions.forEach(commission => {
        // Check if the commission has documents
        if (commission.documents && Array.isArray(commission.documents)) {
          // Add each document to our list
          commission.documents.forEach(doc => {
            if (doc.url) {
              documents.push({
                title: doc.title || `Documento da ${commission.name || 'Comissão'}`,
                type: doc.document_type || 'Documento',
                date: doc.date ? formatDate(doc.date) : '',
                url: doc.url
              });
            }
          });
        }
      });
    }
  });
  
  return documents;
}

// Function to format documents (no changes needed for timeline subitems)
// Function to format documents
const formatDocuments = (
  attachments: Attachment[] = [], 
  publicationUrl: string | null = null, 
  publicationDate: string | null = null,
  phases: Phase[] = []
): FormattedProposal['documents'] => {
  let documents: FormattedProposal['documents'] = [];
  
  // Process publication URL if available
  if (publicationUrl) {
    documents.push({
      title: "Publicação Oficial",
      type: "Publicação",
      date: publicationDate ? formatDate(publicationDate) : formatDate(new Date().toISOString()),
      url: publicationUrl
    });
  }
  
  // Process attachments if available
  if (attachments && Array.isArray(attachments) && attachments.length > 0) {
    attachments.forEach(attachment => {
      if (attachment.url) {
        documents.push({
          title: attachment.name || "Anexo",
          type: "Anexo",
          date: "", // Attachments might not have dates
          url: attachment.url || attachment.file_url || ""
        });
      }
    });
  }
  
  // Extract documents from phases
  const phaseDocuments = extractDocumentsFromPhases(phases);
  documents = [...documents, ...phaseDocuments];
  
  // Sort documents by date (newest first, if dates available)
  documents.sort((a, b) => {
    if (!a.date) return 1;  // Items without dates go to the end
    if (!b.date) return -1; // Items without dates go to the end
    
    return new Date(b.date.split('/').reverse().join('-')).getTime() - 
           new Date(a.date.split('/').reverse().join('-')).getTime();
  });
  
  return documents;
}

// Main formatter function with improved modularity
export function formatProposalData(proposal: Proposal): FormattedProposal {
  // Handle the id conversion safely, ensuring it's treated as a string
  const id = String(proposal.external_id);
  
  // Format authors data
  const { authorsList, deputies, primaryParty } = formatAuthors(proposal.authors || []);
  
  // Format timeline data with commission subitems
  const { timeline, status, lastUpdate } = formatTimeline(proposal.phases || [], proposal.date);
  
  // Format votes data - make sure to pass the actual votes array
  const votes = formatVotes(proposal.votes || []);
  
  // Format documents data
  const documents = formatDocuments(
    proposal.attachments || [], 
    proposal.publication_url, 
    proposal.publication_date,
    proposal.phases || []
  );
  
  // Include related proposals if available
  const relatedProposals = proposal.related_proposals || [];
  
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
    timeline,
    votes,
    documents,
    phases: proposal.phases || [],
    relatedProposals,
    textLink: proposal.text_link || null, 
  };
}
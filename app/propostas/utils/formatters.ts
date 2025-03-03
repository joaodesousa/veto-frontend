// Define interfaces for the input and output types
interface Author {
  name?: string;
  party?: string | null;
  author_type?: string;
}

interface Phase {
  date: string;
  name: string;
}

interface Vote {
  date?: string | null;
  result?: string;
  details?: string | null;
  votes?: {
    a_favor?: string[];
    contra?: string[];
    abstencao?: string[];
  };
}

interface Attachment {
  name: string;
  file_url: string;
}

interface Proposal {
  id: string | number;
  title: string;
  type: string;
  external_id: string;
  date: string;
  description?: string;
  party: string;
  phases?: Phase[];
  authors?: Author[];
  votes?: Vote[];
  attachments?: Attachment[];
  publication_url?: string | null;
  publication_date?: string | null;
}

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
  deputies: {name: string; party?: string}[];
  timeline: {date: string; title: string; description: string}[];
  votes: {
    favor: number;
    against: number;
    abstention: number;
    parties: { [key: string]: "favor" | "against" | "abstention" };
  };
  documents: {title: string; type: string; date: string; url: string}[];
}

// Format proposal data for UI display
export function formatProposalData(proposal: Proposal): FormattedProposal {
  // Convert id to string if it's a number
  const id = typeof proposal.id === 'number' ? proposal.id.toString() : proposal.id;
  
  // Format authors' names (from name case to Title Case)
  const authors = proposal.authors?.map(author => 
    author.name ? author.name.toLowerCase().split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ') : ""
  ) || [];
  
  // Extract deputies (authors with type "Deputado" or no type specified)
  const deputies = proposal.authors?.filter(author => 
    author.author_type === "Deputado" || !author.author_type
  ).map(author => ({
    name: author.name ? author.name.toLowerCase().split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ') : "",
    party: author.party || undefined
  })) || [];
  
  // Create timeline from phases
  const timeline = proposal.phases?.map(phase => ({
    date: new Date(phase.date).toLocaleDateString('pt-PT'),
    title: phase.name,
    description: `Fase: ${phase.name}`,
  })) || [];
  
  // Get the most recent phase date
  const mostRecentPhaseDate = proposal.phases?.length 
    ? new Date(proposal.phases[proposal.phases.length - 1].date).toLocaleDateString('pt-PT')
    : new Date(proposal.date).toLocaleDateString('pt-PT');
  

// Process voting information
const votesCounts = {
  favor: 0,
  against: 0,
  abstention: 0,
  parties: {} as { [key: string]: "favor" | "against" | "abstention" },
  result: "",
  date: "",
  hasVotes: false,
  allVotes: [] as Array<{
    favor: number;
    against: number;
    abstention: number;
    parties: { [key: string]: "favor" | "against" | "abstention" };
    result: string;
    date: string;
  }>
};

  if (proposal.votes && proposal.votes.length > 0) {
    // Get the most recent vote (assuming votes are ordered chronologically)
    const latestVote = proposal.votes[0];
    
    // Set the result and date if available
    votesCounts.result = latestVote.result || "";
    votesCounts.date = latestVote.date ? new Date(latestVote.date).toLocaleDateString('pt-PT') : "";
    
    // Calculate vote counts from the votes object
    if (latestVote.votes) {
      votesCounts.favor = latestVote.votes.a_favor?.length || 0;
      votesCounts.against = latestVote.votes.contra?.length || 0;
      votesCounts.abstention = latestVote.votes.abstencao?.length || 0;
      
      // Process party votes
      (latestVote.votes.a_favor || []).forEach(party => {
        votesCounts.parties[party] = "favor" as const;
      });
      
      (latestVote.votes.contra || []).forEach(party => {
        votesCounts.parties[party] = "against" as const;
      });
      
      (latestVote.votes.abstencao || []).forEach(party => {
        votesCounts.parties[party] = "abstention" as const;
      });
    }
    
    // Process all votes for history
    votesCounts.allVotes = proposal.votes.map(vote => {
      const voteCount = {
        favor: vote.votes?.a_favor?.length || 0,
        against: vote.votes?.contra?.length || 0,
        abstention: vote.votes?.abstencao?.length || 0,
        parties: {} as { [key: string]: "favor" | "against" | "abstention" },
        result: vote.result || "",
        date: vote.date ? new Date(vote.date).toLocaleDateString('pt-PT') : ""
      };
      
      // Process party votes for this vote
      if (vote.votes) {
        (vote.votes.a_favor || []).forEach(party => {
          voteCount.parties[party] = "favor" as const;
        });
        
        (vote.votes.contra || []).forEach(party => {
          voteCount.parties[party] = "against" as const;
        });
        
        (vote.votes.abstencao || []).forEach(party => {
          voteCount.parties[party] = "abstention" as const;
        });
      }
      
      return voteCount;
    });
  }
  
  // Compile document list
  const documents = [
    // Attachments
    ...(proposal.attachments?.map(attachment => ({
      title: attachment.name,
      type: "PDF",
      date: new Date().toLocaleDateString('pt-PT'), // Default to current date if no date available
      url: attachment.file_url,
    })) || []),
    
    // Publication (if available)
    ...(proposal.publication_url ? [{
      title: "Publicação",
      type: "PDF",
      date: proposal.publication_date ? 
        new Date(proposal.publication_date).toLocaleDateString('pt-PT') : 
        new Date().toLocaleDateString('pt-PT'),
      url: proposal.publication_url,
    }] : []),
  ];
  
  return {
    id,
    title: proposal.title,
    type: proposal.type,
    number: `${proposal.type} ${proposal.external_id}`,
    status: proposal.phases?.length ? proposal.phases[proposal.phases.length - 1].name : "Em Processamento",
    date: new Date(proposal.date).toLocaleDateString('pt-PT'),
    lastUpdate: mostRecentPhaseDate,
    party: proposal.authors?.find(author => author.author_type === "Grupo")?.name || "Desconhecido",
    description: proposal.description || "Sem descrição disponível",
    authors,
    deputies,
    timeline,
    votes: votesCounts,
    documents,
  };
}
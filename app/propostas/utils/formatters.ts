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
  phases?: Phase[];
  authors?: Author[];
  votes?: Vote[];
  attachments?: Attachment[];
  publication_url?: string | null;
  publication_date?: string | null;
}

interface FormattedProposal {
  id: string;
  title: string;
  number: string;
  status: string;
  date: string;
  party: string;
  tags: { name: string }[];
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
  
  // Extract unique tags from type and author parties
  const tags = [
    proposal.type,
    ...(proposal.authors?.map(author => author.party).filter(Boolean) || [])
  ]
  .filter((value, index, self) => value && self.indexOf(value) === index)
  .map(tag => ({ name: tag as string }));
  
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
  
  // Process voting information
  const votesCounts = {
    favor: 0,
    against: 0,
    abstention: 0,
    parties: {} as { [key: string]: "favor" | "against" | "abstention" }
  };
  
  if (proposal.votes && proposal.votes.length > 0) {
    // Calculate vote counts
    votesCounts.favor = proposal.votes.reduce((count, vote) => 
      count + (vote.votes?.a_favor?.length || 0), 0);
    
    votesCounts.against = proposal.votes.reduce((count, vote) => 
      count + (vote.votes?.contra?.length || 0), 0);
    
    votesCounts.abstention = proposal.votes.reduce((count, vote) => 
      count + (vote.votes?.abstencao?.length || 0), 0);
    
    // Process party votes (from the first vote object)
    const firstVote = proposal.votes[0];
    if (firstVote?.votes) {
      (firstVote.votes.a_favor || []).forEach(party => {
        votesCounts.parties[party] = "favor" as const;
      });
      
      (firstVote.votes.contra || []).forEach(party => {
        votesCounts.parties[party] = "against" as const;
      });
      
      (firstVote.votes.abstencao || []).forEach(party => {
        votesCounts.parties[party] = "abstention" as const;
      });
    }
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
    number: `${proposal.type} ${proposal.external_id}`,
    status: proposal.phases?.[0]?.name || "Em Processamento",
    date: new Date(proposal.date).toLocaleDateString('pt-PT'),
    party: proposal.authors?.[0]?.party || "Desconhecido",
    tags,
    description: proposal.description || "Sem descrição disponível",
    authors,
    deputies,
    timeline,
    votes: votesCounts,
    documents,
  };
}
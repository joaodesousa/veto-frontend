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
  description?: string;
  authors: string[];
  deputies: {name: string; party?: string}[];
  timeline: {date: string; title: string; description: string}[];
  votes: {
    favor: number;
    against: number;
    abstention: number;
    parties: Record<string, string>;
  };
  documents: {title: string; type: string; date: string; url: string}[];
}

// Use the Proposal interface directly instead of inline type
export function formatProposalData(proposal: Proposal): FormattedProposal {
  // Convert id to string if it's a number
  const id = typeof proposal.id === 'number' ? proposal.id.toString() : proposal.id;
  
  return {
    id: id,
    title: proposal.title,
    number: `${proposal.type} ${proposal.external_id}`,
    status: proposal.phases?.[0]?.name || "Em Processamento",
    date: new Date(proposal.date).toLocaleDateString('pt-PT'),
    party: proposal.authors?.[0]?.party || "Desconhecido",
    tags: [
      proposal.type,
      ...(proposal.authors?.map(author => author.party).filter(Boolean as any as (x: string | undefined) => x is string) || [])
    ].filter((tag, index, self) => tag && self.indexOf(tag) === index)
     .map(tag => ({ name: tag })), // Convert string[] to { name: string }[]
    description: proposal.description,
    authors: proposal.authors?.map(author => 
      // Convert to title case with proper handling of accented characters
      author.name ? author.name.toLowerCase().split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ') : ""
    ) || [],
    deputies: proposal.authors?.filter(author => 
      author.author_type === "Deputado" || !author.author_type
    ).map(author => ({
      name: author.name ? author.name.toLowerCase().split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ') : "",
      party: author.party
    })) || [],
    timeline: proposal.phases?.map(phase => ({
      date: new Date(phase.date).toLocaleDateString('pt-PT'),
      title: phase.name,
      description: `Fase: ${phase.name}`,
    })) || [],
    votes: {
      favor: proposal.votes?.reduce((count, vote) => 
        count + (vote.votes?.a_favor?.length || 0), 0) || 0,
      against: proposal.votes?.reduce((count, vote) => 
        count + (vote.votes?.contra?.length || 0), 0) || 0,
      abstention: proposal.votes?.reduce((count, vote) => 
        count + (vote.votes?.abstencao?.length || 0), 0) || 0,
      parties: proposal.votes?.[0]?.votes ? 
        Object.fromEntries([
          ...(proposal.votes[0].votes.a_favor || []).map(party => [party, "favor"]),
          ...(proposal.votes[0].votes.contra || []).map(party => [party, "against"]),
          ...(proposal.votes[0].votes.abstencao || []).map(party => [party, "abstention"]),
        ]) : {},
    },
    documents: [
      ...(proposal.attachments?.map(attachment => ({
        title: attachment.name,
        type: "PDF",
        date: new Date().toLocaleDateString('pt-PT'), // Attachment doesn't have date
        url: attachment.file_url,
      })) || []),
      ...(proposal.publication_url ? [{
        title: "Publicação",
        type: "PDF",
        date: proposal.publication_date ? 
          new Date(proposal.publication_date).toLocaleDateString('pt-PT') : 
          new Date().toLocaleDateString('pt-PT'),
        url: proposal.publication_url,
      }] : []),
    ],
  }
} 
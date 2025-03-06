// lib/types.ts

export interface Author {
  id: string;
  name?: string;
  party?: string | null;
  author_type?: string;
}

export interface Commission {
  id?: number;
  name: string;
  observation?: string;
  votes?: any[]; // Array of votes for this commission
  documents?: any[]; // Array of documents for this commission
}

export interface Phase {
  id: number;
  name: string;
  date: string;
  observation?: string;
  commissions?: Commission[];
}

export interface TimelineSubitem {
  date: string;
  title: string;
  description: string;
}

export interface TimelineItem {
  date: string;
  title: string;
  description: string;
  subitems?: TimelineSubitem[];
}

export interface VoteParties {
  contra: string[];
  a_favor: string[];
  abstencao: string[];
  unanime?: string;
  detalhe?: string;
}

export interface Vote {
  date: string | null;
  result: string;
  details: string | null;
  votes?: VoteParties;
  description?: string;
  unanimous?: string;
}

export interface VoteRecord {
  favor: number;
  against: number;
  abstention: number;
  parties: { [key: string]: "favor" | "against" | "abstention" };
  result: string;
  date: string;
  description?: string;
}

export interface Attachment {
  url: string;
  name: string;
  file_url: string;
}

export interface Document {
  title: string;
  type: string;
  date: string;
  url: string;
}

export interface RelatedProposal {
  id: string;
  title: string;
  type: string;
  number: string;
  date: string;
  external_id: string; // Added this field
}

export interface Proposal {
  id: number;
  title: string;
  type: string;
  legislature: number;
  date: string;
  link: string;
  authors: Author[];
  description: string;
  external_id: string;
  phases: Phase[];
  votes: Vote[];
  attachments: Attachment[];
  publication_url: string | null;
  publication_date: string | null;
  related_proposals?: RelatedProposal[]; // Raw API field name (typically snake_case)
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
  deputies: { name: string; party?: string }[];
  timeline: TimelineItem[];
  votes: {
    favor: number;
    against: number;
    abstention: number;
    parties: { [key: string]: "favor" | "against" | "abstention" };
    result: string;
    date: string;
    hasVotes: boolean;
    allVotes: VoteRecord[];
  };
  documents: Document[];
  phases: Phase[];
  relatedProposals?: RelatedProposal[]; // Properly defined for the formatted proposal
}

export interface ApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Proposal[];
}

export interface GroupedAuthors {
  [key: string]: Author[];
}

export interface PartyVote {
  party: string;
  vote: "A Favor" | "Contra" | "Abstenção";
}

export interface Item {
  id: number;
  external_id: string;
  title: string;
  type: string;
  date: string;
  phases: Phase[];
  authors: Author[];
  link: string;
}

export interface DashboardStats {
  total_proposals: number;
  total_votes: number;
  recent_votes: number;
  recent_proposals: number;
  proposals_this_year?: number;
  proposals_by_party?: Record<string, number>;
  party_with_most_proposals: string[];
  proposals_count_for_party: number;
}

export interface FilterState {
  types: string[];
  phases: string[];
  authors: string[];
  dateRange?: {
    from: Date;
    to?: Date;
  };
}
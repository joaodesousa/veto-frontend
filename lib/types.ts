// types.ts

export interface Author {
    name: string
    party: string | null
    author_type: string
  }
  
  export interface Phase {
    id: number
    name: string
    date: string
  }
  
  export interface VoteParties {
    contra: string[]
    a_favor: string[]
    abstencao: string[]
  }
  
  export interface Vote {
    date: string | null
    result: string
    details: string | null
    votes?: VoteParties
    description?: string
  }
  
  export interface Attachment {
    url: string
    name: string
    file_url: string
  }
  
  export interface Proposal {
    id: number
    title: string
    type: string
    legislature: number
    date: string
    link: string
    authors: Author[]
    description: string
    external_id: string
    phases: Phase[]
    votes: Vote[]
    attachments: Attachment[]
    publication_url: string | null
    publication_date: string | null
  }
  
  export interface ApiResponse {
    count: number
    next: string | null
    previous: string | null
    results: Proposal[]
  }
  
  export interface GroupedAuthors {
    [key: string]: Author[]
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
    date: string; // or Date, depending on your implementation
    phases: Phase[]; // Assuming Phase is another interface
    authors: Author[]; // Assuming Author is another interface
    link: string; // Add other properties as needed
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

  interface VoteRecord {
    // Define the properties of VoteRecord as needed
  }

  interface VotesData {
    favor: number;
    against: number;
    abstention: number;
    parties: { [key: string]: "favor" | "against" | "abstention" };
    allVotes: VoteRecord[];
    result: string;
    date: string;
  }
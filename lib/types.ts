// lib/types.ts

export interface Author {
  id: string;
  name: string;
  party?: string | null;
  author_type: string;
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
  observation: string;
  commissions: Commission[];
  votes: Vote[];
}

export interface TimelineSubitem {
  date: string;
  title: string;
  description: string;
  voteId?: string; // Add vote ID for linking to voting tab
  hasVote?: boolean; // Flag to indicate if this item has associated votes
}

export interface TimelineItem {
  date: string;
  title: string;
  description: string;
  subitems?: TimelineSubitem[];
  voteId?: string; // Add vote ID for linking to voting tab
  hasVote?: boolean; // Flag to indicate if this item has associated votes
}

export interface VoteParties {
  contra: string[];
  a_favor: string[];
  abstencao: string[];
  unanime?: string;
  detalhe?: string;
}

export interface ParsedVote {
  favor: string[];
  contra: string[];
  abstencao: string[];
  unanime: boolean;
  resultado: string;
}

export interface Vote {
  id: string;
  date: string;
  result: string;
  unanimous: boolean;
  absences: string;
  detail: string;
  description: string;
  publication: string;
  meeting: string;
  meetingType: string;
  votes?: VoteParties;
  parsedVote?: ParsedVote;
}

export interface VoteRecord {
  favor: number;
  against: number;
  abstention: number;
  parties: { [key: string]: "favor" | "against" | "abstention" };
  result: string;
  date: string;
  description?: string;
  phaseName?: string;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
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
  descType?: string;
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
  related_proposals?: RelatedProposal[];
  text_link: string | null;
  text_substitution: boolean;
  text_substitution_field: string | null;
  european_initiatives: any | null;
  origin_initiatives: any | null;
  derived_initiatives: any | null;
  links: any | null;
  petitions: any | null;
  amendment_proposals: any | null;
  IniAutorGruposParlamentares?: any | null;
  IniAutorOutros?: any | null;
  IniAutorDeputados?: Array<{ GP: string, idCadastro: string, nome: string }> | null;
}

export interface FormattedProposal {
  id: string;
  title: string;
  type: string;
  descType?: string;
  number: string;
  status: string;
  date: string;
  lastUpdate: string;
  party: string;
  description: string;
  authors: string[];
  deputies: { name: string; party?: string }[];
  timeline: Array<{
    date: string;
    title: string;
    description: string;
    subitems?: Array<{
      date: string;
      title: string;
      description: string;
    }>;
    voteId?: string;
    hasVote?: boolean;
  }>;
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
  relatedProposals?: RelatedProposal[];
  textLink: string | null;
}

export interface ApiResponse {
  data: Array<{
    _id: string;
    IniId: string;
    IniLeg: string;
    IniNr: string;
    IniTipo: string;
    IniDescTipo: string;
    IniTitulo: string;
    DataInicioleg: string;
    DataFimleg: string | null;
    IniAutorGruposParlamentares: Array<{ GP: string }> | null;
    IniAutorDeputados: Array<{ GP: string, idCadastro: string, nome: string }> | null;
    IniAutorOutros?: { 
      nome: string;
      sigla: string;
      iniAutorComissao: string | null;
    } | Array<{
      nome: string;
      sigla: string;
      iniAutorComissao: string | null;
    }> | null;
    IniEventos: Array<{
      EvtId: string;
      Fase: string;
      DataFase: string;
      CodigoFase: string;
      PublicacaoFase: string | null;
      _id: string;
      ObsFase: string | null;
      OevId: string;
      Comissao?: Array<{
        AccId: string;
        Competente: string;
        DataDistribuicao: string;
        IdComissao: string;
        Nome: string;
      }>;
    }>;
    IniLinkTexto: string;
    lastUpdated: string;
    createdAt: string;
    updatedAt: string;
  }>;
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
  filters: {
    types: string[];
    authors: string[];
    dateStart: string | null;
    dateEnd: string | null;
    updatedSince: string | null;
  };
  sort: {
    field: string;
    order: string;
  };
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
  legislaturas: string[];
  types: string[];
  phases: string[];
  authors: string[];
  parties: string[];
  dateRange?: {
    from: Date;
    to?: Date;
  };
}

export interface Legislatura {
  legislature: string;
  startDate: string;
  endDate: string | null;
  initiativeCount: number;
}
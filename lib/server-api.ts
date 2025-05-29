import { Proposal, ApiResponse, DashboardStats } from './types';

// Helper function to convert Roman numerals to numbers
function romanToNumber(roman: string | number): number {
  if (typeof roman === 'number') return roman;
  if (!roman || typeof roman !== 'string') return 0;
  
  const romanNumerals: Record<string, number> = {
    'XIII': 13,
    'XIV': 14,
    'XV': 15,
    'XVI': 16,
    'XVII': 17,
    'XVIII': 18
  };
  
  // Try exact match first
  if (romanNumerals[roman.toUpperCase()]) {
    return romanNumerals[roman.toUpperCase()];
  }
  
  // If it's already a number string, parse it
  const parsed = parseInt(roman);
  if (!isNaN(parsed)) {
    return parsed;
  }
  
  return 0;
}

/**
 * Fetch a proposal by its external ID - Server-side version with improved error handling
 */
export async function getProposalForId(externalId: string): Promise<Proposal | null> {
  try {
    const API_BASE_URL = process.env.API_BASE_URL || 'https://legis.veto.pt';
    
    // Use the new API endpoint for initiatives
    const url = `${API_BASE_URL}/api/iniciativas/${encodeURIComponent(externalId)}`;

    const response = await fetch(url, {
      headers: { 
        'Content-Type': 'application/json'
      },
      next: { revalidate: 60 } // Cache for 60 seconds
    });

    if (!response.ok) {
      console.error(`API error: ${response.status} - ${response.statusText}`);
      throw new Error(`API error: ${response.statusText}`);
    }

    const apiResponse = await response.json();
    
    // Extract the actual data from the nested structure
    const data = apiResponse.data;
    
    // Debug the IniDescTipo field
    console.log("API Response IniDescTipo:", data?.IniDescTipo);
    console.log("API Response IniTipo:", data?.IniTipo);
    
    // Check if data exists
    if (!data) {
      console.error("No data found in API response");
      return null;
    }
    
    // Map the API response to our Proposal type
    const proposal: Proposal = {
      id: parseInt(data.IniNr) || 0,
      title: data.IniTitulo || '',
      type: data.IniTipo || '',
      descType: data.IniDescTipo || '',
      legislature: romanToNumber(data.IniLeg),
      date: data.DataInicioleg || '',
      link: data.IniLinkTexto || '',
      // Process authors based on structure from api_struct.txt
      authors: [
        // Process parliamentary groups if available
        ...(data.IniAutorGruposParlamentares 
          ? Array.isArray(data.IniAutorGruposParlamentares) 
            ? data.IniAutorGruposParlamentares.map((author: { GP: string }) => ({
                id: author.GP || '',
                name: author.GP || '',
                party: author.GP || null,
                author_type: 'Grupo'
              }))
            : [] 
          : []),
        // Process other authors if available
        ...(data.IniAutorOutros 
          ? Array.isArray(data.IniAutorOutros)
            ? data.IniAutorOutros.map((author: { nome: string, sigla: string }) => ({
                id: author.sigla || '',
                name: author.nome || '',
                party: null,
                author_type: 'Outro'
              }))
            // Handle when IniAutorOutros is an object, not an array
            : data.IniAutorOutros ? [{
                id: data.IniAutorOutros.sigla || '',
                name: data.IniAutorOutros.nome || '',
                party: null,
                author_type: 'Outro'
              }] : []
          : [])
      ],
      description: data.IniTitulo || '',
      external_id: data.IniId || externalId,
      
      // Store the raw data for reference
      IniAutorGruposParlamentares: data.IniAutorGruposParlamentares || null,
      IniAutorOutros: data.IniAutorOutros || null,
      IniAutorDeputados: data.IniAutorDeputados || null,
      phases: data.IniEventos?.map((event: { 
        Fase?: string; 
        DataFase?: string; 
        ObsFase?: string;
        Comissao?: Array<{
          IdComissao?: string;
          Nome?: string;
        }>;
        Votacao?: Array<{
          data?: string;
          resultado?: string;
          unanime?: string;
          ausencias?: string;
          detalhe?: string;
          descricao?: string;
          id?: string;
          publicacao?: string;
          reuniao?: string;
          tipoReuniao?: string;
          parsedVote?: {
            favor: string[];
            contra: string[];
            abstencao: string[];
            unanime: boolean;
            resultado: string;
          };
        }>;
      }, index: number) => ({
        id: index,
        name: event.Fase || '',
        date: event.DataFase || '',
        observation: event.ObsFase || '',
        commissions: event.Comissao?.map((com: { IdComissao?: string; Nome?: string }) => ({
          id: parseInt(com.IdComissao || '0') || 0,
          name: com.Nome || ''
        })) || [],
        votes: event.Votacao?.map((vote: {
          data?: string;
          resultado?: string;
          unanime?: string;
          ausencias?: string;
          detalhe?: string;
          descricao?: string;
          id?: string;
          publicacao?: string;
          reuniao?: string;
          tipoReuniao?: string;
          parsedVote?: {
            favor: string[];
            contra: string[];
            abstencao: string[];
            unanime: boolean;
            resultado: string;
          };
        }) => ({
          id: vote.id || '',
          date: vote.data || '',
          result: vote.resultado || '',
          unanimous: vote.unanime === 'unanime',
          absences: vote.ausencias || '',
          detail: vote.detalhe || '',
          description: vote.descricao || '',
          publication: vote.publicacao || '',
          meeting: vote.reuniao || '',
          meetingType: vote.tipoReuniao || '',
          parsedVote: vote.parsedVote ? {
            favor: vote.parsedVote.favor || [],
            contra: vote.parsedVote.contra || [],
            abstencao: vote.parsedVote.abstencao || [],
            unanime: vote.parsedVote.unanime || false,
            resultado: vote.parsedVote.resultado || ''
          } : undefined
        })) || [],
      })) || [],
      votes: [],  // This will be populated from the phases' votes
      attachments: data.IniAnexos?.map((anexo: {
        anexoFich?: string;
        anexoNome?: string;
      }) => ({
        id: anexo.anexoFich || '',
        name: anexo.anexoNome || '',
        url: anexo.anexoFich || ''
      })) || [],
      publication_url: null,
      publication_date: null,
      text_link: data.IniLinkTexto || null,
      text_substitution: data.IniTextoSubst === 'SIM',
      text_substitution_field: data.IniTextoSubstCampo || null,
      european_initiatives: data.IniciativasEuropeias || null,
      origin_initiatives: data.IniciativasOrigem || null,
      derived_initiatives: data.IniciativasOriginadas || null,
      links: data.Links || null,
      petitions: data.Peticoes || null,
      amendment_proposals: data.PropostasAlteracao || null
    };
    
    // Flatten votes from all phases into the main votes array
    proposal.votes = proposal.phases.flatMap(phase => phase.votes);
    
    return proposal;
  } catch (error) {
    console.error("Error fetching proposal:", error);
    return null;
  }
}

/**
 * Fetch proposals for homepage - Server-side version
 */
export async function getHomePageProposals(limit: number = 4): Promise<{ proposals: Proposal[], totalCount: number }> {
  try {
    const API_BASE_URL = process.env.API_BASE_URL || 'https://legis.veto.pt';
    
    // Simple endpoint for latest proposals
    const url = `${API_BASE_URL}/api/iniciativas?limit=${limit}`;
    
    const response = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 300 } // Cache for 5 minutes
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    
    const data = await response.json() as ApiResponse;
    
    // Convert API initiatives to simplified Proposal objects - the API already sorts by latest
    const proposals = data.data && data.data.length > 0 
      ? data.data.slice(0, limit).map(item => ({
          id: parseInt(item.IniNr) || 0,
          title: item.IniTitulo || '',
          type: item.IniTipo || '',
          descType: item.IniDescTipo || '',
          legislature: romanToNumber(item.IniLeg),
          date: item.DataInicioleg || '',
          link: item.IniLinkTexto || '',
          // Store minimal author information
          authors: [],
          description: item.IniTitulo || '',
          external_id: item.IniId || '',
          // Keep it simple - we don't need full phase details for homepage cards
          phases: [{
            id: 0,
            name: item.IniEventos && item.IniEventos.length > 0 ? (item.IniEventos[0].Fase || 'Em processamento') : 'Em processamento',
            date: item.IniEventos && item.IniEventos.length > 0 ? (item.IniEventos[0].DataFase || item.DataInicioleg || '') : (item.DataInicioleg || ''),
            observation: '',
            commissions: [],
            votes: [],
          }],
          votes: [],
          attachments: [],
          publication_url: null,
          publication_date: null,
          text_link: item.IniLinkTexto || null,
          text_substitution: false,
          text_substitution_field: null,
          european_initiatives: null,
          origin_initiatives: null,
          derived_initiatives: null,
          links: null,
          petitions: null,
          amendment_proposals: null,
          // Store the raw author data for display
          IniAutorGruposParlamentares: item.IniAutorGruposParlamentares || null,
          IniAutorOutros: item.IniAutorOutros || null,
          IniAutorDeputados: item.IniAutorDeputados || null,
        }))
      : [];
    
    const totalCount = data.pagination?.total || 0; 
    
    return { proposals, totalCount };
    
  } catch (error) {
    console.error("Error fetching homepage proposals:", error);
    return { proposals: [], totalCount: 0 }; 
  }
}

/**
 * Fetches dashboard statistics from the API
 */
export async function getDashboardStatistics(): Promise<DashboardStats> {
  try {
    const API_BASE_URL = process.env.API_BASE_URL || 'https://legis.veto.pt';
    const url = `${API_BASE_URL}/dashboard/`;
    
    
    const response = await fetch(url, {
      next: { revalidate: 3600 } // Revalidate cache once per hour
    });
    
    if (!response.ok) {
      console.error(`API error: ${response.status} - ${response.statusText}`);
      throw new Error(`API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Calculate party with most proposals
    const proposalsByParty = data.proposals_by_party;
    const maxProposals = Math.max(...Object.values(proposalsByParty) as number[]);
    const partiesWithMostProposals = Object.keys(proposalsByParty).filter(party => proposalsByParty[party] === maxProposals);
    
    // Add the count of proposals for the party with the most proposals
    return {
      ...data,
      party_with_most_proposals: partiesWithMostProposals,
      proposals_count_for_party: maxProposals // New field for the count
    };
  } catch (error) {
    console.error("Error fetching dashboard statistics:", error);
    // Return default fallback values on error
    return {
      total_proposals: 0,
      total_votes: 0,
      proposals_this_year: 0,
      recent_votes: 0,
      recent_proposals: 0,
      proposals_by_party: {},
      party_with_most_proposals: [] as string[],
      proposals_count_for_party: 0
    };
  }
}

/**
 * Fetches dashboard statistics from the new API endpoint
 */
export async function getStats(): Promise<DashboardStats> {
  try {
    const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://legis.veto.pt';
    const url = `${API_BASE_URL}/api/stats`;
    
    const response = await fetch(url, {
      next: { revalidate: 3600 } // Revalidate cache once per hour
    });
    
    if (!response.ok) {
      console.error(`API error: ${response.status} - ${response.statusText}`);
      throw new Error(`API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Map the new API format to our DashboardStats type
    return {
      total_proposals: data.totalInitiatives || 0,
      total_votes: data.totalVotes || 0,
      recent_proposals: data.initiativesLastMonth || 0,
      recent_votes: 0, // This isn't provided in the new endpoint
      proposals_this_year: 0, // This isn't provided in the new endpoint
      proposals_by_party: {}, // This isn't provided directly
      party_with_most_proposals: data.partyWithMostProposals?.party ? [data.partyWithMostProposals.party] : [],
      proposals_count_for_party: data.partyWithMostProposals?.count || 0
    };
  } catch (error) {
    console.error("Error fetching statistics:", error);
    // Return default fallback values on error
    return {
      total_proposals: 0,
      total_votes: 0,
      proposals_this_year: 0,
      recent_votes: 0,
      recent_proposals: 0,
      proposals_by_party: {},
      party_with_most_proposals: [] as string[],
      proposals_count_for_party: 0
    };
  }
}
import { format } from "date-fns"
import type { DateRange } from "react-day-picker"
import type { ApiResponse, Author, Legislatura, DeputyStatsResponse, SeatsResponse } from "./types"

/**
 * Fetch initiatives with optional filtering
 */
export async function fetchItems(params: {
  page: number
  search: string
  types: string[]
  phases: string[]
  authors: string[]
  legislaturas: string[]
  dateRange: DateRange | undefined
}): Promise<ApiResponse> {
  try {
    const queryParams = new URLSearchParams({
      page: params.page.toString(),
      limit: '20',
      sort: 'lastUpdated',
      order: 'desc'
    });
    
    // Only add search parameter if it's not empty
    if (params.search) {
      queryParams.append('search', params.search);
    }

    if (params.types.length > 0) {
      queryParams.append('type', params.types.join(','));
    }

    const filteredPhases = params.phases.filter(phase => phase !== "Todas");
    if (filteredPhases.length > 0) {
      queryParams.append('phase', filteredPhases.join(','));
    }

    if (params.authors.length > 0) {
      queryParams.append('author', params.authors.join(','));
    }
    
    if (params.legislaturas.length > 0) {
      queryParams.append('legislatura', params.legislaturas.join(','));
    }

    if (params.dateRange?.from) {
      queryParams.append('dateStart', format(params.dateRange.from, "yyyy-MM-dd"));
    }
    if (params.dateRange?.to) {
      queryParams.append('dateEnd', format(params.dateRange.to, "yyyy-MM-dd"));
    }

    const API_BASE_URL = 'https://legis.veto.pt';
    const url = `${API_BASE_URL}/api/iniciativas?${queryParams.toString()}`;
    
    const response: Response = await fetch(url, {
      headers: { 
        'Content-Type': 'application/json',
      },
      next: { revalidate: 60 } // Cache for 60 seconds
    });
    
    if (!response.ok) {
      console.error(`API error: ${response.status} - ${response.statusText}`);
      throw new Error(`API error: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching initiatives:", error);
    throw error;
  }
}

/**
 * Fetch available types
 */
export async function fetchTypes(): Promise<string[]> {
  try {
    // Make a request to fetch types
    const response: Response = await fetch('https://legis.veto.pt/api/tipos', {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Handle different response structures
    let types: any[] = [];
    
    if (Array.isArray(data)) {
      // If response is directly an array
      types = data;
    } else if (data && data.data && Array.isArray(data.data)) {
      // If response has nested data property
      types = data.data;
    } else {
      console.error("Unexpected types data structure:", data);
      return [];
    }
    
    // Extract the descriptions or names from the types
    return types.map(type => type.description || type.name || '').filter(Boolean);
  } catch (error) {
    console.error("Error fetching types:", error);
    throw error;
  }
}

/**
 * Fetch initiative phases
 */
export async function fetchPhases(): Promise<string[]> {
  try {
    const response: Response = await fetch('https://legis.veto.pt/api/fases', {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Handle different response structures
    let phases: any[] = [];
    
    if (Array.isArray(data)) {
      // If response is directly an array
      phases = data;
    } else if (data && data.data && Array.isArray(data.data)) {
      // If response has nested data property
      phases = data.data;
    } else {
      console.error("Unexpected data structure for phases:", data);
      return [];
    }
    
    // Extract phase names/values and filter out empty ones
    return phases.map(phase => {
      if (typeof phase === 'string') return phase;
      return phase.name || phase.phase || phase.description || '';
    }).filter(Boolean);
  } catch (error) {
    console.error("Error fetching phases:", error);
    throw error;
  }
}

/**
 * Fetch available authors (categories of initiative authors)
 */
export async function fetchAuthors(): Promise<Author[]> {
  try {
    const response: Response = await fetch('https://legis.veto.pt/api/autores', {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Handle different response structures
    let authors: any[] = [];
    
    if (Array.isArray(data)) {
      // If response is directly an array
      authors = data;
    } else if (data && data.data && Array.isArray(data.data)) {
      // If response has nested data property
      authors = data.data;
    } else {
      console.error("Unexpected authors data structure:", data);
      return [];
    }
    
    // Transform to match Author type
    return authors.map(author => ({
      id: author.code || String(Math.random()),
      name: author.name || '',
      author_type: 'author_category'
    }));
  } catch (error) {
    console.error("Error fetching authors:", error);
    throw error;
  }
}

/**
 * Fetch political parties
 */
export async function fetchParties(): Promise<Author[]> {
  try {
    const response: Response = await fetch('https://legis.veto.pt/api/partidos', {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Handle different response structures
    let parties: any[] = [];
    
    if (Array.isArray(data)) {
      // If response is directly an array
      parties = data;
    } else if (data && data.data && Array.isArray(data.data)) {
      // If response has nested data property
      parties = data.data;
    } else {
      console.error("Unexpected parties data structure:", data);
      return [];
    }
    
    // Transform to match Author type
    return parties.map((party: { sigla?: string; name?: string; count?: number }) => ({
      id: party.sigla || String(Math.random()),
      name: party.name || '',
      party: party.sigla || null,
      author_type: 'party'
    }));
  } catch (error) {
    console.error("Error fetching parties:", error);
    throw error;
  }
}

/**
 * Fetch legislature options
 */
export async function fetchLegislaturas(): Promise<Legislatura[]> {
  try {
    const response: Response = await fetch('https://legis.veto.pt/api/legislaturas', {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Handle different response structures
    let legislaturas: any[] = [];
    
    if (Array.isArray(data)) {
      // If response is directly an array
      legislaturas = data;
    } else if (data && data.data && Array.isArray(data.data)) {
      // If response has nested data property
      legislaturas = data.data;
    } else {
      console.error("Unexpected data structure for legislaturas:", data);
      return [];
    }
    
    return legislaturas.map((item: any) => ({
      legislature: item.legislature || '',
      startDate: item.startDate || '',
      endDate: item.endDate || null,
      initiativeCount: item.initiativeCount || 0
    }));
  } catch (error) {
    console.error("Error fetching legislaturas:", error);
    throw error;
  }
}

/**
 * Fetch proposals for the proposals page with comprehensive filtering
 */
export async function fetchProposals(params: {
  page?: number
  search?: string
  types?: string[]
  phases?: string[]
  authors?: string[]
  parties?: string[]
  legislaturas?: string[]
  dateRange?: DateRange
  orderBy?: string
}): Promise<ApiResponse> {
  try {
    const queryParams = new URLSearchParams({
      page: (params.page || 1).toString(),
      limit: '20',
      sort: params.orderBy || 'IniEventos.0.DataFase',
      order: 'desc'
    });
    
    if (params.search) {
      queryParams.append('search', params.search);
    }

    if (params.types && params.types.length > 0) {
      queryParams.append('type', params.types.join(','));
    }

    const filteredPhases = (params.phases || []).filter(phase => phase !== "Todas");
    if (filteredPhases.length > 0) {
      queryParams.append('phase', filteredPhases.join(','));
    }

    if (params.authors && params.authors.length > 0) {
      queryParams.append('author', params.authors.join(','));
    }
    
    if (params.parties && params.parties.length > 0) {
      queryParams.append('partido', params.parties.join(','));
    }
    
    if (params.legislaturas && params.legislaturas.length > 0) {
      queryParams.append('legislature', params.legislaturas.join(','));
    }

    if (params.dateRange?.from) {
      queryParams.append('dateStart', format(params.dateRange.from, "yyyy-MM-dd"));
    }
    if (params.dateRange?.to) {
      queryParams.append('dateEnd', format(params.dateRange.to, "yyyy-MM-dd"));
    }
    
    const API_BASE_URL = 'https://legis.veto.pt';
    const url = `${API_BASE_URL}/api/iniciativas?${queryParams.toString()}`;
    
    const response: Response = await fetch(url, {
      headers: { 
        'Content-Type': 'application/json',
      },
      next: { revalidate: 60 } // Cache for 60 seconds
    });
    
    if (!response.ok) {
      console.error(`API error: ${response.status} - ${response.statusText}`);
      throw new Error(`API error: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching proposals:", error);
    throw error;
  }
}

/**
 * Fetch deputy statistics for a specific legislature
 */
export async function fetchDeputyStats(legislature: string): Promise<DeputyStatsResponse> {
  try {
    const API_BASE_URL = 'https://legis.veto.pt';
    const response = await fetch(`${API_BASE_URL}/api/deputados/stats?legislature=${legislature}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching deputy statistics:', error);
    return {
      success: false,
      data: {
        totalDeputies: 0,
        byParty: {},
        byDistrict: {},
        byStatus: {},
        legislature: legislature
      }
    };
  }
}

/**
 * Normalize date to YYYY-MM-DD format for the seats API
 */
function normalizeDateForSeatsAPI(dateString: string): string {
  // If already in YYYY-MM-DD format, return as is
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return dateString;
  }
  
  // Try to parse various formats and convert to YYYY-MM-DD
  let date: Date;
  
  // Try DD/MM/YYYY format
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
    const [day, month, year] = dateString.split('/');
    date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  }
  // Try MM/DD/YYYY format  
  else if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateString)) {
    date = new Date(dateString);
  }
  // Try ISO date string
  else {
    date = new Date(dateString);
  }
  
  // Convert to YYYY-MM-DD
  if (isNaN(date.getTime())) {
    console.error(`[normalizeDateForSeatsAPI] Invalid date: "${dateString}"`);
    return dateString; // Return original if parsing fails
  }
  
  const normalized = date.toISOString().split('T')[0];
  return normalized;
}

/**
 * Fetch seat counts for a specific legislature and date
 */
export async function fetchSeats(legislature: string, date: string): Promise<SeatsResponse> {
  try {
    const API_BASE_URL = 'https://legis.veto.pt';
    const normalizedDate = normalizeDateForSeatsAPI(date);
    const url = `${API_BASE_URL}/api/deputados/seats?legislature=${legislature}&date=${normalizedDate}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching seat data:', error);
    return {
      success: false,
      data: {
        legislature: legislature,
        date: date,
        totalSeats: 0,
        byParty: {},
        byDistrict: {}
      }
    };
  }
}

/**
 * Fetch deputy stats with seat data for a specific date, fallback to general stats
 */
export async function fetchDeputyStatsForDate(legislature: string, date?: string): Promise<DeputyStatsResponse> {
  // If we have a date, try to get seat data first
  if (date) {
    try {
      const seatsResponse = await fetchSeats(legislature, date);
      if (seatsResponse.success && seatsResponse.data.totalSeats > 0) {
        // Convert seats data to deputy stats format
        return {
          success: true,
          data: {
            totalDeputies: seatsResponse.data.totalSeats,
            byParty: seatsResponse.data.byParty,
            byDistrict: seatsResponse.data.byDistrict,
            byStatus: {},
            legislature: seatsResponse.data.legislature,
            date: seatsResponse.data.date
          }
        };
      }
    } catch (error) {
      console.error('Error fetching seat data, falling back to general stats:', error);
    }
  }
  
  // Fallback to general deputy stats
  return fetchDeputyStats(legislature);
}
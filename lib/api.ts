import { format } from "date-fns"
import type { DateRange } from "react-day-picker"
import type { ApiResponse, Author } from "./types"

/**
 * Get auth token from the API - Client-side version
 */
export async function getAuthToken() {
  try {
    // Use our Next.js API route to get the token instead of directly accessing the external API
    const response: Response = await fetch('/api/token', { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store' // Ensure fresh token each time
    });
    
    if (!response.ok) {
      console.error(`Failed to get token: ${response.status} - ${response.statusText}`);
      throw new Error(`Failed to get token: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.access;
  } catch (error) {
    console.error("Error getting auth token:", error);
    throw error;
  }
}

/**
 * Fetch items with optional filtering
 */
export async function fetchItems(params: {
  page: number
  search: string
  types: string[]
  phases: string[]
  authors: string[]
  dateRange: DateRange | undefined
}): Promise<ApiResponse> {
  try {
    const token = await getAuthToken();
    
    const queryParams = new URLSearchParams({
      page: params.page.toString(),
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
      queryParams.append('authors', params.authors.join(','));
    }

    if (params.dateRange?.from) {
      queryParams.append('start_date', format(params.dateRange.from, "yyyy-MM-dd"));
    }
    if (params.dateRange?.to) {
      queryParams.append('end_date', format(params.dateRange.to, "yyyy-MM-dd"));
    }

    const API_BASE_URL = 'https://legis.passosperdidos.pt';
    const url = `${API_BASE_URL}/projetoslei/?${queryParams.toString()}`;
    
    console.log(`Fetching items from: ${url}`);
    
    const response: Response = await fetch(url, {
      headers: { 
        'Authorization': `Bearer ${token}`,
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
    console.error("Error fetching items:", error);
    throw error;
  }
}

/**
 * Fetch available types
 */
export async function fetchTypes(): Promise<string[]> {
  try {
    const response: Response = await fetch(`https://legis.passosperdidos.pt/types/`);
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching types:", error);
    throw error;
  }
}

/**
 * Fetch available phases
 */
export async function fetchPhases(): Promise<string[]> {
  try {
    const response: Response = await fetch(`https://legis.passosperdidos.pt/phases/`);
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching phases:", error);
    throw error;
  }
}

/**
 * Fetch available authors
 */
export async function fetchAuthors(): Promise<Author[]> {
  try {
    const token = await getAuthToken();
    let allAuthors: Author[] = [];
    let nextPage: string | null = 'https://legis.passosperdidos.pt/authors/';
    
    // Fetch all pages of authors
    while (nextPage) {
      const response: Response = await fetch(nextPage, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }
      
      const data = await response.json();
      allAuthors = [...allAuthors, ...data.results];
      
      nextPage = data.next;
    }
    
    return allAuthors;
  } catch (error) {
    console.error("Error fetching authors:", error);
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
  dateRange?: DateRange
  orderBy?: string
}): Promise<ApiResponse> {
  try {
    const token = await getAuthToken();
    
    const queryParams = new URLSearchParams();
    
    // Page parameter
    queryParams.append('page', (params.page || 1).toString());
    
    // Search parameter
    if (params.search) {
      queryParams.append('search', params.search);
    }

    // Types filter
    if (params.types && params.types.length > 0) {
      queryParams.append('type', params.types.join(','));
    }

    // Phases filter (excluding 'Todas')
    const filteredPhases = (params.phases || []).filter(phase => phase !== "Todas");
    if (filteredPhases.length > 0) {
      queryParams.append('phase', filteredPhases.join(','));
    }

    // Authors filter
    if (params.authors && params.authors.length > 0) {
      queryParams.append('authors', params.authors.join(','));
    }

    // Date range filter
    if (params.dateRange?.from) {
      queryParams.append('start_date', format(params.dateRange.from, "yyyy-MM-dd"));
    }
    if (params.dateRange?.to) {
      queryParams.append('end_date', format(params.dateRange.to, "yyyy-MM-dd"));
    }

    // Ordering
    if (params.orderBy) {
      switch (params.orderBy) {
        case 'recentes':
          queryParams.append('ordering', '-date');
          break;
        case 'antigos':
          queryParams.append('ordering', 'date');
          break;
        // Add other ordering options as needed
      }
    }
    
    const API_BASE_URL = 'https://legis.passosperdidos.pt';
    const url = `${API_BASE_URL}/projetoslei/?${queryParams.toString()}`;
    
    console.log(`Fetching proposals from: ${url}`);
    
    const response: Response = await fetch(url, {
      headers: { 
        'Authorization': `Bearer ${token}`,
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
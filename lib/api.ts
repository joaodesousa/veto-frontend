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

    const API_BASE_URL = 'https://legis.veto.pt';
    const url = `${API_BASE_URL}/projetoslei/?${queryParams.toString()}`;
    
    
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
    const token = await getAuthToken();
    
    // Make a request to fetch types
    const response: Response = await fetch('https://legis.veto.pt/types/', {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    
    // Log the actual response to debug
    const data = await response.json();
    
    // Check the structure of the response
    if (Array.isArray(data)) {
      // If it's directly an array, return it
      return data;
    } else if (data && typeof data === 'object') {
      // If it's an object, see if it has a results property
      if (Array.isArray(data.results)) {
        return data.results;
      }
      
      // If it's an object with type names as keys or values
      if (Object.values(data).every(value => typeof value === 'string')) {
        return Object.values(data);
      }
    }
    
    // If we can't determine the structure, log an error and return an empty array
    console.error("Unexpected types data structure:", data);
    return [];
  } catch (error) {
    console.error("Error fetching types:", error);
    throw error;
  }
}

/**
 * Fetch proposal phases
 */
export async function fetchPhases(): Promise<string[]> {
  try {
    const token = await getAuthToken();
    
    // Make a request to fetch phases
    const response: Response = await fetch('https://legis.veto.pt/phases-unique/', {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    
    // Log the actual response to debug
    const data = await response.json();
    // If the data is directly an array
    if (Array.isArray(data)) {
      // If array contains strings, return it
      if (data.every(item => typeof item === 'string')) {
        return data;
      }
      
      // If array contains objects with a name property
      if (data.every(item => item && typeof item === 'object')) {
        // Try to find the correct property that contains the phase name
        // by checking the first item
        const firstItem = data[0];
        if (firstItem.name && typeof firstItem.name === 'string') {
          // If items have a name property, use that
          return data.map(item => item.name);
        } 
        
        // Check for common keys that might contain the name
        for (const key of ['name', 'phase', 'title', 'label', 'description']) {
          if (firstItem[key] && typeof firstItem[key] === 'string') {
            return data.map(item => item[key]);
          }
        }
        
        // If we can't find a good string property, stringify the whole object for debugging
        console.warn("Phase objects don't have a clear string property to use:", firstItem);
        return data.map(item => JSON.stringify(item));
      }
    } 
    
    // If data is an object with a results array
    if (data && typeof data === 'object' && Array.isArray(data.results)) {
      // Apply the same logic to data.results
      const results = data.results;
      
      if (results.every(item => typeof item === 'string')) {
        return results;
      }
      
      if (results.every(item => item && typeof item === 'object')) {
        const firstItem = results[0];
        if (firstItem.name && typeof firstItem.name === 'string') {
          return results.map((item: { name: string }) => item.name);
        }
        
        for (const key of ['name', 'phase', 'title', 'label', 'description']) {
          if (firstItem[key] && typeof firstItem[key] === 'string') {
            return results.map((item: { [key: string]: string }) => item[key]);
          }
        }
        
        console.warn("Phase result objects don't have a clear string property:", firstItem);
        return results.map((item: any) => JSON.stringify(item));
      }
    }
    
    // If we can't determine a good structure, log an error
    console.error("Unexpected phases data structure:", data);
    
    // As a last resort, return an empty array
    return [];
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
    
    // Since there's no pagination, we just need to fetch once
    const response: Response = await fetch('https://legis.veto.pt/authors/party_groups/', {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    
    // The response is directly an array of authors
    const authors: Author[] = await response.json();
    
    return authors;
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
    
    const API_BASE_URL = 'https://legis.veto.pt';
    const url = `${API_BASE_URL}/projetoslei/?${queryParams.toString()}`;
    

    
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
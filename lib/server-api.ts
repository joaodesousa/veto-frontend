// lib/server-api.ts
import { Proposal, ApiResponse, DashboardStats } from './types';


/**
 * Get auth token from the API - Server-side version with improved error handling
 */
export async function getServerAuthToken() {
  try {
    const API_BASE_URL = process.env.API_BASE_URL || 'https://legis.veto.pt';
    
    const response = await fetch(`${API_BASE_URL}/api/token/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: process.env.API_USERNAME,
        password: process.env.API_PASSWORD,
      }),
      cache: 'no-store', // Prevent caching to ensure we get a fresh token
    });
    
    if (!response.ok) {
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
 * Fetch a proposal by its external ID - Server-side version with improved error handling
 */
export async function getProposalForId(externalId: string): Promise<Proposal | null> {
  try {
    const token = await getServerAuthToken();
    const API_BASE_URL = process.env.API_BASE_URL || 'https://legis.veto.pt';
    
    // Make sure URL is properly encoded
    const encodedId = encodeURIComponent(externalId);
    const url = `${API_BASE_URL}/projetoslei?external_id=${encodedId}`;

    const response = await fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` },
      cache: 'no-store' // Prevent caching to ensure fresh data
    });
    
    if (!response.ok) {
      console.error(`API error: ${response.status} - ${response.statusText}`);
      throw new Error(`API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      return data.results[0] as Proposal;
    }
    
    return null;
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
    const token = await getServerAuthToken();
    const API_BASE_URL = process.env.API_BASE_URL || 'https://legis.veto.pt';
    
    const url = `${API_BASE_URL}/projetoslei/`;
    
    
    const response = await fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` },
      cache: 'no-store' // Prevent caching to ensure fresh data
    });
    
    if (!response.ok) {
      console.error(`API error: ${response.status} - ${response.statusText}`);
      throw new Error(`API error: ${response.statusText}`);
    }
    
    const data = await response.json() as ApiResponse;
    
    const proposals = data.results && data.results.length > 0 ? data.results.slice(0, limit) : [];
    const totalCount = data.count || 0; // Assuming the API returns a count field
    
    return { proposals, totalCount };
  } catch (error) {
    console.error("Error fetching homepage proposals:", error);
    return { proposals: [], totalCount: 0 }; // Return empty proposals and count on error
  }
}

/**
 * Fetches dashboard statistics from the API
 */
export async function getDashboardStatistics(): Promise<DashboardStats> {
  try {
    const token = await getServerAuthToken();
    const API_BASE_URL = process.env.API_BASE_URL || 'https://legis.veto.pt';
    const url = `${API_BASE_URL}/dashboard/`;
    
    
    const response = await fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` },
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
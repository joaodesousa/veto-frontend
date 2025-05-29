import { VoteRecord, DeputyStats, PartyVoteWithDeputies, EnhancedVoteRecord } from "./types";

/**
 * Extract party name from a deputy string like "João Silva (PS)" -> "PS"
 */
function extractPartyFromDeputy(deputyString: string): string | null {
  const match = deputyString.match(/\(([^)]+)\)$/);
  if (match) {
    return match[1];
  }
  return null;
}

/**
 * Check if a voting entry represents an individual deputy vs a party
 */
function isIndividualDeputy(voterName: string): boolean {
  // If it contains parentheses with party, it's likely an individual deputy
  if (/\([^)]+\)/.test(voterName)) {
    return true;
  }
  
  // Check for other patterns that indicate individual deputies
  const individualIndicators = [
    /^[A-Z][a-z]+ [A-Z]/, // Starts with capitalized first and last name
    /deputad[oa]/i,       // Contains "deputado" or "deputada"
  ];
  
  return individualIndicators.some(pattern => pattern.test(voterName));
}

/**
 * Enhance vote record with deputy statistics to provide context about party voting
 */
export function enhanceVoteWithDeputyStats(
  voteRecord: VoteRecord,
  deputyStats: DeputyStats
): EnhancedVoteRecord {
  const partyVotesMap = new Map<string, {
    party: string;
    vote: "favor" | "against" | "abstention";
    totalDeputies: number;
    votingDeputies: number;
    dissidents: Array<{
      name: string;
      vote: "favor" | "against" | "abstention";
    }>;
    hasPartyVote: boolean;
  }>();

  // Helper function to find deputy count for a party
  const findDeputyCount = (partyName: string): number => {
    // First try exact match
    if (deputyStats.byParty[partyName]) {
      return deputyStats.byParty[partyName];
    }
    
    // Try normalized name
    const normalized = normalizePartyName(partyName);
    if (deputyStats.byParty[normalized]) {
      return deputyStats.byParty[normalized];
    }
    
    // Try case-insensitive search for exact matches only
    const exactMatch = Object.keys(deputyStats.byParty).find(key => 
      key.toLowerCase() === partyName.toLowerCase()
    );
    if (exactMatch) {
      return deputyStats.byParty[exactMatch];
    }
    
    // If not found in deputy stats, count individual deputies from the vote data
    // This handles cases where parties don't have parliamentary group status
    let individualDeputyCount = 0;
    Object.keys(voteRecord.parties || {}).forEach(voterName => {
      if (isIndividualDeputy(voterName)) {
        const extractedParty = extractPartyFromDeputy(voterName);
        if (extractedParty === partyName) {
          individualDeputyCount++;
        }
      }
    });
    
    return individualDeputyCount;
  };

  // First pass: collect all individual deputies by party
  const individualDeputiesByParty = new Map<string, Array<{
    name: string;
    vote: "favor" | "against" | "abstention";
  }>>();

  Object.entries(voteRecord.parties || {}).forEach(([voterName, votePosition]) => {
    if (isIndividualDeputy(voterName)) {
      const partyName = extractPartyFromDeputy(voterName);
      const deputyName = voterName.replace(/\s*\([^)]+\)$/, '');
      
      if (partyName) {
        if (!individualDeputiesByParty.has(partyName)) {
          individualDeputiesByParty.set(partyName, []);
        }
        individualDeputiesByParty.get(partyName)!.push({
          name: deputyName,
          vote: votePosition
        });
      }
    }
  });

  // Second pass: process party votes and combine with individual deputies
  Object.entries(voteRecord.parties || {}).forEach(([voterName, votePosition]) => {
    if (!isIndividualDeputy(voterName)) {
      // This is a party vote
      const totalDeputies = findDeputyCount(voterName);
      const individualDeputies = individualDeputiesByParty.get(voterName) || [];
      
      // The party vote represents the deputies who voted with the party line
      // Individual deputies listed separately are dissidents
      const dissidents = individualDeputies;
      const partyLineDeputies = Math.max(0, totalDeputies - dissidents.length);
      
      partyVotesMap.set(voterName, {
        party: voterName,
        vote: votePosition,
        totalDeputies,
        votingDeputies: partyLineDeputies,
        dissidents,
        hasPartyVote: true
      });
    }
  });

  // Third pass: handle parties that only have individual deputies (no party vote)
  individualDeputiesByParty.forEach((deputies, partyName) => {
    if (!partyVotesMap.has(partyName)) {
      // This party has no official party vote, only individual deputies
      const totalDeputies = findDeputyCount(partyName);
      
      // Determine the "party position" based on majority of individual votes
      const voteCount = deputies.reduce((acc, deputy) => {
        acc[deputy.vote] = (acc[deputy.vote] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const mostCommonVote = Object.entries(voteCount)
        .sort(([,a], [,b]) => b - a)[0]?.[0] as "favor" | "against" | "abstention";
      
      partyVotesMap.set(partyName, {
        party: partyName,
        vote: mostCommonVote || "abstention",
        totalDeputies,
        votingDeputies: 0, // No party line vote
        dissidents: deputies, // All are considered dissidents since there's no party line
        hasPartyVote: false
      });
    }
  });

  // Convert map to array and sort by deputy count
  const partyVotesWithDeputies = Array.from(partyVotesMap.values())
    .sort((a, b) => b.totalDeputies - a.totalDeputies);

  return {
    ...voteRecord,
    partyVotesWithDeputies,
    deputyStats
  };
}

/**
 * Calculate weighted vote counts based on deputy numbers
 */
export function calculateWeightedVoteCounts(partyVotesWithDeputies: PartyVoteWithDeputies[]) {
  const counts = {
    favor: 0,
    against: 0,
    abstention: 0
  };

  partyVotesWithDeputies.forEach(partyVote => {
    // For parties with dissidents, we need to count them separately
    if (partyVote.dissidents && partyVote.dissidents.length > 0) {
      // Count the main party vote (total deputies minus dissidents)
      const mainPartyDeputies = partyVote.totalDeputies - partyVote.dissidents.length;
      
      if (mainPartyDeputies > 0) {
        switch (partyVote.vote) {
          case "favor":
            counts.favor += mainPartyDeputies;
            break;
          case "against":
            counts.against += mainPartyDeputies;
            break;
          case "abstention":
            counts.abstention += mainPartyDeputies;
            break;
        }
      }
      
      // Count each dissident individually
      partyVote.dissidents.forEach(dissident => {
        switch (dissident.vote) {
          case "favor":
            counts.favor += 1;
            break;
          case "against":
            counts.against += 1;
            break;
          case "abstention":
            counts.abstention += 1;
            break;
        }
      });
    } else {
      // No dissidents, count all deputies as voting with the party
      const deputyCount = partyVote.votingDeputies || partyVote.totalDeputies || 1;
      
      switch (partyVote.vote) {
        case "favor":
          counts.favor += deputyCount;
          break;
        case "against":
          counts.against += deputyCount;
          break;
        case "abstention":
          counts.abstention += deputyCount;
          break;
      }
    }
  });

  return counts;
}

/**
 * Parse party names to handle variations and standardize them
 */
export function normalizePartyName(partyName: string): string {
  // Handle only very specific and well-known variations
  // Be conservative to avoid mixing up different parties
  const partyMappings: Record<string, string> = {
    "Partido Socialista": "PS",
    "Partido Social Democrata": "PSD", 
    "Partido Comunista Português": "PCP",
    "Iniciativa Liberal": "IL",
    "Bloco de Esquerda": "BE",
    "Pessoas-Animais-Natureza": "PAN",
    "Não Inscritos": "Ninsc",
    "Não inscrito": "Ninsc",
    "Não inscritos": "Ninsc"
  };

  // Only use exact matches to avoid confusion
  if (partyMappings[partyName]) {
    return partyMappings[partyName];
  }

  // Return the original name to avoid any confusion
  return partyName;
} 
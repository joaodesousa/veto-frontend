// hooks/useProcessTimeline.ts
import { useMemo } from 'react';
import { Phase } from '@/lib/types';

interface TimelineSubitem {
  date: string;
  title: string;
  description: string;
}

interface TimelineItem {
  date: string;
  title: string;
  description: string;
  subitems?: TimelineSubitem[];
  voteId?: string;
  hasVote: boolean;
}

export function useProcessTimeline(phases: Phase[] | undefined): TimelineItem[] {
  // Process the timeline data from phases
  return useMemo(() => {
    if (!phases || !Array.isArray(phases) || phases.length === 0) {
      return [];
    }

    // Group phases by name to consolidate them
    const phaseGroups: { [key: string]: Phase[] } = {};
    
    phases.forEach(phase => {
      const key = `${phase.name}-${phase.date}`;
      if (!phaseGroups[key]) {
        phaseGroups[key] = [];
      }
      phaseGroups[key].push(phase);
    });
    
    // Process each group into a timeline item
    return Object.entries(phaseGroups).map(([key, groupedPhases]) => {
      // Take base properties from the first phase in the group
      const mainPhase = groupedPhases[0];
      const formattedDate = new Date(mainPhase.date).toLocaleDateString('pt-PT');
      
      // Check if this phase has votes
      const phaseHasVotes = groupedPhases.some(phase => 
        phase.votes && Array.isArray(phase.votes) && phase.votes.length > 0
      );
      
      // Create a unique vote ID for this phase if it has votes - use formatted date to match voting component
      const voteId = phaseHasVotes ? `phase-${mainPhase.name}-${formattedDate}` : undefined;
      
      // Create the base timeline item
      const timelineItem: TimelineItem = {
        date: formattedDate,
        title: mainPhase.name,
        description: mainPhase.observation || '',
        subitems: [],
        voteId: voteId,
        hasVote: phaseHasVotes
      };
      
      // Collect all commissions across all phases in this group
      const commissions: Map<string, {
        name: string;
        observation?: string;
        votes?: boolean;
        documents?: boolean;
        voteId?: string;
      }> = new Map();
      
      // Extract commissions from all phases
      groupedPhases.forEach(phase => {
        if (phase.commissions && Array.isArray(phase.commissions)) {
          phase.commissions.forEach(comm => {
            if (comm.name) {
              const existingComm = commissions.get(comm.name);
              const commHasVotes = comm.votes && comm.votes.length > 0;
              const commVoteId = commHasVotes ? `commission-${comm.name}-${formattedDate}` : undefined;
              
              if (existingComm) {
                // Update existing commission with additional info
                existingComm.votes = existingComm.votes || commHasVotes;
                existingComm.documents = existingComm.documents || 
                  (comm.documents && comm.documents.length > 0);
                
                // Use the vote ID if this commission has votes
                if (commHasVotes && !existingComm.voteId) {
                  existingComm.voteId = commVoteId;
                }
                
                // Merge observations if both have them
                if (comm.observation && existingComm.observation) {
                  existingComm.observation = `${existingComm.observation}; ${comm.observation}`;
                } else if (comm.observation) {
                  existingComm.observation = comm.observation;
                }
              } else {
                // Add new commission
                commissions.set(comm.name, {
                  name: comm.name,
                  observation: comm.observation,
                  votes: commHasVotes,
                  documents: comm.documents && comm.documents.length > 0,
                  voteId: commVoteId
                });
              }
            }
          });
        }
      });
      
      // Convert commissions to subitems
      if (commissions.size > 0) {
        timelineItem.subitems = Array.from(commissions.values()).map(comm => {
          // Format extra info for votes and documents
          const extraInfo = [];
          if (comm.votes) extraInfo.push('votações');
          if (comm.documents) extraInfo.push('documentos');
          
          let description = comm.observation || 'Comissão parlamentar';
          
          // Add extra info to description if there are votes or documents
          if (extraInfo.length > 0) {
            description += description !== 'Comissão parlamentar' 
              ? ` (com ${extraInfo.join(' e ')})`
              : ` - Com ${extraInfo.join(' e ')}`;
          }
          
          return {
            date: formattedDate,
            title: comm.name,
            description,
            voteId: comm.voteId,
            hasVote: comm.votes || false
          };
        });
      }
      
      return timelineItem;
    })
    .sort((a, b) => {
      // Sort by date (oldest first)
      const dateA = new Date(a.date.split('/').reverse().join('-'));
      const dateB = new Date(b.date.split('/').reverse().join('-'));
      return dateA.getTime() - dateB.getTime();
    });
  }, [phases]);
}
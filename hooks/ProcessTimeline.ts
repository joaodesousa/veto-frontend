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
      
      // Create the base timeline item
      const timelineItem: TimelineItem = {
        date: formattedDate,
        title: mainPhase.name,
        description: mainPhase.observation || '',
        subitems: []
      };
      
      // Collect all commissions across all phases in this group
      const commissions: Map<string, {
        name: string;
        observation?: string;
        votes?: boolean;
        documents?: boolean;
      }> = new Map();
      
      // Extract commissions from all phases
      groupedPhases.forEach(phase => {
        if (phase.commissions && Array.isArray(phase.commissions)) {
          phase.commissions.forEach(comm => {
            if (comm.name) {
              const existingComm = commissions.get(comm.name);
              
              if (existingComm) {
                // Update existing commission with additional info
                existingComm.votes = existingComm.votes || 
                  (comm.votes && comm.votes.length > 0);
                existingComm.documents = existingComm.documents || 
                  (comm.documents && comm.documents.length > 0);
                
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
                  votes: comm.votes && comm.votes.length > 0,
                  documents: comm.documents && comm.documents.length > 0
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
            description
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
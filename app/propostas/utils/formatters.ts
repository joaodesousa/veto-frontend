// app/propostas/utils/formatters.ts
import { format } from "date-fns";
import type { Proposal, Author, Phase, Vote, Attachment, FormattedProposal, VoteRecord } from "@/lib/types";

// Helper function to format dates consistently
const formatDate = (dateString: string): string => {
  try {
    return new Date(dateString).toLocaleDateString('pt-PT');
  } catch (e) {
    return dateString;
  }
};

// Helper function to format names in Title Case
const toTitleCase = (name: string): string => {
  return name.toLowerCase().split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Separate function to format author data
const formatAuthors = (proposal: Proposal): {
  authorsList: string[];
  deputies: { name: string; party?: string }[];
  primaryParty: string;
} => {
  const authorsList: string[] = [];
  const deputies: { name: string; party?: string }[] = [];
  let primaryParty = "Desconhecido";
  
  // First try to extract data from raw API properties
  
  // Process parliamentary groups (IniAutorGruposParlamentares)
  if (proposal.IniAutorGruposParlamentares) {
    if (Array.isArray(proposal.IniAutorGruposParlamentares) && proposal.IniAutorGruposParlamentares.length > 0) {
      // Get parliamentary group names
      const partyNames = proposal.IniAutorGruposParlamentares
        .map(party => party.GP || "")
        .filter(Boolean)
        .map(name => toTitleCase(name));
      
      // Add to authors list
      authorsList.push(...partyNames);
      
      // Set primary party
      if (partyNames.length > 0) {
        primaryParty = partyNames[0];
      }
    }
  }
  
  // Process deputies (IniAutorDeputados)
  if (proposal.IniAutorDeputados) {
    if (Array.isArray(proposal.IniAutorDeputados) && proposal.IniAutorDeputados.length > 0) {
      // Process deputies for the deputies list
      const deputyObjects = proposal.IniAutorDeputados.map(deputy => ({
        name: deputy.nome ? toTitleCase(deputy.nome) : "",
        party: deputy.GP || undefined
      }));
      
      // Add deputies to the deputies list
      deputies.push(...deputyObjects);
      
      // Optionally add deputy names to authorsList if needed
      const deputyNames = deputyObjects.map(d => d.name).filter(Boolean);
      if (authorsList.length === 0) {
        authorsList.push(...deputyNames);
      }
    }
  }
  
  // Process other authors (IniAutorOutros)
  if (proposal.IniAutorOutros) {
    if (Array.isArray(proposal.IniAutorOutros) && proposal.IniAutorOutros.length > 0) {
      // Handle when IniAutorOutros is an array
      const otherNames = proposal.IniAutorOutros
        .map(other => other.nome || other.sigla || "")
        .filter(Boolean)
        .map(name => toTitleCase(name));
      
      // Add to authors list
      authorsList.push(...otherNames);
      
      // Set primary party if not already set
      if (primaryParty === "Desconhecido" && otherNames.length > 0) {
        primaryParty = otherNames[0];
      }
    } else if (typeof proposal.IniAutorOutros === 'object') {
      // Handle when IniAutorOutros is a single object
      const name = proposal.IniAutorOutros.nome || proposal.IniAutorOutros.sigla || "";
      if (name) {
        authorsList.push(toTitleCase(name));
        
        // Set primary party if not already set
        if (primaryParty === "Desconhecido") {
          primaryParty = toTitleCase(name);
        }
      }
    }
  }
  
  // If no authors found from raw data, fallback to processed authors array
  if (authorsList.length === 0 && proposal.authors && Array.isArray(proposal.authors)) {
    // Process the authors array
    authorsList.push(
      ...proposal.authors
        .map(author => author.name ? toTitleCase(author.name) : "")
        .filter(Boolean)
    );
    
    // Process deputies
    deputies.push(
      ...proposal.authors
        .filter(author => author.author_type === "Deputado" || !author.author_type)
        .map(author => ({
          name: author.name ? toTitleCase(author.name) : "",
          party: author.party || undefined
        }))
    );
    
    // Set primary party if not already set
    if (primaryParty === "Desconhecido") {
      const partyAuthor = proposal.authors.find(author => author.author_type === "Grupo");
      if (partyAuthor && partyAuthor.name) {
        primaryParty = toTitleCase(partyAuthor.name);
      }
    }
  }
  
  return { authorsList, deputies, primaryParty };
};

// Enhanced function to format timeline data with commission subitems and vote information
const formatTimeline = (phases: Phase[] = [], proposalDate: string): {
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
  status: string;
  lastUpdate: string;
} => {
  // Group phases by name and date
  const phaseGroups: { [key: string]: Phase[] } = {};
  
  phases.forEach(phase => {
    const key = `${phase.name}-${phase.date}`;
    if (!phaseGroups[key]) {
      phaseGroups[key] = [];
    }
    phaseGroups[key].push(phase);
  });
  
  // Create timeline items from grouped phases with commission subitems and vote information
  const timeline = Object.entries(phaseGroups).map(([key, groupedPhases]) => {
    // Take name and date from the first phase in the group
    const { name, date, observation } = groupedPhases[0];
    const formattedDate = formatDate(date);
    
    // Check if this phase has votes
    const phaseHasVotes = groupedPhases.some(phase => 
      phase.votes && Array.isArray(phase.votes) && phase.votes.length > 0
    );
    
    // Create a unique vote ID for this phase if it has votes
    const voteId = phaseHasVotes ? `phase-${name}-${formattedDate}` : undefined;
    
    // Create the basic timeline item with vote information
    const timelineItem = {
      date: formattedDate,
      title: name,
      description: observation || "",
      subitems: [] as Array<{
        date: string;
        title: string;
        description: string;
      }>,
      voteId: voteId,
      hasVote: phaseHasVotes
    };
    
    // Extract commissions from all phases in this group to add as subitems
    const commissions: Map<string, {
      name: string;
      date?: string;
      observation?: string;
    }> = new Map();
    
    groupedPhases.forEach(phase => {
      if (phase.commissions && Array.isArray(phase.commissions)) {
        phase.commissions.forEach(comm => {
          if (comm.name) {
            const existingComm = commissions.get(comm.name);
            
            if (existingComm) {
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
                date: phase.date,
                observation: comm.observation || ""
              });
            }
          }
        });
      }
    });
    
    // Add commissions as subitems (without vote information since votes belong to phases)
    if (commissions.size > 0) {
      timelineItem.subitems = Array.from(commissions.values()).map(comm => ({
        date: formatDate(comm.date || date),
        title: comm.name,
        description: comm.observation || 'Comissão parlamentar'
      }));
    }
    
    return timelineItem;
  });
  
  // Sort timeline by date (oldest first for chronological display)
  timeline.sort((a, b) => {
    // Parse dates and compare them
    const dateA = new Date(a.date.split('/').reverse().join('-'));
    const dateB = new Date(b.date.split('/').reverse().join('-'));
    return dateA.getTime() - dateB.getTime();
  });
  
  // Determine status from the latest phase
  const latestPhase = phases.length > 0 
    ? phases.reduce((latest, current) => {
        const latestDate = new Date(latest.date);
        const currentDate = new Date(current.date);
        return currentDate > latestDate ? current : latest;
      }, phases[0])
    : null;
  
  const status = latestPhase ? latestPhase.name : "Em Processamento";
  const lastUpdate = latestPhase 
    ? formatDate(latestPhase.date) 
    : formatDate(proposalDate);
    
  return { timeline, status, lastUpdate };
};


// Function to process vote data
const formatVotes = (votes: Vote[] = [], phases: Phase[] = []): FormattedProposal['votes'] => {
  // Initialize the vote data structure
  const voteData: FormattedProposal['votes'] = {
    favor: 0,
    against: 0,
    abstention: 0,
    parties: {},
    result: "",
    date: "",
    hasVotes: false,
    allVotes: []
  };
  
  // Get all votes with parsedVote from all phases
  const votesWithParsedVote: { vote: Vote; phaseName: string }[] = [];
  
  // Collect all votes with parsedVote from all phases
  phases.forEach(phase => {
    if (phase.votes && Array.isArray(phase.votes)) {
      phase.votes.forEach(vote => {
        if (vote.parsedVote) {
          votesWithParsedVote.push({ vote, phaseName: phase.name });
        }
      });
    }
  });
  
  // If we have votes with parsedVote, use those instead of the old vote system
  if (votesWithParsedVote.length > 0) {
    voteData.hasVotes = true;
    
    // Process all votes with parsedVote
    voteData.allVotes = votesWithParsedVote.map(({ vote, phaseName }) => {
      if (!vote.parsedVote) return {} as VoteRecord;
      
      const voteRecord: VoteRecord = {
        favor: vote.parsedVote.favor.length,
        against: vote.parsedVote.contra.length,
        abstention: vote.parsedVote.abstencao.length,
        parties: {},
        result: vote.parsedVote.resultado || vote.result || "",
        date: vote.date ? formatDate(vote.date) : "",
        description: vote.description || "",
        phaseName: phaseName
      };
      
      // Process parties voting in favor
      vote.parsedVote.favor.forEach(party => {
        voteRecord.parties[party] = "favor";
      });
      
      // Process parties voting against
      vote.parsedVote.contra.forEach(party => {
        voteRecord.parties[party] = "against";
      });
      
      // Process parties abstaining
      vote.parsedVote.abstencao.forEach(party => {
        voteRecord.parties[party] = "abstention";
      });
      
      // Handle unanimous votes
      if (vote.parsedVote.unanime) {
        voteRecord.parties = { "Todos os partidos": "favor" };
        voteRecord.favor = 1;
      }
      
      return voteRecord;
    }).filter(record => Object.keys(record).length > 0); // Filter out empty records
  } else if (votes && votes.length > 0) {
    // If no parsedVote, fall back to the old system
    // Mark that we have votes
    voteData.hasVotes = true;
    
    // Process all votes and create individual vote records
    voteData.allVotes = votes.map(vote => {
      const voteRecord: VoteRecord = {
        favor: 0,
        against: 0,
        abstention: 0,
        parties: {},
        result: vote.result || "",
        date: vote.date ? formatDate(vote.date) : "",
        description: vote.description || "",
        phaseName: undefined
      };
      
      // Check if this vote has parsedVote directly
      if (vote.parsedVote) {
        voteRecord.favor = vote.parsedVote.favor.length;
        voteRecord.against = vote.parsedVote.contra.length;
        voteRecord.abstention = vote.parsedVote.abstencao.length;
        
        // Process parties voting in favor
        vote.parsedVote.favor.forEach(party => {
          voteRecord.parties[party] = "favor";
        });
        
        // Process parties voting against
        vote.parsedVote.contra.forEach(party => {
          voteRecord.parties[party] = "against";
        });
        
        // Process parties abstaining
        vote.parsedVote.abstencao.forEach(party => {
          voteRecord.parties[party] = "abstention";
        });
        
        // Handle unanimous votes
        if (vote.parsedVote.unanime) {
          voteRecord.parties = { "Todos os partidos": "favor" };
          voteRecord.favor = 1;
        }
        
        // Use parsed vote result if available
        if (vote.parsedVote.resultado) {
          voteRecord.result = vote.parsedVote.resultado;
        }
      }
      // Process party votes from the 'votes' object if it exists and no parsedVote
      else if (vote.votes) {
        // Count parties voting in favor
        if (vote.votes.a_favor && Array.isArray(vote.votes.a_favor)) {
          voteRecord.favor = vote.votes.a_favor.length;
          vote.votes.a_favor.forEach(party => {
            voteRecord.parties[party] = "favor";
          });
        }
        
        // Count parties voting against
        if (vote.votes.contra && Array.isArray(vote.votes.contra)) {
          voteRecord.against = vote.votes.contra.length;
          vote.votes.contra.forEach(party => {
            voteRecord.parties[party] = "against";
          });
        }
        
        // Count parties abstaining
        if (vote.votes.abstencao && Array.isArray(vote.votes.abstencao)) {
          voteRecord.abstention = vote.votes.abstencao.length;
          vote.votes.abstencao.forEach(party => {
            voteRecord.parties[party] = "abstention";
          });
        }
        
        // Handle unanimous votes
        if (vote.votes?.unanime === "unanime" || vote.unanimous === true) {
          voteRecord.parties = { "Todos os partidos": "favor" };
          voteRecord.favor = 1;
        }
      }
      
      return voteRecord;
    });
  }
  
  // If we have vote records, use the most recent one as the main vote data
  if (voteData.allVotes.length > 0) {
    const mainVote = voteData.allVotes[voteData.allVotes.length - 1];
    voteData.favor = mainVote.favor;
    voteData.against = mainVote.against;
    voteData.abstention = mainVote.abstention;
    voteData.parties = mainVote.parties;
    voteData.result = mainVote.result;
    voteData.date = mainVote.date;
  }
  
  return voteData;
};

// Function to extract documents from phases
const extractDocumentsFromPhases = (phases: Phase[] = []): FormattedProposal['documents'] => {
  const documents: FormattedProposal['documents'] = [];
  
  if (!phases || !Array.isArray(phases) || phases.length === 0) {
    return documents;
  }
  
  // Iterate through each phase
  phases.forEach(phase => {
    // Check if the phase has commissions
    if (phase.commissions && Array.isArray(phase.commissions)) {
      // Iterate through each commission
      phase.commissions.forEach(commission => {
        // Check if the commission has documents
        if (commission.documents && Array.isArray(commission.documents)) {
          // Add each document to our list
          commission.documents.forEach(doc => {
            if (doc.url) {
              documents.push({
                title: doc.title || `Documento da ${commission.name || 'Comissão'}`,
                type: doc.document_type || 'Documento',
                date: doc.date ? formatDate(doc.date) : '',
                url: doc.url
              });
            }
          });
        }
      });
    }
  });
  
  return documents;
}

// Function to format documents (no changes needed for timeline subitems)
// Function to format documents
const formatDocuments = (
  attachments: Attachment[] = [], 
  publicationUrl: string | null = null, 
  publicationDate: string | null = null,
  phases: Phase[] = []
): FormattedProposal['documents'] => {
  let documents: FormattedProposal['documents'] = [];
  
  // Process publication URL if available
  if (publicationUrl) {
    documents.push({
      title: "Publicação Oficial",
      type: "Publicação",
      date: publicationDate ? formatDate(publicationDate) : formatDate(new Date().toISOString()),
      url: publicationUrl
    });
  }
  
  // Process attachments if available
  if (attachments && Array.isArray(attachments) && attachments.length > 0) {
    attachments.forEach(attachment => {
      if (attachment.url) {
        documents.push({
          title: attachment.name || "Anexo",
          type: "Anexo",
          date: "", // Attachments might not have dates
          url: attachment.url || ""
        });
      }
    });
  }
  
  // Extract documents from phases
  const phaseDocuments = extractDocumentsFromPhases(phases);
  documents = [...documents, ...phaseDocuments];
  
  // Sort documents by date (newest first, if dates available)
  documents.sort((a, b) => {
    if (!a.date) return 1;  // Items without dates go to the end
    if (!b.date) return -1; // Items without dates go to the end
    
    return new Date(b.date.split('/').reverse().join('-')).getTime() - 
           new Date(a.date.split('/').reverse().join('-')).getTime();
  });
  
  return documents;
}

// Main formatter function with improved modularity
export function formatProposalData(proposal: Proposal): FormattedProposal {
  // Handle the id conversion safely, ensuring it's treated as a string
  const id = String(proposal.external_id);
  
  // Format authors data
  const { authorsList, deputies, primaryParty } = formatAuthors(proposal);
  
  // Format timeline data with commission subitems
  const { timeline, status, lastUpdate } = formatTimeline(proposal.phases || [], proposal.date);
  
  // Format votes data - make sure to pass the actual votes array
  const votes = formatVotes(proposal.votes || [], proposal.phases || []);
  
  // Format documents data
  const documents = formatDocuments(
    proposal.attachments || [], 
    proposal.publication_url, 
    proposal.publication_date,
    proposal.phases || []
  );
  
  // Include related proposals if available
  const relatedProposals = proposal.related_proposals || [];
  
  return {
    id,
    title: proposal.title || "",
    type: proposal.type || "",
    descType: proposal.descType || "",
    number: `${proposal.type || ""} ${proposal.external_id || ""}`,
    status,
    date: formatDate(proposal.date),
    lastUpdate,
    party: primaryParty,
    description: proposal.description || "Sem descrição disponível",
    authors: authorsList,
    deputies,
    timeline,
    votes,
    documents,
    phases: proposal.phases || [],
    relatedProposals,
    textLink: proposal.text_link || null, 
  };
}
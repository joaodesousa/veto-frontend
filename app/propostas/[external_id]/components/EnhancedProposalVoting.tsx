"use client";
import { Check, ThumbsDown, ThumbsUp, X, Users, Minus, ChevronDown, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useEffect, useRef, useState } from "react";
import { fetchDeputyStatsForDate } from "@/lib/api";
import { enhanceVoteWithDeputyStats, calculateWeightedVoteCounts, normalizePartyName } from "@/lib/vote-utils";
import { EnhancedVoteRecord, DeputyStats, PartyVoteWithDeputies } from "@/lib/types";

// Define the type for the vote record
interface VoteRecord {
  favor: number;
  against: number;
  abstention: number;
  parties: {
    [key: string]: "favor" | "against" | "abstention";
  };
  result: string;
  date: string;
  description?: string;
  phaseName?: string;
}

// Define the type for the votes object
interface Votes {
  favor: number;
  against: number;
  abstention: number;
  parties: {
    [key: string]: "favor" | "against" | "abstention";
  };
  result: string;
  date: string;
  hasVotes: boolean;
  allVotes: VoteRecord[];
}

interface EnhancedProposalVotingProps {
  votes: Votes;
  scrollToVoteId?: string;
  legislature?: string; // Add legislature to fetch deputy stats
}

// Party colors mapping
const partyColors: Record<string, string> = {
  "PS": "#F8567B",
  "PSD": "#FF821E", 
  "CH": "#202056",
  "IL": "#00AEEF",
  "BE": "#C4161C",
  "PCP": "#C4161C",
  "L": "#00AA4F",
  "PAN": "#01796F",
  "Ninsc": "#888888",
};

export function EnhancedProposalVoting({ votes, scrollToVoteId, legislature = "XV" }: EnhancedProposalVotingProps) {
  const accordionRef = useRef<HTMLDivElement>(null);
  const [openAccordionValue, setOpenAccordionValue] = useState<string | undefined>();
  const [deputyStats, setDeputyStats] = useState<DeputyStats | null>(null);
  const [enhancedVotes, setEnhancedVotes] = useState<EnhancedVoteRecord[]>([]);
  const [expandedParties, setExpandedParties] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  // Check if there are any votes available
  const hasVotes = votes && (
    votes.hasVotes || 
    votes.favor > 0 || 
    votes.against > 0 || 
    votes.abstention > 0 ||
    (votes.parties && Object.keys(votes.parties || {}).length > 0) ||
    votes.result ||
    (votes.allVotes && votes.allVotes.length > 0)
  );
  
  // Create a safe version of allVotes
  const safeAllVotes = votes?.allVotes || [];
  const hasMultipleVotes = safeAllVotes.length > 1;
  
  // If no votes or if allVotes is empty, use the votes object itself
  const voteRecords = hasMultipleVotes 
    ? safeAllVotes 
    : (hasVotes && safeAllVotes.length === 0 ? [{
        favor: votes.favor || 0,
        against: votes.against || 0,
        abstention: votes.abstention || 0,
        parties: votes.parties || {},
        result: votes.result || "",
        date: votes.date || "",
        description: "",
      }] : safeAllVotes);

  // Fetch deputy statistics on component mount
  useEffect(() => {
    async function loadDeputyStats() {
      try {
        setLoading(true);
        
        // Enhance vote records with deputy statistics
        const enhanced = await Promise.all(
          voteRecords.map(async (vote) => {
            try {
              const response = await fetchDeputyStatsForDate(legislature, vote.date);
              if (response.success) {
                return enhanceVoteWithDeputyStats(vote, response.data);
              } else {
                // Fallback to vote without enhancement
                return vote as EnhancedVoteRecord;
              }
            } catch (error) {
              console.error(`Failed to enhance vote for date ${vote.date}:`, error);
              return vote as EnhancedVoteRecord;
            }
          })
        );
        
        setEnhancedVotes(enhanced);
        
        // Set deputy stats from the first successful response for display purposes
        const firstSuccessfulStats = enhanced.find(vote => vote.deputyStats);
        if (firstSuccessfulStats?.deputyStats) {
          setDeputyStats(firstSuccessfulStats.deputyStats);
        }
      } catch (error) {
        console.error("Failed to load deputy statistics:", error);
        // Fallback to non-enhanced votes
        setEnhancedVotes(voteRecords as EnhancedVoteRecord[]);
      } finally {
        setLoading(false);
      }
    }

    if (hasVotes) {
      loadDeputyStats();
    } else {
      setLoading(false);
    }
  }, [legislature, voteRecords.length, hasVotes]);

  // Helper function to check if a vote is unanimous
  const isUnanimousVote = (vote: VoteRecord) => {
    return Object.keys(vote.parties || {}).length === 1 && 
           Object.keys(vote.parties || {})[0] === "Todos os partidos";
  };

  // Generate vote ID for linking
  const generateVoteId = (vote: VoteRecord, index: number) => {
    if (vote.phaseName && vote.date) {
      // Check if the date is already in DD/MM/YYYY format
      if (typeof vote.date === 'string' && vote.date.includes('/')) {
        // Already in DD/MM/YYYY format, use as is
        return `phase-${vote.phaseName}-${vote.date}`;
      } else {
        // Try to format as DD/MM/YYYY
        try {
          const formattedDate = new Date(vote.date).toLocaleDateString('pt-PT');
          return `phase-${vote.phaseName}-${formattedDate}`;
        } catch (error) {
          return `vote-${index}`;
        }
      }
    }
    return `vote-${index}`;
  };

  // Toggle party expansion
  const togglePartyExpansion = (partyName: string) => {
    const newExpanded = new Set(expandedParties);
    if (newExpanded.has(partyName)) {
      newExpanded.delete(partyName);
    } else {
      newExpanded.add(partyName);
    }
    setExpandedParties(newExpanded);
  };

  // Effect to scroll to specific vote when scrollToVoteId changes
  useEffect(() => {
    if (scrollToVoteId) {
      // Function to handle the scroll when accordion is ready
      const handleScroll = () => {
        if (!accordionRef.current) {
          return false;
        }

        const targetVoteIndex = voteRecords.findIndex((vote, index) => {
          const voteId = generateVoteId(vote, index);
          return voteId === scrollToVoteId;
        });
        
        if (targetVoteIndex !== -1) {
          const accordionValue = `vote-${targetVoteIndex}`;
          setOpenAccordionValue(accordionValue);
          
          setTimeout(() => {
            const targetElement = accordionRef.current?.querySelector(`[data-vote-id="${scrollToVoteId}"]`);
            if (targetElement) {
              targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }, 100);
          return true;
        } else {
          return false;
        }
      };

      // Try immediately
      if (handleScroll()) {
        return; // Success, we're done
      }

      // If accordion not ready, retry with intervals
      const maxRetries = 10;
      let retryCount = 0;
      
      const retryInterval = setInterval(() => {
        retryCount++;
        
        if (handleScroll() || retryCount >= maxRetries) {
          clearInterval(retryInterval);
          if (retryCount >= maxRetries) {
          }
        }
      }, 100);

      // Cleanup function
      return () => {
        clearInterval(retryInterval);
      };
    }
  }, [scrollToVoteId, voteRecords, loading]); // Add loading to dependencies

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Resultados da Votação</CardTitle>
          <CardDescription>Carregando informações de deputados...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resultados da Votação</CardTitle>
        <CardDescription>
          Como votaram os partidos {deputyStats && `(${deputyStats.totalDeputies} deputados total)`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {enhancedVotes.length === 0 ? (
          <div>
            <p className="text-muted-foreground">Não há informações de votação disponíveis.</p>
          </div>
        ) : (
          <Accordion 
            type="single" 
            collapsible 
            ref={accordionRef}
            value={openAccordionValue}
            onValueChange={setOpenAccordionValue}
          >
            {enhancedVotes.map((currentVote, index) => {
              const voteId = generateVoteId(currentVote, index);
              const weightedCounts = currentVote.partyVotesWithDeputies 
                ? calculateWeightedVoteCounts(currentVote.partyVotesWithDeputies)
                : { favor: currentVote.favor, against: currentVote.against, abstention: currentVote.abstention };

              return (
                <AccordionItem key={index} value={`vote-${index}`} data-vote-id={voteId}>
                  <AccordionTrigger>
                    {currentVote.description ? (
                      <span className="text-left">{currentVote.description}</span>
                    ) : currentVote.phaseName ? (
                      <span>{currentVote.phaseName} {currentVote.date ? `- ${currentVote.date}` : ''}</span>
                    ) : (
                      <span>Votação {index + 1} {currentVote.date ? `- ${currentVote.date}` : ''}</span>
                    )}
                  </AccordionTrigger>
                  <AccordionContent>
                    {/* Show unanimous vote message if applicable */}
                    {isUnanimousVote(currentVote) ? (
                      <div className="mb-6 p-4 bg-green-50 dark:bg-green-950 border border-green-100 dark:border-green-900 rounded-md">
                        <div className="flex items-center gap-2 text-green-800 dark:text-green-300">
                          <Users className="h-5 w-5" />
                          <h4 className="font-semibold">Votação Unânime</h4>
                        </div>
                        <p className="mt-2 text-green-700 dark:text-green-400">
                          Esta proposta foi aprovada por unanimidade.
                        </p>
                      </div>
                    ) : (
                      <>
                        {/* Show participation warning when any deputy is absent */}
                        {currentVote.deputyStats && (() => {
                          const totalVoting = weightedCounts.favor + weightedCounts.against + weightedCounts.abstention;
                          const absentCount = currentVote.deputyStats.totalDeputies - totalVoting;
                          
                          // Show if any deputies are absent
                          if (absentCount > 0) {
                            return (
                              <div className="mb-4 p-2 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-900 rounded-md">
                                <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300">
                                  <Users className="h-4 w-4" />
                                  <span className="text-sm">
                                    ⚠️ {absentCount} deputado{absentCount > 1 ? 's' : ''} ausente{absentCount > 1 ? 's' : ''} nesta votação
                                  </span>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        })()}
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                          <Card className="bg-green-50 dark:bg-green-950 border-green-100 dark:border-green-900">
                            <CardContent className="p-4 flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-green-600 dark:text-green-400">A Favor</p>
                                <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                                  {weightedCounts.favor}
                                </p>
                                <p className="text-xs text-green-600 dark:text-green-400">deputados</p>
                              </div>
                              <ThumbsUp className="h-8 w-8 text-green-500 dark:text-green-400" />
                            </CardContent>
                          </Card>
                          <Card className="bg-red-50 dark:bg-red-950 border-red-100 dark:border-red-900">
                            <CardContent className="p-4 flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-red-600 dark:text-red-400">Contra</p>
                                <p className="text-2xl font-bold text-red-700 dark:text-red-300">
                                  {weightedCounts.against}
                                </p>
                                <p className="text-xs text-red-600 dark:text-red-400">deputados</p>
                              </div>
                              <ThumbsDown className="h-8 w-8 text-red-500 dark:text-red-400" />
                            </CardContent>
                          </Card>
                          <Card className="bg-gray-50 dark:bg-gray-900 border-gray-100 dark:border-gray-800">
                            <CardContent className="p-4 flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Abstenção</p>
                                <p className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                                  {weightedCounts.abstention}
                                </p>
                                <p className="text-xs text-gray-600 dark:text-gray-400">deputados</p>
                              </div>
                              <Minus className="h-8 w-8 text-gray-500 dark:text-gray-400" />
                            </CardContent>
                          </Card>
                        </div>
                      </>
                    )}
                    
                    {currentVote.result && (
                      <div className="mb-4">
                        <h4 className="font-semibold mb-1">Resultado:</h4>
                        <Badge className={
                          currentVote.result.toLowerCase().includes("aprovad") 
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            : currentVote.result.toLowerCase().includes("rejeitad")
                              ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                        }>
                          {currentVote.result}
                        </Badge>
                      </div>
                    )}
                    
                    {!isUnanimousVote(currentVote) && currentVote.partyVotesWithDeputies && currentVote.partyVotesWithDeputies.length > 0 ? (
                      <>
                        <h4 className="font-semibold mb-3">Votação por Partido</h4>
                        <div className="space-y-3">
                          {currentVote.partyVotesWithDeputies.map((partyVote) => (
                            <div key={partyVote.party} className="border rounded-lg p-3 bg-muted/30 relative">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div 
                                    className="w-4 h-4 rounded-full"
                                    style={{ backgroundColor: partyColors[normalizePartyName(partyVote.party)] || '#888888' }}
                                  />
                                  <span className="font-medium">{partyVote.party}</span>
                                  <span className="text-sm text-muted-foreground">
                                    ({partyVote.totalDeputies} deputados total)
                                  </span>
                                  {partyVote.hasPartyVote === false ? (
                                    <span className="text-xs text-muted-foreground">
                                      • Sem voto de bancada (apenas votos individuais)
                                    </span>
                                  ) : partyVote.votingDeputies !== partyVote.totalDeputies && partyVote.dissidents && partyVote.dissidents.length > 0 ? (
                                    <span className="text-xs text-muted-foreground">
                                      • {partyVote.votingDeputies} seguiram a bancada, {partyVote.dissidents.length} dissidentes
                                    </span>
                                  ) : null}
                                </div>
                                <div className="flex items-center gap-2">
                                  {partyVote.hasPartyVote !== false && (
                                    <Badge
                                      className={
                                        partyVote.vote === "favor"
                                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                          : partyVote.vote === "against"
                                            ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                                            : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                                      }
                                    >
                                      {partyVote.vote === "favor" ? (
                                        <Check className="mr-1 h-3 w-3" />
                                      ) : partyVote.vote === "against" ? (
                                        <X className="mr-1 h-3 w-3" />
                                      ) : (
                                        <Minus className="mr-1 h-3 w-3" />
                                      )}
                                      {partyVote.vote === "favor" ? "A Favor" : partyVote.vote === "against" ? "Contra" : "Abstenção"}
                                    </Badge>
                                  )}
                                  {partyVote.dissidents && partyVote.dissidents.length > 0 && (
                                    <button 
                                      className="p-1 hover:bg-muted/50 rounded flex items-center gap-1"
                                      onClick={() => togglePartyExpansion(partyVote.party)}
                                    >
                                      <span className="text-xs text-muted-foreground">
                                        {partyVote.hasPartyVote === false 
                                          ? `${partyVote.dissidents.length} deputado${partyVote.dissidents.length > 1 ? 's' : ''}`
                                          : `${partyVote.dissidents.length} dissident${partyVote.dissidents.length > 1 ? 'es' : 'e'}`
                                        }
                                      </span>
                                      {expandedParties.has(partyVote.party) ? (
                                        <ChevronDown className="h-4 w-4" />
                                      ) : (
                                        <ChevronRight className="h-4 w-4" />
                                      )}
                                    </button>
                                  )}
                                </div>
                              </div>
                              {expandedParties.has(partyVote.party) && partyVote.dissidents && partyVote.dissidents.length > 0 && (
                                <div className="mt-3 pt-3 border-t border-muted-foreground/20">
                                  <div className="space-y-2">
                                    <h5 className="text-sm font-medium text-muted-foreground">
                                      {partyVote.hasPartyVote === false 
                                        ? "Deputados (votação individual):"
                                        : "Deputados Dissidentes:"
                                      }
                                    </h5>
                                    {partyVote.dissidents.map((dissident, idx) => (
                                      <div key={idx} className="flex items-center justify-between text-sm">
                                        <span>{dissident.name || `Deputado ${idx + 1}`}</span>
                                        <Badge variant="outline" className="text-xs">
                                          {dissident.vote === "favor" ? "A Favor" : 
                                           dissident.vote === "against" ? "Contra" : "Abstenção"}
                                        </Badge>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </>
                    ) : !isUnanimousVote(currentVote) && Object.keys(currentVote.parties || {}).length > 0 ? (
                      // Fallback to original display if enhanced data is not available
                      <>
                        <h4 className="font-semibold mb-3">Votação por Partido</h4>
                        <div className="space-y-2">
                          {Object.entries(currentVote.parties || {}).map(([party, vote]) => (
                            <div key={party} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                              <span className="font-medium">{party}</span>
                              <Badge
                                className={
                                  vote === "favor"
                                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                    : vote === "against"
                                      ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                                      : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                                }
                              >
                                {vote === "favor" ? (
                                  <Check className="mr-1 h-3 w-3" />
                                ) : vote === "against" ? (
                                  <X className="mr-1 h-3 w-3" />
                                ) : null}
                                {vote === "favor" ? "A Favor" : vote === "against" ? "Contra" : "Abstenção"}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      !isUnanimousVote(currentVote) && (
                        <p className="text-muted-foreground">Não há informações detalhadas de votação disponíveis.</p>
                      )
                    )}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
}
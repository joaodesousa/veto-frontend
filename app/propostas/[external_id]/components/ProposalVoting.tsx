"use client";
import { Check, ThumbsDown, ThumbsUp, X, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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

// Define the props type for the ProposalVoting component
interface ProposalVotingProps {
  votes: Votes;
}

export function ProposalVoting({ votes }: ProposalVotingProps) {
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

  // Helper function to check if a vote is unanimous
  const isUnanimousVote = (vote: VoteRecord) => {
    return Object.keys(vote.parties || {}).length === 1 && 
           Object.keys(vote.parties || {})[0] === "Todos os partidos";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resultados da Votação</CardTitle>
        <CardDescription>Como votaram os partidos</CardDescription>
      </CardHeader>
      <CardContent>
        {voteRecords.length === 0 ? (
          <div>
            <p className="text-muted-foreground">Não há informações de votação disponíveis.</p>
          </div>
        ) : (
          <Accordion type="single" collapsible defaultValue={`vote-${voteRecords.length - 1}`}>
            {voteRecords.map((currentVote, index) => (
              <AccordionItem key={index} value={`vote-${index}`}>
                <AccordionTrigger>
                  {currentVote.description ? (
                    <span className="text-left">{currentVote.description}</span>
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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <Card className="bg-green-50 dark:bg-green-950 border-green-100 dark:border-green-900">
                        <CardContent className="p-4 flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-green-600 dark:text-green-400">A Favor</p>
                            <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                              {currentVote.favor}
                            </p>
                          </div>
                          <ThumbsUp className="h-8 w-8 text-green-500 dark:text-green-400" />
                        </CardContent>
                      </Card>
                      <Card className="bg-red-50 dark:bg-red-950 border-red-100 dark:border-red-900">
                        <CardContent className="p-4 flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-red-600 dark:text-red-400">Contra</p>
                            <p className="text-2xl font-bold text-red-700 dark:text-red-300">
                              {currentVote.against}
                            </p>
                          </div>
                          <ThumbsDown className="h-8 w-8 text-red-500 dark:text-red-400" />
                        </CardContent>
                      </Card>
                      <Card className="bg-gray-50 dark:bg-gray-900 border-gray-100 dark:border-gray-800">
                        <CardContent className="p-4 flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Abstenção</p>
                            <p className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                              {currentVote.abstention}
                            </p>
                          </div>
                          <span className="h-8 w-8 rounded-full border-2 border-gray-400 dark:border-gray-500 flex items-center justify-center text-gray-500 dark:text-gray-400">
                            ?
                          </span>
                        </CardContent>
                      </Card>
                    </div>
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
                  
                  {!isUnanimousVote(currentVote) && Object.keys(currentVote.parties || {}).length > 0 ? (
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
            ))}
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
}
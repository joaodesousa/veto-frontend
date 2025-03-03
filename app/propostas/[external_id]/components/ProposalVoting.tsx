"use client"
import { Check, ThumbsDown, ThumbsUp, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Define the type for the votes object
interface VoteRecord {
  favor: number;
  against: number;
  abstention: number;
  parties: {
    [key: string]: "favor" | "against" | "abstention";
  };
  result: string;
  date: string;
}

interface Votes extends VoteRecord {
  allVotes: VoteRecord[];
}

// Define the props type for the ProposalVoting component
interface ProposalVotingProps {
  votes: Votes;
}

export function ProposalVoting({ votes }: ProposalVotingProps) {
  const hasMultipleVotes = votes.allVotes && votes.allVotes.length > 1;
  
  // Se não houver votos ou se allVotes estiver vazio, use o próprio objeto votes
  const voteRecords = hasMultipleVotes ? votes.allVotes : [votes];

  // Formatar a data para exibição
  const formatDate = (dateString: string) => {
    if (!dateString) return "Data não disponível";

    // Attempt to create a date object
    const date = new Date(dateString);

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return "Data inválida"; // Return a user-friendly message for invalid dates
    }

    // Format the date if valid
    return date.toLocaleDateString('pt-PT', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resultados da Votação</CardTitle>
        <CardDescription>Como votaram os deputados e partidos</CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible>
          {voteRecords.map((currentVote, index) => (
            <AccordionItem key={index} value={`vote-${index}`}>
              <AccordionTrigger>
                Votação {index + 1} - {formatDate(currentVote.date)}
              </AccordionTrigger>
              <AccordionContent>
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
                
                {Object.keys(currentVote.parties).length > 0 ? (
                  <>
                    <h4 className="font-semibold mb-3">Votação por Partido</h4>
                    <div className="space-y-2">
                      {Object.entries(currentVote.parties).map(([party, vote]) => (
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
                  <p className="text-muted-foreground">Não há informações de votação disponíveis.</p>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  )
}
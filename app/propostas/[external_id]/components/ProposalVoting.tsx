import { Check, ThumbsDown, ThumbsUp, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Define the type for the votes object
interface Votes {
  favor: number;
  against: number;
  abstention: number;
  parties: {
    [key: string]: "favor" | "against" | "abstention";
  };
}

// Define the props type for the ProposalVoting component
interface ProposalVotingProps {
  votes: Votes;
}

export function ProposalVoting({ votes }: ProposalVotingProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Resultados da Votação</CardTitle>
        <CardDescription>Como votaram os deputados e partidos</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="bg-green-50 dark:bg-green-950 border-green-100 dark:border-green-900">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">A Favor</p>
                <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                  {votes.favor}
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
                  {votes.against}
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
                  {votes.abstention}
                </p>
              </div>
              <span className="h-8 w-8 rounded-full border-2 border-gray-400 dark:border-gray-500 flex items-center justify-center text-gray-500 dark:text-gray-400">
                ?
              </span>
            </CardContent>
          </Card>
        </div>
        {Object.keys(votes.parties).length > 0 ? (
          <>
            <h4 className="font-semibold mb-3">Votação por Partido</h4>
            <div className="space-y-2">
              {Object.entries(votes.parties).map(([party, vote]) => (
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
      </CardContent>
    </Card>
  )
}
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface RelatedProposal {
  id: string;
  external_id: string;
  title: string;
  type: string;
  number: string;
  date: string;
  party?: string;
  status?: string;
}

interface ProposalRelatedProps {
  relatedProposals: RelatedProposal[];
  className?: string;
}

export function ProposalRelated({ relatedProposals, className }: ProposalRelatedProps) {
  // If there are no related proposals, return early with a message
  if (!relatedProposals || relatedProposals.length === 0) {
    return (
      <Card className={`border-blue-100 dark:border-blue-800 ${className}`}>
        <CardHeader>
          <CardTitle>Propostas Relacionadas</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Não há propostas relacionadas disponíveis.</p>
        </CardContent>
      </Card>
    )
  }

  // Limit the number of proposals shown to 3 (can adjust as needed)
  const displayProposals = relatedProposals.slice(0, 3);
  const hasMoreProposals = relatedProposals.length > displayProposals.length;

  // If we have related proposals, display them
  return (
    <Card className={`border-blue-100 dark:border-blue-800 ${className}`}>
      <CardHeader>
        <CardTitle>Propostas Relacionadas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {displayProposals.map((item, index) => (
          <div key={index} className="rounded-md border p-3 hover:bg-muted/50 transition-colors">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-sm">{item.number || `${item.type} ${item.external_id}`}</p>
                <p className="text-xs text-muted-foreground mt-1">{item.title}</p>
              </div>
              {item.party && (
                <Badge variant="outline" className="text-xs">
                  {item.party}
                </Badge>
              )}
            </div>
            <Button variant="link" size="sm" className="px-0 h-auto mt-2 gap-1" asChild>
              <Link href={`/propostas/${item.external_id}`}>
                Ver proposta
                <ArrowRight className="h-3 w-3" />
              </Link>
            </Button>
          </div>
        ))}
      </CardContent>
      {hasMoreProposals && (
        <CardFooter>
          <Button variant="outline" size="sm" className="w-full gap-1.5">
            Ver Mais Propostas Relacionadas
            <ArrowRight className="h-4 w-4" />
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
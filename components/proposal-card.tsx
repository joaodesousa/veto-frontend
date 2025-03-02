import { ArrowRight, Calendar, FileText } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface ProposalCardProps {
  title: string
  number: string
  status: string
  date: string
  party: string
  tags: string[]
}

export function ProposalCard({ title, number, status, date, party, tags }: ProposalCardProps) {
  const statusColor =
    {
      Aprovada: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      Rejeitada: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      "Em Comissão": "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
      "Em Discussão": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      Agendada: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    }[status] || "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"

  const partyColor =
    {
      PS: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
      PSD: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
      BE: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      PCP: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      CH: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      GOV: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
    }[party] || "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md animate-in">
      <CardHeader className="p-4 pb-0 flex flex-row justify-between items-start">
        <div className="flex flex-col">
          <div className="flex flex-wrap gap-2 mb-2">
            <Badge variant="outline" className={cn("font-medium", statusColor)}>
              {status}
            </Badge>
            <Badge variant="outline" className={cn("font-medium", partyColor)}>
              {party}
            </Badge>
          </div>
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <div className="flex flex-col gap-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <FileText className="mr-1 h-4 w-4" />
            <span>{number}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="mr-1 h-4 w-4" />
            <span>{date}</span>
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button variant="ghost" size="sm" className="gap-1 ml-auto">
          Ver detalhes
          <ArrowRight className="h-3 w-3" />
        </Button>
      </CardFooter>
    </Card>
  )
}


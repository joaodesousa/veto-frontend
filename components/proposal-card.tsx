import { ArrowRight, Calendar, FileText } from "lucide-react"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { getPartyColor } from "@/app/utils/colors"

interface ProposalCardProps {
  title: string
  number: string
  status: string
  date: string
  party: string
  type: string
  iniId?: string
}

export function ProposalCard({ title, number, status, date, party, type, iniId }: ProposalCardProps) {
  // Ensure party and type are not empty
  const displayParty = party

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md animate-in flex flex-col h-full">
      <CardHeader className="p-4 pb-0 flex flex-row justify-between items-start">
        <div className="flex flex-col">
          <div className="flex flex-wrap gap-2 mb-2">
            <Badge variant="outline" className="font-medium">
              {status}
            </Badge>
            <Badge className={`font-medium ${getPartyColor(displayParty)}`}>
              {displayParty}
            </Badge>
          </div>
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2 flex-1">
        <div className="flex flex-col gap-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <FileText className="mr-1 h-4 w-4" />
            <span>{type}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="mr-1 h-4 w-4" />
            <span>{new Date(date).toLocaleDateString('pt-PT')}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 mt-auto">
        <Button variant="ghost" size="sm" className="gap-1 ml-auto" asChild>
          <Link href={`/propostas/${iniId || number}`}>
            Ver detalhes
            <ArrowRight className="h-3 w-3" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
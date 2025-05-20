import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

interface IssueCardProps {
  title: string
  description: string
  icon: string
  partiesCount: number
  importance?: number
}

export function IssueCard({ title, description, icon, partiesCount, importance }: IssueCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <div className="text-4xl">{icon}</div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-xl">{title}</h3>
              {importance && (
                <Badge
                  className={
                    importance > 70
                      ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                      : importance > 50
                        ? "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
                        : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                  }
                >
                  {importance}% prioridade
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
            <p className="text-xs mt-2">{partiesCount} partidos com propostas</p>

            {importance && (
              <div className="mt-3">
                <Progress
                  value={importance}
                  className="h-2 bg-muted"
                  indicatorClassName={
                    importance > 70 ? "bg-red-500" : importance > 50 ? "bg-amber-500" : "bg-green-500"
                  }
                />
                <p className="text-xs text-muted-foreground mt-1">Importância para os eleitores</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="pb-4">
        <Button variant="ghost" size="sm" className="gap-1 ml-auto" asChild>
          <Link href={`/eleicoes/temas/${title.toLowerCase()}`}>
            Ver propostas
            <ArrowRight className="h-3 w-3" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}


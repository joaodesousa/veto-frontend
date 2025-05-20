import Link from "next/link"
import Image from "next/image"
import { ArrowRight, TrendingDown, TrendingUp } from "lucide-react"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

interface PartyCardProps {
  acronym: string
  name: string
  color: string
  logo: string
  leader: string
  currentPolls?: number
  previousResult?: number
  trend?: "up" | "down" | "stable"
}

export function PartyCard({ acronym, name, color, logo, leader, currentPolls, previousResult, trend }: PartyCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="relative">
        <div className="h-2" style={{ backgroundColor: color }} />
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-full overflow-hidden border-2 flex-shrink-0"
              style={{ borderColor: color }}
            >
              <Image
                src={logo || "/placeholder.svg"}
                alt={`Logo ${acronym}`}
                width={64}
                height={64}
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="font-bold text-xl">{acronym}</h3>
              <p className="text-sm text-muted-foreground">{name}</p>
              <p className="text-xs mt-1">Líder: {leader}</p>
            </div>
          </div>

          {currentPolls && previousResult && (
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Sondagens atuais</span>
                <div className="flex items-center gap-1">
                  <span className="font-medium">{currentPolls}%</span>
                  {trend && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          {trend === "up" ? (
                            <TrendingUp className="h-4 w-4 text-green-500" />
                          ) : trend === "down" ? (
                            <TrendingDown className="h-4 w-4 text-red-500" />
                          ) : null}
                        </TooltipTrigger>
                        <TooltipContent>
                          {trend === "up"
                            ? `+${(currentPolls - previousResult).toFixed(1)}% desde as últimas eleições`
                            : `-${(previousResult - currentPolls).toFixed(1)}% desde as últimas eleições`}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              </div>
              <Progress
                value={currentPolls}
                className="h-2 bg-muted"
                indicatorClassName={cn("transition-all", {
                  "bg-green-500": trend === "up",
                  "bg-red-500": trend === "down",
                  "bg-blue-500": trend === "stable" || !trend,
                })}
              />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Resultado anterior: {previousResult}%</span>
                <span>
                  {trend === "up"
                    ? `+${(currentPolls - previousResult).toFixed(1)}%`
                    : trend === "down"
                      ? `-${(previousResult - currentPolls).toFixed(1)}%`
                      : "0%"}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </div>
      <CardFooter className="pb-4">
        <Button variant="ghost" size="sm" className="gap-1 ml-auto" asChild>
          <Link href={`/eleicoes/partidos/${acronym.toLowerCase()}`}>
            Ver programa
            <ArrowRight className="h-3 w-3" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}


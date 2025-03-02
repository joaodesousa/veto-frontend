import type React from "react"
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface StatsCardProps {
  title: string
  value: string
  description: string
  icon: React.ReactNode
  trend: string
  trendUp: boolean | null
}

export function StatsCard({ title, value, description, icon, trend, trendUp }: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <CardDescription className="flex items-center text-xs mt-1">{description}</CardDescription>
        {trend && (
          <div className="flex items-center mt-2 text-xs">
            {trendUp !== null &&
              (trendUp ? (
                <ArrowUpIcon className="h-3 w-3 mr-1 text-green-500" />
              ) : (
                <ArrowDownIcon className="h-3 w-3 mr-1 text-red-500" />
              ))}
            <span className={trendUp === null ? "text-muted-foreground" : trendUp ? "text-green-500" : "text-red-500"}>
              {trend}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}


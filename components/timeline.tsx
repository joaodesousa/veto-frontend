import type React from "react"
import { cn } from "@/lib/utils"

interface TimelineProps {
  children: React.ReactNode
  className?: string
}

export function Timeline({ children, className }: TimelineProps) {
  return <div className={cn("space-y-4", className)}>{children}</div>
}

interface TimelineItemProps {
  date: string
  title: string
  description: string
  isLast?: boolean
  className?: string
}

export function TimelineItem({ date, title, description, isLast = false, className }: TimelineItemProps) {
  return (
    <div className={cn("flex gap-4", className)}>
      <div className="flex flex-col items-center">
        <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary bg-background z-10">
          <div className="h-3 w-3 rounded-full bg-primary" />
        </div>
        {!isLast && <div className="h-full w-px bg-border" />}
      </div>
      <div className="pb-8 pt-1">
        <div className="text-sm text-muted-foreground">{date}</div>
        <div className="font-medium mt-0.5">{title}</div>
        <div className="text-sm text-muted-foreground mt-1">{description}</div>
      </div>
    </div>
  )
}


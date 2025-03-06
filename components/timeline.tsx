// components/timeline.tsx
import type React from "react"
import { cn } from "@/lib/utils"

interface TimelineProps {
  children: React.ReactNode
  className?: string
}

export function Timeline({ children, className }: TimelineProps) {
  return <div className={cn("space-y-4", className)}>{children}</div>
}

// Update the TimelineItem interface to include subitems
interface TimelineItemProps {
  date: string
  title: string
  description: string
  isLast?: boolean
  className?: string
  subitems?: Array<{
    date: string
    title: string
    description: string
  }>
}

export function TimelineItem({ date, title, description, isLast = false, className, subitems }: TimelineItemProps) {
  return (
    <div className={cn("flex gap-4", className)}>
      <div className="flex flex-col items-center">
        <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary bg-background z-10">
          <div className="h-3 w-3 rounded-full bg-primary" />
        </div>
        {/* Only show the line if there are subitems or it's not the last item */}
        {(!isLast || (subitems && subitems.length > 0)) && <div className="h-full w-px bg-border" />}
      </div>
      <div className={cn("pb-8 pt-1", isLast && !subitems?.length && "pb-0")}>
        <div className="text-sm text-muted-foreground">{date}</div>
        <div className="font-medium mt-0.5">{title}</div>
        {description && <div className="text-sm text-muted-foreground mt-1">{description}</div>}
        {/* Render subitems if they exist */}
        {subitems && subitems.length > 0 && (
          <div className="mt-4 ml-2 border-l border-dashed border-border pl-4 space-y-4">
            {subitems.map((subitem, index) => (
              <div key={index} className="relative">
                <div className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full bg-muted-foreground"></div>
                <div className="text-xs text-muted-foreground">{subitem.date}</div>
                <div className="text-sm font-medium mt-0.5">{subitem.title}</div>
                {subitem.description && <div className="text-xs text-muted-foreground mt-1">{subitem.description}</div>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
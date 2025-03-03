import type React from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface PaginationProps extends React.HTMLAttributes<HTMLDivElement> {
  currentPage?: number
  totalPages?: number
}

export function Pagination({ className, currentPage = 1, totalPages = 10, ...props }: PaginationProps) {
  return (
    <div className={cn("flex items-center justify-center space-x-2", className)} {...props}>
      <Button variant="outline" size="icon" className="h-8 w-8">
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Página anterior</span>
      </Button>
      <Button variant="outline" size="sm" className="h-8 min-w-[32px]">
        1
      </Button>
      <Button variant="outline" size="sm" className="h-8 min-w-[32px]">
        2
      </Button>
      <Button variant="outline" size="sm" className="h-8 min-w-[32px]">
        3
      </Button>
      <Button variant="outline" size="sm" className="h-8 min-w-[32px]" disabled>
        <MoreHorizontal className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="sm" className="h-8 min-w-[32px]">
        8
      </Button>
      <Button variant="outline" size="sm" className="h-8 min-w-[32px]">
        9
      </Button>
      <Button variant="outline" size="sm" className="h-8 min-w-[32px]">
        10
      </Button>
      <Button variant="outline" size="icon" className="h-8 w-8">
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Próxima página</span>
      </Button>
    </div>
  )
}


// components/filter-skeleton.tsx
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"

export function FilterSkeleton() {
  return (
    <div className="space-y-4">
      {/* Topics/Types Filter Skeleton (Now at the top) */}
      <div>
        <Skeleton className="h-5 w-24 mb-4" />
        <ScrollArea className="h-[200px] pr-4">
          <div className="space-y-3">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="flex items-center space-x-2">
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-4 w-36" />
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      <Separator />

      {/* Status/Phases Filter Skeleton (Now with scroll) */}
      <div>
        <Skeleton className="h-5 w-24 mb-4" />
        <ScrollArea className="h-[200px] pr-4">
          <div className="space-y-3">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="flex items-center space-x-2">
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-4 w-28" />
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      <Separator />

      {/* Authors Filter Skeleton (Now named "Autor") */}
      <div>
        <Skeleton className="h-5 w-24 mb-4" />
        <ScrollArea className="h-[200px] pr-4">
          <div className="space-y-3">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="flex items-center space-x-2">
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      <Separator />

      {/* Date Filter Skeleton */}
      <div>
        <Skeleton className="h-5 w-24 mb-4" />
        <Skeleton className="h-10 w-full rounded" />
      </div>

      <Separator />
      
      {/* Button Skeleton */}
      <Skeleton className="h-10 w-full rounded" />
    </div>
  )
}
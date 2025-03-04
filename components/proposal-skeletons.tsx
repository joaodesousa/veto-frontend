import { Skeleton } from "@/components/ui/skeleton"
import { ProposalCardSkeleton } from "@/components/proposal-skeleton"

export function ProposalSkeletons() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1">
        {/* Header - Static content */}
        <div className="border-b">
          <div className="container py-8">
            <div className="flex flex-col gap-4">
              <h1 className="text-3xl font-bold tracking-tight">Propostas Legislativas</h1>
              <p className="text-muted-foreground">
                Explore e acompanhe todas as propostas em discussão no Parlamento Português.
              </p>
            </div>
          </div>
        </div>

        <div className="container py-6">
          <div className="flex flex-col gap-6">
            {/* Search and Filters Bar - Skeleton */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-1 items-center gap-4">
                <Skeleton className="h-10 w-full max-w-xl" />
                <Skeleton className="h-10 w-10 shrink-0 md:hidden" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-10 w-[180px]" />
                <Skeleton className="h-10 w-20" />
              </div>
            </div>

            {/* Main Content - Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6">
              {/* Filters Sidebar - Skeleton */}
              <div className="hidden md:block space-y-6">
                <Skeleton className="h-8 w-40" />
                <div className="space-y-3">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-24 w-full" />
                </div>
                <Skeleton className="h-8 w-40" />
                <div className="space-y-3">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-24 w-full" />
                </div>
                <Skeleton className="h-8 w-40" />
                <div className="space-y-3">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-24 w-full" />
                </div>
              </div>

              {/* Proposals Grid - Skeleton */}
              <div className="space-y-6">
                {/* Results Count - Skeleton */}
                <Skeleton className="h-5 w-48" />

                {/* Proposals Grid - Skeleton */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {Array(8).fill(0).map((_, i) => (
                    <ProposalCardSkeleton key={i} />
                  ))}
                </div>

                {/* Pagination - Skeleton */}
                <div className="mt-8 flex items-center justify-center space-x-2">
                  <Skeleton className="h-8 w-8 rounded-md" /> {/* Previous button */}
                  <Skeleton className="h-8 min-w-[32px] rounded-md" /> {/* Page 1 */}
                  <Skeleton className="h-8 min-w-[32px] rounded-md" /> {/* Page 2 */}
                  <Skeleton className="h-8 min-w-[32px] rounded-md" /> {/* Page 3 */}
                  <Skeleton className="h-8 min-w-[32px] rounded-md" /> {/* Ellipsis */}
                  <Skeleton className="h-8 min-w-[32px] rounded-md" /> {/* Last page */}
                  <Skeleton className="h-8 w-8 rounded-md" /> {/* Next button */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
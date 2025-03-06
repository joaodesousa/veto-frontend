"use client"
import { Filter, Search } from "lucide-react"
import { useState, useEffect, useCallback } from "react"
import type { DateRange } from "react-day-picker"
import { debounce } from "lodash"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ProposalCard } from "@/components/proposal-card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { ProposalFilters } from "@/components/proposal-filters"
import { Pagination } from "@/components/pagination"
import { Skeleton } from "@/components/ui/skeleton"
import { ProposalCardSkeleton } from "@/components/proposal-skeleton" 
import { FilterSkeleton } from "@/components/filter-skeleton"

import { fetchProposals, fetchTypes, fetchPhases, fetchAuthors } from "@/lib/api"
import { Proposal, Author } from "@/lib/types"

export default function PropostasPage() {
  // State for managing proposals and pagination
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [totalProposals, setTotalProposals] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filtering and search states
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [selectedPhases, setSelectedPhases] = useState<string[]>([])
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([])
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [orderBy, setOrderBy] = useState("recentes")
  
  // Filter options data
  const [allTypes, setAllTypes] = useState<string[]>([])
  const [allPhases, setAllPhases] = useState<string[]>([])
  const [allAuthors, setAllAuthors] = useState<Author[]>([])
  const [filterDataReady, setFilterDataReady] = useState(false)
  const [filterOptionsError, setFilterOptionsError] = useState<string | null>(null)

  // Flag to prevent double loading
  const [initialLoadComplete, setInitialLoadComplete] = useState(false)

  // Create debounced search handler
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSetSearch = useCallback(
    debounce((value: string) => {
      setDebouncedSearchTerm(value)
    }, 500),
    []
  )
  
  // Update debounced search term when searchTerm changes
  useEffect(() => {
    debouncedSetSearch(searchTerm)
    
    // Cancel debounce on cleanup
    return () => {
      debouncedSetSearch.cancel()
    }
  }, [searchTerm, debouncedSetSearch])

  // First, fetch filter data
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        // Fetch all filter options in parallel
        const [typesData, phasesData, authorsData] = await Promise.all([
          fetchTypes(),
          fetchPhases(),
          fetchAuthors(),
        ]);
        
        // Safely handle types data - ensure it's an array
        if (Array.isArray(typesData)) {
          setAllTypes(typesData.filter((type) => type !== "Todos" && type !== null && type !== undefined));
        } else {
          console.warn("Types data is not an array:", typesData);
          setAllTypes([]);
        }
        
        // Safely handle phases data - ensure it's an array
        if (Array.isArray(phasesData)) {
          setAllPhases(phasesData.filter((phase) => phase !== "Todas" && phase !== null && phase !== undefined));
        } else {
          console.warn("Phases data is not an array:", phasesData);
          setAllPhases([]);
        }
        
        // Safely handle authors data - ensure it's an array
        if (Array.isArray(authorsData)) {
          setAllAuthors(authorsData);
        } else {
          console.warn("Authors data is not an array:", authorsData);
          setAllAuthors([]);
        }
        
        setFilterDataReady(true);
      } catch (err) {
        setFilterOptionsError("Failed to load filter options");
        console.error("Error fetching filter options:", err);
        // Even if filter data fails, we should still allow proposals to load
        setFilterDataReady(true);
      }
    };
    
    fetchFilterOptions();
  }, []);

  // Once filters are ready (or if there's an error loading them), fetch proposals
  useEffect(() => {
    if (!filterDataReady || initialLoadComplete) return;
    
    const fetchInitialProposals = async () => {
      setLoading(true);
      try {
        const response = await fetchProposals({
          page: currentPage,
          search: debouncedSearchTerm,
          types: selectedTypes,
          phases: selectedPhases,
          authors: selectedAuthors,
          dateRange,
          orderBy
        });
        
        setProposals(response.results);
        setTotalProposals(response.count);
        setInitialLoadComplete(true);
      } catch (err) {
        setError("Failed to load proposals");
        console.error("Error fetching initial proposals:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchInitialProposals();
  }, [
    filterDataReady, 
    initialLoadComplete, 
    currentPage, 
    debouncedSearchTerm, 
    selectedTypes, 
    selectedPhases, 
    selectedAuthors, 
    dateRange, 
    orderBy
  ]);

  // For subsequent loads after filter/page changes (only run if initial load is complete)
  useEffect(() => {
    if (!initialLoadComplete) return;
    
    const fetchProposalData = async () => {
      setLoading(true);
      try {
        const response = await fetchProposals({
          page: currentPage,
          search: debouncedSearchTerm,
          types: selectedTypes,
          phases: selectedPhases,
          authors: selectedAuthors,
          dateRange,
          orderBy
        });
        
        setProposals(response.results);
        setTotalProposals(response.count);
      } catch (err) {
        setError("Failed to load proposals");
        console.error("Error fetching proposals:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProposalData();
  }, [
    initialLoadComplete,
    currentPage, 
    debouncedSearchTerm, 
    selectedTypes, 
    selectedPhases, 
    selectedAuthors, 
    dateRange, 
    orderBy
  ]);
  

  const handleFiltersChange = useCallback((types: string[], phases: string[], authors: string[], dateRangeValue: DateRange | undefined) => {
    setSelectedTypes(types);
    setSelectedPhases(phases);
    setSelectedAuthors(authors);
    setDateRange(dateRangeValue);
    setCurrentPage(1); // Reset to first page when filters change
  }, []);

  // Function to remove a filter
  const removeFilter = (filterType: string, value: string) => {
    switch (filterType) {
      case 'types':
        setSelectedTypes(prev => prev.filter(type => type !== value))
        break
      case 'phases':
        // Fixed bug: was using phase variable instead of value
        setSelectedPhases(prev => prev.filter(phase => phase !== value))
        break
      case 'authors':
        setSelectedAuthors(prev => prev.filter(author => author !== value))
        break
    }
  }

  // Handle severe error state
  if (error) {
    return <div className="container py-8 text-destructive">{error}</div>
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1">
        {/* Header - Always visible */}
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
            {/* Search and Filters Bar - Always visible */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-1 items-center gap-4">
                <div className="relative flex-1 max-w-xl">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="search" 
                    placeholder="Pesquisar propostas..." 
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value)
                    }}
                  />
                </div>
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-full sm:w-[360px]">
                    <SheetHeader>
                      <SheetTitle>Filtros</SheetTitle>
                    </SheetHeader>
                    <Separator className="my-4" />
                    {!filterDataReady ? (
                      <FilterSkeleton />
                    ) : (
                      <ProposalFilters 
                        allTypes={allTypes}
                        allPhases={allPhases}
                        allAuthors={allAuthors}
                        onFiltersChange={(types, phases, authors, dateRange) => {
                          setSelectedTypes(types);
                          setSelectedPhases(phases);
                          setSelectedAuthors(authors);
                          setDateRange(dateRange);
                          setCurrentPage(1); // Reset to first page when filters change
                        }}
                      />
                    )}
                  </SheetContent>
                </Sheet>
              </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6">
              {/* Filters Sidebar - Desktop - Always visible */}
              <div className="hidden md:block">
                {!filterDataReady ? (
                  <FilterSkeleton />
                ) : (
                  <ProposalFilters 
                    allTypes={allTypes}
                    allPhases={allPhases}
                    allAuthors={allAuthors}
                    onFiltersChange={handleFiltersChange}
                  />
                )}
              </div>

              {/* Proposals Grid - Shows skeletons while loading */}
              <div className="space-y-6">
                {/* Results Count - Shows skeleton while loading */}
                <div className="text-sm text-muted-foreground">
                  {loading ? (
                    <Skeleton className="h-5 w-48" />
                  ) : (
                    `${totalProposals} propostas encontradas`
                  )}
                </div>

                {/* Proposals Grid - Shows skeletons while loading */}
                {loading ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {Array(8).fill(0).map((_, i) => (
                      <ProposalCardSkeleton key={i} />
                    ))}
                  </div>
                ) : proposals.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {proposals.map((proposal) => {
                      // Safely extract the latest phase name
                      const latestPhase = proposal.phases && Array.isArray(proposal.phases) && proposal.phases.length > 0
                        ? proposal.phases[proposal.phases.length - 1]
                        : null;
                      
                      const phaseDisplay = latestPhase 
                        ? (typeof latestPhase === 'string' ? latestPhase : (latestPhase.name || 'Sem estado'))
                        : 'Sem estado';
                      
                      // Safely extract the party/author
                      let partyDisplay = "Desconhecido";
                      if (proposal.authors && Array.isArray(proposal.authors)) {
                        // First try to find a "Grupo" type author
                        const partyAuthor = proposal.authors.find(a => 
                          a && typeof a === 'object' && a.author_type === "Grupo"
                        );
                        
                        if (partyAuthor) {
                          partyDisplay = typeof partyAuthor.name === 'string' ? partyAuthor.name : "Desconhecido";
                        } else {
                          // If no party, try to find "Outro" type
                          const otherAuthor = proposal.authors.find(a => 
                            a && typeof a === 'object' && a.author_type === "Outro"
                          );
                          
                          if (otherAuthor) {
                            partyDisplay = typeof otherAuthor.name === 'string' ? otherAuthor.name : "Desconhecido";
                          }
                        }
                      }
                      
                      return (
                        <ProposalCard
                          key={proposal.id}
                          title={proposal.title}
                          number={proposal.external_id}
                          status={phaseDisplay}
                          date={proposal.date}
                          party={partyDisplay}
                          type={proposal.type}
                        />
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    Nenhuma proposta encontrada com os filtros selecionados.
                  </div>
                )}

                {/* Pagination - Shows skeletons while loading */}
                {loading ? (
                  <div className="mt-8 flex items-center justify-center space-x-2">
                    <Skeleton className="h-8 w-8 rounded-md" />
                    <Skeleton className="h-8 min-w-[32px] rounded-md" />
                    <Skeleton className="h-8 min-w-[32px] rounded-md" />
                    <Skeleton className="h-8 min-w-[32px] rounded-md" />
                    <Skeleton className="h-8 w-8 rounded-md" />
                  </div>
                ) : (
                  <Pagination 
                    className="mt-8" 
                    currentPage={currentPage}
                    totalPages={Math.ceil(totalProposals / 10)}
                    onPageChange={(page) => setCurrentPage(page)}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
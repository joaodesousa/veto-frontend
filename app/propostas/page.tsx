"use client"
import { Filter, Search, X } from "lucide-react"
import { useState, useEffect, useCallback, Suspense } from "react"
import type { DateRange } from "react-day-picker"
import { debounce } from "lodash"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ProposalCard } from "@/components/proposal-card"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose, SheetFooter } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { ProposalFilters } from "@/components/proposal-filters"
import { Pagination } from "@/components/pagination"
import { Skeleton } from "@/components/ui/skeleton"
import { ProposalCardSkeleton } from "@/components/proposal-skeleton" 
import { FilterSkeleton } from "@/components/filter-skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"

import { fetchProposals, fetchTypes, fetchPhases, fetchAuthors, fetchParties, fetchLegislaturas } from "@/lib/api"
import { Proposal, Author, ApiResponse, Legislatura } from "@/lib/types"
import { useUrlState } from "@/app/hooks/use-url-state"
import { PHASE_MAPPING, getSmartPhaseBadges } from "@/lib/phase-constants"

function ProposalsContent() {
  // Get URL state handling functions
  const {
    getInitialPage,
    getInitialSearch,
    getInitialFilters,
    updateUrl
  } = useUrlState()

  // Initialize states from URL
  const initialFilters = getInitialFilters()
  const initialPage = getInitialPage()

  // State for managing proposals and pagination
  const [proposals, setProposals] = useState<any[]>([])
  const [totalProposals, setTotalProposals] = useState(0)
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Debug log to track page changes
  useEffect(() => {
  }, [currentPage, initialPage])

  // Filtering and search states - initialized from URL
  const [searchTerm, setSearchTerm] = useState(getInitialSearch())
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(getInitialSearch())
  const [selectedLegislaturas, setSelectedLegislaturas] = useState<string[]>(() => {
    // If there are legislaturas in the URL, use them
    if (initialFilters.legislaturas && initialFilters.legislaturas.length > 0) {
      return initialFilters.legislaturas;
    }
    // Otherwise default to "XVII"
    return ["XVII"];
  })
  const [selectedTypes, setSelectedTypes] = useState<string[]>(initialFilters.types || [])
  const [selectedPhases, setSelectedPhases] = useState<string[]>(initialFilters.phases || [])
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>(initialFilters.authors || [])
  const [selectedParties, setSelectedParties] = useState<string[]>(initialFilters.parties || [])
  const [dateRange, setDateRange] = useState<DateRange | undefined>(initialFilters.dateRange)
  
  // Filter options data
  const [allLegislaturas, setAllLegislaturas] = useState<Legislatura[]>([])
  const [allTypes, setAllTypes] = useState<string[]>([])
  const [allPhases, setAllPhases] = useState<string[]>([])
  const [allAuthors, setAllAuthors] = useState<Author[]>([])
  const [allParties, setAllParties] = useState<Author[]>([])
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

  // Update URL when relevant state changes
  useEffect(() => {
    // Only update URL after initial load is complete to avoid unnecessary navigation
    if (initialLoadComplete) {
      updateUrl({
        page: currentPage,
        search: debouncedSearchTerm,
        filters: {
          legislaturas: selectedLegislaturas,
          types: selectedTypes,
          phases: selectedPhases,
          authors: selectedAuthors,
          parties: selectedParties,
          dateRange: dateRange ? {
            from: dateRange.from as Date,
            to: dateRange.to
          } : undefined
        }
      })
    }
  }, [
    initialLoadComplete,
    currentPage, 
    debouncedSearchTerm,
    selectedLegislaturas,
    selectedTypes, 
    selectedPhases, 
    selectedAuthors, 
    selectedParties,
    dateRange,
    updateUrl
  ])

  // First, fetch filter data
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        // Fetch all filter options in parallel
        const [legislaturasData, typesData, phasesData, authorsData, partiesData] = await Promise.all([
          fetchLegislaturas(),
          fetchTypes(),
          fetchPhases(),
          fetchAuthors(),
          fetchParties(),
        ]);
        
        // Safely handle legislaturas data
        if (Array.isArray(legislaturasData)) {
          // Filter out null/undefined values and store the Legislatura objects
          setAllLegislaturas(legislaturasData
            .filter((legislatura) => legislatura !== null && legislatura !== undefined));
        } else {
          console.warn("Legislaturas data is not an array:", legislaturasData);
          setAllLegislaturas([]);
        }
        
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
        
        // Safely handle parties data - ensure it's an array
        if (Array.isArray(partiesData)) {
          setAllParties(partiesData);
        } else {
          console.warn("Parties data is not an array:", partiesData);
          setAllParties([]);
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
        // Use the URL values during the initial load
        const urlPage = getInitialPage();
        
        const response = await fetchProposals({
          page: urlPage, // Use the URL page rather than the state
          search: debouncedSearchTerm,
          legislaturas: selectedLegislaturas,
          types: selectedTypes,
          phases: selectedPhases,
          authors: selectedAuthors,
          parties: selectedParties,
          dateRange: dateRange ? {
            from: dateRange.from as Date,
            to: dateRange.to
          } : undefined
        });
        
        setProposals(response.data || []);
        setTotalProposals(response.pagination?.total || 0);
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
    getInitialPage, 
    debouncedSearchTerm,
    selectedLegislaturas,
    selectedTypes, 
    selectedPhases, 
    selectedAuthors, 
    selectedParties,
    dateRange, 
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
          legislaturas: selectedLegislaturas,
          types: selectedTypes,
          phases: selectedPhases,
          authors: selectedAuthors,
          parties: selectedParties,
          dateRange: dateRange ? {
            from: dateRange.from as Date,
            to: dateRange.to
          } : undefined,
        });
        
        setProposals(response.data || []);
        setTotalProposals(response.pagination?.total || 0);
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
    selectedLegislaturas,
    selectedTypes, 
    selectedPhases, 
    selectedAuthors, 
    selectedParties,
    dateRange,
  ]);
  

  // Skip the page reset on initial render, only reset page on user-initiated filter changes
  const handleFiltersChange = useCallback((legislaturas: string[], types: string[], phases: string[], authors: string[], parties: string[], dateRangeValue: DateRange | undefined) => {
    setSelectedLegislaturas(legislaturas);
    setSelectedTypes(types);
    setSelectedPhases(phases);
    setSelectedAuthors(authors);
    setSelectedParties(parties);
    setDateRange(dateRangeValue);
    
    // Only reset the page to 1 if we've already completed the initial load
    // This prevents resetting during initialization from URL params
    if (initialLoadComplete) {
      setCurrentPage(1); // Reset to first page when filters change (but only after initial load)
    }
  }, [initialLoadComplete]);

  // Function to remove a filter
  const removeFilter = (filterType: string, value: string) => {
    switch (filterType) {
      case 'legislaturas':
        setSelectedLegislaturas(prev => prev.filter(legislatura => legislatura !== value))
        break
      case 'types':
        setSelectedTypes(prev => prev.filter(type => type !== value))
        break
      case 'phases':
        setSelectedPhases(prev => prev.filter(phase => phase !== value))
        break
      case 'phase-category':
        // Remove all phases from a specific category
        const categoryPhases = PHASE_MAPPING[value] || []
        const availableCategoryPhases = categoryPhases.filter(phase => allPhases.includes(phase))
        setSelectedPhases(prev => prev.filter(phase => !availableCategoryPhases.includes(phase)))
        break
      case 'authors':
        setSelectedAuthors(prev => prev.filter(author => author !== value))
        break
      case 'parties':
        setSelectedParties(prev => prev.filter(party => party !== value))
        break
    }
    
    // Reset to first page when filters change to avoid showing non-existent pages
    if (initialLoadComplete) {
      setCurrentPage(1);
    }
  }

  // Get smart phase badges for display
  const smartPhaseBadges = getSmartPhaseBadges(selectedPhases, allPhases)

  // Handle severe error state
  if (error) {
    return <div className="container py-8 text-destructive">{error}</div>
  }

  return (
    <div className="flex flex-col min-h-screen pt-16">
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
                  <SheetContent side="left" className="w-full sm:w-[360px] flex flex-col">
                    <SheetHeader className="shrink-0 flex-row items-center justify-between">
                      <SheetTitle>Filtros</SheetTitle>
                      <SheetClose asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full">
                          <X className="h-4 w-4" />
                          <span className="sr-only">Fechar filtros</span>
                        </Button>
                      </SheetClose>
                    </SheetHeader>
                    <Separator className="my-4 shrink-0" />
                    <div className="flex-1 overflow-hidden">
                      {!filterDataReady ? (
                        <FilterSkeleton />
                      ) : (
                        <ScrollArea className="h-full pr-4">
                          <ProposalFilters 
                            allLegislaturas={allLegislaturas}
                            allTypes={allTypes}
                            allPhases={allPhases}
                            allAuthors={allAuthors}
                            allParties={allParties}
                            initialLegislaturas={selectedLegislaturas}
                            initialTypes={selectedTypes}
                            initialPhases={selectedPhases}
                            initialAuthors={selectedAuthors}
                            initialParties={selectedParties}
                            initialDateRange={dateRange}
                            onFiltersChange={(legislaturas, types, phases, authors, parties, dateRange) => {
                              setSelectedLegislaturas(legislaturas);
                              setSelectedTypes(types);
                              setSelectedPhases(phases);
                              setSelectedAuthors(authors);
                              setSelectedParties(parties);
                              setDateRange(dateRange);
                              setCurrentPage(1); // Reset to first page when filters change
                            }}
                          />
                        </ScrollArea>
                      )}
                    </div>
                    <SheetFooter className="shrink-0 pt-4">
                      <SheetClose asChild>
                        <Button className="w-full">
                          Aplicar Filtros
                        </Button>
                      </SheetClose>
                    </SheetFooter>
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
                    allLegislaturas={allLegislaturas}
                    allTypes={allTypes}
                    allPhases={allPhases}
                    allAuthors={allAuthors}
                    allParties={allParties}
                    initialLegislaturas={selectedLegislaturas}
                    initialTypes={selectedTypes}
                    initialPhases={selectedPhases}
                    initialAuthors={selectedAuthors} 
                    initialParties={selectedParties}
                    initialDateRange={dateRange}
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

                {/* Active Filters Display */}
                {(selectedLegislaturas.length > 0 || selectedTypes.length > 0 || selectedPhases.length > 0 || selectedAuthors.length > 0 || selectedParties.length > 0 || dateRange?.from) && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {selectedLegislaturas.map(legislatura => (
                      <Badge key={`legislatura-${legislatura}`} variant="secondary" className="gap-1">
                        {legislatura}
                        <button 
                          className="ml-1 rounded-full hover:bg-muted"
                          onClick={() => removeFilter('legislaturas', legislatura)}
                        >
                          ✕
                        </button>
                      </Badge>
                    ))}
                    {selectedTypes.map(type => (
                      <Badge key={`type-${type}`} variant="secondary" className="gap-1">
                        {type}
                        <button 
                          className="ml-1 rounded-full hover:bg-muted"
                          onClick={() => removeFilter('types', type)}
                        >
                          ✕
                        </button>
                      </Badge>
                    ))}
                    {smartPhaseBadges.map(badge => (
                      <Badge key={badge.key} variant="secondary" className="gap-1">
                        {badge.label}
                        <button 
                          className="ml-1 rounded-full hover:bg-muted"
                          onClick={() => removeFilter(
                            badge.isCategory ? 'phase-category' : 'phases', 
                            badge.isCategory ? badge.label : badge.label
                          )}
                        >
                          ✕
                        </button>
                      </Badge>
                    ))}
                    {selectedAuthors.map(author => (
                      <Badge key={`author-${author}`} variant="secondary" className="gap-1">
                        {author}
                        <button 
                          className="ml-1 rounded-full hover:bg-muted"
                          onClick={() => removeFilter('authors', author)}
                        >
                          ✕
                        </button>
                      </Badge>
                    ))}
                    {selectedParties.map(party => (
                      <Badge key={`party-${party}`} variant="secondary" className="gap-1">
                        {party}
                        <button 
                          className="ml-1 rounded-full hover:bg-muted"
                          onClick={() => removeFilter('parties', party)}
                        >
                          ✕
                        </button>
                      </Badge>
                    ))}
                    {dateRange?.from && (
                      <Badge variant="secondary" className="gap-1">
                        {dateRange.from.toLocaleDateString('pt-PT')}
                        {dateRange.to && ` - ${dateRange.to.toLocaleDateString('pt-PT')}`}
                        <button 
                          className="ml-1 rounded-full hover:bg-muted"
                          onClick={() => {
                            setDateRange(undefined);
                            if (initialLoadComplete) {
                              setCurrentPage(1);
                            }
                          }}
                        >
                          ✕
                        </button>
                      </Badge>
                    )}
                  </div>
                )}

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
                      // Extract the proposal data from the API response
                      const latestEvent = proposal.IniEventos && Array.isArray(proposal.IniEventos) && proposal.IniEventos.length > 0
                        ? proposal.IniEventos[proposal.IniEventos.length - 1]
                        : null;
                      
                      const phaseDisplay = latestEvent?.Fase || 'Sem estado';
                      
                      // Extract party/author information
                      let partyDisplay = "Desconhecido";
                      if (proposal.IniAutorGruposParlamentares && Array.isArray(proposal.IniAutorGruposParlamentares) && proposal.IniAutorGruposParlamentares.length > 0) {
                        // Show all parties, not just the first one
                        partyDisplay = proposal.IniAutorGruposParlamentares
                          .map((group: any) => group.GP || "")
                          .filter(Boolean)
                          .join(", ") || "Desconhecido";
                      } else if (proposal.IniAutorOutros?.nome) {
                        partyDisplay = proposal.IniAutorOutros.nome;
                      }
                      
                      // Get the earliest phase date if available
                      const firstPhaseDate = (() => {
                        if (proposal.IniEventos && Array.isArray(proposal.IniEventos) && proposal.IniEventos.length > 0) {
                          // Sort events by date (oldest first)
                          const sortedEvents = [...proposal.IniEventos].sort((a, b) => {
                            return new Date(a.DataFase).getTime() - new Date(b.DataFase).getTime();
                          });
                          // Return the date of the earliest phase
                          return sortedEvents[0].DataFase;
                        }
                        // Fallback to proposal date
                        return proposal.DataInicioleg;
                      })();
                      
                      return (
                        <ProposalCard
                          key={proposal._id}
                          title={proposal.IniTitulo}
                          number={proposal.IniNr}
                          status={phaseDisplay}
                          date={firstPhaseDate}
                          party={partyDisplay}
                          type={proposal.IniDescTipo}
                          iniId={proposal.IniId}
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
                    totalPages={Math.ceil(totalProposals / 20)}
                    onPageChange={(page) => {
                      setCurrentPage(page);
                    }}
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

// Wrap the component that uses useSearchParams in a Suspense boundary
export default function PropostasPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen"><Skeleton className="h-16 w-16 rounded-full" /></div>}>
      <ProposalsContent />
    </Suspense>
  );
}
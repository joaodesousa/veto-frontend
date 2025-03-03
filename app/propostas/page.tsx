"use client"
import { Filter, Grid2X2, List, Search } from "lucide-react"
import { useState } from "react"
import type { DateRange } from "react-day-picker"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ProposalCard } from "@/components/proposal-card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { ProposalFilters } from "@/components/proposal-filters"
import { Pagination } from "@/components/pagination"

import { fetchProposals } from "@/lib/api"
import { Proposal } from "@/lib/types"
import { useEffect } from "react"

export default function PropostasPage() {
  // State for managing proposals and pagination
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [totalProposals, setTotalProposals] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filtering and search states
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [selectedPhases, setSelectedPhases] = useState<string[]>([])
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([])
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [orderBy, setOrderBy] = useState("recentes")

  // Fetch proposals based on current filters
  const fetchProposalData = async () => {
    try {
      setLoading(true)
      const response = await fetchProposals({
        page: currentPage,
        search: searchTerm,
        types: selectedTypes,
        phases: selectedPhases,
        authors: selectedAuthors,
        dateRange,
        orderBy
      })

      setProposals(response.results)
      setTotalProposals(response.count)
    } catch (err) {
      setError("Failed to load proposals")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Fetch proposals on initial load and when filters change
  useEffect(() => {
    fetchProposalData()
  }, [currentPage, searchTerm, selectedTypes, selectedPhases, selectedAuthors, dateRange, orderBy])

  // Loading and error states
  if (loading) {
    return <div className="container py-8">Carregando propostas...</div>
  }

  if (error) {
    return <div className="container py-8 text-destructive">{error}</div>
  }

  // Function to remove a filter
  const removeFilter = (filterType: string, value: string) => {
    switch (filterType) {
      case 'types':
        setSelectedTypes(prev => prev.filter(type => type !== value))
        break
      case 'phases':
        setSelectedPhases(prev => prev.filter(phase => phase !== value))
        break
      case 'authors':
        setSelectedAuthors(prev => prev.filter(author => author !== value))
        break
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1">
        {/* Header */}
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
            {/* Search and Filters Bar */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-1 items-center gap-4">
                <div className="relative flex-1 max-w-xl">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="search" 
                    placeholder="Pesquisar propostas..." 
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
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
                    <ProposalFilters 
                      onFiltersChange={(types, phases, authors, dateRange) => {
                        setSelectedTypes(types)
                        setSelectedPhases(phases)
                        setSelectedAuthors(authors)
                        setDateRange(dateRange)
                      }}
                    />
                  </SheetContent>
                </Sheet>
              </div>
              <div className="flex items-center gap-2">
                <Select 
                  value={orderBy} 
                  onValueChange={(value) => setOrderBy(value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recentes">Mais recentes</SelectItem>
                    <SelectItem value="antigos">Mais antigos</SelectItem>
                    <SelectItem value="relevantes">Mais relevantes</SelectItem>
                    <SelectItem value="votacoes">Mais votados</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex items-center border rounded-md">
                  <Button variant="ghost" size="icon" className="rounded-r-none">
                    <Grid2X2 className="h-4 w-4" />
                  </Button>
                  <Separator orientation="vertical" className="h-[20px]" />
                  <Button variant="ghost" size="icon" className="rounded-l-none">
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6">
              {/* Filters Sidebar - Desktop */}
              <div className="hidden md:block">
                <ProposalFilters 
                  onFiltersChange={(types, phases, authors, dateRange) => {
                    setSelectedTypes(types)
                    setSelectedPhases(phases)
                    setSelectedAuthors(authors)
                    setDateRange(dateRange)
                  }}
                />
              </div>

              {/* Proposals Grid */}
              <div className="space-y-6">
                {/* Active Filters */}
                {(selectedTypes.length > 0 || 
                  selectedPhases.length > 0 || 
                  selectedAuthors.length > 0 || 
                  dateRange?.from) && (
                  <div className="flex flex-wrap gap-2">
                    {selectedTypes.map(type => (
                      <Badge key={type} variant="secondary" className="rounded-md">
                        {type}
                        <button 
                          className="ml-1 hover:text-foreground"
                          onClick={() => removeFilter('types', type)}
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                    {selectedPhases.map(phase => (
                      <Badge key={phase} variant="secondary" className="rounded-md">
                        {phase}
                        <button 
                          className="ml-1 hover:text-foreground"
                          onClick={() => removeFilter('phases', phase)}
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                    {selectedAuthors.map(author => (
                      <Badge key={author} variant="secondary" className="rounded-md">
                        {author}
                        <button 
                          className="ml-1 hover:text-foreground"
                          onClick={() => removeFilter('authors', author)}
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                    {dateRange?.from && (
                      <Badge variant="secondary" className="rounded-md">
                        {dateRange.from.toLocaleDateString()} 
                        {dateRange.to ? ` - ${dateRange.to.toLocaleDateString()}` : ''}
                        <button 
                          className="ml-1 hover:text-foreground"
                          onClick={() => setDateRange(undefined)}
                        >
                          ×
                        </button>
                      </Badge>
                    )}
                  </div>
                )}

                {/* Results Count */}
                <div className="text-sm text-muted-foreground">
                  {totalProposals} propostas encontradas
                </div>

                {/* Proposals Grid */}
                {proposals.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {proposals.map((proposal) => (
                      <ProposalCard
                        key={proposal.id}
                        title={proposal.title}
                        number={proposal.external_id}
                        status={proposal.phases[proposal.phases.length - 1]?.name || 'Sem estado'}
                        date={proposal.date}
                        party={proposal.authors?.find(a => a.author_type === "Grupo")?.name || "Desconhecido"}
                        type={proposal.type}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    Nenhuma proposta encontrada com os filtros selecionados.
                  </div>
                )}

                {/* Pagination */}
                <Pagination 
                  className="mt-8" 
                  currentPage={currentPage}
                  totalPages={Math.ceil(totalProposals / 10)}
                  onPageChange={(page) => setCurrentPage(page)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
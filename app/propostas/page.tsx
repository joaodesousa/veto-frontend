"use client"
import { Filter, Grid2X2, List, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ProposalCard } from "@/components/proposal-card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { ProposalFilters } from "@/components/proposal-filters"
import { Pagination } from "@/components/pagination"
import { useEffect, useState } from "react"
import { getHomePageProposals } from "@/lib/server-api"
import { Proposal } from "@/lib/types"

export default function PropostasPage() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const { proposals } = await getHomePageProposals();
        setProposals(proposals);
      } catch (err) {
        setError("Failed to load proposals");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProposals();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
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
                  <Input type="search" placeholder="Pesquisar propostas..." className="pl-8" />
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
                    <ProposalFilters />
                  </SheetContent>
                </Sheet>
              </div>
              <div className="flex items-center gap-2">
                <Select defaultValue="recentes">
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
                <ProposalFilters />
              </div>

              {/* Proposals Grid */}
              <div className="space-y-6">
                {/* Active Filters */}
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="rounded-md">
                    Em Comissão
                    <button className="ml-1 hover:text-foreground">×</button>
                  </Badge>
                  <Badge variant="secondary" className="rounded-md">
                    PS
                    <button className="ml-1 hover:text-foreground">×</button>
                  </Badge>
                  <Badge variant="secondary" className="rounded-md">
                    Últimos 30 dias
                    <button className="ml-1 hover:text-foreground">×</button>
                  </Badge>
                  {/* Add more active filters as needed */}
                </div>

                {/* Results Count */}
                <div className="text-sm text-muted-foreground">237 propostas encontradas</div>

                {/* Proposals Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {proposals.map((proposal) => (
                    <ProposalCard
                      key={proposal.id}
                      title={proposal.title}
                      number={proposal.external_id}
                      status={proposal.status}
                      date={proposal.date}
                      party={proposal.party}
                      type={proposal.type}
                    />
                  ))}
                </div>

                {/* Pagination */}
                <Pagination className="mt-8" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


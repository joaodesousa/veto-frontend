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

export default function PropostasPage() {
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
                  <ProposalCard
                    title="Alteração ao Regime Jurídico das Autarquias Locais"
                    number="PL 45/XV/1"
                    status="Em Comissão"
                    date="2023-05-15"
                    party="PS"
                  />
                  <ProposalCard
                    title="Medidas de Apoio às Famílias e à Natalidade"
                    number="PJL 121/XV/1"
                    status="Agendada"
                    date="2023-05-10"
                    party="PSD"
                  />
                  <ProposalCard
                    title="Estratégia Nacional para a Mobilidade Sustentável"
                    number="PPL 33/XV/1"
                    status="Em Discussão"
                    date="2023-05-02"
                    party="GOV"
                  />
                  <ProposalCard
                    title="Revisão do Estatuto dos Profissionais de Saúde"
                    number="PJL 89/XV/1"
                    status="Em Comissão"
                    date="2023-04-20"
                    party="BE"
                  />
                  <ProposalCard
                    title="Programa Nacional de Habitação Acessível"
                    number="PPL 28/XV/1"
                    status="Aprovada"
                    date="2023-04-12"
                    party="GOV"
                  />
                  <ProposalCard
                    title="Alterações ao Código do Trabalho"
                    number="PL 19/XV/1"
                    status="Aprovada"
                    date="2023-03-28"
                    party="PS"
                  />
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


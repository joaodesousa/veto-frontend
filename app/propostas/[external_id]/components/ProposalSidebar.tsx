"use client"

import { Users, Bell, FileText, UserCheck, ChevronDown, TrendingUp, Clock, CheckCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { getStatusColor } from "../../../utils/colors"
import { calculateProposalProgress, CATEGORY_COLORS } from "@/lib/phase-constants"
import Link from "next/link"
import { useState } from "react"

// Define the type for the proposal object
interface Deputy {
  name: string;
  party?: string;
}

interface TimelineItem {
  title: string;
  date: string;
}

interface Phase {
  name: string;
  date: string;
}

interface Proposal {
  status: string;
  timeline: TimelineItem[];
  deputies: Deputy[];
  lastUpdate: string;
  textLink: string | null;
  phases: Phase[];
}

// Define the props type for the ProposalSidebar component
interface ProposalSidebarProps {
  proposal: Proposal;
  // Add author data props
  authors?: string[];
  IniAutorDeputados?: Array<{ GP: string, idCadastro: string, nome: string }> | null;
  IniAutorGruposParlamentares?: Array<{ GP: string }> | null;
  IniAutorOutros?: Array<{ nome: string, sigla: string }> | { nome: string, sigla: string } | null;
}

export function ProposalSidebar({ 
  proposal, 
  authors = [], 
  IniAutorDeputados, 
  IniAutorGruposParlamentares, 
  IniAutorOutros 
}: ProposalSidebarProps) {
  const statusColor = getStatusColor(proposal.status);
  const [isAuthorsOpen, setIsAuthorsOpen] = useState(false);
  
  // Calculate accurate progress information
  const progressInfo = calculateProposalProgress(proposal.phases || []);
  
  // Get category color class
  const getCategoryColorClass = (category: string) => {
    return CATEGORY_COLORS[category] || "bg-gray-50 border-gray-200 text-gray-800";
  };

  // Extract all authors from different sources
  const getAllAuthors = () => {
    const allAuthors: {
      type: 'Grupo Parlamentar' | 'Deputado' | 'Outro';
      name: string;
      party?: string;
    }[] = [];

    // Parliamentary Groups
    if (IniAutorGruposParlamentares && Array.isArray(IniAutorGruposParlamentares)) {
      IniAutorGruposParlamentares.forEach(group => {
        if (group.GP) {
          allAuthors.push({
            type: 'Grupo Parlamentar',
            name: group.GP,
          });
        }
      });
    }

    // Deputies
    if (IniAutorDeputados && Array.isArray(IniAutorDeputados)) {
      IniAutorDeputados.forEach(deputy => {
        if (deputy.nome) {
          allAuthors.push({
            type: 'Deputado',
            name: deputy.nome,
            party: deputy.GP || undefined,
          });
        }
      });
    }

    // Other Authors
    if (IniAutorOutros) {
      if (Array.isArray(IniAutorOutros)) {
        IniAutorOutros.forEach(other => {
          const name = other.nome || other.sigla;
          if (name) {
            allAuthors.push({
              type: 'Outro',
              name,
            });
          }
        });
      } else if (typeof IniAutorOutros === 'object') {
        const name = IniAutorOutros.nome || IniAutorOutros.sigla;
        if (name) {
          allAuthors.push({
            type: 'Outro',
            name,
          });
        }
      }
    }

    // Fallback to formatted data if no raw data available
    if (allAuthors.length === 0) {
      // Add formatted authors
      authors.forEach(author => {
        allAuthors.push({
          type: 'Outro',
          name: author,
        });
      });

      // Add formatted deputies
      proposal.deputies.forEach(deputy => {
        allAuthors.push({
          type: 'Deputado',
          name: deputy.name,
          party: deputy.party,
        });
      });
    }

    return allAuthors;
  };

  const allAuthors = getAllAuthors();
  
  // Group authors by type
  const groupedAuthors = allAuthors.reduce((acc, author) => {
    if (!acc[author.type]) {
      acc[author.type] = [];
    }
    acc[author.type].push(author);
    return acc;
  }, {} as Record<string, typeof allAuthors>);
  
  return (
    <div className="space-y-6">
      {/* Proposal Details Card - Refactored from Estado Atual */}
      <Card className="border-blue-100 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Detalhes da Proposta
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Key Metadata */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Estado:</span>
                <Badge variant="outline" className={`${statusColor} border text-xs font-medium`}>
                  {proposal.status}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Última Atualização:</span>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {proposal.lastUpdate}
                </div>
              </div>
            </div>

            {/* Actions Section */}
            <div className="space-y-2 pt-2 border-t">
              {proposal.textLink && (
                <Link href={proposal.textLink} target="_blank">
                  <Button className="w-full gap-1.5" variant="default">
                    <FileText className="h-4 w-4" />
                    Ver Documento Original
                  </Button>
                </Link>
              )}
              
              <Button variant="outline" className="w-full gap-1.5" disabled>
                <Bell className="h-4 w-4" />
                Seguir Proposta
                <span className="text-xs text-muted-foreground ml-auto">Em breve</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Authors Card */}
      {allAuthors.length > 0 && (
        <Card className="border-blue-100 dark:border-blue-800">
          <Collapsible open={isAuthorsOpen} onOpenChange={setIsAuthorsOpen}>
            <CollapsibleTrigger asChild>
              <CardHeader className={`cursor-pointer transition-colors ${
                !isAuthorsOpen ? 'hover:bg-gray-50 dark:hover:bg-gray-800/50' : ''
              }`}>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Autores
                    
                  </div>
                  <ChevronDown 
                    className={`h-4 w-4 transition-transform duration-200 ${
                      isAuthorsOpen ? 'rotate-180' : ''
                    }`} 
                  />
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  {/* Parliamentary Groups */}
                  {groupedAuthors['Grupo Parlamentar'] && (
                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2 text-sm">
                        <UserCheck className="h-4 w-4" />
                        Grupos Parlamentares
                      </h4>
                      <div className="space-y-2">
                        {groupedAuthors['Grupo Parlamentar'].map((author, index) => (
                          <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                            <span className="text-sm font-medium">{author.name}</span>
                            <Badge variant="outline" className="text-xs">Grupo</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Deputies */}
                  {groupedAuthors['Deputado'] && (
                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4" />
                        Deputados
                      </h4>
                      <div className="space-y-2">
                        {groupedAuthors['Deputado'].map((author, index) => (
                          <div key={index} className="py-2 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">{author.name}</span>
                              <Badge variant="outline" className="text-xs">Deputado</Badge>
                            </div>
                            {author.party && (
                              <div className="text-xs text-muted-foreground mt-1">
                                {author.party}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Other Authors */}
                  {groupedAuthors['Outro'] && (
                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2 text-sm">
                        <UserCheck className="h-4 w-4" />
                        Outros Autores
                      </h4>
                      <div className="space-y-2">
                        {groupedAuthors['Outro'].map((author, index) => (
                          <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                            <span className="text-sm font-medium">{author.name}</span>
                            <Badge variant="outline" className="text-xs">Outro</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      )}
    </div>
  )
}
"use client"

import * as React from "react"
import { Calendar } from "lucide-react"
import type { DateRange } from "react-day-picker"
import { useState, useEffect, useRef } from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Author } from "@/lib/types"

interface ProposalFiltersProps {
  allTypes: string[] | any[];
  allPhases: string[] | any[];
  allAuthors: Author[];
  onFiltersChange: (
    types: string[], 
    phases: string[], 
    authors: string[], 
    dateRange: DateRange | undefined
  ) => void
}

export function ProposalFilters({ 
  allTypes,
  allPhases,
  allAuthors,
  onFiltersChange 
}: ProposalFiltersProps) {
  // Filter states
  const [selectedPhases, setSelectedPhases] = React.useState<string[]>([]);
  const [selectedParties, setSelectedParties] = React.useState<string[]>([]);
  const [selectedTopics, setSelectedTopics] = React.useState<string[]>([]);
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(undefined);
  
  // Flag to avoid the initial onFiltersChange call
  const isInitialMount = useRef(true);
  
  // Helper function to extract display name from phase objects
  const extractPhaseName = (phase: any): string => {
    if (typeof phase === 'string') {
      return phase;
    }
    
    if (phase && typeof phase === 'object') {
      // Try name first as most likely property
      if (phase.name && typeof phase.name === 'string') {
        return phase.name;
      }
      
      // Try other possible properties
      for (const key of ['phase', 'title', 'label', 'description', 'value']) {
        if (phase[key] && typeof phase[key] === 'string') {
          return phase[key];
        }
      }
      
      // Fallback to a default string
      return `Fase ${phase.id || ''}`;
    }
    
    // Fallback for null/undefined
    return String(phase || '');
  };
  
  // Helper function to extract display name from type objects
  const extractTypeName = (type: any): string => {
    if (typeof type === 'string') {
      return type;
    }
    
    if (type && typeof type === 'object') {
      // Try common properties for type name
      for (const key of ['name', 'type', 'title', 'label', 'description', 'value']) {
        if (type[key] && typeof type[key] === 'string') {
          return type[key];
        }
      }
      
      // Fallback to a default string
      return `Tipo ${type.id || ''}`;
    }
    
    // Fallback for null/undefined
    return String(type || '');
  };
  
  // Extract only parties (groups) from authors
  const partyNames = React.useMemo(() => {
    // Filter authors to only include those of type "Grupo" (parties)
    const partyAuthors = allAuthors.filter(author => 
      author && typeof author === 'object' && author.author_type === "Grupo"
    );
    
    // Extract name property from each party author
    const names = partyAuthors.map(author => 
      typeof author.name === 'string' ? author.name : `Unknown Party ${author.id || ''}`
    );
    
    // Remove duplicates
    return [...new Set(names)];
  }, [allAuthors]);

  // Apply filters when they change
  React.useEffect(() => {
    // Skip the first render to avoid potential initial infinite loops
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    
    // Only call with the raw values - no processing that could trigger new renders
    onFiltersChange(
      selectedTopics,
      selectedPhases,
      selectedParties,
      dateRange
    );
  }, [selectedPhases, selectedParties, selectedTopics, dateRange, onFiltersChange]);

  // Handler functions for updating filters - these explicitly set state
  const handleTopicChange = (topic: string, checked: boolean) => {
    if (checked) {
      setSelectedTopics(prev => [...prev, topic]);
    } else {
      setSelectedTopics(prev => prev.filter(t => t !== topic));
    }
  };
  
  const handlePhaseChange = (phase: string, checked: boolean) => {
    if (checked) {
      setSelectedPhases(prev => [...prev, phase]);
    } else {
      setSelectedPhases(prev => prev.filter(p => p !== phase));
    }
  };
  
  const handlePartyChange = (party: string, checked: boolean) => {
    if (checked) {
      setSelectedParties(prev => [...prev, party]);
    } else {
      setSelectedParties(prev => prev.filter(p => p !== party));
    }
  };

  // Clear filters functionality
  const clearPhases = () => setSelectedPhases([]);
  const clearParties = () => setSelectedParties([]);
  const clearTopics = () => setSelectedTopics([]);
  const clearDate = () => setDateRange(undefined);

  // Clear all filters
  const clearAllFilters = () => {
    clearPhases();
    clearParties();
    clearTopics();
    clearDate();
  };

  // Check if any filters are applied
  const hasFilters = selectedPhases.length > 0 || 
                    selectedParties.length > 0 || 
                    selectedTopics.length > 0 || 
                    !!dateRange?.from;

  return (
    <div className="space-y-4">
      {/* Topics/Types Filter (Now at the top) */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-medium">Tipo</h3>
          {selectedTopics.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearTopics}
              className="h-8 px-2 text-xs"
            >
              Limpar
            </Button>
          )}
        </div>
        <ScrollArea className="h-[200px] pr-4">
          <div className="space-y-3">
            {Array.isArray(allTypes) && allTypes.map((topic, index) => {
              // Extract the display name from the topic
              const topicStr = extractTypeName(topic);
              
              // Create a unique key for this topic
              const topicKey = typeof topic === 'object' && topic.id ? 
                String(topic.id) : 
                (typeof topic === 'string' ? topic : `topic-${index}`);
              
              return (
                <div key={`topic-${topicKey}`} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`topic-${index}`} 
                    checked={selectedTopics.includes(topicStr)}
                    onCheckedChange={(checked) => {
                      handleTopicChange(topicStr, !!checked);
                    }}
                  />
                  <label
                    htmlFor={`topic-${index}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {topicStr}
                  </label>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </div>

      <Separator />

      {/* Status/Phases Filter (Now with scroll) */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-medium">Estado</h3>
          {selectedPhases.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearPhases}
              className="h-8 px-2 text-xs"
            >
              Limpar
            </Button>
          )}
        </div>
        <ScrollArea className="h-[200px] pr-4">
          <div className="space-y-3">
            {Array.isArray(allPhases) && allPhases.map((phase, index) => {
              // Extract the display name from the phase
              const phaseStr = extractPhaseName(phase);
              
              // Create a unique key for this phase
              const phaseKey = typeof phase === 'object' && phase.id ? 
                String(phase.id) : 
                (typeof phase === 'string' ? phase : `phase-${index}`);
              
              return (
                <div key={`phase-${phaseKey}`} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`phase-${index}`} 
                    checked={selectedPhases.includes(phaseStr)}
                    onCheckedChange={(checked) => {
                      handlePhaseChange(phaseStr, !!checked);
                    }}
                  />
                  <label
                    htmlFor={`phase-${index}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {phaseStr}
                  </label>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </div>

      <Separator />

      {/* Parties Filter */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-medium">Partido</h3>
          {selectedParties.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearParties}
              className="h-8 px-2 text-xs"
            >
              Limpar
            </Button>
          )}
        </div>
        <div className="space-y-3">
          <ScrollArea className="h-[200px] pr-4">
            <div className="space-y-3">
              {partyNames.length > 0 ? (
                partyNames.map((party, index) => {
                  // Ensure party is a string
                  const partyStr = typeof party === 'string' ? party : String(party);
                  
                  return (
                    <div key={`party-${index}`} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`party-${index}`} 
                        checked={selectedParties.includes(partyStr)}
                        onCheckedChange={(checked) => {
                          handlePartyChange(partyStr, !!checked);
                        }}
                      />
                      <label
                        htmlFor={`party-${index}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {partyStr}
                      </label>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-6 text-sm text-muted-foreground">
                  Nenhum partido encontrado
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>

      <Separator />

      {/* Date Range Filter */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-medium">Data</h3>
          {dateRange?.from && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearDate}
              className="h-8 px-2 text-xs"
            >
              Limpar
            </Button>
          )}
        </div>
        <div className="grid gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={cn("w-full justify-start text-left font-normal", !dateRange && "text-muted-foreground")}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {dateRange.from.toLocaleDateString()} - {dateRange.to.toLocaleDateString()}
                    </>
                  ) : (
                    dateRange.from.toLocaleDateString()
                  )
                ) : (
                  <span>Selecionar período</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <div className="p-3 border-b flex justify-between items-center">
                <h4 className="font-medium text-sm">Selecionar período</h4>
                {dateRange?.from && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearDate}
                    className="h-8 px-2 text-xs"
                  >
                    Limpar
                  </Button>
                )}
              </div>
              <CalendarComponent
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <Separator />

      {/* Apply/Clear Filters Button */}
      {hasFilters ? (
        <Button 
          className="w-full"
          variant="outline"
          onClick={clearAllFilters}
        >
          Limpar Todos os Filtros
        </Button>
      ) : (
        <Button 
          className="w-full"
          disabled
        >
          Nenhum Filtro Selecionado
        </Button>
      )}
    </div>
  )
}
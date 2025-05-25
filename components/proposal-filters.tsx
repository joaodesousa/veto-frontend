"use client"

import * as React from "react"
import { Calendar, Search, Check, ChevronsUpDown } from "lucide-react"
import type { DateRange } from "react-day-picker"
import { useState, useEffect, useRef } from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Author } from "@/lib/types"

interface ProposalFiltersProps {
  allLegislaturas: string[] | any[];
  allTypes: string[] | any[];
  allPhases: string[] | any[];
  allAuthors: Author[];
  allParties: Author[];
  initialTypes?: string[];
  initialPhases?: string[];
  initialAuthors?: string[];
  initialParties?: string[];
  initialLegislaturas?: string[];
  initialDateRange?: DateRange;
  onFiltersChange: (
    legislaturas: string[],
    types: string[], 
    phases: string[], 
    authors: string[], 
    parties: string[],
    dateRange: DateRange | undefined
  ) => void
}

export function ProposalFilters({ 
  allLegislaturas,
  allTypes,
  allPhases,
  allAuthors,
  allParties,
  initialTypes = [],
  initialPhases = [],
  initialAuthors = [],
  initialParties = [],
  initialLegislaturas,
  initialDateRange,
  onFiltersChange 
}: ProposalFiltersProps) {
  // Filter states
  const [selectedLegislaturas, setSelectedLegislaturas] = React.useState<string[]>(() => {
    // If initialLegislaturas is provided, use it
    if (initialLegislaturas && initialLegislaturas.length > 0) {
      return initialLegislaturas;
    }
    // Set "XVI" as default if it exists in allLegislaturas
    if (Array.isArray(allLegislaturas) && allLegislaturas.includes("XVI")) {
      return ["XVI"];
    }
    // If "XVI" doesn't exist but there's one value, select that
    else if (Array.isArray(allLegislaturas) && allLegislaturas.length === 1) {
      return [String(allLegislaturas[0])];
    }
    return [];
  });
  const [selectedParties, setSelectedParties] = React.useState<string[]>(initialParties);
  const [selectedTopics, setSelectedTopics] = React.useState<string[]>(initialTypes);
  const [selectedAuthors, setSelectedAuthors] = React.useState<string[]>(initialAuthors);
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(initialDateRange);
  
  // Search state for phases - now just a single selected phase
  const [selectedPhase, setSelectedPhase] = React.useState<string>(() => {
    return initialPhases && initialPhases.length > 0 ? initialPhases[0] : "";
  });
  const [phaseDropdownOpen, setPhaseDropdownOpen] = React.useState(false);
  
  // Flag to avoid the initial onFiltersChange call
  const isInitialMount = useRef(true);
  
  // Store the latest callback to avoid infinite loops when it changes
  const onFiltersChangeRef = useRef(onFiltersChange);
  onFiltersChangeRef.current = onFiltersChange;
  
  // Sync internal state with props when they change (for badge removal, etc.)
  React.useEffect(() => {
    if (initialLegislaturas) {
      setSelectedLegislaturas(initialLegislaturas);
    }
  }, [initialLegislaturas]);

  React.useEffect(() => {
    if (initialTypes) {
      setSelectedTopics(initialTypes);
    }
  }, [initialTypes]);

  React.useEffect(() => {
    if (initialPhases) {
      setSelectedPhase(initialPhases.length > 0 ? initialPhases[0] : "");
    }
  }, [initialPhases]);

  React.useEffect(() => {
    if (initialAuthors) {
      setSelectedAuthors(initialAuthors);
    }
  }, [initialAuthors]);

  React.useEffect(() => {
    if (initialParties) {
      setSelectedParties(initialParties);
    }
  }, [initialParties]);

  React.useEffect(() => {
    if (initialDateRange !== undefined) {
      setDateRange(initialDateRange);
    }
  }, [initialDateRange]);
  
  // Helper function to extract display name from Legislatura 
  const extractLegislaturaName = (legislatura: any): string => {
    if (typeof legislatura === 'string') {
      return legislatura;
    }
    
    if (legislatura && typeof legislatura === 'object') {
      // Try name first as most likely property
      if (legislatura.name && typeof legislatura.name === 'string') {
        return legislatura.name;
      }
      
      // Try other possible properties
      for (const key of ['legislatura', 'title', 'label', 'description', 'value']) {
        if (legislatura[key] && typeof legislatura[key] === 'string') {
          return legislatura[key];
        }
      }
      
      // Fallback to a default string
      return `Legislatura ${legislatura.id || ''}`;
    }
    
    // Fallback for null/undefined
    return String(legislatura || '');
  };
  
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
  
  // Extract party names from the provided parties
  const partyNames = React.useMemo(() => {
    // Extract name property from each party
    const names = allParties.map(party => 
      typeof party.name === 'string' ? party.name : `Unknown Party ${party.id || ''}`
    );
    
    // Remove duplicates
    return [...new Set(names)];
  }, [allParties]);

  // Apply filters when they change
  React.useEffect(() => {
    // Skip the first render to avoid potential initial infinite loops
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    
    // Convert single phase to array for compatibility with existing API
    const phasesArray = selectedPhase ? [selectedPhase] : [];
    
    // Use the ref to call the latest callback without including it in dependencies
    onFiltersChangeRef.current(
      selectedLegislaturas,
      selectedTopics,
      phasesArray, // Use the converted array
      selectedAuthors,
      selectedParties,
      dateRange
    );
  }, [selectedLegislaturas, selectedTopics, selectedPhase, selectedAuthors, selectedParties, dateRange]);

  // Handle legislatura change
  const handleLegislaturaChange = (legislatura: string, checked: boolean) => {
    if (checked) {
      setSelectedLegislaturas(prev => [...prev, legislatura]);
    } else {
      setSelectedLegislaturas(prev => prev.filter(l => l !== legislatura));
    }
  };

  // Handler functions for updating filters - these explicitly set state
  const handleTopicChange = (topic: string, checked: boolean) => {
    if (checked) {
      setSelectedTopics(prev => [...prev, topic]);
    } else {
      setSelectedTopics(prev => prev.filter(t => t !== topic));
    }
  };
  
  const handlePartyChange = (party: string, checked: boolean) => {
    if (checked) {
      setSelectedParties(prev => [...prev, party]);
    } else {
      setSelectedParties(prev => prev.filter(p => p !== party));
    }
  };

  const handleAuthorChange = (author: string, checked: boolean) => {
    if (checked) {
      setSelectedAuthors(prev => [...prev, author]);
    } else {
      setSelectedAuthors(prev => prev.filter(a => a !== author));
    }
  };

  // Clear filters functionality
  const clearLegislaturas = () => setSelectedLegislaturas([]);
  const clearPhases = () => setSelectedPhase("");
  const clearParties = () => setSelectedParties([]);
  const clearTopics = () => setSelectedTopics([]);
  const clearAuthors = () => setSelectedAuthors([]);
  const clearDate = () => setDateRange(undefined);

  // Clear all filters
  const clearAllFilters = () => {
    clearLegislaturas();
    clearPhases();
    clearParties();
    clearTopics();
    clearAuthors();
    clearDate();
  };

  // Check if any filters are applied
  const hasFilters = selectedLegislaturas.length > 0 ||
                    !!selectedPhase || 
                    selectedParties.length > 0 || 
                    selectedTopics.length > 0 || 
                    selectedAuthors.length > 0 || 
                    !!dateRange?.from;

  return (
    <div className="space-y-4">
      {/* Legislatura Filter (First one) */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-medium">Legislatura</h3>
          {selectedLegislaturas.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearLegislaturas}
              className="h-8 px-2 text-xs"
            >
              Limpar
            </Button>
          )}
        </div>
        <ScrollArea className="h-[80px] pr-4">
          <div className="space-y-3">
            {Array.isArray(allLegislaturas) && allLegislaturas.map((legislatura, index) => {
              // Extract the display name
              const legislaturaStr = extractLegislaturaName(legislatura);
              
              // Create a unique key 
              const legislaturaKey = typeof legislatura === 'object' && legislatura.id ? 
                String(legislatura.id) : 
                (typeof legislatura === 'string' ? legislatura : `legislatura-${index}`);
              
              return (
                <div key={`legislatura-${legislaturaKey}`} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`legislatura-${index}`} 
                    checked={selectedLegislaturas.includes(legislaturaStr)}
                    onCheckedChange={(checked) => {
                      handleLegislaturaChange(legislaturaStr, !!checked);
                    }}
                  />
                  <label
                    htmlFor={`legislatura-${index}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {legislaturaStr}
                  </label>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </div>

      <Separator />

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
        <ScrollArea className="h-[150px] pr-4">
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

      {/* Status/Phases Filter - Searchable Dropdown */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-medium">Estado</h3>
          {selectedPhase && (
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
        
        <Popover open={phaseDropdownOpen} onOpenChange={setPhaseDropdownOpen}>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={phaseDropdownOpen}
                    className="w-full justify-between"
                  >
                    <span className="truncate text-left">
                      {selectedPhase || "Selecionar estado..."}
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
              </TooltipTrigger>
              {selectedPhase && (
                <TooltipContent>
                  <p>{selectedPhase}</p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
          <PopoverContent className="w-[300px] p-0">
            <Command>
              <CommandInput placeholder="Pesquisar estados..." />
              <CommandList>
                <CommandEmpty>Nenhum estado encontrado.</CommandEmpty>
                <CommandGroup>
                  {Array.isArray(allPhases) && allPhases.map((phase, index) => {
                    const phaseStr = extractPhaseName(phase);
                    const phaseKey = typeof phase === 'object' && phase.id ? 
                      String(phase.id) : 
                      (typeof phase === 'string' ? phase : `phase-${index}`);
                    
                    return (
                      <CommandItem
                        key={`phase-${phaseKey}`}
                        value={phaseStr}
                        onSelect={(currentValue) => {
                          setSelectedPhase(currentValue === selectedPhase ? "" : currentValue);
                          setPhaseDropdownOpen(false);
                        }}
                        className="flex items-start"
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4 mt-0.5 shrink-0",
                            selectedPhase === phaseStr ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <span className="break-words">{phaseStr}</span>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
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
          <ScrollArea className="h-[150px] pr-4">
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
                      {dateRange.from.toLocaleDateString('pt-PT')} - {dateRange.to.toLocaleDateString('pt-PT')}
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
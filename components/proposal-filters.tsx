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
import { Author, Legislatura } from "@/lib/types"
import { Drawer, DrawerContent, DrawerTrigger, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { useIsMobile } from "@/hooks/use-mobile"
import { EnhancedPhaseFilter } from "@/components/enhanced-phase-filter"

interface ProposalFiltersProps {
  allLegislaturas: Legislatura[];
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
  const isMobile = useIsMobile()
  
  // Filter states
  const [selectedLegislaturas, setSelectedLegislaturas] = React.useState<string[]>(() => {
    // If initialLegislaturas is provided, use it
    if (initialLegislaturas && initialLegislaturas.length > 0) {
      return initialLegislaturas;
    }
    // Set "XVI" as default if it exists in allLegislaturas
    if (Array.isArray(allLegislaturas) && allLegislaturas.some(leg => leg.legislature === "XVI")) {
      return ["XVI"];
    }
    // If "XVI" doesn't exist but there's one value, select that
    else if (Array.isArray(allLegislaturas) && allLegislaturas.length === 1) {
      return [allLegislaturas[0].legislature];
    }
    return [];
  });
  const [selectedParties, setSelectedParties] = React.useState<string[]>(initialParties);
  const [selectedTopics, setSelectedTopics] = React.useState<string[]>(initialTypes);
  const [selectedAuthors, setSelectedAuthors] = React.useState<string[]>(initialAuthors);
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(initialDateRange);
  
  // Updated to support multiple phase selection
  const [selectedPhases, setSelectedPhases] = React.useState<string[]>(initialPhases);
  
  // Date picker state for mobile/desktop
  const [datePopoverOpen, setDatePopoverOpen] = React.useState(false);
  const [dateDrawerOpen, setDateDrawerOpen] = React.useState(false);
  
  // Flag to avoid the initial onFiltersChange call
  const isInitialMount = useRef(true);
  
  // Flag to track when we're clearing date locally
  const isClearingDate = useRef(false);
  
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
      setSelectedPhases(initialPhases);
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
    // Don't sync if we're currently clearing the date locally
    if (isClearingDate.current) {
      isClearingDate.current = false;
      return;
    }
    
    // Only sync if initialDateRange is provided and different from current state
    if (initialDateRange !== undefined) {
      setDateRange(initialDateRange);
    } else if (initialDateRange === undefined && dateRange !== undefined) {
      // If prop becomes undefined, clear the local state
      setDateRange(undefined);
    }
  }, [initialDateRange]);
  
  // Helper function to extract display name from Legislatura 
  const extractLegislaturaName = (legislatura: Legislatura): string => {
    const startYear = new Date(legislatura.startDate).getFullYear();
    const endYear = legislatura.endDate ? new Date(legislatura.endDate).getFullYear() : 'presente';
    return `${legislatura.legislature} (${startYear}-${endYear})`;
  };

  // Helper function to get the legislature value for filtering
  const getLegislaturaValue = (legislatura: Legislatura): string => {
    return legislatura.legislature;
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

  // Convert allPhases to string array for the enhanced filter
  const phaseStrings = React.useMemo(() => {
    if (!Array.isArray(allPhases)) return [];
    return allPhases.map(phase => {
      if (typeof phase === 'string') return phase;
      if (phase && typeof phase === 'object') {
        // Try common properties for phase name
        for (const key of ['name', 'phase', 'title', 'label', 'description', 'value']) {
          if (phase[key] && typeof phase[key] === 'string') {
            return phase[key];
          }
        }
        return `Fase ${phase.id || ''}`;
      }
      return String(phase || '');
    }).filter(Boolean);
  }, [allPhases]);

  // Apply filters when they change
  React.useEffect(() => {
    // Skip the first render to avoid potential initial infinite loops
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    
    // Use the ref to call the latest callback without including it in dependencies
    onFiltersChangeRef.current(
      selectedLegislaturas,
      selectedTopics,
      selectedPhases, // Now using the array directly
      selectedAuthors,
      selectedParties,
      dateRange
    );
  }, [selectedLegislaturas, selectedTopics, selectedPhases, selectedAuthors, selectedParties, dateRange]);

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
  const clearPhases = () => setSelectedPhases([]);
  const clearParties = () => setSelectedParties([]);
  const clearTopics = () => setSelectedTopics([]);
  const clearAuthors = () => setSelectedAuthors([]);
  const clearDate = () => {
    isClearingDate.current = true;
    setDateRange(undefined);
    setDateDrawerOpen(false);
  };

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
                    selectedPhases.length > 0 || 
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
              // Extract the display name and value
              const legislaturaDisplayName = extractLegislaturaName(legislatura);
              const legislaturaValue = getLegislaturaValue(legislatura);
              
              // Create a unique key using the legislature value
              const legislaturaKey = legislatura.legislature || `legislatura-${index}`;
              
              return (
                <div key={`legislatura-${legislaturaKey}`} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`legislatura-${index}`} 
                    checked={selectedLegislaturas.includes(legislaturaValue)}
                    onCheckedChange={(checked) => {
                      handleLegislaturaChange(legislaturaValue, !!checked);
                    }}
                  />
                  <label
                    htmlFor={`legislatura-${index}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {legislaturaDisplayName}
                  </label>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </div>

      <Separator />

      {/* Topics/Types Filter */}
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

      {/* Enhanced Phase Filter */}
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
        
        <EnhancedPhaseFilter
          allPhases={phaseStrings}
          selectedPhases={selectedPhases}
          onPhasesChange={setSelectedPhases}
          onClear={clearPhases}
        />
      </div>

      <Separator />

      {/* Parties Filter */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-medium">Autor</h3>
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
          {isMobile ? (
            // Mobile: Use Drawer for better touch experience
            <Drawer open={dateDrawerOpen} onOpenChange={setDateDrawerOpen}>
              <DrawerTrigger asChild>
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
                      dateRange.from.toLocaleDateString('pt-PT')
                    )
                  ) : (
                    <span>Selecionar período</span>
                  )}
                </Button>
              </DrawerTrigger>
              <DrawerContent className="max-h-[90vh]">
                <DrawerHeader className="pb-4">
                  <div className="flex justify-between items-center">
                    <DrawerTitle>Selecionar Período</DrawerTitle>
                    {dateRange?.from && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          clearDate();
                          setDateDrawerOpen(false);
                        }}
                        className="h-8 px-2 text-xs"
                      >
                        Limpar
                      </Button>
                    )}
                  </div>
                </DrawerHeader>
                <div className="px-4 pb-4">
                  <CalendarComponent
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={(range) => {
                      setDateRange(range);
                      // Close drawer when both dates are selected
                      if (range?.from && range?.to) {
                        setDateDrawerOpen(false);
                      }
                    }}
                    numberOfMonths={1}
                    className="rounded-md border-0 w-full"
                    classNames={{
                      months: "flex flex-col space-y-4",
                      month: "space-y-4 w-full",
                      caption: "flex justify-center pt-1 relative items-center mb-4",
                      caption_label: "text-base font-medium",
                      nav: "space-x-1 flex items-center",
                      nav_button: "h-10 w-10 bg-transparent p-0 opacity-70 hover:opacity-100 border border-input rounded-md flex items-center justify-center",
                      nav_button_previous: "absolute left-1",
                      nav_button_next: "absolute right-1",
                      table: "w-full border-collapse space-y-1",
                      head_row: "flex w-full",
                      head_cell: "text-muted-foreground rounded-md flex-1 font-normal text-sm text-center py-2",
                      row: "flex w-full mt-2",
                      cell: "flex-1 text-center text-sm p-1 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                      day: "h-12 w-full p-0 font-normal aria-selected:opacity-100 rounded-md hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                      day_range_end: "day-range-end",
                      day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                      day_today: "bg-accent text-accent-foreground font-semibold",
                      day_outside: "day-outside text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground opacity-50",
                      day_disabled: "text-muted-foreground opacity-30",
                      day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                      day_hidden: "invisible",
                    }}
                  />
                </div>
              </DrawerContent>
            </Drawer>
          ) : (
            // Desktop: Use Popover
            <Popover open={datePopoverOpen} onOpenChange={setDatePopoverOpen}>
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
                      dateRange.from.toLocaleDateString('pt-PT')
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
          )}
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
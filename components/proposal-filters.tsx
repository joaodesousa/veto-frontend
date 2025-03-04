"use client"

import * as React from "react"
import { Calendar } from "lucide-react"
import type { DateRange } from "react-day-picker"
import { useState, useEffect } from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Author } from "@/lib/types"

interface ProposalFiltersProps {
  allTypes: string[];
  allPhases: string[];
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
  
  // Extract only parties (groups) from authors
  const partyNames = React.useMemo(() => {
    // Filter authors to only include those of type "Grupo" (parties)
    const partyAuthors = allAuthors.filter(author => author.author_type === "Grupo");
    const names = partyAuthors.map(author => author.name);
    // Remove duplicates
    return [...new Set(names)];
  }, [allAuthors]);

  // Apply filters when they change
  React.useEffect(() => {
    onFiltersChange(
      selectedTopics,
      selectedPhases,
      selectedParties,
      dateRange
    );
  }, [selectedPhases, selectedParties, selectedTopics, dateRange, onFiltersChange]);

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
            {allTypes.map((topic, index) => (
              <div key={`topic-${index}`} className="flex items-center space-x-2">
                <Checkbox 
                  id={`topic-${index}`} 
                  checked={selectedTopics.includes(topic)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedTopics([...selectedTopics, topic]);
                    } else {
                      setSelectedTopics(selectedTopics.filter(t => t !== topic));
                    }
                  }}
                />
                <label
                  htmlFor={`topic-${index}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {topic}
                </label>
              </div>
            ))}
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
            {allPhases.map((phase, index) => (
              <div key={`phase-${index}`} className="flex items-center space-x-2">
                <Checkbox 
                  id={`phase-${index}`} 
                  checked={selectedPhases.includes(phase)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedPhases([...selectedPhases, phase]);
                    } else {
                      setSelectedPhases(selectedPhases.filter(p => p !== phase));
                    }
                  }}
                />
                <label
                  htmlFor={`phase-${index}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {phase}
                </label>
              </div>
            ))}
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
                partyNames.map((party, index) => (
                  <div key={`party-${index}`} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`party-${index}`} 
                      checked={selectedParties.includes(party)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedParties([...selectedParties, party]);
                        } else {
                          setSelectedParties(selectedParties.filter(p => p !== party));
                        }
                      }}
                    />
                    <label
                      htmlFor={`party-${index}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {party}
                    </label>
                  </div>
                ))
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
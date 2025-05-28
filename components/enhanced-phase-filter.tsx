"use client"

import * as React from "react"
import { Check, ChevronsUpDown, ChevronDown, ChevronRight } from "lucide-react"
import { useState } from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Drawer, DrawerContent, DrawerTrigger, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { Checkbox } from "@/components/ui/checkbox"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useIsMobile } from "@/hooks/use-mobile"
import { Badge } from "@/components/ui/badge"
import { PHASE_MAPPING, CATEGORY_DESCRIPTIONS, CATEGORY_COLORS } from "@/lib/phase-constants"

interface EnhancedPhaseFilterProps {
  allPhases: string[]
  selectedPhases: string[]
  onPhasesChange: (phases: string[]) => void
  onClear: () => void
}

export function EnhancedPhaseFilter({
  allPhases,
  selectedPhases,
  onPhasesChange,
  onClear
}: EnhancedPhaseFilterProps) {
  const isMobile = useIsMobile()
  const [isOpen, setIsOpen] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  
  // Get phases that don't fit into main categories
  const getUncategorizedPhases = () => {
    const categorizedPhases = new Set([
      ...PHASE_MAPPING.Generalidade,
      ...PHASE_MAPPING.Especialidade,
      ...PHASE_MAPPING.Final
    ])
    return allPhases.filter(phase => !categorizedPhases.has(phase))
  }

  // Check if a main category is selected (all its phases are selected)
  const isCategorySelected = (category: keyof typeof PHASE_MAPPING) => {
    const categoryPhases = PHASE_MAPPING[category].filter(phase => allPhases.includes(phase))
    return categoryPhases.length > 0 && categoryPhases.every(phase => selectedPhases.includes(phase))
  }

  // Check if a main category is partially selected
  const isCategoryPartiallySelected = (category: keyof typeof PHASE_MAPPING) => {
    const categoryPhases = PHASE_MAPPING[category].filter(phase => allPhases.includes(phase))
    const selectedCategoryPhases = categoryPhases.filter(phase => selectedPhases.includes(phase))
    return selectedCategoryPhases.length > 0 && selectedCategoryPhases.length < categoryPhases.length
  }

  // Toggle a main category
  const toggleCategory = (category: keyof typeof PHASE_MAPPING) => {
    const categoryPhases = PHASE_MAPPING[category].filter(phase => allPhases.includes(phase))
    
    if (isCategorySelected(category)) {
      // Remove all phases from this category
      const newPhases = selectedPhases.filter(phase => !categoryPhases.includes(phase))
      onPhasesChange(newPhases)
    } else {
      // Add all phases from this category
      const newPhases = [...new Set([...selectedPhases, ...categoryPhases])]
      onPhasesChange(newPhases)
    }
  }

  // Toggle individual phase
  const togglePhase = (phase: string) => {
    if (selectedPhases.includes(phase)) {
      onPhasesChange(selectedPhases.filter(p => p !== phase))
    } else {
      onPhasesChange([...selectedPhases, phase])
    }
  }

  // Get display text for the button
  const getDisplayText = () => {
    if (selectedPhases.length === 0) {
      return "Selecionar estado..."
    }
    
    const selectedCategories = []
    if (isCategorySelected("Generalidade")) selectedCategories.push("Generalidade")
    if (isCategorySelected("Especialidade")) selectedCategories.push("Especialidade") 
    if (isCategorySelected("Final")) selectedCategories.push("Final")
    
    if (selectedCategories.length > 0) {
      const remaining = selectedPhases.length - selectedCategories.reduce((acc, cat) => {
        return acc + PHASE_MAPPING[cat as keyof typeof PHASE_MAPPING].filter(phase => allPhases.includes(phase)).length
      }, 0)
      
      if (remaining === 0) {
        return selectedCategories.join(", ")
      } else {
        return `${selectedCategories.join(", ")} +${remaining}`
      }
    }
    
    return `${selectedPhases.length} selecionado${selectedPhases.length > 1 ? 's' : ''}`
  }

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Main Categories */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-foreground">Categorias Principais</h4>
          {selectedPhases.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClear}
              className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
            >
              Limpar tudo
            </Button>
          )}
        </div>
        
        <div className="space-y-3">
          {(Object.keys(PHASE_MAPPING) as Array<keyof typeof PHASE_MAPPING>).map((category) => {
            const categoryPhases = PHASE_MAPPING[category].filter(phase => allPhases.includes(phase))
            if (categoryPhases.length === 0) return null
            
            const isSelected = isCategorySelected(category)
            const isPartial = isCategoryPartiallySelected(category)
            const selectedCount = categoryPhases.filter(phase => selectedPhases.includes(phase)).length
            
            return (
              <div 
                key={category} 
                className={cn(
                  "rounded-lg border p-4 transition-all duration-200 hover:shadow-sm",
                  isSelected ? CATEGORY_COLORS[category] : "border-border bg-card hover:bg-accent/50"
                )}
              >
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id={`category-${category}`}
                    checked={isSelected}
                    ref={(el) => {
                      if (el && 'indeterminate' in el) {
                        (el as any).indeterminate = isPartial
                      }
                    }}
                    onCheckedChange={() => toggleCategory(category)}
                    className="mt-0.5"
                  />
                  <div className="flex-1 min-w-0">
                    <label
                      htmlFor={`category-${category}`}
                      className="block text-sm font-medium leading-none cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <span>{category}</span>
                        <div className="flex items-center gap-2">
                          {selectedCount > 0 && (
                            <Badge variant="secondary" className="text-xs">
                              {selectedCount}/{categoryPhases.length}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </label>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      {CATEGORY_DESCRIPTIONS[category]}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Advanced Options */}
      <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
        <CollapsibleTrigger asChild>
          <Button 
            variant="ghost" 
            className={cn(
              "w-full justify-between border border-dashed transition-all duration-200",
              isMobile 
                ? "h-12 p-4 border-border hover:border-solid hover:bg-accent/50 hover:shadow-sm" 
                : "h-auto p-3 border-border hover:border-solid hover:bg-accent/50"
            )}
          >
            <div className="flex items-center gap-2">
              <span className={cn("font-medium", isMobile ? "text-base" : "text-sm")}>
                Opções Avançadas
              </span>
              <Badge variant="outline" className={cn(isMobile ? "text-sm px-2 py-1" : "text-xs")}>
                {getUncategorizedPhases().length + Object.values(PHASE_MAPPING).flat().filter(phase => allPhases.includes(phase)).length} fases
              </Badge>
            </div>
            {showAdvanced ? (
              <ChevronDown className={cn(isMobile ? "h-5 w-5" : "h-4 w-4")} />
            ) : (
              <ChevronRight className={cn(isMobile ? "h-5 w-5" : "h-4 w-4")} />
            )}
          </Button>
        </CollapsibleTrigger>
        
        <CollapsibleContent className="space-y-4 mt-4">
          {/* Individual phases by category */}
          {(Object.keys(PHASE_MAPPING) as Array<keyof typeof PHASE_MAPPING>).map((category) => {
            const categoryPhases = PHASE_MAPPING[category].filter(phase => allPhases.includes(phase))
            if (categoryPhases.length === 0) return null
            
            return (
              <div key={`advanced-${category}`} className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className={cn("w-3 h-3 rounded-full", CATEGORY_COLORS[category].split(' ')[0])} />
                  <h5 className={cn("font-semibold uppercase tracking-wide", isMobile ? "text-sm" : "text-xs")}>
                    {category}
                  </h5>
                </div>
                <div className={cn("space-y-2 border-l-2 border-border/50", isMobile ? "pl-6" : "pl-5")}>
                  {categoryPhases.map((phase) => (
                    <div key={phase} className={cn("flex items-start space-x-2 group", isMobile ? "py-1" : "")}>
                      <Checkbox
                        id={`phase-${phase}`}
                        checked={selectedPhases.includes(phase)}
                        onCheckedChange={() => togglePhase(phase)}
                        className="mt-0.5"
                      />
                      <label
                        htmlFor={`phase-${phase}`}
                        className={cn(
                          "leading-relaxed cursor-pointer group-hover:text-foreground transition-colors",
                          isMobile ? "text-sm" : "text-xs"
                        )}
                      >
                        {phase}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
          
          {/* Uncategorized phases */}
          {getUncategorizedPhases().length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-200" />
                <h5 className={cn("font-semibold uppercase tracking-wide", isMobile ? "text-sm" : "text-xs")}>
                  Outras Fases
                </h5>
              </div>
              <div className={cn("space-y-2 border-l-2 border-border/50", isMobile ? "pl-6" : "pl-5")}>
                {getUncategorizedPhases().map((phase) => (
                  <div key={phase} className={cn("flex items-start space-x-2 group", isMobile ? "py-1" : "")}>
                    <Checkbox
                      id={`uncategorized-${phase}`}
                      checked={selectedPhases.includes(phase)}
                      onCheckedChange={() => togglePhase(phase)}
                      className="mt-0.5"
                    />
                    <label
                      htmlFor={`uncategorized-${phase}`}
                      className={cn(
                        "leading-relaxed cursor-pointer group-hover:text-foreground transition-colors",
                        isMobile ? "text-sm" : "text-xs"
                      )}
                    >
                      {phase}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>
    </div>
  )

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className="w-full justify-between h-auto min-h-[40px] py-2"
          >
            <span className="truncate text-left text-sm">
              {getDisplayText()}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="max-h-[85vh]">
          <DrawerHeader className="flex justify-between items-center pb-4">
            <DrawerTitle className="text-lg font-semibold">Selecionar Estado</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-6 max-h-[70vh] overflow-y-auto">
            <FilterContent />
          </div>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={isOpen}
          className="w-full justify-between h-auto min-h-[40px] py-2"
        >
          <span className="truncate text-left text-sm">
            {getDisplayText()}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[450px] p-0" align="start" side="bottom">
        <div className="p-6 max-h-[500px] overflow-y-auto">
          <FilterContent />
        </div>
      </PopoverContent>
    </Popover>
  )
} 
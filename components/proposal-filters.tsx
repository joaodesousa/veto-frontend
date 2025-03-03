"use client"

import * as React from "react"
import { Calendar } from "lucide-react"
import type { DateRange } from "react-day-picker"
import { addDays } from "date-fns"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"

export function ProposalFilters() {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 30),
  })

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium mb-4">Estado</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox id="status-1" />
            <label
              htmlFor="status-1"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Em Comissão
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="status-2" />
            <label
              htmlFor="status-2"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Em Discussão
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="status-3" />
            <label
              htmlFor="status-3"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Agendada
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="status-4" />
            <label
              htmlFor="status-4"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Aprovada
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="status-5" />
            <label
              htmlFor="status-5"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Rejeitada
            </label>
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-sm font-medium mb-4">Partido</h3>
        <ScrollArea className="h-[200px] pr-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox id="party-1" />
              <label
                htmlFor="party-1"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                PS
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="party-2" />
              <label
                htmlFor="party-2"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                PSD
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="party-3" />
              <label
                htmlFor="party-3"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                CH
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="party-4" />
              <label
                htmlFor="party-4"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                IL
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="party-5" />
              <label
                htmlFor="party-5"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                BE
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="party-6" />
              <label
                htmlFor="party-6"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                PCP
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="party-7" />
              <label
                htmlFor="party-7"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                PAN
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="party-8" />
              <label
                htmlFor="party-8"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                L
              </label>
            </div>
          </div>
        </ScrollArea>
      </div>

      <Separator />

      <div>
        <h3 className="text-sm font-medium mb-4">Data</h3>
        <div className="grid gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {date?.from ? (
                  date.to ? (
                    <>
                      {date.from.toLocaleDateString()} - {date.to.toLocaleDateString()}
                    </>
                  ) : (
                    date.from.toLocaleDateString()
                  )
                ) : (
                  <span>Selecionar período</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-sm font-medium mb-4">Temas</h3>
        <ScrollArea className="h-[200px] pr-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox id="topic-1" />
              <label
                htmlFor="topic-1"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Administração Pública
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="topic-2" />
              <label
                htmlFor="topic-2"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Ambiente
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="topic-3" />
              <label
                htmlFor="topic-3"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Economia
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="topic-4" />
              <label
                htmlFor="topic-4"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Educação
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="topic-5" />
              <label
                htmlFor="topic-5"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Saúde
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="topic-6" />
              <label
                htmlFor="topic-6"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Trabalho
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="topic-7" />
              <label
                htmlFor="topic-7"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Transportes
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="topic-8" />
              <label
                htmlFor="topic-8"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Habitação
              </label>
            </div>
          </div>
        </ScrollArea>
      </div>

      <Separator />

      <Button className="w-full">Aplicar Filtros</Button>
    </div>
  )
}


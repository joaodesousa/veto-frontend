"use client"

import * as React from "react"
import Link from "next/link"
import { Building2, Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function MobileNav() {
  const [open, setOpen] = React.useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Abrir menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="pr-0">
        <div className="flex items-center gap-2 px-7">
          <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
            <Building2 className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">Veto</span>
          </Link>
        </div>
        <nav className="flex flex-col gap-4 px-7 mt-8">
          <Link
            href="/propostas"
            className="text-base font-medium transition-colors hover:text-primary"
            onClick={() => setOpen(false)}
          >
            Propostas
          </Link>
          <Link
            href="/deputados"
            className="text-base font-medium transition-colors hover:text-primary"
            onClick={() => setOpen(false)}
          >
            Deputados
          </Link>
          <Link
            href="/estatisticas"
            className="text-base font-medium transition-colors hover:text-primary"
            onClick={() => setOpen(false)}
          >
            Estatísticas
          </Link>
          <Link
            href="/sobre"
            className="text-base font-medium transition-colors hover:text-primary"
            onClick={() => setOpen(false)}
          >
            Sobre
          </Link>
          <Button className="mt-4">Entrar</Button>
        </nav>
      </SheetContent>
    </Sheet>
  )
}


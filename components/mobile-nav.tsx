"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Building2, Menu, X, Home, FileText, Users, BarChart3, Info, LogIn, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"
import { Separator } from "@/components/ui/separator"

interface MobileSidebarNavProps {
  isTransparent?: boolean
}

export function MobileSidebarNav({ isTransparent = false }: MobileSidebarNavProps) {
  const [open, setOpen] = React.useState(false)
  const pathname = usePathname()

  // Navigation items with icons
  const navItems = [
    { href: "/", label: "Início", icon: <Home className="h-5 w-5" /> },
    { href: "/propostas", label: "Propostas", icon: <FileText className="h-5 w-5" /> },
    // { href: "/deputados", label: "Deputados", icon: <Users className="h-5 w-5" /> },
    // { href: "/estatisticas", label: "Estatísticas", icon: <BarChart3 className="h-5 w-5" /> },
    //{ href: "/sobre", label: "Sobre", icon: <Info className="h-5 w-5" /> },
  ]

  const isActive = (path: string) => pathname === path

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden",
            isTransparent && "text-white hover:text-white/80",
          )}
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Abrir menu</span>
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="p-0 w-[280px] sm:w-[350px]">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
              <Building2 className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">VETO</span>
            </Link>
            <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setOpen(false)}>
              <X className="h-5 w-5" />
              <span className="sr-only">Fechar menu</span>
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto py-6 px-4">
            <nav className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                    isActive(item.href) ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted",
                  )}
                  onClick={() => setOpen(false)}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" />
                </Link>
              ))}
            </nav>
          </div>

          {/* Footer */}
          <div className="border-t p-4">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Tema</span>
                <ThemeToggle />
              </div>
              <Separator />
              <Button className="w-full gap-2">
                <LogIn className="h-4 w-4" />
                Entrar
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}


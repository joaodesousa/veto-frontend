"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Building2, Menu, X, Home, FileText, Users, BarChart3, Info, LogIn, ChevronRight, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"


interface MobileSidebarNavProps {
  isTransparent?: boolean
}

export function MobileSidebarNav({ isTransparent = false }: MobileSidebarNavProps) {
  const [open, setOpen] = React.useState(false)
  const pathname = usePathname()

  // Navigation items with icons
  const navItems = [
    { href: "/", label: "Início", icon: <Home className="h-6 w-6" />, description: "Página principal" },
    { href: "/propostas", label: "Propostas", icon: <FileText className="h-6 w-6" />, description: "Explorar propostas" },
    { href: "/parlamento", label: "Parlamento", icon: <Building2 className="h-6 w-6" />, description: "Informações do parlamento" },
    // { href: "/deputados", label: "Deputados", icon: <Users className="h-6 w-6" />, description: "Perfis dos deputados" },
    // { href: "/estatisticas", label: "Estatísticas", icon: <BarChart3 className="h-6 w-6" />, description: "Dados e análises" },
    // { href: "/sobre", label: "Sobre", icon: <Info className="h-6 w-6" />, description: "Sobre o projeto" },
  ]

  const isActive = (path: string) => pathname === path

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden transition-all duration-300",
            isTransparent && "text-white hover:text-white/80",
          )}
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Abrir menu</span>
        </Button>
      </SheetTrigger>

      <SheetContent 
        side="top" 
        className="w-full h-screen p-0 border-0 bg-gradient-to-br from-background via-background/98 to-background/95 backdrop-blur-xl"
      >
        <div className="flex flex-col h-full relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0">
            <div className="absolute top-[10%] right-[15%] w-72 h-72 bg-gradient-to-br from-primary/15 to-purple-500/15 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-[20%] left-[10%] w-64 h-64 bg-gradient-to-tr from-blue-500/15 to-primary/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
            <div className="absolute top-[60%] right-[5%] w-48 h-48 bg-gradient-to-bl from-purple-500/10 to-pink-500/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: "2s" }}></div>
          </div>

          {/* Header */}
          <div className="relative z-10 flex items-center justify-between p-6 border-b border-border/10">
            <Link href="/" className="flex items-center gap-4 group" onClick={() => setOpen(false)}>
              <div className="relative">
                <Image 
                  src="/logo_white.png" 
                  alt="VETO Logo"
                  width={40}
                  height={40}
                  className="h-10 w-10 object-contain transition-all duration-300 group-hover:scale-110 group-hover:rotate-6"
                />
                
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-2xl text-white">
                  VETO
                </span>
                <span className="text-sm text-muted-foreground">Portal Parlamentar</span>
              </div>
            </Link>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full hover:bg-destructive/10 hover:text-destructive transition-all duration-300 hover:rotate-90 hover:scale-110" 
              onClick={() => setOpen(false)}
            >
              <X className="h-6 w-6" />
              <span className="sr-only">Fechar menu</span>
            </Button>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col justify-center px-6 py-12 relative z-10">
            {/* Navigation Section */}
            <div className="max-w-md mx-auto w-full">
              <div className="text-center mb-12">
                <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                  Navegação
                </h2>
                <div className="h-1 w-24 bg-gradient-to-r from-primary to-purple-500 rounded-full mx-auto"></div>
              </div>
              
              <nav className="space-y-4">
                {navItems.map((item, index) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={cn(
                      "group flex items-center gap-6 p-6 rounded-2xl transition-all duration-500 transform hover:scale-105",
                      "animate-in slide-in-from-bottom-8 fade-in-0",
                      isActive(item.href) 
                        ? "bg-gradient-to-r from-primary/20 via-primary/15 to-primary/10 border-2 border-primary/30 shadow-2xl shadow-primary/20" 
                        : "hover:bg-gradient-to-r hover:from-primary/10 hover:via-primary/5 hover:to-transparent border-2 border-transparent hover:border-primary/20 hover:shadow-xl",
                    )}
                    onClick={() => setOpen(false)}
                    style={{
                      animationDelay: `${index * 150 + 300}ms`,
                      animationFillMode: "both",
                    }}
                  >
                    <div className={cn(
                      "flex items-center justify-center w-16 h-16 rounded-2xl transition-all duration-300 shadow-lg",
                      isActive(item.href) 
                        ? "bg-primary/30 text-primary shadow-primary/20" 
                        : "bg-gradient-to-br from-muted/50 to-muted/30 text-muted-foreground group-hover:from-primary/20 group-hover:to-primary/10 group-hover:text-primary group-hover:shadow-primary/10"
                    )}>
                      {item.icon}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className={cn(
                          "text-xl font-semibold transition-colors",
                          isActive(item.href) ? "text-primary" : "text-foreground"
                        )}>
                          {item.label}
                        </span>
                        <ChevronRight className={cn(
                          "h-5 w-5 transition-all duration-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-2",
                          isActive(item.href) && "opacity-100 text-primary"
                        )} />
                      </div>
                      <p className="text-muted-foreground">{item.description}</p>
                    </div>
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          {/* Footer */}
          <div className="relative z-10 p-6 border-t border-border/10">
            <div className="max-w-md mx-auto">
              <div className="flex flex-col gap-6">
                {/* Theme Toggle Section */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-muted/30 to-muted/20 border border-border/20">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-primary to-purple-500 animate-pulse"></div>
                    <span className="font-medium">Aparência</span>
                  </div>
                  <ThemeToggle />
                </div>
                
                {/* Login Button */}
                <Button
                  onClick={() => {
                    setOpen(false)
                    toast("Brevemente.", {
                      description: "Ainda estamos a trabalhar nesta funcionalidade.",
                      action: {
                        label: "Fechar",
                        onClick: () => console.log("Undo"),
                      },
                    })
                  }}
                  size="lg"
                  className="w-full gap-3 py-4 text-lg bg-gradient-to-r from-primary via-primary to-primary/90 hover:from-primary/90 hover:via-primary/80 hover:to-primary/70 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] rounded-xl"
                >
                  <LogIn className="h-5 w-5" />
                  Entrar na Plataforma
                </Button>
                
                {/* Version Info */}
                <div className="text-center opacity-60">
                  <p className="text-sm text-muted-foreground">
                    Versão 1.0 • Desenvolvido com ❤️ para a democracia
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}


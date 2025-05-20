"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Building2 } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { MobileSidebarNav } from "@/components/mobile-nav"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import { toast } from "sonner"

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const isHomePage = pathname === "/"

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY
      if (offset > 50) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <header
      className={cn("fixed top-0 z-50 w-full transition-all duration-300", {
        "bg-transparent border-transparent": isHomePage && !scrolled,
        "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b": !isHomePage || scrolled,
      })}
    >
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Building2
              className={cn("h-6 w-6 transition-colors", isHomePage && !scrolled ? "text-white" : "text-primary")}
            />
            <span
              className={cn(
                "hidden font-bold text-xl sm:inline-block transition-colors",
                isHomePage && !scrolled ? "text-white" : "text-foreground",
              )}
            >
              VETO
            </span>
          </Link>
        </div>
         {/* <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/propostas"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              isHomePage && !scrolled ? "text-white/90 hover:text-white" : "",
            )}
          >
            Propostas
          </Link>
         <Link
            href="/deputados"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              isHomePage && !scrolled ? "text-white/90 hover:text-white" : "",
            )}
          >
            Deputados
          </Link>
          <Link
            href="/estatisticas"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              isHomePage && !scrolled ? "text-white/90 hover:text-white" : "",
            )}
          >
            Estatísticas
          </Link> 
          <Link
            href="/sobre"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              isHomePage && !scrolled ? "text-white/90 hover:text-white" : "",
            )}
          >
            Sobre
          </Link>
        </nav>*/}
        <div className="flex items-center gap-2">
          <ThemeToggle isTransparent={isHomePage && !scrolled} />
          <Button
            variant={isHomePage && !scrolled ? "outline" : "default"}
            size="sm"
            onClick={() =>
              toast("Brevemente.", {
                description: "Ainda estamos a trabalhar nesta funcionalidade.",
                action: {
                  label: "Fechar",
                  onClick: () => console.log("Undo"),
                },
              })
            }
            className={cn("hidden md:flex", isHomePage && !scrolled ? "border-white bg-transparent text-white hover:bg-white/10" : "")}
          >
            Entrar
          </Button>
          <MobileSidebarNav isTransparent={isHomePage && !scrolled} />
        </div>
      </div>
    </header>
  )
}


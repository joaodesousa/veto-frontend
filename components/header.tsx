"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
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
            <Image 
              src="/logo_white.png" 
              alt="VETO Logo"
              width={50}
              height={50}
              className="h-15 w-15 object-contain transition-opacity"
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


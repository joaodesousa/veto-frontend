import Link from "next/link"
import { Building2 } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { MobileNav } from "@/components/mobile-nav"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Building2 className="h-6 w-6 text-primary" />
            <span className="hidden font-bold text-xl sm:inline-block">Veto</span>
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/propostas" className="text-sm font-medium transition-colors hover:text-primary">
            Propostas
          </Link>
          <Link href="/deputados" className="text-sm font-medium transition-colors hover:text-primary">
            Deputados
          </Link>
          <Link href="/estatisticas" className="text-sm font-medium transition-colors hover:text-primary">
            Estatísticas
          </Link>
          <Link href="/sobre" className="text-sm font-medium transition-colors hover:text-primary">
            Sobre
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="default" size="sm" className="hidden md:flex">
            Entrar
          </Button>
          <MobileNav />
        </div>
      </div>
    </header>
  )
}


import Link from "next/link"
import { Building2 } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container py-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="flex flex-col gap-2">
            <Link href="/" className="flex items-center gap-2">
              <Building2 className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">Veto</span>
            </Link>
            <p className="text-sm text-muted-foreground mt-2">
              Acompanhamento de propostas legislativas no Parlamento Português.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-3">Navegação</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/propostas" className="text-muted-foreground hover:text-primary transition-colors">
                  Propostas
                </Link>
              </li>
              <li>
                <Link href="/deputados" className="text-muted-foreground hover:text-primary transition-colors">
                  Deputados
                </Link>
              </li>
              <li>
                <Link href="/estatisticas" className="text-muted-foreground hover:text-primary transition-colors">
                  Estatísticas
                </Link>
              </li>
              <li>
                <Link href="/sobre" className="text-muted-foreground hover:text-primary transition-colors">
                  Sobre
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-3">Recursos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/ajuda" className="text-muted-foreground hover:text-primary transition-colors">
                  Ajuda
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-primary transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="text-muted-foreground hover:text-primary transition-colors">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-3">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacidade" className="text-muted-foreground hover:text-primary transition-colors">
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link href="/termos" className="text-muted-foreground hover:text-primary transition-colors">
                  Termos de Uso
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-6">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Veto. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}


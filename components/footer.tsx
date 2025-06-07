import Link from "next/link"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Section */}
          <div className="flex flex-col gap-4 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 w-fit">
              <Image 
                src="/logo_white.png" 
                alt="VETO Logo"
                width={50}
                height={50}
                className="h-12 w-12 object-contain transition-opacity hover:opacity-80"
              />
              <span className="font-bold text-xl">VETO</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
              Plataforma de acompanhamento e análise de propostas legislativas no Parlamento Português. 
              Mantemos os cidadãos informados sobre as decisões que moldam o nosso futuro.
            </p>
            <div className="flex flex-col gap-1">
              <p className="text-xs text-muted-foreground">
                Dados obtidos de{" "}
                <Link 
                  href="https://www.parlamento.pt" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors underline font-medium"
                >
                  parlamento.pt
                </Link>
              </p>
            </div>
          </div>

          {/* Navigation Section */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold">Navegação</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/propostas" className="text-muted-foreground hover:text-primary transition-colors">
                  Propostas
                </Link>
              </li>
              <li>
                <Link href="/parlamento" className="text-muted-foreground hover:text-primary transition-colors">
                  Parlamento
                </Link>
              </li>
              <li>
                <Link href="/governo" className="text-muted-foreground hover:text-primary transition-colors">
                  Governo
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources & Legal Section */}
          
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} VETO. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-6 text-sm">
              <Link 
                href="/privacidade" 
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Privacidade
              </Link>
              <Link 
                href="/termos" 
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Termos de Uso
              </Link>
              <span className="text-muted-foreground">
                Versão 1.0
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}


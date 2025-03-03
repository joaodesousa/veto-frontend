// app/not-found.tsx
import Link from "next/link"
import { FileSearch } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-[70vh] py-12 text-center">
      <FileSearch className="h-24 w-24 text-muted-foreground mb-6" />
      <h1 className="text-4xl font-bold mb-2">Página não encontrada</h1>
      <p className="text-muted-foreground mb-8 max-w-md">
        A página que procura não existe ou a proposta legislativa solicitada não foi encontrada.
      </p>
      <div className="flex gap-4">
        <Button asChild>
          <Link href="/">Página Inicial</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/propostas">Ver Todas as Propostas</Link>
        </Button>
      </div>
    </div>
  )
}

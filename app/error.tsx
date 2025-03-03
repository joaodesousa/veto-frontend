// app/error.tsx
"use client"

import { useEffect } from "react"
import Link from "next/link"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="container flex flex-col items-center justify-center min-h-[70vh] py-12 text-center">
      <AlertTriangle className="h-24 w-24 text-destructive mb-6" />
      <h1 className="text-4xl font-bold mb-2">Algo correu mal</h1>
      <p className="text-muted-foreground mb-8 max-w-md">
        Ocorreu um erro ao tentar carregar esta página. Por favor, tente novamente mais tarde.
      </p>
      <div className="flex gap-4">
        <Button onClick={() => reset()}>
          Tentar Novamente
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">Voltar ao Início</Link>
        </Button>
      </div>
    </div>
  )
}
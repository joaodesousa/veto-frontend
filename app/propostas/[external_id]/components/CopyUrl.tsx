"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import { Check, Copy } from "lucide-react"

interface CopyUrlButtonProps {
  url: string
  className?: string
}

export function CopyUrlButton({ url, className }: CopyUrlButtonProps) {
  const { toast } = useToast()
  const [isCopied, setIsCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setIsCopied(true)
      
      toast({
        title: "URL copiado",
        description: "O link foi copiado para a área de transferência",
      })

      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setIsCopied(false)
      }, 2000)
    } catch (err) {
      console.error("Failed to copy URL:", err)
      toast({
        title: "Erro ao copiar",
        description: "Não foi possível copiar o link. Por favor, tente novamente.",
        variant: "destructive",
      })
    }
  }

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={handleCopy}
      className={className}
    >
      {isCopied ? (
        <>
          <Check className="mr-1 h-4 w-4" />
          Copiado
        </>
      ) : (
        <>
          <Copy className="mr-1 h-4 w-4" />
          Copiar
        </>
      )}
    </Button>
  )
}
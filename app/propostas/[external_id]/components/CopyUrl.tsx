"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import { Check, Copy, Share2 } from "lucide-react"

interface CopyUrlButtonProps {
  url: string
  className?: string
  variant?: "copy" | "share"
  buttonText?: string
  successText?: string
}

export function CopyUrlButton({ 
  url, 
  className, 
  variant = "copy",
  buttonText,
  successText
}: CopyUrlButtonProps) {
  const { toast } = useToast()
  const [isCopied, setIsCopied] = useState(false)

  // Set default text based on variant
  const defaultButtonText = variant === "share" ? "Partilhar" : "Copiar"
  const defaultSuccessText = variant === "share" ? "Partilhado" : "Copiado"
  const icon = variant === "share" ? Share2 : Copy

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setIsCopied(true)
      
      toast({
        title: variant === "share" ? "Link copiado" : "URL copiado",
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

  const IconComponent = icon

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
          {successText || defaultSuccessText}
        </>
      ) : (
        <>
          <IconComponent className="mr-1 h-4 w-4" />
          <span className="hidden sm:inline">{buttonText || defaultButtonText}</span>
        </>
      )}
    </Button>
  )
}
"use client"

import Link from "next/link"
import { ArrowLeft, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast"

interface ProposalActionBarProps {
  url: string
  title: string
}

export function ProposalActionBar({ url, title }: ProposalActionBarProps) {
  const { toast } = useToast()

  const handleShare = async () => {
    const shareData = {
      title: title,
      text: `${title} - Proposta legislativa em análise`,
      url: url,
    }

    try {
      // Check if Web Share API is available (mainly mobile devices)
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        // Fallback to copying URL to clipboard
        await navigator.clipboard.writeText(url)
        toast({
          title: "Link copiado",
          description: "O link da proposta foi copiado para a área de transferência",
        })
      }
    } catch (err: any) {
      // If sharing was cancelled or failed, try clipboard as fallback
      if (err.name !== 'AbortError') {
        try {
          await navigator.clipboard.writeText(url)
          toast({
            title: "Link copiado",
            description: "O link da proposta foi copiado para a área de transferência",
          })
        } catch (clipboardErr) {
          toast({
            title: "Erro ao partilhar",
            description: "Não foi possível partilhar ou copiar o link",
            variant: "destructive",
          })
        }
      }
    }
  }

  return (
    <div className="bg-white dark:bg-slate-900 border-b sticky top-16 z-20">
      <div className="container py-2">
        <div className="flex justify-between items-center">
          <Button variant="ghost" size="sm" className="gap-1" asChild>
            <Link href="/propostas">
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-1" onClick={handleShare}>
                    <Share2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Partilhar</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Partilhar esta proposta</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </div>
  )
} 
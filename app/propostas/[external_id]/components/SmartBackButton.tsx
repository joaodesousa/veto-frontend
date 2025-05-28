"use client"

import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface SmartBackButtonProps {
  fallbackHref?: string
  className?: string
}

export function SmartBackButton({ fallbackHref = "/propostas", className }: SmartBackButtonProps) {
  const router = useRouter()
  const [canGoBack, setCanGoBack] = useState(false)
  const [referrerUrl, setReferrerUrl] = useState<string | null>(null)

  useEffect(() => {
    // Check if there's history we can go back to
    setCanGoBack(window.history.length > 1)
    
    // Store the referrer URL for analysis
    setReferrerUrl(document.referrer)
  }, [])

  const handleBack = () => {
    // Check if we came from the proposals page and can safely go back
    if (canGoBack && referrerUrl) {
      const referrerURL = new URL(referrerUrl, window.location.origin)
      
      // If we came from the proposals page (with or without filters), use browser back
      if (referrerURL.pathname === '/propostas') {
        router.back()
        return
      }
    }
    
    // Otherwise, navigate to the fallback URL
    router.push(fallbackHref)
  }

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      className={`gap-1 ${className}`}
      onClick={handleBack}
    >
      <ArrowLeft className="h-4 w-4" />
      Voltar
    </Button>
  )
} 
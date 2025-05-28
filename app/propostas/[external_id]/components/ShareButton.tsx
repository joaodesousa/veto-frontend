"use client"

import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Share2, Facebook, Linkedin } from "lucide-react"
import { FaXTwitter } from "react-icons/fa6"
import { CopyUrlButton } from "./CopyUrl"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"

interface ShareButtonProps {
  url: string
  title: string
  className?: string
}

export function ShareButton({ url, title, className }: ShareButtonProps) {
  const { toast } = useToast()
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  
  // Prepare share URLs with encoded parameters
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)
  
  // Share URLs for different social media platforms
  const shareUrls = {
    x: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
  }
  
  // Function to handle share buttons
  const handleShare = (platform: keyof typeof shareUrls) => {
    const shareUrl = shareUrls[platform]
    window.open(shareUrl, "_blank", "width=600,height=600")
    setIsPopoverOpen(false)
  }

  // Handle the main share button click
  const handleMainShare = async () => {
    // Check if Web Share API is available (mobile devices)
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: `${title} - Proposta legislativa em análise`,
          url: url,
        })
      } catch (err: any) {
        // User cancelled or share failed, show fallback only if it wasn't cancelled
        if (err.name !== 'AbortError') {
          setIsPopoverOpen(true)
        }
      }
    } else {
      // Fallback to popover for desktop
      setIsPopoverOpen(true)
    }
  }

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className={className}
          onClick={handleMainShare}
        >
          <Share2 className="h-4 w-4" />
          <span className="hidden sm:inline ml-1">Partilhar</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64" align="end">
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Partilhar proposta</h4>
          <div className="grid grid-cols-3 gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex flex-col gap-1 h-auto py-2"
              onClick={() => handleShare('x')}
            >
              <FaXTwitter className="h-4 w-4" />
              <span className="text-xs">X</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex flex-col gap-1 h-auto py-2"
              onClick={() => handleShare('facebook')}
            >
              <Facebook className="h-4 w-4" />
              <span className="text-xs">Facebook</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex flex-col gap-1 h-auto py-2"
              onClick={() => handleShare('linkedin')}
            >
              <Linkedin className="h-4 w-4" />
              <span className="text-xs">LinkedIn</span>
            </Button>
          </div>
          <div className="border-t pt-3">
            <CopyUrlButton 
              url={url}
              variant="copy"
              className="w-full justify-start"
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
} 
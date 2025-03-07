"use client"

import { X, Facebook, Linkedin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CopyUrlButton } from "./CopyUrl"
import { FaXTwitter } from "react-icons/fa6";

interface SocialShareCardProps {
  url: string
  title: string
}

export function SocialShareCard({ url, title }: SocialShareCardProps) {
  // Ensure the URL is absolute
  const fullUrl = url.startsWith('http') ? url : `https://veto.pt${url.startsWith('/') ? url : `/${url}`}`
  
  // Prepare share URLs with encoded parameters
  const encodedUrl = encodeURIComponent(fullUrl)
  const encodedTitle = encodeURIComponent(title)
  
  // Share URLs for different social media platforms
  const shareUrls = {
    x: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    reddit: `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`
  }
  
  // Function to handle share buttons
  const handleShare = (platform: keyof typeof shareUrls) => {
    const shareUrl = shareUrls[platform]
    window.open(shareUrl, "_blank", "width=600,height=600")
  }
  
  return (
    <Card className="border-blue-100 dark:border-blue-800">
      <CardHeader>
        <CardTitle>Partilhar</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Partilhe esta proposta com os seus amigos e colegas.
        </p>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 gap-1.5"
            onClick={() => handleShare('x')}
          >
            <FaXTwitter className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 gap-1.5"
            onClick={() => handleShare('facebook')}
          >
            <Facebook className="h-4 w-4" />
            Facebook
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 gap-1.5"
            onClick={() => handleShare('linkedin')}
          >
            <Linkedin className="h-4 w-4" />
            LinkedIn
          </Button>
        </div>
        <div className="mt-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full gap-1.5"
            onClick={() => handleShare('reddit')}
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
            </svg>
            Reddit
          </Button>
        </div>
        <div className="mt-4 p-2 bg-muted rounded-md flex items-center">
          <input
            type="text"
            value={fullUrl}
            readOnly
            className="bg-transparent border-none text-xs flex-1 focus:outline-none"
          />
          <CopyUrlButton url={fullUrl} />
        </div>
      </CardContent>
    </Card>
  )
}
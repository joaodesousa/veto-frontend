// components/pagination.tsx
import { type HTMLAttributes, useState, useRef, useEffect } from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface PaginationProps extends HTMLAttributes<HTMLDivElement> {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  siblingsCount?: number
}

export function Pagination({ 
  className, 
  currentPage = 1, 
  totalPages = 10, 
  onPageChange,
  siblingsCount = 1,
  ...props 
}: PaginationProps) {
  const [editingEllipsis, setEditingEllipsis] = useState<'left' | 'right' | null>(null)
  const [inputValue, setInputValue] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  // Focus input when editing starts
  useEffect(() => {
    if (editingEllipsis && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [editingEllipsis])

  // Generate page numbers to display
  const getPageNumbers = () => {
    // Always show first page
    const firstPage = 1;
    // Always show last page
    const lastPage = totalPages;
    
    // Calculate range of numbers around current page
    const leftSiblingIndex = Math.max(currentPage - siblingsCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingsCount, totalPages);
    
    // Determine whether to show ellipses
    const showLeftDots = leftSiblingIndex > 2;
    const showRightDots = rightSiblingIndex < totalPages - 1;
    
    // Handle different cases of page number visualization
    if (!showLeftDots && showRightDots) {
      // Show more pages at the beginning
      const leftRange = Array.from({ length: rightSiblingIndex }, (_, i) => i + 1);
      return [...leftRange, 'rightEllipsis', totalPages];
    }
    
    if (showLeftDots && !showRightDots) {
      // Show more pages at the end
      const rightRange = Array.from(
        { length: totalPages - leftSiblingIndex + 1 },
        (_, i) => leftSiblingIndex + i
      );
      return [1, 'leftEllipsis', ...rightRange];
    }
    
    if (showLeftDots && showRightDots) {
      // Show ellipses on both sides
      const middleRange = Array.from(
        { length: rightSiblingIndex - leftSiblingIndex + 1 },
        (_, i) => leftSiblingIndex + i
      );
      return [1, 'leftEllipsis', ...middleRange, 'rightEllipsis', totalPages];
    }
    
    // Show all pages without ellipses
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  };

  const handleEllipsisClick = (side: 'left' | 'right') => {
    setEditingEllipsis(side)
    // Set a reasonable default value
    const defaultValue = side === 'left' 
      ? Math.max(1, currentPage - Math.ceil(totalPages * 0.1)) 
      : Math.min(totalPages, currentPage + Math.ceil(totalPages * 0.1))
    setInputValue(defaultValue.toString())
  }

  const handleInputSubmit = () => {
    const pageNumber = parseInt(inputValue)
    if (pageNumber >= 1 && pageNumber <= totalPages && pageNumber !== currentPage) {
      onPageChange(pageNumber)
    }
    setEditingEllipsis(null)
    setInputValue("")
  }

  const handleInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleInputSubmit()
    } else if (e.key === 'Escape') {
      setEditingEllipsis(null)
      setInputValue("")
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Only allow numbers
    if (value === '' || /^\d+$/.test(value)) {
      setInputValue(value)
    }
  }

  const handleInputBlur = () => {
    // Small delay to allow clicking on buttons
    setTimeout(() => {
      if (inputValue) {
        handleInputSubmit()
      } else {
        setEditingEllipsis(null)
      }
    }, 150)
  }
  
  const pageNumbers = getPageNumbers();
  
  return (
    <div className={cn("flex items-center justify-center space-x-2", className)} {...props}>
      {/* Previous button */}
      <Button 
        variant="outline" 
        size="icon" 
        className="h-8 w-8"
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Página anterior</span>
      </Button>
      
      {/* Page numbers */}
      {pageNumbers.map((pageNumber, index) => {
        if (pageNumber === 'leftEllipsis' || pageNumber === 'rightEllipsis') {
          const side = pageNumber === 'leftEllipsis' ? 'left' : 'right'
          const isEditing = editingEllipsis === side
          
          if (isEditing) {
            return (
              <div key={`ellipsis-${index}`} className="relative">
                <Input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyDown={handleInputKeyPress}
                  onBlur={handleInputBlur}
                  className="h-8 w-16 text-center text-sm"
                  placeholder="..."
                />
              </div>
            )
          }
          
          return (
            <Button 
              key={`ellipsis-${index}`}
              variant="outline" 
              size="sm" 
              className="h-8 min-w-[32px] hover:bg-muted cursor-pointer" 
              onClick={() => handleEllipsisClick(side)}
              title="Clique para ir para uma página específica"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          );
        }
        
        return (
          <Button 
            key={`page-${pageNumber}`}
            variant={currentPage === pageNumber ? "default" : "outline"} 
            size="sm" 
            className={cn(
              "h-8 min-w-[32px]"
            )}
            onClick={() => onPageChange(pageNumber as number)}
          >
            {pageNumber}
          </Button>
        );
      })}
      
      {/* Next button */}
      <Button 
        variant="outline" 
        size="icon" 
        className="h-8 w-8"
        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Próxima página</span>
      </Button>
    </div>
  );
}
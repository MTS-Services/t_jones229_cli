"use client"

import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  // Always show first 5 pages, then ellipsis, then last page
  const showEllipsis = totalPages > 6
  const lastPageToShow = showEllipsis ? 5 : totalPages

  return (
    <div className="flex items-center justify-end py-4 gap-1 mt-6">
      {/* Page numbers */}
      {Array.from({ length: lastPageToShow }, (_, i) => i + 1).map((page) => (
        <Button
          key={page}
          variant={page === currentPage ? "default" : "ghost"}
          size="sm"
          onClick={() => onPageChange(page)}
          className={`
            min-w-[32px] h-8 px-3 text-sm font-medium rounded-md
            ${
              page === currentPage
                ? "bg-orange-500 hover:bg-orange-600 text-white"
                : "text-gray-700 hover:bg-gray-100 border-0"
            }
          `}
        >
          {page}
        </Button>
      ))}

      {/* Ellipsis and last page if needed */}
      {showEllipsis && (
        <>
          <span className="px-2 text-gray-500 text-sm">...</span>
          <Button
            variant={totalPages === currentPage ? "default" : "ghost"}
            size="sm"
            onClick={() => onPageChange(totalPages)}
            className={`
              min-w-[32px] h-8 px-3 text-sm font-medium rounded-md
              ${
                totalPages === currentPage
                  ? "bg-orange-500 hover:bg-orange-600 text-white"
                  : "text-gray-700 hover:bg-gray-100 border-0"
              }
            `}
          >
            {totalPages}
          </Button>
        </>
      )}

      {/* Next button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="min-w-[32px] h-8 px-3 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed border-0"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}

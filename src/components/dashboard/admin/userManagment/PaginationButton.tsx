"use client";

import React from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { HiEllipsisHorizontal } from "react-icons/hi2";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PaginationButton = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  // Logic to calculate which numbers to show
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, "ellipsis", totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(
          1,
          "ellipsis",
          totalPages - 4,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pages.push(
          1,
          "ellipsis",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "ellipsis",
          totalPages
        );
      }
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-1 mt-5">
      {/* Left Arrow */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:text-orange-500 transition-colors"
      >
        <MdChevronLeft size={28} />
      </button>

      {/* Numbers */}
      <div className="flex items-center gap-2">
        {getPageNumbers().map((page, index) => {
          if (page === "ellipsis") {
            return (
              <span key={`dots-${index}`} className="px-1 text-gray-800">
                <HiEllipsisHorizontal size={20} />
              </span>
            );
          }

          const isActive = page === currentPage;

          return (
            <button
              key={page}
              onClick={() => onPageChange(page as number)}
              className={`
                w-9 h-9 flex items-center justify-center text-[15px] border transition-all
                ${
                  isActive
                    ? "bg-[#FF9900] border-[#FF9900] text-white font-medium"
                    : "bg-white border-gray-200 text-gray-500 hover:border-gray-400"
                }
                rounded-[2px]
              `}
            >
              {page}
            </button>
          );
        })}
      </div>

      {/* Right Arrow */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 text-black disabled:opacity-30 disabled:cursor-not-allowed hover:text-orange-500 transition-colors"
      >
        <MdChevronRight size={28} />
      </button>
    </div>
  );
};

export default PaginationButton;

"use client";

import { useState, useMemo } from "react";

// Logic part
interface UsePaginationProps<T> {
  items: T[];
  itemsPerPage?: number;
}

export function usePagination<T>({ items, itemsPerPage = 10 }: UsePaginationProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);

  const pagination = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedItems = items.slice(startIndex, endIndex);
    const totalPages = Math.ceil(items.length / itemsPerPage);

    return {
      currentPage,
      setCurrentPage,
      paginatedItems,
      totalPages,
      itemsPerPage,
      totalItems: items.length,
    };
  }, [currentPage, items, itemsPerPage]);

  return pagination;
}

// Interface for Pagination component props
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsShown: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsShown,
  onPageChange,
}: PaginationProps) {
  return (
    <div>
      <div className="flex items-center justify-between mt-8 p-4 bg-white rounded-xl border border-gray-100">
        <button
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-all"
        >
          Previous
        </button>

        <div className="flex gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-10 h-10 rounded-lg font-bold transition-all ${
                currentPage === page
                  ? "bg-[#0084c8] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-all"
        >
          Next
        </button>
      </div>

      <p className="text-center text-gray-600 mt-4">
        Page {currentPage} of {totalPages} • Showing {itemsShown} of {totalItems} items
      </p>
    </div>
  );
}

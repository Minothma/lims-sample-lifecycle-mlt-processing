// components/shared/Pagination.tsx
"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    pageSize: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({
                                       currentPage,
                                       totalPages,
                                       totalItems,
                                       pageSize,
                                       onPageChange,
                                   }: PaginationProps) {
    const start = (currentPage - 1) * pageSize + 1;
    const end   = Math.min(currentPage * pageSize, totalItems);

    return (
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">

            {/* Info text */}
            <p className="text-xs text-gray-500">
                Showing {start} to {end} of {totalItems} pending collections
            </p>

            {/* Page buttons */}
            <div className="flex items-center gap-1">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-1.5 rounded text-gray-400 hover:text-gray-700
                     hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed
                     transition-all"
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={cn(
                            "w-7 h-7 rounded text-xs font-medium transition-all",
                            page === currentPage
                                ? "bg-blue-600 text-white shadow-sm"
                                : "text-gray-600 hover:bg-gray-100"
                        )}
                    >
                        {page}
                    </button>
                ))}

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-1.5 rounded text-gray-400 hover:text-gray-700
                     hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed
                     transition-all"
                >
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
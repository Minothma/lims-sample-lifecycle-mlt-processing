// components/phlebotomy/WorklistFilters.tsx
"use client";

import { Search, Filter, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface WorklistFiltersProps {
    onSearch: (query: string) => void;
    onPriorityChange: (priority: string) => void;
    selectedPriority: string;
}

const PRIORITY_OPTIONS = [
    { label: "All Priority", value: "ALL" },
    { label: "Urgent",       value: "URGENT" },
    { label: "Normal",       value: "NORMAL" },
    { label: "STAT",         value: "STAT" },
];

export default function WorklistFilters({
                                            onSearch,
                                            onPriorityChange,
                                            selectedPriority,
                                        }: WorklistFiltersProps) {
    const [query, setQuery] = useState("");

    const handleSearch = (val: string) => {
        setQuery(val);
        onSearch(val);
    };

    return (
        <div className="flex items-center justify-between gap-3 flex-wrap">

            {/* ── Search Input ── */}
            <div className="relative flex-1 min-w-[260px] max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Search by Patient Name, PID or Order ID..."
                    className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg
                     bg-white text-gray-800 placeholder-gray-400
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     transition-all"
                />
            </div>

            {/* ── Right Controls ── */}
            <div className="flex items-center gap-2">

                {/* Priority Dropdown */}
                <div className="relative">
                    <select
                        value={selectedPriority}
                        onChange={(e) => onPriorityChange(e.target.value)}
                        className="appearance-none pl-3 pr-8 py-2 text-sm border border-gray-200
                       rounded-lg bg-white text-gray-700 cursor-pointer
                       focus:outline-none focus:ring-2 focus:ring-blue-500
                       transition-all"
                    >
                        {PRIORITY_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                    <SlidersHorizontal className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                </div>

                {/* Filter Button */}
                <button className="flex items-center gap-1.5 px-3 py-2 text-sm border
                           border-gray-200 rounded-lg bg-white text-gray-600
                           hover:bg-gray-50 hover:text-gray-900 transition-all">
                    <Filter className="w-3.5 h-3.5" />
                    Filters
                </button>

            </div>
        </div>
    );
}
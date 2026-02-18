// components/mlt/MLTFilterBar.tsx
"use client";

import { Search, Printer, Plus, SlidersHorizontal } from "lucide-react";
import { DEPARTMENTS, TEST_TYPES } from "@/mock/mlt.mock";

interface MLTFilterBarProps {
    searchQuery:     string;
    department:      string;
    testType:        string;
    onSearch:        (q: string) => void;
    onDepartment:    (d: string) => void;
    onTestType:      (t: string) => void;
    mode:            "worklist" | "all";
    onPrintBatch?:   () => void;
    onNewEntry?:     () => void;
    onPrint?:        () => void;
}

export default function MLTFilterBar({
                                         searchQuery,
                                         department,
                                         testType,
                                         onSearch,
                                         onDepartment,
                                         onTestType,
                                         mode,
                                         onPrintBatch,
                                         onNewEntry,
                                         onPrint,
                                     }: MLTFilterBarProps) {
    return (
        <div className="flex items-center justify-between gap-3 flex-wrap">

            {/* ── Search ── */}
            <div className="relative flex-1 min-w-[240px] max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearch(e.target.value)}
                    placeholder="Search Sample ID, Patient Name..."
                    className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg
                     bg-white text-gray-800 placeholder-gray-400
                     focus:outline-none focus:ring-2 focus:ring-blue-500
                     focus:border-transparent transition-all"
                />
            </div>

            {/* ── Filters ── */}
            <div className="flex items-center gap-2 flex-wrap">

                {/* Department */}
                <select
                    value={department}
                    onChange={(e) => onDepartment(e.target.value)}
                    className="px-3 py-2 text-sm border border-gray-200 rounded-lg
                     bg-white text-gray-700 focus:outline-none
                     focus:ring-2 focus:ring-blue-500 transition-all"
                >
                    {DEPARTMENTS.map((d) => (
                        <option key={d} value={d}>{d}</option>
                    ))}
                </select>

                {/* Test Type */}
                <select
                    value={testType}
                    onChange={(e) => onTestType(e.target.value)}
                    className="px-3 py-2 text-sm border border-gray-200 rounded-lg
                     bg-white text-gray-700 focus:outline-none
                     focus:ring-2 focus:ring-blue-500 transition-all"
                >
                    {TEST_TYPES.map((t) => (
                        <option key={t} value={t}>{t}</option>
                    ))}
                </select>

                {/* Date badge */}
                <div className="flex items-center gap-1.5 px-3 py-2 border border-gray-200
                        rounded-lg bg-white text-sm text-gray-600">
                    📅 Today, 24 Oct
                </div>

                {/* Sort */}
                <button className="p-2 border border-gray-200 rounded-lg bg-white
                           text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-all">
                    <SlidersHorizontal className="w-4 h-4" />
                </button>

                {/* Mode-specific buttons */}
                {mode === "worklist" && (
                    <>
                        <button
                            onClick={onPrintBatch}
                            className="flex items-center gap-1.5 px-3 py-2 border border-gray-200
                         rounded-lg bg-white text-sm text-gray-600
                         hover:bg-gray-50 transition-all"
                        >
                            <Printer className="w-3.5 h-3.5" />
                            Print Batch
                        </button>
                        <button
                            onClick={onNewEntry}
                            className="flex items-center gap-1.5 px-3 py-2 bg-blue-600
                         hover:bg-blue-700 text-white text-sm font-semibold
                         rounded-lg transition-all active:scale-95"
                        >
                            <Plus className="w-3.5 h-3.5" />
                            New Test Entry
                        </button>
                    </>
                )}

                {mode === "all" && (
                    <button
                        onClick={onPrint}
                        className="flex items-center gap-1.5 px-3 py-2 border border-gray-200
                       rounded-lg bg-white text-sm text-gray-600
                       hover:bg-gray-50 transition-all"
                    >
                        <Printer className="w-3.5 h-3.5" />
                        Print
                    </button>
                )}
            </div>
        </div>
    );
}
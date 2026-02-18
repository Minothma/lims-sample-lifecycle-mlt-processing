// app/(dashboard)/phlebotomy/worklist/page.tsx
"use client";

import { useState, useMemo } from "react";
import {
    ClipboardList,
    AlertCircle,
    CheckCircle2,
    XCircle,
} from "lucide-react";
import StatCard        from "@/components/shared/StatCard";
import WorklistFilters from "@/components/phlebotomy/WorklistFilters";
import WorklistRow     from "@/components/phlebotomy/WorklistRow";
import Pagination      from "@/components/shared/Pagination";
import { MOCK_WORKLIST, MOCK_DASHBOARD_STATS } from "@/mock/phlebotomy.mock";
import { toast } from "sonner";

const PAGE_SIZE = 8;

// Table column headers
const COLUMNS = [
    { label: "PATIENT DETAILS",  width: "w-[260px]" },
    { label: "PRIORITY",         width: "w-[100px]" },
    { label: "TEST REQUESTED",   width: "" },
    { label: "REQUIRED TUBES",   width: "w-[130px]" },
    { label: "WAIT TIME",        width: "w-[100px]" },
    { label: "ACTIONS",          width: "w-[220px]" },
];

export default function PhlebotomyWorklistPage() {
    const [searchQuery,      setSearchQuery]      = useState("");
    const [selectedPriority, setSelectedPriority] = useState("ALL");
    const [currentPage,      setCurrentPage]      = useState(1);

    // ── Filter logic ──────────────────────────────────────────────
    const filtered = useMemo(() => {
        return MOCK_WORKLIST.filter((s) => {
            const matchesSearch =
                !searchQuery ||
                s.patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                s.patient.pid.toLowerCase().includes(searchQuery.toLowerCase()) ||
                s.orderId.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesPriority =
                selectedPriority === "ALL" || s.priority === selectedPriority;

            return matchesSearch && matchesPriority;
        });
    }, [searchQuery, selectedPriority]);

    // ── Pagination logic ──────────────────────────────────────────
    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paginated  = filtered.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );

    // Reset to page 1 when filters change
    const handleSearch = (q: string) => {
        setSearchQuery(q);
        setCurrentPage(1);
    };
    const handlePriority = (p: string) => {
        setSelectedPriority(p);
        setCurrentPage(1);
    };

    // ── Start Collection handler ───────────────────────────────────
    const handleStartCollection = (sampleId: string) => {
        const sample = MOCK_WORKLIST.find((s) => s.id === sampleId);
        toast.success(`Collection started`, {
            description: `Patient: ${sample?.patient.name} — ${sample?.sampleId}`,
        });
        // TODO: navigate to collection detail page or call API
    };

    return (
        <div className="space-y-5">

            {/* ── Page Header ── */}
            <div>
                <h1 className="page-header">Ready for Sample Collection</h1>
                <p className="page-subtitle">
                    Manage pending laboratory collection orders and patient queues.
                </p>
            </div>

            {/* ── Stat Cards ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    label="Pending Collections"
                    value={MOCK_DASHBOARD_STATS.pendingCollections}
                    icon={ClipboardList}
                    color="blue"
                />
                <StatCard
                    label="Urgent Samples"
                    value={MOCK_DASHBOARD_STATS.urgentSamples}
                    icon={AlertCircle}
                    color="orange"
                    badge="Action needed"
                    badgeColor="orange"
                />
                <StatCard
                    label="Collected Today"
                    value={MOCK_DASHBOARD_STATS.collectedToday}
                    icon={CheckCircle2}
                    color="green"
                    badge="Shift Target: 80%"
                    badgeColor="green"
                />
                <StatCard
                    label="Rejections"
                    value={MOCK_DASHBOARD_STATS.rejections}
                    icon={XCircle}
                    color="red"
                    badge="-0.4% improvement"
                    badgeColor="red"
                />
            </div>

            {/* ── Worklist Table Card ── */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">

                {/* Search & Filters */}
                <div className="p-4 border-b border-gray-100">
                    <WorklistFilters
                        onSearch={handleSearch}
                        onPriorityChange={handlePriority}
                        selectedPriority={selectedPriority}
                    />
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                        <tr className="border-b border-gray-100 bg-gray-50/60">
                            {COLUMNS.map((col) => (
                                <th
                                    key={col.label}
                                    className={`px-4 py-2.5 text-left text-[11px] font-semibold
                                uppercase tracking-wider text-gray-500 ${col.width}`}
                                >
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {paginated.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-4 py-12 text-center">
                                    <p className="text-gray-400 text-sm">
                                        No samples match your search criteria
                                    </p>
                                </td>
                            </tr>
                        ) : (
                            paginated.map((sample) => (
                                <WorklistRow
                                    key={sample.id}
                                    sample={sample}
                                    onStartCollection={handleStartCollection}
                                />
                            ))
                        )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={filtered.length}
                    pageSize={PAGE_SIZE}
                    onPageChange={setCurrentPage}
                />
            </div>

        </div>
    );
}
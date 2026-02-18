// app/(dashboard)/reception/accessioning/page.tsx
"use client";

import { useState, useMemo } from "react";
import {
    ClipboardList,
    AlertCircle,
    CheckCircle2,
    XCircle,
    Search,
    Filter,
    RefreshCw,
} from "lucide-react";
import StatCard        from "@/components/shared/StatCard";
import AccessioningRow from "@/components/reception/AccessioningRow";
import Pagination      from "@/components/shared/Pagination";
import { MOCK_RECEPTION_SAMPLES, MOCK_RECEPTION_STATS } from "@/mock/reception.mock";
import { toast } from "sonner";

const PAGE_SIZE = 8;

const TEST_TYPE_OPTIONS = [
    "All Test Types",
    "Full Blood Count",
    "Lipid Profile",
    "Thyroid Panel",
    "Urine Culture",
    "HbA1c",
    "Serum Electrolytes",
];

const TABLE_COLUMNS = [
    { label: "Sample ID",        width: "w-[120px]" },
    { label: "Patient Details",  width: "w-[220px]" },
    { label: "Test Type",        width: "" },
    { label: "Collection Time",  width: "w-[140px]" },
    { label: "Status",           width: "w-[160px]" },
    { label: "Actions",          width: "w-[200px]" },
];

export default function ReceptionAccessioningPage() {
    const [searchQuery,   setSearchQuery]   = useState("");
    const [testTypeFilter,setTestTypeFilter] = useState("All Test Types");
    const [currentPage,   setCurrentPage]   = useState(1);

    // ── Filter logic ────────────────────────────────────────────
    const filtered = useMemo(() => {
        return MOCK_RECEPTION_SAMPLES.filter((s) => {
            const matchesSearch =
                !searchQuery ||
                s.patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                s.sampleId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                s.orderId.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesTestType =
                testTypeFilter === "All Test Types" ||
                s.testType.includes(testTypeFilter);

            return matchesSearch && matchesTestType;
        });
    }, [searchQuery, testTypeFilter]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paginated  = filtered.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );

    const handleSearch = (q: string) => {
        setSearchQuery(q);
        setCurrentPage(1);
    };

    const handleVerify = (sampleId: string) => {
        const sample = MOCK_RECEPTION_SAMPLES.find((s) => s.id === sampleId);
        toast.success("Sample verified & received", {
            description: `${sample?.sampleId} — ${sample?.patient.name} queued for analysis`,
        });
        // TODO: navigate to quality verification or call API
    };

    return (
        <div className="space-y-5">

            {/* ── Page Header ── */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="page-header">Sample Accessioning</h1>
                    <p className="page-subtitle">
                        Verify and receive samples delivered from phlebotomy stations.
                    </p>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span>📅 Oct 24, 2023</span>
                    <button
                        onClick={() => window.location.reload()}
                        className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400
                       hover:text-blue-600 transition-all"
                    >
                        <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>

            {/* ── Stat Cards ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    label="Samples Pending"
                    value={MOCK_RECEPTION_STATS.samplesPending}
                    icon={ClipboardList}
                    color="blue"
                    badge="+10% vs last hr"
                    badgeColor="blue"
                />
                <StatCard
                    label="Urgent Samples"
                    value={MOCK_RECEPTION_STATS.urgentSamples}
                    icon={AlertCircle}
                    color="orange"
                    badge="Action needed"
                    badgeColor="orange"
                />
                <StatCard
                    label="Accepted Today"
                    value={MOCK_RECEPTION_STATS.acceptedToday}
                    icon={CheckCircle2}
                    color="green"
                    badge="Shift Target: 80%"
                    badgeColor="green"
                />
                <StatCard
                    label="Rejection Rate"
                    value={MOCK_RECEPTION_STATS.rejectionRate}
                    icon={XCircle}
                    color="red"
                    badge="-0.4% improvement"
                    badgeColor="red"
                />
            </div>

            {/* ── Main Table Card ── */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">

                {/* ── Search & Filter Bar ── */}
                <div className="flex items-center justify-between gap-3 p-4 border-b border-gray-100 flex-wrap">
                    {/* Search */}
                    <div className="relative flex-1 min-w-[240px] max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => handleSearch(e.target.value)}
                            placeholder="Search Sample ID, Patient Name..."
                            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg
                         bg-white text-gray-800 placeholder-gray-400
                         focus:outline-none focus:ring-2 focus:ring-blue-500
                         focus:border-transparent transition-all"
                        />
                    </div>

                    {/* Right controls */}
                    <div className="flex items-center gap-2">
                        {/* Test Type filter */}
                        <select
                            value={testTypeFilter}
                            onChange={(e) => {
                                setTestTypeFilter(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="px-3 py-2 text-sm border border-gray-200 rounded-lg
                         bg-white text-gray-700 focus:outline-none
                         focus:ring-2 focus:ring-blue-500 transition-all"
                        >
                            {TEST_TYPE_OPTIONS.map((opt) => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </select>

                        {/* Filter button */}
                        <button className="flex items-center gap-1.5 px-3 py-2 text-sm border
                               border-gray-200 rounded-lg bg-white text-gray-600
                               hover:bg-gray-50 transition-all">
                            <Filter className="w-3.5 h-3.5" />
                            Filter
                        </button>
                    </div>
                </div>

                {/* ── Table ── */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                        <tr className="border-b border-gray-100 bg-gray-50/60">
                            {TABLE_COLUMNS.map((col) => (
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
                                <AccessioningRow
                                    key={sample.id}
                                    sample={sample}
                                    onVerify={handleVerify}
                                />
                            ))
                        )}
                        </tbody>
                    </table>
                </div>

                {/* ── Recently Verified Section ── */}
                <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/40">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                        Recently Verified
                    </p>
                    <p className="text-xs text-gray-400 mt-1 italic">
                        Verified samples will appear here
                    </p>
                </div>

                {/* ── Pagination ── */}
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
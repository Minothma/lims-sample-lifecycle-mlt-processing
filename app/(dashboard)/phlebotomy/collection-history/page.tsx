"use client";

// app/(dashboard)/phlebotomy/collection-history/page.tsx
import { useState, useMemo } from "react";
import {
    CheckCircle2, XCircle, Clock,
    Search, Filter, Download,
} from "lucide-react";
import StatCard      from "@/components/shared/StatCard";
import StatusBadge   from "@/components/shared/StatusBadge";
import PriorityBadge from "@/components/shared/PriorityBadge";
import Pagination    from "@/components/shared/Pagination";
import { cn }        from "@/lib/utils";

// ── Mock history data ──────────────────────────────────────────
const MOCK_HISTORY = [
    {
        id: "h1", sampleId: "S-90001", patientName: "Mohamed Shafi",
        pid: "DH-40281", testCodes: ["FBC", "CRP", "ESR"],
        priority: "URGENT" as const, status: "COLLECTED" as const,
        collectedAt: "10:22 AM", collectedBy: "Dr. Aritha Perera",
        waitTime: 22,
    },
    {
        id: "h2", sampleId: "S-90002", patientName: "Anula Rathnayake",
        pid: "DH-38822", testCodes: ["Lipid Profile", "HbA1c"],
        priority: "NORMAL" as const, status: "COLLECTED" as const,
        collectedAt: "10:15 AM", collectedBy: "Dr. Aritha Perera",
        waitTime: 8,
    },
    {
        id: "h3", sampleId: "S-90003", patientName: "Devin Samarasinghe",
        pid: "DH-41002", testCodes: ["PT/INR"],
        priority: "NORMAL" as const, status: "REJECTED" as const,
        collectedAt: "09:58 AM", collectedBy: "Dr. Aritha Perera",
        waitTime: 5,
    },
    {
        id: "h4", sampleId: "S-90004", patientName: "Kanthi Wijetunge",
        pid: "DH-40531", testCodes: ["Troponin I", "UAE"],
        priority: "URGENT" as const, status: "COLLECTED" as const,
        collectedAt: "09:45 AM", collectedBy: "Dr. Aritha Perera",
        waitTime: 14,
    },
    {
        id: "h5", sampleId: "S-90005", patientName: "Ruwan Jayawardena",
        pid: "DH-39021", testCodes: ["Blood Culture"],
        priority: "STAT" as const, status: "IN_TRANSIT" as const,
        collectedAt: "09:30 AM", collectedBy: "Dr. Aritha Perera",
        waitTime: 3,
    },
    {
        id: "h6", sampleId: "S-90006", patientName: "Priya Rajan",
        pid: "DH-41091", testCodes: ["Urine Culture"],
        priority: "NORMAL" as const, status: "COLLECTED" as const,
        collectedAt: "09:10 AM", collectedBy: "Dr. Aritha Perera",
        waitTime: 10,
    },
];

const PAGE_SIZE = 8;

const STATUS_FILTERS = [
    "All Status", "COLLECTED", "REJECTED", "IN_TRANSIT",
];

export default function CollectionHistoryPage() {
    const [searchQuery,    setSearchQuery]    = useState("");
    const [statusFilter,   setStatusFilter]   = useState("All Status");
    const [currentPage,    setCurrentPage]    = useState(1);

    const filtered = useMemo(() => {
        return MOCK_HISTORY.filter((s) => {
            const q = searchQuery.toLowerCase();
            const matchSearch =
                !q ||
                s.patientName.toLowerCase().includes(q) ||
                s.sampleId.toLowerCase().includes(q) ||
                s.pid.toLowerCase().includes(q);

            const matchStatus =
                statusFilter === "All Status" ||
                s.status === statusFilter;

            return matchSearch && matchStatus;
        });
    }, [searchQuery, statusFilter]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paginated  = filtered.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );

    const collectedCount = MOCK_HISTORY.filter((h) => h.status === "COLLECTED").length;
    const rejectedCount  = MOCK_HISTORY.filter((h) => h.status === "REJECTED").length;
    const avgWait = Math.round(
        MOCK_HISTORY.reduce((sum, h) => sum + h.waitTime, 0) / MOCK_HISTORY.length
    );

    return (
        <div className="space-y-5">

            {/* ── Header ── */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="page-header">Collection History</h1>
                    <p className="page-subtitle">
                        Today's completed sample collections by this station
                    </p>
                </div>
                <button className="flex items-center gap-1.5 px-3 py-2 border border-gray-200
                           rounded-lg bg-white text-sm text-gray-600
                           hover:bg-gray-50 transition-all">
                    <Download className="w-3.5 h-3.5" />
                    Export CSV
                </button>
            </div>

            {/* ── Stat Cards ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    label="Total Collected"
                    value={collectedCount}
                    icon={CheckCircle2}
                    color="green"
                />
                <StatCard
                    label="Rejections"
                    value={rejectedCount}
                    icon={XCircle}
                    color="red"
                />
                <StatCard
                    label="Avg Wait Time"
                    value={`${avgWait}m`}
                    icon={Clock}
                    color="blue"
                />
                <StatCard
                    label="Total Processed"
                    value={MOCK_HISTORY.length}
                    icon={CheckCircle2}
                    color="purple"
                />
            </div>

            {/* ── Table Card ── */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">

                {/* Filters */}
                <div className="flex items-center gap-3 p-4 border-b border-gray-100 flex-wrap">
                    <div className="relative flex-1 min-w-[240px] max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2
                               w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setCurrentPage(1);
                            }}
                            placeholder="Search patient, sample ID..."
                            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200
                         rounded-lg focus:outline-none focus:ring-2
                         focus:ring-blue-500 transition-all"
                        />
                    </div>

                    <select
                        value={statusFilter}
                        onChange={(e) => {
                            setStatusFilter(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="px-3 py-2 text-sm border border-gray-200 rounded-lg
                       bg-white text-gray-700 focus:outline-none
                       focus:ring-2 focus:ring-blue-500 transition-all"
                    >
                        {STATUS_FILTERS.map((s) => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>

                    <button className="flex items-center gap-1.5 px-3 py-2 border
                             border-gray-200 rounded-lg bg-white text-sm
                             text-gray-600 hover:bg-gray-50 transition-all">
                        <Filter className="w-3.5 h-3.5" />
                        Filter by Date
                    </button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                        <tr className="border-b border-gray-100 bg-gray-50/60">
                            {[
                                "Sample ID", "Patient", "Tests",
                                "Priority", "Status", "Collected At",
                                "Wait Time",
                            ].map((col) => (
                                <th
                                    key={col}
                                    className="px-4 py-2.5 text-left text-[11px] font-semibold
                               uppercase tracking-wider text-gray-500"
                                >
                                    {col}
                                </th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {paginated.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-4 py-12 text-center">
                                    <p className="text-gray-400 text-sm">
                                        No records match your search
                                    </p>
                                </td>
                            </tr>
                        ) : (
                            paginated.map((item) => (
                                <tr
                                    key={item.id}
                                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                                >
                                    {/* Sample ID */}
                                    <td className="px-4 py-3">
                      <span className="text-sm font-bold text-blue-600 font-mono">
                        {item.sampleId}
                      </span>
                                    </td>

                                    {/* Patient */}
                                    <td className="px-4 py-3">
                                        <p className="text-sm font-semibold text-gray-900">
                                            {item.patientName}
                                        </p>
                                        <p className="text-xs text-gray-400">{item.pid}</p>
                                    </td>

                                    {/* Tests */}
                                    <td className="px-4 py-3">
                                        <div className="flex flex-wrap gap-1">
                                            {item.testCodes.map((code) => (
                                                <span
                                                    key={code}
                                                    className="px-1.5 py-0.5 bg-gray-100 text-gray-600
                                       text-[11px] font-medium rounded"
                                                >
                            {code}
                          </span>
                                            ))}
                                        </div>
                                    </td>

                                    {/* Priority */}
                                    <td className="px-4 py-3">
                                        <PriorityBadge priority={item.priority} />
                                    </td>

                                    {/* Status */}
                                    <td className="px-4 py-3">
                                        <StatusBadge status={item.status} />
                                    </td>

                                    {/* Collected At */}
                                    <td className="px-4 py-3">
                                        <p className="text-sm text-gray-700">{item.collectedAt}</p>
                                        <p className="text-[10px] text-gray-400">{item.collectedBy}</p>
                                    </td>

                                    {/* Wait Time */}
                                    <td className="px-4 py-3">
                      <span className={cn(
                          "text-sm font-semibold",
                          item.waitTime > 20
                              ? "text-red-600"
                              : item.waitTime > 10
                                  ? "text-amber-600"
                                  : "text-green-600"
                      )}>
                        {item.waitTime} min
                      </span>
                                    </td>
                                </tr>
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
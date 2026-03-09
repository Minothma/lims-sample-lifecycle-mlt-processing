"use client";

// app/(dashboard)/reception/logs/page.tsx
import { useState, useMemo } from "react";
import {
    History, CheckCircle2, XCircle,
    Search, Download, Filter,
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import StatusBadge   from "@/components/shared/StatusBadge";
import PriorityBadge from "@/components/shared/PriorityBadge";
import Pagination    from "@/components/shared/Pagination";
import StatCard      from "@/components/shared/StatCard";
import { cn }        from "@/lib/utils";
import { toast }     from "sonner";

const MOCK_LOGS = [
    {
        id: "al1", sampleId: "S-90231", patientName: "Jane Doe",
        pid: "DH-40281", testType: "HbA1c + Lipid Profile",
        priority: "NORMAL" as const, action: "VERIFIED",
        status: "ACCEPTED" as const,
        performedBy: "Lab Tech Perera", timestamp: "10:30 AM",
        notes: "Sample within stability window",
    },
    {
        id: "al2", sampleId: "S-90232", patientName: "Mohamed Kamil",
        pid: "DH-38822", testType: "Full Blood Count",
        priority: "URGENT" as const, action: "VERIFIED",
        status: "ACCEPTED" as const,
        performedBy: "Lab Tech Perera", timestamp: "10:43 AM",
        notes: "",
    },
    {
        id: "al3", sampleId: "S-90233", patientName: "Chaminda Silva",
        pid: "DH-41290", testType: "Blood Culture",
        priority: "STAT" as const, action: "REJECTED",
        status: "REJECTED" as const,
        performedBy: "Lab Tech Mendis", timestamp: "10:51 AM",
        notes: "Hemolyzed sample — re-collection requested",
    },
    {
        id: "al4", sampleId: "S-90235", patientName: "Priya Rajan",
        pid: "DH-41002", testType: "Thyroid Panel",
        priority: "URGENT" as const, action: "VERIFIED",
        status: "ACCEPTED" as const,
        performedBy: "Lab Tech Perera", timestamp: "10:52 AM",
        notes: "",
    },
    {
        id: "al5", sampleId: "S-90199", patientName: "Saman Perera",
        pid: "DH-40531", testType: "Urine Culture",
        priority: "NORMAL" as const, action: "REJECTED",
        status: "REJECTED" as const,
        performedBy: "Lab Tech Mendis", timestamp: "11:02 AM",
        notes: "Incorrect container used",
    },
    {
        id: "al6", sampleId: "S-90241", patientName: "Kamala Jayasinghe",
        pid: "DH-39105", testType: "Serum Electrolytes",
        priority: "URGENT" as const, action: "VERIFIED",
        status: "ACCEPTED" as const,
        performedBy: "Lab Tech Perera", timestamp: "11:05 AM",
        notes: "STAT — ICU patient",
    },
];

const PAGE_SIZE = 8;
const ACTION_FILTERS = ["All Actions", "VERIFIED", "REJECTED"];

export default function AccessioningLogsPage() {
    const [searchQuery,  setSearchQuery]  = useState("");
    const [actionFilter, setActionFilter] = useState("All Actions");
    const [currentPage,  setCurrentPage]  = useState(1);

    const filtered = useMemo(() => {
        return MOCK_LOGS.filter((log) => {
            const q = searchQuery.toLowerCase();
            const matchSearch =
                !q ||
                log.patientName.toLowerCase().includes(q) ||
                log.sampleId.toLowerCase().includes(q) ||
                log.pid.toLowerCase().includes(q);
            const matchAction =
                actionFilter === "All Actions" || log.action === actionFilter;
            return matchSearch && matchAction;
        });
    }, [searchQuery, actionFilter]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paginated  = filtered.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );

    const acceptedCount = MOCK_LOGS.filter((l) => l.action === "VERIFIED").length;
    const rejectedCount = MOCK_LOGS.filter((l) => l.action === "REJECTED").length;

    // ── Export PDF handler ────────────────────────────────────────
    const handleExportPDF = () => {
        const doc = new jsPDF();

        // Title
        doc.setFontSize(16);
        doc.setTextColor(30, 64, 175);
        doc.text("Durdans Hospital — Accessioning Logs", 14, 18);

        // Subtitle
        doc.setFontSize(9);
        doc.setTextColor(100);
        doc.text(
            `Exported on: ${new Date().toLocaleDateString("en-GB", {
                day: "numeric", month: "short", year: "numeric",
            })}`,
            14, 26
        );

        // Summary line
        doc.text(
            `Total: ${MOCK_LOGS.length}  |  Accepted: ${acceptedCount}  |  Rejected: ${rejectedCount}  |  Rejection Rate: ${Math.round((rejectedCount / MOCK_LOGS.length) * 100)}%`,
            14, 33
        );

        // Table
        autoTable(doc, {
            startY: 38,
            head: [["Sample ID", "Patient", "PID", "Test Type", "Priority", "Action", "Performed By", "Time", "Notes"]],
            body: MOCK_LOGS.map((log) => [
                log.sampleId,
                log.patientName,
                log.pid,
                log.testType,
                log.priority,
                log.action,
                log.performedBy,
                log.timestamp,
                log.notes || "—",
            ]),
            styles: { fontSize: 8 },
            headStyles: { fillColor: [30, 64, 175] },
            didParseCell: (data) => {
                const row = MOCK_LOGS[data.row.index];
                if (data.section === "body" && row?.action === "REJECTED") {
                    data.cell.styles.fillColor = [254, 226, 226];
                }
            },
        });

        doc.save(`accessioning-logs-${new Date().toISOString().slice(0, 10)}.pdf`);
        toast.success("PDF exported successfully");
    };

    return (
        <div className="space-y-5">

            {/* ── Header ── */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="page-header">Accessioning Logs</h1>
                    <p className="page-subtitle">
                        Complete audit trail of sample verification actions today
                    </p>
                </div>
                <button
                    onClick={handleExportPDF}
                    className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-lg bg-white text-sm text-gray-600 hover:bg-gray-50 transition-all">
                    <Download className="w-3.5 h-3.5" />
                    Export Logs
                </button>
            </div>

            {/* ── Stat Cards ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    label="Total Processed"
                    value={MOCK_LOGS.length}
                    icon={History}
                    color="blue"
                />
                <StatCard
                    label="Accepted"
                    value={acceptedCount}
                    icon={CheckCircle2}
                    color="green"
                />
                <StatCard
                    label="Rejected"
                    value={rejectedCount}
                    icon={XCircle}
                    color="red"
                />
                <StatCard
                    label="Rejection Rate"
                    value={`${Math.round((rejectedCount / MOCK_LOGS.length) * 100)}%`}
                    icon={XCircle}
                    color="orange"
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
                        value={actionFilter}
                        onChange={(e) => {
                            setActionFilter(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="px-3 py-2 text-sm border border-gray-200 rounded-lg
                       bg-white text-gray-700 focus:outline-none
                       focus:ring-2 focus:ring-blue-500 transition-all"
                    >
                        {ACTION_FILTERS.map((f) => (
                            <option key={f} value={f}>{f}</option>
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
                                "Sample ID", "Patient", "Test Type",
                                "Priority", "Action", "Status",
                                "Performed By", "Time", "Notes",
                            ].map((col) => (
                                <th key={col} className="px-4 py-2.5 text-left text-[11px]
                                           font-semibold uppercase tracking-wider
                                           text-gray-500">
                                    {col}
                                </th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {paginated.length === 0 ? (
                            <tr>
                                <td colSpan={9} className="px-4 py-12 text-center">
                                    <p className="text-gray-400 text-sm">No logs match your search</p>
                                </td>
                            </tr>
                        ) : (
                            paginated.map((log) => (
                                <tr
                                    key={log.id}
                                    className={cn(
                                        "border-b border-gray-100 transition-colors hover:bg-gray-50",
                                        log.action === "REJECTED" && "bg-red-50/20 hover:bg-red-50/40"
                                    )}
                                >
                                    <td className="px-4 py-3">
                                        <span className="text-sm font-bold text-blue-600 font-mono">
                                            {log.sampleId}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <p className="text-sm font-semibold text-gray-900">{log.patientName}</p>
                                        <p className="text-xs text-gray-400">{log.pid}</p>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="text-xs font-medium text-gray-700">{log.testType}</span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <PriorityBadge priority={log.priority} />
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={cn(
                                            "inline-flex items-center gap-1 px-2 py-0.5 rounded",
                                            "text-[11px] font-bold",
                                            log.action === "VERIFIED"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-700"
                                        )}>
                                            {log.action === "VERIFIED"
                                                ? <CheckCircle2 className="w-3 h-3" />
                                                : <XCircle className="w-3 h-3" />
                                            }
                                            {log.action}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <StatusBadge status={log.status} />
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="text-xs text-gray-600">{log.performedBy}</span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="text-xs font-medium text-gray-700">{log.timestamp}</span>
                                    </td>
                                    <td className="px-4 py-3 max-w-[180px]">
                                        <span className="text-xs text-gray-500 italic">{log.notes || "—"}</span>
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
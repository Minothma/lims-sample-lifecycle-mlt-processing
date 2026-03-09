// app/(dashboard)/mlt/worklist/page.tsx
"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import MLTStatCards     from "@/components/mlt/MLTStatCards";
import MLTFilterBar     from "@/components/mlt/MLTFilterBar";
import MLTWorklistRow   from "@/components/mlt/MLTWorklistRow";
import InstrumentStatus from "@/components/mlt/InstrumentStatus";
import Pagination       from "@/components/shared/Pagination";
import {
    MOCK_MLT_WORKLIST,
    MOCK_MLT_STATS,
    MOCK_INSTRUMENTS,
} from "@/mock/mlt.mock";
import { toast } from "sonner";

const PAGE_SIZE = 8;

const TABLE_COLUMNS = [
    { label: "Sample ID",       width: "w-[150px]" },
    { label: "Patient Details", width: "w-[240px]" },
    { label: "Test Type",       width: ""           },
    { label: "Priority",        width: "w-[100px]" },
    { label: "Status",          width: "w-[180px]" },
    { label: "Action",          width: "w-[140px]" },
];

export default function MLTWorklistPage() {
    const router = useRouter();

    const [searchQuery, setSearchQuery] = useState("");
    const [department,  setDepartment]  = useState("All Departments");
    const [testType,    setTestType]    = useState("All Test Types");
    const [currentPage, setCurrentPage] = useState(1);

    // ── Filter logic ─────────────────────────────────────────────
    const filtered = useMemo(() => {
        return MOCK_MLT_WORKLIST.filter((s) => {
            const q = searchQuery.toLowerCase();
            const matchesSearch =
                !q ||
                s.patient.name.toLowerCase().includes(q) ||
                s.sampleId.toLowerCase().includes(q);

            const matchesDept =
                department === "All Departments" ||
                s.department === department;

            const matchesTest =
                testType === "All Test Types" ||
                s.testType.includes(testType);

            return matchesSearch && matchesDept && matchesTest;
        });
    }, [searchQuery, department, testType]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paginated  = filtered.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );

    const handleSearch     = (q: string) => { setSearchQuery(q); setCurrentPage(1); };
    const handleDepartment = (d: string) => { setDepartment(d);  setCurrentPage(1); };
    const handleTestType   = (t: string) => { setTestType(t);    setCurrentPage(1); };

    // ── Start Testing — passes sampleId via URL ───────────────────
    const handleStartTesting = (id: string) => {
        const sample = MOCK_MLT_WORKLIST.find((s) => s.id === id);
        if (sample) {
            router.push(`/mlt/result-entry?sampleId=${sample.sampleId}`);
        }
    };

    // ── New Test Entry — blank form ───────────────────────────────
    const handleNewEntry = () => {
        router.push("/mlt/result-entry?new=true");
    };

    // ── Print Batch — exports current page as PDF ─────────────────
    const handlePrintBatch = () => {
        if (paginated.length === 0) {
            toast.error("No samples to print");
            return;
        }

        const doc = new jsPDF();

        // Title
        doc.setFontSize(16);
        doc.setTextColor(30, 64, 175);
        doc.text("Durdans Hospital — MLT Sample Worklist", 14, 18);

        // Subtitle
        doc.setFontSize(9);
        doc.setTextColor(100);
        doc.text(
            `Printed on: ${new Date().toLocaleDateString("en-GB", {
                day: "numeric", month: "short", year: "numeric",
            })}   |   Showing ${paginated.length} samples`,
            14, 26
        );

        // Table
        autoTable(doc, {
            startY: 32,
            head: [["Sample ID", "Patient", "Department", "Test Type", "Priority", "Received"]],
            body: paginated.map((s) => [
                s.sampleId,
                `${s.patient.name} (${s.patient.pid})`,
                s.department,
                s.testType,
                s.priority,
                s.receivedTime,
            ]),
            styles: { fontSize: 8 },
            headStyles: { fillColor: [30, 64, 175] },
            didParseCell: (data) => {
                const row = paginated[data.row.index];
                if (data.section === "body" && row?.priority === "URGENT") {
                    data.cell.styles.fillColor = [254, 226, 226];
                }
            },
        });

        doc.save(`mlt-worklist-batch-${new Date().toISOString().slice(0, 10)}.pdf`);
        toast.success("Batch PDF exported successfully");
    };

    return (
        <div className="space-y-5">

            {/* ── Page Header ── */}
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                        Laboratory › Worklist
                    </p>
                    <h1 className="page-header mt-0.5">Sample Worklist</h1>
                </div>
            </div>

            {/* ── Stat Cards ── */}
            <MLTStatCards
                rejectedTests={MOCK_MLT_STATS.rejectedTests}
                rejectedSince={MOCK_MLT_STATS.rejectedSince}
                pendingTests={MOCK_MLT_STATS.pendingTests}
                pendingSince={MOCK_MLT_STATS.pendingSince}
                criticalResults={MOCK_MLT_STATS.criticalResults}
                myDrafts={MOCK_MLT_STATS.myDrafts}
            />

            {/* ── Main content: Table + Instruments ── */}
            <div className="flex gap-5">

                {/* ── Worklist Table ── */}
                <div className="flex-1 bg-white rounded-lg border border-gray-200
                        shadow-sm overflow-hidden min-w-0">

                    {/* Filter bar */}
                    <div className="p-4 border-b border-gray-100">
                        <MLTFilterBar
                            searchQuery={searchQuery}
                            department={department}
                            testType={testType}
                            onSearch={handleSearch}
                            onDepartment={handleDepartment}
                            onTestType={handleTestType}
                            mode="worklist"
                            onPrintBatch={handlePrintBatch}
                            onNewEntry={handleNewEntry}
                        />
                    </div>

                    {/* Table */}
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
                                            No samples match your filters
                                        </p>
                                    </td>
                                </tr>
                            ) : (
                                paginated.map((sample) => (
                                    <MLTWorklistRow
                                        key={sample.id}
                                        sample={sample}
                                        mode="worklist"
                                        onAction={handleStartTesting}
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

                {/* ── Instrument Status Sidebar ── */}
                <div className="w-48 flex-shrink-0 space-y-3">
                    <InstrumentStatus instruments={MOCK_INSTRUMENTS} />
                </div>
            </div>

        </div>
    );
}
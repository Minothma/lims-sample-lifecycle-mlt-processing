// app/(dashboard)/mlt/all-worklist/page.tsx
"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import MLTFilterBar   from "@/components/mlt/MLTFilterBar";
import MLTWorklistRow from "@/components/mlt/MLTWorklistRow";
import InstrumentStatus from "@/components/mlt/InstrumentStatus";
import Pagination     from "@/components/shared/Pagination";
import {
    MOCK_MLT_ALL_WORKLIST,
    MOCK_INSTRUMENTS,
} from "@/mock/mlt.mock";
import { toast } from "sonner";

const PAGE_SIZE = 8;

const TABLE_COLUMNS = [
    { label: "Sample ID",       width: "w-[150px]" },
    { label: "Patient Details", width: "w-[240px]" },
    { label: "Test Type",       width: ""           },
    { label: "Priority",        width: "w-[100px]" },
    { label: "Status",          width: "w-[200px]" },
    { label: "Action",          width: "w-[140px]" },
];

export default function MLTAllWorklistPage() {
    const router = useRouter();

    const [searchQuery, setSearchQuery] = useState("");
    const [department,  setDepartment]  = useState("All Departments");
    const [testType,    setTestType]    = useState("All Test Types");
    const [currentPage, setCurrentPage] = useState(1);

    // ── Filter logic ────────────────────────────────────────────
    const filtered = useMemo(() => {
        return MOCK_MLT_ALL_WORKLIST.filter((s) => {
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

    const handleViewTesting = (id: string) => {
        const sample = MOCK_MLT_ALL_WORKLIST.find((s) => s.id === id);
        toast.info("Opening testing details", {
            description: `${sample?.sampleId} — ${sample?.testType}`,
        });
        router.push("/mlt/result-entry");
    };

    return (
        <div className="space-y-5">

            {/* ── Page Header ── */}
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                        Laboratory › Worklist
                    </p>
                    <h1 className="page-header mt-0.5">All Worklist</h1>
                </div>
            </div>

            {/* ── Summary banner ── */}
            <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3
                      flex items-center justify-between">
                <p className="text-sm text-blue-700 font-medium">
                    Showing <span className="font-bold">{filtered.length}</span> samples
                    {department !== "All Departments" && ` in ${department}`}
                    {testType !== "All Test Types" && ` — ${testType}`}
                </p>
                <p className="text-xs text-blue-500">
                    Sent for verification — read-only view
                </p>
            </div>

            {/* ── Main content: Table + Instruments ── */}
            <div className="flex gap-5">

                {/* ── All Worklist Table ── */}
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
                            mode="all"
                            onPrint={() => toast.info("Print list queued")}
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
                                        mode="all"
                                        onAction={handleViewTesting}
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
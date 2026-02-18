"use client";

// app/(dashboard)/mlt/result-entry/page.tsx
import { useState, useCallback, useMemo } from "react";
import { useRouter }        from "next/navigation";
import { ChevronLeft, Download, Save, Send, AlertTriangle } from "lucide-react";
import { cn }               from "@/lib/utils";
import { toast }            from "sonner";
import ResultParameterRow   from "@/components/mlt/ResultParameterRow";
import ResultSampleSidebar  from "@/components/mlt/ResultSampleSidebar";
import CriticalAlertBanner  from "@/components/mlt/CriticalAlertBanner";
import {
    MOCK_RESULT_ENTRY,
    computeFlag,
    type TestGroup,
    type TestParameter,
} from "@/mock/result-entry.mock";

const TABLE_COLUMNS = [
    { label: "Parameter",        width: "" },
    { label: "Result",           width: "w-[140px]" },
    { label: "Unit",             width: "w-[100px]" },
    { label: "Reference Range",  width: "w-[160px]" },
    { label: "Flag",             width: "w-[140px]" },
];

export default function ResultEntryPage() {
    const router = useRouter();

    // ── State ─────────────────────────────────────────────────────
    const [testGroups, setTestGroups] = useState<TestGroup[]>(
        MOCK_RESULT_ENTRY.testGroups
    );
    const [mltNotes,          setMltNotes]          = useState(
        "Result confirmed by 2nd run. No hemolysis noted in sample. Dr. Silva notified via ICU hotline."
    );
    const [criticalNotified,  setCriticalNotified]  = useState(true);
    const [submitting,        setSubmitting]        = useState(false);
    const [savingDraft,       setSavingDraft]       = useState(false);

    // ── Find all critical parameters ──────────────────────────────
    const criticalParams = useMemo(() => {
        const results: TestParameter[] = [];
        testGroups.forEach((group) => {
            group.parameters.forEach((param) => {
                const val  = parseFloat(param.result);
                const flag = isNaN(val)
                    ? param.flag
                    : computeFlag(val, param.referenceRangeLow, param.referenceRangeHigh);
                if (flag === "CRITICAL_HIGH" || flag === "CRITICAL_LOW") {
                    results.push({ ...param, flag });
                }
            });
        });
        return results;
    }, [testGroups]);

    const hasCritical = criticalParams.length > 0;

    // ── Update a single parameter result ─────────────────────────
    const handleResultChange = useCallback(
        (groupName: string, paramId: string, value: string) => {
            setTestGroups((prev) =>
                prev.map((group) =>
                    group.groupName !== groupName
                        ? group
                        : {
                            ...group,
                            parameters: group.parameters.map((p) =>
                                p.id !== paramId ? p : { ...p, result: value }
                            ),
                        }
                )
            );
        },
        []
    );

    // ── Save Draft ────────────────────────────────────────────────
    const handleSaveDraft = async () => {
        setSavingDraft(true);
        await new Promise((r) => setTimeout(r, 700));
        toast.success("Draft saved successfully", {
            description: `Sample ${MOCK_RESULT_ENTRY.sampleId}`,
        });
        setSavingDraft(false);
    };

    // ── Submit for Verification ───────────────────────────────────
    const handleSubmit = async () => {
        // Validation
        if (hasCritical && !criticalNotified) {
            toast.error("Critical value acknowledgment required", {
                description:
                    "You must confirm physician notification before submitting.",
            });
            return;
        }

        // Check all results are filled
        const emptyResult = testGroups
            .flatMap((g) => g.parameters)
            .find((p) => p.result.trim() === "");

        if (emptyResult) {
            toast.error("Incomplete results", {
                description: `Please enter a value for: ${emptyResult.parameterName}`,
            });
            return;
        }

        setSubmitting(true);
        await new Promise((r) => setTimeout(r, 1000));
        toast.success("Results submitted for verification", {
            description: `Sample ${MOCK_RESULT_ENTRY.sampleId} sent to SMLT`,
        });
        setSubmitting(false);
        router.push("/mlt/worklist");
    };

    return (
        <div className="space-y-4">

            {/* ── Top Bar ── */}
            <div className="flex items-center justify-between">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-1.5 text-sm text-gray-500
                     hover:text-gray-800 transition-colors"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Back to Worklist
                </button>

                {/* Active case pill */}
                <div className="flex items-center gap-2 px-3 py-1 bg-blue-50
                        border border-blue-200 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    <span className="text-xs font-bold text-blue-700">ACTIVE CASE</span>
                </div>
            </div>

            {/* ── Main Layout: Sidebar + Form ── */}
            <div className="flex gap-5 items-start">

                {/* ── LEFT: Patient Sidebar ── */}
                <ResultSampleSidebar sample={MOCK_RESULT_ENTRY} />

                {/* ── RIGHT: Result Entry Form ── */}
                <div className="flex-1 min-w-0 space-y-4">

                    {/* Form header */}
                    <div className="bg-white rounded-lg border border-gray-200
                          shadow-sm px-5 py-4 flex items-center justify-between">
                        <div>
                            <h1 className="text-base font-bold text-gray-900">
                                Result Entry Form
                            </h1>
                            <p className="text-xs text-gray-400 mt-0.5">
                                Sample: {MOCK_RESULT_ENTRY.sampleId} •{" "}
                                {MOCK_RESULT_ENTRY.patientName}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            {/* Import from instrument button */}
                            <button
                                onClick={() => toast.info("Importing from instrument...", {
                                    description: "Sysmex XN-1000 — connecting",
                                })}
                                className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200
                           rounded-md text-xs font-semibold text-gray-600
                           hover:bg-gray-50 transition-all"
                            >
                                <Download className="w-3.5 h-3.5" />
                                Import from Instrument
                            </button>
                            {/* Save draft button */}
                            <button
                                onClick={handleSaveDraft}
                                disabled={savingDraft}
                                className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200
                           rounded-md text-xs font-semibold text-gray-600
                           hover:bg-gray-50 transition-all disabled:opacity-50"
                            >
                                <Save className="w-3.5 h-3.5" />
                                {savingDraft ? "Saving..." : "Save Draft"}
                            </button>
                        </div>
                    </div>

                    {/* ── Test Groups ── */}
                    {testGroups.map((group) => (
                        <div
                            key={group.groupName}
                            className="bg-white rounded-lg border border-gray-200
                         shadow-sm overflow-hidden"
                        >
                            {/* Group header */}
                            <div className="px-5 py-3 bg-gray-50 border-b border-gray-100
                              flex items-center justify-between">
                                <h2 className="text-xs font-bold uppercase tracking-wider
                               text-gray-600">
                                    {group.groupName}
                                </h2>
                                {/* Critical count for this group */}
                                {group.parameters.some((p) => {
                                    const v = parseFloat(p.result);
                                    const f = isNaN(v) ? p.flag : computeFlag(v, p.referenceRangeLow, p.referenceRangeHigh);
                                    return f === "CRITICAL_HIGH" || f === "CRITICAL_LOW";
                                }) && (
                                    <span className="flex items-center gap-1 text-[10px] font-bold
                                   text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                    <AlertTriangle className="w-3 h-3" />
                    CRITICAL ALERT
                  </span>
                                )}
                            </div>

                            {/* Parameter table */}
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                    <tr className="border-b border-gray-100">
                                        {TABLE_COLUMNS.map((col) => (
                                            <th
                                                key={col.label}
                                                className={`px-4 py-2 text-left text-[10px] font-bold
                                      uppercase tracking-wider text-gray-400
                                      ${col.width}`}
                                            >
                                                {col.label}
                                            </th>
                                        ))}
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {group.parameters.map((param) => (
                                        <ResultParameterRow
                                            key={param.id}
                                            param={param}
                                            onChange={(id, val) =>
                                                handleResultChange(group.groupName, id, val)
                                            }
                                        />
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))}

                    {/* ── Critical Alert Banners ── */}
                    {criticalParams.map((param) => (
                        <CriticalAlertBanner
                            key={param.id}
                            parameterName={param.parameterName}
                            value={param.result}
                            unit={param.unit}
                        />
                    ))}

                    {/* ── MLT Observation Notes ── */}
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
                        <label className="block text-xs font-bold uppercase tracking-wider
                               text-gray-500 mb-2">
                            MLT Observation Notes
                        </label>
                        <textarea
                            value={mltNotes}
                            onChange={(e) => setMltNotes(e.target.value)}
                            rows={3}
                            placeholder="Add clinical observations, instrument notes, or QC remarks..."
                            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg
                         bg-white text-gray-700 placeholder-gray-400 resize-none
                         focus:outline-none focus:ring-2 focus:ring-blue-500
                         focus:border-transparent transition-all"
                        />
                    </div>

                    {/* ── Critical Notification Acknowledgment ── */}
                    {hasCritical && (
                        <div
                            onClick={() => setCriticalNotified(!criticalNotified)}
                            className={cn(
                                "flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all",
                                criticalNotified
                                    ? "bg-blue-50 border-blue-300"
                                    : "bg-white border-gray-200 hover:border-blue-200"
                            )}
                        >
                            {/* Checkbox */}
                            <div className={cn(
                                "w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5 border-2 transition-all",
                                criticalNotified
                                    ? "bg-blue-600 border-blue-600"
                                    : "border-gray-300"
                            )}>
                                {criticalNotified && (
                                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24">
                                        <path
                                            stroke="currentColor"
                                            strokeWidth={3}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                )}
                            </div>
                            <div>
                                <p className={cn(
                                    "text-sm font-semibold",
                                    criticalNotified ? "text-blue-800" : "text-gray-700"
                                )}>
                                    I confirm that the Physician/Ward Doctor has been notified
                                    of this critical value.
                                </p>
                                <p className="text-xs text-gray-400 mt-0.5">
                                    This acknowledgment is mandatory for critical results and
                                    is recorded in the audit log.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* ── Action Footer ── */}
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm
                          p-4 flex items-center justify-end gap-3">
                        <button
                            onClick={() => router.back()}
                            className="px-5 py-2 text-sm font-medium text-gray-600
                         hover:text-gray-900 transition-colors"
                        >
                            Cancel & Exit
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={submitting || (hasCritical && !criticalNotified)}
                            className={cn(
                                "flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm",
                                "font-semibold transition-all active:scale-95 shadow-sm",
                                submitting || (hasCritical && !criticalNotified)
                                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-700 text-white"
                            )}
                        >
                            <Send className="w-4 h-4" />
                            {submitting ? "Submitting..." : "Submit for Verification →"}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
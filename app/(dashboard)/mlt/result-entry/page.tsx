// app/(dashboard)/mlt/result-entry/page.tsx
"use client";

import { useState, useCallback, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, Download, Save, Send, AlertTriangle, Search, Eye, CheckCircle2, Loader2 } from "lucide-react";
import { cn }              from "@/lib/utils";
import { toast }           from "sonner";
import ResultParameterRow  from "@/components/mlt/ResultParameterRow";
import ResultSampleSidebar from "@/components/mlt/ResultSampleSidebar";
import CriticalAlertBanner from "@/components/mlt/CriticalAlertBanner";
import { MOCK_MLT_WORKLIST, MOCK_MLT_ALL_WORKLIST } from "@/mock/mlt.mock";
import {
    MOCK_RESULT_ENTRY,
    computeFlag,
    type TestGroup,
    type TestParameter,
} from "@/mock/result-entry.mock";

// ── Mock instrument values — simulates Sysmex XN-1000 output ──
const INSTRUMENT_VALUES: Record<string, string> = {
    // Complete Blood Count
    wbc: "8.4",
    rbc: "4.2",
    hgb: "13.5",
    hct: "40.2",
    plt: "220",
    // Serum Electrolytes
    na:  "140",
    k:   "6.8",   // critical high — intentional for demo
    cl:  "103",
};

const TABLE_COLUMNS = [
    { label: "Parameter",       width: "" },
    { label: "Result",          width: "w-[140px]" },
    { label: "Unit",            width: "w-[100px]" },
    { label: "Reference Range", width: "w-[160px]" },
    { label: "Flag",            width: "w-[140px]" },
];

function ResultEntryInner() {
    const router       = useRouter();
    const searchParams = useSearchParams();

    const sampleIdParam = searchParams.get("sampleId");
    const isNew         = searchParams.get("new")  === "true";
    const isView        = searchParams.get("view") === "true";

    // ── Find matching sample from both worklists ──────────────────
    const matchedSample = sampleIdParam
        ? (MOCK_MLT_WORKLIST.find((s) => s.sampleId === sampleIdParam) ??
            MOCK_MLT_ALL_WORKLIST.find((s) => s.sampleId === sampleIdParam))
        : null;

    // ── Build display data ────────────────────────────────────────
    const displaySample = isNew
        ? null
        : matchedSample
            ? {
                ...MOCK_RESULT_ENTRY,
                sampleId:    matchedSample.sampleId,
                patientName: matchedSample.patient.name,
                patientPid:  matchedSample.patient.pid,
                testType:    matchedSample.testType,
                wardRoom:    matchedSample.patient.wardRoom ?? "",
            }
            : MOCK_RESULT_ENTRY;

    // ── New Entry input state ─────────────────────────────────────
    const [newSampleIdInput,  setNewSampleIdInput]  = useState("");
    const [newPatientIdInput, setNewPatientIdInput] = useState("");
    const [loadedNewSample,   setLoadedNewSample]   = useState<typeof displaySample>(null);

    const handleLoadPatient = () => {
        const trimmedSample  = newSampleIdInput.trim().toUpperCase();
        const trimmedPatient = newPatientIdInput.trim().toUpperCase();

        if (!trimmedSample && !trimmedPatient) {
            toast.error("Please enter a Sample ID or Patient ID");
            return;
        }

        const found = MOCK_MLT_WORKLIST.find((s) =>
            (trimmedSample  && s.sampleId.toUpperCase()    === trimmedSample)  ||
            (trimmedPatient && s.patient.pid.toUpperCase() === trimmedPatient)
        );

        if (found) {
            setLoadedNewSample({
                ...MOCK_RESULT_ENTRY,
                sampleId:    found.sampleId,
                patientName: found.patient.name,
                patientPid:  found.patient.pid,
                testType:    found.testType,
                wardRoom:    found.patient.wardRoom ?? "",
            });
            toast.success("Patient loaded", {
                description: `${found.sampleId} — ${found.patient.name}`,
            });
        } else {
            toast.error("No matching sample found", {
                description: "Try: S-10100, S-10101, S-10102, S-10103, S-10104",
            });
        }
    };

    // ── Core state ────────────────────────────────────────────────
    const [testGroups,        setTestGroups]        = useState<TestGroup[]>(MOCK_RESULT_ENTRY.testGroups);
    const [mltNotes,          setMltNotes]          = useState(isNew ? "" : "Result confirmed by 2nd run. No hemolysis noted in sample.");
    const [criticalNotified,  setCriticalNotified]  = useState(false);
    const [submitting,        setSubmitting]        = useState(false);

    // ── Draft state ───────────────────────────────────────────────
    const [savingDraft,       setSavingDraft]       = useState(false);
    const [draftSaved,        setDraftSaved]        = useState(false);
    const [draftSavedAt,      setDraftSavedAt]      = useState<string | null>(null);

    // ── Import from instrument state ──────────────────────────────
    const [importing,         setImporting]         = useState(false);
    const [imported,          setImported]          = useState(false);

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
    const activeSample = isNew ? loadedNewSample : displaySample;

    // ── Update a single parameter result ─────────────────────────
    const handleResultChange = useCallback(
        (groupName: string, paramId: string, value: string) => {
            if (isView) return;
            setDraftSaved(false); // mark draft as unsaved when edited
            setTestGroups((prev) =>
                prev.map((group) =>
                    group.groupName !== groupName ? group : {
                        ...group,
                        parameters: group.parameters.map((p) =>
                            p.id !== paramId ? p : { ...p, result: value }
                        ),
                    }
                )
            );
        }, [isView]
    );

    // ── Import from Instrument ────────────────────────────────────
    const handleImportFromInstrument = async () => {
        setImporting(true);
        setImported(false);

        // Simulate instrument connection delay
        await new Promise((r) => setTimeout(r, 1500));

        // Fill all matching parameter IDs with instrument values
        setTestGroups((prev) =>
            prev.map((group) => ({
                ...group,
                parameters: group.parameters.map((p) => {
                    const instrumentValue = INSTRUMENT_VALUES[p.id];
                    if (instrumentValue !== undefined) {
                        return { ...p, result: instrumentValue };
                    }
                    return p;
                }),
            }))
        );

        setImporting(false);
        setImported(true);
        setDraftSaved(false); // imported data not yet saved

        toast.success("Results imported from Sysmex XN-1000", {
            description: `${Object.keys(INSTRUMENT_VALUES).length} parameters loaded successfully`,
        });
    };

    // ── Save Draft ────────────────────────────────────────────────
    const handleSaveDraft = async () => {
        setSavingDraft(true);
        setDraftSaved(false);

        await new Promise((r) => setTimeout(r, 800));

        const now = new Date().toLocaleTimeString("en-GB", {
            hour: "2-digit", minute: "2-digit",
        });

        setSavingDraft(false);
        setDraftSaved(true);
        setDraftSavedAt(now);

        toast.success("Draft saved successfully", {
            description: `Sample ${activeSample?.sampleId ?? "New Entry"} — saved at ${now}`,
        });
    };

    // ── Submit ────────────────────────────────────────────────────
    const handleSubmit = async () => {
        if (isNew && !loadedNewSample) {
            toast.error("Please load a patient before submitting");
            return;
        }
        if (hasCritical && !criticalNotified) {
            toast.error("Critical value acknowledgment required", {
                description: "You must confirm physician notification before submitting.",
            });
            return;
        }
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
            description: `Sample ${activeSample?.sampleId ?? "New Entry"} sent to SMLT`,
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

                <div className={cn(
                    "flex items-center gap-2 px-3 py-1 rounded-full border",
                    isView ? "bg-gray-50 border-gray-200" : "bg-blue-50 border-blue-200"
                )}>
                    {isView
                        ? <Eye className="w-3 h-3 text-gray-500" />
                        : <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    }
                    <span className={cn(
                        "text-xs font-bold",
                        isView ? "text-gray-500" : "text-blue-700"
                    )}>
                        {isNew ? "NEW ENTRY" : isView ? "VIEW ONLY" : "ACTIVE CASE"}
                    </span>
                </div>
            </div>

            {/* ── View-only notice ── */}
            {isView && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg
                        px-4 py-2.5 flex items-center gap-2">
                    <Eye className="w-4 h-4 text-amber-500 flex-shrink-0" />
                    <p className="text-sm text-amber-700 font-medium">
                        This is a read-only view. Results have been sent for verification
                        and cannot be edited.
                    </p>
                </div>
            )}

            {/* ── Main Layout ── */}
            <div className="flex gap-5 items-start">

                {/* ── LEFT: Sidebar ── */}
                {isNew ? (
                    <div className="w-[260px] flex-shrink-0 space-y-3">
                        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
                            <p className="text-xs font-bold uppercase tracking-wider
                                   text-gray-500 mb-4">
                                New Entry — Identify Sample
                            </p>

                            <div className="mb-3">
                                <label className="block text-[11px] font-semibold
                                       text-gray-500 uppercase tracking-wider mb-1.5">
                                    Sample ID
                                </label>
                                <input
                                    type="text"
                                    value={newSampleIdInput}
                                    onChange={(e) => setNewSampleIdInput(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleLoadPatient()}
                                    placeholder="e.g. S-10100"
                                    className="w-full px-3 py-2 text-sm border border-gray-200
                                       rounded-lg focus:outline-none focus:ring-2
                                       focus:ring-blue-500 transition-all
                                       placeholder-gray-300 font-mono"
                                />
                            </div>

                            <div className="flex items-center gap-2 my-3">
                                <div className="flex-1 h-px bg-gray-100" />
                                <span className="text-[10px] text-gray-400 font-medium">OR</span>
                                <div className="flex-1 h-px bg-gray-100" />
                            </div>

                            <div className="mb-4">
                                <label className="block text-[11px] font-semibold
                                       text-gray-500 uppercase tracking-wider mb-1.5">
                                    Patient ID
                                </label>
                                <input
                                    type="text"
                                    value={newPatientIdInput}
                                    onChange={(e) => setNewPatientIdInput(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleLoadPatient()}
                                    placeholder="e.g. DH-40281"
                                    className="w-full px-3 py-2 text-sm border border-gray-200
                                       rounded-lg focus:outline-none focus:ring-2
                                       focus:ring-blue-500 transition-all
                                       placeholder-gray-300 font-mono"
                                />
                            </div>

                            <button
                                onClick={handleLoadPatient}
                                className="w-full flex items-center justify-center gap-2
                                   px-4 py-2.5 bg-blue-600 hover:bg-blue-700
                                   text-white text-sm font-semibold rounded-lg
                                   transition-all active:scale-95"
                            >
                                <Search className="w-3.5 h-3.5" />
                                Load Patient
                            </button>
                            <p className="text-[10px] text-gray-400 mt-3 text-center">
                                Press Enter or click Load Patient
                            </p>
                        </div>

                        {loadedNewSample && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-1">
                                <p className="text-[10px] font-bold uppercase tracking-wider text-green-600 mb-2">
                                    ✓ Patient Loaded
                                </p>
                                <p className="text-sm font-bold text-gray-900">{loadedNewSample.patientName}</p>
                                <p className="text-xs text-gray-500">{loadedNewSample.patientPid}</p>
                                <p className="text-xs text-gray-500">{loadedNewSample.sampleId}</p>
                                <p className="text-xs text-gray-500">{loadedNewSample.testType}</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <ResultSampleSidebar sample={displaySample ?? MOCK_RESULT_ENTRY} />
                )}

                {/* ── RIGHT: Result Entry Form ── */}
                <div className="flex-1 min-w-0 space-y-4">

                    {/* Form header */}
                    <div className="bg-white rounded-lg border border-gray-200
                          shadow-sm px-5 py-4 flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-base font-bold text-gray-900">
                                    {isView ? "Test Results — View" : "Result Entry Form"}
                                </h1>
                                {/* ✅ Draft saved badge */}
                                {draftSaved && !isView && (
                                    <span className="flex items-center gap-1 text-[10px] font-semibold
                                           text-green-700 bg-green-50 border border-green-200
                                           px-2 py-0.5 rounded-full">
                                        <CheckCircle2 className="w-3 h-3" />
                                        Draft saved {draftSavedAt && `at ${draftSavedAt}`}
                                    </span>
                                )}
                                {/* ✅ Imported badge */}
                                {imported && !isView && (
                                    <span className="flex items-center gap-1 text-[10px] font-semibold
                                           text-blue-700 bg-blue-50 border border-blue-200
                                           px-2 py-0.5 rounded-full">
                                        <Download className="w-3 h-3" />
                                        Imported from Sysmex XN-1000
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-gray-400 mt-0.5">
                                {isNew
                                    ? loadedNewSample
                                        ? `Sample: ${loadedNewSample.sampleId} • ${loadedNewSample.patientName}`
                                        : "Enter Sample ID or Patient ID to identify the patient"
                                    : `Sample: ${displaySample?.sampleId} • ${displaySample?.patientName}`
                                }
                            </p>
                        </div>

                        {/* ✅ Hide buttons in view mode */}
                        {!isView && (
                            <div className="flex items-center gap-2">
                                {/* Import from Instrument */}
                                <button
                                    onClick={handleImportFromInstrument}
                                    disabled={importing}
                                    className={cn(
                                        "flex items-center gap-1.5 px-3 py-1.5 border rounded-md",
                                        "text-xs font-semibold transition-all",
                                        importing
                                            ? "border-blue-200 bg-blue-50 text-blue-500 cursor-wait"
                                            : imported
                                                ? "border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
                                                : "border-gray-200 text-gray-600 hover:bg-gray-50"
                                    )}
                                >
                                    {importing
                                        ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                        : imported
                                            ? <CheckCircle2 className="w-3.5 h-3.5" />
                                            : <Download className="w-3.5 h-3.5" />
                                    }
                                    {importing
                                        ? "Connecting to Sysmex..."
                                        : imported
                                            ? "Re-import"
                                            : "Import from Instrument"
                                    }
                                </button>

                                {/* Save Draft */}
                                <button
                                    onClick={handleSaveDraft}
                                    disabled={savingDraft}
                                    className={cn(
                                        "flex items-center gap-1.5 px-3 py-1.5 border rounded-md",
                                        "text-xs font-semibold transition-all",
                                        savingDraft
                                            ? "border-gray-200 text-gray-400 cursor-wait"
                                            : draftSaved
                                                ? "border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
                                                : "border-gray-200 text-gray-600 hover:bg-gray-50"
                                    )}
                                >
                                    {savingDraft
                                        ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                        : draftSaved
                                            ? <CheckCircle2 className="w-3.5 h-3.5" />
                                            : <Save className="w-3.5 h-3.5" />
                                    }
                                    {savingDraft ? "Saving..." : draftSaved ? "Saved" : "Save Draft"}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* ── Test Groups ── */}
                    {testGroups.map((group) => (
                        <div
                            key={group.groupName}
                            className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden"
                        >
                            <div className="px-5 py-3 bg-gray-50 border-b border-gray-100
                              flex items-center justify-between">
                                <h2 className="text-xs font-bold uppercase tracking-wider text-gray-600">
                                    {group.groupName}
                                </h2>
                                {group.parameters.some((p) => {
                                    const v = parseFloat(p.result);
                                    const f = isNaN(v) ? p.flag : computeFlag(v, p.referenceRangeLow, p.referenceRangeHigh);
                                    return f === "CRITICAL_HIGH" || f === "CRITICAL_LOW";
                                }) && (
                                    <span className="flex items-center gap-1 text-[10px]
                                   font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                                        <AlertTriangle className="w-3 h-3" />
                                        CRITICAL ALERT
                                    </span>
                                )}
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                    <tr className="border-b border-gray-100">
                                        {TABLE_COLUMNS.map((col) => (
                                            <th
                                                key={col.label}
                                                className={`px-4 py-2 text-left text-[10px]
                                      font-bold uppercase tracking-wider
                                      text-gray-400 ${col.width}`}
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
                                            disabled={isView}
                                        />
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))}

                    {/* ── Critical Banners ── */}
                    {criticalParams.map((param) => (
                        <CriticalAlertBanner
                            key={param.id}
                            parameterName={param.parameterName}
                            value={param.result}
                            unit={param.unit}
                        />
                    ))}

                    {/* ── MLT Notes ── */}
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
                        <label className="block text-xs font-bold uppercase tracking-wider
                               text-gray-500 mb-2">
                            MLT Observation Notes
                        </label>
                        <textarea
                            value={mltNotes}
                            onChange={(e) => { if (!isView) { setMltNotes(e.target.value); setDraftSaved(false); }}}
                            readOnly={isView}
                            rows={3}
                            placeholder="Add clinical observations, instrument notes, or QC remarks..."
                            className={cn(
                                "w-full px-3 py-2.5 text-sm border border-gray-200",
                                "rounded-lg text-gray-700 placeholder-gray-400 resize-none",
                                "focus:outline-none transition-all",
                                isView
                                    ? "bg-gray-50 cursor-not-allowed text-gray-500"
                                    : "focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            )}
                        />
                    </div>

                    {/* ── Critical Acknowledgment ── */}
                    {hasCritical && !isView && (
                        <div
                            onClick={() => setCriticalNotified(!criticalNotified)}
                            className={cn(
                                "flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all",
                                criticalNotified
                                    ? "bg-blue-50 border-blue-300"
                                    : "bg-white border-gray-200 hover:border-blue-200"
                            )}
                        >
                            <div className={cn(
                                "w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5 border-2 transition-all",
                                criticalNotified ? "bg-blue-600 border-blue-600" : "border-gray-300"
                            )}>
                                {criticalNotified && (
                                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" strokeWidth={3}
                                              strokeLinecap="round" strokeLinejoin="round"
                                              d="M5 13l4 4L19 7" />
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
                                    This acknowledgment is mandatory and recorded in the audit log.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* ── Action Footer ── */}
                    {!isView && (
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
                    )}

                    {/* ── View mode footer ── */}
                    {isView && (
                        <div className="bg-white rounded-lg border border-gray-200 shadow-sm
                              p-4 flex items-center justify-end">
                            <button
                                onClick={() => router.back()}
                                className="px-5 py-2 text-sm font-semibold text-gray-600
                             border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                ← Back to All Worklist
                            </button>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}

export default function ResultEntryPage() {
    return (
        <Suspense fallback={<div className="p-8 text-gray-400">Loading...</div>}>
            <ResultEntryInner />
        </Suspense>
    );
}
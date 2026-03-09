// app/(dashboard)/reception/quality-verification/page.tsx
"use client";

import { useState } from "react";
import { ChevronLeft, ScanLine, Printer, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import SampleInfoPanel       from "@/components/reception/SampleInfoPanel";
import VerificationChecklist from "@/components/reception/VerificationChecklist";
import ReceptionRejectModal  from "@/components/reception/ReceptionRejectModal";
import {
    MOCK_QUALITY_SAMPLES,
    MOCK_VERIFICATION_CHECKS,
} from "@/mock/quality.mock";
import type { VerificationCheck, QualitySample } from "@/mock/quality.mock";
import type { Sample } from "@/types/sample.types";

export default function QualityVerificationPage() {
    const [currentSample, setCurrentSample] = useState<QualitySample>(MOCK_QUALITY_SAMPLES[0]);
    const [checks,        setChecks]        = useState<VerificationCheck[]>(MOCK_VERIFICATION_CHECKS);
    const [notes,         setNotes]         = useState("");
    const [showReject,    setShowReject]     = useState(false);
    const [scanInput,     setScanInput]      = useState("");
    const [accepting,     setAccepting]      = useState(false);
    const [notFound,      setNotFound]       = useState(false);

    const allRequiredChecked = checks
        .filter((c) => c.required)
        .every((c) => c.checked);

    const checkedCount = checks.filter((c) => c.checked).length;

    // ── Reset checklist when new sample loads ──────────────────
    const resetChecklist = () => {
        setChecks(MOCK_VERIFICATION_CHECKS.map((c) => ({ ...c, checked: false })));
        setNotes("");
    };

    // ── Scan / Search handler ──────────────────────────────────
    const handleScan = (value: string) => {
        const query = value.trim().toUpperCase();
        if (!query) return;

        const found = MOCK_QUALITY_SAMPLES.find(
            (s) => s.sampleId.toUpperCase() === query
        );

        if (found) {
            setCurrentSample(found);
            resetChecklist();
            setScanInput("");
            setNotFound(false);
            toast.success(`Sample loaded`, {
                description: `${found.sampleId} — ${found.patientName}`,
            });
        } else {
            setNotFound(true);
            toast.error(`Sample not found`, {
                description: `No sample matches "${value.trim()}"`,
            });
        }
    };

    const handleCheckChange = (id: string, checked: boolean) => {
        setChecks((prev) =>
            prev.map((c) => (c.id === id ? { ...c, checked } : c))
        );
    };

    const handleAccept = async () => {
        if (!allRequiredChecked) {
            toast.error("Please complete all required checks before accepting");
            return;
        }
        setAccepting(true);
        await new Promise((r) => setTimeout(r, 900));
        toast.success("Sample accepted & queued for analysis", {
            description: `Sample ${currentSample.sampleId} — ${currentSample.testType}`,
        });
        setAccepting(false);
    };

    // Dummy sample for reject modal — built from currentSample
    const dummySample: Sample = {
        id:        "q1",
        sampleId:  currentSample.sampleId,
        orderId:   currentSample.internalRef,
        patient:   {
            id:     "p1",
            pid:    currentSample.mrn,
            name:   currentSample.patientName,
            age:    currentSample.age,
            gender: currentSample.gender === "Female" ? "F" : "M",
        },
        testType:  currentSample.testType,
        testCodes: [],
        priority:  "NORMAL",
        status:    "QUALITY_CHECK",
        tubeTypes: [],
    };

    return (
        <div className="space-y-5">

            {/* ── Header Bar ── */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-1.5 text-sm text-gray-500
                             hover:text-gray-800 transition-colors">
                        <ChevronLeft className="w-4 h-4" />
                        Previous Sample
                    </button>
                </div>
                <div className="flex items-center gap-2 text-xs text-green-600 font-medium">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    Scanner Online & Ready
                </div>
            </div>

            {/* ── Scan Bar ── */}
            <div className={cn(
                "bg-white rounded-xl border shadow-sm p-4 transition-all",
                notFound ? "border-red-300 bg-red-50" : "border-gray-200"
            )}>
                <div className="flex items-center gap-3">
                    <div className={cn(
                        "p-2 rounded-lg",
                        notFound ? "bg-red-100" : "bg-blue-50"
                    )}>
                        <ScanLine className={cn(
                            "w-5 h-5",
                            notFound ? "text-red-500" : "text-blue-500"
                        )} />
                    </div>
                    <input
                        type="text"
                        value={scanInput}
                        onChange={(e) => {
                            setScanInput(e.target.value);
                            setNotFound(false);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleScan(scanInput);
                        }}
                        placeholder="Scan Sample Barcode or type Sample ID and press Enter..."
                        className="flex-1 text-sm text-gray-700 placeholder-gray-400
                       bg-transparent focus:outline-none"
                    />
                    {scanInput && (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handleScan(scanInput)}
                                className="text-xs bg-blue-600 text-white px-3 py-1.5
                                   rounded-md hover:bg-blue-700 font-medium transition-all"
                            >
                                Search
                            </button>
                            <button
                                onClick={() => { setScanInput(""); setNotFound(false); }}
                                className="text-xs text-gray-500 hover:text-gray-800 font-medium"
                            >
                                Clear
                            </button>
                        </div>
                    )}
                </div>
                {/* Hint text */}
                <p className="text-[11px] text-gray-400 mt-2 ml-11">
                    Try: S-90348 · S-90232 · S-90235 · S-90241
                </p>
            </div>

            {/* ── Main Split Panel ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                {/* ── Left: Sample Info ── */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                    <SampleInfoPanel sample={currentSample} />
                </div>

                {/* ── Right: Verification Checklist ── */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                    <VerificationChecklist
                        checks={checks}
                        onChange={handleCheckChange}
                        notes={notes}
                        onNotesChange={setNotes}
                        elapsedMinutes={currentSample.elapsedMinutes}
                    />

                    {/* Progress indicator */}
                    <div className="mt-4 bg-gray-50 rounded-lg px-4 py-2.5">
                        <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs text-gray-500">
                                {checkedCount} of {checks.length} checks completed
                            </span>
                            <span className={cn(
                                "text-xs font-bold",
                                allRequiredChecked ? "text-green-600" : "text-amber-600"
                            )}>
                                {allRequiredChecked ? "✓ Ready to accept" : "Complete required checks"}
                            </span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className={cn(
                                    "h-full rounded-full transition-all duration-500",
                                    allRequiredChecked ? "bg-green-500" : "bg-blue-500"
                                )}
                                style={{ width: `${(checkedCount / checks.length) * 100}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Action Footer ── */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4
                      flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1.5 text-xs text-gray-500
                             hover:text-blue-600 transition-colors px-3 py-2
                             rounded-lg hover:bg-blue-50">
                        <Printer className="w-3.5 h-3.5" />
                        Reprint Label
                    </button>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowReject(true)}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm
                       font-semibold border border-red-200 text-red-600
                       hover:bg-red-50 transition-all active:scale-95"
                    >
                        <XCircle className="w-4 h-4" />
                        Reject Sample
                    </button>

                    <button
                        onClick={handleAccept}
                        disabled={!allRequiredChecked || accepting}
                        className={cn(
                            "flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold",
                            "transition-all active:scale-95 shadow-sm",
                            allRequiredChecked
                                ? "bg-green-600 hover:bg-green-700 text-white"
                                : "bg-gray-100 text-gray-400 cursor-not-allowed"
                        )}
                    >
                        <CheckCircle2 className="w-4 h-4" />
                        {accepting ? "Accepting..." : "Accept & Queue for Analysis"}
                    </button>
                </div>
            </div>

            {/* Reject Modal */}
            <ReceptionRejectModal
                open={showReject}
                onClose={() => setShowReject(false)}
                sample={dummySample}
            />

        </div>
    );
}
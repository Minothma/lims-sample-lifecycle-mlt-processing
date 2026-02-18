// app/(dashboard)/reception/quality-verification/page.tsx
"use client";

import { useState } from "react";
import { ChevronLeft, ScanLine, Printer, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import SampleInfoPanel       from "@/components/reception/SampleInfoPanel";
import VerificationChecklist from "@/components/reception/VerificationChecklist";
import ReceptionRejectModal  from "@/components/reception/ReceptionRejectModal";
import { MOCK_QUALITY_SAMPLE, MOCK_VERIFICATION_CHECKS } from "@/mock/quality.mock";
import type { VerificationCheck } from "@/mock/quality.mock";
import type { Sample } from "@/types/sample.types";

// Dummy sample for reject modal
const DUMMY_SAMPLE: Sample = {
    id:        "q1",
    sampleId:  "77291034",
    orderId:   "ORD-2024-099",
    patient:   {
        id:     "p9",
        pid:    "DH-882-0034",
        name:   "Sandhya Rajakaruna",
        age:    64,
        gender: "F",
    },
    testType:  "Full Blood Count (FBC) + ESR",
    testCodes: ["FBC", "ESR"],
    priority:  "NORMAL",
    status:    "QUALITY_CHECK",
    tubeTypes: ["EDTA_PURPLE"],
};

export default function QualityVerificationPage() {
    const [checks,       setChecks]       = useState<VerificationCheck[]>(MOCK_VERIFICATION_CHECKS);
    const [notes,        setNotes]        = useState("");
    const [showReject,   setShowReject]   = useState(false);
    const [scanInput,    setScanInput]    = useState("");
    const [accepting,    setAccepting]    = useState(false);

    const allRequiredChecked = checks
        .filter((c) => c.required)
        .every((c) => c.checked);

    const checkedCount = checks.filter((c) => c.checked).length;

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
            description: `Sample ${MOCK_QUALITY_SAMPLE.sampleId} — ${MOCK_QUALITY_SAMPLE.testType}`,
        });
        setAccepting(false);
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
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                        <ScanLine className="w-5 h-5 text-blue-500" />
                    </div>
                    <input
                        type="text"
                        value={scanInput}
                        onChange={(e) => setScanInput(e.target.value)}
                        placeholder="Scan Sample Barcode or Search ID..."
                        className="flex-1 text-sm text-gray-700 placeholder-gray-400 bg-transparent
                       focus:outline-none"
                    />
                    {scanInput && (
                        <button
                            onClick={() => setScanInput("")}
                            className="text-xs text-blue-600 hover:underline font-medium"
                        >
                            Clear
                        </button>
                    )}
                </div>
            </div>

            {/* ── Main Split Panel ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                {/* ── Left: Sample Info ── */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                    <SampleInfoPanel sample={MOCK_QUALITY_SAMPLE} />
                </div>

                {/* ── Right: Verification Checklist ── */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                    <VerificationChecklist
                        checks={checks}
                        onChange={handleCheckChange}
                        notes={notes}
                        onNotesChange={setNotes}
                        elapsedMinutes={MOCK_QUALITY_SAMPLE.elapsedMinutes}
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
                    {/* Reject button */}
                    <button
                        onClick={() => setShowReject(true)}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm
                       font-semibold border border-red-200 text-red-600
                       hover:bg-red-50 transition-all active:scale-95"
                    >
                        <XCircle className="w-4 h-4" />
                        Reject Sample
                    </button>

                    {/* Accept button */}
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
                sample={DUMMY_SAMPLE}
            />

        </div>
    );
}
"use client";

// components/mlt/ResultSampleSidebar.tsx

import type { ResultEntrySample } from "@/mock/result-entry.mock";

interface ResultSampleSidebarProps {
    sample: ResultEntrySample;
}

export default function ResultSampleSidebar({
                                                sample,
                                            }: ResultSampleSidebarProps) {
    return (
        <div className="w-56 flex-shrink-0 space-y-3">

            {/* ── Active Case Alert ── */}
            {sample.activeCaseNote && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                        <span className="text-amber-500 text-sm mt-0.5">⚠️</span>
                        <p className="text-xs text-amber-800 font-medium leading-relaxed">
                            Note: {sample.activeCaseNote}
                        </p>
                    </div>
                </div>
            )}

            {/* ── Patient Info Card ── */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">

                <div className="bg-blue-600 px-3 py-2">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-blue-100">
                        Patient Information
                    </p>
                </div>

                <div className="p-3 space-y-2.5">
                    {/* Avatar + name */}
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-pink-400 flex items-center
                            justify-center text-white text-xs font-bold flex-shrink-0">
                            {sample.patientName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-900 leading-tight">
                                {sample.patientName}
                            </p>
                            <p className="text-[10px] text-gray-400">
                                {sample.age}Y • {sample.gender}
                            </p>
                        </div>
                    </div>

                    <div className="border-t border-gray-100 pt-2 space-y-1.5">
                        {[
                            { label: "Patient ID",  value: sample.patientId },
                            { label: "Ward/Room",   value: sample.wardRoom },
                            { label: "Collection",  value: sample.collectionTime },
                            { label: "Validated",   value: sample.validatedAt },
                        ].map(({ label, value }) => (
                            <div key={label}>
                                <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">
                                    {label}
                                </p>
                                <p className="text-[11px] text-gray-700 font-medium">{value}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Sample Details Card ── */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <div className="bg-gray-700 px-3 py-2">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-200">
                        Sample Details
                    </p>
                </div>
                <div className="p-3 space-y-1.5">
                    <div>
                        <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">
                            Sample ID
                        </p>
                        <p className="text-[11px] font-mono font-bold text-blue-600">
                            {sample.sampleId}
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-1 pt-1">
                        {sample.testGroups.map((g) => (
                            <span
                                key={g.groupName}
                                className="px-1.5 py-0.5 bg-blue-50 text-blue-700
                           text-[9px] font-bold rounded"
                            >
                {g.groupName}
              </span>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    );
}
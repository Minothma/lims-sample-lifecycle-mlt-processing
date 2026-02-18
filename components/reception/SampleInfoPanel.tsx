"use client";

// components/reception/SampleInfoPanel.tsx

import { cn } from "@/lib/utils";
import type { QualitySample } from "@/mock/quality.mock";

interface SampleInfoPanelProps {
    sample: QualitySample;
}

export default function SampleInfoPanel({ sample }: SampleInfoPanelProps) {
    return (
        <div className="space-y-5">

            {/* ── Status badge + Sample ID ── */}
            <div>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md
                         bg-blue-100 text-blue-700 text-xs font-bold mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          IN PROCESSING
        </span>
                <div className="flex items-baseline gap-2">
                    <p className="text-[10px] font-mono text-gray-400">{sample.internalRef}</p>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mt-0.5">
                    Sample ID: {sample.sampleId}
                </h2>
            </div>

            {/* ── Patient Information ── */}
            <div>
                <p className="section-label">Patient Information</p>
                <div className="bg-gray-50 rounded-lg p-3 space-y-2">

                    {/* Avatar + name */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-pink-400 flex items-center
                            justify-center text-white text-sm font-bold">
                            {sample.patientName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-900">
                                {sample.patientTitle} {sample.patientName}
                            </p>
                            <p className="text-xs text-gray-500">
                                {sample.gender}, {sample.age} Years • MRN: {sample.mrn}
                            </p>
                        </div>
                    </div>

                    {/* Location + Clinician */}
                    <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-200">
                        <div>
                            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-1">
                                Location
                            </p>
                            <div className="flex items-center gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-sm bg-blue-500" />
                                <p className="text-xs font-semibold text-gray-800">
                                    {sample.location}
                                </p>
                            </div>
                            <p className="text-xs text-gray-400 ml-4">{sample.bed}</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-1">
                                Clinician
                            </p>
                            <p className="text-xs font-semibold text-gray-800">{sample.clinician}</p>
                            <p className="text-xs text-gray-400">{sample.clinicianDept}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Sample Specimen ── */}
            <div>
                <p className="section-label">Sample Specimen</p>
                <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                    <div className="flex items-center gap-2">
                        <div className={cn("w-6 h-12 rounded-sm flex-shrink-0", sample.testColor)} />
                        <div>
                            <p className="text-[10px] text-gray-400 uppercase font-semibold">
                                Test Type
                            </p>
                            <p className="text-sm font-bold text-gray-900">{sample.testType}</p>
                            <div className="mt-2 grid grid-cols-2 gap-x-4">
                                <div>
                                    <p className="text-[10px] text-gray-400 uppercase font-semibold">
                                        Container Type
                                    </p>
                                    <p className="text-xs text-gray-700">{sample.containerType}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-400 uppercase font-semibold">
                                        Collection Time
                                    </p>
                                    <p className="text-xs text-gray-700">{sample.collectionTime}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
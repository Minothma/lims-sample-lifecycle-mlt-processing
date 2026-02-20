// components/reception/AccessioningRow.tsx
"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import StatusBadge from "@/components/shared/StatusBadge";
import ReceptionRejectModal from "@/components/reception/ReceptionRejectModal";
import type { Sample } from "@/types/sample.types";

interface AccessioningRowProps {
    sample: Sample;
    onVerify: (sampleId: string) => void;
}

function PatientAvatar({ name, gender }: { name: string; gender: "M" | "F" }) {
    const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
    return (
        <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0",
            gender === "F" ? "bg-pink-400" : "bg-blue-500"
        )}>
            {initials}
        </div>
    );
}

export default function AccessioningRow({ sample, onVerify }: AccessioningRowProps) {
    const [showReject, setShowReject] = useState(false);
    const isUrgent = sample.priority === "URGENT";

    return (
        <>
            <tr className={cn(
                "border-b border-gray-100 hover:bg-gray-50 transition-colors",
                isUrgent && "bg-red-50/20 hover:bg-red-50/40"
            )}>

                {/* ── Sample ID ── */}
                <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                        <span className="text-sm font-bold text-blue-600 font-mono">
              {sample.sampleId}
            </span>
                    </div>
                </td>

                {/* ── Patient Details ── */}
                <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                        <PatientAvatar name={sample.patient.name} gender={sample.patient.gender} />
                        <div>
                            <p className="text-sm font-semibold text-gray-900">
                                {sample.patient.name}
                            </p>
                            <p className="text-xs text-gray-400">
                                {sample.patient.age}Y, {sample.patient.gender === "M" ? "Male" : "Female"}
                            </p>
                        </div>
                    </div>
                </td>

                {/* ── Test Type ── */}
                <td className="px-4 py-3">
          <span className="inline-flex items-center px-2 py-0.5 rounded-md
                           bg-blue-50 text-blue-700 text-xs font-semibold">
            {sample.testType}
          </span>
                </td>

                {/* ── Collection Time ── */}
                <td className="px-4 py-3">
                    <div>
                        <p className="text-sm font-semibold text-gray-800">
                            {sample.collectionTime}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                            {sample.waitTimeMinutes} mins ago
                        </p>
                    </div>
                </td>

                {/* ── Status ── */}
                <td className="px-4 py-3">
                    <StatusBadge status={sample.status} />
                </td>

                {/* ── Actions ── */}
                <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => onVerify(sample.id)}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white
                         text-xs font-semibold rounded-md transition-all
                         active:scale-95 shadow-sm"
                        >
                            Verify & Receive
                        </button>
                        <button
                            onClick={() => setShowReject(true)}
                            className="px-3 py-1.5 border border-red-200 text-red-600
                         hover:bg-red-50 text-xs font-semibold rounded-md
                         transition-all"
                        >
                            Reject
                        </button>
                    </div>
                </td>
            </tr>

            <ReceptionRejectModal
                open={showReject}
                onClose={() => setShowReject(false)}
                sample={sample}
            />
        </>
    );
}
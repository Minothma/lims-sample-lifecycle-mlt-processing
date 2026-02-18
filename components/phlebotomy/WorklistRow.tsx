// components/phlebotomy/WorklistRow.tsx
"use client";

import { useState } from "react";
import { Clock, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import PriorityBadge from "@/components/shared/PriorityBadge";
import TubeIndicator from "@/components/shared/TubeIndicator";
import type { Sample } from "@/types/sample.types";
import RejectSampleModal from "@/components/phlebotomy/RejectSampleModal";

interface WorklistRowProps {
    sample: Sample;
    onStartCollection: (sampleId: string) => void;
}

// Avatar initials + color
function PatientAvatar({ name, gender }: { name: string; gender: "M" | "F" }) {
    const initials = name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    return (
        <div
            className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0",
                gender === "F" ? "bg-pink-400" : "bg-blue-500"
            )}
        >
            {initials}
        </div>
    );
}

export default function WorklistRow({ sample, onStartCollection }: WorklistRowProps) {
    const [showReject, setShowReject] = useState(false);

    const isUrgent = sample.priority === "URGENT";

    return (
        <>
            <tr
                className={cn(
                    "border-b border-gray-100 hover:bg-gray-50 transition-colors",
                    isUrgent && "bg-red-50/30 hover:bg-red-50/50"
                )}
            >
                {/* ── Patient Details ── */}
                <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                        <PatientAvatar
                            name={sample.patient.name}
                            gender={sample.patient.gender}
                        />
                        <div>
                            <p className="text-sm font-semibold text-gray-900">
                                {sample.patient.name}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">
                                PID: {sample.patient.pid} • {sample.patient.age}Y,{" "}
                                {sample.patient.gender === "M" ? "Male" : "Female"}
                            </p>
                        </div>
                    </div>
                </td>

                {/* ── Priority ── */}
                <td className="px-4 py-3">
                    <PriorityBadge priority={sample.priority} />
                </td>

                {/* ── Tests Requested ── */}
                <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                        {sample.testCodes.map((code) => (
                            <span
                                key={code}
                                className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-[11px] font-medium rounded"
                            >
                {code}
              </span>
                        ))}
                    </div>
                </td>

                {/* ── Required Tubes ── */}
                <td className="px-4 py-3">
                    <TubeIndicator types={sample.tubeTypes} />
                </td>

                {/* ── Wait Time ── */}
                <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                        <Clock
                            className={cn(
                                "w-3.5 h-3.5",
                                (sample.waitTimeMinutes ?? 0) > 20
                                    ? "text-red-500"
                                    : (sample.waitTimeMinutes ?? 0) > 10
                                        ? "text-amber-500"
                                        : "text-gray-400"
                            )}
                        />
                        <span
                            className={cn(
                                "text-sm font-medium",
                                (sample.waitTimeMinutes ?? 0) > 20
                                    ? "text-red-600"
                                    : (sample.waitTimeMinutes ?? 0) > 10
                                        ? "text-amber-600"
                                        : "text-gray-600"
                            )}
                        >
              {sample.waitTimeMinutes} mins
            </span>
                    </div>
                </td>

                {/* ── Actions ── */}
                <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => onStartCollection(sample.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700
                         text-white text-xs font-semibold rounded-md transition-all
                         active:scale-95 shadow-sm"
                        >
                            START COLLECTION
                            <ChevronRight className="w-3 h-3" />
                        </button>
                        <button
                            onClick={() => setShowReject(true)}
                            className="px-3 py-1.5 border border-red-200 text-red-600 hover:bg-red-50
                         text-xs font-semibold rounded-md transition-all"
                        >
                            Reject
                        </button>
                    </div>
                </td>
            </tr>

            {/* Reject Modal */}
            <RejectSampleModal
                open={showReject}
                onClose={() => setShowReject(false)}
                sample={sample}
            />
        </>
    );
}
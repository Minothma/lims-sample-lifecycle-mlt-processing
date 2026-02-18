// components/mlt/MLTWorklistRow.tsx
"use client";

import { cn } from "@/lib/utils";
import PriorityBadge from "@/components/shared/PriorityBadge";
import StatusBadge   from "@/components/shared/StatusBadge";
import type { MLTSample } from "@/mock/mlt.mock";

interface MLTWorklistRowProps {
    sample:       MLTSample;
    mode:         "worklist" | "all";
    onAction:     (id: string) => void;
}

function PatientAvatar({ name, gender }: { name: string; gender: "M" | "F" }) {
    const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
    return (
        <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center",
            "text-white text-xs font-bold flex-shrink-0",
            gender === "F" ? "bg-pink-400" : "bg-blue-500"
        )}>
            {initials}
        </div>
    );
}

export default function MLTWorklistRow({
                                           sample,
                                           mode,
                                           onAction,
                                       }: MLTWorklistRowProps) {
    const isUrgent = sample.priority === "URGENT";

    return (
        <tr className={cn(
            "border-b border-gray-100 hover:bg-gray-50 transition-colors",
            isUrgent && "bg-red-50/20 hover:bg-red-50/40"
        )}>

            {/* ── Sample ID ── */}
            <td className="px-4 py-3">
                <div>
                    <p className="text-sm font-bold text-blue-600 font-mono">
                        #{sample.sampleId}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                        Rec: {sample.receivedTime}
                    </p>
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
                            {sample.patient.age}Y / {sample.patient.gender === "M" ? "Male" : "Female"}{" "}
                            {sample.patient.wardRoom && `| ${sample.patient.wardRoom}`}
                        </p>
                    </div>
                </div>
            </td>

            {/* ── Test Type ── */}
            <td className="px-4 py-3">
        <span className="text-sm font-medium text-gray-700">
          {sample.testType}
        </span>
            </td>

            {/* ── Priority ── */}
            <td className="px-4 py-3">
                <PriorityBadge priority={sample.priority} />
            </td>

            {/* ── Status ── */}
            <td className="px-4 py-3">
                <StatusBadge status={sample.status} />
            </td>

            {/* ── Action ── */}
            <td className="px-4 py-3">
                <button
                    onClick={() => onAction(sample.id)}
                    className={cn(
                        "px-3 py-1.5 text-xs font-semibold rounded-md transition-all active:scale-95",
                        mode === "worklist"
                            ? "bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                            : "bg-white border border-blue-200 text-blue-600 hover:bg-blue-50"
                    )}
                >
                    {mode === "worklist" ? "Start Testing" : "View Testing"}
                </button>
            </td>
        </tr>
    );
}
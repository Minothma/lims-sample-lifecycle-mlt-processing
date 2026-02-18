// components/reception/VerificationChecklist.tsx
"use client";

import { cn } from "@/lib/utils";
import type { VerificationCheck } from "@/mock/quality.mock";

interface VerificationChecklistProps {
    checks:   VerificationCheck[];
    onChange: (id: string, checked: boolean) => void;
    notes:    string;
    onNotesChange: (val: string) => void;
    elapsedMinutes: number;
}

export default function VerificationChecklist({
                                                  checks,
                                                  onChange,
                                                  notes,
                                                  onNotesChange,
                                                  elapsedMinutes,
                                              }: VerificationChecklistProps) {
    return (
        <div className="space-y-3">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-sm font-bold text-gray-800">
                        Pre-Analytical Verification
                    </h2>
                    <p className="text-xs text-gray-400 mt-0.5">
                        Verify all physical parameters before queuing
                    </p>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-600">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    {elapsedMinutes}m Elapsed
                </div>
            </div>

            {/* Checklist items */}
            <div className="space-y-2">
                {checks.map((check) => (
                    <div
                        key={check.id}
                        onClick={() => onChange(check.id, !check.checked)}
                        className={cn(
                            "flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all",
                            check.checked
                                ? "bg-green-50 border-green-200"
                                : "bg-white border-gray-200 hover:border-blue-200 hover:bg-blue-50/30"
                        )}
                    >
                        {/* Checkbox */}
                        <div className={cn(
                            "w-4 h-4 rounded flex items-center justify-center flex-shrink-0 mt-0.5 border-2 transition-all",
                            check.checked
                                ? "bg-green-500 border-green-500"
                                : "border-gray-300 bg-white"
                        )}>
                            {check.checked && (
                                <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24">
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

                        {/* Label */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <p className={cn(
                                    "text-sm font-semibold",
                                    check.checked ? "text-green-800" : "text-gray-800"
                                )}>
                                    {check.label}
                                </p>
                                {check.tag && (
                                    <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase
                                   rounded bg-gray-100 text-gray-500 tracking-wider">
                    {check.tag}
                  </span>
                                )}
                            </div>
                            <p className={cn(
                                "text-xs mt-0.5",
                                check.checked ? "text-green-600" : "text-gray-400"
                            )}>
                                {check.description}
                            </p>
                        </div>

                        {/* Status icon */}
                        <div className="flex-shrink-0">
                            {check.checked ? (
                                <span className="text-green-500">✓</span>
                            ) : (
                                <span className="text-gray-300">○</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Observations Notes */}
            <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider
                           text-gray-400 mb-1.5">
                    Observations / Notes (Optional)
                </label>
                <textarea
                    value={notes}
                    onChange={(e) => onNotesChange(e.target.value)}
                    rows={3}
                    placeholder="Enter any visible abnormalities or technical notes..."
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg
                     bg-white text-gray-700 placeholder-gray-400 resize-none
                     focus:outline-none focus:ring-2 focus:ring-blue-500
                     focus:border-transparent transition-all"
                />
            </div>
        </div>
    );
}
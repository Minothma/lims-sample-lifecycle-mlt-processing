"use client";

// components/mlt/ResultParameterRow.tsx
import { cn } from "@/lib/utils";
import ResultFlagBadge from "@/components/mlt/ResultFlagBadge";
import { computeFlag, type TestParameter } from "@/mock/result-entry.mock";

interface ResultParameterRowProps {
    param:    TestParameter;
    onChange: (id: string, value: string) => void;
}

export default function ResultParameterRow({
                                               param,
                                               onChange,
                                           }: ResultParameterRowProps) {
    const numericValue = parseFloat(param.result);
    const computedFlag = isNaN(numericValue)
        ? param.flag
        : computeFlag(
            numericValue,
            param.referenceRangeLow,
            param.referenceRangeHigh
        );

    const isCritical =
        computedFlag === "CRITICAL_HIGH" || computedFlag === "CRITICAL_LOW";

    return (
        <tr className={cn(
            "border-b border-gray-100 transition-colors",
            isCritical
                ? "bg-red-50/40 hover:bg-red-50/60"
                : "hover:bg-gray-50/60"
        )}>

            {/* ── Parameter Name ── */}
            <td className="px-4 py-3">
                <p className={cn(
                    "text-sm font-medium",
                    isCritical ? "text-red-800 font-semibold" : "text-gray-700"
                )}>
                    {param.parameterName}
                </p>
            </td>

            {/* ── Result Input ── */}
            <td className="px-4 py-3 w-[140px]">
                <input
                    type="number"
                    step="0.01"
                    value={param.result}
                    onChange={(e) => onChange(param.id, e.target.value)}
                    className={cn(
                        "w-24 px-2.5 py-1.5 text-sm font-semibold rounded-md border transition-all",
                        "focus:outline-none focus:ring-2 focus:ring-offset-0",
                        isCritical
                            ? "border-red-400 bg-red-50 text-red-800 focus:ring-red-400"
                            : "border-gray-200 bg-white text-gray-800 focus:ring-blue-400"
                    )}
                />
            </td>

            {/* ── Unit ── */}
            <td className="px-4 py-3 w-[100px]">
        <span className="text-xs text-gray-500 font-mono">
          {param.unit}
        </span>
            </td>

            {/* ── Reference Range ── */}
            <td className="px-4 py-3 w-[160px]">
        <span className="text-xs text-gray-500 font-mono">
          {param.referenceRangeLow} – {param.referenceRangeHigh}
        </span>
            </td>

            {/* ── Flag ── */}
            <td className="px-4 py-3 w-[140px]">
                <ResultFlagBadge flag={computedFlag} />
            </td>
        </tr>
    );
}
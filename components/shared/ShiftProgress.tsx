// components/shared/ShiftProgress.tsx
"use client";

interface ShiftProgressProps {
    processed: number;
    total: number;
}

export default function ShiftProgress({ processed, total }: ShiftProgressProps) {
    const pct = Math.round((processed / total) * 100);

    return (
        <div className="px-3 py-2 border-t border-gray-100">
            <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
          Shift Progress
        </span>
                <span className="text-[10px] font-bold text-blue-600">{pct}%</span>
            </div>
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                    className="h-full bg-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                />
            </div>
            <p className="text-[10px] text-gray-400 mt-1">
                {processed} of {total} samples processed
            </p>
        </div>
    );
}
"use client";

// components/mlt/ResultFlagBadge.tsx
import { cn } from "@/lib/utils";
import type { ResultFlag } from "@/mock/result-entry.mock";

interface ResultFlagBadgeProps {
    flag:      ResultFlag;
    className?: string;
}

const FLAG_CONFIG: Record<ResultFlag, { label: string; className: string }> = {
    NORMAL:        { label: "NORMAL",        className: "bg-gray-100 text-gray-500" },
    LOW:           { label: "LOW",           className: "bg-amber-100 text-amber-700" },
    HIGH:          { label: "HIGH",          className: "bg-orange-100 text-orange-700" },
    CRITICAL_LOW:  { label: "CRITICAL LOW",  className: "bg-red-600 text-white" },
    CRITICAL_HIGH: { label: "CRITICAL HIGH", className: "bg-red-600 text-white" },
};

export default function ResultFlagBadge({ flag, className }: ResultFlagBadgeProps) {
    const config = FLAG_CONFIG[flag];
    return (
        <span className={cn(
            "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wide",
            config.className,
            className
        )}>
      {config.label}
    </span>
    );
}
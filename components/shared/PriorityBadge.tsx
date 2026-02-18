// components/shared/PriorityBadge.tsx
"use client";

import { cn } from "@/lib/utils";
import type { Priority } from "@/types/sample.types";

interface PriorityBadgeProps {
    priority: Priority;
    className?: string;
}

const priorityConfig = {
    URGENT: {
        label: "URGENT",
        className: "bg-red-100 text-red-700 border border-red-200",
    },
    NORMAL: {
        label: "NORMAL",
        className: "bg-gray-100 text-gray-600 border border-gray-200",
    },
    STAT: {
        label: "STAT",
        className: "bg-orange-100 text-orange-700 border border-orange-200",
    },
};

export default function PriorityBadge({ priority, className }: PriorityBadgeProps) {
    const config = priorityConfig[priority] ?? priorityConfig.NORMAL;
    return (
        <span className={cn(
            "inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold tracking-wide",
            config.className,
            className
        )}>
      {config.label}
    </span>
    );
}
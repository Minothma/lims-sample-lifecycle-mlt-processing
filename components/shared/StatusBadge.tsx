// components/shared/StatusBadge.tsx
"use client";

import { cn } from "@/lib/utils";
import type { SampleStatus } from "@/types/sample.types";

const statusConfig: Record<SampleStatus, { label: string; className: string }> = {
    PENDING_COLLECTION:    { label: "Pending Collection",    className: "bg-amber-100 text-amber-700" },
    COLLECTED:             { label: "Collected",             className: "bg-green-100 text-green-700" },
    IN_TRANSIT:            { label: "In Transit",            className: "bg-blue-100 text-blue-700" },
    RECEIVED_AT_LAB:       { label: "Sample Received",       className: "bg-blue-100 text-blue-700" },
    QUALITY_CHECK:         { label: "Quality Check",         className: "bg-purple-100 text-purple-700" },
    ACCEPTED:              { label: "Accepted",              className: "bg-green-100 text-green-700" },
    REJECTED:              { label: "Rejected",              className: "bg-red-100 text-red-700" },
    IN_TESTING:            { label: "In Testing",            className: "bg-indigo-100 text-indigo-700" },
    RESULT_ENTERED:        { label: "Result Entered",        className: "bg-teal-100 text-teal-700" },
    SENT_FOR_VERIFICATION: { label: "Sent for Verification", className: "bg-violet-100 text-violet-700" },
    VERIFIED:              { label: "Verified",              className: "bg-green-100 text-green-700" },
    AUTHORIZED:            { label: "Authorized",            className: "bg-emerald-100 text-emerald-700" },
    DISPATCHED:            { label: "Dispatched",            className: "bg-gray-100 text-gray-600" },
};

interface StatusBadgeProps {
    status: SampleStatus;
    className?: string;
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
    const config = statusConfig[status];
    return (
        <span className={cn(
            "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium",
            config.className,
            className
        )}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
            {config.label}
    </span>
    );
}
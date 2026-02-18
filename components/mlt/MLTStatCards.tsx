// components/mlt/MLTStatCards.tsx
"use client";

import { cn } from "@/lib/utils";
import {
    XCircle,
    ClipboardList,
    AlertTriangle,
    FileEdit,
} from "lucide-react";

interface MLTStatCardsProps {
    rejectedTests:   number;
    rejectedSince:   string;
    pendingTests:    number;
    pendingSince:    string;
    criticalResults: number;
    myDrafts:        number;
}

export default function MLTStatCards({
                                         rejectedTests,
                                         rejectedSince,
                                         pendingTests,
                                         pendingSince,
                                         criticalResults,
                                         myDrafts,
                                     }: MLTStatCardsProps) {
    const cards = [
        {
            label:   "Rejected Tests",
            value:   rejectedTests,
            since:   rejectedSince,
            icon:    XCircle,
            color:   "text-red-500",
            bg:      "bg-red-50",
            border:  "border-red-100",
        },
        {
            label:   "Pending Tests",
            value:   pendingTests,
            since:   pendingSince,
            icon:    ClipboardList,
            color:   "text-amber-500",
            bg:      "bg-amber-50",
            border:  "border-amber-100",
        },
        {
            label:   "Critical Results",
            value:   criticalResults,
            since:   "Requires Action",
            icon:    AlertTriangle,
            color:   "text-red-600",
            bg:      "bg-red-50",
            border:  "border-red-200",
            urgent:  true,
        },
        {
            label:   "My Drafts",
            value:   myDrafts,
            since:   "In Progress",
            icon:    FileEdit,
            color:   "text-blue-500",
            bg:      "bg-blue-50",
            border:  "border-blue-100",
        },
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map((card) => {
                const Icon = card.icon;
                return (
                    <div
                        key={card.label}
                        className={cn(
                            "bg-white rounded-lg border p-4 shadow-sm",
                            card.border
                        )}
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                                    {card.label}
                                </p>
                                <p className="text-2xl font-bold text-gray-900 mt-1 leading-none">
                                    {card.value.toString().padStart(2, "0")}
                                </p>
                                <p className={cn(
                                    "text-[11px] font-semibold mt-1.5",
                                    card.urgent ? "text-red-600" : "text-gray-400"
                                )}>
                                    {card.since}
                                </p>
                            </div>
                            <div className={cn("p-2 rounded-lg", card.bg)}>
                                <Icon className={cn("w-4 h-4", card.color)} />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
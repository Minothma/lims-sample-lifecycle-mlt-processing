// components/shared/StatCard.tsx
"use client";

import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
    label: string;
    value: number | string;
    icon: LucideIcon;
    color: "blue" | "orange" | "green" | "red" | "purple";
    badge?: string;
    badgeColor?: "blue" | "orange" | "green" | "red";
    trend?: string;
}

const colorMap = {
    blue:   { bg: "bg-blue-50",   icon: "text-blue-500",   border: "border-blue-100" },
    orange: { bg: "bg-orange-50", icon: "text-orange-500", border: "border-orange-100" },
    green:  { bg: "bg-green-50",  icon: "text-green-500",  border: "border-green-100" },
    red:    { bg: "bg-red-50",    icon: "text-red-500",    border: "border-red-100" },
    purple: { bg: "bg-purple-50", icon: "text-purple-500", border: "border-purple-100" },
};

const badgeColorMap = {
    blue:   "bg-blue-100 text-blue-700",
    orange: "bg-orange-100 text-orange-700",
    green:  "bg-green-100 text-green-700",
    red:    "bg-red-100 text-red-700",
};

export default function StatCard({
                                     label,
                                     value,
                                     icon: Icon,
                                     color,
                                     badge,
                                     badgeColor = "blue",
                                     trend,
                                 }: StatCardProps) {
    const colors = colorMap[color];

    return (
        <div className={cn(
            "bg-white rounded-lg border p-4 flex items-start gap-3 shadow-sm",
            colors.border
        )}>
            {/* Icon */}
            <div className={cn("p-2 rounded-lg mt-0.5", colors.bg)}>
                <Icon className={cn("w-4 h-4", colors.icon)} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider truncate">
                    {label}
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-0.5 leading-none">
                    {typeof value === "number" ? value.toString().padStart(2, "0") : value}
                </p>
                {badge && (
                    <span className={cn(
                        "inline-block mt-1.5 text-[10px] font-semibold px-1.5 py-0.5 rounded",
                        badgeColorMap[badgeColor]
                    )}>
            {badge}
          </span>
                )}
                {trend && (
                    <p className="text-[10px] text-gray-400 mt-1">{trend}</p>
                )}
            </div>
        </div>
    );
}
// components/layout/TopNav.tsx
"use client";

import { usePathname } from "next/navigation";
import { Bell, RefreshCw, Clock } from "lucide-react";
import { getMockUser } from "@/lib/auth/mock-session";
import { cn } from "@/lib/utils";

// Maps URL paths → module display name
const MODULE_LABELS: Record<string, { title: string; subtitle: string }> = {
    "/phlebotomy/worklist":          { title: "DURDANS", subtitle: "PHLEBOTOMY MODULE" },
    "/phlebotomy/collection-history":{ title: "DURDANS", subtitle: "PHLEBOTOMY MODULE" },
    "/phlebotomy/label-reprint":     { title: "DURDANS", subtitle: "PHLEBOTOMY MODULE" },
    "/phlebotomy/supplies":          { title: "DURDANS", subtitle: "PHLEBOTOMY MODULE" },
    "/reception/accessioning":       { title: "DURDANS", subtitle: "LAB RECEPTION" },
    "/reception/barcode-reprint":    { title: "DURDANS", subtitle: "LAB RECEPTION" },
    "/reception/logs":               { title: "DURDANS", subtitle: "LAB RECEPTION" },
    "/mlt/worklist":                 { title: "DURDANS", subtitle: "MLT TESTING" },
    "/mlt/all-worklist":             { title: "DURDANS", subtitle: "MLT TESTING" },
    "/mlt/result-entry":             { title: "DURDANS", subtitle: "MLT TESTING" },
    "/mlt/qc-dashboard":             { title: "DURDANS", subtitle: "MLT TESTING" },
    "/mlt/instruments":              { title: "DURDANS", subtitle: "MLT TESTING" },
};

function getCurrentTime() {
    return new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });
}

export default function TopNav() {
    const pathname = usePathname();
    const user = getMockUser();
    const moduleLabel = MODULE_LABELS[pathname] ?? { title: "DURDANS", subtitle: "ERP SYSTEM" };

    return (
        <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-30">

            {/* ── Left: Module Label ── */}
            <div className="flex flex-col">
        <span className="text-xs font-bold text-blue-600 leading-none tracking-wider">
          {moduleLabel.title}
        </span>
                <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest">
          {moduleLabel.subtitle}
        </span>
            </div>

            {/* ── Right: Actions + User ── */}
            <div className="flex items-center gap-4">

                {/* Last updated timestamp */}
                <div className="hidden md:flex flex-col items-end">
          <span className="text-[10px] text-gray-400 uppercase tracking-wider">
            Last Updated
          </span>
                    <span className="text-xs font-semibold text-gray-600">
            Today, {getCurrentTime()}
          </span>
                </div>

                {/* Refresh button */}
                <button
                    onClick={() => window.location.reload()}
                    className="p-1.5 rounded-md text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                    title="Refresh"
                >
                    <RefreshCw className="w-4 h-4" />
                </button>

                {/* Notifications */}
                <button className="relative p-1.5 rounded-md text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all">
                    <Bell className="w-4 h-4" />
                    {/* Notification dot */}
                    <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full" />
                </button>

                {/* Divider */}
                <div className="w-px h-6 bg-gray-200" />

                {/* User info */}
                <div className="flex items-center gap-2.5">
                    <div className="flex flex-col items-end">
            <span className="text-xs font-semibold text-gray-800 leading-none">
              {user.name}
            </span>
                        <span className="text-[10px] text-gray-400 mt-0.5">
              {user.role.replace(/_/g, " ")}
            </span>
                    </div>
                    {/* Avatar */}
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                        {user.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                </div>
            </div>
        </header>
    );
}
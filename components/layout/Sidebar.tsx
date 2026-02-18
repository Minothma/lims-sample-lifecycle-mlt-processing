// components/layout/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

import {
    FlaskConical,
    ClipboardList,
    History,
    Printer,
    Package,
    TestTube2,
    FileText,
    BarChart3,
    Microscope,
    ChevronRight,
    LogOut,
    User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getMockUser } from "@/lib/auth/mock-session";

// ─── Nav Structure ───────────────────────────────────────────────
const NAV_SECTIONS = [
    {
        section: "PHLEBOTOMY",
        role: ["PHLEBOTOMIST", "BRANCH_ADMIN", "SUPER_ADMIN"],
        items: [
            {
                label: "Sample Worklist",
                href: "/phlebotomy/worklist",
                icon: ClipboardList,
            },
            {
                label: "Collection History",
                href: "/phlebotomy/collection-history",
                icon: History,
            },
            {
                label: "Label Reprint",
                href: "/phlebotomy/label-reprint",
                icon: Printer,
            },
            {
                label: "Supplies Inventory",
                href: "/phlebotomy/supplies",
                icon: Package,
            },
        ],
    },
    {
        section: "LAB RECEPTION",
        role: ["LAB_RECEPTIONIST", "BRANCH_ADMIN", "SUPER_ADMIN"],
        items: [
            {
                label: "Reception Worklist",
                href: "/reception/accessioning",
                icon: ClipboardList,
            },
            {
                label: "Quality Verification",
                href: "/reception/quality-verification",
                icon: CheckCircle2,
            },
            {
                label: "Barcode Reprint",
                href: "/reception/barcode-reprint",
                icon: Printer,
            },
            {
                label: "Accessioning Logs",
                href: "/reception/logs",
                icon: History,
            },
        ],
    },
    {
        section: "MLT TESTING",
        role: ["MLT", "SENIOR_MLT", "BRANCH_ADMIN", "SUPER_ADMIN"],
        items: [
            {
                label: "Sample Worklist",
                href: "/mlt/worklist",
                icon: TestTube2,
            },
            {
                label: "All Worklist",
                href: "/mlt/all-worklist",
                icon: ClipboardList,
            },
            {
                label: "Result Entry",
                href: "/mlt/result-entry",
                icon: FileText,
            },
            {
                label: "QC Dashboard",
                href: "/mlt/qc-dashboard",
                icon: BarChart3,
            },
            {
                label: "Instruments",
                href: "/mlt/instruments",
                icon: Microscope,
            },
        ],
    },
];

// ─── Component ────────────────────────────────────────────────────
export default function Sidebar() {
    const pathname = usePathname();
    const user = getMockUser();
    const [collapsed, setCollapsed] = useState(false);

    return (
        <aside
            className={cn(
                "flex flex-col bg-white border-r border-gray-200 transition-all duration-300 h-screen sticky top-0",
                collapsed ? "w-16" : "w-56"
            )}
        >
            {/* ── Logo ── */}
            <div className="flex items-center gap-2.5 px-4 py-4 border-b border-gray-100">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <FlaskConical className="w-4 h-4 text-white" />
                </div>
                {!collapsed && (
                    <div className="overflow-hidden">
                        <p className="text-sm font-bold text-blue-600 leading-none tracking-wide">
                            DURDANS
                        </p>
                        <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest mt-0.5">
                            ERP System
                        </p>
                    </div>
                )}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="ml-auto text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <ChevronRight
                        className={cn(
                            "w-4 h-4 transition-transform duration-300",
                            collapsed ? "rotate-0" : "rotate-180"
                        )}
                    />
                </button>
            </div>

            {/* ── Navigation ── */}
            <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
                {NAV_SECTIONS.map((section) => (
                    <div key={section.section}>
                        {/* Section label */}
                        {!collapsed && (
                            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 px-2 mb-1">
                                {section.section}
                            </p>
                        )}

                        {/* Nav items */}
                        <ul className="space-y-0.5">
                            {section.items.map((item) => {
                                const isActive =
                                    pathname === item.href ||
                                    pathname.startsWith(item.href + "/");
                                const Icon = item.icon;

                                return (
                                    <li key={item.href}>
                                        <Link
                                            href={item.href}
                                            className={cn(
                                                "flex items-center gap-2.5 px-2 py-2 rounded-md text-sm transition-all duration-150",
                                                isActive
                                                    ? "bg-blue-50 text-blue-600 font-semibold"
                                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                            )}
                                        >
                                            <Icon
                                                className={cn(
                                                    "w-4 h-4 flex-shrink-0",
                                                    isActive ? "text-blue-600" : "text-gray-400"
                                                )}
                                            />
                                            {!collapsed && (
                                                <span className="truncate">{item.label}</span>
                                            )}
                                            {/* Active indicator */}
                                            {isActive && !collapsed && (
                                                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600" />
                                            )}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))}
            </nav>

            {/* ── User Profile Footer ── */}
            <div className="border-t border-gray-100 p-3">
                <div className="flex items-center gap-2.5">
                    {/* Avatar */}
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-blue-600" />
                    </div>

                    {!collapsed && (
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-gray-900 truncate">
                                {user.name}
                            </p>
                            <p className="text-[10px] text-gray-400 truncate">
                                {user.role.replace(/_/g, " ")}
                            </p>
                        </div>
                    )}

                    {!collapsed && (
                        <button className="text-gray-400 hover:text-red-500 transition-colors ml-auto">
                            <LogOut className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>
            </div>
        </aside>
    );
}
"use client";

// app/(dashboard)/phlebotomy/supplies/page.tsx
import { useState } from "react";
import { Package, AlertTriangle, Plus, Search, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Supply {
    id:          string;
    name:        string;
    category:    string;
    tubeColor?:  string;
    currentStock:number;
    minStock:    number;
    maxStock:    number;
    unit:        string;
    lastRestocked:string;
    expiryDate:  string;
}

const MOCK_SUPPLIES: Supply[] = [
    {
        id: "s1", name: "EDTA Tubes (Lavender Top)", category: "Collection Tubes",
        tubeColor: "bg-purple-300", currentStock: 245, minStock: 100,
        maxStock: 500, unit: "tubes", lastRestocked: "Oct 20, 2023",
        expiryDate: "Dec 2024",
    },
    {
        id: "s2", name: "SST Tubes (Gold Top)", category: "Collection Tubes",
        tubeColor: "bg-yellow-400", currentStock: 48, minStock: 100,
        maxStock: 400, unit: "tubes", lastRestocked: "Oct 18, 2023",
        expiryDate: "Nov 2024",
    },
    {
        id: "s3", name: "Citrate Tubes (Blue Top)", category: "Collection Tubes",
        tubeColor: "bg-blue-400", currentStock: 180, minStock: 80,
        maxStock: 300, unit: "tubes", lastRestocked: "Oct 22, 2023",
        expiryDate: "Jan 2025",
    },
    {
        id: "s4", name: "Heparin Tubes (Green Top)", category: "Collection Tubes",
        tubeColor: "bg-green-500", currentStock: 22, minStock: 60,
        maxStock: 250, unit: "tubes", lastRestocked: "Oct 15, 2023",
        expiryDate: "Oct 2024",
    },
    {
        id: "s5", name: "Disposable Gloves (Medium)", category: "PPE",
        currentStock: 320, minStock: 200, maxStock: 1000,
        unit: "pairs", lastRestocked: "Oct 21, 2023", expiryDate: "N/A",
    },
    {
        id: "s6", name: "Alcohol Swabs", category: "Consumables",
        currentStock: 85, minStock: 200, maxStock: 800,
        unit: "packs", lastRestocked: "Oct 19, 2023", expiryDate: "Mar 2025",
    },
    {
        id: "s7", name: "Needle 21G x 1.5\"", category: "Needles",
        currentStock: 410, minStock: 150, maxStock: 600,
        unit: "pieces", lastRestocked: "Oct 22, 2023", expiryDate: "Jun 2025",
    },
    {
        id: "s8", name: "Tourniquet", category: "Equipment",
        currentStock: 12, minStock: 10, maxStock: 30,
        unit: "pieces", lastRestocked: "Sep 01, 2023", expiryDate: "N/A",
    },
];

function getStockStatus(current: number, min: number, max: number) {
    const pct = (current / max) * 100;
    if (current <= min * 0.5) return { label: "CRITICAL", color: "text-red-600",   bar: "bg-red-500",   badge: "bg-red-100 text-red-700" };
    if (current <= min)       return { label: "LOW",      color: "text-amber-600", bar: "bg-amber-500", badge: "bg-amber-100 text-amber-700" };
    if (pct >= 80)            return { label: "GOOD",     color: "text-green-600", bar: "bg-green-500", badge: "bg-green-100 text-green-700" };
    return                           { label: "OK",       color: "text-blue-600",  bar: "bg-blue-500",  badge: "bg-blue-100 text-blue-700" };
}

const CATEGORIES = ["All Categories", "Collection Tubes", "PPE", "Consumables", "Needles", "Equipment"];

export default function SuppliesInventoryPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [category,    setCategory]    = useState("All Categories");

    const lowStock      = MOCK_SUPPLIES.filter((s) => s.currentStock <= s.minStock);
    const criticalStock = MOCK_SUPPLIES.filter((s) => s.currentStock <= s.minStock * 0.5);

    const filtered = MOCK_SUPPLIES.filter((s) => {
        const q = searchQuery.toLowerCase();
        const matchSearch = !q || s.name.toLowerCase().includes(q);
        const matchCat    = category === "All Categories" || s.category === category;
        return matchSearch && matchCat;
    });

    return (
        <div className="space-y-5">

            {/* ── Header ── */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="page-header">Supplies Inventory</h1>
                    <p className="page-subtitle">
                        Phlebotomy consumables and equipment stock levels
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => toast.success("Inventory refreshed")}
                        className="p-2 border border-gray-200 rounded-lg bg-white
                       text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-all"
                    >
                        <RefreshCw className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => toast.info("Raise requisition — coming soon")}
                        className="flex items-center gap-1.5 px-3 py-2 bg-blue-600
                       hover:bg-blue-700 text-white text-sm font-semibold
                       rounded-lg transition-all"
                    >
                        <Plus className="w-3.5 h-3.5" />
                        Raise Requisition
                    </button>
                </div>
            </div>

            {/* ── Alert Banner ── */}
            {lowStock.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3
                        flex items-start gap-3">
                    <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-bold text-amber-800">
                            {criticalStock.length > 0
                                ? `${criticalStock.length} item(s) critically low — immediate restock required`
                                : `${lowStock.length} item(s) below minimum stock level`
                            }
                        </p>
                        <p className="text-xs text-amber-600 mt-0.5">
                            {lowStock.map((s) => s.name).join(" • ")}
                        </p>
                    </div>
                </div>
            )}

            {/* ── Summary Cards ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Total Items",     value: MOCK_SUPPLIES.length, color: "text-blue-600",  bg: "bg-blue-50" },
                    { label: "Well Stocked",    value: MOCK_SUPPLIES.filter((s) => s.currentStock > s.minStock).length, color: "text-green-600", bg: "bg-green-50" },
                    { label: "Low Stock",       value: lowStock.length,      color: "text-amber-600", bg: "bg-amber-50" },
                    { label: "Critical",        value: criticalStock.length, color: "text-red-600",   bg: "bg-red-50" },
                ].map(({ label, value, color, bg }) => (
                    <div key={label} className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center mb-2", bg)}>
                            <Package className={cn("w-4 h-4", color)} />
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{value}</p>
                        <p className="text-xs text-gray-500 font-medium mt-0.5">{label}</p>
                    </div>
                ))}
            </div>

            {/* ── Filters ── */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
                <div className="flex items-center gap-3 flex-wrap">
                    <div className="relative flex-1 min-w-[240px] max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search supplies..."
                            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200
                         rounded-lg focus:outline-none focus:ring-2
                         focus:ring-blue-500 transition-all"
                        />
                    </div>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="px-3 py-2 text-sm border border-gray-200 rounded-lg
                       bg-white text-gray-700 focus:outline-none
                       focus:ring-2 focus:ring-blue-500 transition-all"
                    >
                        {CATEGORIES.map((c) => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* ── Inventory Table ── */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                        <tr className="border-b border-gray-100 bg-gray-50/60">
                            {["Item", "Category", "Stock Level", "Stock Bar", "Unit", "Last Restocked", "Expiry", "Status"].map((col) => (
                                <th key={col} className="px-4 py-2.5 text-left text-[11px]
                                           font-semibold uppercase tracking-wider text-gray-500">
                                    {col}
                                </th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {filtered.map((supply) => {
                            const stockStatus = getStockStatus(
                                supply.currentStock,
                                supply.minStock,
                                supply.maxStock
                            );
                            const pct = Math.round((supply.currentStock / supply.maxStock) * 100);

                            return (
                                <tr
                                    key={supply.id}
                                    className={cn(
                                        "border-b border-gray-100 transition-colors hover:bg-gray-50",
                                        supply.currentStock <= supply.minStock * 0.5 && "bg-red-50/30"
                                    )}
                                >
                                    {/* Item name */}
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            {supply.tubeColor && (
                                                <div className={cn(
                                                    "w-3 h-3 rounded-full flex-shrink-0",
                                                    supply.tubeColor
                                                )} />
                                            )}
                                            <p className="text-sm font-semibold text-gray-900">
                                                {supply.name}
                                            </p>
                                        </div>
                                    </td>

                                    {/* Category */}
                                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600
                                       text-xs font-medium rounded">
                        {supply.category}
                      </span>
                                    </td>

                                    {/* Stock count */}
                                    <td className="px-4 py-3">
                                        <p className={cn("text-sm font-bold", stockStatus.color)}>
                                            {supply.currentStock}
                                            <span className="text-gray-400 font-normal text-xs ml-1">
                          / {supply.maxStock}
                        </span>
                                        </p>
                                        <p className="text-[10px] text-gray-400">
                                            Min: {supply.minStock}
                                        </p>
                                    </td>

                                    {/* Stock bar */}
                                    <td className="px-4 py-3 w-[120px]">
                                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className={cn(
                                                    "h-full rounded-full transition-all",
                                                    stockStatus.bar
                                                )}
                                                style={{ width: `${Math.min(pct, 100)}%` }}
                                            />
                                        </div>
                                        <p className="text-[10px] text-gray-400 mt-0.5">{pct}%</p>
                                    </td>

                                    {/* Unit */}
                                    <td className="px-4 py-3">
                                        <span className="text-xs text-gray-500">{supply.unit}</span>
                                    </td>

                                    {/* Last restocked */}
                                    <td className="px-4 py-3">
                      <span className="text-xs text-gray-600">
                        {supply.lastRestocked}
                      </span>
                                    </td>

                                    {/* Expiry */}
                                    <td className="px-4 py-3">
                      <span className="text-xs text-gray-600">
                        {supply.expiryDate}
                      </span>
                                    </td>

                                    {/* Status badge */}
                                    <td className="px-4 py-3">
                      <span className={cn(
                          "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold",
                          stockStatus.badge
                      )}>
                        {stockStatus.label}
                      </span>
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
// app/(dashboard)/reception/barcode-reprint/page.tsx
"use client";

import { useState } from "react";
import {
    Search,
    Printer,
    CheckCircle2,
    ScanLine,
    Settings,
    AlignCenter,
    X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
    MOCK_BARCODE_RESULTS,
    MOCK_PRE_PRINT_CHECKLIST,
    type BarcodeSearchResult,
} from "@/mock/barcode.mock";

// Tube color map
const TUBE_COLOR: Record<string, string> = {
    lavender: "bg-purple-300",
    purple:   "bg-purple-500",
    red:      "bg-red-500",
    gold:     "bg-yellow-400",
    blue:     "bg-blue-400",
    green:    "bg-green-500",
};

// ── Barcode SVG visual ──────────────────────────────────────────
function BarcodeVisual({ value }: { value: string }) {
    // Generate fake bar widths for visual effect
    const bars = Array.from({ length: 40 }, (_, i) => ({
        width: [1, 2, 1, 3, 1, 2, 2, 1][i % 8],
        dark:  i % 3 !== 0,
    }));

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            {/* Barcode bars */}
            <div className="flex items-end justify-center gap-px h-16 mb-2">
                {bars.map((bar, i) => (
                    <div
                        key={i}
                        className={cn(
                            "rounded-sm",
                            bar.dark ? "bg-gray-900" : "bg-transparent"
                        )}
                        style={{
                            width:  `${bar.width * 3}px`,
                            height: `${50 + (i % 5) * 4}px`,
                        }}
                    />
                ))}
            </div>
            <p className="text-xs font-mono font-bold text-gray-700 tracking-widest">
                {value}
            </p>
        </div>
    );
}

// ── Label Digital Twin ──────────────────────────────────────────
function LabelPreview({ result }: { result: BarcodeSearchResult }) {
    return (
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3 text-center">
                Label Digital Twin
            </p>

            {/* Mini label card */}
            <div className="bg-white border-2 border-gray-300 rounded-lg p-3 mb-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
          <span className="text-[9px] font-bold text-blue-600 uppercase tracking-wider">
            DURDANS HOSPITAL
          </span>
                    <span className="text-[9px] font-mono text-gray-600">
            ID: {result.sampleId.split("-").slice(-1)[0]}
          </span>
                </div>

                {/* Mini barcode */}
                <div className="flex items-end justify-center gap-px h-8 mb-1">
                    {Array.from({ length: 24 }, (_, i) => (
                        <div
                            key={i}
                            className={i % 3 !== 0 ? "bg-gray-900" : "bg-transparent"}
                            style={{ width: "2px", height: `${18 + (i % 4) * 3}px` }}
                        />
                    ))}
                </div>
                <p className="text-[7px] font-mono text-center text-gray-600 mb-2">
                    {result.barcode}
                </p>

                <div className="grid grid-cols-2 gap-1 text-[9px]">
                    <div>
                        <p className="text-gray-400">DOE, JANE</p>
                        <p className="text-gray-600">49Y / F</p>
                    </div>
                    <div className="text-right">
                        <div className={cn(
                            "inline-block w-3 h-3 rounded-sm mb-0.5",
                            TUBE_COLOR[result.tubeColor] ?? "bg-gray-400"
                        )} />
                        <p className="text-gray-400">LAVENDER TOP</p>
                        <p className="text-gray-600">
                            {result.collectionDate.slice(0, 6)} {result.collectionTime}
                        </p>
                    </div>
                </div>
            </div>

            {/* Reprint button */}
            <button
                onClick={() => toast.success("Barcode sent to printer", {
                    description: `Zebra ZT411 — ${result.sampleId}`,
                })}
                className="w-full flex items-center justify-center gap-2 py-2.5
                   bg-blue-600 hover:bg-blue-700 text-white text-sm
                   font-semibold rounded-lg transition-all active:scale-95"
            >
                <Printer className="w-4 h-4" />
                REPRINT BARCODE
            </button>

            <button
                className="w-full mt-2 text-xs text-gray-400 hover:text-gray-600
                   transition-colors py-1"
                onClick={() => toast.info("Search cleared")}
            >
                Clear Search & Cancel
            </button>

            {result.lastPrinted && (
                <p className="text-[10px] text-center text-gray-400 mt-2">
                    🕐 Last print ID released: {result.lastPrinted}
                </p>
            )}

            {/* Printer status */}
            <div className="mt-3 flex items-center gap-2 bg-green-600 text-white
                      rounded-lg px-3 py-2 text-xs font-medium">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                Zebra ZT411 Connected
                <span className="ml-auto text-green-200 text-[10px]">
          Local printer
        </span>
            </div>
        </div>
    );
}

// ── Main Page ───────────────────────────────────────────────────
export default function BarcodeReprintPage() {
    const [searchInput,  setSearchInput]  = useState("");
    const [searchResult, setSearchResult] = useState<BarcodeSearchResult | null>(null);
    const [notFound,     setNotFound]     = useState(false);
    const [searching,    setSearching]    = useState(false);

    const handleSearch = async () => {
        if (!searchInput.trim()) return;
        setSearching(true);
        setNotFound(false);
        setSearchResult(null);

        await new Promise((r) => setTimeout(r, 600));

        const result = MOCK_BARCODE_RESULTS[searchInput.trim().toUpperCase()];
        if (result) {
            setSearchResult(result);
        } else {
            setNotFound(true);
            toast.error("Sample ID not found", {
                description: "Please verify the ID and try again.",
            });
        }
        setSearching(false);
    };

    return (
        <div className="space-y-5">

            {/* ── Breadcrumb ── */}
            <div className="flex items-center gap-2 text-xs text-gray-400">
                <span>Accessioning</span>
                <span>›</span>
                <span className="text-gray-600 font-medium">Reprint Barcode Utility</span>
            </div>

            {/* ── Search Panel ── */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <div className="flex items-center gap-2 mb-1">
                    <ScanLine className="w-4 h-4 text-blue-500" />
                    <p className="text-sm font-semibold text-gray-700">
                        Manual Sample ID Entry
                    </p>
                </div>
                <p className="text-xs text-gray-400 mb-4">
                    Scan or type the ID exactly as it appears on the requisition form.
                </p>

                {/* Search bar */}
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <ScanLine className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                            placeholder="e.g. DUR-2023-0812"
                            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200
                         rounded-lg bg-white text-gray-800 placeholder-gray-400
                         focus:outline-none focus:ring-2 focus:ring-blue-500
                         focus:border-transparent transition-all font-mono"
                        />
                    </div>
                    <button
                        onClick={handleSearch}
                        disabled={searching || !searchInput.trim()}
                        className="flex items-center gap-2 px-5 py-2.5 bg-blue-600
                       hover:bg-blue-700 text-white text-sm font-semibold
                       rounded-lg transition-all active:scale-95
                       disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Search className="w-4 h-4" />
                        {searching ? "Searching..." : "Search"}
                    </button>
                </div>

                {/* Hint */}
                <p className="text-xs text-gray-400 mt-2">
                    💡 Try: <span
                    className="font-mono text-blue-600 cursor-pointer hover:underline"
                    onClick={() => setSearchInput("DUR-2023-0812")}
                >
            DUR-2023-0812
          </span>
                    {" "}or{" "}
                    <span
                        className="font-mono text-blue-600 cursor-pointer hover:underline"
                        onClick={() => setSearchInput("DUR-2023-0901")}
                    >
            DUR-2023-0901
          </span>
                </p>
            </div>

            {/* ── Results Panel (split layout) ── */}
            {searchResult && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                    {/* Left — Verification Details */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-5">
                        {/* Match badge */}
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                                Verification Details
                            </h2>
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs
                               font-bold rounded-full">
                MATCH FOUND
              </span>
                        </div>

                        {/* Patient info grid */}
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { label: "PATIENT NAME",       value: searchResult.patientName },
                                { label: "AGE | GENDER",        value: `${searchResult.age}Y / ${searchResult.gender}` },
                                { label: "TEST PROFILE",        value: searchResult.testProfile },
                                { label: "COLLECTION DATE",     value: `${searchResult.collectionDate} | ${searchResult.collectionTime}` },
                                { label: "TUBE TYPE",           value: searchResult.tubeType },
                                { label: "ORDERING PHYSICIAN",  value: searchResult.orderingPhysician },
                            ].map(({ label, value }) => (
                                <div key={label} className={label === "TEST PROFILE" ? "col-span-2" : ""}>
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">
                                        {label}
                                    </p>
                                    {label === "TUBE TYPE" ? (
                                        <div className="flex items-center gap-2">
                                            <div className={cn(
                                                "w-3 h-3 rounded-full",
                                                TUBE_COLOR[searchResult.tubeColor] ?? "bg-gray-400"
                                            )} />
                                            <p className="text-sm text-gray-800">{value}</p>
                                        </div>
                                    ) : label === "ORDERING PHYSICIAN" ? (
                                        <p className="text-sm font-semibold text-blue-600">{value}</p>
                                    ) : (
                                        <p className="text-sm text-gray-800 font-medium">{value}</p>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Pre-print checklist */}
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-amber-600">⚠️</span>
                                <p className="text-xs font-bold text-amber-800">
                                    Pre-reprint Checklist
                                </p>
                            </div>
                            <ul className="space-y-1.5">
                                {MOCK_PRE_PRINT_CHECKLIST.map((item, i) => (
                                    <li key={i} className="flex items-start gap-2 text-xs text-amber-800">
                                        <span className="text-amber-500 mt-0.5">•</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Barcode visual */}
                        <BarcodeVisual value={searchResult.barcode} />

                        {/* Print Settings */}
                        <div className="flex items-center justify-between bg-gray-50
                            rounded-lg px-4 py-3">
                            <div className="flex items-center gap-2">
                                <Printer className="w-4 h-4 text-gray-500" />
                                <Settings className="w-3.5 h-3.5 text-gray-400" />
                                <div>
                                    <p className="text-xs font-semibold text-gray-700">
                                        Print Settings
                                    </p>
                                    <p className="text-[10px] text-gray-400">
                                        Default: 50mm x 30mm Thermal Sticker
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="text-xs text-blue-600 hover:underline font-medium">
                                    Change Size
                                </button>
                                <button className="flex items-center gap-1 text-xs text-gray-500
                                   hover:text-gray-700">
                                    <AlignCenter className="w-3 h-3" />
                                    Align Head
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right — Label Preview */}
                    <LabelPreview result={searchResult} />
                </div>
            )}

            {/* Not found state */}
            {notFound && (
                <div className="bg-white rounded-xl border border-red-200 p-8 text-center">
                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center
                          justify-center mx-auto mb-3">
                        <X className="w-6 h-6 text-red-500" />
                    </div>
                    <p className="text-sm font-semibold text-gray-800">
                        Sample ID not found
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                        Please verify the ID and try again
                    </p>
                </div>
            )}

            {/* Empty state */}
            {!searchResult && !notFound && (
                <div className="bg-white rounded-xl border border-dashed border-gray-200
                        p-12 text-center">
                    <ScanLine className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-400">
                        Enter or scan a Sample ID to load barcode details
                    </p>
                </div>
            )}

        </div>
    );
}
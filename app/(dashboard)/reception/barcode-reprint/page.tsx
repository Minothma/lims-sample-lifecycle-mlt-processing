// app/(dashboard)/reception/barcode-reprint/page.tsx
"use client";

import { useState } from "react";
import {
    Search, Printer, CheckCircle2,
    ScanLine, Settings, AlignCenter, X, RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
    MOCK_BARCODE_RESULTS,
    MOCK_PRE_PRINT_CHECKLIST,
    type BarcodeSearchResult,
} from "@/mock/barcode.mock";

// ── Tube color → hex (for print/download window) ──────────────
const TUBE_COLOR_CLASS: Record<string, string> = {
    lavender: "bg-purple-300",
    purple:   "bg-purple-500",
    red:      "bg-red-500",
    gold:     "bg-yellow-400",
    blue:     "bg-blue-400",
    green:    "bg-green-500",
};

const TUBE_COLOR_HEX: Record<string, string> = {
    lavender: "#C4B5FD",
    purple:   "#A855F7",
    red:      "#EF4444",
    gold:     "#FBBF24",
    blue:     "#60A5FA",
    green:    "#22C55E",
};

// ── Barcode Visual (UI preview — decorative) ──────────────────
function BarcodeVisual({ value }: { value: string }) {
    const bars = Array.from({ length: 40 }, (_, i) => ({
        width: [1, 2, 1, 3, 1, 2, 2, 1][i % 8],
        dark:  i % 3 !== 0,
    }));

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <div className="flex items-end justify-center gap-px h-16 mb-2">
                {bars.map((bar, i) => (
                    <div
                        key={i}
                        className={cn("rounded-sm", bar.dark ? "bg-gray-900" : "bg-transparent")}
                        style={{ width: `${bar.width * 3}px`, height: `${50 + (i % 5) * 4}px` }}
                    />
                ))}
            </div>
            <p className="text-xs font-mono font-bold text-gray-700 tracking-widest">
                {value}
            </p>
        </div>
    );
}

// ── Build label HTML for JPG download ─────────────────────────
// Uses JsBarcode (real CODE128) + html2canvas (captures as JPG)
function buildBarcodeHTML(result: BarcodeSearchResult): string {
    const tubeHex   = TUBE_COLOR_HEX[result.tubeColor] || "#9CA3AF";
    const initials  = result.patientName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
    const genderAge = `${result.age}Y / ${result.gender.charAt(0)}`;

    return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Barcode — ${result.sampleId}</title>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/jsbarcode/3.11.6/JsBarcode.all.min.js"><\/script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"><\/script>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body {
                    font-family: Arial, sans-serif;
                    background: white;
                    display: inline-block;
                    padding: 0;
                }
                .label-card {
                    width: 340px;
                    background: white;
                    border: 2px solid #D1D5DB;
                    border-radius: 8px;
                    padding: 14px 16px;
                }
                /* ── Top row ── */
                .label-top {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 8px;
                }
                .hospital-name {
                    font-size: 9px;
                    font-weight: 800;
                    color: #2563EB;
                    text-transform: uppercase;
                    letter-spacing: 0.08em;
                }
                .tube-dot {
                    width: 14px; height: 14px;
                    border-radius: 50%;
                    background: ${tubeHex};
                    border: 1.5px solid rgba(0,0,0,0.15);
                }
                /* ── Real barcode ── */
                .barcode-wrap {
                    display: flex;
                    justify-content: center;
                    margin: 6px 0 2px;
                }
                #barcode { width: 100%; }
                /* ── Divider ── */
                .divider {
                    border: none;
                    border-top: 1px dashed #D1D5DB;
                    margin: 8px 0;
                }
                /* ── Patient row ── */
                .patient-row {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 6px;
                }
                .avatar {
                    width: 28px; height: 28px;
                    border-radius: 50%;
                    background: #3B82F6;
                    color: white;
                    font-size: 9px;
                    font-weight: 800;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }
                .patient-name {
                    font-size: 11px;
                    font-weight: 700;
                    color: #111827;
                }
                .patient-sub {
                    font-size: 8px;
                    color: #9CA3AF;
                    margin-top: 1px;
                }
                /* ── Detail rows ── */
                .detail-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-top: 4px;
                }
                .detail-label {
                    font-size: 7px; color: #9CA3AF;
                    text-transform: uppercase; letter-spacing: 0.05em;
                }
                .detail-value { font-size: 9px; font-weight: 600; color: #374151; }
                /* ── Tube badge ── */
                .tube-row {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    margin-top: 4px;
                }
                .tube-circle {
                    width: 10px; height: 10px;
                    border-radius: 50%;
                    background: ${tubeHex};
                    border: 1px solid rgba(0,0,0,0.1);
                }
                /* ── Footer ── */
                .label-footer {
                    margin-top: 8px; padding-top: 6px;
                    border-top: 1px solid #F3F4F6;
                    display: flex; justify-content: space-between; align-items: center;
                }
                .footer-left { font-size: 7px; color: #9CA3AF; }
                .reprint-badge { font-size: 7px; font-weight: 700; color: #D97706; }
                .original-badge { font-size: 7px; color: #9CA3AF; }
            </style>
        </head>
        <body>
            <div class="label-card" id="label-card">

                <div class="label-top">
                    <span class="hospital-name">Durdans Hospital LIMS</span>
                    <div class="tube-dot"></div>
                </div>

                <!-- Real CODE128 barcode via JsBarcode -->
                <div class="barcode-wrap">
                    <svg id="barcode"></svg>
                </div>

                <hr class="divider" />

                <!-- Patient info -->
                <div class="patient-row">
                    <div class="avatar">${initials}</div>
                    <div>
                        <div class="patient-name">${result.patientName}</div>
                        <div class="patient-sub">${genderAge} &nbsp;|&nbsp; ${result.testProfile}</div>
                    </div>
                </div>

                <div class="detail-row">
                    <span class="detail-label">Collection Date</span>
                    <span class="detail-value">${result.collectionDate} &nbsp; ${result.collectionTime}</span>
                </div>

                <div class="tube-row">
                    <span class="detail-label">Tube Type</span>
                    <div class="tube-circle"></div>
                    <span class="detail-value">${result.tubeType}</span>
                </div>

                <div class="detail-row">
                    <span class="detail-label">Physician</span>
                    <span class="detail-value">${result.orderingPhysician}</span>
                </div>

                <div class="label-footer">
                    <span class="footer-left">Durdans Hospital LIMS</span>
                    ${result.lastPrinted
        ? `<span class="reprint-badge">REPRINT — Last: ${result.lastPrinted}</span>`
        : `<span class="original-badge">Original Print</span>`
    }
                </div>

            </div>

            <script>
                // Step 1 — render real scannable CODE128 barcode
                JsBarcode("#barcode", "${result.sampleId}", {
                    format:       "CODE128",
                    width:        2.4,
                    height:       55,
                    displayValue: true,
                    fontSize:     11,
                    margin:       6,
                    background:   "#ffffff",
                    lineColor:    "#000000",
                    textAlign:    "center",
                    textPosition: "bottom",
                    fontOptions:  "bold",
                });

                // Step 2 — capture at 4x resolution and download as JPG
                window.onload = function() {
                    setTimeout(function() {
                        html2canvas(document.getElementById("label-card"), {
                            scale:           4,
                            backgroundColor: "#ffffff",
                            useCORS:         true,
                            logging:         false,
                        }).then(function(canvas) {
                            var link      = document.createElement("a");
                            link.download = "barcode-${result.sampleId}.jpg";
                            link.href     = canvas.toDataURL("image/jpeg", 1.0);
                            link.click();
                            setTimeout(function() { window.close(); }, 600);
                        });
                    }, 400);
                };
            <\/script>
        </body>
        </html>
    `;
}

// ── Label Digital Twin (UI preview card) ─────────────────────
function LabelPreview({
                          result,
                          onReprint,
                          reprinting,
                      }: {
    result:     BarcodeSearchResult;
    onReprint:  () => void;
    reprinting: boolean;
}) {
    return (
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3 text-center">
                Label Digital Twin
            </p>

            {/* Mini label card preview */}
            <div className="bg-white border-2 border-gray-300 rounded-lg p-3 mb-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] font-bold text-blue-600 uppercase tracking-wider">
                        DURDANS HOSPITAL
                    </span>
                    <span className="text-[9px] font-mono text-gray-600">
                        ID: {result.sampleId}
                    </span>
                </div>

                {/* Mini decorative barcode */}
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
                        <p className="text-gray-700 font-semibold">{result.patientName}</p>
                        <p className="text-gray-500">{result.age}Y / {result.gender.charAt(0)}</p>
                    </div>
                    <div className="text-right">
                        <div className={cn(
                            "inline-block w-3 h-3 rounded-full mb-0.5",
                            TUBE_COLOR_CLASS[result.tubeColor] ?? "bg-gray-400"
                        )} />
                        <p className="text-gray-400 text-[8px]">{result.tubeType}</p>
                        <p className="text-gray-500">{result.collectionTime}</p>
                    </div>
                </div>
            </div>

            {/* ✅ REPRINT BARCODE → downloads as JPG */}
            <button
                onClick={onReprint}
                disabled={reprinting}
                className={cn(
                    "w-full flex items-center justify-center gap-2 py-2.5",
                    "text-sm font-semibold rounded-lg transition-all active:scale-95",
                    reprinting
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                )}
            >
                {reprinting ? (
                    <><RefreshCw className="w-4 h-4 animate-spin" /> Downloading...</>
                ) : (
                    <><Printer className="w-4 h-4" /> REPRINT BARCODE</>
                )}
            </button>

            {result.lastPrinted && (
                <p className="text-[10px] text-center text-gray-400 mt-2">
                    🕐 Last printed: {result.lastPrinted}
                </p>
            )}

            {/* Printer status */}
            <div className="mt-3 flex items-center gap-2 bg-green-600 text-white
                            rounded-lg px-3 py-2 text-xs font-medium">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                Zebra ZT411 Connected
                <span className="ml-auto text-green-200 text-[10px]">Local printer</span>
            </div>
        </div>
    );
}

// ── Main Page ─────────────────────────────────────────────────
export default function BarcodeReprintPage() {
    const [searchInput,  setSearchInput]  = useState("");
    const [searchResult, setSearchResult] = useState<BarcodeSearchResult | null>(null);
    const [notFound,     setNotFound]     = useState(false);
    const [searching,    setSearching]    = useState(false);
    const [reprinting,   setReprinting]   = useState(false);

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

    // ── Reprint = Download as JPG ─────────────────────────────
    const handleReprint = async () => {
        if (!searchResult) return;
        setReprinting(true);

        const dlWindow = window.open("", "_blank", "width=420,height=360");
        if (!dlWindow) {
            toast.error("Popup blocked", {
                description: "Please allow popups for this site.",
            });
            setReprinting(false);
            return;
        }

        dlWindow.document.write(buildBarcodeHTML(searchResult));
        dlWindow.document.close();

        await new Promise((r) => setTimeout(r, 1500));

        toast.success("Barcode downloaded as JPG", {
            description: `barcode-${searchResult.sampleId}.jpg saved`,
        });
        setReprinting(false);
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
                    Scan or type the Sample ID exactly as it appears on the requisition form.
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
                            placeholder="e.g. S-90231"
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
            </div>

            {/* ── Results Panel (split layout) ── */}
            {searchResult && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                    {/* Left — Verification Details */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-5">

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
                                { label: "PATIENT NAME",      value: searchResult.patientName },
                                { label: "AGE | GENDER",      value: `${searchResult.age}Y / ${searchResult.gender}` },
                                { label: "TEST PROFILE",      value: searchResult.testProfile },
                                { label: "COLLECTION DATE",   value: `${searchResult.collectionDate} | ${searchResult.collectionTime}` },
                                { label: "TUBE TYPE",         value: searchResult.tubeType },
                                { label: "ORDERING PHYSICIAN",value: searchResult.orderingPhysician },
                            ].map(({ label, value }) => (
                                <div key={label} className={label === "TEST PROFILE" ? "col-span-2" : ""}>
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">
                                        {label}
                                    </p>
                                    {label === "TUBE TYPE" ? (
                                        <div className="flex items-center gap-2">
                                            <div className={cn(
                                                "w-3 h-3 rounded-full",
                                                TUBE_COLOR_CLASS[searchResult.tubeColor] ?? "bg-gray-400"
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
                                <p className="text-xs font-bold text-amber-800">Pre-reprint Checklist</p>
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
                        <div className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3">
                            <div className="flex items-center gap-2">
                                <Printer className="w-4 h-4 text-gray-500" />
                                <Settings className="w-3.5 h-3.5 text-gray-400" />
                                <div>
                                    <p className="text-xs font-semibold text-gray-700">Print Settings</p>
                                    <p className="text-[10px] text-gray-400">Default: 50mm x 30mm Thermal Sticker</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="text-xs text-blue-600 hover:underline font-medium">
                                    Change Size
                                </button>
                                <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700">
                                    <AlignCenter className="w-3 h-3" />
                                    Align Head
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right — Label Preview + Reprint button */}
                    <LabelPreview
                        result={searchResult}
                        onReprint={handleReprint}
                        reprinting={reprinting}
                    />
                </div>
            )}

            {/* Not found state */}
            {notFound && (
                <div className="bg-white rounded-xl border border-red-200 p-8 text-center">
                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center
                                    justify-center mx-auto mb-3">
                        <X className="w-6 h-6 text-red-500" />
                    </div>
                    <p className="text-sm font-semibold text-gray-800">Sample ID not found</p>
                    <p className="text-xs text-gray-400 mt-1">Please verify the ID and try again</p>
                </div>
            )}

            {/* Empty state */}
            {!searchResult && !notFound && (
                <div className="bg-white rounded-xl border border-dashed border-gray-200 p-12 text-center">
                    <ScanLine className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-400">
                        Enter or scan a Sample ID to load barcode details
                    </p>
                </div>
            )}

        </div>
    );
}
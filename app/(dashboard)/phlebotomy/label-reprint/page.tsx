"use client";

// app/(dashboard)/phlebotomy/label-reprint/page.tsx
import { useState } from "react";
import { Printer, Search, ScanLine, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const MOCK_LABELS = [
    {
        id: "l1", sampleId: "S-90001", patientName: "Mohamed Shafi",
        pid: "DH-40281", testCodes: ["FBC", "CRP", "ESR"],
        tubeType: "EDTA Lavender", tubeColor: "bg-purple-300",
        collectedAt: "10:22 AM", printCount: 1,
    },
    {
        id: "l2", sampleId: "S-90002", patientName: "Anula Rathnayake",
        pid: "DH-38822", testCodes: ["Lipid Profile", "HbA1c"],
        tubeType: "SST Gold", tubeColor: "bg-yellow-400",
        collectedAt: "10:15 AM", printCount: 0,
    },
    {
        id: "l3", sampleId: "S-90004", patientName: "Kanthi Wijetunge",
        pid: "DH-40531", testCodes: ["Troponin I", "UAE"],
        tubeType: "SST Red", tubeColor: "bg-red-500",
        collectedAt: "09:45 AM", printCount: 2,
    },
    {
        id: "l4", sampleId: "S-90005", patientName: "Ruwan Jayawardena",
        pid: "DH-39021", testCodes: ["Blood Culture"],
        tubeType: "Heparin Green", tubeColor: "bg-green-500",
        collectedAt: "09:30 AM", printCount: 1,
    },
];

// ── Tailwind → hex (needed for print/download window) ─────────
const TUBE_COLOR_MAP: Record<string, string> = {
    "bg-purple-300": "#C4B5FD",
    "bg-yellow-400": "#FBBF24",
    "bg-red-500":    "#EF4444",
    "bg-green-500":  "#22C55E",
    "bg-blue-400":   "#60A5FA",
};

// ── Mini Barcode Preview (UI card only — decorative) ──────────
function MiniBarcodeLabel({
                              sampleId,
                              patientName,
                              tubeColor,
                          }: {
    sampleId:    string;
    patientName: string;
    tubeColor:   string;
}) {
    return (
        <div className="bg-white border-2 border-gray-300 rounded-lg p-2.5 w-48 shadow-sm">
            <div className="flex items-center justify-between mb-1.5">
                <span className="text-[8px] font-bold text-blue-600 uppercase tracking-wider">
                    DURDANS HOSPITAL
                </span>
                <div className={cn("w-2.5 h-2.5 rounded-full", tubeColor)} />
            </div>
            <div className="flex items-end gap-px h-6 mb-1">
                {Array.from({ length: 28 }, (_, i) => (
                    <div
                        key={i}
                        className={i % 3 !== 0 ? "bg-gray-900" : "bg-transparent"}
                        style={{ width: "2px", height: `${12 + (i % 5) * 2}px` }}
                    />
                ))}
            </div>
            <p className="text-[7px] font-mono text-center text-gray-600 mb-1">
                {sampleId}
            </p>
            <p className="text-[8px] font-semibold text-gray-800 truncate">
                {patientName}
            </p>
        </div>
    );
}

export default function LabelReprintPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [printingId,  setPrintingId]  = useState<string | null>(null);

    const filtered = MOCK_LABELS.filter((l) => {
        const q = searchQuery.toLowerCase();
        return (
            !q ||
            l.patientName.toLowerCase().includes(q) ||
            l.sampleId.toLowerCase().includes(q) ||
            l.pid.toLowerCase().includes(q)
        );
    });

    // ── Print Label = Download as JPG ─────────────────────────
    const handlePrint = async (id: string, sampleId: string) => {
        setPrintingId(id);

        const label = MOCK_LABELS.find((l) => l.id === id);
        if (!label) return;

        const tubeHex  = TUBE_COLOR_MAP[label.tubeColor] || "#9CA3AF";
        const testChips = label.testCodes
            .map(code => `<span class="test-chip">${code}</span>`)
            .join("");

        // Build label HTML — uses JsBarcode for real barcode
        // then html2canvas to capture and download as JPG
        const labelHTML = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Label ${label.sampleId}</title>
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
                    .barcode-wrap {
                        display: flex;
                        justify-content: center;
                        margin: 6px 0 2px;
                    }
                    #barcode { width: 100%; }
                    .divider {
                        border: none;
                        border-top: 1px dashed #D1D5DB;
                        margin: 8px 0;
                    }
                    .patient-name {
                        font-size: 12px;
                        font-weight: 700;
                        color: #111827;
                        margin-bottom: 4px;
                    }
                    .detail-row {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-top: 5px;
                    }
                    .detail-label {
                        font-size: 8px; color: #9CA3AF;
                        text-transform: uppercase; letter-spacing: 0.05em;
                    }
                    .detail-value { font-size: 9px; font-weight: 600; color: #374151; }
                    .tests-row { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 7px; }
                    .test-chip {
                        padding: 2px 7px;
                        background: #EFF6FF; color: #1D4ED8;
                        font-size: 8px; font-weight: 700; border-radius: 4px;
                    }
                    .label-footer {
                        margin-top: 8px; padding-top: 6px;
                        border-top: 1px solid #F3F4F6;
                        display: flex; justify-content: space-between; align-items: center;
                    }
                    .collected-at   { font-size: 8px; color: #9CA3AF; }
                    .reprint-badge  { font-size: 8px; font-weight: 700; color: #D97706; }
                    .original-badge { font-size: 8px; color: #9CA3AF; }
                </style>
            </head>
            <body>
                <div class="label-card" id="label-card">

                    <div class="label-top">
                        <span class="hospital-name">Durdans Hospital LIMS</span>
                        <div class="tube-dot"></div>
                    </div>

                    <!-- Real CODE128 barcode rendered by JsBarcode -->
                    <div class="barcode-wrap">
                        <svg id="barcode"></svg>
                    </div>

                    <hr class="divider" />

                    <div class="patient-name">${label.patientName}</div>

                    <div class="detail-row">
                        <span class="detail-label">Patient ID</span>
                        <span class="detail-value">${label.pid}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Tube Type</span>
                        <span class="detail-value">${label.tubeType}</span>
                    </div>

                    <div class="tests-row">${testChips}</div>

                    <div class="label-footer">
                        <span class="collected-at">Collected: ${label.collectedAt}</span>
                        ${label.printCount > 0
            ? `<span class="reprint-badge">REPRINT #${label.printCount + 1}</span>`
            : `<span class="original-badge">Original Print</span>`
        }
                    </div>

                </div>

                <script>
                    // Step 1 — generate real scannable barcode
                    JsBarcode("#barcode", "${label.sampleId}", {
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

                    // Step 2 — capture label as high-res JPG and download
                    window.onload = function() {
                        setTimeout(function() {
                            var card = document.getElementById("label-card");
                            html2canvas(card, {
                                scale:           4,
                                backgroundColor: "#ffffff",
                                useCORS:         true,
                                logging:         false,
                            }).then(function(canvas) {
                                var link      = document.createElement("a");
                                link.download = "label-${label.sampleId}.jpg";
                                link.href     = canvas.toDataURL("image/jpeg", 1.0);
                                link.click();
                                // Close window after download starts
                                setTimeout(function() { window.close(); }, 600);
                            });
                        }, 400);
                    };
                <\/script>
            </body>
            </html>
        `;

        // Open hidden window, render label, auto-download JPG
        const dlWindow = window.open("", "_blank", "width=400,height=300");
        if (!dlWindow) {
            toast.error("Popup blocked", {
                description: "Please allow popups for this site and try again.",
            });
            setPrintingId(null);
            return;
        }

        dlWindow.document.write(labelHTML);
        dlWindow.document.close();

        await new Promise((r) => setTimeout(r, 1500));

        toast.success("Label downloaded as JPG", {
            description: `label-${sampleId}.jpg saved to your downloads`,
        });

        setPrintingId(null);
    };

    return (
        <div className="space-y-5">

            {/* ── Header ── */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="page-header">Label Reprint</h1>
                    <p className="page-subtitle">
                        Reprint collection labels for today's samples
                    </p>
                </div>
                <div className="flex items-center gap-2 bg-green-50 border border-green-200
                                rounded-lg px-3 py-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-xs font-semibold text-green-700">
                        Zebra ZT411 — Connected
                    </span>
                </div>
            </div>

            {/* ── Search ── */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
                <div className="relative max-w-md">
                    <ScanLine className="absolute left-3 top-1/2 -translate-y-1/2
                                         w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by Patient Name, Sample ID or PID..."
                        className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200
                                   rounded-lg bg-white text-gray-800 placeholder-gray-400
                                   focus:outline-none focus:ring-2 focus:ring-blue-500
                                   focus:border-transparent transition-all"
                    />
                </div>
                <p className="text-xs text-gray-400 mt-2">
                    💡 Scan a barcode or type manually to find the sample
                </p>
            </div>

            {/* ── Label Cards Grid ── */}
            {filtered.length === 0 ? (
                <div className="bg-white rounded-lg border border-dashed border-gray-200
                                p-12 text-center">
                    <Search className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">No samples match your search</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filtered.map((label) => (
                        <div
                            key={label.id}
                            className="bg-white rounded-xl border border-gray-200
                                       shadow-sm overflow-hidden"
                        >
                            {/* Card header */}
                            <div className="px-5 py-3 bg-gray-50 border-b border-gray-100
                                            flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-bold text-gray-900">
                                        {label.patientName}
                                    </p>
                                    <p className="text-xs text-gray-400">{label.pid}</p>
                                </div>
                                {label.printCount > 0 && (
                                    <span className="px-2 py-0.5 bg-amber-100 text-amber-700
                                                     text-[10px] font-bold rounded-full">
                                        Reprinted {label.printCount}×
                                    </span>
                                )}
                            </div>

                            {/* Card body */}
                            <div className="p-5 flex items-start gap-5">

                                <MiniBarcodeLabel
                                    sampleId={label.sampleId}
                                    patientName={label.patientName}
                                    tubeColor={label.tubeColor}
                                />

                                <div className="flex-1 space-y-2.5">
                                    {[
                                        { label: "Sample ID", value: label.sampleId },
                                        { label: "Tube Type", value: label.tubeType },
                                        { label: "Collected", value: label.collectedAt },
                                    ].map(({ label: lbl, value }) => (
                                        <div key={lbl}>
                                            <p className="text-[9px] font-bold uppercase
                                                           tracking-wider text-gray-400">
                                                {lbl}
                                            </p>
                                            <p className="text-xs font-semibold text-gray-800 mt-0.5">
                                                {value}
                                            </p>
                                        </div>
                                    ))}

                                    {/* Test codes */}
                                    <div>
                                        <p className="text-[9px] font-bold uppercase
                                                       tracking-wider text-gray-400 mb-1">
                                            Tests
                                        </p>
                                        <div className="flex flex-wrap gap-1">
                                            {label.testCodes.map((code) => (
                                                <span
                                                    key={code}
                                                    className="px-1.5 py-0.5 bg-blue-50 text-blue-700
                                                               text-[10px] font-semibold rounded"
                                                >
                                                    {code}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Print Label → downloads JPG */}
                                    <button
                                        onClick={() => handlePrint(label.id, label.sampleId)}
                                        disabled={printingId === label.id}
                                        className={cn(
                                            "flex items-center gap-1.5 px-4 py-2 rounded-lg",
                                            "text-xs font-semibold transition-all active:scale-95 mt-1",
                                            printingId === label.id
                                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                                        )}
                                    >
                                        {printingId === label.id ? (
                                            <>
                                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                                Downloading...
                                            </>
                                        ) : (
                                            <>
                                                <Printer className="w-3.5 h-3.5" />
                                                Print Label
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ── Pre-print checklist reminder ── */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
                <div className="flex items-start gap-2">
                    <span className="text-amber-500">⚠️</span>
                    <div className="text-xs text-amber-800 space-y-0.5">
                        <p className="font-bold">Before reprinting:</p>
                        <p>• Ensure the current unreadable label is discarded properly</p>
                        <p>• Verify patient identity with two identifiers before re-labeling</p>
                        <p>• Check printer ribbon and label stock levels</p>
                    </div>
                </div>
            </div>

        </div>
    );
}
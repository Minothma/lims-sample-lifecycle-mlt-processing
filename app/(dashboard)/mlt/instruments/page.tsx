"use client";

// app/(dashboard)/mlt/instruments/page.tsx
import { useState } from "react";
import { Microscope, Wifi, WifiOff, RefreshCw, Download, Loader2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const INITIAL_INSTRUMENTS = [
    {
        id: "i1", name: "Sysmex XN-1000",
        type: "Haematology Analyser",
        model: "XN-1000", serial: "SYS-2021-4421",
        status: "online" as const,
        lastSync: "2 mins ago",
        testsToday: 142,
        location: "Haematology Lab — Bench 2",
        qcStatus: "PASS",
    },
    {
        id: "i2", name: "Cobas C311",
        type: "Clinical Chemistry Analyser",
        model: "C311", serial: "COB-2020-8812",
        status: "online" as const,
        lastSync: "5 mins ago",
        testsToday: 98,
        location: "Biochemistry Lab — Bench 1",
        qcStatus: "PASS",
    },
    {
        id: "i3", name: "BioFire RP2.1",
        type: "Molecular Diagnostics",
        model: "FilmArray RP2.1", serial: "BIO-2022-3301",
        status: "offline" as const,
        lastSync: "1 hr ago",
        testsToday: 0,
        location: "Microbiology Lab — Room 3",
        qcStatus: "N/A",
    },
    {
        id: "i4", name: "Cobas e411",
        type: "Immunoassay Analyser",
        model: "e411", serial: "COB-2019-5521",
        status: "busy" as const,
        lastSync: "1 min ago",
        testsToday: 64,
        location: "Immunology Lab — Bench 3",
        qcStatus: "WARN",
    },
];

// Mock import result counts per instrument
const IMPORT_COUNTS: Record<string, number> = {
    i1: 12,
    i2: 8,
    i3: 0,
    i4: 5,
};

const STATUS_CONFIG = {
    online:  { label: "ONLINE",  dot: "bg-green-500 animate-pulse", badge: "bg-green-100 text-green-700" },
    offline: { label: "OFFLINE", dot: "bg-red-500",                 badge: "bg-red-100 text-red-700" },
    busy:    { label: "BUSY",    dot: "bg-amber-500",               badge: "bg-amber-100 text-amber-700" },
};

export default function InstrumentsPage() {
    const [instruments,    setInstruments]    = useState(INITIAL_INSTRUMENTS);
    const [syncing,        setSyncing]        = useState<Record<string, boolean>>({});
    const [importing,      setImporting]      = useState<Record<string, boolean>>({});
    const [justSynced,     setJustSynced]     = useState<Record<string, boolean>>({});
    const [justImported,   setJustImported]   = useState<Record<string, number | null>>({});
    const [reconnecting,   setReconnecting]   = useState<Record<string, boolean>>({});
    const [refreshing,     setRefreshing]     = useState(false);

    const online  = instruments.filter((i) => i.status === "online").length;
    const offline = instruments.filter((i) => i.status === "offline").length;
    const busy    = instruments.filter((i) => i.status === "busy").length;

    // ── Sync Now ─────────────────────────────────────────────────
    const handleSync = async (id: string, name: string) => {
        setSyncing((prev) => ({ ...prev, [id]: true }));
        setJustSynced((prev) => ({ ...prev, [id]: false }));

        await new Promise((r) => setTimeout(r, 1500));

        // Update last sync time
        setInstruments((prev) =>
            prev.map((inst) =>
                inst.id === id ? { ...inst, lastSync: "Just now" } : inst
            )
        );

        setSyncing((prev)    => ({ ...prev, [id]: false }));
        setJustSynced((prev) => ({ ...prev, [id]: true }));

        toast.success(`${name} synced successfully`, {
            description: "Last sync updated to just now",
        });

        // Reset synced badge after 5 seconds
        setTimeout(() => setJustSynced((prev) => ({ ...prev, [id]: false })), 5000);
    };

    // ── Import Results ────────────────────────────────────────────
    const handleImport = async (id: string, name: string) => {
        setImporting((prev)     => ({ ...prev, [id]: true }));
        setJustImported((prev)  => ({ ...prev, [id]: null }));

        await new Promise((r) => setTimeout(r, 2000));

        const count = IMPORT_COUNTS[id] ?? 0;

        // Update tests today count
        setInstruments((prev) =>
            prev.map((inst) =>
                inst.id === id
                    ? { ...inst, testsToday: inst.testsToday + count }
                    : inst
            )
        );

        setImporting((prev)    => ({ ...prev, [id]: false }));
        setJustImported((prev) => ({ ...prev, [id]: count }));

        toast.success(`Results imported from ${name}`, {
            description: `${count} pending result${count !== 1 ? "s" : ""} imported into LIMS`,
        });

        // Reset imported badge after 6 seconds
        setTimeout(() => setJustImported((prev) => ({ ...prev, [id]: null })), 6000);
    };

    // ── Reconnect ─────────────────────────────────────────────────
    const handleReconnect = async (id: string, name: string) => {
        setReconnecting((prev) => ({ ...prev, [id]: true }));

        await new Promise((r) => setTimeout(r, 2500));

        setReconnecting((prev) => ({ ...prev, [id]: false }));

        // Simulate failed reconnection (offline instrument stays offline)
        toast.error(`Could not reconnect to ${name}`, {
            description: "Device unreachable. Please check network cable and power.",
        });
    };

    // ── Refresh All ───────────────────────────────────────────────
    const handleRefreshAll = async () => {
        setRefreshing(true);
        await new Promise((r) => setTimeout(r, 1200));
        setRefreshing(false);
        toast.success("All instrument statuses refreshed");
    };

    return (
        <div className="space-y-5">

            {/* ── Header ── */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="page-header">Instruments</h1>
                    <p className="page-subtitle">
                        Laboratory equipment status and connectivity monitoring
                    </p>
                </div>
                <button
                    onClick={handleRefreshAll}
                    disabled={refreshing}
                    className="flex items-center gap-1.5 px-3 py-2 border border-gray-200
                     rounded-lg bg-white text-sm text-gray-600
                     hover:bg-gray-50 transition-all disabled:opacity-50"
                >
                    {refreshing
                        ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        : <RefreshCw className="w-3.5 h-3.5" />
                    }
                    {refreshing ? "Refreshing..." : "Refresh Status"}
                </button>
            </div>

            {/* ── Summary Bar ── */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    { label: "Online",  value: online,  color: "text-green-600 bg-green-50 border-green-200" },
                    { label: "Busy",    value: busy,    color: "text-amber-600 bg-amber-50 border-amber-200" },
                    { label: "Offline", value: offline, color: "text-red-600 bg-red-50 border-red-200" },
                ].map(({ label, value, color }) => (
                    <div key={label} className={cn("rounded-lg border p-4 text-center", color)}>
                        <p className="text-2xl font-bold">{value}</p>
                        <p className="text-xs font-semibold uppercase tracking-wider mt-0.5">
                            {label}
                        </p>
                    </div>
                ))}
            </div>

            {/* ── Instrument Cards ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {instruments.map((inst) => {
                    const cfg          = STATUS_CONFIG[inst.status];
                    const isSyncing    = syncing[inst.id]    ?? false;
                    const isImporting  = importing[inst.id]  ?? false;
                    const isReconnect  = reconnecting[inst.id] ?? false;
                    const syncedDone   = justSynced[inst.id]  ?? false;
                    const importedCount = justImported[inst.id] ?? null;

                    return (
                        <div
                            key={inst.id}
                            className={cn(
                                "bg-white rounded-xl border shadow-sm overflow-hidden",
                                inst.status === "offline" ? "border-red-200" : "border-gray-200"
                            )}
                        >
                            {/* Card Header */}
                            <div className={cn(
                                "px-5 py-3 flex items-center justify-between border-b",
                                inst.status === "offline"
                                    ? "bg-red-50 border-red-100"
                                    : "bg-gray-50 border-gray-100"
                            )}>
                                <div className="flex items-center gap-2.5">
                                    <Microscope className={cn(
                                        "w-4 h-4",
                                        inst.status === "offline" ? "text-red-400" : "text-blue-500"
                                    )} />
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">{inst.name}</p>
                                        <p className="text-[10px] text-gray-400">{inst.type}</p>
                                    </div>
                                </div>
                                <span className={cn(
                                    "flex items-center gap-1.5 px-2.5 py-1 rounded-full",
                                    "text-[10px] font-bold", cfg.badge
                                )}>
                                    <span className={cn("w-1.5 h-1.5 rounded-full", cfg.dot)} />
                                    {cfg.label}
                                </span>
                            </div>

                            {/* Card Body */}
                            <div className="p-5 grid grid-cols-2 gap-4">
                                {[
                                    { label: "Model",       value: inst.model },
                                    { label: "Serial No.",  value: inst.serial },
                                    { label: "Location",    value: inst.location },
                                    { label: "Last Sync",   value: inst.lastSync },
                                    { label: "Tests Today", value: inst.testsToday.toString() },
                                    { label: "QC Status",   value: inst.qcStatus },
                                ].map(({ label, value }) => (
                                    <div key={label}>
                                        <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">
                                            {label}
                                        </p>
                                        <p className={cn(
                                            "text-xs font-semibold mt-0.5",
                                            label === "QC Status" && value === "FAIL" ? "text-red-600"   :
                                                label === "QC Status" && value === "WARN" ? "text-amber-600" :
                                                    label === "QC Status" && value === "PASS" ? "text-green-600" :
                                                        label === "Last Sync"  && value === "Just now" ? "text-green-600" :
                                                            "text-gray-800"
                                        )}>
                                            {value}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {/* ── Import result count badge ── */}
                            {importedCount !== null && (
                                <div className="mx-5 mb-3 flex items-center gap-2 px-3 py-2
                                        bg-blue-50 border border-blue-200 rounded-lg">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                                    <p className="text-xs text-blue-700 font-medium">
                                        {importedCount} result{importedCount !== 1 ? "s" : ""} imported
                                        into LIMS successfully
                                    </p>
                                </div>
                            )}

                            {/* Action footer */}
                            <div className="px-5 py-3 border-t border-gray-100 flex gap-2">
                                {inst.status === "online" || inst.status === "busy" ? (
                                    <>
                                        {/* Sync Now */}
                                        <button
                                            onClick={() => handleSync(inst.id, inst.name)}
                                            disabled={isSyncing}
                                            className={cn(
                                                "flex items-center gap-1.5 px-3 py-1.5 text-xs",
                                                "font-semibold rounded-md transition-all",
                                                syncedDone
                                                    ? "bg-green-600 hover:bg-green-700 text-white"
                                                    : "bg-blue-600 hover:bg-blue-700 text-white",
                                                isSyncing && "opacity-70 cursor-wait"
                                            )}
                                        >
                                            {isSyncing
                                                ? <Loader2 className="w-3 h-3 animate-spin" />
                                                : syncedDone
                                                    ? <CheckCircle2 className="w-3 h-3" />
                                                    : <Wifi className="w-3 h-3" />
                                            }
                                            {isSyncing ? "Syncing..." : syncedDone ? "Synced!" : "Sync Now"}
                                        </button>

                                        {/* Import Results */}
                                        <button
                                            onClick={() => handleImport(inst.id, inst.name)}
                                            disabled={isImporting}
                                            className={cn(
                                                "flex items-center gap-1.5 px-3 py-1.5 text-xs",
                                                "font-semibold border rounded-md transition-all",
                                                importedCount !== null
                                                    ? "border-green-200 bg-green-50 text-green-700"
                                                    : "border-gray-200 text-gray-600 hover:bg-gray-50",
                                                isImporting && "opacity-70 cursor-wait"
                                            )}
                                        >
                                            {isImporting
                                                ? <Loader2 className="w-3 h-3 animate-spin" />
                                                : importedCount !== null
                                                    ? <CheckCircle2 className="w-3 h-3" />
                                                    : <Download className="w-3 h-3" />
                                            }
                                            {isImporting
                                                ? "Importing..."
                                                : importedCount !== null
                                                    ? `${importedCount} Imported`
                                                    : "Import Results"
                                            }
                                        </button>
                                    </>
                                ) : (
                                    /* Reconnect */
                                    <button
                                        onClick={() => handleReconnect(inst.id, inst.name)}
                                        disabled={isReconnect}
                                        className={cn(
                                            "flex items-center gap-1.5 px-3 py-1.5 text-xs",
                                            "font-semibold border border-red-200 text-red-600",
                                            "hover:bg-red-50 rounded-md transition-all",
                                            isReconnect && "opacity-70 cursor-wait"
                                        )}
                                    >
                                        {isReconnect
                                            ? <Loader2 className="w-3 h-3 animate-spin" />
                                            : <WifiOff className="w-3 h-3" />
                                        }
                                        {isReconnect ? "Connecting..." : "Reconnect"}
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
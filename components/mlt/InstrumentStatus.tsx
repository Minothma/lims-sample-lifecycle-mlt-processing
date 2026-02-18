// components/mlt/InstrumentStatus.tsx
"use client";

import { cn } from "@/lib/utils";
import { Microscope } from "lucide-react";

interface Instrument {
    name:     string;
    status:   string;
    lastSync: string;
}

interface InstrumentStatusProps {
    instruments: Instrument[];
}

export default function InstrumentStatus({ instruments }: InstrumentStatusProps) {
    return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
                <Microscope className="w-4 h-4 text-gray-400" />
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Instruments
                </p>
            </div>
            <div className="divide-y divide-gray-100">
                {instruments.map((inst) => (
                    <div key={inst.name} className="px-4 py-3">
                        <div className="flex items-center justify-between mb-0.5">
                            <p className="text-xs font-semibold text-gray-800">{inst.name}</p>
                            <span className={cn(
                                "flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full",
                                inst.status === "online"
                                    ? "bg-green-100 text-green-700"
                                    : inst.status === "busy"
                                        ? "bg-amber-100 text-amber-700"
                                        : "bg-red-100 text-red-700"
                            )}>
                <span className={cn(
                    "w-1.5 h-1.5 rounded-full",
                    inst.status === "online"  ? "bg-green-500 animate-pulse" :
                        inst.status === "busy"    ? "bg-amber-500" :
                            "bg-red-500"
                )} />
                                {inst.status.toUpperCase()}
              </span>
                        </div>
                        <p className="text-[10px] text-gray-400">
                            Last sync: {inst.lastSync}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
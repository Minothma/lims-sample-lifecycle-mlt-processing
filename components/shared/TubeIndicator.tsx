// components/shared/TubeIndicator.tsx
"use client";

import { cn } from "@/lib/utils";
import type { TubeType } from "@/types/sample.types";

interface TubeIndicatorProps {
    types: TubeType[];
}

const tubeConfig: Record<TubeType, { color: string; abbr: string; label: string }> = {
    EDTA_PURPLE:   { color: "bg-purple-500",  abbr: "EP", label: "EDTA Purple" },
    EDTA_LAVENDER: { color: "bg-purple-300",  abbr: "EL", label: "EDTA Lavender" },
    SST_GOLD:      { color: "bg-yellow-400",  abbr: "GD", label: "SST Gold" },
    SST_RED:       { color: "bg-red-500",     abbr: "RD", label: "SST Red" },
    CITRATE_BLUE:  { color: "bg-blue-400",    abbr: "BL", label: "Citrate Blue" },
    HEPARIN_GREEN: { color: "bg-green-500",   abbr: "GR", label: "Heparin Green" },
    URINE_YELLOW:  { color: "bg-yellow-300",  abbr: "UR", label: "Urine" },
    OTHER:         { color: "bg-gray-400",    abbr: "OT", label: "Other" },
};

export default function TubeIndicator({ types }: TubeIndicatorProps) {
    return (
        <div className="flex items-center gap-1">
            {types.map((type, idx) => {
                const cfg = tubeConfig[type] ?? tubeConfig.OTHER;
                return (
                    <div
                        key={idx}
                        title={cfg.label}
                        className={cn(
                            "w-6 h-6 rounded-full flex items-center justify-center text-white text-[9px] font-bold",
                            cfg.color
                        )}
                    >
                        {cfg.abbr}
                    </div>
                );
            })}
        </div>
    );
}
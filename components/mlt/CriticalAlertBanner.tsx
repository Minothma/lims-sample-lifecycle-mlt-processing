"use client";

// components/mlt/CriticalAlertBanner.tsx
import { AlertTriangle } from "lucide-react";

interface CriticalAlertBannerProps {
    parameterName: string;
    value:         string;
    unit:          string;
}

export default function CriticalAlertBanner({
                                                parameterName,
                                                value,
                                                unit,
                                            }: CriticalAlertBannerProps) {
    return (
        <div className="flex items-start gap-3 bg-red-50 border border-red-300
                    rounded-lg px-4 py-3">
            <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
                <p className="text-xs font-bold text-red-800">
                    🔴 Mandatory Critical Result Reporting Protocol
                </p>
                <p className="text-xs text-red-600 mt-0.5">
                    <span className="font-semibold">{parameterName}</span> value of{" "}
                    <span className="font-bold font-mono">
            {value} {unit}
          </span>{" "}
                    exceeds critical threshold. Physician notification required before
                    submission.
                </p>
            </div>
        </div>
    );
}
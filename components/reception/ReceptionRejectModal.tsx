// components/reception/ReceptionRejectModal.tsx
"use client";

import { useState } from "react";
import { AlertTriangle, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { Sample } from "@/types/sample.types";

interface ReceptionRejectModalProps {
    open: boolean;
    onClose: () => void;
    sample: Sample;
}

const REJECTION_REASONS = [
    "Labeling Error / Misidentified",
    "Insufficient Sample Volume",
    "Hemolyzed Sample",
    "Clotted Sample",
    "Wrong Tube Type Used",
    "Sample Leaked / Contaminated",
    "Collection Time Exceeded Stability",
    "Incorrect Patient Details",
    "Missing Requisition Form",
    "Other",
];

export default function ReceptionRejectModal({
                                                 open,
                                                 onClose,
                                                 sample,
                                             }: ReceptionRejectModalProps) {
    const [reason,              setReason]              = useState("");
    const [labNotes,            setLabNotes]            = useState("");
    const [notifyPhlebotomy,    setNotifyPhlebotomy]    = useState(true);
    const [requestReCollection, setRequestReCollection] = useState(true);
    const [submitting,          setSubmitting]          = useState(false);

    if (!open) return null;

    const handleConfirm = async () => {
        if (!reason) {
            toast.error("Please select a rejection reason");
            return;
        }
        setSubmitting(true);
        await new Promise((r) => setTimeout(r, 800));
        toast.success(`Sample ${sample.sampleId} rejected at reception`, {
            description: reason,
        });
        setSubmitting(false);
        setReason("");
        setLabNotes("");
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md z-10
                      animate-in fade-in zoom-in-95 duration-200">

                {/* ── Header ── */}
                <div className="flex items-start gap-3 p-6 pb-4">
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center
                          justify-center flex-shrink-0">
                        <AlertTriangle className="w-5 h-5 text-amber-600" />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-lg font-bold text-gray-900">Reject Sample</h2>
                        <p className="text-sm text-gray-500 mt-0.5">
                            SID: #{sample.sampleId} •{" "}
                            <span className="font-medium text-gray-700">
                Patient: {sample.patient.name}
              </span>
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* ── Body ── */}
                <div className="px-6 space-y-4">

                    {/* Rejection Reason */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider
                               text-gray-500 mb-1.5">
                            Rejection Reason <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg
                         bg-white text-gray-700 focus:outline-none focus:ring-2
                         focus:ring-amber-400 focus:border-transparent transition-all"
                        >
                            <option value="">Select a reason...</option>
                            {REJECTION_REASONS.map((r) => (
                                <option key={r} value={r}>{r}</option>
                            ))}
                        </select>
                    </div>

                    {/* Internal Lab Notes */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider
                               text-gray-500 mb-1.5">
                            Internal Lab Notes
                        </label>
                        <textarea
                            value={labNotes}
                            onChange={(e) => setLabNotes(e.target.value)}
                            rows={3}
                            placeholder="Add specific clinical observations or instructions for the phlebotomy team..."
                            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg
                         bg-white text-gray-700 placeholder-gray-400 resize-none
                         focus:outline-none focus:ring-2 focus:ring-amber-400
                         focus:border-transparent transition-all"
                        />
                    </div>

                    {/* Follow-up Actions */}
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                            Follow-up Actions
                        </p>

                        <div className="space-y-2">
                            {/* Notify Phlebotomy */}
                            <div className="flex items-center justify-between bg-gray-50
                              rounded-lg px-4 py-3">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center
                                  justify-center text-sm">
                                        🔔
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-800">
                                            Notify Phlebotomy
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            Sends instant alert to the drawing station
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setNotifyPhlebotomy(!notifyPhlebotomy)}
                                    className={cn(
                                        "relative w-10 h-5 rounded-full transition-all duration-200",
                                        notifyPhlebotomy ? "bg-blue-600" : "bg-gray-300"
                                    )}
                                >
                  <span
                      className={cn(
                          "absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-200",
                          notifyPhlebotomy ? "left-5" : "left-0.5"
                      )}
                  />
                                </button>
                            </div>

                            {/* Request Re-collection */}
                            <div className="flex items-center justify-between bg-gray-50
                              rounded-lg px-4 py-3">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center
                                  justify-center text-sm">
                                        🔄
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-800">
                                            Request Re-collection
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            Automatically flag for front desk re-registration
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setRequestReCollection(!requestReCollection)}
                                    className={cn(
                                        "relative w-10 h-5 rounded-full transition-all duration-200",
                                        requestReCollection ? "bg-blue-600" : "bg-gray-300"
                                    )}
                                >
                  <span
                      className={cn(
                          "absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-200",
                          requestReCollection ? "left-5" : "left-0.5"
                      )}
                  />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Footer ── */}
                <div className="flex items-center justify-end gap-3 p-6 pt-4">
                    <button
                        onClick={onClose}
                        className="px-5 py-2 text-sm font-medium text-gray-600
                       hover:text-gray-900 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={submitting}
                        className={cn(
                            "flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold",
                            "bg-blue-600 hover:bg-blue-700 text-white transition-all",
                            "active:scale-95 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                        )}
                    >
                        ✓ {submitting ? "Confirming..." : "Confirm Rejection"}
                    </button>
                </div>

            </div>
        </div>
    );
}
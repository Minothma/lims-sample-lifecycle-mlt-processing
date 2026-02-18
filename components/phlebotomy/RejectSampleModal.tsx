// components/phlebotomy/RejectSampleModal.tsx
"use client";

import { useState } from "react";
import { AlertCircle, X, Ban } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Sample } from "@/types/sample.types";
import { toast } from "sonner";

interface RejectSampleModalProps {
    open: boolean;
    onClose: () => void;
    sample: Sample;
}

const REJECTION_REASONS = [
    "Insufficient Sample Volume",
    "Hemolyzed Sample",
    "Clotted Sample",
    "Wrong Tube Type",
    "Unlabeled / Mislabeled",
    "Sample Leaked / Contaminated",
    "Lipemic Sample",
    "Collection Time Exceeded",
    "Patient Refused",
    "Other",
];

export default function RejectSampleModal({
                                              open,
                                              onClose,
                                              sample,
                                          }: RejectSampleModalProps) {
    const [reason, setReason]           = useState("");
    const [comments, setComments]       = useState("");
    const [notifyFrontDesk, setNotify]  = useState(true);
    const [submitting, setSubmitting]   = useState(false);

    if (!open) return null;

    const handleSubmit = async () => {
        if (!reason) {
            toast.error("Please select a rejection reason");
            return;
        }
        setSubmitting(true);

        // TODO: replace with real API call
        await new Promise((r) => setTimeout(r, 800));

        toast.success(`Sample ${sample.sampleId} rejected`, {
            description: reason,
        });
        setSubmitting(false);
        setReason("");
        setComments("");
        onClose();
    };

    return (
        // Backdrop
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal Card */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md z-10
                      animate-in fade-in zoom-in-95 duration-200">

                {/* ── Header ── */}
                <div className="flex items-start gap-3 p-6 pb-4">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                        <AlertCircle className="w-5 h-5 text-red-600" />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-lg font-bold text-gray-900">Reject Sample</h2>
                        <p className="text-sm text-gray-500 mt-0.5">
                            SID: #{sample.sampleId} • Patient:{" "}
                            <span className="font-medium text-gray-700">
                {sample.patient.name}
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

                    {/* Reason for Rejection */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                            Reason for Rejection <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg
                         bg-white text-gray-700 focus:outline-none focus:ring-2
                         focus:ring-red-400 focus:border-transparent transition-all"
                        >
                            <option value="">Select a standardized reason</option>
                            {REJECTION_REASONS.map((r) => (
                                <option key={r} value={r}>{r}</option>
                            ))}
                        </select>
                    </div>

                    {/* Additional Comments */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                            Additional Comments
                        </label>
                        <textarea
                            value={comments}
                            onChange={(e) => setComments(e.target.value)}
                            rows={3}
                            placeholder="Provide specific details about the sample condition..."
                            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg
                         bg-white text-gray-700 placeholder-gray-400 resize-none
                         focus:outline-none focus:ring-2 focus:ring-red-400
                         focus:border-transparent transition-all"
                        />
                    </div>

                    {/* Notify Front Desk Toggle */}
                    <div className="flex items-center justify-between bg-blue-50 rounded-lg px-4 py-3">
                        <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center">
                                <span className="text-blue-600 text-sm">🔔</span>
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-800">
                                    Notify Front Desk
                                </p>
                                <p className="text-xs text-gray-500">
                                    Triggers immediate re-scheduling alert
                                </p>
                            </div>
                        </div>
                        {/* Toggle Switch */}
                        <button
                            onClick={() => setNotify(!notifyFrontDesk)}
                            className={cn(
                                "relative w-10 h-5 rounded-full transition-all duration-200",
                                notifyFrontDesk ? "bg-blue-600" : "bg-gray-300"
                            )}
                        >
              <span
                  className={cn(
                      "absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-200",
                      notifyFrontDesk ? "left-5" : "left-0.5"
                  )}
              />
                        </button>
                    </div>

                    {/* Warning Banner */}
                    <div className="flex gap-2.5 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
                        <span className="text-amber-500 text-sm mt-0.5">ℹ️</span>
                        <p className="text-xs text-amber-800">
                            Submitting this rejection will flag the order status as{" "}
                            <strong className="text-amber-900">'Re-collection Required'</strong>.
                            This action is recorded in the audit log.
                        </p>
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
                        onClick={handleSubmit}
                        disabled={submitting}
                        className={cn(
                            "flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold",
                            "bg-red-600 hover:bg-red-700 text-white transition-all",
                            "active:scale-95 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                        )}
                    >
                        <Ban className="w-4 h-4" />
                        {submitting ? "Submitting..." : "Submit Rejection"}
                    </button>
                </div>

            </div>
        </div>
    );
}
"use client";

// app/(dashboard)/mlt/qc-dashboard/page.tsx
import { BarChart3, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import StatCard from "@/components/shared/StatCard";

const QC_RUNS = [
    {
        id: "q1", testName: "FBC — Sysmex XN-1000",
        level: "Level 1", result: 5.2, target: 5.0,
        sd: 0.15, cv: "2.8%", status: "PASS",
        runAt: "08:00 AM", operator: "MLT User",
    },
    {
        id: "q2", testName: "Glucose — Cobas C311",
        level: "Level 2", result: 12.8, target: 10.0,
        sd: 0.45, cv: "4.5%", status: "FAIL",
        runAt: "08:15 AM", operator: "MLT User",
    },
    {
        id: "q3", testName: "HbA1c — Adams A1c HA-8180",
        level: "Level 1", result: 6.1, target: 6.0,
        sd: 0.10, cv: "1.6%", status: "PASS",
        runAt: "08:30 AM", operator: "MLT User",
    },
    {
        id: "q4", testName: "Troponin I — Cobas e411",
        level: "Level 2", result: 0.04, target: 0.04,
        sd: 0.002, cv: "5.0%", status: "WARN",
        runAt: "09:00 AM", operator: "MLT User",
    },
];

const STATUS_CONFIG = {
    PASS: { label: "PASS", className: "bg-green-100 text-green-700" },
    FAIL: { label: "FAIL", className: "bg-red-100 text-red-700" },
    WARN: { label: "WARN", className: "bg-amber-100 text-amber-700" },
};

export default function QCDashboardPage() {
    const passed  = QC_RUNS.filter((q) => q.status === "PASS").length;
    const failed  = QC_RUNS.filter((q) => q.status === "FAIL").length;
    const warning = QC_RUNS.filter((q) => q.status === "WARN").length;

    return (
        <div className="space-y-5">

            {/* ── Header ── */}
            <div>
                <h1 className="page-header">QC Dashboard</h1>
                <p className="page-subtitle">
                    Quality control runs and Levey-Jennings monitoring — Today
                </p>
            </div>

            {/* ── Stat Cards ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    label="Total QC Runs"
                    value={QC_RUNS.length}
                    icon={BarChart3}
                    color="blue"
                />
                <StatCard
                    label="Passed"
                    value={passed}
                    icon={CheckCircle2}
                    color="green"
                    badge={`${Math.round((passed / QC_RUNS.length) * 100)}% pass rate`}
                    badgeColor="green"
                />
                <StatCard
                    label="Warnings"
                    value={warning}
                    icon={AlertTriangle}
                    color="orange"
                />
                <StatCard
                    label="Failed"
                    value={failed}
                    icon={XCircle}
                    color="red"
                    badge={failed > 0 ? "Action required" : undefined}
                    badgeColor="red"
                />
            </div>

            {/* ── QC Runs Table ── */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 flex items-center
                        justify-between">
                    <h2 className="text-sm font-bold text-gray-800">
                        Today's QC Runs
                    </h2>
                    <span className="text-xs text-gray-400">
            Last updated: {new Date().toLocaleTimeString()}
          </span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                        <tr className="border-b border-gray-100 bg-gray-50/60">
                            {[
                                "Test / Instrument", "Level", "Result",
                                "Target", "SD", "CV%", "Status", "Run At",
                            ].map((col) => (
                                <th
                                    key={col}
                                    className="px-4 py-2.5 text-left text-[11px] font-semibold
                               uppercase tracking-wider text-gray-500"
                                >
                                    {col}
                                </th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {QC_RUNS.map((run) => {
                            const cfg = STATUS_CONFIG[run.status as keyof typeof STATUS_CONFIG];
                            const deviation = Math.abs(run.result - run.target);
                            const isOutOfRange = run.status === "FAIL";

                            return (
                                <tr
                                    key={run.id}
                                    className={`border-b border-gray-100 transition-colors ${
                                        isOutOfRange
                                            ? "bg-red-50/30 hover:bg-red-50/50"
                                            : "hover:bg-gray-50"
                                    }`}
                                >
                                    {/* Test Name */}
                                    <td className="px-4 py-3">
                                        <p className="text-sm font-semibold text-gray-900">
                                            {run.testName}
                                        </p>
                                        <p className="text-xs text-gray-400">{run.operator}</p>
                                    </td>

                                    {/* Level */}
                                    <td className="px-4 py-3">
                      <span className="text-xs font-medium bg-gray-100
                                       text-gray-600 px-2 py-0.5 rounded">
                        {run.level}
                      </span>
                                    </td>

                                    {/* Result */}
                                    <td className="px-4 py-3">
                      <span className={`text-sm font-bold font-mono ${
                          isOutOfRange ? "text-red-600" : "text-gray-800"
                      }`}>
                        {run.result}
                      </span>
                                    </td>

                                    {/* Target */}
                                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-600 font-mono">
                        {run.target}
                      </span>
                                    </td>

                                    {/* SD */}
                                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-600 font-mono">
                        ±{run.sd}
                      </span>
                                    </td>

                                    {/* CV */}
                                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-gray-700">
                        {run.cv}
                      </span>
                                    </td>

                                    {/* Status */}
                                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5
                                        rounded text-xs font-bold ${cfg.className}`}>
                        {cfg.label}
                      </span>
                                    </td>

                                    {/* Run At */}
                                    <td className="px-4 py-3">
                                        <span className="text-sm text-gray-500">{run.runAt}</span>
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>

                {/* Failed alert */}
                {failed > 0 && (
                    <div className="px-5 py-3 bg-red-50 border-t border-red-100
                          flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
                        <p className="text-xs text-red-700 font-medium">
                            {failed} QC run(s) failed today. Equipment recalibration may be
                            required before processing patient samples.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
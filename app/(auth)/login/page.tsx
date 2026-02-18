"use client";

// app/(auth)/login/page.tsx
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FlaskConical, Eye, EyeOff, Shield, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Mock credentials for testing each role
const MOCK_CREDENTIALS = [
    { email: "phlebotomist@durdans.lk",  password: "phlebotomy123", role: "PHLEBOTOMIST",     redirect: "/phlebotomy/worklist" },
    { email: "reception@durdans.lk",     password: "reception123",  role: "LAB_RECEPTIONIST", redirect: "/reception/accessioning" },
    { email: "mlt@durdans.lk",           password: "mlt123",        role: "MLT",              redirect: "/mlt/worklist" },
    { email: "admin@durdans.lk",         password: "admin123",      role: "BRANCH_ADMIN",     redirect: "/phlebotomy/worklist" },
];

export default function LoginPage() {
    const router = useRouter();

    const [email,       setEmail]       = useState("");
    const [password,    setPassword]    = useState("");
    const [showPass,    setShowPass]    = useState(false);
    const [loading,     setLoading]     = useState(false);
    const [error,       setError]       = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!email || !password) {
            setError("Please enter your email and password.");
            return;
        }

        setLoading(true);
        await new Promise((r) => setTimeout(r, 900));

        const match = MOCK_CREDENTIALS.find(
            (c) => c.email === email.trim() && c.password === password
        );

        if (!match) {
            setError("Invalid credentials. Please check your email and password.");
            setLoading(false);
            return;
        }

        toast.success(`Welcome back!`, {
            description: `Logged in as ${match.role.replace(/_/g, " ")}`,
        });

        setLoading(false);
        router.push(match.redirect);
    };

    const handleQuickLogin = async (cred: typeof MOCK_CREDENTIALS[0]) => {
        setEmail(cred.email);
        setPassword(cred.password);
        setError("");
        setLoading(true);
        await new Promise((r) => setTimeout(r, 700));
        toast.success(`Logged in as ${cred.role.replace(/_/g, " ")}`);
        setLoading(false);
        router.push(cred.redirect);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50
                    flex items-center justify-center p-4">

            {/* Background pattern */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100
                        rounded-full opacity-40 blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200
                        rounded-full opacity-30 blur-3xl" />
            </div>

            <div className="relative w-full max-w-md space-y-5">

                {/* ── Brand Header ── */}
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-14 h-14
                          bg-blue-600 rounded-2xl shadow-lg mb-4">
                        <FlaskConical className="w-7 h-7 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">DURDANS ERP</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Laboratory Management System
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                        Durdans Hospital • Colombo, Sri Lanka
                    </p>
                </div>

                {/* ── Login Card ── */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-xl p-8">

                    {/* Security badge */}
                    <div className="flex items-center justify-center gap-2 bg-green-50
                          border border-green-200 rounded-lg px-3 py-2 mb-6">
                        <Shield className="w-3.5 h-3.5 text-green-600" />
                        <span className="text-xs font-semibold text-green-700">
              Secured by OAuth 2.0 / Keycloak
            </span>
                    </div>

                    <h2 className="text-lg font-bold text-gray-800 mb-1">Sign In</h2>
                    <p className="text-sm text-gray-400 mb-6">
                        Use your hospital credentials to access the system
                    </p>

                    <form onSubmit={handleLogin} className="space-y-4">

                        {/* Email */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="yourname@durdans.lk"
                                autoComplete="email"
                                className="w-full px-3.5 py-2.5 text-sm border border-gray-200
                           rounded-lg bg-white text-gray-800 placeholder-gray-400
                           focus:outline-none focus:ring-2 focus:ring-blue-500
                           focus:border-transparent transition-all"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2
                                 w-4 h-4 text-gray-400" />
                                <input
                                    type={showPass ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                    className="w-full pl-10 pr-10 py-2.5 text-sm border border-gray-200
                             rounded-lg bg-white text-gray-800 placeholder-gray-400
                             focus:outline-none focus:ring-2 focus:ring-blue-500
                             focus:border-transparent transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPass(!showPass)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2
                             text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPass
                                        ? <EyeOff className="w-4 h-4" />
                                        : <Eye className="w-4 h-4" />
                                    }
                                </button>
                            </div>
                        </div>

                        {/* Error message */}
                        {error && (
                            <div className="flex items-center gap-2 bg-red-50 border border-red-200
                              rounded-lg px-3 py-2.5">
                                <span className="text-red-500 text-sm">⚠️</span>
                                <p className="text-xs text-red-700 font-medium">{error}</p>
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={cn(
                                "w-full py-2.5 rounded-lg text-sm font-semibold transition-all",
                                "active:scale-[0.98] shadow-sm",
                                loading
                                    ? "bg-blue-400 text-white cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-700 text-white"
                            )}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30
                                   border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
                            ) : (
                                "Sign In to LIMS"
                            )}
                        </button>
                    </form>
                </div>

                {/* ── Quick Login Panel (Dev only) ── */}
                <div className="bg-white rounded-xl border border-dashed border-gray-300 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400
                        mb-3 text-center">
                        🔧 Dev Quick Login — Remove in Production
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                        {MOCK_CREDENTIALS.map((cred) => (
                            <button
                                key={cred.role}
                                onClick={() => handleQuickLogin(cred)}
                                disabled={loading}
                                className="px-3 py-2 text-xs font-semibold rounded-lg border
                           border-gray-200 text-gray-600 hover:bg-blue-50
                           hover:border-blue-200 hover:text-blue-700
                           transition-all text-left disabled:opacity-50"
                            >
                                <p className="font-bold text-gray-800">
                                    {cred.role.replace(/_/g, " ")}
                                </p>
                                <p className="text-gray-400 text-[10px] truncate">{cred.email}</p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-xs text-gray-400">
                    © 2024 Durdans Hospital • IFS ERP System •{" "}
                    <span className="text-blue-500">v1.0.0</span>
                </p>

            </div>
        </div>
    );
}
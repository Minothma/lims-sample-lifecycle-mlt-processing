// app/(dashboard)/layout.tsx
import Sidebar from "@/components/layout/Sidebar";
import TopNav from "@/components/layout/TopNav";

export default function DashboardLayout({
                                            children,
                                        }: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* ── Sidebar ── */}
            <Sidebar />

            {/* ── Main Content Area ── */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Nav */}
                <TopNav />

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
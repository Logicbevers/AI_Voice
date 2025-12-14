"use client";

import * as React from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { ToastProvider } from "@/components/ui";

interface AppLayoutProps {
    children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);

    return (
        <ToastProvider>
            <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
                {/* Sidebar */}
                <Sidebar
                    isCollapsed={isSidebarCollapsed}
                    onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                />

                {/* TopBar */}
                <TopBar isSidebarCollapsed={isSidebarCollapsed} />

                {/* Main Content */}
                <main
                    className="pt-16 transition-all duration-300"
                    style={{
                        marginLeft: isSidebarCollapsed ? "4rem" : "16rem",
                    }}
                >
                    <div className="p-6">{children}</div>
                </main>
            </div>
        </ToastProvider>
    );
}

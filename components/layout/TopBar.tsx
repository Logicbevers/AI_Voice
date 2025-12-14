"use client";

import * as React from "react";
import Link from "next/link";
import { Bell, Search, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
// import { useSession, signOut } from "next-auth/react"; // DISABLED FOR PUBLIC ACCESS
import { WorkspaceSelector } from "@/components/workspace/WorkspaceSelector";

interface TopBarProps {
    isSidebarCollapsed?: boolean;
}

export function TopBar({ isSidebarCollapsed = false }: TopBarProps) {
    const { theme, setTheme } = useTheme();
    // const { data: session } = useSession(); // DISABLED FOR PUBLIC ACCESS
    const session: { user?: { name?: string; email?: string } } | null = null; // Temporary: No authentication
    const [mounted, setMounted] = React.useState(false);
    const [showUserMenu, setShowUserMenu] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <header
            className="fixed top-0 right-0 h-16 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 z-30 transition-all duration-300"
            style={{
                left: isSidebarCollapsed ? "4rem" : "16rem",
            }}
        >
            <div className="h-full px-6 flex items-center justify-between gap-4">
                {/* Search */}
                <div className="flex-1 max-w-md">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500 dark:text-neutral-400" />
                        <input
                            type="text"
                            placeholder="Search videos, templates..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-colors"
                        />
                    </div>
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-3">
                    {/* Theme Toggle */}
                    {mounted && (
                        <button
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                            aria-label="Toggle theme"
                        >
                            {theme === "dark" ? (
                                <Sun className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
                            ) : (
                                <Moon className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
                            )}
                        </button>
                    )}

                    {/* Notifications */}
                    <button
                        className="relative p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                        aria-label="Notifications"
                    >
                        <Bell className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error-DEFAULT rounded-full" />
                    </button>

                    {/* Workspace Selector */}
                    <WorkspaceSelector />

                    {/* User Menu */}
                    <div className="relative">
                        <button
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className="flex items-center gap-2 p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                        >
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold">
                                {session?.user?.name?.charAt(0).toUpperCase() || "U"}
                            </div>
                        </button>

                        {showUserMenu && (
                            <div className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-neutral-900 rounded-lg shadow-strong border border-neutral-200 dark:border-neutral-800 py-2">
                                <div className="px-3 py-2 border-b border-neutral-200 dark:border-neutral-800">
                                    <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                                        {session?.user?.name || "User"}
                                    </p>
                                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                        {session?.user?.email || ""}
                                    </p>
                                </div>
                                <Link
                                    href="/profile"
                                    className="block w-full px-3 py-2 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                                >
                                    Profile
                                </Link>
                                <Link
                                    href="/settings"
                                    className="block w-full px-3 py-2 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                                >
                                    Settings
                                </Link>
                                <div className="border-t border-neutral-200 dark:border-neutral-800 my-2" />
                                {/* Sign out disabled for public access
                                <button
                                    onClick={async () => {
                                        await signOut({ redirect: false });
                                        window.location.href = "/login";
                                    }}
                                    className="block w-full px-3 py-2 text-left text-sm text-error-DEFAULT hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                                >
                                    Sign Out
                                </button>
                                */}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}

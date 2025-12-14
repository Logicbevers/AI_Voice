"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import {
    LayoutDashboard,
    Video,
    FileText,
    Users,
    Settings,
    FolderOpen,
    Sparkles,
    ChevronLeft,
    Mic,
} from "lucide-react";

interface NavItem {
    label: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Create", href: "/create", icon: Sparkles },
    { label: "Videos", href: "/videos", icon: Video },
    { label: "Voice Studio", href: "/voice-studio", icon: Mic },
    { label: "Templates", href: "/templates", icon: FileText },
    { label: "Avatars", href: "/avatars", icon: Users },
    { label: "Assets", href: "/assets", icon: FolderOpen },
    { label: "Settings", href: "/settings", icon: Settings },
];

interface SidebarProps {
    isCollapsed?: boolean;
    onToggleCollapse?: () => void;
}

export function Sidebar({ isCollapsed = false, onToggleCollapse }: SidebarProps) {
    const pathname = usePathname();

    return (
        <aside
            className={clsx(
                "fixed left-0 top-0 h-screen bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 transition-all duration-300 z-40",
                isCollapsed ? "w-16" : "w-64"
            )}
        >
            {/* Logo */}
            <div className="h-16 flex items-center justify-between px-4 border-b border-neutral-200 dark:border-neutral-800">
                {!isCollapsed && (
                    <Link href="/dashboard" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                            <Video className="h-5 w-5 text-white" />
                        </div>
                        <span className="font-bold text-lg text-neutral-900 dark:text-neutral-100">
                            AI Video
                        </span>
                    </Link>
                )}
                {isCollapsed && (
                    <Link href="/dashboard" className="flex items-center justify-center w-full">
                        <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                            <Video className="h-5 w-5 text-white" />
                        </div>
                    </Link>
                )}
            </div>

            {/* Navigation */}
            <nav className="p-3 space-y-1">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={clsx(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group relative",
                                isActive
                                    ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400"
                                    : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                            )}
                            title={isCollapsed ? item.label : undefined}
                        >
                            <Icon
                                className={clsx(
                                    "h-5 w-5 flex-shrink-0",
                                    isActive
                                        ? "text-primary-600 dark:text-primary-400"
                                        : "text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-300"
                                )}
                            />
                            {!isCollapsed && (
                                <span className="font-medium text-sm">{item.label}</span>
                            )}
                            {isActive && !isCollapsed && (
                                <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-primary-600 dark:bg-primary-400" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Collapse Toggle */}
            {onToggleCollapse && (
                <button
                    onClick={onToggleCollapse}
                    className="absolute bottom-4 right-4 p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                    aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                    <ChevronLeft
                        className={clsx(
                            "h-4 w-4 text-neutral-600 dark:text-neutral-400 transition-transform",
                            isCollapsed && "rotate-180"
                        )}
                    />
                </button>
            )}
        </aside>
    );
}

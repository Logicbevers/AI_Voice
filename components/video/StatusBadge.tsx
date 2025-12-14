"use client";

import * as React from "react";
import { Badge } from "@/components/ui";
import { Clock, Loader2, CheckCircle, XCircle } from "lucide-react";

interface StatusBadgeProps {
    status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
    const config: Record<string, { label: string, variant: any, icon: any, className: string }> = {
        draft: {
            label: "Draft",
            variant: "default",
            icon: Clock,
            className: "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300",
        },
        queued: {
            label: "Queued",
            variant: "default",
            icon: Clock,
            className: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
        },
        processing: {
            label: "Processing",
            variant: "warning",
            icon: Loader2,
            className: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300",
        },
        completed: {
            label: "Completed",
            variant: "success",
            icon: CheckCircle,
            className: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300",
        },
        failed: {
            label: "Failed",
            variant: "error",
            icon: XCircle,
            className: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300",
        },
    };

    const statusConfig = config[status] || config.draft;
    const { label, icon: Icon, className } = statusConfig;

    return (
        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${className}`}>
            <Icon className={`h-3.5 w-3.5 ${status === "processing" ? "animate-spin" : ""}`} />
            {label}
        </div>
    );
}

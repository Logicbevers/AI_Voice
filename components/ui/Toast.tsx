"use client";

import * as React from "react";
import { clsx } from "clsx";
import { X } from "lucide-react";

export type ToastVariant = "default" | "success" | "error" | "warning" | "info";

export interface Toast {
    id: string;
    title?: string;
    description?: string;
    variant?: ToastVariant;
    duration?: number;
}

interface ToastContextValue {
    toasts: Toast[];
    addToast: (toast: Omit<Toast, "id">) => void;
    removeToast: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextValue | undefined>(undefined);

export const useToast = () => {
    const context = React.useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within ToastProvider");
    }
    return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = React.useState<Toast[]>([]);

    const removeToast = React.useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const addToast = React.useCallback((toast: Omit<Toast, "id">) => {
        const id = Math.random().toString(36).substring(2, 9);
        const newToast = { ...toast, id };
        setToasts((prev) => [...prev, newToast]);

        const duration = toast.duration || 5000;
        setTimeout(() => {
            removeToast(id);
        }, duration);
    }, [removeToast]);

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
            {children}
            <ToastContainer toasts={toasts} onRemove={removeToast} />
        </ToastContext.Provider>
    );
};

const ToastContainer: React.FC<{ toasts: Toast[]; onRemove: (id: string) => void }> = ({
    toasts,
    onRemove,
}) => {
    if (toasts.length === 0) return null;

    return (
        <div className="fixed bottom-0 right-0 z-50 p-4 space-y-2 max-w-md w-full">
            {toasts.map((toast) => (
                <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
            ))}
        </div>
    );
};

const ToastItem: React.FC<{ toast: Toast; onRemove: (id: string) => void }> = ({
    toast,
    onRemove,
}) => {
    const variantClasses = {
        default: "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800",
        success: "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800",
        error: "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800",
        warning: "bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800",
        info: "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800",
    };

    return (
        <div
            className={clsx(
                "flex items-start gap-3 p-4 rounded-lg border shadow-medium animate-slide-up",
                variantClasses[toast.variant || "default"]
            )}
        >
            <div className="flex-1">
                {toast.title && (
                    <p className="font-medium text-sm text-neutral-900 dark:text-neutral-100">
                        {toast.title}
                    </p>
                )}
                {toast.description && (
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                        {toast.description}
                    </p>
                )}
            </div>
            <button
                onClick={() => onRemove(toast.id)}
                className="text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 transition-colors"
                aria-label="Close notification"
            >
                <X className="h-4 w-4" />
            </button>
        </div>
    );
};

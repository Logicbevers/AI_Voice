import * as React from "react";
import { clsx } from "clsx";

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
    value: number;
    max?: number;
    size?: "sm" | "md" | "lg";
    variant?: "default" | "success" | "warning" | "error";
    showLabel?: boolean;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
    ({ className, value, max = 100, size = "md", variant = "default", showLabel = false, ...props }, ref) => {
        const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

        const sizeClasses = {
            sm: "h-1",
            md: "h-2",
            lg: "h-3",
        };

        const variantClasses = {
            default: "bg-primary-600",
            success: "bg-success-DEFAULT",
            warning: "bg-warning-DEFAULT",
            error: "bg-error-DEFAULT",
        };

        return (
            <div ref={ref} className={clsx("w-full", className)} {...props}>
                {showLabel && (
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-neutral-700 dark:text-neutral-300">
                            {Math.round(percentage)}%
                        </span>
                    </div>
                )}
                <div
                    className={clsx(
                        "w-full bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden",
                        sizeClasses[size]
                    )}
                >
                    <div
                        className={clsx(
                            "h-full transition-all duration-300 ease-out rounded-full",
                            variantClasses[variant]
                        )}
                        style={{ width: `${percentage}%` }}
                        role="progressbar"
                        aria-valuenow={value}
                        aria-valuemin={0}
                        aria-valuemax={max}
                    />
                </div>
            </div>
        );
    }
);

Progress.displayName = "Progress";

export { Progress };

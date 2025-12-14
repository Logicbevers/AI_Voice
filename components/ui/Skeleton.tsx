import * as React from "react";
import { clsx } from "clsx";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "text" | "circular" | "rectangular";
    width?: string | number;
    height?: string | number;
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
    ({ className, variant = "rectangular", width, height, style, ...props }, ref) => {
        const variantClasses = {
            text: "h-4 w-full rounded",
            circular: "rounded-full",
            rectangular: "rounded-lg",
        };

        return (
            <div
                ref={ref}
                className={clsx(
                    "animate-pulse bg-neutral-200 dark:bg-neutral-800",
                    variantClasses[variant],
                    className
                )}
                style={{
                    width: width,
                    height: height,
                    ...style,
                }}
                {...props}
            />
        );
    }
);

Skeleton.displayName = "Skeleton";

export { Skeleton };

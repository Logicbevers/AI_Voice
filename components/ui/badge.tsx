import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { clsx } from "clsx";

const badgeVariants = cva(
    "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
    {
        variants: {
            variant: {
                default: "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100",
                primary: "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300",
                success: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300",
                warning: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300",
                error: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300",
                info: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
);

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
    icon?: React.ReactNode;
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
    ({ className, variant, icon, children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={clsx(badgeVariants({ variant }), className)}
                {...props}
            >
                {icon && <span className="inline-flex">{icon}</span>}
                {children}
            </div>
        );
    }
);

Badge.displayName = "Badge";

export { Badge, badgeVariants };

import * as React from "react";
import { clsx } from "clsx";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
    size?: "sm" | "md" | "lg" | "xl" | "full";
    padding?: boolean;
}

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
    ({ className, size = "xl", padding = true, children, ...props }, ref) => {
        const sizeClasses = {
            sm: "max-w-3xl",
            md: "max-w-5xl",
            lg: "max-w-6xl",
            xl: "max-w-7xl",
            full: "max-w-full",
        };

        return (
            <div
                ref={ref}
                className={clsx(
                    "mx-auto w-full",
                    sizeClasses[size],
                    padding && "px-6",
                    className
                )}
                {...props}
            >
                {children}
            </div>
        );
    }
);

Container.displayName = "Container";

export { Container };

import * as React from "react";

import { cn } from "@/lib/utils";

function CozyCard({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn(
                "group relative overflow-hidden rounded-[24px]",
                "border border-secondary/12",
                "shadow-[0_2px_12px_rgba(0,0,0,0.08)]",
                "bg-linear-to-br",
                "from-[rgba(255,231,181,0.08)]",
                "via-[rgba(246,208,140,0.03)]",
                "to-[rgba(230,201,140,0.05)]",
                "p-4",
                "transition-all duration-300 ease-out",

                // Joyful hover lift
                "hover:shadow-[0_4px_20px_rgba(216,179,106,0.15)]",
                "hover:border-secondary/20",
                className,
            )}
            {...props}
        />
    );
}

function CozyCardHeader({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn(
                "flex flex-col",
                "gap-2.5",
                "p-6 pb-0",
                className,
            )}
            {...props}
        />
    );
}

function CozyCardContent({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn(
                "p-6",
                className,
            )}
            {...props}
        />
    );
}

function CozyCardFooter({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn(
                "flex items-center gap-3",
                "p-6 pt-0",
                className,
            )}
            {...props}
        />
    );
}

export { CozyCard, CozyCardHeader, CozyCardContent, CozyCardFooter };

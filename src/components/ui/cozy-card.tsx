import * as React from "react";

import { cn } from "@/lib/utils";

function CozyCard({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn(
                "group relative overflow-hidden rounded-[32px]",
                "border border-secondary/15",
                "bg-linear-to-br",
                "from-[rgba(255,231,181,0.10)]",
                "via-[rgba(246,208,140,0.04)]",
                "to-[rgba(230,201,140,0.06)]",
                "p-7",
                "transition-all duration-500 ease-out",

                // Warm top reflection
                "before:pointer-events-none",
                "before:absolute before:inset-0",
                "before:bg-[radial-gradient(ellipse_at_top_center,rgba(255,231,181,0.12),transparent_60%)]",
                "before:content-['']",

                // Inner warm border glow
                "after:absolute",
                "after:inset-px",
                "after:rounded-[30px]",
                "after:border",
                "after:border-white/8",
                "after:pointer-events-none",
                "after:content-['']",

                // Joyful hover lift
                "hover:shadow-glow",
                "hover:border-secondary/25",
                "hover:from-[rgba(255,231,181,0.14)]",
                "hover:via-[rgba(246,208,140,0.07)]",
                "hover:to-[rgba(230,201,140,0.09)]",
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

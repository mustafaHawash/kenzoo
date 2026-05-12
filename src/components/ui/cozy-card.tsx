import * as React from "react";

import { cn } from "@/lib/utils";

function CozyCard({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn(
                "rounded-3xl",

                "border border-border/60",

                "bg-surface",

                "shadow-(--shadow-ambient)",

                "backdrop-blur-sm",

                "transition-all",
                "duration-(--duration-normal)",
                "ease-(--ease-soft)",

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

                "space-y-2",

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

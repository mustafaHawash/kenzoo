"use client";

import { cn } from "@/lib/utils";

/**
 * LanternGlow - CSS-only glow animation.
 * Replaced framer-motion with CSS keyframe for zero JS runtime cost.
 */
export function LanternGlow({ className }: { className?: string }) {
    return (
        <div
            aria-hidden
            className={cn(
                "absolute left-1/2 top-[47%] h-56 w-56 -translate-x-1/2 -translate-y-1/2",
                "rounded-full bg-secondary/24 blur-xl",
                "sm:h-72 sm:w-72",
                "animate-[lanternPulse_7s_ease-in-out_infinite]",
                className,
            )}
        />
    );
}

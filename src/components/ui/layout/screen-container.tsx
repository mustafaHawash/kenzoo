// src/components/layout/screen-container.tsx
"use client";

import { PropsWithChildren } from "react";
import { cn } from "@/lib/utils";
import { AmbientBackground } from "@/components/atmosphere/ambient-background";

type ScreenContainerProps = PropsWithChildren<{
    className?: string;
}>;

export function ScreenContainer({ children, className }: ScreenContainerProps) {
    return (
        // Relative container to hold the absolute background
        <div className="relative min-h-dvh w-full overflow-hidden bg-(--bg)">
            
            {/* Background Layer: Sits behind everything */}
            <AmbientBackground />

            {/* Content Layer: The actual UI */}
            <main
                className={cn(
                    "relative z-10", // Ensures content is above the background
                    "mx-auto w-full max-w-md",
                    "min-h-dvh",
                    "px-4 py-6",
                    "flex flex-col",
                    className,
                )}
            >
                {children}
            </main>
        </div>
    );
}
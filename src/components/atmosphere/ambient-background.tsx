import { cn } from "@/lib/utils";

export function AmbientBackground() {
    return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {/* Top Glow — lighter blur for performance */}
            <div
                className={cn(
                    "absolute left-1/2 top-0",
                    "h-56 w-56 -translate-x-1/2",
                    "rounded-full bg-secondary/15 blur-2xl",
                )}
            />

            {/* Bottom Warm Light */}
            <div
                className={cn(
                    "absolute bottom-0 left-1/2",
                    "h-48 w-48 -translate-x-1/2",
                    "rounded-full bg-primary/8 blur-2xl",
                )}
            />
        </div>
    );
}

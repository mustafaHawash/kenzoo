import { cn } from "@/lib/utils";

export function AmbientBackground() {
    return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {/* Top Glow */}
            <div
                className={cn(
                    "absolute left-1/2 top-0",
                    "h-72 w-72 -translate-x-1/2",
                    "rounded-full bg-secondary/20 blur-3xl",
                )}
            />

            {/* Bottom Warm Light */}
            <div
                className={cn(
                    "absolute bottom-0 left-1/2",
                    "h-64 w-64 -translate-x-1/2",
                    "rounded-full bg-primary/10 blur-3xl",
                )}
            />
        </div>
    );
}

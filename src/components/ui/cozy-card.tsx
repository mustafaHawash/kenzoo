import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

type CozyCardProps = HTMLAttributes<HTMLDivElement>;

export function CozyCard({ className, children, ...props }: CozyCardProps) {
    return (
        <div
            className={cn(
                "rounded-3xl",
                "border border-border/60",
                "bg-surface",
                "shadow-(--shadow-ambient)",
                "backdrop-blur-sm",
                "transition-all duration-300",
                "p-6",
                className,
            )}
            {...props}
        >
            {children}
        </div>
    );
}

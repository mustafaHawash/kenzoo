import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type LanternButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function LanternButton({
    className,
    children,
    ...props
}: LanternButtonProps) {
    return (
        <button
            className={cn(
                "inline-flex items-center justify-center",

                "h-12 px-6",

                "rounded-full",

                "bg-primary text-primary-foreground",

                "shadow-(--shadow-ambient)",

                "transition-all duration-300",

                "hover:brightness-105",

                "active:scale-[0.98]",

                "disabled:pointer-events-none",
                "disabled:opacity-50",

                "text-label-md",

                className,
            )}
            {...props}
        >
            {children}
        </button>
    );
}

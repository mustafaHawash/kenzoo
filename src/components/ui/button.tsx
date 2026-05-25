import * as React from "react";

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
    [
        "inline-flex items-center justify-center gap-2",

        "whitespace-nowrap",

        "rounded-full",

        "font-medium",

        "transition-all",
        "duration-(--duration-normal)",
        "ease-(--ease-soft)",

        "focus-visible:outline-none",
        "focus-visible:ring-2",
        "focus-visible:ring-ring",

        "disabled:pointer-events-none",
        "disabled:opacity-50",

        "[&_svg]:pointer-events-none",
        "[&_svg]:size-4",
        "[&_svg]:shrink-0",
    ],
    {
        variants: {
            variant: {
                primary: [
                    "bg-primary",
                    "text-primary-foreground",

                    "shadow-[var(--shadow-ambient)]",

                    "hover:brightness-105",
                ],

                secondary: [
                    "bg-secondary",
                    "text-secondary-foreground",

                    "shadow-[var(--shadow-soft)]",

                    "hover:brightness-105",
                ],

                ghost: [
                    "bg-transparent",

                    "text-foreground",

                    "hover:bg-foreground/5",
                ],

                destructive: [
                    "bg-red-500",
                    "text-white",

                    "hover:bg-red-500/90",
                ],
            },

            size: {
                sm: "h-9 px-4 text-sm",

                md: "h-11 px-5 text-sm",

                lg: "h-12 px-6 text-base",

                icon: "size-11",
            },
        },

        defaultVariants: {
            variant: "primary",
            size: "md",
        },
    },
);

export interface ButtonProps
    extends
        React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

// Global click SFX — lazy singleton to avoid creating Audio on every render
let clickAudio: HTMLAudioElement | null = null;
function playClickSfx() {
    try {
        if (!clickAudio) clickAudio = new Audio("/sounds/sfx/click.mp3");
        clickAudio.volume = 0.3;
        clickAudio.currentTime = 0;
        clickAudio.play().catch(() => {});
    } catch {}
}

export function Button({ className, variant, size, asChild, onClick, ...props }: ButtonProps) {
    const Comp = asChild ? Slot : "button";

    const handleClick = onClick
        ? (e: React.MouseEvent<HTMLButtonElement>) => {
            playClickSfx();
            onClick(e);
          }
        : undefined;

    return (
        <Comp
            className={cn(
                buttonVariants({
                    variant,
                    size,
                }),
                className,
            )}
            onClick={handleClick}
            {...props}
        />
    );
}

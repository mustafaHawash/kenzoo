import * as React from "react";
import Image from "next/image";

import { Button, type ButtonProps } from "@/components/ui/button";
import { iconAssets } from "@/assets";

import { cn } from "@/lib/utils";

export function LanternButton({ className, children, ...props }: ButtonProps) {
    return (
        <Button
            variant='primary'
            size='lg'
            className={cn(
                "relative overflow-hidden",

                "before:pointer-events-none before:absolute before:inset-0 before:rounded-full before:bg-linear-to-b before:from-white/15 before:via-transparent before:to-black/10",

                "shadow-[0_4px_24px_rgba(216,179,106,0.30),0_1px_4px_rgba(0,0,0,0.12)]",

                "hover:-translate-y-0.5",
                "hover:shadow-[0_8px_32px_rgba(216,179,106,0.40),0_2px_8px_rgba(0,0,0,0.15)]",
                "hover:brightness-110",

                "active:translate-y-0",
                "active:scale-[0.97]",
                "active:shadow-[0_2px_12px_rgba(216,179,106,0.20)]",
                "active:brightness-95",

                "transition-all duration-200 ease-(--ease-soft)",

                "disabled:cursor-not-allowed",
                "disabled:translate-y-0",
                "disabled:shadow-none",
                "disabled:saturate-50",

                className,
            )}
            {...props}
        >
            <span className="relative z-10 flex items-center justify-center gap-2.5">
                <Image
                    src={iconAssets.lantern}
                    alt=""
                    width={26}
                    height={26}
                    className="object-contain drop-shadow-[0_1px_4px_rgba(216,179,106,0.5)]"
                />
                {children}
            </span>
        </Button>
    );
}

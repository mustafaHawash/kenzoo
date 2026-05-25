import * as React from "react";

import { Button, type ButtonProps } from "@/components/ui/button";

import { cn } from "@/lib/utils";

export function LanternButton({ className, children, ...props }: ButtonProps) {
    return (
        <Button
            variant='primary'
            size='lg'
            className={cn(
                "shadow-(--shadow-ornamental)",

                "hover:-translate-y-0.5",
                "hover:shadow-(--shadow-glow)",
                "hover:brightness-110",

                "active:translate-y-0",
                "active:scale-[0.97]",
                "active:brightness-95",

                "transition-all duration-200 ease-(--ease-soft)",

                "disabled:cursor-not-allowed",
                "disabled:translate-y-0",
                "disabled:shadow-none",

                className,
            )}
            {...props}
        >
            {children}
        </Button>
    );
}

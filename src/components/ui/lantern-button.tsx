import * as React from "react";

import { Button, type ButtonProps } from "@/components/ui/button";

import { cn } from "@/lib/utils";

export function LanternButton({ className, children, ...props }: ButtonProps) {
    return (
        <Button
            variant='primary'
            size='lg'
            className={cn(
                "hover:-translate-y-0.5",

                "hover:shadow-(--shadow-glow)",

                "active:translate-y-0",
                "active:scale-[0.98]",

                className,
            )}
            {...props}
        >
            {children}
        </Button>
    );
}

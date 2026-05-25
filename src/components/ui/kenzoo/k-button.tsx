import * as React from "react";

import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type KButtonProps = ButtonProps;

export const KButton = React.forwardRef<HTMLButtonElement, KButtonProps>(
    ({ className, ...props }, ref) => (
        <Button
            ref={ref}
            className={cn(
                "min-w-0 rounded-full border border-secondary/18",
                "shadow-soft active:scale-[0.98]",
                className,
            )}
            {...props}
        />
    ),
);

KButton.displayName = "KButton";

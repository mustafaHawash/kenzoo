import * as React from "react";

import { KCard } from "./k-card";
import { cn } from "@/lib/utils";

type KModalProps = React.HTMLAttributes<HTMLDivElement> & {
    open: boolean;
};

export function KModal({ open, className, children, ...props }: KModalProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
            <div className="absolute inset-0 bg-background/70 backdrop-blur-md" />
            <KCard
                role="dialog"
                aria-modal="true"
                className={cn("relative z-10 w-full max-w-md", className)}
                {...props}
            >
                {children}
            </KCard>
        </div>
    );
}

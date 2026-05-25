import * as React from "react";

import { CozyCard } from "@/components/ui/cozy-card";
import { cn } from "@/lib/utils";

export function KCard({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <CozyCard
            className={cn(
                "rounded-3xl bg-card/72 p-5 shadow-soft backdrop-blur-md sm:p-6",
                className,
            )}
            {...props}
        />
    );
}

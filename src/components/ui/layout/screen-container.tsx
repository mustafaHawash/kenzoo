import { PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

type ScreenContainerProps = PropsWithChildren<{
    className?: string;
}>;

export function ScreenContainer({ children, className }: ScreenContainerProps) {
    return (
        <main
            className={cn(
                "mx-auto",
                "w-full max-w-md",
                "min-h-dvh",
                "px-4 py-6",
                "flex flex-col",
                className,
            )}
        >
            {children}
        </main>
    );
}

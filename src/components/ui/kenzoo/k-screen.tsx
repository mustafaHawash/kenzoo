"use client";

import * as React from "react";

import { ThemeBackground } from "@/components/theme/theme-background";
import { cn } from "@/lib/utils";
import type { BackgroundScene, ThemeAssetId } from "@/assets";

type KScreenProps = React.HTMLAttributes<HTMLElement> & {
    scene?: BackgroundScene;
    themeId?: ThemeAssetId;
    particles?: boolean;
    contentClassName?: string;
};

export function KScreen({
    scene = "gameplay",
    themeId = "eid-el-adha",
    particles = true,
    className,
    contentClassName,
    children,
    ...props
}: KScreenProps) {
    return (
        <main
            className={cn(
                "relative min-h-dvh w-full overflow-x-hidden overflow-y-auto bg-background text-foreground",
                className,
            )}
            {...props}
        >
            <ThemeBackground scene={scene} themeId={themeId} particles={particles} />
            <div
                className={cn(
                    "relative z-10 mx-auto flex min-h-dvh w-full max-w-md flex-col px-3 py-2",
                    "pb-[max(0.5rem,env(safe-area-inset-bottom))]",
                    "pt-[max(0.5rem,env(safe-area-inset-top))]",
                    contentClassName,
                )}
            >
                {children}
            </div>
        </main>
    );
}

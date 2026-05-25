// src/components/layout/screen-container.tsx
"use client";

import { PropsWithChildren } from "react";
import { cn } from "@/lib/utils";
import { KScreen } from "@/components/ui/kenzoo/k-screen";
import type { BackgroundScene, ThemeAssetId } from "@/assets";

type ScreenContainerProps = PropsWithChildren<{
    className?: string;
    scene?: BackgroundScene;
    themeId?: ThemeAssetId;
    particles?: boolean;
}>;

export function ScreenContainer({
    children,
    className,
    scene = "gameplay",
    themeId = "eid-el-adha",
    particles = true,
}: ScreenContainerProps) {
    return (
        <KScreen
            scene={scene}
            themeId={themeId}
            particles={particles}
            contentClassName={cn("max-w-md", className)}
        >
            {children}
        </KScreen>
    );
}

"use client";

import Image from "next/image";
import { FloatingParticles } from "@/components/atmosphere/floating-particles";
import { cn } from "@/lib/utils";
import {
    getThemeBackground,
    type BackgroundScene,
    type ThemeAssetId,
} from "@/assets";

type ThemeBackgroundProps = {
    scene?: BackgroundScene;
    themeId?: ThemeAssetId;
    particles?: boolean;
    className?: string;
    imageClassName?: string;
    children?: React.ReactNode;
};

const overlayByScene: Record<BackgroundScene, string> = {
    home: "bg-background/30",
    setup: "bg-background/48",
    gameplay: "bg-background/54",
    play: "bg-background/58",
    loading: "bg-background/56",
    treasure: "bg-background/52",
    ceremony: "bg-background/58",
};

export function ThemeBackground({
    scene = "gameplay",
    themeId = "eid-el-adha",
    particles = true,
    className,
    imageClassName,
    children,
}: ThemeBackgroundProps) {
    const background = getThemeBackground(scene, themeId);

    return (
        <div className={cn("absolute inset-0 overflow-hidden", className)} aria-hidden>
            <Image
                src={background}
                alt=""
                fill
                priority={scene === "home"}
                quality={75}
                sizes="(max-width: 480px) 100vw, 480px"
                className={cn("object-cover opacity-70", imageClassName)}
            />
            {/* Overlay — combines color wash + gradient in one div for performance */}
            <div className={cn("absolute inset-0", overlayByScene[scene])} />
            <div className="absolute inset-0 bg-linear-to-b from-background/16 via-transparent to-background/68" />
            {particles && scene !== "play" && (
                <FloatingParticles />
            )}
            {children}
        </div>
    );
}

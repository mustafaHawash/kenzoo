"use client";

import Image from "next/image";
import { FloatingParticles } from "@/components/atmosphere/floating-particles";
import { cn } from "@/lib/utils";
import {
    getThemeBackground,
    particleAssets,
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
                priority={scene === "home" || scene === "setup" || scene === "gameplay"}
                sizes="100vw"
                className={cn("object-cover opacity-70", imageClassName)}
            />
            <Image
                src={particleAssets.paperTexture}
                alt=""
                fill
                sizes="100vw"
                className="object-cover opacity-[0.08] mix-blend-multiply"
            />
            <div className={cn("absolute inset-0 backdrop-blur-[1px]", overlayByScene[scene])} />
            <div className="absolute inset-0 bg-linear-to-b from-background/16 via-transparent to-background/68" />
            {particles && (
                <>
                    <Image
                        src={particleAssets.sparklesOverlay}
                        alt=""
                        fill
                        sizes="100vw"
                        className="object-cover opacity-20 mix-blend-screen"
                    />
                    <FloatingParticles />
                </>
            )}
            {children}
        </div>
    );
}

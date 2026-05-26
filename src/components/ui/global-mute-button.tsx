
"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

import { iconAssets } from "@/assets";

/**
 * Global mute button — fixed position, always visible.
 *
 * Uses CSS transitions instead of framer-motion to reduce bundle size.
 * This component is in the root layout, so keeping it lightweight is critical.
 */
export function GlobalMuteButton() {
    const [muted, setMuted] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const saved = localStorage.getItem("kenzoo-muted");
        if (saved === "true") {
            setMuted(true);
            document.documentElement.setAttribute("data-muted", "true");
        }
    }, []);

    const toggleMute = useCallback(() => {
        const next = !muted;
        setMuted(next);
        localStorage.setItem("kenzoo-muted", String(next));
        document.documentElement.setAttribute("data-muted", String(next));
        window.dispatchEvent(new CustomEvent("kenzoo:mute-toggle", { detail: { muted: next } }));
    }, [muted]);

    if (!mounted) return null;

    return (
        <button
            onClick={toggleMute}
            className="
                fixed bottom-4 left-4 z-50
                flex h-10 w-10 items-center justify-center
                rounded-full
                border border-secondary/15
                bg-card/80
                backdrop-blur-md
                shadow-soft
                transition-all duration-200
                hover:border-secondary/30 hover:bg-card/90
                active:scale-90
                animate-[fadeIn_0.3s_ease_1s_both]
            "
            aria-label={muted ? "تشغيل الصوت" : "كتم الصوت"}
        >
            {muted ? (
                <div className="relative flex items-center justify-center transition-opacity duration-200">
                    <Image
                        src={iconAssets.lantern}
                        alt=""
                        width={18}
                        height={18}
                        className="object-contain opacity-40"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-0.5 w-6 rotate-45 rounded-full bg-foreground/60" />
                    </div>
                </div>
            ) : (
                <div className="transition-opacity duration-200">
                    <Image
                        src={iconAssets.lantern}
                        alt=""
                        width={18}
                        height={18}
                        className="object-contain opacity-70"
                    />
                </div>
            )}
        </button>
    );
}

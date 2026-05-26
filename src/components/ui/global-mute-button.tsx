
"use client";

import { useState, useEffect, useCallback } from "react";

/**
 * Global mute button — fixed position, always visible.
 *
 * Uses CSS transitions instead of framer-motion to reduce bundle size.
 * This component is in the root layout, so keeping it lightweight is critical.
 *
 * Design: Pill-shaped with speaker icon + label for clarity.
 * Expands on hover to show "صوت" / "صامت" label.
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
                fixed top-5 left-5 z-50
                flex h-10 w-10 items-center justify-center
                rounded-2xl
                border border-secondary/20
                bg-card/90
                backdrop-blur-md
                shadow-soft
                transition-all duration-300 ease-(--ease-soft)
                hover:w-auto hover:min-w-[6.5rem] hover:gap-2 hover:px-3
                hover:border-secondary/40 hover:bg-card/95 hover:shadow-glow
                active:scale-95
                animate-[fadeIn_0.3s_ease_1s_both]
                group
                overflow-hidden
            "
            aria-label={muted ? "تشغيل الصوت" : "كتم الصوت"}
        >
            {/* Speaker Icon — pure SVG, no image dependency */}
            <span className="relative flex h-5 w-5 shrink-0 items-center justify-center">
                {muted ? (
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5 text-muted-foreground/70"
                    >
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                        <line x1="23" y1="9" x2="17" y2="15" />
                        <line x1="17" y1="9" x2="23" y2="15" />
                    </svg>
                ) : (
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5 text-secondary"
                    >
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                        <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                    </svg>
                )}
            </span>

            {/* Label — hidden by default, appears on hover */}
            <span
                className="
                    whitespace-nowrap text-xs font-medium
                    text-muted-foreground/70
                    max-w-0 opacity-0
                    transition-all duration-300 ease-(--ease-soft)
                    group-hover:max-w-[4rem] group-hover:opacity-100
                "
            >
                {muted ? "صامت" : "صوت"}
            </span>
        </button>
    );
}

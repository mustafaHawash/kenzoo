
"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

import { iconAssets } from "@/assets";

/**
 * Global mute button — fixed position, always visible.
 *
 * Controls the global audio mute state.
 * When muted, all soundtrack layers are silenced.
 * Uses localStorage to persist preference.
 */
export function GlobalMuteButton() {
    const [muted, setMuted] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Read initial mute state from localStorage
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

        // Dispatch custom event so useSoundtrack can react
        window.dispatchEvent(new CustomEvent("kenzoo:mute-toggle", { detail: { muted: next } }));
    }, [muted]);

    if (!mounted) return null;

    return (
        <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.3 }}
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
            "
            aria-label={muted ? "تشغيل الصوت" : "كتم الصوت"}
        >
            <AnimatePresence mode="wait">
                {muted ? (
                    <motion.div
                        key="muted"
                        initial={{ opacity: 0, rotate: -10 }}
                        animate={{ opacity: 1, rotate: 0 }}
                        exit={{ opacity: 0, rotate: 10 }}
                        transition={{ duration: 0.2 }}
                        className="relative flex items-center justify-center"
                    >
                        <Image
                            src={iconAssets.lantern}
                            alt=""
                            width={18}
                            height={18}
                            className="object-contain opacity-40"
                        />
                        {/* Mute slash line */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="h-0.5 w-6 rotate-45 rounded-full bg-foreground/60" />
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="unmuted"
                        initial={{ opacity: 0, rotate: 10 }}
                        animate={{ opacity: 1, rotate: 0 }}
                        exit={{ opacity: 0, rotate: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Image
                            src={iconAssets.lantern}
                            alt=""
                            width={18}
                            height={18}
                            className="object-contain opacity-70"
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.button>
    );
}

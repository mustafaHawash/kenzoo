
"use client";

import { useMemo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
    getRandomCelebrationSticker,
    getRandomFailSticker,
    getRandomThinkingSticker,
} from "@/assets/stickerAssets";
import type { StickerMood } from "@/assets/types";

type MoodStickerProps = {
    mood: StickerMood;
    size?: number;
    className?: string;
    delay?: number;
};

function getStickerForMood(mood: StickerMood): string {
    switch (mood) {
        case "celebration": return getRandomCelebrationSticker();
        case "fail": return getRandomFailSticker();
        case "thinking": return getRandomThinkingSticker();
    }
}

/**
 * MoodSticker — renders a random sticker from the given mood pool.
 * Uses useMemo to pick a sticker once per mood — avoids re-randomizing on re-renders.
 * Fades in with a gentle pop animation.
 */
export function MoodSticker({ mood, size = 128, className, delay = 0 }: MoodStickerProps) {
    // Pick sticker once per mood change — stable across re-renders
    const src = useMemo(() => getStickerForMood(mood), [mood]);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay, duration: 0.4, ease: "easeOut" }}
            className={`relative select-none ${className ?? ""}`}
            style={{ width: size, height: size }}
        >
            <Image
                src={src}
                alt=""
                width={size}
                height={size}
                className="object-contain mix-blend-multiply dark:mix-blend-screen"
                draggable={false}
            />
        </motion.div>
    );
}

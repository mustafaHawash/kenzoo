
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
    getRandomCelebrationSticker,
    getRandomFailSticker,
    getRandomThinkingSticker,
    type StickerMood,
} from "@/assets/stickerAssets";

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
 * Subtle, supportive, NOT overwhelming.
 * Fades in with a gentle pop animation.
 */
export function MoodSticker({ mood, size = 96, className, delay = 0 }: MoodStickerProps) {
    const [src, setSrc] = useState<string | null>(null);

    useEffect(() => {
        setSrc(getStickerForMood(mood));
    }, [mood]);

    if (!src) return null;

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

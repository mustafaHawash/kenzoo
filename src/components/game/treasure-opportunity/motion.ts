
/**
 * Shared motion variants for the treasure opportunity flow.
 *
 * Design principle: magical, cinematic, warm.
 * - Gentle scales = something precious appearing
 * - Soft glows = magical atmosphere
 * - No bounce, no flash = calm wonder
 */

/* ─── Card entrance ─── */
export const treasureCardEntrance = {
    initial: { opacity: 0, y: 16, scale: 0.95 },
    animate: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.45, ease: "easeOut" as const },
    },
    exit: {
        opacity: 0,
        y: -8,
        scale: 0.97,
        transition: { duration: 0.25, ease: "easeIn" as const },
    },
};

/* ─── Chest icon gentle float ─── */
export const chestFloat = {
    animate: {
        y: [0, -4, 0],
        transition: { duration: 2.5, repeat: Infinity, ease: "easeInOut" as const },
    },
};

/* ─── Sparkle particles around chest ─── */
export const sparkle = (index: number) => ({
    animate: {
        opacity: [0, 0.8, 0],
        scale: [0.5, 1, 0.5],
    },
    transition: {
        duration: 1.8,
        repeat: Infinity,
        delay: index * 0.4,
        ease: "easeInOut" as const,
    },
});

/* ─── Reward reveal entrance ─── */
export const rewardReveal = {
    initial: { opacity: 0, scale: 0.85, y: 8 },
    animate: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: { duration: 0.5, ease: "easeOut" as const, delay: 0.15 },
    },
};

/* ─── Star cost counter ─── */
export const starCountPulse = {
    animate: {
        scale: [1, 1.05, 1],
        transition: { duration: 1.2, repeat: Infinity, ease: "easeInOut" as const },
    },
};

/* ─── Glow ring behind chest (common — subtle warmth) ─── */
export const glowRing = {
    animate: {
        opacity: [0.3, 0.6, 0.3],
        scale: [0.95, 1.05, 0.95],
        transition: { duration: 3, repeat: Infinity, ease: "easeInOut" as const },
    },
};

/* ─── Glow ring — rare (brighter, slightly larger) ─── */
export const rareGlowRing = {
    animate: {
        opacity: [0.35, 0.7, 0.35],
        scale: [0.92, 1.08, 0.92],
        transition: { duration: 2.8, repeat: Infinity, ease: "easeInOut" as const },
    },
};

/* ─── Glow ring — legendary (dramatic, warm golden pulse) ─── */
export const legendaryGlowRing = {
    animate: {
        opacity: [0.4, 0.85, 0.4],
        scale: [0.88, 1.15, 0.88],
        transition: { duration: 2.4, repeat: Infinity, ease: "easeInOut" as const },
    },
};

/* ─── Chest float — rare (slightly more movement) ─── */
export const rareChestFloat = {
    animate: {
        y: [0, -5, 0],
        transition: { duration: 2.2, repeat: Infinity, ease: "easeInOut" as const },
    },
};

/* ─── Chest float — legendary (more dramatic float) ─── */
export const legendaryChestFloat = {
    animate: {
        y: [0, -7, 0],
        scale: [1, 1.03, 1],
        transition: { duration: 2, repeat: Infinity, ease: "easeInOut" as const },
    },
};

/* ─── Reward reveal — rare (slightly more dramatic) ─── */
export const rareRewardReveal = {
    initial: { opacity: 0, scale: 0.82, y: 10 },
    animate: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: { duration: 0.55, ease: "easeOut" as const, delay: 0.2 },
    },
};

/* ─── Reward reveal — legendary (cinematic, dramatic) ─── */
export const legendaryRewardReveal = {
    initial: { opacity: 0, scale: 0.75, y: 14 },
    animate: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: { duration: 0.65, ease: "easeOut" as const, delay: 0.3 },
    },
};

/* ─── Legendary emoji pulse ─── */
export const legendaryEmojiPulse = {
    animate: {
        scale: [1, 1.08, 1],
        transition: { duration: 2, repeat: Infinity, ease: "easeInOut" as const },
    },
};


/**
 * Shared motion variants for the active station surface.
 *
 * Design principle: calm, cinematic, tactile.
 * - Low stiffness, high damping = gentle movement
 * - Short distances = subtle shifts
 * - No bounce = no visual noise
 *
 * Per AGENTS.md motion philosophy:
 *   "subtle, cinematic, calm, tactile, soft"
 */

/* ─── Phase transition ─── */
export const phaseTransition = {
    initial: { opacity: 0, y: 12 },
    animate: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.35, ease: "easeOut" as const },
    },
    exit: {
        opacity: 0,
        y: -8,
        transition: { duration: 0.2, ease: "easeIn" as const },
    },
};

/* ─── Gentle fade-in for content blocks ─── */
export const fadeIn = {
    initial: { opacity: 0 },
    animate: {
        opacity: 1,
        transition: { duration: 0.3, ease: "easeOut" as const },
    },
};

/* ─── Staggered list items (choices, etc.) ─── */
export const staggerItem = {
    hidden: { opacity: 0, x: 12 },
    visible: (i: number) => ({
        opacity: 1,
        x: 0,
        transition: {
            delay: i * 0.05,
            duration: 0.25,
            ease: "easeOut" as const,
        },
    }),
};

/* ─── Soft pop for result reveal ─── */
export const softPop = {
    hidden: { opacity: 0, scale: 0.92 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.35,
            ease: "easeOut" as const,
            delay: 0.08,
        },
    },
};

/* ─── Calm icon entrance ─── */
export const iconEntrance = {
    hidden: { opacity: 0, scale: 0.6 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.4,
            ease: "easeOut" as const,
            delay: 0.05,
        },
    },
};

/* ─── Gentle slide-up for delayed content ─── */
export const slideUp = (delay: number = 0) => ({
    initial: { opacity: 0, y: 8 },
    animate: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.3, ease: "easeOut" as const, delay },
    },
});

/* ─── Shimmer for reveal phase ─── */
export const shimmer = {
    initial: { backgroundPosition: "200% 0" },
    animate: {
        backgroundPosition: "-200% 0",
        transition: { duration: 1.6, repeat: Infinity, ease: "linear" as const },
    },
};

/* ─── Floating dots for reveal phase ─── */
export const floatingDot = (index: number) => ({
    animate: {
        y: [0, -6, 0],
        opacity: [0.4, 0.9, 0.4],
    },
    transition: {
        duration: 1,
        repeat: Infinity,
        delay: index * 0.2,
        ease: "easeInOut" as const,
    },
});

/* ─── Hint expand/collapse ─── */
export const hintReveal = {
    initial: { opacity: 0, height: 0 },
    animate: {
        opacity: 1,
        height: "auto",
        transition: { duration: 0.25, ease: "easeOut" as const },
    },
    exit: {
        opacity: 0,
        height: 0,
        transition: { duration: 0.2, ease: "easeIn" as const },
    },
};

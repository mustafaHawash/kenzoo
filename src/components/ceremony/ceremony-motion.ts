
import type { Variants } from "framer-motion";

/**
 * Ceremony motion variants — cinematic pacing for ending ceremony.
 *
 * Design principles:
 *   - Slow, deliberate reveals — NOT snappy or bouncy
 *   - Warm fade-ins with gentle upward drift
 *   - Staggered children for sequential reveals
 *   - Dramatic pauses between phases
 *   - Mobile-friendly (no heavy transforms)
 */

/** Main phase enter — slow fade + gentle rise */
export const phaseEnter: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, ease: "easeOut" as const },
    },
    exit: {
        opacity: 0,
        y: -8,
        transition: { duration: 0.4, ease: "easeIn" as const },
    },
};

/** Stagger container — children reveal one by one */
export const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15, delayChildren: 0.3 },
    },
};

/** Stagger item — each child fades in gently */
export const staggerItem: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: "easeOut" as const },
    },
};

/** Dramatic reveal — for titles, treasures, winner */
export const dramaticReveal: Variants = {
    hidden: { opacity: 0, scale: 0.9, y: 12 },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
    },
};

/** Glow pulse — for winner highlight */
export const glowPulse: Variants = {
    initial: { opacity: 0.6 },
    animate: {
        opacity: [0.6, 1, 0.6],
        transition: { duration: 2.5, repeat: Infinity, ease: "easeInOut" as const },
    },
};

/** Floating animation — for stickers and icons */
export const gentleFloat: Variants = {
    animate: {
        y: [0, -4, 0],
        transition: { duration: 3, repeat: Infinity, ease: "easeInOut" as const },
    },
};

/** Shimmer — for treasure reveals */
export const shimmer: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: [0, 0.5, 0],
        transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" as const },
    },
};

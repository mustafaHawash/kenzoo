"use client";

import { motion } from "framer-motion";

import { Muted } from "@/components/ui/typography";

import { shimmer, floatingDot } from "./motion";

/**
 * Reveal phase — calm suspense while the answer is being checked.
 *
 * Pure visual component. No logic, no state.
 * The orchestrator controls when this shows and when it transitions.
 *
 * Motion: gentle, cinematic. No aggressive bouncing.
 */
export function RevealPhase() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-5 py-6"
        >
            {/* Shimmer bar */}
            <motion.div
                variants={shimmer}
                initial="initial"
                animate="animate"
                className="
                    h-2.5 w-44 rounded-full
                    bg-gradient-to-l
                    from-secondary/10 via-secondary/25 to-secondary/10
                    bg-[length:200%_100%]
                "
            />

            <Muted className="text-sm animate-pulse">
                🔮 بنشوف إجابتك...
            </Muted>

            {/* Floating dots */}
            <div className="flex gap-2">
                {[0, 1, 2].map((i) => (
                    <motion.div
                        key={i}
                        {...floatingDot(i)}
                        className="h-1.5 w-1.5 rounded-full bg-secondary/40"
                    />
                ))}
            </div>
        </motion.div>
    );
}

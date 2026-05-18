
"use client";

import { motion } from "framer-motion";

import { staggerItem } from "@/components/game/active-station-surface/motion";

import type { StationRendererProps } from "./renderer-types";

/**
 * Quiz renderer — choice-based gameplay.
 *
 * Renders a list of selectable choices with cozy styling.
 * Used for: quiz, guess, mystery (all choice-based types for now).
 *
 * Motion: calm stagger, gentle selection highlight.
 * No aggressive springs, no bounce.
 */
export function QuizRenderer({
    station,
    selectedChoice,
    onSelect,
}: StationRendererProps) {
    if (!station.choices?.length) return null;

    return (
        <div className="flex flex-col gap-3">
            {station.choices.map((choice, i) => {
                const isSelected = selectedChoice === choice;

                return (
                    <motion.button
                        key={choice}
                        custom={i}
                        variants={staggerItem}
                        initial="hidden"
                        animate="visible"
                        onClick={() => onSelect(choice)}
                        className={`
                            relative overflow-hidden
                            rounded-2xl
                            border px-5 py-4
                            text-center
                            transition-all duration-200
                            outline-none
                            focus-visible:ring-2 focus-visible:ring-secondary/40

                            ${
                                isSelected
                                    ? `
                                        border-secondary/40
                                        bg-secondary/12
                                        shadow-[0_4px_16px_rgba(216,179,106,0.10)]
                                    `
                                    : `
                                        border-border/40
                                        bg-surface-soft/60
                                        hover:bg-surface-soft
                                        hover:border-border/60
                                        active:scale-[0.98]
                                    `
                            }
                        `}
                    >
                        {isSelected && (
                            <div
                                className="
                                    pointer-events-none absolute inset-0
                                    bg-[radial-gradient(circle_at_center,rgba(246,208,140,0.06),transparent_70%)]
                                "
                            />
                        )}

                        <span className="relative z-10 text-foreground text-[15px] leading-relaxed">
                            {choice}
                        </span>
                    </motion.button>
                );
            })}
        </div>
    );
}

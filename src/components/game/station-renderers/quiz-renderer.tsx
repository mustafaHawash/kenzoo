
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

    const choiceLetters = ["أ", "ب", "ج", "د", "هـ", "و"];

    return (
        <div className="flex flex-col gap-2">
            {station.choices.map((choice, i) => {
                const isSelected = selectedChoice === choice;
                const letter = choiceLetters[i] ?? `${i + 1}`;

                return (
                    <motion.button
                        key={choice}
                        custom={i}
                        variants={staggerItem}
                        initial="hidden"
                        animate="visible"
                        onClick={() => onSelect(choice)}
                        className={`
                            relative flex items-center gap-3 overflow-hidden
                            rounded-xl
                            border px-3.5 py-2.5
                            text-right
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

                        {/* Choice letter indicator */}
                        <div className={`
                            relative z-10 flex h-6 w-6 shrink-0 items-center justify-center
                            rounded-full text-[11px] font-bold
                            transition-colors duration-200
                            ${isSelected
                                ? "bg-secondary/20 text-secondary"
                                : "bg-surface-soft text-muted-foreground/60"
                            }
                        `}>
                            {letter}
                        </div>

                        <span className="relative z-10 text-foreground text-[13px] leading-relaxed flex-1">
                            {choice}
                        </span>
                    </motion.button>
                );
            })}
        </div>
    );
}

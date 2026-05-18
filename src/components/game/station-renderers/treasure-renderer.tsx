
"use client";

import { motion } from "framer-motion";

import { Muted, Label } from "@/components/ui/typography";

import type { StationRendererProps } from "./renderer-types";

/**
 * Treasure renderer — placeholder for future treasure gameplay.
 *
 * Will evolve into:
 *   - cinematic treasure reveals
 *   - unlock animations
 *   - collectible displays
 *
 * For now: warm placeholder with a reveal-style interaction.
 */
export function TreasureRenderer({
    station,
    selectedChoice,
    onSelect,
}: StationRendererProps) {
    // If the treasure station has choices, show them (like quiz)
    if (station.choices?.length) {
        return (
            <div className="flex flex-col gap-3">
                {station.choices.map((choice, i) => {
                    const isSelected = selectedChoice === choice;

                    return (
                        <motion.button
                            key={choice}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05, duration: 0.25, ease: "easeOut" as const }}
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
                            <span className="relative z-10 text-foreground text-[15px] leading-relaxed">
                                {choice}
                            </span>
                        </motion.button>
                    );
                })}
            </div>
        );
    }

    // Fallback: atmospheric treasure reveal placeholder
    return (
        <div className="flex flex-col items-center gap-4 py-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" as const }}
                className="text-5xl"
            >
                🎁
            </motion.div>
            <Label className="text-secondary text-sm">
                كنز في الانتظار...
            </Label>
            <Muted className="text-xs text-center">
                جاوب صح واكتشف اللي جوا
            </Muted>
        </div>
    );
}

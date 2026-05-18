
"use client";

import { motion } from "framer-motion";

import { Muted, Label } from "@/components/ui/typography";

import type { StationRendererProps } from "./renderer-types";

/**
 * Story renderer — placeholder for future story gameplay.
 *
 * Will evolve into:
 *   - narrative branching
 *   - story choices with consequences
 *   - cinematic text reveals
 *
 * For now: warm placeholder with a contemplative interaction.
 */
export function StoryRenderer({
    station,
    selectedChoice,
    onSelect,
}: StationRendererProps) {
    // If the story station has choices, show them
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
                            transition={{ delay: i * 0.06, duration: 0.3, ease: "easeOut" as const }}
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
                                            border-primary/30
                                            bg-primary/8
                                            shadow-soft
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

    // Fallback: atmospheric story placeholder
    return (
        <div className="flex flex-col items-center gap-4 py-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" as const }}
                className="text-5xl"
            >
                🕯️
            </motion.div>
            <Label className="text-primary text-sm">
                حكاية جاية...
            </Label>
            <Muted className="text-xs text-center">
                استنى القصة وهتختار مصيرك
            </Muted>
        </div>
    );
}

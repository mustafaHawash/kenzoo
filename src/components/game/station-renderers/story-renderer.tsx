
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
            <div className="flex flex-col gap-2">
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
                                relative flex items-center gap-3 overflow-hidden
                                rounded-xl
                                border px-3.5 py-3
                                text-right
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
                            {/* Story choice indicator */}
                            <div className={`
                                relative z-10 flex h-7 w-7 shrink-0 items-center justify-center
                                rounded-full text-xs font-bold
                                transition-colors duration-200
                                ${isSelected
                                    ? "bg-primary/15 text-primary"
                                    : "bg-surface-soft text-muted-foreground/60"
                                }
                            `}>
                                {i + 1}
                            </div>

                            <span className="relative z-10 text-foreground text-sm leading-relaxed flex-1">
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
        <div className="flex flex-col items-center gap-3 py-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" as const }}
                className="text-4xl"
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

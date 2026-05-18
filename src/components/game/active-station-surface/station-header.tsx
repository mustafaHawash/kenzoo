
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { Headline, Body, Label, Muted } from "@/components/ui/typography";

import type { Station } from "@/types/station";

import { stationTypeMeta } from "./station-type-meta";
import { fadeIn, slideUp, hintReveal } from "./motion";

interface StationHeaderProps {
    station: Station;
    showHintToggle?: boolean;
}

/**
 * Station header: type badge, title, question, and optional hint.
 *
 * Pure visual component — receives data, renders UI.
 * Hint toggle is local UI state (show/hide), not gameplay logic.
 */
export function StationHeader({ station, showHintToggle = true }: StationHeaderProps) {
    const meta = stationTypeMeta[station.type];
    const [hintOpen, setHintOpen] = useState(false);

    return (
        <>
            {/* Station type badge */}
            <div className="flex justify-center">
                <motion.div
                    {...fadeIn}
                    className="
                        flex items-center gap-2
                        rounded-full
                        border border-primary/12
                        bg-primary/8
                        px-4 py-1.5
                    "
                >
                    <span className="text-sm">{meta.emoji}</span>
                    <Label className="text-primary text-xs tracking-wide">
                        {meta.label}
                    </Label>
                </motion.div>
            </div>

            {/* Title */}
            <motion.div
                {...slideUp(0.06)}
                className="text-center"
            >
                <Headline
                    className="
                        text-[28px] sm:text-[32px]
                        leading-tight
                        text-foreground
                    "
                >
                    {station.title}
                </Headline>
            </motion.div>

            {/* Question + hint */}
            <motion.div
                {...slideUp(0.1)}
                className="space-y-3 text-center"
            >
                <Body
                    className="
                        text-lg
                        leading-loose
                        text-foreground/85
                    "
                >
                    {station.question}
                </Body>

                {station.hint && showHintToggle && (
                    <div className="flex flex-col items-center gap-1.5">
                        <AnimatePresence>
                            {hintOpen && (
                                <motion.div
                                    variants={hintReveal}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                    className="overflow-hidden"
                                >
                                    <div
                                        className="
                                            rounded-xl
                                            border border-secondary/10
                                            bg-secondary/6
                                            px-4 py-2.5
                                        "
                                    >
                                        <Muted className="text-sm leading-relaxed">
                                            💡 {station.hint}
                                        </Muted>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <button
                            onClick={() => setHintOpen((v) => !v)}
                            className="
                                text-xs text-muted-foreground/60
                                hover:text-muted-foreground
                                transition-colors duration-200
                            "
                        >
                            {hintOpen ? "إخفاء التلميح" : "👀 تلميح؟"}
                        </button>
                    </div>
                )}
            </motion.div>
        </>
    );
}

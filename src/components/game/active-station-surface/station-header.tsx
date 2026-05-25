
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
            {/* ── Station type badge ── */}
            <div className="flex justify-center">
                <motion.div
                    {...fadeIn}
                    className="
                        flex items-center gap-2
                        rounded-full
                        border border-primary/15
                        bg-primary/10
                        px-4 py-1.5
                        backdrop-blur-sm
                    "
                >
                    <span className="text-sm">{meta.emoji}</span>
                    <Label className="text-primary text-[11px] font-semibold tracking-wide">
                        {meta.label}
                    </Label>
                </motion.div>
            </div>

            {/* ── Title ── */}
            <motion.div
                {...slideUp(0.06)}
                className="text-center"
            >
                <Headline
                    className="
                        text-lg
                        leading-snug
                        text-foreground
                        font-bold
                    "
                >
                    {station.title}
                </Headline>
            </motion.div>

            {/* ── Question + hint ── */}
            <motion.div
                {...slideUp(0.1)}
                className="space-y-2 text-center"
            >
                <Body
                    className="
                        text-[13px]
                        leading-relaxed
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
                                    className="w-full overflow-hidden"
                                >
                                    <div
                                        className="
                                            rounded-xl
                                            border border-secondary/12
                                            bg-secondary/8
                                            px-4 py-2.5
                                            backdrop-blur-sm
                                        "
                                    >
                                        <Muted className="text-xs leading-relaxed">
                                            💡 {station.hint}
                                        </Muted>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <button
                            onClick={() => setHintOpen((v) => !v)}
                            className="
                                flex items-center gap-1
                                rounded-full
                                border border-secondary/10
                                bg-secondary/5
                                px-3 py-1
                                text-[11px] text-muted-foreground/70
                                hover:text-secondary hover:border-secondary/20 hover:bg-secondary/10
                                transition-all duration-200
                                active:scale-95
                            "
                        >
                            <span>{hintOpen ? "✕" : "👀"}</span>
                            {hintOpen ? "إخفاء" : "تلميح"}
                        </button>
                    </div>
                )}
            </motion.div>
        </>
    );
}

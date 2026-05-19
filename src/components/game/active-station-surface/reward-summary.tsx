
"use client";

import { motion } from "framer-motion";

import { Label, Muted } from "@/components/ui/typography";

import type { RoundResult } from "@/types/session";

import { slideUp } from "./motion";

interface RewardSummaryProps {
    result: RoundResult;
    totalStars: number;
}

/**
 * Reward summary — stars earned + treasure unlock badge.
 *
 * Shown inside ResultPhase when the answer is correct.
 * Pure visual component.
 */
export function RewardSummary({ result, totalStars }: RewardSummaryProps) {
    return (
        <motion.div
            {...slideUp(0.15)}
            className="
                flex items-center justify-between
                rounded-2xl
                border border-secondary/12
                bg-secondary/6
                px-5 py-4
            "
        >
            <div className="flex items-center gap-3">
                <span className="text-lg">
                    {result.treasureUnlocked ? "🗝️" : result.isCorrect ? "⭐" : "🌙"}
                </span>
                <div className="flex flex-col">
                    <Label className="text-foreground text-sm">
                        {result.treasureUnlocked
                            ? "فرصة كنز!"
                            : result.isCorrect
                                ? `+${result.starsEarned} نجوم`
                                : "محاولة قريبة"}
                    </Label>
                    <Muted className="text-[11px]">
                        المجموع: {totalStars} ⭐
                    </Muted>
                </div>
            </div>

            {result.treasureUnlocked && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, ease: "easeOut" as const, delay: 0.2 }}
                    className="
                        flex items-center gap-1.5
                        rounded-full
                        border border-secondary/20
                        bg-secondary/12
                        px-3 py-1.5
                    "
                >
                    <span className="text-sm">🗝️</span>
                    <Label className="text-secondary text-xs">
                        كنز!
                    </Label>
                </motion.div>
            )}
        </motion.div>
    );
}

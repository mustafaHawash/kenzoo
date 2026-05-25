
"use client";

import { motion } from "framer-motion";

import { Label } from "@/components/ui/typography";

import type { RoundResult } from "@/types/session";

import { slideUp } from "./motion";

interface RewardSummaryProps {
    result: RoundResult;
}

/**
 * Reward summary — stars earned + treasure unlock badge.
 *
 * Shown inside ResultPhase when the answer is correct.
 * Pure visual component.
 */
export function RewardSummary({ result }: RewardSummaryProps) {
    return (
        <motion.div
            {...slideUp(0.15)}
            className="
                flex items-center justify-between
                rounded-xl
                border border-secondary/12
                bg-secondary/6
                px-4 py-3
            "
        >
            <div className="flex items-center gap-2">
                <div className="flex flex-col">
                    <Label className="text-foreground text-[13px] font-medium">
                        {result.treasureUnlocked
                            ? "فرصة كنز!"
                            : result.isCorrect
                                ? `+${result.starsEarned} نجوم`
                                : "محاولة قريبة"}
                    </Label>
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
                    <Label className="text-secondary text-xs font-semibold">
                        كنز!
                    </Label>
                </motion.div>
            )}
        </motion.div>
    );
}

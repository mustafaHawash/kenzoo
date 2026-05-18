
"use client";

import { motion } from "framer-motion";

import { LanternButton } from "@/components/ui/lantern-button";
import { Headline, Muted } from "@/components/ui/typography";

import type { Station } from "@/types/station";
import type { RoundResult } from "@/types/session";

import { softPop, iconEntrance, slideUp } from "./motion";
import { RewardSummary } from "./reward-summary";
import { TinyMissionCard } from "./tiny-mission-card";

interface ResultPhaseProps {
    station: Station;
    result: RoundResult;
    playerStars: number;
    onNext: () => void;
}

/**
 * Result phase — outcome reveal after answer submission.
 *
 * Shows:
 *   - Correct: reward summary, possible treasure, stars
 *   - Wrong: correct answer, tiny mission, warm encouragement
 *   - Explanation (if available)
 *   - Next CTA
 *
 * Pure rendering component. All gameplay logic lives in the orchestrator.
 */
export function ResultPhase({
    station,
    result,
    playerStars,
    onNext,
}: ResultPhaseProps) {
    const totalStars = playerStars + result.starsEarned;

    return (
        <motion.div
            variants={softPop}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-6"
        >
            {/* ── Result icon & message ── */}
            <div className="flex flex-col items-center gap-3 text-center">
                <motion.div
                    variants={iconEntrance}
                    initial="hidden"
                    animate="visible"
                    className="text-5xl"
                >
                    {result.isCorrect ? "🌟" : "🌙"}
                </motion.div>

                <Headline
                    className={
                        result.isCorrect
                            ? "text-secondary text-2xl"
                            : "text-foreground/70 text-2xl"
                    }
                >
                    {result.isCorrect
                        ? "إجابة صحيحة!"
                        : "مش مرة.. بس محاولة حلوة!"}
                </Headline>

                {/* Correct answer reveal (wrong answers only) */}
                {!result.isCorrect && (
                    <div
                        className="
                            rounded-xl
                            border border-secondary/15
                            bg-secondary/6
                            px-4 py-2.5
                        "
                    >
                        <Muted className="text-sm">
                            الإجابة الصحيحة:{" "}
                            <span className="text-foreground font-medium">
                                {station.answer}
                            </span>
                        </Muted>
                    </div>
                )}
            </div>

            {/* ── Explanation ── */}
            {station.explanation && (
                <motion.div
                    {...slideUp(0.1)}
                    className="
                        rounded-xl
                        border border-primary/10
                        bg-primary/5
                        px-4 py-3
                        text-center
                    "
                >
                    <Muted className="text-sm leading-relaxed">
                        📝 {station.explanation}
                    </Muted>
                </motion.div>
            )}

            {/* ── Reward summary ── */}
            <RewardSummary result={result} totalStars={totalStars} />

            {/* ── Tiny mission (wrong answers) ── */}
            {!result.isCorrect && result.tinyMission && (
                <TinyMissionCard mission={result.tinyMission} />
            )}

            {/* ── Next CTA ── */}
            <LanternButton
                onClick={onNext}
                className="w-full"
            >
                {result.isCorrect
                    ? "يلا المحطة الجاية 🚀"
                    : "جرب تاني 💪"}
            </LanternButton>
        </motion.div>
    );
}

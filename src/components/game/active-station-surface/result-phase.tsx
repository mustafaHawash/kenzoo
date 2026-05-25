
"use client";

import { motion } from "framer-motion";

import { LanternButton } from "@/components/ui/lantern-button";
import { Headline, Muted } from "@/components/ui/typography";
import { MoodSticker } from "@/components/ui/mood-sticker";

import type { Station } from "@/types/station";
import type { RoundResult } from "@/types/session";

import { softPop, slideUp } from "./motion";
import { RewardSummary } from "./reward-summary";
import { TinyMissionCard } from "./tiny-mission-card";

interface ResultPhaseProps {
    station: Station;
    result: RoundResult;
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
    onNext,
}: ResultPhaseProps) {

    return (
        <motion.div
            variants={softPop}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-2.5"
        >
            {/* ── Result sticker & message — sticker only, no icon ── */}
            <div className="flex flex-col items-center gap-1.5 text-center">
                <MoodSticker
                    mood={result.isCorrect ? "celebration" : "fail"}
                    size={100}
                    delay={0.1}
                />

                <Headline
                    className={
                        result.isCorrect
                            ? "text-secondary text-lg font-bold"
                            : "text-foreground/70 text-lg"
                    }
                >
                    {result.isCorrect
                        ? "إجابة صحيحة! ✨"
                        : "مش مرة.. بس محاولة حلوة! 💪"}
                </Headline>

                {/* Correct answer reveal (wrong answers only) */}
                {!result.isCorrect && (
                    <div
                        className="
                            rounded-lg
                            border border-secondary/15
                            bg-secondary/6
                            px-3 py-1.5
                        "
                    >
                        <Muted className="text-xs">
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
                        rounded-lg
                        border border-primary/10
                        bg-primary/5
                        px-3 py-2
                        text-center
                    "
                >
                    <Muted className="text-xs leading-relaxed">
                        📝 {station.explanation}
                    </Muted>
                </motion.div>
            )}

            {/* ── Reward summary ── */}
            <RewardSummary result={result} />

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
                    : result.tinyMission
                        ? "عملت المهمة! يلا نكمل 🚀"
                        : "جرب تاني 💪"}
            </LanternButton>
        </motion.div>
    );
}

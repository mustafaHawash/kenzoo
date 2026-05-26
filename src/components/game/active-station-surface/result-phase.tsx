
"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

import { LanternButton } from "@/components/ui/lantern-button";
import { Headline, Muted } from "@/components/ui/typography";
import { MoodSticker } from "@/components/ui/mood-sticker";

import type { Station } from "@/types/station";
import type { RoundResult } from "@/types/session";

import { softPop, slideUp } from "./motion";
import { RewardSummary } from "./reward-summary";
import { TinyMissionCard } from "./tiny-mission-card";

/* ─── Varied result messages — same warm colloquial tone ─── */
const CORRECT_MESSAGES = [
    "صح جداً .. الله عليك 👏🏼",
    "إجابة صح! ذكاء وحش 🌟",
    "يا سلام! جواب على راس 🎯",
    "تمام يا بطل! كده ✨",
    "عرفتها! برافو عليك 💫",
    "صح! ده فهم كده 🏆",
    "ما شاء الله! إجابة مية المية 🌙",
    "يا حلو! صح كده 🪄",
] as const;

const WRONG_MESSAGES = [
    "تغلط اكتر .. تتعلم اكتر 💪",
    "مفيش مشكلة! المرة الجاية 🤍",
    "مش ضروري تبقى صح كل مرة 🌱",
    "الغلط جزء من الطريق .. كمّل 💫",
    "بص للناحية الحلوة: هتفتكرها دلوقتي 🌙",
    "عادي! اللي بيجرب بيغلط وبيتعلم ✨",
    "مش نهاية الدنيا .. يلا نكمل 🤗",
    "حاولت وبس ده شجاعة 💪",
] as const;

/** Pick a random message from the list */
function pickRandom<T extends readonly string[]>(messages: T): string {
    return messages[Math.floor(Math.random() * messages.length)];
}

/* ─── Countdown for wrong answers ─── */
const WRONG_ANSWER_COUNTDOWN_SECS = 3;

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
    const [countdown, setCountdown] = useState(
        result.isCorrect ? 0 : WRONG_ANSWER_COUNTDOWN_SECS,
    );
    const [canContinue, setCanContinue] = useState(result.isCorrect);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        // No countdown for correct answers
        if (result.isCorrect) return;

        let remaining = WRONG_ANSWER_COUNTDOWN_SECS;
        setCountdown(remaining);
        setCanContinue(false);

        timerRef.current = setInterval(() => {
            remaining -= 1;
            if (remaining <= 0) {
                setCountdown(0);
                setCanContinue(true);
                if (timerRef.current) clearInterval(timerRef.current);
                return;
            }
            setCountdown(remaining);
        }, 1000);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [result.isCorrect]);

    return (
        <motion.div
            variants={softPop}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-2.5"
        >
            {/* ── Result sticker & message ── */}
            <div className="flex flex-col items-center gap-1.5 text-center">
                <MoodSticker
                    mood={result.isCorrect ? "celebration" : "fail"}
                    size={160}
                    delay={0.1}
                />

                <Headline
                    className={
                        result.isCorrect
                            ? "text-secondary text-2xl font-bold"
                            : "text-foreground/70 text-2xl"
                    }
                >
                    {result.isCorrect
                        ? pickRandom(CORRECT_MESSAGES)
                        : pickRandom(WRONG_MESSAGES)}
                </Headline>

                {/* Correct answer reveal (wrong answers only) */}
                {!result.isCorrect && (
                    <div
                        className="
                            rounded-xl
                            border border-secondary/15
                            bg-secondary/6
                            px-4 py-2
                        "
                    >
                        <Muted className="text-[13px]">
                            الإجابة:{" "}
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
                        px-4 py-2.5
                        text-center
                    "
                >
                    <Muted className="text-[13px] leading-relaxed">
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

            {/* ── Next CTA with countdown ── */}
            <div className="relative">
                <LanternButton
                    onClick={onNext}
                    disabled={!canContinue}
                    className="w-full"
                >
                    {result.isCorrect
                        ? "يلا بينا ✨"
                        : countdown > 0
                            ? `اعمل المهمة... ${countdown}`
                            : result.tinyMission
                                ? "عملت المهمة! يلا نكمل 🚀"
                                : "يلا نكمل 💪"}
                </LanternButton>

                {/* Countdown ring overlay */}
                {!result.isCorrect && countdown > 0 && (
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-full">
                        <span className="text-xs font-medium text-secondary/50">
                            ⏳
                        </span>
                    </div>
                )}
            </div>
        </motion.div>
    );
}

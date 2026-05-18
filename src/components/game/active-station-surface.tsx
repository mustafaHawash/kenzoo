"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { CozyCard } from "@/components/ui/cozy-card";
import { LanternButton } from "@/components/ui/lantern-button";
import { Headline, Body, Label, Muted } from "@/components/ui/typography";

import type { Station, StationType } from "@/types/station";
import type { RoundResult } from "@/types/session";

/* ─── Props ─── */
interface ActiveStationSurfaceProps {
    station: Station;
    playerName: string;
    playerStars: number;
    onRoundComplete: (result: RoundResult) => void;
    onNextStation: () => void;
}

/* ─── Station type display config ─── */
const stationTypeMeta: Record<StationType, { emoji: string; label: string }> = {
    quiz: { emoji: "🤔", label: "سيــن وجيــم" },
    riddle: { emoji: "🗝️", label: "فـزورة .. حــزورة" },
    guess: { emoji: "💭", label: "يا ترى هتفتكر؟" },
    memory: { emoji: "📖", label: "ذكـرى حلـوة" },
    puzzle: { emoji: "🧩", label: "لغـز خفيـف" },
    treasure: { emoji: "🎁", label: "كنز غامض" },
    mystery: { emoji: "🔮", label: "اكتشف الغامض" },
    story: { emoji: "🕯️", label: "حكاية وروايـة" },
};

/* ─── Game phase ─── */
type GamePhase = "playing" | "revealing" | "result";

/* ─── Animation variants ─── */
const cardEnter = {
    initial: { opacity: 0, y: 24, scale: 0.97 },
    animate: {
        opacity: 1, y: 0, scale: 1,
        transition: { type: "spring" as const, stiffness: 280, damping: 24 },
    },
    exit: {
        opacity: 0, y: -16, scale: 0.98,
        transition: { duration: 0.2 },
    },
};

const choiceStagger = {
    hidden: { opacity: 0, x: 20 },
    visible: (i: number) => ({
        opacity: 1, x: 0,
        transition: { delay: i * 0.07, type: "spring" as const, stiffness: 300, damping: 25 },
    }),
};

const resultPop = {
    hidden: { opacity: 0, scale: 0.85 },
    visible: {
        opacity: 1, scale: 1,
        transition: { type: "spring" as const, stiffness: 260, damping: 20, delay: 0.1 },
    },
};

const shimmer = {
    initial: { backgroundPosition: "200% 0" },
    animate: {
        backgroundPosition: "-200% 0",
        transition: { duration: 1.8, repeat: Infinity, ease: "linear" as const },
    },
};

/* ═══════════════════════════════════════════════════════════
   ACTIVE STATION SURFACE
   ═══════════════════════════════════════════════════════════ */
export function ActiveStationSurface({
    station,
    playerName,
    playerStars,
    onRoundComplete,
    onNextStation,
}: ActiveStationSurfaceProps) {
    const [phase, setPhase] = useState<GamePhase>("playing");
    const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
    const [riddleInput, setRiddleInput] = useState("");
    const [showHint, setShowHint] = useState(false);
    const [roundResult, setRoundResult] = useState<RoundResult | null>(null);

    const meta = stationTypeMeta[station.type];
    const isQuiz = station.type === "quiz" && !!station.choices?.length;
    const canSubmit = isQuiz ? !!selectedChoice : riddleInput.trim().length > 0;

    /* ─── Submit answer ─── */
    const handleSubmit = useCallback(() => {
        const answer = isQuiz ? selectedChoice : riddleInput.trim();
        if (!answer) return;

        setPhase("revealing");

        const isCorrect = answer === station.answer;
        const result: RoundResult = {
            isCorrect,
            starsEarned: isCorrect ? station.reward.stars : 0,
            treasureUnlocked: isCorrect && station.reward.canUnlockTreasure,
            tinyMission: isCorrect
                ? station.tinyMissionPool[
                    Math.floor(Math.random() * station.tinyMissionPool.length)
                ]
                : undefined,
        };

        // Dramatic reveal pause
        setTimeout(() => {
            setRoundResult(result);
            setPhase("result");
            onRoundComplete(result);
        }, 1400);
    }, [isQuiz, selectedChoice, riddleInput, station, onRoundComplete]);

    /* ─── Next station ─── */
    const handleNext = useCallback(() => {
        setPhase("playing");
        setSelectedChoice(null);
        setRiddleInput("");
        setShowHint(false);
        setRoundResult(null);
        onNextStation();
    }, [onNextStation]);

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={phase}
                variants={cardEnter}
                initial="initial"
                animate="animate"
                exit="exit"
            >
                <CozyCard
                    className="
                        relative overflow-hidden
                        rounded-[32px]
                        p-7 sm:p-8
                    "
                >
                    {/* ═══ Ambient atmosphere ═══ */}
                    <div
                        className='
                            pointer-events-none absolute inset-0
                            bg-[radial-gradient(circle_at_top,rgba(246,208,140,0.12),transparent_60%)]
                        '
                    />
                    <div
                        className='
                            pointer-events-none absolute -top-3 -left-3
                            h-28 w-28 rounded-full
                            bg-[radial-gradient(circle,rgba(255,231,181,0.10),transparent_70%)]
                        '
                    />
                    <div
                        className='
                            pointer-events-none absolute -bottom-4 -right-4
                            h-24 w-24 rounded-full
                            bg-[radial-gradient(circle,rgba(230,201,140,0.06),transparent_70%)]
                        '
                    />

                    <div className="relative z-10 flex flex-col gap-7">
                        {/* ═══ Station type badge ═══ */}
                        <div className="flex justify-center">
                            <motion.div
                                initial={{ scale: 0.85, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
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

                        {/* ═══ Station title ═══ */}
                        <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 }}
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

                        {/* ═══ Question ═══ */}
                        <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
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

                            {/* Hint toggle */}
                            {station.hint && phase === "playing" && (
                                <div className="flex flex-col items-center gap-1.5">
                                    <AnimatePresence>
                                        {showHint && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                exit={{ opacity: 0, height: 0 }}
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
                                        onClick={() => setShowHint((v) => !v)}
                                        className="
                                            text-xs text-muted-foreground/60
                                            hover:text-muted-foreground
                                            transition-colors duration-200
                                        "
                                    >
                                        {showHint ? "إخفاء التلميح" : "👀 تلميح؟"}
                                    </button>
                                </div>
                            )}
                        </motion.div>

                        {/* ═══════════════════════════════════════════
                            🎮 PLAYING PHASE — Input area
                            ═══════════════════════════════════════════ */}
                        {phase === "playing" && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex flex-col gap-5"
                            >
                                {/* Quiz choices */}
                                {isQuiz && station.choices && (
                                    <div className="flex flex-col gap-3">
                                        {station.choices.map((choice, i) => {
                                            const isSelected = selectedChoice === choice;

                                            return (
                                                <motion.button
                                                    key={choice}
                                                    custom={i}
                                                    variants={choiceStagger}
                                                    initial="hidden"
                                                    animate="visible"
                                                    onClick={() => setSelectedChoice(choice)}
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
                                                                    shadow-[0_6px_24px_rgba(216,179,106,0.12)]
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
                                                    {/* Selected indicator glow */}
                                                    {isSelected && (
                                                        <motion.div
                                                            layoutId="choice-glow"
                                                            className="
                                                                absolute inset-0
                                                                bg-[radial-gradient(circle_at_center,rgba(246,208,140,0.08),transparent_70%)]
                                                            "
                                                        />
                                                    )}

                                                    <span className="relative z-10 text-foreground text-[15px] leading-relaxed">
                                                        {choice}
                                                    </span>
                                                </motion.button>
                                            );
                                        })}
                                    </div>
                                )}

                                {/* Riddle text input */}
                                {!isQuiz && (
                                    <div className="flex flex-col gap-3">
                                        <div
                                            className="
                                                relative
                                                rounded-2xl
                                                border border-border/40
                                                bg-surface-soft/60
                                                overflow-hidden
                                                transition-all duration-200
                                                focus-within:border-secondary/40
                                                focus-within:shadow-[0_6px_24px_rgba(216,179,106,0.08)]
                                            "
                                        >
                                            <input
                                                type="text"
                                                value={riddleInput}
                                                onChange={(e) => setRiddleInput(e.target.value)}
                                                placeholder="اكتب إجابتك هنا..."
                                                dir="rtl"
                                                className="
                                                    w-full bg-transparent
                                                    px-5 py-4
                                                    text-foreground text-[15px]
                                                    placeholder:text-muted-foreground/40
                                                    outline-none
                                                "
                                            />
                                        </div>
                                        <Muted className="text-xs text-center">
                                            ✍️ اكتب إجابتك وخلّي بالك من التلميح
                                        </Muted>
                                    </div>
                                )}

                                {/* Reward hint bar */}
                                <div
                                    className="
                                        flex items-center justify-between
                                        rounded-2xl
                                        border border-secondary/10
                                        bg-secondary/5
                                        px-4 py-3
                                    "
                                >
                                    <Muted className="text-xs">
                                        {station.reward.canUnlockTreasure
                                            ? "🗝️ شكلها فيها كنز"
                                            : "✨ محطة لطيفة"}
                                    </Muted>
                                    <Label className="text-secondary text-xs">
                                        +{station.reward.stars} ⭐
                                    </Label>
                                </div>

                                {/* Confirm CTA */}
                                <LanternButton
                                    disabled={!canSubmit}
                                    onClick={handleSubmit}
                                    className="w-full"
                                >
                                    تأكيد الاختيار ✨
                                </LanternButton>
                            </motion.div>
                        )}

                        {/* ═══════════════════════════════════════════
                            ⏳ REVEALING PHASE — Suspense
                            ═══════════════════════════════════════════ */}
                        {phase === "revealing" && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex flex-col items-center gap-6 py-6"
                            >
                                {/* Shimmer loading bar */}
                                <motion.div
                                    variants={shimmer}
                                    initial="initial"
                                    animate="animate"
                                    className="
                                        h-3 w-48 rounded-full
                                        bg-gradient-to-l
                                        from-secondary/10 via-secondary/30 to-secondary/10
                                        bg-[length:200%_100%]
                                    "
                                />

                                <Muted className="text-sm animate-pulse">
                                    🔮 بنشوف إجابتك...
                                </Muted>

                                {/* Floating dots */}
                                <div className="flex gap-2">
                                    {[0, 1, 2].map((i) => (
                                        <motion.div
                                            key={i}
                                            animate={{
                                                y: [0, -8, 0],
                                                opacity: [0.4, 1, 0.4],
                                            }}
                                            transition={{
                                                duration: 0.8,
                                                repeat: Infinity,
                                                delay: i * 0.2,
                                            }}
                                            className="h-2 w-2 rounded-full bg-secondary/50"
                                        />
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* ═══════════════════════════════════════════
                            🎉 RESULT PHASE — Outcome reveal
                            ═══════════════════════════════════════════ */}
                        {phase === "result" && roundResult && (
                            <motion.div
                                variants={resultPop}
                                initial="hidden"
                                animate="visible"
                                className="flex flex-col gap-6"
                            >
                                {/* Result icon & message */}
                                <div className="flex flex-col items-center gap-3 text-center">
                                    <motion.div
                                        initial={{ scale: 0, rotate: -20 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 260,
                                            damping: 15,
                                            delay: 0.1,
                                        }}
                                        className="text-5xl"
                                    >
                                        {roundResult.isCorrect ? "🌟" : "🌙"}
                                    </motion.div>

                                    <Headline
                                        className={
                                            roundResult.isCorrect
                                                ? "text-secondary text-2xl"
                                                : "text-foreground/70 text-2xl"
                                        }
                                    >
                                        {roundResult.isCorrect
                                            ? "إجابة صحيحة!"
                                            : "مش مرة.. بس محاولة حلوة!"}
                                    </Headline>

                                    {/* Correct answer reveal */}
                                    {!roundResult.isCorrect && (
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

                                {/* Explanation */}
                                {station.explanation && (
                                    <div
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
                                    </div>
                                )}

                                {/* Reward summary */}
                                <div
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
                                            {roundResult.isCorrect ? "⭐" : "🌙"}
                                        </span>
                                        <div className="flex flex-col">
                                            <Label className="text-foreground text-sm">
                                                {roundResult.isCorrect
                                                    ? `+${roundResult.starsEarned} نجوم`
                                                    : "محاولة قريبة"}
                                            </Label>
                                            <Muted className="text-[11px]">
                                                المجموع: {playerStars + roundResult.starsEarned} ⭐
                                            </Muted>
                                        </div>
                                    </div>

                                    {roundResult.treasureUnlocked && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{
                                                type: "spring",
                                                stiffness: 300,
                                                damping: 18,
                                                delay: 0.3,
                                            }}
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
                                </div>

                                {/* Tiny mission */}
                                {roundResult.tinyMission && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 }}
                                        className="
                                            rounded-2xl
                                            border border-primary/10
                                            bg-primary/6
                                            px-5 py-4
                                        "
                                    >
                                        <div className="flex items-start gap-3">
                                            <span className="text-lg mt-0.5">🎯</span>
                                            <div className="flex flex-col gap-1">
                                                <Label className="text-primary text-xs">
                                                    مهمة صغيرة!
                                                </Label>
                                                <Body className="text-foreground/80 text-sm leading-relaxed">
                                                    {roundResult.tinyMission.text}
                                                </Body>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Next CTA */}
                                <LanternButton
                                    onClick={handleNext}
                                    className="w-full"
                                >
                                    {roundResult.isCorrect
                                        ? "يلا المحطة الجاية 🚀"
                                        : "جرب تاني 💪"}
                                </LanternButton>
                            </motion.div>
                        )}
                    </div>
                </CozyCard>
            </motion.div>
        </AnimatePresence>
    );
}

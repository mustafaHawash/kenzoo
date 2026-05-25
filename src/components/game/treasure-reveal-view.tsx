
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { CozyCard } from "@/components/ui/cozy-card";
import { LanternButton } from "@/components/ui/lantern-button";
import { Headline, Muted, Body } from "@/components/ui/typography";

import type { TreasureRevealStyle } from "@/types/treasure";
import { useSound } from "@/hooks/useSound";

/* ─── SFX Paths ─── */
const SFX = {
    openStart: "/sounds/sfx/chimes-whoosh-OpenTreaasureStart.mp3",
    revealCommon: "/sounds/sfx/Gentle chime-CommonTreasureReveal.mp3",
    revealRare: "/sounds/sfx/Sparkle + tone - RareTreasureReveal.mp3",
    revealLegendary: "/sounds/sfx/Magic-Reveal-LegendaryTreasureReveal.mp3",
} as const;

/* ═══════════════════════════════════════════════════════════
    TYPES
    ═══════════════════════════════════════════════════════════ */

export type TreasureRevealData = {
    treasureId: string;
    emoji: string;
    title: string;
    flavor: string;
    description: string;
    rarity: "common" | "rare" | "legendary";
    starsConsumed: number;
    reward: {
        type: string;
        starsAmount?: number;
        titleText?: string;
        message?: string;
    };
    awardedTitle: string | null;
    revealStyle: TreasureRevealStyle;
};

type RevealPhase = "closed" | "opening" | "revealed";

interface TreasureRevealViewProps {
    data: TreasureRevealData;
    onContinue: () => void;
    /** Optional hooks for sound/FX integration — no audio implementation yet */
    onOpenStart?: () => void;
    onReveal?: () => void;
    onComplete?: () => void;
}

/* ═══════════════════════════════════════════════════════════
    RARITY CONFIG
    ═══════════════════════════════════════════════════════════ */

const RARITY_CONFIG = {
    common: {
        label: "عادي",
        glowColor: "rgba(246,208,140,0.15)",
        badgeClass: "bg-secondary/10 text-secondary/70 border-secondary/20",
        emojiScale: 1,
        revealDuration: 1200,
    },
    rare: {
        label: "نادر ★",
        glowColor: "rgba(168,85,247,0.18)",
        badgeClass: "bg-purple-500/20 text-purple-300 border-purple-500/30",
        emojiScale: 1.05,
        revealDuration: 1500,
    },
    legendary: {
        label: "أسطوري ✦",
        glowColor: "rgba(245,158,11,0.22)",
        badgeClass: "bg-amber-500/20 text-amber-300 border-amber-500/30",
        emojiScale: 1.12,
        revealDuration: 1800,
    },
} as const;

/* ═══════════════════════════════════════════════════════════
    REWARD TEXT HELPER
    ═══════════════════════════════════════════════════════════ */

function rewardText(reward: TreasureRevealData["reward"]): string {
    switch (reward.type) {
        case "stars": return `+${reward.starsAmount ?? 0} نجوم`;
        case "double-stars": return "نجوم مزدوجة ⭐⭐";
        case "bonus-turn": return "جولة إضافية 🎯";
        case "title": return reward.titleText ?? "لقب جديد 👑";
        case "wisdom": return reward.message ?? "حكمة خاصة 💡";
        case "secret": return "سر مخفي 🤫";
        case "atmosphere": return "لمسة سحرية ✨";
        case "real-gift": return "هدية حقيقية 🎁";
        default: return "مفاجأة";
    }
}

/* ═══════════════════════════════════════════════════════════
    SUSPENSE MESSAGES — shown during "opening" phase
    ═══════════════════════════════════════════════════════════ */

const SUSPENSE_MESSAGES = [
    "🗝️ الكنز بيتفتح...",
    "✨ حاجة غريبة طلعت...",
    "🌙 الليلة مخبية مفاجأة...",
    "🔮 سر بيظهر...",
    "💫 لحظة... فيه حاجة بتلمع...",
];

function pickSuspenseMessage(): string {
    return SUSPENSE_MESSAGES[Math.floor(Math.random() * SUSPENSE_MESSAGES.length)];
}

/* ═══════════════════════════════════════════════════════════
    CINEMATIC REVEAL — slow glow burst, dramatic scale
    ═══════════════════════════════════════════════════════════ */

function CinematicReveal({
    data,
    phase,
    config,
    onContinue,
}: {
    data: TreasureRevealData;
    phase: RevealPhase;
    config: typeof RARITY_CONFIG.common;
    onContinue: () => void;
}) {
    return (
        <AnimatePresence mode="wait">
            {phase === "opening" && (
                <motion.div
                    key="opening"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center gap-6 py-8"
                >
                    {/* Pulsing glow orb */}
                    <motion.div
                        animate={{
                            scale: [0.8, 1.3, 1],
                            opacity: [0.3, 0.8, 0.5],
                        }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                        className="h-24 w-24 rounded-full"
                        style={{
                            background: `radial-gradient(circle, ${config.glowColor}, transparent 70%)`,
                        }}
                    />
                    <Muted className="text-sm animate-pulse">
                        {pickSuspenseMessage()}
                    </Muted>
                    <div className="flex gap-2">
                        {[0, 1, 2].map((i) => (
                            <motion.div
                                key={i}
                                animate={{ y: [0, -6, 0], opacity: [0.3, 0.9, 0.3] }}
                                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.25, ease: "easeInOut" as const }}
                                className="h-2 w-2 rounded-full bg-secondary/40"
                            />
                        ))}
                    </div>
                </motion.div>
            )}

            {phase === "revealed" && (
                <motion.div
                    key="revealed"
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col items-center gap-5 w-full"
                >
                    {/* Glow burst behind emoji */}
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 2.5, opacity: [0, 0.6, 0.2] }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="absolute h-20 w-20 rounded-full pointer-events-none"
                        style={{
                            background: `radial-gradient(circle, ${config.glowColor}, transparent 70%)`,
                        }}
                    />
                    <motion.span
                        initial={{ scale: 0.3, rotate: -15 }}
                        animate={{ scale: config.emojiScale, rotate: 0 }}
                        transition={{ delay: 0.2, duration: 0.5, type: "spring", stiffness: 180 }}
                        className="text-6xl relative"
                    >
                        {data.emoji}
                    </motion.span>

                    <RarityBadge rarity={data.rarity} config={config} />
                    <Headline className="text-primary text-xl text-center">{data.title}</Headline>
                    <Muted className="text-sm text-center italic opacity-60">{data.flavor}</Muted>
                    <RewardCard data={data} />
                    <LanternButton onClick={onContinue} className="w-full">متابعة ✨</LanternButton>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

/* ═══════════════════════════════════════════════════════════
    FLIP-CARD REVEAL — card flip from mystery back to reward front
    ═══════════════════════════════════════════════════════════ */

function FlipCardReveal({
    data,
    phase,
    config,
    onContinue,
}: {
    data: TreasureRevealData;
    phase: RevealPhase;
    config: typeof RARITY_CONFIG.common;
    onContinue: () => void;
}) {
    const isFlipped = phase === "revealed";

    return (
        <div className="w-full perspective-[800px]">
            <motion.div
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-full"
                style={{ transformStyle: "preserve-3d" }}
            >
                {/* BACK — Mystery side */}
                <div
                    className="flex flex-col items-center gap-5 py-6"
                    style={{ backfaceVisibility: "hidden" }}
                >
                    {phase === "opening" && (
                        <>
                            <motion.div
                                animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.9, 0.5] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" as const }}
                                className="text-5xl"
                            >
                                🎴
                            </motion.div>
                            <Muted className="text-sm animate-pulse">{pickSuspenseMessage()}</Muted>
                        </>
                    )}
                </div>

                {/* FRONT — Revealed side */}
                <motion.div
                    initial={false}
                    animate={{ opacity: isFlipped ? 1 : 0 }}
                    className="absolute inset-0 flex flex-col items-center gap-4 pt-2"
                    style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                >
                    <motion.span
                        initial={{ scale: 0.5 }}
                        animate={{ scale: config.emojiScale }}
                        transition={{ delay: 0.3, duration: 0.4, type: "spring", stiffness: 200 }}
                        className="text-5xl"
                    >
                        {data.emoji}
                    </motion.span>
                    <RarityBadge rarity={data.rarity} config={config} />
                    <Headline className="text-primary text-lg text-center">{data.title}</Headline>
                    <RewardCard data={data} compact />
                    <LanternButton onClick={onContinue} className="w-full mt-1">متابعة ✨</LanternButton>
                </motion.div>
            </motion.div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════
    MYSTERY REVEAL — fog dissolving into clarity
    ═══════════════════════════════════════════════════════════ */

function MysteryReveal({
    data,
    phase,
    config,
    onContinue,
}: {
    data: TreasureRevealData;
    phase: RevealPhase;
    config: typeof RARITY_CONFIG.common;
    onContinue: () => void;
}) {
    return (
        <AnimatePresence mode="wait">
            {phase === "opening" && (
                <motion.div
                    key="fog"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, filter: "blur(12px)" }}
                    transition={{ duration: 0.8 }}
                    className="flex flex-col items-center gap-5 py-8"
                >
                    {/* Fog layers */}
                    <div className="relative h-20 w-20">
                        <motion.div
                            animate={{ opacity: [0.3, 0.7, 0.3], scale: [0.9, 1.1, 0.9] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" as const }}
                            className="absolute inset-0 rounded-full bg-gradient-to-br from-secondary/20 via-transparent to-secondary/10 blur-md"
                        />
                        <motion.div
                            animate={{ opacity: [0.5, 0.8, 0.5], scale: [1, 1.15, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" as const, delay: 0.3 }}
                            className="absolute inset-2 rounded-full bg-gradient-to-tl from-secondary/15 via-transparent to-secondary/8 blur-sm"
                        />
                        <motion.span
                            animate={{ opacity: [0.4, 0.8, 0.4] }}
                            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" as const }}
                            className="absolute inset-0 flex items-center justify-center text-3xl"
                        >
                            🌫️
                        </motion.span>
                    </div>
                    <Muted className="text-sm animate-pulse">{pickSuspenseMessage()}</Muted>
                </motion.div>
            )}

            {phase === "revealed" && (
                <motion.div
                    key="clear"
                    initial={{ opacity: 0, filter: "blur(8px)" }}
                    animate={{ opacity: 1, filter: "blur(0px)" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="flex flex-col items-center gap-5 w-full"
                >
                    <motion.span
                        initial={{ scale: 0.6, opacity: 0 }}
                        animate={{ scale: config.emojiScale, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5, type: "spring", stiffness: 160 }}
                        className="text-6xl"
                    >
                        {data.emoji}
                    </motion.span>
                    <RarityBadge rarity={data.rarity} config={config} />
                    <Headline className="text-primary text-xl text-center">{data.title}</Headline>
                    <Muted className="text-sm text-center italic opacity-60">{data.flavor}</Muted>
                    <RewardCard data={data} />
                    <LanternButton onClick={onContinue} className="w-full">متابعة ✨</LanternButton>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

/* ═══════════════════════════════════════════════════════════
    SHARED SUB-COMPONENTS
    ═══════════════════════════════════════════════════════════ */

function RarityBadge({
    rarity,
    config,
}: {
    rarity: TreasureRevealData["rarity"];
    config: typeof RARITY_CONFIG.common;
}) {
    return (
        <div className={`rounded-full px-4 py-1 text-xs font-medium border ${config.badgeClass}`}>
            {config.label}
        </div>
    );
}

function RewardCard({
    data,
    compact = false,
}: {
    data: TreasureRevealData;
    compact?: boolean;
}) {
    return (
        <div className={`flex flex-col gap-2 w-full rounded-xl border border-secondary/15 bg-card/50 px-5 backdrop-blur-sm ${compact ? "py-3" : "py-4"}`}>
            {/* Stars consumed */}
            <div className="flex justify-between items-center">
                <Muted className="text-xs">⭐ التكلفة</Muted>
                <span className="text-sm text-secondary/80">-{data.starsConsumed} نجوم</span>
            </div>
            {/* Reward */}
            <div className="flex justify-between items-center">
                <Muted className="text-xs">🎁 المكافأة</Muted>
                <span className="text-sm text-primary">{rewardText(data.reward)}</span>
            </div>
            {/* Awarded title */}
            {data.awardedTitle && (
                <div className="flex justify-between items-center">
                    <Muted className="text-xs">🏅 اللقب</Muted>
                    <span className="text-sm text-amber-300">{data.awardedTitle}</span>
                </div>
            )}
            {/* Description (non-compact only) */}
            {!compact && (
                <Muted className="text-xs leading-relaxed opacity-40 mt-1">{data.description}</Muted>
            )}
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════
    MAIN COMPONENT — TreasureRevealView
    ═══════════════════════════════════════════════════════════ */

/**
 * TreasureRevealView — suspenseful treasure reveal experience.
 *
 * Three reveal styles:
 *   - "cinematic": Slow glow burst with dramatic scale-in
 *   - "flip-card": Card flip from mystery back to reward front
 *   - "mystery": Fog dissolving into clarity
 *
 * Three UI phases:
 *   - "closed":   Not visible (parent controls visibility)
 *   - "opening":  Suspense animation — no reward details shown
 *   - "revealed": Full reward/rarity reveal with continue button
 *
 * Sound hooks (onOpenStart, onReveal, onComplete) are prepared
 * but do NOT implement audio — ready for future integration.
 */
export function TreasureRevealView({
    data,
    onContinue,
    onOpenStart,
    onReveal,
    onComplete,
}: TreasureRevealViewProps) {
    const [phase, setPhase] = useState<RevealPhase>("closed");
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const config = RARITY_CONFIG[data.rarity];

    // Sound effects
    const sfxOpenStart = useSound(SFX.openStart, { volume: 0.5 });
    const sfxRevealCommon = useSound(SFX.revealCommon, { volume: 0.6 });
    const sfxRevealRare = useSound(SFX.revealRare, { volume: 0.6 });
    const sfxRevealLegendary = useSound(SFX.revealLegendary, { volume: 0.7 });


    // Start the opening animation on mount
    useEffect(() => {
        sfxOpenStart.play();
        onOpenStart?.();
        setPhase("opening");

        timeoutRef.current = setTimeout(() => {
            // Play rarity-specific reveal sound
            if (data.rarity === "legendary") sfxRevealLegendary.play();
            else if (data.rarity === "rare") sfxRevealRare.play();
            else sfxRevealCommon.play();

            onReveal?.();
            setPhase("revealed");
        }, config.revealDuration);

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const handleContinue = useCallback(() => {
        onComplete?.();
        onContinue();
    }, [onContinue, onComplete]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
        >
            <CozyCard className="relative overflow-hidden rounded-[32px] p-7 sm:p-8">
                {/* Ambient glow — intensity varies by rarity */}
                <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                        background: `radial-gradient(circle at center, ${config.glowColor}, transparent 60%)`,
                    }}
                />

                <div className="relative z-10 flex flex-col items-center gap-4">
                    {data.revealStyle === "cinematic" && (
                        <CinematicReveal
                            data={data}
                            phase={phase}
                            config={config}
                            onContinue={handleContinue}
                        />
                    )}
                    {data.revealStyle === "flip-card" && (
                        <FlipCardReveal
                            data={data}
                            phase={phase}
                            config={config}
                            onContinue={handleContinue}
                        />
                    )}
                    {data.revealStyle === "mystery" && (
                        <MysteryReveal
                            data={data}
                            phase={phase}
                            config={config}
                            onContinue={handleContinue}
                        />
                    )}
                </div>
            </CozyCard>
        </motion.div>
    );
}


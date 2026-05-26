
"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { CozyCard } from "@/components/ui/cozy-card";
import { LanternButton } from "@/components/ui/lantern-button";
import { Headline, Muted, Body } from "@/components/ui/typography";
import Image from "next/image";

import type { TreasureRevealStyle } from "@/types/treasure";
import { useSound } from "@/hooks/useSound";
import { soundAssets, stickerAssets } from "@/assets";

/* ─── SFX Paths ─── */
const SFX = {
    openStart: soundAssets.treasureOpenStart,
    revealCommon: soundAssets.treasureRevealCommon,
    revealRare: soundAssets.treasureRevealRare,
    revealLegendary: soundAssets.treasureRevealLegendary,
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
        glowColor: "rgba(246,208,140,0.18)",
        badgeClass: "bg-secondary/10 text-secondary/70 border-secondary/20",
        emojiScale: 1.1,
        revealDuration: 1200,
        showSparkles: false,
        showConfetti: false,
        shimmerIntensity: 0.3,
    },
    rare: {
        label: "نادر ★",
        glowColor: "rgba(56,189,248,0.25)",
        badgeClass: "bg-sky-500/20 text-sky-200 border-sky-500/30",
        emojiScale: 1.2,
        revealDuration: 1500,
        showSparkles: true,
        showConfetti: false,
        shimmerIntensity: 0.5,
    },
    legendary: {
        label: "أسطوري ✦",
        glowColor: "rgba(245,158,11,0.35)",
        badgeClass: "bg-amber-500/20 text-amber-300 border-amber-500/30",
        emojiScale: 1.35,
        revealDuration: 2000,
        showSparkles: true,
        showConfetti: true,
        shimmerIntensity: 0.8,
    },
} as const;

type RarityConfig = (typeof RARITY_CONFIG)[keyof typeof RARITY_CONFIG];

/* ═══════════════════════════════════════════════════════════
    CONFETTI PARTICLES — celebratory burst for legendary treasures
    ═══════════════════════════════════════════════════════════ */

const CONFETTI_COLORS = [
    "#F59E0B", "#FBBF24", "#FDE68A",
    "#EF4444", "#F97316",
    "#8B5CF6", "#EC4899",
    "#10B981", "#3B82F6",
];

function ConfettiBurst() {
    const particles = useMemo(() =>
        Array.from({ length: 24 }, (_, i) => ({
            id: i,
            x: 50 + (((i * 7 + 3) % 11) - 5) * 6,
            yTarget: 20 + ((i * 13 + 7) % 60),
            delay: ((i * 17 + 5) % 10) * 0.04,
            duration: 1.2 + ((i * 11 + 3) % 8) * 0.1,
            color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
            size: 4 + ((i * 9 + 2) % 6),
            rotation: ((i * 23 + 11) % 360),
            drift: (((i * 19 + 7) % 11) - 5) * 8,
        }))
    , []);

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    initial={{
                        x: "50%",
                        y: "50%",
                        scale: 0,
                        opacity: 1,
                        rotate: 0,
                    }}
                    animate={{
                        x: `${p.x + p.drift}%`,
                        y: ["50%", `${p.yTarget}%`],
                        scale: [0, 1.2, 0.8],
                        opacity: [1, 1, 0],
                        rotate: p.rotation + 720,
                    }}
                    transition={{
                        duration: p.duration,
                        delay: p.delay,
                        ease: "easeOut",
                    }}
                    className="absolute rounded-sm"
                    style={{
                        width: p.size,
                        height: p.size * 0.6,
                        backgroundColor: p.color,
                        borderRadius: "2px",
                    }}
                />
            ))}
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════
    SPARKLE PARTICLES — twinkling stars for rare+ treasures
    ═══════════════════════════════════════════════════════════ */

function SparkleRing({ color }: { color: string }) {
    const sparkles = useMemo(() =>
        Array.from({ length: 12 }, (_, i) => ({
            id: i,
            angle: (i / 12) * 360,
            delay: i * 0.08,
            size: 3 + ((i * 7 + 3) % 4),
        }))
    , [color]);

    return (
        <div className="absolute inset-0 pointer-events-none z-10">
            {sparkles.map((s) => (
                <motion.div
                    key={s.id}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                        opacity: [0, 1, 0],
                        scale: [0, 1.5, 0],
                    }}
                    transition={{
                        duration: 1.5,
                        delay: s.delay,
                        repeat: Infinity,
                        repeatDelay: 0.5,
                        ease: "easeInOut",
                    }}
                    className="absolute"
                    style={{
                        left: `${50 + 28 * Math.cos((s.angle * Math.PI) / 180)}%`,
                        top: `${50 + 28 * Math.sin((s.angle * Math.PI) / 180)}%`,
                        width: s.size,
                        height: s.size,
                        borderRadius: "50%",
                        backgroundColor: color,
                        boxShadow: `0 0 ${s.size * 2}px ${color}`,
                    }}
                />
            ))}
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════
    SHIMMER OVERLAY — subtle glow sweep during opening
    ═══════════════════════════════════════════════════════════ */

function ShimmerOverlay({ intensity }: { intensity: number }) {
    return (
        <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "200%" }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 pointer-events-none z-5"
            style={{
                background: `linear-gradient(105deg, transparent 30%, rgba(255,255,255,${intensity}) 50%, transparent 70%)`,
            }}
        />
    );
}

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
        case "bonus-life": return "فرصة إضافية ❤️";
        case "double-life": return "فرصتين إضافيتين ❤️❤️";
        case "retry": return "إعادة المحاولة 🔄";
        case "shield": return "درع حماية 🛡️";
        case "easy-next": return "السؤال الجاي أسهل 🌱";
        case "extra-star": return "نجممة خفية ⭐";
        case "skip-fail": return "تخطي الخطأ ⏭️";
        case "funny": return "مفاجأة مضحكة 😄";
        case "cozy": return "دفء وراحة ☕";
        case "lucky": return "حظ سعيد 🍀";
        case "spiritual": return "بركة وروحانية 📿";
        case "emotional": return "لحظة مؤثرة 🤍";
        case "physical": return "نشاط وحركة 💪";
        case "comfort": return "راحة وسكينة 🍃";
        case "rare-moment": return "لحظة نادرة 👑";
        case "mystic": return "سر غامض 🗝️";
        case "magical": return "سحر حقيقي 🪄";
        case "epic": return "لحظة أسطورية 🏆";
        case "legendary": return "كنز أسطوري ✦";
        case "hidden": return "سر مخفي 🌑";
        case "peaceful": return "سلام وأمان 🕊️";
        case "smart": return "لمعة ذكاء 🧠";
        case "mysterious": return "غموض مريب 🌌";
        case "celebration": return "احتفال 🎊";
        case "destiny": return "قدر مكتوب 🌠";
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

function simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
    }
    return Math.abs(hash);
}

function pickSuspenseMessage(treasureId: string): string {
    return SUSPENSE_MESSAGES[simpleHash(treasureId) % SUSPENSE_MESSAGES.length];
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
    config: RarityConfig;
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
                    {/* Shimmer sweep during opening */}
                    <ShimmerOverlay intensity={config.shimmerIntensity} />
                    {/* Pulsing glow orb with Kenzoo card */}
                    <div className="relative flex items-center justify-center">
                        <motion.div
                            animate={{
                                scale: [0.8, 1.3, 1],
                                opacity: [0.3, 0.8, 0.5],
                            }}
                            transition={{ duration: 1.5, ease: "easeInOut" }}
                            className="absolute h-28 w-28 rounded-full"
                            style={{
                                background: `radial-gradient(circle, ${config.glowColor}, transparent 70%)`,
                            }}
                        />
                        <motion.div
                            animate={{ scale: [1, 1.05, 1], opacity: [0.7, 1, 0.7] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            className="relative h-20 w-20"
                        >
                            <Image
                                src={stickerAssets.treasureBack[0]}
                                alt=""
                                fill
                                className="object-contain"
                            />
                        </motion.div>
                    </div>
                    <Muted className="text-sm animate-pulse">
                        {pickSuspenseMessage(data.treasureId)}
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
                    {/* Confetti burst for legendary */}
                    {config.showConfetti && <ConfettiBurst />}
                    {/* Sparkle ring for rare+ */}
                    {config.showSparkles && <SparkleRing color={data.rarity === "legendary" ? "#F59E0B" : "#38BDF8"} />}
                    {/* Glow burst behind emoji */}
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 3, opacity: [0, 0.7, 0.25] }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        className="absolute h-24 w-24 rounded-full pointer-events-none"
                        style={{
                            background: `radial-gradient(circle, ${config.glowColor}, transparent 70%)`,
                        }}
                    />
                    <motion.span
                        initial={{ scale: 0.3, rotate: -15 }}
                        animate={{ scale: config.emojiScale, rotate: 0 }}
                        transition={{ delay: 0.2, duration: 0.6, type: "spring", stiffness: 180 }}
                        className="text-7xl relative"
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
    config: RarityConfig;
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
                            <ShimmerOverlay intensity={config.shimmerIntensity} />
                            <motion.div
                                animate={{ scale: [1, 1.05, 1], opacity: [0.7, 1, 0.7] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" as const }}
                                className="relative h-20 w-20"
                            >
                                <Image
                                    src={stickerAssets.treasureBack[0]}
                                    alt=""
                                    fill
                                    className="object-contain"
                                />
                            </motion.div>
                            <Muted className="text-sm animate-pulse">{pickSuspenseMessage(data.treasureId)}</Muted>
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
                    {config.showConfetti && <ConfettiBurst />}
                    {config.showSparkles && <SparkleRing color={data.rarity === "legendary" ? "#F59E0B" : "#38BDF8"} />}
                    <motion.span
                        initial={{ scale: 0.5 }}
                        animate={{ scale: config.emojiScale, rotate: 0 }}
                        transition={{ delay: 0.3, duration: 0.5, type: "spring", stiffness: 200 }}
                        className="text-6xl"
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
    config: RarityConfig;
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
                    {/* Fog layers with Kenzoo card */}
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
                        <motion.div
                            animate={{ opacity: [0.6, 1, 0.6] }}
                            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" as const }}
                            className="absolute inset-0"
                        >
                            <Image
                                src={stickerAssets.treasureBack[0]}
                                alt=""
                                fill
                                className="object-contain"
                            />
                        </motion.div>
                    </div>
                    <ShimmerOverlay intensity={config.shimmerIntensity} />
                    <Muted className="text-sm animate-pulse">{pickSuspenseMessage(data.treasureId)}</Muted>
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
                    {config.showConfetti && <ConfettiBurst />}
                    {config.showSparkles && <SparkleRing color={data.rarity === "legendary" ? "#F59E0B" : "#38BDF8"} />}
                    <motion.span
                        initial={{ scale: 0.6, opacity: 0 }}
                        animate={{ scale: config.emojiScale, opacity: 1, rotate: 0 }}
                        transition={{ delay: 0.2, duration: 0.6, type: "spring", stiffness: 160 }}
                        className="text-7xl"
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
    config,
}: {
    rarity: TreasureRevealData["rarity"];
    config: RarityConfig;
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
    const [phase, setPhase] = useState<RevealPhase>("opening");
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
            <CozyCard className="relative overflow-hidden rounded-[24px] p-5 sm:p-6">
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


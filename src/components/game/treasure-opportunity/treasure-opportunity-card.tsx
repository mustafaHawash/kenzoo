"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { CozyCard } from "@/components/ui/cozy-card";
import { LanternButton } from "@/components/ui/lantern-button";
import { Headline, Label, Muted, Body } from "@/components/ui/typography";

import type { Treasure, TreasureRarity } from "@/types/treasure";

import {
    treasureCardEntrance,
    chestFloat,
    sparkle,
    rewardReveal,
    starCountPulse,
    glowRing,
    rareGlowRing,
    legendaryGlowRing,
    rareChestFloat,
    legendaryChestFloat,
    rareRewardReveal,
    legendaryRewardReveal,
    legendaryEmojiPulse,
} from "./motion";

/* ─── Rarity config ─── */
const RARITY_CONFIG: Record<TreasureRarity, {
    chestIcon: string;
    headline: string;
    subtitle: string;
    openLabel: string;
    glowVariant: typeof glowRing;
    floatVariant: typeof chestFloat;
    revealVariant: typeof rewardReveal;
    revealDuration: number;
    glowColor: string;
    glowSize: string;
    borderAccent: string;
    shimmerWidth: string;
    sparkleCount: number;
}> = {
    common: {
        chestIcon: "🎁",
        headline: "فرصة كنز!",
        subtitle: "عندك كنز ممكن تفتحه! هل تنفق نجومك عشان تكتشف اللي جوا؟",
        openLabel: "افتح الكنز 🗝️",
        glowVariant: glowRing,
        floatVariant: chestFloat,
        revealVariant: rewardReveal,
        revealDuration: 900,
        glowColor: "rgba(246,208,140,0.20)",
        glowSize: "h-20 w-20",
        borderAccent: "border-secondary/12",
        shimmerWidth: "w-44",
        sparkleCount: 3,
    },
    rare: {
        chestIcon: "✨",
        headline: "كنز نادر!",
        subtitle: "كنز نادر ظهر! محتاج نجوم أكتر بس المكافأة تستاهل...",
        openLabel: "افتح الكنز النادر 🗝️",
        glowVariant: rareGlowRing,
        floatVariant: rareChestFloat,
        revealVariant: rareRewardReveal,
        revealDuration: 1100,
        glowColor: "rgba(168,130,255,0.22)",
        glowSize: "h-24 w-24",
        borderAccent: "border-primary/15",
        shimmerWidth: "w-52",
        sparkleCount: 4,
    },
    legendary: {
        chestIcon: "👑",
        headline: "كنز أسطوري!",
        subtitle: "كنز أسطوري نادر بيظهر مرة واحدة! هل هتخاطر بكل نجومك؟",
        openLabel: "افتح الكنز الأسطوري 👑",
        glowVariant: legendaryGlowRing,
        floatVariant: legendaryChestFloat,
        revealVariant: legendaryRewardReveal,
        revealDuration: 1400,
        glowColor: "rgba(246,180,80,0.30)",
        glowSize: "h-28 w-28",
        borderAccent: "border-secondary/25",
        shimmerWidth: "w-60",
        sparkleCount: 5,
    },
};

/* ─── Props ─── */
interface TreasureOpportunityCardProps {
    playerStars: number;
    treasure: Treasure | null;
    /** The randomly picked title for "title" reward type (set when treasure is opened) */
    awardedTitle?: string | null;
    onOpenTreasure: () => void;
    onDismiss: () => void;
}

/* ─── Internal phases ─── */
type TreasurePhase = "opportunity" | "revealing" | "revealed";

/**
 * TreasureOpportunityCard — the first treasure meta progression layer.
 *
 * Flow:
 *   1. Opportunity: magical chest presentation, star cost, two CTAs
 *   2. Revealing: brief cinematic pause (shimmer + floating sparkles)
 *   3. Revealed: the reward content with its emotional message
 *
 * Parent orchestrator owns: star spending, reward selection, show/hide logic.
 * This component owns: the three-phase visual flow, local animation state.
 *
 * Motion: calm, magical, cinematic. No aggressive popups. No flash.
 */
export function TreasureOpportunityCard({
    playerStars,
    treasure,
    awardedTitle,
    onOpenTreasure,
    onDismiss,
}: TreasureOpportunityCardProps) {
        const [phase, setPhase] = useState<TreasurePhase>("opportunity");

    // Reset phase during rendering when treasure.id changes
    const prevTreasureIdRef = useRef(treasure?.id);
    if (prevTreasureIdRef.current !== treasure?.id) {
        prevTreasureIdRef.current = treasure?.id;
        setPhase("opportunity");
    }


    const rarity = treasure?.rarity ?? "common";
    const config = RARITY_CONFIG[rarity];
    const starCost = treasure?.starsRequired ?? 3;
    const canAfford = playerStars >= starCost;

    const handleOpen = () => {
        if (!canAfford) return;
        setPhase("revealing");
        onOpenTreasure();
        setTimeout(() => setPhase("revealed"), config.revealDuration);
    };

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={phase}
                variants={treasureCardEntrance}
                initial="initial"
                animate="animate"
                exit="exit"
            >
                <CozyCard className="relative overflow-hidden rounded-[32px] p-7 sm:p-8">
                    {/* ═══ Ambient atmosphere (rarity-aware) ═══ */}
                    <div
                        className="pointer-events-none absolute inset-0"
                        style={{
                            background: rarity === "legendary"
                                ? "radial-gradient(circle at center, rgba(246,180,80,0.22), transparent 60%)"
                                : rarity === "rare"
                                    ? "radial-gradient(circle at center, rgba(168,130,255,0.14), transparent 60%)"
                                    : "radial-gradient(circle at center, rgba(246,208,140,0.15), transparent 60%)",
                        }}
                    />

                    <div className="relative z-10 flex flex-col items-center gap-6">
                        {/* ═══ Phase 1: OPPORTUNITY ═══ */}
                        {phase === "opportunity" && (
                            <div className="flex flex-col items-center gap-5 w-full">
                                <motion.div
                                    variants={config.glowVariant}
                                    animate="animate"
                                    className={`pointer-events-none absolute top-6 left-1/2 -translate-x-1/2 ${config.glowSize} rounded-full bg-[radial-gradient(circle,${config.glowColor},transparent_70%)]`}
                                />

                                <motion.div variants={config.floatVariant} animate="animate" className="text-5xl relative">
                                    {config.chestIcon}
                                    {Array.from({ length: config.sparkleCount }).map((_, i) => (
                                        <motion.span
                                            key={i}
                                            variants={sparkle(i)}
                                            animate="animate"
                                            className="absolute text-xs"
                                            style={{ top: `${-8 + i * 10}px`, left: `${-14 + i * 9}px` }}
                                        >
                                            ✨
                                        </motion.span>
                                    ))}
                                </motion.div>

                                <Headline className="text-secondary text-xl text-center">{config.headline}</Headline>

                                <Muted className="text-sm text-center max-w-[280px]">
                                    {config.subtitle}
                                </Muted>

                                <motion.div
                                    variants={starCountPulse}
                                    animate="animate"
                                    className="flex items-center gap-2 rounded-full border border-secondary/15 bg-secondary/8 px-4 py-2"
                                >
                                    <span className="text-sm">⭐</span>
                                    <Label className="text-secondary text-sm tabular-nums">{starCost} نجوم</Label>
                                </motion.div>

                                {playerStars < starCost && (
                                    <Muted className="text-xs text-center text-muted-foreground/60">
                                        محتاج {starCost - playerStars} نجوم كمان
                                    </Muted>
                                )}

                                <div className="flex flex-col gap-3 w-full mt-1">
                                    <LanternButton disabled={!canAfford} onClick={handleOpen} className="w-full">
                                        {config.openLabel}
                                    </LanternButton>
                                    <button
                                        onClick={onDismiss}
                                        className="
                                            w-full rounded-xl border border-border/30 bg-transparent
                                            px-5 py-3 text-muted-foreground text-sm
                                            transition-all duration-200
                                            hover:bg-surface-soft/60 hover:border-border/50
                                            active:scale-[0.98] outline-none
                                            focus-visible:ring-2 focus-visible:ring-secondary/30
                                        "
                                    >
                                        احتفظ بنجومي ✨
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* ═══ Phase 2: REVEALING ═══ */}
                        {phase === "revealing" && (
                            <div className="flex flex-col items-center gap-5 py-4">
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className={`h-2.5 ${config.shimmerWidth} rounded-full bg-gradient-to-l from-secondary/10 via-secondary/25 to-secondary/10 bg-[length:200%_100%]`}
                                    style={{ animation: "shimmer 1.6s linear infinite" }}
                                />
                                <Muted className="text-sm animate-pulse">
                                    {rarity === "legendary" ? "👑 الكنز الأسطوري بيتفتح..." : rarity === "rare" ? "✨ الكنز النادر بيتفتح..." : "🗝️ بيتفتح..."}
                                </Muted>
                                <div className="flex gap-2">
                                    {Array.from({ length: config.sparkleCount }).map((_, i) => (
                                        <motion.div
                                            key={i}
                                            animate={{ y: [0, -5, 0], opacity: [0.4, 0.9, 0.4] }}
                                            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" as const }}
                                            className={`h-1.5 w-1.5 rounded-full ${rarity === "legendary" ? "bg-secondary/60" : rarity === "rare" ? "bg-primary/50" : "bg-secondary/40"}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ═══ Phase 3: REVEALED ═══ */}
                        {phase === "revealed" && treasure && (
                            <motion.div
                                variants={config.revealVariant}
                                initial="initial"
                                animate="animate"
                                className="flex flex-col items-center gap-5 w-full"
                            >
                                {/* Emoji with legendary pulse */}
                                <motion.span
                                    variants={rarity === "legendary" ? legendaryEmojiPulse : undefined}
                                    animate={rarity === "legendary" ? "animate" : undefined}
                                    className={rarity === "legendary" ? "text-6xl" : rarity === "rare" ? "text-5xl" : "text-5xl"}
                                >
                                    {treasure.emoji}
                                </motion.span>

                                {/* Rarity badge */}
                                {treasure.rarity === "legendary" && (
                                    <div className="flex items-center gap-1.5 rounded-full border border-secondary/25 bg-secondary/15 px-3.5 py-1">
                                        <Label className="text-secondary text-xs font-medium">👑 أسطوري — بيظهر مرة واحدة!</Label>
                                    </div>
                                )}
                                {treasure.rarity === "rare" && (
                                    <div className="flex items-center gap-1.5 rounded-full border border-primary/18 bg-primary/10 px-3 py-1">
                                        <Label className="text-primary text-xs">✨ نادر!</Label>
                                    </div>
                                )}

                                <Headline className={rarity === "legendary" ? "text-secondary text-2xl text-center" : "text-secondary text-xl text-center"}>
                                    {treasure.title}
                                </Headline>
                                <Muted className="text-xs text-center italic text-muted-foreground/60">{treasure.flavor}</Muted>
                                <div className={`rounded-2xl border ${config.borderAccent} bg-secondary/6 px-5 py-4 text-center w-full`}>
                                    <Body className="text-foreground text-sm leading-relaxed">{treasure.description}</Body>
                                </div>

                                {/* Reward type indicator */}
                                {treasure.reward.type === "double-stars" && (
                                    <Muted className="text-xs text-center">⭐⭐ النجوم مضاعفة!</Muted>
                                )}
                                {treasure.reward.type === "bonus-turn" && (
                                    <Muted className="text-xs text-center">🎯 دور إضافي!</Muted>
                                )}
                                {treasure.reward.type === "title" && awardedTitle && (
                                    <Muted className="text-xs text-center">👑 لقب جديد: {awardedTitle}</Muted>
                                )}
                                {treasure.reward.type === "wisdom" && (
                                    <Muted className="text-xs text-center">💡 حكمة</Muted>
                                )}
                                {treasure.reward.type === "secret" && (
                                    <Muted className="text-xs text-center">🔮 سر مخفي</Muted>
                                )}
                                {treasure.reward.type === "atmosphere" && (
                                    <Muted className="text-xs text-center">✨ أجواء</Muted>
                                )}

                                <LanternButton onClick={onDismiss} className="w-full">يلا كمل 🚀</LanternButton>
                            </motion.div>
                        )}
                    </div>
                </CozyCard>
            </motion.div>
        </AnimatePresence>
    );
}
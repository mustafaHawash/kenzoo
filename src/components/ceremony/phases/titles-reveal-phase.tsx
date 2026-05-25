
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

import { Headline, Label, Muted } from "@/components/ui/typography";
import { MoodSticker } from "@/components/ui/mood-sticker";
import { iconAssets } from "@/assets";
import type { Player } from "@/types/player";
import type { TreasureRarity } from "@/types/treasure";

import { phaseEnter, dramaticReveal, staggerContainer, staggerItem } from "../ceremony-motion";

interface TitlesRevealPhaseProps {
    players: Player[];
    onContinue: () => void;
}

const RARITY_STYLE: Record<TreasureRarity, { border: string; bg: string; label: string; icon: string }> = {
    legendary: {
        border: "border-amber-400/30",
        bg: "bg-amber-400/10",
        label: "أسطوري",
        icon: "✦",
    },
    rare: {
        border: "border-sky-400/25",
        bg: "bg-sky-400/8",
        label: "نادر",
        icon: "◆",
    },
    common: {
        border: "border-secondary/15",
        bg: "bg-secondary/6",
        label: "عادي",
        icon: "○",
    },
};

type RevealItem = {
    playerId: string;
    playerName: string;
    type: "title" | "treasure";
    title?: string;
    rarity?: TreasureRarity;
    hiddenPoints?: number;
    starsConsumed?: number;
};

/**
 * Titles + Treasure Reveals — suspense pacing, reveal animations.
 *
 * Shows earned titles and treasure outcomes one by one.
 * Treasure star cost (hidden during gameplay) MAY appear here.
 * Uses dramatic reveal animations and themed icons.
 */
export function TitlesRevealPhase({ players, onContinue }: TitlesRevealPhaseProps) {
    // Build reveal items from all players
    const revealItems: RevealItem[] = players.flatMap((player) => {
        const items: RevealItem[] = [];

        // Titles
        for (const title of player.titles) {
            items.push({
                playerId: player.id,
                playerName: player.name,
                type: "title",
                title,
            });
        }

        // Treasures (now we can reveal rarity and hidden points)
        for (const treasure of player.openedTreasures) {
            items.push({
                playerId: player.id,
                playerName: player.name,
                type: "treasure",
                rarity: treasure.rarity,
                hiddenPoints: treasure.hiddenPoints,
                starsConsumed: treasure.starsConsumed,
            });
        }

        return items;
    });

    const [currentRevealIndex, setCurrentRevealIndex] = useState(0);
    const [showingAll, setShowingAll] = useState(false);

    // Auto-advance reveals with pacing
    useEffect(() => {
        if (showingAll) return;
        if (currentRevealIndex >= revealItems.length) {
            setShowingAll(true);
            return;
        }

        const timer = setTimeout(() => {
            setCurrentRevealIndex((i) => Math.min(i + 1, revealItems.length));
        }, 600);

        return () => clearTimeout(timer);
    }, [currentRevealIndex, showingAll, revealItems.length]);

    const visibleItems = showingAll ? revealItems : revealItems.slice(0, currentRevealIndex);

    return (
        <motion.div
            variants={phaseEnter}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex flex-col items-center gap-3 py-3"
        >
            {/* Section title */}
            <div className="flex flex-col items-center gap-1">
                <Image
                    src={iconAssets.treasure}
                    alt=""
                    width={24}
                    height={24}
                    className="object-contain opacity-60"
                />
                <Headline className="text-foreground text-lg font-bold">
                    كشف الكنوز والألقاب
                </Headline>
                <Muted className="text-xs">اللي كان مخفي... بقت حقيقة</Muted>
            </div>

            {/* Reveal items */}
            <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="flex flex-col gap-2 w-full"
            >
                <AnimatePresence>
                    {visibleItems.map((item, i) => (
                        <motion.div
                            key={`${item.playerId}-${item.type}-${i}`}
                            variants={dramaticReveal}
                            initial="hidden"
                            animate="visible"
                            className={`
                                relative overflow-hidden rounded-xl border
                                px-3 py-2.5
                                ${item.type === "treasure" && item.rarity
                                    ? `${RARITY_STYLE[item.rarity].border} ${RARITY_STYLE[item.rarity].bg}`
                                    : "border-primary/15 bg-primary/6"
                                }
                            `}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    {item.type === "treasure" && item.rarity ? (
                                        <Image
                                            src={item.rarity === "legendary" ? iconAssets.treasure : iconAssets.mainKey}
                                            alt=""
                                            width={16}
                                            height={16}
                                            className="object-contain"
                                        />
                                    ) : (
                                        <Image src={iconAssets.tulipSticker} alt="" width={16} height={16} className="object-contain" />
                                    )}
                                    <div className="flex flex-col">
                                        <Label className="text-foreground text-[11px] font-semibold">
                                            {item.playerName}
                                        </Label>
                                        <Muted className="text-[9px]">
                                            {item.type === "title"
                                                ? `لقب: ${item.title}`
                                                : `كنز ${item.rarity ? RARITY_STYLE[item.rarity].label : ""}`
                                            }
                                        </Muted>
                                    </div>
                                </div>

                                {/* Hidden points reveal (treasure only) */}
                                {item.type === "treasure" && item.hiddenPoints !== undefined && (
                                    <div className="flex items-center gap-1">
                                        <span className="text-[10px] text-muted-foreground/50">
                                            {RARITY_STYLE[item.rarity ?? "common"].icon}
                                        </span>
                                        <Label className="text-secondary text-[11px] font-bold">
                                            +{item.hiddenPoints}
                                        </Label>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>

            {/* Celebration sticker when all revealed */}
            {showingAll && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col items-center gap-3"
                >
                    <MoodSticker mood="celebration" size={120} delay={0.2} />

                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                        onClick={onContinue}
                        className="
                            rounded-full
                            border border-secondary/20
                            bg-secondary/8
                            px-6 py-2
                            text-secondary text-sm font-semibold
                            hover:bg-secondary/15 hover:border-secondary/30
                            active:scale-95
                            transition-all duration-200
                            backdrop-blur-sm
                        "
                    >
                        مين الفائز؟ 🏆
                    </motion.button>
                </motion.div>
            )}

            {/* Skip button during auto-reveal */}
            {!showingAll && (
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.6 }}
                    onClick={() => {
                        setCurrentRevealIndex(revealItems.length);
                        setShowingAll(true);
                    }}
                    className="text-muted-foreground/50 text-xs hover:text-muted-foreground transition-colors"
                >
                    تخطي ←
                </motion.button>
            )}
        </motion.div>
    );
}

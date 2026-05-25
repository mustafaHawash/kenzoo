
"use client";

import { motion } from "framer-motion";
import Image from "next/image";

import { Headline, Label, Muted } from "@/components/ui/typography";
import { iconAssets } from "@/assets";
import type { Player } from "@/types/player";
import type { TreasureRarity } from "@/types/treasure";

import { phaseEnter, staggerContainer, staggerItem } from "../ceremony-motion";

interface SessionSummaryPhaseProps {
    players: Player[];
    onContinue: () => void;
}

/** Compute aggregate stats from all players */
function computeStats(players: Player[]) {
    let totalStars = 0;
    let totalTreasures = 0;
    let legendaryCount = 0;
    let rareCount = 0;
    let totalTitles = 0;

    for (const player of players) {
        totalStars += player.stars;
        totalTreasures += player.treasures;
        totalTitles += player.titles.length;

        for (const t of player.openedTreasures) {
            if (t.rarity === "legendary") legendaryCount++;
            else if (t.rarity === "rare") rareCount++;
        }
    }

    return { totalStars, totalTreasures, legendaryCount, rareCount, totalTitles };
}

const RARITY_CONFIG: Record<TreasureRarity, { label: string; color: string; glow: string }> = {
    legendary: { label: "كنوز أسطورية", color: "text-amber-400", glow: "shadow-[0_0_20px_rgba(245,158,11,0.3)]" },
    rare: { label: "كنوز نادرة", color: "text-purple-400", glow: "shadow-[0_0_16px_rgba(168,85,247,0.2)]" },
    common: { label: "كنوز عادية", color: "text-secondary", glow: "" },
};

/**
 * Session Summary — mysterious + celebratory recap.
 *
 * Shows aggregate session statistics with themed icons.
 * Feels like opening a treasure chest of memories.
 */
export function SessionSummaryPhase({ players, onContinue }: SessionSummaryPhaseProps) {
    const stats = computeStats(players);

    return (
        <motion.div
            variants={phaseEnter}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex flex-col items-center gap-5 py-4"
        >
            {/* Section title */}
            <div className="flex flex-col items-center gap-1.5">
                <Image
                    src={iconAssets.treasureSymbol}
                    alt=""
                    width={28}
                    height={28}
                    className="object-contain opacity-60"
                />
                <Headline className="text-foreground text-lg font-bold">
                    ملخص الرحلة
                </Headline>
            </div>

            {/* Stats grid */}
            <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-2 gap-2.5 w-full max-w-xs"
            >
                {/* Legendary treasures */}
                {stats.legendaryCount > 0 && (
                    <motion.div
                        variants={staggerItem}
                        className={`
                            flex flex-col items-center gap-1
                            rounded-xl border border-amber-400/20
                            bg-amber-400/8
                            px-3 py-3
                            ${RARITY_CONFIG.legendary.glow}
                        `}
                    >
                        <Image src={iconAssets.treasure} alt="" width={20} height={20} className="object-contain" />
                        <Label className="text-amber-400 text-lg font-bold">{stats.legendaryCount}</Label>
                        <Muted className="text-[9px] text-amber-400/70">{RARITY_CONFIG.legendary.label}</Muted>
                    </motion.div>
                )}

                {/* Rare treasures */}
                {stats.rareCount > 0 && (
                    <motion.div
                        variants={staggerItem}
                        className={`
                            flex flex-col items-center gap-1
                            rounded-xl border border-purple-400/20
                            bg-purple-400/8
                            px-3 py-3
                            ${RARITY_CONFIG.rare.glow}
                        `}
                    >
                        <Image src={iconAssets.secondaryKey} alt="" width={20} height={20} className="object-contain" />
                        <Label className="text-purple-400 text-lg font-bold">{stats.rareCount}</Label>
                        <Muted className="text-[9px] text-purple-400/70">{RARITY_CONFIG.rare.label}</Muted>
                    </motion.div>
                )}

                {/* Total treasures */}
                <motion.div
                    variants={staggerItem}
                    className="
                        flex flex-col items-center gap-1
                        rounded-xl border border-secondary/15
                        bg-secondary/6
                        px-3 py-3
                    "
                >
                    <Image src={iconAssets.mainKey} alt="" width={20} height={20} className="object-contain" />
                    <Label className="text-secondary text-lg font-bold">{stats.totalTreasures}</Label>
                    <Muted className="text-[9px] text-secondary/70">كنوز مكتشفة</Muted>
                </motion.div>

                {/* Stars collected */}
                <motion.div
                    variants={staggerItem}
                    className="
                        flex flex-col items-center gap-1
                        rounded-xl border border-secondary/15
                        bg-secondary/6
                        px-3 py-3
                    "
                >
                    <Image src={iconAssets.starsSticker} alt="" width={20} height={20} className="object-contain" />
                    <Label className="text-secondary text-lg font-bold">{stats.totalStars}</Label>
                    <Muted className="text-[9px] text-secondary/70">نجوم مجمعة</Muted>
                </motion.div>

                {/* Titles earned */}
                {stats.totalTitles > 0 && (
                    <motion.div
                        variants={staggerItem}
                        className="
                            col-span-2
                            flex items-center justify-center gap-2
                            rounded-xl border border-primary/15
                            bg-primary/6
                            px-3 py-2.5
                        "
                    >
                        <Image src={iconAssets.tulipSticker} alt="" width={16} height={16} className="object-contain" />
                        <Label className="text-primary text-sm font-semibold">{stats.totalTitles} لقب مكتسب</Label>
                    </motion.div>
                )}
            </motion.div>

            {/* Continue CTA */}
            <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 0.5 }}
                onClick={onContinue}
                className="
                    mt-2 rounded-full
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
                كمل 🌙
            </motion.button>
        </motion.div>
    );
}

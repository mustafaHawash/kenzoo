
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

import { Headline, Label, Muted } from "@/components/ui/typography";
import { iconAssets } from "@/assets";
import type { PlayerFinalScore } from "@/lib/session-runtime/session-engine";

import { phaseEnter, staggerContainer, staggerItem } from "../ceremony-motion";

interface RankingRevealPhaseProps {
    finalScores: PlayerFinalScore[];
    onContinue: () => void;
}

const RANK_STYLE: Record<number, { border: string; bg: string; badge: string }> = {
    1: {
        border: "border-amber-400/30",
        bg: "bg-amber-400/10",
        badge: "🥇",
    },
    2: {
        border: "border-gray-300/25",
        bg: "bg-gray-300/8",
        badge: "🥈",
    },
    3: {
        border: "border-orange-400/20",
        bg: "bg-orange-400/8",
        badge: "🥉",
    },
};

function getRankStyle(rank: number) {
    return RANK_STYLE[rank] ?? { border: "border-secondary/10", bg: "bg-secondary/4", badge: `${rank}` };
}

/**
 * Ranking Reveal — progressive reveal from last place to first.
 *
 * Builds suspense by showing lower ranks first,
 * then dramatically revealing the top players.
 */
export function RankingRevealPhase({ finalScores, onContinue }: RankingRevealPhaseProps) {
    // Reveal from last place to first (reverse order)
    const reversedScores = [...finalScores].sort((a, b) => b.rank - a.rank);
    const [revealedCount, setRevealedCount] = useState(0);
    const [allRevealed, setAllRevealed] = useState(false);

    useEffect(() => {
        if (allRevealed) return;
        if (revealedCount >= reversedScores.length) {
            setAllRevealed(true);
            return;
        }

        const timer = setTimeout(() => {
            setRevealedCount((c) => Math.min(c + 1, reversedScores.length));
        }, 800);

        return () => clearTimeout(timer);
    }, [revealedCount, allRevealed, reversedScores.length]);

    const visibleScores = reversedScores.slice(0, revealedCount);

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
                    src={iconAssets.starsSticker}
                    alt=""
                    width={24}
                    height={24}
                    className="object-contain opacity-60"
                />
                <Headline className="text-foreground text-lg font-bold">
                    ترتيب اللاعبين
                </Headline>
                <Muted className="text-xs">مين اللي جمع أكتر؟</Muted>
            </div>

            {/* Ranking list */}
            <div className="flex flex-col gap-2 w-full">
                <AnimatePresence>
                    {visibleScores.map((entry) => {
                        const style = getRankStyle(entry.rank);
                        return (
                            <motion.div
                                key={entry.player.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, ease: "easeOut" as const }}
                                className={`
                                    relative overflow-hidden rounded-xl border
                                    px-3.5 py-2.5
                                    ${style.border} ${style.bg}
                                `}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2.5">
                                        <span className="text-lg">{style.badge}</span>
                                        <div className="flex flex-col">
                                            <Label className="text-foreground text-sm font-bold">
                                                {entry.player.name}
                                            </Label>
                                            <div className="flex items-center gap-2">
                                                <div className="flex items-center gap-1">
                                                    <Image src={iconAssets.starsSticker} alt="" width={14} height={14} className="object-contain" />
                                                    <Muted className="text-[10px]">{entry.player.stars} نجمة</Muted>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Image src={iconAssets.treasure} alt="" width={14} height={14} className="object-contain" />
                                                    <Muted className="text-[10px]">{entry.player.treasures} كنز</Muted>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Hidden points — revealed here */}
                                    <div className="flex items-center gap-1">
                                        <span className="text-secondary text-[10px]">✦</span>
                                        <Label className="text-secondary text-sm font-bold">
                                            {entry.hiddenPoints}
                                        </Label>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            {/* Continue CTA */}
            {allRevealed && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="flex flex-col items-center gap-3"
                >
                    <motion.button
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
                        مين البطل؟ 🌟
                    </motion.button>
                </motion.div>
            )}

            {/* Skip */}
            {!allRevealed && (
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.6 }}
                    onClick={() => {
                        setRevealedCount(reversedScores.length);
                        setAllRevealed(true);
                    }}
                    className="text-muted-foreground/50 text-xs hover:text-muted-foreground transition-colors"
                >
                    تخطي ←
                </motion.button>
            )}
        </motion.div>
    );
}

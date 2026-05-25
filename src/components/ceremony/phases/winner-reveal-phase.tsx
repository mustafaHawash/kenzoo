
"use client";

import { motion } from "framer-motion";
import Image from "next/image";

import { Headline, Label, Muted } from "@/components/ui/typography";
import { MoodSticker } from "@/components/ui/mood-sticker";
import { iconAssets } from "@/assets";
import type { PlayerFinalScore } from "@/lib/session-runtime/session-engine";

import { phaseEnter, dramaticReveal, glowPulse, gentleFloat } from "../ceremony-motion";

interface WinnerRevealPhaseProps {
    finalScores: PlayerFinalScore[];
    winnerId: string;
    onContinue: () => void;
}

/**
 * Winner Reveal — cinematic, elegant, mystical.
 *
 * Logo-inspired elegance with warm glow.
 * NOT a plain table — a celebration moment.
 */
export function WinnerRevealPhase({ finalScores, winnerId, onContinue }: WinnerRevealPhaseProps) {
    const winner = finalScores.find((f) => f.player.id === winnerId);
    if (!winner) return null;

    const winnerPlayer = winner.player;

    return (
        <motion.div
            variants={phaseEnter}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex flex-col items-center gap-5 py-4"
        >
            {/* Winner card — dramatic reveal */}
            <motion.div
                variants={dramaticReveal}
                initial="hidden"
                animate="visible"
                className="
                    relative overflow-hidden
                    rounded-3xl
                    border-2 border-amber-400/30
                    bg-gradient-to-b from-amber-400/12 via-card/95 to-amber-400/6
                    px-6 py-6
                    w-full max-w-xs
                "
            >
                {/* Ambient glow */}
                <motion.div
                    variants={glowPulse}
                    initial="initial"
                    animate="animate"
                    className="
                        pointer-events-none absolute inset-0
                        bg-[radial-gradient(circle_at_50%_30%,rgba(245,158,11,0.20),transparent_60%)]
                    "
                />

                {/* Sparkle overlay */}
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(255,255,255,0.05),transparent_40%)]" />

                <div className="relative z-10 flex flex-col items-center gap-3">
                    {/* Logo mark */}
                    <motion.div
                        variants={gentleFloat}
                        animate="animate"
                        className="relative h-14 w-14 select-none"
                    >
                        <Image
                            src={iconAssets.logoMark}
                            alt="Kenzoo"
                            fill
                            className="object-contain drop-shadow-[0_4px_20px_rgba(245,158,11,0.4)]"
                        />
                    </motion.div>

                    {/* Crown emoji */}
                    <motion.span
                        initial={{ opacity: 0, scale: 0.5, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
                        className="text-3xl"
                    >
                        👑
                    </motion.span>

                    {/* Winner name */}
                    <Headline className="text-amber-400 text-2xl font-bold text-center">
                        {winnerPlayer.name}
                    </Headline>

                    {/* Winner stats */}
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col items-center gap-0.5">
                            <Image src={iconAssets.starsSticker} alt="" width={16} height={16} className="object-contain" />
                            <Label className="text-amber-400/80 text-xs font-semibold">{winnerPlayer.stars}</Label>
                            <Muted className="text-[8px] text-amber-400/50">نجمة</Muted>
                        </div>
                        <div className="h-6 w-px bg-amber-400/20" />
                        <div className="flex flex-col items-center gap-0.5">
                            <Image src={iconAssets.mainKey} alt="" width={16} height={16} className="object-contain" />
                            <Label className="text-amber-400/80 text-xs font-semibold">{winnerPlayer.treasures}</Label>
                            <Muted className="text-[8px] text-amber-400/50">كنز</Muted>
                        </div>
                        <div className="h-6 w-px bg-amber-400/20" />
                        <div className="flex flex-col items-center gap-0.5">
                            <span className="text-amber-400/60 text-[10px]">✦</span>
                            <Label className="text-amber-400/80 text-xs font-semibold">{winner.hiddenPoints}</Label>
                            <Muted className="text-[8px] text-amber-400/50">نقاط</Muted>
                        </div>
                    </div>

                    {/* Celebration sticker */}
                    <MoodSticker mood="celebration" size={80} delay={0.8} />
                </div>
            </motion.div>

            {/* Other players — compact list */}
            {finalScores.length > 1 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2, duration: 0.5 }}
                    className="flex flex-col gap-1.5 w-full"
                >
                    {finalScores
                        .filter((f) => f.player.id !== winnerId)
                        .map((entry) => (
                            <div
                                key={entry.player.id}
                                className="
                                    flex items-center justify-between
                                    rounded-xl border border-secondary/10
                                    bg-secondary/4
                                    px-3 py-2
                                "
                            >
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-muted-foreground/60">
                                        {entry.rank === 2 ? "🥈" : entry.rank === 3 ? "🥉" : `${entry.rank}`}
                                    </span>
                                    <Label className="text-foreground/70 text-xs">{entry.player.name}</Label>
                                </div>
                                <Label className="text-secondary/60 text-xs">{entry.hiddenPoints} ✦</Label>
                            </div>
                        ))}
                </motion.div>
            )}

            {/* Continue CTA */}
            <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 0.5 }}
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
                اللحظة الأخيرة 🌙
            </motion.button>
        </motion.div>
    );
}

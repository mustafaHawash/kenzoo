
"use client";

import { motion } from "framer-motion";
import Image from "next/image";

import { Headline, Label, Muted } from "@/components/ui/typography";
import { MoodSticker } from "@/components/ui/mood-sticker";
import { iconAssets } from "@/assets";
import type { Player } from "@/types/player";
import { getDefaultAvatarForIndex } from "@/components/session-setup/avatar-registry";

import { phaseEnter, staggerContainer, staggerItem, gentleFloat } from "../ceremony-motion";

interface PlayerRevealsPhaseProps {
    players: Player[];
    onContinue: () => void;
}

/**
 * Player Story Cards — personalized, expressive, memorable.
 *
 * Each player gets a card showing:
 *   - Avatar
 *   - Final stars
 *   - Treasure count
 *   - Earned titles
 *   - Celebration sticker (random)
 *
 * Cards feel like collectible character cards.
 */
export function PlayerRevealsPhase({ players, onContinue }: PlayerRevealsPhaseProps) {
    return (
        <motion.div
            variants={phaseEnter}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex flex-col items-center gap-4 py-4"
        >
            {/* Section title */}
            <div className="flex flex-col items-center gap-1">
                <Headline className="text-foreground text-lg font-bold">
                    حكاية كل لاعب
                </Headline>
                <Muted className="text-xs">كل واحد فيكم كان له دور في الليلة دي</Muted>
            </div>

            {/* Player cards */}
            <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="flex flex-col gap-3 w-full"
            >
                {players.map((player) => (
                    <motion.div
                        key={player.id}
                        variants={staggerItem}
                        className="
                            relative overflow-hidden
                            rounded-2xl
                            border border-secondary/15
                            bg-gradient-to-b from-secondary/8 via-card/90 to-secondary/4
                            p-3.5
                        "
                    >
                        {/* Ambient glow */}
                        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(246,208,140,0.10),transparent_60%)]" />

                        <div className="relative z-10 flex items-start gap-3">
                            {/* Avatar emoji */}
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-secondary/20 bg-surface-soft/60 text-2xl">
                                {getDefaultAvatarForIndex(i)}
                            </div>

                            {/* Player info */}
                            <div className="flex flex-1 flex-col gap-1.5">
                                <Label className="text-foreground text-sm font-bold">
                                    {player.name}
                                </Label>

                                {/* Stats row */}
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-1">
                                        <Image src={iconAssets.starsSticker} alt="" width={12} height={12} className="object-contain" />
                                        <Muted className="text-[11px]">{player.stars} نجمة</Muted>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Image src={iconAssets.mainKey} alt="" width={12} height={12} className="object-contain" />
                                        <Muted className="text-[11px]">{player.treasures} كنز</Muted>
                                    </div>
                                </div>

                                {/* Titles */}
                                {player.titles.length > 0 && (
                                    <div className="flex flex-wrap gap-1">
                                        {player.titles.slice(0, 3).map((title, i) => (
                                            <span
                                                key={i}
                                                className="
                                                    rounded-full
                                                    border border-primary/15
                                                    bg-primary/8
                                                    px-2 py-0.5
                                                    text-primary text-[9px] font-medium
                                                "
                                            >
                                                {title}
                                            </span>
                                        ))}
                                        {player.titles.length > 3 && (
                                            <span className="text-muted-foreground/50 text-[9px]">
                                                +{player.titles.length - 3}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Celebration sticker */}
                            <motion.div
                                variants={gentleFloat}
                                animate="animate"
                                className="shrink-0"
                            >
                                <MoodSticker mood="celebration" size={48} />
                            </motion.div>
                        </div>
                    </motion.div>
                ))}
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
                كشف الكنوز 🗝️
            </motion.button>
        </motion.div>
    );
}

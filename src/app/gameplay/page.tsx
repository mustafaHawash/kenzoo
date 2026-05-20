// src/app/gameplay/page.tsx
"use client";

import { useMemo } from "react";
import { motion, type Variants } from "framer-motion";
import Image from "next/image";

import { ScreenContainer } from "@/components/ui/layout/screen-container";
import { StationCard } from "@/components/game/StationCard";
import { Headline, Body, Label, Muted } from "@/components/ui/typography";
import { eidQuizStations } from "@/content/themes/eid-el-adha/quiz";
import { eidRiddleStations } from "@/content/themes/eid-el-adha/riddles";
import type { Station, StationType } from "@/types/station";
import { stationTypeMeta } from "@/components/game/active-station-surface/station-type-meta";

const STATIONS: Station[] = [...eidQuizStations, ...eidRiddleStations];

/* ─── Station type grouping config ─── */
const typeOrder: StationType[] = ["quiz", "riddle", "guess", "memory", "puzzle", "treasure", "mystery", "story"];

/* ─── Animation variants ─── */
const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.08, delayChildren: 0.3 },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.35, ease: "easeOut" as const },
    },
};

const floatVariants: Variants = {
    animate: {
        y: [0, -3, 0],
        transition: { duration: 3.5, repeat: Infinity, ease: "easeInOut" as const },
    },
};

export default function GameplayScreen() {
    const handleStationSelect = (id: string) => {
        console.log("Selected:", id);
    };

    /* ─── Group stations by type in defined order ─── */
    const groupedStations = useMemo(() => {
        const groups = new Map<StationType, Station[]>();

        for (const type of typeOrder) {
            const stationsOfType = STATIONS.filter((s) => s.type === type);
            if (stationsOfType.length > 0) {
                groups.set(type, stationsOfType);
            }
        }

        return groups;
    }, []);

    /* ─── Progress stats ─── */
    const { completed, total, totalStars, treasureCount } = useMemo(() => {
        const completed = STATIONS.filter((s) => s.status === "completed").length;
        const total = STATIONS.length;
        const totalStars = STATIONS.reduce((sum, s) => sum + s.reward.stars, 0);
        const treasureCount = STATIONS.filter((s) => s.reward.canUnlockTreasure).length;
        return { completed, total, totalStars, treasureCount };
    }, []);

    const progressPercent = total > 0 ? Math.round((completed / total) * 100) : 0;

    return (
        <ScreenContainer className="gap-0">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-col gap-6"
            >
                {/* ═══════════════════════════════════════════
                    ✨ IMMERSIVE HEADER
                    ═══════════════════════════════════════════ */}
                <motion.header
                    variants={itemVariants}
                    className="relative flex flex-col items-center text-center gap-3 pt-2 pb-2"
                >
                    {/* Floating decorative elements */}
                    <div className="pointer-events-none absolute -top-1 right-6 text-2xl opacity-20 select-none">
                        <motion.span variants={floatVariants} animate="animate">✦</motion.span>
                    </div>
                    <div className="pointer-events-none absolute top-8 left-8 text-lg opacity-15 select-none">
                        <motion.span
                            variants={floatVariants}
                            animate="animate"
                            transition={{ delay: 1.5 }}
                        >
                            ✧
                        </motion.span>
                    </div>

                    {/* Brand Logo */}
                    <motion.div
                        variants={floatVariants}
                        animate="animate"
                        className="relative h-24 w-24 select-none sm:h-28 sm:w-28"
                    >
                        <Image
                            src="/Logo-PNG.webp"
                            alt="Kenzoo Logo"
                            fill
                            priority
                            className="object-contain drop-shadow-[0_6px_20px_rgba(216,179,106,0.25)]"
                        />
                    </motion.div>

                    {/* Player greeting */}
                    <Headline className="text-foreground text-2xl font-bold leading-tight">
                        دورك يا{" "}
                        <span className="bg-linear-to-l from-amber-500 via-secondary to-amber-600 bg-clip-text text-transparent">
                            {"اسم اللاعب"}
                        </span>
                    </Headline>

                    <Body className="text-muted-foreground text-sm leading-relaxed max-w-70">
                        اختار المحطة اللي تعجبك واكتشف الكنز 🗝️
                    </Body>
                </motion.header>

                {/* ═══════════════════════════════════════════
                    📊 PROGRESS BAR
                    ═══════════════════════════════════════════ */}
                <motion.div
                    variants={itemVariants}
                    className="flex flex-col gap-2.5"
                >
                    {/* Stats row */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5 rounded-full border border-secondary/15 bg-secondary/8 px-3 py-1">
                                <span className="text-xs">⭐</span>
                                <Label className="text-secondary text-xs">{totalStars}</Label>
                            </div>
                            <div className="flex items-center gap-1.5 rounded-full border border-primary/15 bg-primary/8 px-3 py-1">
                                <span className="text-xs">🎁</span>
                                <Label className="text-primary text-xs">{treasureCount}</Label>
                            </div>
                        </div>
                        <Muted className="text-xs">
                            {completed}/{total} محطة
                        </Muted>
                    </div>

                    {/* Progress track */}
                    <div className="relative h-2 w-full overflow-hidden rounded-full bg-surface-soft">
                        {/* Animated fill */}
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPercent}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" as const, delay: 0.5 }}
                            className="absolute inset-y-0 right-0 rounded-full bg-linear-to-l from-secondary via-amber-400 to-secondary/80"
                        />
                        {/* Shimmer effect */}
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPercent}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" as const, delay: 0.5 }}
                            className="absolute inset-y-0 right-0 overflow-hidden rounded-full"
                        >
                            <div className="absolute inset-0 bg-linear-to-l from-transparent via-white/20 to-transparent animate-pulse" />
                        </motion.div>
                    </div>
                </motion.div>

                {/* ═══════════════════════════════════════════
                    🗺️ GROUPED STATIONS
                    ═══════════════════════════════════════════ */}
                <div className="flex flex-col gap-8">
                    {[...groupedStations.entries()].map(([type, stations], groupIdx) => {
                        const sectionMeta = stationTypeMeta[type];

                        return (
                            <motion.div
                                key={type}
                                variants={itemVariants}
                                className="flex flex-col gap-3"
                            >
                                {/* Section header */}
                                <div className="flex items-center gap-3">
                                    <span className="text-lg">{sectionMeta.emoji}</span>
                                    <Headline className="text-foreground text-base font-semibold">
                                        {sectionMeta.label}
                                    </Headline>
                                    <div className="h-px flex-1 bg-linear-to-l from-transparent via-border to-transparent" />
                                    <Muted className="text-xs tabular-nums">
                                        {stations.length}
                                    </Muted>
                                </div>

                                {/* Station cards */}
                                <div className="flex flex-col gap-3">
                                    {stations.map((station, cardIdx) => (
                                        <motion.div
                                            key={station.id}
                                            variants={itemVariants}
                                            custom={groupIdx * stations.length + cardIdx}
                                        >
                                            <StationCard
                                                station={station}
                                                onClick={handleStationSelect}
                                            />
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* ═══════════════════════════════════════════
                    🏮 FOOTER
                    ═══════════════════════════════════════════ */}
                <motion.footer
                    variants={itemVariants}
                    className="flex flex-col items-center gap-3 pt-4 pb-6"
                >
                    {/* Decorative divider */}
                    <div className="flex items-center gap-3 w-full">
                        <div className="h-px flex-1 bg-linear-to-l from-transparent via-secondary/20 to-transparent" />
                        <span className="text-secondary/30 text-xs">✦</span>
                        <div className="h-px flex-1 bg-linear-to-r from-transparent via-secondary/20 to-transparent" />
                    </div>

                    <Muted className="text-xs text-center leading-relaxed">
                        🌙 كنزوو — لعب، حكايات، وكنوز
                    </Muted>
                </motion.footer>
            </motion.div>
        </ScreenContainer>
    );
}

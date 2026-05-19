//app/play/page.tsx
"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";

import { ScreenContainer } from "@/components/ui/layout/screen-container";
import { ActiveStationSurface } from "@/components/game/active-station-surface";
import { TreasureOpportunityCard } from "@/components/game/treasure-opportunity";
import { Label, Muted } from "@/components/ui/typography";

import { eidQuizStations } from "@/content/themes/eid-el-adha/quiz";
import { eidRiddleStations } from "@/content/themes/eid-el-adha/riddles";
import { eidTreasures } from "@/content/themes/eid-el-adha/treasures";
import { pickRandomTitle } from "@/content/themes/eid-el-adha/titles";
import { pickTreasureByRarity, type Treasure } from "@/types/treasure";

import type { Station } from "@/types/station";
import type { Player } from "@/types/player";
import type { RoundResult } from "@/types/session";

/* ─── Mock data (replace with real session context) ─── */
const MOCK_PLAYERS: Player[] = [
    {
        id: "player-1",
        name: "مصطفى",
        gender: "male",
        age: 25,
        ageGroup: "adult",
        difficulty: "normal",
        stars: 3,
        treasures: 0,
        completedMissions: 2,
        titles: [],
    },
    {
        id: "player-2",
        name: "أحمد",
        gender: "male",
        age: 22,
        ageGroup: "adult",
        difficulty: "normal",
        stars: 1,
        treasures: 0,
        completedMissions: 1,
        titles: [],
    },
    {
        id: "player-3",
        name: "سارة",
        gender: "female",
        age: 20,
        ageGroup: "teen",
        difficulty: "normal",
        stars: 5,
        treasures: 1,
        completedMissions: 3,
        titles: ["🌟 نجم العيد"],
    },
];

const ALL_STATIONS: Station[] = [...eidQuizStations, ...eidRiddleStations];

/* ─── Treasure economy (MVP) ─── */

/* ─── Animation ─── */
const floatBob = {
    animate: {
        y: [0, -3, 0],
        transition: { duration: 3, repeat: Infinity, ease: "easeInOut" as const },
    },
};

/* ═══════════════════════════════════════════════════════════
   PLAY PAGE
   ═══════════════════════════════════════════════════════════ */
export default function PlayPage() {
    /* ─── Session state (TODO: move to Zustand/session engine) ─── */
    const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
    const [stationIndex, setStationIndex] = useState(0);
    const [playerStars, setPlayerStars] = useState<Record<string, number>>(
        () => Object.fromEntries(MOCK_PLAYERS.map((p) => [p.id, p.stars]))
    );

    /* ─── Treasure opportunity state ─── */
    const [showTreasureOpportunity, setShowTreasureOpportunity] = useState(false);
    const [activeTreasure, setActiveTreasure] = useState<Treasure | null>(null);
    const [awardedTitle, setAwardedTitle] = useState<string | null>(null);
    const [lastRoundResult, setLastRoundResult] = useState<RoundResult | null>(null);
    const [claimedLegendaryIds, setClaimedLegendaryIds] = useState<string[]>([]);

    const currentPlayer = MOCK_PLAYERS[currentPlayerIndex];
    const station = ALL_STATIONS[stationIndex % ALL_STATIONS.length];

    /* ─── Derived ─── */
    const currentStars = playerStars[currentPlayer.id] ?? currentPlayer.stars;

    /* ─── Round complete handler ─── */
    const handleRoundComplete = useCallback(
        (result: RoundResult) => {
            // Stations with treasure opportunity give 0 stars
            // Treasures consume stars — rewards are emotional and magical
            if (result.starsEarned > 0 && !result.treasureUnlocked) {
                setPlayerStars((prev) => ({
                    ...prev,
                    [currentPlayer.id]: (prev[currentPlayer.id] ?? 0) + result.starsEarned,
                }));
            }

            setLastRoundResult(result);

            // Check if treasure opportunity should appear
            if (result.isCorrect && result.treasureUnlocked) {
                const treasure = pickTreasureByRarity(eidTreasures, claimedLegendaryIds);
                if (currentStars >= treasure.starsRequired) {
                    setActiveTreasure(treasure);
                    setShowTreasureOpportunity(true);
                }
            }

            console.log("Round complete:", {
                player: currentPlayer.name,
                stationId: station.id,
                isCorrect: result.isCorrect,
                starsEarned: result.starsEarned,
                treasureUnlocked: result.treasureUnlocked,
            });
        },
        [currentPlayer, station, currentStars, claimedLegendaryIds]
    );

    /* ─── Open treasure: spend stars, apply reward ─── */
    const handleOpenTreasure = useCallback(() => {
        if (!activeTreasure) return;

        // Spend stars to open the treasure
        setPlayerStars((prev) => ({
            ...prev,
            [currentPlayer.id]: Math.max(0, (prev[currentPlayer.id] ?? 0) - activeTreasure.starsRequired),
        }));

        // Mark legendary as claimed (unique — never appears again)
        if (activeTreasure.rarity === "legendary") {
            setClaimedLegendaryIds((prev) => [...prev, activeTreasure.id]);
        }

        // Pick a random title if the treasure rewards a title
        if (activeTreasure.reward.type === "title") {
            const title = pickRandomTitle(currentPlayer.titles);
            setAwardedTitle(title);
            // TODO: persist title to player when session state is centralized
        }
    }, [currentPlayer, activeTreasure]);

    /* ─── Dismiss treasure (keep stars or continue after reveal) ─── */
    const handleDismissTreasure = useCallback(() => {
        setShowTreasureOpportunity(false);
        setActiveTreasure(null);
        setAwardedTitle(null);
    }, []);

    /* ─── Next station handler ─── */
    const handleNextStation = useCallback(() => {
        // Advance to next station
        setStationIndex((prev) => prev + 1);
        // Rotate to next player
        setCurrentPlayerIndex((prev) => (prev + 1) % MOCK_PLAYERS.length);
        // Clear treasure state
        setShowTreasureOpportunity(false);
        setActiveTreasure(null);
        setAwardedTitle(null);
        setLastRoundResult(null);
    }, []);



    return (
        <ScreenContainer className="justify-center gap-0">
            <div className="flex flex-col gap-6">
                {/* ═══════════════════════════════════════════
                    🎯 PLAYER TURN INDICATOR
                    ═══════════════════════════════════════════ */}
                <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, ease: "easeOut" as const }}
                    className="flex justify-center"
                >
                    <div
                        className="
                            flex items-center gap-3
                            rounded-full
                            border border-secondary/12
                            bg-card/70
                            px-5 py-2.5
                            backdrop-blur-sm
                            shadow-soft
                        "
                    >
                        <motion.span
                            variants={floatBob}
                            animate="animate"
                            className="text-sm"
                        >
                            ✨
                        </motion.span>
                        <Label className="text-primary text-sm">
                            دور {currentPlayer.name}
                        </Label>
                        <div
                            className="
                                flex items-center gap-1.5
                                rounded-full
                                border border-secondary/10
                                bg-secondary/8
                                px-2.5 py-0.5
                            "
                        >
                            <span className="text-[10px]">⭐</span>
                            <Label className="text-secondary text-[11px] tabular-nums">
                                {currentStars}
                            </Label>
                        </div>
                    </div>
                </motion.div>

                {/* ═══════════════════════════════════════════
                    🃏 ACTIVE GAMEPLAY SURFACE / TREASURE OPPORTUNITY
                    ═══════════════════════════════════════════ */}
                {showTreasureOpportunity ? (
                    <TreasureOpportunityCard
                        playerStars={currentStars}
                        treasure={activeTreasure}
                        awardedTitle={awardedTitle}
                        onOpenTreasure={handleOpenTreasure}
                        onDismiss={handleDismissTreasure}
                    />
                ) : (
                    <ActiveStationSurface
                        station={station}
                        playerName={currentPlayer.name}
                        playerStars={currentStars}
                        onRoundComplete={handleRoundComplete}
                        onNextStation={handleNextStation}
                    />
                )}

                {/* ═══════════════════════════════════════════
                    📊 STATION PROGRESS
                    ═══════════════════════════════════════════ */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-col items-center gap-2"
                >
                    <div className="flex items-center gap-2">
                        <Muted className="text-[11px]">
                            المحطة {Math.min(stationIndex + 1, ALL_STATIONS.length)} من {ALL_STATIONS.length}
                        </Muted>
                    </div>

                    {/* Station dots */}
                    <div className="flex items-center gap-1.5">
                        {ALL_STATIONS.map((s, i) => (
                            <div
                                key={s.id}
                                className={
                                    i === stationIndex % ALL_STATIONS.length
                                        ? "h-2 w-4 rounded-full bg-secondary/60 transition-all duration-300"
                                        : i < stationIndex
                                            ? "h-1.5 w-1.5 rounded-full bg-secondary/30 transition-all duration-300"
                                            : "h-1.5 w-1.5 rounded-full bg-border/40 transition-all duration-300"
                                }
                            />
                        ))}
                    </div>
                </motion.div>
            </div>
        </ScreenContainer>
    );
}

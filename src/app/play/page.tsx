//app/play/page.tsx
"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";

import { ScreenContainer } from "@/components/ui/layout/screen-container";
import { ActiveStationSurface } from "@/components/game/active-station-surface";
import { TreasureOpportunityCard } from "@/components/game/treasure-opportunity";
import { Label, Muted, Headline } from "@/components/ui/typography";

import { eidQuizStations } from "@/content/themes/eid-el-adha/quiz";
import { eidRiddleStations } from "@/content/themes/eid-el-adha/riddles";
import { eidTreasures } from "@/content/themes/eid-el-adha/treasures";
import { pickRandomTitle } from "@/content/themes/eid-el-adha/titles";
import {
    pickTreasureByRarity,
    toHiddenTreasureReveal,
    HIDDEN_POINTS_BY_RARITY,
    STARS_REQUIRED_BY_RARITY,
    TREASURE_APPEARANCE_MIN_STARS,
    HIDDEN_TREASURE_WIN_THRESHOLD,
    type Treasure,
    type OpenedTreasureRecord,
} from "@/types/treasure";

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
        stars: 27,
        treasures: 2,
        completedMissions: 2,
        titles: [],
        openedTreasures: [],
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
        openedTreasures: [],
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
        openedTreasures: [],
    },
];

const ALL_STATIONS: Station[] = [...eidQuizStations, ...eidRiddleStations];

/* ─── Animation ─── */
const floatBob = {
    animate: {
        y: [0, -3, 0],
        transition: { duration: 3, repeat: Infinity, ease: "easeInOut" as const },
    },
};

/* ═══════════════════════════════════════════════════════════
   SESSION ORCHESTRATOR HOOK
   ═══════════════════════════════════════════════════════════ */
function useGameSession(initialPlayers: Player[], stations: Station[]) {
    const [players, setPlayers] = useState<Player[]>(initialPlayers);
    const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
    const [stationIndex, setStationIndex] = useState(0);

    const [claimedLegendaryIds, setClaimedLegendaryIds] = useState<string[]>([]);
    const [winnerId, setWinnerId] = useState<string | null>(null);

    /* ─── Treasure opportunity state ─── */
    const [showTreasureOpportunity, setShowTreasureOpportunity] = useState(false);
    const [activeTreasure, setActiveTreasure] = useState<Treasure | null>(null);
    const [awardedTitle, setAwardedTitle] = useState<string | null>(null);
    const [lastRoundResult, setLastRoundResult] = useState<RoundResult | null>(null);

    const currentPlayer = players[currentPlayerIndex];
    const station = stations[stationIndex % stations.length];

    /* ─── Helper to update the current player safely ─── */
    const updateCurrentPlayer = useCallback((updater: (p: Player) => Player) => {
        setPlayers((prev) => prev.map((p, i) => i === currentPlayerIndex ? updater(p) : p));
    }, [currentPlayerIndex]);

    /* ─── Round complete handler ─── */
    const handleRoundComplete = useCallback(
        (result: RoundResult) => {
            if (result.starsEarned > 0 && !result.treasureUnlocked) {
                updateCurrentPlayer((p) => ({ ...p, stars: p.stars + result.starsEarned }));
            }

            setLastRoundResult(result);

            // Treasure appears only if player has >= 7 stars (max hidden cost)
            if (result.isCorrect && result.treasureUnlocked && currentPlayer.stars >= TREASURE_APPEARANCE_MIN_STARS) {
                const treasure = pickTreasureByRarity(
                    eidTreasures,
                    claimedLegendaryIds,
                    currentPlayer.difficulty,
                );
                setActiveTreasure(treasure);
                setShowTreasureOpportunity(true);
            }
        },
        [currentPlayer.stars, currentPlayer.difficulty, claimedLegendaryIds, updateCurrentPlayer]
    );

    /* ─── Open treasure: spend stars, record opened treasure, check win ─── */
    const handleOpenTreasure = useCallback(() => {
        if (!activeTreasure) return;

        const cost = STARS_REQUIRED_BY_RARITY[activeTreasure.rarity];
        const hiddenPoints = HIDDEN_POINTS_BY_RARITY[activeTreasure.rarity];

        const record: OpenedTreasureRecord = {
            treasureId: activeTreasure.id,
            rarity: activeTreasure.rarity,
            hiddenPoints,
            starsConsumed: cost,
        };

        const currentHiddenPoints = currentPlayer.openedTreasures.reduce((sum, t) => sum + t.hiddenPoints, 0);
        const newTotalHidden = currentHiddenPoints + hiddenPoints;

        updateCurrentPlayer((p) => ({
            ...p,
            stars: Math.max(0, p.stars - cost),
            treasures: p.treasures + 1,
            openedTreasures: [...p.openedTreasures, record],
        }));

        if (activeTreasure.rarity === "legendary") {
            setClaimedLegendaryIds((prev) => [...prev, activeTreasure.id]);
        }

        if (activeTreasure.reward.type === "title") {
            const title = pickRandomTitle(currentPlayer.titles);
            setAwardedTitle(title);
            // TODO: persist title to player when session state is centralized
        }

        if (newTotalHidden >= HIDDEN_TREASURE_WIN_THRESHOLD) {
            setWinnerId(currentPlayer.id);
        }
    }, [activeTreasure, currentPlayer, updateCurrentPlayer]);

    /* ─── Dismiss treasure ─── */
    const handleDismissTreasure = useCallback(() => {
        setShowTreasureOpportunity(false);
        setActiveTreasure(null);
        setAwardedTitle(null);
    }, []);

    /* ─── Next station handler ─── */
    const handleNextStation = useCallback(() => {
        // Track tiny mission completion for social continuity
        if (lastRoundResult && !lastRoundResult.isCorrect && lastRoundResult.tinyMission) {
            updateCurrentPlayer((p) => ({ ...p, completedMissions: p.completedMissions + 1 }));
        }

        setStationIndex((prev) => prev + 1);
        setCurrentPlayerIndex((prev) => (prev + 1) % players.length);

        setShowTreasureOpportunity(false);
        setActiveTreasure(null);
        setAwardedTitle(null);
        setLastRoundResult(null);
    }, [lastRoundResult, players.length, updateCurrentPlayer]);

    return {
        players,
        currentPlayer,
        station,
        stationIndex,
        winnerId,
        showTreasureOpportunity,
        activeTreasure,
        awardedTitle,
        handleRoundComplete,
        handleOpenTreasure,
        handleDismissTreasure,
        handleNextStation,
    };
}

/* ═══════════════════════════════════════════════════════════
   PLAY PAGE
   ═══════════════════════════════════════════════════════════ */
export default function PlayPage() {
    const {
        currentPlayer,
        station,
        stationIndex,
        winnerId,
        showTreasureOpportunity,
        activeTreasure,
        awardedTitle,
        handleRoundComplete,
        handleOpenTreasure,
        handleDismissTreasure,
        handleNextStation,
    } = useGameSession(MOCK_PLAYERS, ALL_STATIONS);

    /* ─── Session Ending Placeholder ─── */
    if (winnerId) {
        return (
            <ScreenContainer className="justify-center items-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center gap-6 text-center max-w-sm"
                >
                    <div className="text-6xl">🎉</div>
                    <Headline className="text-secondary text-3xl">الجلسة خلصت!</Headline>
                    <Muted className="text-sm leading-relaxed">
                        هنا هيتعمل الـ Session Ending Cinematic Reveal.
                        (النقاط المخفية والكنوز هتتعرض واحد واحد).
                    </Muted>
                </motion.div>
            </ScreenContainer>
        );
    }

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
                        {/* Visible treasure count only — no points or rarity */}
                        {currentPlayer.treasures > 0 && (
                            <div
                                className="
                                    flex items-center gap-1
                                    rounded-full
                                    border border-primary/10
                                    bg-primary/8
                                    px-2.5 py-0.5
                                "
                            >
                                <span className="text-[10px]">🗝️</span>
                                <Label className="text-primary text-[11px] tabular-nums">
                                    {currentPlayer.treasures}
                                </Label>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* ═══════════════════════════════════════════
                    🃏 ACTIVE GAMEPLAY SURFACE / TREASURE OPPORTUNITY
                    ═══════════════════════════════════════════ */}
                {showTreasureOpportunity ? (
                    <TreasureOpportunityCard
                        treasure={activeTreasure ? toHiddenTreasureReveal(activeTreasure) : null}
                        awardedTitle={awardedTitle}
                        onOpenTreasure={handleOpenTreasure}
                        onDismiss={handleDismissTreasure}
                    />
                ) : (
                    <ActiveStationSurface
                        station={station}
                        playerName={currentPlayer.name}
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

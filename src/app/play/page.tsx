// app/play/page.tsx
"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

import { ScreenContainer } from "@/components/ui/layout/screen-container";
import { ActiveStationSurface } from "@/components/game/active-station-surface";
import { TreasureOpportunityCard } from "@/components/game/treasure-opportunity";
import { Label, Muted, Headline } from "@/components/ui/typography";

import { eidQuizStations } from "@/content/themes/eid-el-adha/quiz";
import { eidRiddleStations } from "@/content/themes/eid-el-adha/riddles";
import { eidTreasures } from "@/content/themes/eid-el-adha/treasures";
import { pickRandomTitle } from "@/content/themes/eid-el-adha/titles";
import { toHiddenTreasureReveal, type Treasure } from "@/types/treasure";

import {
    resolveTurn,
    type TurnOutcome,
} from "@/lib/session-runtime/turn-engine";

import {
    createSessionState,
    advanceTurn,
    applyTurnOutcome,
    applyTreasureOpen,
    createEndingCeremonyState,
    advanceCeremonyPhase,
    getSessionProgressLabel,
    type SessionState,
    type EndingCeremonyState,
} from "@/lib/session-runtime/session-engine";

import type { Station } from "@/types/station";
import type { Player } from "@/types/player";
import type { RoundResult } from "@/types/session";

/* ─── Mock data (replace with real session context) ──────── */
const MOCK_PLAYERS: Player[] = [
    {
        id: "player-1",
        name: "مصطفى",
        gender: "male",
        age: 25,
        ageGroup: "adult",
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
   
   Backed by session-engine.ts pure functions.
   The hook owns React state; the engine owns all logic.
   
   Responsibilities kept here (presentation layer):
     - useState wiring
     - UI-level ephemeral state (active treasure, awarded title)
     - Coordinating engine outputs with UI transitions
   
   Responsibilities delegated to session-engine:
     - Round / turn progression
     - Player index advancement
     - Treasure economy (star deduction, record tracking)
     - Session completion detection
     - Ending ceremony creation and phase advancement
   ═══════════════════════════════════════════════════════════ */
function useGameSession(initialPlayers: Player[], stations: Station[]) {
    /* ─── Core session engine state ─── */
    const [sessionState, setSessionState] = useState<SessionState>(
        () => createSessionState(initialPlayers),
    );

    /* ─── Ending ceremony (null during active gameplay) ─── */
    const [ceremony, setCeremony] = useState<EndingCeremonyState | null>(null);

    /* ─── Station index (UI concern — advances independently of turns) ─── */
    const [stationIndex, setStationIndex] = useState(0);

    /* ─── Active treasure UI state ─── */
    const [showTreasureOpportunity, setShowTreasureOpportunity] = useState(false);
    const [awardedTitle, setAwardedTitle] = useState<string | null>(null);
    const [lastRoundResult, setLastRoundResult] = useState<RoundResult | null>(null);

    const currentPlayer = sessionState.players[sessionState.currentPlayerIndex];
    const station = stations[stationIndex % stations.length];
    
    // Exposed to UI: strictly isolated from hidden values
    const activeTreasure = sessionState.activeTreasure 
        ? toHiddenTreasureReveal(sessionState.activeTreasure) 
        : null;

    /* ─── Resolve answer: pure resolution, no state side effects ─── */
    const handleResolveAnswer = useCallback(
        (answer: string): TurnOutcome => {
            return resolveTurn(
                currentPlayer,
                station,
                answer,
                eidTreasures,
                sessionState.claimedLegendaryIds,
            );
        },
        [currentPlayer, station, sessionState.claimedLegendaryIds],
    );

    /* ─── Round complete: apply turn outcome, show treasure if available ─── */
    const handleRoundComplete = useCallback(
        (outcome: TurnOutcome) => {
            setSessionState((prev) => applyTurnOutcome(prev, outcome));
            setLastRoundResult(outcome.roundResult);

            if (outcome.treasureOpportunity) {
                setShowTreasureOpportunity(true);
            }
        },
        [],
    );

    /* ─── Open treasure: delegate economy to session-engine, no instant win check ─── */
    const handleOpenTreasure = useCallback(() => {
        const rawTreasure = sessionState.activeTreasure;
        if (!rawTreasure) return;

        setSessionState((prev) => applyTreasureOpen(prev));

        if (rawTreasure.reward.type === "title") {
            const title = pickRandomTitle(currentPlayer.titles);
            setAwardedTitle(title);
            // TODO: persist title to player record when session state is centralized
        }
    }, [sessionState.activeTreasure, currentPlayer.titles]);

    /* ─── Dismiss treasure ─── */
    const handleDismissTreasure = useCallback(() => {
        setShowTreasureOpportunity(false);
        setAwardedTitle(null);
    }, []);

    /* ─── Next station: advance session turn via session-engine ─── */
    const handleNextStation = useCallback(() => {
        // Compute next state (pure) from current snapshot
        const nextState = advanceTurn(sessionState, lastRoundResult);
        setSessionState(nextState);

        // If session just completed, initialize the ending ceremony
        if (nextState.isComplete) {
            setCeremony(createEndingCeremonyState(nextState));
        }

        setStationIndex((prev) => prev + 1);
        setShowTreasureOpportunity(false);
        setAwardedTitle(null);
        setLastRoundResult(null);
    }, [lastRoundResult, sessionState]);

    /* ─── Advance ending ceremony phase ─── */
    const handleAdvanceCeremony = useCallback(() => {
        setCeremony((prev) => (prev ? advanceCeremonyPhase(prev) : prev));
    }, []);

    return {
        sessionState,
        ceremony,
        currentPlayer,
        station,
        stationIndex,
        showTreasureOpportunity,
        activeTreasure,
        awardedTitle,
        handleResolveAnswer,
        handleRoundComplete,
        handleOpenTreasure,
        handleDismissTreasure,
        handleNextStation,
        handleAdvanceCeremony,
        progressLabel: getSessionProgressLabel(sessionState),
    };
}

/* ═══════════════════════════════════════════════════════════
   ENDING CEREMONY VIEW
   
   Architecture is established — phase-driven orchestration is wired.
   Full cinematic UI is built incrementally in subsequent iterations.
   
   Current state: structural placeholder with correct phase flow,
   correct data binding, and the ceremony state model.
   ═══════════════════════════════════════════════════════════ */
const CEREMONY_EMOJI: Record<string, string> = {
    "intro": "🌙",
    "session-summary": "✨",
    "titles-reveal": "🏅",
    "player-reveals": "🗝️",
    "ranking-reveal": "📜",
    "winner-reveal": "👑",
    "closing": "💫",
};

const CEREMONY_LABEL: Record<string, string> = {
    "intro": "الليلة قربت تخلص...",
    "session-summary": "كنوز الجلسة",
    "titles-reveal": "الألقاب المكتسبة",
    "player-reveals": "كنوز الليلة",
    "ranking-reveal": "الترتيب النهائي",
    "winner-reveal": "الفايز!",
    "closing": "شكرًا على الجلسة ✨",
};

function EndingCeremonyView({
    ceremony,
    onAdvance,
}: {
    ceremony: EndingCeremonyState;
    onAdvance: () => void;
}) {
    const isLastPhase = ceremony.phase === "closing";

    return (
        <ScreenContainer className="justify-center items-center">
            <motion.div
                key={ceremony.phase}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="flex flex-col items-center gap-8 text-center max-w-sm px-6"
            >
                {/* Phase emoji or Brand Logo */}
                {ceremony.phase === "intro" || ceremony.phase === "closing" ? (
                    <motion.div
                        initial={{ scale: 0.85, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.1, duration: 0.4, ease: "easeOut" }}
                        className="relative h-20 w-20 select-none"
                    >
                        <Image
                            src="/Logo-PNG.webp"
                            alt="Kenzoo Logo"
                            fill
                            priority
                            className="object-contain drop-shadow-[0_4px_15px_rgba(216,179,106,0.2)]"
                        />
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ scale: 0.85, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.1, duration: 0.4, ease: "easeOut" }}
                        className="text-5xl"
                    >
                        {CEREMONY_EMOJI[ceremony.phase]}
                    </motion.div>
                )}

                {/* Phase heading */}
                <Headline className="text-secondary text-2xl">
                    {CEREMONY_LABEL[ceremony.phase]}
                </Headline>

                {/* ─── Phase: winner-reveal ─── */}
                {ceremony.phase === "winner-reveal" && (
                    <div className="flex flex-col items-center gap-3">
                        <Headline className="text-primary text-4xl">
                            {ceremony.finalScores[0]?.player.name}
                        </Headline>
                        <Muted className="text-sm opacity-60">
                            {ceremony.finalScores[0]?.hiddenPoints} نقاط كنوز
                        </Muted>
                    </div>
                )}

                {/* ─── Phase: session-summary — treasure counts ─── */}
                {ceremony.phase === "session-summary" && (
                    <div className="flex flex-col gap-3 w-full">
                        {ceremony.finalScores.map((score) => (
                            <div
                                key={score.player.id}
                                className="flex justify-between items-center"
                            >
                                <Muted>{score.player.name}</Muted>
                                <Muted className="opacity-50">
                                    🗝️ {score.player.openedTreasures.length}
                                </Muted>
                            </div>
                        ))}
                    </div>
                )}

                {/* ─── Phase: ranking-reveal — scores last to first ─── */}
                {ceremony.phase === "ranking-reveal" && (
                    <div className="flex flex-col gap-3 w-full">
                        {[...ceremony.finalScores].reverse().map((score) => (
                            <div
                                key={score.player.id}
                                className="flex justify-between items-center"
                            >
                                <Muted>#{score.rank} {score.player.name}</Muted>
                                <Muted className="opacity-50">
                                    {score.hiddenPoints} نقطة
                                </Muted>
                            </div>
                        ))}
                    </div>
                )}

                {/* ─── Architecture placeholder note (intro only) ─── */}
                {ceremony.phase === "intro" && (
                    <Muted className="text-xs leading-relaxed opacity-30">
                        [Ending Ceremony — Phase-driven architecture established]
                    </Muted>
                )}

                {/* ─── Advance button ─── */}
                {!isLastPhase && (
                    <button
                        onClick={onAdvance}
                        className="mt-2 rounded-full border border-secondary/20 bg-card/60 px-6 py-2.5 text-sm text-secondary/80 backdrop-blur-sm transition-all hover:bg-card/80 active:scale-95"
                    >
                        {ceremony.phase === "winner-reveal"
                            ? "اختتام الجلسة"
                            : "متابعة ✨"}
                    </button>
                )}
            </motion.div>
        </ScreenContainer>
    );
}

/* ═══════════════════════════════════════════════════════════
   PLAY PAGE — Presentation / composition layer
   
   The page renders gameplay based on session-engine state.
   It does NOT manage progression logic, round counting,
   player advancement, or economy calculations.
   All of that lives in session-engine.ts.
   ═══════════════════════════════════════════════════════════ */
export default function PlayPage() {
    const {
        sessionState,
        ceremony,
        currentPlayer,
        station,
        stationIndex,
        showTreasureOpportunity,
        activeTreasure,
        awardedTitle,
        handleResolveAnswer,
        handleRoundComplete,
        handleOpenTreasure,
        handleDismissTreasure,
        handleNextStation,
        handleAdvanceCeremony,
        progressLabel,
    } = useGameSession(MOCK_PLAYERS, ALL_STATIONS);

    /* ─── Ending Ceremony ─── */
    if (ceremony) {
        return (
            <EndingCeremonyView
                ceremony={ceremony}
                onAdvance={handleAdvanceCeremony}
            />
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
                        <motion.div
                            variants={floatBob}
                            animate="animate"
                            className="relative h-5 w-5 select-none"
                        >
                            <Image
                                src="/Logo-PNG.webp"
                                alt="Kenzoo"
                                fill
                                className="object-contain"
                            />
                        </motion.div>
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
                        treasure={activeTreasure}
                        awardedTitle={awardedTitle}
                        onOpenTreasure={handleOpenTreasure}
                        onDismiss={handleDismissTreasure}
                    />
                ) : (
                    <ActiveStationSurface
                        station={station}
                        playerName={currentPlayer.name}
                        onResolveAnswer={handleResolveAnswer}
                        onRoundComplete={handleRoundComplete}
                        onNextStation={handleNextStation}
                    />
                )}

                {/* ═══════════════════════════════════════════
                    📊 SESSION PROGRESS — Round indicator
                    ═══════════════════════════════════════════ */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-col items-center gap-2"
                >
                    <div className="flex items-center gap-2">
                        <Muted className="text-[11px]">
                            {progressLabel}
                        </Muted>
                    </div>

                    {/* Round dots — each dot = one round */}
                    <div className="flex items-center gap-1.5">
                        {Array.from({ length: sessionState.totalRounds }).map((_, i) => (
                            <div
                                key={i}
                                className={
                                    i + 1 === sessionState.currentRound
                                        ? "h-2 w-4 rounded-full bg-secondary/60 transition-all duration-300"
                                        : i + 1 < sessionState.currentRound
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

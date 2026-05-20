// app/play/page.tsx
"use client";

import { useState, useCallback, useRef, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

import { ScreenContainer } from "@/components/ui/layout/screen-container";
import { ActiveStationSurface } from "@/components/game/active-station-surface";
import { TreasureOpportunityCard } from "@/components/game/treasure-opportunity";
import { Label, Muted, Headline } from "@/components/ui/typography";

import { eidTreasures } from "@/content/themes/eid-el-adha/treasures";
import { pickRandomTitle } from "@/content/themes/eid-el-adha/titles";
import { toGameplayTreasureView } from "@/types/treasure";

import {
    resolveTurn,
    type TurnOutcome,
} from "@/lib/session-runtime/turn-engine";

import {
    createSessionState,
    advanceTurn,
    advanceActivePath,
    applyTurnOutcome,
    applyTreasureOpen,
    clearActiveTreasure,
    createEndingCeremonyState,
    advanceCeremonyPhase,
    getSessionProgressLabel,
    selectPath,
    type SessionState,
    type EndingCeremonyState,
    type GameplayPhase,
} from "@/lib/session-runtime/session-engine";

import type { Player } from "@/types/player";
import type { RoundResult } from "@/types/session";
import type { ActivePathSession } from "@/types/path";

/* ─── Mock data (replace with real session context) ─── */
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

/* ─── Animation ─── */
const floatBob = {
    animate: {
        y: [0, -3, 0],
        transition: { duration: 3, repeat: Infinity, ease: "easeInOut" as const },
    },
};

/* ═══════════════════════════════════════════════════════════
    SESSION ORCHESTRATOR HOOK

    Path-based session orchestration.
    The hook owns React state; the engine owns all logic.

    Flow:
      1. Player arrives from /gameplay?pathId=xxx
      2. Path is selected via selectPath()
      3. Player answers stations in sequence
      4. Correct answer -> advance in path, continue playing
      5. Wrong answer -> save progress, return to /gameplay
      6. Path completed -> return to /gameplay for next path
      7. All paths completed -> ending ceremony
    ═══════════════════════════════════════════════════════════ */
function useGameSession(
    initialPlayers: Player[],
    pathId: string | null,
) {
    const router = useRouter();

    /* ─── Core session engine state ─── */
    // Use lazy initializer pattern: if pathId is provided, select the path
    // in the initial state computation rather than in an effect.
    const [sessionState, setSessionState] = useState<SessionState>(() => {
        let initial = createSessionState(initialPlayers, [], "normal");
        if (pathId) {
            initial = selectPath(initial, pathId);
        }
        return initial;
    });

    /* ─── Ending ceremony (null during active gameplay) ─── */
    const [ceremony, setCeremony] = useState<EndingCeremonyState | null>(null);

    /* ─── Phase-driven gameplay flow ─── */
    const [gameplayPhase, setGameplayPhase] = useState<GameplayPhase>(
        pathId ? "question" : "path-selection",
    );

    /* ─── Treasure UI state ─── */
    const [awardedTitle, setAwardedTitle] = useState<string | null>(null);
    const [lastRoundResult, setLastRoundResult] = useState<RoundResult | null>(null);

    /* ─── Refs to read latest state in callbacks without stale closures ─── */
    const sessionStateRef = useRef(sessionState);
    const lastRoundResultRef = useRef(lastRoundResult);

    // Update refs in effect to avoid render-time ref writes
    useEffect(() => {
        sessionStateRef.current = sessionState;
    }, [sessionState]);

    useEffect(() => {
        lastRoundResultRef.current = lastRoundResult;
    }, [lastRoundResult]);

    const currentPlayer = sessionState.players[sessionState.currentPlayerIndex];

    // The active path session provides the current station
    const activePath = sessionState.activePath;
    const station = activePath?.currentStation ?? null;

    // Exposed to UI: strictly isolated from hidden values
    const activeTreasure = sessionState.activeTreasure
        ? toGameplayTreasureView(sessionState.activeTreasure.treasure)
        : null;

    /* ─── Resolve answer: pure resolution, no state side effects ─── */
    const handleResolveAnswer = useCallback(
        (answer: string): TurnOutcome => {
            if (!station) {
                throw new Error("No active station to resolve answer for");
            }

            const treasureMultiplier = activePath
                ? 1 // TODO: Get from path.treasureProbabilityMultiplier
                : 1;

            return resolveTurn(
                currentPlayer,
                station,
                answer,
                eidTreasures,
                sessionState.claimedLegendaryIds,
                treasureMultiplier,
            );
        },
        [currentPlayer, station, activePath, sessionState.claimedLegendaryIds],
    );

    /* ─── Station complete: commit outcome to session state ─── */
    const handleStationComplete = useCallback(
        (outcome: TurnOutcome) => {
            setSessionState((prev) => applyTurnOutcome(prev, outcome));
            setLastRoundResult(outcome.roundResult);
        },
        [],
    );

    /* ─── Continue from result: check for treasure or advance path ─── */
    const handleContinueFromResult = useCallback(() => {
        const hasTreasure = sessionStateRef.current.activeTreasure !== null;

        if (hasTreasure) {
            // Show treasure overlay — gameplay FREEZES.
            setGameplayPhase("treasure");
            return;
        }

        // No treasure — check if answer was correct to decide next step
        const result = lastRoundResultRef.current;
        if (result?.isCorrect) {
            // Correct answer: advance the path progression
            const starsEarned = result.starsEarned;
            setSessionState((prev) => {
                const next = advanceActivePath(prev, starsEarned);

                // Check if session completed (all 4 paths done)
                if (next.isComplete) {
                    setGameplayPhase("ending");
                    setCeremony(createEndingCeremonyState(next));
                    return next;
                }

                // Check if the current path still has stations
                if (next.activePath) {
                    // More stations in this path — continue playing
                    setGameplayPhase("question");
                } else {
                    // Path completed — transition back to path selection
                    setGameplayPhase("transition");
                }

                return next;
            });
        } else {
            // Wrong answer: save progress, return to path selection
            setGameplayPhase("transition");
        }
    }, []);

    /* ─── Open treasure: delegate economy to session-engine ─── */
    const handleOpenTreasure = useCallback(() => {
        const rawTreasure = sessionStateRef.current.activeTreasure;
        if (!rawTreasure) return;

        setSessionState((prev) => applyTreasureOpen(prev));

        if (rawTreasure.treasure.reward.type === "title") {
            const title = pickRandomTitle(currentPlayer.titles);
            setAwardedTitle(title);
        }
    }, [currentPlayer.titles]);

    /* ─── Dismiss treasure: close overlay, then continue path ─── */
    const handleDismissTreasure = useCallback(() => {
        setAwardedTitle(null);
        setSessionState((prev) => clearActiveTreasure(prev));

        // After closing the overlay, check if we should continue the path
        const result = lastRoundResultRef.current;
        if (result?.isCorrect) {
            const starsEarned = result.starsEarned;
            setSessionState((prev) => {
                const next = advanceActivePath(prev, starsEarned);

                if (next.isComplete) {
                    setGameplayPhase("ending");
                    setCeremony(createEndingCeremonyState(next));
                    return next;
                }

                if (next.activePath) {
                    setGameplayPhase("question");
                } else {
                    setGameplayPhase("transition");
                }

                return next;
            });
        } else {
            setGameplayPhase("transition");
        }
    }, []);

    /* ─── Transition: navigate back to gameplay or next player ─── */
    const handleTransition = useCallback(() => {
        // Advance the turn (clears activePath, moves to next player)
        setSessionState((prev) => advanceTurn(prev, lastRoundResultRef.current));
        setLastRoundResult(null);

        // Navigate back to path selection screen
        router.push("/gameplay");
    }, [router]);

    /* ─── Advance ending ceremony phase ─── */
    const handleAdvanceCeremony = useCallback(() => {
        setCeremony((prev) => (prev ? advanceCeremonyPhase(prev) : prev));
    }, []);

    return {
        sessionState,
        ceremony,
        gameplayPhase,
        currentPlayer,
        station,
        activePath,
        activeTreasure,
        awardedTitle,
        handleResolveAnswer,
        handleStationComplete,
        handleContinueFromResult,
        handleOpenTreasure,
        handleDismissTreasure,
        handleTransition,
        handleAdvanceCeremony,
        setGameplayPhase,
        progressLabel: getSessionProgressLabel(sessionState),
    };
}

/* ═══════════════════════════════════════════════════════════
    ENDING CEREMONY VIEW

    Phase-driven cinematic reveal.
    ═══════════════════════════════════════════════════════════ */
type CeremonyPhase = "intro" | "session-summary" | "titles-reveal" | "player-reveals" | "ranking-reveal" | "winner-reveal" | "closing";

const CEREMONY_EMOJI: Record<CeremonyPhase, string> = {
    "intro": "🌙",
    "session-summary": "✨",
    "titles-reveal": "🏅",
    "player-reveals": "🗝️",
    "ranking-reveal": "📜",
    "winner-reveal": "👑",
    "closing": "💫",
};

const CEREMONY_LABEL: Record<CeremonyPhase, string> = {
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

                {/* ─── Phase: session-summary ─── */}
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

                {/* ─── Phase: ranking-reveal ─── */}
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

                {/* ─── Closing phase ─── */}
                {ceremony.phase === "closing" && (
                    <Muted className="text-sm leading-relaxed opacity-50">
                        الليلة خلصت، بس الذكرى باقية ✨
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
    PLAY PAGE — Station gameplay within a path

    This page handles the active station gameplay.
    The player answers stations in sequence within their chosen path.

    Navigation flow:
      - Arrives from /gameplay with ?pathId=xxx
      - Correct answer -> next station in same path
      - Wrong answer -> save progress, return to /gameplay
      - Path completed -> return to /gameplay for next path
      - All paths completed -> ending ceremony
    ═══════════════════════════════════════════════════════════ */
function PlayPageContent() {
    const searchParams = useSearchParams();
    const pathId = searchParams.get("pathId");

    const {
        sessionState,
        ceremony,
        gameplayPhase,
        currentPlayer,
        station,
        activePath,
        activeTreasure,
        awardedTitle,
        handleResolveAnswer,
        handleStationComplete,
        handleContinueFromResult,
        handleOpenTreasure,
        handleDismissTreasure,
        handleTransition,
        handleAdvanceCeremony,
        setGameplayPhase,
        progressLabel,
    } = useGameSession(MOCK_PLAYERS, pathId);

    /* ─── Ending Ceremony ─── */
    if (ceremony) {
        return (
            <EndingCeremonyView
                ceremony={ceremony}
                onAdvance={handleAdvanceCeremony}
            />
        );
    }

    /* ─── No active path — redirect to path selection ─── */
    if (!station || !activePath) {
        return (
            <ScreenContainer className="justify-center items-center">
                <div className="flex flex-col items-center gap-4 text-center">
                    <Headline className="text-secondary text-xl">
                        لا يوجد مسار نشط
                    </Headline>
                    <Muted className="text-sm">
                        اختر مسارًا للبدء
                    </Muted>
                    <button
                        onClick={() => window.location.href = "/gameplay"}
                        className="rounded-full border border-secondary/20 bg-card/60 px-6 py-2.5 text-sm text-secondary/80 backdrop-blur-sm transition-all hover:bg-card/80 active:scale-95"
                    >
                        اختيار مسار
                    </button>
                </div>
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
                    🗺️ PATH PROGRESS INDICATOR
                    ═══════════════════════════════════════════ */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="flex flex-col gap-1.5 px-2"
                >
                    <div className="flex items-center justify-between">
                        <Muted className="text-[10px]">
                            {progressLabel}
                        </Muted>
                        <Muted className="text-[10px]">
                            المحطة {activePath.currentStationIndex + 1} من {activePath.totalStations}
                        </Muted>
                    </div>
                    <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-surface-soft">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{
                                width: `${Math.round(((activePath.currentStationIndex) / activePath.totalStations) * 100)}%`,
                            }}
                            transition={{ duration: 0.5, ease: "easeOut" as const }}
                            className="absolute inset-y-0 right-0 rounded-full bg-linear-to-l from-secondary via-amber-400 to-secondary/80"
                        />
                    </div>
                </motion.div>

                {/* ═══════════════════════════════════════════
                    🃏 ACTIVE GAMEPLAY SURFACE
                    ActiveStationSurface manages its own phases:
                    playing → revealing → result
                    It calls onContinueFromResult when the player
                    wants to proceed after seeing the result.
                    ═══════════════════════════════════════════ */}
                <AnimatePresence mode="wait">
                    {gameplayPhase === "question" && station && (
                        <ActiveStationSurface
                            key={station.id}
                            station={station}
                            playerName={currentPlayer.name}
                            onResolveAnswer={handleResolveAnswer}
                            onRoundComplete={handleStationComplete}
                            onContinueFromResult={handleContinueFromResult}
                        />
                    )}
                </AnimatePresence>

                {/* ═══════════════════════════════════════════
                    🎁 TREASURE OVERLAY
                    ═══════════════════════════════════════════ */}
                {gameplayPhase === "treasure" && activeTreasure && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="flex flex-col items-center gap-6"
                    >
                        <TreasureOpportunityCard
                            treasure={activeTreasure}
                            onOpenTreasure={handleOpenTreasure}
                            onDismiss={handleDismissTreasure}
                            awardedTitle={awardedTitle}
                        />
                    </motion.div>
                )}

                {/* ═══════════════════════════════════════════
                    🔄 TRANSITION PHASE
                    ═══════════════════════════════════════════ */}
                {gameplayPhase === "transition" && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center gap-4 text-center"
                    >
                        <Headline className="text-secondary text-lg">
                            {sessionState.activePath === null
                                ? "أحسنت! المسار اكتمل 🌟"
                                : "الجولة خلصت"}
                        </Headline>
                        <Muted className="text-sm">
                            {sessionState.activePath === null
                                ? "اختار مسار جديد"
                                : "تقدمك محفوظ، كمّل بعدين 💪"}
                        </Muted>
                        <button
                            onClick={handleTransition}
                            className="rounded-full border border-secondary/20 bg-card/60 px-6 py-2.5 text-sm text-secondary/80 backdrop-blur-sm transition-all hover:bg-card/80 active:scale-95"
                        >
                            العودة للمسارات
                        </button>
                    </motion.div>
                )}
            </div>
        </ScreenContainer>
    );
}

export default function PlayPage() {
    return (
        <Suspense fallback={
            <ScreenContainer className="justify-center items-center">
                <Muted>جاري التحميل...</Muted>
            </ScreenContainer>
        }>
            <PlayPageContent />
        </Suspense>
    );
}


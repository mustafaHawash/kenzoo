
"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { CozyCard } from "@/components/ui/cozy-card";

import type { Station } from "@/types/station";
import type { RoundResult } from "@/types/session";

import { phaseTransition } from "./motion";
import { StationHeader } from "./station-header";
import { StationInputArea } from "./station-input-area";
import { RevealPhase } from "./reveal-phase";
import { ResultPhase } from "./result-phase";

/* ─── Props ─── */
interface ActiveStationSurfaceProps {
    station: Station;
    playerName: string;
    onRoundComplete: (result: RoundResult) => void;
    onNextStation: () => void;
}

/* ─── Game phase ─── */
type GamePhase = "playing" | "revealing" | "result";

/**
 * Reveal delay in ms.
 * Calm but not sluggish — 800ms feels cinematic without testing patience.
 */
const REVEAL_DELAY_MS = 800;

/* ═══════════════════════════════════════════════════════════
   ACTIVE STATION SURFACE — Orchestrator
   ═══════════════════════════════════════════════════════════

   This component owns the gameplay phase state and orchestrates
   the flow between playing → revealing → result.

   It does NOT contain rendering logic for any phase.
   Each phase is delegated to a focused child component.

   Gameplay logic (answer evaluation, result computation) lives here.
   Visual components receive data + callbacks and only render.

   Scalability:
     - New station types add renderers in StationInputArea
     - New phases (treasure reveal, mission countdown) add new phase components
     - The orchestrator just manages phase transitions
   ═══════════════════════════════════════════════════════════ */
export function ActiveStationSurface({
    station,
    playerName,
    onRoundComplete,
    onNextStation,
}: ActiveStationSurfaceProps) {
    const [phase, setPhase] = useState<GamePhase>("playing");
    const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
    const [textInput, setTextInput] = useState("");
    const [roundResult, setRoundResult] = useState<RoundResult | null>(null);

    /* ─── Derive current answer from interaction state ─── */
    const currentAnswer = selectedChoice ?? textInput.trim();
    const canSubmit = currentAnswer.length > 0;

    /* ─── Submit answer ─── */
    const handleSubmit = useCallback(() => {
        if (!currentAnswer) return;

        setPhase("revealing");

        const isCorrect = currentAnswer === station.answer;
        const result: RoundResult = {
            isCorrect,
            starsEarned: isCorrect ? station.reward.stars : 0,
            treasureUnlocked: isCorrect && station.reward.canUnlockTreasure,
            tinyMission: !isCorrect
                ? station.tinyMissionPool[
                      Math.floor(Math.random() * station.tinyMissionPool.length)
                ]
                : undefined,
        };

        // Cinematic reveal pause
        setTimeout(() => {
            setRoundResult(result);
            setPhase("result");
            onRoundComplete(result);
        }, REVEAL_DELAY_MS);
    }, [currentAnswer, station, onRoundComplete]);

    /* ─── Next station ─── */
    const handleNext = useCallback(() => {
        setPhase("playing");
        setSelectedChoice(null);
        setTextInput("");
        setRoundResult(null);
        onNextStation();
    }, [onNextStation]);

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={phase}
                variants={phaseTransition}
                initial="initial"
                animate="animate"
                exit="exit"
            >
                <CozyCard
                    className="
                        relative overflow-hidden
                        rounded-[32px]
                        p-7 sm:p-8
                    "
                >
                    {/* ═══ Ambient atmosphere ═══ */}
                    <div
                        className="
                            pointer-events-none absolute inset-0
                            bg-[radial-gradient(circle_at_top,rgba(246,208,140,0.12),transparent_60%)]
                        "
                    />
                    <div
                        className="
                            pointer-events-none absolute -top-3 -left-3
                            h-28 w-28 rounded-full
                            bg-[radial-gradient(circle,rgba(255,231,181,0.10),transparent_70%)]
                        "
                    />
                    <div
                        className="
                            pointer-events-none absolute -bottom-4 -right-4
                            h-24 w-24 rounded-full
                            bg-[radial-gradient(circle,rgba(230,201,140,0.06),transparent_70%)]
                        "
                    />

                    <div className="relative z-10 flex flex-col gap-7">
                        {/* ── Station header (badge + title + question + hint) ── */}
                        <StationHeader
                            station={station}
                            showHintToggle={phase === "playing"}
                        />

                        {/* ── Phase content ── */}
                        {phase === "playing" && (
                            <StationInputArea
                                station={station}
                                selectedChoice={selectedChoice}
                                onChoiceSelect={setSelectedChoice}
                                riddleInput={textInput}
                                onRiddleInput={setTextInput}
                                canSubmit={canSubmit}
                                onSubmit={handleSubmit}
                            />
                        )}

                        {phase === "revealing" && (
                            <RevealPhase />
                        )}

                        {phase === "result" && roundResult && (
                            <ResultPhase
                                station={station}
                                result={roundResult}
                                onNext={handleNext}
                            />
                        )}
                    </div>
                </CozyCard>
            </motion.div>
        </AnimatePresence>
    );
}

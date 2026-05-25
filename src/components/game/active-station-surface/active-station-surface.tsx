
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

/* ═══════════════════════════════════════════════════════════
   ACTIVE STATION SURFACE — Pure Interaction Renderer

   AUTHORITY: NONE.
   This component renders gameplay UI and emits callbacks.
   It does NOT own phases, sequencing, or progression.

   Phase ownership: play/page.tsx (via useGameSession hook)
   Progression ownership: session-engine.ts
   Timing ownership: play/page.tsx

   This component ONLY:
     - Renders the current phase UI
     - Manages local interaction state (choice selection, text input)
     - Emits: onSubmit(answer), onContinue()

   It NEVER decides:
     - Next phase
     - Next station
     - Progression commit
     - Treasure timing
     - Transition timing
   ═══════════════════════════════════════════════════════════ */

/** Surface-level gameplay phase — controlled by the orchestrator, not this component */
export type SurfacePhase = "question" | "reveal" | "result";

interface ActiveStationSurfaceProps {
    /** The station to render */
    station: Station;

    /** Current gameplay phase — controlled by the orchestrator */
    phase: SurfacePhase;

    /** The result of the last answer — provided during "result" phase */
    result: RoundResult | null;

    /** Player submits an answer. The orchestrator handles resolution. */
    onSubmit: (answer: string) => void;

    /** Player continues from the result phase. The orchestrator decides what happens next. */
    onContinue: () => void;
}

export function ActiveStationSurface({
    station,
    phase,
    result,
    onSubmit,
    onContinue,
}: ActiveStationSurfaceProps) {
    /* ─── Local interaction state (purely UI — no runtime authority) ─── */
    const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
    const [textInput, setTextInput] = useState("");

    /* ─── Reset interaction state when station changes ─── */
    const resetInteraction = useCallback(() => {
        setSelectedChoice(null);
        setTextInput("");
    }, []);

    /* ─── Derive current answer from interaction state ─── */
    const currentAnswer = selectedChoice ?? textInput.trim();
    const canSubmit = currentAnswer.length > 0;

    /* ─── Submit: emit answer to orchestrator, reset local state ─── */
    const handleSubmit = useCallback(() => {
        if (!currentAnswer) return;
        onSubmit(currentAnswer);
        resetInteraction();
    }, [currentAnswer, onSubmit, resetInteraction]);

    /* ─── Continue: emit to orchestrator ─── */
    const handleContinue = useCallback(() => {
        onContinue();
    }, [onContinue]);

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
                        rounded-[28px]
                        p-3.5
                    "
                >
                    {/* ═══ Ambient atmosphere ═══ */}
                    <div
                        className="
                            pointer-events-none absolute inset-0
                            bg-[radial-gradient(circle_at_top,rgba(246,208,140,0.10),transparent_60%)]
                        "
                    />

                    <div className="relative z-10 flex flex-col gap-3">
                        {/* ── Station header (badge + title + question + hint) ── */}
                        <StationHeader
                            station={station}
                            showHintToggle={phase === "question"}
                        />

                        {/* ── Phase content ── */}
                        {phase === "question" && (
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

                        {phase === "reveal" && (
                            <RevealPhase />
                        )}

                        {phase === "result" && result && (
                            <ResultPhase
                                station={station}
                                result={result}
                                onNext={handleContinue}
                            />
                        )}
                    </div>
                </CozyCard>
            </motion.div>
        </AnimatePresence>
    );
}

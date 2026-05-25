
"use client";

import { AnimatePresence, motion } from "framer-motion";

import { CozyCard } from "@/components/ui/cozy-card";
import type { EndingCeremonyState } from "@/lib/session-runtime/session-engine";
import type { Player } from "@/types/player";

import { IntroPhase } from "./phases/intro-phase";
import { SessionSummaryPhase } from "./phases/session-summary-phase";
import { PlayerRevealsPhase } from "./phases/player-reveals-phase";
import { TitlesRevealPhase } from "./phases/titles-reveal-phase";
import { RankingRevealPhase } from "./phases/ranking-reveal-phase";
import { WinnerRevealPhase } from "./phases/winner-reveal-phase";
import { ClosingPhase } from "./phases/closing-phase";

interface CeremonyScreenProps {
    ceremony: EndingCeremonyState;
    players: Player[];
    onAdvance: () => void;
    onNewSession: () => void;
}

/**
 * Ceremony Screen — cinematic multi-stage ending ceremony.
 *
 * Orchestrates 7 sequential phases:
 *   1. intro — "الليلة قربت تخلص..."
 *   2. session-summary — aggregate stats
 *   3. titles-reveal — earned titles + treasure outcomes
 *   4. player-reveals — personalized story cards
 *   5. ranking-reveal — progressive ranking
 *   6. winner-reveal — cinematic winner presentation
 *   7. closing — emotional ending + new session CTA
 *
 * Each phase is a self-contained component.
 * Phase transitions use AnimatePresence for smooth crossfades.
 * Mobile-first: compact spacing, readable hierarchy, minimal scrolling.
 */
export function CeremonyScreen({
    ceremony,
    players,
    onAdvance,
    onNewSession,
}: CeremonyScreenProps) {
    const { phase, finalScores, winnerId } = ceremony;

    return (
        <div className="flex w-full justify-center px-4 py-2">
            <CozyCard className="w-full max-w-sm rounded-[28px] p-3.5">
                {/* Ambient atmosphere */}
                <div className="pointer-events-none absolute inset-0 rounded-[28px] bg-[radial-gradient(circle_at_top,rgba(246,208,140,0.10),transparent_60%)]" />

                <div className="relative z-10">
                    <AnimatePresence mode="wait">
                        {phase === "intro" && (
                            <motion.div key="intro">
                                <IntroPhase onContinue={onAdvance} />
                            </motion.div>
                        )}

                        {phase === "session-summary" && (
                            <motion.div key="session-summary">
                                <SessionSummaryPhase players={players} onContinue={onAdvance} />
                            </motion.div>
                        )}

                        {phase === "titles-reveal" && (
                            <motion.div key="titles-reveal">
                                <TitlesRevealPhase players={players} onContinue={onAdvance} />
                            </motion.div>
                        )}

                        {phase === "player-reveals" && (
                            <motion.div key="player-reveals">
                                <PlayerRevealsPhase players={players} onContinue={onAdvance} />
                            </motion.div>
                        )}

                        {phase === "ranking-reveal" && (
                            <motion.div key="ranking-reveal">
                                <RankingRevealPhase finalScores={finalScores} onContinue={onAdvance} />
                            </motion.div>
                        )}

                        {phase === "winner-reveal" && (
                            <motion.div key="winner-reveal">
                                <WinnerRevealPhase
                                    finalScores={finalScores}
                                    winnerId={winnerId}
                                    onContinue={onAdvance}
                                />
                            </motion.div>
                        )}

                        {phase === "closing" && (
                            <motion.div key="closing">
                                <ClosingPhase onNewSession={onNewSession} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </CozyCard>
        </div>
    );
}

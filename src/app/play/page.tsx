// app/play/page.tsx
"use client";

import { Suspense } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";

import { ScreenContainer } from "@/components/ui/layout/screen-container";
import { ActiveStationSurface } from "@/components/game/active-station-surface";
import { TreasureOpportunityCard } from "@/components/game/treasure-opportunity";
import { Label, Muted, Headline } from "@/components/ui/typography";

import { useGameSession } from "@/hooks/useGameSession";

/* ─── Animation ─── */
const floatBob = {
    animate: {
        y: [0, -3, 0],
        transition: { duration: 3, repeat: Infinity, ease: "easeInOut" as const },
    },
};

/* ═══════════════════════════════════════════════════════════
    RUNTIME ARCHITECTURE

    Zustand store  → single source of truth (game-session-store)
    session-engine → gameplay authority (pure functions)
    useGameSession → React adapter (timers, navigation, UI sync)
    Components     → pure renderers

    Runtime flow:
      question → submit → reveal → result → (treasure) → transition → next
    ═══════════════════════════════════════════════════════════ */

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
    ceremony: import("@/lib/session-runtime/session-engine").EndingCeremonyState;
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
    const router = useRouter();

    const {
        ceremony,
        gameplayPhase,
        currentPlayer,
        station,
        activePath,
        activeTreasure,
        awardedTitle,
        lastResult,
        handleSubmit,
        handleContinueFromResult,
        handleOpenTreasure,
        handleDismissTreasure,
        // New explicit exit handler for completed paths
        handleTransition,
        handleAdvanceCeremony,
        progressLabel,
        hasHydrated,
        // Added from useGameSession for explicit exit actions
    } = useGameSession();

    /* ─── No session — show loading (redirect handled by useGameSession) ─── */
    // If the store hasn't hydrated or there is no active player, show a loading state.
    if (!hasHydrated || !currentPlayer) {
        return (
            <ScreenContainer className="justify-center items-center">
                <Muted>جاري التحميل...</Muted>
            </ScreenContainer>
        );
    }

    /* ─── Ending Ceremony ─── */
    if (ceremony) {
        return (
            <EndingCeremonyView
                ceremony={ceremony}
                onAdvance={handleAdvanceCeremony}
            />
        );
    }

    /* ─── No active path — show loading briefly, then redirect ─── */
    // play/page MUST NEVER silently lose selected path state.
    // If we reach here with a pathId but no activePath, the store
    // hydration may still be in progress. Show loading instead of
    // immediately showing "no path" error.
    // If there is no current station (e.g., after completing a path) and the
    // active path is not marked as completed, show a loading fallback. When the
    // path is completed we want to render the transition UI instead of the
    // generic "جاري تحميل المسار..." fallback, because the turn system will
    // navigate to the next player shortly.
    if (!station && (!activePath || !activePath.completed)) {
        // Show a generic loading state when no active path is available or the
        // path is still in progress.
        return (
            <ScreenContainer className="justify-center items-center">
                <Muted>جاري تحميل المسار...</Muted>
            </ScreenContainer>
        );
    }

    // If the active path is marked completed, show a terminal success UI.
    if (activePath?.completed) {
        return (
            <ScreenContainer className="justify-center items-center gap-4">
                <Headline className="text-primary text-2xl">أحسنت! اكتمل المسار ✨</Headline>
                <button
                    onClick={handleTransition}
                    className="rounded-full border border-secondary/20 bg-card/60 px-6 py-2.5 text-sm text-secondary/80 backdrop-blur-sm transition-all hover:bg-card/80 active:scale-95"
                >
                    العودة للمسارات
                </button>
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
                    Progress derives from: currentStationIndex + completed stations.
                    Shows completed stations out of total, with station dots.
                    ═══════════════════════════════════════════ */}
                 {activePath && (
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
                                 {activePath.currentStationIndex} من {activePath.stations.length} محطات
                             </Muted>
                         </div>
                         <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-surface-soft">
                             <motion.div
                                 initial={{ width: 0 }}
                                 animate={{
                                     width: `${Math.round((activePath.currentStationIndex / activePath.stations.length) * 100)}%`,
                                 }}
                                 transition={{ duration: 0.5, ease: "easeOut" as const }}
                                 className="absolute inset-y-0 right-0 rounded-full bg-linear-to-l from-secondary via-amber-400 to-secondary/80"
                             />
                         </div>
                     </motion.div>
                 )}

                {/* ═══════════════════════════════════════════
                    🃏 ACTIVE GAMEPLAY SURFACE
                    Pure renderer — receives phase and result from orchestrator.
                    Emits: onSubmit(answer), onContinue()
                    ═══════════════════════════════════════════ */}
                {(gameplayPhase === "question" || gameplayPhase === "reveal" || gameplayPhase === "result") && station && (
                    <ActiveStationSurface
                        key={station.id}
                        station={station}
                        phase={gameplayPhase === "question" ? "question" : gameplayPhase === "reveal" ? "reveal" : "result"}
                        result={lastResult}
                        onSubmit={handleSubmit}
                        onContinue={handleContinueFromResult}
                    />
                )}

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
                            {lastResult?.isCorrect
                                ? "أحسنت! المسار اكتمل 🌟"
                                : "الجولة خلصت"}
                        </Headline>
                        <Muted className="text-sm">
                            {lastResult?.isCorrect
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


// app/play/page.tsx
"use client";

import { Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";

import { ScreenContainer } from "@/components/ui/layout/screen-container";
import { ActiveStationSurface } from "@/components/game/active-station-surface";
import { TreasureOpportunityCard } from "@/components/game/treasure-opportunity";
import { Label, Muted, Headline } from "@/components/ui/typography";
import { LanternButton } from "@/components/ui/lantern-button";

import { useGameSession } from "@/hooks/useGameSession";
import { useSoundtrack } from "@/hooks/useSoundtrack";
import { TreasureRevealView } from "@/components/game/treasure-reveal-view";
import { iconAssets } from "@/assets";
import { MoodSticker } from "@/components/ui/mood-sticker";

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
    const soundtrack = useSoundtrack();

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
        handleContinueFromTreasureReveal,
        treasureRevealData,
        // Transition to path‑selection screen after a turn ends
        handleTransition,
        handleAdvanceCeremony,
        progressLabel,
        hasHydrated,
        // Explicit UI exit flag – true when navigating away from play page
        isLeavingPlay,
    } = useGameSession();

    /* ─── Ending Ceremony — redirect to dedicated ceremony page ─── */
    useEffect(() => {
        if (ceremony) {
            router.replace("/ending");
        }
    }, [ceremony, router]);

    /* ─── Soundtrack — play gameplay music when session is active ─── */
    useEffect(() => {
        if (hasHydrated && currentPlayer && !ceremony) {
            soundtrack.play("gameplay", 0.25);
        }
        // Don't stop on unmount — let the next page handle the transition.
        // This prevents a silence gap when navigating to /ending.
    }, [hasHydrated, currentPlayer, ceremony, soundtrack]);

    /* ─── No session — show loading (redirect handled by useGameSession) ─── */
    if (!hasHydrated || !currentPlayer) {
        return (
            <ScreenContainer className="justify-center items-center gap-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col items-center gap-4"
                >
                    <MoodSticker mood="thinking" size={160} delay={0.1} />
                    <div className="flex flex-col items-center gap-1">
                        <Label className="text-foreground text-sm font-semibold">جاري تحميل الجلسة</Label>
                        <Muted className="text-xs">استنى شوية...</Muted>
                    </div>
                </motion.div>
            </ScreenContainer>
        );
    }

    /* ─── Ending Ceremony — show loading while redirecting ─── */
    if (ceremony) {
        return (
            <ScreenContainer className="justify-center items-center gap-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col items-center gap-4"
                >
                    <MoodSticker mood="thinking" size={160} delay={0.1} />
                    <div className="flex flex-col items-center gap-1">
                        <Label className="text-foreground text-sm font-semibold">جاري تحضير الحفل</Label>
                        <Muted className="text-xs">اللحظة الحلوة جاية...</Muted>
                    </div>
                </motion.div>
            </ScreenContainer>
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

    // Exit detection: when a path completes, activePathId becomes null.
    // During this exit, we should not render any loading fallback to avoid flicker.
    // 2️⃣ Explicit exit detection – when navigation is triggered we render nothing.
    if (isLeavingPlay) {
        return null;
    }

    // When gameplayPhase is "transition", the turn is ending and handleTransition()
    // is navigating away. Do NOT show the loading fallback — it creates a freeze.
    // The transition phase means the engine decided the turn is over; we just wait
    // for navigation to complete (or show a brief transition UI).
    if (gameplayPhase === "transition") {
        return null;
    }

    // When gameplayPhase is "treasure-reveal", the treasure reveal UI is showing.
    // Do NOT show the loading fallback — the reveal renders independently.
    if (gameplayPhase === "treasure-reveal") {
        // Fall through to the main render which includes the treasure-reveal block
    } else if (!station && (!activePath || !activePath.completed)) {
        // Show a generic loading state when no active path is available or the
        // path is still in progress — but NOT during transition or treasure-reveal.
        return (
            <ScreenContainer className="justify-center items-center gap-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col items-center gap-4"
                >
                    <MoodSticker mood="thinking" size={160} delay={0.1} />
                    <div className="flex flex-col items-center gap-1">
                        <Label className="text-foreground text-sm font-semibold">جاري تحميل المسار</Label>
                        <Muted className="text-xs">استنى شوية...</Muted>
                    </div>
                </motion.div>
            </ScreenContainer>
        );
    }

    // If the active path is marked completed, show a terminal success UI.
    if (activePath?.completed) {
        return (
            <ScreenContainer className="justify-center items-center gap-4">
                <MoodSticker mood="celebration" size={160} />
                <Headline className="bg-linear-to-l from-amber-500 via-secondary to-amber-600 bg-clip-text text-transparent text-2xl font-bold">أحسنت! اكتمل المسار</Headline>
                <LanternButton onClick={handleTransition}>
                    العودة للمسارات
                </LanternButton>
            </ScreenContainer>
        );
    }

    return (
        <ScreenContainer className="justify-center gap-0">
            <div className="flex flex-1 min-h-0 flex-col gap-1 justify-center">
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
                            flex items-center gap-2
                            rounded-full
                            border border-secondary/12
                            bg-card/70
                            px-3 py-1
                            backdrop-blur-sm
                            shadow-soft
                        "
                    >
                        <motion.div
                            variants={floatBob}
                            animate="animate"
                            className="relative h-6 w-6 select-none"
                        >
                            <Image
                                src={iconAssets.logoMark}
                                alt="Kenzoo"
                                fill
                                className="object-contain"
                            />
                        </motion.div>
                        <Label className="text-primary text-xs font-semibold">
                            دور {currentPlayer.name}
                        </Label>
                        {currentPlayer.treasures > 0 && (
                            <div
                                className="
                                    flex items-center gap-1.5
                                    rounded-full
                                    border border-primary/10
                                    bg-primary/8
                                    px-3 py-1
                                "
                            >
                                <Image src={iconAssets.treasure} alt="" width={20} height={20} className="object-contain" />
                                <Label className="text-primary text-xs font-semibold tabular-nums">
                                    {currentPlayer.treasures}
                                </Label>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* ═══════════════════════════════════════════
                    🗺️ PATH PROGRESS INDICATOR
                    ═══════════════════════════════════════════ */}
                 {activePath && (
                     <motion.div
                         initial={{ opacity: 0 }}
                         animate={{ opacity: 1 }}
                         transition={{ delay: 0.1 }}
                         className="flex flex-col gap-1 px-1"
                     >
                         <div className="flex items-center justify-between">
                             <Muted className="text-[9px]">
                                 {progressLabel}
                             </Muted>
                             <div className="flex items-center gap-1">
                                 <Image src={iconAssets.starsSticker} alt="" width={14} height={14} className="object-contain opacity-50" />
                                 <Muted className="text-[9px]">
                                     {activePath.currentStationIndex}/{activePath.stations.length}
                                 </Muted>
                             </div>
                         </div>
                         <div className="relative h-1 w-full overflow-hidden rounded-full bg-surface-soft">
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
                    🎁 TREASURE REVEAL — Suspenseful reveal experience
                    ═══════════════════════════════════════════ */}
                {gameplayPhase === "treasure-reveal" && treasureRevealData && (
                    <TreasureRevealView
                        data={treasureRevealData}
                        onContinue={handleContinueFromTreasureReveal}
                    />
                )}

                {/* Transition UI is handled earlier via isExitingPlay logic */}
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


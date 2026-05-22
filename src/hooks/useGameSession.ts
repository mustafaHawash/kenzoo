/**
 * useGameSession.ts
 *
 * React runtime adapter for gameplay.
 *
 * This hook is a THIN LAYER between:
 *   - Zustand store (single source of truth)
 *   - session-engine (gameplay authority)
 *   - React components (rendering)
 *
 * RESPONSIBILITIES:
 *   - Initialize session from store on mount
 *   - Coordinate timers (reveal delay)
 *   - Handle navigation (router)
 *   - Expose handlers to UI
 *   - Guard against missing session (redirect)
 *
 * DOES NOT OWN:
 *   - Gameplay decisions (session-engine owns these)
 *   - Runtime state (Zustand store owns this)
 *   - Progression logic (session-engine owns this)
 */

import { useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import { useGameSessionStore } from "@/store/game-session-store";
import { resolveTurn } from "@/lib/session-runtime/turn-engine";
import {
    applyTurnOutcome,
    getSessionProgressLabel,
} from "@/lib/session-runtime/session-engine";
import type { SessionState } from "@/lib/session-runtime/session-engine";

import { eidTreasures } from "@/content/themes/eid-el-adha/treasures";
import { pickRandomTitle } from "@/content/themes/eid-el-adha/titles";
import { toGameplayTreasureView } from "@/types/treasure";
import { getCurrentPath } from "@/lib/session-runtime/selectors/get-current-path";

/**
 * Reveal delay in ms.
 * Calm but not sluggish — 800ms feels cinematic without testing patience.
 * Owned by the orchestrator, NOT by the surface component.
 */
const REVEAL_DELAY_MS = 800;

/**
 * useGameSession — React runtime adapter.
 *
 * Connects Zustand store to React components.
 * Handles timers, navigation, and session initialization.
 * Delegates all gameplay decisions to session-engine.
 */
export function useGameSession(pathId: string | null) {
    const router = useRouter();

    /* ─── Store reads ─── */
    const lifecycle = useGameSessionStore((s) => s.lifecycle);
    const persistentState = useGameSessionStore((s) => s.persistentState);
    const runtimeState = useGameSessionStore((s) => s.runtimeState);
    const gameplayPhase = useGameSessionStore((s) => s.gameplayPhase);
    const ceremony = useGameSessionStore((s) => s.ceremony);
    const lastResult = useGameSessionStore((s) => s.lastResult);
    const awardedTitle = useGameSessionStore((s) => s.awardedTitle);

    /* ─── Store actions ─── */
    const initSession = useGameSessionStore((s) => s.initSession);
    const clearSession = useGameSessionStore((s) => s.clearSession);
    const setGameplayPhase = useGameSessionStore((s) => s.setGameplayPhase);
    const commitTurnOutcome = useGameSessionStore((s) => s.commitTurnOutcome);
    const setLastResult = useGameSessionStore((s) => s.setLastResult);
    const continueFromResult = useGameSessionStore((s) => s.continueFromResult);
    const dismissTreasure = useGameSessionStore((s) => s.dismissTreasure);
    const transitionToNextTurn = useGameSessionStore((s) => s.transitionToNextTurn);
    const openTreasure = useGameSessionStore((s) => s.openTreasure);
    const setAwardedTitle = useGameSessionStore((s) => s.setAwardedTitle);
    const advanceCeremony = useGameSessionStore((s) => s.advanceCeremony);
    const getHydratedState = useGameSessionStore((s) => s.getHydratedState);
    const getCurrentPlayer = useGameSessionStore((s) => s.getCurrentPlayer);
    const getStation = useGameSessionStore((s) => s.getStation);

    /* ─── Session initialization ─── */
    useEffect(() => {
        if (lifecycle === "idle" || !persistentState) {
            // No session in Zustand — redirect to setup
            router.replace("/session/setup");
            return;
        }

        // PATH HANDOFF: If we have a persistent state but no activePathId and pathId is set,
        // we need to select the path. This covers the case where gameplay/page
        // navigated via URL but the store hasn't been updated yet.
        // Also covers page refresh where runtimeState is lost.
        //
        // CRITICAL GUARD: Do NOT re-initialize during transition or ending phases.
        // When a path ends (wrong answer or path completed), activePathId becomes null
        // but the phase is "transition" or "ending" — re-initializing here would
        // reset the path and show the same question again (duplicate question bug).
        //
        // DETERMINISTIC: We check activePathId (not activePath) because activePathId
        // is the authoritative runtime reference. activePath object may be stale.
        const phase = useGameSessionStore.getState().gameplayPhase;
        if (pathId && !runtimeState.activePathId && persistentState && phase === "path-selection") {
            initSession(persistentState, pathId);
        }
    }, [lifecycle, persistentState, pathId, runtimeState.activePathId, initSession, router]);

    /* ─── Session guard ─── */
    useEffect(() => {
        if (lifecycle === "idle" && !persistentState) {
            router.replace("/session/setup");
        }
    }, [lifecycle, persistentState, router]);

    /* ─── Derived values ─── */
    const hydratedState = getHydratedState();
    const currentPlayer = getCurrentPlayer();
    const station = getStation();
    // Derive the active path deterministically from persistent state + activePathId.
    const activePath = runtimeState.activePathId
        ? getCurrentPath(persistentState, runtimeState.activePathId)
        : null;

    const activeTreasure = runtimeState.activeTreasure
        ? toGameplayTreasureView(runtimeState.activeTreasure.treasure)
        : null;

    const progressLabel = useGameSessionStore((s) =>
        s.persistentState ? getSessionProgressLabel(s.persistentState) : ""
    );

    /* ─── Refs for timer cleanup and submit guard ─── */
    const revealTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isSubmittingRef = useRef(false);
    const isMountedRef = useRef(true);

    /* ─── Cleanup on unmount ─── */
    useEffect(() => {
        isMountedRef.current = true;
        return () => {
            isMountedRef.current = false;
            if (revealTimerRef.current) {
                clearTimeout(revealTimerRef.current);
                revealTimerRef.current = null;
            }
        };
    }, []);

    /* ═══════════════════════════════════════════════════════════
        SUBMIT — Player submits an answer

        1. Resolve answer via turn-engine (pure function)
        2. Commit outcome to store (stars, treasure opportunity)
        3. Transition to "reveal" phase
        4. Schedule reveal→result transition after cinematic delay
       ═══════════════════════════════════════════════════════════ */
    const handleSubmit = useCallback(
        (answer: string) => {
            if (!station || !currentPlayer) return;

            // Guard: prevent double submission during reveal phase
            if (isSubmittingRef.current) return;
            // Guard: only submit from question phase
            if (gameplayPhase !== "question") return;

            const hydrated = getHydratedState();
            if (!hydrated) return;

            isSubmittingRef.current = true;

            const treasureMultiplier = activePath?.treasureProbabilityMultiplier ?? 1;

            // 1. Pure resolution
            const outcome = resolveTurn(
                currentPlayer,
                station,
                answer,
                eidTreasures,
                hydrated.claimedLegendaryIds,
                treasureMultiplier,
            );

            // 2. Commit outcome to store IMMEDIATELY
            commitTurnOutcome(outcome);
            setLastResult(outcome.roundResult);

            // 3. Transition to reveal phase
            setGameplayPhase("reveal");

            // 4. Schedule cinematic reveal→result transition
            if (revealTimerRef.current) clearTimeout(revealTimerRef.current);
            revealTimerRef.current = setTimeout(() => {
                // Guard: don't fire if component unmounted
                if (!isMountedRef.current) return;
                setGameplayPhase("result");
                revealTimerRef.current = null;
                isSubmittingRef.current = false;
            }, REVEAL_DELAY_MS);
        },
        [station, currentPlayer, activePath, gameplayPhase, getHydratedState, commitTurnOutcome, setLastResult, setGameplayPhase],
    );

    /* ═══════════════════════════════════════════════════════════
        CONTINUE FROM RESULT — Delegates to store
       ═══════════════════════════════════════════════════════════ */
    const handleContinueFromResult = useCallback(() => {
        continueFromResult();
    }, [continueFromResult]);

    /* ═══════════════════════════════════════════════════════════
        OPEN TREASURE — Player chooses to open the treasure
       ═══════════════════════════════════════════════════════════ */
    const handleOpenTreasure = useCallback(() => {
        const hydrated = getHydratedState();
        if (!hydrated?.activeTreasure) return;

        // Guard: only open treasure during treasure phase
        if (gameplayPhase !== "treasure") return;

        openTreasure();

        if (hydrated.activeTreasure.treasure.reward.type === "title" && currentPlayer) {
            const title = pickRandomTitle(currentPlayer.titles);
            setAwardedTitle(title);
        }
    }, [getHydratedState, openTreasure, currentPlayer, setAwardedTitle, gameplayPhase]);

    /* ═══════════════════════════════════════════════════════════
        DISMISS TREASURE — Delegates to store
       ═══════════════════════════════════════════════════════════ */
    const handleDismissTreasure = useCallback(() => {
        dismissTreasure();
    }, [dismissTreasure]);

    /* ═══════════════════════════════════════════════════════════
        TRANSITION — Navigate back to gameplay / path selection
       ═══════════════════════════════════════════════════════════ */
    const handleTransition = useCallback(() => {
        transitionToNextTurn();
        router.push("/gameplay");
    }, [transitionToNextTurn, router]);

    /* ═══════════════════════════════════════════════════════════
        ADVANCE CEREMONY — Step through ending ceremony phases
       ═══════════════════════════════════════════════════════════ */
    const handleAdvanceCeremony = useCallback(() => {
        advanceCeremony();
    }, [advanceCeremony]);

    return {
        sessionState: hydratedState,
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
        handleTransition,
        handleAdvanceCeremony,
        progressLabel,
    };
}

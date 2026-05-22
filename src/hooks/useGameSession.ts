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
import { getCurrentPlayer as selectorGetCurrentPlayer } from "@/lib/session-runtime/selectors/get-current-player";
import { getCurrentStation as selectorGetCurrentStation } from "@/lib/session-runtime/selectors/get-current-station";
import type { Player } from "@/types/player";

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
// The hook no longer receives a pathId – activePathId is owned solely by the store.
export function useGameSession() {
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
    // Derive gameplay objects via selectors – store no longer provides wrappers.
    // Reactive selectors replace previous imperative getState calls.
    const currentPlayer = useGameSessionStore((s) =>
        selectorGetCurrentPlayer(s.persistentState)
    );
    const station = useGameSessionStore((s) =>
        selectorGetCurrentStation(s.persistentState, s.runtimeState.activePathId)
    );

    /* ─── Session initialization ─── */
    useEffect(() => {
        if (lifecycle === "idle" || !persistentState) {
            // No session in Zustand — redirect to setup
            router.replace("/session/setup");
            return;
        }

        // No path handoff here – path selection is performed via the store's selectPath action.
    }, [lifecycle, persistentState, runtimeState.activePathId, initSession, router]);

    /* ─── Session guard ─── */
    useEffect(() => {
        if (lifecycle === "idle" && !persistentState) {
            router.replace("/session/setup");
        }
    }, [lifecycle, persistentState, router]);

    /* ─── Derived values ─── */
    const hydratedState = getHydratedState();
    // Derive the active path deterministically from persistent state + activePathId.
    const activePath = runtimeState.activePathId
        ? getCurrentPath(persistentState, runtimeState.activePathId)
        : null;

    // Derive the active treasure view from the stored treasure ID when needed.
    // The full treasure object is obtained via selectors elsewhere; here we keep only the ID.
    // Derive active treasure ID reactively. Full treasure object is derived elsewhere via a selector when needed.
    const activeTreasureId = useGameSessionStore((s) => s.runtimeState.activeTreasureId ?? null);
    // Derive the full active treasure object reactively from the ID.
    const activeTreasure = useGameSessionStore((s) => {
        if (!s.runtimeState.activeTreasureId) return null;
        // Search the theme's treasure pool for the matching ID.
        const found = eidTreasures.find((t) => t.id === s.runtimeState.activeTreasureId);
        return found ? toGameplayTreasureView(found) : null;
    });

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
        // Guard: only open treasure during treasure phase and when a treasure ID exists
        if (gameplayPhase !== "treasure" || !activeTreasureId) return;

        // Resolve the full treasure definition from the theme pool.
        const fullTreasure = eidTreasures.find((t) => t.id === activeTreasureId);
        if (!fullTreasure) return; // safety fallback

        openTreasure();

        // If the opened treasure rewards a title, assign a random title to the player.
        if (fullTreasure.reward.type === "title" && currentPlayer) {
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
        // UI components can use either the ID or the full object derived here.
        activeTreasureId,
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

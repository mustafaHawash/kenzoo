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

import { useCallback, useEffect, useRef, useMemo, useState } from "react";
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
 * useGameSession – React adapter for gameplay.
 * Connects the Zustand store to components, handling timers, navigation,
 * and UI state. All game‑logic decisions are delegated to the session engine.
 */
export function useGameSession() {
    const router = useRouter();

    // ---------------------------------------------------------------------
    // 1️⃣ Explicit exit UI state
    // ---------------------------------------------------------------------
    // Represents a user‑initiated navigation away from the play page.
    // It is *not* derived from runtime values such as `!activePath` because
    // those can be true during hydration or when a path is legitimately
    // completed. The flag is set only by `handleTransition`.
    const [isLeavingPlay, setIsLeavingPlay] = useState(false);

    /* ─── Store reads ─── */
    // Primitive selectors – each returns a stable primitive/value reference.
    const lifecycle = useGameSessionStore((s) => s.lifecycle);
    const persistentState = useGameSessionStore((s) => s.persistentState);
    const hasHydrated = useGameSessionStore((s) => s.hasHydrated);
    // Avoid subscribing to the whole runtimeState object (causes unnecessary rerenders).
    // Individual runtime fields are selected below where needed.
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
    const clearRuntime = useGameSessionStore((s) => s.clearRuntime);
    const openTreasure = useGameSessionStore((s) => s.openTreasure);
    const setAwardedTitle = useGameSessionStore((s) => s.setAwardedTitle);
    const advanceCeremony = useGameSessionStore((s) => s.advanceCeremony);
    // Primitive runtime selectors – avoid returning whole objects.
    const activePathId = useGameSessionStore((s) => s.runtimeState.activePathId);

    const currentPlayer = useMemo(
        () => selectorGetCurrentPlayer(persistentState),
        [persistentState],
    );
    const station = useMemo(
        () => selectorGetCurrentStation(persistentState, activePathId),
        [persistentState, activePathId],
    );

    /* ─── Session initialization ─── */
    useEffect(() => {
        // Guard: only attempt redirect after hydration is complete.
        if (!hasHydrated) return;
        if (lifecycle === "idle" || !persistentState) {
            // No session in Zustand — redirect to setup
            router.replace("/session/setup");
        }
        // No path handoff here – path selection is performed via the store's selectPath action.
    }, [lifecycle, persistentState, hasHydrated, router]);

    // Duplicate session guard removed – the initialization effect above already
    // handles redirection after hydration. Keeping a single guard prevents
    // multiple redirects that could cause navigation loops.

    // NOTE: Removed automatic navigation on gameplayPhase change.
    // Navigation is now performed explicitly via handlers (e.g., handleTransition).
    // This prevents navigation races and hydration conflicts caused by phase‑watcher effects.

    /* ─── Derived values ─── */
    // Derive the active path deterministically from persistent state + activePathId.
    const activePath = useMemo(
        () =>
            activePathId
                ? getCurrentPath(persistentState, activePathId)
                : null,
        [persistentState, activePathId],
    );

    // Derive the active treasure view from the stored treasure ID when needed.
    // The full treasure object is obtained via selectors elsewhere; here we keep only the ID.
    // Derive active treasure ID reactively. Full treasure object is derived elsewhere via a selector when needed.
    const activeTreasureId = useGameSessionStore((s) => s.runtimeState.activeTreasureId ?? null);
    const activeTreasure = useMemo(() => {
        if (!activeTreasureId) return null;
        const found = eidTreasures.find((t) => t.id === activeTreasureId);
        return found ? toGameplayTreasureView(found) : null;
    }, [activeTreasureId]);

    // Primitive subscription – only watch persistentState reference.
    const persistent = useGameSessionStore((s) => s.persistentState);
    const progressLabel = useMemo(() => {
        return persistent ? getSessionProgressLabel(persistent) : "";
    }, [persistent]);

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

    /* ─── SUBMIT — Player submits an answer ─── */
    const handleSubmit = useCallback(
        (answer: string) => {
            // Guard: missing data – clear flag before exit
            if (!station || !currentPlayer) {
                isSubmittingRef.current = false;
                return;
            }
            // Guard: prevent double submission
            if (isSubmittingRef.current) {
                isSubmittingRef.current = false;
                return;
            }
            // Guard: only allow submit in question phase
            if (gameplayPhase !== "question") {
                isSubmittingRef.current = false;
                return;
            }

            isSubmittingRef.current = true;

            if (!persistentState) {
                isSubmittingRef.current = false;
                return;
            }
                
                // Derive treasure multiplier from the active path ID without relying on the
                // derived `activePath` object (to keep the callback dependencies minimal).
                const activePathObj = activePathId
                    ? getCurrentPath(persistentState, activePathId)
                    : null;
                const treasureMultiplier = activePathObj?.treasureProbabilityMultiplier ?? 1;
                
                // 1. Pure resolution
                const outcome = resolveTurn(
                    currentPlayer,
                    station,
                    answer,
                    eidTreasures,
                    persistentState.claimedLegendaryIds,
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
            // Dependency array updated: replace `activePath` with `activePathId`
            [station, currentPlayer, activePathId, gameplayPhase, persistentState, commitTurnOutcome, setLastResult, setGameplayPhase],
        );

    /* ═══════════════════════════════════════════════════════════
        CONTINUE FROM RESULT — Delegates to store
       ═══════════════════════════════════════════════════════════ */
    /* ═══════════════════════════════════════════════════════════
        TRANSITION — Navigate back to gameplay / path selection
       ═══════════════════════════════════════════════════════════ */
     // Navigation must occur before state transition to avoid clearing runtime
     // state prematurely. The router push triggers a page change, then the
     // store updates the turn.
      // After a turn ends we need to show the path‑selection UI. The correct page for that
      // is "/gameplay" (the path‑selection screen). Previously this navigated to "/play",
      // which expects an active path and caused the UI to freeze on loading.
        const handleTransition = useCallback(() => {
            // Mark intentional exit so the play page can render the exit fallback.
            setIsLeavingPlay(true);

            // Replace the URL with the path‑selection screen.
            router.replace("/gameplay");

            // Defer runtime cleanup until after navigation has been processed.
            if (typeof requestAnimationFrame === "function") {
                requestAnimationFrame(() => {
                    transitionToNextTurn();
                    clearRuntime();
                });
            } else {
                setTimeout(() => {
                    transitionToNextTurn();
                    clearRuntime();
                }, 0);
            }
        }, [router, transitionToNextTurn, clearRuntime, setIsLeavingPlay]);

    /* ═══════════════════════════════════════════════════════════
        CONTINUE FROM RESULT — Delegates to store
       ═══════════════════════════════════════════════════════════ */
    // (removed - will be re-added after handleTransition)

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
    }, [openTreasure, currentPlayer, setAwardedTitle, gameplayPhase, activeTreasureId]);

    /* ═══════════════════════════════════════════════════════════
        DISMISS TREASURE — Delegates to store
       ═══════════════════════════════════════════════════════════ */
    const handleDismissTreasure = useCallback(() => {
        dismissTreasure();
    }, [dismissTreasure]);

    /* ═══════════════════════════════════════════════════════════
        CONTINUE FROM RESULT — Delegates to store
       ═══════════════════════════════════════════════════════════ */
    const handleContinueFromResult = useCallback(() => {
        continueFromResult();
        // continueFromResult() is synchronous (Zustand set()). After it runs,
        // if the engine decided "transition" phase, we MUST call handleTransition()
        // to advance the turn. Previously this only fired when activePath?.completed
        // was truthy — but activePath is null after path completion, and wrong answers
        // never triggered handleTransition at all.
        const phase = useGameSessionStore.getState().gameplayPhase;
        if (phase === "transition") {
            handleTransition();
        }
    }, [continueFromResult, handleTransition]);

    /* ═══════════════════════════════════════════════════════════
        ADVANCE CEREMONY — Step through ending ceremony phases
       ═══════════════════════════════════════════════════════════ */
    const handleAdvanceCeremony = useCallback(() => {
        advanceCeremony();
    }, [advanceCeremony]);

    // Consolidate return object in a single useMemo to keep hook order stable.
    const exported = useMemo(() => {
        if (!hasHydrated) {
        return {
            ceremony,
            gameplayPhase,
            currentPlayer: null,
            station: null,
            activePath: null,
            activeTreasureId: null,
            activeTreasure: null,
            awardedTitle,
            lastResult: null,
            handleSubmit: () => {},
            handleContinueFromResult,
            handleOpenTreasure: () => {},
            handleDismissTreasure: () => {},
            handleTransition,
            handleAdvanceCeremony,
            progressLabel,
            hasHydrated,
            // expose for play page terminal exit flow
            transitionToNextTurn,
            clearRuntime,
            isLeavingPlay,
        } as const;
        }
        return {
            ceremony,
            gameplayPhase,
            currentPlayer,
            station,
            activePath,
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
            hasHydrated,
            transitionToNextTurn,
            clearRuntime,
            isLeavingPlay,
        } as const;
    }, [
        ceremony,
        gameplayPhase,
        currentPlayer,
        station,
        activePath,
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
        hasHydrated,
    ]);

    return exported;
}

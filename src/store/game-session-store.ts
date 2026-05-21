/**
 * game-session-store.ts
 *
 * THE SINGLE RUNTIME SOURCE OF TRUTH.
 *
 * This Zustand store owns ALL runtime state:
 *   - PersistentSessionState (gameplay truth)
 *   - RuntimeSessionState (activePath, activeTreasure)
 *   - GameplayPhase (current flow phase)
 *   - EndingCeremonyState (ceremony progression)
 *   - SessionLifecycleState (session lifecycle)
 *   - Last round result (for rendering)
 *   - Awarded title (treasure UI)
 *
 * ARCHITECTURE:
 *   Zustand store  → single source of truth
 *   session-engine → gameplay authority (pure functions)
 *   useGameSession → React adapter (timers, navigation, UI sync)
 *
 * FUTURE EXPANSION BOUNDARIES (do NOT implement yet):
 *   - Backend sync: add subscribeWithSelector middleware
 *   - Save/load: serialize persistentState via extractPersistentState()
 *   - Seeded RNG: add sessionSeed to state, use in selectors
 *   - Analytics: add middleware that logs state transitions
 *   - AI generation: replace initSession with async version
 *   - Multiplayer: add optimistic updates + conflict resolution
 */

import { create } from "zustand";
import type {
    PersistentSessionState,
    SessionState,
    EndingCeremonyState,
    GameplayPhase,
} from "@/lib/session-runtime/session-engine";
import {
    hydrateSessionState,
    selectPath,
    applyTurnOutcome,
    applyTreasureOpen,
    resolveContinueFromResult,
    resolveDismissTreasure,
    resolveTransition,
    getSessionProgressLabel,
    advanceCeremonyPhase,
} from "@/lib/session-runtime/session-engine";
import type { RoundResult } from "@/types/session";
import type { Player } from "@/types/player";
import type { Station } from "@/types/station";
import type { SessionLifecycleState } from "@/lib/session-runtime/session-engine";

/* ─── Helpers ──────────────────────────────────────────── */

/**
 * Splits a SessionState into persistent + runtime parts.
 * Used after session-engine pure functions return full SessionState.
 */
function splitState(state: SessionState) {
    const {
        activePath,
        activeTreasure,
        ...persistent
    } = state;
    return {
        persistent: persistent as PersistentSessionState,
        runtime: { activePath, activeTreasure },
    };
}

/* ─── Store State ──────────────────────────────────────── */

export type GameSessionState = {
    /* ─── Session lifecycle ─── */
    lifecycle: SessionLifecycleState;

    /* ─── Persistent gameplay truth ─── */
    persistentState: PersistentSessionState | null;

    /* ─── Runtime-only state ─── */
    runtimeState: {
        activePath: SessionState["activePath"];
        activeTreasure: SessionState["activeTreasure"];
    };

    /* ─── Gameplay flow ─── */
    gameplayPhase: GameplayPhase;

    /* ─── Ending ceremony ─── */
    ceremony: EndingCeremonyState | null;

    /* ─── Last round result (for rendering) ─── */
    lastResult: RoundResult | null;

    /* ─── Treasure UI ─── */
    awardedTitle: string | null;
};

/* ─── Store Actions ────────────────────────────────────── */

export type GameSessionActions = {
    /* ─── Session lifecycle ─── */
    initSession: (persistent: PersistentSessionState, pathId?: string | null) => void;
    clearSession: () => void;
    setLifecycle: (lifecycle: SessionLifecycleState) => void;

    /* ─── Gameplay flow ─── */
    setGameplayPhase: (phase: GameplayPhase) => void;
    commitTurnOutcome: (outcome: Parameters<typeof applyTurnOutcome>[1]) => void;
    setLastResult: (result: RoundResult | null) => void;

    /* ─── Continue / Dismiss / Transition ─── */
    continueFromResult: () => void;
    dismissTreasure: () => void;
    transitionToNextTurn: () => void;

    /* ─── Treasure ─── */
    openTreasure: () => void;
    setAwardedTitle: (title: string | null) => void;

    /* ─── Ceremony ─── */
    advanceCeremony: () => void;

    /* ─── Selectors (derived, not stored) ─── */
    getHydratedState: () => SessionState | null;
    getProgressLabel: () => string;
    getCurrentPlayer: () => Player | null;
    getStation: () => Station | null;
};

/* ─── Store ────────────────────────────────────────────── */

export const useGameSessionStore = create<GameSessionState & GameSessionActions>()(
    (set, get) => ({

        /* ═══════════════════════════════════════════════════════════
           STATE
           ═══════════════════════════════════════════════════════════ */

        lifecycle: "idle",
        persistentState: null,
        runtimeState: { activePath: null, activeTreasure: null },
        gameplayPhase: "path-selection",
        ceremony: null,
        lastResult: null,
        awardedTitle: null,

        /* ═══════════════════════════════════════════════════════════
           SESSION LIFECYCLE
           ═══════════════════════════════════════════════════════════ */

        initSession: (persistent, pathId) => {
            const hydrated = hydrateSessionState(persistent);
            const withPath = pathId ? selectPath(hydrated, pathId) : hydrated;
            const { runtime } = splitState(withPath);

            set({
                lifecycle: "active",
                persistentState: persistent,
                runtimeState: runtime,
                gameplayPhase: pathId ? "question" : "path-selection",
                ceremony: null,
                lastResult: null,
                awardedTitle: null,
            });
        },

        clearSession: () => {
            set({
                lifecycle: "idle",
                persistentState: null,
                runtimeState: { activePath: null, activeTreasure: null },
                gameplayPhase: "path-selection",
                ceremony: null,
                lastResult: null,
                awardedTitle: null,
            });
        },

        setLifecycle: (lifecycle) => {
            set({ lifecycle });
        },

        /* ═══════════════════════════════════════════════════════════
           GAMEPLAY FLOW
           ═══════════════════════════════════════════════════════════ */

        setGameplayPhase: (phase) => {
            set({ gameplayPhase: phase });
        },

        commitTurnOutcome: (outcome) => {
            const hydrated = get().getHydratedState();
            if (!hydrated) return;

            const updated = applyTurnOutcome(hydrated, outcome);
            const { persistent, runtime } = splitState(updated);

            set({ persistentState: persistent, runtimeState: runtime });
        },

        setLastResult: (result) => {
            set({ lastResult: result });
        },

        /* ═══════════════════════════════════════════════════════════
           CONTINUE / DISMISS / TRANSITION
           Delegate to session-engine resolveX() functions.
           ═══════════════════════════════════════════════════════════ */

        continueFromResult: () => {
            const state = get();
            const hydrated = state.getHydratedState();
            if (!hydrated) return;

            const decision = resolveContinueFromResult(hydrated, state.lastResult);
            const updates: Partial<GameSessionState> = {
                gameplayPhase: decision.nextPhase,
            };

            if (decision.updatedState) {
                const { persistent, runtime } = splitState(decision.updatedState);
                updates.persistentState = persistent;
                updates.runtimeState = runtime;
            }
            if (decision.ceremony) {
                updates.ceremony = decision.ceremony;
            }

            set(updates);
        },

        dismissTreasure: () => {
            const state = get();
            const hydrated = state.getHydratedState();
            if (!hydrated) return;

            const decision = resolveDismissTreasure(hydrated, state.lastResult);
            const updates: Partial<GameSessionState> = {
                gameplayPhase: decision.nextPhase,
                awardedTitle: null,
            };

            if (decision.updatedState) {
                const { persistent, runtime } = splitState(decision.updatedState);
                updates.persistentState = persistent;
                updates.runtimeState = runtime;
            }
            if (decision.ceremony) {
                updates.ceremony = decision.ceremony;
            }

            set(updates);
        },

        transitionToNextTurn: () => {
            const state = get();
            const hydrated = state.getHydratedState();
            if (!hydrated) return;

            const decision = resolveTransition(hydrated, state.lastResult);
            const updates: Partial<GameSessionState> = { lastResult: null };

            if (decision.updatedState) {
                const { persistent, runtime } = splitState(decision.updatedState);
                updates.persistentState = persistent;
                updates.runtimeState = runtime;
            }

            set(updates);
        },

        /* ═══════════════════════════════════════════════════════════
           TREASURE
           ═══════════════════════════════════════════════════════════ */

        openTreasure: () => {
            const hydrated = get().getHydratedState();
            if (!hydrated) return;

            const updated = applyTreasureOpen(hydrated);
            const { persistent, runtime } = splitState(updated);

            set({ persistentState: persistent, runtimeState: runtime });
        },

        setAwardedTitle: (title) => {
            set({ awardedTitle: title });
        },

        /* ═══════════════════════════════════════════════════════════
           CEREMONY
           ═══════════════════════════════════════════════════════════ */

        advanceCeremony: () => {
            set((state) => ({
                ceremony: state.ceremony
                    ? advanceCeremonyPhase(state.ceremony)
                    : state.ceremony,
            }));
        },

        /* ═══════════════════════════════════════════════════════════
           SELECTORS (derived, not stored)
           ═══════════════════════════════════════════════════════════ */

        getHydratedState: () => {
            const state = get();
            if (!state.persistentState) return null;
            return {
                ...state.persistentState,
                ...state.runtimeState,
            };
        },

        getProgressLabel: () => {
            const state = get();
            if (!state.persistentState) return "";
            return getSessionProgressLabel(state.persistentState);
        },

        getCurrentPlayer: () => {
            const state = get();
            if (!state.persistentState) return null;
            return state.persistentState.players[state.persistentState.currentPlayerIndex] ?? null;
        },

        getStation: () => {
            const state = get();
            return state.runtimeState.activePath?.currentStation ?? null;
        },
    }),
);


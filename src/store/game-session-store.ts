
/**
 * game-session-store.ts
 *
 * THE SINGLE RUNTIME SOURCE OF TRUTH.
 *
 * This Zustand store owns ALL runtime state:
 *   - PersistentSessionState (gameplay truth) — persisted to localStorage
 *   - RuntimeSessionState (activePath, activeTreasure) — NEVER persisted
 *   - GameplayPhase (current flow phase) — NEVER persisted
 *   - EndingCeremonyState (ceremony progression) — NEVER persisted
 *   - SessionLifecycleState (session lifecycle) — NEVER persisted
 *   - Last round result (for rendering) — NEVER persisted
 *   - Awarded title (treasure UI) — NEVER persisted
 *   - isGenerating (generation guard) — NEVER persisted
 *
 * PERSISTENCE ARCHITECTURE:
 *   - Zustand persist middleware saves ONLY PersistentSessionState to localStorage
 *   - Runtime-only state is reconstructed from persistent state on hydration
 *   - Hydration guards prevent stale/invalid state from reaching the UI
 *   - On page refresh: lifecycle → "active", gameplayPhase → "path-selection"
 *   - Player must re-select a path after refresh (activePath is runtime-only)
 *
 * ARCHITECTURE:
 *   Zustand store  → single source of truth
 *   session-engine → gameplay authority (pure functions)
 *   useGameSession → React adapter (timers, navigation, UI sync)
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
    PersistentSessionState,
    SessionState,
    EndingCeremonyState,
    GameplayPhase,
    SessionLifecycleState,
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
    getCurrentStationFromPersistentState,
    deriveActivePathFromPersistentState,
} from "@/lib/session-runtime/session-engine";
import type { RoundResult } from "@/types/session";
import type { Player } from "@/types/player";
import type { Station } from "@/types/station";

/* ─── Valid Phase Transitions ───────────────────────────── */

const VALID_TRANSITIONS: Record<GameplayPhase, GameplayPhase[]> = {
    "path-selection": ["question", "ending"],
    "question": ["reveal", "ending"],
    "reveal": ["result", "ending"],
    "result": ["treasure", "transition", "question", "ending"],
    "treasure": ["question", "transition", "ending"],
    "transition": ["path-selection", "ending"],
    "ending": ["ending"],
};

function isValidTransition(from: GameplayPhase, to: GameplayPhase): boolean {
    if (to === "ending") return true;
    const allowed = VALID_TRANSITIONS[from];
    return allowed ? allowed.includes(to) : false;
}

/* ─── Helpers ──────────────────────────────────────────── */

function splitState(state: SessionState) {
         const {
         activePathId,
         activeTreasure,
         ...persistent
     } = state;
     return {
         persistent: persistent as PersistentSessionState,
         runtime: {
             // activePathId is the sole runtime reference to the current path.
             // It may be null when no path is selected (e.g., after a transition).
             activePathId: activePathId ?? null,
             activeTreasure,
         },
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
        /** Lightweight reference to which path is active — used as lookup key.
         *  The FULL activePath object is derived deterministically from persistentState + this ID.
         *  This ID is the ONLY runtime path reference that matters. */
        activePathId: string | null;
        /** Full active path session — derived from persistentState + activePathId.
         *  Can be null even when activePathId is set (during transition).
         *  ALWAYS prefer deriving station from persistentState + activePathId. */
    
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

    /* ─── Generation guard ─── */
    isGenerating: boolean;
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

    /* ─── Generation guard ─── */
    setGenerating: (generating: boolean) => void;

    /* ─── Selectors (derived, not stored) ─── */
    getHydratedState: () => SessionState | null;
    getProgressLabel: () => string;
    getCurrentPlayer: () => Player | null;
    getStation: () => Station | null;
};

/* ─── Persisted Shape ──────────────────────────────────── */

/**
 * The shape of what gets persisted to localStorage.
 * ONLY PersistentSessionState is stored — no runtime state,
 * no UI flags, no timers, no animation state.
 */
type PersistedGameSessionState = {
    persistentState: PersistentSessionState | null;
};

/* ─── Store ────────────────────────────────────────────── */

export const useGameSessionStore = create<GameSessionState & GameSessionActions>()(
    persist(
        (set, get) => ({

        /* ═══════════════════════════════════════════════════════════
           STATE
           ═══════════════════════════════════════════════════════════ */

        lifecycle: "idle",
        persistentState: null,
    // Runtime state only stores lightweight references. Full activePath is derived
    // from persistentState + activePathId via selectors / helper functions.
    runtimeState: { activePathId: null, activeTreasure: null },
        gameplayPhase: "path-selection",
        ceremony: null,
        lastResult: null,
        awardedTitle: null,
        isGenerating: false,

        /* ═══════════════════════════════════════════════════════════
           SESSION LIFECYCLE
           ═══════════════════════════════════════════════════════════ */

        initSession: (persistent, pathId) => {
            const hydrated = hydrateSessionState(persistent);
            const withPath = pathId ? selectPath(hydrated, pathId) : hydrated;
            const { persistent: updatedPersistent, runtime } = splitState(withPath);

            set({
                lifecycle: "active",
                persistentState: updatedPersistent,
                runtimeState: runtime,
                gameplayPhase: pathId ? "question" : "path-selection",
                ceremony: null,
                lastResult: null,
                awardedTitle: null,
                isGenerating: false,
            });
        },

        clearSession: () => {
            set({
                lifecycle: "idle",
                persistentState: null,
                runtimeState: { activePathId: null, activeTreasure: null },
                gameplayPhase: "path-selection",
                ceremony: null,
                lastResult: null,
                awardedTitle: null,
                isGenerating: false,
            });
        },

        setLifecycle: (lifecycle) => {
            set({ lifecycle });
        },

        setGenerating: (generating) => {
            set({ isGenerating: generating });
        },

        /* ═══════════════════════════════════════════════════════════
           GAMEPLAY FLOW
           ═══════════════════════════════════════════════════════════ */

        setGameplayPhase: (phase) => {
            const current = get().gameplayPhase;
            // Guard: reject invalid transitions silently
            if (!isValidTransition(current, phase)) {
                // Stale or duplicate transition — ignore calmly
                return;
            }
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

            // Guard: only continue from result phase
            if (state.gameplayPhase !== "result") return;

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

            // Guard: only dismiss when in treasure phase
            if (state.gameplayPhase !== "treasure") return;
            // Guard: must have active treasure to dismiss
            if (!hydrated.activeTreasure) return;

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

            // Guard: only transition from transition phase
            if (state.gameplayPhase !== "transition") return;

            const decision = resolveTransition(hydrated, state.lastResult);
            const updates: Partial<GameSessionState> = {
                lastResult: null,
                gameplayPhase: decision.nextPhase,
            };

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
            const state = get();
            const hydrated = state.getHydratedState();
            if (!hydrated) return;

            // Guard: only open treasure when in treasure phase with active treasure
            if (state.gameplayPhase !== "treasure") return;
            if (!hydrated.activeTreasure) return;

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
            const { activePathId, activeTreasure } = state.runtimeState;
            const activePath = activePathId
                ? deriveActivePathFromPersistentState(state.persistentState, activePathId)
                : null;
            // Construct a full SessionState object. The type matches the exported SessionState.
            return {
                ...state.persistentState,
                activePathId,
                activePath,
                activeTreasure,
            } as SessionState;
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
            // DETERMINISTIC: Always derive station from persistentState + activePathId.
            // NEVER read from activePath.currentStation (can be stale).
            if (!state.persistentState) return null;
            return getCurrentStationFromPersistentState(
                state.persistentState,
                state.runtimeState.activePathId,
            );
        },
    }),

    {
        name: "kenzoo-game-session",

        /**
         * Persist ONLY PersistentSessionState to localStorage.
         * All runtime-only state (activePath, activeTreasure, gameplayPhase,
         * ceremony, lastResult, awardedTitle, lifecycle, isGenerating)
         * is NEVER persisted — it resets on page refresh.
         */
        partialize: (state): PersistedGameSessionState => ({
            persistentState: state.persistentState,
        }),

        /**
         * After rehydration from localStorage:
         *   - If persistentState exists → set lifecycle to "active"
         *   - Runtime state stays at defaults (path-selection, no active path)
         *   - Player must re-select a path after refresh
         */
        onRehydrateStorage: () => (state) => {
            if (state?.persistentState) {
                state.lifecycle = "active";
                state.gameplayPhase = "path-selection";
                 // Only lightweight references are kept. Full activePath is derived via selectors.
                 state.runtimeState = { activePathId: null, activeTreasure: null };
                state.ceremony = null;
                state.lastResult = null;
                state.awardedTitle = null;
                state.isGenerating = false;
            }
        },
    }
),
);


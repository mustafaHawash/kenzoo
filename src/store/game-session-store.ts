/**
 * game-session-store.ts
 *
 * THE SINGLE RUNTIME SOURCE OF TRUTH.
 *
 * This Zustand store owns ALL runtime state:
 *   - PersistentSessionState (gameplay truth) — persisted to localStorage
 *   - RuntimeSessionState (activePathId, activeTreasureId) — NEVER persisted
 *   - GameplayPhase (current flow phase) — NEVER persisted
 *   - EndingCeremonyState (ceremony progression) — NEVER persisted
 *   - SessionLifecycleState (session lifecycle) — NEVER persisted
 *   - Last round result (for rendering) — NEVER persisted
 *   - Awarded title (treasure UI) — NEVER persisted
 *   - isGenerating (generation guard) — NEVER persisted
 *
 * PERSISTENCE ARCHITECTURE:
 *   - Zustand persist middleware saves ONLY PersistentSessionState to localStorage
 *   - Runtime-only state stores only lightweight references (ids) – no reconstruction of full objects
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
  // Alias to avoid name clash with store action
  selectPath as engineSelectPath,
  applyTurnOutcome,
  applyTreasureOpen,
  advanceActivePath,
  clearActiveTreasure,
  resolveContinueFromResult,
  resolveDismissTreasure,
  resolveTransition,
  getSessionProgressLabel,
  advanceCeremonyPhase,
  createEndingCeremonyState,
} from "@/lib/session-runtime/session-engine";
import { getCurrentPath } from "@/lib/session-runtime/selectors/get-current-path";
import type { RoundResult } from "@/types/session";
import type { Player } from "@/types/player";
import type { Station } from "@/types/station";

/* ─── Valid Phase Transitions ───────────────────────────── */

// Deterministic phase flow: result → treasure → transition → path‑selection (or ending)
const VALID_TRANSITIONS: Record<GameplayPhase, GameplayPhase[]> = {
  "path-selection": ["question", "ending"],
  question: ["reveal", "ending"],
  reveal: ["result", "ending"],
  // After a result, we may either show a treasure opportunity or move directly
  // to the transition phase (when no treasure appears). Both paths are valid.
  result: ["treasure", "transition", "ending"],
  treasure: ["treasure-reveal", "ending"],
  // After treasure reveal, continue to question (mid-path) or transition (path done)
  "treasure-reveal": ["question", "transition", "ending"],
  transition: ["path-selection", "ending"],
  ending: ["ending"],
};

function isValidTransition(from: GameplayPhase, to: GameplayPhase): boolean {
  if (to === "ending") return true;
  const allowed = VALID_TRANSITIONS[from];
  return allowed ? allowed.includes(to) : false;
}

/* ─── Helpers ──────────────────────────────────────────── */

function splitState(state: SessionState) {
  const { activePathId, activeTreasureId, ...persistent } = state;
  return {
    persistent: persistent as PersistentSessionState,
    runtime: {
      // activePathId is the sole runtime reference to the current path.
      // It may be null when no path is selected (e.g., after a transition).
      activePathId: activePathId ?? null,
      activeTreasureId,
    },
  };
}

/* ─── Store State ──────────────────────────────────────── */

export type TreasureRevealData = {
  /** The treasure that was opened */
  treasureId: string;
  /** Treasure emoji */
  emoji: string;
  /** Treasure title */
  title: string;
  /** Treasure flavor text */
  flavor: string;
  /** Treasure description */
  description: string;
  /** Rarity — revealed only after opening */
  rarity: "common" | "rare" | "legendary";
  /** Stars consumed to open */
  starsConsumed: number;
  /** Reward details */
  reward: {
    type: string;
    starsAmount?: number;
    titleText?: string;
    message?: string;
  };
  /** Title awarded (if reward type is "title") */
  awardedTitle: string | null;
};

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
    /** Reference to the currently active treasure by its id.
     *  The full treasure object is derived via a selector when needed. */
    activeTreasureId: string | null;
  };

  /* ─── Gameplay flow ─── */
  gameplayPhase: GameplayPhase;

  /* ─── Ending ceremony ─── */
  ceremony: EndingCeremonyState | null;

  /* ─── Last round result (for rendering) ─── */
  lastResult: RoundResult | null;

  /* ─── Treasure UI ─── */
  awardedTitle: string | null;

  /* ─── Treasure reveal data (temporary, cleared after continue) ─── */
  treasureRevealData: TreasureRevealData | null;

  /* ─── Generation guard ─── */
  isGenerating: boolean;

  /** Hydration guard – true once Zustand has rehydrated from storage */
  hasHydrated: boolean;
};

/* ─── Store Actions ────────────────────────────────────── */

export type GameSessionActions = {
  /* ─── Session lifecycle ─── */
  initSession: (
    persistent: PersistentSessionState,
    pathId?: string | null,
  ) => void;
  clearSession: () => void;
  setLifecycle: (lifecycle: SessionLifecycleState) => void;
  // New action to select a path from the UI
  selectPath: (pathId: string) => void;

  /* ─── Gameplay flow ─── */
  setGameplayPhase: (phase: GameplayPhase) => void;
  commitTurnOutcome: (outcome: Parameters<typeof applyTurnOutcome>[1]) => void;
  setLastResult: (result: RoundResult | null) => void;

  /* ─── Continue / Dismiss / Transition ─── */
  continueFromResult: () => void;
  dismissTreasure: () => void;
  transitionToNextTurn: () => void;
  /** Clear transient runtime references after navigation completes */
  clearRuntime: () => void;

  /* ─── Treasure ─── */
  openTreasure: (outcome: import("@/lib/session-runtime/turn-engine").TreasureOpenOutcome) => void;
  /** Continue after treasure reveal — clears treasure, advances path, determines next phase */
  continueFromTreasureReveal: () => void;
  setAwardedTitle: (title: string | null) => void;

  /* ─── Ceremony ─── */
  advanceCeremony: () => void;

  /* ─── Generation guard ─── */
  setGenerating: (generating: boolean) => void;

  /* ─── Selectors (derived, not stored) ─── */
  getHydratedState: () => SessionState | null;
  getProgressLabel: () => string;
};

/* ─── Persisted Shape ──────────────────────────────────── */

/**
 * The shape of what gets persisted to localStorage.
 * ONLY PersistentSessionState is stored — no runtime state,
 * no UI flags, no timers, no animation state.
 */
// Persisted shape now includes the lightweight activePathId reference.
type PersistedGameSessionState = {
  persistentState: PersistentSessionState | null;
  /**
   * The ID of the currently active path. This is the ONLY runtime reference
   * that needs to survive a page refresh. All other runtime data (active
   * treasure, phase, etc.) is reconstructed from the persistent session
   * state combined with this ID.
   */
  activePathId: string | null;
};

/* ─── Store ────────────────────────────────────────────── */

export const useGameSessionStore = create<
  GameSessionState & GameSessionActions
>()(
  persist(
    (set, get) => ({
      /* ═══════════════════════════════════════════════════════════
           STATE
           ═══════════════════════════════════════════════════════════ */

      lifecycle: "idle",
      persistentState: null,
      // Runtime state only stores lightweight references. Full activePath is derived
      // from persistentState + activePathId via selectors / helper functions.
      runtimeState: { activePathId: null, activeTreasureId: null },
      gameplayPhase: "path-selection",
      ceremony: null,
      lastResult: null,
      awardedTitle: null,
      treasureRevealData: null,
      isGenerating: false,
      hasHydrated: false,

      /* ═══════════════════════════════════════════════════════════
           SESSION LIFECYCLE
           ═══════════════════════════════════════════════════════════ */

      initSession: (persistent, pathId) => {
        // Hydrate the persisted session state without marking hydration as complete.
        // Hydration flag is solely managed by the `onRehydrateStorage` callback.
        const hydrated = hydrateSessionState(persistent);
        const withPath = pathId ? engineSelectPath(hydrated, pathId) : hydrated;
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
          // Do NOT set hasHydrated here – it will be set by onRehydrateStorage after rehydration.
        });
      },

      clearSession: () => {
        set({
          lifecycle: "idle",
          persistentState: null,
          runtimeState: { activePathId: null, activeTreasureId: null },
          gameplayPhase: "path-selection",
          ceremony: null,
          lastResult: null,
          awardedTitle: null,
          isGenerating: false,
          hasHydrated: false,
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

      // Apply turn outcome without flushSync – Zustand already batches updates and
      // React subscriptions are synchronized. Removing flushSync prevents nested
      // render scheduling that could cause deadlocks.
      // Action to select a path – used by UI when player chooses a path.
      // UI invokes this when a player selects a path. It updates the activePathId
      // and moves the phase to "question".
      selectPath: (pathId: string) => {
        console.log("[DEBUG] selectPath called", { pathId });
        const hydrated = get().getHydratedState();
        if (!hydrated) return;
        const withPath = engineSelectPath(hydrated, pathId);
        const { persistent, runtime } = splitState(withPath);
        // Ensure transient runtime flags are reset when a new path is selected.
        const cleanedRuntime = {
          activePathId: runtime.activePathId,
          activeTreasureId: null,
        };
        console.log("[DEBUG] selectPath result", {
          gameplayPhase: "question",
          activePathId: cleanedRuntime.activePathId,
        });
        set({
          persistentState: persistent,
          runtimeState: cleanedRuntime,
          gameplayPhase: "question",
        });
      },
      // Apply turn outcome without any path‑clearing logic. Path completion
      // ownership is handled by `resolveContinueFromResult` and
      // `resolveTransition` in the session‑engine. This action now simply
      // updates the persisted state and runtime references returned by the
      // engine.
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
        // Guard: must have an active treasure id to dismiss
        if (!state.runtimeState.activeTreasureId) return;

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
        console.log("transition fired");
        console.log("[DEBUG] transitionToNextTurn fired", decision);
        const updates: Partial<GameSessionState> = {
          lastResult: null,
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

        // Do NOT clear activePathId here. Runtime cleanup is now owned by the navigation layer.
        set(updates);
      },
      clearRuntime: () => {
        set({ runtimeState: { activePathId: null, activeTreasureId: null } });
      },

      /* ═══════════════════════════════════════════════════════════
           TREASURE
           ═══════════════════════════════════════════════════════════ */

      // ---------------------------------------------------------------------
      // OPEN TREASURE – applies rewards and transitions to treasure-reveal phase.
      // ---------------------------------------------------------------------
      // Phase flow: treasure → treasure-reveal → (question | transition | ending)
      // The treasure-reveal phase shows the reward/penalty/title to the player.
      // activeTreasureId is NOT cleared here — it stays for the reveal UI.
      // Path advancement is deferred to continueFromTreasureReveal().
      openTreasure: (outcome: import("@/lib/session-runtime/turn-engine").TreasureOpenOutcome) => {
        const state = get();
        const hydrated = state.getHydratedState();
        if (!hydrated) return;

        // Guard: only open treasure when in treasure phase with an active treasure id
        if (state.gameplayPhase !== "treasure") return;
        if (!state.runtimeState.activeTreasureId) return;

        // 1. Apply treasure rewards (star deduction, record, legendary claim)
        //    but do NOT advance the path yet — that happens after reveal.
        const withTreasure = applyTreasureOpen(hydrated, outcome);
        const { persistent, runtime } = splitState(withTreasure);

        // 2. Store reveal data for the treasure-reveal UI
        const revealData: TreasureRevealData = {
          treasureId: outcome.treasure.id,
          emoji: outcome.treasure.emoji,
          title: outcome.treasure.title,
          flavor: outcome.treasure.flavor,
          description: outcome.treasure.description,
          rarity: outcome.record.rarity,
          starsConsumed: outcome.record.starsConsumed,
          reward: {
            type: outcome.treasure.reward.type,
            starsAmount: outcome.treasure.reward.starsAmount,
            titleText: outcome.treasure.reward.titleText,
            message: outcome.treasure.reward.message,
          },
          awardedTitle: state.awardedTitle,
        };

        // 3. Transition to treasure-reveal phase (activeTreasureId still set for reveal UI)
        set({
          persistentState: persistent,
          runtimeState: runtime,
          gameplayPhase: "treasure-reveal",
          treasureRevealData: revealData,
        });
      },

      // ---------------------------------------------------------------------
      // CONTINUE FROM TREASURE REVEAL – player has seen the reveal, now
      // clear the treasure and advance the path.
      // ---------------------------------------------------------------------
      continueFromTreasureReveal: () => {
        const state = get();
        const hydrated = state.getHydratedState();
        if (!hydrated) return;

        // Guard: only continue from treasure-reveal phase
        if (state.gameplayPhase !== "treasure-reveal") return;

        // 1. Clear the active treasure reference
        const cleared = clearActiveTreasure(hydrated);

        // 2. Advance the path — treasure appeared after a correct answer,
        //    so the path must be advanced now (same logic as resolveDismissTreasure).
        const lastResult = state.lastResult;
        let nextPhase: GameplayPhase = "transition";
        let finalState = cleared;
        let ceremony: EndingCeremonyState | undefined;

        if (lastResult?.isCorrect) {
          const advanced = advanceActivePath(cleared, lastResult.starsEarned);

          if (advanced.isComplete) {
            nextPhase = "ending";
            ceremony = createEndingCeremonyState(advanced);
          } else if (advanced.activePathId) {
            nextPhase = "question";
          }
          // else: path completed — stay in transition

          finalState = advanced;
        }

        const { persistent, runtime } = splitState(finalState);
        const updates: Partial<GameSessionState> = {
          persistentState: persistent,
          runtimeState: runtime,
          gameplayPhase: nextPhase,
          treasureRevealData: null,
        };
        if (ceremony) {
          updates.ceremony = ceremony;
        }

        set(updates);
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

      // Derive full hydrated state on demand. No reconstruction logic – only
      // lightweight references are stored. Selectors provide deterministic
      // derivations of activePath and activeStation.
      // Derive a full SessionState on demand. Runtime objects are derived
      // from lightweight IDs to avoid stale references.
      getHydratedState: () => {
        const state = get();
        if (!state.persistentState) return null;
        const { activePathId, activeTreasureId } = state.runtimeState;
        // Construct a full SessionState without unsafe casting.
        const hydrated: SessionState = {
          ...state.persistentState,
          activePathId,
          activeTreasureId,
        };
        return hydrated;
      },

      getProgressLabel: () => {
        const state = get();
        if (!state.persistentState) return "";
        return getSessionProgressLabel(state.persistentState);
      },

      // NOTE: Gameplay objects are derived via selectors, not stored here.
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
        // Store the activePathId safely – it is a simple string reference.
        activePathId: state.runtimeState.activePathId,
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
          // The persisted activePathId is stored as a top‑level property by the
          // `partialize` function. It is not part of the typed store shape, so we
          // access it via a type‑unsafe cast.
          const persistedPathId =
            (state as unknown as { activePathId?: string | null })
              .activePathId ?? null;
          // ALWAYS start in path‑selection after a refresh – the UI must re‑select a path.
          state.gameplayPhase = "path-selection";
          // Restore runtime references safely.
          state.runtimeState = {
            activePathId: persistedPathId ?? null,
            activeTreasureId: null,
          };
          state.ceremony = null;
          state.lastResult = null;
          state.awardedTitle = null;
          state.isGenerating = false;
          state.hasHydrated = true;
        }
      },
    },
  ),
);

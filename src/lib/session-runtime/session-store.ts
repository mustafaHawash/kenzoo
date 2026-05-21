/**
 * session-store.ts
 *
 * Immutable-safe in-memory session store.
 *
 * This is a TEMPORARY bridge between setup and gameplay.
 * When Zustand is added, this module will be replaced by the Zustand store.
 *
 * IMMUTABILITY GUARANTEE:
 *   - get() ALWAYS returns a deep clone — never a direct mutable reference
 *   - set() deep clones the input — the original reference is never stored
 *   - No consumer can accidentally mutate the stored state
 *   - Future Zustand migration is safe — no shared mutable references exist
 *
 * LIFECYCLE:
 *   1. setup → createSession() → store.setPersistent(state)
 *   2. gameplay → store.getPersistent() → read state
 *   3. play → store.getPersistent() → read state
 *
 * IMPORTANT:
 *   - This is in-memory ONLY — no persistence
 *   - State is lost on page reload (by design)
 *   - Not reactive — components must re-read manually
 *   - Will be replaced by Zustand store
 */

import type {
    PersistentSessionState,
    SessionState,
} from "@/lib/session-runtime/session-engine";
import { hydrateSessionState } from "@/lib/session-runtime/session-engine";

/* ─── Session Lifecycle ────────────────────────────────── */

/**
 * Session lifecycle ownership.
 *
 * This is NOT UI phase state.
 * This tracks the lifecycle of the session itself.
 *
 * Flow: idle → generating → active → ending → completed
 */
export type SessionLifecycleState =
    | "idle"        // No session exists
    | "generating"  // Session is being created (cinematic delay / future: AI call)
    | "active"      // Session is in progress — gameplay is happening
    | "ending"      // Session completion detected — ceremony pending
    | "completed";  // Session finished — ceremony done

/* ─── Internal State ───────────────────────────────────── */

let persistentState: PersistentSessionState | null = null;
let lifecycle: SessionLifecycleState = "idle";

/* ─── Deep Clone Helper ────────────────────────────────── */

/**
 * Deep clones a value using structuredClone.
 * Falls back to JSON round-trip if structuredClone is unavailable (SSR).
 */
function deepClone<T>(value: T): T {
    if (typeof structuredClone === "function") {
        return structuredClone(value);
    }
    return JSON.parse(JSON.stringify(value));
}

/* ─── Session Store ────────────────────────────────────── */

export const sessionStore = {
    /* ─── Persistent State ─── */

    /**
     * Store the persistent session state.
     * Deep clones the input — the original reference is never stored.
     */
    setPersistent(state: PersistentSessionState): void {
        persistentState = deepClone(state);
        lifecycle = "active";
    },

    /**
     * Retrieve the persistent session state.
     * ALWAYS returns a deep clone — never a direct mutable reference.
     */
    getPersistent(): PersistentSessionState | null {
        if (!persistentState) return null;
        return deepClone(persistentState);
    },

    /**
     * Retrieve the hydrated (full) session state.
     * Combines persistent state with runtime defaults (activePath: null, etc.)
     * ALWAYS returns a deep clone.
     */
    getHydrated(): SessionState | null {
        if (!persistentState) return null;
        return hydrateSessionState(deepClone(persistentState));
    },

    /**
     * Update the persistent session state.
     * The updater receives a deep clone — mutations inside updater are safe.
     * The result is deep cloned again before storage.
     */
    updatePersistent(updater: (prev: PersistentSessionState) => PersistentSessionState): void {
        if (!persistentState) return;
        const cloned = deepClone(persistentState);
        const updated = updater(cloned);
        persistentState = deepClone(updated);
    },

    /* ─── Lifecycle ─── */

    /** Get the current session lifecycle state */
    getLifecycle(): SessionLifecycleState {
        return lifecycle;
    },

    /** Set the lifecycle state */
    setLifecycle(state: SessionLifecycleState): void {
        lifecycle = state;
    },

    /* ─── Cleanup ─── */

    /** Clear the session entirely (for cleanup or reset) */
    clear(): void {
        persistentState = null;
        lifecycle = "idle";
    },
};

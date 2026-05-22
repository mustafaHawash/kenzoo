/**
 * generation-orchestration.ts
 *
 * Session generation orchestration boundary.
 *
 * The setup shell does NOT know:
 *   - timer mechanics
 *   - loading durations
 *   - generation internals
 *   - future AI call structure
 *
 * The shell only triggers this orchestrator and reacts to lifecycle callbacks.
 *
 * This module bridges setup → createSession() → gameplay.
 *
 * Future expansion:
 *   - Replace with real AI generation call
 *   - Add retry logic
 *   - Add progress streaming
 *   - Add content validation before "ready"
 */

import type { SessionConfigPayload } from "./setup-types";
import {
    createSession,
    validateSessionInput,
    type CreateSessionInput,
} from "@/lib/session-runtime/create-session";
import type { PersistentSessionState } from "@/lib/session-runtime/session-engine";
import { useGameSessionStore } from "@/store/game-session-store";

export type GenerationCallbacks = {
    onPreparing: () => void;
    onReady: (state: PersistentSessionState) => void;
    onError?: (error: Error) => void;
};

/**
 * Transforms SessionConfigPayload into CreateSessionInput.
 *
 * The setup flow produces a raw payload (names, avatars, theme).
 * createSession() expects a normalized input.
 * This function bridges the two formats.
 */
function payloadToInput(payload: SessionConfigPayload): CreateSessionInput {
    // sessionLength is now passed directly from setup — no more reverse-mapping rounds.
    // This eliminates the fragile rounds→SessionLength conversion.
    const sessionLength = payload.sessionLength;

    return {
        players: payload.players.map((p) => ({
            name: p.name,
            avatar: p.avatar,
            ageGroup: p.ageGroup,
        })),
        sessionLength,
        themeId: payload.themeId,
    };
}

/**
 * Starts the session generation process.
 *
 * FLOW:
 *   1. Set lifecycle to "generating"
 *   2. Validate input (fail fast if invalid)
 *   3. Create PersistentSessionState via createSession()
 *   4. Store in Zustand runtime store (immutable-safe)
 *   5. Set lifecycle to "active"
 *   6. Notify callback
 *
 * The cinematic delay is preserved for atmosphere.
 * When AI generation arrives, the delay will be replaced by
 * an async AI call. No UI code needs to change.
 *
 * IMPORTANT: This function does NOT own gameplay logic.
 * It orchestrates lifecycle only.
 *
 * Returns a cleanup function to cancel in-flight generation.
 */
export function startSessionGeneration(
    payload: SessionConfigPayload,
    callbacks: GenerationCallbacks,
): () => void {
    callbacks.onPreparing();
    // Dispatch lifecycle change via reactive selector (no direct getState usage).
    const setLifecycle = useGameSessionStore.getState().setLifecycle;
    setLifecycle("generating");

    // Cinematic delay for atmosphere — generation itself is instant
    const timer = window.setTimeout(() => {
        try {
            const input = payloadToInput(payload);

            // Validate before creation — fail fast
            const validation = validateSessionInput(input);
            if (!validation.isValid) {
                throw new Error(`Invalid session: ${validation.errors.join(", ")}`);
            }

            // Create persistent state (gameplay truth only, no runtime)
            const persistentState = createSession(input);

            // Initialize session via store action (reactive dispatch)
            const initSession = useGameSessionStore.getState().initSession;
            initSession(persistentState);

            callbacks.onReady(persistentState);
        } catch (error) {
            // Reset lifecycle on error via store action
            const setLifecycle = useGameSessionStore.getState().setLifecycle;
            setLifecycle("idle");
            callbacks.onError?.(error instanceof Error ? error : new Error(String(error)));
        }
    }, 3200);

    // Cleanup: cancel if component unmounts or generation is restarted
    return () => {
        window.clearTimeout(timer);
    };
}

/**
 * generation-orchestration.ts
 *
 * Session generation orchestration boundary.
 *
 * The setup shell does NOT know:
 *   - timer mechanics
 *   - loading durations
 *   - fake async details
 *   - future AI call structure
 *
 * The shell only triggers this orchestrator and reacts to lifecycle callbacks.
 *
 * Future expansion:
 *   - Replace setTimeout with real AI generation call
 *   - Add retry logic
 *   - Add progress streaming
 *   - Add content validation before "ready"
 */

import type { SessionConfigPayload } from "./setup-types";

export type GenerationCallbacks = {
    onPreparing: () => void;
    onReady: (payload: SessionConfigPayload) => void;
    onError?: (error: Error) => void;
};

/**
 * Starts the session generation process.
 *
 * Currently uses a simulated delay.
 * When real generation arrives, this function will be the single
 * integration point — no UI code needs to change.
 *
 * Returns a cleanup function to cancel in-flight generation.
 */
export function startSessionGeneration(
    payload: SessionConfigPayload,
    callbacks: GenerationCallbacks,
): () => void {
    callbacks.onPreparing();

    // --- Simulated async generation ---
    // Future: replace with actual generateSession(payload) call
    const timer = window.setTimeout(() => {
        console.log("[generation-orchestration] Session generated:", payload);
        callbacks.onReady(payload);
    }, 3200);

    // Cleanup: cancel if component unmounts or generation is restarted
    return () => {
        window.clearTimeout(timer);
    };
}

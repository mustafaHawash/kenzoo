import type { PersistentSessionState } from "@/lib/session-runtime/session-engine";
import type { JourneyPath } from "@/types/path";
import { getCurrentJourney } from "./get-current-journey";

/**
 * Derives the active path from persistent session state.
 *
 * Rules:
 * - Pure function
 * - No mutations
 * - Accepts persistentState, activePathId, and optional currentPlayerIndex
 */
export function getCurrentPath(
    persistentState: PersistentSessionState | null,
    activePathId: string | null,
    currentPlayerIndex?: number,
): JourneyPath | null {
    if (!persistentState || !activePathId) return null;
    const journey = getCurrentJourney(persistentState, currentPlayerIndex);
    if (!journey) return null;
    return journey.paths.find((p) => p.id === activePathId) ?? null;
}

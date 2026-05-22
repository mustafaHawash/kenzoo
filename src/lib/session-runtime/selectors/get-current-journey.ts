import type { PersistentSessionState } from "@/lib/session-runtime/session-engine";
import type { PlayerJourneyState } from "@/types/path";

/**
 * Derives the current player's journey from persistent session state.
 *
 * Rules:
 * - Pure function
 * - No mutations
 * - Accepts persistentState and optional currentPlayerIndex
 */
export function getCurrentJourney(
    persistentState: PersistentSessionState | null,
    currentPlayerIndex?: number,
): PlayerJourneyState | null {
    if (!persistentState) return null;
    const index = currentPlayerIndex ?? persistentState.currentPlayerIndex;
    return persistentState.journeys[index] ?? null;
}

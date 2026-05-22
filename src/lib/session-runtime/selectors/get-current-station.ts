import type { PersistentSessionState } from "@/lib/session-runtime/session-engine";
import type { Station } from "@/types/station";
import { getCurrentPath } from "./get-current-path";

/**
 * Derives the active station from persistent session state.
 *
 * Rules:
 * - Pure function
 * - No mutations
 * - Accepts persistentState, activePathId, and optional currentPlayerIndex
 */
export function getCurrentStation(
    persistentState: PersistentSessionState | null,
    activePathId: string | null,
    currentPlayerIndex?: number,
): Station | null {
    if (!persistentState || !activePathId) return null;
    const path = getCurrentPath(persistentState, activePathId, currentPlayerIndex);
    if (!path || path.completed) return null;
    if (path.currentStationIndex >= path.stations.length) return null;
    return path.stations[path.currentStationIndex].station ?? null;
}

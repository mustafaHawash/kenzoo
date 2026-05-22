import type { PersistentSessionState } from "@/lib/session-runtime/session-engine";
import type { Player } from "@/types/player";

/**
 * Derives the current player from persistent session state.
 *
 * Rules:
 * - Pure function
 * - No mutations
 * - Accepts persistentState and optional currentPlayerIndex
 */
export function getCurrentPlayer(
    persistentState: PersistentSessionState | null,
    currentPlayerIndex?: number,
): Player | null {
    if (!persistentState) return null;
    const index = currentPlayerIndex ?? persistentState.currentPlayerIndex;
    return persistentState.players[index] ?? null;
}

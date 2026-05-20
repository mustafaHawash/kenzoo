/**
 * session-engine.ts
 *
 * Lightweight central runtime orchestrator for Kenzoo gameplay sessions.
 *
 * RESPONSIBILITIES:
 *   - Round progression (fixed-length: default 4 rounds × N players)
 *   - Turn progression and next player selection
 *   - Hidden progression tracking (silent point accumulation)
 *   - Session completion detection (after all rounds complete — NO early termination)
 *   - Treasure economy coordination
 *   - Ending ceremony orchestration and phase sequencing
 *
 * PHILOSOPHY:
 *   - Pure functions only — no side effects, no Zustand, no reducers
 *   - Lightweight orchestration — not an enterprise engine
 *   - Fixed-length sessions — the session ALWAYS completes all rounds
 *   - Hidden scoring — points are final scoring weights, NOT instant victory triggers
 *   - The winner is revealed ONLY via the cinematic ending ceremony
 *
 * NOT:
 *   - A Redux store
 *   - An event bus
 *   - A giant state machine
 *   - A Zustand slice
 */

import type { Player } from "@/types/player";
import type { Treasure } from "@/types/treasure";
import { HIDDEN_POINTS_BY_RARITY } from "@/types/treasure";
import { resolveTreasureOpen, resolveTurnEnd } from "./turn-engine";
import type { RoundResult } from "@/types/session";

/* ─── Session Configuration ──────────────────────────────── */

/** Session length to round mapping */
export const ROUNDS_BY_LENGTH: Record<import("@/types/session").SessionLength, number> = {
    short: 3,
    normal: 4,
    long: 5,
};

/* ─── Session State ──────────────────────────────────────── */

/**
 * The runtime state of an active session.
 *
 * Owned by the page via useState.
 * session-engine functions are pure transformers — they return new state,
 * never mutate in place.
 */
export type SessionState = {
    players: Player[];

    /** 0-indexed index into players[] — whose turn it is */
    currentPlayerIndex: number;

    /** 1-indexed current round (starts at 1, ends at totalRounds) */
    currentRound: number;

    /** Session length chosen during setup (short, normal, long) */
    sessionLength: import("@/types/session").SessionLength;

    /** Total rounds in this session. Default: DEFAULT_TOTAL_ROUNDS */
    totalRounds: number;

    /**
     * Global turn counter across all rounds.
     * Increments once per player turn, regardless of round.
     */
    globalTurnIndex: number;

    /**
     * True when all rounds have completed.
     * The page transitions to the ending ceremony when this becomes true.
     */
    isComplete: boolean;

    /** Legendary treasure IDs already claimed this session — excluded from future rolls. */
    claimedLegendaryIds: string[];
};

/* ─── Ending Ceremony ────────────────────────────────────── */

/**
 * Phase-driven ending ceremony.
 *
 * Each phase is a distinct cinematic moment.
 * Phases advance one at a time — slow, emotional, memorable.
 *
 * Order: intro → session-summary → titles-reveal → player-reveals
 *        → ranking-reveal → winner-reveal → closing
 */
export type EndingCeremonyPhase =
    | "intro"            // "الليلة قربت تخلص..."
    | "session-summary"  // Total treasures opened + rarity distribution
    | "titles-reveal"    // Earned titles revealed one by one
    | "player-reveals"   // Each player's cinematic treasure spotlight
    | "ranking-reveal"   // Rankings revealed progressively (last place first)
    | "winner-reveal"    // Final cinematic winner reveal
    | "closing";         // Optional: emotional session memory or highlight

/** The phase advancement order — used by advanceCeremonyPhase(). */
const CEREMONY_PHASE_ORDER: EndingCeremonyPhase[] = [
    "intro",
    "session-summary",
    "titles-reveal",
    "player-reveals",
    "ranking-reveal",
    "winner-reveal",
    "closing",
];

/**
 * Final score entry for one player — computed at session end, revealed in ceremony.
 *
 * HIDDEN during gameplay. Visible only during ending ceremony.
 */
export type PlayerFinalScore = {
    player: Player;

    /** Accumulated hidden treasure points — final scoring weight */
    hiddenPoints: number;

    /** 1-indexed final ranking (1 = winner) */
    rank: number;
};

/**
 * The state of an active ending ceremony.
 * Created once the session completes. Advances phase by phase.
 */
export type EndingCeremonyState = {
    phase: EndingCeremonyPhase;

    /** Final scores ordered by rank (rank 1 first = winner first) */
    finalScores: PlayerFinalScore[];

    /** The winning player's ID */
    winnerId: string;
};

/* ─── Factory ────────────────────────────────────────────── */

/**
 * Creates the initial session state from a player list and optional config.
 *
 * Call this once at the beginning of a session.
 * Example: const state = createSessionState(players, "normal") // 4 rounds default
 */
export function createSessionState(
    players: Player[],
    sessionLength: import("@/types/session").SessionLength = "normal",
): SessionState {
    const totalRounds = ROUNDS_BY_LENGTH[sessionLength];

    return {
        players,
        currentPlayerIndex: 0,
        currentRound: 1,
        totalRounds,
        sessionLength,
        globalTurnIndex: 0,
        isComplete: false,
        claimedLegendaryIds: [],
    };
}

/* ─── Turn Advancement ───────────────────────────────────── */

/**
 * Advances the session to the next turn after the current player completes theirs.
 *
 * Turn structure:
 *   - Each player plays once per round (left to right through players[])
 *   - After all players have played, the round increments
 *   - After totalRounds rounds, isComplete becomes true
 *
 * Also applies resolveTurnEnd() to the current player
 * (tiny mission completion tracking).
 *
 * Pure function — returns updated SessionState.
 */
export function advanceTurn(
    state: SessionState,
    lastResult: RoundResult | null,
): SessionState {
    const playerCount = state.players.length;

    // Apply turn-end resolution (tiny mission tracking) to current player
    const updatedPlayers = state.players.map((p, i) =>
        i === state.currentPlayerIndex
            ? resolveTurnEnd(p, lastResult)
            : p,
    );

    const nextPlayerIndex = (state.currentPlayerIndex + 1) % playerCount;
    const isLastPlayerInRound = nextPlayerIndex === 0;

    // Round increments after all players complete their turn
    const nextRound = isLastPlayerInRound
        ? state.currentRound + 1
        : state.currentRound;

    // Session completes when the last player finishes the last round
    const isComplete =
        isLastPlayerInRound && state.currentRound >= state.totalRounds;

    return {
        ...state,
        players: updatedPlayers,
        currentPlayerIndex: nextPlayerIndex,
        currentRound: nextRound,
        globalTurnIndex: state.globalTurnIndex + 1,
        isComplete,
    };
}

/* ─── Player Update ──────────────────────────────────────── */

/**
 * Applies an immutable player update to session state.
 *
 * Used after turn resolution to apply star changes and other per-player updates.
 * Pure function — returns updated SessionState.
 */
export function applyPlayerUpdate(
    state: SessionState,
    playerIndex: number,
    updater: (p: Player) => Player,
): SessionState {
    return {
        ...state,
        players: state.players.map((p, i) =>
            i === playerIndex ? updater(p) : p,
        ),
    };
}

/* ─── Treasure Economy ───────────────────────────────────── */

/**
 * Applies a treasure opening to session state.
 *
 * Deducts hidden star cost, records the opened treasure (for ceremony reveal),
 * and tracks legendary claims to exclude from future rolls.
 *
 * IMPORTANT:
 *   Does NOT check win condition — the session runs to completion.
 *   Hidden points are accumulated silently and only scored at ceremony time.
 *
 * Pure function — returns updated SessionState.
 */
export function applyTreasureOpen(
    state: SessionState,
    playerIndex: number,
    treasure: Treasure,
): SessionState {
    const player = state.players[playerIndex];
    const { updatedPlayer } = resolveTreasureOpen(player, treasure);

    const updatedPlayers = state.players.map((p, i) =>
        i === playerIndex ? updatedPlayer : p,
    );

    const claimedLegendaryIds =
        treasure.rarity === "legendary"
            ? [...state.claimedLegendaryIds, treasure.id]
            : state.claimedLegendaryIds;

    return {
        ...state,
        players: updatedPlayers,
        claimedLegendaryIds,
    };
}

/* ─── Session-End Scoring ────────────────────────────────── */

/**
 * Computes final hidden point totals for all players.
 *
 * Called ONLY when session.isComplete === true.
 * Results are fed into the ending ceremony — never shown during active gameplay.
 *
 * Returns scores sorted by rank (rank 1 = most points = winner).
 */
export function computeFinalScores(state: SessionState): PlayerFinalScore[] {
    const scored = state.players.map((player) => {
        const hiddenPoints = player.openedTreasures.reduce(
            (sum, t) => sum + t.hiddenPoints,
            0,
        );
        return { player, hiddenPoints };
    });

    // Sort descending by hidden points (most points = rank 1)
    const sorted = [...scored].sort((a, b) => b.hiddenPoints - a.hiddenPoints);

    return sorted.map((entry, index) => ({
        ...entry,
        rank: index + 1,
    }));
}

/* ─── Ending Ceremony ────────────────────────────────────── */

/**
 * Creates the initial ending ceremony state once a session completes.
 *
 * Computes final scores and sets the starting phase to "intro".
 * The page transitions to the ceremony when session.isComplete becomes true.
 */
export function createEndingCeremonyState(
    state: SessionState,
): EndingCeremonyState {
    const finalScores = computeFinalScores(state);
    const winner = finalScores[0]; // rank 1 = highest hidden points

    return {
        phase: "intro",
        finalScores,
        winnerId: winner.player.id,
    };
}

/**
 * Advances the ending ceremony to the next phase.
 *
 * Each call moves the ceremony forward one step.
 * Stops at "closing" — the final phase.
 *
 * Pure function — returns updated EndingCeremonyState.
 */
export function advanceCeremonyPhase(
    ceremony: EndingCeremonyState,
): EndingCeremonyState {
    const currentIndex = CEREMONY_PHASE_ORDER.indexOf(ceremony.phase);
    const nextIndex = Math.min(
        currentIndex + 1,
        CEREMONY_PHASE_ORDER.length - 1,
    );

    return {
        ...ceremony,
        phase: CEREMONY_PHASE_ORDER[nextIndex],
    };
}

/* ─── Utility ────────────────────────────────────────────── */

/**
 * Returns a human-readable round progress label.
 * Example: "الجولة 2 من 4"
 *
 * Used in the session progress indicator during gameplay.
 */
export function getSessionProgressLabel(state: SessionState): string {
    return `الجولة ${state.currentRound} من ${state.totalRounds}`;
}

/**
 * Returns total turns remaining in the session.
 * Includes the current turn.
 */
export function getRemainingTurns(state: SessionState): number {
    const totalTurns = state.players.length * state.totalRounds;
    return Math.max(0, totalTurns - state.globalTurnIndex);
}

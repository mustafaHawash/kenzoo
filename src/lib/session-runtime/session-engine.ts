/**
 * session-engine.ts
 *
 * Lightweight central runtime orchestrator for Kenzoo gameplay sessions.
 *
 * RESPONSIBILITIES:
 *   - Path-based progression (4 paths per player, persistent between turns)
 *   - Turn progression and next player selection (round-robin)
 *   - Path completion detection (first player to complete all 4 paths triggers ending)
 *   - Hidden progression tracking (silent point accumulation)
 *   - Treasure economy coordination
 *   - Ending ceremony orchestration and phase sequencing
 *
 * PHILOSOPHY:
 *   - Pure functions only — no side effects, no Zustand, no reducers
 *   - Lightweight orchestration — not an enterprise engine
 *   - Path-based sessions — players progress through persistent paths
 *   - Hidden scoring — points are final scoring weights, NOT instant victory triggers
 *   - The winner is revealed ONLY via the cinematic ending ceremony
 *   - Wrong answer pauses the path and ends the turn — progression is saved
 *
 * NOT:
 *   - A Redux store
 *   - An event bus
 *   - A giant state machine
 *   - A Zustand slice
 */

import type { Player } from "@/types/player";
import type { Treasure } from "@/types/treasure";
import type { PlayerJourneyState, JourneyPath, ActivePathSession } from "@/types/path";
import { advancePathProgression, hasCompletedAllPaths, getNextStation } from "@/types/path";
import { HIDDEN_POINTS_BY_RARITY } from "@/types/treasure";
import { resolveTreasureOpen, resolveTurnEnd } from "./turn-engine";
import type { RoundResult } from "@/types/session";

/* ─── Session Configuration ──────────────────────────────── */

/** Session length to stations-per-path mapping */
export const STATIONS_BY_LENGTH: Record<import("@/types/session").SessionLength, number> = {
    short: 3,
    normal: 4,
    long: 5,
};

/** Number of paths each player receives */
export const PATHS_PER_PLAYER = 4;

/** @deprecated Use STATIONS_BY_LENGTH instead. Preserved for migration. */
export const ROUNDS_BY_LENGTH = STATIONS_BY_LENGTH;

/* ─── Session State ──────────────────────────────────────── */

/**
 * The runtime state of an active session.
 *
 * Path-based model:
 *   - Each player has a PlayerJourneyState with 4 paths
 *   - Path progression is persistent between turns
 *   - Wrong answer pauses the path, saves progression, ends the turn
 *   - First player to complete all 4 paths triggers session ending
 */
export type SessionState = {
    players: Player[];

    /** Per-player journey state — 4 paths each with individual progression */
    journeys: PlayerJourneyState[];

    /** 0-indexed index into players[] — whose turn it is */
    currentPlayerIndex: number;

    /** Session length chosen during setup (short, normal, long) */
    sessionLength: import("@/types/session").SessionLength;

    /** Number of stations per path. Derived from sessionLength. */
    stationsPerPath: number;

    /** Global turn counter across the entire session. */
    globalTurnIndex: number;

    /** True when any player has completed all 4 paths. */
    isComplete: boolean;

    /** Currently active path session, or null on path-selection screen. */
    activePath: ActivePathSession | null;

    /** Pending treasure opportunity — UI NEVER holds this directly. */
    activeTreasure: { treasure: Treasure; ownerId: string } | null;

    /** Legendary treasure IDs already claimed this session. */
    claimedLegendaryIds: string[];
};

/* ─── Gameplay Phase ────────────────────────────────────── */

/**
 * The phase-driven gameplay flow.
 *
 * path-selection -> question -> reveal -> result -> (treasure) -> transition -> next
 *
 * After a correct answer:
 *   - If more stations remain -> back to "question" (same path)
 *   - If path completed -> "transition" -> next player -> "path-selection"
 *
 * After a wrong answer:
 *   - Path progression saved -> "transition" -> next player -> "path-selection"
 */
export type GameplayPhase =
    | "path-selection"
    | "question"
    | "reveal"
    | "result"
    | "treasure"
    | "transition"
    | "ending";

/* ─── Ending Ceremony ────────────────────────────────────── */

export type EndingCeremonyPhase =
    | "intro"
    | "session-summary"
    | "titles-reveal"
    | "player-reveals"
    | "ranking-reveal"
    | "winner-reveal"
    | "closing";

const CEREMONY_PHASE_ORDER: EndingCeremonyPhase[] = [
    "intro",
    "session-summary",
    "titles-reveal",
    "player-reveals",
    "ranking-reveal",
    "winner-reveal",
    "closing",
];

export type PlayerFinalScore = {
    player: Player;
    hiddenPoints: number;
    rank: number;
};

export type EndingCeremonyState = {
    phase: EndingCeremonyPhase;
    finalScores: PlayerFinalScore[];
    winnerId: string;
};

/* ─── Factory ────────────────────────────────────────────── */

/**
 * Creates the initial session state.
 * Journeys are created by generateSession() — for now, pass pre-built journeys.
 */
export function createSessionState(
    players: Player[],
    journeys: PlayerJourneyState[],
    sessionLength: import("@/types/session").SessionLength = "normal",
): SessionState {
    const stationsPerPath = STATIONS_BY_LENGTH[sessionLength];

    return {
        players,
        journeys,
        currentPlayerIndex: 0,
        sessionLength,
        stationsPerPath,
        globalTurnIndex: 0,
        isComplete: false,
        activePath: null,
        activeTreasure: null,
        claimedLegendaryIds: [],
    };
}

/* ─── Path Selection ────────────────────────────────────── */

/**
 * Player selects a path to attempt.
 * Creates an ActivePathSession from the current journey state.
 * The path opens at the player's saved progression point.
 */
export function selectPath(
    state: SessionState,
    pathId: string,
): SessionState {
    const currentJourney = state.journeys[state.currentPlayerIndex];
    const path = currentJourney.paths.find((p) => p.id === pathId);

    if (!path || path.completed) return state;

    const station = getNextStation(path);
    if (!station) return state;

    const activePath: ActivePathSession = {
        pathId: path.id,
        playerId: currentJourney.playerId,
        currentStation: station,
        currentStationIndex: path.currentStationIndex,
        totalStations: path.stations.length,
        stationsClearedThisTurn: 0,
        starsEarnedThisTurn: 0,
    };

    return {
        ...state,
        activePath,
    };
}

/* ─── Path Progression ──────────────────────────────────── */

/**
 * Advances the active path after a correct answer.
 * Commits station completion to the journey state.
 * If the path is completed, checks if the player completed all 4 paths.
 */
export function advanceActivePath(
    state: SessionState,
    starsEarned: number,
): SessionState {
    if (!state.activePath) return state;

    const { pathId, playerId } = state.activePath;

    const updatedJourneys = state.journeys.map((journey) => {
        if (journey.playerId !== playerId) return journey;

        const updatedPaths = journey.paths.map((path) => {
            if (path.id !== pathId) return path;
            return advancePathProgression(path);
        });

        const allCompleted = updatedPaths.every((p) => p.completed);

        return {
            ...journey,
            paths: updatedPaths,
            allPathsCompleted: allCompleted,
        };
    });

    const currentJourney = updatedJourneys[state.currentPlayerIndex];
    const isComplete = currentJourney.allPathsCompleted;

    const updatedPath = currentJourney.paths.find((p) => p.id === pathId)!;
    const nextStation = getNextStation(updatedPath);

    const updatedActivePath: ActivePathSession | null = nextStation
        ? {
            ...state.activePath,
            currentStation: nextStation,
            currentStationIndex: updatedPath.currentStationIndex,
            stationsClearedThisTurn: state.activePath.stationsClearedThisTurn + 1,
            starsEarnedThisTurn: state.activePath.starsEarnedThisTurn + starsEarned,
        }
        : null;

    return {
        ...state,
        journeys: updatedJourneys,
        activePath: updatedActivePath,
        isComplete,
    };
}

/* ─── Turn Advancement ───────────────────────────────────── */

/**
 * Advances the session to the next player's turn.
 * Clears the active path session and moves to the next player in round-robin.
 */
export function advanceTurn(
    state: SessionState,
    lastResult: RoundResult | null,
): SessionState {
    const playerCount = state.players.length;

    const updatedPlayers = state.players.map((p, i) =>
        i === state.currentPlayerIndex
            ? resolveTurnEnd(p, lastResult)
            : p,
    );

    const nextPlayerIndex = (state.currentPlayerIndex + 1) % playerCount;

    return {
        ...state,
        players: updatedPlayers,
        currentPlayerIndex: nextPlayerIndex,
        globalTurnIndex: state.globalTurnIndex + 1,
        activePath: null,
        activeTreasure: null,
    };
}

/* ─── Player & Turn Update ───────────────────────────────── */

/**
 * Applies the outcome of a station answer to the session state.
 * Captures the updated player and any resulting treasure opportunity.
 */
export function applyTurnOutcome(
    state: SessionState,
    outcome: import("./turn-engine").TurnOutcome,
): SessionState {
    const updatedPlayers = state.players.map((p, i) =>
        i === state.currentPlayerIndex ? outcome.updatedPlayer : p,
    );

    return {
        ...state,
        players: updatedPlayers,
        activeTreasure: outcome.treasureOpportunity
            ? { treasure: outcome.treasureOpportunity, ownerId: state.players[state.currentPlayerIndex].id }
            : null,
    };
}

/**
 * Applies an immutable player update to session state.
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
 * Deducts hidden star cost, records the opened treasure, tracks legendary claims.
 */
export function applyTreasureOpen(state: SessionState): SessionState {
    const active = state.activeTreasure;
    if (!active) return state;

    const { treasure, ownerId } = active;
    const playerIndex = state.players.findIndex((p) => p.id === ownerId);
    if (playerIndex === -1) return state;

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
        activeTreasure: null,
    };
}

/**
 * Clears the active treasure opportunity from session state.
 */
export function clearActiveTreasure(state: SessionState): SessionState {
    return {
        ...state,
        activeTreasure: null,
    };
}

/* ─── Session-End Scoring ────────────────────────────────── */

/**
 * Computes final hidden point totals for all players.
 * Called ONLY when session.isComplete === true.
 * Results are fed into the ending ceremony — never shown during active gameplay.
 */
export function computeFinalScores(state: SessionState): PlayerFinalScore[] {
    const scored = state.players.map((player) => {
        const hiddenPoints = player.openedTreasures.reduce(
            (sum, t) => sum + t.hiddenPoints,
            0,
        );
        return { player, hiddenPoints };
    });

    const sorted = [...scored].sort((a, b) => b.hiddenPoints - a.hiddenPoints);

    return sorted.map((entry, index) => ({
        ...entry,
        rank: index + 1,
    }));
}

/* ─── Ending Ceremony ────────────────────────────────────── */

/**
 * Creates the initial ending ceremony state once a session completes.
 * Computes final scores and sets the starting phase to "intro".
 */
export function createEndingCeremonyState(
    state: SessionState,
): EndingCeremonyState {
    const finalScores = computeFinalScores(state);
    const winner = finalScores[0];

    return {
        phase: "intro",
        finalScores,
        winnerId: winner.player.id,
    };
}

/**
 * Advances the ending ceremony to the next phase.
 * Stops at "closing" — the final phase.
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
 * Returns a human-readable path progress label.
 * Example: "المسار 2 من 4"
 */
export function getSessionProgressLabel(state: SessionState): string {
    const journey = state.journeys[state.currentPlayerIndex];
    if (!journey) return "";
    const completed = journey.paths.filter((p) => p.completed).length;
    return `${completed} من ${PATHS_PER_PLAYER} مسارات`;
}

/**
 * Returns total remaining stations across all uncompleted paths for all players.
 */
export function getRemainingStations(state: SessionState): number {
    return state.journeys.reduce((total, journey) => {
        return total + journey.paths.reduce((pathTotal, path) => {
            if (path.completed) return pathTotal;
            return pathTotal + (path.stations.length - path.currentStationIndex);
        }, 0);
    }, 0);
}


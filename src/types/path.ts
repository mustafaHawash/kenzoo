
/**
 * path.ts — Path-based progression runtime types
 *
 * Each player has 4 mysterious paths.
 * Each path contains N stations (N = session length).
 * Path progression is PERSISTENT between turns.
 *
 * Architecture:
 *   - JourneyPath: a single path with its stations and progression
 *   - PlayerJourneyState: all 4 paths for one player
 *   - PathDifficultyTier: hidden internal difficulty (never shown to players)
 *
 * Future: generateSession() will populate these structures
 * with AI-generated stations, difficulty curves, and treasure probabilities.
 */

import type { Station, StationDifficulty } from "./station";

/* ─── Path Difficulty ─── */

/**
 * Hidden internal difficulty tier for a path.
 *
 * Players NEVER see this — paths feel atmospheric and magical.
 * Internally, higher difficulty:
 *   - rewards more stars
 *   - has higher treasure probability
 *   - may have harder questions
 */
export type PathDifficultyTier = 1 | 2 | 3 | 4;

/* ─── Path Station Slot ─── */

/**
 * A single station slot within a path.
 *
 * Tracks whether the station has been completed, skipped, or is pending.
 * The station data itself comes from generateSession() — for now it's
 * populated from content files.
 */
export type PathStationSlot = {
    /** The station data — null if not yet generated/assigned */
    station: Station;

    /** Whether this station has been completed */
    completed: boolean;
};

/* ─── Journey Path ─── */

/**
 * A single mysterious path in a player's journey.
 *
 * Contains sequential stations and tracks progression.
 * Players advance through stations by answering correctly.
 * Wrong answer pauses the path — progression is saved.
 */
export type JourneyPath = {
    /** Unique path identifier */
    id: string;

    /** Atmospheric emoji displayed on the path card */
    emoji: string;

    /** Atmospheric title (Arabic) — e.g., "حكايات القمر" */
    title: string;

    /** Atmospheric subtitle — hint at the path's mood */
    subtitle: string;

    /** Hidden difficulty tier — NEVER shown to players */
    difficultyTier: PathDifficultyTier;

    /** Hidden treasure probability multiplier for this path */
    treasureProbabilityMultiplier: number;

    /** Sequential station slots in this path */
    stations: PathStationSlot[];

    /**
     * Current progression index — 0-based.
     * Points to the NEXT station the player will attempt.
     * Equal to stations.length when the path is fully completed.
     */
    currentStationIndex: number;

    /** Whether all stations in this path have been completed */
    completed: boolean;
};

/* ─── Player Journey State ─── */

/**
 * The full journey state for one player.
 * Contains exactly 4 paths with individual progression.
 */
export type PlayerJourneyState = {
    /** The player this journey belongs to */
    playerId: string;

    /** The player's 4 paths */
    paths: JourneyPath[];

    /**
     * Whether this player has completed ALL 4 paths.
     * When any player reaches this state, the session ends.
     */
    allPathsCompleted: boolean;
};

/* ─── Active Path Session ─── */

/**
 * The currently active path during a player's turn.
 *
 * Created when a player selects a path.
 * Tracks the in-turn progression (which station they're on right now).
 * Persisted back to the journey state when the turn ends.
 */
export type ActivePathSession = {
    /** The path being played */
    pathId: string;

    /** The player playing this path */
    playerId: string;

    /** The station currently being attempted */
    currentStation: Station;

    /** 0-based index of the current station within the path */
    currentStationIndex: number;

    /** Total stations in this path */
    totalStations: number;

    /**
     * Stations completed during THIS turn.
     * A player may clear multiple stations in one turn
     * if they keep answering correctly.
     */
    stationsClearedThisTurn: number;

    /** Stars earned during this turn so far */
    starsEarnedThisTurn: number;
};

/* ─── Utility ─── */

/**
 * Returns the next uncompleted station in a path, or null if the path is complete.
 */
export function getNextStation(path: JourneyPath): Station | null {
    if (path.completed) return null;
    if (path.currentStationIndex >= path.stations.length) return null;

    return path.stations[path.currentStationIndex].station;
}

/**
 * Advances a path to the next station after a correct answer.
 * Returns a new JourneyPath with updated progression.
 */
export function advancePathProgression(path: JourneyPath): JourneyPath {
    const nextIndex = path.currentStationIndex + 1;
    const isComplete = nextIndex >= path.stations.length;

    const updatedStations = path.stations.map((slot, i) =>
        i === path.currentStationIndex ? { ...slot, completed: true } : slot,
    );

    return {
        ...path,
        stations: updatedStations,
        currentStationIndex: nextIndex,
        completed: isComplete,
    };
}

/**
 * Checks if a player has completed all 4 paths.
 */
export function hasCompletedAllPaths(journey: PlayerJourneyState): boolean {
    return journey.paths.every((path) => path.completed);
}

/**
 * Returns the number of completed paths for a player.
 */
export function getCompletedPathCount(journey: PlayerJourneyState): number {
    return journey.paths.filter((path) => path.completed).length;
}

/**
 * Returns a human-readable path progress label.
 * Example: "المسار 2 من 4"
 */
export function getPathProgressLabel(journey: PlayerJourneyState): string {
    const completed = getCompletedPathCount(journey);
    return `${completed} من 4 مسارات`;
}

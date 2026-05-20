import { Player } from "./player";
import { Station, TinyMission } from "./station";
import { Theme, SessionMood } from "./theme";

/** Result of answering a single station — still used per-station resolution */
export type StationResult = {
    isCorrect: boolean;

    starsEarned: number;

    treasureUnlocked: boolean;

    tinyMission?: TinyMission;
};

/** @deprecated Use StationResult instead. Preserved for migration. */
export type RoundResult = StationResult;

/** @deprecated Rounds are no longer the progression model. Use path-based progression instead. */
export type Round = {
    id: string;

    playerId: string;

    station: Station;

    completed: boolean;

    result?: RoundResult;
};

/**
 * Named session lengths — determines stations per path.
 *  - short = 3 stations per path
 *  - normal = 4 stations per path
 *  - long = 5 stations per path
 */
export type SessionLength = "short" | "normal" | "long";

/** @deprecated This type represents the old round-based session model. The runtime now uses SessionState from session-engine.ts with path-based progression. Preserved for reference only. */
export type Session = {
    id: string;

    theme: Theme;

    mood: SessionMood;

    players: Player[];

    /** @deprecated Use path-based journeys instead */
    rounds: Round[];

    /** @deprecated No longer used in path-based model */
    currentRoundIndex: number;

    currentPlayerIndex: number;

    starsRequiredForTreasure: number;

    sessionLength: SessionLength;

    /** @deprecated Use stationsPerPath from SessionState instead */
    totalRounds: number;

    createdAt: string;
};

/* ─── Session Ending Architecture ─── */

/**
 * Phase-driven ending ceremony.
 *
 * Phases advance one at a time — cinematic, emotional, memorable.
 * The session-engine orchestrates phase transitions.
 *
 * Order: intro → session-summary → titles-reveal → player-reveals
 *        → ranking-reveal → winner-reveal → closing
 *
 * Matches EndingCeremonyPhase in session-engine.ts.
 */
export type EndingCeremonyPhase =
    | "intro"            // "الليلة قربت تخلص..."
    | "session-summary"  // Total treasures opened + rarity distribution
    | "titles-reveal"    // Earned titles revealed one by one
    | "player-reveals"   // Each player's cinematic treasure spotlight
    | "ranking-reveal"   // Rankings revealed progressively (last place first)
    | "winner-reveal"    // Final cinematic winner reveal
    | "closing";         // Optional: emotional session memory or highlight

/**
 * @deprecated Use EndingCeremonyPhase instead.
 * Preserved for backward compatibility during migration.
 */
export type EndingPhase =
    | "winner-reveal"
    | "treasure-reveal"
    | "final-score"
    | "titles-and-memories";

export type SessionEndingState = {
    isEnded: boolean;

    phase: EndingCeremonyPhase;

    /** The winning player's ID — determined by computeFinalScores() after all rounds complete */
    winnerId: string;

    /**
     * Hidden points per player — playerId → points.
     * Revealed progressively during the ending ceremony.
     * NEVER shown during active gameplay.
     */
    finalScores: Record<string, number>;
};

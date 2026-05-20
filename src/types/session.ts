import { Player } from "./player";
import { Station, TinyMission } from "./station";
import { Theme, SessionMood } from "./theme";

export type RoundResult = {
    isCorrect: boolean;

    starsEarned: number;

    treasureUnlocked: boolean;

    tinyMission?: TinyMission;
};

export type Round = {
    id: string;

    playerId: string;

    station: Station;

    completed: boolean;

    result?: RoundResult;
};

/**
 * Named session lengths (replaces arbitrary numeric rounds).
 *  - short = 3 rounds
 *  - normal = 4 rounds
 *  - long = 5 rounds
 */
export type SessionLength = "short" | "normal" | "long";

export type Session = {
    id: string;

    theme: Theme;

    mood: SessionMood;

    players: Player[];

    rounds: Round[];

    currentRoundIndex: number;

    currentPlayerIndex: number;

    starsRequiredForTreasure: number;

    sessionLength: SessionLength;

    /**
     * Fixed-length session structure.
     * The session ALWAYS runs for exactly this many rounds.
     * Derived from sessionLength (short=3, normal=4, long=5).
     * There is NO early termination based on hidden point totals.
     * Total turns = totalRounds × N players.
     */
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

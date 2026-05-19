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

export type Session = {
    id: string;

    theme: Theme;

    mood: SessionMood;

    players: Player[];

    rounds: Round[];

    currentRoundIndex: number;

    currentPlayerIndex: number;

    starsRequiredForTreasure: number;

    winnerId?: string;

    createdAt: string;
};

/* ─── Session Ending Architecture ─── */

export type EndingPhase =
    | "winner-reveal"        // Show the winning player
    | "treasure-reveal"      // Walk through opened treasures, revealing rarity and points
    | "final-score"          // Show final hidden points tally
    | "titles-and-memories"; // Distribute titles and show session highlights

export type SessionEndingState = {
    isEnded: boolean;
    phase: EndingPhase;
    winnerId?: string;
    finalScores: Record<string, number>; // playerId -> points
};

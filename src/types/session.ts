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

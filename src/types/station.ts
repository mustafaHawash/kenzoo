import { Theme, SessionMood } from "./theme";

export type StationType =
    | "quiz"
    | "riddle"
    | "guess"
    | "memory"
    | "puzzle"
    | "mystery"
    | "story"
    | "treasure"; // Added treasure station type for gameplay

export type StationStatus = "locked" | "active" | "completed";

export type StationCategory =
    | "islamic"
    | "history"
    | "science"
    | "geography"
    | "animals"
    | "language"
    | "social"
    | "wisdom"
    | "fun"
    | "memory"
    | "psychology"
    | "mystery";

export type StationDifficulty = 1 | 2 | 3 | 4;

export type TargetAgeGroup = "kid"  | "adult";

export type TinyMissionType =
    | "islamic"
    | "social"
    | "movement"
    | "funny"
    | "kindness";

export type TinyMission = {
    id: string;

    type: TinyMissionType;

    text: string;
};

export type Reward = {
    stars: number;

    canUnlockTreasure: boolean;

    titleReward?: string;
};

export type Station = {
    id: string;

    type: StationType;

    status?: StationStatus;

    category: StationCategory;

    title: string;

    description: string;

    theme: Theme;

    mood: SessionMood;

    difficulty: StationDifficulty;

    targetAgeGroup: TargetAgeGroup;

    question: string;

    choices?: string[];

    answer: string;

    hint?: string;

    explanation?: string;

    reward: Reward;

    tinyMissionPool: TinyMission[];
};

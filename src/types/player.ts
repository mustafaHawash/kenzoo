import type { OpenedTreasureRecord } from "./treasure";


export type PlayerAgeGroup = "kid" | "teen" | "adult";

export type PlayerGender = "male" | "female";

export type Player = {
    id: string;

    name: string;

    gender: PlayerGender;

    age: number;

    ageGroup: PlayerAgeGroup;

    stars: number;

    /**
     * Count of opened treasures — VISIBLE to player during gameplay.
     * Only shows "how many" — never rarity or points.
     * Example UI: "🗝️ الكنوز المكتشفة: 4"
     */
    treasures: number;

    completedMissions: number;

    titles: string[];

    /**
     * Record of every opened treasure — hidden during session.
     * Stores rarity and hidden points for session-end ceremony reveal.
     * NOT exposed to the player until the session ends.
     */
    openedTreasures: OpenedTreasureRecord[];
};

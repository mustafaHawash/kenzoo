export type PlayerDifficulty = "normal" | "medium" | "hard" | "legend";

export type PlayerAgeGroup = "kid" | "teen" | "adult";

export type PlayerGender = "male" | "female";

export type Player = {
    id: string;

    name: string;

    gender: PlayerGender;

    age: number;

    ageGroup: PlayerAgeGroup;

    difficulty: PlayerDifficulty;

    stars: number;

    treasures: number;

    completedMissions: number;

    titles: string[];
};

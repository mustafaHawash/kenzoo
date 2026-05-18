export type TreasureReward =
    | "stars"
    | "double-stars"
    | "bonus-turn"
    | "real-gift"
    | "title";

export type Treasure = {
    id: string;

    title: string;

    description: string;

    starsRequired: number;

    reward: TreasureReward;
};

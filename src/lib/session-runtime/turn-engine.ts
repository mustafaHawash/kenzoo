import { Station, TinyMission } from "@/types/station";
import { Player } from "@/types/player";
import { RoundResult } from "@/types/session";
import { 
    pickTreasureByRarity, 
    Treasure, 
    TREASURE_APPEARANCE_MIN_STARS, 
    STARS_REQUIRED_BY_RARITY, 
    HIDDEN_POINTS_BY_RARITY,
    HIDDEN_TREASURE_WIN_THRESHOLD,
    OpenedTreasureRecord 
} from "@/types/treasure";

export type TurnOutcome = {
    /** The resolved result of the station interaction */
    roundResult: RoundResult;
    /** The player's updated state (e.g., stars added) */
    updatedPlayer: Player;
    /** If a treasure should be presented, this is populated */
    treasureOpportunity: Treasure | null;
};

export type TreasureOutcome = {
    /** The player's updated state (stars deducted, treasure added) */
    updatedPlayer: Player;
    /** True if the player reached the hidden point threshold */
    isWinner: boolean;
};

/**
 * Resolves a player's answer to a station.
 * Determines correctness, assigns stars, picks tiny missions for wrong answers,
 * and rolls for treasure opportunities.
 * 
 * This is a pure runtime function that returns structured decisions.
 */
export function resolveTurn(
    player: Player,
    station: Station,
    answer: string,
    treasurePool: Treasure[],
    claimedLegendaryIds: string[]
): TurnOutcome {
    // Basic correctness logic (can be expanded for fuzzy matching later)
    const isCorrect = answer === station.answer;
    let newStars = player.stars;

    const roundResult: RoundResult = {
        isCorrect,
        starsEarned: isCorrect ? station.reward.stars : 0,
        treasureUnlocked: isCorrect && station.reward.canUnlockTreasure,
        tinyMission: !isCorrect && station.tinyMissionPool.length > 0
            ? station.tinyMissionPool[Math.floor(Math.random() * station.tinyMissionPool.length)]
            : undefined,
    };

    // Stars are added ONLY if no treasure is unlocked (treasures cost stars later)
    if (roundResult.starsEarned > 0 && !roundResult.treasureUnlocked) {
        newStars += roundResult.starsEarned;
    }

    let treasureOpportunity: Treasure | null = null;
    // Treasure only appears if correct, treasure is enabled, and player can afford the max hidden cost
    if (roundResult.isCorrect && roundResult.treasureUnlocked && newStars >= TREASURE_APPEARANCE_MIN_STARS) {
        treasureOpportunity = pickTreasureByRarity(
            treasurePool,
            claimedLegendaryIds,
            player.difficulty
        );
    }

    return {
        roundResult,
        updatedPlayer: { ...player, stars: newStars },
        treasureOpportunity
    };
}

/**
 * Processes a player opening a treasure.
 * Deducts hidden star cost, accumulates hidden points, and checks win condition.
 * 
 * This is a pure runtime function that returns the calculated economy impact.
 */
export function resolveTreasureOpen(
    player: Player,
    treasure: Treasure
): TreasureOutcome {
    const cost = STARS_REQUIRED_BY_RARITY[treasure.rarity];
    const hiddenPoints = HIDDEN_POINTS_BY_RARITY[treasure.rarity];
    
    const record: OpenedTreasureRecord = {
        treasureId: treasure.id,
        rarity: treasure.rarity,
        hiddenPoints,
        starsConsumed: cost,
    };

    const currentHiddenPoints = player.openedTreasures.reduce((sum, t) => sum + t.hiddenPoints, 0);
    const newTotalHidden = currentHiddenPoints + hiddenPoints;

    const updatedPlayer: Player = {
        ...player,
        stars: Math.max(0, player.stars - cost),
        treasures: player.treasures + 1,
        openedTreasures: [...player.openedTreasures, record],
    };

    return {
        updatedPlayer,
        isWinner: newTotalHidden >= HIDDEN_TREASURE_WIN_THRESHOLD
    };
}

/**
 * Resolves the end of a player's turn, including any tiny mission completions.
 */
export function resolveTurnEnd(
    player: Player,
    lastResult: RoundResult | null
): Player {
    // If they just played a round, got it wrong, and got a tiny mission,
    // proceeding means they completed it (social continuity).
    if (lastResult && !lastResult.isCorrect && lastResult.tinyMission) {
        return { ...player, completedMissions: player.completedMissions + 1 };
    }
    return player;
}

import { Station } from "@/types/station";
import { Player } from "@/types/player";
import { RoundResult } from "@/types/session";
import {
    pickTreasureByRarity,
    Treasure,
    TREASURE_APPEARANCE_MIN_STARS,
    STARS_REQUIRED_BY_RARITY,
    HIDDEN_POINTS_BY_RARITY,
    OpenedTreasureRecord,
} from "@/types/treasure";

export type TurnOutcome = {
    /** The resolved result of the station interaction */
    roundResult: RoundResult;
    /** The player's updated state (e.g., stars added) */
    updatedPlayer: Player;
    /** If a treasure should be presented, this is populated */
    treasureOpportunity: Treasure | null;
};

/**
 * Outcome of a player opening a treasure.
 *
 * Does NOT include a win check — the session ends when a player completes all 4 paths.
 * Hidden points are accumulated silently and scored only at the ending ceremony.
 */
export type TreasureOpenOutcome = {
    /** The player's updated state (stars deducted, treasure count incremented) */
    updatedPlayer: Player;
    /** The record appended to player.openedTreasures — used in ceremony reveal */
    record: OpenedTreasureRecord;
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
    claimedLegendaryIds: string[],
    treasureProbabilityMultiplier: number = 1,
): TurnOutcome {
    // Basic correctness logic (can be expanded for fuzzy matching later)
    const isCorrect = answer === station.answer;

    const roundResult: RoundResult = {
        isCorrect,
        starsEarned: isCorrect ? station.reward.stars : 0,
        treasureUnlocked: isCorrect && station.reward.canUnlockTreasure,
        tinyMission: !isCorrect && station.tinyMissionPool.length > 0
            ? station.tinyMissionPool[Math.floor(Math.random() * station.tinyMissionPool.length)]
            : undefined,
    };

    // FIX: Stars are ALWAYS awarded immediately on correct answer.
    // Treasures consume stars only when the player chooses to open them —
    // NOT at the moment of unlock. This ensures the economy is player-driven.
    const newStars = player.stars + roundResult.starsEarned;

    let treasureOpportunity: Treasure | null = null;
    // Treasure opportunity appears only when player can afford the max possible hidden cost (7★)
    if (roundResult.isCorrect && roundResult.treasureUnlocked && newStars >= TREASURE_APPEARANCE_MIN_STARS) {
        // Path difficulty multiplier increases the chance of a treasure appearing
        const shouldAppear = Math.random() < Math.min(1, treasureProbabilityMultiplier);
        if (shouldAppear) {
            treasureOpportunity = pickTreasureByRarity(
                treasurePool,
                claimedLegendaryIds,
            );
        }
    }

    return {
        roundResult,
        updatedPlayer: { ...player, stars: newStars },
        treasureOpportunity,
    };
}

/**
 * Processes a player opening a treasure.
 *
 * Deducts hidden star cost, records the opened treasure for the ending ceremony,
 * and increments the visible treasure count.
 *
 * WIN CONDITION is intentionally removed.
 * The session runs for a fixed number of rounds. Hidden points are scoring weights
 * revealed ONLY during the ending ceremony — not instant victory triggers.
 *
 * Called by session-engine.applyTreasureOpen() — not directly by the page.
 *
 * Pure function — returns updated player and the appended record.
 */
export function resolveTreasureOpen(
    player: Player,
    treasure: Treasure,
): TreasureOpenOutcome {
    const cost = STARS_REQUIRED_BY_RARITY[treasure.rarity];
    const hiddenPoints = HIDDEN_POINTS_BY_RARITY[treasure.rarity];

    const record: OpenedTreasureRecord = {
        treasureId: treasure.id,
        rarity: treasure.rarity,
        hiddenPoints,
        starsConsumed: cost,
    };

    const updatedPlayer: Player = {
        ...player,
        stars: Math.max(0, player.stars - cost),
        treasures: player.treasures + 1,
        openedTreasures: [...player.openedTreasures, record],
    };

    return { updatedPlayer, record };
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

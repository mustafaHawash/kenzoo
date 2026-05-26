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

/* ─── Treasure Probability Constants ─────────────────────── */

/**
 * Base probability for a treasure opportunity to appear.
 *
 * DESIGN PHILOSOPHY:
 *   - Treasures should feel special, warm, rewarding, and OCCASIONAL
 *   - NOT guaranteed, NOT spammy, NOT routine
 *   - Easy paths → lower chance, Hard paths → noticeably higher chance
 *   - Legendary feeling preserved even at highest multiplier
 *
 * The final probability is: BASE_TREASURE_PROBABILITY × treasureProbabilityMultiplier
 * Hard-capped at TREASURE_PROBABILITY_CAP to prevent guaranteed treasures.
 *
 * Example with current multipliers (0.8 / 1.0 / 1.2 / 1.5):
 *   - Tier 1 (easy):      0.35 × 0.8 = 0.28 → ~28% chance
 *   - Tier 2 (medium):    0.35 × 1.0 = 0.35 → ~35% chance
 *   - Tier 3 (hard):      0.35 × 1.2 = 0.42 → ~42% chance
 *   - Tier 4 (legendary): 0.35 × 1.5 = 0.525 → ~53% chance (capped)
 *
 * FUTURE: When seeded RNG is implemented, replace Math.random()
 * with a deterministic RngSource passed as a parameter.
 */
export const BASE_TREASURE_PROBABILITY = 0.35;

/**
 * Maximum treasure appearance probability — hard cap.
 *
 * No path difficulty can make treasures guaranteed.
 * Even the hardest path leaves room for mystery.
 * This prevents economy inflation and treasure spam.
 */
export const TREASURE_PROBABILITY_CAP = 0.75;

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
    /** The treasure that was opened — needed for reveal UI */
    treasure: Treasure;
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
    openedTreasureIds: string[] = [],
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
        // Base probability × multiplier, hard-capped to prevent guaranteed treasures
        // Easy paths → lower chance, Hard paths → noticeably higher chance
        // Treasures remain exciting and semi-rare — never guaranteed, never spammy
        const probability = Math.min(
            BASE_TREASURE_PROBABILITY * treasureProbabilityMultiplier,
            TREASURE_PROBABILITY_CAP,
        );
        const shouldAppear = Math.random() < probability;
        if (shouldAppear) {
            treasureOpportunity = pickTreasureByRarity(
                treasurePool,
                claimedLegendaryIds,
                openedTreasureIds,
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
 * SESSION ENDING: The session ends when a player completes ALL 4 paths.
 * Hidden points are scoring weights revealed ONLY during the ending ceremony —
 * they are NOT instant victory triggers.
 * The winner is the player with the most hidden points at the ending ceremony.
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

    return { updatedPlayer, record, treasure };
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

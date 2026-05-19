/**
 * Treasure — a collectible reward that costs stars to open.
 *
 * Treasures are the dopamine engine of Kenzoo.
 * They feel magical, unique, and worth chasing.
 * Each one is a tiny moment of wonder.
 *
 * Key rules:
 *   - Stations with treasure opportunity give 0 stars
 *   - Treasures consume stars — rewards are emotional and magical
 *   - Bonus stars / double-stars are allowed but must not create inflation
 *   - Treasures are emotional, not competitive
 *   - Every treasure should feel unique and worth the wait
 */

/* ─── Treasure reward types ─── */
export type TreasureRewardType =
    | "stars"          // Bonus stars inside the treasure
    | "double-stars"   // Next correct answer earns double stars
    | "bonus-turn"     // Player gets an extra turn
    | "title"          // Unlocks a new player title
    | "real-gift"      // A real-world gift (for special events)
    | "wisdom"         // A beautiful message or quote
    | "secret"         // A hidden reveal or easter egg
    | "atmosphere";    // A tiny ambiance enhancement

/* ─── Treasure rarity ─── */
export type TreasureRarity =
    | "common"     // 60% chance — small dopamine, keeps you going
    | "rare"       // 28% chance — noticeable excitement
    | "legendary"; // 12% chance — unforgettable moment

/* ─── Stars required by rarity ─── */
export const STARS_REQUIRED_BY_RARITY: Record<TreasureRarity, number> = {
    common: 3,
    rare: 5,
    legendary: 7,
};

/* ─── Reward details ─── */
export type TreasureRewardDetail = {
    type: TreasureRewardType;

    /** For "stars" reward: how many stars the treasure contains */
    starsAmount?: number;

    /** For "title" reward: the title to unlock */
    titleText?: string;

    /** For "wisdom"/"secret"/"atmosphere": the message content */
    message?: string;
};

/* ─── Treasure ─── */
export type Treasure = {
    id: string;

    /** Display emoji — the visual identity of the treasure */
    emoji: string;

    /** Short title — the first thing the player sees */
    title: string;

    /** Atmospheric flavor text — builds anticipation during reveal */
    flavor: string;

    /** Description — the reward message shown after opening */
    description: string;

    /** How many stars this treasure costs to open */
    starsRequired: number;

    /** Rarity — affects visual presentation and dopamine intensity */
    rarity: TreasureRarity;

    /** What the treasure contains */
    reward: TreasureRewardDetail;
};

/**
 * Pick a random treasure from a pool, weighted by rarity.
 * Common: 60%, Rare: 28%, Legendary: 12%
 *
 * Legendary treasures are unique — once claimed, they never appear again.
 * Pass claimedLegendaryIds to exclude them from the pool.
 */
export function pickTreasureByRarity(
    pool: Treasure[],
    claimedLegendaryIds: string[] = [],
): Treasure {
    // Exclude claimed legendary treasures
    const available = pool.filter(
        (t) => !(t.rarity === "legendary" && claimedLegendaryIds.includes(t.id)),
    );

    const roll = Math.random();
    let targetRarity: TreasureRarity;

    if (roll < 0.12) {
        targetRarity = "legendary";
    } else if (roll < 0.40) {
        targetRarity = "rare";
    } else {
        targetRarity = "common";
    }

    // Try to find one with the target rarity
    const filtered = available.filter((t) => t.rarity === targetRarity);

    // Fallback: try other rarities if target pool is empty
    if (filtered.length === 0) {
        const fallback = available.filter((t) => t.rarity !== targetRarity);
        const candidates = fallback.length > 0 ? fallback : available;

        if (candidates.length === 0) {
            // All treasures claimed — return a safe default from the original pool
            const safeDefault = pool.find((t) => t.rarity === "common") ?? pool[0];
            if (!safeDefault) {
                throw new Error("pickTreasureByRarity: treasure pool is empty");
            }
            return safeDefault;
        }

        return candidates[Math.floor(Math.random() * candidates.length)];
    }

    return filtered[Math.floor(Math.random() * filtered.length)];
}

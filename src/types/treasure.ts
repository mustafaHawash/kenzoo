/**
 * Treasure — a collectible reward that costs stars to open.
 *
 * Treasures are the emotional engine of Kenzoo.
 * They feel magical, unique, and worth chasing.
 * Each one is a tiny moment of wonder.
 *
 * HIDDEN MYSTERY RULES:
 *   - Rarity is NEVER shown before opening a treasure
 *   - Star cost is NEVER shown before opening a treasure
 *   - Hidden treasure points are NEVER shown during gameplay
 *   - All treasure opportunities look equally mysterious before opening
 *   - Rarity, points, and costs are only revealed at session end
 *
 * Key economy rules:
 *   - Treasures appear only when player has >= 7 stars (max possible cost)
 *   - Treasures consume stars upon opening (cost unknown until reveal)
 *   - Bonus stars / double-stars are allowed but must not create inflation
 *   - Treasures are emotional, not competitive
 *   - Every treasure should feel unique and worth the wait
 *   - Win condition: 21 hidden treasure points
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
    | "common"     // ~60% weighted chance — warm, satisfying
    | "rare"       // ~28% weighted chance — exciting, memorable
    | "legendary"; // ~12% weighted chance — unforgettable moment


/* ─── Hidden treasure point values (NEVER shown during gameplay) ─── */
export const HIDDEN_POINTS_BY_RARITY: Record<TreasureRarity, number> = {
    common: 3,
    rare: 5,
    legendary: 7,
};


/**
 * The hidden point threshold to win a session.
 * Players do NOT see this number during gameplay.
 * It is only revealed during the session-end ceremony.
 */
export const HIDDEN_TREASURE_WIN_THRESHOLD = 21;


/**
 * The minimum stars a player must have for a treasure opportunity to appear.
 * Set to 7 because that is the maximum possible hidden star cost.
 * This guarantees the player can always afford any treasure they encounter.
 */
export const TREASURE_APPEARANCE_MIN_STARS = 7;


/* ─── Stars consumed by rarity (hidden from player before opening) ─── */
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


/* ─── Opened treasure record (stored per-player, hidden during session) ─── */
export type OpenedTreasureRecord = {
    /** The treasure that was opened */
    treasureId: string;

    /** Rarity — hidden during session, revealed at end */
    rarity: TreasureRarity;

    /** Hidden point value — never shown during gameplay */
    hiddenPoints: number;

    /** Star cost that was consumed */
    starsConsumed: number;
};

/* ─── Treasure ─── */
export type Treasure = {
    id: string;

    /** Display emoji — the visual identity of the treasure */
    emoji: string;

    /** Short title — shown after opening */
    title: string;

    /** Atmospheric flavor text — builds anticipation during reveal */
    flavor: string;

    /** Description — the reward message shown after opening */
    description: string;

    /**
     * How many stars this treasure costs to open.
     * HIDDEN from the player before opening.
     * Always equals STARS_REQUIRED_BY_RARITY[rarity].
     */
    starsRequired: number;

    /**
     * Rarity — drives visual presentation intensity AFTER reveal.
     * HIDDEN before opening. All treasures appear equally mysterious.
     */
    rarity: TreasureRarity;

    /** What the treasure contains */
    reward: TreasureRewardDetail;
};

/**
 * The visible portion of a treasure shown to the UI during gameplay.
 * Contains ONLY the data needed to render the mystery and emotional reveal.
 * Excludes rarity, star cost, and hidden points to strictly enforce the mystery.
 */
export type HiddenTreasureReveal = Omit<Treasure, "rarity" | "starsRequired"> & {
    /** 
     * Cinematic instructions derived from rarity, replacing explicit rarity knowledge.
     * Allows the UI to render subtle variances without knowing the underlying economy.
     */
    cinematic: {
        glowOpacity: number;
        emojiSizeClass: string;
        revealDuration: number;
        hasPulse: boolean;
    };
};

/**
 * Transforms a raw Treasure into a HiddenTreasureReveal, safely stripping out
 * all hidden economic data and replacing rarity with cinematic styling instructions.
 */
export function toHiddenTreasureReveal(treasure: Treasure): HiddenTreasureReveal {
    const { rarity, starsRequired, ...safeData } = treasure;

    return {
        ...safeData,
        cinematic: {
            glowOpacity: rarity === "legendary" ? 0.22 : rarity === "rare" ? 0.18 : 0.15,
            emojiSizeClass: rarity === "legendary" ? "text-6xl" : rarity === "rare" ? "text-[52px]" : "text-5xl",
            revealDuration: rarity === "legendary" ? 1400 : rarity === "rare" ? 1100 : 900,
            hasPulse: rarity === "legendary",
        },
    };
}

/**
 * Pick a random treasure from a pool using hidden weighted generation.
 *
 * Default weights: Common 60%, Rare 28%, Legendary 12%
 * Difficulty bias shifts weights toward higher rarity.
 *
 * Legendary treasures are unique — once claimed, they never appear again.
 * Pass claimedLegendaryIds to exclude them from the pool.
 *
 * IMPORTANT: 7 stars does NOT guarantee a legendary treasure.
 * Harder stations increase rare/legendary potential via difficultyBias.
 */
export function pickTreasureByRarity(
    pool: Treasure[],
    claimedLegendaryIds: string[] = [],
    difficultyBias: "normal" | "medium" | "hard" | "legend" = "normal",
): Treasure {
    // Exclude claimed legendary treasures
    const available = pool.filter(
        (t) => !(t.rarity === "legendary" && claimedLegendaryIds.includes(t.id)),
    );

    // Weighted rarity thresholds — shifted by difficulty
    // harder difficulty = higher chance of rare/legendary
    const weights: Record<"normal" | "medium" | "hard" | "legend", { legendary: number; rare: number }> = {
        normal: { legendary: 0.12, rare: 0.40 },
        medium: { legendary: 0.18, rare: 0.52 },
        hard: { legendary: 0.26, rare: 0.62 },
        legend: { legendary: 0.35, rare: 0.72 },
    };

    const { legendary: legendaryThreshold, rare: rareThreshold } = weights[difficultyBias];
    const roll = Math.random();
    let targetRarity: TreasureRarity;

    if (roll < legendaryThreshold) {
        targetRarity = "legendary";
    } else if (roll < rareThreshold) {
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




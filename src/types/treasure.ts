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
    | "stars" // Bonus stars inside the treasure
    | "double-stars" // Next correct answer earns double stars
    | "bonus-turn" // Player gets an extra turn
    | "title" // Unlocks a new player title
    | "real-gift" // A real-world gift (for special events)
    | "wisdom" // A beautiful message or quote
    | "secret" // A hidden reveal or easter egg
    | "atmosphere"; // A tiny ambiance enhancement

/* ─── Treasure rarity ─── */
export type TreasureRarity =
    | "common" // ~60% weighted chance — warm, satisfying
    | "rare" // ~28% weighted chance — exciting, memorable
    | "legendary"; // ~12% weighted chance — unforgettable moment

/* ─── Hidden treasure point values (NEVER shown during gameplay) ─── */
export const HIDDEN_POINTS_BY_RARITY: Record<TreasureRarity, number> = {
    common: 3,
    rare: 5,
    legendary: 7,
};

/**
 * @deprecated
 * The session NO LONGER ends when a player reaches this threshold.
 * Sessions end when a player completes all 4 paths.
 * The winner is the player with the most hidden points at the ending ceremony.
 *
 * Preserved for reference only — do NOT use as an instant victory trigger.
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
 * NO cinematic data that could leak rarity is included.
 */
export type GameplayTreasureView = Omit<
    Treasure,
    "rarity" | "starsRequired" | "reward"
> & {
    /** Safe display text for the reward — no hidden values leaked */
    rewardText: string;
};

/**
 * Derives a safe reward display text from a TreasureRewardDetail.
 * Never reveals star amounts, hidden points, or rarity.
 */
function deriveRewardText(reward: TreasureRewardDetail): string {
    switch (reward.type) {
        case "stars":
            return `+${reward.starsAmount ?? 0} نجوم`;
        case "double-stars":
            return "الجولة الجاية نجوم مزدوجة";
        case "bonus-turn":
            return "جولة إضافية";
        case "title":
            return reward.titleText ?? "لقب جديد";
        case "wisdom":
            return reward.message ?? "حكمة خاصة";
        case "secret":
            return "سر مخفي";
        case "atmosphere":
            return "لمسة سحرية";
        case "real-gift":
            return "هدية حقيقية";
        default:
            return "مفاجأة";
    }
}

/**
 * Transforms a raw Treasure into a GameplayTreasureView, safely stripping out
 * all hidden economic data and rarity.
 */
export function toGameplayTreasureView(
    treasure: Treasure,
): GameplayTreasureView {
    const { rarity, starsRequired, reward, ...safeData } = treasure;
    return { ...safeData, rewardText: deriveRewardText(reward) };
}

/**
 * Pick a random treasure from a pool using hidden weighted generation.
 *
 * Default weights: Common 60%, Rare 28%, Legendary 12%
 * The game internally controls these weights for pacing (difficulty is an invisible system).
 *
 * Legendary treasures are unique — once claimed, they never appear again.
 * Pass claimedLegendaryIds to exclude them from the pool.
 *
 * IMPORTANT: 7 stars does NOT guarantee a legendary treasure.
 */
export function pickTreasureByRarity(
    pool: Treasure[],
    claimedLegendaryIds: string[] = [],
): Treasure {
    // Exclude claimed legendary treasures
    const available = pool.filter(
        (t) =>
            !(t.rarity === "legendary" && claimedLegendaryIds.includes(t.id)),
    );

    // Standard internal pacing weights (invisible to players)
    const legendaryThreshold = 0.12;
    const rareThreshold = 0.4;
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
            const safeDefault =
                pool.find((t) => t.rarity === "common") ?? pool[0];
            if (!safeDefault) {
                throw new Error("pickTreasureByRarity: treasure pool is empty");
            }
            return safeDefault;
        }

        return candidates[Math.floor(Math.random() * candidates.length)];
    }

    return filtered[Math.floor(Math.random() * filtered.length)];
}

// src/content/themes/eid-el-adha/compose-journey.ts
/**
 * Theme Runtime Composition Layer — Eid Al-Adha
 *
 * ARCHITECTURE:
 *   This is the SINGLE source of gameplay truth for the Eid theme.
 *   It composes real theme content into runtime journey structures.
 *
 * Composition flow:
 *   theme content (stations, missions, treasures)
 *       ↓
 *   path distribution (group stations by difficulty)
 *       ↓
 *   journey generation (4 paths per player, deep-cloned)
 *       ↓
 *   session runtime initialization
 *
 * FUTURE AI EXPANSION:
 *   When AI generation is added, it replaces the station pool
 *   in this file. The rest of the composition pipeline stays the same.
 *   Only the STATION POOL changes — not the runtime architecture.
 *
 * DEEP CLONE GUARANTEE:
 *   Every player journey is fully isolated.
 *   No shared mutable references between players.
 *   Stations, paths, and slots are deep-cloned per player.
 */

import type { Station, StationDifficulty } from "@/types/station";
import type { PlayerJourneyState, JourneyPath, PathStationSlot, PathDifficultyTier } from "@/types/path";

import { eidQuizStations } from "./quiz";
import { eidRiddleStations } from "./riddles";

/* ─── Path Atmosphere ──────────────────────────────────── */

/**
 * Atmospheric identity for each difficulty tier.
 * Players see emoji + title — difficulty is HIDDEN.
 */
const PATH_ATMOSPHERE: Record<PathDifficultyTier, { emoji: string; title: string; subtitle: string }> = {
    1: {
        emoji: "/images/icons/big-moon-icon.webp",
        title: "حكايات القمر",
        subtitle: "أسرار الليل الهادئ",
    },
    2: {
        emoji: "/images/icons/lantern-icon.webp",
        title: "الغرفة المقفولة",
        subtitle: "غموض بلا نهاية",
    },
    3: {
        emoji: "/images/icons/main-key-icon.webp",
        title: "أسرار الليلة",
        subtitle: "خيوط الضوء الخافت",
    },
    4: {
        emoji: "/images/icons/treasure-symbol.webp",
        title: "باب المجهول",
        subtitle: "ما وراء الظلام",
    },
};

/**
 * Treasure probability multiplier by path difficulty tier.
 * Harder paths = higher treasure chance. This is HIDDEN from players.
 *
 * BALANCING PHILOSOPHY:
 *   These multipliers are used with BASE_TREASURE_PROBABILITY (0.35)
 *   and capped at TREASURE_PROBABILITY_CAP (0.75) in turn-engine.
 *   Final probability = min(BASE × multiplier, CAP)
 *
 *   Current curve (with BASE=0.35, CAP=0.75):
 *     Tier 1 (easy):      0.35 × 0.8  = 0.28  → ~28% chance
 *     Tier 2 (medium):    0.35 × 1.0  = 0.35  → ~35% chance
 *     Tier 3 (hard):      0.35 × 1.2  = 0.42  → ~42% chance
 *     Tier 4 (legendary): 0.35 × 1.5  = 0.525 → ~53% chance
 *
 *   ANTI-SNOWBALL GUARANTEES:
 *     - No tier guarantees treasure appearance (all < 100%)
 *     - Hard cap at 75% prevents economy inflation
 *     - Higher difficulty rewards more stars but also costs more on treasure open
 *     - The economy is self-regulating: spending stars on treasures reduces
 *       the chance of subsequent treasure appearances (need ≥7 stars)
 *
 *   TREASURE APPEARANCE FEEL:
 *     - Easy paths: treasures feel rare and special
 *     - Medium paths: balanced, occasional surprises
 *     - Hard paths: noticeably more rewarding, still not guaranteed
 *     - Legendary paths: exciting treasure density, but never spammy
 */
const TREASURE_MULTIPLIER_BY_TIER: Record<PathDifficultyTier, number> = {
    1: 0.8,
    2: 1.0,
    3: 1.2,
    4: 1.5,
};

/* ─── Station Pool ─────────────────────────────────────── */

/**
 * All available stations for this theme.
 *
 * FUTURE: When AI generation is added, this pool is replaced
 * with AI-generated stations. The composition pipeline below
 * remains unchanged — only the pool source changes.
 */
const ALL_STATIONS: Station[] = [...eidQuizStations, ...eidRiddleStations];

/* ─── Station Selection ────────────────────────────────── */

/**
 * Selects stations matching a target difficulty.
 * Falls back to nearest available difficulty if exact match is scarce.
 *
 * Guarantees:
 *   - Never returns duplicate stations
 *   - Never mutates the source pool
 *   - Returns deep-cloned stations (safe for per-player isolation)
 */
function selectStationsForDifficulty(
    pool: readonly Station[],
    targetDifficulty: StationDifficulty,
    count: number,
    usedIds: Set<string>,
): Station[] {
    // Try exact difficulty match first
    let candidates = pool.filter(
        (s) => s.difficulty === targetDifficulty && !usedIds.has(s.id),
    );

    // Fall back to nearby difficulties if not enough
    if (candidates.length < count) {
        const nearby: StationDifficulty[] =
            targetDifficulty <= 2
                ? [1, 2, 3]
                : [2, 3, 4];

        candidates = pool.filter(
            (s) => nearby.includes(s.difficulty) && !usedIds.has(s.id),
        );
    }

    // Shuffle for variety (Fisher-Yates)
    const shuffled = [...candidates];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // Take what we need and deep-clone
    const selected = shuffled.slice(0, count).map((s) => structuredClone(s));

    // Track used IDs
    for (const s of selected) {
        usedIds.add(s.id);
    }

    return selected;
}

/* ─── Path Composition ─────────────────────────────────── */

/**
 * Composes a single JourneyPath for a given difficulty tier.
 *
 * Stations are selected from the REAL theme content pool.
 * Path atmosphere (emoji, title) is assigned by tier.
 * Treasure probability is assigned by tier.
 */
function composePath(
    tier: PathDifficultyTier,
    stationsPerPath: number,
    usedIds: Set<string>,
    playerSuffix: string,
): JourneyPath {
    const atmosphere = PATH_ATMOSPHERE[tier];
    const stations = selectStationsForDifficulty(
        ALL_STATIONS,
        tier as StationDifficulty,
        stationsPerPath,
        usedIds,
    );

    // Wrap stations in PathStationSlots
    const slots: PathStationSlot[] = stations.map((station, i) => ({
        station,
        completed: false,
    }));

    return {
        id: `path-${tier}-${playerSuffix}`,
        emoji: atmosphere.emoji,
        title: atmosphere.title,
        subtitle: atmosphere.subtitle,
        difficultyTier: tier,
        treasureProbabilityMultiplier: TREASURE_MULTIPLIER_BY_TIER[tier],
        stations: slots,
        currentStationIndex: 0,
        completed: false,
    };
}

/* ─── Journey Composition ──────────────────────────────── */

/**
 * Composes a full PlayerJourneyState for one player.
 *
 * GUARANTEES:
 *   - 4 paths: easy (1), medium (2), hard (3), legendary (4)
 *   - Each path has stations matching its difficulty
 *   - All stations are deep-cloned — NO shared references
 *   - usedIds prevents station reuse within the same player
 *
 * DEEP CLONE:
 *   Every station, slot, and path is a fresh object.
 *   Players NEVER share mutable references.
 */
export function composeJourney(
    playerId: string,
    stationsPerPath: number = 4,
): PlayerJourneyState {
    const usedIds = new Set<string>();

    const tiers: PathDifficultyTier[] = [1, 2, 3, 4];
    const paths = tiers.map((tier) =>
        composePath(tier, stationsPerPath, usedIds, playerId),
    );

    return {
        playerId,
        allPathsCompleted: false,
        paths,
    };
}

/**
 * Composes journeys for all players.
 *
 * Each player gets their own fully isolated journey.
 * Stations are NOT shared between players (each player gets
 * their own deep-cloned copies of the same pool).
 *
 * This is the main entry point for session initialization.
 */
export function composeAllJourneys(
    playerIds: string[],
    stationsPerPath: number = 4,
): PlayerJourneyState[] {
    return playerIds.map((id) => composeJourney(id, stationsPerPath));
}

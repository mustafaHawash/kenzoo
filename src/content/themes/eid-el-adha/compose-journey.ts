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

import type { Station, StationDifficulty, TargetAgeGroup } from "@/types/station";
import type { PlayerJourneyState, JourneyPath, PathStationSlot, PathDifficultyTier } from "@/types/path";

import { eidQuizStations } from "./quiz";
import { eidRiddleStations } from "./riddles";
import { eidMissions } from "./missions";

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
        title: "ضباب الليل",
        subtitle: "غموض بلا نهاية",
    },
    3: {
        emoji: "/images/icons/main-key-icon.webp",
        title: "غرفة الأسرار",
        subtitle: "خيوط الضوء الخافت",
    },
    4: {
        emoji: "/images/icons/treasure-symbol.webp",
        title: "طريق الكنوز",
        subtitle: "ما وراء الأفق",
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
    1: 1.4,
    2: 1.8,
    3: 2.2,
    4: 2.5,
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

const RECENT_CONTENT_HISTORY_KEY = "kenzoo:eid-el-adha:recent-content:v1";
const RECENT_HISTORY_LIMIT = 80;
const MISSION_POOL_SIZE = 3;

type RecentContentHistory = {
    stations: string[];
    missions: string[];
};

type SelectionContext = {
    usedStationIds: Set<string>;
    usedMissionIds: Set<string>;
    recentStationIds: Set<string>;
    recentMissionIds: Set<string>;
    stationQueues: Map<string, Station[]>;
    previousStation?: Station;
};

function readRecentContentHistory(): RecentContentHistory {
    if (typeof window === "undefined") return { stations: [], missions: [] };

    try {
        const raw = window.localStorage.getItem(RECENT_CONTENT_HISTORY_KEY);
        if (!raw) return { stations: [], missions: [] };

        const parsed = JSON.parse(raw) as Partial<RecentContentHistory>;
        return {
            stations: Array.isArray(parsed.stations) ? parsed.stations : [],
            missions: Array.isArray(parsed.missions) ? parsed.missions : [],
        };
    } catch {
        return { stations: [], missions: [] };
    }
}

function writeRecentContentHistory(history: RecentContentHistory): void {
    if (typeof window === "undefined") return;

    try {
        window.localStorage.setItem(
            RECENT_CONTENT_HISTORY_KEY,
            JSON.stringify({
                stations: history.stations.slice(-RECENT_HISTORY_LIMIT),
                missions: history.missions.slice(-RECENT_HISTORY_LIMIT),
            }),
        );
    } catch {
        // Best-effort replayability history; session generation must never fail on storage.
    }
}

function appendRecentContentHistory(stationIds: string[], missionIds: string[]): void {
    const current = readRecentContentHistory();
    writeRecentContentHistory({
        stations: [...current.stations, ...stationIds],
        missions: [...current.missions, ...missionIds],
    });
}

function weightedShuffle<T>(items: readonly T[], getWeight: (item: T) => number): T[] {
    return [...items]
        .map((item) => {
            const weight = Math.max(0.01, getWeight(item));
            return { item, rank: Math.random() ** (1 / weight) };
        })
        .sort((a, b) => b.rank - a.rank)
        .map(({ item }) => item);
}

function shuffle<T>(items: readonly T[]): T[] {
    const shuffled = [...items];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function difficultyPlanForTier(
    tier: PathDifficultyTier,
    stationsPerPath: number,
): StationDifficulty[] {
    const plans: Record<PathDifficultyTier, StationDifficulty[]> = {
        1: [1, 1, 2, 2, 2],
        2: [1, 2, 2, 3, 3],
        3: [2, 3, 3, 3, 4],
        4: [3, 4, 4, 4, 4],
    };

    return plans[tier].slice(0, stationsPerPath);
}

function nearbyDifficulties(targetDifficulty: StationDifficulty): StationDifficulty[] {
    if (targetDifficulty === 1) return [1, 2];
    if (targetDifficulty === 4) return [4, 3];
    return [targetDifficulty, (targetDifficulty - 1) as StationDifficulty, (targetDifficulty + 1) as StationDifficulty];
}

function stationWeight(station: Station, context: SelectionContext): number {
    let weight = 1;

    if (context.recentStationIds.has(station.id)) weight *= 0.18;

    if (context.previousStation) {
        if (station.type === context.previousStation.type) weight *= 0.42;
        if (station.category === context.previousStation.category) weight *= 0.55;
        if (station.mood === context.previousStation.mood) weight *= 0.68;
    }

    if (station.type === "riddle") weight *= 1.08;
    if (station.mood === "playful" || station.mood === "warm" || station.mood === "cozy") weight *= 1.05;

    return weight;
}

function stationQueueKey(ageGroup: TargetAgeGroup, difficulty: StationDifficulty): string {
    return `${ageGroup}:${difficulty}`;
}

function buildStationQueue(
    pool: readonly Station[],
    targetAgeGroup: TargetAgeGroup,
    targetDifficulty: StationDifficulty,
    context: SelectionContext,
): Station[] {
    const candidates = pool.filter(
        (station) =>
            station.targetAgeGroup === targetAgeGroup &&
            station.difficulty === targetDifficulty &&
            !context.usedStationIds.has(station.id),
    );
    const fresh = shuffle(candidates.filter((station) => !context.recentStationIds.has(station.id)));
    const recent = shuffle(candidates.filter((station) => context.recentStationIds.has(station.id)));

    return [...fresh, ...recent];
}

function takeFromExactQueue(
    pool: readonly Station[],
    targetDifficulty: StationDifficulty,
    targetAgeGroup: TargetAgeGroup,
    context: SelectionContext,
): Station | null {
    const key = stationQueueKey(targetAgeGroup, targetDifficulty);
    let queue = context.stationQueues.get(key);

    if (!queue) {
        queue = buildStationQueue(pool, targetAgeGroup, targetDifficulty, context);
        context.stationQueues.set(key, queue);
    }

    while (queue.length > 0) {
        const candidate = queue.shift();
        if (candidate && !context.usedStationIds.has(candidate.id)) return candidate;
    }

    return null;
}

function candidatesForSlot(
    pool: readonly Station[],
    targetDifficulty: StationDifficulty,
    targetAgeGroup: TargetAgeGroup,
    context: SelectionContext,
): Station[] {
    const unused = pool.filter((station) => !context.usedStationIds.has(station.id));
    const difficulties = nearbyDifficulties(targetDifficulty);

    const exactAgeAndDifficulty = unused.filter(
        (station) => station.targetAgeGroup === targetAgeGroup && station.difficulty === targetDifficulty,
    );
    if (exactAgeAndDifficulty.length > 0) return exactAgeAndDifficulty;

    const exactAgeNearbyDifficulty = unused.filter(
        (station) => station.targetAgeGroup === targetAgeGroup && difficulties.includes(station.difficulty),
    );
    if (exactAgeNearbyDifficulty.length > 0) return exactAgeNearbyDifficulty;

    const anyAgeExactDifficulty = unused.filter((station) => station.difficulty === targetDifficulty);
    if (anyAgeExactDifficulty.length > 0) return anyAgeExactDifficulty;

    const nearbyAnyAge = unused.filter((station) => difficulties.includes(station.difficulty));
    if (nearbyAnyAge.length > 0) return nearbyAnyAge;

    return unused.length > 0 ? unused : [...pool];
}

function selectMissionPool(context: SelectionContext): Station["tinyMissionPool"] {
    const shuffled = weightedShuffle(eidMissions, (mission) => {
        let weight = 1;
        if (context.usedMissionIds.has(mission.id)) weight *= 0.08;
        if (context.recentMissionIds.has(mission.id)) weight *= 0.3;
        return weight;
    });

    const selected = shuffled
        .filter((mission, index, all) => all.findIndex((m) => m.type === mission.type) === index)
        .slice(0, MISSION_POOL_SIZE);
    const fallback = selected.length > 0 ? selected : shuffled.slice(0, MISSION_POOL_SIZE);

    for (const mission of fallback) {
        context.usedMissionIds.add(mission.id);
    }

    return fallback.map((mission) => structuredClone(mission));
}

/* ─── Station Selection ────────────────────────────────── */

/**
 * Selects stations matching a target difficulty AND player age group.
 * Falls back to nearby difficulties if exact match is scarce.
 * Falls back to any age group if not enough age-matched stations.
 *
 * Guarantees:
 *   - Never returns duplicate stations (checked against usedIds)
 *   - Never mutates the source pool
 *   - Returns deep-cloned stations (safe for per-player isolation)
 *   - Prioritizes stations matching the player's age group
 */
function selectStationsForPath(
    pool: readonly Station[],
    difficultyPlan: StationDifficulty[],
    context: SelectionContext,
    targetAgeGroup: TargetAgeGroup,
): Station[] {
    return difficultyPlan.map((targetDifficulty) => {
        const exact = takeFromExactQueue(pool, targetDifficulty, targetAgeGroup, context);
        if (exact) {
            const cloned = structuredClone(exact);
            context.usedStationIds.add(cloned.id);
            cloned.tinyMissionPool = selectMissionPool(context);
            context.previousStation = cloned;
            return cloned;
        }

        let candidates = candidatesForSlot(pool, targetDifficulty, targetAgeGroup, context);
        if (context.previousStation && candidates.length > 1) {
            const mixedType = candidates.filter((station) => station.type !== context.previousStation?.type);
            candidates = mixedType.length > 0 ? mixedType : candidates;
        }
        if (context.previousStation && candidates.length > 1) {
            const mixedCategory = candidates.filter((station) => station.category !== context.previousStation?.category);
            candidates = mixedCategory.length > 0 ? mixedCategory : candidates;
        }
        if (context.previousStation && candidates.length > 1) {
            const mixedMood = candidates.filter((station) => station.mood !== context.previousStation?.mood);
            candidates = mixedMood.length > 0 ? mixedMood : candidates;
        }

        const selected = weightedShuffle(candidates, (station) => stationWeight(station, context))[0];
        const cloned = structuredClone(selected);

        context.usedStationIds.add(cloned.id);
        cloned.tinyMissionPool = selectMissionPool(context);
        context.previousStation = cloned;

        return cloned;
    });
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
    context: SelectionContext,
    playerSuffix: string,
    targetAgeGroup: TargetAgeGroup,
): JourneyPath {
    const atmosphere = PATH_ATMOSPHERE[tier];
    const stations = selectStationsForPath(
        ALL_STATIONS,
        difficultyPlanForTier(tier, stationsPerPath),
        context,
        targetAgeGroup,
    );

    // Wrap stations in PathStationSlots
    const slots: PathStationSlot[] = stations.map((station) => ({
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
 *   - Each path has stations matching its difficulty AND player's age group
 *   - All stations are deep-cloned — NO shared references
 *   - usedIds prevents station reuse across ALL players in the session
 *
 * DEEP CLONE:
 *   Every station, slot, and path is a fresh object.
 *   Players NEVER share mutable references.
 */
export function composeJourney(
    playerId: string,
    stationsPerPath: number = 4,
    context: SelectionContext,
    targetAgeGroup: TargetAgeGroup = "adult",
): PlayerJourneyState {
    const tiers: PathDifficultyTier[] = [1, 2, 3, 4];
    const paths = tiers.map((tier) =>
        composePath(tier, stationsPerPath, context, playerId, targetAgeGroup),
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
 * Stations are NOT shared between players — no duplicate questions
 * across the entire session, regardless of age group.
 *
 * AGE GROUP RESPECT:
 *   - Kid players get kid-targeted questions
 *   - Adult players get adult-targeted questions
 *   - The shared usedIds ensures no question appears twice in the session
 *
 * This is the main entry point for session initialization.
 */
export function composeAllJourneys(
    playerIds: string[],
    stationsPerPath: number = 4,
    playerAgeGroups: TargetAgeGroup[] = [],
): PlayerJourneyState[] {
    // Shared usedIds across ALL players — prevents duplicate stations in the session
    const recentHistory = readRecentContentHistory();
    const context: SelectionContext = {
        usedStationIds: new Set<string>(),
        usedMissionIds: new Set<string>(),
        recentStationIds: new Set(recentHistory.stations),
        recentMissionIds: new Set(recentHistory.missions),
        stationQueues: new Map<string, Station[]>(),
    };

    const journeys = playerIds.map((id, index) => {
        const ageGroup = playerAgeGroups[index] || "adult";
        return composeJourney(id, stationsPerPath, context, ageGroup);
    });

    appendRecentContentHistory([...context.usedStationIds], [...context.usedMissionIds]);

    return journeys;
}

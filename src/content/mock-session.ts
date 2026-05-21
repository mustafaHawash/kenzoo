// src/content/mock-session.ts
/**
 * Mock session data for development.
 *
 * ARCHITECTURE:
 *   This module provides ONLY:
 *     - Mock player data (names, ages, starting stats)
 *     - Journey composition via the theme runtime composition layer
 *
 *   It does NOT invent gameplay content.
 *   All stations come from the REAL theme content files.
 *
 * COMPOSITION FLOW:
 *   theme content (quiz.ts, riddles.ts)
 *       ↓
 *   compose-journey.ts (path distribution, deep clone)
 *       ↓
 *   mock-session.ts (player data + journey composition)
 *       ↓
 *   session-engine.ts (runtime initialization)
 *
 * DEEP CLONE GUARANTEE:
 *   composeAllJourneys() returns fully isolated journeys.
 *   No shared mutable references between players.
 */

import type { Player } from "@/types/player";
import type { PlayerJourneyState } from "@/types/path";

import { composeAllJourneys } from "@/content/themes/eid-el-adha/compose-journey";

/* ─── Mock Players ─── */

export const MOCK_PLAYERS: Player[] = [
    {
        id: "player-1",
        name: "مصطفى",
        gender: "male",
        age: 25,
        ageGroup: "adult",
        stars: 50,
        treasures: 2,
        completedMissions: 0,
        titles: [],
        openedTreasures: [],
    },
    {
        id: "player-2",
        name: "أحمد",
        gender: "male",
        age: 22,
        ageGroup: "adult",
        stars: 30,
        treasures: 1,
        completedMissions: 0,
        titles: [],
        openedTreasures: [],
    },
    {
        id: "player-3",
        name: "سارة",
        gender: "female",
        age: 20,
        ageGroup: "teen",
        stars: 2,
        treasures: 1,
        completedMissions: 0,
        titles: [],
        openedTreasures: [],
    },
];

/* ─── Journey Composition ─── */

/**
 * Composes journeys for all mock players using REAL theme content.
 *
 * Each player gets 4 fully isolated paths with deep-cloned stations.
 * Stations are selected from the Eid Al-Adha theme pool,
 * distributed by difficulty tier (1=easy, 2=medium, 3=hard, 4=legendary).
 */
export const MOCK_JOURNEYS: PlayerJourneyState[] = composeAllJourneys(
    MOCK_PLAYERS.map((p) => p.id),
    4, // stations per path
);

/**
 * create-session.ts
 *
 * THE SINGLE RUNTIME ENTRY POINT for session creation.
 *
 * This module replaces:
 *   - All development-only session bootstrap flows
 *   - Direct mock data usage in runtime pages
 *
 * Flow:
 *   session/setup → buildSessionConfig() → createSession() → gameplay
 *
 * Architecture:
 *   - setup collects raw input (names, avatars, theme, length)
 *   - buildSessionConfig normalizes the payload
 *   - createSession transforms payload into a REAL playable SessionState
 *
 * Future expansion:
 *   - AI-generated stations replace theme station pools
 *   - Deterministic replay via sessionSeed
 *   - Multiplayer sync via serialized state
 *   - Persistence via extractPersistentState()
 */

import type { Player, PlayerAgeGroup, PlayerGender } from "@/types/player";
import type { SessionLength } from "@/types/session";
import type { PersistentSessionState } from "./session-engine";
import { createSessionState } from "./session-engine";
import { composeAllJourneys } from "@/content/themes/eid-el-adha/compose-journey";
import { STATIONS_BY_LENGTH, PATHS_PER_PLAYER } from "./session-engine";

/* ─── Runtime ID Strategy ──────────────────────────────── */

/**
 * Lightweight deterministic-safe ID generation.
 *
 * DESIGN PRINCIPLES:
 *   - Stable: same seed + same input = same ID
 *   - Unique: combination of session + entity + index guarantees uniqueness
 *   - Serialization-safe: plain strings, no special characters
 *   - Replay-safe: deterministic when seed is provided
 *   - Human-readable: easy to debug and trace
 *
 * AVOIDS:
 *   - Math.random() (non-deterministic)
 *   - Date.now() (time-dependent)
 *   - UUID v4 (random)
 *   - crypto.randomUUID() (async, random)
 *
 * Format: `{prefix}-{seed fragment}-{index}`
 * Example: `ses-a3f2-001`, `player-a3f2-0`, `path-a3f2-1-3`
 */

/** Creates a session-scoped ID generator */
function createIdGenerator(sessionSeed: string) {
    const short = sessionSeed.slice(0, 4);
    return {
        session: () => `ses-${short}`,
        player: (index: number) => `player-${short}-${index}`,
        path: (playerIndex: number, pathIndex: number) =>
            `path-${short}-${playerIndex}-${pathIndex}`,
        station: (stationId: string) => stationId, // Stations keep their content IDs
    };
}

/* ─── Session Seed ─────────────────────────────────────── */

/**
 * Generates a lightweight session seed.
 *
 * NOT full deterministic replay — just a stable identifier
 * for ID generation and future debugging.
 *
 * Format: 8 hex chars from timestamp + random suffix
 * Example: "a3f2b7c1"
 */
export function generateSessionSeed(): string {
    const timestamp = Date.now().toString(16).slice(-4);
    const random = Math.random().toString(16).slice(2, 6);
    return `${timestamp}${random}`;
}

/* ─── Session Creation Input ───────────────────────────── */

/**
 * Input for createSession().
 *
 * This is the normalized payload from the setup flow.
 * It contains ONLY what the runtime needs to create a session.
 * No UI state, no step tracking, no animation data.
 */
export type CreateSessionInput = {
    /** Player definitions from setup */
    players: {
        name: string;
        avatar: string;
        ageGroup: "adult" | "kid";
    }[];

    /** Session length */
    sessionLength: SessionLength;

    /** Theme ID — determines content pool */
    themeId: string;

    /** Optional seed for deterministic ID generation */
    sessionSeed?: string;
};

/* ─── Session Validation ───────────────────────────────── */

/**
 * Validation result for session input.
 */
export type ValidationResult = {
    isValid: boolean;
    errors: string[];
};

/**
 * Validates session input before creation.
 *
 * Lightweight, readable, scalable.
 * Does NOT overengineer — just catches the critical failure cases.
 *
 * Returns: { isValid, errors[] }
 * If isValid is false, errors contains human-readable reasons.
 */
export function validateSessionInput(input: CreateSessionInput): ValidationResult {
    const errors: string[] = [];

    // Player count
    if (!input.players || input.players.length === 0) {
        errors.push("يجب إضافة لاعب واحد على الأقل");
    }
    if (input.players.length > 6) {
        errors.push("الحد الأقصى 6 لاعبين");
    }

    // Player names
    const names = input.players.map((p) => p.name.trim());
    const emptyNames = names.filter((n) => n.length === 0);
    if (emptyNames.length > 0) {
        errors.push("كل اللاعبين لازم يكون عندهم اسم");
    }

    const duplicateNames = names.filter((n, i) => n && names.indexOf(n) !== i);
    if (duplicateNames.length > 0) {
        errors.push("أسماء اللاعبين لازم تكون مختلفة");
    }

    // Session length
    if (!STATIONS_BY_LENGTH[input.sessionLength]) {
        errors.push("طول الجلسة غير صالح");
    }

    // Theme
    if (!input.themeId || input.themeId.trim().length === 0) {
        errors.push("يجب اختيار ثيم");
    }

    // Content pool sufficiency
    const stationsPerPath = STATIONS_BY_LENGTH[input.sessionLength] ?? 4;
    const requiredStations = PATHS_PER_PLAYER * stationsPerPath; // 4 paths × N stations
    // Note: We don't validate exact pool size here because compose-journey
    // handles fallback gracefully. This is a soft check.
    if (requiredStations > 20) {
        errors.push("محتوى غير كافي لهذا الطول");
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
}

/* ─── Session Creation ─────────────────────────────────── */

/**
 * Creates a PersistentSessionState — the gameplay truth.
 *
 * This is THE SINGLE RUNTIME ENTRY POINT for session creation.
 * It replaces all mock bootstrap flows.
 *
 * RETURNS: PersistentSessionState ONLY (no runtime fields).
 * To get a full SessionState with runtime fields, use:
 *   hydrateSessionState(createSession(input))
 *
 * RESPONSIBILITIES:
 *   1. Generate stable session IDs
 *   2. Initialize Player objects with clean economy
 *   3. Compose journeys using theme content
 *   4. Assemble PersistentSessionState (serializable, no runtime)
 *
 * GUARANTEES:
 *   - All players have valid journey state (4 paths each)
 *   - All paths have real theme stations (deep-cloned, no shared refs)
 *   - All IDs are stable and unique
 *   - Economy starts at zero (stars, treasures, missions)
 *   - State is JSON-serializable (no functions, no runtime refs)
 *   - No runtime-only fields (activePath, activeTreasure) are included
 *
 * FUTURE AI EXPANSION:
 *   When AI generation is added, replace composeAllJourneys()
 *   with an AI-powered composition function.
 *   The rest of this pipeline stays unchanged.
 */
export function createSession(input: CreateSessionInput): PersistentSessionState {
    const seed = input.sessionSeed ?? generateSessionSeed();
    const ids = createIdGenerator(seed);
    const stationsPerPath = STATIONS_BY_LENGTH[input.sessionLength];

    // 1. Initialize players with clean economy
    const players: Player[] = input.players.map((p, index) => ({
        id: ids.player(index),
        name: p.name.trim() || `لاعب ${index + 1}`,
        gender: "male" as PlayerGender, // Default — future: add to setup
        age: p.ageGroup === "kid" ? 10 : 25,
        ageGroup: p.ageGroup as PlayerAgeGroup,
        stars: 0,
        treasures: 0,
        completedMissions: 0,
        titles: [],
        openedTreasures: [],
    }));

    // 2. Compose journeys using theme content
    //    Future: replace with AI-generated composition
    const playerIds = players.map((p) => p.id);
    const journeys = composeAllJourneys(playerIds, stationsPerPath);

    // 3. Assemble PersistentSessionState (no runtime fields)
    return createSessionState(players, journeys, input.sessionLength);
}

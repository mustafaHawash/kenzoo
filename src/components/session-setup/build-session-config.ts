/**
 * build-session-config.ts
 *
 * Runtime preparation boundary.
 *
 * This is NOT a UI concern.
 * The setup shell collects raw state.
 * This module normalizes and prepares the payload for session generation.
 *
 * Future expansion:
 *   - AI prompt assembly
 *   - difficulty weight computation
 *   - seasonal content injection
 *   - multiplayer sync preparation
 */

import type { SessionSetupState, SessionConfigPayload } from "./setup-types";
import { sessionLengthOptions } from "./setup-content";

/**
 * Transforms raw SessionSetupState into a normalized SessionConfigPayload.
 *
 * Responsibilities:
 *   - Strips internal IDs from players
 *   - Resolves session length to round count
 *   - Filters out empty/unnamed players (assigns fallback names)
 *   - Produces a clean, generation-ready payload
 *
 * Pure function — no side effects.
 */
export function buildSessionConfig(setup: SessionSetupState): SessionConfigPayload {
    const lengthDef = sessionLengthOptions.find((l) => l.id === setup.sessionLengthId);

    // IDENTITY RULE: Players must have real names.
    // Fallback names are a setup-time safety net only.
    // The runtime validation layer (validateSessionInput) rejects empty names.
    const players = setup.players.map((p, index) => ({
        name: p.name.trim() || `لاعب ${index + 1}`,
        avatar: p.avatar,
        ageGroup: p.ageGroup,
    }));

    return {
        players,
        rounds: lengthDef?.rounds ?? 4,
        themeId: setup.themeId,
        sessionLength: setup.sessionLengthId,
    };
}

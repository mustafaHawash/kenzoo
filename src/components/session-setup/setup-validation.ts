import type { SessionSetupState, SetupPlayer } from "./setup-types";
import { SESSION_LIMITS, isNameWithinLimit } from "./session-limits";

export type ValidationResult = {
    isValid: boolean;
    reason?: string;
};

/* ─── Per-player validation ───
 *
 * Lightweight field-level checks for inline UI feedback.
 * These are NOT schema validators — they are orchestration readiness checks.
 */

const VALID_AGE_GROUPS: Set<string> = new Set(["adult", "kid"]);

/**
 * Validates a single player's data completeness.
 * Returns the first issue found, or { isValid: true }.
 */
export function validatePlayer(player: SetupPlayer): ValidationResult {
    const trimmedName = player.name.trim();

    if (!trimmedName) {
        return { isValid: false, reason: "الاسم مطلوب عشان نناديكم" };
    }

    if (!isNameWithinLimit(trimmedName)) {
        return { isValid: false, reason: `الاسم مش لازم يزيد عن ${SESSION_LIMITS.maxNameLength} حرف` };
    }

    if (!player.avatar) {
        return { isValid: false, reason: "اختاروا رمز للاعب" };
    }

    if (!VALID_AGE_GROUPS.has(player.ageGroup)) {
        return { isValid: false, reason: "اختاروا الفئة العمرية" };
    }

    return { isValid: true };
}

/**
 * Checks for duplicate names in the player list.
 * Returns the first duplicate found, or { isValid: true }.
 */
export function findDuplicateName(players: SetupPlayer[]): ValidationResult {
    const seen = new Map<string, number>();

    for (let i = 0; i < players.length; i++) {
        const trimmed = players[i].name.trim().toLowerCase();
        if (!trimmed) continue; // empty names caught by validatePlayer

        const firstIndex = seen.get(trimmed);
        if (firstIndex !== undefined) {
            return {
                isValid: false,
                reason: `الاسم "${players[i].name.trim()}" متكرر — كل اسم لازم يكون فريد`,
            };
        }
        seen.set(trimmed, i);
    }

    return { isValid: true };
}

/* ─── Step-level validators ───
 *
 * Each validator accepts the full SessionSetupState.
 * This enables future:
 *   - cross-step validation (e.g., theme requires minimum players)
 *   - async validation (e.g., name moderation, AI readiness)
 *   - dynamic conditions (e.g., multiplayer requirements)
 */

/**
 * Validates the players setup step.
 *
 * Checks:
 *   - At least one player exists
 *   - Every player has a non-empty trimmed name
 *   - No duplicate names (case-insensitive)
 *   - Every player has an avatar
 *   - Every player has a valid ageGroup
 */
export function validatePlayersStep(state: SessionSetupState): ValidationResult {
    const { players } = state;

    if (!players || players.length < SESSION_LIMITS.minPlayers) {
        return { isValid: false, reason: "لازم يكون فيه لاعب واحد على الأقل" };
    }

    if (players.length > SESSION_LIMITS.maxPlayers) {
        return { isValid: false, reason: `أقصى عدد ${SESSION_LIMITS.maxPlayers} لاعبين` };
    }

    // Check each player individually
    for (const player of players) {
        const result = validatePlayer(player);
        if (!result.isValid) return result;
    }

    // Check for duplicate names
    const duplicateResult = findDuplicateName(players);
    if (!duplicateResult.isValid) return duplicateResult;

    return { isValid: true };
}

/**
 * Validates the session length step.
 */
export function validateSessionLengthStep(state: SessionSetupState): ValidationResult {
    if (!state.sessionLengthId) {
        return { isValid: false, reason: "اختاروا وقت الجلسة اللي يناسبكم" };
    }
    return { isValid: true };
}

/**
 * Validates the theme selection step.
 */
export function validateThemeStep(state: SessionSetupState): ValidationResult {
    if (!state.themeId) {
        return { isValid: false, reason: "اختاروا جو الليلة" };
    }
    return { isValid: true };
}

/**
 * Validates the begin step — all previous steps must be valid.
 * This is orchestration readiness, not form validation.
 */
export function validateBeginStep(state: SessionSetupState): ValidationResult {
    const playersResult = validatePlayersStep(state);
    if (!playersResult.isValid) return playersResult;

    const lengthResult = validateSessionLengthStep(state);
    if (!lengthResult.isValid) return lengthResult;

    const themeResult = validateThemeStep(state);
    if (!themeResult.isValid) return themeResult;

    return { isValid: true };
}

/**
 * Validates all steps and returns a map of results.
 * Useful for orchestration readiness checks before generation.
 */
export function validateAllSteps(state: SessionSetupState): Record<string, ValidationResult> {
    return {
        players: validatePlayersStep(state),
        length: validateSessionLengthStep(state),
        theme: validateThemeStep(state),
        begin: validateBeginStep(state),
    };
}

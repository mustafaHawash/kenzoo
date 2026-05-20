
/**
 * session-limits.ts
 *
 * Scalable session constraints architecture.
 *
 * Centralizes all session limits in one place.
 * Future systems may support:
 *   - larger rooms (party mode)
 *   - duo modes
 *   - family sessions
 *   - online sessions with different caps
 *   - theme-specific limits
 *
 * Architecture:
 *   - SESSION_LIMITS is the single source of truth
 *   - All limit checks flow through helper functions
 *   - UI components never hardcode limit numbers
 *   - Future: limits may vary by session mode or theme
 */

export type SessionLimits = {
    /** Maximum number of players in a session */
    maxPlayers: number;
    /** Minimum number of players required to start */
    minPlayers: number;
    /** Maximum player name length (trimmed) */
    maxNameLength: number;
};

/**
 * Default session limits.
 *
 * These are orchestration constraints, not UI constants.
 * Changing these values affects validation, UI, and generation.
 */
export const SESSION_LIMITS: SessionLimits = {
    maxPlayers: 4,
    minPlayers: 1,
    maxNameLength: 20,
};

/**
 * Checks if a player count is within session limits.
 */
export function isWithinPlayerLimit(count: number): boolean {
    return count >= SESSION_LIMITS.minPlayers && count <= SESSION_LIMITS.maxPlayers;
}

/**
 * Checks if more players can be added.
 */
export function canAddMorePlayers(currentCount: number): boolean {
    return currentCount < SESSION_LIMITS.maxPlayers;
}

/**
 * Checks if a trimmed name is within length limits.
 */
export function isNameWithinLimit(name: string): boolean {
    return name.trim().length <= SESSION_LIMITS.maxNameLength;
}

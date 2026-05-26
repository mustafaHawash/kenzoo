/**
 * Session Recovery — Local Persistence & Recovery
 *
 * Saves session state to localStorage so users can recover
 * if the page refreshes or crashes during gameplay.
 *
 * Architecture:
 * - Save on every meaningful state change
 * - Recover on app startup
 * - Clear after successful session completion
 * - Timeout: auto-clear stale sessions after 2 hours
 */

const STORAGE_KEY = "kenzoo-session-backup";
const MAX_AGE_MS = 2 * 60 * 60 * 1000; // 2 hours

type SessionBackup = {
    state: unknown;
    timestamp: number;
    route: string;
};

export function saveSessionBackup(state: unknown, route: string): void {
    try {
        const backup: SessionBackup = {
            state,
            timestamp: Date.now(),
            route,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(backup));
    } catch {
        // localStorage full or unavailable — silently ignore
    }
}

export function recoverSession(): { state: unknown; route: string } | null {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;

        const backup: SessionBackup = JSON.parse(raw);

        // Check if session is stale
        if (Date.now() - backup.timestamp > MAX_AGE_MS) {
            clearSessionBackup();
            return null;
        }

        return { state: backup.state, route: backup.route };
    } catch {
        return null;
    }
}

export function clearSessionBackup(): void {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch {
        // Silently ignore
    }
}

export function hasSessionBackup(): boolean {
    try {
        return localStorage.getItem(STORAGE_KEY) !== null;
    } catch {
        return false;
    }
}

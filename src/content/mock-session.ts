// src/content/mock-session.ts
/**
 * Development-only session preview utility.
 *
 * ⚠️ NOT for production runtime.
 * ⚠️ The real runtime flow uses createSession() from session-runtime.
 * ⚠️ This module exists ONLY for quick dev testing without setup.
 *
 * REAL RUNTIME FLOW:
 *   landing → session/setup → createSession() → gameplay → play → ending
 *
 * DEV PREVIEW FLOW (this module):
 *   createDevSession() → PersistentSessionState → Zustand store
 *
 * Content comes from REAL theme files (quiz.ts, riddles.ts, etc.)
 * Only the player definitions are synthetic.
 */

import type { CreateSessionInput } from "@/lib/session-runtime/create-session";
import { createSession } from "@/lib/session-runtime/create-session";
import type { PersistentSessionState } from "@/lib/session-runtime/session-engine";

/* ─── Dev Preview Players ─── */

const DEV_PLAYERS: CreateSessionInput["players"] = [
    { name: "مصطفى", avatar: "🧭", ageGroup: "adult" },
    { name: "أحمد", avatar: "🔮", ageGroup: "adult" },
    { name: "سارة", avatar: "🌙", ageGroup: "kid" },
];

/**
 * Creates a development preview session.
 *
 * Uses REAL theme content via createSession().
 * Useful for testing gameplay without going through setup.
 *
 * DO NOT use this in production runtime.
 * The real flow always goes through session/setup → createSession().
 */
export function createDevSession(
    sessionLength: "short" | "normal" | "long" = "normal",
): PersistentSessionState {
    return createSession({
        players: DEV_PLAYERS,
        sessionLength,
        themeId: "eid-el-adha",
    });
}

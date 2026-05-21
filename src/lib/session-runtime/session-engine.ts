/**
 * session-engine.ts
 *
 * Lightweight central runtime orchestrator for Kenzoo gameplay sessions.
 *
 * RESPONSIBILITIES:
 *   - Path-based progression (4 paths per player, persistent between turns)
 *   - Turn progression and next player selection (round-robin)
 *   - Path completion detection (first player to complete all 4 paths triggers ending)
 *   - Hidden progression tracking (silent point accumulation)
 *   - Treasure economy coordination
 *   - Ending ceremony orchestration and phase sequencing
 *
 * PHILOSOPHY:
 *   - Pure functions only — no side effects, no Zustand, no reducers
 *   - Lightweight orchestration — not an enterprise engine
 *   - Path-based sessions — players progress through persistent paths
 *   - Hidden scoring — points are final scoring weights, NOT instant victory triggers
 *   - The winner is revealed ONLY via the cinematic ending ceremony
 *   - Wrong answer pauses the path and ends the turn — progression is saved
 *
 * NOT:
 *   - A Redux store
 *   - An event bus
 *   - A giant state machine
 *   - A Zustand slice
 */

import type { Player } from "@/types/player";
import type { Treasure } from "@/types/treasure";
import type { PlayerJourneyState, JourneyPath, ActivePathSession } from "@/types/path";
import { advancePathProgression, hasCompletedAllPaths, getNextStation } from "@/types/path";
import { HIDDEN_POINTS_BY_RARITY } from "@/types/treasure";
import { resolveTreasureOpen, resolveTurnEnd } from "./turn-engine";
import type { RoundResult } from "@/types/session";

/* ─── Session Configuration ──────────────────────────────── */

/** Session length to stations-per-path mapping */
export const STATIONS_BY_LENGTH: Record<import("@/types/session").SessionLength, number> = {
    short: 3,
    normal: 4,
    long: 5,
};

/** Number of paths each player receives */
export const PATHS_PER_PLAYER = 4;



/* ═══════════════════════════════════════════════════════════
   SESSION STATE BOUNDARIES

   ┌──────────────────────────────────────────────────────┐
   │  PERSISTENT SESSION STATE                            │
   │  (Serializable, deterministic, future-Zustand-ready) │
   │                                                      │
   │  This is the GAMEPLAY TRUTH.                         │
   │  It survives: page navigation, tab switches,         │
   │  future persistence, session restore, multiplayer.   │
   │                                                      │
   │  Contains ONLY:                                      │
   │    - Player data & economy                           │
   │    - Journey progression                             │
   │    - Turn tracking                                   │
   │    - Session completion                              │
   │    - Treasure claim history                          │
   │                                                      │
   │  Does NOT contain:                                   │
   │    - Active path session (runtime-only)              │
   │    - Pending treasure (runtime-only)                 │
   │    - UI phase state                                  │
   │    - Animation timing                                │
   │    - Component interaction state                     │
   ╞══════════════════════════════════════════════════════╡
   │  RUNTIME-ONLY STATE                                 │
   │  (Ephemeral, never persisted, never serialized)      │
   │                                                      │
   │  This is the CURRENT INTERACTION context.            │
   │  It resets on: navigation, page reload, turn end.    │
   │                                                      │
   │  Contains:                                           │
   │    - activePath (which path is currently being played)│
   │    - activeTreasure (pending treasure opportunity)    │
   │    - gameplayPhase (question/reveal/result/etc.)     │
   │    - lastResult (most recent answer outcome)         │
   │    - awardedTitle (treasure title reward)            │
   │    - Component interaction state (choices, inputs)   │
   ╞══════════════════════════════════════════════════════╡
   │  FUTURE ZUSTAND OWNERSHIP                           │
   │                                                      │
   │  Zustand store will contain:                         │
   │    PersistentSessionState ONLY                       │
   │                                                      │
   │  Zustand store will NOT contain:                     │
   │    - GameplayPhase                                   │
   │    - ActivePathSession                               │
   │    - Active treasure opportunity                     │
   │    - Animation/reveal timing                         │
   │    - Local component state                           │
   ╚══════════════════════════════════════════════════════╝
   ═════════════════════════════════════════════════════════ */

/* ─── Persistent Session State ──────────────────────────── */

/**
 * The persistent gameplay truth of an active session.
 *
 * SERIALIZATION CONTRACT:
 *   - All fields are JSON-serializable (no functions, no Symbols, no DOM refs)
 *   - All fields are deterministic (no Date.now(), no Math.random() at rest)
 *   - All fields are stable (no transient UI state)
 *   - All fields are isolated from runtime/UI state
 *
 * PERSISTENCE GUARANTEE:
 *   This type can be safely:
 *     - JSON.stringify / JSON.parse (round-trip safe)
 *     - Stored in localStorage / IndexedDB
 *     - Sent over WebSocket / HTTP
 *     - Restored after page reload
 *     - Synced across multiplayer clients
 *
 * FUTURE ZUSTAND:
 *   This is exactly what the Zustand store will contain.
 *   No runtime-only state should ever leak into this structure.
 */
export type PersistentSessionState = {
    /** All players and their current economy state */
    players: Player[];

    /** Per-player journey state — 4 paths each with individual progression */
    journeys: PlayerJourneyState[];

    /** 0-indexed index into players[] — whose turn it is */
    currentPlayerIndex: number;

    /** Session length chosen during setup (short, normal, long) */
    sessionLength: import("@/types/session").SessionLength;

    /** Number of stations per path. Derived from sessionLength. */
    stationsPerPath: number;

    /** Global turn counter across the entire session. */
    globalTurnIndex: number;

    /** True when any player has completed all 4 paths. */
    isComplete: boolean;

    /** Legendary treasure IDs already claimed this session. */
    claimedLegendaryIds: string[];
};

/* ─── Runtime-Only State ───────────────────────────────── */

/**
 * Ephemeral runtime state that exists ONLY during active gameplay.
 *
 * This state is NOT serialized, NOT persisted, and NOT part of
 * the gameplay truth. It represents the current interaction context.
 *
 * LIFECYCLE:
 *   - Created when a player starts a path or receives a treasure
 *   - Cleared when a turn ends (advanceTurn) or path completes
 *   - Never survives page navigation or reload
 *
 * BOUNDARY RULE:
 *   If removing this state would NOT change the final game outcome,
 *   then it belongs here, NOT in PersistentSessionState.
 */
export type RuntimeSessionState = {
    /** Currently active path session, or null on path-selection screen.
     *  RUNTIME-ONLY: which path is being played RIGHT NOW.
     *  Does not affect final scores or progression if lost. */
    activePath: ActivePathSession | null;

    /** Pending treasure opportunity — UI NEVER holds this directly.
     *  RUNTIME-ONLY: a treasure is waiting to be opened or dismissed.
     *  If lost (e.g., page reload), the opportunity is simply missed.
     *  The player's economy is already committed — this is just the UI event. */
    activeTreasure: { treasure: Treasure; ownerId: string } | null;
};

/* ─── Combined Session State (current architecture) ─────── */

/**
 * The full runtime state of an active session.
 *
 * Combines persistent gameplay truth with runtime-only interaction state.
 *
 * MIGRATION NOTE:
 *   Currently, both persistent and runtime state live in one type
 *   for simplicity. When Zustand is added:
 *     - PersistentSessionState → Zustand store
 *     - RuntimeSessionState → React component state (useGameSession hook)
 *   The split is already defined above — just move the fields.
 */
export type SessionState = PersistentSessionState & RuntimeSessionState;

/* ─── Gameplay Phase ────────────────────────────────────── */

/**
 * The phase-driven gameplay flow.
 *
 * path-selection -> question -> reveal -> result -> (treasure) -> transition -> next
 *
 * After a correct answer:
 *   - If more stations remain -> back to "question" (same path)
 *   - If path completed -> "transition" -> next player -> "path-selection"
 *
 * After a wrong answer:
 *   - Path progression saved -> "transition" -> next player -> "path-selection"
 */
export type GameplayPhase =
    | "path-selection"
    | "question"
    | "reveal"
    | "result"
    | "treasure"
    | "transition"
    | "ending";

/* ─── Session Lifecycle ────────────────────────────────── */

/**
 * Session lifecycle ownership.
 *
 * This is NOT UI phase state.
 * This tracks the lifecycle of the session itself.
 *
 * Flow: idle → generating → active → ending → completed
 */
export type SessionLifecycleState =
    | "idle"        // No session exists
    | "generating"  // Session is being created (cinematic delay / future: AI call)
    | "active"      // Session is in progress — gameplay is happening
    | "ending"      // Session completion detected — ceremony pending
    | "completed";  // Session finished — ceremony done

/* ─── Gameplay Flow Decisions ───────────────────────────── */

/**
 * The result of a gameplay flow decision.
 *
 * session-engine OWNS the decision of what happens next.
 * The hook OWNS syncing this decision into React state.
 *
 * This type tells the hook:
 *   - What the next phase should be
 *   - Whether the session state changed (and how)
 *   - Whether an ending ceremony should start
 */
export type GameplayFlowDecision = {
    /** The next gameplay phase */
    nextPhase: GameplayPhase;

    /** Updated session state (if changed) */
    updatedState?: SessionState;

    /** Ending ceremony to start (if session completed) */
    ceremony?: EndingCeremonyState;
};

/**
 * Resolves what happens after a correct answer continues from result phase.
 *
 * OWNED BY: session-engine (gameplay authority)
 * CALLED BY: useGameSession (React adapter)
 *
 * Flow:
 *   - If treasure opportunity exists → show treasure overlay
 *   - If correct answer → advance path, check completion
 *   - If wrong answer → transition to path selection
 *
 * IMPORTANT: This function makes ONLY the gameplay decision.
 * It does NOT manage timers, React state, or UI transitions.
 */
export function resolveContinueFromResult(
    state: SessionState,
    lastResult: StationResult | null,
): GameplayFlowDecision {
    // Treasure opportunity takes priority — gameplay freezes
    if (state.activeTreasure) {
        return { nextPhase: "treasure" };
    }

    // No treasure — advance based on answer result
    if (lastResult?.isCorrect) {
        const next = advanceActivePath(state, lastResult.starsEarned);

        // Session completed — trigger ending
        if (next.isComplete) {
            return {
                nextPhase: "ending",
                updatedState: next,
                ceremony: createEndingCeremonyState(next),
            };
        }

        // Path still active — next station
        if (next.activePath) {
            return { nextPhase: "question", updatedState: next };
        }

        // Path completed — back to path selection
        return { nextPhase: "transition", updatedState: next };
    }

    // Wrong answer — save progress, end turn
    return { nextPhase: "transition" };
}

/**
 * Resolves what happens after dismissing a treasure overlay.
 *
 * OWNED BY: session-engine (gameplay authority)
 * CALLED BY: useGameSession (React adapter)
 *
 * Treasure dismissal ONLY closes the overlay.
 * Then we advance the path and decide the next phase.
 * Progression was already committed before the treasure appeared.
 */
export function resolveDismissTreasure(
    state: SessionState,
    lastResult: StationResult | null,
): GameplayFlowDecision {
    // Clear the treasure overlay first
    const cleared = clearActiveTreasure(state);

    // Now resolve progression (same logic as continue from result)
    if (lastResult?.isCorrect) {
        const next = advanceActivePath(cleared, lastResult.starsEarned);

        if (next.isComplete) {
            return {
                nextPhase: "ending",
                updatedState: next,
                ceremony: createEndingCeremonyState(next),
            };
        }

        if (next.activePath) {
            return { nextPhase: "question", updatedState: next };
        }

        return { nextPhase: "transition", updatedState: next };
    }

    // Wrong answer after treasure — transition
    return { nextPhase: "transition", updatedState: cleared };
}

/**
 * Resolves what happens during the transition phase.
 *
 * OWNED BY: session-engine (gameplay authority)
 * CALLED BY: useGameSession (React adapter)
 *
 * Advances to the next player's turn.
 * The hook handles the actual navigation.
 */
export function resolveTransition(
    state: SessionState,
    lastResult: StationResult | null,
): GameplayFlowDecision {
    const next = advanceTurn(state, lastResult);
    return { nextPhase: "path-selection", updatedState: next };
}

/* ─── Ending Ceremony ────────────────────────────────────── */

export type EndingCeremonyPhase =
    | "intro"
    | "session-summary"
    | "titles-reveal"
    | "player-reveals"
    | "ranking-reveal"
    | "winner-reveal"
    | "closing";

const CEREMONY_PHASE_ORDER: EndingCeremonyPhase[] = [
    "intro",
    "session-summary",
    "titles-reveal",
    "player-reveals",
    "ranking-reveal",
    "winner-reveal",
    "closing",
];

export type PlayerFinalScore = {
    player: Player;
    hiddenPoints: number;
    rank: number;
};

export type EndingCeremonyState = {
    phase: EndingCeremonyPhase;
    finalScores: PlayerFinalScore[];
    winnerId: string;
};

/* ─── Factory ────────────────────────────────────────────── */

/* ─── Journey Initialization ─────────────────────────────── */

/**
 * Creates an empty PlayerJourneyState for a player.
 *
 * IMPORTANT: This is a runtime-safe placeholder.
 * Each path gets 0 stations — real content must be injected
 * via injectJourneyPaths() or by passing pre-built journeys.
 *
 * This guarantees that state.journeys[i] is NEVER undefined.
 */
export function createEmptyJourney(playerId: string): PlayerJourneyState {
    return {
        playerId,
        paths: Array.from({ length: PATHS_PER_PLAYER }, (_, i) => ({
            id: `path-${playerId}-${i}`,
            emoji: "🌙",
            title: `مسار ${i + 1}`,
            subtitle: "",
            difficultyTier: (i + 1) as 1 | 2 | 3 | 4,
            treasureProbabilityMultiplier: 1,
            stations: [],
            currentStationIndex: 0,
            completed: false,
        })),
        allPathsCompleted: false,
    };
}

/**
 * Injects real paths into a player's journey, replacing placeholder paths.
 * Used when session content becomes available (e.g., from gameplay/page.tsx).
 */
export function injectJourneyPaths(
    state: SessionState,
    playerId: string,
    paths: JourneyPath[],
): SessionState {
    return {
        ...state,
        journeys: state.journeys.map((j) =>
            j.playerId === playerId ? { ...j, paths } : j,
        ),
    };
}

/* ─── Factory ────────────────────────────────────────────── */

/**
 * Creates the initial session state.
 *
 * INITIALIZATION GUARANTEE:
 *   - If journeys are provided, they are used directly.
 *   - If journeys array is empty or too short, empty placeholder journeys
 *     are auto-generated for each player.
 *   - state.journeys[i] is NEVER undefined for any valid player index.
 *
 * Real path content should be injected via injectJourneyPaths()
 * or by passing pre-built journeys from the gameplay page.
 */
export function createSessionState(
    players: Player[],
    journeys: PlayerJourneyState[],
    sessionLength: import("@/types/session").SessionLength = "normal",
): PersistentSessionState {
    const stationsPerPath = STATIONS_BY_LENGTH[sessionLength];

    // GUARANTEE: Every player has a journey entry — never undefined
    const safeJourneys = players.map((player, i) =>
        journeys[i] ?? createEmptyJourney(player.id),
    );

    return {
        players,
        journeys: safeJourneys,
        currentPlayerIndex: 0,
        sessionLength,
        stationsPerPath,
        globalTurnIndex: 0,
        isComplete: false,
        claimedLegendaryIds: [],
    };
}

/* ─── Path Selection ────────────────────────────────────── */

/**
 * Player selects a path to attempt.
 * Creates an ActivePathSession from the current journey state.
 * The path opens at the player's saved progression point.
 */
export function selectPath(
    state: SessionState,
    pathId: string,
): SessionState {
    const currentJourney = state.journeys[state.currentPlayerIndex];
    if (!currentJourney) return state; // Runtime safety: no journey exists

    const path = currentJourney.paths.find((p) => p.id === pathId);
    if (!path || path.completed) return state;

    const station = getNextStation(path);
    if (!station) return state; // Runtime safety: no available station

    const activePath: ActivePathSession = {
        pathId: path.id,
        playerId: currentJourney.playerId,
        currentStation: station,
        currentStationIndex: path.currentStationIndex,
        totalStations: path.stations.length,
        stationsClearedThisTurn: 0,
        starsEarnedThisTurn: 0,
        treasureProbabilityMultiplier: path.treasureProbabilityMultiplier,
    };

    return {
        ...state,
        activePath,
    };
}

/* ─── Path Progression ──────────────────────────────────── */

/**
 * Advances the active path after a correct answer.
 * Commits station completion to the journey state.
 * If the path is completed, checks if the player completed all 4 paths.
 */
export function advanceActivePath(
    state: SessionState,
    starsEarned: number,
): SessionState {
    if (!state.activePath) return state;

    const { pathId, playerId } = state.activePath;

    const updatedJourneys = state.journeys.map((journey) => {
        if (journey.playerId !== playerId) return journey;

        const updatedPaths = journey.paths.map((path) => {
            if (path.id !== pathId) return path;
            return advancePathProgression(path);
        });

        const allCompleted = updatedPaths.every((p) => p.completed);

        return {
            ...journey,
            paths: updatedPaths,
            allPathsCompleted: allCompleted,
        };
    });

    const currentJourney = updatedJourneys[state.currentPlayerIndex];
    if (!currentJourney) return state; // Runtime safety

    const isComplete = currentJourney.allPathsCompleted;

    const updatedPath = currentJourney.paths.find((p) => p.id === pathId);
    if (!updatedPath) return state; // Runtime safety: path must exist

    const nextStation = getNextStation(updatedPath);

    const updatedActivePath: ActivePathSession | null = nextStation
        ? {
            ...state.activePath,
            currentStation: nextStation,
            currentStationIndex: updatedPath.currentStationIndex,
            stationsClearedThisTurn: state.activePath.stationsClearedThisTurn + 1,
            starsEarnedThisTurn: state.activePath.starsEarnedThisTurn + starsEarned,
        }
        : null;

    return {
        ...state,
        journeys: updatedJourneys,
        activePath: updatedActivePath,
        isComplete,
    };
}

/* ─── Turn Advancement ───────────────────────────────────── */

/**
 * Advances the session to the next player's turn.
 * Clears the active path session and moves to the next player in round-robin.
 */
export function advanceTurn(
    state: SessionState,
    lastResult: RoundResult | null,
): SessionState {
    const playerCount = state.players.length;

    const updatedPlayers = state.players.map((p, i) =>
        i === state.currentPlayerIndex
            ? resolveTurnEnd(p, lastResult)
            : p,
    );

    const nextPlayerIndex = (state.currentPlayerIndex + 1) % playerCount;

    return {
        ...state,
        players: updatedPlayers,
        currentPlayerIndex: nextPlayerIndex,
        globalTurnIndex: state.globalTurnIndex + 1,
        activePath: null,
        activeTreasure: null,
    };
}

/* ─── Player & Turn Update ───────────────────────────────── */

/**
 * Applies the outcome of a station answer to the session state.
 * Captures the updated player and any resulting treasure opportunity.
 */
export function applyTurnOutcome(
    state: SessionState,
    outcome: import("./turn-engine").TurnOutcome,
): SessionState {
    const updatedPlayers = state.players.map((p, i) =>
        i === state.currentPlayerIndex ? outcome.updatedPlayer : p,
    );

    return {
        ...state,
        players: updatedPlayers,
        activeTreasure: outcome.treasureOpportunity
            ? { treasure: outcome.treasureOpportunity, ownerId: state.players[state.currentPlayerIndex].id }
            : null,
    };
}

/**
 * Applies an immutable player update to session state.
 */
export function applyPlayerUpdate(
    state: SessionState,
    playerIndex: number,
    updater: (p: Player) => Player,
): SessionState {
    return {
        ...state,
        players: state.players.map((p, i) =>
            i === playerIndex ? updater(p) : p,
        ),
    };
}

/* ─── Treasure Economy ───────────────────────────────────── */

/**
 * Applies a treasure opening to session state.
 * Deducts hidden star cost, records the opened treasure, tracks legendary claims.
 */
export function applyTreasureOpen(state: SessionState): SessionState {
    const active = state.activeTreasure;
    if (!active) return state;

    const { treasure, ownerId } = active;
    const playerIndex = state.players.findIndex((p) => p.id === ownerId);
    if (playerIndex === -1) return state;

    const player = state.players[playerIndex];
    const { updatedPlayer } = resolveTreasureOpen(player, treasure);

    const updatedPlayers = state.players.map((p, i) =>
        i === playerIndex ? updatedPlayer : p,
    );

    const claimedLegendaryIds =
        treasure.rarity === "legendary"
            ? [...state.claimedLegendaryIds, treasure.id]
            : state.claimedLegendaryIds;

    return {
        ...state,
        players: updatedPlayers,
        claimedLegendaryIds,
        activeTreasure: null,
    };
}

/**
 * Clears the active treasure opportunity from session state.
 */
export function clearActiveTreasure(state: SessionState): SessionState {
    return {
        ...state,
        activeTreasure: null,
    };
}

/* ─── Session-End Scoring ────────────────────────────────── */

/**
 * Computes final hidden point totals for all players.
 * Called ONLY when session.isComplete === true.
 * Results are fed into the ending ceremony — never shown during active gameplay.
 */
export function computeFinalScores(state: PersistentSessionState): PlayerFinalScore[] {
    const scored = state.players.map((player) => {
        const hiddenPoints = player.openedTreasures.reduce(
            (sum, t) => sum + t.hiddenPoints,
            0,
        );
        return { player, hiddenPoints };
    });

    const sorted = [...scored].sort((a, b) => b.hiddenPoints - a.hiddenPoints);

    return sorted.map((entry, index) => ({
        ...entry,
        rank: index + 1,
    }));
}

/* ─── Ending Ceremony ────────────────────────────────────── */

/**
 * Creates the initial ending ceremony state once a session completes.
 * Computes final scores and sets the starting phase to "intro".
 */
export function createEndingCeremonyState(
    state: PersistentSessionState,
): EndingCeremonyState {
    const finalScores = computeFinalScores(state);
    const winner = finalScores[0];

    return {
        phase: "intro",
        finalScores,
        winnerId: winner.player.id,
    };
}

/**
 * Advances the ending ceremony to the next phase.
 * Stops at "closing" — the final phase.
 */
export function advanceCeremonyPhase(
    ceremony: EndingCeremonyState,
): EndingCeremonyState {
    const currentIndex = CEREMONY_PHASE_ORDER.indexOf(ceremony.phase);
    const nextIndex = Math.min(
        currentIndex + 1,
        CEREMONY_PHASE_ORDER.length - 1,
    );

    return {
        ...ceremony,
        phase: CEREMONY_PHASE_ORDER[nextIndex],
    };
}

/* ─── Utility ────────────────────────────────────────────── */

/**
 * Returns a human-readable path progress label.
 * Example: "المسار 2 من 4"
 */
export function getSessionProgressLabel(state: PersistentSessionState): string {
    const journey = state.journeys[state.currentPlayerIndex];
    if (!journey) return "";
    const completed = journey.paths.filter((p) => p.completed).length;
    return `${completed} من ${PATHS_PER_PLAYER} مسارات`;
}

/**
 * Returns total remaining stations across all uncompleted paths for all players.
 */
export function getRemainingStations(state: PersistentSessionState): number {
    return state.journeys.reduce((total, journey) => {
        if (!journey) return total; // Runtime safety
        return total + journey.paths.reduce((pathTotal, path) => {
            if (path.completed) return pathTotal;
            return pathTotal + (path.stations.length - path.currentStationIndex);
        }, 0);
    }, 0);
}

/* ─── Serialization Boundary ─────────────────────────────── */

/**
 * Extracts the persistent (serializable) portion of session state.
 *
 * USE CASES:
 *   - JSON.stringify for localStorage/IndexedDB
 *   - WebSocket broadcast for multiplayer
 *   - Session restore after page reload
 *   - Future Zustand store hydration
 *
 * GUARANTEE:
 *   The returned object contains ONLY gameplay truth.
 *   No runtime-only state (activePath, activeTreasure) is included.
 *   Round-trip safe: JSON.parse(extractPersistentState(state)) is valid.
 */
export function extractPersistentState(state: SessionState): PersistentSessionState {
    return {
        players: state.players,
        journeys: state.journeys,
        currentPlayerIndex: state.currentPlayerIndex,
        sessionLength: state.sessionLength,
        stationsPerPath: state.stationsPerPath,
        globalTurnIndex: state.globalTurnIndex,
        isComplete: state.isComplete,
        claimedLegendaryIds: state.claimedLegendaryIds,
    };
}

/**
 * Reconstructs a full SessionState from persisted data.
 *
 * Runtime-only fields (activePath, activeTreasure) are set to null.
 * The player must re-select a path after restore.
 *
 * FUTURE ZUSTAND:
 *   This is the hydration function for the Zustand store.
 */
export function hydrateSessionState(persistent: PersistentSessionState): SessionState {
    return {
        ...persistent,
        activePath: null,
        activeTreasure: null,
    };
}

/* ─── Ending Runtime Handoff ─────────────────────────────── */

/**
 * Determines whether the session should transition to the ending ceremony.
 *
 * COMPLETION RULE:
 *   The session ends ONLY when a player completes ALL 4 paths.
 *
 * OWNERSHIP:
 *   - session-engine determines: isComplete, winner, ceremony payload
 *   - page/router handles: navigation to /ending (when finalized)
 *
 * Accepts both SessionState and PersistentSessionState.
 */
export function shouldTriggerEnding(state: PersistentSessionState): boolean {
    return state.isComplete;
}

/**
 * Creates the ending ceremony payload for handoff to the ending page.
 *
 * The ending page (when finalized) will receive this payload
 * and render the cinematic ceremony phases.
 *
 * This function is the CLEAN HANDOFF POINT between:
 *   - Active gameplay runtime (play/page.tsx)
 *   - Ending ceremony runtime (ending/page.tsx — not yet built)
 *
 * Accepts both SessionState and PersistentSessionState.
 */
export function createEndingPayload(state: PersistentSessionState): {
    ceremony: EndingCeremonyState;
    finalScores: PlayerFinalScore[];
    winnerId: string;
} {
    const finalScores = computeFinalScores(state);
    const ceremony = createEndingCeremonyState(state);
    return {
        ceremony,
        finalScores,
        winnerId: ceremony.winnerId,
    };
}


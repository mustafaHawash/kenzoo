# Session Runtime Architecture

## Session Creation Flow

```
landing → session/setup → createSession() → gameplay → play → ending
```

### createSession() — THE SINGLE RUNTIME ENTRY POINT

**Input**: `CreateSessionInput` (players, sessionLength, themeId, sessionSeed?)
**Output**: `PersistentSessionState` ONLY (no runtime fields)

```
createSession(input)
    ├── validateSessionInput(input) → { isValid, errors }
    ├── createIdGenerator(seed) → stable IDs
    ├── Player initialization → clean economy
    ├── composeAllJourneys() → real theme content
    └── createSessionState() → PersistentSessionState
```

**To get full runtime state**: `hydrateSessionState(createSession(input))`

## State Boundaries

### PersistentSessionState (Gameplay Truth)

**What**: Irrevocable gameplay outcome data.
**Lives in**: `PersistentSessionState` (future: Zustand store)
**Survives**: Page navigation, tab switches, persistence, session restore

| Field | Type | Why it persists |
|-------|------|----------------|
| `players` | `Player[]` | Player economy (stars, treasures, titles) is irrevocable |
| `journeys` | `PlayerJourneyState[]` | Path progression is permanent per session |
| `currentPlayerIndex` | `number` | Whose turn it is — must survive reload |
| `sessionLength` | `SessionLength` | Session configuration — immutable after setup |
| `stationsPerPath` | `number` | Derived from sessionLength — immutable |
| `globalTurnIndex` | `number` | Turn counter — monotonically increasing |
| `isComplete` | `boolean` | Session completion — irrevocable once true |
| `claimedLegendaryIds` | `string[]` | Legendary claim history — prevents duplicates |

**Serialization**: All fields are JSON-serializable. No functions, no Symbols, no DOM refs.

### RuntimeSessionState (Current Interaction Context)

**What**: Ephemeral state for the current interaction moment.
**Lives in**: React component state (`useGameSession` hook)
**Does NOT survive**: Page navigation, reload, or turn end

| Field | Type | Why it is runtime-only |
|-------|------|----------------------|
| `activePath` | `ActivePathSession \| null` | Which path is being played RIGHT NOW |
| `activeTreasure` | `{ treasure, ownerId } \| null` | Pending treasure UI event |

**Boundary rule**: If removing this state would NOT change the final game outcome, it belongs here.

### Hook-Local State (useGameSession only)

| Field | Type | Why it is hook-local |
|-------|------|---------------------|
| `gameplayPhase` | `GameplayPhase` | Current UI phase |
| `lastResult` | `RoundResult \| null` | Most recent answer outcome |
| `awardedTitle` | `string \| null` | Treasure title reward |

### Component-Local State (Never leaves component)

| Field | Component | Why it is local |
|-------|-----------|----------------|
| `selectedChoice` | `ActiveStationSurface` | UI interaction only |
| `textInput` | `ActiveStationSurface` | UI interaction only |
| `canSubmit` | `ActiveStationSurface` | Derived from local state |

## Session Lifecycle

```
idle → generating → active → ending → completed
```

| State | Meaning | Who sets it |
|-------|---------|-------------|
| `idle` | No session exists | `sessionStore.clear()` |
| `generating` | Session being created | `startSessionGeneration()` |
| `active` | Gameplay in progress | `sessionStore.setPersistent()` |
| `ending` | Completion detected | `useGameSession` hook |
| `completed` | Ceremony done | `useGameSession` hook |

This is NOT UI phase state. It tracks session-level lifecycle ownership.

## Session Store (Immutable-Safe)

**Guarantee**: No consumer ever receives a direct mutable reference.

| Method | Returns | Safety |
|--------|---------|--------|
| `setPersistent(state)` | void | Deep clones input before storage |
| `getPersistent()` | `PersistentSessionState \| null` | Always returns deep clone |
| `getHydrated()` | `SessionState \| null` | Hydrates + deep clones |
| `updatePersistent(fn)` | void | Receives clone, result deep cloned |
| `getLifecycle()` | `SessionLifecycleState` | Primitive — no clone needed |
| `clear()` | void | Resets to idle |

## Hydration Flow

```
createSession() → PersistentSessionState
                        ↓
            hydrateSessionState() → SessionState (with runtime defaults)
                        ↓
            selectPath() → SessionState (with activePath set)
                        ↓
            useGameSession hook → Full runtime state
```

## Validation

`validateSessionInput(input)` checks:
- Player count (1-6)
- Empty/duplicate names
- Valid session length
- Valid theme selection
- Content pool sufficiency (soft check)

Called by `startSessionGeneration()` before `createSession()`.

## Future Zustand Architecture

```
┌─────────────────────────────────────┐
│  Zustand Store                      │
│                                     │
│  Contains: PersistentSessionState   │
│  Methods: Same as sessionStore      │
│                                     │
│  Does NOT contain:                  │
│    - GameplayPhase                  │
│    - ActivePathSession              │
│    - Active treasure opportunity    │
│    - Animation/reveal timing        │
│    - Local component state          │
└─────────────────────────────────────┘
         │
         ↓
┌─────────────────────────────────────┐
│  useGameSession Hook                │
│                                     │
│  Reads: Zustand store (persistent)  │
│  Owns: Runtime-only state (local)   │
│  Provides: Combined interface       │
└─────────────────────────────────────┘
```

## Serialization Contract

- `extractPersistentState(state)` → `PersistentSessionState` (safe to serialize)
- `hydrateSessionState(persistent)` → `SessionState` (runtime fields = null)
- Round-trip safe: `hydrateSessionState(JSON.parse(JSON.stringify(extractPersistentState(state))))`

## Gameplay Flow Authority

**session-engine OWNS gameplay decisions.**
**useGameSession OWNS React state sync.**

| Decision | Owner | Function |
|----------|-------|----------|
| Continue from result | session-engine | `resolveContinueFromResult()` |
| Dismiss treasure | session-engine | `resolveDismissTreasure()` |
| Transition to next turn | session-engine | `resolveTransition()` |
| Session creation | session-engine | `createSession()` |
| Session validation | session-engine | `validateSessionInput()` |
| Session lifecycle | sessionStore | `setLifecycle()` / `getLifecycle()` |
| Reveal timing | useGameSession | `setTimeout` |
| Phase sync | useGameSession | `setGameplayPhase()` |
| State sync | useGameSession | `setSessionState()` |
| Navigation | useGameSession | `router.push()` |
| UI rendering | Components | Pure renderers |

### useGameSession — React Adapter Pattern

```
useGameSession does:
  1. Read session from store (hydrate)
  2. Call session-engine resolveX() functions
  3. Sync decision.nextPhase → setGameplayPhase()
  4. Sync decision.updatedState → setSessionState()
  5. Sync decision.ceremony → setCeremony()
  6. Coordinate timers (reveal delay)
  7. Handle navigation (router)

useGameSession does NOT:
  - Decide gameplay progression
  - Own treasure progression rules
  - Own ending decisions
  - Contain gameplay business logic
```

## Runtime Ownership

| Decision | Owner |
|----------|-------|
| Session creation | `createSession()` |
| Session validation | `validateSessionInput()` |
| Session lifecycle | `sessionStore` + `generation-orchestration` |
| Gameplay flow decisions | `session-engine` (resolveX functions) |
| Phase transitions | `useGameSession` (syncs engine decisions) |
| Reveal timing | `useGameSession` (cinematic delay only) |
| Progression commit | `session-engine` (pure functions) |
| Treasure timing | `session-engine` (flow decision) |
| Player economy | `session-engine` (pure functions) |
| Path advancement | `session-engine` (pure functions) |
| UI rendering | Components (pure renderers) |

## Dev Preview Policy

`mock-session.ts` provides `createDevSession()` for quick dev testing.
It is NOT part of the production runtime flow.
Real sessions always go through: session/setup → createSession() → gameplay.
Runtime pages redirect to /session/setup when no session exists.

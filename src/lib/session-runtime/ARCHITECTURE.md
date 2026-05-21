# Session Runtime Architecture

## State Boundaries

### Persistent State (Gameplay Truth)

**What**: Data that represents the irrevocable outcome of gameplay.
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

### Runtime-Only State (Current Interaction Context)

**What**: Ephemeral state for the current interaction moment.
**Lives in**: React component state (`useGameSession` hook)
**Does NOT survive**: Page navigation, reload, or turn end

| Field | Type | Why it's runtime-only |
|-------|------|----------------------|
| `activePath` | `ActivePathSession \| null` | Which path is being played RIGHT NOW |
| `activeTreasure` | `{ treasure, ownerId } \| null` | Pending treasure UI event |
| `gameplayPhase` | `GameplayPhase` | Current UI phase (question/reveal/result/etc.) |
| `lastResult` | `RoundResult \| null` | Most recent answer outcome (for rendering) |
| `awardedTitle` | `string \| null` | Title from treasure (for rendering) |

**Boundary rule**: If removing this state would NOT change the final game outcome, it belongs here.

### Component-Local State (Never leaves component)

| Field | Component | Why it's local |
|-------|-----------|----------------|
| `selectedChoice` | `ActiveStationSurface` | UI interaction only |
| `textInput` | `ActiveStationSurface` | UI interaction only |
| `canSubmit` | `ActiveStationSurface` | Derived from local state |

## Future Zustand Architecture

```
┌─────────────────────────────────────┐
│  Zustand Store                      │
│                                     │
│  Contains: PersistentSessionState   │
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

## Runtime Ownership

| Decision | Owner |
|----------|-------|
| Phase transitions | `useGameSession` hook |
| Reveal timing | `useGameSession` hook |
| Progression commit | `session-engine` (called by hook) |
| Treasure timing | `useGameSession` hook |
| Player economy | `session-engine` (pure functions) |
| Path advancement | `session-engine` (pure functions) |
| UI rendering | Components (pure renderers) |

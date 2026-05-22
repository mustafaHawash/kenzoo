# Session Runtime Architecture

## Debug Documentation – Gameplay & Treasure Lifecycle Guarantees

The following checklist records the **deterministic order of state changes** and **phase transitions** that the runtime now guarantees. Use it when extending or debugging gameplay logic.

### 1️⃣ Station Progression

1. `handleSubmit` validates phase and guard flags.
2. Resolve turn via `resolveTurn` (pure).
3. **Synchronous commit** – `commitTurnOutcome` wrapped in `flushSync` updates persistent state (station index, stars, treasure flag) and clears `runtimeState.activePathId` if the path completed.
4. Set `gameplayPhase` to `"reveal"`.
5. Cinematic timer (`revealTimerRef`) fires → if component still mounted, set phase to `"result"` and reset submit guard.
6. `handleContinueFromResult` calls `continueFromResult` → resolves next phase and applies any additional state updates synchronously.

**Guarantees**: No stale station flash, index advances exactly once, UI rerenders instantly.

### 2️⃣ Path Completion

_Detected inside `applyTurnOutcome` when the station index reaches `stationsPerPath`._

1. Path marked `completed = true` in persistent state.
2. `commitTurnOutcome` clears `runtimeState.activePathId` (synchronously).
3. UI immediately reflects completed path; player is returned to the gameplay page via `handleTransition` (router replace then `transitionToNextTurn`).

**Guarantees**: Immediate return to gameplay, correct visual update, other paths stay selectable.

### 3️⃣ Live Progress Rendering

All selectors (`getCurrentStation`, `getCurrentPath`, `getSessionProgressLabel`) read directly from the **persistentState** that is updated synchronously, so React receives the latest values on the next paint. Refreshing the page re‑hydrates the same persistent state, reproducing exact progress.

### 4️⃣ Treasure Lifecycle

1. After a correct answer, if a treasure opportunity exists, `runtimeState.activeTreasureId` is set.
2. Phase changes to `"treasure"`; overlay renders using the derived `activeTreasure` selector.
3. **Open treasure** – `handleOpenTreasure` validates phase and ID, resolves full treasure, calls `openTreasure()`, and may award a title.
4. **Dismiss treasure** – `handleDismissTreasure` validates phase, clears `activeTreasureId`, and moves to `"transition"`.
5. `handleTransition` navigates back to `/gameplay` **before** calling `transitionToNextTurn()` to avoid race conditions.

**Guarantees**: Overlay always appears with correct content, opening/dismissing works deterministically, gameplay resumes without frozen phases.

### 5️⃣ Removal of Remaining setTimeout Races

- All timers (`revealTimerRef`, treasure reveal timers, generation timers) clear their refs on component unmount.
- Each timer callback checks `isMountedRef.current` before mutating state.
- Timers are only used for cinematic delays **after** the synchronous store commit, eliminating stale UI possibilities.

---

Developers adding new phases or UI interactions should reference this documentation to ensure any state mutation occurs **synchronously** (using `flushSync` when necessary) before scheduling timers.

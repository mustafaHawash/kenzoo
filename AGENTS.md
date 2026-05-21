<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

# KENZOO — AGENTS.md

## Project Identity

Kenzoo is a:

- cozy
- magical
- warm
- cinematic
- emotionally safe
- social
- mobile-first
- turn-based
- session-based

game experience.

The game should feel:

- calm
- breathable
- tactile
- handcrafted
- soft
- immersive
- mysterious but comforting

The experience is inspired by:

- magical books
- lantern light
- parchment surfaces
- shared couch gameplay
- cozy storytelling
- warm social interactions

This is NOT:

- a dashboard
- a SaaS app
- a hyper-competitive game
- a neon cyberpunk interface
- a noisy mobile app

---

# Core Product Philosophy

Kenzoo is NOT:

- a trivia app
- a linear sequence of questions
- a competitive quiz game

Kenzoo IS:

- a shared social session
- a cozy magical journey
- a curiosity-driven group experience

Questions are only:
interaction triggers.

The real experience includes:

- player turns
- station discovery
- reveals
- tiny missions
- treasure opportunities
- emotional pacing
- social moments
- session progression
- magical endings

Every interaction should feel:

- intentional
- warm
- atmospheric
- emotionally rewarding

---

# Session Structure

A Session is:
the full gameplay experience from session setup until session ending.

A Session contains:

- players
- paths (4 per player)
- stations (inside paths)
- stars
- treasures
- turns
- path progression
- rewards
- titles
- atmosphere

Gameplay Flow:

Start
↓
Session Setup (players, length, theme)
↓
Session Generation (creates 4 paths per player)
↓
Player Turn Begins
↓
Player Chooses ONE of Their 4 Paths
↓
Path Opens at Current Saved Progression
↓
Player Attempts Stations Sequentially Inside Path
↓
Correct Answer: Gain Stars + Possible Treasure + Continue Deeper in Path
↓
Wrong Answer: Path Pauses + Progression Saved + Turn Ends
↓
Next Player Turn (round-robin)
↓
Return to Player Journey Board
↓
First Player to Complete ALL 4 Paths Triggers Session Ending
↓
Ending Ceremony (treasures, titles, rankings)
↓
New Session

IMPORTANT PATH RULES:
- Path progression is PERSISTENT between turns
- If a player fails at station 2/4, next turn they continue from station 3/4
- A player may clear MULTIPLE stations in ONE turn if they keep answering correctly
- Players choose ANY path every turn — they are NOT locked into one path
- Each path contains N stations where N = selected session length
- Wrong answer immediately pauses the path and ends the turn

The game should feel:

- exploratory
- magical
- social
- cozy
- curiosity-driven

NOT:

- a question list
- a fixed questionnaire
- a competitive trivia loop

---

# Session Generation Philosophy

Sessions are shared group experiences.

The game does NOT generate isolated gameplay flows for each player.

Instead:

- all players participate in the same session
- the same theme
- the same atmosphere
- the same treasure pool
- the same overall progression

However:
stations may be lightly personalized based on:

- age group
- difficulty preference
- session progression
- player context

The goal is:
shared social cohesion with light personalization.

Avoid:

- isolated player experiences
- fully separated question pools
- fragmented gameplay flows

The experience should always feel like:
friends sharing the same magical night together.

---

# New Gameplay Philosophy

Players choose ONLY:

- name
- avatar/icon
- adult or child
- session length

The GAME internally controls:

- hidden station difficulty
- hidden treasure probability
- hidden reward balancing
- pacing

Difficulty becomes:
an invisible gameplay pacing system.

NOT:
a visible optimization system.

---

# Session Length Philosophy

Session length determines the number of stations per path.

Session length options:

- قصيرة 🌙 = 3 stations per path
- ليلة عادية ✨ = 4 stations per path
- سهرة طويلة 🔥 = 5 stations per path

Each player always has 4 paths.
Session length controls how deep each path goes.

Example: "ليلة عادية" → 4 paths × 4 stations = 16 total stations per player.

---

# Player Journey Board Philosophy

The Player Journey Board is:

- the magical session hub
- the current player interaction board
- the social gameplay surface

It is NOT:

- a station list
- a dashboard
- a progression spreadsheet

During a player's turn, the gameplay flow is:

1. Player chooses ANY mysterious path
2. Current station in that path opens
3. Gameplay interaction begins
4. Outcome:
   - Correct answer: advance to next station in same path
   - Wrong answer: current station disappears/skips, turn immediately ends
5. Possible treasure opportunity
6. Next player turn
7. Return to Player Journey Board

---

# Path Philosophy

Paths are:
mysterious emotional journeys.

Paths are NOT:
explicit difficulty tiers.

DO NOT create:

- Easy
- Medium
- Hard
- Expert

Instead, paths should feel atmospheric and magical.
Examples:

- 🌙 حكايات القمر
- 🔮 الغرفة المقفولة
- 🕯️ أسرار الليلة
- 👁️ باب المجهول

Internally, paths may contain:

- hidden difficulty curves
- hidden treasure potential
- different emotional pacing

BUT players NEVER see:

- percentages
- rarity rates
- difficulty labels
- optimization information

---

# Path Structure

Each player receives:
4 mysterious paths.

Each path contains:
number of stations equal to session length.

Example:
"ليلة عادية" session → each path contains 4 sequential stations.

Stations inside a path remain sequential.
Players may choose ANY path every turn.
Players are NOT locked into one path.

Path progression is PERSISTENT:
- If a player answers correctly, they advance to the next station in that path
- If a player answers incorrectly, the path PAUSES and their turn ends
- Next turn, the player can return to the same path and continue from where they paused
- Progression is saved per-path — failing one path does not affect other paths

Session end condition:
The FIRST player to complete ALL 4 paths triggers the session ending.
The ending ceremony then begins for all players.

Higher difficulty stations:
- reward more stars
- have higher treasure probability
- BUT difficulty is HIDDEN from players

---

# Gameplay Board Responsibilities

The Player Journey Board (gameplay/page.tsx) should eventually support:

- current player spotlight
- path selection
- subtle progression visualization
- atmosphere continuity
- session pacing
- social anticipation

Avoid:

- spreadsheet UI
- visible economy systems
- visible optimization systems
- cluttered information density

---

# Treasure Philosophy

Treasures are:

- rare magical moments
- meta progression rewards
- emotional discoveries
- mystery capsules of wonder

Treasures are NOT:

- normal stations
- score generators
- extra question cards
- visible loot systems
- spreadsheet optimization targets

Gameplay economy philosophy:

Normal Stations:

- generate stars
- generate treasure opportunities
- drive gameplay progression

Treasure Stations / Treasure Events:

- appear ONLY when player has >= 7 stars (the maximum possible hidden cost)
- look completely identical before opening — ALL rarities feel equally mysterious
- consume hidden stars upon opening (cost is unknown until revealed)
- provide magical rewards and emotional moments
- remain paced and special — avoid treasure spam or constant interruptions

Treasure reward balance:

- ~70% emotional / atmospheric rewards (wisdom, secret, atmosphere, message)
- ~30% gameplay modifiers (bonus stars, double-stars, bonus turn, title)

Treasure rewards MAY include:

- bonus stars
- double stars next turn
- bonus turn
- special titles
- hidden messages
- magical notes
- atmosphere unlocks
- rare discoveries
- session memories

However:
treasure rewards should NEVER create infinite progression inflation.
Even common treasures should feel emotionally rewarding and magical.

Treasure rewards should feel:

- collectible
- emotional
- atmospheric
- memorable
- magical
- surprising

NOT:

- predictable loot
- loot grinding
- farming systems
- casino-like rewards
- snowball economy

Treasure pacing philosophy:
Treasures should remain special, uncommon moments.
Treasure appearance may scale with session progression, hidden path difficulty, and hidden balancing.
Avoid repetitive treasure interruptions that make them feel routine.

---

# Treasure Rarity System

Treasure progression is rarity-based.

Treasure rarities:

- common
- rare
- legendary

**HIDDEN RARITY RULE:**
Rarity is COMPLETELY HIDDEN during gameplay.
Treasure rewards/effects are revealed immediately upon opening, BUT:
- rarity
- hidden points
- hidden scoring value
remain hidden until the Final Ending Ceremony.
DO NOT show: rarity labels, rarity colors, different aura styles, different wording, or any visual hint of rarity during the session.

**HIDDEN STAR COSTS (consumed upon opening):**

- common: costs 3 stars (hidden until reveal)
- rare: costs 5 stars (hidden until reveal)
- legendary: costs 7 stars (hidden until reveal)

The player never knows the cost before opening.
Opening a treasure feels like an act of curiosity and trust.

**HIDDEN TREASURE POINT VALUES (never shown during gameplay):**

- common = 3 hidden points
- rare = 5 hidden points
- legendary = 7 hidden points

Hidden points are accumulated silently.
They are ONLY revealed at the session-end ceremony.

**HIDDEN SCORING (SESSION-END REVEAL ONLY):**
Hidden treasure points are final scoring weights — NOT instant victory triggers.
The session runs for a fixed number of rounds (default: 4).
All players complete all rounds. The session NEVER ends early.
Hidden point totals are revealed ONLY during the ending ceremony.
The player with the most hidden points at session end wins.
Players do NOT know their point total or ranking during gameplay.

**HIDDEN WEIGHTED GENERATION:**
Treasure rarity is determined by hidden weighted rolls.
Default weights: common ~60%, rare ~28%, legendary ~12%.
The game internally controls these weights for pacing (difficulty is an invisible system).
7 stars does NOT guarantee legendary — it guarantees the player can afford any treasure they encounter.

Legendary treasures are unique:

- once a legendary treasure is claimed it never appears again in the same session
- this makes every legendary discovery feel special and irreplaceable
- the pickTreasureByRarity function accepts claimedLegendaryIds to exclude them

Treasure rarity should feel:

- mysterious before opening
- emotionally exciting after revealing
- cinematic and magical

NOT:

- visible rarity grinding
- RPG farming
- aggressive loot systems
- hyper-competitive score tracking

---

# Reward & Economy Philosophy

Normal stations reward:

- stars
- treasure opportunities
- emotional reveals

Internal pacing affects:

- stars rewarded
- treasure rarity potential
- treasure quality
- gameplay complexity

Hidden star costs by rarity (consumed on opening, unknown to player beforehand):

- common treasures cost 3 stars
- rare treasures cost 5 stars
- legendary treasures cost 7 stars

Hidden point values (accumulated silently, revealed at session end):

- common = 3 points
- rare = 5 points
- legendary = 7 points

Hidden points are final scoring weights.
Revealed ONLY at the session-end ceremony.
The player with the most hidden points after all rounds wins.

Visible player information during session:

- opened treasure count (shown as "🗝️ N")
- current player turn (shown)
- temporary cinematic reward feedback (e.g. "✨ +2 نجوم" which fades quickly)

Players should NOT see persistent stars HUD.
Hidden star totals remain internal to runtime systems.

Hidden from player during session:

- rarity of opened treasures
- hidden point total
- persistent star count
- proximity to win
- star cost of upcoming treasure

Example balancing philosophy:

Normal:

- more common rewards
- lower legendary potential

Medium:

- balanced progression
- mixed treasure potential

Hard:

- higher legendary potential
- stronger rewards

Legend:

- significantly elevated rare/legendary chance
- most emotionally intense treasure moments

The system should encourage:

- emotional curiosity
- playful risk taking
- social interaction
- mystery-first thinking

NOT:

- optimization grinding
- spreadsheet min-maxing
- anti-fun numeric obsession

---

# Session Ending Philosophy

Sessions end when the FIRST player completes ALL 4 paths.

This is the official session end condition.
There are NO round-based endings.
There is NO fixed turn count.

The session does NOT end based on:
- hidden treasure points
- fixed round counts
- treasure totals
- time limits

Hidden treasure points are:
FINAL SCORING WEIGHTS — not instant victory triggers.

The winner is revealed ONLY during the ending ceremony,
based on hidden treasure point totals.

Players should NEVER know during gameplay:

- their exact hidden treasure points
- their ranking
- how close they are to winning
- how close another player is to completing all paths

The ending ceremony should feel:

- cinematic
- warm
- magical
- celebratory
- emotionally satisfying
- socially memorable

NOT:

- hyper competitive
- esports-like
- scoreboard-heavy
- number-obsessed

---

# Path-Based Session Structure

Sessions are path-based, NOT round-based.

Each player has 4 paths.
Each path contains N stations (N = session length).
Players take turns in round-robin order.

Turn structure:

- Current player chooses a path
- Player attempts stations sequentially in that path
- Correct answer: advance to next station, continue turn
- Wrong answer: path pauses, turn ends
- Next player takes their turn

Session completion:

- The FIRST player to complete ALL 4 paths triggers the ending
- All players experience the ending ceremony together
- The winner is determined by hidden treasure points (NOT path completion order)

Path completion tracking:

- Each path tracks: currentStationIndex, completed status
- Per-player journey state: paths[] with individual progression
- Session completion: check if any player has all 4 paths completed

This is orchestrated by:
`session-engine.ts` → path progression functions

---

# Ending Ceremony Architecture

The ending is a phase-driven orchestration system.

Phase order:

1. **intro**
   "الليلة قربت تخلص..."

2. **session-summary**
   Total treasures discovered.
   Rarity distribution revealed.
   Example: "اكتشفتم 12 كنز — 2 أسطوري، 3 نادر، 7 عادي"

3. **titles-reveal**
   Earned titles revealed one by one.
   Examples: حارس الأسرار، روح الجلسة، مكتشف الكنوز

4. **player-reveals**
   Each player gets a cinematic spotlight moment.
   Revealed:
   - discovered treasures
   - treasure rarities (FIRST TIME player sees thier true rarity)
   - hidden points per treasure
   - titles earned
   - memorable highlights

5. **ranking-reveal**
   Rankings revealed progressively.
   Last place revealed first.
   Winner revealed last.

6. **winner-reveal**
   Final cinematic winner reveal.
   Maximum emotional impact.

7. **closing**
   Optional emotional session memory or highlight.

Implementation:

Ending ceremony state is managed by:
`EndingCeremonyState` in `session-engine.ts`

Phase advancement via:
`advanceCeremonyPhase()`

Final scores computed by:
`computeFinalScores()` — called ONLY when `session.isComplete === true`

IMPORTANT:
Do NOT build the final polished UI yet.
Architecture is established.
Rendering evolves incrementally.

---

# UI Philosophy

Every screen should feel like:

- a scene
- a magical object
- a focused interaction moment

NOT:

- admin layouts
- SaaS interfaces
- crowded dashboards
- aggressive mobile game UI

**TREASURE UI RULES:**
Before opening a treasure, the UI must be completely neutral and mysterious.
DO NOT show: rarity labels, star costs, point values, different chest icons per rarity, different colors per rarity, or any visual leak of rarity.
ALL treasure opportunities must look and feel identical before opening.
The discovery moment is AFTER opening — preserve that magic.

During gameplay, only show:
- temporary cinematic reward feedback (e.g. "✨ +2 نجوم")
- opened treasure count ("🗝️ N") — count only, never points or rarity
- player name and turn indicator

Prioritize:

- breathing room
- calm hierarchy
- centered layouts
- atmosphere
- tactile interaction
- emotional pacing
- mystery preservation

---

# Motion Philosophy

Motion must feel:

- subtle
- cinematic
- calm
- tactile
- soft

Avoid:

- aggressive spring motion
- hyperactive feedback
- excessive bounce
- flashy transitions
- noisy animation systems

Preferred motion:

- easeOut
- low distance movement
- gentle fade
- soft scale shifts
- atmospheric movement

Motion should support:

- mystery
- anticipation
- warmth
- reveal pacing
- treasure suspense (neutral shimmer and dots during the revealing phase)
- session-end ceremony (cinematic rarity reveal sequence)

**TREASURE MOTION RULES:**
Phase 1 (opportunity): uniform, calm float — no rarity-specific motion.
Phase 2 (revealing): neutral shimmer and pulse dots — same for all rarities.
Phase 3 (revealed): rarity-aware motion — common: gentle, rare: stronger, legendary: dramatic pulse and scale.
The emotional intensity escalates only AFTER rarity is disclosed.

---

# Design System Rules

The project uses:

- Next.js App Router
- TypeScript
- TailwindCSS v4
- Framer Motion
- Zustand
- shadcn/ui
- class-variance-authority

Architecture style:

- design-system-first
- primitive layer + branded layer
- reusable semantic components
- token-driven styling
- mobile-first

Always respect the existing design system.

Use:

- existing typography primitives
- existing CozyCard
- existing LanternButton
- existing tokens

Do NOT invent parallel systems unless explicitly requested.

---

# Typography Rules

Use the existing typography system and semantic components.

Avoid:

- random text utility styling
- replacing semantic typography layers
- ad-hoc font systems

Typography should feel:

- warm
- readable
- elegant
- soft

---

# Gameplay Architecture Rules

Gameplay UI must be:

- data-driven
- reusable
- scalable
- composable

Always separate:

- gameplay orchestration
- rendering
- content
- state
- progression

Visual components should NOT:

- manage session progression
- contain global gameplay logic
- control turn flow

Components should:

- receive props
- emit callbacks
- render interactions only

---

# Runtime Architecture

## Session Flow

```
landing → session/setup → createSession() → gameplay → play → ending
```

## createSession() — THE SINGLE RUNTIME ENTRY POINT

- Input: `CreateSessionInput` (players, sessionLength, themeId, sessionSeed?)
- Output: `PersistentSessionState` ONLY (no runtime fields)
- To get full runtime state: `hydrateSessionState(createSession(input))`
- Validation: `validateSessionInput(input)` — called before creation

## State Boundaries

### PersistentSessionState (Gameplay Truth)

Serializable, deterministic, future-Zustand-ready.
Survives: page navigation, tab switches, persistence, session restore.

Fields: players, journeys, currentPlayerIndex, sessionLength, stationsPerPath, globalTurnIndex, isComplete, claimedLegendaryIds

### RuntimeSessionState (Current Interaction Context)

Ephemeral, never persisted, never serialized.
Resets on: navigation, reload, turn end.

Fields: activePath, activeTreasure

### Hook-Local State (useGameSession only)

gameplayPhase, lastResult, awardedTitle

### Component-Local State (never leaves component)

selectedChoice, textInput, canSubmit

## Session Lifecycle

```
idle → generating → active → ending → completed
```

This is NOT UI phase state. It tracks session-level lifecycle ownership.

## Session Store (Immutable-Safe)

No consumer ever receives a direct mutable reference.
All get() calls return deep clones.
All set() calls deep clone before storage.

## Hydration Flow

```
createSession() → PersistentSessionState
                        ↓
            hydrateSessionState() → SessionState (runtime defaults)
                        ↓
            selectPath() → SessionState (activePath set)
                        ↓
            useGameSession hook → Full runtime state
```

## Validation

`validateSessionInput()` checks: player count, empty/duplicate names, session length, theme, content pool sufficiency.

## Gameplay Flow Authority

**session-engine OWNS gameplay decisions.**
**useGameSession OWNS React state sync only.**

session-engine provides `resolveX()` functions that return `GameplayFlowDecision`:
- `resolveContinueFromResult()` — what happens after seeing answer result
- `resolveDismissTreasure()` — what happens after closing treasure overlay
- `resolveTransition()` — what happens when moving to next turn

useGameSession is a thin React adapter:
1. Calls session-engine resolveX() functions
2. Syncs decision.nextPhase → setGameplayPhase()
3. Syncs decision.updatedState → setSessionState()
4. Syncs decision.ceremony → setCeremony()
5. Coordinates timers (reveal delay only)
6. Handles navigation (router.push)

useGameSession does NOT:
- Decide gameplay progression
- Own treasure progression rules
- Own ending decisions
- Contain gameplay business logic

## Runtime Ownership

| Decision | Owner |
|----------|-------|
| Session creation | `createSession()` |
| Session validation | `validateSessionInput()` |
| Session lifecycle | `sessionStore` + `generation-orchestration` |
| Gameplay flow decisions | `session-engine` (resolveX functions) |
| Phase sync | `useGameSession` (adapter only) |
| Reveal timing | `useGameSession` (cinematic delay only) |
| Progression commit | `session-engine` (pure functions) |
| Treasure flow | `session-engine` (flow decision) |
| Path advancement | `session-engine` (pure functions) |
| UI rendering | Components (pure renderers) |

## Dev Preview Policy

`mock-session.ts` provides `createDevSession()` for quick dev testing.
It is NOT part of the production runtime flow.
Real sessions always go through: session/setup → createSession() → gameplay.
Runtime pages redirect to /session/setup when no session exists.

## Themes Are Content-Only

Theme files (quiz.ts, riddles.ts, etc.) are pure content sources.
Runtime NEVER mutates content pools directly.
Composition layer (compose-journey.ts) deep-clones all stations.

---

# Rendering Philosophy

Gameplay rendering must use:

- renderer-based architecture
- modular gameplay renderers

Avoid:

- giant conditional rendering
- gameplay type explosion
- monolithic gameplay files

Future gameplay renderers may include:

- quiz renderer
- riddle renderer
- story renderer
- mystery renderer
- memory renderer
- treasure renderer
- mission renderer

Build scalability gradually.

Avoid premature abstraction.

---

# State Philosophy

Gameplay progression should be:

- centralized
- explicit
- phase-driven

Avoid:

- scattered progression logic
- duplicated side effects
- boolean-heavy state architecture

Prefer:

- gameplay phases
- centralized progression functions
- orchestrator-based flow

The gameplay flow should eventually support:

- session progression
- multiplayer turns
- treasure economy
- atmosphere progression
- session memories
- unlock systems

---

# Refactoring Philosophy

Avoid giant components.

When components grow:

- split by gameplay phase
- split by responsibility
- preserve composition

Prefer:

- small focused components
- orchestrator components
- modular gameplay systems
- reusable interaction surfaces

Avoid:

- duplicated gameplay logic
- giant files
- tightly coupled systems

---

# Content Philosophy

Content should feel:

- playful
- warm
- socially engaging
- emotionally safe
- naturally conversational
- slightly mysterious

Avoid:

- robotic quiz phrasing
- loud comedy
- meme-heavy writing
- cringe internet humor

The tone should feel like:
friends sharing a magical night together.

---

# Egyptian Arabic Tone

The game supports Egyptian Arabic.

Preferred tone:

- natural
- playful
- warm
- conversational
- emotionally light

Avoid:

- exaggerated slang
- TikTok meme tone
- childish phrasing
- overly sarcastic dialogue

---

# AI Agent Role

The AI agent is an implementation assistant.

The AI agent:

- helps implement architecture
- improves scalability
- refactors systems
- preserves design consistency
- preserves gameplay philosophy

The AI agent MUST NOT:

- redefine product identity
- redesign gameplay philosophy
- invent conflicting systems
- overengineer MVP architecture
- turn the game into a SaaS/dashboard experience

---

# Important Constraints

Avoid:

- over-polish too early
- premature optimization
- giant state systems too early
- enterprise patterns
- dashboard UI patterns
- overengineering

Prioritize:

- gameplay feel
- emotional pacing
- scalability
- maintainability
- composability
- atmosphere
- incremental evolution

---

# Final Guideline

Kenzoo should feel like:
a magical cozy social experience shared between friends.

Every implementation decision should support:

- warmth
- curiosity
- atmosphere
- emotional pacing
- social interaction
- magical discovery
- calm gameplay
- cinematic flow

<!-- END:nextjs-agent-rules -->

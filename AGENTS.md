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
- stations
- stars
- treasures
- turns
- progression
- rewards
- titles
- atmosphere

Gameplay Flow:

Start
↓
Session Setup
↓
Players
↓
Theme Selection
↓
Session Generation
↓
Current Player Chooses Station
↓
Active Station Gameplay
↓
Reveal
↓
Reward OR Tiny Mission
↓
Treasure Opportunity
↓
Next Player
↓
Return To Station Selection
↓
Loop Until A Player Wins
↓
Session Ending
↓
Titles, Rewards, Memories
↓
New Session

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

# Difficulty Philosophy

Difficulty is:

- flexible
- player-driven
- gameplay-affecting

Players may choose:

- one difficulty
  OR
- multiple difficulties together

Examples:

- 🌿 عادي
- 🔥 أصعب شوية
- 🧠 صعب جدًا
- 👑 ده انت جامد بقى

Players may combine difficulties:

- normal + medium
- medium + hard

Difficulty should affect:

- station complexity
- stars rewarded
- treasure quality
- treasure rarity potential
- mystery depth

Difficulty should NOT:

- make the game frustrating
- create unfair punishment
- feel like ranked competitive gameplay

The experience must remain:

- cozy
- social
- magical
- emotionally safe

---

# Stations Philosophy

Stations are:

- discoverable gameplay nodes
- interaction opportunities
- emotionally flavored moments

Stations are NOT:

- fixed linear steps
- plain question cards

A station may contain:

- quiz interactions
- riddles
- story moments
- memory interactions
- mystery gameplay
- tiny social challenges
- treasure opportunities

Players actively choose stations during the session.

The station board should eventually feel:

- magical
- mysterious
- atmospheric
- partially discoverable

NOT:

- a plain list UI
- a dashboard grid

---

# Station Availability Philosophy

Stations are dynamically available during sessions.

Players do NOT necessarily see all stations at once.

Station availability may depend on:

- current player
- age group
- difficulty
- progression
- treasures
- session state
- theme

The station board should eventually feel:

- exploratory
- magical
- partially mysterious
- progressively discoverable

Avoid:

- static question lists
- fully predictable station boards
- exposing all gameplay content immediately

Stations should feel like:
discoverable interaction opportunities.

---

# Treasure Philosophy

Treasures are:

- rare magical moments
- meta progression rewards
- emotional discoveries

Treasures are NOT:

- normal stations
- score generators
- extra question cards

Gameplay economy philosophy:

Normal Stations:

- generate stars
- generate treasure opportunities
- drive gameplay progression

Treasure Stations / Treasure Events:

- consume stars
- provide magical rewards
- create emotional moments

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

Treasure rewards should feel:

- collectible
- emotional
- atmospheric
- memorable
- magical

NOT:

- loot grinding
- farming systems
- casino-like rewards

---

# Treasure Rarity System

Treasure progression is rarity-based.

Treasure rarities:

- common
- rare
- legendary

Star cost by rarity:

- common: 3 stars
- rare: 5 stars
- legendary: 7 stars

Higher rarity costs more stars but delivers more powerful and memorable rewards.

Legendary treasures are unique:

- once a legendary treasure is claimed it never appears again in the same session
- this makes every legendary discovery feel special and irreplaceable
- the pickTreasureByRarity function accepts claimedLegendaryIds to exclude them

Winning conditions:

- 7 common treasures
  OR
- 5 rare treasures
  OR
- 3 legendary treasures

Treasure rarity should feel:

- magical
- mysterious
- emotionally exciting

NOT:

- RPG farming
- aggressive rarity systems
- hyper-competitive loot systems

---

# Reward & Economy Philosophy

Normal stations reward:

- stars
- treasure opportunities
- emotional reveals

Difficulty affects:

- stars rewarded
- treasure rarity potential
- treasure quality
- gameplay complexity

Rarity affects star cost:

- common treasures cost 3 stars
- rare treasures cost 5 stars
- legendary treasures cost 7 stars

Example balancing philosophy:

Easy:

- safer
- more common rewards
- lower treasure rarity potential

Medium:

- balanced progression
- mixed treasure potential

Hard:

- higher risk
- stronger rewards
- better legendary potential

The system should encourage:

- playful risk taking
- curiosity
- social interaction

NOT:

- optimization grinding
- hardcore min-maxing

---

# Session Ending Philosophy

The session ends when:
a player satisfies one of the treasure rarity victory conditions.

Victory Conditions:

- 3 legendary treasures
  OR
- 5 rare treasures
  OR
- 7 common treasures

The ending should feel:

- warm
- magical
- celebratory
- memorable

NOT:

- hyper competitive
- esports-like
- leaderboard focused

The ending reveal may include:

- player titles
- magical memories
- discovered treasures
- special moments
- emotional highlights

Examples:

- "روح الجلسة"
- "حارس الأسرار"
- "سيد الألغاز"
- "حكّاء الليلة"

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

Prioritize:

- breathing room
- calm hierarchy
- centered layouts
- atmosphere
- tactile interaction
- emotional pacing

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

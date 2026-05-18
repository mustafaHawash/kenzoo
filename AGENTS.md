<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

# KENZOO — AGENTS.md

## Project Identity

Kenzoo is a:

* cozy
* magical
* warm
* cinematic
* emotionally safe
* social
* mobile-first
* turn-based
* session-based
  game experience.

The game should feel:

* calm
* breathable
* tactile
* handcrafted
* soft
* immersive
* mysterious but comforting

The experience is inspired by:

* magical books
* lantern light
* parchment surfaces
* shared couch gameplay
* cozy storytelling
* warm social interactions

This is NOT:

* a dashboard
* a SaaS app
* a hyper-competitive game
* a neon cyberpunk interface
* a noisy mobile app

---

# Core Product Philosophy

Kenzoo focuses on:

* emotional pacing
* curiosity
* social interaction
* playful discovery
* shared-device gameplay

The game loop is:

Player Turn
↓
Station Interaction
↓
Reveal
↓
Reward or Tiny Mission
↓
Next Turn

Every interaction should feel intentional and emotionally rewarding.

---

# UI Philosophy

Every screen should feel like:

* a scene
* a magical object
* a focused interaction moment

NOT:

* card grids
* admin layouts
* tool interfaces
* crowded menus

Prioritize:

* breathing room
* calm hierarchy
* centered layouts
* focused interactions
* atmosphere

---

# Motion Philosophy

Motion must feel:

* subtle
* cinematic
* calm
* tactile
* soft

Avoid:

* aggressive spring motion
* bouncy UI
* over-animated interactions
* flashy transitions
* hyperactive feedback

Preferred motion:

* easeOut
* low distance movement
* gentle fade
* small scale shifts
* slow atmospheric movement

---

# Design System Rules

The project uses:

* Next.js App Router
* TypeScript
* TailwindCSS v4
* Framer Motion
* Zustand
* shadcn/ui
* class-variance-authority

Architecture style:

* design-system-first
* primitive layer + branded layer
* reusable semantic components
* token-driven styling
* mobile-first

Always respect the existing design system.

Use:

* existing typography primitives
* existing CozyCard
* existing LanternButton
* existing tokens

Do NOT invent parallel systems unless explicitly requested.

---

# Typography Rules

Use the existing typography components and variants.

Avoid:

* random text utility styling
* ad-hoc typography systems
* replacing the existing semantic typography layer

Typography should feel:

* readable
* warm
* soft
* elegant

---

# Gameplay Architecture Rules

Gameplay UI must be:

* data-driven
* reusable
* scalable
* separated from gameplay logic

Always separate:

* gameplay orchestration
* rendering
* content
* state

Visual components should NOT:

* contain business logic
* manage global progression
* control gameplay flow

Components should receive:

* data
* callbacks
* state

And only render interactions.

---

# Content Philosophy

Content should feel:

* playful
* socially engaging
* emotionally warm
* slightly mysterious
* culturally natural

Avoid:

* cringe internet humor
* overly meme-driven writing
* loud comedy
* robotic quiz phrasing

The tone should feel like:
friends playing together at night.

---

# Egyptian Arabic Tone

The game supports Egyptian Arabic.

Preferred tone:

* light
* natural
* conversational
* playful
* warm

Avoid:

* exaggerated slang
* TikTok-style meme writing
* overly sarcastic tone
* childish phrasing

---

# Gameplay Rules

Correct answers:

* reward stars
* may unlock treasure
* feel rewarding and magical

Wrong answers:

* should still feel warm
* trigger playful tiny missions
* never feel punishing

Failure should feel:

* funny
* social
* charming

NOT:

* harsh
* competitive
* frustrating

---

# Current Gameplay Architecture

Current gameplay phases:

* playing
* revealing
* result

Future planned phases:

* treasure reveal
* mission countdown
* next turn
* session summary

The gameplay flow is state-driven.

Avoid boolean-heavy state architecture.
Prefer explicit gameplay phase systems.

---

# Current Project Structure

The project currently contains:

* content schemas
* mock gameplay data
* gameplay surface components
* gameplay overview screens
* atmosphere systems
* reusable design system primitives

Content is separated from UI.

The project already has:

* Station schemas
* Session schemas
* Theme schemas
* Mock stations
* Typography system
* CozyCard
* LanternButton
* ScreenContainer
* AmbientBackground

Respect the existing architecture.

---

# Refactoring Philosophy

Avoid giant components.

When a component grows too large:

* split by gameplay phase
* split by responsibility
* preserve composability

Prefer:

* small focused components
* composition
* renderer-based gameplay architecture

Avoid:

* monolithic gameplay files
* duplicated UI logic
* tightly coupled systems

---

# AI Agent Role

The AI agent is an implementation assistant.

The AI agent:

* helps implement architecture
* refactors components
* improves scalability
* maintains design consistency
* preserves gameplay philosophy

The AI agent MUST NOT:

* redefine product identity
* redesign gameplay philosophy
* introduce conflicting UI systems
* overengineer early MVP architecture

---

# Important Constraints

Avoid:

* over-polish too early
* unnecessary abstraction
* dashboard patterns
* enterprise UI patterns
* giant state systems too early
* premature optimization

Prioritize:

* gameplay feel
* emotional pacing
* interaction quality
* scalable architecture
* maintainable systems
* incremental evolution

---

# Rendering Philosophy

Different gameplay types should eventually use:

* renderer-based architecture
* modular interaction systems

Do NOT hardcode all gameplay assumptions into one component.

Future gameplay renderers may include:

* quiz renderer
* story renderer
* treasure renderer
* memory renderer
* mission renderer

Build toward scalability gradually.

---

# Final Guideline

Kenzoo should feel like:
a magical cozy social experience between friends.

Every implementation decision should support:

* warmth
* curiosity
* calmness
* atmosphere
* emotional interaction
* focused gameplay

<!-- END:nextjs-agent-rules -->

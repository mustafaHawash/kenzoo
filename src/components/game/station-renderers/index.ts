
/**
 * Station Renderer Registry
 *
 * Maps each StationType to its dedicated renderer component.
 * This is the single source of truth for which renderer handles which type.
 *
 * To add a new gameplay type:
 *   1. Create a new renderer file in this folder
 *   2. Import it here
 *   3. Add it to the registry
 *
 * To evolve an existing type:
 *   1. Open its renderer file
 *   2. Modify only that file — no other files need to change
 *
 * The registry is consumed by StationInputArea,
 * which simply does: const Renderer = registry[station.type]
 */

import type { StationRendererRegistry } from "./renderer-types";

import { QuizRenderer } from "./quiz-renderer";
import { RiddleRenderer } from "./riddle-renderer";
import { GuessRenderer } from "./guess-renderer";
import { MemoryRenderer } from "./memory-renderer";
import { PuzzleRenderer } from "./puzzle-renderer";
import { TreasureRenderer } from "./treasure-renderer";
import { MysteryRenderer } from "./mystery-renderer";
import { StoryRenderer } from "./story-renderer";

export const stationRenderers: StationRendererRegistry = {
    quiz: QuizRenderer,
    riddle: RiddleRenderer,
    guess: GuessRenderer,
    memory: MemoryRenderer,
    puzzle: PuzzleRenderer,
    treasure: TreasureRenderer,
    mystery: MysteryRenderer,
    story: StoryRenderer,
};

// Re-export types
export type { StationRendererProps, StationRenderer } from "./renderer-types";

// Re-export individual renderers for direct use if needed
export { QuizRenderer } from "./quiz-renderer";
export { RiddleRenderer } from "./riddle-renderer";
export { GuessRenderer } from "./guess-renderer";
export { MemoryRenderer } from "./memory-renderer";
export { PuzzleRenderer } from "./puzzle-renderer";
export { TreasureRenderer } from "./treasure-renderer";
export { MysteryRenderer } from "./mystery-renderer";
export { StoryRenderer } from "./story-renderer";

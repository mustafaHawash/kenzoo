
"use client";

/**
 * Mystery renderer — choice-based gameplay (same pattern as quiz).
 *
 * Currently reuses QuizRenderer internally.
 * Isolated file prepares for future differentiation:
 *   - hidden clues
 *   - reveal animations
 *   - atmospheric effects
 */

import { QuizRenderer } from "./quiz-renderer";
import type { StationRendererProps } from "./renderer-types";

export function MysteryRenderer(props: StationRendererProps) {
    return <QuizRenderer {...props} />;
}

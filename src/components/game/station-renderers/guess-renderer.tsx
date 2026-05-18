
"use client";

/**
 * Guess renderer — choice-based gameplay (same pattern as quiz).
 *
 * Currently reuses QuizRenderer internally.
 * Isolated file prepares for future differentiation:
 *   - timed reveals
 *   - progressive hints
 *   - confidence indicators
 */

import { QuizRenderer } from "./quiz-renderer";
import type { StationRendererProps } from "./renderer-types";

export function GuessRenderer(props: StationRendererProps) {
    return <QuizRenderer {...props} />;
}

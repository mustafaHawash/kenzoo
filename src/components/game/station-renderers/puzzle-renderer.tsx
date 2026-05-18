
"use client";

/**
 * Puzzle renderer — text input gameplay (same pattern as riddle).
 *
 * Currently reuses RiddleRenderer internally.
 * Isolated file prepares for future differentiation:
 *   - drag-and-drop pieces
 *   - visual puzzle elements
 *   - step-by-step assembly
 */

import { RiddleRenderer } from "./riddle-renderer";
import type { StationRendererProps } from "./renderer-types";

export function PuzzleRenderer(props: StationRendererProps) {
    return <RiddleRenderer {...props} />;
}
